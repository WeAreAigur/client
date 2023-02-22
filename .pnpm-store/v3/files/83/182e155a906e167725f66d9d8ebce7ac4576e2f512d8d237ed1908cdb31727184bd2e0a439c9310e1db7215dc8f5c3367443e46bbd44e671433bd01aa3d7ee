"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinPath = void 0;
function joinPath(arr) {
    return arr.reduce((acc, value) => {
        if (typeof value === 'number') {
            return acc + '[' + value + ']';
        }
        const separator = acc === '' ? '' : '.';
        return acc + separator + value;
    }, '');
}
exports.joinPath = joinPath;
