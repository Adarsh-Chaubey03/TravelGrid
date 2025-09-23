var _excluded = ["x", "y", "lineHeight", "capHeight", "scaleToFit", "textAnchor", "verticalAnchor", "fill"],
  _excluded2 = ["dx", "dy", "angle", "className", "breakAll"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import { useMemo, forwardRef } from 'react';
import { clsx } from 'clsx';
import { isNullish, isNumber, isNumOrStr } from '../util/DataUtils';
import { Global } from '../util/Global';
import { filterProps } from '../util/ReactUtils';
import { getStringSize } from '../util/DOMUtils';
import { reduceCSSCalc } from '../util/ReduceCSSCalc';
var BREAKING_SPACES = /[ \f\n\r\t\v\u2028\u2029]+/;
var calculateWordWidths = _ref => {
  var {
    children,
    breakAll,
    style
  } = _ref;
  try {
    var words = [];
    if (!isNullish(children)) {
      if (breakAll) {
        words = children.toString().split('');
      } else {
        words = children.toString().split(BREAKING_SPACES);
      }
    }
    var wordsWithComputedWidth = words.map(word => ({
      word,
      width: getStringSize(word, style).width
    }));
    var spaceWidth = breakAll ? 0 : getStringSize('\u00A0', style).width;
    return {
      wordsWithComputedWidth,
      spaceWidth
    };
  } catch (_unused) {
    return null;
  }
};
var calculateWordsByLines = (_ref2, initialWordsWithComputedWith, spaceWidth, lineWidth, scaleToFit) => {
  var {
    maxLines,
    children,
    style,
    breakAll
  } = _ref2;
  var shouldLimitLines = isNumber(maxLines);
  var text = children;
  var calculate = function calculate() {
    var words = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    return words.reduce((result, _ref3) => {
      var {
        word,
        width
      } = _ref3;
      var currentLine = result[result.length - 1];
      if (currentLine && (lineWidth == null || scaleToFit || currentLine.width + width + spaceWidth < Number(lineWidth))) {
        // Word can be added to an existing line
        currentLine.words.push(word);
        currentLine.width += width + spaceWidth;
      } else {
        // Add first word to line or word is too long to scaleToFit on existing line
        var newLine = {
          words: [word],
          width
        };
        result.push(newLine);
      }
      return result;
    }, []);
  };
  var originalResult = calculate(initialWordsWithComputedWith);
  var findLongestLine = words => words.reduce((a, b) => a.width > b.width ? a : b);
  if (!shouldLimitLines || scaleToFit) {
    return originalResult;
  }
  var overflows = originalResult.length > maxLines || findLongestLine(originalResult).width > Number(lineWidth);
  if (!overflows) {
    return originalResult;
  }
  var suffix = '…';
  var checkOverflow = index => {
    var tempText = text.slice(0, index);
    var words = calculateWordWidths({
      breakAll,
      style,
      children: tempText + suffix
    }).wordsWithComputedWidth;
    var result = calculate(words);
    var doesOverflow = result.length > maxLines || findLongestLine(result).width > Number(lineWidth);
    return [doesOverflow, result];
  };
  var start = 0;
  var end = text.length - 1;
  var iterations = 0;
  var trimmedResult;
  while (start <= end && iterations <= text.length - 1) {
    var middle = Math.floor((start + end) / 2);
    var prev = middle - 1;
    var [doesPrevOverflow, result] = checkOverflow(prev);
    var [doesMiddleOverflow] = checkOverflow(middle);
    if (!doesPrevOverflow && !doesMiddleOverflow) {
      start = middle + 1;
    }
    if (doesPrevOverflow && doesMiddleOverflow) {
      end = middle - 1;
    }
    if (!doesPrevOverflow && doesMiddleOverflow) {
      trimmedResult = result;
      break;
    }
    iterations++;
  }

  // Fallback to originalResult (result without trimming) if we cannot find the
  // where to trim.  This should not happen :tm:
  return trimmedResult || originalResult;
};
var getWordsWithoutCalculate = children => {
  var words = !isNullish(children) ? children.toString().split(BREAKING_SPACES) : [];
  return [{
    words
  }];
};
export var getWordsByLines = _ref4 => {
  var {
    width,
    scaleToFit,
    children,
    style,
    breakAll,
    maxLines
  } = _ref4;
  // Only perform calculations if using features that require them (multiline, scaleToFit)
  if ((width || scaleToFit) && !Global.isSsr) {
    var wordsWithComputedWidth, spaceWidth;
    var wordWidths = calculateWordWidths({
      breakAll,
      children,
      style
    });
    if (wordWidths) {
      var {
        wordsWithComputedWidth: wcw,
        spaceWidth: sw
      } = wordWidths;
      wordsWithComputedWidth = wcw;
      spaceWidth = sw;
    } else {
      return getWordsWithoutCalculate(children);
    }
    return calculateWordsByLines({
      breakAll,
      children,
      maxLines,
      style
    }, wordsWithComputedWidth, spaceWidth, width, scaleToFit);
  }
  return getWordsWithoutCalculate(children);
};
var DEFAULT_FILL = '#808080';
export var Text = /*#__PURE__*/forwardRef((_ref5, ref) => {
  var {
      x: propsX = 0,
      y: propsY = 0,
      lineHeight = '1em',
      // Magic number from d3
      capHeight = '0.71em',
      scaleToFit = false,
      textAnchor = 'start',
      // Maintain compat with existing charts / default SVG behavior
      verticalAnchor = 'end',
      fill = DEFAULT_FILL
    } = _ref5,
    props = _objectWithoutProperties(_ref5, _excluded);
  var wordsByLines = useMemo(() => {
    return getWordsByLines({
      breakAll: props.breakAll,
      children: props.children,
      maxLines: props.maxLines,
      scaleToFit,
      style: props.style,
      width: props.width
    });
  }, [props.breakAll, props.children, props.maxLines, scaleToFit, props.style, props.width]);
  var {
      dx,
      dy,
      angle,
      className,
      breakAll
    } = props,
    textProps = _objectWithoutProperties(props, _excluded2);
  if (!isNumOrStr(propsX) || !isNumOrStr(propsY)) {
    return null;
  }
  var x = propsX + (isNumber(dx) ? dx : 0);
  var y = propsY + (isNumber(dy) ? dy : 0);
  var startDy;
  switch (verticalAnchor) {
    case 'start':
      startDy = reduceCSSCalc("calc(".concat(capHeight, ")"));
      break;
    case 'middle':
      startDy = reduceCSSCalc("calc(".concat((wordsByLines.length - 1) / 2, " * -").concat(lineHeight, " + (").concat(capHeight, " / 2))"));
      break;
    default:
      startDy = reduceCSSCalc("calc(".concat(wordsByLines.length - 1, " * -").concat(lineHeight, ")"));
      break;
  }
  var transforms = [];
  if (scaleToFit) {
    var lineWidth = wordsByLines[0].width;
    var {
      width
    } = props;
    transforms.push("scale(".concat(isNumber(width) ? width / lineWidth : 1, ")"));
  }
  if (angle) {
    transforms.push("rotate(".concat(angle, ", ").concat(x, ", ").concat(y, ")"));
  }
  if (transforms.length) {
    textProps.transform = transforms.join(' ');
  }
  return /*#__PURE__*/React.createElement("text", _extends({}, filterProps(textProps, true), {
    ref: ref,
    x: x,
    y: y,
    className: clsx('recharts-text', className),
    textAnchor: textAnchor,
    fill: fill.includes('url') ? DEFAULT_FILL : fill
  }), wordsByLines.map((line, index) => {
    var words = line.words.join(breakAll ? '' : ' ');
    return (
      /*#__PURE__*/
      // duplicate words will cause duplicate keys
      // eslint-disable-next-line react/no-array-index-key
      React.createElement("tspan", {
        x: x,
        dy: index === 0 ? startDy : lineHeight,
        key: "".concat(words, "-").concat(index)
      }, words)
    );
  }));
});
Text.displayName = 'Text';