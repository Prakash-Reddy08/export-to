// export-to.js
import path from 'path';
import { fileURLToPath } from 'url';

function exportTo(exportedItem, allowedPaths) {
    const modulePath = new Error().stack.split('\n')[1].match(/\((.*):\d+:\d+\)/)[1];

    function createProxy(item) {
        if (typeof item === 'function') {
            return new Proxy(item, {
                apply(target, thisArg, argumentsList) {
                    checkAccess();
                    return Reflect.apply(target, thisArg, argumentsList);
                },
                get(target, prop, receiver) {
                    checkAccess();
                    return Reflect.get(target, prop, receiver);
                }
            });
        } else if (typeof item === 'object' && item !== null) {
            return new Proxy(item, {
                get(target, prop, receiver) {
                    checkAccess();
                    return Reflect.get(target, prop, receiver);
                }
            });
        } else {
            // For primitive types, we need to wrap them in an object
            return new Proxy({ value: item }, {
                get(target, prop, receiver) {
                    checkAccess();
                    if (prop === 'value') return item;
                    return Reflect.get(target, prop, receiver);
                }
            });
        }
    }

    function checkAccess() {
        const callerInfo = getCallerInfo(modulePath);
        if (!isAllowedPath(callerInfo.filePath, allowedPaths)) {
            throw new Error(`Access to this module is not allowed from ${callerInfo.filePath || 'unknown location'}`);
        }
    }

    return createProxy(exportedItem);
}

function getCallerInfo(modulePath) {
    const originalPrepareStackTrace = Error.prepareStackTrace;
    Error.prepareStackTrace = (_, stack) => stack;
    const stack = new Error().stack;
    Error.prepareStackTrace = originalPrepareStackTrace;

    const callerFrame = stack.find(frame => {
        const filename = frame.getFileName();
        return filename && filename !== modulePath && !filename.includes('internal/') && !filename.includes('node:');
    });

    if (!callerFrame) {
        return { filePath: null, lineNumber: null, columnNumber: null };
    }

    const filePath = callerFrame.getFileName();
    return {
        filePath: filePath ? fileURLToPath(filePath) : null
    };
}

function isAllowedPath(callerPath, allowedPaths) {
    if (!callerPath) return false;
    return allowedPaths.some(allowedPath => {
        const fullAllowedPath = path.resolve(process.cwd(), allowedPath);
        return callerPath.startsWith(fullAllowedPath);
    });
}

export { exportTo };