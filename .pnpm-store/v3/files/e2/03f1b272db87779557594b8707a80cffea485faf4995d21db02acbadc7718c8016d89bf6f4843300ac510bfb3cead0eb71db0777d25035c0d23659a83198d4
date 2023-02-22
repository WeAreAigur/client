import React from 'react';
import { highlight as highlight$1 } from '@code-hike/lighter';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

var convert_1 = convert$1;

function convert$1(test) {
  if (test == null) {
    return ok
  }

  if (typeof test === 'string') {
    return typeFactory(test)
  }

  if (typeof test === 'object') {
    return 'length' in test ? anyFactory(test) : allFactory(test)
  }

  if (typeof test === 'function') {
    return test
  }

  throw new Error('Expected function, string, or object as test')
}

// Utility assert each property in `test` is represented in `node`, and each
// values are strictly equal.
function allFactory(test) {
  return all

  function all(node) {
    var key;

    for (key in test) {
      if (node[key] !== test[key]) return false
    }

    return true
  }
}

function anyFactory(tests) {
  var checks = [];
  var index = -1;

  while (++index < tests.length) {
    checks[index] = convert$1(tests[index]);
  }

  return any

  function any() {
    var index = -1;

    while (++index < checks.length) {
      if (checks[index].apply(this, arguments)) {
        return true
      }
    }

    return false
  }
}

// Utility to convert a string into a function which checks a given node’s type
// for said string.
function typeFactory(test) {
  return type

  function type(node) {
    return Boolean(node && node.type === test)
  }
}

// Utility to return true.
function ok() {
  return true
}

var color_1 = color$1;
function color$1(d) {
  return '\u001B[33m' + d + '\u001B[39m'
}

var unistUtilVisitParents = visitParents$1;

var convert = convert_1;
var color = color_1;

var CONTINUE$1 = true;
var SKIP$1 = 'skip';
var EXIT$1 = false;

visitParents$1.CONTINUE = CONTINUE$1;
visitParents$1.SKIP = SKIP$1;
visitParents$1.EXIT = EXIT$1;

function visitParents$1(tree, test, visitor, reverse) {
  var step;
  var is;

  if (typeof test === 'function' && typeof visitor !== 'function') {
    reverse = visitor;
    visitor = test;
    test = null;
  }

  is = convert(test);
  step = reverse ? -1 : 1;

  factory(tree, null, [])();

  function factory(node, index, parents) {
    var value = typeof node === 'object' && node !== null ? node : {};
    var name;

    if (typeof value.type === 'string') {
      name =
        typeof value.tagName === 'string'
          ? value.tagName
          : typeof value.name === 'string'
          ? value.name
          : undefined;

      visit.displayName =
        'node (' + color(value.type + (name ? '<' + name + '>' : '')) + ')';
    }

    return visit

    function visit() {
      var grandparents = parents.concat(node);
      var result = [];
      var subresult;
      var offset;

      if (!test || is(node, index, parents[parents.length - 1] || null)) {
        result = toResult(visitor(node, parents));

        if (result[0] === EXIT$1) {
          return result
        }
      }

      if (node.children && result[0] !== SKIP$1) {
        offset = (reverse ? node.children.length : -1) + step;

        while (offset > -1 && offset < node.children.length) {
          subresult = factory(node.children[offset], offset, grandparents)();

          if (subresult[0] === EXIT$1) {
            return subresult
          }

          offset =
            typeof subresult[1] === 'number' ? subresult[1] : offset + step;
        }
      }

      return result
    }
  }
}

function toResult(value) {
  if (value !== null && typeof value === 'object' && 'length' in value) {
    return value
  }

  if (typeof value === 'number') {
    return [CONTINUE$1, value]
  }

  return [value]
}

var unistUtilVisit = visit$1;

var visitParents = unistUtilVisitParents;

var CONTINUE = visitParents.CONTINUE;
var SKIP = visitParents.SKIP;
var EXIT = visitParents.EXIT;

visit$1.CONTINUE = CONTINUE;
visit$1.SKIP = SKIP;
visit$1.EXIT = EXIT;

function visit$1(tree, test, visitor, reverse) {
  if (typeof test === 'function' && typeof visitor !== 'function') {
    reverse = visitor;
    visitor = test;
    test = null;
  }

  visitParents(tree, test, overload, reverse);

  function overload(node, parents) {
    var parent = parents[parents.length - 1];
    var index = parent ? parent.children.indexOf(node) : null;
    return visitor(node, index, parent)
  }
}

function visit(tree, type, visitor) {
    unistUtilVisit(tree, type, visitor);
}

var isPlainObj = value => {
	if (Object.prototype.toString.call(value) !== '[object Object]') {
		return false;
	}

	const prototype = Object.getPrototypeOf(value);
	return prototype === null || prototype === Object.prototype;
};

// from https://stackoverflow.com/a/53936623/1325646
const isValidHex = (hex) => /^#([A-Fa-f0-9]{3,4}){1,2}$/.test(hex);
const getChunksFromString = (st, chunkSize) => st.match(new RegExp(`.{${chunkSize}}`, "g"));
const convertHexUnitTo256 = (hex) => parseInt(hex.repeat(2 / hex.length), 16);
function getAlphaFloat(a, alpha) {
    if (typeof a !== "undefined") {
        return a / 255;
    }
    if (typeof alpha != "number" || alpha < 0 || alpha > 1) {
        return 1;
    }
    return alpha;
}
function hexToObject(hex) {
    if (!hex) {
        return undefined;
    }
    if (!isValidHex(hex)) {
        throw new Error("Invalid color string, must be a valid hex color");
    }
    const chunkSize = Math.floor((hex.length - 1) / 3);
    const hexArr = getChunksFromString(hex.slice(1), chunkSize);
    const [r, g, b, a] = hexArr.map(convertHexUnitTo256);
    return {
        r,
        g,
        b,
        a: getAlphaFloat(a, 1),
    };
}
function objectToHex(object) {
    if (!object) {
        return undefined;
    }
    const { r, g, b, a } = object;
    const alpha = Math.round(a * 255);
    return `#${r.toString(16).padStart(2, "0")}${g
        .toString(16)
        .padStart(2, "0")}${b
        .toString(16)
        .padStart(2, "0")}${alpha
        .toString(16)
        .padStart(2, "0")}`;
}
function transparent(color, opacity) {
    if (!color) {
        return color;
    }
    const { r, g, b, a } = hexToObject(color);
    return objectToHex({ r, g, b, a: a * opacity });
}

