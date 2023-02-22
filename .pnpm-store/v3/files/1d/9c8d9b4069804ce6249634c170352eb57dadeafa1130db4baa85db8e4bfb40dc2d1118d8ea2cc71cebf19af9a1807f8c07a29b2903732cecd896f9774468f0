"use strict";
var _async_to_generator = require("@swc/helpers/lib/_async_to_generator.js").default;
var _createRecordFromThenable = require("./create-record-from-thenable");
describe('createRecordFromThenable', ()=>{
    it('successful promise', _async_to_generator(function*() {
        const thenable = Promise.resolve('success');
        const record = (0, _createRecordFromThenable).createRecordFromThenable(thenable);
        expect(record.status).toBe('pending');
        yield thenable;
        expect(record.status).toBe('fulfilled');
        expect(record.value).toBe('success');
    }));
    it('rejecting promise', _async_to_generator(function*() {
        const thenable = Promise.reject('error');
        const record = (0, _createRecordFromThenable).createRecordFromThenable(thenable);
        expect(record.status).toBe('pending');
        yield thenable.catch(()=>{});
        expect(record.status).toBe('rejected');
        expect(record.value).toBe('error');
    }));
});

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=create-record-from-thenable.test.js.map