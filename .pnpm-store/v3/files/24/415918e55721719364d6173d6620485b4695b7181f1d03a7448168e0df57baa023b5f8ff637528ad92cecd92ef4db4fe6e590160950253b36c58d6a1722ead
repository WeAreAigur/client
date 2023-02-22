export function joinPath(arr) {
    return arr.reduce((acc, value) => {
        if (typeof value === 'number') {
            return acc + '[' + value + ']';
        }
        const separator = acc === '' ? '' : '.';
        return acc + separator + value;
    }, '');
}