function splitParts(focus) {
    return focus.split(/,(?![^\[]*\])/g);
}
function mergeToObject(entries) {
    return entries.reduce((acc, obj) => Object.assign(acc, obj), {});
}
function parsePartToObject(part) {
    // a part could be
    // - a line number: "2"
    // - a line range: "5:9"
    // - a line number with a column selector: "2[1,3:5,9]"
    const columnsMatch = part.match(/(\d+)\[(.+)\]/);
    if (columnsMatch) {
        const [, line, columns] = columnsMatch;
        const columnsList = columns
            .split(",")
            .map(parseExtremes);
        const lineNumber = Number(line);
        return { [lineNumber]: columnsList };
    }
    else {
        return mergeToObject(expandString(part).map(lineNumber => ({
            [lineNumber]: true,
        })));
    }
}
function parseExtremes(part) {
    // Transforms something like
    // - "1:3" to {start:1, end: 3}
    // - "4" to {start:4, end:4}
    const [start, end] = part.split(":");
    if (!isNaturalNumber(start)) {
        throw new FocusNumberError(start);
    }
    const startNumber = Number(start);
    if (startNumber < 1) {
        throw new LineOrColumnNumberError();
    }
    if (!end) {
        return { start: startNumber, end: startNumber };
    }
    else {
        if (!isNaturalNumber(end)) {
            throw new FocusNumberError(end);
        }
        return { start: startNumber, end: +end };
    }
}
function expandString(part) {
    // Transforms something like
    // - "1:3" to [1,2,3]
    // - "4" to [4]
    const [start, end] = part.split(":");
    if (!isNaturalNumber(start)) {
        throw new FocusNumberError(start);
    }
    const startNumber = Number(start);
    if (startNumber < 1) {
        throw new LineOrColumnNumberError();
    }
    if (!end) {
        return [startNumber];
    }
    else {
        if (!isNaturalNumber(end)) {
            throw new FocusNumberError(end);
        }
        const list = [];
        for (let i = startNumber; i <= +end; i++) {
            list.push(i);
        }
        return list;
    }
}
function isNaturalNumber(n) {
    n = n.toString(); // force the value in case it is not
    var n1 = Math.abs(n), n2 = parseInt(n, 10);
    return !isNaN(n1) && n2 === n1 && n1.toString() === n;
}
class LineOrColumnNumberError extends Error {
    constructor() {
        super(`Invalid line or column number in focus string`);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
class FocusNumberError extends Error {
    constructor(number) {
        super(`Invalid number "${number}" in focus string`);
        this.number = number;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
// turns a relative string like (1,3) or [4:5] into a normal focus string
function relativeToAbsolute(relativeString, lineNumber) {
    if (!relativeString) {
        return lineNumber.toString();
    }
    if (relativeString.startsWith("[")) {
        return `${lineNumber}` + relativeString;
    }
    return splitParts(relativeString.slice(1, -1))
        .map(part => makePartAbsolute(part, lineNumber))
        .join(",");
}
function makePartAbsolute(part, lineNumber) {
    const focusMap = parsePartToObject(part);
    const keys = Object.keys(focusMap).map(k => +k);
    if (keys.length > 1) {
        const min = Math.min(...keys);
        const max = Math.max(...keys);
        return `${min + lineNumber - 1}:${max + lineNumber - 1}`;
    }
    const newMap = {};
    Object.keys(focusMap).forEach(ln => {
        newMap[+ln + lineNumber - 1] = focusMap[+ln];
    });
    return toFocusString(newMap);
}
function toFocusString(focusMap) {
    let parts = [];
    Object.keys(focusMap).forEach(ln => {
        const part = focusMap[+ln];
        if (part === true) {
            parts.push(ln);
        }
        else if (part instanceof Array) {
            const columnsString = part.map(extremes => extremes.start === extremes.end
                ? extremes.start
                : `${extremes.start}:${extremes.end}`);
            parts.push(`${ln}[${columnsString}]`);
        }
    });
    return parts.join(",");
}
function mergeFocus(fs1, fs2) {
    if (!fs1)
        return fs2 || "";
    if (!fs2)
        return fs1 || "";
    return `${fs1},${fs2}`;
}

var ColorName;
(function (ColorName) {
    ColorName[ColorName["CodeForeground"] = 0] = "CodeForeground";
    ColorName[ColorName["CodeBackground"] = 1] = "CodeBackground";
    ColorName[ColorName["EditorForeground"] = 2] = "EditorForeground";
    ColorName[ColorName["EditorBackground"] = 3] = "EditorBackground";
    ColorName[ColorName["FocusBorder"] = 4] = "FocusBorder";
    ColorName[ColorName["ActiveTabBackground"] = 5] = "ActiveTabBackground";
    ColorName[ColorName["ActiveTabForeground"] = 6] = "ActiveTabForeground";
    ColorName[ColorName["InactiveTabBackground"] = 7] = "InactiveTabBackground";
    ColorName[ColorName["InactiveTabForeground"] = 8] = "InactiveTabForeground";
    ColorName[ColorName["EditorGroupBorder"] = 9] = "EditorGroupBorder";
    ColorName[ColorName["EditorGroupHeaderBackground"] = 10] = "EditorGroupHeaderBackground";
    ColorName[ColorName["TabBorder"] = 11] = "TabBorder";
    ColorName[ColorName["ActiveTabBottomBorder"] = 12] = "ActiveTabBottomBorder";
    ColorName[ColorName["LineNumberForeground"] = 13] = "LineNumberForeground";
    ColorName[ColorName["InputForeground"] = 14] = "InputForeground";
    ColorName[ColorName["InputBackground"] = 15] = "InputBackground";
    ColorName[ColorName["InputBorder"] = 16] = "InputBorder";
    ColorName[ColorName["SelectionBackground"] = 17] = "SelectionBackground";
    ColorName[ColorName["IconForeground"] = 18] = "IconForeground";
    ColorName[ColorName["ListActiveSelectionBackground"] = 19] = "ListActiveSelectionBackground";
    ColorName[ColorName["ListActiveSelectionForeground"] = 20] = "ListActiveSelectionForeground";
    ColorName[ColorName["ListHoverBackground"] = 21] = "ListHoverBackground";
    ColorName[ColorName["ListHoverForeground"] = 22] = "ListHoverForeground";
    ColorName[ColorName["SideBarBackground"] = 23] = "SideBarBackground";
    ColorName[ColorName["SideBarForeground"] = 24] = "SideBarForeground";
    ColorName[ColorName["SideBarBorder"] = 25] = "SideBarBorder";
    // Background color for the highlight of line at the cursor position
    ColorName[ColorName["LineHighlightBackground"] = 26] = "LineHighlightBackground";
    // Background color of highlighted ranges, like by quick open and find features
    ColorName[ColorName["RangeHighlightBackground"] = 27] = "RangeHighlightBackground";
    // Foreground color of info squigglies in the editor
    ColorName[ColorName["EditorInfoForeground"] = 28] = "EditorInfoForeground";
})(ColorName || (ColorName = {}));
const contrastBorder = "#6FC3DF";
// defaults from: https://github.com/microsoft/vscode/blob/main/src/vs/workbench/common/theme.ts
// and: https://github.com/microsoft/vscode/blob/main/src/vs/editor/common/core/editorColorRegistry.ts
// and: https://github.com/microsoft/vscode/blob/main/src/vs/platform/theme/common/colorRegistry.ts
// keys from : https://code.visualstudio.com/api/references/theme-color#editor-groups-tabs
function getColor(theme, colorName) {
    var _a, _b;
    const colors = theme.colors || {};
    switch (colorName) {
        case ColorName.CodeForeground:
            return (((_a = getGlobalSettings(theme)) === null || _a === void 0 ? void 0 : _a.foreground) ||
                getColor(theme, ColorName.EditorForeground));
        case ColorName.CodeBackground:
            return (((_b = getGlobalSettings(theme)) === null || _b === void 0 ? void 0 : _b.background) ||
                getColor(theme, ColorName.EditorBackground));
        case ColorName.EditorBackground:
            return (colors["editor.background"] ||
                getDefault(theme, {
                    light: "#fffffe",
                    dark: "#1E1E1E",
                    hc: "#000000",
                }));
        case ColorName.EditorForeground:
            return (colors["editor.foreground"] ||
                getDefault(theme, {
                    light: "#333333",
                    dark: "#BBBBBB",
                    hc: "#fffffe",
                }));
        case ColorName.FocusBorder:
            return (colors["focusBorder"] ||
                getDefault(theme, {
                    light: "#0090F1",
                    dark: "#007FD4",
                    hc: contrastBorder,
                }));
        case ColorName.ActiveTabBackground:
            return (colors["tab.activeBackground"] ||
                getColor(theme, ColorName.EditorBackground));
        case ColorName.ActiveTabForeground:
            return (colors["tab.activeForeground"] ||
                getDefault(theme, {
                    dark: "#ffffff",
                    light: "#333333",
                    hc: "#ffffff",
                }));
        case ColorName.InactiveTabBackground:
            return (colors["tab.inactiveBackground"] ||
                getDefault(theme, {
                    dark: "#2D2D2D",
                    light: "#ECECEC",
                    hc: undefined,
                }));
        case ColorName.InactiveTabForeground:
            return (colors["tab.inactiveForeground"] ||
                getDefault(theme, {
                    dark: transparent(getColor(theme, ColorName.ActiveTabForeground), 0.5),
                    light: transparent(getColor(theme, ColorName.ActiveTabForeground), 0.7),
                    hc: "#ffffff",
                }));
        case ColorName.TabBorder:
            return (colors["tab.border"] ||
                getDefault(theme, {
                    dark: "#252526",
                    light: "#F3F3F3",
                    hc: contrastBorder,
                }));
        case ColorName.ActiveTabBottomBorder:
            return (colors["tab.activeBorder"] ||
                getColor(theme, ColorName.ActiveTabBackground));
        case ColorName.EditorGroupBorder:
            return (colors["editorGroup.border"] ||
                getDefault(theme, {
                    dark: "#444444",
                    light: "#E7E7E7",
                    hc: contrastBorder,
                }));
        case ColorName.EditorGroupHeaderBackground:
            return (colors["editorGroupHeader.tabsBackground"] ||
                getDefault(theme, {
                    dark: "#252526",
                    light: "#F3F3F3",
                    hc: undefined,
                }));
        case ColorName.LineNumberForeground:
            return (colors["editorLineNumber.foreground"] ||
                getDefault(theme, {
                    dark: "#858585",
                    light: "#237893",
                    hc: "#fffffe",
                }));
        case ColorName.InputBackground:
            return (colors["input.background"] ||
                getDefault(theme, {
                    dark: "#3C3C3C",
                    light: "#fffffe",
                    hc: "#000000",
                }));
        case ColorName.InputForeground:
            return (colors["input.foreground"] ||
                getColor(theme, ColorName.EditorForeground));
        case ColorName.InputBorder:
            return (colors["input.border"] ||
                getDefault(theme, {
                    dark: undefined,
                    light: undefined,
                    hc: contrastBorder,
                }));
        case ColorName.SelectionBackground:
            return (colors["editor.selectionBackground"] ||
                getDefault(theme, {
                    light: "#ADD6FF",
                    dark: "#264F78",
                    hc: "#f3f518",
                }));
        case ColorName.IconForeground:
            return (colors["icon.foreground"] ||
                getDefault(theme, {
                    dark: "#C5C5C5",
                    light: "#424242",
                    hc: "#FFFFFF",
                }));
        case ColorName.SideBarBackground:
            return (colors["sideBar.background"] ||
                getDefault(theme, {
                    dark: "#252526",
                    light: "#F3F3F3",
                    hc: "#000000",
                }));
        case ColorName.SideBarForeground:
            return (colors["sideBar.foreground"] ||
                getColor(theme, ColorName.EditorForeground));
        case ColorName.SideBarBorder:
            return (colors["sideBar.border"] ||
                getColor(theme, ColorName.SideBarBackground));
        case ColorName.ListActiveSelectionBackground:
            return (colors["list.activeSelectionBackground"] ||
                getDefault(theme, {
                    dark: "#094771",
                    light: "#0060C0",
                    hc: "#000000",
                }));
        case ColorName.ListActiveSelectionForeground:
            return (colors["list.activeSelectionForeground"] ||
                getDefault(theme, {
                    dark: "#fffffe",
                    light: "#fffffe",
                    hc: "#fffffe",
                }));
        case ColorName.ListHoverBackground:
            return (colors["list.hoverBackground"] ||
                getDefault(theme, {
                    dark: "#2A2D2E",
                    light: "#F0F0F0",
                    hc: undefined,
                }));
        case ColorName.ListHoverForeground:
            return colors["list.hoverForeground"] || undefined;
        case ColorName.LineHighlightBackground:
            return (colors["editor.lineHighlightBackground"] ||
                getDefault(theme, {
                    dark: undefined,
                    light: undefined,
                    hc: undefined,
                }));
        case ColorName.RangeHighlightBackground:
            return (colors["editor.rangeHighlightBackground"] ||
                getDefault(theme, {
                    dark: "#ffffff0b",
                    light: "#fdff0033",
                    hc: undefined,
                }));
        case ColorName.EditorInfoForeground:
            return (colors["editor.infoForeground"] ||
                getDefault(theme, {
                    dark: "#3794FF",
                    light: "#1a85ff",
                    hc: "#3794FF",
                }));
        default:
            return "#f00";
    }
}
function getDefault(theme, defaults) {
    return defaults[getThemeType(theme)];
}
function getThemeType(theme) {
    var _a;
    return (theme.type
        ? theme.type
        : ((_a = theme.name) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes("light"))
            ? "light"
            : "dark");
}
function getGlobalSettings(theme) {
    let settings = theme.settings
        ? theme.settings
        : theme.tokenColors;
    const globalSetting = settings
        ? settings.find(s => {
            return !s.name && !s.scope;
        })
        : undefined;
    return globalSetting === null || globalSetting === void 0 ? void 0 : globalSetting.settings;
}

typeof window !== "undefined"
    ? React.useLayoutEffect
    : React.useEffect;

const annotationsMap = {
    box: Box,
    bg: MultilineMark,
    label: Label,
    link: CodeLink,
    mark: Mark,
    withClass: WithClass,
};
function Mark(props) {
    if (props.isInline) {
        return React.createElement(InlineMark, Object.assign({}, props));
    }
    else {
        return React.createElement(MultilineMark, Object.assign({}, props));
    }
}
function MultilineMark({ children, data, style, theme, }) {
    const className = `ch-code-multiline-mark ` + (data !== null && data !== void 0 ? data : "");
    const bg = getColor(theme, ColorName.RangeHighlightBackground);
    const border = getColor(theme, ColorName.EditorInfoForeground);
    return (React.createElement("div", { style: Object.assign(Object.assign({}, style), { background: bg }), className: className },
        React.createElement("span", { className: "ch-code-multiline-mark-border", style: { background: border } }),
        children));
}
function InlineMark({ children, data, theme, }) {
    const bg = tryGuessColor(children) ||
        transparent(getColor(theme, ColorName.CodeForeground), 0.2);
    const className = "ch-code-inline-mark " + (data !== null && data !== void 0 ? data : "");
    return (React.createElement("span", { className: className, style: { background: bg } }, children));
}
function tryGuessColor(children) {
    var _a, _b, _c;
    const child = React.Children.toArray(children)[0];
    const grandChild = React.Children.toArray(((_a = child === null || child === void 0 ? void 0 : child.props) === null || _a === void 0 ? void 0 : _a.children) || [])[0];
    const grandGrandChild = React.Children.toArray(((_b = grandChild === null || grandChild === void 0 ? void 0 : grandChild.props) === null || _b === void 0 ? void 0 : _b.children) || [])[0];
    const { color } = ((_c = grandGrandChild === null || grandGrandChild === void 0 ? void 0 : grandGrandChild.props) === null || _c === void 0 ? void 0 : _c.style) || {};
    if (color) {
        return transparent(color, 0.2);
    }
    return undefined;
}
function Box({ children, data, theme, }) {
    var _a, _b;
    const border = typeof data === "string"
        ? data
        : ((_b = (_a = theme.tokenColors.find((tc) => { var _a; return (_a = tc.scope) === null || _a === void 0 ? void 0 : _a.includes("string"); })) === null || _a === void 0 ? void 0 : _a.settings) === null || _b === void 0 ? void 0 : _b.foreground) || "yellow";
    return (React.createElement("span", { className: "ch-code-box-annotation", style: { outline: `2px solid ${border}` } }, children));
}
function WithClass({ children, data, style, theme, }) {
    const className = data;
    return (React.createElement("span", { style: style, className: className }, children));
}
function Label({ children, data, style, theme, }) {
    const bg = (theme.colors["editor.lineHighlightBackground"] ||
        theme.colors["editor.selectionHighlightBackground"]);
    const [hover, setHover] = React.useState(false);
    return (React.createElement("div", { style: Object.assign(Object.assign({}, style), { background: hover ? bg : undefined }), onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false) },
        children,
        React.createElement("div", { style: {
                position: "absolute",
                right: 0,
                paddingRight: 16,
                display: hover ? "block" : "none",
                opacity: 0.7,
            } }, (data === null || data === void 0 ? void 0 : data.children) || data)));
}
function CodeLink({ children, isInline, style, data, }) {
    const url = (data === null || data === void 0 ? void 0 : data.url) || data;
    const title = data === null || data === void 0 ? void 0 : data.title;
    return (React.createElement("a", { href: url, title: title, className: isInline ? "ch-code-inline-link" : "ch-code-link", style: style }, children));
}

var normalize_1 = normalize$1;

function normalize$1(value) {
  return value.toLowerCase()
}

var info = Info$1;

var proto$1 = Info$1.prototype;

proto$1.space = null;
proto$1.attribute = null;
proto$1.property = null;
proto$1.boolean = false;
proto$1.booleanish = false;
proto$1.overloadedBoolean = false;
proto$1.number = false;
proto$1.commaSeparated = false;
proto$1.spaceSeparated = false;
proto$1.commaOrSpaceSeparated = false;
proto$1.mustUseProperty = false;
proto$1.defined = false;

function Info$1(property, attribute) {
  this.property = property;
  this.attribute = attribute;
}

var types$4 = {};

var powers = 0;

types$4.boolean = increment();
types$4.booleanish = increment();
types$4.overloadedBoolean = increment();
types$4.number = increment();
types$4.spaceSeparated = increment();
types$4.commaSeparated = increment();
types$4.commaOrSpaceSeparated = increment();

function increment() {
  return Math.pow(2, ++powers)
}

var Info = info;
var types$3 = types$4;

var definedInfo = DefinedInfo$1;

DefinedInfo$1.prototype = new Info();
DefinedInfo$1.prototype.defined = true;

var checks = [
  'boolean',
  'booleanish',
  'overloadedBoolean',
  'number',
  'commaSeparated',
  'spaceSeparated',
  'commaOrSpaceSeparated'
];
var checksLength = checks.length;

function DefinedInfo$1(property, attribute, mask, space) {
  var index = -1;
  var check;

  mark(this, 'space', space);

  Info.call(this, property, attribute);

  while (++index < checksLength) {
    check = checks[index];
    mark(this, check, (mask & types$3[check]) === types$3[check]);
  }
}

function mark(values, key, value) {
  if (value) {
    values[key] = value;
  }
}

var immutable = extend;

var hasOwnProperty = Object.prototype.hasOwnProperty;

function extend() {
    var target = {};

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key];
            }
        }
    }

    return target
}

