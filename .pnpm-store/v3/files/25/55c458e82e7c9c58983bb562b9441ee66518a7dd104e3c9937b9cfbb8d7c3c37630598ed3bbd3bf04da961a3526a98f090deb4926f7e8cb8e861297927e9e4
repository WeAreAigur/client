import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import { readRecordValue } from './read-record-value';
import { createRecordFromThenable } from './create-record-from-thenable';
describe('readRecordValue', ()=>{
    it('successful promise', _async_to_generator(function*() {
        const thenable = Promise.resolve('success');
        const record = createRecordFromThenable(thenable);
        expect(()=>readRecordValue(record)).toThrow();
        yield thenable;
        expect(readRecordValue(record)).toBe('success');
    }));
    it('rejecting promise', _async_to_generator(function*() {
        const thenable = Promise.reject('failed');
        const record = createRecordFromThenable(thenable);
        expect(()=>readRecordValue(record)).toThrow();
        yield thenable.catch(()=>{});
        expect(()=>readRecordValue(record)).toThrow();
        const result = (()=>{
            try {
                return readRecordValue(record);
            } catch (err) {
                return err;
            }
        })();
        expect(result.status).toBe('rejected');
        expect(result.value).toBe('failed');
    }));
});

//# sourceMappingURL=read-record-value.test.js.map