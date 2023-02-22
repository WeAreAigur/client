"use strict";
var _redirect = require("./redirect");
describe('test', ()=>{
    it('should throw a redirect error', ()=>{
        try {
            (0, _redirect).redirect('/dashboard');
            throw new Error('did not throw');
        } catch (err) {
            expect(err.message).toBe(_redirect.REDIRECT_ERROR_CODE);
            expect(err.digest).toBe(`${_redirect.REDIRECT_ERROR_CODE};/dashboard`);
        }
    });
});

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=redirect.test.js.map