var schema = Schema$2;

var proto = Schema$2.prototype;

proto.space = null;
proto.normal = {};
proto.property = {};

function Schema$2(property, normal, space) {
  this.property = property;
  this.normal = normal;

  if (space) {
    this.space = space;
  }
}

var xtend = immutable;
var Schema$1 = schema;

var merge_1 = merge$2;

function merge$2(definitions) {
  var length = definitions.length;
  var property = [];
  var normal = [];
  var index = -1;
  var info;
  var space;

  while (++index < length) {
    info = definitions[index];
    property.push(info.property);
    normal.push(info.normal);
    space = info.space;
  }

  return new Schema$1(
    xtend.apply(null, property),
    xtend.apply(null, normal),
    space
  )
}

var normalize = normalize_1;
var Schema = schema;
var DefinedInfo = definedInfo;

var create_1 = create$6;

function create$6(definition) {
  var space = definition.space;
  var mustUseProperty = definition.mustUseProperty || [];
  var attributes = definition.attributes || {};
  var props = definition.properties;
  var transform = definition.transform;
  var property = {};
  var normal = {};
  var prop;
  var info;

  for (prop in props) {
    info = new DefinedInfo(
      prop,
      transform(attributes, prop),
      props[prop],
      space
    );

    if (mustUseProperty.indexOf(prop) !== -1) {
      info.mustUseProperty = true;
    }

    property[prop] = info;

    normal[normalize(prop)] = prop;
    normal[normalize(info.attribute)] = prop;
  }

  return new Schema(property, normal, space)
}

var create$5 = create_1;

var xlink$2 = create$5({
  space: 'xlink',
  transform: xlinkTransform,
  properties: {
    xLinkActuate: null,
    xLinkArcRole: null,
    xLinkHref: null,
    xLinkRole: null,
    xLinkShow: null,
    xLinkTitle: null,
    xLinkType: null
  }
});

function xlinkTransform(_, prop) {
  return 'xlink:' + prop.slice(5).toLowerCase()
}

var create$4 = create_1;

var xml$2 = create$4({
  space: 'xml',
  transform: xmlTransform,
  properties: {
    xmlLang: null,
    xmlBase: null,
    xmlSpace: null
  }
});

function xmlTransform(_, prop) {
  return 'xml:' + prop.slice(3).toLowerCase()
}

var caseSensitiveTransform_1 = caseSensitiveTransform$2;

function caseSensitiveTransform$2(attributes, attribute) {
  return attribute in attributes ? attributes[attribute] : attribute
}

var caseSensitiveTransform$1 = caseSensitiveTransform_1;

var caseInsensitiveTransform_1 = caseInsensitiveTransform$2;

function caseInsensitiveTransform$2(attributes, property) {
  return caseSensitiveTransform$1(attributes, property.toLowerCase())
}

var create$3 = create_1;
var caseInsensitiveTransform$1 = caseInsensitiveTransform_1;

var xmlns$2 = create$3({
  space: 'xmlns',
  attributes: {
    xmlnsxlink: 'xmlns:xlink'
  },
  transform: caseInsensitiveTransform$1,
  properties: {
    xmlns: null,
    xmlnsXLink: null
  }
});

var types$2 = types$4;
var create$2 = create_1;

var booleanish$1 = types$2.booleanish;
var number$2 = types$2.number;
var spaceSeparated$2 = types$2.spaceSeparated;

var aria$2 = create$2({
  transform: ariaTransform,
  properties: {
    ariaActiveDescendant: null,
    ariaAtomic: booleanish$1,
    ariaAutoComplete: null,
    ariaBusy: booleanish$1,
    ariaChecked: booleanish$1,
    ariaColCount: number$2,
    ariaColIndex: number$2,
    ariaColSpan: number$2,
    ariaControls: spaceSeparated$2,
    ariaCurrent: null,
    ariaDescribedBy: spaceSeparated$2,
    ariaDetails: null,
    ariaDisabled: booleanish$1,
    ariaDropEffect: spaceSeparated$2,
    ariaErrorMessage: null,
    ariaExpanded: booleanish$1,
    ariaFlowTo: spaceSeparated$2,
    ariaGrabbed: booleanish$1,
    ariaHasPopup: null,
    ariaHidden: booleanish$1,
    ariaInvalid: null,
    ariaKeyShortcuts: null,
    ariaLabel: null,
    ariaLabelledBy: spaceSeparated$2,
    ariaLevel: number$2,
    ariaLive: null,
    ariaModal: booleanish$1,
    ariaMultiLine: booleanish$1,
    ariaMultiSelectable: booleanish$1,
    ariaOrientation: null,
    ariaOwns: spaceSeparated$2,
    ariaPlaceholder: null,
    ariaPosInSet: number$2,
    ariaPressed: booleanish$1,
    ariaReadOnly: booleanish$1,
    ariaRelevant: null,
    ariaRequired: booleanish$1,
    ariaRoleDescription: spaceSeparated$2,
    ariaRowCount: number$2,
    ariaRowIndex: number$2,
    ariaRowSpan: number$2,
    ariaSelected: booleanish$1,
    ariaSetSize: number$2,
    ariaSort: null,
    ariaValueMax: number$2,
    ariaValueMin: number$2,
    ariaValueNow: number$2,
    ariaValueText: null,
    role: null
  }
});

function ariaTransform(_, prop) {
  return prop === 'role' ? prop : 'aria-' + prop.slice(4).toLowerCase()
}

var types$1 = types$4;
var create$1 = create_1;
var caseInsensitiveTransform = caseInsensitiveTransform_1;

var boolean$1 = types$1.boolean;
var overloadedBoolean = types$1.overloadedBoolean;
var booleanish = types$1.booleanish;
var number$1 = types$1.number;
var spaceSeparated$1 = types$1.spaceSeparated;
var commaSeparated$1 = types$1.commaSeparated;

var html$1 = create$1({
  space: 'html',
  attributes: {
    acceptcharset: 'accept-charset',
    classname: 'class',
    htmlfor: 'for',
    httpequiv: 'http-equiv'
  },
  transform: caseInsensitiveTransform,
  mustUseProperty: ['checked', 'multiple', 'muted', 'selected'],
  properties: {
    // Standard Properties.
    abbr: null,
    accept: commaSeparated$1,
    acceptCharset: spaceSeparated$1,
    accessKey: spaceSeparated$1,
    action: null,
    allow: null,
    allowFullScreen: boolean$1,
    allowPaymentRequest: boolean$1,
    allowUserMedia: boolean$1,
    alt: null,
    as: null,
    async: boolean$1,
    autoCapitalize: null,
    autoComplete: spaceSeparated$1,
    autoFocus: boolean$1,
    autoPlay: boolean$1,
    capture: boolean$1,
    charSet: null,
    checked: boolean$1,
    cite: null,
    className: spaceSeparated$1,
    cols: number$1,
    colSpan: null,
    content: null,
    contentEditable: booleanish,
    controls: boolean$1,
    controlsList: spaceSeparated$1,
    coords: number$1 | commaSeparated$1,
    crossOrigin: null,
    data: null,
    dateTime: null,
    decoding: null,
    default: boolean$1,
    defer: boolean$1,
    dir: null,
    dirName: null,
    disabled: boolean$1,
    download: overloadedBoolean,
    draggable: booleanish,
    encType: null,
    enterKeyHint: null,
    form: null,
    formAction: null,
    formEncType: null,
    formMethod: null,
    formNoValidate: boolean$1,
    formTarget: null,
    headers: spaceSeparated$1,
    height: number$1,
    hidden: boolean$1,
    high: number$1,
    href: null,
    hrefLang: null,
    htmlFor: spaceSeparated$1,
    httpEquiv: spaceSeparated$1,
    id: null,
    imageSizes: null,
    imageSrcSet: commaSeparated$1,
    inputMode: null,
    integrity: null,
    is: null,
    isMap: boolean$1,
    itemId: null,
    itemProp: spaceSeparated$1,
    itemRef: spaceSeparated$1,
    itemScope: boolean$1,
    itemType: spaceSeparated$1,
    kind: null,
    label: null,
    lang: null,
    language: null,
    list: null,
    loading: null,
    loop: boolean$1,
    low: number$1,
    manifest: null,
    max: null,
    maxLength: number$1,
    media: null,
    method: null,
    min: null,
    minLength: number$1,
    multiple: boolean$1,
    muted: boolean$1,
    name: null,
    nonce: null,
    noModule: boolean$1,
    noValidate: boolean$1,
    onAbort: null,
    onAfterPrint: null,
    onAuxClick: null,
    onBeforePrint: null,
    onBeforeUnload: null,
    onBlur: null,
    onCancel: null,
    onCanPlay: null,
    onCanPlayThrough: null,
    onChange: null,
    onClick: null,
    onClose: null,
    onContextMenu: null,
    onCopy: null,
    onCueChange: null,
    onCut: null,
    onDblClick: null,
    onDrag: null,
    onDragEnd: null,
    onDragEnter: null,
    onDragExit: null,
    onDragLeave: null,
    onDragOver: null,
    onDragStart: null,
    onDrop: null,
    onDurationChange: null,
    onEmptied: null,
    onEnded: null,
    onError: null,
    onFocus: null,
    onFormData: null,
    onHashChange: null,
    onInput: null,
    onInvalid: null,
    onKeyDown: null,
    onKeyPress: null,
    onKeyUp: null,
    onLanguageChange: null,
    onLoad: null,
    onLoadedData: null,
    onLoadedMetadata: null,
    onLoadEnd: null,
    onLoadStart: null,
    onMessage: null,
    onMessageError: null,
    onMouseDown: null,
    onMouseEnter: null,
    onMouseLeave: null,
    onMouseMove: null,
    onMouseOut: null,
    onMouseOver: null,
    onMouseUp: null,
    onOffline: null,
    onOnline: null,
    onPageHide: null,
    onPageShow: null,
    onPaste: null,
    onPause: null,
    onPlay: null,
    onPlaying: null,
    onPopState: null,
    onProgress: null,
    onRateChange: null,
    onRejectionHandled: null,
    onReset: null,
    onResize: null,
    onScroll: null,
    onSecurityPolicyViolation: null,
    onSeeked: null,
    onSeeking: null,
    onSelect: null,
    onSlotChange: null,
    onStalled: null,
    onStorage: null,
    onSubmit: null,
    onSuspend: null,
    onTimeUpdate: null,
    onToggle: null,
    onUnhandledRejection: null,
    onUnload: null,
    onVolumeChange: null,
    onWaiting: null,
    onWheel: null,
    open: boolean$1,
    optimum: number$1,
    pattern: null,
    ping: spaceSeparated$1,
    placeholder: null,
    playsInline: boolean$1,
    poster: null,
    preload: null,
    readOnly: boolean$1,
    referrerPolicy: null,
    rel: spaceSeparated$1,
    required: boolean$1,
    reversed: boolean$1,
    rows: number$1,
    rowSpan: number$1,
    sandbox: spaceSeparated$1,
    scope: null,
    scoped: boolean$1,
    seamless: boolean$1,
    selected: boolean$1,
    shape: null,
    size: number$1,
    sizes: null,
    slot: null,
    span: number$1,
    spellCheck: booleanish,
    src: null,
    srcDoc: null,
    srcLang: null,
    srcSet: commaSeparated$1,
    start: number$1,
    step: null,
    style: null,
    tabIndex: number$1,
    target: null,
    title: null,
    translate: null,
    type: null,
    typeMustMatch: boolean$1,
    useMap: null,
    value: booleanish,
    width: number$1,
    wrap: null,

    // Legacy.
    // See: https://html.spec.whatwg.org/#other-elements,-attributes-and-apis
    align: null, // Several. Use CSS `text-align` instead,
    aLink: null, // `<body>`. Use CSS `a:active {color}` instead
    archive: spaceSeparated$1, // `<object>`. List of URIs to archives
    axis: null, // `<td>` and `<th>`. Use `scope` on `<th>`
    background: null, // `<body>`. Use CSS `background-image` instead
    bgColor: null, // `<body>` and table elements. Use CSS `background-color` instead
    border: number$1, // `<table>`. Use CSS `border-width` instead,
    borderColor: null, // `<table>`. Use CSS `border-color` instead,
    bottomMargin: number$1, // `<body>`
    cellPadding: null, // `<table>`
    cellSpacing: null, // `<table>`
    char: null, // Several table elements. When `align=char`, sets the character to align on
    charOff: null, // Several table elements. When `char`, offsets the alignment
    classId: null, // `<object>`
    clear: null, // `<br>`. Use CSS `clear` instead
    code: null, // `<object>`
    codeBase: null, // `<object>`
    codeType: null, // `<object>`
    color: null, // `<font>` and `<hr>`. Use CSS instead
    compact: boolean$1, // Lists. Use CSS to reduce space between items instead
    declare: boolean$1, // `<object>`
    event: null, // `<script>`
    face: null, // `<font>`. Use CSS instead
    frame: null, // `<table>`
    frameBorder: null, // `<iframe>`. Use CSS `border` instead
    hSpace: number$1, // `<img>` and `<object>`
    leftMargin: number$1, // `<body>`
    link: null, // `<body>`. Use CSS `a:link {color: *}` instead
    longDesc: null, // `<frame>`, `<iframe>`, and `<img>`. Use an `<a>`
    lowSrc: null, // `<img>`. Use a `<picture>`
    marginHeight: number$1, // `<body>`
    marginWidth: number$1, // `<body>`
    noResize: boolean$1, // `<frame>`
    noHref: boolean$1, // `<area>`. Use no href instead of an explicit `nohref`
    noShade: boolean$1, // `<hr>`. Use background-color and height instead of borders
    noWrap: boolean$1, // `<td>` and `<th>`
    object: null, // `<applet>`
    profile: null, // `<head>`
    prompt: null, // `<isindex>`
    rev: null, // `<link>`
    rightMargin: number$1, // `<body>`
    rules: null, // `<table>`
    scheme: null, // `<meta>`
    scrolling: booleanish, // `<frame>`. Use overflow in the child context
    standby: null, // `<object>`
    summary: null, // `<table>`
    text: null, // `<body>`. Use CSS `color` instead
    topMargin: number$1, // `<body>`
    valueType: null, // `<param>`
    version: null, // `<html>`. Use a doctype.
    vAlign: null, // Several. Use CSS `vertical-align` instead
    vLink: null, // `<body>`. Use CSS `a:visited {color}` instead
    vSpace: number$1, // `<img>` and `<object>`

    // Non-standard Properties.
    allowTransparency: null,
    autoCorrect: null,
    autoSave: null,
    disablePictureInPicture: boolean$1,
    disableRemotePlayback: boolean$1,
    prefix: null,
    property: null,
    results: number$1,
    security: null,
    unselectable: null
  }
});

