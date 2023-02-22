"use strict";
var _async_to_generator = require("@swc/helpers/lib/_async_to_generator.js").default;
var _readRecordValue = require("./read-record-value");
var _createRecordFromThenable = require("./create-record-from-thenable");
describe('readRecordValue', ()=>{
    it('successful promise', _async_to_generator(function*() {
        const thenable = Promise.resolve('success');
        const record = (0, _createRecordFromThenable).createRecordFromThenable(thenable);
        expect(()=>(0, _readRecordValue).readRecordValue(record)).toThrow();
        yield thenable;
        expect((0, _readRecordValue).readRecordValue(record)).toBe('success');
    }));
    it('rejecting promise', _async_to_generator(function*() {
        const thenable = Promise.reject('failed');
        const record = (0, _createRecordFromThenable).createRecordFromThenable(thenable);
        expect(()=>(0, _readRecordValue).readRecordValue(record)).toThrow();
        yield thenable.catch(()=>{});
        expect(()=>(0, _readRecordValue).readRecordValue(record)).toThrow();
        const result = (()=>{
            try {
                return (0, _readRecordValue).readRecordValue(record);
            } catch (err) {
                return err;
            }
        })();
        expect(result.status).toBe('rejected');
        expect(result.value).toBe('failed');
    }));
});

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=read-record-value.test.js.map