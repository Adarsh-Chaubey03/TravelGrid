function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * @fileOverview Rectangle
 */
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { clsx } from 'clsx';
import { filterProps } from '../util/ReactUtils';
import { resolveDefaultProps } from '../util/resolveDefaultProps';
import { Animate } from '../animation/Animate';
var getTrapezoidPath = (x, y, upperWidth, lowerWidth, height) => {
  var widthGap = upperWidth - lowerWidth;
  var path;
  path = "M ".concat(x, ",").concat(y);
  path += "L ".concat(x + upperWidth, ",").concat(y);
  path += "L ".concat(x + upperWidth - widthGap / 2, ",").concat(y + height);
  path += "L ".concat(x + upperWidth - widthGap / 2 - lowerWidth, ",").concat(y + height);
  path += "L ".concat(x, ",").concat(y, " Z");
  return path;
};
var defaultProps = {
  x: 0,
  y: 0,
  upperWidth: 0,
  lowerWidth: 0,
  height: 0,
  isUpdateAnimationActive: false,
  animationBegin: 0,
  animationDuration: 1500,
  animationEasing: 'ease'
};
export var Trapezoid = props => {
  var trapezoidProps = resolveDefaultProps(props, defaultProps);
  var pathRef = useRef();
  var [totalLength, setTotalLength] = useState(-1);
  useEffect(() => {
    if (pathRef.current && pathRef.current.getTotalLength) {
      try {
        var pathTotalLength = pathRef.current.getTotalLength();
        if (pathTotalLength) {
          setTotalLength(pathTotalLength);
        }
      } catch (_unused) {
        // calculate total length error
      }
    }
  }, []);
  var {
    x,
    y,
    upperWidth,
    lowerWidth,
    height,
    className
  } = trapezoidProps;
  var {
    animationEasing,
    animationDuration,
    animationBegin,
    isUpdateAnimationActive
  } = trapezoidProps;
  if (x !== +x || y !== +y || upperWidth !== +upperWidth || lowerWidth !== +lowerWidth || height !== +height || upperWidth === 0 && lowerWidth === 0 || height === 0) {
    return null;
  }
  var layerClass = clsx('recharts-trapezoid', className);
  if (!isUpdateAnimationActive) {
    return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", _extends({}, filterProps(trapezoidProps, true), {
      className: layerClass,
      d: getTrapezoidPath(x, y, upperWidth, lowerWidth, height)
    })));
  }
  return /*#__PURE__*/React.createElement(Animate, {
    canBegin: totalLength > 0,
    from: {
      upperWidth: 0,
      lowerWidth: 0,
      height,
      x,
      y
    },
    to: {
      upperWidth,
      lowerWidth,
      height,
      x,
      y
    },
    duration: animationDuration
    // @ts-expect-error TODO - fix the type error
    ,
    animationEasing: animationEasing,
    isActive: isUpdateAnimationActive
  }, _ref => {
    var {
      upperWidth: currUpperWidth,
      lowerWidth: currLowerWidth,
      height: currHeight,
      x: currX,
      y: currY
    } = _ref;
    return /*#__PURE__*/React.createElement(Animate, {
      canBegin: totalLength > 0
      // @ts-expect-error TODO - fix the type error
      ,
      from: "0px ".concat(totalLength === -1 ? 1 : totalLength, "px")
      // @ts-expect-error TODO - fix the type error
      ,
      to: "".concat(totalLength, "px 0px"),
      attributeName: "strokeDasharray",
      begin: animationBegin,
      duration: animationDuration,
      easing: animationEasing
    }, /*#__PURE__*/React.createElement("path", _extends({}, filterProps(trapezoidProps, true), {
      className: layerClass,
      d: getTrapezoidPath(currX, currY, currUpperWidth, currLowerWidth, currHeight),
      ref: pathRef
    })));
  });
};