var merge$1 = merge_1;
var xlink$1 = xlink$2;
var xml$1 = xml$2;
var xmlns$1 = xmlns$2;
var aria$1 = aria$2;
var html = html$1;

merge$1([xml$1, xlink$1, xmlns$1, aria$1, html]);

var types = types$4;
var create = create_1;
var caseSensitiveTransform = caseSensitiveTransform_1;

var boolean = types.boolean;
var number = types.number;
var spaceSeparated = types.spaceSeparated;
var commaSeparated = types.commaSeparated;
var commaOrSpaceSeparated = types.commaOrSpaceSeparated;

var svg$1 = create({
  space: 'svg',
  attributes: {
    accentHeight: 'accent-height',
    alignmentBaseline: 'alignment-baseline',
    arabicForm: 'arabic-form',
    baselineShift: 'baseline-shift',
    capHeight: 'cap-height',
    className: 'class',
    clipPath: 'clip-path',
    clipRule: 'clip-rule',
    colorInterpolation: 'color-interpolation',
    colorInterpolationFilters: 'color-interpolation-filters',
    colorProfile: 'color-profile',
    colorRendering: 'color-rendering',
    crossOrigin: 'crossorigin',
    dataType: 'datatype',
    dominantBaseline: 'dominant-baseline',
    enableBackground: 'enable-background',
    fillOpacity: 'fill-opacity',
    fillRule: 'fill-rule',
    floodColor: 'flood-color',
    floodOpacity: 'flood-opacity',
    fontFamily: 'font-family',
    fontSize: 'font-size',
    fontSizeAdjust: 'font-size-adjust',
    fontStretch: 'font-stretch',
    fontStyle: 'font-style',
    fontVariant: 'font-variant',
    fontWeight: 'font-weight',
    glyphName: 'glyph-name',
    glyphOrientationHorizontal: 'glyph-orientation-horizontal',
    glyphOrientationVertical: 'glyph-orientation-vertical',
    hrefLang: 'hreflang',
    horizAdvX: 'horiz-adv-x',
    horizOriginX: 'horiz-origin-x',
    horizOriginY: 'horiz-origin-y',
    imageRendering: 'image-rendering',
    letterSpacing: 'letter-spacing',
    lightingColor: 'lighting-color',
    markerEnd: 'marker-end',
    markerMid: 'marker-mid',
    markerStart: 'marker-start',
    navDown: 'nav-down',
    navDownLeft: 'nav-down-left',
    navDownRight: 'nav-down-right',
    navLeft: 'nav-left',
    navNext: 'nav-next',
    navPrev: 'nav-prev',
    navRight: 'nav-right',
    navUp: 'nav-up',
    navUpLeft: 'nav-up-left',
    navUpRight: 'nav-up-right',
    onAbort: 'onabort',
    onActivate: 'onactivate',
    onAfterPrint: 'onafterprint',
    onBeforePrint: 'onbeforeprint',
    onBegin: 'onbegin',
    onCancel: 'oncancel',
    onCanPlay: 'oncanplay',
    onCanPlayThrough: 'oncanplaythrough',
    onChange: 'onchange',
    onClick: 'onclick',
    onClose: 'onclose',
    onCopy: 'oncopy',
    onCueChange: 'oncuechange',
    onCut: 'oncut',
    onDblClick: 'ondblclick',
    onDrag: 'ondrag',
    onDragEnd: 'ondragend',
    onDragEnter: 'ondragenter',
    onDragExit: 'ondragexit',
    onDragLeave: 'ondragleave',
    onDragOver: 'ondragover',
    onDragStart: 'ondragstart',
    onDrop: 'ondrop',
    onDurationChange: 'ondurationchange',
    onEmptied: 'onemptied',
    onEnd: 'onend',
    onEnded: 'onended',
    onError: 'onerror',
    onFocus: 'onfocus',
    onFocusIn: 'onfocusin',
    onFocusOut: 'onfocusout',
    onHashChange: 'onhashchange',
    onInput: 'oninput',
    onInvalid: 'oninvalid',
    onKeyDown: 'onkeydown',
    onKeyPress: 'onkeypress',
    onKeyUp: 'onkeyup',
    onLoad: 'onload',
    onLoadedData: 'onloadeddata',
    onLoadedMetadata: 'onloadedmetadata',
    onLoadStart: 'onloadstart',
    onMessage: 'onmessage',
    onMouseDown: 'onmousedown',
    onMouseEnter: 'onmouseenter',
    onMouseLeave: 'onmouseleave',
    onMouseMove: 'onmousemove',
    onMouseOut: 'onmouseout',
    onMouseOver: 'onmouseover',
    onMouseUp: 'onmouseup',
    onMouseWheel: 'onmousewheel',
    onOffline: 'onoffline',
    onOnline: 'ononline',
    onPageHide: 'onpagehide',
    onPageShow: 'onpageshow',
    onPaste: 'onpaste',
    onPause: 'onpause',
    onPlay: 'onplay',
    onPlaying: 'onplaying',
    onPopState: 'onpopstate',
    onProgress: 'onprogress',
    onRateChange: 'onratechange',
    onRepeat: 'onrepeat',
    onReset: 'onreset',
    onResize: 'onresize',
    onScroll: 'onscroll',
    onSeeked: 'onseeked',
    onSeeking: 'onseeking',
    onSelect: 'onselect',
    onShow: 'onshow',
    onStalled: 'onstalled',
    onStorage: 'onstorage',
    onSubmit: 'onsubmit',
    onSuspend: 'onsuspend',
    onTimeUpdate: 'ontimeupdate',
    onToggle: 'ontoggle',
    onUnload: 'onunload',
    onVolumeChange: 'onvolumechange',
    onWaiting: 'onwaiting',
    onZoom: 'onzoom',
    overlinePosition: 'overline-position',
    overlineThickness: 'overline-thickness',
    paintOrder: 'paint-order',
    panose1: 'panose-1',
    pointerEvents: 'pointer-events',
    referrerPolicy: 'referrerpolicy',
    renderingIntent: 'rendering-intent',
    shapeRendering: 'shape-rendering',
    stopColor: 'stop-color',
    stopOpacity: 'stop-opacity',
    strikethroughPosition: 'strikethrough-position',
    strikethroughThickness: 'strikethrough-thickness',
    strokeDashArray: 'stroke-dasharray',
    strokeDashOffset: 'stroke-dashoffset',
    strokeLineCap: 'stroke-linecap',
    strokeLineJoin: 'stroke-linejoin',
    strokeMiterLimit: 'stroke-miterlimit',
    strokeOpacity: 'stroke-opacity',
    strokeWidth: 'stroke-width',
    tabIndex: 'tabindex',
    textAnchor: 'text-anchor',
    textDecoration: 'text-decoration',
    textRendering: 'text-rendering',
    typeOf: 'typeof',
    underlinePosition: 'underline-position',
    underlineThickness: 'underline-thickness',
    unicodeBidi: 'unicode-bidi',
    unicodeRange: 'unicode-range',
    unitsPerEm: 'units-per-em',
    vAlphabetic: 'v-alphabetic',
    vHanging: 'v-hanging',
    vIdeographic: 'v-ideographic',
    vMathematical: 'v-mathematical',
    vectorEffect: 'vector-effect',
    vertAdvY: 'vert-adv-y',
    vertOriginX: 'vert-origin-x',
    vertOriginY: 'vert-origin-y',
    wordSpacing: 'word-spacing',
    writingMode: 'writing-mode',
    xHeight: 'x-height',
    // These were camelcased in Tiny. Now lowercased in SVG 2
    playbackOrder: 'playbackorder',
    timelineBegin: 'timelinebegin'
  },
  transform: caseSensitiveTransform,
  properties: {
    about: commaOrSpaceSeparated,
    accentHeight: number,
    accumulate: null,
    additive: null,
    alignmentBaseline: null,
    alphabetic: number,
    amplitude: number,
    arabicForm: null,
    ascent: number,
    attributeName: null,
    attributeType: null,
    azimuth: number,
    bandwidth: null,
    baselineShift: null,
    baseFrequency: null,
    baseProfile: null,
    bbox: null,
    begin: null,
    bias: number,
    by: null,
    calcMode: null,
    capHeight: number,
    className: spaceSeparated,
    clip: null,
    clipPath: null,
    clipPathUnits: null,
    clipRule: null,
    color: null,
    colorInterpolation: null,
    colorInterpolationFilters: null,
    colorProfile: null,
    colorRendering: null,
    content: null,
    contentScriptType: null,
    contentStyleType: null,
    crossOrigin: null,
    cursor: null,
    cx: null,
    cy: null,
    d: null,
    dataType: null,
    defaultAction: null,
    descent: number,
    diffuseConstant: number,
    direction: null,
    display: null,
    dur: null,
    divisor: number,
    dominantBaseline: null,
    download: boolean,
    dx: null,
    dy: null,
    edgeMode: null,
    editable: null,
    elevation: number,
    enableBackground: null,
    end: null,
    event: null,
    exponent: number,
    externalResourcesRequired: null,
    fill: null,
    fillOpacity: number,
    fillRule: null,
    filter: null,
    filterRes: null,
    filterUnits: null,
    floodColor: null,
    floodOpacity: null,
    focusable: null,
    focusHighlight: null,
    fontFamily: null,
    fontSize: null,
    fontSizeAdjust: null,
    fontStretch: null,
    fontStyle: null,
    fontVariant: null,
    fontWeight: null,
    format: null,
    fr: null,
    from: null,
    fx: null,
    fy: null,
    g1: commaSeparated,
    g2: commaSeparated,
    glyphName: commaSeparated,
    glyphOrientationHorizontal: null,
    glyphOrientationVertical: null,
    glyphRef: null,
    gradientTransform: null,
    gradientUnits: null,
    handler: null,
    hanging: number,
    hatchContentUnits: null,
    hatchUnits: null,
    height: null,
    href: null,
    hrefLang: null,
    horizAdvX: number,
    horizOriginX: number,
    horizOriginY: number,
    id: null,
    ideographic: number,
    imageRendering: null,
    initialVisibility: null,
    in: null,
    in2: null,
    intercept: number,
    k: number,
    k1: number,
    k2: number,
    k3: number,
    k4: number,
    kernelMatrix: commaOrSpaceSeparated,
    kernelUnitLength: null,
    keyPoints: null, // SEMI_COLON_SEPARATED
    keySplines: null, // SEMI_COLON_SEPARATED
    keyTimes: null, // SEMI_COLON_SEPARATED
    kerning: null,
    lang: null,
    lengthAdjust: null,
    letterSpacing: null,
    lightingColor: null,
    limitingConeAngle: number,
    local: null,
    markerEnd: null,
    markerMid: null,
    markerStart: null,
    markerHeight: null,
    markerUnits: null,
    markerWidth: null,
    mask: null,
    maskContentUnits: null,
    maskUnits: null,
    mathematical: null,
    max: null,
    media: null,
    mediaCharacterEncoding: null,
    mediaContentEncodings: null,
    mediaSize: number,
    mediaTime: null,
    method: null,
    min: null,
    mode: null,
    name: null,
    navDown: null,
    navDownLeft: null,
    navDownRight: null,
    navLeft: null,
    navNext: null,
    navPrev: null,
    navRight: null,
    navUp: null,
    navUpLeft: null,
    navUpRight: null,
    numOctaves: null,
    observer: null,
    offset: null,
    onAbort: null,
    onActivate: null,
    onAfterPrint: null,
    onBeforePrint: null,
    onBegin: null,
    onCancel: null,
    onCanPlay: null,
    onCanPlayThrough: null,
    onChange: null,
    onClick: null,
    onClose: null,
    onCopy: null,
    onCueChange: null,
    onCut: null,
    onDblClick: null,
    onDrag: null,
    onDragEnd: null,
    onDragEnter: null,
    onDragExit: null,
    onDragLeave: null,
    onDragOver: null,
    onDragStart: null,
    onDrop: null,
    onDurationChange: null,
    onEmptied: null,
    onEnd: null,
    onEnded: null,
    onError: null,
    onFocus: null,
    onFocusIn: null,
    onFocusOut: null,
    onHashChange: null,
    onInput: null,
    onInvalid: null,
    onKeyDown: null,
    onKeyPress: null,
    onKeyUp: null,
    onLoad: null,
    onLoadedData: null,
    onLoadedMetadata: null,
    onLoadStart: null,
    onMessage: null,
    onMouseDown: null,
    onMouseEnter: null,
    onMouseLeave: null,
    onMouseMove: null,
    onMouseOut: null,
    onMouseOver: null,
    onMouseUp: null,
    onMouseWheel: null,
    onOffline: null,
    onOnline: null,
    onPageHide: null,
    onPageShow: null,
    onPaste: null,
    onPause: null,
    onPlay: null,
    onPlaying: null,
    onPopState: null,
    onProgress: null,
    onRateChange: null,
    onRepeat: null,
    onReset: null,
    onResize: null,
    onScroll: null,
    onSeeked: null,
    onSeeking: null,
    onSelect: null,
    onShow: null,
    onStalled: null,
    onStorage: null,
    onSubmit: null,
    onSuspend: null,
    onTimeUpdate: null,
    onToggle: null,
    onUnload: null,
    onVolumeChange: null,
    onWaiting: null,
    onZoom: null,
    opacity: null,
    operator: null,
    order: null,
    orient: null,
    orientation: null,
    origin: null,
    overflow: null,
    overlay: null,
    overlinePosition: number,
    overlineThickness: number,
    paintOrder: null,
    panose1: null,
    path: null,
    pathLength: number,
    patternContentUnits: null,
    patternTransform: null,
    patternUnits: null,
    phase: null,
    ping: spaceSeparated,
    pitch: null,
    playbackOrder: null,
    pointerEvents: null,
    points: null,
    pointsAtX: number,
    pointsAtY: number,
    pointsAtZ: number,
    preserveAlpha: null,
    preserveAspectRatio: null,
    primitiveUnits: null,
    propagate: null,
    property: commaOrSpaceSeparated,
    r: null,
    radius: null,
    referrerPolicy: null,
    refX: null,
    refY: null,
    rel: commaOrSpaceSeparated,
    rev: commaOrSpaceSeparated,
    renderingIntent: null,
    repeatCount: null,
    repeatDur: null,
    requiredExtensions: commaOrSpaceSeparated,
    requiredFeatures: commaOrSpaceSeparated,
    requiredFonts: commaOrSpaceSeparated,
    requiredFormats: commaOrSpaceSeparated,
    resource: null,
    restart: null,
    result: null,
    rotate: null,
    rx: null,
    ry: null,
    scale: null,
    seed: null,
    shapeRendering: null,
    side: null,
    slope: null,
    snapshotTime: null,
    specularConstant: number,
    specularExponent: number,
    spreadMethod: null,
    spacing: null,
    startOffset: null,
    stdDeviation: null,
    stemh: null,
    stemv: null,
    stitchTiles: null,
    stopColor: null,
    stopOpacity: null,
    strikethroughPosition: number,
    strikethroughThickness: number,
    string: null,
    stroke: null,
    strokeDashArray: commaOrSpaceSeparated,
    strokeDashOffset: null,
    strokeLineCap: null,
    strokeLineJoin: null,
    strokeMiterLimit: number,
    strokeOpacity: number,
    strokeWidth: null,
    style: null,
    surfaceScale: number,
    syncBehavior: null,
    syncBehaviorDefault: null,
    syncMaster: null,
    syncTolerance: null,
    syncToleranceDefault: null,
    systemLanguage: commaOrSpaceSeparated,
    tabIndex: number,
    tableValues: null,
    target: null,
    targetX: number,
    targetY: number,
    textAnchor: null,
    textDecoration: null,
    textRendering: null,
    textLength: null,
    timelineBegin: null,
    title: null,
    transformBehavior: null,
    type: null,
    typeOf: commaOrSpaceSeparated,
    to: null,
    transform: null,
    u1: null,
    u2: null,
    underlinePosition: number,
    underlineThickness: number,
    unicode: null,
    unicodeBidi: null,
    unicodeRange: null,
    unitsPerEm: number,
    values: null,
    vAlphabetic: number,
    vMathematical: number,
    vectorEffect: null,
    vHanging: number,
    vIdeographic: number,
    version: null,
    vertAdvY: number,
    vertOriginX: number,
    vertOriginY: number,
    viewBox: null,
    viewTarget: null,
    visibility: null,
    width: null,
    widths: null,
    wordSpacing: null,
    writingMode: null,
    x: null,
    x1: null,
    x2: null,
    xChannelSelector: null,
    xHeight: number,
    y: null,
    y1: null,
    y2: null,
    yChannelSelector: null,
    z: null,
    zoomAndPan: null
  }
});

