'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var reactDom = require('react-dom');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

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

function map(tween, fn) {
    return {
        prev: fn(tween.prev, "prev"),
        next: fn(tween.next, "next"),
    };
}
function withDefault(t, deft) {
    return {
        prev: (t === null || t === void 0 ? void 0 : t.prev) === undefined ? deft : t.prev,
        next: (t === null || t === void 0 ? void 0 : t.next) === undefined ? deft : t.next,
    };
}
function mapWithDefault(tween, deft, fn) {
    return map(withDefault(tween, deft), fn);
}
function anyValue(tween, fn) {
    return fn(tween.prev) || fn(tween.next);
}

function codeToText(code) {
    return code.lines
        .map(line => line.tokens.map(token => token.content).join(""))
        .join("\n");
}

function mapFocusToLineNumbers(focus, lines) {
    if (!focus) {
        // focus all lines
        return mergeToObject([...lines.keys()].map(lineIndex => ({
            [lineIndex + 1]: true,
        })));
    }
    else {
        return mergeToObject(splitParts(focus).map(parsePartToObject));
    }
}
function splitParts(focus) {
    return focus.split(/,(?![^\[]*\])/g);
}
function mergeToObject(entries) {
    return entries.reduce((acc, obj) => Object.assign(acc, obj), {});
}
function hasColumns(part) {
    return !!part.match(/(\d+)\[(.+)\]/);
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
/**
 * Return the first and last indexes to focus, both included
 */
function getFocusExtremes(focus, lines) {
    if (!focus) {
        return [0, lines.length - 1];
    }
    else {
        const parsed = parseFocus(focus);
        const focusedIndexes = Object.keys(parsed).map(i => parseInt(i, 10));
        return [
            Math.min(...focusedIndexes),
            Math.max(...focusedIndexes),
        ];
    }
}
function getFocusIndexes(focus, lines) {
    if (!focus) {
        return [...lines.keys()];
    }
    else {
        const parsed = parseFocus(focus);
        const focusedIndexes = Object.keys(parsed).map(i => parseInt(i, 10));
        return focusedIndexes;
    }
}
function parseFocus(focus) {
    if (!focus) {
        throw new Error("Focus cannot be empty");
    }
    try {
        const parts = focus
            .split(/,(?![^\[]*\])/g)
            .map(parsePart);
        return fromEntries(parts.flat());
    }
    catch (error) {
        // TODO enhance error
        throw error;
    }
}
function parsePart(part) {
    // a part could be
    // - a line number: "2"
    // - a line range: "5:9"
    // - a line number with a column selector: "2[1,3:5,9]"
    const columnsMatch = part.match(/(\d+)\[(.+)\]/);
    if (columnsMatch) {
        const [, line, columns] = columnsMatch;
        const columnsList = columns.split(",").map(expandString);
        const lineIndex = Number(line) - 1;
        const columnIndexes = columnsList.flat().map(c => c - 1);
        return [[lineIndex, columnIndexes]];
    }
    else {
        return expandString(part).map(lineNumber => [
            lineNumber - 1,
            true,
        ]);
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
function fromEntries(pairs) {
    const result = {};
    let index = -1, length = pairs == null ? 0 : pairs.length;
    while (++index < length) {
        var pair = pairs[index];
        result[pair[0]] = pair[1];
    }
    return result;
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
function getColorScheme(theme) {
    const themeType = getThemeType(theme);
    if (themeType === "dark") {
        return "dark";
    }
    else if (themeType === "light") {
        return "light";
    }
    return undefined;
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
function getCodeColors(theme) {
    return {
        fg: getColor(theme, ColorName.CodeForeground),
        bg: getColor(theme, ColorName.CodeBackground),
    };
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

const useLayoutEffect$4 = typeof window !== "undefined"
    ? React__default["default"].useLayoutEffect
    : React__default["default"].useEffect;
// for debugging:
// export const useLayoutEffect = (
//   effect: any,
//   deps?: any
// ) => {}
// from https://overreacted.io/making-setinterval-declarative-with-react-hooks/
function useInterval(callback, delay) {
    const savedCallback = React__default["default"].useRef(callback);
    React__default["default"].useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);
    React__default["default"].useEffect(() => {
        if (!delay && delay !== 0) {
            return undefined;
        }
        const id = setInterval(() => savedCallback.current(), delay);
        return () => clearInterval(id);
    }, [delay]);
}

function clamp$2(x, min, max) {
    return Math.min(Math.max(x, min), max);
}

const DEFAULT_WIDTH = 200;
// type DimensionsResult = {
//   width: number
//   height: number
//   lineWidths: { prev: number; next: number }
//   lineHeight: number
//   colWidth: number
// }
function useDimensions(code, focus, minColumns, lineNumbers, rows, deps) {
    const [dimensions, setDimensions] = React__default["default"].useState(null);
    const windowWidth = useWindowWidth();
    const prevLineRef = React__default["default"].useRef(null);
    const { prevLongestLine, nextLongestLine, element } = React__default["default"].useMemo(() => {
        const prevLongestLine = getLongestLine(code.prev, focus.prev);
        const nextLongestLine = getLongestLine(code.next, focus.next);
        const lines = (code.prev || code.next)
            .trimEnd()
            .split(newlineRe);
        const largestLineNumber = Math.max(lines.length, 10);
        if (rows) {
            // make the lines match the requested number of rows
            const heightInLines = rows === "focus"
                ? focusHeightInLines(focus, lines)
                : rows;
            let i = lines.length;
            while (i < heightInLines) {
                lines.push("");
                i++;
            }
            // remove extra lines to match the requested rows
            while (i > heightInLines) {
                lines.pop();
                i--;
            }
            // if we removed prevLongestLine, add it back
            if (prevLongestLine &&
                !lines.includes(prevLongestLine)) {
                lines[lines.length - 1] = prevLongestLine;
            }
        }
        // avod setting the ref more than once https://github.com/code-hike/codehike/issues/232
        let prevLineRefSet = false;
        const element = (React__default["default"].createElement("code", { className: "ch-code-scroll-parent" },
            React__default["default"].createElement("br", null),
            lines.map((line, i) => {
                const ref = !prevLineRefSet && line === prevLongestLine
                    ? prevLineRef
                    : undefined;
                prevLineRefSet = prevLineRefSet || ref != null;
                return (React__default["default"].createElement("div", { ref: ref, key: i },
                    lineNumbers ? (React__default["default"].createElement("span", { className: "ch-code-line-number" },
                        "_",
                        largestLineNumber)) : undefined,
                    React__default["default"].createElement("div", { style: {
                            display: "inline-block",
                            // leftPad
                            marginLeft: 16,
                        } },
                        React__default["default"].createElement("span", null, line))));
            }),
            React__default["default"].createElement("br", null)));
        return { prevLongestLine, nextLongestLine, element };
    }, [code]);
    const allDeps = [
        ...deps,
        windowWidth,
        prevLongestLine,
        nextLongestLine,
        minColumns,
    ];
    useLayoutEffect$4(() => {
        var _a;
        if (prevLineRef.current) {
            const pll = prevLineRef.current;
            const contentElement = pll === null || pll === void 0 ? void 0 : pll.parentElement;
            const codeElement = contentElement.parentElement;
            // TODO is it clientWidth or clientRect?
            const lineContentDiv = pll === null || pll === void 0 ? void 0 : pll.querySelector(":scope > div");
            const lineNumberSpan = pll === null || pll === void 0 ? void 0 : pll.querySelector(":scope > span");
            const lnw = lineNumberSpan
                ? getWidthWithPadding(lineNumberSpan)
                : 0;
            const plw = getWidthWithoutPadding(lineContentDiv);
            const colWidth = plw / prevLongestLine.length || 1;
            const nlw = nextLongestLine.length * colWidth;
            const lineHeight = (_a = getHeightWithoutPadding(lineContentDiv)) !== null && _a !== void 0 ? _a : 20;
            const d = {
                containerWidth: getWidthWithoutPadding(codeElement.parentElement),
                containerHeight: getHeightWithoutPadding(codeElement.parentElement),
                contentWidth: getWidthWithoutPadding(contentElement.parentElement),
                contentHeight: getHeightWithoutPadding(contentElement.parentElement),
                lineWidths: [
                    plw || nlw || DEFAULT_WIDTH,
                    nlw || plw || DEFAULT_WIDTH,
                ],
                lineWidth: [
                    Math.max(plw || nlw || DEFAULT_WIDTH, colWidth * minColumns),
                    Math.max(nlw || plw || DEFAULT_WIDTH, colWidth * minColumns),
                ],
                lineHeight,
                colWidth,
                lineNumberWidth: lnw,
                deps: allDeps,
            };
            setDimensions(d);
        }
    }, allDeps);
    if (!dimensions ||
        depsChanged(dimensions.deps, allDeps)) {
        return { element, dimensions: null };
    }
    else {
        return { element, dimensions };
    }
}
const newlineRe = /\r\n|\r|\n/;
function getLongestLine(code, focus) {
    const lines = code ? code.split(newlineRe) : [""];
    const focusIndexes = getFocusIndexes(focus, lines);
    let longestLine = "";
    lines.forEach((line, index) => {
        if (focusIndexes.includes(index) &&
            line.length > longestLine.length) {
            longestLine = line;
        }
    });
    return longestLine;
}
function getWidthWithoutPadding(element) {
    const computedStyle = getComputedStyle(element);
    return (parseFloat(computedStyle.width) -
        parseFloat(computedStyle.paddingLeft) -
        parseFloat(computedStyle.paddingRight));
}
function getWidthWithPadding(element) {
    const computedStyle = getComputedStyle(element);
    return parseFloat(computedStyle.width);
}
function getHeightWithoutPadding(element) {
    if (!element)
        return null;
    const computedStyle = getComputedStyle(element);
    return (parseFloat(computedStyle.height) -
        parseFloat(computedStyle.paddingTop) -
        parseFloat(computedStyle.paddingBottom));
}
function depsChanged(oldDeps, newDeps) {
    for (let i = 0; i < oldDeps.length; i++) {
        if (oldDeps[i] !== newDeps[i])
            return true;
    }
    return false;
}
function useWindowWidth() {
    const [width, setWidth] = React__default["default"].useState(undefined);
    React__default["default"].useEffect(() => {
        function handleResize() {
            setWidth(window.innerWidth);
        }
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    return width;
}
function focusHeightInLines(focus, lines) {
    const [start, end] = getFocusExtremes(focus.prev, lines);
    return end - start + 1;
}

function Diff() {}
Diff.prototype = {
  diff: function diff(oldString, newString) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var callback = options.callback;

    if (typeof options === 'function') {
      callback = options;
      options = {};
    }

    this.options = options;
    var self = this;

    function done(value) {
      if (callback) {
        setTimeout(function () {
          callback(undefined, value);
        }, 0);
        return true;
      } else {
        return value;
      }
    } // Allow subclasses to massage the input prior to running


    oldString = this.castInput(oldString);
    newString = this.castInput(newString);
    oldString = this.removeEmpty(this.tokenize(oldString));
    newString = this.removeEmpty(this.tokenize(newString));
    var newLen = newString.length,
        oldLen = oldString.length;
    var editLength = 1;
    var maxEditLength = newLen + oldLen;
    var bestPath = [{
      newPos: -1,
      components: []
    }]; // Seed editLength = 0, i.e. the content starts with the same values

    var oldPos = this.extractCommon(bestPath[0], newString, oldString, 0);

    if (bestPath[0].newPos + 1 >= newLen && oldPos + 1 >= oldLen) {
      // Identity per the equality and tokenizer
      return done([{
        value: this.join(newString),
        count: newString.length
      }]);
    } // Main worker method. checks all permutations of a given edit length for acceptance.


    function execEditLength() {
      for (var diagonalPath = -1 * editLength; diagonalPath <= editLength; diagonalPath += 2) {
        var basePath = void 0;

        var addPath = bestPath[diagonalPath - 1],
            removePath = bestPath[diagonalPath + 1],
            _oldPos = (removePath ? removePath.newPos : 0) - diagonalPath;

        if (addPath) {
          // No one else is going to attempt to use this value, clear it
          bestPath[diagonalPath - 1] = undefined;
        }

        var canAdd = addPath && addPath.newPos + 1 < newLen,
            canRemove = removePath && 0 <= _oldPos && _oldPos < oldLen;

        if (!canAdd && !canRemove) {
          // If this path is a terminal then prune
          bestPath[diagonalPath] = undefined;
          continue;
        } // Select the diagonal that we want to branch from. We select the prior
        // path whose position in the new string is the farthest from the origin
        // and does not pass the bounds of the diff graph


        if (!canAdd || canRemove && addPath.newPos < removePath.newPos) {
          basePath = clonePath(removePath);
          self.pushComponent(basePath.components, undefined, true);
        } else {
          basePath = addPath; // No need to clone, we've pulled it from the list

          basePath.newPos++;
          self.pushComponent(basePath.components, true, undefined);
        }

        _oldPos = self.extractCommon(basePath, newString, oldString, diagonalPath); // If we have hit the end of both strings, then we are done

        if (basePath.newPos + 1 >= newLen && _oldPos + 1 >= oldLen) {
          return done(buildValues(self, basePath.components, newString, oldString, self.useLongestToken));
        } else {
          // Otherwise track this path as a potential candidate and continue.
          bestPath[diagonalPath] = basePath;
        }
      }

      editLength++;
    } // Performs the length of edit iteration. Is a bit fugly as this has to support the
    // sync and async mode which is never fun. Loops over execEditLength until a value
    // is produced.


    if (callback) {
      (function exec() {
        setTimeout(function () {
          // This should not happen, but we want to be safe.

          /* istanbul ignore next */
          if (editLength > maxEditLength) {
            return callback();
          }

          if (!execEditLength()) {
            exec();
          }
        }, 0);
      })();
    } else {
      while (editLength <= maxEditLength) {
        var ret = execEditLength();

        if (ret) {
          return ret;
        }
      }
    }
  },
  pushComponent: function pushComponent(components, added, removed) {
    var last = components[components.length - 1];

    if (last && last.added === added && last.removed === removed) {
      // We need to clone here as the component clone operation is just
      // as shallow array clone
      components[components.length - 1] = {
        count: last.count + 1,
        added: added,
        removed: removed
      };
    } else {
      components.push({
        count: 1,
        added: added,
        removed: removed
      });
    }
  },
  extractCommon: function extractCommon(basePath, newString, oldString, diagonalPath) {
    var newLen = newString.length,
        oldLen = oldString.length,
        newPos = basePath.newPos,
        oldPos = newPos - diagonalPath,
        commonCount = 0;

    while (newPos + 1 < newLen && oldPos + 1 < oldLen && this.equals(newString[newPos + 1], oldString[oldPos + 1])) {
      newPos++;
      oldPos++;
      commonCount++;
    }

    if (commonCount) {
      basePath.components.push({
        count: commonCount
      });
    }

    basePath.newPos = newPos;
    return oldPos;
  },
  equals: function equals(left, right) {
    if (this.options.comparator) {
      return this.options.comparator(left, right);
    } else {
      return left === right || this.options.ignoreCase && left.toLowerCase() === right.toLowerCase();
    }
  },
  removeEmpty: function removeEmpty(array) {
    var ret = [];

    for (var i = 0; i < array.length; i++) {
      if (array[i]) {
        ret.push(array[i]);
      }
    }

    return ret;
  },
  castInput: function castInput(value) {
    return value;
  },
  tokenize: function tokenize(value) {
    return value.split('');
  },
  join: function join(chars) {
    return chars.join('');
  }
};

function buildValues(diff, components, newString, oldString, useLongestToken) {
  var componentPos = 0,
      componentLen = components.length,
      newPos = 0,
      oldPos = 0;

  for (; componentPos < componentLen; componentPos++) {
    var component = components[componentPos];

    if (!component.removed) {
      if (!component.added && useLongestToken) {
        var value = newString.slice(newPos, newPos + component.count);
        value = value.map(function (value, i) {
          var oldValue = oldString[oldPos + i];
          return oldValue.length > value.length ? oldValue : value;
        });
        component.value = diff.join(value);
      } else {
        component.value = diff.join(newString.slice(newPos, newPos + component.count));
      }

      newPos += component.count; // Common case

      if (!component.added) {
        oldPos += component.count;
      }
    } else {
      component.value = diff.join(oldString.slice(oldPos, oldPos + component.count));
      oldPos += component.count; // Reverse add and remove so removes are output first to match common convention
      // The diffing algorithm is tied to add then remove output and this is the simplest
      // route to get the desired output with minimal overhead.

      if (componentPos && components[componentPos - 1].added) {
        var tmp = components[componentPos - 1];
        components[componentPos - 1] = components[componentPos];
        components[componentPos] = tmp;
      }
    }
  } // Special case handle for when one terminal is ignored (i.e. whitespace).
  // For this case we merge the terminal into the prior string and drop the change.
  // This is only available for string mode.


  var lastComponent = components[componentLen - 1];

  if (componentLen > 1 && typeof lastComponent.value === 'string' && (lastComponent.added || lastComponent.removed) && diff.equals('', lastComponent.value)) {
    components[componentLen - 2].value += lastComponent.value;
    components.pop();
  }

  return components;
}

function clonePath(path) {
  return {
    newPos: path.newPos,
    components: path.components.slice(0)
  };
}

//
// Ranges and exceptions:
// Latin-1 Supplement, 0080–00FF
//  - U+00D7  × Multiplication sign
//  - U+00F7  ÷ Division sign
// Latin Extended-A, 0100–017F
// Latin Extended-B, 0180–024F
// IPA Extensions, 0250–02AF
// Spacing Modifier Letters, 02B0–02FF
//  - U+02C7  ˇ &#711;  Caron
//  - U+02D8  ˘ &#728;  Breve
//  - U+02D9  ˙ &#729;  Dot Above
//  - U+02DA  ˚ &#730;  Ring Above
//  - U+02DB  ˛ &#731;  Ogonek
//  - U+02DC  ˜ &#732;  Small Tilde
//  - U+02DD  ˝ &#733;  Double Acute Accent
// Latin Extended Additional, 1E00–1EFF

var extendedWordChars = /^[A-Za-z\xC0-\u02C6\u02C8-\u02D7\u02DE-\u02FF\u1E00-\u1EFF]+$/;
var reWhitespace = /\S/;
var wordDiff = new Diff();

wordDiff.equals = function (left, right) {
  if (this.options.ignoreCase) {
    left = left.toLowerCase();
    right = right.toLowerCase();
  }

  return left === right || this.options.ignoreWhitespace && !reWhitespace.test(left) && !reWhitespace.test(right);
};

wordDiff.tokenize = function (value) {
  var tokens = value.split(/(\s+|[()[\]{}'"]|\b)/); // Join the boundary splits that we do not consider to be boundaries. This is primarily the extended Latin character set.

  for (var i = 0; i < tokens.length - 1; i++) {
    // If we have an empty string in the next field and we have only word chars before and after, merge
    if (!tokens[i + 1] && tokens[i + 2] && extendedWordChars.test(tokens[i]) && extendedWordChars.test(tokens[i + 2])) {
      tokens[i] += tokens[i + 2];
      tokens.splice(i + 1, 2);
      i--;
    }
  }

  return tokens;
};

var lineDiff = new Diff();

lineDiff.tokenize = function (value) {
  var retLines = [],
      linesAndNewlines = value.split(/(\n|\r\n)/); // Ignore the final empty token that occurs if the string ends with a new line

  if (!linesAndNewlines[linesAndNewlines.length - 1]) {
    linesAndNewlines.pop();
  } // Merge the content and line separators into single tokens


  for (var i = 0; i < linesAndNewlines.length; i++) {
    var line = linesAndNewlines[i];

    if (i % 2 && !this.options.newlineIsToken) {
      retLines[retLines.length - 1] += line;
    } else {
      if (this.options.ignoreWhitespace) {
        line = line.trim();
      }

      retLines.push(line);
    }
  }

  return retLines;
};

function diffLines(oldStr, newStr, callback) {
  return lineDiff.diff(oldStr, newStr, callback);
}

var sentenceDiff = new Diff();

sentenceDiff.tokenize = function (value) {
  return value.split(/(\S.+?[.!?])(?=\s+|$)/);
};

var cssDiff = new Diff();

cssDiff.tokenize = function (value) {
  return value.split(/([{}:;,]|\s+)/);
};

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

var objectPrototypeToString = Object.prototype.toString;
var jsonDiff = new Diff(); // Discriminate between two lines of pretty-printed, serialized JSON where one of them has a
// dangling comma and the other doesn't. Turns out including the dangling comma yields the nicest output:

jsonDiff.useLongestToken = true;
jsonDiff.tokenize = lineDiff.tokenize;

jsonDiff.castInput = function (value) {
  var _this$options = this.options,
      undefinedReplacement = _this$options.undefinedReplacement,
      _this$options$stringi = _this$options.stringifyReplacer,
      stringifyReplacer = _this$options$stringi === void 0 ? function (k, v) {
    return typeof v === 'undefined' ? undefinedReplacement : v;
  } : _this$options$stringi;
  return typeof value === 'string' ? value : JSON.stringify(canonicalize(value, null, null, stringifyReplacer), stringifyReplacer, '  ');
};

jsonDiff.equals = function (left, right) {
  return Diff.prototype.equals.call(jsonDiff, left.replace(/,([\r\n])/g, '$1'), right.replace(/,([\r\n])/g, '$1'));
};
// object that is already on the "stack" of items being processed. Accepts an optional replacer

function canonicalize(obj, stack, replacementStack, replacer, key) {
  stack = stack || [];
  replacementStack = replacementStack || [];

  if (replacer) {
    obj = replacer(key, obj);
  }

  var i;

  for (i = 0; i < stack.length; i += 1) {
    if (stack[i] === obj) {
      return replacementStack[i];
    }
  }

  var canonicalizedObj;

  if ('[object Array]' === objectPrototypeToString.call(obj)) {
    stack.push(obj);
    canonicalizedObj = new Array(obj.length);
    replacementStack.push(canonicalizedObj);

    for (i = 0; i < obj.length; i += 1) {
      canonicalizedObj[i] = canonicalize(obj[i], stack, replacementStack, replacer, key);
    }

    stack.pop();
    replacementStack.pop();
    return canonicalizedObj;
  }

  if (obj && obj.toJSON) {
    obj = obj.toJSON();
  }

  if (_typeof(obj) === 'object' && obj !== null) {
    stack.push(obj);
    canonicalizedObj = {};
    replacementStack.push(canonicalizedObj);

    var sortedKeys = [],
        _key;

    for (_key in obj) {
      /* istanbul ignore else */
      if (obj.hasOwnProperty(_key)) {
        sortedKeys.push(_key);
      }
    }

    sortedKeys.sort();

    for (i = 0; i < sortedKeys.length; i += 1) {
      _key = sortedKeys[i];
      canonicalizedObj[_key] = canonicalize(obj[_key], stack, replacementStack, replacer, _key);
    }

    stack.pop();
    replacementStack.pop();
  } else {
    canonicalizedObj = obj;
  }

  return canonicalizedObj;
}

var arrayDiff = new Diff();

arrayDiff.tokenize = function (value) {
  return value.slice();
};

arrayDiff.join = arrayDiff.removeEmpty = function (value) {
  return value;
};

function mergeLines(code, lines) {
    let enterIndex = 0;
    let exitIndex = 0;
    const indexes = diff(code);
    const newLines = indexes.map(index => {
        if (index.next === undefined) {
            return Object.assign(Object.assign({}, lines.prev[index.prev]), { lineNumber: {
                    prev: index.prev + 1,
                }, move: "exit", enterIndex: null, exitIndex: exitIndex++ });
        }
        if (index.prev === undefined) {
            return Object.assign(Object.assign({}, lines.next[index.next]), { lineNumber: {
                    next: index.next + 1,
                }, move: "enter", enterIndex: enterIndex++, exitIndex: null });
        }
        return Object.assign(Object.assign({}, lines.prev[index.prev]), { lineNumber: {
                prev: index.prev + 1,
                next: index.next + 1,
            }, move: "stay", enterIndex: null, exitIndex: null });
    });
    return {
        lines: newLines,
        enterCount: enterIndex,
        exitCount: exitIndex,
    };
}
/**
 * Returns a list of pairs of line indexes:
 *
 * For example if lines 2 and 3 were removed
 * and two lines where added at the end:
 *  0 0
 *  1 -
 *  2 -
 *  3 1
 *  - 2
 *  - 3
 */
function diff(code) {
    const changes = diffLines(code.prev, code.next);
    let indexes = [];
    let prevIndex = 0;
    let nextIndex = 0;
    changes.forEach(change => {
        if (change.added) {
            for (let i = 0; i < change.count; i++) {
                indexes.push({ next: nextIndex++ });
            }
        }
        else if (change.removed) {
            for (let i = 0; i < change.count; i++) {
                indexes.push({ prev: prevIndex++ });
            }
        }
        else {
            for (let i = 0; i < change.count; i++) {
                indexes.push({
                    prev: prevIndex++,
                    next: nextIndex++,
                });
            }
        }
    });
    return indexes;
}

function splitByFocus(mergedCode, focus, annotations) {
    const { lines } = mergedCode, mergedCodeRest = __rest(mergedCode, ["lines"]);
    const focusByLineNumber = map(focus, (focus, key) => {
        // we need to filter the lines that don't belong to the step
        // for the case where focus == ""
        const stepLines = key === "prev"
            ? lines.filter(l => l.move !== "enter")
            : lines.filter(l => l.move !== "exit");
        return mapFocusToLineNumbers(focus, stepLines);
    });
    const splittedLines = lines.map(line => {
        const { tokens } = line, rest = __rest(line, ["tokens"]);
        const lineFocus = {
            prev: line.lineNumber.prev
                ? focusByLineNumber.prev[line.lineNumber.prev]
                : false,
            next: line.lineNumber.next
                ? focusByLineNumber.next[line.lineNumber.next]
                : false,
        };
        const lineAnnotations = {
            prev: line.lineNumber.prev
                ? annotations.prev[line.lineNumber.prev] || []
                : [],
            next: line.lineNumber.next
                ? annotations.next[line.lineNumber.next] || []
                : [],
        };
        return Object.assign({ focused: map(lineFocus, focus => !!focus), groups: getTokenGroups(tokens, lineFocus, lineAnnotations) }, rest);
    });
    const focusedLineNumbers = map(focusByLineNumber, focusByLineNumber => Object.keys(focusByLineNumber).map(k => Number(k)));
    const firstFocusedLineNumber = map(focusedLineNumbers, focusedLineNumbers => Math.min(...focusedLineNumbers));
    const lastFocusedLineNumber = map(focusedLineNumbers, focusedLineNumbers => Math.max(...focusedLineNumbers));
    return Object.assign({ lines: splittedLines, firstFocusedLineNumber,
        lastFocusedLineNumber }, mergedCodeRest);
}
/**
 * Get the least amount of groups where no consecutive groups have
 * the same combination of prevFocus, nextFocus, prevAnnotation, nextAnnotation.
 */
function getTokenGroups(tokens, focus, annotations) {
    const focusExtremes = map(focus, focus => Array.isArray(focus) ? focus : []);
    const annotationExtremes = map(annotations, annotations => annotations.map(({ columnNumbers }) => columnNumbers));
    const allExtremes = [
        ...focusExtremes.prev,
        ...focusExtremes.next,
        ...annotationExtremes.prev,
        ...annotationExtremes.next,
    ];
    const splittedTokens = splitTokens(tokens, allExtremes);
    let startIndex = 0;
    let currentGroup = null;
    const groups = [];
    splittedTokens.forEach(token => {
        const newPrevFocus = isIn(startIndex, focus.prev);
        const newNextFocus = isIn(startIndex, focus.next);
        const newPrevAnnotation = getAnnotation(startIndex, annotations.prev);
        const newNextAnnotation = getAnnotation(startIndex, annotations.next);
        if (!currentGroup ||
            currentGroup.focused.prev !== newPrevFocus ||
            currentGroup.focused.next !== newNextFocus ||
            currentGroup.annotation.prev !== newPrevAnnotation ||
            currentGroup.annotation.next !== newNextAnnotation) {
            currentGroup = {
                focused: {
                    prev: newPrevFocus,
                    next: newNextFocus,
                },
                tokens: [],
                annotation: {
                    prev: newPrevAnnotation,
                    next: newNextAnnotation,
                },
            };
            groups.push(currentGroup);
        }
        currentGroup === null || currentGroup === void 0 ? void 0 : currentGroup.tokens.push(token);
        startIndex += token.content.length;
    });
    return groups.map(group => ({
        focused: group.focused,
        tokens: group.tokens,
        element: getGroupElement(group),
    }));
}
function getGroupElement(group) {
    return (React__default["default"].createElement(React__default["default"].Fragment, null, group.tokens.map(({ content, props }, i) => (React__default["default"].createElement("span", Object.assign({}, props, { key: i + 1 }), content)))));
}
/**
 * Split a list of tokens into a more fine-graned list of tokens
 *
 * tokens: [abc][defg]
 * extremes: [1:2,2:5]
 * result tokens: [ab][c][de][fg]
 *
 */
function splitTokens(tokens, extremes) {
    const splitIndexes = [
        ...extremes.map(e => e.start - 1),
        ...extremes.map(e => e.end),
    ];
    let oldTokens = tokens;
    splitIndexes.forEach(splitIndex => {
        const newTokens = [];
        let i = 0;
        oldTokens.forEach(token => {
            const startIndex = i;
            const endIndex = i + token.content.length;
            const shouldSplit = startIndex < splitIndex && splitIndex < endIndex;
            if (shouldSplit) {
                const sliceIndex = splitIndex - startIndex;
                const content0 = token.content.slice(0, sliceIndex);
                const content1 = token.content.slice(sliceIndex);
                newTokens.push(Object.assign(Object.assign({}, token), { content: content0 }));
                newTokens.push(Object.assign(Object.assign({}, token), { content: content1 }));
            }
            else {
                newTokens.push(token);
            }
            i = endIndex;
        });
        oldTokens = newTokens;
    });
    return oldTokens;
}
function isIn(index, intervals) {
    if (!Array.isArray(intervals)) {
        return intervals;
    }
    return intervals.some(({ start, end }) => start - 1 <= index && index < end);
}
function getAnnotation(index, annotations) {
    return annotations.find(({ columnNumbers }) => columnNumbers.start - 1 <= index &&
        index < columnNumbers.end);
}

function tween$1(params, t) {
    // needs === true for typescript...
    if (params.fixed === true) {
        return params.value;
    }
    else {
        const [start, end] = params.interval;
        const [from, to] = params.extremes;
        if (t < start)
            return from;
        if (t > end)
            return to;
        const x = (t - start) / (end - start);
        const ease = params.ease || easing.linear;
        return from + ease(x) * (to - from);
    }
}
function stagger([start, end], index, count) {
    if (count <= 1)
        return [start, end];
    const totalDuration = end - start;
    const stepDuration = totalDuration / Math.pow(count, 1 / 8);
    const tick = (totalDuration - stepDuration) / (count - 1);
    const stepStart = start + tick * index;
    const stepEnd = stepStart + stepDuration;
    return [stepStart, stepEnd];
}
const easing = {
    linear: function (t) {
        return t;
    },
    easeInQuad: function (t) {
        return t * t;
    },
    easeOutQuad: function (t) {
        return t * (2 - t);
    },
    easeInOutCubic: function (t) {
        return t < 0.5
            ? 4 * t * t * t
            : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    },
};

function getLinesWithElements(lines, verticalInterval, enterCount, exitCount) {
    // startY is the progress when we start moving vertically
    // endY is when we stop
    const [startY, endY] = verticalInterval;
    return lines.map(line => {
        const lineIndex = map(line.lineNumber, ln => ln && ln - 1);
        const { enterIndex, exitIndex } = line;
        const tweenY = line.move === "exit"
            ? { fixed: true, value: lineIndex.prev }
            : line.move === "enter"
                ? { fixed: true, value: lineIndex.next }
                : {
                    fixed: false,
                    extremes: [lineIndex.prev, lineIndex.next],
                    interval: [startY, endY],
                    ease: easing.easeInOutCubic,
                };
        const tweenX = line.move === "exit"
            ? {
                fixed: false,
                extremes: [0, -1],
                ease: easing.easeInQuad,
                interval: stagger([0, startY], exitIndex, exitCount),
            }
            : line.move === "enter"
                ? {
                    fixed: false,
                    extremes: [1, 0],
                    ease: easing.easeOutQuad,
                    interval: stagger([endY, 1], enterIndex, enterCount),
                }
                : { fixed: true, value: 0 };
        return Object.assign(Object.assign({}, line), { tweenX,
            tweenY });
    });
}

function parseAnnotations(annotations, theme) {
    // split annotations with multiple parts in the focus string
    // "1:2,3[4:5]" becomes  two annotations "1:2" and "3[4:5]"
    const expandedAnnotations = mapWithDefault(annotations, [], annotations => annotations.flatMap(annotation => splitParts(annotation.focus).map(part => (Object.assign(Object.assign({}, annotation), { focus: part })))));
    const inlineCodeAnnotations = mapWithDefault(expandedAnnotations, [], annotations => annotations.filter(isInline));
    const multilineCodeAnnotations = mapWithDefault(expandedAnnotations, [], annotations => annotations.filter(a => !isInline(a)));
    return {
        inlineAnnotations: map(inlineCodeAnnotations, annotations => parseInlineAnnotations(annotations, theme)),
        multilineAnnotations: map(multilineCodeAnnotations, annotations => parseMultilineAnnotations(annotations, theme)),
    };
}
function isInline(annotation) {
    return hasColumns(annotation.focus);
}
function parseInlineAnnotations(annotations, theme) {
    const annotationMap = {};
    annotations.forEach(annotation => {
        const focusMap = parsePartToObject(annotation.focus);
        const lineNumber = +Object.keys(focusMap)[0];
        const columnNumbersList = focusMap[lineNumber];
        const lineAnnotations = annotationMap[lineNumber] || [];
        lineAnnotations.push({
            columnNumbers: columnNumbersList[0],
            data: annotation.data,
            theme: theme,
            Component: annotation.Component ||
                defaultInlineComponent(),
        });
        annotationMap[lineNumber] = lineAnnotations;
    });
    return annotationMap;
}
function defaultInlineComponent(annotation, theme) {
    return ({ children }) => (React__default["default"].createElement("span", { style: { outline: "red 1px solid" } }, children));
}
function parseMultilineAnnotations(annotations, theme) {
    return annotations.map(annotation => {
        return {
            lineNumbers: parseExtremes(annotation.focus),
            data: annotation.data,
            theme: theme,
            Component: annotation.Component ||
                defaultMultilineComponent(annotation, theme),
        };
    });
}
function defaultMultilineComponent(annotation, theme) {
    // TODO handle missing bg
    const bg = (theme.colors["editor.lineHighlightBackground"] ||
        theme.colors["editor.selectionHighlightBackground"]);
    return ({ children, style }) => (React__default["default"].createElement("div", { style: Object.assign(Object.assign({}, style), { background: bg, cursor: "pointer" }), onClick: _ => alert("clicked"), className: "ch-code-bg-annotation" },
        React__default["default"].createElement("span", { className: "ch-code-bg-annotation-border", style: {
                background: "#00a2d3",
                width: "3px",
                height: "100%",
                position: "absolute",
                left: 0,
            } }),
        children));
}
// --- multiline
function annotateMultiline(lines, annotations) {
    return {
        prev: annotateMultilineSide(lines, annotations.prev, line => line.lineNumber.prev),
        next: annotateMultilineSide(lines, annotations.next, line => line.lineNumber.next),
    };
}
function annotateMultilineSide(lines, ogAnnotations, getLineNumber) {
    const annotations = [...ogAnnotations];
    annotations.sort((a, b) => a.lineNumbers.start - b.lineNumbers.start);
    let lineIndex = 0;
    const groups = [];
    while (lineIndex < lines.length) {
        const annotation = annotations[0];
        let line = lines[lineIndex];
        if (annotation &&
            getLineNumber(line) > annotation.lineNumbers.start) {
            throw "Code Hike can't handle two annotations for the same line";
        }
        if (annotation &&
            getLineNumber(line) === annotation.lineNumbers.start) {
            // create annotation group
            const group = {
                lines: [],
                annotation,
            };
            while (line &&
                (!getLineNumber(line) ||
                    getLineNumber(line) <=
                        annotation.lineNumbers.end)) {
                group.lines.push(line);
                line = lines[++lineIndex];
            }
            groups.push(group);
            annotations.shift();
        }
        else if (!annotation) {
            // create unannotated group until the end
            groups.push({ lines: lines.slice(lineIndex) });
            lineIndex = lines.length;
        }
        else {
            // create unannotated group until next annotation
            const group = {
                lines: [],
            };
            while (line &&
                (!getLineNumber(line) ||
                    getLineNumber(line) <
                        annotation.lineNumbers.start)) {
                group.lines.push(line);
                line = lines[++lineIndex];
            }
            groups.push(group);
        }
    }
    return groups;
}
// --- inline
function annotateInline(lines, inlineAnnotations) {
    return lines.map((_a) => {
        var { groups } = _a, line = __rest(_a, ["groups"]);
        const { lineNumber } = line;
        const annotations = {
            prev: lineNumber.prev
                ? inlineAnnotations.prev[lineNumber.prev] || []
                : [],
            next: lineNumber.next
                ? inlineAnnotations.next[lineNumber.next] || []
                : [],
        };
        return Object.assign(Object.assign({}, line), { annotatedGroups: annotateLineTokenGroups(groups, annotations) });
    });
}
/**
 * Generate a list of annotated groups tweens
 * each annotated group contains a list of token groups and maybe an annotation.
 * The two annotated groups in a tween doesn't need to have the same token groups.
 */
function annotateLineTokenGroups(tokenGroups, annotations) {
    let prevTokenGroups = [...tokenGroups];
    let nextTokenGroups = [...tokenGroups];
    const prevAnnotations = [...annotations.prev];
    const nextAnnotations = [...annotations.next];
    const annotatedGroups = [];
    let prevColumn = 1;
    let nextColumn = 1;
    // iterate until we consume both lists of token groups
    while (prevTokenGroups.length > 0 ||
        nextTokenGroups.length > 0) {
        const prevAnnotation = prevAnnotations[0];
        const nextAnnotation = nextAnnotations[0];
        const isPrevAnnotationStarting = prevAnnotation &&
            prevAnnotation.columnNumbers.start === prevColumn;
        const isNextAnnotationStarting = nextAnnotation &&
            nextAnnotation.columnNumbers.start === nextColumn;
        if (prevColumn < nextColumn) {
            // if the prev list is behind we consume from prevTokenGroups
            if (isPrevAnnotationStarting) {
                // if there is an annotation starting at this point we consume until the annotation ends
                const end = prevAnnotation.columnNumbers.end + 1;
                annotatedGroups.push({
                    prev: {
                        annotation: prevAnnotation,
                        groups: shiftGroups(prevTokenGroups, prevColumn, end),
                    },
                });
                prevColumn = end;
                prevAnnotations.shift();
            }
            else {
                // if there isn't we consume until we sync with the next list or an annotation starts
                const end = Math.min(nextColumn, (prevAnnotation === null || prevAnnotation === void 0 ? void 0 : prevAnnotation.columnNumbers.start) || nextColumn);
                annotatedGroups.push({
                    prev: {
                        groups: shiftGroups(prevTokenGroups, prevColumn, end),
                    },
                });
                prevColumn = end;
            }
        }
        else if (prevColumn > nextColumn) {
            // if the next list is behind we consume from nextTokenGroups
            if (isNextAnnotationStarting) {
                // if there is an annotation starting at this point we consume until the annotation ends
                const end = nextAnnotation.columnNumbers.end + 1;
                annotatedGroups.push({
                    next: {
                        annotation: nextAnnotation,
                        groups: shiftGroups(nextTokenGroups, nextColumn, end),
                    },
                });
                nextColumn = end;
                nextAnnotations.shift();
            }
            else {
                // if there isn't we consume until we sync with the prev list or an annotation starts
                const end = Math.min(prevColumn, (nextAnnotation === null || nextAnnotation === void 0 ? void 0 : nextAnnotation.columnNumbers.start) || prevColumn);
                annotatedGroups.push({
                    next: {
                        groups: shiftGroups(nextTokenGroups, nextColumn, end),
                    },
                });
                nextColumn = end;
            }
        }
        else if (prevColumn == nextColumn) {
            // if we are at the same column in both lists we have 5 different cases
            if (isPrevAnnotationStarting &&
                isNextAnnotationStarting &&
                prevAnnotation.columnNumbers.end ===
                    nextAnnotation.columnNumbers.end) {
                // both annotations starts here and end at the same place, so we puth both in one tween annotated group
                const end = nextAnnotation.columnNumbers.end + 1;
                annotatedGroups.push({
                    prev: {
                        annotation: prevAnnotation,
                        groups: shiftGroups(prevTokenGroups, prevColumn, end),
                    },
                    next: {
                        annotation: nextAnnotation,
                        groups: shiftGroups(nextTokenGroups, nextColumn, end),
                    },
                });
                prevColumn = end;
                nextColumn = end;
                prevAnnotations.shift();
                nextAnnotations.shift();
            }
            else if (isPrevAnnotationStarting) {
                // if only the prev annotation starting at this point we consume until the annotation ends
                const end = prevAnnotation.columnNumbers.end + 1;
                annotatedGroups.push({
                    prev: {
                        annotation: prevAnnotation,
                        groups: shiftGroups(prevTokenGroups, prevColumn, end),
                    },
                });
                prevColumn = end;
                prevAnnotations.shift();
            }
            else if (isNextAnnotationStarting) {
                // same for the next annotation
                const end = nextAnnotation.columnNumbers.end + 1;
                annotatedGroups.push({
                    next: {
                        annotation: nextAnnotation,
                        groups: shiftGroups(nextTokenGroups, nextColumn, end),
                    },
                });
                nextColumn = end;
                nextAnnotations.shift();
            }
            else if (!prevAnnotation && !nextAnnotation) {
                // if there aren't any remaining annotation we add a last group
                annotatedGroups.push({
                    prev: { groups: prevTokenGroups },
                    next: { groups: nextTokenGroups },
                });
                // this is the last iteration
                prevTokenGroups = [];
                nextTokenGroups = [];
            }
            else {
                // if we still have annotations left we consume until the next one
                const end = Math.min((prevAnnotation === null || prevAnnotation === void 0 ? void 0 : prevAnnotation.columnNumbers.start) ||
                    Number.MAX_VALUE, (nextAnnotation === null || nextAnnotation === void 0 ? void 0 : nextAnnotation.columnNumbers.start) ||
                    Number.MAX_VALUE);
                annotatedGroups.push({
                    prev: {
                        groups: shiftGroups(prevTokenGroups, prevColumn, end),
                    },
                    next: {
                        groups: shiftGroups(nextTokenGroups, nextColumn, end),
                    },
                });
                prevColumn = end;
                nextColumn = end;
            }
        }
    }
    return annotatedGroups;
}
/**
 * Remove and return some groups from the beggining of the array
 * startColumn is the column at which the array is starting
 * (because other groups has been already removed)
 * newStartColumn is the first column that should stay in the array
 */
function shiftGroups(tokenGroups, startColumn, newStartColumn) {
    const removedGroups = [];
    let currentStartColumn = startColumn;
    while (currentStartColumn < newStartColumn &&
        tokenGroups.length > 0) {
        const currentTokenGroup = tokenGroups.shift();
        removedGroups.push(currentTokenGroup);
        const length = currentTokenGroup.tokens.reduce((a, t) => a + t.content.length, 0);
        currentStartColumn += length;
    }
    return removedGroups;
}

function useStepParser(input) {
    const { highlightedLines, theme, focus } = input;
    return React__default["default"].useMemo(() => parse$1(input), [
        highlightedLines.prev,
        highlightedLines.next,
        focus.prev,
        focus.next,
        theme,
    ]);
}
function parse$1({ theme, focus, annotations, highlightedLines, lang, }) {
    const normalCode = getCode(highlightedLines);
    const mergedCode = merge(normalCode, highlightedLines);
    const { inlineAnnotations, multilineAnnotations } = parseAllAnnotations(annotations, theme);
    const focusedCode = splitLinesByFocus(mergedCode, withDefault(focus, null), inlineAnnotations);
    const annotatedCode = addAnnotations(focusedCode, inlineAnnotations, multilineAnnotations);
    const codeStep = addExtraStuff(annotatedCode, normalCode, lang);
    // console.log({ codeStep })
    return codeStep;
}
// 0 - normalize
function getCode(highlightedLines) {
    return map(highlightedLines, lines => lines
        .map(line => line.tokens.map(t => t.content).join(""))
        .join("\n")
        .trimEnd()
        .concat("\n"));
}
function merge(code, highlightedLines) {
    return mergeLines(code, highlightedLines);
}
function parseAllAnnotations(annotations, theme) {
    return parseAnnotations(annotations, theme);
}
function splitLinesByFocus(mergedCode, focus, annotations) {
    return splitByFocus(mergedCode, focus, annotations);
}
function addAnnotations(_a, inlineAnnotations, annotations) {
    var { lines } = _a, focusedCode = __rest(_a, ["lines"]);
    const annotatedLines = annotateInline(lines, inlineAnnotations);
    const lineGroups = annotateMultiline(annotatedLines, annotations);
    return Object.assign(Object.assign({}, focusedCode), { lineGroups: lineGroups, lineCount: {
            prev: lines.filter(l => l.lineNumber.prev != null)
                .length,
            next: lines.filter(l => l.lineNumber.next != null)
                .length,
        } });
}
function addExtraStuff(codeStep, code, lang) {
    const vInterval = verticalInterval(codeStep.enterCount, codeStep.exitCount);
    const newGroups = map(codeStep.lineGroups, groups => groups.map(group => (Object.assign(Object.assign({}, group), { lines: getLinesWithElements(group.lines, vInterval, codeStep.enterCount, codeStep.exitCount) }))));
    return Object.assign(Object.assign({}, codeStep), { groups: newGroups, verticalInterval: vInterval, code,
        lang });
}
function verticalInterval(enterCount, exitCount) {
    if (enterCount <= 0 && exitCount <= 0)
        return [0, 1];
    if (enterCount <= 0 && exitCount >= 1)
        return [0.33, 1];
    if (enterCount >= 1 && exitCount <= 0)
        return [0, 0.67];
    return [0.25, 0.75];
}

function SmoothContainer({ dimensions, codeStep, children, minZoom = 0, maxZoom = 1.2, center = false, progress, }) {
    const { prev, next } = getTweenContentProps({
        codeStep,
        dimensions,
        minZoom,
        maxZoom,
        horizontalCenter: center,
    });
    // all these tweens depends on annotations now (t instead of progress)
    const zoom = tweenProp(prev.zoom, next.zoom, progress);
    const dx = tweenProp(prev.dx, next.dx, progress);
    const dy = tweenProp(prev.dy, next.dy, progress, codeStep.verticalInterval);
    const focusHeight = tweenProp(prev.focusHeight, next.focusHeight, progress);
    const focusWidth = tweenProp(prev.focusWidth, next.focusWidth, progress);
    const lineNumberPad = ((dimensions === null || dimensions === void 0 ? void 0 : dimensions.lineNumberWidth) || 0) * zoom;
    const leftPad = lineNumberPad || 16;
    const width = Math.max(focusWidth + leftPad, dimensions.contentWidth);
    const startX = leftPad / zoom;
    return (React__default["default"].createElement(Container, { width: dimensions.containerWidth, height: dimensions.containerHeight, lang: codeStep.lang },
        React__default["default"].createElement(Content$1, { dx: dx, dy: dy, scale: zoom, height: Math.max(focusHeight, dimensions.contentHeight), width: width }, children(focusWidth, startX))));
}
function Container({ width, height, children, lang, }) {
    return (React__default["default"].createElement("code", { style: {
            width,
            height,
            position: "relative",
            overflow: "auto",
        }, className: "ch-code-scroll-parent", children: children, "data-ch-lang": lang }));
}
function Content$1({ dx, dy, scale, height, width, children, }) {
    return (React__default["default"].createElement("div", { style: {
            position: "absolute",
            top: 0,
            left: 0,
            transformOrigin: "top left",
            width: width,
            height: height,
            overflow: "hidden",
        }, className: "ch-code-scroll-content" },
        React__default["default"].createElement("div", { style: {
                position: "absolute",
                top: 0,
                left: 0,
                transform: `translateX(${dx}px) translateY(${dy}px) scale(${scale})`,
                transformOrigin: "left top",
                width: width / scale,
                height: (height - 2 * dy) / scale,
                // outline: "1px solid yellow",
            }, children: children })));
}
function getTweenContentProps(_a) {
    var { codeStep } = _a, rest = __rest(_a, ["codeStep"]);
    const { lineHeight, lineWidth } = rest.dimensions;
    const paramTween = {
        prev: {
            extremes: [
                codeStep.firstFocusedLineNumber.prev - 1,
                codeStep.lastFocusedLineNumber.prev - 1,
            ],
            originalContentHeight: codeStep.lineCount.prev * lineHeight,
            lineWidth: lineWidth[0],
        },
        next: {
            extremes: [
                codeStep.firstFocusedLineNumber.next - 1,
                codeStep.lastFocusedLineNumber.next - 1,
            ],
            originalContentHeight: codeStep.lineCount.next * lineHeight,
            lineWidth: lineWidth[1],
        },
    };
    return map(paramTween, ({ extremes, originalContentHeight, lineWidth }) => getContentProps(Object.assign({ extremes,
        originalContentHeight,
        lineWidth }, rest)));
}
function getContentProps({ dimensions, lineWidth, minZoom, maxZoom, extremes, originalContentHeight, horizontalCenter, }) {
    const { lineHeight } = dimensions;
    const containerHeight = dimensions === null || dimensions === void 0 ? void 0 : dimensions.contentHeight;
    const containerWidth = dimensions === null || dimensions === void 0 ? void 0 : dimensions.contentWidth;
    const originalFocusHeight = (extremes[1] - extremes[0] + 3) * lineHeight;
    const leftPadding = (dimensions === null || dimensions === void 0 ? void 0 : dimensions.lineNumberWidth) || 16;
    const rightPadding = 16;
    const zoom = Math.max(Math.min((containerWidth - leftPadding - rightPadding) /
        lineWidth, containerHeight / originalFocusHeight, maxZoom), minZoom);
    const contentHeight = originalContentHeight * zoom;
    const focusStart = (extremes[0] - 1) * lineHeight * zoom;
    const focusEnd = (extremes[1] + 2) * lineHeight * zoom;
    const focusCenter = (focusEnd + focusStart) / 2;
    const focusHeight = focusEnd - focusStart;
    const dy = containerHeight > contentHeight
        ? (containerHeight - contentHeight) / 2
        : clamp$1(containerHeight / 2 - focusCenter, Math.max(containerHeight - contentHeight, -focusStart // to ensure first focus line is shown when focus is bigger than container
        ), 0);
    const dx = horizontalCenter
        ? Math.max(containerWidth / 2 - (lineWidth * zoom) / 2, 0)
        : 0;
    return {
        zoom,
        dx,
        dy,
        focusHeight: focusHeight,
        focusWidth: lineWidth * zoom,
    };
}
function clamp$1(num, min, max) {
    return num <= min ? min : num >= max ? max : num;
}
function tweenProp(start, end, progress, interval = [0, 1]) {
    return tween$1({
        fixed: false,
        interval,
        extremes: [start, end],
        ease: easing.easeInOutCubic,
    }, progress);
}

function SmoothLines(props) {
    return (React__default["default"].createElement(SmoothContainer, Object.assign({}, props), (focusWidth, startX) => (React__default["default"].createElement(Lines, { codeStep: props.codeStep, focusWidth: focusWidth, lineHeight: props.dimensions.lineHeight, progress: props.progress, theme: props.theme, startX: startX, lineNumberWidth: props.dimensions.lineNumberWidth }))));
}
function Lines({ codeStep, progress, focusWidth, lineHeight, startX, theme, lineNumberWidth, }) {
    const groups = progress < 0.5
        ? codeStep.groups.prev
        : codeStep.groups.next;
    return (React__default["default"].createElement(React__default["default"].Fragment, null, groups.map((group, i) => {
        if (!group.annotation) {
            return (React__default["default"].createElement(LineGroup, { lines: group.lines, t: progress, focusWidth: focusWidth, lineHeight: lineHeight, startX: startX, key: i, theme: theme, lineNumberWidth: lineNumberWidth }));
        }
        const startY = tween$1(group.lines[0].tweenY, progress);
        const lineCount = group.annotation.lineNumbers.end -
            group.annotation.lineNumbers.start +
            1;
        const Component = group.annotation.Component;
        return (React__default["default"].createElement(Component, { style: {
                position: "absolute",
                height: lineCount * lineHeight,
                width: "100%",
                transform: `translateY(${startY * lineHeight}px)`,
            }, key: i, data: group.annotation.data, theme: group.annotation.theme, isInline: false },
            React__default["default"].createElement(LineGroup, { lines: group.lines, t: progress, focusWidth: focusWidth, lineHeight: lineHeight, startY: startY, startX: startX, theme: theme, lineNumberWidth: lineNumberWidth })));
    })));
}
function LineGroup({ lines, focusWidth, lineHeight, t, startX, startY = 0, theme, lineNumberWidth, }) {
    return (React__default["default"].createElement(React__default["default"].Fragment, null, lines.map((line, key) => {
        const { tweenX, tweenY, focused } = line;
        const dx = tween$1(tweenX, t);
        const dy = tween$1(tweenY, t);
        const opacity = getOpacity(focused, t, dx);
        return (React__default["default"].createElement(React__default["default"].Fragment, { key: key },
            lineNumberWidth ? (React__default["default"].createElement("span", { className: "ch-code-line-number", style: {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    transform: `translate(${dx * focusWidth}px, ${(dy - startY) * lineHeight}px)`,
                    width: lineNumberWidth,
                    opacity,
                    color: getColor(theme, ColorName.LineNumberForeground),
                } }, t < 0.5
                ? line.lineNumber.prev
                : line.lineNumber.next)) : undefined,
            React__default["default"].createElement(LineContainer, { dx: startX + dx * focusWidth, dy: (dy - startY) * lineHeight, width: focusWidth, opacity: opacity },
                React__default["default"].createElement(LineContent, { line: line, progress: t, dx: dx }))));
    })));
}
function LineContent({ line, progress, dx, }) {
    return (React__default["default"].createElement("div", { style: {
            display: "inline-block",
            width: "100%",
        } },
        line.annotatedGroups.map((annotatedGroup, i) => (React__default["default"].createElement(AnnotatedTokens, { annotatedGroup: annotatedGroup, progress: progress, dx: dx, key: i }))),
        React__default["default"].createElement("br", null)));
}
function AnnotatedTokens({ annotatedGroup, progress, dx, }) {
    var _a, _b, _c;
    const annotated = progress < 0.5
        ? annotatedGroup.prev
        : annotatedGroup.next;
    const tokenGroups = (annotated === null || annotated === void 0 ? void 0 : annotated.groups) || [];
    const Component = (_a = annotated === null || annotated === void 0 ? void 0 : annotated.annotation) === null || _a === void 0 ? void 0 : _a.Component;
    const children = tokenGroups.map((group, i) => {
        const opacity = getOpacity(group.focused, progress, dx);
        return (React__default["default"].createElement("span", { style: { opacity }, key: i + 1 }, group.element));
    });
    return Component ? (React__default["default"].createElement(Component, { children: children, data: (_b = annotated === null || annotated === void 0 ? void 0 : annotated.annotation) === null || _b === void 0 ? void 0 : _b.data, theme: (_c = annotated === null || annotated === void 0 ? void 0 : annotated.annotation) === null || _c === void 0 ? void 0 : _c.theme, isInline: true })) : (React__default["default"].createElement(React__default["default"].Fragment, null, children));
}
function LineContainer({ children, dx, dy, opacity, width, }) {
    return (React__default["default"].createElement("div", { style: {
            position: "absolute",
            top: 0,
            left: 0,
            transform: `translate(${dx}px, ${dy}px)`,
            width,
            display: opacity <= 0 ? "none" : undefined,
        } }, children));
}
const OFF_OPACITY = 0.33;
function getOpacity(focused, progress, dx) {
    return (tween$1({
        fixed: false,
        extremes: [
            focused.prev ? 0.99 : OFF_OPACITY,
            focused.next ? 0.99 : OFF_OPACITY,
        ],
        interval: [0, 1],
    }, progress) -
        Math.abs(dx) * 1);
}

function CopyButton({ content, style, className, }) {
    const [copied, setCopied] = React__default["default"].useState(false);
    return (React__default["default"].createElement("svg", { style: style, onClick: () => {
            copyToClipboard(content);
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
            }, 1200);
        }, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", className: className },
        React__default["default"].createElement("title", null, "Copy"),
        copied ? (React__default["default"].createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" })) : (React__default["default"].createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "1.6px", d: "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" }))));
}
function copyToClipboard(text) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text);
}
function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        var successful = document.execCommand("copy");
        // var msg = successful ? "successful" : "unsuccessful"
        // console.log("Fallback: Copying text command was " + msg)
    }
    catch (err) {
        // console.error("Fallback: Oops, unable to copy", err)
    }
    document.body.removeChild(textArea);
}

function useCodeShift({ tween, theme, }) {
    return useStepParser({
        highlightedLines: map(tween, tween => tween.code.lines),
        theme,
        focus: map(tween, tween => tween.focus),
        annotations: map(tween, tween => tween.annotations),
        lang: anyValue(tween, tween => { var _a; return (_a = tween === null || tween === void 0 ? void 0 : tween.code) === null || _a === void 0 ? void 0 : _a.lang; }),
    });
}
const DEFAULT_MIN_COLUMNS = 10;
function CodeTween(_a) {
    var { tween, progress, config } = _a, preProps = __rest(_a, ["tween", "progress", "config"]);
    const stepInfo = useCodeShift({
        tween,
        theme: config.theme,
    });
    const { element, dimensions } = useDimensions(stepInfo.code, map(tween, tween => tween.focus), config.minColumns || DEFAULT_MIN_COLUMNS, config.lineNumbers || false, config.rows, [config.parentHeight]);
    return !dimensions || config.debug ? (React__default["default"].createElement(BeforeDimensions, { element: element, htmlProps: preProps, debug: config.debug })) : (React__default["default"].createElement(AfterDimensions, { dimensions: dimensions, stepInfo: stepInfo, config: config, progress: progress, htmlProps: preProps }));
}
function BeforeDimensions({ element, htmlProps, debug, }) {
    return (React__default["default"].createElement(Wrapper, { htmlProps: htmlProps, style: { opacity: debug ? 0.9 : 0, overflow: "auto" } }, element));
}
function AfterDimensions({ config: { minZoom = 1, maxZoom = 1, horizontalCenter = false, theme, }, dimensions, stepInfo, progress, htmlProps, config, }) {
    var _a;
    const { bg, fg } = getCodeColors(theme);
    return (React__default["default"].createElement(Wrapper, { htmlProps: htmlProps, style: {
            opacity: 1,
            backgroundColor: bg,
            color: fg,
            ["colorScheme"]: getColorScheme(theme),
            ["--ch-selection-background"]: getColor(theme, ColorName.SelectionBackground),
        } },
        React__default["default"].createElement(SmoothLines, { codeStep: stepInfo, progress: progress, dimensions: dimensions, 
            // TODO move to dimensions?
            minZoom: minZoom, maxZoom: maxZoom, center: horizontalCenter, theme: theme }),
        config.showCopyButton ? (React__default["default"].createElement(CopyButton, { className: "ch-code-button", content: (_a = stepInfo === null || stepInfo === void 0 ? void 0 : stepInfo.code) === null || _a === void 0 ? void 0 : _a.prev })) : undefined));
}
function Wrapper({ htmlProps, style, children, }) {
    return (React__default["default"].createElement("div", Object.assign({ className: "ch-code-wrapper" }, htmlProps, { style: Object.assign(Object.assign({ margin: 0, padding: 0, position: "relative", 
            // using this instead of <pre> because https://github.com/code-hike/codehike/issues/120
            whiteSpace: "pre", 
            // to avoid resets using "border-box" that break the scrollbar https://github.com/code-hike/codehike/issues/240
            boxSizing: "content-box" }, style), htmlProps === null || htmlProps === void 0 ? void 0 : htmlProps.style), children: children })));
}

function currentTime() {
  if (typeof window !== "undefined") {
    return performance.now();
  } else {
    return 0;
  }
}

function useSpringInstance(target, config) {
  var ref = React__default["default"].useRef(null);

  if (ref.current == null) {
    ref.current = {
      config: getConfigWithDefaults(target, config),
      state: getInitialState(target, config)
    };
  }

  return ref.current;
}
function getConfigWithDefaults(target, _ref) {
  var stiffness = _ref.stiffness,
      damping = _ref.damping,
      mass = _ref.mass,
      decimals = _ref.decimals,
      teleport = _ref.teleport;
  return {
    X: target,
    k: stiffness !== null && stiffness !== void 0 ? stiffness : 170,
    c: damping !== null && damping !== void 0 ? damping : 26,
    m: mass !== null && mass !== void 0 ? mass : 1,
    teleport: teleport !== null && teleport !== void 0 ? teleport : false,
    decimals: decimals !== null && decimals !== void 0 ? decimals : 2
  };
}

function getInitialState(target, _ref2) {
  var from = _ref2.from,
      initialSpeed = _ref2.initialSpeed;
  return {
    x0: from !== null && from !== void 0 ? from : target,
    v0: initialSpeed !== null && initialSpeed !== void 0 ? initialSpeed : 0,
    t0: currentTime(),
    raf: null
  };
}

var sqrt = Math.sqrt,
    exp = Math.exp,
    sin = Math.sin,
    cos = Math.cos;
function spring(_ref) {
  var x0 = _ref.x0,
      v0 = _ref.v0,
      t0 = _ref.t0,
      t = _ref.t,
      k = _ref.k,
      c = _ref.c,
      m = _ref.m,
      X = _ref.X;
  var dx = x0 - X;
  var dt = (t - t0) / 1000;
  var radicand = c * c - 4 * k * m;

  if (radicand > 0) {
    var rp = (-c + sqrt(radicand)) / (2 * m);
    var rn = (-c - sqrt(radicand)) / (2 * m);
    var a = (dx * rp - v0) / (rp - rn);
    var b = (v0 - dx * rn) / (rp - rn);
    return {
      x: X + a * exp(rn * dt) + b * exp(rp * dt),
      v: a * rn * exp(rn * dt) + b * rp * exp(rp * dt)
    };
  } else if (radicand < 0) {
    var r = -c / (2 * m);
    var s = sqrt(-radicand) / (2 * m);
    var _a = dx;

    var _b = (v0 - r * dx) / s;

    return {
      x: X + exp(r * dt) * (_a * cos(s * dt) + _b * sin(s * dt)),
      v: exp(r * dt) * ((_b * s + _a * r) * cos(s * dt) - (_a * s - _b * r) * sin(s * dt))
    };
  } else {
    var _r = -c / (2 * m);

    var _a2 = dx;

    var _b2 = v0 - _r * dx;

    return {
      x: X + (_a2 + _b2 * dt) * exp(_r * dt),
      v: (_b2 + _a2 * _r + _b2 * _r * dt) * exp(_r * dt)
    };
  }
}

var nextFrameQueue = [];
var nextFrameId = null;
function queueAnimationFrame(fn) {
  var length = nextFrameQueue.push(fn);

  if (length === 1) {
    nextFrameId = requestAnimationFrame(runQueue);
  }

  return [nextFrameId, length - 1];
}
function unqueueAnimationFrame(_ref) {
  var frameId = _ref[0],
      index = _ref[1];

  if (frameId === nextFrameId) {
    delete nextFrameQueue[index];
  }
}

function runQueue() {
  var now = currentTime();
  var queue = nextFrameQueue;
  nextFrameQueue = [];
  reactDom.unstable_batchedUpdates(function () {
    return queue.forEach(function (task) {
      return task && task(now);
    });
  });
}

var useLayoutEffect$3 = typeof window !== "undefined" ? React__default["default"].useLayoutEffect : React__default["default"].useEffect;
function useSpring(target, config) {
  if (config === void 0) {
    config = {};
  }

  var _React$useState = React__default["default"].useState(),
      forceUpdate = _React$useState[1];

  var newConfig = getConfigWithDefaults(target, config);

  var _useSpringInstance = useSpringInstance(target, config),
      state = _useSpringInstance.state,
      oldConfig = _useSpringInstance.config; // TODO all springs should use the same t in the same frame


  var t = currentTime();
  var x0 = state.x0,
      v0 = state.v0,
      t0 = state.t0;
  var k = oldConfig.k,
      c = oldConfig.c,
      m = oldConfig.m,
      X = oldConfig.X;

  var _ref = newConfig.teleport ? {
    x: X,
    v: 0
  } : spring({
    x0: x0,
    v0: v0,
    t0: t0,
    t: t,
    k: k,
    c: c,
    m: m,
    X: X
  }),
      x = _ref.x,
      v = _ref.v;

  var moving = isMoving(x, v, t, newConfig);
  useLayoutEffect$3(function () {
    Object.assign(oldConfig, newConfig);
  }, [newConfig.X, newConfig.k, newConfig.c, newConfig.m, newConfig.teleport]);
  useLayoutEffect$3(function () {
    state.x0 = x;
    state.v0 = v;
    state.t0 = t;
  }, [x, v, t]);
  useLayoutEffect$3(function () {
    var loop = function loop(now) {
      var x0 = state.x0,
          v0 = state.v0,
          t0 = state.t0;
      var k = oldConfig.k,
          c = oldConfig.c,
          m = oldConfig.m,
          X = oldConfig.X,
          decimals = oldConfig.decimals;

      var _spring = spring({
        x0: x0,
        v0: v0,
        t0: t0,
        t: now,
        k: k,
        c: c,
        m: m,
        X: X
      }),
          nextX = _spring.x;

      if (roundTo(nextX, decimals) !== roundTo(x0, decimals)) {
        state.raf = null;
        forceUpdate(now);
      } else {
        state.raf = queueAnimationFrame(loop);
      }
    };

    if (moving && state.raf == null) {
      state.raf = queueAnimationFrame(loop);
    } else if (!moving && state.raf != null) {
      unqueueAnimationFrame(state.raf);
      state.raf = null;
    }
  });
  useLayoutEffect$3(function () {
    return function () {
      if (state.raf != null) {
        unqueueAnimationFrame(state.raf);
      }
    };
  }, []);
  return [roundTo(x, newConfig.decimals), moving];
}

function isMoving(x, v, t, _ref2) {
  var decimals = _ref2.decimals,
      X = _ref2.X,
      k = _ref2.k,
      c = _ref2.c,
      m = _ref2.m;

  if (roundTo(x, decimals) !== roundTo(X, decimals)) {
    return true;
  }

  var nextT = t + 0.016;

  var _spring2 = spring({
    x0: x,
    v0: v,
    t0: t,
    t: nextT,
    k: k,
    c: c,
    m: m,
    X: X
  }),
      nextX = _spring2.x;

  return roundTo(nextX, decimals) !== roundTo(X, decimals);
}

function roundTo(x, decimals) {
  var p = Math.pow(10, decimals);
  return Math.round(x * p) / p;
}

const defaultSpring$1 = {
    stiffness: 120,
    damping: 24,
    mass: 0.2,
    decimals: 3,
};
function CodeSpring(_a) {
    var { step, config } = _a, htmlProps = __rest(_a, ["step", "config"]);
    const { tween, t } = useStepSpring$1(step, config.spring);
    return (React__default["default"].createElement(CodeTween, Object.assign({ tween: tween, progress: t, config: config }, htmlProps)));
}
function useStepSpring$1(step, springConfig = defaultSpring$1) {
    const [{ target, steps, index }, setState] = React__default["default"].useState({
        target: 2,
        steps: [step, step, step],
        index: 0,
    });
    React__default["default"].useEffect(() => {
        const lastStep = steps[steps.length - 1];
        if (lastStep != step) {
            setState(s => updateStepSpring$1(s, step, progress));
        }
    }, [step]);
    const [progress] = useSpring(target, springConfig);
    const trioProgress = progress - index;
    const result = trioProgress <= 1
        ? {
            tween: { prev: steps[0], next: steps[1] },
            t: trioProgress,
        }
        : {
            tween: { prev: steps[1], next: steps[2] },
            t: trioProgress - 1,
        };
    return result;
}
function updateStepSpring$1(state, newStep, progress) {
    const { steps, target, index } = state;
    const stepsClone = steps.slice();
    const trioProgress = progress - index;
    if (trioProgress < 1) {
        stepsClone[2] = newStep;
        return Object.assign(Object.assign({}, state), { steps: stepsClone });
    }
    else {
        stepsClone[0] = steps[1];
        stepsClone[1] = steps[2];
        stepsClone[2] = newStep;
        return Object.assign(Object.assign({}, state), { steps: stepsClone, target: target + 1, index: index + 1 });
    }
}

const ClasserContext = React.createContext({});
function ClasserProvider({ classes, children, }) {
    const outer = React.useContext(ClasserContext);
    const mixed = useMerge(outer, classes);
    return (React__default["default"].createElement(ClasserContext.Provider, { value: mixed, children: children }));
}
function useClasser(libClassPrefix, innerClasses) {
    const outerClasses = React.useContext(ClasserContext);
    const classes = useMerge(outerClasses, innerClasses);
    return React.useCallback(getClasser(libClassPrefix, classes), [
        libClassPrefix,
        classes,
    ]);
}
function getClasser(libClassPrefix, classes) {
    return function classer(...libClassSuffixList) {
        const libClassList = libClassSuffixList.map(libClassSuffix => libClassPrefix +
            (libClassPrefix && libClassSuffix ? "-" : "") +
            libClassSuffix);
        const outputList = libClassList.slice();
        libClassList.forEach(libClass => {
            if (libClass in classes) {
                outputList.push(classes[libClass]);
            }
        });
        return outputList.join(" ");
    };
}
function useMerge(outer, inner) {
    return React.useMemo(() => (Object.assign(Object.assign({}, outer), inner)), [outer, inner]);
}

const MiniFrame = React__default["default"].forwardRef(function (_a, ref) {
    var { title, children, titleBar, classes, theme, zoom = 1, overflow } = _a, props = __rest(_a, ["title", "children", "titleBar", "classes", "theme", "zoom", "overflow"]);
    const c = useClasser("ch-frame", classes);
    const bar = titleBar || React__default["default"].createElement(DefaultTitleBar, { title: title });
    const zoomStyle = {
        "--ch-frame-zoom": zoom,
        overflow,
    };
    return (React__default["default"].createElement(ClasserProvider, { classes: classes },
        React__default["default"].createElement("div", Object.assign({}, props, { ref: ref }),
            React__default["default"].createElement("div", { className: c("") },
                React__default["default"].createElement("div", { className: c("title-bar"), style: {
                        background: getColor(theme, ColorName.EditorGroupHeaderBackground),
                    } }, bar),
                React__default["default"].createElement("div", { className: c("content") },
                    React__default["default"].createElement("div", { className: c("zoom"), style: zoomStyle }, children))))));
});
React__default["default"].forwardRef(function (_a, ref) {
    var { title, children, titleBar, classes, overflow } = _a, props = __rest(_a, ["title", "children", "titleBar", "classes", "overflow"]);
    const c = useClasser("ch", classes);
    const bar = titleBar || React__default["default"].createElement(DefaultTitleBar, { title: title });
    return (React__default["default"].createElement(ClasserProvider, { classes: classes },
        React__default["default"].createElement("div", Object.assign({}, props, { ref: ref }),
            React__default["default"].createElement("div", { className: c("simple-frame") },
                React__default["default"].createElement("div", { className: c("frame-title-bar") }, bar),
                children))));
});
function DefaultTitleBar({ title }) {
    const c = useClasser("ch-frame");
    return (React__default["default"].createElement(React__default["default"].Fragment, null,
        React__default["default"].createElement("div", { className: c("left-bar") },
            React__default["default"].createElement(FrameButtons, null)),
        React__default["default"].createElement("div", { className: c("middle-bar") }, title),
        React__default["default"].createElement("div", { className: c("right-bar") })));
}
function FrameButtons() {
    const c = useClasser("ch-frame");
    return (React__default["default"].createElement("div", { className: c("buttons") },
        React__default["default"].createElement("div", { className: c("button", "button-left") }),
        React__default["default"].createElement("div", { className: c("button-space") }),
        React__default["default"].createElement("div", { className: c("button", "button-middle") }),
        React__default["default"].createElement("div", { className: c("button-space") }),
        React__default["default"].createElement("div", { className: c("button", "button-right") })));
}

const EditorFrame = React__default["default"].forwardRef(function InnerEditorFrame(_a, ref) {
    var _b;
    var { northPanel, southPanel, terminalPanel, style, height, northButton, southButton, theme, className, onTabClick } = _a, rest = __rest(_a, ["northPanel", "southPanel", "terminalPanel", "style", "height", "northButton", "southButton", "theme", "className", "onTabClick"]);
    return (React__default["default"].createElement("div", Object.assign({ ref: ref }, rest, { className: "ch-editor-frame", style: Object.assign({ background: getColor(theme, ColorName.EditorBackground) }, style) }),
        React__default["default"].createElement("div", { className: "ch-frame-title-bar", style: {
                color: getColor(theme, ColorName.IconForeground),
                background: getColor(theme, ColorName.EditorGroupHeaderBackground),
            } },
            React__default["default"].createElement(TabsContainer, { tabs: northPanel.tabs, showFrameButtons: true, button: northButton, panel: "north", theme: theme, onTabClick: onTabClick })),
        React__default["default"].createElement("div", { "data-ch-panel": "north", style: northPanel.style, children: northPanel.children }),
        southPanel && (React__default["default"].createElement(React__default["default"].Fragment, null,
            React__default["default"].createElement("div", { className: "ch-frame-title-bar", style: {
                    transform: (_b = southPanel.style) === null || _b === void 0 ? void 0 : _b.transform,
                    color: getColor(theme, ColorName.IconForeground),
                    background: getColor(theme, ColorName.EditorGroupHeaderBackground),
                } },
                React__default["default"].createElement(TabsContainer, { tabs: southPanel.tabs, showFrameButtons: false, button: southButton, topBorder: true, panel: "south", theme: theme, onTabClick: onTabClick })),
            React__default["default"].createElement("div", { "data-ch-panel": "south", children: southPanel.children, style: southPanel.style })))));
});
function TabsContainer({ tabs, button, showFrameButtons, topBorder, panel, theme, onTabClick, }) {
    const c = useClasser("ch-editor-tab");
    return (React__default["default"].createElement(React__default["default"].Fragment, null,
        topBorder && (React__default["default"].createElement("div", { style: {
                position: "absolute",
                height: "1px",
                background: getColor(theme, ColorName.EditorGroupBorder),
                width: "100%",
                top: 0,
                zIndex: 1,
            } })),
        showFrameButtons ? React__default["default"].createElement(FrameButtons, null) : React__default["default"].createElement("div", null),
        tabs.map(({ title, active, style }) => (React__default["default"].createElement("div", { key: title, title: title, "data-ch-tab": panel, className: c("", active ? "active" : "inactive"), style: Object.assign(Object.assign({}, style), { background: getColor(theme, active
                    ? ColorName.ActiveTabBackground
                    : ColorName.InactiveTabBackground), color: getColor(theme, active
                    ? ColorName.ActiveTabForeground
                    : ColorName.InactiveTabForeground), borderRightColor: getColor(theme, ColorName.TabBorder), borderBottomColor: getColor(theme, active
                    ? ColorName.ActiveTabBottomBorder
                    : ColorName.InactiveTabBackground) }), onClick: onTabClick && (() => onTabClick(title)) },
            React__default["default"].createElement(TabTitle, { title: title })))),
        React__default["default"].createElement("div", { style: { flex: 1, minWidth: "0.8em" } }),
        button));
}
function TabTitle({ title }) {
    if (!title) {
        return React__default["default"].createElement("div", null);
    }
    const separatorIndex = title.lastIndexOf("/") + 1;
    const filename = title.substring(separatorIndex);
    const folder = title.substring(0, separatorIndex);
    return (React__default["default"].createElement("div", null,
        React__default["default"].createElement("span", { style: { opacity: 0.5 } }, folder),
        filename));
}

function getCommands(text) {
    const [, ...lines] = text.split(/^\$\s*/gm);
    const commands = lines.map((c) => {
        const [run, ...outputLines] = c.split(/\r?\n/);
        return {
            run,
            output: outputLines.length > 0 ? outputLines.join("\n") : null,
        };
    });
    const lastCommand = commands[commands.length - 1];
    const isRunning = commands.length > 0 && lastCommand.output != null;
    const title = isRunning ? lastCommand.run.split(/(\s+)/)[0] : "bash";
    return {
        title,
        isRunning,
        commands,
    };
}

const prompt = React__default["default"].createElement("span", { className: "ch-terminal-prompt" }, "$");
function TerminalContent({ text, progress = 1, style, }) {
    const commands = parse(text, progress);
    return (React__default["default"].createElement("pre", { style: style, className: "ch-terminal-content" }, commands.map(({ run, output }, i) => (React__default["default"].createElement(React__default["default"].Fragment, { key: i },
        React__default["default"].createElement("div", null,
            prompt,
            " ",
            React__default["default"].createElement("span", null, run)),
        output && (React__default["default"].createElement("div", { className: "ch-terminal-output" }, output)))))));
}
function parse(text, progress) {
    if (!text)
        return [];
    const chars = Math.round(text.length * progress);
    const { commands } = getCommands(text.slice(0, chars));
    return commands;
}

function InnerTerminalTransition({ prev = "", prevKey, next = "", nextKey, progress, }) {
    return (React__default["default"].createElement("div", { className: "ch-terminal" },
        React__default["default"].createElement("div", { style: {
                position: "relative",
                transform: `translateY(-${progress * 100}%)`,
            } },
            React__default["default"].createElement(TerminalContent, { text: prev, progress: 1, key: prevKey }),
            React__default["default"].createElement(TerminalContent, { style: { position: "absolute" }, text: next, progress: progress, key: nextKey }))));
}

function InnerTerminalTransitions({ steps, progress, }) {
    const textSteps = steps.map((s) => s.text);
    const stepProgress = progress % 1;
    const prevIndex = clamp(Math.floor(progress), 0, steps.length - 1);
    const nextIndex = prevIndex + 1;
    return (React__default["default"].createElement(InnerTerminalTransition, { prev: textSteps[prevIndex], prevKey: prevIndex, next: textSteps[nextIndex] || "", nextKey: nextIndex, progress: stepProgress }));
}
function clamp(x, min, max) {
    return Math.min(Math.max(x, min), max);
}

function TerminalPanel({ prev, next, t, backward, }) {
    const height = getHeight({ prev, next, t, backward });
    return !height ? null : (React__default["default"].createElement("div", { className: "ch-editor-terminal", style: { height } },
        React__default["default"].createElement("div", { className: "ch-editor-terminal-tab" },
            React__default["default"].createElement("span", null, "Terminal")),
        React__default["default"].createElement("div", { className: "ch-editor-terminal-content" },
            React__default["default"].createElement(InnerTerminalTransitions, { steps: [
                    { text: prev || "" },
                    { text: next || "" },
                ], progress: t }),
            ")")));
}
function getHeight({ prev, next, t, backward, }) {
    if (!prev && !next)
        return 0;
    if (!prev && next)
        return MAX_HEIGHT * Math.min(t * 4, 1);
    if (prev && !next)
        return MAX_HEIGHT * Math.max(1 - t * 4, 0);
    return MAX_HEIGHT;
}
const MAX_HEIGHT = 150;

function northConfig(codeConfig) {
    if (Array.isArray(codeConfig.rows)) {
        return Object.assign(Object.assign({}, codeConfig), { rows: codeConfig.rows[0] });
    }
    return codeConfig;
}
function southConfig(codeConfig) {
    if (Array.isArray(codeConfig.rows)) {
        return Object.assign(Object.assign({}, codeConfig), { rows: codeConfig.rows[1] });
    }
    return codeConfig;
}
function useTransition(ref, prev, next, t, backward, codeConfig) {
    // prevSnapshot has the dimensions of the editor for t=0
    // nextSnapshot has the dimensions of the editor for t=1
    const { prevSnapshot, nextSnapshot } = useSnapshots(ref, prev, next);
    // we return the default styles for t=0 until we measure the dimensions
    if (!prevSnapshot) {
        return startingPosition(prev, next, codeConfig);
    }
    // and the same for t=1
    if (!nextSnapshot) {
        return endingPosition(prev, next, codeConfig);
    }
    // TODO this should be commented
    // if (t === 0) {
    //   return startingPosition(prev, next, codeConfig)
    // }
    if (t === 1) {
        return endingPosition(prev, next, codeConfig);
    }
    const inputSouthPanel = prev.southPanel || next.southPanel;
    const { prevNorthFile, prevSouthFile, nextNorthFile, nextSouthFile, } = getStepFiles(prev, next, t == 0 || backward);
    const { northStyle, southStyle } = getPanelStyles(prevSnapshot, nextSnapshot, t);
    const { northTabs, southTabs } = getTabs(prevSnapshot, nextSnapshot, prevNorthFile.name, prevSouthFile === null || prevSouthFile === void 0 ? void 0 : prevSouthFile.name, t);
    return {
        northContent: getContentFromFile(nextNorthFile),
        northPanel: {
            tabs: northTabs,
            style: northStyle,
            children: (React__default["default"].createElement(CodeTransition, { codeConfig: northConfig(codeConfig), prevFile: prevNorthFile, nextFile: nextNorthFile, t: t, parentHeight: (northStyle.height ||
                    northStyle.minHeight) })),
        },
        southContent: getContentFromFile(nextSouthFile),
        southPanel: inputSouthPanel && {
            tabs: southTabs,
            style: southStyle,
            children: (React__default["default"].createElement(CodeTransition, { codeConfig: southConfig(codeConfig), prevFile: prevSouthFile, nextFile: nextSouthFile, t: t, parentHeight: ((southStyle === null || southStyle === void 0 ? void 0 : southStyle.height) ||
                    (southStyle === null || southStyle === void 0 ? void 0 : southStyle.minHeight)) })),
        },
    };
}
// Returns the t=0 state of the transition
function startingPosition(prev, next, codeConfig) {
    const inputNorthPanel = prev.northPanel;
    const inputSouthPanel = prev.southPanel;
    const { prevNorthFile, prevSouthFile, nextNorthFile, nextSouthFile, } = getStepFiles(prev, next, true);
    return {
        northContent: getContentFromFile(prevNorthFile),
        northPanel: {
            tabs: inputNorthPanel.tabs.map(title => ({
                title,
                active: title === inputNorthPanel.active,
                style: {},
            })),
            style: {
                flexGrow: 1,
                overflow: "hidden",
            },
            children: (React__default["default"].createElement(CodeTransition, { codeConfig: northConfig(codeConfig), prevFile: prevNorthFile, nextFile: prevNorthFile, t: 0, parentHeight: "0" })),
        },
        southContent: getContentFromFile(prevSouthFile),
        southPanel: inputSouthPanel && {
            tabs: inputSouthPanel.tabs.map(title => ({
                title,
                active: title === inputSouthPanel.active,
                style: {},
            })),
            style: {
                flexGrow: 1,
                overflow: "hidden",
            },
            children: (React__default["default"].createElement(CodeTransition, { codeConfig: southConfig(codeConfig), prevFile: prevSouthFile, nextFile: prevSouthFile, t: 0, parentHeight: "0" })),
        },
    };
}
// Returns the t=1 state of the transition
function endingPosition(prev, next, codeConfig) {
    var _a;
    const inputNorthPanel = next.northPanel;
    const inputSouthPanel = next.southPanel;
    let { prevNorthFile, prevSouthFile, nextNorthFile, nextSouthFile, } = getStepFiles(prev, next, false);
    // getStepFiles return the intermediate files, we need to patch the ending state (2to1south)
    const isTwoToOneSouth = !inputSouthPanel &&
        inputNorthPanel.active === ((_a = prev === null || prev === void 0 ? void 0 : prev.southPanel) === null || _a === void 0 ? void 0 : _a.active);
    if (isTwoToOneSouth) {
        nextNorthFile = nextSouthFile;
    }
    return {
        northContent: getContentFromFile(nextNorthFile),
        northPanel: {
            tabs: inputNorthPanel.tabs.map(title => ({
                title,
                active: title === inputNorthPanel.active,
                style: {},
            })),
            style: {
                flexGrow: 1,
                overflow: "hidden",
            },
            children: (React__default["default"].createElement(CodeTransition, { codeConfig: northConfig(codeConfig), prevFile: nextNorthFile, nextFile: nextNorthFile, t: 1, parentHeight: "1" })),
        },
        southContent: getContentFromFile(nextSouthFile),
        southPanel: inputSouthPanel && {
            tabs: inputSouthPanel.tabs.map(title => ({
                title,
                active: title === inputSouthPanel.active,
                style: {},
            })),
            style: {
                flexGrow: 1,
                overflow: "hidden",
            },
            children: (React__default["default"].createElement(CodeTransition, { codeConfig: southConfig(codeConfig), prevFile: nextSouthFile, nextFile: nextSouthFile, t: 1, parentHeight: "1" })),
        },
    };
}
function CodeTransition({ prevFile, nextFile, t, codeConfig, parentHeight, }) {
    var _a;
    const htmlProps = Object.assign(Object.assign({}, codeConfig === null || codeConfig === void 0 ? void 0 : codeConfig.htmlProps), { style: Object.assign({ height: "100%" }, (_a = codeConfig === null || codeConfig === void 0 ? void 0 : codeConfig.htmlProps) === null || _a === void 0 ? void 0 : _a.style) });
    return (React__default["default"].createElement(CodeTween, Object.assign({ progress: t, tween: { prev: prevFile, next: nextFile }, config: Object.assign(Object.assign({}, codeConfig), { parentHeight }) }, htmlProps)));
}
function getContentFromFile(file) {
    return file ? codeToText(file.code) : "";
}
/**
 * Get the StepFiles for a transition
 * in each panel, if the prev and next active files are the same
 * we return the prev and next version of that panel
 * if the active files are different, we return the same file twice,
 * if backward is true we return the prev active file twice,
 * or else the next active file twice
 */
function getStepFiles(prev, next, backward) {
    var _a, _b;
    // The active file in each panel before and after:
    // +----+----+
    // | pn | nn |
    // +----+----+
    // | ps | ns |
    // +----+----+
    //
    const pn = prev.northPanel.active;
    const nn = next.northPanel.active;
    const ps = (_a = prev.southPanel) === null || _a === void 0 ? void 0 : _a.active;
    const ns = (_b = next.southPanel) === null || _b === void 0 ? void 0 : _b.active;
    const pnFile = prev.files.find(f => f.name === pn);
    const nnFile = next.files.find(f => f.name === nn);
    const psFile = ps
        ? prev.files.find(f => f.name === ps)
        : null;
    const nsFile = ns
        ? next.files.find(f => f.name === ns)
        : null;
    const oneToTwoSouth = !ps && pn === ns;
    if (oneToTwoSouth) {
        return {
            prevNorthFile: nnFile,
            nextNorthFile: nnFile,
            prevSouthFile: pnFile,
            nextSouthFile: nsFile,
        };
    }
    const twoToOneSouth = !ns && nn === ps;
    if (twoToOneSouth) {
        return {
            prevNorthFile: pnFile,
            nextNorthFile: pnFile,
            prevSouthFile: psFile,
            nextSouthFile: nnFile,
        };
    }
    const prevNorthFile = pn === nn ? pnFile : backward ? pnFile : nnFile;
    const nextNorthFile = pn === nn ? nnFile : backward ? pnFile : nnFile;
    const prevSouthFile = ps === ns
        ? psFile
        : backward
            ? psFile || nsFile
            : nsFile || psFile;
    const nextSouthFile = ps === ns
        ? nsFile
        : backward
            ? psFile || nsFile
            : nsFile || psFile;
    return {
        prevNorthFile,
        nextNorthFile,
        prevSouthFile,
        nextSouthFile,
    };
}
function getPanelStyles(prev, next, t) {
    // +---+---+
    // | x | x |
    // +---+---+
    // |   |   |
    // +---+---+
    if (prev.southHeight === null &&
        next.southHeight === null) {
        return {
            northStyle: {
                minHeight: prev.northHeight,
            },
        };
    }
    // +---+---+
    // | x | x |
    // +---+---+
    // | y |   |
    // +---+---+
    if (prev.southHeight !== null &&
        next.southHeight === null &&
        next.northKey !== prev.southKey) {
        return {
            northStyle: {
                minHeight: tween(prev.northHeight, next.northHeight, t),
            },
            southStyle: {
                minHeight: prev.southHeight,
            },
        };
    }
    // +---+---+
    // | x | y |
    // +---+---+
    // | y |   |
    // +---+---+
    if (prev.southHeight !== null &&
        next.southHeight === null &&
        prev.southKey === next.northKey) {
        return {
            northStyle: {
                minHeight: prev.northHeight,
            },
            southStyle: {
                position: "relative",
                minHeight: tween(prev.southHeight, next.northHeight, t),
                transform: `translateY(${tween(0, -(prev.northHeight + prev.titleBarHeight), t)}px)`,
            },
        };
    }
    // +---+---+
    // | x | x |
    // +---+---+
    // |   | y |
    // +---+---+
    if (prev.southHeight === null &&
        next.southHeight !== null &&
        prev.northKey !== next.southKey) {
        return {
            northStyle: {
                minHeight: tween(prev.northHeight, next.northHeight, t),
            },
            southStyle: {
                position: "relative",
                minHeight: next.southHeight,
            },
        };
    }
    // +---+---+
    // | y | x |
    // +---+---+
    // |   | y |
    // +---+---+
    if (prev.southHeight === null &&
        next.southHeight !== null &&
        prev.northKey === next.southKey) {
        return {
            northStyle: {
                minHeight: next.northHeight,
            },
            southStyle: {
                position: "relative",
                minHeight: tween(prev.northHeight, next.southHeight, t),
                transform: `translateY(${tween(-(next.northHeight + next.titleBarHeight), 0, t)}px)`,
            },
        };
    }
    // +---+---+
    // | x | x |
    // +---+---+
    // | y | y |
    // +---+---+
    return {
        northStyle: {
            minHeight: tween(prev.northHeight, next.northHeight, t),
        },
        southStyle: {
            minHeight: tween(prev.southHeight, next.southHeight, t),
        },
    };
}
function tween(a, b, t) {
    return a + (b - a) * t;
}
function getTabs(prevSnapshot, nextSnapshot, northActive, southActive, t) {
    // TODO simplify
    if (!prevSnapshot.southTabs &&
        isPresent(southActive, prevSnapshot.northTabs)) {
        /// one to two south
        return {
            northTabs: getPanelTabs(nextSnapshot.northTabs, nextSnapshot.southTabs, prevSnapshot.southTabs, prevSnapshot.northTabs, northActive, t),
            southTabs: getPanelTabs(nextSnapshot.southTabs, nextSnapshot.northTabs, prevSnapshot.northTabs, prevSnapshot.southTabs, southActive, t),
        };
    }
    if (!nextSnapshot.southTabs &&
        isPresent(southActive, nextSnapshot.northTabs)) {
        /// two to one south
        return {
            northTabs: getPanelTabs(nextSnapshot.southTabs, nextSnapshot.northTabs, prevSnapshot.northTabs, prevSnapshot.southTabs, northActive, t),
            southTabs: getPanelTabs(nextSnapshot.northTabs, nextSnapshot.southTabs, prevSnapshot.southTabs, prevSnapshot.northTabs, southActive, t),
        };
    }
    return {
        northTabs: getPanelTabs(nextSnapshot.northTabs, nextSnapshot.southTabs, prevSnapshot.northTabs, prevSnapshot.southTabs, northActive, t),
        southTabs: getPanelTabs(nextSnapshot.southTabs, nextSnapshot.northTabs, prevSnapshot.southTabs, prevSnapshot.northTabs, southActive, t),
    };
}
function getPanelTabs(nextSnapshot, otherNextSnapshot, prevSnapshot, otherPrevSnapshot, active, t) {
    // For each tab bar there are four types of tabs
    // - oldTabs: tabs that are present in both prev and next versions of the bar
    // - totallyNewTabs: tabs that are totally new (present in next
    // but not in any prev)
    // - migratingTabs: tabs that are come from the other bar (present
    // in next and in otherPrev)
    // - disappearingTabs: present in prev but not in next or otherNext
    const oldTabs = !nextSnapshot
        ? []
        : Object.keys(nextSnapshot)
            .filter(filename => isPresent(filename, prevSnapshot) ||
            !prevSnapshot)
            .map(filename => {
            const prev = prevSnapshot && prevSnapshot[filename];
            const next = nextSnapshot[filename];
            const dx = prev
                ? prev.left + (next.left - prev.left) * t
                : next.left;
            const width = prev
                ? prev.width + (next.width - prev.width) * t
                : next.width;
            return {
                active: filename === active,
                title: filename,
                style: {
                    position: "absolute",
                    transform: `translateX(${dx}px)`,
                    width,
                },
            };
        });
    const totallyNewTabs = !nextSnapshot
        ? []
        : Object.keys(nextSnapshot)
            .filter(filename => prevSnapshot &&
            !isPresent(filename, prevSnapshot)
        // && !isPresent(filename, otherPrevSnapshot)
        )
            .map(filename => {
            const next = nextSnapshot[filename];
            return {
                active: filename === active,
                title: filename,
                style: {
                    position: "absolute",
                    transform: `translateX(${next.left}px)`,
                    opacity: t,
                    width: next.width,
                },
            };
        });
    !nextSnapshot
        ? []
        : Object.keys(nextSnapshot)
            .filter(filename => isPresent(filename, otherPrevSnapshot))
            .map(filename => {
            const prev = otherPrevSnapshot[filename];
            const next = nextSnapshot[filename];
            const dx = next.left - prev.left;
            return {
                active: filename === active,
                title: filename,
                style: {
                    position: "absolute",
                    transform: `translateX(${dx}px)`,
                },
            };
        });
    const disappearingTabs = !prevSnapshot
        ? []
        : Object.keys(prevSnapshot)
            .filter(filename => !isPresent(filename, nextSnapshot)
        // && !isPresent(filename, otherNextSnapshot)
        )
            .map(filename => {
            const prev = prevSnapshot[filename];
            return {
                active: filename === active,
                title: filename,
                style: {
                    position: "absolute",
                    opacity: 1 - t,
                    transform: `translateX(${prev.left}px)`,
                    width: prev.width,
                },
            };
        });
    return [
        ...totallyNewTabs,
        // ...migratingTabs,
        ...oldTabs,
        ...disappearingTabs,
    ];
}
function isPresent(filename, snapshot) {
    return snapshot && filename && filename in snapshot;
}
// snapshots
const useLayoutEffect$2 = typeof window !== "undefined"
    ? React__default["default"].useLayoutEffect
    : React__default["default"].useEffect;
function useSnapshots(ref, prev, next) {
    const [{ prevSnapshot, nextSnapshot }, setState] = React__default["default"].useState({
        prevSnapshot: null,
        nextSnapshot: null,
    });
    useLayoutEffect$2(() => {
        if (prevSnapshot || nextSnapshot) {
            setState({
                prevSnapshot: null,
                nextSnapshot: null,
            });
        }
    }, [prev, next]);
    useLayoutEffect$2(() => {
        if (!prevSnapshot) {
            const parent = ref.current;
            setState(s => (Object.assign(Object.assign({}, s), { prevSnapshot: Object.assign(Object.assign({}, getPanelSnapshot(parent, prev)), getTabsSnapshot(parent, prev)) })));
        }
        else if (!nextSnapshot) {
            const parent = ref.current;
            setState(s => (Object.assign(Object.assign({}, s), { nextSnapshot: Object.assign(Object.assign({}, getPanelSnapshot(parent, next)), getTabsSnapshot(parent, next)) })));
        }
    });
    return { prevSnapshot, nextSnapshot };
}
function getPanelSnapshot(parent, step) {
    var _a;
    const northElement = parent.querySelector("[data-ch-panel='north']");
    const southElement = parent.querySelector("[data-ch-panel='south']");
    const bar = parent.querySelector(".ch-frame-title-bar");
    return {
        titleBarHeight: bar.getBoundingClientRect().height,
        northHeight: northElement.getBoundingClientRect().height,
        northKey: step.northPanel.active,
        southHeight: (southElement === null || southElement === void 0 ? void 0 : southElement.getBoundingClientRect().height) || null,
        southKey: (_a = step.southPanel) === null || _a === void 0 ? void 0 : _a.active,
    };
}
function getTabsSnapshot(parent, step) {
    var _a;
    const northTabs = Array.from(parent.querySelectorAll("[data-ch-tab='north']"));
    const southTabs = Array.from(parent.querySelectorAll("[data-ch-tab='south']"));
    return {
        northTabs: getTabsDimensions(northTabs, step.northPanel.active),
        southTabs: getTabsDimensions(southTabs, (_a = step.southPanel) === null || _a === void 0 ? void 0 : _a.active),
    };
}
function getTabsDimensions(tabElements, active) {
    if (!tabElements[0]) {
        return null;
    }
    const parent = tabElements[0].parentElement;
    const parentLeft = parent.getBoundingClientRect().left;
    const dimensions = {};
    tabElements.forEach(child => {
        const filename = child.getAttribute("title");
        const rect = child.getBoundingClientRect();
        dimensions[filename] = {
            left: rect.left - parentLeft,
            width: rect.width,
            active: filename === active,
        };
    });
    return dimensions;
}

function CodeBrowser({ files, theme, startingFileName, }) {
    const [activeFile, setActiveFile] = React__default["default"].useState(() => files.find(f => f.name === startingFileName));
    return (React__default["default"].createElement("div", { className: "ch-code-browser", style: {
            color: getColor(theme, ColorName.EditorForeground),
        } },
        React__default["default"].createElement(Sidebar, { files: files, theme: theme, activeFile: activeFile, setActiveFile: setActiveFile }),
        React__default["default"].createElement(Content, { file: activeFile, theme: theme })));
}
function Sidebar({ theme, files, activeFile, setActiveFile, }) {
    const tree = React__default["default"].useMemo(() => toFileTree(files), [files]);
    return (React__default["default"].createElement("div", { className: "ch-code-browser-sidebar", style: {
            borderColor: getColor(theme, ColorName.SideBarBorder),
            background: getColor(theme, ColorName.SideBarBackground),
            color: getColor(theme, ColorName.SideBarForeground),
            ["--ch-list-selection-background"]: getColor(theme, ColorName.ListActiveSelectionBackground),
            ["--ch-list-selection-foreground"]: getColor(theme, ColorName.ListActiveSelectionForeground),
            ["--ch-hover-background"]: getColor(theme, ColorName.ListHoverBackground),
            ["--ch-hover-foreground"]: getColor(theme, ColorName.ListHoverForeground),
        } },
        React__default["default"].createElement(SidebarNodes, { tree: tree, activeFile: activeFile, setActiveFile: setActiveFile })));
}
function SidebarNodes({ tree, activeFile, setActiveFile, level = 0, }) {
    return (React__default["default"].createElement(React__default["default"].Fragment, null, tree.map(node => (React__default["default"].createElement(SidebarNode, { key: node.name, node: node, activeFile: activeFile, setActiveFile: setActiveFile, level: level })))));
}
function SidebarNode({ node, activeFile, setActiveFile, level, }) {
    const isFolder = node.children && node.children.length > 0;
    const isSelected = node.codeFile === activeFile;
    if (isFolder) {
        return (React__default["default"].createElement("div", null,
            React__default["default"].createElement("div", { className: "ch-code-browser-sidebar-folder" },
                React__default["default"].createElement("div", { style: { paddingLeft: level * 1.5 + "ch" } }, node.name)),
            React__default["default"].createElement(SidebarNodes, { tree: node.children, activeFile: activeFile, setActiveFile: setActiveFile, level: level + 1 })));
    }
    else {
        return (React__default["default"].createElement("div", null,
            React__default["default"].createElement("div", { className: "ch-code-browser-sidebar-file", onClick: () => setActiveFile(node.codeFile), style: isSelected
                    ? {
                        color: "var(--ch-list-selection-foreground)",
                        background: "var(--ch-list-selection-background)",
                    }
                    : {} },
                React__default["default"].createElement("div", { style: { paddingLeft: level * 1.5 + "ch" } }, node.name))));
    }
}
function Content({ file, theme, }) {
    return (React__default["default"].createElement("div", { className: "ch-code-browser-content", style: {
            background: getColor(theme, ColorName.CodeBackground),
            color: getColor(theme, ColorName.CodeForeground),
            ["--ch-selection-background"]: getColor(theme, ColorName.SelectionBackground),
            colorScheme: getColorScheme(theme),
        } },
        React__default["default"].createElement(CopyButton, { className: "ch-code-browser-button", content: codeToText(file.code) }),
        file.code.lines.map((line, i) => (React__default["default"].createElement("div", { key: i }, line.tokens.length === 0 ? (React__default["default"].createElement("br", null)) : (line.tokens.map((token, i) => (React__default["default"].createElement("span", Object.assign({ key: i }, token.props), token.content)))))))));
}
function toFileTree(files) {
    let tree = [];
    for (const file of files) {
        const parts = file.name.split("/");
        let current = tree;
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            const isLastPart = i === parts.length - 1;
            const index = current.findIndex(f => f.name === part);
            if (index === -1) {
                const sub = {
                    name: part,
                    children: [],
                    codeFile: undefined,
                };
                if (isLastPart) {
                    sub.codeFile = file;
                }
                current.push(sub);
                current = sub.children;
            }
            else {
                current = current[index].children;
            }
        }
    }
    tree = sortTree(tree);
    return tree;
}
function sortTree(tree) {
    for (const child of tree) {
        child.children = sortTree(child.children);
    }
    return tree.sort((a, b) => {
        const aIsFolder = a.children && a.children.length > 0;
        const bIsFolder = b.children && b.children.length > 0;
        if ((aIsFolder && bIsFolder) ||
            (!aIsFolder && !bIsFolder)) {
            return a.name.localeCompare(b.name);
        }
        if (aIsFolder) {
            return -1;
        }
        return 1;
    });
}

function ExpandButton({ style, step, theme, className, }) {
    const [expanded, setExpanded] = React__default["default"].useState(false);
    const [dialogSupported, setDialogSupported] = React__default["default"].useState(true);
    const ref = React__default["default"].useRef(null);
    const files = step.files;
    // check if <dialog /> is supported
    React__default["default"].useEffect(() => {
        if (ref.current && !ref.current.showModal) {
            setDialogSupported(false);
        }
    }, []);
    if (!dialogSupported) {
        return null;
    }
    return (React__default["default"].createElement(React__default["default"].Fragment, null,
        React__default["default"].createElement(ExpandIcon, { className: className, style: style, onClick: () => {
                ref.current.showModal();
                document.body.classList.add("ch-no-scroll");
                setExpanded(true);
            } }),
        React__default["default"].createElement("dialog", { ref: ref, className: "ch-expand-dialog", onClose: () => {
                setExpanded(false);
            }, onClick: e => {
                if (e.currentTarget === e.target) {
                    ref.current.close();
                    document.body.classList.remove("ch-no-scroll");
                }
            } },
            React__default["default"].createElement(CloseButton, { onClick: () => {
                    ref.current.close();
                    document.body.classList.remove("ch-no-scroll");
                } }),
            expanded ? (React__default["default"].createElement("div", { className: "ch-expand-dialog-content", style: {
                    borderColor: getColor(theme, ColorName.SideBarBorder),
                } },
                React__default["default"].createElement(CodeBrowser, { files: files, theme: theme, startingFileName: step.northPanel.active }))) : undefined)));
}
function ExpandIcon({ onClick, style, className, }) {
    return (React__default["default"].createElement("svg", { style: style, onClick: onClick, className: className, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", role: "button" },
        React__default["default"].createElement("title", null, "Expand"),
        React__default["default"].createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" })));
}
function CloseButton({ onClick }) {
    return (React__default["default"].createElement("svg", { onClick: onClick, className: "ch-expand-close", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", role: "button" },
        React__default["default"].createElement("title", null, "Close"),
        React__default["default"].createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" })));
}

const DEFAULT_STEP = {
    files: [
        {
            code: { lines: [], lang: "js" },
            focus: "",
            name: "",
        },
    ],
    northPanel: { active: "", tabs: [""], heightRatio: 1 },
};
function EditorTween(_a) {
    var { prev = DEFAULT_STEP, next, t, backward, codeConfig, frameProps = {} } = _a, divProps = __rest(_a, ["prev", "next", "t", "backward", "codeConfig", "frameProps"]);
    const ref = React__default["default"].createRef();
    const { showCopyButton, showExpandButton } = codeConfig, config = __rest(codeConfig, ["showCopyButton", "showExpandButton"]);
    const { northPanel, southPanel, northContent, southContent, } = useTransition(ref, prev, next || prev, t, backward, config);
    const [frozenHeight, freezeHeight] = React__default["default"].useState(undefined);
    useLayoutEffect$4(() => {
        var _a;
        const height = (_a = ref.current) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect().height;
        freezeHeight(height);
    }, []);
    const framePropsWithHeight = Object.assign(Object.assign(Object.assign({}, frameProps), divProps), { style: Object.assign(Object.assign({}, frameProps === null || frameProps === void 0 ? void 0 : frameProps.style), divProps === null || divProps === void 0 ? void 0 : divProps.style) });
    if (frozenHeight) {
        framePropsWithHeight.style.height = frozenHeight;
        framePropsWithHeight.style.maxHeight = frozenHeight;
    }
    const northButtons = (React__default["default"].createElement(React__default["default"].Fragment, null,
        showCopyButton ? (React__default["default"].createElement(CopyButton, { className: "ch-editor-button", content: northContent })) : undefined,
        showExpandButton ? (React__default["default"].createElement(ExpandButton, { className: "ch-editor-button", step: next || prev, theme: codeConfig.theme })) : undefined));
    const southCopyButton = showCopyButton ? (React__default["default"].createElement(CopyButton, { className: "ch-editor-button", content: southContent })) : undefined;
    const terminalPanel = (React__default["default"].createElement(TerminalPanel, { prev: prev.terminal, next: (next || prev).terminal, t: t, backward: backward }));
    return (React__default["default"].createElement(EditorFrame, Object.assign({ ref: ref }, framePropsWithHeight, { northPanel: northPanel, southPanel: southPanel, terminalPanel: terminalPanel, theme: codeConfig.theme, northButton: northButtons, southButton: southCopyButton })));
}

const defaultSpring = {
    stiffness: 120,
    damping: 24,
    mass: 0.2,
    decimals: 3,
};
function EditorSpring(_a) {
    var { northPanel, southPanel, files, terminal, springConfig } = _a, props = __rest(_a, ["northPanel", "southPanel", "files", "terminal", "springConfig"]);
    const step = React__default["default"].useMemo(() => {
        return {
            northPanel,
            southPanel,
            files,
            terminal,
        };
    }, [northPanel, southPanel, files, terminal]);
    const { prev, next, t } = useStepSpring(step, springConfig);
    return (React__default["default"].createElement(EditorTween, Object.assign({ t: t, backward: false, prev: prev, next: next }, props)));
}
function useStepSpring(step, springConfig = defaultSpring) {
    const [{ target, steps, index }, setState] = React__default["default"].useState({
        target: 2,
        steps: [step, step, step],
        index: 0,
    });
    React__default["default"].useEffect(() => {
        const lastStep = steps[steps.length - 1];
        if (lastStep != step) {
            setState(s => updateStepSpring(s, step, progress));
        }
    }, [step]);
    const [progress] = useSpring(target, springConfig);
    const trioProgress = progress - index;
    const result = trioProgress <= 1
        ? {
            prev: steps[0],
            next: steps[1],
            t: trioProgress,
        }
        : {
            prev: steps[1],
            next: steps[2],
            t: trioProgress - 1,
        };
    return result;
}
function updateStepSpring(state, newStep, progress) {
    const { steps, target, index } = state;
    const stepsClone = steps.slice();
    const trioProgress = progress - index;
    if (trioProgress < 1) {
        stepsClone[2] = newStep;
        return Object.assign(Object.assign({}, state), { steps: stepsClone });
    }
    else {
        stepsClone[0] = steps[1];
        stepsClone[1] = steps[2];
        stepsClone[2] = newStep;
        return Object.assign(Object.assign({}, state), { steps: stepsClone, target: target + 1, index: index + 1 });
    }
}

function Code(props) {
    const [step, setStep] = React__default["default"].useState(props);
    function onTabClick(filename) {
        const newStep = updateEditorStep(step, filename, null);
        setStep(Object.assign(Object.assign({}, step), newStep));
    }
    return React__default["default"].createElement(InnerCode, Object.assign({}, step, { onTabClick: onTabClick }));
}
// build the CodeConfig from props and props.codeConfig
function mergeCodeConfig(props) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const { lineNumbers, showCopyButton, showExpandButton, minZoom, maxZoom } = props, rest = __rest(props, ["lineNumbers", "showCopyButton", "showExpandButton", "minZoom", "maxZoom"]);
    const codeConfig = Object.assign(Object.assign({}, props.codeConfig), { maxZoom: maxZoom == null ? (_a = props.codeConfig) === null || _a === void 0 ? void 0 : _a.maxZoom : maxZoom, minZoom: minZoom == null ? (_b = props.codeConfig) === null || _b === void 0 ? void 0 : _b.minZoom : minZoom, horizontalCenter: (_d = (_c = props.codeConfig) === null || _c === void 0 ? void 0 : _c.horizontalCenter) !== null && _d !== void 0 ? _d : props.horizontalCenter, lineNumbers: lineNumbers == null
            ? (_e = props.codeConfig) === null || _e === void 0 ? void 0 : _e.lineNumbers
            : lineNumbers, showCopyButton: showCopyButton == null
            ? (_f = props.codeConfig) === null || _f === void 0 ? void 0 : _f.showCopyButton
            : showCopyButton, showExpandButton: showExpandButton == null
            ? (_g = props.codeConfig) === null || _g === void 0 ? void 0 : _g.showExpandButton
            : showExpandButton, rows: props.rows, debug: (_h = props.debug) !== null && _h !== void 0 ? _h : (_j = props.codeConfig) === null || _j === void 0 ? void 0 : _j.debug });
    return Object.assign(Object.assign({}, rest), { codeConfig });
}
function InnerCode(_a) {
    var { onTabClick } = _a, props = __rest(_a, ["onTabClick"]);
    const _b = mergeCodeConfig(props), { className, style, codeConfig } = _b, editorProps = __rest(_b, ["className", "style", "codeConfig"]);
    if (!props.southPanel &&
        props.files.length === 1 &&
        !props.files[0].name) {
        return (React__default["default"].createElement("div", { className: `ch-codeblock not-prose ${className || ""}`, style: style },
            React__default["default"].createElement(CodeSpring, { className: "ch-code", config: codeConfig, step: editorProps.files[0] })));
    }
    else {
        const frameProps = Object.assign(Object.assign({}, editorProps === null || editorProps === void 0 ? void 0 : editorProps.frameProps), { onTabClick });
        return (React__default["default"].createElement("div", { className: `ch-codegroup not-prose ${className || ""}`, style: style },
            React__default["default"].createElement(EditorSpring, Object.assign({}, editorProps, { frameProps: frameProps, codeConfig: codeConfig }))));
    }
}
function updateEditorStep(step, filename, focus) {
    const name = filename || step.northPanel.active;
    const newFiles = step.files.map((file) => file.name === name
        ? Object.assign(Object.assign({}, file), { focus: focus === null ? file.focus : focus }) : file);
    let northPanel = Object.assign({}, step.northPanel);
    let southPanel = step.southPanel && Object.assign({}, step.southPanel);
    if (step.northPanel.tabs.includes(name)) {
        northPanel.active = name;
    }
    else if (southPanel) {
        southPanel.active = name;
    }
    return { files: newFiles, northPanel, southPanel };
}

const SectionContext = React__default["default"].createContext({
    props: null,
    setFocus: () => { },
});
function Section(_a) {
    var { children, className, style } = _a, props = __rest(_a, ["children", "className", "style"]);
    const [state, setState] = React__default["default"].useState(props);
    const resetFocus = () => setState(props);
    const setFocus = ({ fileName, focus, id, }) => {
        const newStep = updateEditorStep(state, fileName, focus);
        setState(Object.assign(Object.assign(Object.assign({}, state), newStep), { selectedId: id }));
    };
    const rest = __rest(state, ["selectedId"]);
    return (React__default["default"].createElement("section", { className: `ch-section ${className || ""}`, style: style },
        React__default["default"].createElement(SectionContext.Provider, { value: {
                props: rest,
                setFocus,
            } },
            React__default["default"].createElement(LinkableSection, { onActivation: setFocus, onReset: resetFocus }, children))));
}
function SectionCode(innerProps) {
    const { props, setFocus } = React__default["default"].useContext(SectionContext);
    const onTabClick = (filename) => {
        setFocus({ fileName: filename, focus: null, id: "" });
    };
    return (React__default["default"].createElement(InnerCode, Object.assign({}, innerProps, props, { onTabClick: onTabClick })));
}
// ---
function SectionLink({ focus, file, children, id, }) {
    const { activate, reset, activatedId } = React__default["default"].useContext(LinkableContext);
    const isSelected = activatedId === id;
    // const handleClick = isSelected
    //   ? resetFocus
    //   : () => setFocus({ fileName: file, focus, id })
    return (React__default["default"].createElement("span", { className: "ch-section-link", "data-active": isSelected, 
        // onClick={handleClick}
        children: children, onMouseOver: () => activate({ fileName: file, focus, id }), onMouseOut: reset }));
}
const LinkableContext = React__default["default"].createContext({
    activatedId: undefined,
    activate: () => { },
    reset: () => { },
});
function LinkableSection({ onActivation, onReset, children, }) {
    const [activatedId, setActivatedId] = React__default["default"].useState(undefined);
    const activate = React__default["default"].useCallback(x => {
        setActivatedId(x.id);
        onActivation(x);
    }, [onActivation]);
    const reset = React__default["default"].useCallback(() => {
        setActivatedId(undefined);
        onReset();
    }, [onReset]);
    return (React__default["default"].createElement(LinkableContext.Provider, { value: {
            activate,
            reset,
            activatedId,
        } }, children));
}

function Back() {
    const c = useClasser("ch-browser");
    return (React__default["default"].createElement("svg", { fill: "currentColor", preserveAspectRatio: "xMidYMid meet", height: "1em", viewBox: "13 10 14 23", className: c("button", "back-button") },
        React__default["default"].createElement("g", null,
            React__default["default"].createElement("path", { d: "m26.5 12.1q0 0.3-0.2 0.6l-8.8 8.7 8.8 8.8q0.2 0.2 0.2 0.5t-0.2 0.5l-1.1 1.1q-0.3 0.3-0.6 0.3t-0.5-0.3l-10.4-10.4q-0.2-0.2-0.2-0.5t0.2-0.5l10.4-10.4q0.3-0.2 0.5-0.2t0.6 0.2l1.1 1.1q0.2 0.2 0.2 0.5z" }))));
}
function Forward() {
    const c = useClasser("ch-browser");
    return (React__default["default"].createElement("svg", { fill: "currentColor", preserveAspectRatio: "xMidYMid meet", height: "1em", viewBox: "13 10 14 23", className: c("button", "forward-button") },
        React__default["default"].createElement("g", null,
            React__default["default"].createElement("path", { d: "m26.3 21.4q0 0.3-0.2 0.5l-10.4 10.4q-0.3 0.3-0.6 0.3t-0.5-0.3l-1.1-1.1q-0.2-0.2-0.2-0.5t0.2-0.5l8.8-8.8-8.8-8.7q-0.2-0.3-0.2-0.6t0.2-0.5l1.1-1.1q0.3-0.2 0.5-0.2t0.6 0.2l10.4 10.4q0.2 0.2 0.2 0.5z" }))));
}
function Open({ href, style, }) {
    const c = useClasser("ch-browser");
    return (React__default["default"].createElement("a", { className: c("button", "open-button"), title: "Open in new tab", href: href, style: style, target: "_blank", rel: "noopener noreferrer" },
        React__default["default"].createElement("svg", { stroke: "currentColor", fill: "currentColor", strokeWidth: "0", viewBox: "3 3 18 18", height: "1em", width: "1em", className: c("open-icon"), xmlns: "http://www.w3.org/2000/svg" },
            React__default["default"].createElement("path", { d: "M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" }))));
}

function TitleBar({ url, linkUrl, theme, }) {
    const inputBorder = getColor(theme, ColorName.InputBorder);
    return (React__default["default"].createElement(React__default["default"].Fragment, null,
        React__default["default"].createElement(FrameButtons, null),
        React__default["default"].createElement(Back, null),
        React__default["default"].createElement(Forward, null),
        React__default["default"].createElement("input", { value: url || "", readOnly: true, style: {
                background: getColor(theme, ColorName.InputBackground),
                color: getColor(theme, ColorName.InputForeground),
                border: inputBorder
                    ? `1px solid ${inputBorder}`
                    : undefined,
            } }),
        React__default["default"].createElement(Open, { href: linkUrl, style: {
                color: getColor(theme, ColorName.EditorForeground),
            } })));
}

function useSteps$1(steps) {
    return React__default["default"].useMemo(() => {
        if (!steps) {
            return [{ zoom: 1 }];
        }
        return steps.map(step => {
            const { displayUrl, loadUrl } = transformUrl(step.url, step.loadUrl, step.prependOrigin);
            return {
                zoom: step.zoom || 1,
                displayUrl,
                loadUrl,
                children: step.children,
            };
        });
    }, [steps]);
}
function transformUrl(url, loadUrl, prependOrigin) {
    const currentOrigin = typeof window !== "undefined" ? window.origin : "";
    const displayUrl = url && prependOrigin === true
        ? currentOrigin + url
        : url;
    return { displayUrl, loadUrl: loadUrl || displayUrl };
}

const MiniBrowserHike = React__default["default"].forwardRef(MiniBrowserWithRef);
function MiniBrowserWithRef(_a, ref) {
    var { progress = 0, backward = false, steps: ogSteps, transition = "none", classes, theme } = _a, props = __rest(_a, ["progress", "backward", "steps", "transition", "classes", "theme"]);
    const c = useClasser("ch-mini-browser", classes);
    const steps = useSteps$1(ogSteps);
    const stepIndex = Math.round(progress);
    const { zoom, displayUrl, loadUrl, children } = steps[stepIndex];
    return (React__default["default"].createElement(MiniFrame, Object.assign({}, props, { zoom: zoom, className: `${c("")} ${props.className || ""}`, style: Object.assign(Object.assign({}, transitionStyle({ progress, transition })), props.style), classes: classes, titleBar: React__default["default"].createElement(TitleBar, { url: displayUrl, linkUrl: loadUrl, theme: theme }), theme: theme }), children || React__default["default"].createElement("iframe", { ref: ref, src: loadUrl })));
}
function transitionStyle({ progress, transition, }) {
    if (transition === "slide") {
        const X = 50;
        const t = progress - Math.floor(progress);
        const x = t <= 0.5 ? -X * t : X - X * t;
        const o = Math.abs(t - 0.5) * 2;
        return {
            transform: `translateX(${x}px)`,
            opacity: o * o,
        };
    }
    return {};
}

function MiniBrowser(_a) {
    var { url, loadUrl, prependOrigin, children, zoom } = _a, rest = __rest(_a, ["url", "loadUrl", "prependOrigin", "children", "zoom"]);
    const [steps, progress] = useSteps({
        url,
        loadUrl,
        prependOrigin,
        children,
        zoom,
    });
    return (React__default["default"].createElement(MiniBrowserHike, Object.assign({}, rest, { steps: steps, progress: progress })));
}
function useSteps({ url, loadUrl, prependOrigin, children, zoom, }) {
    const [state, setState] = React__default["default"].useState({
        target: 0,
        steps: [
            { url, loadUrl, prependOrigin, children, zoom },
        ],
    });
    React__default["default"].useEffect(() => {
        const last = state.steps[state.steps.length - 1];
        if (last.url !== url ||
            last.loadUrl !== loadUrl ||
            last.prependOrigin !== prependOrigin ||
            last.children !== children) {
            setState(s => ({
                target: s.target + 1,
                steps: [
                    ...s.steps,
                    { url, loadUrl, prependOrigin, children, zoom },
                ],
            }));
        }
    }, [url, loadUrl, prependOrigin, children, zoom]);
    const [progress] = useSpring(state.target, {
        stiffness: 100,
        decimals: 3,
    });
    return [state.steps, progress];
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var templates = {};

Object.defineProperty(templates, "__esModule", { value: true });
function getMainFile(template) {
    if (template === "vue-cli") {
        return "src/main.js";
    }
    if (template === "angular-cli") {
        return "src/main.ts";
    }
    if (template === "create-react-app-typescript") {
        return "src/index.tsx";
    }
    if (template === "parcel") {
        return "index.html";
    }
    if (template === "gatsby") {
        return "src/pages/index.js";
    }
    if (template === "nuxt") {
        // Wildcard, because nuxt is not specific on this
        return "package.json";
    }
    if (template === "next") {
        // Wildcard, because next is not specific on this
        return "package.json";
    }
    if (template === "apollo") {
        // Wildcard, because apollo is not specific on this
        return "package.json";
    }
    if (template === "reason") {
        // Wildcard, because reason is not specific on this
        return "package.json";
    }
    if (template === "sapper") {
        // Wildcard, because sapper is not specific on this
        return "package.json";
    }
    if (template === "nest") {
        return "src/main.ts";
    }
    if (template === "static") {
        return "index.html";
    }
    return "src/index.js";
}
templates.getMainFile = getMainFile;
var SANDBOX_CONFIG = "sandbox.config.json";
function getTemplate(packageJSONPackage, modules) {
    var sandboxConfig = modules[SANDBOX_CONFIG] || modules["/" + SANDBOX_CONFIG];
    if (sandboxConfig) {
        try {
            var config = JSON.parse(sandboxConfig.content);
            if (config.template) {
                return config.template;
            }
        }
        catch (e) { }
    }
    var _a = packageJSONPackage.dependencies, dependencies = _a === void 0 ? {} : _a, _b = packageJSONPackage.devDependencies, devDependencies = _b === void 0 ? {} : _b;
    var totalDependencies = Object.keys(dependencies).concat(Object.keys(devDependencies));
    var nuxt = ["nuxt", "nuxt-edge"];
    if (totalDependencies.some(function (dep) { return nuxt.indexOf(dep) > -1; })) {
        return "nuxt";
    }
    if (totalDependencies.indexOf("next") > -1) {
        return "next";
    }
    var apollo = [
        "apollo-server",
        "apollo-server-express",
        "apollo-server-hapi",
        "apollo-server-koa",
        "apollo-server-lambda",
        "apollo-server-micro"
    ];
    if (totalDependencies.some(function (dep) { return apollo.indexOf(dep) > -1; })) {
        return "apollo";
    }
    if (totalDependencies.indexOf("ember-cli") > -1) {
        return "ember";
    }
    if (totalDependencies.indexOf("sapper") > -1) {
        return "sapper";
    }
    var moduleNames = Object.keys(modules);
    if (moduleNames.some(function (m) { return m.endsWith(".vue"); })) {
        return "vue-cli";
    }
    if (moduleNames.some(function (m) { return m.endsWith(".re"); })) {
        return "reason";
    }
    if (totalDependencies.indexOf("gatsby") > -1) {
        return "gatsby";
    }
    if (totalDependencies.indexOf("parcel-bundler") > -1) {
        return "parcel";
    }
    if (totalDependencies.indexOf("react-scripts") > -1) {
        return "create-react-app";
    }
    if (totalDependencies.indexOf("react-scripts-ts") > -1) {
        return "create-react-app-typescript";
    }
    if (totalDependencies.indexOf("@angular/core") > -1) {
        return "angular-cli";
    }
    if (totalDependencies.indexOf("preact-cli") > -1) {
        return "preact-cli";
    }
    if (totalDependencies.indexOf("svelte") > -1) {
        return "svelte";
    }
    if (totalDependencies.indexOf("vue") > -1) {
        return "vue-cli";
    }
    var dojo = ["@dojo/core", "@dojo/framework"];
    if (totalDependencies.some(function (dep) { return dojo.indexOf(dep) > -1; })) {
        return "@dojo/cli-create-app";
    }
    if (totalDependencies.indexOf("cx") > -1) {
        return "cxjs";
    }
    if (totalDependencies.indexOf("@nestjs/core") > -1 ||
        totalDependencies.indexOf("@nestjs/common") > -1) {
        return "nest";
    }
    return undefined;
}
var getTemplate_1 = templates.getTemplate = getTemplate;

var lodash_isequal = {exports: {}};

/**
 * Lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright JS Foundation and other contributors <https://js.foundation/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

(function (module, exports) {
/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    asyncTag = '[object AsyncFunction]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    nullTag = '[object Null]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    proxyTag = '[object Proxy]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    undefinedTag = '[object Undefined]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Detect free variable `exports`. */
var freeExports = exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
    Symbol = root.Symbol,
    Uint8Array = root.Uint8Array,
    propertyIsEnumerable = objectProto.propertyIsEnumerable,
    splice = arrayProto.splice,
    symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols,
    nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
    nativeKeys = overArg(Object.keys, Object);

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView'),
    Map = getNative(root, 'Map'),
    Promise = getNative(root, 'Promise'),
    Set = getNative(root, 'Set'),
    WeakMap = getNative(root, 'WeakMap'),
    nativeCreate = getNative(Object, 'create');

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
  this.size = 0;
}

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = objIsArr ? arrayTag : getTag(object),
      othTag = othIsArr ? arrayTag : getTag(other);

  objTag = objTag == argsTag ? objectTag : objTag;
  othTag = othTag == argsTag ? objectTag : othTag;

  var objIsObj = objTag == objectTag,
      othIsObj = othTag == objectTag,
      isSameTag = objTag == othTag;

  if (isSameTag && isBuffer(object)) {
    if (!isBuffer(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack);
    return (objIsArr || isTypedArray(object))
      ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
      : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack);
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack);
  return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!arraySome(other, function(othValue, othIndex) {
            if (!cacheHas(seen, othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, bitmask, customizer, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag:
      var convert = mapToArray;

    case setTag:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      objProps = getAllKeys(object),
      objLength = objProps.length,
      othProps = getAllKeys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = baseGetTag(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

/**
 * Performs a deep comparison between two values to determine if they are
 * equivalent.
 *
 * **Note:** This method supports comparing arrays, array buffers, booleans,
 * date objects, error objects, maps, numbers, `Object` objects, regexes,
 * sets, strings, symbols, and typed arrays. `Object` objects are compared
 * by their own, not inherited, enumerable properties. Functions and DOM
 * nodes are compared by strict equality, i.e. `===`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.isEqual(object, other);
 * // => true
 *
 * object === other;
 * // => false
 */
function isEqual(value, other) {
  return baseIsEqual(value, other);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = isEqual;
}(lodash_isequal, lodash_isequal.exports));

var isEqual = lodash_isequal.exports;

// src/client.ts

// src/file-resolver-protocol.ts
var generateId = () => Math.floor(Math.random() * 1e6 + Math.random() * 1e6);
var getConstructorName = (x) => {
  try {
    return x.constructor.name;
  } catch (e) {
    return "";
  }
};
var Protocol = class {
  constructor(type, handleMessage, target) {
    this.type = type;
    this.handleMessage = handleMessage;
    this.target = target;
    this.outgoingMessages = new Set();
    this._messageListener = async (e) => {
      var _a;
      const { data } = e;
      if (data.$type !== this.getTypeId()) {
        return;
      }
      if (this.outgoingMessages.has(data.$id)) {
        return;
      }
      let returnMessage = {
        $originId: this.internalId,
        $type: this.getTypeId(),
        $id: data.$id
      };
      try {
        const result = await this.handleMessage(data.$data);
        returnMessage.$data = result;
      } catch (err) {
        if (!err.message) {
          console.error(err);
        }
        returnMessage.$error = { message: (_a = err.message) != null ? _a : "Unknown error" };
      }
      if (e.source) {
        e.source.postMessage(returnMessage, "*");
      } else {
        this._postMessage(returnMessage);
      }
    };
    this.createConnection();
    this.internalId = generateId();
    this.isWorker = getConstructorName(target) === "Worker";
  }
  getTypeId() {
    return `p-${this.type}`;
  }
  createConnection() {
    self.addEventListener("message", this._messageListener);
  }
  dispose() {
    self.removeEventListener("message", this._messageListener);
  }
  sendMessage(data) {
    return new Promise((resolve) => {
      const messageId = generateId();
      const message = {
        $originId: this.internalId,
        $type: this.getTypeId(),
        $data: data,
        $id: messageId
      };
      this.outgoingMessages.add(messageId);
      const listenFunction = (e) => {
        const { data: data2 } = e;
        if (data2.$type === this.getTypeId() && data2.$id === messageId && data2.$originId !== this.internalId) {
          resolve(data2.$data);
          self.removeEventListener("message", listenFunction);
        }
      };
      self.addEventListener("message", listenFunction);
      this._postMessage(message);
    });
  }
  _postMessage(m) {
    if (this.isWorker || typeof DedicatedWorkerGlobalScope !== "undefined" && this.target instanceof DedicatedWorkerGlobalScope) {
      this.target.postMessage(m);
    } else {
      this.target.postMessage(m, "*");
    }
  }
};

// src/iframe-protocol.ts
var IFrameProtocol = class {
  constructor(iframe, origin) {
    this.globalListeners = {};
    this.globalListenersCount = 0;
    this.channelListeners = {};
    this.channelListenersCount = 0;
    this.channelId = Math.floor(Math.random() * 1e6);
    this.frameWindow = iframe.contentWindow;
    this.origin = origin;
    this.globalListeners = [];
    this.channelListeners = [];
    this.eventListener = this.eventListener.bind(this);
    if (typeof window !== "undefined") {
      window.addEventListener("message", this.eventListener);
    }
  }
  cleanup() {
    window.removeEventListener("message", this.eventListener);
    this.globalListeners = {};
    this.channelListeners = {};
    this.globalListenersCount = 0;
    this.channelListenersCount = 0;
  }
  register() {
    if (!this.frameWindow) {
      return;
    }
    this.frameWindow.postMessage({
      type: "register-frame",
      origin: document.location.origin,
      id: this.channelId
    }, this.origin);
  }
  dispatch(message) {
    if (!this.frameWindow) {
      return;
    }
    this.frameWindow.postMessage({
      $id: this.channelId,
      codesandbox: true,
      ...message
    }, this.origin);
  }
  globalListen(listener) {
    if (typeof listener !== "function") {
      return () => {
        return;
      };
    }
    const listenerId = this.globalListenersCount;
    this.globalListeners[listenerId] = listener;
    this.globalListenersCount++;
    return () => {
      delete this.globalListeners[listenerId];
    };
  }
  channelListen(listener) {
    if (typeof listener !== "function") {
      return () => {
        return;
      };
    }
    const listenerId = this.channelListenersCount;
    this.channelListeners[listenerId] = listener;
    this.channelListenersCount++;
    return () => {
      delete this.channelListeners[listenerId];
    };
  }
  eventListener(evt) {
    if (evt.source !== this.frameWindow) {
      return;
    }
    const message = evt.data;
    if (!message.codesandbox) {
      return;
    }
    Object.values(this.globalListeners).forEach((listener) => listener(message));
    if (message.$id !== this.channelId) {
      return;
    }
    Object.values(this.channelListeners).forEach((listener) => listener(message));
  }
};

// src/utils.ts
function createPackageJSON(dependencies = {}, devDependencies = {}, entry = "/index.js") {
  return JSON.stringify({
    name: "sandpack-project",
    main: entry,
    dependencies,
    devDependencies
  }, null, 2);
}
function addPackageJSONIfNeeded(files, dependencies, devDependencies, entry) {
  const newFiles = { ...files };
  if (!newFiles["/package.json"]) {
    if (!dependencies) {
      throw new Error("No dependencies specified, please specify either a package.json or dependencies.");
    }
    if (!entry) {
      throw new Error("Missing 'entry' parameter. Either specify an entry point, or pass in a package.json with the 'main' field set.");
    }
    newFiles["/package.json"] = {
      code: createPackageJSON(dependencies, devDependencies, entry)
    };
  }
  return newFiles;
}
function extractErrorDetails(msg) {
  if (msg.title === "SyntaxError") {
    const { title, path, message, line, column } = msg;
    return { title, path, message, line, column };
  }
  const relevantStackFrame = getRelevantStackFrame(msg.payload.frames);
  if (!relevantStackFrame) {
    return { message: msg.message };
  }
  const errorInCode = getErrorInOriginalCode(relevantStackFrame);
  const errorLocation = getErrorLocation(relevantStackFrame);
  const errorMessage = formatErrorMessage(relevantStackFrame._originalFileName, msg.message, errorLocation, errorInCode);
  return {
    message: errorMessage,
    title: msg.title,
    path: relevantStackFrame._originalFileName,
    line: relevantStackFrame._originalLineNumber,
    column: relevantStackFrame._originalColumnNumber
  };
}
function getRelevantStackFrame(frames) {
  if (!frames) {
    return;
  }
  return frames.find((frame) => !!frame._originalFileName);
}
function getErrorLocation(errorFrame) {
  return errorFrame ? ` (${errorFrame._originalLineNumber}:${errorFrame._originalColumnNumber})` : ``;
}
function getErrorInOriginalCode(errorFrame) {
  const lastScriptLine = errorFrame._originalScriptCode[errorFrame._originalScriptCode.length - 1];
  const numberOfLineNumberCharacters = lastScriptLine.lineNumber.toString().length;
  const leadingCharacterOffset = 2;
  const barSeparatorCharacterOffset = 3;
  const extraLineLeadingSpaces = leadingCharacterOffset + numberOfLineNumberCharacters + barSeparatorCharacterOffset + errorFrame._originalColumnNumber;
  return errorFrame._originalScriptCode.reduce((result, scriptLine) => {
    const leadingChar = scriptLine.highlight ? ">" : " ";
    const lineNumber = scriptLine.lineNumber.toString().length === numberOfLineNumberCharacters ? `${scriptLine.lineNumber}` : ` ${scriptLine.lineNumber}`;
    const extraLine = scriptLine.highlight ? "\n" + " ".repeat(extraLineLeadingSpaces) + "^" : "";
    return result + "\n" + leadingChar + " " + lineNumber + " | " + scriptLine.content + extraLine;
  }, "");
}
function formatErrorMessage(filePath, message, location, errorInCode) {
  return `${filePath}: ${message}${location}
${errorInCode}`;
}

// src/client.ts
var BUNDLER_URL = `https://${"0.19.0".replace(/\./g, "-")}-sandpack.codesandbox.io/`;
var SandpackClient = class {
  constructor(selector, sandboxInfo, options = {}) {
    this.getTranspilerContext = () => new Promise((resolve) => {
      const unsubscribe = this.listen((message) => {
        if (message.type === "transpiler-context") {
          resolve(message.data);
          unsubscribe();
        }
      });
      this.dispatch({ type: "get-transpiler-context" });
    });
    var _a;
    this.options = options;
    this.sandboxInfo = sandboxInfo;
    this.bundlerURL = options.bundlerURL || BUNDLER_URL;
    this.bundlerState = void 0;
    this.errors = [];
    this.status = "initializing";
    if (typeof selector === "string") {
      this.selector = selector;
      const element = document.querySelector(selector);
      if (!element) {
        throw new Error(`No element found for selector '${selector}'`);
      }
      this.element = element;
      this.iframe = document.createElement("iframe");
      this.initializeElement();
    } else {
      this.element = selector;
      this.iframe = selector;
    }
    if (!this.iframe.getAttribute("sandbox")) {
      this.iframe.setAttribute("sandbox", "allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts");
    }
    const urlSource = options.startRoute ? new URL(options.startRoute, this.bundlerURL).toString() : this.bundlerURL;
    (_a = this.iframe.contentWindow) == null ? void 0 : _a.location.replace(urlSource);
    this.iframeProtocol = new IFrameProtocol(this.iframe, this.bundlerURL);
    this.unsubscribeGlobalListener = this.iframeProtocol.globalListen((mes) => {
      if (mes.type !== "initialized" || !this.iframe.contentWindow) {
        return;
      }
      this.iframeProtocol.register();
      if (this.options.fileResolver) {
        this.fileResolverProtocol = new Protocol("file-resolver", async (data) => {
          if (data.m === "isFile") {
            return this.options.fileResolver.isFile(data.p);
          }
          return this.options.fileResolver.readFile(data.p);
        }, this.iframe.contentWindow);
      }
      this.updatePreview(this.sandboxInfo, true);
    });
    this.unsubscribeChannelListener = this.iframeProtocol.channelListen((mes) => {
      switch (mes.type) {
        case "start": {
          this.errors = [];
          break;
        }
        case "status": {
          this.status = mes.status;
          break;
        }
        case "action": {
          if (mes.action === "show-error") {
            this.errors = [...this.errors, extractErrorDetails(mes)];
          }
          break;
        }
        case "state": {
          this.bundlerState = mes.state;
          break;
        }
      }
    });
  }
  cleanup() {
    this.unsubscribeChannelListener();
    this.unsubscribeGlobalListener();
    this.iframeProtocol.cleanup();
  }
  updateOptions(options) {
    if (!isEqual(this.options, options)) {
      this.options = options;
      this.updatePreview();
    }
  }
  updatePreview(sandboxInfo = this.sandboxInfo, isInitializationCompile) {
    var _a, _b, _c, _d;
    this.sandboxInfo = {
      ...this.sandboxInfo,
      ...sandboxInfo
    };
    const files = this.getFiles();
    const modules = Object.keys(files).reduce((prev, next) => ({
      ...prev,
      [next]: {
        code: files[next].code,
        path: next
      }
    }), {});
    let packageJSON = JSON.parse(createPackageJSON(this.sandboxInfo.dependencies, this.sandboxInfo.devDependencies, this.sandboxInfo.entry));
    try {
      packageJSON = JSON.parse(files["/package.json"].code);
    } catch (e) {
      console.error("Could not parse package.json file: " + e.message);
    }
    const normalizedModules = Object.keys(files).reduce((prev, next) => ({
      ...prev,
      [next]: {
        content: files[next].code,
        path: next
      }
    }), {});
    this.dispatch({
      type: "compile",
      codesandbox: true,
      version: 3,
      isInitializationCompile,
      modules,
      reactDevTools: this.options.reactDevTools,
      externalResources: this.options.externalResources || [],
      hasFileResolver: Boolean(this.options.fileResolver),
      disableDependencyPreprocessing: this.sandboxInfo.disableDependencyPreprocessing,
      template: this.sandboxInfo.template || getTemplate_1(packageJSON, normalizedModules),
      showOpenInCodeSandbox: (_a = this.options.showOpenInCodeSandbox) != null ? _a : true,
      showErrorScreen: (_b = this.options.showErrorScreen) != null ? _b : true,
      showLoadingScreen: (_c = this.options.showLoadingScreen) != null ? _c : true,
      skipEval: this.options.skipEval || false,
      clearConsoleDisabled: !this.options.clearConsoleOnFirstCompile,
      logLevel: (_d = this.options.logLevel) != null ? _d : SandpackLogLevel.Info
    });
  }
  dispatch(message) {
    this.iframeProtocol.dispatch(message);
  }
  listen(listener) {
    return this.iframeProtocol.channelListen(listener);
  }
  getCodeSandboxURL() {
    const files = this.getFiles();
    const paramFiles = Object.keys(files).reduce((prev, next) => ({
      ...prev,
      [next.replace("/", "")]: {
        content: files[next].code,
        isBinary: false
      }
    }), {});
    return fetch("https://codesandbox.io/api/v1/sandboxes/define?json=1", {
      method: "POST",
      body: JSON.stringify({ files: paramFiles }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    }).then((x) => x.json()).then((res) => ({
      sandboxId: res.sandbox_id,
      editorUrl: `https://codesandbox.io/s/${res.sandbox_id}`,
      embedUrl: `https://codesandbox.io/embed/${res.sandbox_id}`
    }));
  }
  getFiles() {
    const { sandboxInfo } = this;
    if (sandboxInfo.files["/package.json"] === void 0) {
      return addPackageJSONIfNeeded(sandboxInfo.files, sandboxInfo.dependencies, sandboxInfo.devDependencies, sandboxInfo.entry);
    }
    return this.sandboxInfo.files;
  }
  initializeElement() {
    this.iframe.style.border = "0";
    this.iframe.style.width = this.options.width || "100%";
    this.iframe.style.height = this.options.height || "100%";
    this.iframe.style.overflow = "hidden";
    if (!this.element.parentNode) {
      throw new Error("Given element does not have a parent.");
    }
    this.element.parentNode.replaceChild(this.iframe, this.element);
  }
};

// src/types.ts
var SandpackLogLevel;
(function(SandpackLogLevel2) {
  SandpackLogLevel2[SandpackLogLevel2["None"] = 0] = "None";
  SandpackLogLevel2[SandpackLogLevel2["Error"] = 10] = "Error";
  SandpackLogLevel2[SandpackLogLevel2["Warning"] = 20] = "Warning";
  SandpackLogLevel2[SandpackLogLevel2["Info"] = 30] = "Info";
  SandpackLogLevel2[SandpackLogLevel2["Debug"] = 40] = "Debug";
})(SandpackLogLevel || (SandpackLogLevel = {}));

function Preview(_a) {
    var { className, files, presetConfig, show, children, codeConfig, style, frameless } = _a, rest = __rest(_a, ["className", "files", "presetConfig", "show", "children", "codeConfig", "style", "frameless"]);
    const kids = presetConfig ? (React__default["default"].createElement(SandpackPreview, { files: files, presetConfig: presetConfig })) : (children);
    return (React__default["default"].createElement("div", { className: "ch-preview" + (className ? " " + className : ""), style: style }, frameless ? (kids) : (React__default["default"].createElement(MiniBrowser, Object.assign({ loadUrl: show, theme: codeConfig.theme }, rest, { children: kids })))));
}
function SandpackPreview({ files, presetConfig, }) {
    const iframeRef = React__default["default"].useRef(null);
    const clientRef = React__default["default"].useRef(null);
    React__default["default"].useEffect(() => {
        clientRef.current = new SandpackClient(iframeRef.current, Object.assign(Object.assign({}, presetConfig), { files: mergeFiles(presetConfig.files, files) }), {
            showOpenInCodeSandbox: false,
            // showErrorScreen: false,
            // showLoadingScreen: false,
        });
    }, []);
    React__default["default"].useEffect(() => {
        if (clientRef.current) {
            clientRef.current.updatePreview(Object.assign(Object.assign({}, presetConfig), { files: mergeFiles(presetConfig.files, files) }));
        }
    }, [files]);
    return React__default["default"].createElement("iframe", { ref: iframeRef });
}
function mergeFiles(csbFiles, chFiles) {
    const result = Object.assign({}, csbFiles);
    chFiles.forEach(file => {
        result["/" + file.name] = {
            code: file.code.lines
                .map(l => l.tokens.map(t => t.content).join(""))
                .join("\n"),
        };
    });
    return result;
}

function extractPreviewSteps(children, hasPreviewSteps) {
    const allChildren = React__default["default"].Children.toArray(children);
    const stepsChildren = hasPreviewSteps
        ? allChildren.slice(0, allChildren.length / 2)
        : allChildren;
    const previewChildren = hasPreviewSteps
        ? allChildren.slice(allChildren.length / 2)
        : undefined;
    return { stepsChildren, previewChildren };
}

function Spotlight(_a) {
    var _b;
    var { children, editorSteps, codeConfig, start = 0, presetConfig, className, style, hasPreviewSteps } = _a, rest = __rest(_a, ["children", "editorSteps", "codeConfig", "start", "presetConfig", "className", "style", "hasPreviewSteps"]);
    const { stepsChildren, previewChildren } = extractPreviewSteps(children, hasPreviewSteps);
    const withPreview = presetConfig || hasPreviewSteps;
    const [state, setState] = React__default["default"].useState({
        stepIndex: start,
        step: editorSteps[start],
    });
    const tab = state.step;
    function onTabClick(filename) {
        const newStep = updateEditorStep(state.step, filename, null);
        setState(Object.assign(Object.assign({}, state), { step: newStep }));
    }
    const headerElement = stepsChildren[0];
    return (React__default["default"].createElement("section", { className: `ch-spotlight ${withPreview ? "ch-spotlight-with-preview" : ""} ${className || ""}`, style: style },
        React__default["default"].createElement("div", { className: "ch-spotlight-tabs" },
            ((_b = headerElement === null || headerElement === void 0 ? void 0 : headerElement.props) === null || _b === void 0 ? void 0 : _b.children) ? (React__default["default"].createElement("div", null, stepsChildren[0])) : null,
            stepsChildren.map((children, i) => i === 0 ? null : (React__default["default"].createElement("div", { key: i, onClick: () => setState({
                    stepIndex: i,
                    step: editorSteps[i],
                }), className: "ch-spotlight-tab", "data-selected": i === state.stepIndex ? "true" : undefined }, children)))),
        React__default["default"].createElement("div", { className: "ch-spotlight-sticker" },
            React__default["default"].createElement(InnerCode, Object.assign({}, rest, tab, { codeConfig: codeConfig, onTabClick: onTabClick })),
            presetConfig ? (React__default["default"].createElement(Preview, { className: "ch-spotlight-preview", files: tab.files, presetConfig: presetConfig, codeConfig: codeConfig })) : hasPreviewSteps ? (React__default["default"].createElement(Preview, Object.assign({ className: "ch-spotlight-preview" }, previewChildren[state.stepIndex]["props"]))) : null)));
}

function debugEntries(entries) {
    entries.forEach(showEntry);
}
function showEntry(entry) {
    var _a;
    const rootHeight = ((_a = entry.rootBounds) === null || _a === void 0 ? void 0 : _a.height) || 0;
    addFlashingRect(entry.rootBounds, {
        border: `${Math.min(10, rootHeight / 2)}px solid ${iodOptions.rootColor}`,
        overflow: "hidden",
        boxSizing: "border-box",
    });
    addFlashingRect(entry.boundingClientRect, {
        border: `${Math.min(10, entry.boundingClientRect.height / 2)}px solid ${entry.isIntersecting
            ? iodOptions.enterColor
            : iodOptions.exitColor}`,
        overflow: "hidden",
        boxSizing: "border-box",
    });
    addFlashingRect(entry.intersectionRect, {
        backgroundColor: iodOptions.interColor,
        zIndex: 2,
    });
}
function addFlashingRect(bounds, style = {}) {
    const { width, left, height, top } = bounds;
    const div = document.createElement("div");
    div.style.position = "fixed";
    div.style.width = width + "px";
    div.style.left = left + "px";
    div.style.top = top + "px";
    div.style.height = height + "px";
    div.style.pointerEvents = "none";
    div.style.transition = "opacity 2s ease-in";
    Object.assign(div.style, style);
    requestAnimationFrame(() => requestAnimationFrame(() => {
        div.style.opacity = "0";
    }));
    div.addEventListener("transitionend", () => {
        document.body.removeChild(div);
    });
    document.body.appendChild(div);
    return div;
}
const iodOptions = {
    rootColor: "#9428AB",
    enterColor: "#B35C00",
    exitColor: "#035570",
    interColor: "#9CAF00BB",
};

const useLayoutEffect$1 = typeof window !== "undefined"
    ? React__default["default"].useLayoutEffect
    : React__default["default"].useEffect;
function useWindowHeight() {
    const isClient = typeof window === "object";
    function getHeight() {
        return isClient
            ? document.documentElement.clientHeight
            : undefined;
    }
    const [windowHeight, setWindowHeight] = React__default["default"].useState(getHeight);
    React__default["default"].useEffect(() => {
        function handleResize() {
            setWindowHeight(getHeight());
        }
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    useLayoutEffect$1(() => {
        // FIX when a horizontal scrollbar is added after the first layout
        setWindowHeight(getHeight());
    }, []);
    return windowHeight;
}

const ObserverContext = React__default["default"].createContext(undefined);
const useLayoutEffect = typeof window !== "undefined"
    ? React__default["default"].useLayoutEffect
    : React__default["default"].useEffect;
function Scroller({ onStepChange, children, getRootMargin = defaultRootMargin, debug = false, }) {
    const [observer, setObserver,] = React__default["default"].useState();
    const vh = useWindowHeight();
    useLayoutEffect(() => {
        const windowHeight = vh || 0;
        const handleIntersect = entries => {
            if (debug || window.chDebugScroller) {
                debugEntries(entries);
            }
            entries.forEach(entry => {
                if (entry.intersectionRatio > 0) {
                    const stepElement = entry.target;
                    onStepChange(+stepElement.stepIndex);
                }
            });
        };
        const observer = newIntersectionObserver(handleIntersect, getRootMargin(windowHeight));
        setObserver(observer);
        return () => observer.disconnect();
    }, [vh]);
    return (React__default["default"].createElement(ObserverContext.Provider, { value: observer }, children));
}
function Step(_a) {
    var { as = "section", index } = _a, props = __rest(_a, ["as", "index"]);
    const ref = React__default["default"].useRef(null);
    const observer = React__default["default"].useContext(ObserverContext);
    useLayoutEffect(() => {
        if (observer) {
            observer.observe(ref.current);
        }
        return () => observer && observer.unobserve(ref.current);
    }, [observer]);
    useLayoutEffect(() => {
        const stepElement = ref.current;
        stepElement.stepIndex = index;
    }, [index]);
    return React__default["default"].createElement(as, Object.assign(Object.assign({}, props), { ref }));
}
function newIntersectionObserver(handleIntersect, rootMargin) {
    return new IntersectionObserver(handleIntersect, {
        rootMargin,
        threshold: 0.000001,
        root: null,
    });
}
function defaultRootMargin(vh) {
    return `-${vh / 2 - 2}px 0px`;
}

// server-side-media-queries-for-react
let suffixCounter = 0;
/**
 * @typedef SwapProps
 * @prop {[string, JSX.Element][]} match
 */
/**
 * Swap between different components depending on the media queries
 * @param {SwapProps} props
 */
function Swap({ match }) {
    const queries = match.map(([q]) => q);
    const { isServer, matchedIndex } = useMedia(queries);
    const mainClassName = isServer
        ? "ssmq-" + suffixCounter++
        : "";
    return isServer ? (React__default["default"].createElement(React__default["default"].Fragment, null,
        React__default["default"].createElement("style", { className: mainClassName, dangerouslySetInnerHTML: {
                __html: getStyle(queries, mainClassName),
            } }),
        match.map(([query, element]) => (React__default["default"].createElement("div", { key: query, className: `${mainClassName} ${getClassName(query)}` }, element))),
        React__default["default"].createElement("script", { className: mainClassName, dangerouslySetInnerHTML: {
                __html: getScript(match, mainClassName),
            } }))) : (React__default["default"].createElement(React__default["default"].Fragment, null,
        React__default["default"].createElement("div", null, match[matchedIndex][1])));
}
function getStyle(queries, mainClass) {
    const reversedQueries = queries.slice().reverse();
    const style = reversedQueries
        .map(query => {
        const currentStyle = `.${mainClass}.${getClassName(query)}{display:block}`;
        const otherStyle = `.${mainClass}:not(.${getClassName(query)}){display: none;}`;
        if (query === "default") {
            return `${currentStyle}${otherStyle}`;
        }
        else {
            return `@media ${query}{${currentStyle}${otherStyle}}`;
        }
    })
        .join("\n");
    return style;
}
function getScript(match, mainClass) {
    const queries = match.map(([query]) => query);
    const classes = queries.map(getClassName);
    return `(function() {
  var qs = ${JSON.stringify(queries)};
  var clss = ${JSON.stringify(classes)};
  var mainCls = "${mainClass}";

  var scrEls = document.getElementsByTagName("script");
  var scrEl = scrEls[scrEls.length - 1];
  var parent = scrEl.parentNode;

  var el = null;
  for (var i = 0; i < qs.length - 1; i++) {
    if (window.matchMedia(qs[i]).matches) {
      el = parent.querySelector(":scope > ." + mainCls + "." + clss[i]);
      break;
    }
  }
  if (!el) {
    var defaultClass = clss.pop();
    el = parent.querySelector(":scope > ." + mainCls + "." + defaultClass);
  }
  el.removeAttribute("class");

  parent.querySelectorAll(":scope > ." + mainCls).forEach(function (e) {
    parent.removeChild(e);
  });
})();`;
}
function getClassName(string) {
    return ("ssmq-" +
        string
            .replace(/[!\"#$%&'\(\)\*\+,\.\/:;<=>\?\@\[\\\]\^`\{\|\}~\s]/g, "")
            .toLowerCase());
}
function useMedia(queries) {
    const isServer = typeof window === "undefined";
    const allQueries = queries.slice(0, -1);
    if (queries[queries.length - 1] !== "default") {
        console.warn("last media query should be 'default'");
    }
    const [, setValue] = React__default["default"].useState(0);
    const mediaQueryLists = isServer
        ? []
        : allQueries.map(q => window.matchMedia(q));
    React__default["default"].useEffect(() => {
        const handler = () => setValue(x => x + 1);
        mediaQueryLists.forEach(mql => mql.addListener(handler));
        return () => mediaQueryLists.forEach(mql => mql.removeListener(handler));
    }, []);
    const matchedIndex = mediaQueryLists.findIndex(mql => mql.matches);
    return {
        isServer,
        matchedIndex: matchedIndex < 0 ? queries.length - 1 : matchedIndex,
    };
}

function CodeSlot() {
    const context = React__default["default"].useContext(StaticStepContext);
    if (!context) {
        return null;
    }
    return React__default["default"].createElement(InnerCodeSlot, Object.assign({}, context));
}
function InnerCodeSlot({ editorStep, setFocus }) {
    const onTabClick = (filename) => {
        setFocus({ fileName: filename, focus: null, id: "" });
    };
    const props = __rest(editorStep, ["preset", "presetConfig"]);
    return React__default["default"].createElement(InnerCode, Object.assign({}, props, { onTabClick: onTabClick }));
}
function PreviewSlot() {
    const context = React__default["default"].useContext(StaticStepContext);
    if (!context) {
        return null;
    }
    return React__default["default"].createElement(InnerPreviewSlot, Object.assign({}, context));
}
function InnerPreviewSlot({ previewStep, allProps, editorStep, }) {
    const props = __rest(allProps, ["preset"]);
    return (React__default["default"].createElement(Preview, Object.assign({ className: "ch-scrollycoding-preview" }, props, previewStep === null || previewStep === void 0 ? void 0 : previewStep.props, { files: editorStep.files })));
}
const StaticStepContext = React__default["default"].createContext(null);

function Scrollycoding(props) {
    return (React__default["default"].createElement(Swap, { match: [
            [
                props.codeConfig.staticMediaQuery,
                React__default["default"].createElement(StaticScrollycoding, Object.assign({}, props)),
            ],
            ["default", React__default["default"].createElement(DynamicScrollycoding, Object.assign({}, props))],
        ] }));
}
function StaticScrollycoding(_a) {
    var { children, hasPreviewSteps, editorSteps } = _a, rest = __rest(_a, ["children", "hasPreviewSteps", "editorSteps"]);
    const { stepsChildren, previewChildren } = extractPreviewSteps(children, hasPreviewSteps);
    return (React__default["default"].createElement("section", { className: `ch-scrollycoding-static` }, stepsChildren.map((children, i) => (React__default["default"].createElement(StaticSection, { key: i, editorStep: editorSteps[i], previewStep: previewChildren && previewChildren[i], allProps: rest }, children)))));
}
function StaticSection({ editorStep, previewStep, allProps, children, }) {
    const [step, setStep] = React__default["default"].useState(Object.assign(Object.assign({}, editorStep), allProps));
    const resetFocus = () => setStep(Object.assign(Object.assign({}, editorStep), allProps));
    const setFocus = ({ fileName, focus, id, }) => {
        const newStep = updateEditorStep(step, fileName, focus);
        setStep(Object.assign(Object.assign(Object.assign({}, step), newStep), { selectedId: id }));
    };
    return (React__default["default"].createElement(StaticStepContext.Provider, { value: {
            editorStep: step,
            previewStep: previewStep,
            allProps,
            setFocus,
        } },
        React__default["default"].createElement(LinkableSection, { onActivation: setFocus, onReset: resetFocus }, children)));
}
function DynamicScrollycoding(_a) {
    var { children, editorSteps, codeConfig, presetConfig, start = 0, className, style, hasPreviewSteps } = _a, rest = __rest(_a, ["children", "editorSteps", "codeConfig", "presetConfig", "start", "className", "style", "hasPreviewSteps"]);
    const { stepsChildren, previewChildren } = extractPreviewSteps(children, hasPreviewSteps);
    const withPreview = presetConfig || hasPreviewSteps;
    const [state, setState] = React__default["default"].useState({
        stepIndex: start,
        step: editorSteps[start],
    });
    const tab = state.step;
    function onStepChange(index) {
        setState({ stepIndex: index, step: editorSteps[index] });
    }
    function onTabClick(filename) {
        const newStep = updateEditorStep(state.step, filename, null);
        setState(Object.assign(Object.assign({}, state), { step: newStep }));
    }
    function onLinkActivation(stepIndex, filename, focus) {
        const newStep = updateEditorStep(editorSteps[stepIndex], filename, focus);
        setState(Object.assign(Object.assign({}, state), { stepIndex, step: newStep }));
    }
    return (React__default["default"].createElement("section", { className: `ch-scrollycoding ${withPreview ? "ch-scrollycoding-with-preview" : ""} ${className || ""}`, style: style },
        React__default["default"].createElement("div", { className: "ch-scrollycoding-content" },
            React__default["default"].createElement(Scroller, { onStepChange: onStepChange }, stepsChildren.map((children, i) => (React__default["default"].createElement(Step, { as: "div", key: i, index: i, onClick: () => onStepChange(i), className: "ch-scrollycoding-step-content", "data-selected": i === state.stepIndex ? "true" : undefined },
                React__default["default"].createElement(LinkableSection, { onActivation: ({ fileName, focus }) => {
                        onLinkActivation(i, fileName, focus);
                    }, onReset: () => {
                        onStepChange(i);
                    } }, children)))))),
        React__default["default"].createElement("div", { className: "ch-scrollycoding-sticker" },
            React__default["default"].createElement(InnerCode, Object.assign({ showExpandButton: true }, rest, tab, { codeConfig: codeConfig, onTabClick: onTabClick })),
            presetConfig ? (React__default["default"].createElement(Preview, { className: "ch-scrollycoding-preview", files: tab.files, presetConfig: presetConfig, codeConfig: codeConfig })) : hasPreviewSteps ? (React__default["default"].createElement(Preview, Object.assign({ className: "ch-scrollycoding-preview" }, previewChildren[state.stepIndex]["props"]))) : null)));
}

function Slideshow(_a) {
    var { children, className, code, codeConfig, editorSteps, autoFocus, hasPreviewSteps, 
    // Set the initial slide index
    start = 0, 
    // Called when the slideshow state changes and returns the current state object
    onChange: onSlideshowChange = () => { }, presetConfig, style, autoPlay, loop = false } = _a, rest = __rest(_a, ["children", "className", "code", "codeConfig", "editorSteps", "autoFocus", "hasPreviewSteps", "start", "onChange", "presetConfig", "style", "autoPlay", "loop"]);
    const { stepsChildren, previewChildren } = extractPreviewSteps(children, hasPreviewSteps);
    const withPreview = presetConfig || hasPreviewSteps;
    const hasNotes = stepsChildren.some((child) => { var _a; return (_a = child.props) === null || _a === void 0 ? void 0 : _a.children; });
    const maxSteps = editorSteps.length - 1;
    const [state, setState] = React__default["default"].useState(() => {
        const startIndex = clamp$2(start, 0, maxSteps);
        return {
            stepIndex: startIndex,
            step: editorSteps[startIndex],
        };
    });
    const { stepIndex: currentIndex, step: tab } = state;
    const atSlideshowEnd = currentIndex === maxSteps;
    React__default["default"].useEffect(() => {
        onSlideshowChange({ index: currentIndex });
    }, [currentIndex]);
    function onTabClick(filename) {
        const newStep = updateEditorStep(tab, filename, null);
        setState(Object.assign(Object.assign({}, state), { step: newStep }));
    }
    function setIndex(newIndex) {
        const stepIndex = clamp$2(newIndex, 0, maxSteps);
        setState({ stepIndex, step: editorSteps[stepIndex] });
    }
    function nextSlide() {
        setState(s => {
            const stepIndex = loop
                ? (s.stepIndex + 1) % (maxSteps + 1)
                : clamp$2(s.stepIndex + 1, 0, maxSteps);
            return {
                stepIndex,
                step: editorSteps[stepIndex],
            };
        });
    }
    useInterval(nextSlide, autoPlay);
    return (React__default["default"].createElement("div", { className: `ch-slideshow ${withPreview ? "ch-slideshow-with-preview" : ""} ${className || ""}`, style: style },
        React__default["default"].createElement("div", { className: "ch-slideshow-slide" },
            React__default["default"].createElement(InnerCode, Object.assign({}, rest, tab, { codeConfig: Object.assign(Object.assign({}, codeConfig), code), onTabClick: onTabClick })),
            presetConfig ? (React__default["default"].createElement(Preview, { className: "ch-slideshow-preview", files: tab.files, presetConfig: presetConfig, codeConfig: codeConfig })) : hasPreviewSteps ? (React__default["default"].createElement(Preview, Object.assign({ className: "ch-slideshow-preview" }, previewChildren[currentIndex]["props"]))) : null),
        React__default["default"].createElement("div", { className: "ch-slideshow-notes" },
            React__default["default"].createElement("div", { className: "ch-slideshow-range" },
                React__default["default"].createElement("button", { onClick: () => setIndex(currentIndex - 1), disabled: currentIndex === 0 }, "Prev"),
                React__default["default"].createElement("input", { max: maxSteps, min: 0, step: 1, type: "range", value: currentIndex, onChange: e => setIndex(+e.target.value), ref: useAutoFocusRef(autoFocus), autoFocus: autoFocus }),
                React__default["default"].createElement("button", { onClick: nextSlide, disabled: atSlideshowEnd }, "Next")),
            hasNotes && (React__default["default"].createElement("div", { className: "ch-slideshow-note" }, stepsChildren[currentIndex])))));
}
function useAutoFocusRef(autoFocus) {
    const ref = React__default["default"].useRef(null);
    React__default["default"].useEffect(() => {
        autoFocus && ref.current.focus();
    }, []);
    return ref;
}

function Annotation() {
    return (React__default["default"].createElement("div", null, "\"error: code hike remark plugin not running or annotation isn't at the right place\""));
}
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
        return React__default["default"].createElement(InlineMark, Object.assign({}, props));
    }
    else {
        return React__default["default"].createElement(MultilineMark, Object.assign({}, props));
    }
}
function MultilineMark({ children, data, style, theme, }) {
    const className = `ch-code-multiline-mark ` + (data !== null && data !== void 0 ? data : "");
    const bg = getColor(theme, ColorName.RangeHighlightBackground);
    const border = getColor(theme, ColorName.EditorInfoForeground);
    return (React__default["default"].createElement("div", { style: Object.assign(Object.assign({}, style), { background: bg }), className: className },
        React__default["default"].createElement("span", { className: "ch-code-multiline-mark-border", style: { background: border } }),
        children));
}
function InlineMark({ children, data, theme, }) {
    const bg = tryGuessColor(children) ||
        transparent(getColor(theme, ColorName.CodeForeground), 0.2);
    const className = "ch-code-inline-mark " + (data !== null && data !== void 0 ? data : "");
    return (React__default["default"].createElement("span", { className: className, style: { background: bg } }, children));
}
function tryGuessColor(children) {
    var _a, _b, _c;
    const child = React__default["default"].Children.toArray(children)[0];
    const grandChild = React__default["default"].Children.toArray(((_a = child === null || child === void 0 ? void 0 : child.props) === null || _a === void 0 ? void 0 : _a.children) || [])[0];
    const grandGrandChild = React__default["default"].Children.toArray(((_b = grandChild === null || grandChild === void 0 ? void 0 : grandChild.props) === null || _b === void 0 ? void 0 : _b.children) || [])[0];
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
    return (React__default["default"].createElement("span", { className: "ch-code-box-annotation", style: { outline: `2px solid ${border}` } }, children));
}
function WithClass({ children, data, style, theme, }) {
    const className = data;
    return (React__default["default"].createElement("span", { style: style, className: className }, children));
}
function Label({ children, data, style, theme, }) {
    const bg = (theme.colors["editor.lineHighlightBackground"] ||
        theme.colors["editor.selectionHighlightBackground"]);
    const [hover, setHover] = React__default["default"].useState(false);
    return (React__default["default"].createElement("div", { style: Object.assign(Object.assign({}, style), { background: hover ? bg : undefined }), onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false) },
        children,
        React__default["default"].createElement("div", { style: {
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
    return (React__default["default"].createElement("a", { href: url, title: title, className: isInline ? "ch-code-inline-link" : "ch-code-link", style: style }, children));
}

function InlineCode(_a) {
    var { className, codeConfig, children, code } = _a, rest = __rest(_a, ["className", "codeConfig", "children", "code"]);
    const { theme } = codeConfig;
    const { lines } = code;
    const allTokens = lines.flatMap(line => line.tokens);
    const foreground = getColor(theme, ColorName.CodeForeground);
    return (React__default["default"].createElement("span", Object.assign({ className: "ch-inline-code not-prose" +
            (className ? " " + className : "") }, rest),
        React__default["default"].createElement("code", { style: {
                ["--ch-code-foreground"]: foreground,
                background: transparent(getColor(theme, ColorName.CodeBackground), 0.9),
                color: foreground,
            } }, allTokens.map((token, j) => (React__default["default"].createElement("span", Object.assign({ key: j }, token.props), token.content))))));
}

const CH = {
    Code,
    Section,
    SectionLink,
    SectionCode,
    Spotlight,
    Scrollycoding,
    Preview,
    annotations: annotationsMap,
    Annotation,
    Slideshow,
    InlineCode,
    CodeSlot,
    PreviewSlot,
};
const internal = {
    MiniBrowser,
    EditorSpring,
};

exports.Annotation = Annotation;
exports.CH = CH;
exports.Code = Code;
exports.CodeSlot = CodeSlot;
exports.InlineCode = InlineCode;
exports.Preview = Preview;
exports.PreviewSlot = PreviewSlot;
exports.Scrollycoding = Scrollycoding;
exports.Section = Section;
exports.SectionCode = SectionCode;
exports.SectionLink = SectionLink;
exports.Slideshow = Slideshow;
exports.Spotlight = Spotlight;
exports.annotations = annotationsMap;
exports.internal = internal;
