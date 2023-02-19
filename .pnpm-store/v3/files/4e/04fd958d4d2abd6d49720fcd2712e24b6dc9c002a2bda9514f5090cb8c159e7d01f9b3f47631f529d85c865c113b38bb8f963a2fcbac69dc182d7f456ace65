import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import { createRecordFromThenable } from './create-record-from-thenable';
describe('createRecordFromThenable', ()=>{
    it('successful promise', _async_to_generator(function*() {
        const thenable = Promise.resolve('success');
        const record = createRecordFromThenable(thenable);
        expect(record.status).toBe('pending');
        yield thenable;
        expect(record.status).toBe('fulfilled');
        expect(record.value).toBe('success');
    }));
    it('rejecting promise', _async_to_generator(function*() {
        const thenable = Promise.reject('error');
        const record = createRecordFromThenable(thenable);
        expect(record.status).toBe('pending');
        yield thenable.catch(()=>{});
        expect(record.status).toBe('rejected');
        expect(record.value).toBe('error');
    }));
});

//# sourceMappingURL=create-record-from-thenable.test.js.map