var merge = merge_1;
var xlink = xlink$2;
var xml = xml$2;
var xmlns = xmlns$2;
var aria = aria$2;
var svg = svg$1;

merge([xml, xlink, xmlns, aria, svg]);

/**
 * Convert a value to an ESTree node
 *
 * @param value - The value to convert
 * @param options - Additional options to configure the output.
 * @returns The ESTree node.
 */
function valueToEstree(value, options = {}) {
    if (value === undefined) {
        return { type: "Identifier", name: "undefined" };
    }
    if (value == null) {
        return { type: "Literal", value: null, raw: "null" };
    }
    if (value === Number.POSITIVE_INFINITY) {
        return { type: "Identifier", name: "Infinity" };
    }
    if (Number.isNaN(value)) {
        return { type: "Identifier", name: "NaN" };
    }
    if (typeof value === "boolean") {
        return { type: "Literal", value, raw: String(value) };
    }
    if (typeof value === "bigint") {
        return value >= 0
            ? {
                type: "Literal",
                value,
                raw: `${value}n`,
                bigint: String(value),
            }
            : {
                type: "UnaryExpression",
                operator: "-",
                prefix: true,
                argument: valueToEstree(-value, options),
            };
    }
    if (typeof value === "number") {
        return value >= 0
            ? { type: "Literal", value, raw: String(value) }
            : {
                type: "UnaryExpression",
                operator: "-",
                prefix: true,
                argument: valueToEstree(-value, options),
            };
    }
    if (typeof value === "string") {
        return {
            type: "Literal",
            value,
            raw: JSON.stringify(value),
        };
    }
    if (typeof value === "symbol") {
        if (value.description &&
            value === Symbol.for(value.description)) {
            return {
                type: "CallExpression",
                optional: false,
                callee: {
                    type: "MemberExpression",
                    computed: false,
                    optional: false,
                    object: { type: "Identifier", name: "Symbol" },
                    property: { type: "Identifier", name: "for" },
                },
                arguments: [
                    valueToEstree(value.description, options),
                ],
            };
        }
        throw new TypeError(`Only global symbols are supported, got: ${String(value)}`);
    }
    if (Array.isArray(value)) {
        const elements = [];
        for (let i = 0; i < value.length; i += 1) {
            elements.push(i in value ? valueToEstree(value[i], options) : null);
        }
        return { type: "ArrayExpression", elements };
    }
    if (value instanceof RegExp) {
        return {
            type: "Literal",
            value,
            raw: String(value),
            regex: { pattern: value.source, flags: value.flags },
        };
    }
    if (value instanceof Date) {
        return {
            type: "NewExpression",
            callee: { type: "Identifier", name: "Date" },
            arguments: [valueToEstree(value.getTime(), options)],
        };
    }
    if (value instanceof Map) {
        return {
            type: "NewExpression",
            callee: { type: "Identifier", name: "Map" },
            arguments: [
                valueToEstree([...value.entries()], options),
            ],
        };
    }
    if (
    // https://github.com/code-hike/codehike/issues/194
    // value instanceof BigInt64Array ||
    // value instanceof BigUint64Array ||
    value instanceof Float32Array ||
        value instanceof Float64Array ||
        value instanceof Int8Array ||
        value instanceof Int16Array ||
        value instanceof Int32Array ||
        value instanceof Set ||
        value instanceof Uint8Array ||
        value instanceof Uint8ClampedArray ||
        value instanceof Uint16Array ||
        value instanceof Uint32Array) {
        return {
            type: "NewExpression",
            callee: {
                type: "Identifier",
                name: value.constructor.name,
            },
            arguments: [valueToEstree([...value], options)],
        };
    }
    if (value instanceof URL ||
        value instanceof URLSearchParams) {
        return {
            type: "NewExpression",
            callee: {
                type: "Identifier",
                name: value.constructor.name,
            },
            arguments: [valueToEstree(String(value), options)],
        };
    }
    if (options.instanceAsObject || isPlainObj(value)) {
        // if ((value as any)?.name === MDX_CHILDREN) {
        //   const tree = { ...(value as any) }
        //   tree.name = null
        //   return (mdastToEstree(tree) as any).body[0].expression
        // }
        if ((value === null || value === void 0 ? void 0 : value.type) ===
            "mdxJsxAttributeValueExpression") {
            return value.data.estree.body[0].expression;
        }
        return {
            type: "ObjectExpression",
            properties: Object.entries(value).map(([name, val]) => ({
                type: "Property",
                method: false,
                shorthand: false,
                computed: false,
                kind: "init",
                key: valueToEstree(name, options),
                value: valueToEstree(val, options),
            })),
        };
    }
    const isAnnotation = Object.values(annotationsMap).includes(value);
    // code hike annotations patch
    if (isAnnotation) {
        const identifier = Object.keys(annotationsMap).find(key => annotationsMap[key] === value);
        return {
            type: "MemberExpression",
            object: {
                type: "MemberExpression",
                object: {
                    type: "Identifier",
                    name: "CH",
                },
                property: {
                    type: "Identifier",
                    name: "annotations",
                },
                computed: false,
                optional: false,
            },
            property: {
                type: "Identifier",
                name: identifier,
            },
            computed: false,
            optional: false,
        };
    }
    throw new TypeError(`Unsupported value: ${String(value)}`);
}
const MDX_CHILDREN = "MDX_CHILDREN";
function wrapChildren(children) {
    const tree = {
        type: "mdxJsxFlowElement",
        children,
        name: MDX_CHILDREN,
    };
    return tree;
}

