"use strict";
var _createHrefFromUrl = require("./create-href-from-url");
describe('createHrefFromUrl', ()=>{
    it('returns a string', ()=>{
        const url = new URL('https://example.com/');
        expect((0, _createHrefFromUrl).createHrefFromUrl(url)).toBe('/');
    });
    it('adds hash', ()=>{
        const url = new URL('https://example.com/#hash');
        expect((0, _createHrefFromUrl).createHrefFromUrl(url)).toBe('/#hash');
    });
    it('adds searchParams', ()=>{
        const url = new URL('https://example.com/?a=1&b=2');
        expect((0, _createHrefFromUrl).createHrefFromUrl(url)).toBe('/?a=1&b=2');
    });
    it('adds pathname', ()=>{
        const url = new URL('https://example.com/path');
        expect((0, _createHrefFromUrl).createHrefFromUrl(url)).toBe('/path');
    });
    it('adds pathname, searchParams, and hash', ()=>{
        const url = new URL('https://example.com/path?a=1&b=2#hash');
        expect((0, _createHrefFromUrl).createHrefFromUrl(url)).toBe('/path?a=1&b=2#hash');
    });
});

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=create-href-from-url.test.js.map