function splitChildren(parent, type) {
    const splits = [];
    let i = 0;
    parent.children.forEach((node, index) => {
        if (node.type === type) {
            i++;
        }
        else {
            if (!splits[i]) {
                splits[i] = [];
            }
            splits[i].push({ node, index, parent });
        }
    });
    return splits;
}
function visitAsync(tree, type, visitor) {
    return __awaiter(this, void 0, void 0, function* () {
        const promises = [];
        visit(tree, type, (node, index, parent) => {
            const result = visitor(node, index, parent);
            if (result) {
                promises.push(result);
            }
        });
        yield Promise.all(promises);
    });
}
const CH_CODE_CONFIG_VAR_NAME = "chCodeConfig";
/**
 * Transforms a node into a JSX Flow ELement (or another given type).
 * Most of the work is transforming the props object into an array
 * of mdxJsxAttribute.
 */
function toJSX(node, { type = "mdxJsxFlowElement", props, name, appendProps = false, addConfigProp = false, }) {
    node.type = type;
    if (name) {
        node.name = name;
    }
    if (!appendProps) {
        node.attributes = [];
    }
    else {
        node.attributes = node.attributes || [];
    }
    // if (addClientLoad) {
    //   node.attributes.push({
    //     type: "mdxJsxAttribute",
    //     name: "client:load",
    //     value: null,
    //   })
    // }
    if (addConfigProp) {
        node.attributes.push(toAttribute("codeConfig", CH_CODE_CONFIG_VAR_NAME, {
            type: "Identifier",
            name: CH_CODE_CONFIG_VAR_NAME,
        }));
    }
    Object.keys(props).forEach(key => {
        if (props[key] === undefined) {
            return;
        }
        node.attributes.push(toAttribute(key, JSON.stringify(props[key]), valueToEstree(props[key])));
    });
}
function toAttribute(key, stringValue, expression) {
    return {
        type: "mdxJsxAttribute",
        name: key,
        value: {
            type: "mdxJsxAttributeValueExpression",
            value: stringValue,
            data: {
                estree: {
                    type: "Program",
                    body: [
                        {
                            type: "ExpressionStatement",
                            expression: expression,
                        },
                    ],
                    sourceType: "module",
                },
            },
        },
    };
}

const newlineRe = /\r\n|\r|\n/;
function highlight({ code, lang, theme, }) {
    return __awaiter(this, void 0, void 0, function* () {
        if (lang === "text") {
            const lines = code ? code.split(newlineRe) : [""];
            return {
                lines: lines.map(line => ({
                    tokens: [{ content: line, props: {} }],
                })),
                lang,
            };
        }
        const r = yield highlight$1(code, lang, theme);
        const lines = r.lines.map(line => ({
            tokens: line.map(token => ({
                content: token.content,
                props: { style: token.style },
            })),
        }));
        return { lines, lang };
    });
}

const validKeys = [
    "focus",
    "from",
    ...Object.keys(annotationsMap),
];
function getCommentData(line, lang) {
    const result = bashLikeLangs.includes(lang)
        ? bashLikeComment(line)
        : otherComment(line);
    if (!result) {
        return {};
    }
    const [, key, focusString, data] = result;
    if (!validKeys.includes(key)) {
        return {};
    }
    return {
        key,
        focusString,
        data,
    };
}
function getTextAfter(line, prefix) {
    const firstIndex = line.tokens.findIndex(t => t.content.trim().startsWith(prefix));
    if (firstIndex === -1) {
        return undefined;
    }
    return line.tokens
        .slice(firstIndex)
        .map(t => t.content)
        .join("");
}
const commentRegex = /\/\/\s+(\w+)(\S*)\s*(.*)/;
function otherComment(line) {
    const comment = getTextAfter(line, "//");
    if (!comment) {
        return [];
    }
    const result = commentRegex.exec(comment);
    if (!result) {
        return [];
    }
    return result;
}
const bashLikeLangs = [
    "bash",
    "sh",
    "shell",
    "python",
    "py",
];
const bashLikeCommentRegex = /#\s+(\w+)(\S*)\s*(.*)/;
function bashLikeComment(line) {
    const comment = getTextAfter(line, "#");
    if (!comment) {
        return [];
    }
    const result = bashLikeCommentRegex.exec(comment);
    if (!result) {
        return [];
    }
    return result;
}

function getAnnotationsFromMetastring(options) {
    const annotations = [];
    Object.keys(options).forEach(key => {
        const Component = annotationsMap[key];
        if (Component) {
            annotations === null || annotations === void 0 ? void 0 : annotations.push({ focus: options[key], Component });
        }
    });
    return annotations;
}
function extractAnnotationsFromCode(code) {
    const { lines } = code;
    let lineNumber = 1;
    const annotations = [];
    const focusList = [];
    while (lineNumber <= lines.length) {
        const line = lines[lineNumber - 1];
        const { key, focusString, data } = getCommentData(line, code.lang);
        const Component = annotationsMap[key];
        if (Component) {
            const focus = relativeToAbsolute(focusString, lineNumber);
            lines.splice(lineNumber - 1, 1);
            annotations.push({ Component, focus, data });
        }
        else if (key === "focus") {
            const focus = relativeToAbsolute(focusString, lineNumber);
            lines.splice(lineNumber - 1, 1);
            focusList.push(focus);
        }
        else {
            lineNumber++;
        }
    }
    return [annotations, focusList.join(",")];
}
function extractJSXAnnotations(node, index, parent) {
    const annotations = [];
    const nextIndex = index + 1;
    while (parent.children[nextIndex] &&
        parent.children[nextIndex].type ===
            "mdxJsxFlowElement" &&
        parent.children[nextIndex].name ===
            "CH.Annotation") {
        const jsxAnnotation = parent.children[nextIndex];
        // copy attributes to props
        const props = {};
        jsxAnnotation.attributes.forEach((attr) => {
            props[attr.name] = attr.value;
        });
        const { as, focus } = props, data = __rest(props, ["as", "focus"]);
        data.children = wrapChildren(jsxAnnotation.children || []);
        const Component = annotationsMap[as] || as;
        annotations.push({
            Component,
            focus,
            data: isEmpty$1(data) ? undefined : data,
        });
        parent.children.splice(nextIndex, 1);
    }
    return annotations;
}
function isEmpty$1(obj) {
    return Object.keys(obj).length === 0;
}

function isEditorNode(node, config) {
    if (node.type === "code") {
        const lang = node.lang || "";
        const shouldSkip = config.skipLanguages.includes(lang);
        return !shouldSkip;
    }
    return (node.type === "mdxJsxFlowElement" &&
        node.name === "CH.Code");
}
function mapAnyCodeNode(nodeInfo, config) {
    return __awaiter(this, void 0, void 0, function* () {
        const { node } = nodeInfo;
        if (node.type === "code") {
            return mapCode(nodeInfo, config);
        }
        else {
            return mapEditor(nodeInfo, config);
        }
    });
}
function mapCode(nodeInfo, config) {
    return __awaiter(this, void 0, void 0, function* () {
        const file = yield mapFile(nodeInfo, config);
        const props = {
            northPanel: {
                tabs: [file.name],
                active: file.name,
                heightRatio: 1,
            },
            files: [file],
        };
        return props;
    });
}
function mapEditor({ node }, config) {
    return __awaiter(this, void 0, void 0, function* () {
        const [northNodes, southNodes = []] = splitChildren(node, "thematicBreak");
        const northFiles = yield Promise.all(northNodes
            .filter(({ node }) => node.type === "code")
            .map((nodeInfo) => mapFile(nodeInfo, config)));
        const southFiles = yield Promise.all(southNodes
            .filter(({ node }) => node.type === "code")
            .map((nodeInfo) => mapFile(nodeInfo, config)));
        const allFiles = [...northFiles, ...southFiles];
        const northActive = northFiles.find(f => f.active) || northFiles[0];
        const southActive = southFiles.length
            ? southFiles.find(f => f.active) || southFiles[0]
            : null;
        const northLines = northActive.code.lines.length || 1;
        const southLines = (southActive === null || southActive === void 0 ? void 0 : southActive.code.lines.length) || 0;
        const northRatio = southActive
            ? (northLines + 2) / (southLines + northLines + 4)
            : 1;
        const southRatio = 1 - northRatio;
        const props = {
            northPanel: {
                tabs: northFiles.map(x => x.name),
                active: northActive.name,
                heightRatio: northRatio,
            },
            southPanel: southFiles.length
                ? {
                    tabs: southFiles.map(x => x.name),
                    active: southActive.name,
                    heightRatio: southRatio,
                }
                : undefined,
            files: allFiles,
        };
        return props;
    });
}
function mapFile({ node, index, parent }, config) {
    return __awaiter(this, void 0, void 0, function* () {
        const { theme } = config;
        const lang = node.lang || "text";
        let code = yield highlight({
            code: node.value,
            lang,
            theme,
        });
        // if the code is a single line with a "from" annotation
        code = yield getCodeFromExternalFileIfNeeded(code, config);
        const [commentAnnotations, commentFocus] = extractAnnotationsFromCode(code);
        const options = parseMetastring(typeof node.meta === "string" ? node.meta : "");
        const metaAnnotations = getAnnotationsFromMetastring(options);
        // const linkAnnotations = extractLinks(
        //   node,
        //   index,
        //   parent,
        //   nodeValue as string
        // )
        const jsxAnnotations = extractJSXAnnotations(node, index, parent);
        const file = Object.assign(Object.assign({}, options), { focus: mergeFocus(options.focus, commentFocus), code, name: options.name || "", annotations: [
                ...metaAnnotations,
                ...commentAnnotations,
                ...jsxAnnotations,
            ] });
        return file;
    });
}
function parseMetastring(metastring) {
    const params = metastring.split(" ");
    const options = {};
    let name = null;
    params.forEach(param => {
        const [key, value] = param.split("=");
        if (value != null) {
            options[key] = value;
        }
        else if (name === null) {
            name = key;
        }
        else {
            options[key] = true;
        }
    });
    return Object.assign({ name: name || "" }, options);
}
function getCodeFromExternalFileIfNeeded(code, config) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (((_a = code === null || code === void 0 ? void 0 : code.lines) === null || _a === void 0 ? void 0 : _a.length) != 1) {
            return code;
        }
        const firstLine = code.lines[0];
        const commentData = getCommentData(firstLine, code.lang);
        if (!commentData || commentData.key != "from") {
            return code;
        }
        const fileText = firstLine.tokens
            .map(t => t.content)
            .join("");
        const codepath = commentData.data;
        let fs, path;
        try {
            fs = (yield import('fs')).default;
            path = (yield import('path')).default;
            if (!fs || !fs.readFileSync || !path || !path.resolve) {
                throw new Error("fs or path not found");
            }
        }
        catch (e) {
            e.message = `Code Hike couldn't resolve this annotation:
${fileText}
Looks like node "fs" and "path" modules are not available.`;
            throw e;
        }
        // if we don't know the path of the mdx file:
        if (config.filepath === undefined) {
            throw new Error(`Code Hike couldn't resolve this annotation:
  ${fileText}
  Someone is calling the mdx compile function without setting the path.
  Open an issue on CodeHike's repo for help.`);
        }
        const dir = path.dirname(config.filepath);
        const absoluteCodepath = path.resolve(dir, codepath);
        let nodeValue;
        try {
            nodeValue = fs.readFileSync(absoluteCodepath, "utf8");
        }
        catch (e) {
            e.message = `Code Hike couldn't resolve this annotation:
${fileText}
${absoluteCodepath} doesn't exist.`;
            throw e;
        }
        return yield highlight({
            code: nodeValue,
            lang: code.lang,
            theme: config.theme,
        });
    });
}

function transformCodes(tree, config) {
    return __awaiter(this, void 0, void 0, function* () {
        yield visitAsync(tree, "mdxJsxFlowElement", (node, index, parent) => __awaiter(this, void 0, void 0, function* () {
            if (node.name === "CH.Code") {
                yield transformCode({ node, index, parent }, config);
            }
        }));
        yield visitAsync(tree, "code", (node, index, parent) => __awaiter(this, void 0, void 0, function* () {
            // here we check if we should skip it because of the language:
            if (isEditorNode(node, config)) {
                yield transformCode({ node, index, parent }, config);
            }
        }));
    });
}
function transformCode(nodeInfo, config) {
    return __awaiter(this, void 0, void 0, function* () {
        toJSX(nodeInfo.node, {
            name: "CH.Code",
            props: yield mapAnyCodeNode(nodeInfo, config),
            appendProps: true,
            addConfigProp: true,
        });
    });
}

function transformSections(tree, config) {
    return __awaiter(this, void 0, void 0, function* () {
        yield visitAsync(tree, "mdxJsxFlowElement", (sectionNode) => __awaiter(this, void 0, void 0, function* () {
            if (sectionNode.name === "CH.Section") {
                yield transformSection(sectionNode, config);
            }
        }));
    });
}
function transformSection(node, config) {
    return __awaiter(this, void 0, void 0, function* () {
        let props;
        yield visitAsync(node, ["mdxJsxFlowElement", "code"], (editorNode, index, parent) => __awaiter(this, void 0, void 0, function* () {
            if (isEditorNode(editorNode, config)) {
                props = yield mapAnyCodeNode({ node: editorNode, index, parent }, config);
                toJSX(editorNode, {
                    name: "CH.SectionCode",
                    appendProps: true,
                    props: {},
                });
            }
        }));
        node.data = { editorStep: props };
        transformLinks(node);
        if (props) {
            toJSX(node, {
                name: "CH.Section",
                props: props,
                addConfigProp: true,
                appendProps: true,
            });
        }
        else {
            toJSX(node, { name: "div", props: {} });
        }
    });
}
function transformLinks(tree) {
    visit(tree, "link", (linkNode) => {
        const url = decodeURI(linkNode["url"]);
        if (url.startsWith("focus://")) {
            const [firstPart, secondPart] = decodeURI(url)
                .substr("focus://".length)
                .split("#");
            const hasFile = Boolean(secondPart);
            const props = hasFile
                ? { file: firstPart, focus: secondPart, id: url }
                : { focus: firstPart, id: url };
            toJSX(linkNode, {
                type: "mdxJsxTextElement",
                name: "CH.SectionLink",
                props,
            });
        }
    });
}

// extend steps with info from previous steps
/**
 * Extends `extraStep` with info from `baseStep`.
 *
 * @param baseStep it could be the header step or the previous step
 * @param step the step to be extended
 * @param filter if it is defined, show only the files in the array.
 *
 */
function reduceStep(baseStep, step, filter) {
    let files = reduceFiles(baseStep.files, step.files);
    const newNorthPanel = reducePanel(baseStep.northPanel, step.northPanel, step.southPanel);
    const newSouthPanel = reducePanel(baseStep.southPanel, step.southPanel, step.northPanel);
    if (filter) {
        newNorthPanel.tabs = newNorthPanel.tabs.filter(filename => filter.includes(filename));
        if (newSouthPanel) {
            newNorthPanel.tabs = newNorthPanel.tabs.filter(filename => filter.includes(filename));
        }
    }
    return Object.assign(Object.assign(Object.assign({}, baseStep), step), { files: files, northPanel: newNorthPanel, southPanel: newSouthPanel });
}
function reducePanel(oldPanel, newPanel, otherNewPanel) {
    var _a, _b;
    if (!newPanel) {
        return newPanel;
    }
    const oldTabsStillThere = ((_a = oldPanel === null || oldPanel === void 0 ? void 0 : oldPanel.tabs) === null || _a === void 0 ? void 0 : _a.filter(name => { var _a; return !((_a = otherNewPanel === null || otherNewPanel === void 0 ? void 0 : otherNewPanel.tabs) === null || _a === void 0 ? void 0 : _a.includes(name)); })) || [];
    const realNewTabs = ((_b = newPanel === null || newPanel === void 0 ? void 0 : newPanel.tabs) === null || _b === void 0 ? void 0 : _b.filter(name => { var _a; return !((_a = oldPanel === null || oldPanel === void 0 ? void 0 : oldPanel.tabs) === null || _a === void 0 ? void 0 : _a.includes(name)); })) || [];
    return Object.assign(Object.assign(Object.assign({}, oldPanel), newPanel), { tabs: [...oldTabsStillThere, ...realNewTabs] });
}
function reduceFiles(oldFiles, newFiles) {
    const filesMap = {};
    oldFiles.forEach(f => (filesMap[f.name] = f));
    newFiles.forEach(newFile => {
        const prevFile = filesMap[newFile.name];
        if (!prevFile) {
            filesMap[newFile.name] = newFile;
            return;
        }
        // if the file is in both arrays, merge the content
        // but if the new file is empty, keep the old content
        const { code } = newFile, rest = __rest(newFile, ["code"]);
        if (isEmpty(code)) {
            filesMap[newFile.name] = Object.assign(Object.assign({}, prevFile), rest);
        }
        else {
            filesMap[newFile.name] = newFile;
        }
    });
    // return a new array following the original order:
    // first the old files, then the new ones
    const result = [];
    oldFiles.forEach(f => {
        result.push(filesMap[f.name]);
        delete filesMap[f.name];
    });
    newFiles.forEach(f => filesMap[f.name] && result.push(filesMap[f.name]));
    return result;
}
function isEmpty(code) {
    const anyContent = code.lines.some(l => l.tokens.some(t => t.content.trim() !== ""));
    return !anyContent;
}

function getPresetConfig(attributes) {
    return __awaiter(this, void 0, void 0, function* () {
        // todo add cache
        const presetAttribute = attributes === null || attributes === void 0 ? void 0 : attributes.find((attr) => attr.name === "preset");
        if (!presetAttribute)
            return undefined;
        const url = presetAttribute.value;
        const prefix = "https://codesandbox.io/s/";
        const csbid = url.slice(prefix.length);
        const configUrl = `https://codesandbox.io/api/v1/sandboxes/${csbid}/sandpack`;
        const { default: fetch } = yield import('node-fetch');
        const res = yield fetch(configUrl);
        return yield res.json();
    });
}
function transformPreviews(tree) {
    return __awaiter(this, void 0, void 0, function* () {
        yield visitAsync(tree, "mdxJsxFlowElement", (node) => __awaiter(this, void 0, void 0, function* () {
            if (node.name === "CH.Preview") {
                yield transformPreview(node);
            }
        }));
    });
}
function transformPreview(node) {
    return __awaiter(this, void 0, void 0, function* () {
        toJSX(node, {
            props: {},
            appendProps: true,
            addConfigProp: true,
        });
    });
}

// extract step info
function extractStepsInfo(parent, config, merge) {
    return __awaiter(this, void 0, void 0, function* () {
        const steps = [];
        const presetConfig = yield getPresetConfig(parent.attributes);
        let stepIndex = 0;
        const children = parent.children || [];
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            if (child.type === "thematicBreak") {
                stepIndex++;
                continue;
            }
            steps[stepIndex] = steps[stepIndex] || { children: [] };
            const step = steps[stepIndex];
            if (!step.editorStep && isEditorNode(child, config)) {
                const editorStep = yield mapAnyCodeNode({ node: child, parent, index: i }, config);
                const filter = getFilterFromEditorNode(child);
                if (stepIndex === 0) {
                    // for the header props, keep it as it is
                    step.editorStep = editorStep;
                }
                else {
                    // for the rest, merge the editor step with the header step or the prev step
                    const baseStep = merge === "merge steps with header"
                        ? steps[0].editorStep
                        : previousEditorStep(steps, stepIndex);
                    step.editorStep = reduceStep(baseStep, editorStep, filter);
                }
                step.children.push({
                    type: "mdxJsxFlowElement",
                    name: "CH.CodeSlot",
                });
            }
            else if (child.type === "mdxJsxFlowElement" &&
                child.name === "CH.Preview" &&
                // only add the preview if we have a preview in step 0
                (stepIndex === 0 ||
                    steps[0].previewStep != null ||
                    // or there is a global sandpack preset
                    presetConfig)) {
                step.previewStep = child;
                step.children.push({
                    type: "mdxJsxFlowElement",
                    name: "CH.PreviewSlot",
                });
            }
            else {
                step.children.push(child);
            }
        }
        parent.children = steps.map(step => {
            return {
                type: "mdxJsxFlowElement",
                children: step.children,
                data: { editorStep: step.editorStep },
            };
        });
        const hasPreviewSteps = steps[0].previewStep !== undefined || presetConfig;
        // if there is a CH.Preview in the first step or a preset config
        // build the previewStep list
        if (hasPreviewSteps) {
            const previewSteps = steps.map(step => step.previewStep);
            // fill empties with base step
            previewSteps.forEach((previewStep, i) => {
                if (!previewStep) {
                    if (presetConfig) {
                        // we fill the hole with a placeholder
                        previewSteps[i] = { type: "mdxJsxFlowElement" };
                    }
                    else {
                        previewSteps[i] =
                            merge === "merge steps with header"
                                ? previewSteps[0]
                                : previewSteps[i - 1];
                    }
                }
            });
            parent.children = parent.children.concat(previewSteps);
        }
        // fill editor steps holes
        const editorSteps = steps.map(step => step.editorStep);
        editorSteps.forEach((editorStep, i) => {
            if (!editorStep) {
                editorSteps[i] =
                    merge === "merge steps with header"
                        ? editorSteps[0]
                        : editorSteps[i - 1];
            }
        });
        return {
            editorSteps,
            hasPreviewSteps,
            presetConfig,
        };
    });
}
function previousEditorStep(steps, index) {
    if (index === 0) {
        throw new Error("The first step should have some code");
    }
    return (steps[index - 1].editorStep ||
        previousEditorStep(steps, index - 1));
}
/**
 * Extracts the `show` prop from <CH.Code show={["foo.js", "bar.html"]} />
 */
function getFilterFromEditorNode(node) {
    var _a, _b, _c;
    const value = (_c = (_b = (_a = node.attributes) === null || _a === void 0 ? void 0 : _a.find(a => a.name === "show")) === null || _b === void 0 ? void 0 : _b.value) === null || _c === void 0 ? void 0 : _c.value;
    if (value) {
        return JSON.parse(value);
    }
    else {
        return undefined;
    }
}

function transformSpotlights(tree, config) {
    return __awaiter(this, void 0, void 0, function* () {
        yield visitAsync(tree, "mdxJsxFlowElement", (node) => __awaiter(this, void 0, void 0, function* () {
            if (node.name === "CH.Spotlight") {
                yield transformSpotlight(node, config);
            }
        }));
    });
}
function transformSpotlight(node, config) {
    return __awaiter(this, void 0, void 0, function* () {
        const { editorSteps, hasPreviewSteps, presetConfig } = yield extractStepsInfo(node, config, "merge steps with header");
        toJSX(node, {
            props: {
                editorSteps: editorSteps,
                presetConfig,
                hasPreviewSteps,
            },
            appendProps: true,
            addConfigProp: true,
        });
    });
}

function transformScrollycodings(tree, config) {
    return __awaiter(this, void 0, void 0, function* () {
        yield visitAsync(tree, "mdxJsxFlowElement", (node) => __awaiter(this, void 0, void 0, function* () {
            if (node.name === "CH.Scrollycoding") {
                yield transformScrollycoding(node, config);
            }
        }));
    });
}
function transformScrollycoding(node, config) {
    return __awaiter(this, void 0, void 0, function* () {
        const { editorSteps, hasPreviewSteps, presetConfig } = yield extractStepsInfo(node, config, "merge step with previous");
        transformLinks(node);
        toJSX(node, {
            props: {
                editorSteps: editorSteps,
                presetConfig,
                hasPreviewSteps,
            },
            appendProps: true,
            addConfigProp: true,
        });
    });
}

function transformSlideshows(tree, config) {
    return __awaiter(this, void 0, void 0, function* () {
        yield visitAsync(tree, "mdxJsxFlowElement", (node) => __awaiter(this, void 0, void 0, function* () {
            if (node.name === "CH.Slideshow") {
                yield transformSlideshow(node, config);
            }
        }));
    });
}
function transformSlideshow(node, config) {
    return __awaiter(this, void 0, void 0, function* () {
        const { editorSteps, hasPreviewSteps, presetConfig } = yield extractStepsInfo(node, config, "merge step with previous");
        toJSX(node, {
            props: {
                editorSteps: editorSteps,
                presetConfig,
                hasPreviewSteps,
            },
            appendProps: true,
            addConfigProp: true,
        });
    });
}

function transformInlineCodes(tree, { theme }) {
    return __awaiter(this, void 0, void 0, function* () {
        // transform *`foo`* to <CH.InlineCode>foo</CH.InlineCode>
        visit(tree, "emphasis", (node) => {
            if (node.children &&
                node.children.length === 1 &&
                node.children[0].type === "inlineCode") {
                node.type = "mdxJsxTextElement";
                node.name = "CH.InlineCode";
                node.children = [
                    { type: "text", value: node.children[0].value },
                ];
            }
        });
        yield visitAsync(tree, ["mdxJsxFlowElement", "mdxJsxTextElement"], (node) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (node.name === "CH.InlineCode") {
                const inlinedCode = node.children[0].value;
                const lang = (_a = node.attributes) === null || _a === void 0 ? void 0 : _a.lang;
                toJSX(node, {
                    props: {
                        code: yield getCode(tree, node, inlinedCode, lang, theme),
                    },
                    appendProps: true,
                    addConfigProp: true,
                });
            }
        }));
    });
}
function getCode(tree, node, inlinedCode, lang, theme) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        const ancestors = getAncestors(tree, node);
        const sectionNode = ancestors.find(n => { var _a; return (_a = n.data) === null || _a === void 0 ? void 0 : _a.editorStep; });
        // if node isn't inside a section-like parent, use provided lang or "jsx"
        if (!sectionNode) {
            return yield highlight({
                code: inlinedCode,
                lang: lang || "jsx",
                theme,
            });
        }
        const editorStep = (_a = sectionNode === null || sectionNode === void 0 ? void 0 : sectionNode.data) === null || _a === void 0 ? void 0 : _a.editorStep;
        // if the same code is present in the editor step, use it
        const existingCode = getExistingCode(editorStep.files, inlinedCode);
        if (existingCode) {
            return existingCode;
        }
        // or else, try to guess the language from somewhere
        const activeFile = ((_b = editorStep.files) === null || _b === void 0 ? void 0 : _b.find(f => { var _a; return f.name === ((_a = editorStep.northPanel) === null || _a === void 0 ? void 0 : _a.active); })) || editorStep.files[0];
        const activeLang = (_c = activeFile === null || activeFile === void 0 ? void 0 : activeFile.code) === null || _c === void 0 ? void 0 : _c.lang;
        return yield highlight({
            code: inlinedCode,
            lang: lang || activeLang || "jsx",
            theme,
        });
    });
}
function getAncestors(tree, node) {
    let ancestors = [];
    unistUtilVisitParents(tree, node, (node, nodeAncestors) => {
        ancestors = nodeAncestors;
    });
    return ancestors;
}
function getExistingCode(files, inlinedCode) {
    if (!files) {
        return undefined;
    }
    for (const file of files) {
        for (const line of file.code.lines) {
            const lineContent = line.tokens
                .map(t => t.content)
                .join("");
            const index = lineContent.indexOf(inlinedCode);
            if (index !== -1) {
                const tokens = sliceTokens(line, index, inlinedCode.length);
                return { lang: file.code.lang, lines: [{ tokens }] };
            }
        }
    }
    return undefined;
}
/**
 * Slice a line of tokens from a given index to a given length
 * Turns ("[abc][de][fgh]", 2, 4) into "[c][de][f]")
 */
function sliceTokens(line, start, length) {
    const tokens = line.tokens;
    let currentLength = 0;
    let headTokens = [];
    // this for loop remove the unwanted prefix tokens and put the rest in headTokens
    for (let tokenIndex = 0; tokenIndex < tokens.length; tokenIndex++) {
        if (currentLength === start) {
            headTokens = tokens.slice(tokenIndex);
            break;
        }
        if (currentLength + tokens[tokenIndex].content.length >
            start) {
            const newToken = Object.assign(Object.assign({}, tokens[tokenIndex]), { content: tokens[tokenIndex].content.slice(start - currentLength) });
            headTokens = [newToken].concat(tokens.slice(tokenIndex + 1));
            break;
        }
        currentLength += tokens[tokenIndex].content.length;
    }
    // headTokens is now "[c][de][fgh]" (from the example above)
    currentLength = 0;
    // this for loop remove the unwanted suffix tokens from headTokens
    for (let headTokenIndex = 0; headTokenIndex <= headTokens.length; headTokenIndex++) {
        if (currentLength >= length) {
            return headTokens.slice(0, headTokenIndex);
        }
        const currentToken = headTokens[headTokenIndex];
        if (currentLength + currentToken.content.length >
            length) {
            const newToken = Object.assign(Object.assign({}, currentToken), { content: currentToken.content.slice(0, length - currentLength) });
            return headTokens
                .slice(0, headTokenIndex)
                .concat([newToken]);
        }
        currentLength += currentToken.content.length;
    }
    return [];
}

/**
 * Add defaults and normalize config
 */
function addConfigDefaults(config, cwd, filepath) {
    // TODO warn when config looks weird
    return Object.assign(Object.assign({ staticMediaQuery: "not screen, (max-width: 768px)" }, config), { theme: (config === null || config === void 0 ? void 0 : config.theme) || {}, autoImport: (config === null || config === void 0 ? void 0 : config.autoImport) === false ? false : true, skipLanguages: (config === null || config === void 0 ? void 0 : config.skipLanguages) || [], filepath });
}

const transforms = [
    transformPreviews,
    transformScrollycodings,
    transformSpotlights,
    transformSlideshows,
    transformSections,
    transformInlineCodes,
    transformCodes,
];
const attacher = unsafeConfig => {
    return (tree, file) => __awaiter(void 0, void 0, void 0, function* () {
        const config = addConfigDefaults(unsafeConfig, file === null || file === void 0 ? void 0 : file.cwd, (file === null || file === void 0 ? void 0 : file.history)
            ? file.history[file.history.length - 1]
            : undefined);
        try {
            for (const transform of transforms) {
                yield transform(tree, config);
            }
            const usedCodeHikeComponents = getUsedCodeHikeComponentNames(tree);
            if (usedCodeHikeComponents.length > 0) {
                addConfig(tree, config);
                if (config.autoImport) {
                    addSmartImport(tree, usedCodeHikeComponents);
                }
            }
        }
        catch (e) {
            console.error("error running remarkCodeHike", e);
            throw e;
        }
    });
};
/**
 * Returns a the list of component names
 * used inside the tree
 * that looks like `<CH.* />`
 */
function getUsedCodeHikeComponentNames(tree) {
    const usage = [];
    visit(tree, ["mdxJsxFlowElement", "mdxJsxTextElement"], (node) => {
        if (node.name &&
            node.name.startsWith("CH.") &&
            !usage.includes(node.name)) {
            usage.push(node.name);
        }
    });
    return usage;
}
/**
 * Creates a `chCodeConfig` variable node in the tree
 * so that the components can access the config
 */
function addConfig(tree, config) {
    tree.children.unshift({
        type: "mdxjsEsm",
        value: `export const ${CH_CODE_CONFIG_VAR_NAME} = {}`,
        data: {
            estree: {
                type: "Program",
                body: [
                    {
                        type: "ExportNamedDeclaration",
                        declaration: {
                            type: "VariableDeclaration",
                            declarations: [
                                {
                                    type: "VariableDeclarator",
                                    id: {
                                        type: "Identifier",
                                        name: CH_CODE_CONFIG_VAR_NAME,
                                    },
                                    init: valueToEstree(config),
                                },
                            ],
                            kind: "const",
                        },
                        specifiers: [],
                        source: null,
                    },
                ],
                sourceType: "module",
            },
        },
    });
}
/**
 * Add an import node at the start of the tree
 * importing all the components used
 */
function addSmartImport(tree, componentNames) {
    const specifiers = [
        "annotations",
        ...componentNames.map(name => name.slice("CH.".length)),
    ];
    tree.children.unshift({
        type: "mdxjsEsm",
        value: `export const CH = { ${specifiers.join(", ")} }`,
        data: {
            estree: {
                type: "Program",
                body: [
                    {
                        type: "ExportNamedDeclaration",
                        declaration: {
                            type: "VariableDeclaration",
                            declarations: [
                                {
                                    type: "VariableDeclarator",
                                    id: {
                                        type: "Identifier",
                                        name: "CH",
                                    },
                                    init: {
                                        type: "ObjectExpression",
                                        properties: specifiers.map(specifier => ({
                                            type: "Property",
                                            method: false,
                                            shorthand: true,
                                            computed: false,
                                            key: {
                                                type: "Identifier",
                                                name: specifier,
                                            },
                                            kind: "init",
                                            value: {
                                                type: "Identifier",
                                                name: specifier,
                                            },
                                        })),
                                    },
                                },
                            ],
                            kind: "const",
                        },
                        specifiers: [],
                        source: null,
                    },
                ],
                sourceType: "module",
                comments: [],
            },
        },
    });
    tree.children.unshift({
        type: "mdxjsEsm",
        value: `import { ${specifiers.join(", ")} } from "@code-hike/mdx/dist/components.cjs.js"`,
        data: {
            estree: {
                type: "Program",
                body: [
                    {
                        type: "ImportDeclaration",
                        specifiers: specifiers.map(specifier => ({
                            type: "ImportSpecifier",
                            imported: {
                                type: "Identifier",
                                name: specifier,
                            },
                            local: {
                                type: "Identifier",
                                name: specifier,
                            },
                        })),
                        source: {
                            type: "Literal",
                            value: "@code-hike/mdx/dist/components.cjs.js",
                            raw: '"@code-hike/mdx/dist/components.cjs.js"',
                        },
                    },
                ],
                sourceType: "module",
            },
        },
    });
}

export { highlight, attacher as remarkCodeHike };
