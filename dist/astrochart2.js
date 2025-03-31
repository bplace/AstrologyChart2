/*!
 * 
 *       astrochart2
 *       A JavaScript for generating Astrology charts.
 *       Version: 0.7.3
 *       Author: Tom Jurman (tomasjurman@kibo.cz)
 *       Licence: GNUv3 (https://www.gnu.org/licenses/gpl-3.0.en.html)
 *
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["astrology"] = factory();
	else
		root["astrology"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/charts/Chart.js":
/*!*****************************!*\
  !*** ./src/charts/Chart.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Chart)
/* harmony export */ });
/* harmony import */ var _utils_Utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/Utils.js */ "./src/utils/Utils.js");


/**
 * @class
 * @classdesc An abstract class for all type of Chart
 * @public
 * @hideconstructor
 * @abstract
 */
class Chart {

  //#settings

  /**
   * @constructs
   * @param {Object} settings
   */
  constructor(settings) {
    //this.#settings = settings
  }

  /**
   * Check if the data is valid
   * @throws {Error} - if the data is undefined.
   * @param {Object} data
   * @return {Object} - {isValid:boolean, message:String}
   */
  validateData(data) {
    if (!data) {
      throw new Error("Mising param data.")
    }

    if (!Array.isArray(data.points)) {
      return {
        isValid: false,
        message: "points is not Array."
      }
    }

    if (!Array.isArray(data.cusps)) {
      return {
        isValid: false,
        message: "cups is not Array."
      }
    }

    if (data.cusps.length !== 12) {
      return {
        isValid: false,
        message: "cusps.length !== 12"
      }
    }

    for (let point of data.points) {
      if (typeof point.name !== 'string') {
        return {
          isValid: false,
          message: "point.name !== 'string'"
        }
      }
      if (point.name.length === 0) {
        return {
          isValid: false,
          message: "point.name.length == 0"
        }
      }
      if (typeof point.angle !== 'number') {
        return {
          isValid: false,
          message: "point.angle !== 'number'"
        }
      }
    }

    for (let cusp of data.cusps) {
      if (typeof cusp.angle !== 'number') {
        return {
          isValid: false,
          message: "cusp.angle !== 'number'"
        }
      }
    }

    return {
      isValid: true,
      message: ""
    }
  }
  
  /**
   * @abstract
   */
  setData(data) {
    throw new Error("Must be implemented by subclass.");
  }

  /**
   * @abstract
   */
  getPoints() {
    throw new Error("Must be implemented by subclass.");
  }

  /**
   * @abstract
   */
  getPoint(name) {
    throw new Error("Must be implemented by subclass.");
  }

  /**
   * @abstract
   */
  animateTo(data) {
    throw new Error("Must be implemented by subclass.");
  }

  // ## PROTECTED ##############################

}




/***/ }),

/***/ "./src/charts/RadixChart.js":
/*!**********************************!*\
  !*** ./src/charts/RadixChart.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ RadixChart)
/* harmony export */ });
/* harmony import */ var _universe_Universe_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../universe/Universe.js */ "./src/universe/Universe.js");
/* harmony import */ var _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/SVGUtils.js */ "./src/utils/SVGUtils.js");
/* harmony import */ var _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/Utils.js */ "./src/utils/Utils.js");
/* harmony import */ var _utils_AspectUtils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/AspectUtils.js */ "./src/utils/AspectUtils.js");
/* harmony import */ var _Chart_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Chart.js */ "./src/charts/Chart.js");
/* harmony import */ var _points_Point_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../points/Point.js */ "./src/points/Point.js");
/* harmony import */ var _settings_DefaultSettings_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../settings/DefaultSettings.js */ "./src/settings/DefaultSettings.js");








/**
 * @class
 * @classdesc Points and cups are displayed inside the Universe.
 * @public
 * @extends {Chart}
 */
class RadixChart extends _Chart_js__WEBPACK_IMPORTED_MODULE_4__["default"] {

    /*
     * Levels determine the width of individual parts of the chart.
     * It can be changed dynamically by public setter.
     */
    #numberOfLevels = 24

    #universe
    #settings
    #root
    #data

    #centerX
    #centerY
    #radius

    /*
     * @see Utils.cleanUp()
     */
    #beforeCleanUpHook

    /**
     * @constructs
     * @param {Universe} Universe
     */
    constructor(universe) {

        if (! universe instanceof _universe_Universe_js__WEBPACK_IMPORTED_MODULE_0__["default"]) {
            throw new Error('Bad param universe.')
        }

        super(universe.getSettings())

        this.#universe = universe
        this.#settings = this.#universe.getSettings()
        this.#centerX = this.#settings.CHART_VIEWBOX_WIDTH / 2
        this.#centerY = this.#settings.CHART_VIEWBOX_HEIGHT / 2
        this.#radius = Math.min(this.#centerX, this.#centerY) - this.#settings.CHART_PADDING
        this.#root = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGGroup()
        this.#root.setAttribute("id", `${this.#settings.HTML_ELEMENT_ID}-${this.#settings.RADIX_ID}`)
        this.#universe.getSVGDocument().appendChild(this.#root);

        return this
    }

    /**
     * Set chart data
     * @throws {Error} - if the data is not valid.
     * @param {Object} data
     * @return {RadixChart}
     */
    setData(data) {
        let status = this.validateData(data)
        if (! status.isValid) {
            throw new Error(status.message)
        }

        this.#data = data
        this.#draw(data)

        return this
    }

    /**
     * Get data
     * @return {Object}
     */
    getData() {
        return {
            "points": [...this.#data.points],
            "cusps": [...this.#data.cusps]
        }
    }

    /**
     * Set number of Levels.
     * Levels determine the width of individual parts of the chart.
     *
     * @param {Number}
     */
    setNumberOfLevels(levels) {
        this.#numberOfLevels = Math.max(24, levels)
        if (this.#data) {
            this.#draw(this.#data)
        }

        return this
    }

    /**
     * Get radius
     * @return {Number}
     */
    getRadius() {
        return this.#radius
    }

    /**
     * Get radius
     * @return {Number}
     */
    getOuterCircleRadius() {
        return 24 * (this.getRadius() / this.#numberOfLevels)
    }

    /**
     * Get radius
     * @return {Number}
     */
    getInnerCircleRadius() {
        return 21 * (this.getRadius() / this.#numberOfLevels)
    }

    /**
     * Get radius
     * @return {Number}
     */
    getRullerCircleRadius() {
        return 20 * (this.getRadius() / this.#numberOfLevels)
    }

    /**
     * Get radius
     * @return {Number}
     */
    getPointCircleRadius() {
        return 18 * (this.getRadius() / this.#numberOfLevels)
    }

    /**
     * Get radius
     * @return {Number}
     */
    getCenterCircleRadius() {
        return 12 * (this.getRadius() / this.#numberOfLevels)
    }

    /**
     * Get Universe
     *
     * @return {Universe}
     */
    getUniverse() {
        return this.#universe
    }

    /**
     * Get Ascendat shift
     *
     * @return {Number}
     */
    getAscendantShift() {
        return (this.#data?.cusps[0]?.angle ?? 0) + _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].DEG_180
    }

    /**
     * Get aspects
     *
     * @param {Array<Object>} [fromPoints] - [{name:"Moon", angle:0}, {name:"Sun", angle:179}, {name:"Mercury", angle:121}]
     * @param {Array<Object>} [toPoints] - [{name:"AS", angle:0}, {name:"IC", angle:90}]
     * @param {Array<Object>} [aspects] - [{name:"Opposition", angle:180, orb:2}, {name:"Trine", angle:120, orb:2}]
     *
     * @return {Array<Object>}
     */
    getAspects(fromPoints, toPoints, aspects) {
        if (! this.#data) {
            return
        }

        fromPoints = fromPoints ?? this.#data.points.filter(x => "aspect" in x ? x.aspect : true)
        toPoints = toPoints ?? [...this.#data.points.filter(x => "aspect" in x ? x.aspect : true), ...this.#data.cusps.filter(x => x.aspect)]
        aspects = aspects ?? this.#settings.DEFAULT_ASPECTS ?? _settings_DefaultSettings_js__WEBPACK_IMPORTED_MODULE_6__["default"].DEFAULT_ASPECTS

        return _utils_AspectUtils_js__WEBPACK_IMPORTED_MODULE_3__["default"].getAspects(fromPoints, toPoints, aspects).filter(aspect => aspect.from.name != aspect.to.name)
    }

    /**
     * Draw aspects
     *
     * @param {Array<Object>} [fromPoints] - [{name:"Moon", angle:0}, {name:"Sun", angle:179}, {name:"Mercury", angle:121}]
     * @param {Array<Object>} [toPoints] - [{name:"AS", angle:0}, {name:"IC", angle:90}]
     * @param {Array<Object>} [aspects] - [{name:"Opposition", angle:180, orb:2}, {name:"Trine", angle:120, orb:2}]
     *
     * @return {Array<Object>}
     */
    drawAspects(fromPoints, toPoints, aspects) {
        const aspectsWrapper = this.#universe.getAspectsElement()
        _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].cleanUp(aspectsWrapper.getAttribute("id"), this.#beforeCleanUpHook)

        const aspectsList = this.getAspects(fromPoints, toPoints, aspects)
            .reduce((arr, aspect) => {

                let isTheSame = arr.some(elm => {
                    return elm.from.name == aspect.to.name && elm.to.name == aspect.from.name
                })

                if (! isTheSame) {
                    arr.push(aspect)
                }

                return arr
            }, [])
            .filter(aspect => aspect.aspect.name != 'Conjunction')

        const circle = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGCircle(this.#centerX, this.#centerY, this.getCenterCircleRadius())
        circle.setAttribute('fill', this.#settings.ASPECTS_BACKGROUND_COLOR)
        aspectsWrapper.appendChild(circle)

        aspectsWrapper.appendChild(_utils_AspectUtils_js__WEBPACK_IMPORTED_MODULE_3__["default"].drawAspects(this.getCenterCircleRadius(), this.getAscendantShift(), this.#settings, aspectsList))

        return this
    }

    // ## PRIVATE ##############################

    /*
     * Draw radix chart
     * @param {Object} data
     */
    #draw(data) {
        _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].cleanUp(this.#root.getAttribute('id'), this.#beforeCleanUpHook)
        this.#drawBackground()
        this.#drawAstrologicalSigns()
        this.#drawPoints(data)
        this.#drawCusps(data)
        this.#drawRuler()
        this.#drawBorders()
        this.#settings.CHART_DRAW_MAIN_AXIS && this.#drawMainAxisDescription(data)
        this.#settings.DRAW_ASPECTS && this.drawAspects()
    }

    #drawBackground() {
        const MASK_ID = `${this.#settings.HTML_ELEMENT_ID}-${this.#settings.RADIX_ID}-background-mask-1`

        const wrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGGroup()

        const mask = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGMask(MASK_ID)
        const outerCircle = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGCircle(this.#centerX, this.#centerY, this.getRadius())
        outerCircle.setAttribute('fill', "white")
        mask.appendChild(outerCircle)

        const innerCircle = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGCircle(this.#centerX, this.#centerY, this.getCenterCircleRadius())
        innerCircle.setAttribute('fill', "black")
        mask.appendChild(innerCircle)
        wrapper.appendChild(mask)

        const circle = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGCircle(this.#centerX, this.#centerY, this.getRadius())
        circle.setAttribute("fill", this.#settings.CHART_STROKE_ONLY ? "none" : this.#settings.PLANETS_BACKGROUND_COLOR);
        circle.setAttribute("mask", this.#settings.CHART_STROKE_ONLY ? "none" : `url(#${MASK_ID})`);
        wrapper.appendChild(circle)

        this.#root.appendChild(wrapper)
    }

    #drawAstrologicalSigns() {
        const NUMBER_OF_ASTROLOGICAL_SIGNS = 12
        const STEP = 30 //degree
        const COLORS_SIGNS = [this.#settings.COLOR_ARIES, this.#settings.COLOR_TAURUS, this.#settings.COLOR_GEMINI, this.#settings.COLOR_CANCER, this.#settings.COLOR_LEO, this.#settings.COLOR_VIRGO, this.#settings.COLOR_LIBRA, this.#settings.COLOR_SCORPIO, this.#settings.COLOR_SAGITTARIUS, this.#settings.COLOR_CAPRICORN, this.#settings.COLOR_AQUARIUS, this.#settings.COLOR_PISCES]
        const SYMBOL_SIGNS = [_utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_ARIES, _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_TAURUS, _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_GEMINI, _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_CANCER, _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_LEO, _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_VIRGO, _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_LIBRA, _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_SCORPIO, _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_SAGITTARIUS, _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_CAPRICORN, _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_AQUARIUS, _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_PISCES]

        const makeSymbol = (symbolIndex, angleInDegree) => {
            let position = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].positionOnCircle(this.#centerX, this.#centerY, this.getOuterCircleRadius() - ((this.getOuterCircleRadius() - this.getInnerCircleRadius()) / 2), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(angleInDegree + STEP / 2, this.getAscendantShift()))

            let symbol = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGSymbol(SYMBOL_SIGNS[symbolIndex], position.x, position.y)
            symbol.setAttribute("font-family", this.#settings.CHART_FONT_FAMILY);
            symbol.setAttribute("text-anchor", "middle") // start, middle, end
            symbol.setAttribute("dominant-baseline", "middle")
            symbol.setAttribute("font-size", this.#settings.RADIX_SIGNS_FONT_SIZE);
            symbol.setAttribute("fill", this.#settings.SIGN_COLORS[symbolIndex] ?? this.#settings.CHART_SIGNS_COLOR);

            if (this.#settings.CLASS_SIGN) {
                symbol.setAttribute('class', this.#settings.CLASS_SIGN + ' ' + this.#settings.CLASS_SIGN + SYMBOL_SIGNS[symbolIndex].toLowerCase());
            }

            return symbol
        }

        const makeSegment = (symbolIndex, angleFromInDegree, angleToInDegree) => {
            let a1 = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(angleFromInDegree, this.getAscendantShift())
            let a2 = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(angleToInDegree, this.getAscendantShift())
            let segment = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGSegment(this.#centerX, this.#centerY, this.getOuterCircleRadius(), a1, a2, this.getInnerCircleRadius());

            if (this.#settings.CHART_STROKE_WITH_COLOR) {
                segment.setAttribute("fill", COLORS_SIGNS[symbolIndex]);
                segment.setAttribute("stroke", this.#settings.CIRCLE_COLOR);
                segment.setAttribute("stroke-width", this.#settings.CHART_STROKE);
            } else {
                segment.setAttribute("fill", this.#settings.CHART_STROKE_ONLY ? "none" : COLORS_SIGNS[symbolIndex]);
                segment.setAttribute("stroke", this.#settings.CHART_STROKE_ONLY ? this.#settings.CIRCLE_COLOR : "none");
                segment.setAttribute("stroke-width", this.#settings.CHART_STROKE_ONLY ? this.#settings.CHART_STROKE : 0);
            }

            if (this.#settings.CLASS_SIGN_SEGMENT) {
                segment.setAttribute('class', this.#settings.CLASS_SIGN_SEGMENT + ' ' + this.#settings.CLASS_SIGN_SEGMENT + SYMBOL_SIGNS[symbolIndex].toLowerCase());
            }

            return segment
        }

        let startAngle = 0
        let endAngle = startAngle + STEP

        const wrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGGroup()

        for (let i = 0; i < NUMBER_OF_ASTROLOGICAL_SIGNS; i++) {

            let segment = makeSegment(i, startAngle, endAngle)
            wrapper.appendChild(segment);

            let symbol = makeSymbol(i, startAngle)
            wrapper.appendChild(symbol);

            startAngle += STEP;
            endAngle = startAngle + STEP
        }

        this.#root.appendChild(wrapper)
    }

    #drawRuler() {
        const NUMBER_OF_DIVIDERS = 72
        const STEP = 5

        const wrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGGroup()

        let startAngle = this.getAscendantShift()
        for (let i = 0; i < NUMBER_OF_DIVIDERS; i++) {
            let startPoint = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].positionOnCircle(this.#centerX, this.#centerY, this.getRullerCircleRadius(), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(startAngle))
            let endPoint = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].positionOnCircle(this.#centerX, this.#centerY, (i % 2) ? this.getInnerCircleRadius() - ((this.getInnerCircleRadius() - this.getRullerCircleRadius()) / 2) : this.getInnerCircleRadius(), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(startAngle))
            const line = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGLine(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
            line.setAttribute("stroke", this.#settings.CHART_LINE_COLOR);
            line.setAttribute("stroke-width", this.#settings.CHART_STROKE);
            wrapper.appendChild(line);

            startAngle += STEP
        }

        const circle = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGCircle(this.#centerX, this.#centerY, this.getRullerCircleRadius());
        circle.setAttribute("stroke", this.#settings.CHART_CIRCLE_COLOR);
        circle.setAttribute("stroke-width", this.#settings.CHART_STROKE);
        wrapper.appendChild(circle);

        this.#root.appendChild(wrapper)
    }

    /*
     * Draw points
     * @param {Object} data - chart data
     */
    #drawPoints(data) {
        const points = data.points
        const cusps = data.cusps

        const wrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGGroup()

        const positions = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].calculatePositionWithoutOverlapping(points, this.#settings.POINT_COLLISION_RADIUS, this.getPointCircleRadius())

        for (const pointData of points) {
            const point = new _points_Point_js__WEBPACK_IMPORTED_MODULE_5__["default"](pointData, cusps, this.#settings)
            const pointPosition = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].positionOnCircle(this.#centerX, this.#centerX, this.getRullerCircleRadius() - ((this.getInnerCircleRadius() - this.getRullerCircleRadius()) / 4), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(point.getAngle(), this.getAscendantShift()))
            const symbolPosition = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].positionOnCircle(this.#centerX, this.#centerX, this.getPointCircleRadius(), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(positions[point.getName()], this.getAscendantShift()))

            // ruler mark
            const rulerLineEndPosition = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].positionOnCircle(this.#centerX, this.#centerX, this.getRullerCircleRadius(), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(point.getAngle(), this.getAscendantShift()))

            if (this.#settings.DRAW_RULER_MARK) {
                const rulerLine = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGLine(pointPosition.x, pointPosition.y, rulerLineEndPosition.x, rulerLineEndPosition.y)
                rulerLine.setAttribute("stroke", this.#settings.CHART_LINE_COLOR);
                rulerLine.setAttribute("stroke-width", this.#settings.CHART_STROKE);
                wrapper.appendChild(rulerLine);
            }

            // symbol
            const symbol = point.getSymbol(symbolPosition.x, symbolPosition.y, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].DEG_0, this.#settings.POINT_PROPERTIES_SHOW)
            symbol.setAttribute("font-family", this.#settings.CHART_FONT_FAMILY);
            symbol.setAttribute("text-anchor", "middle") // start, middle, end
            symbol.setAttribute("dominant-baseline", "middle")
            symbol.setAttribute("font-size", this.#settings.RADIX_POINTS_FONT_SIZE)
            symbol.setAttribute("fill", this.#settings.PLANET_COLORS[pointData.name] ?? this.#settings.CHART_POINTS_COLOR)
            wrapper.appendChild(symbol);

            // pointer
            //if (positions[point.getName()] != pointData.position) {
            const pointerLineEndPosition = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].positionOnCircle(this.#centerX, this.#centerX, this.getPointCircleRadius(), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(positions[point.getName()], this.getAscendantShift()))

            let pointerLine;
            if (this.#settings.DRAW_RULER_MARK) {
                pointerLine = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGLine(pointPosition.x, pointPosition.y, (pointPosition.x + pointerLineEndPosition.x) / 2, (pointPosition.y + pointerLineEndPosition.y) / 2)
            } else {
                pointerLine = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGLine(rulerLineEndPosition.x, rulerLineEndPosition.y, (pointPosition.x + pointerLineEndPosition.x) / 2, (pointPosition.y + pointerLineEndPosition.y) / 2)
            }


            if (this.#settings.PLANET_LINE_USE_PLANET_COLOR) {
                pointerLine.setAttribute("stroke", this.#settings.PLANET_COLORS[pointData.name] ?? this.#settings.CHART_LINE_COLOR);
            } else {
                pointerLine.setAttribute("stroke", this.#settings.CHART_LINE_COLOR);
            }

            pointerLine.setAttribute("stroke-width", this.#settings.CHART_STROKE / 2);

            wrapper.appendChild(pointerLine);
        }

        this.#root.appendChild(wrapper)
    }

    /*
     * Draw points
     * @param {Object} data - chart data
     */
    #drawCusps(data) {
        const points = data.points
        const cusps = data.cusps

        const mainAxisIndexes = [0, 3, 6, 9] //As, Ic, Ds, Mc

        const pointsPositions = points.map(point => {
            return point.angle
        })

        const wrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGGroup()

        const textRadius = this.getCenterCircleRadius() + ((this.getInnerCircleRadius() - this.getCenterCircleRadius()) / 10)

        for (let i = 0; i < cusps.length; i++) {

            const isLineInCollisionWithPoint = ! this.#settings.CHART_ALLOW_HOUSE_OVERLAP && _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].isCollision(cusps[i].angle, pointsPositions, this.#settings.POINT_COLLISION_RADIUS / 2)

            const startPos = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].positionOnCircle(this.#centerX, this.#centerY, this.getCenterCircleRadius(), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(cusps[i].angle, this.getAscendantShift()))
            const endPos = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].positionOnCircle(this.#centerX, this.#centerY, isLineInCollisionWithPoint ? this.getCenterCircleRadius() + ((this.getRullerCircleRadius() - this.getCenterCircleRadius()) / 6) : this.getRullerCircleRadius(), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(cusps[i].angle, this.getAscendantShift()))

            const line = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGLine(startPos.x, startPos.y, endPos.x, endPos.y)
            line.setAttribute("stroke", mainAxisIndexes.includes(i) ? this.#settings.CHART_MAIN_AXIS_COLOR : this.#settings.CHART_LINE_COLOR)
            line.setAttribute("stroke-width", mainAxisIndexes.includes(i) ? this.#settings.CHART_MAIN_STROKE : this.#settings.CHART_STROKE)
            wrapper.appendChild(line);

            const startCusp = cusps[i].angle
            const endCusp = cusps[(i + 1) % 12].angle
            const gap = endCusp - startCusp > 0 ? endCusp - startCusp : endCusp - startCusp + _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].DEG_360
            const textAngle = startCusp + gap / 2

            const textPos = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].positionOnCircle(this.#centerX, this.#centerY, textRadius, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(textAngle, this.getAscendantShift()))
            const text = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGText(textPos.x, textPos.y, `${i + 1}`)
            text.setAttribute("font-family", this.#settings.CHART_FONT_FAMILY)
            text.setAttribute("text-anchor", "middle") // start, middle, end
            text.setAttribute("dominant-baseline", "middle")
            text.setAttribute("font-size", this.#settings.RADIX_HOUSE_FONT_SIZE)
            text.setAttribute("fill", this.#settings.CHART_HOUSE_NUMBER_COLOR)
            wrapper.appendChild(text)

            if (this.#settings.DRAW_HOUSE_DEGREE) {
                if (Array.isArray(this.#settings.HOUSE_DEGREE_FILTER) && ! this.#settings.HOUSE_DEGREE_FILTER.includes(i + 1)) {
                    continue;
                }
                const degreePos = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].positionOnCircle(this.#centerX, this.#centerY, this.getRullerCircleRadius() - (this.getInnerCircleRadius() - this.getRullerCircleRadius()) / 1.2, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(startCusp - 2.4, this.getAscendantShift()))
                const degree = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGText(degreePos.x, degreePos.y, Math.floor(cusps[i].angle % 30) + "º")
                degree.setAttribute("font-family", "Arial")
                degree.setAttribute("text-anchor", "middle") // start, middle, end
                degree.setAttribute("dominant-baseline", "middle")
                degree.setAttribute("font-size", this.#settings.HOUSE_DEGREE_SIZE || this.#settings.POINT_PROPERTIES_ANGLE_SIZE / 2)
                degree.setAttribute("fill", this.#settings.HOUSE_DEGREE_COLOR || this.#settings.CHART_HOUSE_NUMBER_COLOR)
                wrapper.appendChild(degree)
            }
        }

        this.#root.appendChild(wrapper)
    }

    /*
     * Draw main axis descrition
     * @param {Array} axisList
     */
    #drawMainAxisDescription(data) {
        const AXIS_LENGTH = 10
        const cusps = data.cusps

        const axisList = [{
            name: _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_AS,
            angle: cusps[0].angle
        },
            {
                name: _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_IC,
                angle: cusps[3].angle
            },
            {
                name: _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_DS,
                angle: cusps[6].angle
            },
            {
                name: _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_MC,
                angle: cusps[9].angle
            },
        ]

        const wrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGGroup()

        const rad1 = this.#numberOfLevels === 24 ? this.getRadius() : this.getInnerCircleRadius();
        const rad2 = this.#numberOfLevels === 24 ? this.getRadius() + AXIS_LENGTH : this.getInnerCircleRadius() + AXIS_LENGTH / 2;

        for (const axis of axisList) {
            let startPoint = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].positionOnCircle(this.#centerX, this.#centerY, rad1, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(axis.angle, this.getAscendantShift()))
            let endPoint = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].positionOnCircle(this.#centerX, this.#centerY, rad2, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(axis.angle, this.getAscendantShift()))
            let line = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGLine(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
            line.setAttribute("stroke", this.#settings.CHART_MAIN_AXIS_COLOR);
            line.setAttribute("stroke-width", this.#settings.CHART_MAIN_STROKE);
            wrapper.appendChild(line);

            let textPoint = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].positionOnCircle(this.#centerX, this.#centerY, rad2, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(axis.angle, this.getAscendantShift()))
            let symbol;
            let SHIFT_X = 0;
            let SHIFT_Y = 0;
            const STEP = 2
            switch (axis.name) {
                case "As":
                    SHIFT_X -= STEP
                    SHIFT_Y -= STEP
                    symbol = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGSymbol(axis.name, textPoint.x + SHIFT_X, textPoint.y + SHIFT_Y)
                    symbol.setAttribute("text-anchor", "end")
                    symbol.setAttribute("dominant-baseline", "middle")
                    break;
                case "Ds":
                    SHIFT_X += STEP
                    SHIFT_Y -= STEP
                    symbol = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGSymbol(axis.name, textPoint.x + SHIFT_X, textPoint.y + SHIFT_Y)
                    symbol.setAttribute("text-anchor", "start")
                    symbol.setAttribute("dominant-baseline", "middle")
                    break;
                case "Mc":
                    SHIFT_Y -= STEP
                    symbol = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGSymbol(axis.name, textPoint.x + SHIFT_X, textPoint.y + SHIFT_Y)
                    symbol.setAttribute("text-anchor", "middle")
                    symbol.setAttribute("dominant-baseline", "text-top")
                    break;
                case "Ic":
                    SHIFT_Y += STEP
                    symbol = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGSymbol(axis.name, textPoint.x + SHIFT_X, textPoint.y + SHIFT_Y)
                    symbol.setAttribute("text-anchor", "middle")
                    symbol.setAttribute("dominant-baseline", "hanging")
                    break;
                default:
                    console.error(axis.name)
                    throw new Error("Unknown axis name.")
            }
            symbol.setAttribute("font-family", this.#settings.CHART_FONT_FAMILY);
            symbol.setAttribute("font-size", this.#settings.RADIX_AXIS_FONT_SIZE);
            symbol.setAttribute("fill", this.#settings.CHART_MAIN_AXIS_COLOR);

            if (this.#settings.CLASS_AXIS) {
                symbol.setAttribute('class', this.#settings.CLASS_AXIS + ' ' + this.#settings.CLASS_AXIS + axis.name.toLowerCase());
            }

            wrapper.appendChild(symbol);
        }

        this.#root.appendChild(wrapper)
    }

    #drawBorders() {
        const wrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGGroup()

        const outerCircle = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGCircle(this.#centerX, this.#centerY, this.getOuterCircleRadius())
        outerCircle.setAttribute("stroke", this.#settings.CHART_CIRCLE_COLOR);
        outerCircle.setAttribute("stroke-width", this.#settings.CHART_MAIN_STROKE);
        wrapper.appendChild(outerCircle)

        const innerCircle = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGCircle(this.#centerX, this.#centerY, this.getInnerCircleRadius())
        innerCircle.setAttribute("stroke", this.#settings.CHART_CIRCLE_COLOR);
        innerCircle.setAttribute("stroke-width", this.#settings.CHART_MAIN_STROKE);
        wrapper.appendChild(innerCircle)

        const centerCircle = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGCircle(this.#centerX, this.#centerY, this.getCenterCircleRadius())
        centerCircle.setAttribute("stroke", this.#settings.CHART_CIRCLE_COLOR);
        centerCircle.setAttribute("stroke-width", this.#settings.CHART_MAIN_STROKE);
        wrapper.appendChild(centerCircle)

        this.#root.appendChild(wrapper)
    }
}




/***/ }),

/***/ "./src/charts/TransitChart.js":
/*!************************************!*\
  !*** ./src/charts/TransitChart.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TransitChart)
/* harmony export */ });
/* harmony import */ var _charts_RadixChart_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../charts/RadixChart.js */ "./src/charts/RadixChart.js");
/* harmony import */ var _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/SVGUtils.js */ "./src/utils/SVGUtils.js");
/* harmony import */ var _Chart_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Chart.js */ "./src/charts/Chart.js");
/* harmony import */ var _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/Utils.js */ "./src/utils/Utils.js");
/* harmony import */ var _utils_AspectUtils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/AspectUtils.js */ "./src/utils/AspectUtils.js");
/* harmony import */ var _points_Point_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../points/Point.js */ "./src/points/Point.js");
/* harmony import */ var _settings_DefaultSettings_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../settings/DefaultSettings.js */ "./src/settings/DefaultSettings.js");








/**
 * @class
 * @classdesc Points and cups are displayed from outside the Universe.
 * @public
 * @extends {Chart}
 */
class TransitChart extends _Chart_js__WEBPACK_IMPORTED_MODULE_2__["default"] {

  /*
   * Levels determine the width of individual parts of the chart.
   * It can be changed dynamically by public setter.
   */
  #numberOfLevels = 32

  #radix
  #settings
  #root
  #data

  #centerX
  #centerY
  #radius

  /*
   * @see Utils.cleanUp()
   */
  #beforeCleanUpHook

  /**
   * @constructs
   * @param {RadixChart} radix
   */
  constructor(radix) {
    if (!(radix instanceof _charts_RadixChart_js__WEBPACK_IMPORTED_MODULE_0__["default"])) {
      throw new Error('Bad param radix.')
    }

    super(radix.getUniverse().getSettings())

    this.#radix = radix
    this.#settings = this.#radix.getUniverse().getSettings()
    this.#centerX = this.#settings.CHART_VIEWBOX_WIDTH / 2
    this.#centerY = this.#settings.CHART_VIEWBOX_HEIGHT / 2
    this.#radius = Math.min(this.#centerX, this.#centerY) - this.#settings.CHART_PADDING

    this.#root = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGGroup()
    this.#root.setAttribute("id", `${this.#settings.HTML_ELEMENT_ID}-${this.#settings.TRANSIT_ID}`)
    this.#radix.getUniverse().getSVGDocument().appendChild(this.#root);

    return this
  }

  /**
   * Set chart data
   * @throws {Error} - if the data is not valid.
   * @param {Object} data
   * @return {RadixChart}
   */
  setData(data) {
    let status = this.validateData(data)
    if (!status.isValid) {
      throw new Error(status.message)
    }

    this.#data = data
    this.#draw(data)

    return this
  }

  /**
   * Get data
   * @return {Object}
   */
  getData(){
    return {
      "points":[...this.#data.points],
      "cusps":[...this.#data.cusps]
    }
  }

  /**
   * Get radius
   *
   * @param {Number}
   */
  getRadius() {
    return this.#radius
  }

  /**
   * Get aspects
   *
   * @param {Array<Object>} [fromPoints] - [{name:"Moon", angle:0}, {name:"Sun", angle:179}, {name:"Mercury", angle:121}]
   * @param {Array<Object>} [toPoints] - [{name:"AS", angle:0}, {name:"IC", angle:90}]
   * @param {Array<Object>} [aspects] - [{name:"Opposition", angle:180, orb:2}, {name:"Trine", angle:120, orb:2}]
   *
   * @return {Array<Object>}
   */
  getAspects(fromPoints, toPoints, aspects){
    if(!this.#data){
      return
    }

    fromPoints = fromPoints ?? [...this.#data.points.filter(x => "aspect" in x ? x.aspect : true), ...this.#data.cusps.filter(x => x.aspect)]
    toPoints = toPoints ?? [...this.#radix.getData().points.filter(x => "aspect" in x ? x.aspect : true), ...this.#radix.getData().cusps.filter(x => x.aspect)]
    aspects = aspects ?? this.#settings.DEFAULT_ASPECTS ?? _settings_DefaultSettings_js__WEBPACK_IMPORTED_MODULE_6__["default"].DEFAULT_ASPECTS

    return _utils_AspectUtils_js__WEBPACK_IMPORTED_MODULE_4__["default"].getAspects(fromPoints, toPoints, aspects)
  }

  /**
   * Draw aspects
   *
   * @param {Array<Object>} [fromPoints] - [{name:"Moon", angle:0}, {name:"Sun", angle:179}, {name:"Mercury", angle:121}]
   * @param {Array<Object>} [toPoints] - [{name:"AS", angle:0}, {name:"IC", angle:90}]
   * @param {Array<Object>} [aspects] - [{name:"Opposition", angle:180, orb:2}, {name:"Trine", angle:120, orb:2}]
   *
   * @return {Array<Object>}
   */
  drawAspects( fromPoints, toPoints, aspects ){
    const aspectsWrapper = this.#radix.getUniverse().getAspectsElement()
    _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].cleanUp(aspectsWrapper.getAttribute("id"), this.#beforeCleanUpHook)

    const aspectsList = this.getAspects(fromPoints, toPoints, aspects)
      .filter( aspect =>  aspect.aspect.name != 'Conjunction')

    const circle = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGCircle(this.#centerX, this.#centerY, this.#radix.getCenterCircleRadius())
    circle.setAttribute('fill', this.#settings.ASPECTS_BACKGROUND_COLOR)
    aspectsWrapper.appendChild(circle)
    
    aspectsWrapper.appendChild( _utils_AspectUtils_js__WEBPACK_IMPORTED_MODULE_4__["default"].drawAspects(this.#radix.getCenterCircleRadius(), this.#radix.getAscendantShift(), this.#settings, aspectsList))

    return this
  }

  // ## PRIVATE ##############################

  /*
   * Draw radix chart
   * @param {Object} data
   */
  #draw(data) {

    // radix reDraw
    _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].cleanUp(this.#root.getAttribute('id'), this.#beforeCleanUpHook)
    this.#radix.setNumberOfLevels(this.#numberOfLevels)

    this.#drawRuler()
    this.#drawCusps(data)
    this.#settings.CHART_DRAW_MAIN_AXIS && this.#drawMainAxisDescription(data)
    this.#drawPoints(data)
    this.#drawBorders()
    this.#settings.DRAW_ASPECTS && this.drawAspects()
  }

  #drawRuler() {
    const NUMBER_OF_DIVIDERS = 72
    const STEP = 5

    const wrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGGroup()

    let startAngle = this.#radix.getAscendantShift()
    for (let i = 0; i < NUMBER_OF_DIVIDERS; i++) {
      let startPoint = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].positionOnCircle(this.#centerX, this.#centerY, this.#getRullerCircleRadius(), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].degreeToRadian(startAngle))
      let endPoint = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].positionOnCircle(this.#centerX, this.#centerY, (i % 2) ? this.getRadius() - ((this.getRadius() - this.#getRullerCircleRadius()) / 2) : this.getRadius(), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].degreeToRadian(startAngle))
      const line = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGLine(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
      line.setAttribute("stroke", this.#settings.CHART_LINE_COLOR);
      line.setAttribute("stroke-width", this.#settings.CHART_STROKE);
      wrapper.appendChild(line);

      startAngle += STEP
    }

    const circle = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGCircle(this.#centerX, this.#centerY, this.#getRullerCircleRadius());
    circle.setAttribute("stroke", this.#settings.CHART_CIRCLE_COLOR);
    circle.setAttribute("stroke-width", this.#settings.CHART_STROKE);
    wrapper.appendChild(circle);

    this.#root.appendChild(wrapper)
  }

  /*
   * Draw points
   * @param {Object} data - chart data
   */
  #drawPoints(data) {
    const points = data.points
    const cusps = data.cusps

    const wrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGGroup()

    const positions = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].calculatePositionWithoutOverlapping(points, this.#settings.POINT_COLLISION_RADIUS, this.#getPointCircleRadius())
    for (const pointData of points) {
      const point = new _points_Point_js__WEBPACK_IMPORTED_MODULE_5__["default"](pointData, cusps, this.#settings)
      const pointPosition = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].positionOnCircle(this.#centerX, this.#centerX, this.#getRullerCircleRadius() - ((this.getRadius() - this.#getRullerCircleRadius()) / 4), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].degreeToRadian(point.getAngle(), this.#radix.getAscendantShift()))
      const symbolPosition = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].positionOnCircle(this.#centerX, this.#centerX, this.#getPointCircleRadius(), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].degreeToRadian(positions[point.getName()], this.#radix.getAscendantShift()))

      // ruler mark
      const rulerLineEndPosition = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].positionOnCircle(this.#centerX, this.#centerX, this.#getRullerCircleRadius(), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].degreeToRadian(point.getAngle(), this.#radix.getAscendantShift()))
      const rulerLine = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGLine(pointPosition.x, pointPosition.y, rulerLineEndPosition.x, rulerLineEndPosition.y)
      rulerLine.setAttribute("stroke", this.#settings.CHART_LINE_COLOR);
      rulerLine.setAttribute("stroke-width", this.#settings.CHART_STROKE);
      wrapper.appendChild(rulerLine);

      // symbol
      const symbol = point.getSymbol(symbolPosition.x, symbolPosition.y, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].DEG_0, this.#settings.POINT_PROPERTIES_SHOW)
      symbol.setAttribute("font-family", this.#settings.CHART_FONT_FAMILY);
      symbol.setAttribute("text-anchor", "middle") // start, middle, end
      symbol.setAttribute("dominant-baseline", "middle")
      symbol.setAttribute("font-size", this.#settings.TRANSIT_POINTS_FONT_SIZE)
      symbol.setAttribute("fill", this.#settings.TRANSIT_PLANET_COLORS[pointData.name] ?? this.#settings.PLANET_COLORS[pointData.name] ?? this.#settings.CHART_POINTS_COLOR)
      wrapper.appendChild(symbol);

      // pointer
      //if (positions[point.getName()] != pointData.position) {
      const pointerLineEndPosition = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].positionOnCircle(this.#centerX, this.#centerX, this.#getPointCircleRadius(), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].degreeToRadian(positions[point.getName()], this.#radix.getAscendantShift()))
      const pointerLine = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGLine(pointPosition.x, pointPosition.y, (pointPosition.x + pointerLineEndPosition.x) / 2, (pointPosition.y + pointerLineEndPosition.y) / 2)
      pointerLine.setAttribute("stroke", this.#settings.CHART_LINE_COLOR);
      pointerLine.setAttribute("stroke-width", this.#settings.CHART_STROKE / 2);
      wrapper.appendChild(pointerLine);
    }

    this.#root.appendChild(wrapper)
  }

  /*
   * Draw points
   * @param {Object} data - chart data
   */
  #drawCusps(data) {
    const points = data.points
    const cusps = data.cusps

    const pointsPositions = points.map(point => {
      return point.angle
    })

    const wrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGGroup()

    const textRadius = this.#getCenterCircleRadius() + ((this.#getRullerCircleRadius() - this.#getCenterCircleRadius()) / 6)

    for (let i = 0; i < cusps.length; i++) {
      const isLineInCollisionWithPoint = !this.#settings.CHART_ALLOW_HOUSE_OVERLAP && _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].isCollision(cusps[i].angle, pointsPositions, this.#settings.POINT_COLLISION_RADIUS / 2)

      const startPos = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].positionOnCircle(this.#centerX, this.#centerY, this.#getCenterCircleRadius(), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].degreeToRadian(cusps[i].angle, this.#radix.getAscendantShift()))
      const endPos = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].positionOnCircle(this.#centerX, this.#centerY, isLineInCollisionWithPoint ? this.#getCenterCircleRadius() + ((this.#getRullerCircleRadius() - this.#getCenterCircleRadius()) / 6) : this.#getRullerCircleRadius(), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].degreeToRadian(cusps[i].angle, this.#radix.getAscendantShift()))

      const line = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGLine(startPos.x, startPos.y, endPos.x, endPos.y)
      line.setAttribute("stroke", this.#settings.CHART_LINE_COLOR)
      line.setAttribute("stroke-width", this.#settings.CHART_STROKE)
      wrapper.appendChild(line);

      const startCusp = cusps[i].angle
      const endCusp = cusps[(i + 1) % 12].angle
      const gap = endCusp - startCusp > 0 ? endCusp - startCusp : endCusp - startCusp + _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].DEG_360
      const textAngle = startCusp + gap / 2

      const textPos = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].positionOnCircle(this.#centerX, this.#centerY, textRadius, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].degreeToRadian(textAngle, this.#radix.getAscendantShift()))
      const text = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGText(textPos.x, textPos.y, `${i+1}`)
      text.setAttribute("font-family", this.#settings.CHART_FONT_FAMILY)
      text.setAttribute("text-anchor", "middle") // start, middle, end
      text.setAttribute("dominant-baseline", "middle")
      text.setAttribute("font-size", this.#settings.RADIX_HOUSE_FONT_SIZE)
      text.setAttribute("fill", this.#settings.TRANSIT_HOUSE_NUMBER_COLOR || this.#settings.CHART_HOUSE_NUMBER_COLOR)
      wrapper.appendChild(text)

      if(this.#settings.DRAW_HOUSE_DEGREE) {
        if(Array.isArray(this.#settings.HOUSE_DEGREE_FILTER) && !this.#settings.HOUSE_DEGREE_FILTER.includes(i+1)) {
          continue;
        }
        const degreePos = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].positionOnCircle(this.#centerX, this.#centerY, this.#getRullerCircleRadius() - (this.getRadius() - this.#getRullerCircleRadius()), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].degreeToRadian(startCusp - 1.75, this.#radix.getAscendantShift()))
        const degree = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGText(degreePos.x, degreePos.y, Math.floor(cusps[i].angle % 30) + "º")
        degree.setAttribute("font-family", "Arial")
        degree.setAttribute("text-anchor", "middle") // start, middle, end
        degree.setAttribute("dominant-baseline", "middle")
        degree.setAttribute("font-size", this.#settings.HOUSE_DEGREE_SIZE || this.#settings.POINT_PROPERTIES_ANGLE_SIZE / 2)
        degree.setAttribute("fill", this.#settings.HOUSE_DEGREE_COLOR || this.#settings.TRANSIT_HOUSE_NUMBER_COLOR || this.#settings.CHART_HOUSE_NUMBER_COLOR)
        wrapper.appendChild(degree)
      }
    }

    this.#root.appendChild(wrapper)
  }

  /*
   * Draw main axis descrition
   * @param {Array} axisList
   */
  #drawMainAxisDescription(data) {
    const AXIS_LENGTH = 10
    const cusps = data.cusps

    const axisList = [{
        name: _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_AS,
        angle: cusps[0].angle
      },
      {
        name: _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_IC,
        angle: cusps[3].angle
      },
      {
        name: _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_DS,
        angle: cusps[6].angle
      },
      {
        name: _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_MC,
        angle: cusps[9].angle
      },
    ]

    const wrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGGroup()

    const rad1 = this.getRadius();
    const rad2 = this.getRadius() + AXIS_LENGTH;

    for (const axis of axisList) {
      let startPoint = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].positionOnCircle(this.#centerX, this.#centerY, rad1, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].degreeToRadian(axis.angle, this.#radix.getAscendantShift()))
      let endPoint = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].positionOnCircle(this.#centerX, this.#centerY, rad2, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].degreeToRadian(axis.angle, this.#radix.getAscendantShift()))
      let line = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGLine(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
      line.setAttribute("stroke", this.#settings.CHART_MAIN_AXIS_COLOR);
      line.setAttribute("stroke-width", this.#settings.CHART_MAIN_STROKE);
      wrapper.appendChild(line);

      let textPoint = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].positionOnCircle(this.#centerX, this.#centerY, rad2 + AXIS_LENGTH + 2, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].degreeToRadian(axis.angle, this.#radix.getAscendantShift()))
      let symbol;
      switch (axis.name) {
        case "As":
          symbol = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGSymbol(axis.name, textPoint.x, textPoint.y)
          symbol.setAttribute("text-anchor", "middle")
          symbol.setAttribute("dominant-baseline", "middle")
          break;
        case "Ds":
          symbol = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGSymbol(axis.name, textPoint.x, textPoint.y)
          symbol.setAttribute("text-anchor", "middle")
          symbol.setAttribute("dominant-baseline", "middle")
          break;
        case "Mc":
          symbol = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGSymbol(axis.name, textPoint.x, textPoint.y)
          symbol.setAttribute("text-anchor", "middle")
          symbol.setAttribute("dominant-baseline", "middle")
          break;
        case "Ic":
          symbol = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGSymbol(axis.name, textPoint.x, textPoint.y)
          symbol.setAttribute("text-anchor", "middle")
          symbol.setAttribute("dominant-baseline", "middle")
          break;
        default:
          console.error(axis.name)
          throw new Error("Unknown axis name.")
      }
      symbol.setAttribute("font-family", this.#settings.CHART_FONT_FAMILY);
      symbol.setAttribute("font-size", this.#settings.RADIX_AXIS_FONT_SIZE);
      symbol.setAttribute("fill", this.#settings.CHART_MAIN_AXIS_COLOR);

      wrapper.appendChild(symbol);
    }

    this.#root.appendChild(wrapper)
  }

  #drawBorders() {
    const wrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGGroup()

    const outerCircle = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGCircle(this.#centerX, this.#centerY, this.getRadius())
    outerCircle.setAttribute("stroke", this.#settings.CHART_CIRCLE_COLOR);
    outerCircle.setAttribute("stroke-width", this.#settings.CHART_MAIN_STROKE);
    wrapper.appendChild(outerCircle)

    this.#root.appendChild(wrapper)
  }

  #getPointCircleRadius() {
    return 29 * (this.getRadius() / this.#numberOfLevels)
  }

  #getRullerCircleRadius() {
    return 31 * (this.getRadius() / this.#numberOfLevels)
  }

  #getCenterCircleRadius() {
    return 24 * (this.getRadius() / this.#numberOfLevels)
  }

}




/***/ }),

/***/ "./src/points/Point.js":
/*!*****************************!*\
  !*** ./src/points/Point.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Point)
/* harmony export */ });
/* harmony import */ var _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/SVGUtils.js */ "./src/utils/SVGUtils.js");
/* harmony import */ var _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/Utils.js */ "./src/utils/Utils.js");



/**
 * @class
 * @classdesc Represents a planet or point of interest in the chart
 * @public
 */
class Point {

    #name
    #angle
    #isRetrograde
    #cusps
    #settings

    /**
     * @constructs
     * @param {Object} pointData - {name:String, angle:Number, isRetrograde:false}
     * @param {Object} cusps - [{angle:Number}, {angle:Number}, {angle:Number}, ...]
     * @param {Object} settings
     */
    constructor(pointData, cusps, settings) {
        this.#name = pointData.name ?? "Unknown"
        this.#angle = pointData.angle ?? 0
        this.#isRetrograde = pointData.isRetrograde ?? false

        if (! Array.isArray(cusps) || cusps.length != 12) {
            throw new Error("Bad param cusps. ")
        }

        this.#cusps = cusps

        if (! settings) {
            throw new Error('Bad param settings.')
        }

        this.#settings = settings
    }

    /**
     * Get name
     *
     * @return {String}
     */
    getName() {
        return this.#name
    }

    /**
     * Is retrograde
     *
     * @return {Boolean}
     */
    isRetrograde() {
        return this.#isRetrograde
    }

    /**
     * Get angle
     *
     * @return {Number}
     */
    getAngle() {
        return this.#angle
    }

    /**
     * Get symbol
     *
     * @param {Number} xPos
     * @param {Number} yPos
     * @param {Number} [angleShift]
     * @param {Boolean} [isProperties] - angleInSign, dignities, retrograde
     *
     * @return {SVGElement}
     */
    getSymbol(xPos, yPos, angleShift = 0, isProperties = true) {
        const wrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGGroup()

        const symbol = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGSymbol(this.#name, xPos, yPos)

        if (this.#settings.CLASS_CELESTIAL) {
            symbol.setAttribute('class', this.#settings.CLASS_CELESTIAL + ' ' + this.#settings.CLASS_CELESTIAL + '--' + this.#name.toLowerCase());
        }

        wrapper.appendChild(symbol)

        if (isProperties === false) {
            return wrapper //======>
        }

        const chartCenterX = this.#settings.CHART_VIEWBOX_WIDTH / 2
        const chartCenterY = this.#settings.CHART_VIEWBOX_HEIGHT / 2
        const angleFromSymbolToCenter = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].positionToAngle(xPos, yPos, chartCenterX, chartCenterY)

        if (this.#settings.POINT_PROPERTIES_SHOW_ANGLE) {
            angleInSign.call(this)
        }

        if (this.#settings.POINT_PROPERTIES_SHOW_RETROGRADE && this.#isRetrograde) {
            retrograde.call(this)
        }

        if (this.#settings.POINT_PROPERTIES_SHOW_DIGNITY && this.getDignity()) {
            dignities.call(this)
        }

        return wrapper //======>

        /*
         *  Angle in sign
         */
        function angleInSign() {
            const angleInSignPosition = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].positionOnCircle(xPos, yPos, this.#settings.POINT_PROPERTIES_ANGLE_OFFSET * this.#settings.POINT_COLLISION_RADIUS, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].degreeToRadian(-angleFromSymbolToCenter, angleShift))

            // It is possible to rotate the text, when uncomment a line bellow.
            //textWrapper.setAttribute("transform", `rotate(${angleFromSymbolToCenter},${textPosition.x},${textPosition.y})`)

            /*
             * Allows change the angle string, e.g. add the degree symbol ° with the ^ character from Astronomicon
             */
            let anglePosition = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].fillTemplate(this.#settings.ANGLE_TEMPLATE, {angle: this.getAngleInSign()});

            const angleInSignText = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGText(angleInSignPosition.x, angleInSignPosition.y, anglePosition)
            angleInSignText.setAttribute("font-family", this.#settings.CHART_FONT_FAMILY);
            angleInSignText.setAttribute("text-anchor", "middle") // start, middle, end
            angleInSignText.setAttribute("dominant-baseline", "middle")
            angleInSignText.setAttribute("font-size", this.#settings.POINT_PROPERTIES_ANGLE_SIZE || this.#settings.POINT_PROPERTIES_FONT_SIZE);
            angleInSignText.setAttribute("fill", this.#settings.POINT_PROPERTIES_ANGLE_COLOR || this.#settings.POINT_PROPERTIES_COLOR);
            wrapper.appendChild(angleInSignText)
        }

        /*
         *  Retrograde
         */
        function retrograde() {
            const retrogradePosition = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].positionOnCircle(xPos, yPos, this.#settings.POINT_PROPERTIES_RETROGRADE_OFFSET * this.#settings.POINT_COLLISION_RADIUS, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].degreeToRadian(-angleFromSymbolToCenter, angleShift))

            const retrogradeText = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGText(retrogradePosition.x, retrogradePosition.y, _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SYMBOL_RETROGRADE_CODE)
            retrogradeText.setAttribute("font-family", this.#settings.CHART_FONT_FAMILY);
            retrogradeText.setAttribute("text-anchor", "middle") // start, middle, end
            retrogradeText.setAttribute("dominant-baseline", "middle")
            retrogradeText.setAttribute("font-size", this.#settings.POINT_PROPERTIES_RETROGRADE_SIZE || this.#settings.POINT_PROPERTIES_FONT_SIZE);
            retrogradeText.setAttribute("fill", this.#settings.POINT_PROPERTIES_RETROGRADE_COLOR || this.#settings.POINT_PROPERTIES_COLOR);
            wrapper.appendChild(retrogradeText)
        }

        /*
         *  Dignities
         */
        function dignities() {
            const dignitiesPosition = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].positionOnCircle(xPos, yPos, this.#settings.POINT_PROPERTIES_DIGNITY_OFFSET * this.#settings.POINT_COLLISION_RADIUS, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].degreeToRadian(-angleFromSymbolToCenter, angleShift))
            const dignitiesText = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGText(dignitiesPosition.x, dignitiesPosition.y, this.getDignity())
            dignitiesText.setAttribute("font-family", "sans-serif");
            dignitiesText.setAttribute("text-anchor", "middle") // start, middle, end
            dignitiesText.setAttribute("dominant-baseline", "middle")
            dignitiesText.setAttribute("font-size", this.#settings.POINT_PROPERTIES_DIGNITY_SIZE || this.#settings.POINT_PROPERTIES_FONT_SIZE);
            dignitiesText.setAttribute("fill", this.#settings.POINT_PROPERTIES_DIGNITY_COLOR || this.#settings.POINT_PROPERTIES_COLOR);
            wrapper.appendChild(dignitiesText)
        }
    }

    /**
     * Get house number
     *
     * @return {Number}
     */
    getHouseNumber() {
        throw new Error("Not implemented yet.")
    }

    /**
     * Get sign number
     * Arise = 1, Taurus = 2, ...Pisces = 12
     *
     * @return {Number}
     */
    getSignNumber() {
        let angle = this.#angle % _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].DEG_360
        return Math.floor((angle / 30) + 1);
    }

    /**
     * Returns the angle (Integer) in the sign in which it stands.
     *
     * @return {Number}
     */
    getAngleInSign() {
        return Math.floor(this.#angle % 30)
    }

    /**
     * Get dignity symbol (r - rulership, d - detriment, f - fall, e - exaltation)
     *
     * @return {String} - dignity symbol (r,d,f,e)
     */
    getDignity() {
        const ARIES = 1
        const TAURUS = 2
        const GEMINI = 3
        const CANCER = 4
        const LEO = 5
        const VIRGO = 6
        const LIBRA = 7
        const SCORPIO = 8
        const SAGITTARIUS = 9
        const CAPRICORN = 10
        const AQUARIUS = 11
        const PISCES = 12

        const RULERSHIP_SYMBOL = this.#settings.POINT_PROPERTIES_DIGNITY_SYMBOLS[0];
        const DETRIMENT_SYMBOL = this.#settings.POINT_PROPERTIES_DIGNITY_SYMBOLS[1];
        const EXALTATION_SYMBOL = this.#settings.POINT_PROPERTIES_DIGNITY_SYMBOLS[2];
        const FALL_SYMBOL = this.#settings.POINT_PROPERTIES_DIGNITY_SYMBOLS[3];

        switch (this.#name) {
            case _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SYMBOL_SUN:
                if (this.getSignNumber() == LEO) {
                    return RULERSHIP_SYMBOL //======>
                }

                if (this.getSignNumber() == AQUARIUS) {
                    return DETRIMENT_SYMBOL //======>
                }

                if (this.getSignNumber() == VIRGO) {
                    return FALL_SYMBOL //======>
                }

                if (this.getSignNumber() == ARIES) {
                    return EXALTATION_SYMBOL //======>
                }

                return ""
                break;

            case _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SYMBOL_MOON:
                if (this.getSignNumber() == CANCER) {
                    return RULERSHIP_SYMBOL //======>
                }

                if (this.getSignNumber() == CAPRICORN) {
                    return DETRIMENT_SYMBOL //======>
                }

                if (this.getSignNumber() == SCORPIO) {
                    return FALL_SYMBOL //======>
                }

                if (this.getSignNumber() == TAURUS) {
                    return EXALTATION_SYMBOL //======>
                }
                return ""
                break;

            case _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SYMBOL_MERCURY:
                if (this.getSignNumber() == GEMINI) {
                    return RULERSHIP_SYMBOL //======>
                }

                if (this.getSignNumber() == SAGITTARIUS) {
                    return DETRIMENT_SYMBOL //======>
                }

                if (this.getSignNumber() == PISCES) {
                    return FALL_SYMBOL //======>
                }

                if (this.getSignNumber() == VIRGO) {
                    return EXALTATION_SYMBOL //======>
                }
                return ""
                break;

            case _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SYMBOL_VENUS:
                if (this.getSignNumber() == TAURUS || this.getSignNumber() == LIBRA) {
                    return RULERSHIP_SYMBOL //======>
                }

                if (this.getSignNumber() == ARIES || this.getSignNumber() == SCORPIO) {
                    return DETRIMENT_SYMBOL //======>
                }

                if (this.getSignNumber() == VIRGO) {
                    return FALL_SYMBOL //======>
                }

                if (this.getSignNumber() == PISCES) {
                    return EXALTATION_SYMBOL //======>
                }
                return ""
                break;

            case _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SYMBOL_MARS:
                if (this.getSignNumber() == ARIES || this.getSignNumber() == SCORPIO) {
                    return RULERSHIP_SYMBOL //======>
                }

                if (this.getSignNumber() == TAURUS || this.getSignNumber() == LIBRA) {
                    return DETRIMENT_SYMBOL //======>
                }

                if (this.getSignNumber() == CANCER) {
                    return FALL_SYMBOL //======>
                }

                if (this.getSignNumber() == CAPRICORN) {
                    return EXALTATION_SYMBOL //======>
                }
                return ""
                break;

            case _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SYMBOL_JUPITER:
                if (this.getSignNumber() == SAGITTARIUS || this.getSignNumber() == PISCES) {
                    return RULERSHIP_SYMBOL //======>
                }

                if (this.getSignNumber() == GEMINI || this.getSignNumber() == VIRGO) {
                    return DETRIMENT_SYMBOL //======>
                }

                if (this.getSignNumber() == CAPRICORN) {
                    return FALL_SYMBOL //======>
                }

                if (this.getSignNumber() == CANCER) {
                    return EXALTATION_SYMBOL //======>
                }
                return ""
                break;

            case _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SYMBOL_SATURN:
                if (this.getSignNumber() == CAPRICORN || this.getSignNumber() == AQUARIUS) {
                    return RULERSHIP_SYMBOL //======>
                }

                if (this.getSignNumber() == CANCER || this.getSignNumber() == LEO) {
                    return DETRIMENT_SYMBOL //======>
                }

                if (this.getSignNumber() == ARIES) {
                    return FALL_SYMBOL //======>
                }

                if (this.getSignNumber() == LIBRA) {
                    return EXALTATION_SYMBOL //======>
                }
                return ""
                break;

            case _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SYMBOL_URANUS:
                if (this.getSignNumber() == AQUARIUS) {
                    return RULERSHIP_SYMBOL //======>
                }

                if (this.getSignNumber() == LEO) {
                    return DETRIMENT_SYMBOL //======>
                }

                if (this.getSignNumber() == TAURUS) {
                    return FALL_SYMBOL //======>
                }

                if (this.getSignNumber() == SCORPIO) {
                    return EXALTATION_SYMBOL //======>
                }
                return ""
                break;

            case _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SYMBOL_NEPTUNE:
                if (this.getSignNumber() == PISCES) {
                    return RULERSHIP_SYMBOL //======>
                }

                if (this.getSignNumber() == VIRGO) {
                    return DETRIMENT_SYMBOL //======>
                }

                if (this.getSignNumber() == GEMINI || this.getSignNumber() == AQUARIUS) {
                    return FALL_SYMBOL //======>
                }

                if (this.getSignNumber() == SAGITTARIUS || this.getSignNumber() == LEO) {
                    return EXALTATION_SYMBOL //======>
                }
                return ""
                break;

            case _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SYMBOL_PLUTO:
                if (this.getSignNumber() == SCORPIO) {
                    return RULERSHIP_SYMBOL //======>
                }

                if (this.getSignNumber() == TAURUS) {
                    return DETRIMENT_SYMBOL //======>
                }

                if (this.getSignNumber() == LIBRA) {
                    return FALL_SYMBOL //======>
                }

                if (this.getSignNumber() == ARIES) {
                    return EXALTATION_SYMBOL //======>
                }
                return ""
                break;

            default:
                return ""
        }
    }
}




/***/ }),

/***/ "./src/settings/DefaultSettings.js":
/*!*****************************************!*\
  !*** ./src/settings/DefaultSettings.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SETTINGS)
/* harmony export */ });
/* harmony import */ var _constants_Universe_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants/Universe.js */ "./src/settings/constants/Universe.js");
/* harmony import */ var _constants_Radix_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constants/Radix.js */ "./src/settings/constants/Radix.js");
/* harmony import */ var _constants_Transit_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants/Transit.js */ "./src/settings/constants/Transit.js");
/* harmony import */ var _constants_Point_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./constants/Point.js */ "./src/settings/constants/Point.js");
/* harmony import */ var _constants_Colors_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./constants/Colors.js */ "./src/settings/constants/Colors.js");
/* harmony import */ var _constants_Aspects_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./constants/Aspects.js */ "./src/settings/constants/Aspects.js");







const SETTINGS = Object.assign({}, _constants_Universe_js__WEBPACK_IMPORTED_MODULE_0__, _constants_Radix_js__WEBPACK_IMPORTED_MODULE_1__, _constants_Transit_js__WEBPACK_IMPORTED_MODULE_2__, _constants_Point_js__WEBPACK_IMPORTED_MODULE_3__, _constants_Colors_js__WEBPACK_IMPORTED_MODULE_4__, _constants_Aspects_js__WEBPACK_IMPORTED_MODULE_5__);




/***/ }),

/***/ "./src/settings/constants/Aspects.js":
/*!*******************************************!*\
  !*** ./src/settings/constants/Aspects.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ASPECTS_FONT_SIZE: () => (/* binding */ ASPECTS_FONT_SIZE),
/* harmony export */   ASPECTS_ID: () => (/* binding */ ASPECTS_ID),
/* harmony export */   DEFAULT_ASPECTS: () => (/* binding */ DEFAULT_ASPECTS),
/* harmony export */   DRAW_ASPECTS: () => (/* binding */ DRAW_ASPECTS)
/* harmony export */ });
/*
* Aspects wrapper element ID
* @constant
* @type {String}
* @default aspects
*/
const ASPECTS_ID = "aspects"

/*
* Draw aspects into chart during render
* @constant
* @type {Boolean}
* @default true
*/
const DRAW_ASPECTS = true

/*
* Font size - aspects
* @constant
* @type {Number}
* @default 27
*/
const ASPECTS_FONT_SIZE = 18

/**
 * Default aspects
 *
 * From https://www.reddit.com/r/astrology/comments/xbdy83/whats_a_good_orb_range_for_aspects_conjunction/
 * Many other settings, usually depends on the planet, Sun / Moon use wider range
 *
 * orb : sets the tolerance for the angle
 *
 * Major aspects:
 *
 *     {name:"Conjunction", angle:0, orb:4, isMajor: true},
 *     {name:"Opposition", angle:180, orb:4, isMajor: true},
 *     {name:"Trine", angle:120, orb:2, isMajor: true},
 *     {name:"Square", angle:90, orb:2, isMajor: true},
 *     {name:"Sextile", angle:60, orb:2, isMajor: true},
 *
 * Minor aspects:
 *
 *     {name:"Quincunx", angle:150, orb:1},
 *     {name:"Semisextile", angle:30, orb:1},
 *     {name:"Quintile", angle:72, orb:1},
 *     {name:"Trioctile", angle:135, orb:1},
 *     {name:"Semisquare", angle:45, orb:1},
 *
 * @constant
 * @type {Array}
 */
const DEFAULT_ASPECTS = [
    {name:"Conjunction", angle:0, orb:4, isMajor: true},
    {name:"Opposition", angle:180, orb:4, isMajor: true},
    {name:"Trine", angle:120, orb:2, isMajor: true},
    {name:"Square", angle:90, orb:2, isMajor: true},
    {name:"Sextile", angle:60, orb:2, isMajor: true},

]


/***/ }),

/***/ "./src/settings/constants/Colors.js":
/*!******************************************!*\
  !*** ./src/settings/constants/Colors.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ASPECTS_BACKGROUND_COLOR: () => (/* binding */ ASPECTS_BACKGROUND_COLOR),
/* harmony export */   ASPECT_COLORS: () => (/* binding */ ASPECT_COLORS),
/* harmony export */   CHART_BACKGROUND_COLOR: () => (/* binding */ CHART_BACKGROUND_COLOR),
/* harmony export */   CHART_CIRCLE_COLOR: () => (/* binding */ CHART_CIRCLE_COLOR),
/* harmony export */   CHART_HOUSE_NUMBER_COLOR: () => (/* binding */ CHART_HOUSE_NUMBER_COLOR),
/* harmony export */   CHART_LINE_COLOR: () => (/* binding */ CHART_LINE_COLOR),
/* harmony export */   CHART_MAIN_AXIS_COLOR: () => (/* binding */ CHART_MAIN_AXIS_COLOR),
/* harmony export */   CHART_POINTS_COLOR: () => (/* binding */ CHART_POINTS_COLOR),
/* harmony export */   CHART_SIGNS_COLOR: () => (/* binding */ CHART_SIGNS_COLOR),
/* harmony export */   CHART_TEXT_COLOR: () => (/* binding */ CHART_TEXT_COLOR),
/* harmony export */   CIRCLE_COLOR: () => (/* binding */ CIRCLE_COLOR),
/* harmony export */   COLOR_AQUARIUS: () => (/* binding */ COLOR_AQUARIUS),
/* harmony export */   COLOR_ARIES: () => (/* binding */ COLOR_ARIES),
/* harmony export */   COLOR_CANCER: () => (/* binding */ COLOR_CANCER),
/* harmony export */   COLOR_CAPRICORN: () => (/* binding */ COLOR_CAPRICORN),
/* harmony export */   COLOR_GEMINI: () => (/* binding */ COLOR_GEMINI),
/* harmony export */   COLOR_LEO: () => (/* binding */ COLOR_LEO),
/* harmony export */   COLOR_LIBRA: () => (/* binding */ COLOR_LIBRA),
/* harmony export */   COLOR_PISCES: () => (/* binding */ COLOR_PISCES),
/* harmony export */   COLOR_SAGITTARIUS: () => (/* binding */ COLOR_SAGITTARIUS),
/* harmony export */   COLOR_SCORPIO: () => (/* binding */ COLOR_SCORPIO),
/* harmony export */   COLOR_TAURUS: () => (/* binding */ COLOR_TAURUS),
/* harmony export */   COLOR_VIRGO: () => (/* binding */ COLOR_VIRGO),
/* harmony export */   PLANETS_BACKGROUND_COLOR: () => (/* binding */ PLANETS_BACKGROUND_COLOR),
/* harmony export */   PLANET_COLORS: () => (/* binding */ PLANET_COLORS),
/* harmony export */   POINT_PROPERTIES_COLOR: () => (/* binding */ POINT_PROPERTIES_COLOR),
/* harmony export */   SIGN_COLORS: () => (/* binding */ SIGN_COLORS),
/* harmony export */   TRANSIT_PLANET_COLORS: () => (/* binding */ TRANSIT_PLANET_COLORS)
/* harmony export */ });
/**
* Chart background color
* @constant
* @type {String}
* @default #fff
*/
const CHART_BACKGROUND_COLOR = "none";

/**
* Planets background color
* @constant
* @type {String}
* @default #fff
*/
const PLANETS_BACKGROUND_COLOR = "#fff";

/**
* Aspects background color
* @constant
* @type {String}
* @default #fff
*/
const ASPECTS_BACKGROUND_COLOR = "#eee";

/*
* Default color of circles in charts
* @constant
* @type {String}
* @default #333
*/
const CHART_CIRCLE_COLOR = "#333";

/*
* Default color of lines in charts
* @constant
* @type {String}
* @default #333
*/
const CHART_LINE_COLOR = "#666";

/*
* Default color of text in charts
* @constant
* @type {String}
* @default #333
*/
const CHART_TEXT_COLOR = "#bbb";

/*
* Default color of cusps number
* @constant
* @type {String}
* @default #333
*/
const CHART_HOUSE_NUMBER_COLOR = "#333";

/*
* Default color of mqin axis - As, Ds, Mc, Ic
* @constant
* @type {String}
* @default #000
*/
const CHART_MAIN_AXIS_COLOR = "#000";

/*
* Default color of signs in charts (arise symbol, taurus symbol, ...)
* @constant
* @type {String}
* @default #000
*/
const CHART_SIGNS_COLOR = "#333";

/*
* Default color of planets on the chart (Sun symbol, Moon symbol, ...)
* @constant
* @type {String}
* @default #000
*/
const CHART_POINTS_COLOR = "#000";

/*
* Default color for point properties - angle in sign, dignities, retrograde
* @constant
* @type {String}
* @default #333
*/
const POINT_PROPERTIES_COLOR = "#333"

/*
* Aries color
* @constant
* @type {String}
* @default #FF4500
*/
const COLOR_ARIES = "#FF4500";

/*
* Taurus color
* @constant
* @type {String}
* @default #8B4513
*/
const COLOR_TAURUS = "#8B4513";

/*
* Geminy color
* @constant
* @type {String}
* @default #87CEEB
*/
const COLOR_GEMINI= "#87CEEB";

/*
* Cancer color
* @constant
* @type {String}
* @default #27AE60
*/
const COLOR_CANCER = "#27AE60";

/*
* Leo color
* @constant
* @type {String}
* @default #FF4500
*/
const COLOR_LEO = "#FF4500";

/*
* Virgo color
* @constant
* @type {String}
* @default #8B4513
*/
const COLOR_VIRGO = "#8B4513";

/*
* Libra color
* @constant
* @type {String}
* @default #87CEEB
*/
const COLOR_LIBRA = "#87CEEB";

/*
* Scorpio color
* @constant
* @type {String}
* @default #27AE60
*/
const COLOR_SCORPIO = "#27AE60";

/*
* Sagittarius color
* @constant
* @type {String}
* @default #FF4500
*/
const COLOR_SAGITTARIUS = "#FF4500";

/*
* Capricorn color
* @constant
* @type {String}
* @default #8B4513
*/
const COLOR_CAPRICORN = "#8B4513";

/*
* Aquarius color
* @constant
* @type {String}
* @default #87CEEB
*/
const COLOR_AQUARIUS = "#87CEEB";

/*
* Pisces color
* @constant
* @type {String}
* @default #27AE60
*/
const COLOR_PISCES = "#27AE60";

/*
* Color of circles in charts
* @constant
* @type {String}
* @default #333
*/
const CIRCLE_COLOR = "#333";

/*
* Color of aspects
* @constant
* @type {Object}
*/
const ASPECT_COLORS = {
  Conjunction:"#333",
  Opposition:"#1B4F72",
  Square:"#641E16",
  Trine:"#0B5345",
  Sextile:"#333",
  Quincunx:"#333",
  Semisextile:"#333",
  Quintile:"#333",
  Trioctile:"#333"
}

/**
 * Override individual planet symbol colors by planet name
 */
const PLANET_COLORS = {
  //Sun: "#000",
  //Moon: "#aaa",
}

/**
 * override individual sign symbol colors by zodiac index
 */
const SIGN_COLORS = {
  //0: "#333"
}

/**
 * Override individual planet symbol colors by planet name on transit charts
 */
const TRANSIT_PLANET_COLORS = {
  //Sun: "#000",
  //Moon: "#aaa",
}


/***/ }),

/***/ "./src/settings/constants/Point.js":
/*!*****************************************!*\
  !*** ./src/settings/constants/Point.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ANGLE_TEMPLATE: () => (/* binding */ ANGLE_TEMPLATE),
/* harmony export */   POINT_COLLISION_RADIUS: () => (/* binding */ POINT_COLLISION_RADIUS),
/* harmony export */   POINT_PROPERTIES_ANGLE_OFFSET: () => (/* binding */ POINT_PROPERTIES_ANGLE_OFFSET),
/* harmony export */   POINT_PROPERTIES_ANGLE_SIZE: () => (/* binding */ POINT_PROPERTIES_ANGLE_SIZE),
/* harmony export */   POINT_PROPERTIES_DIGNITY_OFFSET: () => (/* binding */ POINT_PROPERTIES_DIGNITY_OFFSET),
/* harmony export */   POINT_PROPERTIES_DIGNITY_SIZE: () => (/* binding */ POINT_PROPERTIES_DIGNITY_SIZE),
/* harmony export */   POINT_PROPERTIES_DIGNITY_SYMBOLS: () => (/* binding */ POINT_PROPERTIES_DIGNITY_SYMBOLS),
/* harmony export */   POINT_PROPERTIES_FONT_SIZE: () => (/* binding */ POINT_PROPERTIES_FONT_SIZE),
/* harmony export */   POINT_PROPERTIES_RETROGRADE_OFFSET: () => (/* binding */ POINT_PROPERTIES_RETROGRADE_OFFSET),
/* harmony export */   POINT_PROPERTIES_RETROGRADE_SIZE: () => (/* binding */ POINT_PROPERTIES_RETROGRADE_SIZE),
/* harmony export */   POINT_PROPERTIES_SHOW: () => (/* binding */ POINT_PROPERTIES_SHOW),
/* harmony export */   POINT_PROPERTIES_SHOW_ANGLE: () => (/* binding */ POINT_PROPERTIES_SHOW_ANGLE),
/* harmony export */   POINT_PROPERTIES_SHOW_DIGNITY: () => (/* binding */ POINT_PROPERTIES_SHOW_DIGNITY),
/* harmony export */   POINT_PROPERTIES_SHOW_RETROGRADE: () => (/* binding */ POINT_PROPERTIES_SHOW_RETROGRADE)
/* harmony export */ });
/*
* Point properties - angle in sign, dignities, retrograde
* @constant
* @type {Boolean}
* @default true
*/
const POINT_PROPERTIES_SHOW = true

/*
* Point angle in sign
* @constant
* @type {Boolean}
* @default true
*/
const POINT_PROPERTIES_SHOW_ANGLE = true

/*
* Point dignity symbol
* @constant
* @type {Boolean}
* @default true
*/
const POINT_PROPERTIES_SHOW_DIGNITY = true

/*
* Point retrograde symbol
* @constant
* @type {Boolean}
* @default true
*/
const POINT_PROPERTIES_SHOW_RETROGRADE = true

/*
* Point dignity symbols - [domicile, detriment, exaltation, fall]
* @constant
* @type {Boolean}
* @default true
*/
const POINT_PROPERTIES_DIGNITY_SYMBOLS = ["r", "d", "e", "f"];

/*
* Text size of Point description - angle in sign, dignities, retrograde
* @constant
* @type {Number}
* @default 6
*/
const POINT_PROPERTIES_FONT_SIZE = 16

/*
* Text size of angle number
* @constant
* @type {Number}
* @default 6
*/
const POINT_PROPERTIES_ANGLE_SIZE = 25

/*
* Text size of retrograde symbol
* @constant
* @type {Number}
* @default 6
*/
const POINT_PROPERTIES_RETROGRADE_SIZE = 25

/*
* Text size of dignity symbol
* @constant
* @type {Number}
* @default 6
*/
const POINT_PROPERTIES_DIGNITY_SIZE = 12

/*
* Angle offset multiplier
* @constant
* @type {Number}
* @default 6
*/
const POINT_PROPERTIES_ANGLE_OFFSET = 2

/*
* Retrograde symbol offset multiplier
* @constant
* @type {Number}
* @default 6
*/
const POINT_PROPERTIES_RETROGRADE_OFFSET = 3.5

/*
* Dignity symbol offset multiplier
* @constant
* @type {Number}
* @default 6
*/
const POINT_PROPERTIES_DIGNITY_OFFSET = 5

/**
* A point collision radius
* @constant
* @type {Number}
* @default 2
*/
const POINT_COLLISION_RADIUS = 12

/**
 * Tweak the angle string, e.g. add the degree symbol: "${angle}°"
 * @type {string}
 */
const ANGLE_TEMPLATE = "${angle}"

/***/ }),

/***/ "./src/settings/constants/Radix.js":
/*!*****************************************!*\
  !*** ./src/settings/constants/Radix.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RADIX_AXIS_FONT_SIZE: () => (/* binding */ RADIX_AXIS_FONT_SIZE),
/* harmony export */   RADIX_HOUSE_FONT_SIZE: () => (/* binding */ RADIX_HOUSE_FONT_SIZE),
/* harmony export */   RADIX_ID: () => (/* binding */ RADIX_ID),
/* harmony export */   RADIX_POINTS_FONT_SIZE: () => (/* binding */ RADIX_POINTS_FONT_SIZE),
/* harmony export */   RADIX_SIGNS_FONT_SIZE: () => (/* binding */ RADIX_SIGNS_FONT_SIZE)
/* harmony export */ });
/*
* Radix chart element ID
* @constant
* @type {String}
* @default radix
*/
const RADIX_ID = "radix"

/*
* Font size - points (planets)
* @constant
* @type {Number}
* @default 27
*/
const RADIX_POINTS_FONT_SIZE = 27

/*
* Font size - house cusp number
* @constant
* @type {Number}
* @default 27
*/
const RADIX_HOUSE_FONT_SIZE = 20

/*
* Font size - signs
* @constant
* @type {Number}
* @default 27
*/
const RADIX_SIGNS_FONT_SIZE = 27

/*
* Font size - axis (As, Ds, Mc, Ic)
* @constant
* @type {Number}
* @default 24
*/
const RADIX_AXIS_FONT_SIZE = 32


/***/ }),

/***/ "./src/settings/constants/Transit.js":
/*!*******************************************!*\
  !*** ./src/settings/constants/Transit.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TRANSIT_ID: () => (/* binding */ TRANSIT_ID),
/* harmony export */   TRANSIT_POINTS_FONT_SIZE: () => (/* binding */ TRANSIT_POINTS_FONT_SIZE)
/* harmony export */ });
/*
* Transit chart element ID
* @constant
* @type {String}
* @default transit
*/
const TRANSIT_ID = "transit"

/*
* Font size - points (planets)
* @constant
* @type {Number}
* @default 32
*/
const TRANSIT_POINTS_FONT_SIZE = 27


/***/ }),

/***/ "./src/settings/constants/Universe.js":
/*!********************************************!*\
  !*** ./src/settings/constants/Universe.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CHART_ALLOW_HOUSE_OVERLAP: () => (/* binding */ CHART_ALLOW_HOUSE_OVERLAP),
/* harmony export */   CHART_DRAW_MAIN_AXIS: () => (/* binding */ CHART_DRAW_MAIN_AXIS),
/* harmony export */   CHART_FONT_FAMILY: () => (/* binding */ CHART_FONT_FAMILY),
/* harmony export */   CHART_MAIN_STROKE: () => (/* binding */ CHART_MAIN_STROKE),
/* harmony export */   CHART_PADDING: () => (/* binding */ CHART_PADDING),
/* harmony export */   CHART_STROKE: () => (/* binding */ CHART_STROKE),
/* harmony export */   CHART_STROKE_MINOR_ASPECT: () => (/* binding */ CHART_STROKE_MINOR_ASPECT),
/* harmony export */   CHART_STROKE_ONLY: () => (/* binding */ CHART_STROKE_ONLY),
/* harmony export */   CHART_STROKE_WITH_COLOR: () => (/* binding */ CHART_STROKE_WITH_COLOR),
/* harmony export */   CHART_VIEWBOX_HEIGHT: () => (/* binding */ CHART_VIEWBOX_HEIGHT),
/* harmony export */   CHART_VIEWBOX_WIDTH: () => (/* binding */ CHART_VIEWBOX_WIDTH),
/* harmony export */   CLASS_AXIS: () => (/* binding */ CLASS_AXIS),
/* harmony export */   CLASS_CELESTIAL: () => (/* binding */ CLASS_CELESTIAL),
/* harmony export */   CLASS_SIGN: () => (/* binding */ CLASS_SIGN),
/* harmony export */   CLASS_SIGN_ASPECT: () => (/* binding */ CLASS_SIGN_ASPECT),
/* harmony export */   CLASS_SIGN_ASPECT_LINE: () => (/* binding */ CLASS_SIGN_ASPECT_LINE),
/* harmony export */   CLASS_SIGN_SEGMENT: () => (/* binding */ CLASS_SIGN_SEGMENT),
/* harmony export */   DRAW_RULER_MARK: () => (/* binding */ DRAW_RULER_MARK),
/* harmony export */   PLANET_LINE_USE_PLANET_COLOR: () => (/* binding */ PLANET_LINE_USE_PLANET_COLOR)
/* harmony export */ });
/**
 * Chart padding
 * @constant
 * @type {Number}
 * @default 10px
 */
const CHART_PADDING = 40

/**
 * SVG viewBox width
 * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/viewBox
 * @constant
 * @type {Number}
 * @default 800
 */
const CHART_VIEWBOX_WIDTH = 800

/**
 * SVG viewBox height
 * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/viewBox
 * @constant
 * @type {Number}
 * @default 800
 */
const CHART_VIEWBOX_HEIGHT = 800

/*
* Line strength
* @constant
* @type {Number}
* @default 1
*/
const CHART_STROKE = 1

/*
* Line strength of the main lines. For instance points, main axis, main circles
* @constant
* @type {Number}
* @default 1
*/
const CHART_MAIN_STROKE = 2

/**
 * Line strength for minor aspects
 *
 * @type {number}
 */
const CHART_STROKE_MINOR_ASPECT = 1

/**
 * No fill, only stroke
 * @constant
 * @type {boolean}
 * @default false
 */
const CHART_STROKE_ONLY = false;

/**
 * Font family
 * @constant
 * @type {String}
 * @default
 */
const CHART_FONT_FAMILY = "Astronomicon";

/**
 * Always draw the full house lines, even if it overlaps with planets
 * @constant
 * @type {boolean}
 * @default false
 */
const CHART_ALLOW_HOUSE_OVERLAP = false;

/**
 * Draw mains axis symbols outside the chart: Ac, Mc, Ic, Dc
 * @constant
 * @type {boolean}
 * @default false
 */
const CHART_DRAW_MAIN_AXIS = true;


/**
 * Stroke & fill
 * @constant
 * @type {boolean}
 * @default false
 */
const CHART_STROKE_WITH_COLOR = false;


/**
 * All classnames
 */

/**
 * Class for the sign segment, behind the actual sign
 * @type {string}
 */
const CLASS_SIGN_SEGMENT = '';

/**
 * Class for the sign
 * If not empty, another class will be added using same string, with a modifier like --sign_name
 * @type {string}
 */
const CLASS_SIGN = '';

/**
 * Class for axis Ascendant, Midheaven, Descendant and Imum Coeli
 * If not empty, another class will be added using same string, with a modifier like --axis_name
 * @type {string}
 */
const CLASS_AXIS = '';

/**
 * Class for Celestial Bodies (Planet / Asteriod)
 * and Celestial Points (northnode, southnode, lilith)
 * @type {string}
 */
const CLASS_CELESTIAL = '';

/**
 * Class for the aspect character
 * @type {string}
 */
const CLASS_SIGN_ASPECT = '';

/**
 * Class for aspect lines
 * @type {string}
 */
const CLASS_SIGN_ASPECT_LINE = '';

/**
 * Use planet color for the chart line next to a planet
 * @type {boolean}
 */
const PLANET_LINE_USE_PLANET_COLOR = false;

/**
 * Draw a ruler mark (tiny square) at planet position
 */
const DRAW_RULER_MARK = true;

/***/ }),

/***/ "./src/universe/Universe.js":
/*!**********************************!*\
  !*** ./src/universe/Universe.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Universe)
/* harmony export */ });
/* harmony import */ var _settings_DefaultSettings_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../settings/DefaultSettings.js */ "./src/settings/DefaultSettings.js");
/* harmony import */ var _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/SVGUtils.js */ "./src/utils/SVGUtils.js");
/* harmony import */ var _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/Utils.js */ "./src/utils/Utils.js");
/* harmony import */ var _charts_RadixChart_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../charts/RadixChart.js */ "./src/charts/RadixChart.js");
/* harmony import */ var _charts_TransitChart_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../charts/TransitChart.js */ "./src/charts/TransitChart.js");







/**
 * @class
 * @classdesc An wrapper for all parts of graph.
 * @public
 */
class Universe {

  #SVGDocument
  #settings
  #radix
  #transit
  #aspectsWrapper

  /**
   * @constructs
   * @param {String} htmlElementID - ID of the root element without the # sign
   * @param {Object} [options] - An object that overrides the default settings values
   */
  constructor(htmlElementID, options = {}) {

    if (typeof htmlElementID !== 'string') {
      throw new Error('A required parameter is missing.')
    }

    if (!document.getElementById(htmlElementID)) {
      throw new Error('Canot find a HTML element with ID ' + htmlElementID)
    }

    this.#settings = Object.assign({}, _settings_DefaultSettings_js__WEBPACK_IMPORTED_MODULE_0__["default"], options, {
      HTML_ELEMENT_ID: htmlElementID
    });
    this.#SVGDocument = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGDocument(this.#settings.CHART_VIEWBOX_WIDTH, this.#settings.CHART_VIEWBOX_HEIGHT)
    document.getElementById(htmlElementID).appendChild(this.#SVGDocument);

    // chart background
    const circle = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGCircle(this.#settings.CHART_VIEWBOX_WIDTH / 2, this.#settings.CHART_VIEWBOX_HEIGHT / 2, this.#settings.CHART_VIEWBOX_WIDTH / 2)
    circle.setAttribute('fill', this.#settings.CHART_BACKGROUND_COLOR)
    this.#SVGDocument.appendChild(circle)

    // create wrapper for aspects
    this.#aspectsWrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGGroup()
    this.#aspectsWrapper.setAttribute("id", `${this.#settings.HTML_ELEMENT_ID}-${this.#settings.ASPECTS_ID}`)
    this.#SVGDocument.appendChild(this.#aspectsWrapper)

    this.#radix = new _charts_RadixChart_js__WEBPACK_IMPORTED_MODULE_3__["default"](this)
    this.#transit = new _charts_TransitChart_js__WEBPACK_IMPORTED_MODULE_4__["default"](this.#radix)

    this.#loadFont("Astronomicon", '../assets/fonts/ttf/AstronomiconFonts_1.1/Astronomicon.ttf')

    return this
  }

  // ## PUBLIC ##############################

  /**
   * Get Radix chart
   * @return {RadixChart}
   */
  radix() {
    return this.#radix
  }

  /**
   * Get Transit chart
   * @return {TransitChart}
   */
  transit() {
    return this.#transit
  }

  /**
   * Get current settings
   * @return {Object}
   */
  getSettings() {
    return this.#settings
  }

  /**
   * Get root SVG document
   * @return {SVGDocument}
   */
  getSVGDocument() {
    return this.#SVGDocument
  }

  /**
   * Get empty aspects wrapper element
   * @return {SVGGroupElement}
   */
  getAspectsElement() {
    return this.#aspectsWrapper
  }

  // ## PRIVATE ##############################

  /*
  * Load fond to DOM
  *
  * @param {String} family
  * @param {String} source
  * @param {Object}
  *
  * @see https://developer.mozilla.org/en-US/docs/Web/API/FontFace/FontFace
  */
  async #loadFont( family, source, descriptors ){

    if (!('FontFace' in window)) {
      console.error("Ooops, FontFace is not a function.")
      console.error("@see https://developer.mozilla.org/en-US/docs/Web/API/CSS_Font_Loading_API")
      return
    }

    const font = new FontFace(family, `url(${source})`, descriptors)

    try{
      await font.load();
      document.fonts.add(font)
    }catch(e){
      throw new Error(e)
    }
  }
}




/***/ }),

/***/ "./src/utils/AspectUtils.js":
/*!**********************************!*\
  !*** ./src/utils/AspectUtils.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AspectUtils)
/* harmony export */ });
/* harmony import */ var _Utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Utils.js */ "./src/utils/Utils.js");
/* harmony import */ var _SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SVGUtils.js */ "./src/utils/SVGUtils.js");



/**
 * @class
 * @classdesc Utility class
 * @public
 * @static
 * @hideconstructor
 */
class AspectUtils {

    constructor() {
        if (this instanceof AspectUtils) {
            throw Error('This is a static class and cannot be instantiated.');
        }
    }

    /**
     * Calculates the orbit of two angles on a circle
     *
     * @param {Number} fromAngle - angle in degree, point on the circle
     * @param {Number} toAngle - angle in degree, point on the circle
     * @param {Number} aspectAngle - 60,90,120, ...
     *
     * @return {Number} orb
     */
    static orb(fromAngle, toAngle, aspectAngle) {
        let orb
        let sign = fromAngle > toAngle ? 1 : -1
        let difference = Math.abs(fromAngle - toAngle)

        if (difference > _Utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].DEG_180) {
            difference = _Utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].DEG_360 - difference;
            orb = (difference - aspectAngle) * -1

        } else {
            orb = (difference - aspectAngle) * sign
        }

        return Number(Number(orb).toFixed(2))
    }

    /**
     * Get aspects
     *
     * @param {Array<Object>} fromPoints - [{name:"Moon", angle:0}, {name:"Sun", angle:179}, {name:"Mercury", angle:121}]
     * @param {Array<Object>} toPoints - [{name:"AS", angle:0}, {name:"IC", angle:90}]
     * @param {Array<Object>} aspects - [{name:"Opposition", angle:180, orb:2}, {name:"Trine", angle:120, orb:2}]
     *
     * @return {Array<Object>}
     */
    static getAspects(fromPoints, toPoints, aspects) {
        const aspectList = []
        for (const fromP of fromPoints) {
            for (const toP of toPoints) {
                for (const aspect of aspects) {
                    const orb = AspectUtils.orb(fromP.angle, toP.angle, aspect.angle)
                    if (Math.abs(orb) <= aspect.orb) {
                        aspectList.push({aspect: aspect, from: fromP, to: toP, precision: orb})
                    }
                }
            }
        }

        return aspectList
    }

    /**
     * Draw aspects
     *
     * @param {Number} radius
     * @param {Number} ascendantShift
     * @param {Object} settings
     * @param {Array<Object>} aspectsList
     *
     * @return {SVGGroupElement}
     */
    static drawAspects(radius, ascendantShift, settings, aspectsList) {
        const centerX = settings.CHART_VIEWBOX_WIDTH / 2
        const centerY = settings.CHART_VIEWBOX_HEIGHT / 2

        const wrapper = _SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGGroup()

        /**
         * Reorder aspects
         * Draw minor aspects first
         */
        aspectsList.sort((a, b) => ((a.aspect.isMajor ?? false) === (b.aspect.isMajor ?? false)) ? 0 : (a.aspect.isMajor ?? false) ? 1 : -1)

        /**
         * Draw lines first
         */
        for (const asp of aspectsList) {
            // aspect as solid line
            const fromPoint = _Utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].positionOnCircle(centerX, centerY, radius, _Utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].degreeToRadian(asp.from.angle, ascendantShift))
            const toPoint = _Utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].positionOnCircle(centerX, centerY, radius, _Utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].degreeToRadian(asp.to.angle, ascendantShift))

            // space for symbol (fromPoint - center)
            const fromPointSpaceX = fromPoint.x + (toPoint.x - fromPoint.x) / 2.2
            const fromPointSpaceY = fromPoint.y + (toPoint.y - fromPoint.y) / 2.2

            // space for symbol (center - toPoint)
            const toPointSpaceX = toPoint.x + (fromPoint.x - toPoint.x) / 2.2
            const toPointSpaceY = toPoint.y + (fromPoint.y - toPoint.y) / 2.2

            // line: fromPoint - center
            const line1 = _SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGLine(fromPoint.x, fromPoint.y, fromPointSpaceX, fromPointSpaceY)
            line1.setAttribute("stroke", settings.ASPECT_COLORS[asp.aspect.name] ?? "#333");

            if (settings.CHART_STROKE_MINOR_ASPECT && ! (asp.aspect.isMajor ?? false)) {
                line1.setAttribute("stroke-width", settings.CHART_STROKE_MINOR_ASPECT);
            } else {
                line1.setAttribute("stroke-width", settings.CHART_STROKE);
            }

            if (settings.CLASS_SIGN_ASPECT_LINE) {
                line1.setAttribute("class", settings.CLASS_SIGN_ASPECT_LINE)
            }

            // line: center - toPoint
            const line2 = _SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGLine(toPointSpaceX, toPointSpaceY, toPoint.x, toPoint.y)
            line2.setAttribute("stroke", settings.ASPECT_COLORS[asp.aspect.name] ?? "#333");

            if (settings.CHART_STROKE_MINOR_ASPECT && ! (asp.aspect.isMajor ?? false)) {
                line2.setAttribute("stroke-width", settings.CHART_STROKE_MINOR_ASPECT);
            } else {
                line2.setAttribute("stroke-width", settings.CHART_STROKE);
            }

            if (settings.CLASS_SIGN_ASPECT_LINE) {
                line2.setAttribute("class", settings.CLASS_SIGN_ASPECT_LINE)
            }

            wrapper.appendChild(line1);
            wrapper.appendChild(line2);
        }

        /**
         * Draw all aspects above lines
         */
        for (const asp of aspectsList) {

            // aspect as solid line
            const fromPoint = _Utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].positionOnCircle(centerX, centerY, radius, _Utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].degreeToRadian(asp.from.angle, ascendantShift))
            const toPoint = _Utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].positionOnCircle(centerX, centerY, radius, _Utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].degreeToRadian(asp.to.angle, ascendantShift))

            // draw symbol in center of aspect
            const lineCenterX = (fromPoint.x + toPoint.x) / 2
            const lineCenterY = (fromPoint.y + toPoint.y) / 2
            const symbol = _SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGSymbol(asp.aspect.name, lineCenterX, lineCenterY)
            symbol.setAttribute("font-family", settings.CHART_FONT_FAMILY);
            symbol.setAttribute("text-anchor", "middle") // start, middle, end
            symbol.setAttribute("dominant-baseline", "middle")
            symbol.setAttribute("font-size", settings.ASPECTS_FONT_SIZE);
            symbol.setAttribute("fill", settings.ASPECT_COLORS[asp.aspect.name] ?? "#333");

            if (settings.CLASS_SIGN_ASPECT) {
                symbol.setAttribute("class", settings.CLASS_SIGN_ASPECT)
            }

            wrapper.appendChild(symbol);
        }

        return wrapper
    }

}




/***/ }),

/***/ "./src/utils/SVGUtils.js":
/*!*******************************!*\
  !*** ./src/utils/SVGUtils.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SVGUtils)
/* harmony export */ });
/**
 * @class
 * @classdesc SVG utility class
 * @public
 * @static
 * @hideconstructor
 */
class SVGUtils {

    static SVG_NAMESPACE = "http://www.w3.org/2000/svg"

    static SYMBOL_ARIES = "Aries";
    static SYMBOL_TAURUS = "Taurus";
    static SYMBOL_GEMINI = "Gemini";
    static SYMBOL_CANCER = "Cancer";
    static SYMBOL_LEO = "Leo";
    static SYMBOL_VIRGO = "Virgo";
    static SYMBOL_LIBRA = "Libra";
    static SYMBOL_SCORPIO = "Scorpio";
    static SYMBOL_SAGITTARIUS = "Sagittarius";
    static SYMBOL_CAPRICORN = "Capricorn";
    static SYMBOL_AQUARIUS = "Aquarius";
    static SYMBOL_PISCES = "Pisces";

    static SYMBOL_SUN = "Sun";
    static SYMBOL_MOON = "Moon";
    static SYMBOL_MERCURY = "Mercury";
    static SYMBOL_VENUS = "Venus";
    static SYMBOL_EARTH = "Earth";
    static SYMBOL_MARS = "Mars";
    static SYMBOL_JUPITER = "Jupiter";
    static SYMBOL_SATURN = "Saturn";
    static SYMBOL_URANUS = "Uranus";
    static SYMBOL_NEPTUNE = "Neptune";
    static SYMBOL_PLUTO = "Pluto";
    static SYMBOL_CHIRON = "Chiron";
    static SYMBOL_LILITH = "Lilith";
    static SYMBOL_NNODE = "NNode";
    static SYMBOL_SNODE = "SNode";

    static SYMBOL_AS = "As";
    static SYMBOL_DS = "Ds";
    static SYMBOL_MC = "Mc";
    static SYMBOL_IC = "Ic";

    static SYMBOL_RETROGRADE = "Retrograde"

    static SYMBOL_CONJUNCTION = "Conjunction";
    static SYMBOL_OPPOSITION = "Opposition";
    static SYMBOL_SQUARE = "Square";
    static SYMBOL_TRINE = "Trine";
    static SYMBOL_SEXTILE = "Sextile";
    static SYMBOL_QUINCUNX = "Quincunx";
    static SYMBOL_SEMISEXTILE = "Semisextile";
    static SYMBOL_OCTILE = "Octile";
    static SYMBOL_TRIOCTILE = "Trioctile";
    static SYMBOL_QUINTILE = "Quintile";

    // Astronomicon font codes
    static SYMBOL_ARIES_CODE = "A";
    static SYMBOL_TAURUS_CODE = "B";
    static SYMBOL_GEMINI_CODE = "C";
    static SYMBOL_CANCER_CODE = "D";
    static SYMBOL_LEO_CODE = "E";
    static SYMBOL_VIRGO_CODE = "F";
    static SYMBOL_LIBRA_CODE = "G";
    static SYMBOL_SCORPIO_CODE = "H";
    static SYMBOL_SAGITTARIUS_CODE = "I";
    static SYMBOL_CAPRICORN_CODE = "J";
    static SYMBOL_AQUARIUS_CODE = "K";
    static SYMBOL_PISCES_CODE = "L";

    static SYMBOL_SUN_CODE = "Q";
    static SYMBOL_MOON_CODE = "R";
    static SYMBOL_MERCURY_CODE = "S";
    static SYMBOL_VENUS_CODE = "T";
    static SYMBOL_EARTH_CODE = ">";
    static SYMBOL_MARS_CODE = "U";
    static SYMBOL_JUPITER_CODE = "V";
    static SYMBOL_SATURN_CODE = "W";
    static SYMBOL_URANUS_CODE = "X";
    static SYMBOL_NEPTUNE_CODE = "Y";
    static SYMBOL_PLUTO_CODE = "Z";
    static SYMBOL_CHIRON_CODE = "q";
    static SYMBOL_LILITH_CODE = "z";
    static SYMBOL_NNODE_CODE = "g";
    static SYMBOL_SNODE_CODE = "i";

    static SYMBOL_AS_CODE = "c";
    static SYMBOL_DS_CODE = "f";
    static SYMBOL_MC_CODE = "d";
    static SYMBOL_IC_CODE = "e";

    static SYMBOL_RETROGRADE_CODE = "M"


    static SYMBOL_CONJUNCTION_CODE = "!";
    static SYMBOL_OPPOSITION_CODE = '"';
    static SYMBOL_SQUARE_CODE = "#";
    static SYMBOL_TRINE_CODE = "$";
    static SYMBOL_SEXTILE_CODE = "%";

    /**
     * Quincunx (Inconjunct)
     * @type {string}
     */
    static SYMBOL_QUINCUNX_CODE = "&";

    static SYMBOL_SEMISEXTILE_CODE = "'";

    /**
     * Semi-Square or Octile
     * @type {string}
     */
    static SYMBOL_OCTILE_CODE = "(";

    /**
     * Sesquiquadrate or Tri-Octile
     * @type {string}
     */
    static SYMBOL_TRIOCTILE_CODE = ")";


    constructor() {
        if (this instanceof SVGUtils) {
            throw Error('This is a static class and cannot be instantiated.');
        }
    }

    /**
     * Create a SVG document
     *
     * @static
     * @param {Number} width
     * @param {Number} height
     *
     * @return {SVGDocument}
     */
    static SVGDocument(width, height) {
        const svg = document.createElementNS(SVGUtils.SVG_NAMESPACE, "svg");
        svg.setAttribute('xmlns', SVGUtils.SVG_NAMESPACE);
        svg.setAttribute('version', "1.1");
        svg.setAttribute('viewBox', "0 0 " + width + " " + height);
        return svg
    }

    /**
     * Create a SVG group element
     *
     * @static
     * @return {SVGGroupElement}
     */
    static SVGGroup() {
        const g = document.createElementNS(SVGUtils.SVG_NAMESPACE, "g");
        return g
    }

    /**
     * Create a SVG path element
     *
     * @static
     * @return {SVGGroupElement}
     */
    static SVGPath() {
        const path = document.createElementNS(SVGUtils.SVG_NAMESPACE, "path");
        return path
    }

    /**
     * Create a SVG mask element
     *
     * @static
     * @param {String} elementID
     *
     * @return {SVGMaskElement}
     */
    static SVGMask(elementID) {
        const mask = document.createElementNS(SVGUtils.SVG_NAMESPACE, "mask");
        mask.setAttribute("id", elementID)
        return mask
    }

    /**
     * SVG circular sector
     *
     * @static
     * @param {int} x - circle x center position
     * @param {int} y - circle y center position
     * @param {int} radius - circle radius in px
     * @param {int} a1 - angleFrom in radians
     * @param {int} a2 - angleTo in radians
     * @param {int} thickness - from outside to center in px
     *
     * @return {SVGElement} segment
     */
    static SVGSegment(x, y, radius, a1, a2, thickness, lFlag, sFlag) {
        // @see SVG Path arc: https://www.w3.org/TR/SVG/paths.html#PathData
        const LARGE_ARC_FLAG = lFlag || 0;
        const SWEET_FLAG = sFlag || 0;

        const segment = document.createElementNS(SVGUtils.SVG_NAMESPACE, "path");
        segment.setAttribute("d", "M " + (x + thickness * Math.cos(a1)) + ", " + (y + thickness * Math.sin(a1)) + " l " + ((radius - thickness) * Math.cos(a1)) + ", " + ((radius - thickness) * Math.sin(a1)) + " A " + radius + ", " + radius + ",0 ," + LARGE_ARC_FLAG + ", " + SWEET_FLAG + ", " + (x + radius * Math.cos(a2)) + ", " + (y + radius * Math.sin(a2)) + " l " + ((radius - thickness) * -Math.cos(a2)) + ", " + ((radius - thickness) * -Math.sin(a2)) + " A " + thickness + ", " + thickness + ",0 ," + LARGE_ARC_FLAG + ", " + 1 + ", " + (x + thickness * Math.cos(a1)) + ", " + (y + thickness * Math.sin(a1)));
        segment.setAttribute("fill", "none");
        return segment;
    }

    /**
     * SVG circle
     *
     * @static
     * @param {int} cx
     * @param {int} cy
     * @param {int} radius
     *
     * @return {SVGElement} circle
     */
    static SVGCircle(cx, cy, radius) {
        const circle = document.createElementNS(SVGUtils.SVG_NAMESPACE, "circle");
        circle.setAttribute("cx", cx);
        circle.setAttribute("cy", cy);
        circle.setAttribute("r", radius);
        circle.setAttribute("fill", "none");
        return circle;
    }

    /**
     * SVG line
     *
     * @param {Number} x1
     * @param {Number} y2
     * @param {Number} x2
     * @param {Number} y2
     *
     * @return {SVGElement} line
     */
    static SVGLine(x1, y1, x2, y2) {
        const line = document.createElementNS(SVGUtils.SVG_NAMESPACE, "line");
        line.setAttribute("x1", x1);
        line.setAttribute("y1", y1);
        line.setAttribute("x2", x2);
        line.setAttribute("y2", y2);
        return line;
    }

    /**
     * SVG text
     *
     * @param {Number} x
     * @param {Number} y
     * @param {String} txt
     * @param {Number} [scale]
     *
     * @return {SVGElement} line
     */
    static SVGText(x, y, txt) {
        const text = document.createElementNS(SVGUtils.SVG_NAMESPACE, "text");
        text.setAttribute("x", x);
        text.setAttribute("y", y);
        text.setAttribute("stroke", "none");
        text.appendChild(document.createTextNode(txt));

        return text;
    }

    /**
     * SVG symbol
     *
     * @param {String} name
     * @param {Number} xPos
     * @param {Number} yPos
     *
     * @return {SVGElement}
     */
    static SVGSymbol(name, xPos, yPos) {
        switch (name) {
            case SVGUtils.SYMBOL_AS:
                return asSymbol(xPos, yPos)

            case SVGUtils.SYMBOL_DS:
                return dsSymbol(xPos, yPos)

            case SVGUtils.SYMBOL_MC:
                return mcSymbol(xPos, yPos)

            case SVGUtils.SYMBOL_IC:
                return icSymbol(xPos, yPos)

            case SVGUtils.SYMBOL_ARIES:
                return ariesSymbol(xPos, yPos)

            case SVGUtils.SYMBOL_TAURUS:
                return taurusSymbol(xPos, yPos)

            case SVGUtils.SYMBOL_GEMINI:
                return geminiSymbol(xPos, yPos)

            case SVGUtils.SYMBOL_CANCER:
                return cancerSymbol(xPos, yPos)

            case SVGUtils.SYMBOL_LEO:
                return leoSymbol(xPos, yPos)

            case SVGUtils.SYMBOL_VIRGO:
                return virgoSymbol(xPos, yPos)

            case SVGUtils.SYMBOL_LIBRA:
                return libraSymbol(xPos, yPos)

            case SVGUtils.SYMBOL_SCORPIO:
                return scorpioSymbol(xPos, yPos)

            case SVGUtils.SYMBOL_SAGITTARIUS:
                return sagittariusSymbol(xPos, yPos)

            case SVGUtils.SYMBOL_CAPRICORN:
                return capricornSymbol(xPos, yPos)

            case SVGUtils.SYMBOL_AQUARIUS:
                return aquariusSymbol(xPos, yPos)

            case SVGUtils.SYMBOL_PISCES:
                return piscesSymbol(xPos, yPos)


            case SVGUtils.SYMBOL_SUN:
                return sunSymbol(xPos, yPos)

            case SVGUtils.SYMBOL_MOON:
                return moonSymbol(xPos, yPos)

            case SVGUtils.SYMBOL_MERCURY:
                return mercurySymbol(xPos, yPos)

            case SVGUtils.SYMBOL_VENUS:
                return venusSymbol(xPos, yPos)

            case SVGUtils.SYMBOL_EARTH:
                return earthSymbol(xPos, yPos)

            case SVGUtils.SYMBOL_MARS:
                return marsSymbol(xPos, yPos)

            case SVGUtils.SYMBOL_JUPITER:
                return jupiterSymbol(xPos, yPos)

            case SVGUtils.SYMBOL_SATURN:
                return saturnSymbol(xPos, yPos)

            case SVGUtils.SYMBOL_URANUS:
                return uranusSymbol(xPos, yPos)

            case SVGUtils.SYMBOL_NEPTUNE:
                return neptuneSymbol(xPos, yPos)

            case SVGUtils.SYMBOL_PLUTO:
                return plutoSymbol(xPos, yPos)

            case SVGUtils.SYMBOL_CHIRON:
                return chironSymbol(xPos, yPos)

            case SVGUtils.SYMBOL_LILITH:
                return lilithSymbol(xPos, yPos)

            case SVGUtils.SYMBOL_NNODE:
                return nnodeSymbol(xPos, yPos)

            case SVGUtils.SYMBOL_SNODE:
                return snodeSymbol(xPos, yPos)


            case SVGUtils.SYMBOL_RETROGRADE:
                return retrogradeSymbol(xPos, yPos)


            case SVGUtils.SYMBOL_CONJUNCTION:
                return conjunctionSymbol(xPos, yPos)

            case SVGUtils.SYMBOL_OPPOSITION:
                return oppositionSymbol(xPos, yPos)

            case SVGUtils.SYMBOL_SQUARE:
                return squareSymbol(xPos, yPos)

            case SVGUtils.SYMBOL_TRINE:
                return trineSymbol(xPos, yPos)

            case SVGUtils.SYMBOL_SEXTILE:
                return sextileSymbol(xPos, yPos)

            case SVGUtils.SYMBOL_QUINCUNX:
                return quincunxSymbol(xPos, yPos)

            case SVGUtils.SYMBOL_SEMISEXTILE:
                return semisextileSymbol(xPos, yPos)

            case SVGUtils.SYMBOL_OCTILE:
                return quintileSymbol(xPos, yPos)

            case SVGUtils.SYMBOL_TRIOCTILE:
                return trioctileSymbol(xPos, yPos)

            case SVGUtils.SYMBOL_QUINTILE:
                return quintileSymbol(xPos, yPos)

            default:
                const unknownSymbol = SVGUtils.SVGCircle(xPos, yPos, 8)
                unknownSymbol.setAttribute("stroke", "#333")
                return unknownSymbol
        }

        /*
         * Ascendant symbol
         */
        function asSymbol(xPos, yPos) {
            return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_AS_CODE)
        }

        /*
         * Descendant symbol
         */
        function dsSymbol(xPos, yPos) {
            return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_DS_CODE)
        }

        /*
         * Medium coeli symbol
         */
        function mcSymbol(xPos, yPos) {
            return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_MC_CODE)
        }

        /*
         * Immum coeli symbol
         */
        function icSymbol(xPos, yPos) {
            return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_IC_CODE)
        }

        /*
         * Aries symbol
         */
        function ariesSymbol(xPos, yPos) {
            return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_ARIES_CODE)
        }

        /*
         * Taurus symbol
         */
        function taurusSymbol(xPos, yPos) {
            return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_TAURUS_CODE)
        }

        /*
         * Gemini symbol
         */
        function geminiSymbol(xPos, yPos) {
            return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_GEMINI_CODE)
        }

        /*
         * Cancer symbol
         */
        function cancerSymbol(xPos, yPos) {
            return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_CANCER_CODE)
        }

        /*
         * Leo symbol
         */
        function leoSymbol(xPos, yPos) {
            return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_LEO_CODE)
        }

        /*
         * Virgo symbol
         */
        function virgoSymbol(xPos, yPos) {
            return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_VIRGO_CODE)
        }

        /*
         * Libra symbol
         */
        function libraSymbol(xPos, yPos) {
            return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_LIBRA_CODE)
        }

        /*
         * Scorpio symbol
         */
        function scorpioSymbol(xPos, yPos) {
            return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_SCORPIO_CODE)
        }

        /*
         * Sagittarius symbol
         */
        function sagittariusSymbol(xPos, yPos) {
            return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_SAGITTARIUS_CODE)
        }

        /*
         * Capricorn symbol
         */
        function capricornSymbol(xPos, yPos) {
            return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_CAPRICORN_CODE)
        }

        /*
         * Aquarius symbol
         */
        function aquariusSymbol(xPos, yPos) {
            return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_AQUARIUS_CODE)
        }

        /*
         * Pisces symbol
         */
        function piscesSymbol(xPos, yPos) {
            return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_PISCES_CODE)
        }

        /*
         * Sun symbol
         */
        function sunSymbol(xPos, yPos) {
            return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_SUN_CODE)
        }

        /*
         * Moon symbol
         */
        function moonSymbol(xPos, yPos) {
            return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_MOON_CODE)
        }

        /*
         * Mercury symbol
         */
        function mercurySymbol(xPos, yPos) {
            return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_MERCURY_CODE)
        }

        /*
         * Venus symbol
         */
        function venusSymbol(xPos, yPos) {
            return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_VENUS_CODE)
        }

        /*
         * Earth symbol
         */
        function earthSymbol(xPos, yPos) {
            return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_EARTH_CODE)
        }

        /*
         * Mars symbol
         */
        function marsSymbol(xPos, yPos) {
            return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_MARS_CODE)
        }

        /*
         * Jupiter symbol
         */
        function jupiterSymbol(xPos, yPos) {
            return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_JUPITER_CODE)
        }

        /*
         * Saturn symbol
         */
        function saturnSymbol(xPos, yPos) {
            return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_SATURN_CODE)
        }

        /*
         * Uranus symbol
         */
        function uranusSymbol(xPos, yPos) {
            return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_URANUS_CODE)
        }

        /*
         * Neptune symbol
         */
        function neptuneSymbol(xPos, yPos) {
            return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_NEPTUNE_CODE)
        }

        /*
         * Pluto symbol
         */
        function plutoSymbol(xPos, yPos) {
            return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_PLUTO_CODE)
        }

        /*
         * Chiron symbol
         */
        function chironSymbol(xPos, yPos) {
            return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_CHIRON_CODE)
        }

        /*
         * Lilith symbol
         */
        function lilithSymbol(xPos, yPos) {
            return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_LILITH_CODE)
        }

        /*
         * NNode symbol
         */
        function nnodeSymbol(xPos, yPos) {
            return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_NNODE_CODE)
        }

        /*
         * SNode symbol
         */
        function snodeSymbol(xPos, yPos) {
            return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_SNODE_CODE)
        }

        /*
         * Retrograde symbol
         */
        function retrogradeSymbol(xPos, yPos) {
            return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_RETROGRADE_CODE)
        }

        /*
         * Conjunction symbol
         */
        function conjunctionSymbol(xPos, yPos) {
            return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_CONJUNCTION_CODE)
        }

        /*
         * Opposition symbol
         */
        function oppositionSymbol(xPos, yPos) {
            return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_OPPOSITION_CODE)
        }

        /*
         * Squaresymbol
         */
        function squareSymbol(xPos, yPos) {
            return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_SQUARE_CODE)
        }

        /*
         * Trine symbol
         */
        function trineSymbol(xPos, yPos) {
            return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_TRINE_CODE)
        }

        /*
         * Sextile symbol
         */
        function sextileSymbol(xPos, yPos) {
            return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_SEXTILE_CODE)
        }

        /*
         * Quincunx symbol
         */
        function quincunxSymbol(xPos, yPos) {
            return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_QUINCUNX_CODE)
        }

        /*
         * Semisextile symbol
         */
        function semisextileSymbol(xPos, yPos) {
            return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_SEMISEXTILE_CODE)
        }

        /*
         * Quintile symbol
         */
        function quintileSymbol(xPos, yPos) {
            return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_OCTILE_CODE)
        }

        /*
         * Trioctile symbol
         */
        function trioctileSymbol(xPos, yPos) {
            return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_TRIOCTILE_CODE)
        }
    }
}




/***/ }),

/***/ "./src/utils/Utils.js":
/*!****************************!*\
  !*** ./src/utils/Utils.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Utils)
/* harmony export */ });
/**
 * @class
 * @classdesc Utility class
 * @public
 * @static
 * @hideconstructor
 */
class Utils {

    constructor() {
        if (this instanceof Utils) {
            throw Error('This is a static class and cannot be instantiated.');
        }
    }

    static DEG_360 = 360
    static DEG_180 = 180
    static DEG_0 = 0

    /**
     * Generate random ID
     *
     * @static
     * @return {String}
     */
    static generateUniqueId = function () {
        const randomNumber = Math.random() * 1000000;
        const timestamp = Date.now();
        const uniqueId = `id_${randomNumber}_${timestamp}`;
        return uniqueId;
    }

    /**
     * Inverted degree to radian
     * @static
     *
     * @param {Number} angleIndegree
     * @param {Number} shiftInDegree
     * @return {Number}
     */
    static degreeToRadian = function (angleInDegree, shiftInDegree = 0) {
        return (shiftInDegree - angleInDegree) * Math.PI / 180
    }

    /**
     * Converts radian to degree
     * @static
     *
     * @param {Number} radian
     * @return {Number}
     */
    static radianToDegree = function (radian) {
        return (radian * 180 / Math.PI)
    }

    /**
     * Calculates a position of the point on the circle.
     *
     * @param {Number} cx - center x
     * @param {Number} cy - center y
     * @param {Number} radius - circle radius
     * @param {Number} angleInRadians
     *
     * @return {Object} - {x:Number, y:Number}
     */
    static positionOnCircle(cx, cy, radius, angleInRadians) {
        return {
            x: (radius * Math.cos(angleInRadians) + cx),
            y: (radius * Math.sin(angleInRadians) + cy)
        };
    }

    /**
     * Calculates the angle between the line (2 points) and the x-axis.
     *
     * @param {Number} x1
     * @param {Number} y1
     * @param {Number} x2
     * @param {Number} y2
     *
     * @return {Number} - degree
     */
    static positionToAngle(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const angleInRadians = Math.atan2(dy, dx);
        return Utils.radianToDegree(angleInRadians)
    }

    /**
     * Calculates new position of points on circle without overlapping each other
     *
     * @throws {Error} - If there is no place on the circle to place points.
     * @param {Array} points - [{name:"a", angle:10}, {name:"b", angle:20}]
     * @param {Number} collisionRadius - point radius
     * @param {Number} radius - circle radius
     *
     * @return {Object} - {"Moon":30, "Sun":60, "Mercury":86, ...}
     */
    static calculatePositionWithoutOverlapping(points, collisionRadius, circleRadius) {
        const STEP = 1 //degree

        const cellWidth = 10 //degree
        const numberOfCells = Utils.DEG_360 / cellWidth
        const frequency = new Array(numberOfCells).fill(0)
        for (const point of points) {
            const index = Math.floor(point.angle / cellWidth)
            frequency[index] += 1
        }

        // In this algorithm the order of points is crucial.
        // At that point in the circle, where the period changes in the circle (for instance:[358,359,0,1]), the points are arranged in incorrect order.
        // As a starting point, I try to find a place where there are no points. This place I use as START_ANGLE.
        const START_ANGLE = cellWidth * frequency.findIndex(count => count == 0)

        const _points = points.map(point => {
            return {
                name: point.name,
                angle: point.angle < START_ANGLE ? point.angle + Utils.DEG_360 : point.angle
            }
        })

        _points.sort((a, b) => {
            return a.angle - b.angle
        })

        // Recursive function
        const arrangePoints = () => {
            for (let i = 0, ln = _points.length; i < ln; i++) {
                const pointPosition = Utils.positionOnCircle(0, 0, circleRadius, Utils.degreeToRadian(_points[i].angle))
                _points[i].x = pointPosition.x
                _points[i].y = pointPosition.y

                for (let j = 0; j < i; j++) {
                    const distance = Math.sqrt(Math.pow(_points[i].x - _points[j].x, 2) + Math.pow(_points[i].y - _points[j].y, 2));
                    if (distance < (2 * collisionRadius)) {
                        _points[i].angle += STEP
                        _points[j].angle -= STEP
                        arrangePoints() //======> Recursive call
                    }
                }
            }
        }

        arrangePoints()

        return _points.reduce((accumulator, point, currentIndex) => {
            accumulator[point.name] = point.angle
            return accumulator
        }, {})
    }

    /**
     * Check if the angle collides with the points
     *
     * @param {Number} angle
     * @param {Array} anglesList
     * @param {Number} [collisionRadius]
     *
     * @return {Boolean}
     */
    static isCollision(angle, anglesList, collisionRadius = 10) {

        const pointInCollision = anglesList.find(point => {

            let a = (point - angle) > Utils.DEG_180 ? angle + Utils.DEG_360 : angle
            let p = (angle - point) > Utils.DEG_180 ? point + Utils.DEG_360 : point

            return Math.abs(a - p) <= collisionRadius
        })

        return pointInCollision === undefined ? false : true
    }


    /**
     * Removes the content of an element
     *
     * @param {String} elementID
     * @param {Function} [beforeHook]
     *
     * @warning - It removes Event Listeners too.
     * @warning - You will (probably) get memory leak if you delete elements that have attached listeners
     */
    static cleanUp(elementID, beforeHook) {
        let elm = document.getElementById(elementID)
        if (! elm) {
            return
        }

        (typeof beforeHook === 'function') && beforeHook()

        elm.innerHTML = ""
    }


    /**
     * Simple code for config based template strings
     *
     * @param templateString
     * @param templateVars
     * @returns {*}
     */
    static fillTemplate = function (templateString, templateVars) {
        let func = new Function(...Object.keys(templateVars), "return `" + templateString + "`;")
        return func(...Object.values(templateVars));
    }
}






/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RadixChart: () => (/* reexport safe */ _charts_RadixChart_js__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   SVGUtils: () => (/* reexport safe */ _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   TransitChart: () => (/* reexport safe */ _charts_TransitChart_js__WEBPACK_IMPORTED_MODULE_4__["default"]),
/* harmony export */   Universe: () => (/* reexport safe */ _universe_Universe_js__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   Utils: () => (/* reexport safe */ _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"])
/* harmony export */ });
/* harmony import */ var _universe_Universe_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./universe/Universe.js */ "./src/universe/Universe.js");
/* harmony import */ var _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/SVGUtils.js */ "./src/utils/SVGUtils.js");
/* harmony import */ var _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/Utils.js */ "./src/utils/Utils.js");
/* harmony import */ var _charts_RadixChart_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./charts/RadixChart.js */ "./src/charts/RadixChart.js");
/* harmony import */ var _charts_TransitChart_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./charts/TransitChart.js */ "./src/charts/TransitChart.js");








})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUSxrREFBa0Q7QUFDMUQsUUFBUSxtREFBbUQ7QUFDM0QsUUFBUSw4Q0FBOEM7QUFDdEQsUUFBUSw4Q0FBOEM7QUFDdEQsUUFBUSwrQ0FBK0M7QUFDdkQ7QUFDQTtBQUNBO0FBQ0EsUUFBUSxrQ0FBa0M7QUFDMUMsUUFBUSxvQ0FBb0M7QUFDNUMsUUFBUSxpQ0FBaUM7QUFDekMsUUFBUSxtQ0FBbUM7QUFDM0MsUUFBUSxtQ0FBbUM7QUFDM0M7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNPO0FBQ1AsS0FBSyxrREFBa0Q7QUFDdkQsS0FBSyxtREFBbUQ7QUFDeEQsS0FBSyw4Q0FBOEM7QUFDbkQsS0FBSyw4Q0FBOEM7QUFDbkQsS0FBSywrQ0FBK0M7O0FBRXBEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMxREE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0T0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBLDBEQUEwRCxNQUFNO0FBQ2hFLFVBQVU7QUFDVjtBQUNPLDBCQUEwQixNQUFNOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM1R3ZDO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7Ozs7Ozs7Ozs7Ozs7OztBQ3RDUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2RQO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFT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SztBQUNwQjtBQUNBLGdCQUFnQixZQUFZO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsS0FBSztBQUNwQixlQUFlLEtBQUs7QUFDcEIsZUFBZSxLQUFLO0FBQ3BCO0FBQ0EsZ0JBQWdCLFlBQVk7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsUUFBUTtBQUN2QixlQUFlLFFBQVE7QUFDdkIsZUFBZSxRQUFRO0FBQ3ZCLGVBQWUsUUFBUTtBQUN2QjtBQUNBLGdCQUFnQixZQUFZO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFFBQVE7QUFDdkIsZUFBZSxRQUFRO0FBQ3ZCLGVBQWUsUUFBUTtBQUN2QixlQUFlLFFBQVE7QUFDdkI7QUFDQSxnQkFBZ0IsWUFBWTtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsUUFBUTtBQUN2QixlQUFlLFFBQVE7QUFDdkIsZUFBZSxRQUFRO0FBQ3ZCO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNB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QUFlLFVBQVU7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBLCtGQUErRjtBQUMvRjtBQUNBO0FBQ0E7OztBQU1DOzs7Ozs7OztVQ3JORDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNONkM7QUFDSDtBQUNOO0FBQ1c7QUFDSTs7QUFFUyIsInNvdXJjZXMiOlsid2VicGFjazovL2FzdHJvbG9neS93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL2NoYXJ0cy9DaGFydC5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvY2hhcnRzL1JhZGl4Q2hhcnQuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL2NoYXJ0cy9UcmFuc2l0Q2hhcnQuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL3BvaW50cy9Qb2ludC5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvc2V0dGluZ3MvRGVmYXVsdFNldHRpbmdzLmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy9zZXR0aW5ncy9jb25zdGFudHMvQXNwZWN0cy5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvc2V0dGluZ3MvY29uc3RhbnRzL0NvbG9ycy5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvc2V0dGluZ3MvY29uc3RhbnRzL1BvaW50LmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy9zZXR0aW5ncy9jb25zdGFudHMvUmFkaXguanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL3NldHRpbmdzL2NvbnN0YW50cy9UcmFuc2l0LmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy9zZXR0aW5ncy9jb25zdGFudHMvVW5pdmVyc2UuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL3VuaXZlcnNlL1VuaXZlcnNlLmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy91dGlscy9Bc3BlY3RVdGlscy5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvdXRpbHMvU1ZHVXRpbHMuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL3V0aWxzL1V0aWxzLmpzIiwid2VicGFjazovL2FzdHJvbG9neS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2FzdHJvbG9neS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2FzdHJvbG9neS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJhc3Ryb2xvZ3lcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiYXN0cm9sb2d5XCJdID0gZmFjdG9yeSgpO1xufSkoc2VsZiwgKCkgPT4ge1xucmV0dXJuICIsImltcG9ydCBVdGlscyBmcm9tICcuLi91dGlscy9VdGlscy5qcyc7XG5cbi8qKlxuICogQGNsYXNzXG4gKiBAY2xhc3NkZXNjIEFuIGFic3RyYWN0IGNsYXNzIGZvciBhbGwgdHlwZSBvZiBDaGFydFxuICogQHB1YmxpY1xuICogQGhpZGVjb25zdHJ1Y3RvclxuICogQGFic3RyYWN0XG4gKi9cbmNsYXNzIENoYXJ0IHtcblxuICAvLyNzZXR0aW5nc1xuXG4gIC8qKlxuICAgKiBAY29uc3RydWN0c1xuICAgKiBAcGFyYW0ge09iamVjdH0gc2V0dGluZ3NcbiAgICovXG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzKSB7XG4gICAgLy90aGlzLiNzZXR0aW5ncyA9IHNldHRpbmdzXG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhlIGRhdGEgaXMgdmFsaWRcbiAgICogQHRocm93cyB7RXJyb3J9IC0gaWYgdGhlIGRhdGEgaXMgdW5kZWZpbmVkLlxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICAgKiBAcmV0dXJuIHtPYmplY3R9IC0ge2lzVmFsaWQ6Ym9vbGVhbiwgbWVzc2FnZTpTdHJpbmd9XG4gICAqL1xuICB2YWxpZGF0ZURhdGEoZGF0YSkge1xuICAgIGlmICghZGF0YSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTWlzaW5nIHBhcmFtIGRhdGEuXCIpXG4gICAgfVxuXG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGRhdGEucG9pbnRzKSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaXNWYWxpZDogZmFsc2UsXG4gICAgICAgIG1lc3NhZ2U6IFwicG9pbnRzIGlzIG5vdCBBcnJheS5cIlxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghQXJyYXkuaXNBcnJheShkYXRhLmN1c3BzKSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaXNWYWxpZDogZmFsc2UsXG4gICAgICAgIG1lc3NhZ2U6IFwiY3VwcyBpcyBub3QgQXJyYXkuXCJcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZGF0YS5jdXNwcy5sZW5ndGggIT09IDEyKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpc1ZhbGlkOiBmYWxzZSxcbiAgICAgICAgbWVzc2FnZTogXCJjdXNwcy5sZW5ndGggIT09IDEyXCJcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGxldCBwb2ludCBvZiBkYXRhLnBvaW50cykge1xuICAgICAgaWYgKHR5cGVvZiBwb2ludC5uYW1lICE9PSAnc3RyaW5nJykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGlzVmFsaWQ6IGZhbHNlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwicG9pbnQubmFtZSAhPT0gJ3N0cmluZydcIlxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAocG9pbnQubmFtZS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBpc1ZhbGlkOiBmYWxzZSxcbiAgICAgICAgICBtZXNzYWdlOiBcInBvaW50Lm5hbWUubGVuZ3RoID09IDBcIlxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIHBvaW50LmFuZ2xlICE9PSAnbnVtYmVyJykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGlzVmFsaWQ6IGZhbHNlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwicG9pbnQuYW5nbGUgIT09ICdudW1iZXInXCJcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAobGV0IGN1c3Agb2YgZGF0YS5jdXNwcykge1xuICAgICAgaWYgKHR5cGVvZiBjdXNwLmFuZ2xlICE9PSAnbnVtYmVyJykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGlzVmFsaWQ6IGZhbHNlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiY3VzcC5hbmdsZSAhPT0gJ251bWJlcidcIlxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGlzVmFsaWQ6IHRydWUsXG4gICAgICBtZXNzYWdlOiBcIlwiXG4gICAgfVxuICB9XG4gIFxuICAvKipcbiAgICogQGFic3RyYWN0XG4gICAqL1xuICBzZXREYXRhKGRhdGEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJNdXN0IGJlIGltcGxlbWVudGVkIGJ5IHN1YmNsYXNzLlwiKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAYWJzdHJhY3RcbiAgICovXG4gIGdldFBvaW50cygpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJNdXN0IGJlIGltcGxlbWVudGVkIGJ5IHN1YmNsYXNzLlwiKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAYWJzdHJhY3RcbiAgICovXG4gIGdldFBvaW50KG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJNdXN0IGJlIGltcGxlbWVudGVkIGJ5IHN1YmNsYXNzLlwiKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAYWJzdHJhY3RcbiAgICovXG4gIGFuaW1hdGVUbyhkYXRhKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiTXVzdCBiZSBpbXBsZW1lbnRlZCBieSBzdWJjbGFzcy5cIik7XG4gIH1cblxuICAvLyAjIyBQUk9URUNURUQgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbn1cblxuZXhwb3J0IHtcbiAgQ2hhcnQgYXNcbiAgZGVmYXVsdFxufVxuIiwiaW1wb3J0IFVuaXZlcnNlIGZyb20gJy4uL3VuaXZlcnNlL1VuaXZlcnNlLmpzJztcbmltcG9ydCBTVkdVdGlscyBmcm9tICcuLi91dGlscy9TVkdVdGlscy5qcyc7XG5pbXBvcnQgVXRpbHMgZnJvbSAnLi4vdXRpbHMvVXRpbHMuanMnO1xuaW1wb3J0IEFzcGVjdFV0aWxzIGZyb20gJy4uL3V0aWxzL0FzcGVjdFV0aWxzLmpzJztcbmltcG9ydCBDaGFydCBmcm9tICcuL0NoYXJ0LmpzJ1xuaW1wb3J0IFBvaW50IGZyb20gJy4uL3BvaW50cy9Qb2ludC5qcydcbmltcG9ydCBEZWZhdWx0U2V0dGluZ3MgZnJvbSAnLi4vc2V0dGluZ3MvRGVmYXVsdFNldHRpbmdzLmpzJztcblxuLyoqXG4gKiBAY2xhc3NcbiAqIEBjbGFzc2Rlc2MgUG9pbnRzIGFuZCBjdXBzIGFyZSBkaXNwbGF5ZWQgaW5zaWRlIHRoZSBVbml2ZXJzZS5cbiAqIEBwdWJsaWNcbiAqIEBleHRlbmRzIHtDaGFydH1cbiAqL1xuY2xhc3MgUmFkaXhDaGFydCBleHRlbmRzIENoYXJ0IHtcblxuICAgIC8qXG4gICAgICogTGV2ZWxzIGRldGVybWluZSB0aGUgd2lkdGggb2YgaW5kaXZpZHVhbCBwYXJ0cyBvZiB0aGUgY2hhcnQuXG4gICAgICogSXQgY2FuIGJlIGNoYW5nZWQgZHluYW1pY2FsbHkgYnkgcHVibGljIHNldHRlci5cbiAgICAgKi9cbiAgICAjbnVtYmVyT2ZMZXZlbHMgPSAyNFxuXG4gICAgI3VuaXZlcnNlXG4gICAgI3NldHRpbmdzXG4gICAgI3Jvb3RcbiAgICAjZGF0YVxuXG4gICAgI2NlbnRlclhcbiAgICAjY2VudGVyWVxuICAgICNyYWRpdXNcblxuICAgIC8qXG4gICAgICogQHNlZSBVdGlscy5jbGVhblVwKClcbiAgICAgKi9cbiAgICAjYmVmb3JlQ2xlYW5VcEhvb2tcblxuICAgIC8qKlxuICAgICAqIEBjb25zdHJ1Y3RzXG4gICAgICogQHBhcmFtIHtVbml2ZXJzZX0gVW5pdmVyc2VcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcih1bml2ZXJzZSkge1xuXG4gICAgICAgIGlmICghIHVuaXZlcnNlIGluc3RhbmNlb2YgVW5pdmVyc2UpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQmFkIHBhcmFtIHVuaXZlcnNlLicpXG4gICAgICAgIH1cblxuICAgICAgICBzdXBlcih1bml2ZXJzZS5nZXRTZXR0aW5ncygpKVxuXG4gICAgICAgIHRoaXMuI3VuaXZlcnNlID0gdW5pdmVyc2VcbiAgICAgICAgdGhpcy4jc2V0dGluZ3MgPSB0aGlzLiN1bml2ZXJzZS5nZXRTZXR0aW5ncygpXG4gICAgICAgIHRoaXMuI2NlbnRlclggPSB0aGlzLiNzZXR0aW5ncy5DSEFSVF9WSUVXQk9YX1dJRFRIIC8gMlxuICAgICAgICB0aGlzLiNjZW50ZXJZID0gdGhpcy4jc2V0dGluZ3MuQ0hBUlRfVklFV0JPWF9IRUlHSFQgLyAyXG4gICAgICAgIHRoaXMuI3JhZGl1cyA9IE1hdGgubWluKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclkpIC0gdGhpcy4jc2V0dGluZ3MuQ0hBUlRfUEFERElOR1xuICAgICAgICB0aGlzLiNyb290ID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuICAgICAgICB0aGlzLiNyb290LnNldEF0dHJpYnV0ZShcImlkXCIsIGAke3RoaXMuI3NldHRpbmdzLkhUTUxfRUxFTUVOVF9JRH0tJHt0aGlzLiNzZXR0aW5ncy5SQURJWF9JRH1gKVxuICAgICAgICB0aGlzLiN1bml2ZXJzZS5nZXRTVkdEb2N1bWVudCgpLmFwcGVuZENoaWxkKHRoaXMuI3Jvb3QpO1xuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0IGNoYXJ0IGRhdGFcbiAgICAgKiBAdGhyb3dzIHtFcnJvcn0gLSBpZiB0aGUgZGF0YSBpcyBub3QgdmFsaWQuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGRhdGFcbiAgICAgKiBAcmV0dXJuIHtSYWRpeENoYXJ0fVxuICAgICAqL1xuICAgIHNldERhdGEoZGF0YSkge1xuICAgICAgICBsZXQgc3RhdHVzID0gdGhpcy52YWxpZGF0ZURhdGEoZGF0YSlcbiAgICAgICAgaWYgKCEgc3RhdHVzLmlzVmFsaWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihzdGF0dXMubWVzc2FnZSlcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuI2RhdGEgPSBkYXRhXG4gICAgICAgIHRoaXMuI2RyYXcoZGF0YSlcblxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBkYXRhXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIGdldERhdGEoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBcInBvaW50c1wiOiBbLi4udGhpcy4jZGF0YS5wb2ludHNdLFxuICAgICAgICAgICAgXCJjdXNwc1wiOiBbLi4udGhpcy4jZGF0YS5jdXNwc11cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldCBudW1iZXIgb2YgTGV2ZWxzLlxuICAgICAqIExldmVscyBkZXRlcm1pbmUgdGhlIHdpZHRoIG9mIGluZGl2aWR1YWwgcGFydHMgb2YgdGhlIGNoYXJ0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9XG4gICAgICovXG4gICAgc2V0TnVtYmVyT2ZMZXZlbHMobGV2ZWxzKSB7XG4gICAgICAgIHRoaXMuI251bWJlck9mTGV2ZWxzID0gTWF0aC5tYXgoMjQsIGxldmVscylcbiAgICAgICAgaWYgKHRoaXMuI2RhdGEpIHtcbiAgICAgICAgICAgIHRoaXMuI2RyYXcodGhpcy4jZGF0YSlcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHJhZGl1c1xuICAgICAqIEByZXR1cm4ge051bWJlcn1cbiAgICAgKi9cbiAgICBnZXRSYWRpdXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiNyYWRpdXNcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgcmFkaXVzXG4gICAgICogQHJldHVybiB7TnVtYmVyfVxuICAgICAqL1xuICAgIGdldE91dGVyQ2lyY2xlUmFkaXVzKCkge1xuICAgICAgICByZXR1cm4gMjQgKiAodGhpcy5nZXRSYWRpdXMoKSAvIHRoaXMuI251bWJlck9mTGV2ZWxzKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCByYWRpdXNcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAgICovXG4gICAgZ2V0SW5uZXJDaXJjbGVSYWRpdXMoKSB7XG4gICAgICAgIHJldHVybiAyMSAqICh0aGlzLmdldFJhZGl1cygpIC8gdGhpcy4jbnVtYmVyT2ZMZXZlbHMpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHJhZGl1c1xuICAgICAqIEByZXR1cm4ge051bWJlcn1cbiAgICAgKi9cbiAgICBnZXRSdWxsZXJDaXJjbGVSYWRpdXMoKSB7XG4gICAgICAgIHJldHVybiAyMCAqICh0aGlzLmdldFJhZGl1cygpIC8gdGhpcy4jbnVtYmVyT2ZMZXZlbHMpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHJhZGl1c1xuICAgICAqIEByZXR1cm4ge051bWJlcn1cbiAgICAgKi9cbiAgICBnZXRQb2ludENpcmNsZVJhZGl1cygpIHtcbiAgICAgICAgcmV0dXJuIDE4ICogKHRoaXMuZ2V0UmFkaXVzKCkgLyB0aGlzLiNudW1iZXJPZkxldmVscylcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgcmFkaXVzXG4gICAgICogQHJldHVybiB7TnVtYmVyfVxuICAgICAqL1xuICAgIGdldENlbnRlckNpcmNsZVJhZGl1cygpIHtcbiAgICAgICAgcmV0dXJuIDEyICogKHRoaXMuZ2V0UmFkaXVzKCkgLyB0aGlzLiNudW1iZXJPZkxldmVscylcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgVW5pdmVyc2VcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1VuaXZlcnNlfVxuICAgICAqL1xuICAgIGdldFVuaXZlcnNlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy4jdW5pdmVyc2VcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgQXNjZW5kYXQgc2hpZnRcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge051bWJlcn1cbiAgICAgKi9cbiAgICBnZXRBc2NlbmRhbnRTaGlmdCgpIHtcbiAgICAgICAgcmV0dXJuICh0aGlzLiNkYXRhPy5jdXNwc1swXT8uYW5nbGUgPz8gMCkgKyBVdGlscy5ERUdfMTgwXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IGFzcGVjdHNcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gW2Zyb21Qb2ludHNdIC0gW3tuYW1lOlwiTW9vblwiLCBhbmdsZTowfSwge25hbWU6XCJTdW5cIiwgYW5nbGU6MTc5fSwge25hbWU6XCJNZXJjdXJ5XCIsIGFuZ2xlOjEyMX1dXG4gICAgICogQHBhcmFtIHtBcnJheTxPYmplY3Q+fSBbdG9Qb2ludHNdIC0gW3tuYW1lOlwiQVNcIiwgYW5nbGU6MH0sIHtuYW1lOlwiSUNcIiwgYW5nbGU6OTB9XVxuICAgICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gW2FzcGVjdHNdIC0gW3tuYW1lOlwiT3Bwb3NpdGlvblwiLCBhbmdsZToxODAsIG9yYjoyfSwge25hbWU6XCJUcmluZVwiLCBhbmdsZToxMjAsIG9yYjoyfV1cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge0FycmF5PE9iamVjdD59XG4gICAgICovXG4gICAgZ2V0QXNwZWN0cyhmcm9tUG9pbnRzLCB0b1BvaW50cywgYXNwZWN0cykge1xuICAgICAgICBpZiAoISB0aGlzLiNkYXRhKSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGZyb21Qb2ludHMgPSBmcm9tUG9pbnRzID8/IHRoaXMuI2RhdGEucG9pbnRzLmZpbHRlcih4ID0+IFwiYXNwZWN0XCIgaW4geCA/IHguYXNwZWN0IDogdHJ1ZSlcbiAgICAgICAgdG9Qb2ludHMgPSB0b1BvaW50cyA/PyBbLi4udGhpcy4jZGF0YS5wb2ludHMuZmlsdGVyKHggPT4gXCJhc3BlY3RcIiBpbiB4ID8geC5hc3BlY3QgOiB0cnVlKSwgLi4udGhpcy4jZGF0YS5jdXNwcy5maWx0ZXIoeCA9PiB4LmFzcGVjdCldXG4gICAgICAgIGFzcGVjdHMgPSBhc3BlY3RzID8/IHRoaXMuI3NldHRpbmdzLkRFRkFVTFRfQVNQRUNUUyA/PyBEZWZhdWx0U2V0dGluZ3MuREVGQVVMVF9BU1BFQ1RTXG5cbiAgICAgICAgcmV0dXJuIEFzcGVjdFV0aWxzLmdldEFzcGVjdHMoZnJvbVBvaW50cywgdG9Qb2ludHMsIGFzcGVjdHMpLmZpbHRlcihhc3BlY3QgPT4gYXNwZWN0LmZyb20ubmFtZSAhPSBhc3BlY3QudG8ubmFtZSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEcmF3IGFzcGVjdHNcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gW2Zyb21Qb2ludHNdIC0gW3tuYW1lOlwiTW9vblwiLCBhbmdsZTowfSwge25hbWU6XCJTdW5cIiwgYW5nbGU6MTc5fSwge25hbWU6XCJNZXJjdXJ5XCIsIGFuZ2xlOjEyMX1dXG4gICAgICogQHBhcmFtIHtBcnJheTxPYmplY3Q+fSBbdG9Qb2ludHNdIC0gW3tuYW1lOlwiQVNcIiwgYW5nbGU6MH0sIHtuYW1lOlwiSUNcIiwgYW5nbGU6OTB9XVxuICAgICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gW2FzcGVjdHNdIC0gW3tuYW1lOlwiT3Bwb3NpdGlvblwiLCBhbmdsZToxODAsIG9yYjoyfSwge25hbWU6XCJUcmluZVwiLCBhbmdsZToxMjAsIG9yYjoyfV1cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge0FycmF5PE9iamVjdD59XG4gICAgICovXG4gICAgZHJhd0FzcGVjdHMoZnJvbVBvaW50cywgdG9Qb2ludHMsIGFzcGVjdHMpIHtcbiAgICAgICAgY29uc3QgYXNwZWN0c1dyYXBwZXIgPSB0aGlzLiN1bml2ZXJzZS5nZXRBc3BlY3RzRWxlbWVudCgpXG4gICAgICAgIFV0aWxzLmNsZWFuVXAoYXNwZWN0c1dyYXBwZXIuZ2V0QXR0cmlidXRlKFwiaWRcIiksIHRoaXMuI2JlZm9yZUNsZWFuVXBIb29rKVxuXG4gICAgICAgIGNvbnN0IGFzcGVjdHNMaXN0ID0gdGhpcy5nZXRBc3BlY3RzKGZyb21Qb2ludHMsIHRvUG9pbnRzLCBhc3BlY3RzKVxuICAgICAgICAgICAgLnJlZHVjZSgoYXJyLCBhc3BlY3QpID0+IHtcblxuICAgICAgICAgICAgICAgIGxldCBpc1RoZVNhbWUgPSBhcnIuc29tZShlbG0gPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZWxtLmZyb20ubmFtZSA9PSBhc3BlY3QudG8ubmFtZSAmJiBlbG0udG8ubmFtZSA9PSBhc3BlY3QuZnJvbS5uYW1lXG4gICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgIGlmICghIGlzVGhlU2FtZSkge1xuICAgICAgICAgICAgICAgICAgICBhcnIucHVzaChhc3BlY3QpXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFyclxuICAgICAgICAgICAgfSwgW10pXG4gICAgICAgICAgICAuZmlsdGVyKGFzcGVjdCA9PiBhc3BlY3QuYXNwZWN0Lm5hbWUgIT0gJ0Nvbmp1bmN0aW9uJylcblxuICAgICAgICBjb25zdCBjaXJjbGUgPSBTVkdVdGlscy5TVkdDaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy5nZXRDZW50ZXJDaXJjbGVSYWRpdXMoKSlcbiAgICAgICAgY2lyY2xlLnNldEF0dHJpYnV0ZSgnZmlsbCcsIHRoaXMuI3NldHRpbmdzLkFTUEVDVFNfQkFDS0dST1VORF9DT0xPUilcbiAgICAgICAgYXNwZWN0c1dyYXBwZXIuYXBwZW5kQ2hpbGQoY2lyY2xlKVxuXG4gICAgICAgIGFzcGVjdHNXcmFwcGVyLmFwcGVuZENoaWxkKEFzcGVjdFV0aWxzLmRyYXdBc3BlY3RzKHRoaXMuZ2V0Q2VudGVyQ2lyY2xlUmFkaXVzKCksIHRoaXMuZ2V0QXNjZW5kYW50U2hpZnQoKSwgdGhpcy4jc2V0dGluZ3MsIGFzcGVjdHNMaXN0KSlcblxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIC8vICMjIFBSSVZBVEUgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiAgICAvKlxuICAgICAqIERyYXcgcmFkaXggY2hhcnRcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICAgICAqL1xuICAgICNkcmF3KGRhdGEpIHtcbiAgICAgICAgVXRpbHMuY2xlYW5VcCh0aGlzLiNyb290LmdldEF0dHJpYnV0ZSgnaWQnKSwgdGhpcy4jYmVmb3JlQ2xlYW5VcEhvb2spXG4gICAgICAgIHRoaXMuI2RyYXdCYWNrZ3JvdW5kKClcbiAgICAgICAgdGhpcy4jZHJhd0FzdHJvbG9naWNhbFNpZ25zKClcbiAgICAgICAgdGhpcy4jZHJhd1BvaW50cyhkYXRhKVxuICAgICAgICB0aGlzLiNkcmF3Q3VzcHMoZGF0YSlcbiAgICAgICAgdGhpcy4jZHJhd1J1bGVyKClcbiAgICAgICAgdGhpcy4jZHJhd0JvcmRlcnMoKVxuICAgICAgICB0aGlzLiNzZXR0aW5ncy5DSEFSVF9EUkFXX01BSU5fQVhJUyAmJiB0aGlzLiNkcmF3TWFpbkF4aXNEZXNjcmlwdGlvbihkYXRhKVxuICAgICAgICB0aGlzLiNzZXR0aW5ncy5EUkFXX0FTUEVDVFMgJiYgdGhpcy5kcmF3QXNwZWN0cygpXG4gICAgfVxuXG4gICAgI2RyYXdCYWNrZ3JvdW5kKCkge1xuICAgICAgICBjb25zdCBNQVNLX0lEID0gYCR7dGhpcy4jc2V0dGluZ3MuSFRNTF9FTEVNRU5UX0lEfS0ke3RoaXMuI3NldHRpbmdzLlJBRElYX0lEfS1iYWNrZ3JvdW5kLW1hc2stMWBcblxuICAgICAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuXG4gICAgICAgIGNvbnN0IG1hc2sgPSBTVkdVdGlscy5TVkdNYXNrKE1BU0tfSUQpXG4gICAgICAgIGNvbnN0IG91dGVyQ2lyY2xlID0gU1ZHVXRpbHMuU1ZHQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuZ2V0UmFkaXVzKCkpXG4gICAgICAgIG91dGVyQ2lyY2xlLnNldEF0dHJpYnV0ZSgnZmlsbCcsIFwid2hpdGVcIilcbiAgICAgICAgbWFzay5hcHBlbmRDaGlsZChvdXRlckNpcmNsZSlcblxuICAgICAgICBjb25zdCBpbm5lckNpcmNsZSA9IFNWR1V0aWxzLlNWR0NpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLmdldENlbnRlckNpcmNsZVJhZGl1cygpKVxuICAgICAgICBpbm5lckNpcmNsZS5zZXRBdHRyaWJ1dGUoJ2ZpbGwnLCBcImJsYWNrXCIpXG4gICAgICAgIG1hc2suYXBwZW5kQ2hpbGQoaW5uZXJDaXJjbGUpXG4gICAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQobWFzaylcblxuICAgICAgICBjb25zdCBjaXJjbGUgPSBTVkdVdGlscy5TVkdDaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy5nZXRSYWRpdXMoKSlcbiAgICAgICAgY2lyY2xlLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFX09OTFkgPyBcIm5vbmVcIiA6IHRoaXMuI3NldHRpbmdzLlBMQU5FVFNfQkFDS0dST1VORF9DT0xPUik7XG4gICAgICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJtYXNrXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRV9PTkxZID8gXCJub25lXCIgOiBgdXJsKCMke01BU0tfSUR9KWApO1xuICAgICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGNpcmNsZSlcblxuICAgICAgICB0aGlzLiNyb290LmFwcGVuZENoaWxkKHdyYXBwZXIpXG4gICAgfVxuXG4gICAgI2RyYXdBc3Ryb2xvZ2ljYWxTaWducygpIHtcbiAgICAgICAgY29uc3QgTlVNQkVSX09GX0FTVFJPTE9HSUNBTF9TSUdOUyA9IDEyXG4gICAgICAgIGNvbnN0IFNURVAgPSAzMCAvL2RlZ3JlZVxuICAgICAgICBjb25zdCBDT0xPUlNfU0lHTlMgPSBbdGhpcy4jc2V0dGluZ3MuQ09MT1JfQVJJRVMsIHRoaXMuI3NldHRpbmdzLkNPTE9SX1RBVVJVUywgdGhpcy4jc2V0dGluZ3MuQ09MT1JfR0VNSU5JLCB0aGlzLiNzZXR0aW5ncy5DT0xPUl9DQU5DRVIsIHRoaXMuI3NldHRpbmdzLkNPTE9SX0xFTywgdGhpcy4jc2V0dGluZ3MuQ09MT1JfVklSR08sIHRoaXMuI3NldHRpbmdzLkNPTE9SX0xJQlJBLCB0aGlzLiNzZXR0aW5ncy5DT0xPUl9TQ09SUElPLCB0aGlzLiNzZXR0aW5ncy5DT0xPUl9TQUdJVFRBUklVUywgdGhpcy4jc2V0dGluZ3MuQ09MT1JfQ0FQUklDT1JOLCB0aGlzLiNzZXR0aW5ncy5DT0xPUl9BUVVBUklVUywgdGhpcy4jc2V0dGluZ3MuQ09MT1JfUElTQ0VTXVxuICAgICAgICBjb25zdCBTWU1CT0xfU0lHTlMgPSBbU1ZHVXRpbHMuU1lNQk9MX0FSSUVTLCBTVkdVdGlscy5TWU1CT0xfVEFVUlVTLCBTVkdVdGlscy5TWU1CT0xfR0VNSU5JLCBTVkdVdGlscy5TWU1CT0xfQ0FOQ0VSLCBTVkdVdGlscy5TWU1CT0xfTEVPLCBTVkdVdGlscy5TWU1CT0xfVklSR08sIFNWR1V0aWxzLlNZTUJPTF9MSUJSQSwgU1ZHVXRpbHMuU1lNQk9MX1NDT1JQSU8sIFNWR1V0aWxzLlNZTUJPTF9TQUdJVFRBUklVUywgU1ZHVXRpbHMuU1lNQk9MX0NBUFJJQ09STiwgU1ZHVXRpbHMuU1lNQk9MX0FRVUFSSVVTLCBTVkdVdGlscy5TWU1CT0xfUElTQ0VTXVxuXG4gICAgICAgIGNvbnN0IG1ha2VTeW1ib2wgPSAoc3ltYm9sSW5kZXgsIGFuZ2xlSW5EZWdyZWUpID0+IHtcbiAgICAgICAgICAgIGxldCBwb3NpdGlvbiA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy5nZXRPdXRlckNpcmNsZVJhZGl1cygpIC0gKCh0aGlzLmdldE91dGVyQ2lyY2xlUmFkaXVzKCkgLSB0aGlzLmdldElubmVyQ2lyY2xlUmFkaXVzKCkpIC8gMiksIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKGFuZ2xlSW5EZWdyZWUgKyBTVEVQIC8gMiwgdGhpcy5nZXRBc2NlbmRhbnRTaGlmdCgpKSlcblxuICAgICAgICAgICAgbGV0IHN5bWJvbCA9IFNWR1V0aWxzLlNWR1N5bWJvbChTWU1CT0xfU0lHTlNbc3ltYm9sSW5kZXhdLCBwb3NpdGlvbi54LCBwb3NpdGlvbi55KVxuICAgICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImZvbnQtZmFtaWx5XCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0ZPTlRfRkFNSUxZKTtcbiAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKSAvLyBzdGFydCwgbWlkZGxlLCBlbmRcbiAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJkb21pbmFudC1iYXNlbGluZVwiLCBcIm1pZGRsZVwiKVxuICAgICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImZvbnQtc2l6ZVwiLCB0aGlzLiNzZXR0aW5ncy5SQURJWF9TSUdOU19GT05UX1NJWkUpO1xuICAgICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgdGhpcy4jc2V0dGluZ3MuU0lHTl9DT0xPUlNbc3ltYm9sSW5kZXhdID8/IHRoaXMuI3NldHRpbmdzLkNIQVJUX1NJR05TX0NPTE9SKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuI3NldHRpbmdzLkNMQVNTX1NJR04pIHtcbiAgICAgICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKCdjbGFzcycsIHRoaXMuI3NldHRpbmdzLkNMQVNTX1NJR04gKyAnICcgKyB0aGlzLiNzZXR0aW5ncy5DTEFTU19TSUdOICsgU1lNQk9MX1NJR05TW3N5bWJvbEluZGV4XS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHN5bWJvbFxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbWFrZVNlZ21lbnQgPSAoc3ltYm9sSW5kZXgsIGFuZ2xlRnJvbUluRGVncmVlLCBhbmdsZVRvSW5EZWdyZWUpID0+IHtcbiAgICAgICAgICAgIGxldCBhMSA9IFV0aWxzLmRlZ3JlZVRvUmFkaWFuKGFuZ2xlRnJvbUluRGVncmVlLCB0aGlzLmdldEFzY2VuZGFudFNoaWZ0KCkpXG4gICAgICAgICAgICBsZXQgYTIgPSBVdGlscy5kZWdyZWVUb1JhZGlhbihhbmdsZVRvSW5EZWdyZWUsIHRoaXMuZ2V0QXNjZW5kYW50U2hpZnQoKSlcbiAgICAgICAgICAgIGxldCBzZWdtZW50ID0gU1ZHVXRpbHMuU1ZHU2VnbWVudCh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLmdldE91dGVyQ2lyY2xlUmFkaXVzKCksIGExLCBhMiwgdGhpcy5nZXRJbm5lckNpcmNsZVJhZGl1cygpKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRV9XSVRIX0NPTE9SKSB7XG4gICAgICAgICAgICAgICAgc2VnbWVudC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIENPTE9SU19TSUdOU1tzeW1ib2xJbmRleF0pO1xuICAgICAgICAgICAgICAgIHNlZ21lbnQuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNJUkNMRV9DT0xPUik7XG4gICAgICAgICAgICAgICAgc2VnbWVudC5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2VnbWVudC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRV9PTkxZID8gXCJub25lXCIgOiBDT0xPUlNfU0lHTlNbc3ltYm9sSW5kZXhdKTtcbiAgICAgICAgICAgICAgICBzZWdtZW50LnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0VfT05MWSA/IHRoaXMuI3NldHRpbmdzLkNJUkNMRV9DT0xPUiA6IFwibm9uZVwiKTtcbiAgICAgICAgICAgICAgICBzZWdtZW50LnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0VfT05MWSA/IHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRSA6IDApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy4jc2V0dGluZ3MuQ0xBU1NfU0lHTl9TRUdNRU5UKSB7XG4gICAgICAgICAgICAgICAgc2VnbWVudC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgdGhpcy4jc2V0dGluZ3MuQ0xBU1NfU0lHTl9TRUdNRU5UICsgJyAnICsgdGhpcy4jc2V0dGluZ3MuQ0xBU1NfU0lHTl9TRUdNRU5UICsgU1lNQk9MX1NJR05TW3N5bWJvbEluZGV4XS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHNlZ21lbnRcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBzdGFydEFuZ2xlID0gMFxuICAgICAgICBsZXQgZW5kQW5nbGUgPSBzdGFydEFuZ2xlICsgU1RFUFxuXG4gICAgICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBOVU1CRVJfT0ZfQVNUUk9MT0dJQ0FMX1NJR05TOyBpKyspIHtcblxuICAgICAgICAgICAgbGV0IHNlZ21lbnQgPSBtYWtlU2VnbWVudChpLCBzdGFydEFuZ2xlLCBlbmRBbmdsZSlcbiAgICAgICAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoc2VnbWVudCk7XG5cbiAgICAgICAgICAgIGxldCBzeW1ib2wgPSBtYWtlU3ltYm9sKGksIHN0YXJ0QW5nbGUpXG4gICAgICAgICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHN5bWJvbCk7XG5cbiAgICAgICAgICAgIHN0YXJ0QW5nbGUgKz0gU1RFUDtcbiAgICAgICAgICAgIGVuZEFuZ2xlID0gc3RhcnRBbmdsZSArIFNURVBcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuI3Jvb3QuYXBwZW5kQ2hpbGQod3JhcHBlcilcbiAgICB9XG5cbiAgICAjZHJhd1J1bGVyKCkge1xuICAgICAgICBjb25zdCBOVU1CRVJfT0ZfRElWSURFUlMgPSA3MlxuICAgICAgICBjb25zdCBTVEVQID0gNVxuXG4gICAgICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG5cbiAgICAgICAgbGV0IHN0YXJ0QW5nbGUgPSB0aGlzLmdldEFzY2VuZGFudFNoaWZ0KClcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBOVU1CRVJfT0ZfRElWSURFUlM7IGkrKykge1xuICAgICAgICAgICAgbGV0IHN0YXJ0UG9pbnQgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuZ2V0UnVsbGVyQ2lyY2xlUmFkaXVzKCksIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKHN0YXJ0QW5nbGUpKVxuICAgICAgICAgICAgbGV0IGVuZFBvaW50ID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCAoaSAlIDIpID8gdGhpcy5nZXRJbm5lckNpcmNsZVJhZGl1cygpIC0gKCh0aGlzLmdldElubmVyQ2lyY2xlUmFkaXVzKCkgLSB0aGlzLmdldFJ1bGxlckNpcmNsZVJhZGl1cygpKSAvIDIpIDogdGhpcy5nZXRJbm5lckNpcmNsZVJhZGl1cygpLCBVdGlscy5kZWdyZWVUb1JhZGlhbihzdGFydEFuZ2xlKSlcbiAgICAgICAgICAgIGNvbnN0IGxpbmUgPSBTVkdVdGlscy5TVkdMaW5lKHN0YXJ0UG9pbnQueCwgc3RhcnRQb2ludC55LCBlbmRQb2ludC54LCBlbmRQb2ludC55KTtcbiAgICAgICAgICAgIGxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0xJTkVfQ09MT1IpO1xuICAgICAgICAgICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFKTtcbiAgICAgICAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQobGluZSk7XG5cbiAgICAgICAgICAgIHN0YXJ0QW5nbGUgKz0gU1RFUFxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY2lyY2xlID0gU1ZHVXRpbHMuU1ZHQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuZ2V0UnVsbGVyQ2lyY2xlUmFkaXVzKCkpO1xuICAgICAgICBjaXJjbGUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0NJUkNMRV9DT0xPUik7XG4gICAgICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFKTtcbiAgICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChjaXJjbGUpO1xuXG4gICAgICAgIHRoaXMuI3Jvb3QuYXBwZW5kQ2hpbGQod3JhcHBlcilcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIERyYXcgcG9pbnRzXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGRhdGEgLSBjaGFydCBkYXRhXG4gICAgICovXG4gICAgI2RyYXdQb2ludHMoZGF0YSkge1xuICAgICAgICBjb25zdCBwb2ludHMgPSBkYXRhLnBvaW50c1xuICAgICAgICBjb25zdCBjdXNwcyA9IGRhdGEuY3VzcHNcblxuICAgICAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuXG4gICAgICAgIGNvbnN0IHBvc2l0aW9ucyA9IFV0aWxzLmNhbGN1bGF0ZVBvc2l0aW9uV2l0aG91dE92ZXJsYXBwaW5nKHBvaW50cywgdGhpcy4jc2V0dGluZ3MuUE9JTlRfQ09MTElTSU9OX1JBRElVUywgdGhpcy5nZXRQb2ludENpcmNsZVJhZGl1cygpKVxuXG4gICAgICAgIGZvciAoY29uc3QgcG9pbnREYXRhIG9mIHBvaW50cykge1xuICAgICAgICAgICAgY29uc3QgcG9pbnQgPSBuZXcgUG9pbnQocG9pbnREYXRhLCBjdXNwcywgdGhpcy4jc2V0dGluZ3MpXG4gICAgICAgICAgICBjb25zdCBwb2ludFBvc2l0aW9uID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJYLCB0aGlzLmdldFJ1bGxlckNpcmNsZVJhZGl1cygpIC0gKCh0aGlzLmdldElubmVyQ2lyY2xlUmFkaXVzKCkgLSB0aGlzLmdldFJ1bGxlckNpcmNsZVJhZGl1cygpKSAvIDQpLCBVdGlscy5kZWdyZWVUb1JhZGlhbihwb2ludC5nZXRBbmdsZSgpLCB0aGlzLmdldEFzY2VuZGFudFNoaWZ0KCkpKVxuICAgICAgICAgICAgY29uc3Qgc3ltYm9sUG9zaXRpb24gPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclgsIHRoaXMuZ2V0UG9pbnRDaXJjbGVSYWRpdXMoKSwgVXRpbHMuZGVncmVlVG9SYWRpYW4ocG9zaXRpb25zW3BvaW50LmdldE5hbWUoKV0sIHRoaXMuZ2V0QXNjZW5kYW50U2hpZnQoKSkpXG5cbiAgICAgICAgICAgIC8vIHJ1bGVyIG1hcmtcbiAgICAgICAgICAgIGNvbnN0IHJ1bGVyTGluZUVuZFBvc2l0aW9uID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJYLCB0aGlzLmdldFJ1bGxlckNpcmNsZVJhZGl1cygpLCBVdGlscy5kZWdyZWVUb1JhZGlhbihwb2ludC5nZXRBbmdsZSgpLCB0aGlzLmdldEFzY2VuZGFudFNoaWZ0KCkpKVxuXG4gICAgICAgICAgICBpZiAodGhpcy4jc2V0dGluZ3MuRFJBV19SVUxFUl9NQVJLKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcnVsZXJMaW5lID0gU1ZHVXRpbHMuU1ZHTGluZShwb2ludFBvc2l0aW9uLngsIHBvaW50UG9zaXRpb24ueSwgcnVsZXJMaW5lRW5kUG9zaXRpb24ueCwgcnVsZXJMaW5lRW5kUG9zaXRpb24ueSlcbiAgICAgICAgICAgICAgICBydWxlckxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0xJTkVfQ09MT1IpO1xuICAgICAgICAgICAgICAgIHJ1bGVyTGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFKTtcbiAgICAgICAgICAgICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHJ1bGVyTGluZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHN5bWJvbFxuICAgICAgICAgICAgY29uc3Qgc3ltYm9sID0gcG9pbnQuZ2V0U3ltYm9sKHN5bWJvbFBvc2l0aW9uLngsIHN5bWJvbFBvc2l0aW9uLnksIFV0aWxzLkRFR18wLCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX1NIT1cpXG4gICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZm9udC1mYW1pbHlcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfRk9OVF9GQU1JTFkpO1xuICAgICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpIC8vIHN0YXJ0LCBtaWRkbGUsIGVuZFxuICAgICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImRvbWluYW50LWJhc2VsaW5lXCIsIFwibWlkZGxlXCIpXG4gICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZm9udC1zaXplXCIsIHRoaXMuI3NldHRpbmdzLlJBRElYX1BPSU5UU19GT05UX1NJWkUpXG4gICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCB0aGlzLiNzZXR0aW5ncy5QTEFORVRfQ09MT1JTW3BvaW50RGF0YS5uYW1lXSA/PyB0aGlzLiNzZXR0aW5ncy5DSEFSVF9QT0lOVFNfQ09MT1IpXG4gICAgICAgICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHN5bWJvbCk7XG5cbiAgICAgICAgICAgIC8vIHBvaW50ZXJcbiAgICAgICAgICAgIC8vaWYgKHBvc2l0aW9uc1twb2ludC5nZXROYW1lKCldICE9IHBvaW50RGF0YS5wb3NpdGlvbikge1xuICAgICAgICAgICAgY29uc3QgcG9pbnRlckxpbmVFbmRQb3NpdGlvbiA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWCwgdGhpcy5nZXRQb2ludENpcmNsZVJhZGl1cygpLCBVdGlscy5kZWdyZWVUb1JhZGlhbihwb3NpdGlvbnNbcG9pbnQuZ2V0TmFtZSgpXSwgdGhpcy5nZXRBc2NlbmRhbnRTaGlmdCgpKSlcblxuICAgICAgICAgICAgbGV0IHBvaW50ZXJMaW5lO1xuICAgICAgICAgICAgaWYgKHRoaXMuI3NldHRpbmdzLkRSQVdfUlVMRVJfTUFSSykge1xuICAgICAgICAgICAgICAgIHBvaW50ZXJMaW5lID0gU1ZHVXRpbHMuU1ZHTGluZShwb2ludFBvc2l0aW9uLngsIHBvaW50UG9zaXRpb24ueSwgKHBvaW50UG9zaXRpb24ueCArIHBvaW50ZXJMaW5lRW5kUG9zaXRpb24ueCkgLyAyLCAocG9pbnRQb3NpdGlvbi55ICsgcG9pbnRlckxpbmVFbmRQb3NpdGlvbi55KSAvIDIpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHBvaW50ZXJMaW5lID0gU1ZHVXRpbHMuU1ZHTGluZShydWxlckxpbmVFbmRQb3NpdGlvbi54LCBydWxlckxpbmVFbmRQb3NpdGlvbi55LCAocG9pbnRQb3NpdGlvbi54ICsgcG9pbnRlckxpbmVFbmRQb3NpdGlvbi54KSAvIDIsIChwb2ludFBvc2l0aW9uLnkgKyBwb2ludGVyTGluZUVuZFBvc2l0aW9uLnkpIC8gMilcbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICBpZiAodGhpcy4jc2V0dGluZ3MuUExBTkVUX0xJTkVfVVNFX1BMQU5FVF9DT0xPUikge1xuICAgICAgICAgICAgICAgIHBvaW50ZXJMaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5QTEFORVRfQ09MT1JTW3BvaW50RGF0YS5uYW1lXSA/PyB0aGlzLiNzZXR0aW5ncy5DSEFSVF9MSU5FX0NPTE9SKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcG9pbnRlckxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0xJTkVfQ09MT1IpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBwb2ludGVyTGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFIC8gMik7XG5cbiAgICAgICAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQocG9pbnRlckxpbmUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy4jcm9vdC5hcHBlbmRDaGlsZCh3cmFwcGVyKVxuICAgIH1cblxuICAgIC8qXG4gICAgICogRHJhdyBwb2ludHNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YSAtIGNoYXJ0IGRhdGFcbiAgICAgKi9cbiAgICAjZHJhd0N1c3BzKGRhdGEpIHtcbiAgICAgICAgY29uc3QgcG9pbnRzID0gZGF0YS5wb2ludHNcbiAgICAgICAgY29uc3QgY3VzcHMgPSBkYXRhLmN1c3BzXG5cbiAgICAgICAgY29uc3QgbWFpbkF4aXNJbmRleGVzID0gWzAsIDMsIDYsIDldIC8vQXMsIEljLCBEcywgTWNcblxuICAgICAgICBjb25zdCBwb2ludHNQb3NpdGlvbnMgPSBwb2ludHMubWFwKHBvaW50ID0+IHtcbiAgICAgICAgICAgIHJldHVybiBwb2ludC5hbmdsZVxuICAgICAgICB9KVxuXG4gICAgICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG5cbiAgICAgICAgY29uc3QgdGV4dFJhZGl1cyA9IHRoaXMuZ2V0Q2VudGVyQ2lyY2xlUmFkaXVzKCkgKyAoKHRoaXMuZ2V0SW5uZXJDaXJjbGVSYWRpdXMoKSAtIHRoaXMuZ2V0Q2VudGVyQ2lyY2xlUmFkaXVzKCkpIC8gMTApXG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdXNwcy5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgICAgICBjb25zdCBpc0xpbmVJbkNvbGxpc2lvbldpdGhQb2ludCA9ICEgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfQUxMT1dfSE9VU0VfT1ZFUkxBUCAmJiBVdGlscy5pc0NvbGxpc2lvbihjdXNwc1tpXS5hbmdsZSwgcG9pbnRzUG9zaXRpb25zLCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9DT0xMSVNJT05fUkFESVVTIC8gMilcblxuICAgICAgICAgICAgY29uc3Qgc3RhcnRQb3MgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuZ2V0Q2VudGVyQ2lyY2xlUmFkaXVzKCksIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKGN1c3BzW2ldLmFuZ2xlLCB0aGlzLmdldEFzY2VuZGFudFNoaWZ0KCkpKVxuICAgICAgICAgICAgY29uc3QgZW5kUG9zID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCBpc0xpbmVJbkNvbGxpc2lvbldpdGhQb2ludCA/IHRoaXMuZ2V0Q2VudGVyQ2lyY2xlUmFkaXVzKCkgKyAoKHRoaXMuZ2V0UnVsbGVyQ2lyY2xlUmFkaXVzKCkgLSB0aGlzLmdldENlbnRlckNpcmNsZVJhZGl1cygpKSAvIDYpIDogdGhpcy5nZXRSdWxsZXJDaXJjbGVSYWRpdXMoKSwgVXRpbHMuZGVncmVlVG9SYWRpYW4oY3VzcHNbaV0uYW5nbGUsIHRoaXMuZ2V0QXNjZW5kYW50U2hpZnQoKSkpXG5cbiAgICAgICAgICAgIGNvbnN0IGxpbmUgPSBTVkdVdGlscy5TVkdMaW5lKHN0YXJ0UG9zLngsIHN0YXJ0UG9zLnksIGVuZFBvcy54LCBlbmRQb3MueSlcbiAgICAgICAgICAgIGxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIG1haW5BeGlzSW5kZXhlcy5pbmNsdWRlcyhpKSA/IHRoaXMuI3NldHRpbmdzLkNIQVJUX01BSU5fQVhJU19DT0xPUiA6IHRoaXMuI3NldHRpbmdzLkNIQVJUX0xJTkVfQ09MT1IpXG4gICAgICAgICAgICBsaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCBtYWluQXhpc0luZGV4ZXMuaW5jbHVkZXMoaSkgPyB0aGlzLiNzZXR0aW5ncy5DSEFSVF9NQUlOX1NUUk9LRSA6IHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRSlcbiAgICAgICAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQobGluZSk7XG5cbiAgICAgICAgICAgIGNvbnN0IHN0YXJ0Q3VzcCA9IGN1c3BzW2ldLmFuZ2xlXG4gICAgICAgICAgICBjb25zdCBlbmRDdXNwID0gY3VzcHNbKGkgKyAxKSAlIDEyXS5hbmdsZVxuICAgICAgICAgICAgY29uc3QgZ2FwID0gZW5kQ3VzcCAtIHN0YXJ0Q3VzcCA+IDAgPyBlbmRDdXNwIC0gc3RhcnRDdXNwIDogZW5kQ3VzcCAtIHN0YXJ0Q3VzcCArIFV0aWxzLkRFR18zNjBcbiAgICAgICAgICAgIGNvbnN0IHRleHRBbmdsZSA9IHN0YXJ0Q3VzcCArIGdhcCAvIDJcblxuICAgICAgICAgICAgY29uc3QgdGV4dFBvcyA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGV4dFJhZGl1cywgVXRpbHMuZGVncmVlVG9SYWRpYW4odGV4dEFuZ2xlLCB0aGlzLmdldEFzY2VuZGFudFNoaWZ0KCkpKVxuICAgICAgICAgICAgY29uc3QgdGV4dCA9IFNWR1V0aWxzLlNWR1RleHQodGV4dFBvcy54LCB0ZXh0UG9zLnksIGAke2kgKyAxfWApXG4gICAgICAgICAgICB0ZXh0LnNldEF0dHJpYnV0ZShcImZvbnQtZmFtaWx5XCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0ZPTlRfRkFNSUxZKVxuICAgICAgICAgICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKSAvLyBzdGFydCwgbWlkZGxlLCBlbmRcbiAgICAgICAgICAgIHRleHQuc2V0QXR0cmlidXRlKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcbiAgICAgICAgICAgIHRleHQuc2V0QXR0cmlidXRlKFwiZm9udC1zaXplXCIsIHRoaXMuI3NldHRpbmdzLlJBRElYX0hPVVNFX0ZPTlRfU0laRSlcbiAgICAgICAgICAgIHRleHQuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9IT1VTRV9OVU1CRVJfQ09MT1IpXG4gICAgICAgICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHRleHQpXG5cbiAgICAgICAgICAgIGlmICh0aGlzLiNzZXR0aW5ncy5EUkFXX0hPVVNFX0RFR1JFRSkge1xuICAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHRoaXMuI3NldHRpbmdzLkhPVVNFX0RFR1JFRV9GSUxURVIpICYmICEgdGhpcy4jc2V0dGluZ3MuSE9VU0VfREVHUkVFX0ZJTFRFUi5pbmNsdWRlcyhpICsgMSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IGRlZ3JlZVBvcyA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy5nZXRSdWxsZXJDaXJjbGVSYWRpdXMoKSAtICh0aGlzLmdldElubmVyQ2lyY2xlUmFkaXVzKCkgLSB0aGlzLmdldFJ1bGxlckNpcmNsZVJhZGl1cygpKSAvIDEuMiwgVXRpbHMuZGVncmVlVG9SYWRpYW4oc3RhcnRDdXNwIC0gMi40LCB0aGlzLmdldEFzY2VuZGFudFNoaWZ0KCkpKVxuICAgICAgICAgICAgICAgIGNvbnN0IGRlZ3JlZSA9IFNWR1V0aWxzLlNWR1RleHQoZGVncmVlUG9zLngsIGRlZ3JlZVBvcy55LCBNYXRoLmZsb29yKGN1c3BzW2ldLmFuZ2xlICUgMzApICsgXCLCulwiKVxuICAgICAgICAgICAgICAgIGRlZ3JlZS5zZXRBdHRyaWJ1dGUoXCJmb250LWZhbWlseVwiLCBcIkFyaWFsXCIpXG4gICAgICAgICAgICAgICAgZGVncmVlLnNldEF0dHJpYnV0ZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpIC8vIHN0YXJ0LCBtaWRkbGUsIGVuZFxuICAgICAgICAgICAgICAgIGRlZ3JlZS5zZXRBdHRyaWJ1dGUoXCJkb21pbmFudC1iYXNlbGluZVwiLCBcIm1pZGRsZVwiKVxuICAgICAgICAgICAgICAgIGRlZ3JlZS5zZXRBdHRyaWJ1dGUoXCJmb250LXNpemVcIiwgdGhpcy4jc2V0dGluZ3MuSE9VU0VfREVHUkVFX1NJWkUgfHwgdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19BTkdMRV9TSVpFIC8gMilcbiAgICAgICAgICAgICAgICBkZWdyZWUuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCB0aGlzLiNzZXR0aW5ncy5IT1VTRV9ERUdSRUVfQ09MT1IgfHwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfSE9VU0VfTlVNQkVSX0NPTE9SKVxuICAgICAgICAgICAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoZGVncmVlKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy4jcm9vdC5hcHBlbmRDaGlsZCh3cmFwcGVyKVxuICAgIH1cblxuICAgIC8qXG4gICAgICogRHJhdyBtYWluIGF4aXMgZGVzY3JpdGlvblxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGF4aXNMaXN0XG4gICAgICovXG4gICAgI2RyYXdNYWluQXhpc0Rlc2NyaXB0aW9uKGRhdGEpIHtcbiAgICAgICAgY29uc3QgQVhJU19MRU5HVEggPSAxMFxuICAgICAgICBjb25zdCBjdXNwcyA9IGRhdGEuY3VzcHNcblxuICAgICAgICBjb25zdCBheGlzTGlzdCA9IFt7XG4gICAgICAgICAgICBuYW1lOiBTVkdVdGlscy5TWU1CT0xfQVMsXG4gICAgICAgICAgICBhbmdsZTogY3VzcHNbMF0uYW5nbGVcbiAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiBTVkdVdGlscy5TWU1CT0xfSUMsXG4gICAgICAgICAgICAgICAgYW5nbGU6IGN1c3BzWzNdLmFuZ2xlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hbWU6IFNWR1V0aWxzLlNZTUJPTF9EUyxcbiAgICAgICAgICAgICAgICBhbmdsZTogY3VzcHNbNl0uYW5nbGVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogU1ZHVXRpbHMuU1lNQk9MX01DLFxuICAgICAgICAgICAgICAgIGFuZ2xlOiBjdXNwc1s5XS5hbmdsZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgXVxuXG4gICAgICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG5cbiAgICAgICAgY29uc3QgcmFkMSA9IHRoaXMuI251bWJlck9mTGV2ZWxzID09PSAyNCA/IHRoaXMuZ2V0UmFkaXVzKCkgOiB0aGlzLmdldElubmVyQ2lyY2xlUmFkaXVzKCk7XG4gICAgICAgIGNvbnN0IHJhZDIgPSB0aGlzLiNudW1iZXJPZkxldmVscyA9PT0gMjQgPyB0aGlzLmdldFJhZGl1cygpICsgQVhJU19MRU5HVEggOiB0aGlzLmdldElubmVyQ2lyY2xlUmFkaXVzKCkgKyBBWElTX0xFTkdUSCAvIDI7XG5cbiAgICAgICAgZm9yIChjb25zdCBheGlzIG9mIGF4aXNMaXN0KSB7XG4gICAgICAgICAgICBsZXQgc3RhcnRQb2ludCA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgcmFkMSwgVXRpbHMuZGVncmVlVG9SYWRpYW4oYXhpcy5hbmdsZSwgdGhpcy5nZXRBc2NlbmRhbnRTaGlmdCgpKSlcbiAgICAgICAgICAgIGxldCBlbmRQb2ludCA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgcmFkMiwgVXRpbHMuZGVncmVlVG9SYWRpYW4oYXhpcy5hbmdsZSwgdGhpcy5nZXRBc2NlbmRhbnRTaGlmdCgpKSlcbiAgICAgICAgICAgIGxldCBsaW5lID0gU1ZHVXRpbHMuU1ZHTGluZShzdGFydFBvaW50LngsIHN0YXJ0UG9pbnQueSwgZW5kUG9pbnQueCwgZW5kUG9pbnQueSk7XG4gICAgICAgICAgICBsaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9NQUlOX0FYSVNfQ09MT1IpO1xuICAgICAgICAgICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTUFJTl9TVFJPS0UpO1xuICAgICAgICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChsaW5lKTtcblxuICAgICAgICAgICAgbGV0IHRleHRQb2ludCA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgcmFkMiwgVXRpbHMuZGVncmVlVG9SYWRpYW4oYXhpcy5hbmdsZSwgdGhpcy5nZXRBc2NlbmRhbnRTaGlmdCgpKSlcbiAgICAgICAgICAgIGxldCBzeW1ib2w7XG4gICAgICAgICAgICBsZXQgU0hJRlRfWCA9IDA7XG4gICAgICAgICAgICBsZXQgU0hJRlRfWSA9IDA7XG4gICAgICAgICAgICBjb25zdCBTVEVQID0gMlxuICAgICAgICAgICAgc3dpdGNoIChheGlzLm5hbWUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIFwiQXNcIjpcbiAgICAgICAgICAgICAgICAgICAgU0hJRlRfWCAtPSBTVEVQXG4gICAgICAgICAgICAgICAgICAgIFNISUZUX1kgLT0gU1RFUFxuICAgICAgICAgICAgICAgICAgICBzeW1ib2wgPSBTVkdVdGlscy5TVkdTeW1ib2woYXhpcy5uYW1lLCB0ZXh0UG9pbnQueCArIFNISUZUX1gsIHRleHRQb2ludC55ICsgU0hJRlRfWSlcbiAgICAgICAgICAgICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcInRleHQtYW5jaG9yXCIsIFwiZW5kXCIpXG4gICAgICAgICAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJkb21pbmFudC1iYXNlbGluZVwiLCBcIm1pZGRsZVwiKVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFwiRHNcIjpcbiAgICAgICAgICAgICAgICAgICAgU0hJRlRfWCArPSBTVEVQXG4gICAgICAgICAgICAgICAgICAgIFNISUZUX1kgLT0gU1RFUFxuICAgICAgICAgICAgICAgICAgICBzeW1ib2wgPSBTVkdVdGlscy5TVkdTeW1ib2woYXhpcy5uYW1lLCB0ZXh0UG9pbnQueCArIFNISUZUX1gsIHRleHRQb2ludC55ICsgU0hJRlRfWSlcbiAgICAgICAgICAgICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcInRleHQtYW5jaG9yXCIsIFwic3RhcnRcIilcbiAgICAgICAgICAgICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImRvbWluYW50LWJhc2VsaW5lXCIsIFwibWlkZGxlXCIpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJNY1wiOlxuICAgICAgICAgICAgICAgICAgICBTSElGVF9ZIC09IFNURVBcbiAgICAgICAgICAgICAgICAgICAgc3ltYm9sID0gU1ZHVXRpbHMuU1ZHU3ltYm9sKGF4aXMubmFtZSwgdGV4dFBvaW50LnggKyBTSElGVF9YLCB0ZXh0UG9pbnQueSArIFNISUZUX1kpXG4gICAgICAgICAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxuICAgICAgICAgICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJ0ZXh0LXRvcFwiKVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFwiSWNcIjpcbiAgICAgICAgICAgICAgICAgICAgU0hJRlRfWSArPSBTVEVQXG4gICAgICAgICAgICAgICAgICAgIHN5bWJvbCA9IFNWR1V0aWxzLlNWR1N5bWJvbChheGlzLm5hbWUsIHRleHRQb2ludC54ICsgU0hJRlRfWCwgdGV4dFBvaW50LnkgKyBTSElGVF9ZKVxuICAgICAgICAgICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcbiAgICAgICAgICAgICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImRvbWluYW50LWJhc2VsaW5lXCIsIFwiaGFuZ2luZ1wiKVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGF4aXMubmFtZSlcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5rbm93biBheGlzIG5hbWUuXCIpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZm9udC1mYW1pbHlcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfRk9OVF9GQU1JTFkpO1xuICAgICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImZvbnQtc2l6ZVwiLCB0aGlzLiNzZXR0aW5ncy5SQURJWF9BWElTX0ZPTlRfU0laRSk7XG4gICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9NQUlOX0FYSVNfQ09MT1IpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy4jc2V0dGluZ3MuQ0xBU1NfQVhJUykge1xuICAgICAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgdGhpcy4jc2V0dGluZ3MuQ0xBU1NfQVhJUyArICcgJyArIHRoaXMuI3NldHRpbmdzLkNMQVNTX0FYSVMgKyBheGlzLm5hbWUudG9Mb3dlckNhc2UoKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoc3ltYm9sKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuI3Jvb3QuYXBwZW5kQ2hpbGQod3JhcHBlcilcbiAgICB9XG5cbiAgICAjZHJhd0JvcmRlcnMoKSB7XG4gICAgICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG5cbiAgICAgICAgY29uc3Qgb3V0ZXJDaXJjbGUgPSBTVkdVdGlscy5TVkdDaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy5nZXRPdXRlckNpcmNsZVJhZGl1cygpKVxuICAgICAgICBvdXRlckNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfQ0lSQ0xFX0NPTE9SKTtcbiAgICAgICAgb3V0ZXJDaXJjbGUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX01BSU5fU1RST0tFKTtcbiAgICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChvdXRlckNpcmNsZSlcblxuICAgICAgICBjb25zdCBpbm5lckNpcmNsZSA9IFNWR1V0aWxzLlNWR0NpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLmdldElubmVyQ2lyY2xlUmFkaXVzKCkpXG4gICAgICAgIGlubmVyQ2lyY2xlLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9DSVJDTEVfQ09MT1IpO1xuICAgICAgICBpbm5lckNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTUFJTl9TVFJPS0UpO1xuICAgICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGlubmVyQ2lyY2xlKVxuXG4gICAgICAgIGNvbnN0IGNlbnRlckNpcmNsZSA9IFNWR1V0aWxzLlNWR0NpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLmdldENlbnRlckNpcmNsZVJhZGl1cygpKVxuICAgICAgICBjZW50ZXJDaXJjbGUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0NJUkNMRV9DT0xPUik7XG4gICAgICAgIGNlbnRlckNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTUFJTl9TVFJPS0UpO1xuICAgICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGNlbnRlckNpcmNsZSlcblxuICAgICAgICB0aGlzLiNyb290LmFwcGVuZENoaWxkKHdyYXBwZXIpXG4gICAgfVxufVxuXG5leHBvcnQge1xuICAgIFJhZGl4Q2hhcnQgYXNcbiAgICAgICAgZGVmYXVsdFxufVxuIiwiaW1wb3J0IFJhZGl4Q2hhcnQgZnJvbSAnLi4vY2hhcnRzL1JhZGl4Q2hhcnQuanMnO1xuaW1wb3J0IFNWR1V0aWxzIGZyb20gJy4uL3V0aWxzL1NWR1V0aWxzLmpzJztcbmltcG9ydCBDaGFydCBmcm9tICcuL0NoYXJ0LmpzJ1xuaW1wb3J0IFV0aWxzIGZyb20gJy4uL3V0aWxzL1V0aWxzLmpzJztcbmltcG9ydCBBc3BlY3RVdGlscyBmcm9tICcuLi91dGlscy9Bc3BlY3RVdGlscy5qcyc7XG5pbXBvcnQgUG9pbnQgZnJvbSAnLi4vcG9pbnRzL1BvaW50LmpzJ1xuaW1wb3J0IERlZmF1bHRTZXR0aW5ncyBmcm9tICcuLi9zZXR0aW5ncy9EZWZhdWx0U2V0dGluZ3MuanMnO1xuXG4vKipcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyBQb2ludHMgYW5kIGN1cHMgYXJlIGRpc3BsYXllZCBmcm9tIG91dHNpZGUgdGhlIFVuaXZlcnNlLlxuICogQHB1YmxpY1xuICogQGV4dGVuZHMge0NoYXJ0fVxuICovXG5jbGFzcyBUcmFuc2l0Q2hhcnQgZXh0ZW5kcyBDaGFydCB7XG5cbiAgLypcbiAgICogTGV2ZWxzIGRldGVybWluZSB0aGUgd2lkdGggb2YgaW5kaXZpZHVhbCBwYXJ0cyBvZiB0aGUgY2hhcnQuXG4gICAqIEl0IGNhbiBiZSBjaGFuZ2VkIGR5bmFtaWNhbGx5IGJ5IHB1YmxpYyBzZXR0ZXIuXG4gICAqL1xuICAjbnVtYmVyT2ZMZXZlbHMgPSAzMlxuXG4gICNyYWRpeFxuICAjc2V0dGluZ3NcbiAgI3Jvb3RcbiAgI2RhdGFcblxuICAjY2VudGVyWFxuICAjY2VudGVyWVxuICAjcmFkaXVzXG5cbiAgLypcbiAgICogQHNlZSBVdGlscy5jbGVhblVwKClcbiAgICovXG4gICNiZWZvcmVDbGVhblVwSG9va1xuXG4gIC8qKlxuICAgKiBAY29uc3RydWN0c1xuICAgKiBAcGFyYW0ge1JhZGl4Q2hhcnR9IHJhZGl4XG4gICAqL1xuICBjb25zdHJ1Y3RvcihyYWRpeCkge1xuICAgIGlmICghKHJhZGl4IGluc3RhbmNlb2YgUmFkaXhDaGFydCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQmFkIHBhcmFtIHJhZGl4LicpXG4gICAgfVxuXG4gICAgc3VwZXIocmFkaXguZ2V0VW5pdmVyc2UoKS5nZXRTZXR0aW5ncygpKVxuXG4gICAgdGhpcy4jcmFkaXggPSByYWRpeFxuICAgIHRoaXMuI3NldHRpbmdzID0gdGhpcy4jcmFkaXguZ2V0VW5pdmVyc2UoKS5nZXRTZXR0aW5ncygpXG4gICAgdGhpcy4jY2VudGVyWCA9IHRoaXMuI3NldHRpbmdzLkNIQVJUX1ZJRVdCT1hfV0lEVEggLyAyXG4gICAgdGhpcy4jY2VudGVyWSA9IHRoaXMuI3NldHRpbmdzLkNIQVJUX1ZJRVdCT1hfSEVJR0hUIC8gMlxuICAgIHRoaXMuI3JhZGl1cyA9IE1hdGgubWluKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclkpIC0gdGhpcy4jc2V0dGluZ3MuQ0hBUlRfUEFERElOR1xuXG4gICAgdGhpcy4jcm9vdCA9IFNWR1V0aWxzLlNWR0dyb3VwKClcbiAgICB0aGlzLiNyb290LnNldEF0dHJpYnV0ZShcImlkXCIsIGAke3RoaXMuI3NldHRpbmdzLkhUTUxfRUxFTUVOVF9JRH0tJHt0aGlzLiNzZXR0aW5ncy5UUkFOU0lUX0lEfWApXG4gICAgdGhpcy4jcmFkaXguZ2V0VW5pdmVyc2UoKS5nZXRTVkdEb2N1bWVudCgpLmFwcGVuZENoaWxkKHRoaXMuI3Jvb3QpO1xuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgY2hhcnQgZGF0YVxuICAgKiBAdGhyb3dzIHtFcnJvcn0gLSBpZiB0aGUgZGF0YSBpcyBub3QgdmFsaWQuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gICAqIEByZXR1cm4ge1JhZGl4Q2hhcnR9XG4gICAqL1xuICBzZXREYXRhKGRhdGEpIHtcbiAgICBsZXQgc3RhdHVzID0gdGhpcy52YWxpZGF0ZURhdGEoZGF0YSlcbiAgICBpZiAoIXN0YXR1cy5pc1ZhbGlkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3Ioc3RhdHVzLm1lc3NhZ2UpXG4gICAgfVxuXG4gICAgdGhpcy4jZGF0YSA9IGRhdGFcbiAgICB0aGlzLiNkcmF3KGRhdGEpXG5cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBkYXRhXG4gICAqIEByZXR1cm4ge09iamVjdH1cbiAgICovXG4gIGdldERhdGEoKXtcbiAgICByZXR1cm4ge1xuICAgICAgXCJwb2ludHNcIjpbLi4udGhpcy4jZGF0YS5wb2ludHNdLFxuICAgICAgXCJjdXNwc1wiOlsuLi50aGlzLiNkYXRhLmN1c3BzXVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgcmFkaXVzXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0UmFkaXVzKCkge1xuICAgIHJldHVybiB0aGlzLiNyYWRpdXNcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYXNwZWN0c1xuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IFtmcm9tUG9pbnRzXSAtIFt7bmFtZTpcIk1vb25cIiwgYW5nbGU6MH0sIHtuYW1lOlwiU3VuXCIsIGFuZ2xlOjE3OX0sIHtuYW1lOlwiTWVyY3VyeVwiLCBhbmdsZToxMjF9XVxuICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IFt0b1BvaW50c10gLSBbe25hbWU6XCJBU1wiLCBhbmdsZTowfSwge25hbWU6XCJJQ1wiLCBhbmdsZTo5MH1dXG4gICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gW2FzcGVjdHNdIC0gW3tuYW1lOlwiT3Bwb3NpdGlvblwiLCBhbmdsZToxODAsIG9yYjoyfSwge25hbWU6XCJUcmluZVwiLCBhbmdsZToxMjAsIG9yYjoyfV1cbiAgICpcbiAgICogQHJldHVybiB7QXJyYXk8T2JqZWN0Pn1cbiAgICovXG4gIGdldEFzcGVjdHMoZnJvbVBvaW50cywgdG9Qb2ludHMsIGFzcGVjdHMpe1xuICAgIGlmKCF0aGlzLiNkYXRhKXtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGZyb21Qb2ludHMgPSBmcm9tUG9pbnRzID8/IFsuLi50aGlzLiNkYXRhLnBvaW50cy5maWx0ZXIoeCA9PiBcImFzcGVjdFwiIGluIHggPyB4LmFzcGVjdCA6IHRydWUpLCAuLi50aGlzLiNkYXRhLmN1c3BzLmZpbHRlcih4ID0+IHguYXNwZWN0KV1cbiAgICB0b1BvaW50cyA9IHRvUG9pbnRzID8/IFsuLi50aGlzLiNyYWRpeC5nZXREYXRhKCkucG9pbnRzLmZpbHRlcih4ID0+IFwiYXNwZWN0XCIgaW4geCA/IHguYXNwZWN0IDogdHJ1ZSksIC4uLnRoaXMuI3JhZGl4LmdldERhdGEoKS5jdXNwcy5maWx0ZXIoeCA9PiB4LmFzcGVjdCldXG4gICAgYXNwZWN0cyA9IGFzcGVjdHMgPz8gdGhpcy4jc2V0dGluZ3MuREVGQVVMVF9BU1BFQ1RTID8/IERlZmF1bHRTZXR0aW5ncy5ERUZBVUxUX0FTUEVDVFNcblxuICAgIHJldHVybiBBc3BlY3RVdGlscy5nZXRBc3BlY3RzKGZyb21Qb2ludHMsIHRvUG9pbnRzLCBhc3BlY3RzKVxuICB9XG5cbiAgLyoqXG4gICAqIERyYXcgYXNwZWN0c1xuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IFtmcm9tUG9pbnRzXSAtIFt7bmFtZTpcIk1vb25cIiwgYW5nbGU6MH0sIHtuYW1lOlwiU3VuXCIsIGFuZ2xlOjE3OX0sIHtuYW1lOlwiTWVyY3VyeVwiLCBhbmdsZToxMjF9XVxuICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IFt0b1BvaW50c10gLSBbe25hbWU6XCJBU1wiLCBhbmdsZTowfSwge25hbWU6XCJJQ1wiLCBhbmdsZTo5MH1dXG4gICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gW2FzcGVjdHNdIC0gW3tuYW1lOlwiT3Bwb3NpdGlvblwiLCBhbmdsZToxODAsIG9yYjoyfSwge25hbWU6XCJUcmluZVwiLCBhbmdsZToxMjAsIG9yYjoyfV1cbiAgICpcbiAgICogQHJldHVybiB7QXJyYXk8T2JqZWN0Pn1cbiAgICovXG4gIGRyYXdBc3BlY3RzKCBmcm9tUG9pbnRzLCB0b1BvaW50cywgYXNwZWN0cyApe1xuICAgIGNvbnN0IGFzcGVjdHNXcmFwcGVyID0gdGhpcy4jcmFkaXguZ2V0VW5pdmVyc2UoKS5nZXRBc3BlY3RzRWxlbWVudCgpXG4gICAgVXRpbHMuY2xlYW5VcChhc3BlY3RzV3JhcHBlci5nZXRBdHRyaWJ1dGUoXCJpZFwiKSwgdGhpcy4jYmVmb3JlQ2xlYW5VcEhvb2spXG5cbiAgICBjb25zdCBhc3BlY3RzTGlzdCA9IHRoaXMuZ2V0QXNwZWN0cyhmcm9tUG9pbnRzLCB0b1BvaW50cywgYXNwZWN0cylcbiAgICAgIC5maWx0ZXIoIGFzcGVjdCA9PiAgYXNwZWN0LmFzcGVjdC5uYW1lICE9ICdDb25qdW5jdGlvbicpXG5cbiAgICBjb25zdCBjaXJjbGUgPSBTVkdVdGlscy5TVkdDaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy4jcmFkaXguZ2V0Q2VudGVyQ2lyY2xlUmFkaXVzKCkpXG4gICAgY2lyY2xlLnNldEF0dHJpYnV0ZSgnZmlsbCcsIHRoaXMuI3NldHRpbmdzLkFTUEVDVFNfQkFDS0dST1VORF9DT0xPUilcbiAgICBhc3BlY3RzV3JhcHBlci5hcHBlbmRDaGlsZChjaXJjbGUpXG4gICAgXG4gICAgYXNwZWN0c1dyYXBwZXIuYXBwZW5kQ2hpbGQoIEFzcGVjdFV0aWxzLmRyYXdBc3BlY3RzKHRoaXMuI3JhZGl4LmdldENlbnRlckNpcmNsZVJhZGl1cygpLCB0aGlzLiNyYWRpeC5nZXRBc2NlbmRhbnRTaGlmdCgpLCB0aGlzLiNzZXR0aW5ncywgYXNwZWN0c0xpc3QpKVxuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIC8vICMjIFBSSVZBVEUgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiAgLypcbiAgICogRHJhdyByYWRpeCBjaGFydFxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICAgKi9cbiAgI2RyYXcoZGF0YSkge1xuXG4gICAgLy8gcmFkaXggcmVEcmF3XG4gICAgVXRpbHMuY2xlYW5VcCh0aGlzLiNyb290LmdldEF0dHJpYnV0ZSgnaWQnKSwgdGhpcy4jYmVmb3JlQ2xlYW5VcEhvb2spXG4gICAgdGhpcy4jcmFkaXguc2V0TnVtYmVyT2ZMZXZlbHModGhpcy4jbnVtYmVyT2ZMZXZlbHMpXG5cbiAgICB0aGlzLiNkcmF3UnVsZXIoKVxuICAgIHRoaXMuI2RyYXdDdXNwcyhkYXRhKVxuICAgIHRoaXMuI3NldHRpbmdzLkNIQVJUX0RSQVdfTUFJTl9BWElTICYmIHRoaXMuI2RyYXdNYWluQXhpc0Rlc2NyaXB0aW9uKGRhdGEpXG4gICAgdGhpcy4jZHJhd1BvaW50cyhkYXRhKVxuICAgIHRoaXMuI2RyYXdCb3JkZXJzKClcbiAgICB0aGlzLiNzZXR0aW5ncy5EUkFXX0FTUEVDVFMgJiYgdGhpcy5kcmF3QXNwZWN0cygpXG4gIH1cblxuICAjZHJhd1J1bGVyKCkge1xuICAgIGNvbnN0IE5VTUJFUl9PRl9ESVZJREVSUyA9IDcyXG4gICAgY29uc3QgU1RFUCA9IDVcblxuICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG5cbiAgICBsZXQgc3RhcnRBbmdsZSA9IHRoaXMuI3JhZGl4LmdldEFzY2VuZGFudFNoaWZ0KClcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IE5VTUJFUl9PRl9ESVZJREVSUzsgaSsrKSB7XG4gICAgICBsZXQgc3RhcnRQb2ludCA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy4jZ2V0UnVsbGVyQ2lyY2xlUmFkaXVzKCksIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKHN0YXJ0QW5nbGUpKVxuICAgICAgbGV0IGVuZFBvaW50ID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCAoaSAlIDIpID8gdGhpcy5nZXRSYWRpdXMoKSAtICgodGhpcy5nZXRSYWRpdXMoKSAtIHRoaXMuI2dldFJ1bGxlckNpcmNsZVJhZGl1cygpKSAvIDIpIDogdGhpcy5nZXRSYWRpdXMoKSwgVXRpbHMuZGVncmVlVG9SYWRpYW4oc3RhcnRBbmdsZSkpXG4gICAgICBjb25zdCBsaW5lID0gU1ZHVXRpbHMuU1ZHTGluZShzdGFydFBvaW50LngsIHN0YXJ0UG9pbnQueSwgZW5kUG9pbnQueCwgZW5kUG9pbnQueSk7XG4gICAgICBsaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9MSU5FX0NPTE9SKTtcbiAgICAgIGxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRSk7XG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGxpbmUpO1xuXG4gICAgICBzdGFydEFuZ2xlICs9IFNURVBcbiAgICB9XG5cbiAgICBjb25zdCBjaXJjbGUgPSBTVkdVdGlscy5TVkdDaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy4jZ2V0UnVsbGVyQ2lyY2xlUmFkaXVzKCkpO1xuICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfQ0lSQ0xFX0NPTE9SKTtcbiAgICBjaXJjbGUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRSk7XG4gICAgd3JhcHBlci5hcHBlbmRDaGlsZChjaXJjbGUpO1xuXG4gICAgdGhpcy4jcm9vdC5hcHBlbmRDaGlsZCh3cmFwcGVyKVxuICB9XG5cbiAgLypcbiAgICogRHJhdyBwb2ludHNcbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGEgLSBjaGFydCBkYXRhXG4gICAqL1xuICAjZHJhd1BvaW50cyhkYXRhKSB7XG4gICAgY29uc3QgcG9pbnRzID0gZGF0YS5wb2ludHNcbiAgICBjb25zdCBjdXNwcyA9IGRhdGEuY3VzcHNcblxuICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG5cbiAgICBjb25zdCBwb3NpdGlvbnMgPSBVdGlscy5jYWxjdWxhdGVQb3NpdGlvbldpdGhvdXRPdmVybGFwcGluZyhwb2ludHMsIHRoaXMuI3NldHRpbmdzLlBPSU5UX0NPTExJU0lPTl9SQURJVVMsIHRoaXMuI2dldFBvaW50Q2lyY2xlUmFkaXVzKCkpXG4gICAgZm9yIChjb25zdCBwb2ludERhdGEgb2YgcG9pbnRzKSB7XG4gICAgICBjb25zdCBwb2ludCA9IG5ldyBQb2ludChwb2ludERhdGEsIGN1c3BzLCB0aGlzLiNzZXR0aW5ncylcbiAgICAgIGNvbnN0IHBvaW50UG9zaXRpb24gPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclgsIHRoaXMuI2dldFJ1bGxlckNpcmNsZVJhZGl1cygpIC0gKCh0aGlzLmdldFJhZGl1cygpIC0gdGhpcy4jZ2V0UnVsbGVyQ2lyY2xlUmFkaXVzKCkpIC8gNCksIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKHBvaW50LmdldEFuZ2xlKCksIHRoaXMuI3JhZGl4LmdldEFzY2VuZGFudFNoaWZ0KCkpKVxuICAgICAgY29uc3Qgc3ltYm9sUG9zaXRpb24gPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclgsIHRoaXMuI2dldFBvaW50Q2lyY2xlUmFkaXVzKCksIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKHBvc2l0aW9uc1twb2ludC5nZXROYW1lKCldLCB0aGlzLiNyYWRpeC5nZXRBc2NlbmRhbnRTaGlmdCgpKSlcblxuICAgICAgLy8gcnVsZXIgbWFya1xuICAgICAgY29uc3QgcnVsZXJMaW5lRW5kUG9zaXRpb24gPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclgsIHRoaXMuI2dldFJ1bGxlckNpcmNsZVJhZGl1cygpLCBVdGlscy5kZWdyZWVUb1JhZGlhbihwb2ludC5nZXRBbmdsZSgpLCB0aGlzLiNyYWRpeC5nZXRBc2NlbmRhbnRTaGlmdCgpKSlcbiAgICAgIGNvbnN0IHJ1bGVyTGluZSA9IFNWR1V0aWxzLlNWR0xpbmUocG9pbnRQb3NpdGlvbi54LCBwb2ludFBvc2l0aW9uLnksIHJ1bGVyTGluZUVuZFBvc2l0aW9uLngsIHJ1bGVyTGluZUVuZFBvc2l0aW9uLnkpXG4gICAgICBydWxlckxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0xJTkVfQ09MT1IpO1xuICAgICAgcnVsZXJMaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0UpO1xuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChydWxlckxpbmUpO1xuXG4gICAgICAvLyBzeW1ib2xcbiAgICAgIGNvbnN0IHN5bWJvbCA9IHBvaW50LmdldFN5bWJvbChzeW1ib2xQb3NpdGlvbi54LCBzeW1ib2xQb3NpdGlvbi55LCBVdGlscy5ERUdfMCwgdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19TSE9XKVxuICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImZvbnQtZmFtaWx5XCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0ZPTlRfRkFNSUxZKTtcbiAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKSAvLyBzdGFydCwgbWlkZGxlLCBlbmRcbiAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJkb21pbmFudC1iYXNlbGluZVwiLCBcIm1pZGRsZVwiKVxuICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImZvbnQtc2l6ZVwiLCB0aGlzLiNzZXR0aW5ncy5UUkFOU0lUX1BPSU5UU19GT05UX1NJWkUpXG4gICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCB0aGlzLiNzZXR0aW5ncy5UUkFOU0lUX1BMQU5FVF9DT0xPUlNbcG9pbnREYXRhLm5hbWVdID8/IHRoaXMuI3NldHRpbmdzLlBMQU5FVF9DT0xPUlNbcG9pbnREYXRhLm5hbWVdID8/IHRoaXMuI3NldHRpbmdzLkNIQVJUX1BPSU5UU19DT0xPUilcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoc3ltYm9sKTtcblxuICAgICAgLy8gcG9pbnRlclxuICAgICAgLy9pZiAocG9zaXRpb25zW3BvaW50LmdldE5hbWUoKV0gIT0gcG9pbnREYXRhLnBvc2l0aW9uKSB7XG4gICAgICBjb25zdCBwb2ludGVyTGluZUVuZFBvc2l0aW9uID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJYLCB0aGlzLiNnZXRQb2ludENpcmNsZVJhZGl1cygpLCBVdGlscy5kZWdyZWVUb1JhZGlhbihwb3NpdGlvbnNbcG9pbnQuZ2V0TmFtZSgpXSwgdGhpcy4jcmFkaXguZ2V0QXNjZW5kYW50U2hpZnQoKSkpXG4gICAgICBjb25zdCBwb2ludGVyTGluZSA9IFNWR1V0aWxzLlNWR0xpbmUocG9pbnRQb3NpdGlvbi54LCBwb2ludFBvc2l0aW9uLnksIChwb2ludFBvc2l0aW9uLnggKyBwb2ludGVyTGluZUVuZFBvc2l0aW9uLngpIC8gMiwgKHBvaW50UG9zaXRpb24ueSArIHBvaW50ZXJMaW5lRW5kUG9zaXRpb24ueSkgLyAyKVxuICAgICAgcG9pbnRlckxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0xJTkVfQ09MT1IpO1xuICAgICAgcG9pbnRlckxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRSAvIDIpO1xuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChwb2ludGVyTGluZSk7XG4gICAgfVxuXG4gICAgdGhpcy4jcm9vdC5hcHBlbmRDaGlsZCh3cmFwcGVyKVxuICB9XG5cbiAgLypcbiAgICogRHJhdyBwb2ludHNcbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGEgLSBjaGFydCBkYXRhXG4gICAqL1xuICAjZHJhd0N1c3BzKGRhdGEpIHtcbiAgICBjb25zdCBwb2ludHMgPSBkYXRhLnBvaW50c1xuICAgIGNvbnN0IGN1c3BzID0gZGF0YS5jdXNwc1xuXG4gICAgY29uc3QgcG9pbnRzUG9zaXRpb25zID0gcG9pbnRzLm1hcChwb2ludCA9PiB7XG4gICAgICByZXR1cm4gcG9pbnQuYW5nbGVcbiAgICB9KVxuXG4gICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcblxuICAgIGNvbnN0IHRleHRSYWRpdXMgPSB0aGlzLiNnZXRDZW50ZXJDaXJjbGVSYWRpdXMoKSArICgodGhpcy4jZ2V0UnVsbGVyQ2lyY2xlUmFkaXVzKCkgLSB0aGlzLiNnZXRDZW50ZXJDaXJjbGVSYWRpdXMoKSkgLyA2KVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdXNwcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgaXNMaW5lSW5Db2xsaXNpb25XaXRoUG9pbnQgPSAhdGhpcy4jc2V0dGluZ3MuQ0hBUlRfQUxMT1dfSE9VU0VfT1ZFUkxBUCAmJiBVdGlscy5pc0NvbGxpc2lvbihjdXNwc1tpXS5hbmdsZSwgcG9pbnRzUG9zaXRpb25zLCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9DT0xMSVNJT05fUkFESVVTIC8gMilcblxuICAgICAgY29uc3Qgc3RhcnRQb3MgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuI2dldENlbnRlckNpcmNsZVJhZGl1cygpLCBVdGlscy5kZWdyZWVUb1JhZGlhbihjdXNwc1tpXS5hbmdsZSwgdGhpcy4jcmFkaXguZ2V0QXNjZW5kYW50U2hpZnQoKSkpXG4gICAgICBjb25zdCBlbmRQb3MgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIGlzTGluZUluQ29sbGlzaW9uV2l0aFBvaW50ID8gdGhpcy4jZ2V0Q2VudGVyQ2lyY2xlUmFkaXVzKCkgKyAoKHRoaXMuI2dldFJ1bGxlckNpcmNsZVJhZGl1cygpIC0gdGhpcy4jZ2V0Q2VudGVyQ2lyY2xlUmFkaXVzKCkpIC8gNikgOiB0aGlzLiNnZXRSdWxsZXJDaXJjbGVSYWRpdXMoKSwgVXRpbHMuZGVncmVlVG9SYWRpYW4oY3VzcHNbaV0uYW5nbGUsIHRoaXMuI3JhZGl4LmdldEFzY2VuZGFudFNoaWZ0KCkpKVxuXG4gICAgICBjb25zdCBsaW5lID0gU1ZHVXRpbHMuU1ZHTGluZShzdGFydFBvcy54LCBzdGFydFBvcy55LCBlbmRQb3MueCwgZW5kUG9zLnkpXG4gICAgICBsaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9MSU5FX0NPTE9SKVxuICAgICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFKVxuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChsaW5lKTtcblxuICAgICAgY29uc3Qgc3RhcnRDdXNwID0gY3VzcHNbaV0uYW5nbGVcbiAgICAgIGNvbnN0IGVuZEN1c3AgPSBjdXNwc1soaSArIDEpICUgMTJdLmFuZ2xlXG4gICAgICBjb25zdCBnYXAgPSBlbmRDdXNwIC0gc3RhcnRDdXNwID4gMCA/IGVuZEN1c3AgLSBzdGFydEN1c3AgOiBlbmRDdXNwIC0gc3RhcnRDdXNwICsgVXRpbHMuREVHXzM2MFxuICAgICAgY29uc3QgdGV4dEFuZ2xlID0gc3RhcnRDdXNwICsgZ2FwIC8gMlxuXG4gICAgICBjb25zdCB0ZXh0UG9zID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0ZXh0UmFkaXVzLCBVdGlscy5kZWdyZWVUb1JhZGlhbih0ZXh0QW5nbGUsIHRoaXMuI3JhZGl4LmdldEFzY2VuZGFudFNoaWZ0KCkpKVxuICAgICAgY29uc3QgdGV4dCA9IFNWR1V0aWxzLlNWR1RleHQodGV4dFBvcy54LCB0ZXh0UG9zLnksIGAke2krMX1gKVxuICAgICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJmb250LWZhbWlseVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9GT05UX0ZBTUlMWSlcbiAgICAgIHRleHQuc2V0QXR0cmlidXRlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIikgLy8gc3RhcnQsIG1pZGRsZSwgZW5kXG4gICAgICB0ZXh0LnNldEF0dHJpYnV0ZShcImRvbWluYW50LWJhc2VsaW5lXCIsIFwibWlkZGxlXCIpXG4gICAgICB0ZXh0LnNldEF0dHJpYnV0ZShcImZvbnQtc2l6ZVwiLCB0aGlzLiNzZXR0aW5ncy5SQURJWF9IT1VTRV9GT05UX1NJWkUpXG4gICAgICB0ZXh0LnNldEF0dHJpYnV0ZShcImZpbGxcIiwgdGhpcy4jc2V0dGluZ3MuVFJBTlNJVF9IT1VTRV9OVU1CRVJfQ09MT1IgfHwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfSE9VU0VfTlVNQkVSX0NPTE9SKVxuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZCh0ZXh0KVxuXG4gICAgICBpZih0aGlzLiNzZXR0aW5ncy5EUkFXX0hPVVNFX0RFR1JFRSkge1xuICAgICAgICBpZihBcnJheS5pc0FycmF5KHRoaXMuI3NldHRpbmdzLkhPVVNFX0RFR1JFRV9GSUxURVIpICYmICF0aGlzLiNzZXR0aW5ncy5IT1VTRV9ERUdSRUVfRklMVEVSLmluY2x1ZGVzKGkrMSkpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBkZWdyZWVQb3MgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuI2dldFJ1bGxlckNpcmNsZVJhZGl1cygpIC0gKHRoaXMuZ2V0UmFkaXVzKCkgLSB0aGlzLiNnZXRSdWxsZXJDaXJjbGVSYWRpdXMoKSksIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKHN0YXJ0Q3VzcCAtIDEuNzUsIHRoaXMuI3JhZGl4LmdldEFzY2VuZGFudFNoaWZ0KCkpKVxuICAgICAgICBjb25zdCBkZWdyZWUgPSBTVkdVdGlscy5TVkdUZXh0KGRlZ3JlZVBvcy54LCBkZWdyZWVQb3MueSwgTWF0aC5mbG9vcihjdXNwc1tpXS5hbmdsZSAlIDMwKSArIFwiwrpcIilcbiAgICAgICAgZGVncmVlLnNldEF0dHJpYnV0ZShcImZvbnQtZmFtaWx5XCIsIFwiQXJpYWxcIilcbiAgICAgICAgZGVncmVlLnNldEF0dHJpYnV0ZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpIC8vIHN0YXJ0LCBtaWRkbGUsIGVuZFxuICAgICAgICBkZWdyZWUuc2V0QXR0cmlidXRlKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcbiAgICAgICAgZGVncmVlLnNldEF0dHJpYnV0ZShcImZvbnQtc2l6ZVwiLCB0aGlzLiNzZXR0aW5ncy5IT1VTRV9ERUdSRUVfU0laRSB8fCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX0FOR0xFX1NJWkUgLyAyKVxuICAgICAgICBkZWdyZWUuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCB0aGlzLiNzZXR0aW5ncy5IT1VTRV9ERUdSRUVfQ09MT1IgfHwgdGhpcy4jc2V0dGluZ3MuVFJBTlNJVF9IT1VTRV9OVU1CRVJfQ09MT1IgfHwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfSE9VU0VfTlVNQkVSX0NPTE9SKVxuICAgICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGRlZ3JlZSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLiNyb290LmFwcGVuZENoaWxkKHdyYXBwZXIpXG4gIH1cblxuICAvKlxuICAgKiBEcmF3IG1haW4gYXhpcyBkZXNjcml0aW9uXG4gICAqIEBwYXJhbSB7QXJyYXl9IGF4aXNMaXN0XG4gICAqL1xuICAjZHJhd01haW5BeGlzRGVzY3JpcHRpb24oZGF0YSkge1xuICAgIGNvbnN0IEFYSVNfTEVOR1RIID0gMTBcbiAgICBjb25zdCBjdXNwcyA9IGRhdGEuY3VzcHNcblxuICAgIGNvbnN0IGF4aXNMaXN0ID0gW3tcbiAgICAgICAgbmFtZTogU1ZHVXRpbHMuU1lNQk9MX0FTLFxuICAgICAgICBhbmdsZTogY3VzcHNbMF0uYW5nbGVcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFNWR1V0aWxzLlNZTUJPTF9JQyxcbiAgICAgICAgYW5nbGU6IGN1c3BzWzNdLmFuZ2xlXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiBTVkdVdGlscy5TWU1CT0xfRFMsXG4gICAgICAgIGFuZ2xlOiBjdXNwc1s2XS5hbmdsZVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogU1ZHVXRpbHMuU1lNQk9MX01DLFxuICAgICAgICBhbmdsZTogY3VzcHNbOV0uYW5nbGVcbiAgICAgIH0sXG4gICAgXVxuXG4gICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcblxuICAgIGNvbnN0IHJhZDEgPSB0aGlzLmdldFJhZGl1cygpO1xuICAgIGNvbnN0IHJhZDIgPSB0aGlzLmdldFJhZGl1cygpICsgQVhJU19MRU5HVEg7XG5cbiAgICBmb3IgKGNvbnN0IGF4aXMgb2YgYXhpc0xpc3QpIHtcbiAgICAgIGxldCBzdGFydFBvaW50ID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCByYWQxLCBVdGlscy5kZWdyZWVUb1JhZGlhbihheGlzLmFuZ2xlLCB0aGlzLiNyYWRpeC5nZXRBc2NlbmRhbnRTaGlmdCgpKSlcbiAgICAgIGxldCBlbmRQb2ludCA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgcmFkMiwgVXRpbHMuZGVncmVlVG9SYWRpYW4oYXhpcy5hbmdsZSwgdGhpcy4jcmFkaXguZ2V0QXNjZW5kYW50U2hpZnQoKSkpXG4gICAgICBsZXQgbGluZSA9IFNWR1V0aWxzLlNWR0xpbmUoc3RhcnRQb2ludC54LCBzdGFydFBvaW50LnksIGVuZFBvaW50LngsIGVuZFBvaW50LnkpO1xuICAgICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTUFJTl9BWElTX0NPTE9SKTtcbiAgICAgIGxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX01BSU5fU1RST0tFKTtcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQobGluZSk7XG5cbiAgICAgIGxldCB0ZXh0UG9pbnQgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHJhZDIgKyBBWElTX0xFTkdUSCArIDIsIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKGF4aXMuYW5nbGUsIHRoaXMuI3JhZGl4LmdldEFzY2VuZGFudFNoaWZ0KCkpKVxuICAgICAgbGV0IHN5bWJvbDtcbiAgICAgIHN3aXRjaCAoYXhpcy5uYW1lKSB7XG4gICAgICAgIGNhc2UgXCJBc1wiOlxuICAgICAgICAgIHN5bWJvbCA9IFNWR1V0aWxzLlNWR1N5bWJvbChheGlzLm5hbWUsIHRleHRQb2ludC54LCB0ZXh0UG9pbnQueSlcbiAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcbiAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIkRzXCI6XG4gICAgICAgICAgc3ltYm9sID0gU1ZHVXRpbHMuU1ZHU3ltYm9sKGF4aXMubmFtZSwgdGV4dFBvaW50LngsIHRleHRQb2ludC55KVxuICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxuICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJkb21pbmFudC1iYXNlbGluZVwiLCBcIm1pZGRsZVwiKVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiTWNcIjpcbiAgICAgICAgICBzeW1ib2wgPSBTVkdVdGlscy5TVkdTeW1ib2woYXhpcy5uYW1lLCB0ZXh0UG9pbnQueCwgdGV4dFBvaW50LnkpXG4gICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXG4gICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImRvbWluYW50LWJhc2VsaW5lXCIsIFwibWlkZGxlXCIpXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJJY1wiOlxuICAgICAgICAgIHN5bWJvbCA9IFNWR1V0aWxzLlNWR1N5bWJvbChheGlzLm5hbWUsIHRleHRQb2ludC54LCB0ZXh0UG9pbnQueSlcbiAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcbiAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGF4aXMubmFtZSlcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIGF4aXMgbmFtZS5cIilcbiAgICAgIH1cbiAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJmb250LWZhbWlseVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9GT05UX0ZBTUlMWSk7XG4gICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZm9udC1zaXplXCIsIHRoaXMuI3NldHRpbmdzLlJBRElYX0FYSVNfRk9OVF9TSVpFKTtcbiAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX01BSU5fQVhJU19DT0xPUik7XG5cbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoc3ltYm9sKTtcbiAgICB9XG5cbiAgICB0aGlzLiNyb290LmFwcGVuZENoaWxkKHdyYXBwZXIpXG4gIH1cblxuICAjZHJhd0JvcmRlcnMoKSB7XG4gICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcblxuICAgIGNvbnN0IG91dGVyQ2lyY2xlID0gU1ZHVXRpbHMuU1ZHQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuZ2V0UmFkaXVzKCkpXG4gICAgb3V0ZXJDaXJjbGUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0NJUkNMRV9DT0xPUik7XG4gICAgb3V0ZXJDaXJjbGUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX01BSU5fU1RST0tFKTtcbiAgICB3cmFwcGVyLmFwcGVuZENoaWxkKG91dGVyQ2lyY2xlKVxuXG4gICAgdGhpcy4jcm9vdC5hcHBlbmRDaGlsZCh3cmFwcGVyKVxuICB9XG5cbiAgI2dldFBvaW50Q2lyY2xlUmFkaXVzKCkge1xuICAgIHJldHVybiAyOSAqICh0aGlzLmdldFJhZGl1cygpIC8gdGhpcy4jbnVtYmVyT2ZMZXZlbHMpXG4gIH1cblxuICAjZ2V0UnVsbGVyQ2lyY2xlUmFkaXVzKCkge1xuICAgIHJldHVybiAzMSAqICh0aGlzLmdldFJhZGl1cygpIC8gdGhpcy4jbnVtYmVyT2ZMZXZlbHMpXG4gIH1cblxuICAjZ2V0Q2VudGVyQ2lyY2xlUmFkaXVzKCkge1xuICAgIHJldHVybiAyNCAqICh0aGlzLmdldFJhZGl1cygpIC8gdGhpcy4jbnVtYmVyT2ZMZXZlbHMpXG4gIH1cblxufVxuXG5leHBvcnQge1xuICBUcmFuc2l0Q2hhcnQgYXNcbiAgZGVmYXVsdFxufVxuIiwiaW1wb3J0IFNWR1V0aWxzIGZyb20gJy4uL3V0aWxzL1NWR1V0aWxzLmpzJztcbmltcG9ydCBVdGlscyBmcm9tICcuLi91dGlscy9VdGlscy5qcyc7XG5cbi8qKlxuICogQGNsYXNzXG4gKiBAY2xhc3NkZXNjIFJlcHJlc2VudHMgYSBwbGFuZXQgb3IgcG9pbnQgb2YgaW50ZXJlc3QgaW4gdGhlIGNoYXJ0XG4gKiBAcHVibGljXG4gKi9cbmNsYXNzIFBvaW50IHtcblxuICAgICNuYW1lXG4gICAgI2FuZ2xlXG4gICAgI2lzUmV0cm9ncmFkZVxuICAgICNjdXNwc1xuICAgICNzZXR0aW5nc1xuXG4gICAgLyoqXG4gICAgICogQGNvbnN0cnVjdHNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcG9pbnREYXRhIC0ge25hbWU6U3RyaW5nLCBhbmdsZTpOdW1iZXIsIGlzUmV0cm9ncmFkZTpmYWxzZX1cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY3VzcHMgLSBbe2FuZ2xlOk51bWJlcn0sIHthbmdsZTpOdW1iZXJ9LCB7YW5nbGU6TnVtYmVyfSwgLi4uXVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzZXR0aW5nc1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHBvaW50RGF0YSwgY3VzcHMsIHNldHRpbmdzKSB7XG4gICAgICAgIHRoaXMuI25hbWUgPSBwb2ludERhdGEubmFtZSA/PyBcIlVua25vd25cIlxuICAgICAgICB0aGlzLiNhbmdsZSA9IHBvaW50RGF0YS5hbmdsZSA/PyAwXG4gICAgICAgIHRoaXMuI2lzUmV0cm9ncmFkZSA9IHBvaW50RGF0YS5pc1JldHJvZ3JhZGUgPz8gZmFsc2VcblxuICAgICAgICBpZiAoISBBcnJheS5pc0FycmF5KGN1c3BzKSB8fCBjdXNwcy5sZW5ndGggIT0gMTIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkJhZCBwYXJhbSBjdXNwcy4gXCIpXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLiNjdXNwcyA9IGN1c3BzXG5cbiAgICAgICAgaWYgKCEgc2V0dGluZ3MpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQmFkIHBhcmFtIHNldHRpbmdzLicpXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLiNzZXR0aW5ncyA9IHNldHRpbmdzXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IG5hbWVcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgKi9cbiAgICBnZXROYW1lKCkge1xuICAgICAgICByZXR1cm4gdGhpcy4jbmFtZVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIElzIHJldHJvZ3JhZGVcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgaXNSZXRyb2dyYWRlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy4jaXNSZXRyb2dyYWRlXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IGFuZ2xlXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAgICovXG4gICAgZ2V0QW5nbGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiNhbmdsZVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBzeW1ib2xcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB4UG9zXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHlQb3NcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gW2FuZ2xlU2hpZnRdXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBbaXNQcm9wZXJ0aWVzXSAtIGFuZ2xlSW5TaWduLCBkaWduaXRpZXMsIHJldHJvZ3JhZGVcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1NWR0VsZW1lbnR9XG4gICAgICovXG4gICAgZ2V0U3ltYm9sKHhQb3MsIHlQb3MsIGFuZ2xlU2hpZnQgPSAwLCBpc1Byb3BlcnRpZXMgPSB0cnVlKSB7XG4gICAgICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG5cbiAgICAgICAgY29uc3Qgc3ltYm9sID0gU1ZHVXRpbHMuU1ZHU3ltYm9sKHRoaXMuI25hbWUsIHhQb3MsIHlQb3MpXG5cbiAgICAgICAgaWYgKHRoaXMuI3NldHRpbmdzLkNMQVNTX0NFTEVTVElBTCkge1xuICAgICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCB0aGlzLiNzZXR0aW5ncy5DTEFTU19DRUxFU1RJQUwgKyAnICcgKyB0aGlzLiNzZXR0aW5ncy5DTEFTU19DRUxFU1RJQUwgKyAnLS0nICsgdGhpcy4jbmFtZS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoc3ltYm9sKVxuXG4gICAgICAgIGlmIChpc1Byb3BlcnRpZXMgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICByZXR1cm4gd3JhcHBlciAvLz09PT09PT5cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNoYXJ0Q2VudGVyWCA9IHRoaXMuI3NldHRpbmdzLkNIQVJUX1ZJRVdCT1hfV0lEVEggLyAyXG4gICAgICAgIGNvbnN0IGNoYXJ0Q2VudGVyWSA9IHRoaXMuI3NldHRpbmdzLkNIQVJUX1ZJRVdCT1hfSEVJR0hUIC8gMlxuICAgICAgICBjb25zdCBhbmdsZUZyb21TeW1ib2xUb0NlbnRlciA9IFV0aWxzLnBvc2l0aW9uVG9BbmdsZSh4UG9zLCB5UG9zLCBjaGFydENlbnRlclgsIGNoYXJ0Q2VudGVyWSlcblxuICAgICAgICBpZiAodGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19TSE9XX0FOR0xFKSB7XG4gICAgICAgICAgICBhbmdsZUluU2lnbi5jYWxsKHRoaXMpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19TSE9XX1JFVFJPR1JBREUgJiYgdGhpcy4jaXNSZXRyb2dyYWRlKSB7XG4gICAgICAgICAgICByZXRyb2dyYWRlLmNhbGwodGhpcylcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX1NIT1dfRElHTklUWSAmJiB0aGlzLmdldERpZ25pdHkoKSkge1xuICAgICAgICAgICAgZGlnbml0aWVzLmNhbGwodGhpcylcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB3cmFwcGVyIC8vPT09PT09PlxuXG4gICAgICAgIC8qXG4gICAgICAgICAqICBBbmdsZSBpbiBzaWduXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBhbmdsZUluU2lnbigpIHtcbiAgICAgICAgICAgIGNvbnN0IGFuZ2xlSW5TaWduUG9zaXRpb24gPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHhQb3MsIHlQb3MsIHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfQU5HTEVfT0ZGU0VUICogdGhpcy4jc2V0dGluZ3MuUE9JTlRfQ09MTElTSU9OX1JBRElVUywgVXRpbHMuZGVncmVlVG9SYWRpYW4oLWFuZ2xlRnJvbVN5bWJvbFRvQ2VudGVyLCBhbmdsZVNoaWZ0KSlcblxuICAgICAgICAgICAgLy8gSXQgaXMgcG9zc2libGUgdG8gcm90YXRlIHRoZSB0ZXh0LCB3aGVuIHVuY29tbWVudCBhIGxpbmUgYmVsbG93LlxuICAgICAgICAgICAgLy90ZXh0V3JhcHBlci5zZXRBdHRyaWJ1dGUoXCJ0cmFuc2Zvcm1cIiwgYHJvdGF0ZSgke2FuZ2xlRnJvbVN5bWJvbFRvQ2VudGVyfSwke3RleHRQb3NpdGlvbi54fSwke3RleHRQb3NpdGlvbi55fSlgKVxuXG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICogQWxsb3dzIGNoYW5nZSB0aGUgYW5nbGUgc3RyaW5nLCBlLmcuIGFkZCB0aGUgZGVncmVlIHN5bWJvbCDCsCB3aXRoIHRoZSBeIGNoYXJhY3RlciBmcm9tIEFzdHJvbm9taWNvblxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBsZXQgYW5nbGVQb3NpdGlvbiA9IFV0aWxzLmZpbGxUZW1wbGF0ZSh0aGlzLiNzZXR0aW5ncy5BTkdMRV9URU1QTEFURSwge2FuZ2xlOiB0aGlzLmdldEFuZ2xlSW5TaWduKCl9KTtcblxuICAgICAgICAgICAgY29uc3QgYW5nbGVJblNpZ25UZXh0ID0gU1ZHVXRpbHMuU1ZHVGV4dChhbmdsZUluU2lnblBvc2l0aW9uLngsIGFuZ2xlSW5TaWduUG9zaXRpb24ueSwgYW5nbGVQb3NpdGlvbilcbiAgICAgICAgICAgIGFuZ2xlSW5TaWduVGV4dC5zZXRBdHRyaWJ1dGUoXCJmb250LWZhbWlseVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9GT05UX0ZBTUlMWSk7XG4gICAgICAgICAgICBhbmdsZUluU2lnblRleHQuc2V0QXR0cmlidXRlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIikgLy8gc3RhcnQsIG1pZGRsZSwgZW5kXG4gICAgICAgICAgICBhbmdsZUluU2lnblRleHQuc2V0QXR0cmlidXRlKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcbiAgICAgICAgICAgIGFuZ2xlSW5TaWduVGV4dC5zZXRBdHRyaWJ1dGUoXCJmb250LXNpemVcIiwgdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19BTkdMRV9TSVpFIHx8IHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfRk9OVF9TSVpFKTtcbiAgICAgICAgICAgIGFuZ2xlSW5TaWduVGV4dC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfQU5HTEVfQ09MT1IgfHwgdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19DT0xPUik7XG4gICAgICAgICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGFuZ2xlSW5TaWduVGV4dClcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqICBSZXRyb2dyYWRlXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiByZXRyb2dyYWRlKCkge1xuICAgICAgICAgICAgY29uc3QgcmV0cm9ncmFkZVBvc2l0aW9uID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh4UG9zLCB5UG9zLCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX1JFVFJPR1JBREVfT0ZGU0VUICogdGhpcy4jc2V0dGluZ3MuUE9JTlRfQ09MTElTSU9OX1JBRElVUywgVXRpbHMuZGVncmVlVG9SYWRpYW4oLWFuZ2xlRnJvbVN5bWJvbFRvQ2VudGVyLCBhbmdsZVNoaWZ0KSlcblxuICAgICAgICAgICAgY29uc3QgcmV0cm9ncmFkZVRleHQgPSBTVkdVdGlscy5TVkdUZXh0KHJldHJvZ3JhZGVQb3NpdGlvbi54LCByZXRyb2dyYWRlUG9zaXRpb24ueSwgU1ZHVXRpbHMuU1lNQk9MX1JFVFJPR1JBREVfQ09ERSlcbiAgICAgICAgICAgIHJldHJvZ3JhZGVUZXh0LnNldEF0dHJpYnV0ZShcImZvbnQtZmFtaWx5XCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0ZPTlRfRkFNSUxZKTtcbiAgICAgICAgICAgIHJldHJvZ3JhZGVUZXh0LnNldEF0dHJpYnV0ZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpIC8vIHN0YXJ0LCBtaWRkbGUsIGVuZFxuICAgICAgICAgICAgcmV0cm9ncmFkZVRleHQuc2V0QXR0cmlidXRlKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcbiAgICAgICAgICAgIHJldHJvZ3JhZGVUZXh0LnNldEF0dHJpYnV0ZShcImZvbnQtc2l6ZVwiLCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX1JFVFJPR1JBREVfU0laRSB8fCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX0ZPTlRfU0laRSk7XG4gICAgICAgICAgICByZXRyb2dyYWRlVGV4dC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfUkVUUk9HUkFERV9DT0xPUiB8fCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX0NPTE9SKTtcbiAgICAgICAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQocmV0cm9ncmFkZVRleHQpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiAgRGlnbml0aWVzXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBkaWduaXRpZXMoKSB7XG4gICAgICAgICAgICBjb25zdCBkaWduaXRpZXNQb3NpdGlvbiA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUoeFBvcywgeVBvcywgdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19ESUdOSVRZX09GRlNFVCAqIHRoaXMuI3NldHRpbmdzLlBPSU5UX0NPTExJU0lPTl9SQURJVVMsIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKC1hbmdsZUZyb21TeW1ib2xUb0NlbnRlciwgYW5nbGVTaGlmdCkpXG4gICAgICAgICAgICBjb25zdCBkaWduaXRpZXNUZXh0ID0gU1ZHVXRpbHMuU1ZHVGV4dChkaWduaXRpZXNQb3NpdGlvbi54LCBkaWduaXRpZXNQb3NpdGlvbi55LCB0aGlzLmdldERpZ25pdHkoKSlcbiAgICAgICAgICAgIGRpZ25pdGllc1RleHQuc2V0QXR0cmlidXRlKFwiZm9udC1mYW1pbHlcIiwgXCJzYW5zLXNlcmlmXCIpO1xuICAgICAgICAgICAgZGlnbml0aWVzVGV4dC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKSAvLyBzdGFydCwgbWlkZGxlLCBlbmRcbiAgICAgICAgICAgIGRpZ25pdGllc1RleHQuc2V0QXR0cmlidXRlKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcbiAgICAgICAgICAgIGRpZ25pdGllc1RleHQuc2V0QXR0cmlidXRlKFwiZm9udC1zaXplXCIsIHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfRElHTklUWV9TSVpFIHx8IHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfRk9OVF9TSVpFKTtcbiAgICAgICAgICAgIGRpZ25pdGllc1RleHQuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX0RJR05JVFlfQ09MT1IgfHwgdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19DT0xPUik7XG4gICAgICAgICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGRpZ25pdGllc1RleHQpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgaG91c2UgbnVtYmVyXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAgICovXG4gICAgZ2V0SG91c2VOdW1iZXIoKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZCB5ZXQuXCIpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHNpZ24gbnVtYmVyXG4gICAgICogQXJpc2UgPSAxLCBUYXVydXMgPSAyLCAuLi5QaXNjZXMgPSAxMlxuICAgICAqXG4gICAgICogQHJldHVybiB7TnVtYmVyfVxuICAgICAqL1xuICAgIGdldFNpZ25OdW1iZXIoKSB7XG4gICAgICAgIGxldCBhbmdsZSA9IHRoaXMuI2FuZ2xlICUgVXRpbHMuREVHXzM2MFxuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcigoYW5nbGUgLyAzMCkgKyAxKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBhbmdsZSAoSW50ZWdlcikgaW4gdGhlIHNpZ24gaW4gd2hpY2ggaXQgc3RhbmRzLlxuICAgICAqXG4gICAgICogQHJldHVybiB7TnVtYmVyfVxuICAgICAqL1xuICAgIGdldEFuZ2xlSW5TaWduKCkge1xuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcih0aGlzLiNhbmdsZSAlIDMwKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBkaWduaXR5IHN5bWJvbCAociAtIHJ1bGVyc2hpcCwgZCAtIGRldHJpbWVudCwgZiAtIGZhbGwsIGUgLSBleGFsdGF0aW9uKVxuICAgICAqXG4gICAgICogQHJldHVybiB7U3RyaW5nfSAtIGRpZ25pdHkgc3ltYm9sIChyLGQsZixlKVxuICAgICAqL1xuICAgIGdldERpZ25pdHkoKSB7XG4gICAgICAgIGNvbnN0IEFSSUVTID0gMVxuICAgICAgICBjb25zdCBUQVVSVVMgPSAyXG4gICAgICAgIGNvbnN0IEdFTUlOSSA9IDNcbiAgICAgICAgY29uc3QgQ0FOQ0VSID0gNFxuICAgICAgICBjb25zdCBMRU8gPSA1XG4gICAgICAgIGNvbnN0IFZJUkdPID0gNlxuICAgICAgICBjb25zdCBMSUJSQSA9IDdcbiAgICAgICAgY29uc3QgU0NPUlBJTyA9IDhcbiAgICAgICAgY29uc3QgU0FHSVRUQVJJVVMgPSA5XG4gICAgICAgIGNvbnN0IENBUFJJQ09STiA9IDEwXG4gICAgICAgIGNvbnN0IEFRVUFSSVVTID0gMTFcbiAgICAgICAgY29uc3QgUElTQ0VTID0gMTJcblxuICAgICAgICBjb25zdCBSVUxFUlNISVBfU1lNQk9MID0gdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19ESUdOSVRZX1NZTUJPTFNbMF07XG4gICAgICAgIGNvbnN0IERFVFJJTUVOVF9TWU1CT0wgPSB0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX0RJR05JVFlfU1lNQk9MU1sxXTtcbiAgICAgICAgY29uc3QgRVhBTFRBVElPTl9TWU1CT0wgPSB0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX0RJR05JVFlfU1lNQk9MU1syXTtcbiAgICAgICAgY29uc3QgRkFMTF9TWU1CT0wgPSB0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX0RJR05JVFlfU1lNQk9MU1szXTtcblxuICAgICAgICBzd2l0Y2ggKHRoaXMuI25hbWUpIHtcbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1NVTjpcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gTEVPKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBSVUxFUlNISVBfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBBUVVBUklVUykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gREVUUklNRU5UX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gVklSR08pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEZBTExfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBBUklFUykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gRVhBTFRBVElPTl9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiXCJcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfTU9PTjpcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gQ0FOQ0VSKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBSVUxFUlNISVBfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBDQVBSSUNPUk4pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIERFVFJJTUVOVF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IFNDT1JQSU8pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEZBTExfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBUQVVSVVMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEVYQUxUQVRJT05fU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gXCJcIlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9NRVJDVVJZOlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBHRU1JTkkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFJVTEVSU0hJUF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IFNBR0lUVEFSSVVTKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBERVRSSU1FTlRfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBQSVNDRVMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEZBTExfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBWSVJHTykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gRVhBTFRBVElPTl9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBcIlwiXG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1ZFTlVTOlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBUQVVSVVMgfHwgdGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gTElCUkEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFJVTEVSU0hJUF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IEFSSUVTIHx8IHRoaXMuZ2V0U2lnbk51bWJlcigpID09IFNDT1JQSU8pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIERFVFJJTUVOVF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IFZJUkdPKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBGQUxMX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gUElTQ0VTKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBFWEFMVEFUSU9OX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiXCJcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfTUFSUzpcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gQVJJRVMgfHwgdGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gU0NPUlBJTykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUlVMRVJTSElQX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gVEFVUlVTIHx8IHRoaXMuZ2V0U2lnbk51bWJlcigpID09IExJQlJBKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBERVRSSU1FTlRfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBDQU5DRVIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEZBTExfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBDQVBSSUNPUk4pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEVYQUxUQVRJT05fU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gXCJcIlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9KVVBJVEVSOlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBTQUdJVFRBUklVUyB8fCB0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBQSVNDRVMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFJVTEVSU0hJUF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IEdFTUlOSSB8fCB0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBWSVJHTykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gREVUUklNRU5UX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gQ0FQUklDT1JOKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBGQUxMX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gQ0FOQ0VSKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBFWEFMVEFUSU9OX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiXCJcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfU0FUVVJOOlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBDQVBSSUNPUk4gfHwgdGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gQVFVQVJJVVMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFJVTEVSU0hJUF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IENBTkNFUiB8fCB0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBMRU8pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIERFVFJJTUVOVF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IEFSSUVTKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBGQUxMX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gTElCUkEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEVYQUxUQVRJT05fU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gXCJcIlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9VUkFOVVM6XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IEFRVUFSSVVTKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBSVUxFUlNISVBfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBMRU8pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIERFVFJJTUVOVF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IFRBVVJVUykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gRkFMTF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IFNDT1JQSU8pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEVYQUxUQVRJT05fU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gXCJcIlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9ORVBUVU5FOlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBQSVNDRVMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFJVTEVSU0hJUF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IFZJUkdPKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBERVRSSU1FTlRfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBHRU1JTkkgfHwgdGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gQVFVQVJJVVMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEZBTExfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBTQUdJVFRBUklVUyB8fCB0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBMRU8pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEVYQUxUQVRJT05fU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gXCJcIlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9QTFVUTzpcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gU0NPUlBJTykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUlVMRVJTSElQX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gVEFVUlVTKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBERVRSSU1FTlRfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBMSUJSQSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gRkFMTF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IEFSSUVTKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBFWEFMVEFUSU9OX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiXCJcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJcIlxuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQge1xuICAgIFBvaW50IGFzXG4gICAgICAgIGRlZmF1bHRcbn1cbiIsImltcG9ydCAqIGFzIFVuaXZlcnNlIGZyb20gXCIuL2NvbnN0YW50cy9Vbml2ZXJzZS5qc1wiXG5pbXBvcnQgKiBhcyBSYWRpeCBmcm9tIFwiLi9jb25zdGFudHMvUmFkaXguanNcIlxuaW1wb3J0ICogYXMgVHJhbnNpdCBmcm9tIFwiLi9jb25zdGFudHMvVHJhbnNpdC5qc1wiXG5pbXBvcnQgKiBhcyBQb2ludCBmcm9tIFwiLi9jb25zdGFudHMvUG9pbnQuanNcIlxuaW1wb3J0ICogYXMgQ29sb3JzIGZyb20gXCIuL2NvbnN0YW50cy9Db2xvcnMuanNcIlxuaW1wb3J0ICogYXMgQXNwZWN0cyBmcm9tIFwiLi9jb25zdGFudHMvQXNwZWN0cy5qc1wiXG5cbmNvbnN0IFNFVFRJTkdTID0gT2JqZWN0LmFzc2lnbih7fSwgVW5pdmVyc2UsIFJhZGl4LCBUcmFuc2l0LCBQb2ludCwgQ29sb3JzLCBBc3BlY3RzKTtcblxuZXhwb3J0IHtcbiAgU0VUVElOR1MgYXNcbiAgZGVmYXVsdFxufVxuIiwiLypcbiogQXNwZWN0cyB3cmFwcGVyIGVsZW1lbnQgSURcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0IGFzcGVjdHNcbiovXG5leHBvcnQgY29uc3QgQVNQRUNUU19JRCA9IFwiYXNwZWN0c1wiXG5cbi8qXG4qIERyYXcgYXNwZWN0cyBpbnRvIGNoYXJ0IGR1cmluZyByZW5kZXJcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtCb29sZWFufVxuKiBAZGVmYXVsdCB0cnVlXG4qL1xuZXhwb3J0IGNvbnN0IERSQVdfQVNQRUNUUyA9IHRydWVcblxuLypcbiogRm9udCBzaXplIC0gYXNwZWN0c1xuKiBAY29uc3RhbnRcbiogQHR5cGUge051bWJlcn1cbiogQGRlZmF1bHQgMjdcbiovXG5leHBvcnQgY29uc3QgQVNQRUNUU19GT05UX1NJWkUgPSAxOFxuXG4vKipcbiAqIERlZmF1bHQgYXNwZWN0c1xuICpcbiAqIEZyb20gaHR0cHM6Ly93d3cucmVkZGl0LmNvbS9yL2FzdHJvbG9neS9jb21tZW50cy94YmR5ODMvd2hhdHNfYV9nb29kX29yYl9yYW5nZV9mb3JfYXNwZWN0c19jb25qdW5jdGlvbi9cbiAqIE1hbnkgb3RoZXIgc2V0dGluZ3MsIHVzdWFsbHkgZGVwZW5kcyBvbiB0aGUgcGxhbmV0LCBTdW4gLyBNb29uIHVzZSB3aWRlciByYW5nZVxuICpcbiAqIG9yYiA6IHNldHMgdGhlIHRvbGVyYW5jZSBmb3IgdGhlIGFuZ2xlXG4gKlxuICogTWFqb3IgYXNwZWN0czpcbiAqXG4gKiAgICAge25hbWU6XCJDb25qdW5jdGlvblwiLCBhbmdsZTowLCBvcmI6NCwgaXNNYWpvcjogdHJ1ZX0sXG4gKiAgICAge25hbWU6XCJPcHBvc2l0aW9uXCIsIGFuZ2xlOjE4MCwgb3JiOjQsIGlzTWFqb3I6IHRydWV9LFxuICogICAgIHtuYW1lOlwiVHJpbmVcIiwgYW5nbGU6MTIwLCBvcmI6MiwgaXNNYWpvcjogdHJ1ZX0sXG4gKiAgICAge25hbWU6XCJTcXVhcmVcIiwgYW5nbGU6OTAsIG9yYjoyLCBpc01ham9yOiB0cnVlfSxcbiAqICAgICB7bmFtZTpcIlNleHRpbGVcIiwgYW5nbGU6NjAsIG9yYjoyLCBpc01ham9yOiB0cnVlfSxcbiAqXG4gKiBNaW5vciBhc3BlY3RzOlxuICpcbiAqICAgICB7bmFtZTpcIlF1aW5jdW54XCIsIGFuZ2xlOjE1MCwgb3JiOjF9LFxuICogICAgIHtuYW1lOlwiU2VtaXNleHRpbGVcIiwgYW5nbGU6MzAsIG9yYjoxfSxcbiAqICAgICB7bmFtZTpcIlF1aW50aWxlXCIsIGFuZ2xlOjcyLCBvcmI6MX0sXG4gKiAgICAge25hbWU6XCJUcmlvY3RpbGVcIiwgYW5nbGU6MTM1LCBvcmI6MX0sXG4gKiAgICAge25hbWU6XCJTZW1pc3F1YXJlXCIsIGFuZ2xlOjQ1LCBvcmI6MX0sXG4gKlxuICogQGNvbnN0YW50XG4gKiBAdHlwZSB7QXJyYXl9XG4gKi9cbmV4cG9ydCBjb25zdCBERUZBVUxUX0FTUEVDVFMgPSBbXG4gICAge25hbWU6XCJDb25qdW5jdGlvblwiLCBhbmdsZTowLCBvcmI6NCwgaXNNYWpvcjogdHJ1ZX0sXG4gICAge25hbWU6XCJPcHBvc2l0aW9uXCIsIGFuZ2xlOjE4MCwgb3JiOjQsIGlzTWFqb3I6IHRydWV9LFxuICAgIHtuYW1lOlwiVHJpbmVcIiwgYW5nbGU6MTIwLCBvcmI6MiwgaXNNYWpvcjogdHJ1ZX0sXG4gICAge25hbWU6XCJTcXVhcmVcIiwgYW5nbGU6OTAsIG9yYjoyLCBpc01ham9yOiB0cnVlfSxcbiAgICB7bmFtZTpcIlNleHRpbGVcIiwgYW5nbGU6NjAsIG9yYjoyLCBpc01ham9yOiB0cnVlfSxcblxuXVxuIiwiLyoqXG4qIENoYXJ0IGJhY2tncm91bmQgY29sb3JcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICNmZmZcbiovXG5leHBvcnQgY29uc3QgQ0hBUlRfQkFDS0dST1VORF9DT0xPUiA9IFwibm9uZVwiO1xuXG4vKipcbiogUGxhbmV0cyBiYWNrZ3JvdW5kIGNvbG9yXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjZmZmXG4qL1xuZXhwb3J0IGNvbnN0IFBMQU5FVFNfQkFDS0dST1VORF9DT0xPUiA9IFwiI2ZmZlwiO1xuXG4vKipcbiogQXNwZWN0cyBiYWNrZ3JvdW5kIGNvbG9yXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjZmZmXG4qL1xuZXhwb3J0IGNvbnN0IEFTUEVDVFNfQkFDS0dST1VORF9DT0xPUiA9IFwiI2VlZVwiO1xuXG4vKlxuKiBEZWZhdWx0IGNvbG9yIG9mIGNpcmNsZXMgaW4gY2hhcnRzXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjMzMzXG4qL1xuZXhwb3J0IGNvbnN0IENIQVJUX0NJUkNMRV9DT0xPUiA9IFwiIzMzM1wiO1xuXG4vKlxuKiBEZWZhdWx0IGNvbG9yIG9mIGxpbmVzIGluIGNoYXJ0c1xuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzMzM1xuKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9MSU5FX0NPTE9SID0gXCIjNjY2XCI7XG5cbi8qXG4qIERlZmF1bHQgY29sb3Igb2YgdGV4dCBpbiBjaGFydHNcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICMzMzNcbiovXG5leHBvcnQgY29uc3QgQ0hBUlRfVEVYVF9DT0xPUiA9IFwiI2JiYlwiO1xuXG4vKlxuKiBEZWZhdWx0IGNvbG9yIG9mIGN1c3BzIG51bWJlclxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzMzM1xuKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9IT1VTRV9OVU1CRVJfQ09MT1IgPSBcIiMzMzNcIjtcblxuLypcbiogRGVmYXVsdCBjb2xvciBvZiBtcWluIGF4aXMgLSBBcywgRHMsIE1jLCBJY1xuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzAwMFxuKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9NQUlOX0FYSVNfQ09MT1IgPSBcIiMwMDBcIjtcblxuLypcbiogRGVmYXVsdCBjb2xvciBvZiBzaWducyBpbiBjaGFydHMgKGFyaXNlIHN5bWJvbCwgdGF1cnVzIHN5bWJvbCwgLi4uKVxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzAwMFxuKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9TSUdOU19DT0xPUiA9IFwiIzMzM1wiO1xuXG4vKlxuKiBEZWZhdWx0IGNvbG9yIG9mIHBsYW5ldHMgb24gdGhlIGNoYXJ0IChTdW4gc3ltYm9sLCBNb29uIHN5bWJvbCwgLi4uKVxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzAwMFxuKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9QT0lOVFNfQ09MT1IgPSBcIiMwMDBcIjtcblxuLypcbiogRGVmYXVsdCBjb2xvciBmb3IgcG9pbnQgcHJvcGVydGllcyAtIGFuZ2xlIGluIHNpZ24sIGRpZ25pdGllcywgcmV0cm9ncmFkZVxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzMzM1xuKi9cbmV4cG9ydCBjb25zdCBQT0lOVF9QUk9QRVJUSUVTX0NPTE9SID0gXCIjMzMzXCJcblxuLypcbiogQXJpZXMgY29sb3JcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICNGRjQ1MDBcbiovXG5leHBvcnQgY29uc3QgQ09MT1JfQVJJRVMgPSBcIiNGRjQ1MDBcIjtcblxuLypcbiogVGF1cnVzIGNvbG9yXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjOEI0NTEzXG4qL1xuZXhwb3J0IGNvbnN0IENPTE9SX1RBVVJVUyA9IFwiIzhCNDUxM1wiO1xuXG4vKlxuKiBHZW1pbnkgY29sb3JcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICM4N0NFRUJcbiovXG5leHBvcnQgY29uc3QgQ09MT1JfR0VNSU5JPSBcIiM4N0NFRUJcIjtcblxuLypcbiogQ2FuY2VyIGNvbG9yXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjMjdBRTYwXG4qL1xuZXhwb3J0IGNvbnN0IENPTE9SX0NBTkNFUiA9IFwiIzI3QUU2MFwiO1xuXG4vKlxuKiBMZW8gY29sb3JcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICNGRjQ1MDBcbiovXG5leHBvcnQgY29uc3QgQ09MT1JfTEVPID0gXCIjRkY0NTAwXCI7XG5cbi8qXG4qIFZpcmdvIGNvbG9yXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjOEI0NTEzXG4qL1xuZXhwb3J0IGNvbnN0IENPTE9SX1ZJUkdPID0gXCIjOEI0NTEzXCI7XG5cbi8qXG4qIExpYnJhIGNvbG9yXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjODdDRUVCXG4qL1xuZXhwb3J0IGNvbnN0IENPTE9SX0xJQlJBID0gXCIjODdDRUVCXCI7XG5cbi8qXG4qIFNjb3JwaW8gY29sb3JcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICMyN0FFNjBcbiovXG5leHBvcnQgY29uc3QgQ09MT1JfU0NPUlBJTyA9IFwiIzI3QUU2MFwiO1xuXG4vKlxuKiBTYWdpdHRhcml1cyBjb2xvclxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgI0ZGNDUwMFxuKi9cbmV4cG9ydCBjb25zdCBDT0xPUl9TQUdJVFRBUklVUyA9IFwiI0ZGNDUwMFwiO1xuXG4vKlxuKiBDYXByaWNvcm4gY29sb3JcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICM4QjQ1MTNcbiovXG5leHBvcnQgY29uc3QgQ09MT1JfQ0FQUklDT1JOID0gXCIjOEI0NTEzXCI7XG5cbi8qXG4qIEFxdWFyaXVzIGNvbG9yXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjODdDRUVCXG4qL1xuZXhwb3J0IGNvbnN0IENPTE9SX0FRVUFSSVVTID0gXCIjODdDRUVCXCI7XG5cbi8qXG4qIFBpc2NlcyBjb2xvclxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzI3QUU2MFxuKi9cbmV4cG9ydCBjb25zdCBDT0xPUl9QSVNDRVMgPSBcIiMyN0FFNjBcIjtcblxuLypcbiogQ29sb3Igb2YgY2lyY2xlcyBpbiBjaGFydHNcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICMzMzNcbiovXG5leHBvcnQgY29uc3QgQ0lSQ0xFX0NPTE9SID0gXCIjMzMzXCI7XG5cbi8qXG4qIENvbG9yIG9mIGFzcGVjdHNcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtPYmplY3R9XG4qL1xuZXhwb3J0IGNvbnN0IEFTUEVDVF9DT0xPUlMgPSB7XG4gIENvbmp1bmN0aW9uOlwiIzMzM1wiLFxuICBPcHBvc2l0aW9uOlwiIzFCNEY3MlwiLFxuICBTcXVhcmU6XCIjNjQxRTE2XCIsXG4gIFRyaW5lOlwiIzBCNTM0NVwiLFxuICBTZXh0aWxlOlwiIzMzM1wiLFxuICBRdWluY3VueDpcIiMzMzNcIixcbiAgU2VtaXNleHRpbGU6XCIjMzMzXCIsXG4gIFF1aW50aWxlOlwiIzMzM1wiLFxuICBUcmlvY3RpbGU6XCIjMzMzXCJcbn1cblxuLyoqXG4gKiBPdmVycmlkZSBpbmRpdmlkdWFsIHBsYW5ldCBzeW1ib2wgY29sb3JzIGJ5IHBsYW5ldCBuYW1lXG4gKi9cbmV4cG9ydCBjb25zdCBQTEFORVRfQ09MT1JTID0ge1xuICAvL1N1bjogXCIjMDAwXCIsXG4gIC8vTW9vbjogXCIjYWFhXCIsXG59XG5cbi8qKlxuICogb3ZlcnJpZGUgaW5kaXZpZHVhbCBzaWduIHN5bWJvbCBjb2xvcnMgYnkgem9kaWFjIGluZGV4XG4gKi9cbmV4cG9ydCBjb25zdCBTSUdOX0NPTE9SUyA9IHtcbiAgLy8wOiBcIiMzMzNcIlxufVxuXG4vKipcbiAqIE92ZXJyaWRlIGluZGl2aWR1YWwgcGxhbmV0IHN5bWJvbCBjb2xvcnMgYnkgcGxhbmV0IG5hbWUgb24gdHJhbnNpdCBjaGFydHNcbiAqL1xuZXhwb3J0IGNvbnN0IFRSQU5TSVRfUExBTkVUX0NPTE9SUyA9IHtcbiAgLy9TdW46IFwiIzAwMFwiLFxuICAvL01vb246IFwiI2FhYVwiLFxufVxuIiwiLypcbiogUG9pbnQgcHJvcGVydGllcyAtIGFuZ2xlIGluIHNpZ24sIGRpZ25pdGllcywgcmV0cm9ncmFkZVxuKiBAY29uc3RhbnRcbiogQHR5cGUge0Jvb2xlYW59XG4qIEBkZWZhdWx0IHRydWVcbiovXG5leHBvcnQgY29uc3QgUE9JTlRfUFJPUEVSVElFU19TSE9XID0gdHJ1ZVxuXG4vKlxuKiBQb2ludCBhbmdsZSBpbiBzaWduXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7Qm9vbGVhbn1cbiogQGRlZmF1bHQgdHJ1ZVxuKi9cbmV4cG9ydCBjb25zdCBQT0lOVF9QUk9QRVJUSUVTX1NIT1dfQU5HTEUgPSB0cnVlXG5cbi8qXG4qIFBvaW50IGRpZ25pdHkgc3ltYm9sXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7Qm9vbGVhbn1cbiogQGRlZmF1bHQgdHJ1ZVxuKi9cbmV4cG9ydCBjb25zdCBQT0lOVF9QUk9QRVJUSUVTX1NIT1dfRElHTklUWSA9IHRydWVcblxuLypcbiogUG9pbnQgcmV0cm9ncmFkZSBzeW1ib2xcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtCb29sZWFufVxuKiBAZGVmYXVsdCB0cnVlXG4qL1xuZXhwb3J0IGNvbnN0IFBPSU5UX1BST1BFUlRJRVNfU0hPV19SRVRST0dSQURFID0gdHJ1ZVxuXG4vKlxuKiBQb2ludCBkaWduaXR5IHN5bWJvbHMgLSBbZG9taWNpbGUsIGRldHJpbWVudCwgZXhhbHRhdGlvbiwgZmFsbF1cbiogQGNvbnN0YW50XG4qIEB0eXBlIHtCb29sZWFufVxuKiBAZGVmYXVsdCB0cnVlXG4qL1xuZXhwb3J0IGNvbnN0IFBPSU5UX1BST1BFUlRJRVNfRElHTklUWV9TWU1CT0xTID0gW1wiclwiLCBcImRcIiwgXCJlXCIsIFwiZlwiXTtcblxuLypcbiogVGV4dCBzaXplIG9mIFBvaW50IGRlc2NyaXB0aW9uIC0gYW5nbGUgaW4gc2lnbiwgZGlnbml0aWVzLCByZXRyb2dyYWRlXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7TnVtYmVyfVxuKiBAZGVmYXVsdCA2XG4qL1xuZXhwb3J0IGNvbnN0IFBPSU5UX1BST1BFUlRJRVNfRk9OVF9TSVpFID0gMTZcblxuLypcbiogVGV4dCBzaXplIG9mIGFuZ2xlIG51bWJlclxuKiBAY29uc3RhbnRcbiogQHR5cGUge051bWJlcn1cbiogQGRlZmF1bHQgNlxuKi9cbmV4cG9ydCBjb25zdCBQT0lOVF9QUk9QRVJUSUVTX0FOR0xFX1NJWkUgPSAyNVxuXG4vKlxuKiBUZXh0IHNpemUgb2YgcmV0cm9ncmFkZSBzeW1ib2xcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtOdW1iZXJ9XG4qIEBkZWZhdWx0IDZcbiovXG5leHBvcnQgY29uc3QgUE9JTlRfUFJPUEVSVElFU19SRVRST0dSQURFX1NJWkUgPSAyNVxuXG4vKlxuKiBUZXh0IHNpemUgb2YgZGlnbml0eSBzeW1ib2xcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtOdW1iZXJ9XG4qIEBkZWZhdWx0IDZcbiovXG5leHBvcnQgY29uc3QgUE9JTlRfUFJPUEVSVElFU19ESUdOSVRZX1NJWkUgPSAxMlxuXG4vKlxuKiBBbmdsZSBvZmZzZXQgbXVsdGlwbGllclxuKiBAY29uc3RhbnRcbiogQHR5cGUge051bWJlcn1cbiogQGRlZmF1bHQgNlxuKi9cbmV4cG9ydCBjb25zdCBQT0lOVF9QUk9QRVJUSUVTX0FOR0xFX09GRlNFVCA9IDJcblxuLypcbiogUmV0cm9ncmFkZSBzeW1ib2wgb2Zmc2V0IG11bHRpcGxpZXJcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtOdW1iZXJ9XG4qIEBkZWZhdWx0IDZcbiovXG5leHBvcnQgY29uc3QgUE9JTlRfUFJPUEVSVElFU19SRVRST0dSQURFX09GRlNFVCA9IDMuNVxuXG4vKlxuKiBEaWduaXR5IHN5bWJvbCBvZmZzZXQgbXVsdGlwbGllclxuKiBAY29uc3RhbnRcbiogQHR5cGUge051bWJlcn1cbiogQGRlZmF1bHQgNlxuKi9cbmV4cG9ydCBjb25zdCBQT0lOVF9QUk9QRVJUSUVTX0RJR05JVFlfT0ZGU0VUID0gNVxuXG4vKipcbiogQSBwb2ludCBjb2xsaXNpb24gcmFkaXVzXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7TnVtYmVyfVxuKiBAZGVmYXVsdCAyXG4qL1xuZXhwb3J0IGNvbnN0IFBPSU5UX0NPTExJU0lPTl9SQURJVVMgPSAxMlxuXG4vKipcbiAqIFR3ZWFrIHRoZSBhbmdsZSBzdHJpbmcsIGUuZy4gYWRkIHRoZSBkZWdyZWUgc3ltYm9sOiBcIiR7YW5nbGV9wrBcIlxuICogQHR5cGUge3N0cmluZ31cbiAqL1xuZXhwb3J0IGNvbnN0IEFOR0xFX1RFTVBMQVRFID0gXCIke2FuZ2xlfVwiIiwiLypcbiogUmFkaXggY2hhcnQgZWxlbWVudCBJRFxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgcmFkaXhcbiovXG5leHBvcnQgY29uc3QgUkFESVhfSUQgPSBcInJhZGl4XCJcblxuLypcbiogRm9udCBzaXplIC0gcG9pbnRzIChwbGFuZXRzKVxuKiBAY29uc3RhbnRcbiogQHR5cGUge051bWJlcn1cbiogQGRlZmF1bHQgMjdcbiovXG5leHBvcnQgY29uc3QgUkFESVhfUE9JTlRTX0ZPTlRfU0laRSA9IDI3XG5cbi8qXG4qIEZvbnQgc2l6ZSAtIGhvdXNlIGN1c3AgbnVtYmVyXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7TnVtYmVyfVxuKiBAZGVmYXVsdCAyN1xuKi9cbmV4cG9ydCBjb25zdCBSQURJWF9IT1VTRV9GT05UX1NJWkUgPSAyMFxuXG4vKlxuKiBGb250IHNpemUgLSBzaWduc1xuKiBAY29uc3RhbnRcbiogQHR5cGUge051bWJlcn1cbiogQGRlZmF1bHQgMjdcbiovXG5leHBvcnQgY29uc3QgUkFESVhfU0lHTlNfRk9OVF9TSVpFID0gMjdcblxuLypcbiogRm9udCBzaXplIC0gYXhpcyAoQXMsIERzLCBNYywgSWMpXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7TnVtYmVyfVxuKiBAZGVmYXVsdCAyNFxuKi9cbmV4cG9ydCBjb25zdCBSQURJWF9BWElTX0ZPTlRfU0laRSA9IDMyXG4iLCIvKlxuKiBUcmFuc2l0IGNoYXJ0IGVsZW1lbnQgSURcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0IHRyYW5zaXRcbiovXG5leHBvcnQgY29uc3QgVFJBTlNJVF9JRCA9IFwidHJhbnNpdFwiXG5cbi8qXG4qIEZvbnQgc2l6ZSAtIHBvaW50cyAocGxhbmV0cylcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtOdW1iZXJ9XG4qIEBkZWZhdWx0IDMyXG4qL1xuZXhwb3J0IGNvbnN0IFRSQU5TSVRfUE9JTlRTX0ZPTlRfU0laRSA9IDI3XG4iLCIvKipcbiAqIENoYXJ0IHBhZGRpbmdcbiAqIEBjb25zdGFudFxuICogQHR5cGUge051bWJlcn1cbiAqIEBkZWZhdWx0IDEwcHhcbiAqL1xuZXhwb3J0IGNvbnN0IENIQVJUX1BBRERJTkcgPSA0MFxuXG4vKipcbiAqIFNWRyB2aWV3Qm94IHdpZHRoXG4gKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL1NWRy9BdHRyaWJ1dGUvdmlld0JveFxuICogQGNvbnN0YW50XG4gKiBAdHlwZSB7TnVtYmVyfVxuICogQGRlZmF1bHQgODAwXG4gKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9WSUVXQk9YX1dJRFRIID0gODAwXG5cbi8qKlxuICogU1ZHIHZpZXdCb3ggaGVpZ2h0XG4gKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL1NWRy9BdHRyaWJ1dGUvdmlld0JveFxuICogQGNvbnN0YW50XG4gKiBAdHlwZSB7TnVtYmVyfVxuICogQGRlZmF1bHQgODAwXG4gKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9WSUVXQk9YX0hFSUdIVCA9IDgwMFxuXG4vKlxuKiBMaW5lIHN0cmVuZ3RoXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7TnVtYmVyfVxuKiBAZGVmYXVsdCAxXG4qL1xuZXhwb3J0IGNvbnN0IENIQVJUX1NUUk9LRSA9IDFcblxuLypcbiogTGluZSBzdHJlbmd0aCBvZiB0aGUgbWFpbiBsaW5lcy4gRm9yIGluc3RhbmNlIHBvaW50cywgbWFpbiBheGlzLCBtYWluIGNpcmNsZXNcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtOdW1iZXJ9XG4qIEBkZWZhdWx0IDFcbiovXG5leHBvcnQgY29uc3QgQ0hBUlRfTUFJTl9TVFJPS0UgPSAyXG5cbi8qKlxuICogTGluZSBzdHJlbmd0aCBmb3IgbWlub3IgYXNwZWN0c1xuICpcbiAqIEB0eXBlIHtudW1iZXJ9XG4gKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9TVFJPS0VfTUlOT1JfQVNQRUNUID0gMVxuXG4vKipcbiAqIE5vIGZpbGwsIG9ubHkgc3Ryb2tlXG4gKiBAY29uc3RhbnRcbiAqIEB0eXBlIHtib29sZWFufVxuICogQGRlZmF1bHQgZmFsc2VcbiAqL1xuZXhwb3J0IGNvbnN0IENIQVJUX1NUUk9LRV9PTkxZID0gZmFsc2U7XG5cbi8qKlxuICogRm9udCBmYW1pbHlcbiAqIEBjb25zdGFudFxuICogQHR5cGUge1N0cmluZ31cbiAqIEBkZWZhdWx0XG4gKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9GT05UX0ZBTUlMWSA9IFwiQXN0cm9ub21pY29uXCI7XG5cbi8qKlxuICogQWx3YXlzIGRyYXcgdGhlIGZ1bGwgaG91c2UgbGluZXMsIGV2ZW4gaWYgaXQgb3ZlcmxhcHMgd2l0aCBwbGFuZXRzXG4gKiBAY29uc3RhbnRcbiAqIEB0eXBlIHtib29sZWFufVxuICogQGRlZmF1bHQgZmFsc2VcbiAqL1xuZXhwb3J0IGNvbnN0IENIQVJUX0FMTE9XX0hPVVNFX09WRVJMQVAgPSBmYWxzZTtcblxuLyoqXG4gKiBEcmF3IG1haW5zIGF4aXMgc3ltYm9scyBvdXRzaWRlIHRoZSBjaGFydDogQWMsIE1jLCBJYywgRGNcbiAqIEBjb25zdGFudFxuICogQHR5cGUge2Jvb2xlYW59XG4gKiBAZGVmYXVsdCBmYWxzZVxuICovXG5leHBvcnQgY29uc3QgQ0hBUlRfRFJBV19NQUlOX0FYSVMgPSB0cnVlO1xuXG5cbi8qKlxuICogU3Ryb2tlICYgZmlsbFxuICogQGNvbnN0YW50XG4gKiBAdHlwZSB7Ym9vbGVhbn1cbiAqIEBkZWZhdWx0IGZhbHNlXG4gKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9TVFJPS0VfV0lUSF9DT0xPUiA9IGZhbHNlO1xuXG5cbi8qKlxuICogQWxsIGNsYXNzbmFtZXNcbiAqL1xuXG4vKipcbiAqIENsYXNzIGZvciB0aGUgc2lnbiBzZWdtZW50LCBiZWhpbmQgdGhlIGFjdHVhbCBzaWduXG4gKiBAdHlwZSB7c3RyaW5nfVxuICovXG5leHBvcnQgY29uc3QgQ0xBU1NfU0lHTl9TRUdNRU5UID0gJyc7XG5cbi8qKlxuICogQ2xhc3MgZm9yIHRoZSBzaWduXG4gKiBJZiBub3QgZW1wdHksIGFub3RoZXIgY2xhc3Mgd2lsbCBiZSBhZGRlZCB1c2luZyBzYW1lIHN0cmluZywgd2l0aCBhIG1vZGlmaWVyIGxpa2UgLS1zaWduX25hbWVcbiAqIEB0eXBlIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBjb25zdCBDTEFTU19TSUdOID0gJyc7XG5cbi8qKlxuICogQ2xhc3MgZm9yIGF4aXMgQXNjZW5kYW50LCBNaWRoZWF2ZW4sIERlc2NlbmRhbnQgYW5kIEltdW0gQ29lbGlcbiAqIElmIG5vdCBlbXB0eSwgYW5vdGhlciBjbGFzcyB3aWxsIGJlIGFkZGVkIHVzaW5nIHNhbWUgc3RyaW5nLCB3aXRoIGEgbW9kaWZpZXIgbGlrZSAtLWF4aXNfbmFtZVxuICogQHR5cGUge3N0cmluZ31cbiAqL1xuZXhwb3J0IGNvbnN0IENMQVNTX0FYSVMgPSAnJztcblxuLyoqXG4gKiBDbGFzcyBmb3IgQ2VsZXN0aWFsIEJvZGllcyAoUGxhbmV0IC8gQXN0ZXJpb2QpXG4gKiBhbmQgQ2VsZXN0aWFsIFBvaW50cyAobm9ydGhub2RlLCBzb3V0aG5vZGUsIGxpbGl0aClcbiAqIEB0eXBlIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBjb25zdCBDTEFTU19DRUxFU1RJQUwgPSAnJztcblxuLyoqXG4gKiBDbGFzcyBmb3IgdGhlIGFzcGVjdCBjaGFyYWN0ZXJcbiAqIEB0eXBlIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBjb25zdCBDTEFTU19TSUdOX0FTUEVDVCA9ICcnO1xuXG4vKipcbiAqIENsYXNzIGZvciBhc3BlY3QgbGluZXNcbiAqIEB0eXBlIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBjb25zdCBDTEFTU19TSUdOX0FTUEVDVF9MSU5FID0gJyc7XG5cbi8qKlxuICogVXNlIHBsYW5ldCBjb2xvciBmb3IgdGhlIGNoYXJ0IGxpbmUgbmV4dCB0byBhIHBsYW5ldFxuICogQHR5cGUge2Jvb2xlYW59XG4gKi9cbmV4cG9ydCBjb25zdCBQTEFORVRfTElORV9VU0VfUExBTkVUX0NPTE9SID0gZmFsc2U7XG5cbi8qKlxuICogRHJhdyBhIHJ1bGVyIG1hcmsgKHRpbnkgc3F1YXJlKSBhdCBwbGFuZXQgcG9zaXRpb25cbiAqL1xuZXhwb3J0IGNvbnN0IERSQVdfUlVMRVJfTUFSSyA9IHRydWU7IiwiaW1wb3J0IERlZmF1bHRTZXR0aW5ncyBmcm9tICcuLi9zZXR0aW5ncy9EZWZhdWx0U2V0dGluZ3MuanMnO1xuaW1wb3J0IFNWR1V0aWxzIGZyb20gJy4uL3V0aWxzL1NWR1V0aWxzLmpzJztcbmltcG9ydCBVdGlscyBmcm9tICcuLi91dGlscy9VdGlscy5qcyc7XG5pbXBvcnQgUmFkaXhDaGFydCBmcm9tICcuLi9jaGFydHMvUmFkaXhDaGFydC5qcyc7XG5pbXBvcnQgVHJhbnNpdENoYXJ0IGZyb20gJy4uL2NoYXJ0cy9UcmFuc2l0Q2hhcnQuanMnO1xuXG5cbi8qKlxuICogQGNsYXNzXG4gKiBAY2xhc3NkZXNjIEFuIHdyYXBwZXIgZm9yIGFsbCBwYXJ0cyBvZiBncmFwaC5cbiAqIEBwdWJsaWNcbiAqL1xuY2xhc3MgVW5pdmVyc2Uge1xuXG4gICNTVkdEb2N1bWVudFxuICAjc2V0dGluZ3NcbiAgI3JhZGl4XG4gICN0cmFuc2l0XG4gICNhc3BlY3RzV3JhcHBlclxuXG4gIC8qKlxuICAgKiBAY29uc3RydWN0c1xuICAgKiBAcGFyYW0ge1N0cmluZ30gaHRtbEVsZW1lbnRJRCAtIElEIG9mIHRoZSByb290IGVsZW1lbnQgd2l0aG91dCB0aGUgIyBzaWduXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gLSBBbiBvYmplY3QgdGhhdCBvdmVycmlkZXMgdGhlIGRlZmF1bHQgc2V0dGluZ3MgdmFsdWVzXG4gICAqL1xuICBjb25zdHJ1Y3RvcihodG1sRWxlbWVudElELCBvcHRpb25zID0ge30pIHtcblxuICAgIGlmICh0eXBlb2YgaHRtbEVsZW1lbnRJRCAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQSByZXF1aXJlZCBwYXJhbWV0ZXIgaXMgbWlzc2luZy4nKVxuICAgIH1cblxuICAgIGlmICghZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaHRtbEVsZW1lbnRJRCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fub3QgZmluZCBhIEhUTUwgZWxlbWVudCB3aXRoIElEICcgKyBodG1sRWxlbWVudElEKVxuICAgIH1cblxuICAgIHRoaXMuI3NldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgRGVmYXVsdFNldHRpbmdzLCBvcHRpb25zLCB7XG4gICAgICBIVE1MX0VMRU1FTlRfSUQ6IGh0bWxFbGVtZW50SURcbiAgICB9KTtcbiAgICB0aGlzLiNTVkdEb2N1bWVudCA9IFNWR1V0aWxzLlNWR0RvY3VtZW50KHRoaXMuI3NldHRpbmdzLkNIQVJUX1ZJRVdCT1hfV0lEVEgsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1ZJRVdCT1hfSEVJR0hUKVxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGh0bWxFbGVtZW50SUQpLmFwcGVuZENoaWxkKHRoaXMuI1NWR0RvY3VtZW50KTtcblxuICAgIC8vIGNoYXJ0IGJhY2tncm91bmRcbiAgICBjb25zdCBjaXJjbGUgPSBTVkdVdGlscy5TVkdDaXJjbGUodGhpcy4jc2V0dGluZ3MuQ0hBUlRfVklFV0JPWF9XSURUSCAvIDIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1ZJRVdCT1hfSEVJR0hUIC8gMiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfVklFV0JPWF9XSURUSCAvIDIpXG4gICAgY2lyY2xlLnNldEF0dHJpYnV0ZSgnZmlsbCcsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0JBQ0tHUk9VTkRfQ09MT1IpXG4gICAgdGhpcy4jU1ZHRG9jdW1lbnQuYXBwZW5kQ2hpbGQoY2lyY2xlKVxuXG4gICAgLy8gY3JlYXRlIHdyYXBwZXIgZm9yIGFzcGVjdHNcbiAgICB0aGlzLiNhc3BlY3RzV3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcbiAgICB0aGlzLiNhc3BlY3RzV3JhcHBlci5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBgJHt0aGlzLiNzZXR0aW5ncy5IVE1MX0VMRU1FTlRfSUR9LSR7dGhpcy4jc2V0dGluZ3MuQVNQRUNUU19JRH1gKVxuICAgIHRoaXMuI1NWR0RvY3VtZW50LmFwcGVuZENoaWxkKHRoaXMuI2FzcGVjdHNXcmFwcGVyKVxuXG4gICAgdGhpcy4jcmFkaXggPSBuZXcgUmFkaXhDaGFydCh0aGlzKVxuICAgIHRoaXMuI3RyYW5zaXQgPSBuZXcgVHJhbnNpdENoYXJ0KHRoaXMuI3JhZGl4KVxuXG4gICAgdGhpcy4jbG9hZEZvbnQoXCJBc3Ryb25vbWljb25cIiwgJy4uL2Fzc2V0cy9mb250cy90dGYvQXN0cm9ub21pY29uRm9udHNfMS4xL0FzdHJvbm9taWNvbi50dGYnKVxuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIC8vICMjIFBVQkxJQyAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuICAvKipcbiAgICogR2V0IFJhZGl4IGNoYXJ0XG4gICAqIEByZXR1cm4ge1JhZGl4Q2hhcnR9XG4gICAqL1xuICByYWRpeCgpIHtcbiAgICByZXR1cm4gdGhpcy4jcmFkaXhcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgVHJhbnNpdCBjaGFydFxuICAgKiBAcmV0dXJuIHtUcmFuc2l0Q2hhcnR9XG4gICAqL1xuICB0cmFuc2l0KCkge1xuICAgIHJldHVybiB0aGlzLiN0cmFuc2l0XG4gIH1cblxuICAvKipcbiAgICogR2V0IGN1cnJlbnQgc2V0dGluZ3NcbiAgICogQHJldHVybiB7T2JqZWN0fVxuICAgKi9cbiAgZ2V0U2V0dGluZ3MoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3NldHRpbmdzXG4gIH1cblxuICAvKipcbiAgICogR2V0IHJvb3QgU1ZHIGRvY3VtZW50XG4gICAqIEByZXR1cm4ge1NWR0RvY3VtZW50fVxuICAgKi9cbiAgZ2V0U1ZHRG9jdW1lbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI1NWR0RvY3VtZW50XG4gIH1cblxuICAvKipcbiAgICogR2V0IGVtcHR5IGFzcGVjdHMgd3JhcHBlciBlbGVtZW50XG4gICAqIEByZXR1cm4ge1NWR0dyb3VwRWxlbWVudH1cbiAgICovXG4gIGdldEFzcGVjdHNFbGVtZW50KCkge1xuICAgIHJldHVybiB0aGlzLiNhc3BlY3RzV3JhcHBlclxuICB9XG5cbiAgLy8gIyMgUFJJVkFURSAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuICAvKlxuICAqIExvYWQgZm9uZCB0byBET01cbiAgKlxuICAqIEBwYXJhbSB7U3RyaW5nfSBmYW1pbHlcbiAgKiBAcGFyYW0ge1N0cmluZ30gc291cmNlXG4gICogQHBhcmFtIHtPYmplY3R9XG4gICpcbiAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9Gb250RmFjZS9Gb250RmFjZVxuICAqL1xuICBhc3luYyAjbG9hZEZvbnQoIGZhbWlseSwgc291cmNlLCBkZXNjcmlwdG9ycyApe1xuXG4gICAgaWYgKCEoJ0ZvbnRGYWNlJyBpbiB3aW5kb3cpKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiT29vcHMsIEZvbnRGYWNlIGlzIG5vdCBhIGZ1bmN0aW9uLlwiKVxuICAgICAgY29uc29sZS5lcnJvcihcIkBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0NTU19Gb250X0xvYWRpbmdfQVBJXCIpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb25zdCBmb250ID0gbmV3IEZvbnRGYWNlKGZhbWlseSwgYHVybCgke3NvdXJjZX0pYCwgZGVzY3JpcHRvcnMpXG5cbiAgICB0cnl7XG4gICAgICBhd2FpdCBmb250LmxvYWQoKTtcbiAgICAgIGRvY3VtZW50LmZvbnRzLmFkZChmb250KVxuICAgIH1jYXRjaChlKXtcbiAgICAgIHRocm93IG5ldyBFcnJvcihlKVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQge1xuICBVbml2ZXJzZSBhc1xuICBkZWZhdWx0XG59XG4iLCJpbXBvcnQgVXRpbHMgZnJvbSAnLi9VdGlscy5qcydcbmltcG9ydCBTVkdVdGlscyBmcm9tICcuL1NWR1V0aWxzLmpzJztcblxuLyoqXG4gKiBAY2xhc3NcbiAqIEBjbGFzc2Rlc2MgVXRpbGl0eSBjbGFzc1xuICogQHB1YmxpY1xuICogQHN0YXRpY1xuICogQGhpZGVjb25zdHJ1Y3RvclxuICovXG5jbGFzcyBBc3BlY3RVdGlscyB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgaWYgKHRoaXMgaW5zdGFuY2VvZiBBc3BlY3RVdGlscykge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoJ1RoaXMgaXMgYSBzdGF0aWMgY2xhc3MgYW5kIGNhbm5vdCBiZSBpbnN0YW50aWF0ZWQuJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDYWxjdWxhdGVzIHRoZSBvcmJpdCBvZiB0d28gYW5nbGVzIG9uIGEgY2lyY2xlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gZnJvbUFuZ2xlIC0gYW5nbGUgaW4gZGVncmVlLCBwb2ludCBvbiB0aGUgY2lyY2xlXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHRvQW5nbGUgLSBhbmdsZSBpbiBkZWdyZWUsIHBvaW50IG9uIHRoZSBjaXJjbGVcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gYXNwZWN0QW5nbGUgLSA2MCw5MCwxMjAsIC4uLlxuICAgICAqXG4gICAgICogQHJldHVybiB7TnVtYmVyfSBvcmJcbiAgICAgKi9cbiAgICBzdGF0aWMgb3JiKGZyb21BbmdsZSwgdG9BbmdsZSwgYXNwZWN0QW5nbGUpIHtcbiAgICAgICAgbGV0IG9yYlxuICAgICAgICBsZXQgc2lnbiA9IGZyb21BbmdsZSA+IHRvQW5nbGUgPyAxIDogLTFcbiAgICAgICAgbGV0IGRpZmZlcmVuY2UgPSBNYXRoLmFicyhmcm9tQW5nbGUgLSB0b0FuZ2xlKVxuXG4gICAgICAgIGlmIChkaWZmZXJlbmNlID4gVXRpbHMuREVHXzE4MCkge1xuICAgICAgICAgICAgZGlmZmVyZW5jZSA9IFV0aWxzLkRFR18zNjAgLSBkaWZmZXJlbmNlO1xuICAgICAgICAgICAgb3JiID0gKGRpZmZlcmVuY2UgLSBhc3BlY3RBbmdsZSkgKiAtMVxuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvcmIgPSAoZGlmZmVyZW5jZSAtIGFzcGVjdEFuZ2xlKSAqIHNpZ25cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBOdW1iZXIoTnVtYmVyKG9yYikudG9GaXhlZCgyKSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgYXNwZWN0c1xuICAgICAqXG4gICAgICogQHBhcmFtIHtBcnJheTxPYmplY3Q+fSBmcm9tUG9pbnRzIC0gW3tuYW1lOlwiTW9vblwiLCBhbmdsZTowfSwge25hbWU6XCJTdW5cIiwgYW5nbGU6MTc5fSwge25hbWU6XCJNZXJjdXJ5XCIsIGFuZ2xlOjEyMX1dXG4gICAgICogQHBhcmFtIHtBcnJheTxPYmplY3Q+fSB0b1BvaW50cyAtIFt7bmFtZTpcIkFTXCIsIGFuZ2xlOjB9LCB7bmFtZTpcIklDXCIsIGFuZ2xlOjkwfV1cbiAgICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IGFzcGVjdHMgLSBbe25hbWU6XCJPcHBvc2l0aW9uXCIsIGFuZ2xlOjE4MCwgb3JiOjJ9LCB7bmFtZTpcIlRyaW5lXCIsIGFuZ2xlOjEyMCwgb3JiOjJ9XVxuICAgICAqXG4gICAgICogQHJldHVybiB7QXJyYXk8T2JqZWN0Pn1cbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0QXNwZWN0cyhmcm9tUG9pbnRzLCB0b1BvaW50cywgYXNwZWN0cykge1xuICAgICAgICBjb25zdCBhc3BlY3RMaXN0ID0gW11cbiAgICAgICAgZm9yIChjb25zdCBmcm9tUCBvZiBmcm9tUG9pbnRzKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHRvUCBvZiB0b1BvaW50cykge1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgYXNwZWN0IG9mIGFzcGVjdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3JiID0gQXNwZWN0VXRpbHMub3JiKGZyb21QLmFuZ2xlLCB0b1AuYW5nbGUsIGFzcGVjdC5hbmdsZSlcbiAgICAgICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKG9yYikgPD0gYXNwZWN0Lm9yYikge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXNwZWN0TGlzdC5wdXNoKHthc3BlY3Q6IGFzcGVjdCwgZnJvbTogZnJvbVAsIHRvOiB0b1AsIHByZWNpc2lvbjogb3JifSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhc3BlY3RMaXN0XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRHJhdyBhc3BlY3RzXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gcmFkaXVzXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGFzY2VuZGFudFNoaWZ0XG4gICAgICogQHBhcmFtIHtPYmplY3R9IHNldHRpbmdzXG4gICAgICogQHBhcmFtIHtBcnJheTxPYmplY3Q+fSBhc3BlY3RzTGlzdFxuICAgICAqXG4gICAgICogQHJldHVybiB7U1ZHR3JvdXBFbGVtZW50fVxuICAgICAqL1xuICAgIHN0YXRpYyBkcmF3QXNwZWN0cyhyYWRpdXMsIGFzY2VuZGFudFNoaWZ0LCBzZXR0aW5ncywgYXNwZWN0c0xpc3QpIHtcbiAgICAgICAgY29uc3QgY2VudGVyWCA9IHNldHRpbmdzLkNIQVJUX1ZJRVdCT1hfV0lEVEggLyAyXG4gICAgICAgIGNvbnN0IGNlbnRlclkgPSBzZXR0aW5ncy5DSEFSVF9WSUVXQk9YX0hFSUdIVCAvIDJcblxuICAgICAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZW9yZGVyIGFzcGVjdHNcbiAgICAgICAgICogRHJhdyBtaW5vciBhc3BlY3RzIGZpcnN0XG4gICAgICAgICAqL1xuICAgICAgICBhc3BlY3RzTGlzdC5zb3J0KChhLCBiKSA9PiAoKGEuYXNwZWN0LmlzTWFqb3IgPz8gZmFsc2UpID09PSAoYi5hc3BlY3QuaXNNYWpvciA/PyBmYWxzZSkpID8gMCA6IChhLmFzcGVjdC5pc01ham9yID8/IGZhbHNlKSA/IDEgOiAtMSlcblxuICAgICAgICAvKipcbiAgICAgICAgICogRHJhdyBsaW5lcyBmaXJzdFxuICAgICAgICAgKi9cbiAgICAgICAgZm9yIChjb25zdCBhc3Agb2YgYXNwZWN0c0xpc3QpIHtcbiAgICAgICAgICAgIC8vIGFzcGVjdCBhcyBzb2xpZCBsaW5lXG4gICAgICAgICAgICBjb25zdCBmcm9tUG9pbnQgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKGNlbnRlclgsIGNlbnRlclksIHJhZGl1cywgVXRpbHMuZGVncmVlVG9SYWRpYW4oYXNwLmZyb20uYW5nbGUsIGFzY2VuZGFudFNoaWZ0KSlcbiAgICAgICAgICAgIGNvbnN0IHRvUG9pbnQgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKGNlbnRlclgsIGNlbnRlclksIHJhZGl1cywgVXRpbHMuZGVncmVlVG9SYWRpYW4oYXNwLnRvLmFuZ2xlLCBhc2NlbmRhbnRTaGlmdCkpXG5cbiAgICAgICAgICAgIC8vIHNwYWNlIGZvciBzeW1ib2wgKGZyb21Qb2ludCAtIGNlbnRlcilcbiAgICAgICAgICAgIGNvbnN0IGZyb21Qb2ludFNwYWNlWCA9IGZyb21Qb2ludC54ICsgKHRvUG9pbnQueCAtIGZyb21Qb2ludC54KSAvIDIuMlxuICAgICAgICAgICAgY29uc3QgZnJvbVBvaW50U3BhY2VZID0gZnJvbVBvaW50LnkgKyAodG9Qb2ludC55IC0gZnJvbVBvaW50LnkpIC8gMi4yXG5cbiAgICAgICAgICAgIC8vIHNwYWNlIGZvciBzeW1ib2wgKGNlbnRlciAtIHRvUG9pbnQpXG4gICAgICAgICAgICBjb25zdCB0b1BvaW50U3BhY2VYID0gdG9Qb2ludC54ICsgKGZyb21Qb2ludC54IC0gdG9Qb2ludC54KSAvIDIuMlxuICAgICAgICAgICAgY29uc3QgdG9Qb2ludFNwYWNlWSA9IHRvUG9pbnQueSArIChmcm9tUG9pbnQueSAtIHRvUG9pbnQueSkgLyAyLjJcblxuICAgICAgICAgICAgLy8gbGluZTogZnJvbVBvaW50IC0gY2VudGVyXG4gICAgICAgICAgICBjb25zdCBsaW5lMSA9IFNWR1V0aWxzLlNWR0xpbmUoZnJvbVBvaW50LngsIGZyb21Qb2ludC55LCBmcm9tUG9pbnRTcGFjZVgsIGZyb21Qb2ludFNwYWNlWSlcbiAgICAgICAgICAgIGxpbmUxLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCBzZXR0aW5ncy5BU1BFQ1RfQ09MT1JTW2FzcC5hc3BlY3QubmFtZV0gPz8gXCIjMzMzXCIpO1xuXG4gICAgICAgICAgICBpZiAoc2V0dGluZ3MuQ0hBUlRfU1RST0tFX01JTk9SX0FTUEVDVCAmJiAhIChhc3AuYXNwZWN0LmlzTWFqb3IgPz8gZmFsc2UpKSB7XG4gICAgICAgICAgICAgICAgbGluZTEuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHNldHRpbmdzLkNIQVJUX1NUUk9LRV9NSU5PUl9BU1BFQ1QpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsaW5lMS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgc2V0dGluZ3MuQ0hBUlRfU1RST0tFKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHNldHRpbmdzLkNMQVNTX1NJR05fQVNQRUNUX0xJTkUpIHtcbiAgICAgICAgICAgICAgICBsaW5lMS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBzZXR0aW5ncy5DTEFTU19TSUdOX0FTUEVDVF9MSU5FKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBsaW5lOiBjZW50ZXIgLSB0b1BvaW50XG4gICAgICAgICAgICBjb25zdCBsaW5lMiA9IFNWR1V0aWxzLlNWR0xpbmUodG9Qb2ludFNwYWNlWCwgdG9Qb2ludFNwYWNlWSwgdG9Qb2ludC54LCB0b1BvaW50LnkpXG4gICAgICAgICAgICBsaW5lMi5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgc2V0dGluZ3MuQVNQRUNUX0NPTE9SU1thc3AuYXNwZWN0Lm5hbWVdID8/IFwiIzMzM1wiKTtcblxuICAgICAgICAgICAgaWYgKHNldHRpbmdzLkNIQVJUX1NUUk9LRV9NSU5PUl9BU1BFQ1QgJiYgISAoYXNwLmFzcGVjdC5pc01ham9yID8/IGZhbHNlKSkge1xuICAgICAgICAgICAgICAgIGxpbmUyLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCBzZXR0aW5ncy5DSEFSVF9TVFJPS0VfTUlOT1JfQVNQRUNUKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGluZTIuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHNldHRpbmdzLkNIQVJUX1NUUk9LRSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzZXR0aW5ncy5DTEFTU19TSUdOX0FTUEVDVF9MSU5FKSB7XG4gICAgICAgICAgICAgICAgbGluZTIuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgc2V0dGluZ3MuQ0xBU1NfU0lHTl9BU1BFQ1RfTElORSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChsaW5lMSk7XG4gICAgICAgICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGxpbmUyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEcmF3IGFsbCBhc3BlY3RzIGFib3ZlIGxpbmVzXG4gICAgICAgICAqL1xuICAgICAgICBmb3IgKGNvbnN0IGFzcCBvZiBhc3BlY3RzTGlzdCkge1xuXG4gICAgICAgICAgICAvLyBhc3BlY3QgYXMgc29saWQgbGluZVxuICAgICAgICAgICAgY29uc3QgZnJvbVBvaW50ID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZShjZW50ZXJYLCBjZW50ZXJZLCByYWRpdXMsIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKGFzcC5mcm9tLmFuZ2xlLCBhc2NlbmRhbnRTaGlmdCkpXG4gICAgICAgICAgICBjb25zdCB0b1BvaW50ID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZShjZW50ZXJYLCBjZW50ZXJZLCByYWRpdXMsIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKGFzcC50by5hbmdsZSwgYXNjZW5kYW50U2hpZnQpKVxuXG4gICAgICAgICAgICAvLyBkcmF3IHN5bWJvbCBpbiBjZW50ZXIgb2YgYXNwZWN0XG4gICAgICAgICAgICBjb25zdCBsaW5lQ2VudGVyWCA9IChmcm9tUG9pbnQueCArIHRvUG9pbnQueCkgLyAyXG4gICAgICAgICAgICBjb25zdCBsaW5lQ2VudGVyWSA9IChmcm9tUG9pbnQueSArIHRvUG9pbnQueSkgLyAyXG4gICAgICAgICAgICBjb25zdCBzeW1ib2wgPSBTVkdVdGlscy5TVkdTeW1ib2woYXNwLmFzcGVjdC5uYW1lLCBsaW5lQ2VudGVyWCwgbGluZUNlbnRlclkpXG4gICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZm9udC1mYW1pbHlcIiwgc2V0dGluZ3MuQ0hBUlRfRk9OVF9GQU1JTFkpO1xuICAgICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpIC8vIHN0YXJ0LCBtaWRkbGUsIGVuZFxuICAgICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImRvbWluYW50LWJhc2VsaW5lXCIsIFwibWlkZGxlXCIpXG4gICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZm9udC1zaXplXCIsIHNldHRpbmdzLkFTUEVDVFNfRk9OVF9TSVpFKTtcbiAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIHNldHRpbmdzLkFTUEVDVF9DT0xPUlNbYXNwLmFzcGVjdC5uYW1lXSA/PyBcIiMzMzNcIik7XG5cbiAgICAgICAgICAgIGlmIChzZXR0aW5ncy5DTEFTU19TSUdOX0FTUEVDVCkge1xuICAgICAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBzZXR0aW5ncy5DTEFTU19TSUdOX0FTUEVDVClcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChzeW1ib2wpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHdyYXBwZXJcbiAgICB9XG5cbn1cblxuZXhwb3J0IHtcbiAgICBBc3BlY3RVdGlscyBhc1xuICAgICAgICBkZWZhdWx0XG59XG4iLCIvKipcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyBTVkcgdXRpbGl0eSBjbGFzc1xuICogQHB1YmxpY1xuICogQHN0YXRpY1xuICogQGhpZGVjb25zdHJ1Y3RvclxuICovXG5jbGFzcyBTVkdVdGlscyB7XG5cbiAgICBzdGF0aWMgU1ZHX05BTUVTUEFDRSA9IFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxuXG4gICAgc3RhdGljIFNZTUJPTF9BUklFUyA9IFwiQXJpZXNcIjtcbiAgICBzdGF0aWMgU1lNQk9MX1RBVVJVUyA9IFwiVGF1cnVzXCI7XG4gICAgc3RhdGljIFNZTUJPTF9HRU1JTkkgPSBcIkdlbWluaVwiO1xuICAgIHN0YXRpYyBTWU1CT0xfQ0FOQ0VSID0gXCJDYW5jZXJcIjtcbiAgICBzdGF0aWMgU1lNQk9MX0xFTyA9IFwiTGVvXCI7XG4gICAgc3RhdGljIFNZTUJPTF9WSVJHTyA9IFwiVmlyZ29cIjtcbiAgICBzdGF0aWMgU1lNQk9MX0xJQlJBID0gXCJMaWJyYVwiO1xuICAgIHN0YXRpYyBTWU1CT0xfU0NPUlBJTyA9IFwiU2NvcnBpb1wiO1xuICAgIHN0YXRpYyBTWU1CT0xfU0FHSVRUQVJJVVMgPSBcIlNhZ2l0dGFyaXVzXCI7XG4gICAgc3RhdGljIFNZTUJPTF9DQVBSSUNPUk4gPSBcIkNhcHJpY29yblwiO1xuICAgIHN0YXRpYyBTWU1CT0xfQVFVQVJJVVMgPSBcIkFxdWFyaXVzXCI7XG4gICAgc3RhdGljIFNZTUJPTF9QSVNDRVMgPSBcIlBpc2Nlc1wiO1xuXG4gICAgc3RhdGljIFNZTUJPTF9TVU4gPSBcIlN1blwiO1xuICAgIHN0YXRpYyBTWU1CT0xfTU9PTiA9IFwiTW9vblwiO1xuICAgIHN0YXRpYyBTWU1CT0xfTUVSQ1VSWSA9IFwiTWVyY3VyeVwiO1xuICAgIHN0YXRpYyBTWU1CT0xfVkVOVVMgPSBcIlZlbnVzXCI7XG4gICAgc3RhdGljIFNZTUJPTF9FQVJUSCA9IFwiRWFydGhcIjtcbiAgICBzdGF0aWMgU1lNQk9MX01BUlMgPSBcIk1hcnNcIjtcbiAgICBzdGF0aWMgU1lNQk9MX0pVUElURVIgPSBcIkp1cGl0ZXJcIjtcbiAgICBzdGF0aWMgU1lNQk9MX1NBVFVSTiA9IFwiU2F0dXJuXCI7XG4gICAgc3RhdGljIFNZTUJPTF9VUkFOVVMgPSBcIlVyYW51c1wiO1xuICAgIHN0YXRpYyBTWU1CT0xfTkVQVFVORSA9IFwiTmVwdHVuZVwiO1xuICAgIHN0YXRpYyBTWU1CT0xfUExVVE8gPSBcIlBsdXRvXCI7XG4gICAgc3RhdGljIFNZTUJPTF9DSElST04gPSBcIkNoaXJvblwiO1xuICAgIHN0YXRpYyBTWU1CT0xfTElMSVRIID0gXCJMaWxpdGhcIjtcbiAgICBzdGF0aWMgU1lNQk9MX05OT0RFID0gXCJOTm9kZVwiO1xuICAgIHN0YXRpYyBTWU1CT0xfU05PREUgPSBcIlNOb2RlXCI7XG5cbiAgICBzdGF0aWMgU1lNQk9MX0FTID0gXCJBc1wiO1xuICAgIHN0YXRpYyBTWU1CT0xfRFMgPSBcIkRzXCI7XG4gICAgc3RhdGljIFNZTUJPTF9NQyA9IFwiTWNcIjtcbiAgICBzdGF0aWMgU1lNQk9MX0lDID0gXCJJY1wiO1xuXG4gICAgc3RhdGljIFNZTUJPTF9SRVRST0dSQURFID0gXCJSZXRyb2dyYWRlXCJcblxuICAgIHN0YXRpYyBTWU1CT0xfQ09OSlVOQ1RJT04gPSBcIkNvbmp1bmN0aW9uXCI7XG4gICAgc3RhdGljIFNZTUJPTF9PUFBPU0lUSU9OID0gXCJPcHBvc2l0aW9uXCI7XG4gICAgc3RhdGljIFNZTUJPTF9TUVVBUkUgPSBcIlNxdWFyZVwiO1xuICAgIHN0YXRpYyBTWU1CT0xfVFJJTkUgPSBcIlRyaW5lXCI7XG4gICAgc3RhdGljIFNZTUJPTF9TRVhUSUxFID0gXCJTZXh0aWxlXCI7XG4gICAgc3RhdGljIFNZTUJPTF9RVUlOQ1VOWCA9IFwiUXVpbmN1bnhcIjtcbiAgICBzdGF0aWMgU1lNQk9MX1NFTUlTRVhUSUxFID0gXCJTZW1pc2V4dGlsZVwiO1xuICAgIHN0YXRpYyBTWU1CT0xfT0NUSUxFID0gXCJPY3RpbGVcIjtcbiAgICBzdGF0aWMgU1lNQk9MX1RSSU9DVElMRSA9IFwiVHJpb2N0aWxlXCI7XG4gICAgc3RhdGljIFNZTUJPTF9RVUlOVElMRSA9IFwiUXVpbnRpbGVcIjtcblxuICAgIC8vIEFzdHJvbm9taWNvbiBmb250IGNvZGVzXG4gICAgc3RhdGljIFNZTUJPTF9BUklFU19DT0RFID0gXCJBXCI7XG4gICAgc3RhdGljIFNZTUJPTF9UQVVSVVNfQ09ERSA9IFwiQlwiO1xuICAgIHN0YXRpYyBTWU1CT0xfR0VNSU5JX0NPREUgPSBcIkNcIjtcbiAgICBzdGF0aWMgU1lNQk9MX0NBTkNFUl9DT0RFID0gXCJEXCI7XG4gICAgc3RhdGljIFNZTUJPTF9MRU9fQ09ERSA9IFwiRVwiO1xuICAgIHN0YXRpYyBTWU1CT0xfVklSR09fQ09ERSA9IFwiRlwiO1xuICAgIHN0YXRpYyBTWU1CT0xfTElCUkFfQ09ERSA9IFwiR1wiO1xuICAgIHN0YXRpYyBTWU1CT0xfU0NPUlBJT19DT0RFID0gXCJIXCI7XG4gICAgc3RhdGljIFNZTUJPTF9TQUdJVFRBUklVU19DT0RFID0gXCJJXCI7XG4gICAgc3RhdGljIFNZTUJPTF9DQVBSSUNPUk5fQ09ERSA9IFwiSlwiO1xuICAgIHN0YXRpYyBTWU1CT0xfQVFVQVJJVVNfQ09ERSA9IFwiS1wiO1xuICAgIHN0YXRpYyBTWU1CT0xfUElTQ0VTX0NPREUgPSBcIkxcIjtcblxuICAgIHN0YXRpYyBTWU1CT0xfU1VOX0NPREUgPSBcIlFcIjtcbiAgICBzdGF0aWMgU1lNQk9MX01PT05fQ09ERSA9IFwiUlwiO1xuICAgIHN0YXRpYyBTWU1CT0xfTUVSQ1VSWV9DT0RFID0gXCJTXCI7XG4gICAgc3RhdGljIFNZTUJPTF9WRU5VU19DT0RFID0gXCJUXCI7XG4gICAgc3RhdGljIFNZTUJPTF9FQVJUSF9DT0RFID0gXCI+XCI7XG4gICAgc3RhdGljIFNZTUJPTF9NQVJTX0NPREUgPSBcIlVcIjtcbiAgICBzdGF0aWMgU1lNQk9MX0pVUElURVJfQ09ERSA9IFwiVlwiO1xuICAgIHN0YXRpYyBTWU1CT0xfU0FUVVJOX0NPREUgPSBcIldcIjtcbiAgICBzdGF0aWMgU1lNQk9MX1VSQU5VU19DT0RFID0gXCJYXCI7XG4gICAgc3RhdGljIFNZTUJPTF9ORVBUVU5FX0NPREUgPSBcIllcIjtcbiAgICBzdGF0aWMgU1lNQk9MX1BMVVRPX0NPREUgPSBcIlpcIjtcbiAgICBzdGF0aWMgU1lNQk9MX0NISVJPTl9DT0RFID0gXCJxXCI7XG4gICAgc3RhdGljIFNZTUJPTF9MSUxJVEhfQ09ERSA9IFwielwiO1xuICAgIHN0YXRpYyBTWU1CT0xfTk5PREVfQ09ERSA9IFwiZ1wiO1xuICAgIHN0YXRpYyBTWU1CT0xfU05PREVfQ09ERSA9IFwiaVwiO1xuXG4gICAgc3RhdGljIFNZTUJPTF9BU19DT0RFID0gXCJjXCI7XG4gICAgc3RhdGljIFNZTUJPTF9EU19DT0RFID0gXCJmXCI7XG4gICAgc3RhdGljIFNZTUJPTF9NQ19DT0RFID0gXCJkXCI7XG4gICAgc3RhdGljIFNZTUJPTF9JQ19DT0RFID0gXCJlXCI7XG5cbiAgICBzdGF0aWMgU1lNQk9MX1JFVFJPR1JBREVfQ09ERSA9IFwiTVwiXG5cblxuICAgIHN0YXRpYyBTWU1CT0xfQ09OSlVOQ1RJT05fQ09ERSA9IFwiIVwiO1xuICAgIHN0YXRpYyBTWU1CT0xfT1BQT1NJVElPTl9DT0RFID0gJ1wiJztcbiAgICBzdGF0aWMgU1lNQk9MX1NRVUFSRV9DT0RFID0gXCIjXCI7XG4gICAgc3RhdGljIFNZTUJPTF9UUklORV9DT0RFID0gXCIkXCI7XG4gICAgc3RhdGljIFNZTUJPTF9TRVhUSUxFX0NPREUgPSBcIiVcIjtcblxuICAgIC8qKlxuICAgICAqIFF1aW5jdW54IChJbmNvbmp1bmN0KVxuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICovXG4gICAgc3RhdGljIFNZTUJPTF9RVUlOQ1VOWF9DT0RFID0gXCImXCI7XG5cbiAgICBzdGF0aWMgU1lNQk9MX1NFTUlTRVhUSUxFX0NPREUgPSBcIidcIjtcblxuICAgIC8qKlxuICAgICAqIFNlbWktU3F1YXJlIG9yIE9jdGlsZVxuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICovXG4gICAgc3RhdGljIFNZTUJPTF9PQ1RJTEVfQ09ERSA9IFwiKFwiO1xuXG4gICAgLyoqXG4gICAgICogU2VzcXVpcXVhZHJhdGUgb3IgVHJpLU9jdGlsZVxuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICovXG4gICAgc3RhdGljIFNZTUJPTF9UUklPQ1RJTEVfQ09ERSA9IFwiKVwiO1xuXG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgaWYgKHRoaXMgaW5zdGFuY2VvZiBTVkdVdGlscykge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoJ1RoaXMgaXMgYSBzdGF0aWMgY2xhc3MgYW5kIGNhbm5vdCBiZSBpbnN0YW50aWF0ZWQuJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBTVkcgZG9jdW1lbnRcbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gd2lkdGhcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gaGVpZ2h0XG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtTVkdEb2N1bWVudH1cbiAgICAgKi9cbiAgICBzdGF0aWMgU1ZHRG9jdW1lbnQod2lkdGgsIGhlaWdodCkge1xuICAgICAgICBjb25zdCBzdmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoU1ZHVXRpbHMuU1ZHX05BTUVTUEFDRSwgXCJzdmdcIik7XG4gICAgICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ3htbG5zJywgU1ZHVXRpbHMuU1ZHX05BTUVTUEFDRSk7XG4gICAgICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ3ZlcnNpb24nLCBcIjEuMVwiKTtcbiAgICAgICAgc3ZnLnNldEF0dHJpYnV0ZSgndmlld0JveCcsIFwiMCAwIFwiICsgd2lkdGggKyBcIiBcIiArIGhlaWdodCk7XG4gICAgICAgIHJldHVybiBzdmdcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBTVkcgZ3JvdXAgZWxlbWVudFxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEByZXR1cm4ge1NWR0dyb3VwRWxlbWVudH1cbiAgICAgKi9cbiAgICBzdGF0aWMgU1ZHR3JvdXAoKSB7XG4gICAgICAgIGNvbnN0IGcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoU1ZHVXRpbHMuU1ZHX05BTUVTUEFDRSwgXCJnXCIpO1xuICAgICAgICByZXR1cm4gZ1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIFNWRyBwYXRoIGVsZW1lbnRcbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAcmV0dXJuIHtTVkdHcm91cEVsZW1lbnR9XG4gICAgICovXG4gICAgc3RhdGljIFNWR1BhdGgoKSB7XG4gICAgICAgIGNvbnN0IHBhdGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoU1ZHVXRpbHMuU1ZHX05BTUVTUEFDRSwgXCJwYXRoXCIpO1xuICAgICAgICByZXR1cm4gcGF0aFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIFNWRyBtYXNrIGVsZW1lbnRcbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZWxlbWVudElEXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtTVkdNYXNrRWxlbWVudH1cbiAgICAgKi9cbiAgICBzdGF0aWMgU1ZHTWFzayhlbGVtZW50SUQpIHtcbiAgICAgICAgY29uc3QgbWFzayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTVkdVdGlscy5TVkdfTkFNRVNQQUNFLCBcIm1hc2tcIik7XG4gICAgICAgIG1hc2suc2V0QXR0cmlidXRlKFwiaWRcIiwgZWxlbWVudElEKVxuICAgICAgICByZXR1cm4gbWFza1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNWRyBjaXJjdWxhciBzZWN0b3JcbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAcGFyYW0ge2ludH0geCAtIGNpcmNsZSB4IGNlbnRlciBwb3NpdGlvblxuICAgICAqIEBwYXJhbSB7aW50fSB5IC0gY2lyY2xlIHkgY2VudGVyIHBvc2l0aW9uXG4gICAgICogQHBhcmFtIHtpbnR9IHJhZGl1cyAtIGNpcmNsZSByYWRpdXMgaW4gcHhcbiAgICAgKiBAcGFyYW0ge2ludH0gYTEgLSBhbmdsZUZyb20gaW4gcmFkaWFuc1xuICAgICAqIEBwYXJhbSB7aW50fSBhMiAtIGFuZ2xlVG8gaW4gcmFkaWFuc1xuICAgICAqIEBwYXJhbSB7aW50fSB0aGlja25lc3MgLSBmcm9tIG91dHNpZGUgdG8gY2VudGVyIGluIHB4XG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtTVkdFbGVtZW50fSBzZWdtZW50XG4gICAgICovXG4gICAgc3RhdGljIFNWR1NlZ21lbnQoeCwgeSwgcmFkaXVzLCBhMSwgYTIsIHRoaWNrbmVzcywgbEZsYWcsIHNGbGFnKSB7XG4gICAgICAgIC8vIEBzZWUgU1ZHIFBhdGggYXJjOiBodHRwczovL3d3dy53My5vcmcvVFIvU1ZHL3BhdGhzLmh0bWwjUGF0aERhdGFcbiAgICAgICAgY29uc3QgTEFSR0VfQVJDX0ZMQUcgPSBsRmxhZyB8fCAwO1xuICAgICAgICBjb25zdCBTV0VFVF9GTEFHID0gc0ZsYWcgfHwgMDtcblxuICAgICAgICBjb25zdCBzZWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFNWR1V0aWxzLlNWR19OQU1FU1BBQ0UsIFwicGF0aFwiKTtcbiAgICAgICAgc2VnbWVudC5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwiTSBcIiArICh4ICsgdGhpY2tuZXNzICogTWF0aC5jb3MoYTEpKSArIFwiLCBcIiArICh5ICsgdGhpY2tuZXNzICogTWF0aC5zaW4oYTEpKSArIFwiIGwgXCIgKyAoKHJhZGl1cyAtIHRoaWNrbmVzcykgKiBNYXRoLmNvcyhhMSkpICsgXCIsIFwiICsgKChyYWRpdXMgLSB0aGlja25lc3MpICogTWF0aC5zaW4oYTEpKSArIFwiIEEgXCIgKyByYWRpdXMgKyBcIiwgXCIgKyByYWRpdXMgKyBcIiwwICxcIiArIExBUkdFX0FSQ19GTEFHICsgXCIsIFwiICsgU1dFRVRfRkxBRyArIFwiLCBcIiArICh4ICsgcmFkaXVzICogTWF0aC5jb3MoYTIpKSArIFwiLCBcIiArICh5ICsgcmFkaXVzICogTWF0aC5zaW4oYTIpKSArIFwiIGwgXCIgKyAoKHJhZGl1cyAtIHRoaWNrbmVzcykgKiAtTWF0aC5jb3MoYTIpKSArIFwiLCBcIiArICgocmFkaXVzIC0gdGhpY2tuZXNzKSAqIC1NYXRoLnNpbihhMikpICsgXCIgQSBcIiArIHRoaWNrbmVzcyArIFwiLCBcIiArIHRoaWNrbmVzcyArIFwiLDAgLFwiICsgTEFSR0VfQVJDX0ZMQUcgKyBcIiwgXCIgKyAxICsgXCIsIFwiICsgKHggKyB0aGlja25lc3MgKiBNYXRoLmNvcyhhMSkpICsgXCIsIFwiICsgKHkgKyB0aGlja25lc3MgKiBNYXRoLnNpbihhMSkpKTtcbiAgICAgICAgc2VnbWVudC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwibm9uZVwiKTtcbiAgICAgICAgcmV0dXJuIHNlZ21lbnQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU1ZHIGNpcmNsZVxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBwYXJhbSB7aW50fSBjeFxuICAgICAqIEBwYXJhbSB7aW50fSBjeVxuICAgICAqIEBwYXJhbSB7aW50fSByYWRpdXNcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1NWR0VsZW1lbnR9IGNpcmNsZVxuICAgICAqL1xuICAgIHN0YXRpYyBTVkdDaXJjbGUoY3gsIGN5LCByYWRpdXMpIHtcbiAgICAgICAgY29uc3QgY2lyY2xlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFNWR1V0aWxzLlNWR19OQU1FU1BBQ0UsIFwiY2lyY2xlXCIpO1xuICAgICAgICBjaXJjbGUuc2V0QXR0cmlidXRlKFwiY3hcIiwgY3gpO1xuICAgICAgICBjaXJjbGUuc2V0QXR0cmlidXRlKFwiY3lcIiwgY3kpO1xuICAgICAgICBjaXJjbGUuc2V0QXR0cmlidXRlKFwiclwiLCByYWRpdXMpO1xuICAgICAgICBjaXJjbGUuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XG4gICAgICAgIHJldHVybiBjaXJjbGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU1ZHIGxpbmVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB4MVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB5MlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB4MlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB5MlxuICAgICAqXG4gICAgICogQHJldHVybiB7U1ZHRWxlbWVudH0gbGluZVxuICAgICAqL1xuICAgIHN0YXRpYyBTVkdMaW5lKHgxLCB5MSwgeDIsIHkyKSB7XG4gICAgICAgIGNvbnN0IGxpbmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoU1ZHVXRpbHMuU1ZHX05BTUVTUEFDRSwgXCJsaW5lXCIpO1xuICAgICAgICBsaW5lLnNldEF0dHJpYnV0ZShcIngxXCIsIHgxKTtcbiAgICAgICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJ5MVwiLCB5MSk7XG4gICAgICAgIGxpbmUuc2V0QXR0cmlidXRlKFwieDJcIiwgeDIpO1xuICAgICAgICBsaW5lLnNldEF0dHJpYnV0ZShcInkyXCIsIHkyKTtcbiAgICAgICAgcmV0dXJuIGxpbmU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU1ZHIHRleHRcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB4XG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHlcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdHh0XG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IFtzY2FsZV1cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1NWR0VsZW1lbnR9IGxpbmVcbiAgICAgKi9cbiAgICBzdGF0aWMgU1ZHVGV4dCh4LCB5LCB0eHQpIHtcbiAgICAgICAgY29uc3QgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTVkdVdGlscy5TVkdfTkFNRVNQQUNFLCBcInRleHRcIik7XG4gICAgICAgIHRleHQuc2V0QXR0cmlidXRlKFwieFwiLCB4KTtcbiAgICAgICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJ5XCIsIHkpO1xuICAgICAgICB0ZXh0LnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCBcIm5vbmVcIik7XG4gICAgICAgIHRleHQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodHh0KSk7XG5cbiAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU1ZHIHN5bWJvbFxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAgICAgKiBAcGFyYW0ge051bWJlcn0geFBvc1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB5UG9zXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtTVkdFbGVtZW50fVxuICAgICAqL1xuICAgIHN0YXRpYyBTVkdTeW1ib2wobmFtZSwgeFBvcywgeVBvcykge1xuICAgICAgICBzd2l0Y2ggKG5hbWUpIHtcbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0FTOlxuICAgICAgICAgICAgICAgIHJldHVybiBhc1N5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9EUzpcbiAgICAgICAgICAgICAgICByZXR1cm4gZHNTeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfTUM6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1jU3ltYm9sKHhQb3MsIHlQb3MpXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0lDOlxuICAgICAgICAgICAgICAgIHJldHVybiBpY1N5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9BUklFUzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYXJpZXNTeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfVEFVUlVTOlxuICAgICAgICAgICAgICAgIHJldHVybiB0YXVydXNTeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfR0VNSU5JOlxuICAgICAgICAgICAgICAgIHJldHVybiBnZW1pbmlTeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfQ0FOQ0VSOlxuICAgICAgICAgICAgICAgIHJldHVybiBjYW5jZXJTeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfTEVPOlxuICAgICAgICAgICAgICAgIHJldHVybiBsZW9TeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfVklSR086XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZpcmdvU3ltYm9sKHhQb3MsIHlQb3MpXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0xJQlJBOlxuICAgICAgICAgICAgICAgIHJldHVybiBsaWJyYVN5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9TQ09SUElPOlxuICAgICAgICAgICAgICAgIHJldHVybiBzY29ycGlvU3ltYm9sKHhQb3MsIHlQb3MpXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1NBR0lUVEFSSVVTOlxuICAgICAgICAgICAgICAgIHJldHVybiBzYWdpdHRhcml1c1N5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9DQVBSSUNPUk46XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhcHJpY29yblN5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9BUVVBUklVUzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYXF1YXJpdXNTeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfUElTQ0VTOlxuICAgICAgICAgICAgICAgIHJldHVybiBwaXNjZXNTeW1ib2woeFBvcywgeVBvcylcblxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9TVU46XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN1blN5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9NT09OOlxuICAgICAgICAgICAgICAgIHJldHVybiBtb29uU3ltYm9sKHhQb3MsIHlQb3MpXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX01FUkNVUlk6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1lcmN1cnlTeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfVkVOVVM6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZlbnVzU3ltYm9sKHhQb3MsIHlQb3MpXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0VBUlRIOlxuICAgICAgICAgICAgICAgIHJldHVybiBlYXJ0aFN5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9NQVJTOlxuICAgICAgICAgICAgICAgIHJldHVybiBtYXJzU3ltYm9sKHhQb3MsIHlQb3MpXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0pVUElURVI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGp1cGl0ZXJTeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfU0FUVVJOOlxuICAgICAgICAgICAgICAgIHJldHVybiBzYXR1cm5TeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfVVJBTlVTOlxuICAgICAgICAgICAgICAgIHJldHVybiB1cmFudXNTeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfTkVQVFVORTpcbiAgICAgICAgICAgICAgICByZXR1cm4gbmVwdHVuZVN5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9QTFVUTzpcbiAgICAgICAgICAgICAgICByZXR1cm4gcGx1dG9TeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfQ0hJUk9OOlxuICAgICAgICAgICAgICAgIHJldHVybiBjaGlyb25TeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfTElMSVRIOlxuICAgICAgICAgICAgICAgIHJldHVybiBsaWxpdGhTeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfTk5PREU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ub2RlU3ltYm9sKHhQb3MsIHlQb3MpXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1NOT0RFOlxuICAgICAgICAgICAgICAgIHJldHVybiBzbm9kZVN5bWJvbCh4UG9zLCB5UG9zKVxuXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1JFVFJPR1JBREU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldHJvZ3JhZGVTeW1ib2woeFBvcywgeVBvcylcblxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9DT05KVU5DVElPTjpcbiAgICAgICAgICAgICAgICByZXR1cm4gY29uanVuY3Rpb25TeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfT1BQT1NJVElPTjpcbiAgICAgICAgICAgICAgICByZXR1cm4gb3Bwb3NpdGlvblN5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9TUVVBUkU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNxdWFyZVN5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9UUklORTpcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJpbmVTeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfU0VYVElMRTpcbiAgICAgICAgICAgICAgICByZXR1cm4gc2V4dGlsZVN5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9RVUlOQ1VOWDpcbiAgICAgICAgICAgICAgICByZXR1cm4gcXVpbmN1bnhTeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfU0VNSVNFWFRJTEU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbWlzZXh0aWxlU3ltYm9sKHhQb3MsIHlQb3MpXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX09DVElMRTpcbiAgICAgICAgICAgICAgICByZXR1cm4gcXVpbnRpbGVTeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfVFJJT0NUSUxFOlxuICAgICAgICAgICAgICAgIHJldHVybiB0cmlvY3RpbGVTeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfUVVJTlRJTEU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHF1aW50aWxlU3ltYm9sKHhQb3MsIHlQb3MpXG5cbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgY29uc3QgdW5rbm93blN5bWJvbCA9IFNWR1V0aWxzLlNWR0NpcmNsZSh4UG9zLCB5UG9zLCA4KVxuICAgICAgICAgICAgICAgIHVua25vd25TeW1ib2wuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIFwiIzMzM1wiKVxuICAgICAgICAgICAgICAgIHJldHVybiB1bmtub3duU3ltYm9sXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBBc2NlbmRhbnQgc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBhc1N5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfQVNfQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIERlc2NlbmRhbnQgc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBkc1N5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfRFNfQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIE1lZGl1bSBjb2VsaSBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIG1jU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9NQ19DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogSW1tdW0gY29lbGkgc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBpY1N5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfSUNfQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIEFyaWVzIHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gYXJpZXNTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX0FSSUVTX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBUYXVydXMgc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiB0YXVydXNTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX1RBVVJVU19DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogR2VtaW5pIHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gZ2VtaW5pU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9HRU1JTklfQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIENhbmNlciBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGNhbmNlclN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfQ0FOQ0VSX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBMZW8gc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBsZW9TeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX0xFT19DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogVmlyZ28gc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiB2aXJnb1N5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfVklSR09fQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIExpYnJhIHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gbGlicmFTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX0xJQlJBX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBTY29ycGlvIHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gc2NvcnBpb1N5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfU0NPUlBJT19DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogU2FnaXR0YXJpdXMgc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBzYWdpdHRhcml1c1N5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfU0FHSVRUQVJJVVNfQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIENhcHJpY29ybiBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGNhcHJpY29yblN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfQ0FQUklDT1JOX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBBcXVhcml1cyBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGFxdWFyaXVzU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9BUVVBUklVU19DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogUGlzY2VzIHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gcGlzY2VzU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9QSVNDRVNfQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFN1biBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHN1blN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfU1VOX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBNb29uIHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gbW9vblN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfTU9PTl9DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogTWVyY3VyeSBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIG1lcmN1cnlTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX01FUkNVUllfQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFZlbnVzIHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gdmVudXNTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX1ZFTlVTX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBFYXJ0aCBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGVhcnRoU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9FQVJUSF9DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogTWFycyBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIG1hcnNTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX01BUlNfQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIEp1cGl0ZXIgc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBqdXBpdGVyU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9KVVBJVEVSX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBTYXR1cm4gc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBzYXR1cm5TeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX1NBVFVSTl9DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogVXJhbnVzIHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gdXJhbnVzU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9VUkFOVVNfQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIE5lcHR1bmUgc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBuZXB0dW5lU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9ORVBUVU5FX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBQbHV0byBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHBsdXRvU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9QTFVUT19DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogQ2hpcm9uIHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gY2hpcm9uU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9DSElST05fQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIExpbGl0aCBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGxpbGl0aFN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfTElMSVRIX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBOTm9kZSBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIG5ub2RlU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9OTk9ERV9DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogU05vZGUgc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBzbm9kZVN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfU05PREVfQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFJldHJvZ3JhZGUgc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiByZXRyb2dyYWRlU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9SRVRST0dSQURFX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBDb25qdW5jdGlvbiBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGNvbmp1bmN0aW9uU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9DT05KVU5DVElPTl9DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogT3Bwb3NpdGlvbiBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIG9wcG9zaXRpb25TeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX09QUE9TSVRJT05fQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFNxdWFyZXN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gc3F1YXJlU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9TUVVBUkVfQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFRyaW5lIHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gdHJpbmVTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX1RSSU5FX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBTZXh0aWxlIHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gc2V4dGlsZVN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfU0VYVElMRV9DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogUXVpbmN1bnggc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBxdWluY3VueFN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfUVVJTkNVTlhfQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFNlbWlzZXh0aWxlIHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gc2VtaXNleHRpbGVTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX1NFTUlTRVhUSUxFX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBRdWludGlsZSBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHF1aW50aWxlU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9PQ1RJTEVfQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFRyaW9jdGlsZSBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHRyaW9jdGlsZVN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfVFJJT0NUSUxFX0NPREUpXG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCB7XG4gICAgU1ZHVXRpbHMgYXNcbiAgICAgICAgZGVmYXVsdFxufVxuIiwiLyoqXG4gKiBAY2xhc3NcbiAqIEBjbGFzc2Rlc2MgVXRpbGl0eSBjbGFzc1xuICogQHB1YmxpY1xuICogQHN0YXRpY1xuICogQGhpZGVjb25zdHJ1Y3RvclxuICovXG5jbGFzcyBVdGlscyB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgaWYgKHRoaXMgaW5zdGFuY2VvZiBVdGlscykge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoJ1RoaXMgaXMgYSBzdGF0aWMgY2xhc3MgYW5kIGNhbm5vdCBiZSBpbnN0YW50aWF0ZWQuJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgREVHXzM2MCA9IDM2MFxuICAgIHN0YXRpYyBERUdfMTgwID0gMTgwXG4gICAgc3RhdGljIERFR18wID0gMFxuXG4gICAgLyoqXG4gICAgICogR2VuZXJhdGUgcmFuZG9tIElEXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAqL1xuICAgIHN0YXRpYyBnZW5lcmF0ZVVuaXF1ZUlkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zdCByYW5kb21OdW1iZXIgPSBNYXRoLnJhbmRvbSgpICogMTAwMDAwMDtcbiAgICAgICAgY29uc3QgdGltZXN0YW1wID0gRGF0ZS5ub3coKTtcbiAgICAgICAgY29uc3QgdW5pcXVlSWQgPSBgaWRfJHtyYW5kb21OdW1iZXJ9XyR7dGltZXN0YW1wfWA7XG4gICAgICAgIHJldHVybiB1bmlxdWVJZDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbnZlcnRlZCBkZWdyZWUgdG8gcmFkaWFuXG4gICAgICogQHN0YXRpY1xuICAgICAqXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGFuZ2xlSW5kZWdyZWVcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gc2hpZnRJbkRlZ3JlZVxuICAgICAqIEByZXR1cm4ge051bWJlcn1cbiAgICAgKi9cbiAgICBzdGF0aWMgZGVncmVlVG9SYWRpYW4gPSBmdW5jdGlvbiAoYW5nbGVJbkRlZ3JlZSwgc2hpZnRJbkRlZ3JlZSA9IDApIHtcbiAgICAgICAgcmV0dXJuIChzaGlmdEluRGVncmVlIC0gYW5nbGVJbkRlZ3JlZSkgKiBNYXRoLlBJIC8gMTgwXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29udmVydHMgcmFkaWFuIHRvIGRlZ3JlZVxuICAgICAqIEBzdGF0aWNcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSByYWRpYW5cbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAgICovXG4gICAgc3RhdGljIHJhZGlhblRvRGVncmVlID0gZnVuY3Rpb24gKHJhZGlhbikge1xuICAgICAgICByZXR1cm4gKHJhZGlhbiAqIDE4MCAvIE1hdGguUEkpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2FsY3VsYXRlcyBhIHBvc2l0aW9uIG9mIHRoZSBwb2ludCBvbiB0aGUgY2lyY2xlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGN4IC0gY2VudGVyIHhcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gY3kgLSBjZW50ZXIgeVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSByYWRpdXMgLSBjaXJjbGUgcmFkaXVzXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGFuZ2xlSW5SYWRpYW5zXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IC0ge3g6TnVtYmVyLCB5Ok51bWJlcn1cbiAgICAgKi9cbiAgICBzdGF0aWMgcG9zaXRpb25PbkNpcmNsZShjeCwgY3ksIHJhZGl1cywgYW5nbGVJblJhZGlhbnMpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHg6IChyYWRpdXMgKiBNYXRoLmNvcyhhbmdsZUluUmFkaWFucykgKyBjeCksXG4gICAgICAgICAgICB5OiAocmFkaXVzICogTWF0aC5zaW4oYW5nbGVJblJhZGlhbnMpICsgY3kpXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2FsY3VsYXRlcyB0aGUgYW5nbGUgYmV0d2VlbiB0aGUgbGluZSAoMiBwb2ludHMpIGFuZCB0aGUgeC1heGlzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHgxXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHkxXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHgyXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHkyXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IC0gZGVncmVlXG4gICAgICovXG4gICAgc3RhdGljIHBvc2l0aW9uVG9BbmdsZSh4MSwgeTEsIHgyLCB5Mikge1xuICAgICAgICBjb25zdCBkeCA9IHgyIC0geDE7XG4gICAgICAgIGNvbnN0IGR5ID0geTIgLSB5MTtcbiAgICAgICAgY29uc3QgYW5nbGVJblJhZGlhbnMgPSBNYXRoLmF0YW4yKGR5LCBkeCk7XG4gICAgICAgIHJldHVybiBVdGlscy5yYWRpYW5Ub0RlZ3JlZShhbmdsZUluUmFkaWFucylcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDYWxjdWxhdGVzIG5ldyBwb3NpdGlvbiBvZiBwb2ludHMgb24gY2lyY2xlIHdpdGhvdXQgb3ZlcmxhcHBpbmcgZWFjaCBvdGhlclxuICAgICAqXG4gICAgICogQHRocm93cyB7RXJyb3J9IC0gSWYgdGhlcmUgaXMgbm8gcGxhY2Ugb24gdGhlIGNpcmNsZSB0byBwbGFjZSBwb2ludHMuXG4gICAgICogQHBhcmFtIHtBcnJheX0gcG9pbnRzIC0gW3tuYW1lOlwiYVwiLCBhbmdsZToxMH0sIHtuYW1lOlwiYlwiLCBhbmdsZToyMH1dXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGNvbGxpc2lvblJhZGl1cyAtIHBvaW50IHJhZGl1c1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSByYWRpdXMgLSBjaXJjbGUgcmFkaXVzXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IC0ge1wiTW9vblwiOjMwLCBcIlN1blwiOjYwLCBcIk1lcmN1cnlcIjo4NiwgLi4ufVxuICAgICAqL1xuICAgIHN0YXRpYyBjYWxjdWxhdGVQb3NpdGlvbldpdGhvdXRPdmVybGFwcGluZyhwb2ludHMsIGNvbGxpc2lvblJhZGl1cywgY2lyY2xlUmFkaXVzKSB7XG4gICAgICAgIGNvbnN0IFNURVAgPSAxIC8vZGVncmVlXG5cbiAgICAgICAgY29uc3QgY2VsbFdpZHRoID0gMTAgLy9kZWdyZWVcbiAgICAgICAgY29uc3QgbnVtYmVyT2ZDZWxscyA9IFV0aWxzLkRFR18zNjAgLyBjZWxsV2lkdGhcbiAgICAgICAgY29uc3QgZnJlcXVlbmN5ID0gbmV3IEFycmF5KG51bWJlck9mQ2VsbHMpLmZpbGwoMClcbiAgICAgICAgZm9yIChjb25zdCBwb2ludCBvZiBwb2ludHMpIHtcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gTWF0aC5mbG9vcihwb2ludC5hbmdsZSAvIGNlbGxXaWR0aClcbiAgICAgICAgICAgIGZyZXF1ZW5jeVtpbmRleF0gKz0gMVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gSW4gdGhpcyBhbGdvcml0aG0gdGhlIG9yZGVyIG9mIHBvaW50cyBpcyBjcnVjaWFsLlxuICAgICAgICAvLyBBdCB0aGF0IHBvaW50IGluIHRoZSBjaXJjbGUsIHdoZXJlIHRoZSBwZXJpb2QgY2hhbmdlcyBpbiB0aGUgY2lyY2xlIChmb3IgaW5zdGFuY2U6WzM1OCwzNTksMCwxXSksIHRoZSBwb2ludHMgYXJlIGFycmFuZ2VkIGluIGluY29ycmVjdCBvcmRlci5cbiAgICAgICAgLy8gQXMgYSBzdGFydGluZyBwb2ludCwgSSB0cnkgdG8gZmluZCBhIHBsYWNlIHdoZXJlIHRoZXJlIGFyZSBubyBwb2ludHMuIFRoaXMgcGxhY2UgSSB1c2UgYXMgU1RBUlRfQU5HTEUuXG4gICAgICAgIGNvbnN0IFNUQVJUX0FOR0xFID0gY2VsbFdpZHRoICogZnJlcXVlbmN5LmZpbmRJbmRleChjb3VudCA9PiBjb3VudCA9PSAwKVxuXG4gICAgICAgIGNvbnN0IF9wb2ludHMgPSBwb2ludHMubWFwKHBvaW50ID0+IHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgbmFtZTogcG9pbnQubmFtZSxcbiAgICAgICAgICAgICAgICBhbmdsZTogcG9pbnQuYW5nbGUgPCBTVEFSVF9BTkdMRSA/IHBvaW50LmFuZ2xlICsgVXRpbHMuREVHXzM2MCA6IHBvaW50LmFuZ2xlXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgX3BvaW50cy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gYS5hbmdsZSAtIGIuYW5nbGVcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBSZWN1cnNpdmUgZnVuY3Rpb25cbiAgICAgICAgY29uc3QgYXJyYW5nZVBvaW50cyA9ICgpID0+IHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsbiA9IF9wb2ludHMubGVuZ3RoOyBpIDwgbG47IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBvaW50UG9zaXRpb24gPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKDAsIDAsIGNpcmNsZVJhZGl1cywgVXRpbHMuZGVncmVlVG9SYWRpYW4oX3BvaW50c1tpXS5hbmdsZSkpXG4gICAgICAgICAgICAgICAgX3BvaW50c1tpXS54ID0gcG9pbnRQb3NpdGlvbi54XG4gICAgICAgICAgICAgICAgX3BvaW50c1tpXS55ID0gcG9pbnRQb3NpdGlvbi55XG5cbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGk7IGorKykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBkaXN0YW5jZSA9IE1hdGguc3FydChNYXRoLnBvdyhfcG9pbnRzW2ldLnggLSBfcG9pbnRzW2pdLngsIDIpICsgTWF0aC5wb3coX3BvaW50c1tpXS55IC0gX3BvaW50c1tqXS55LCAyKSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkaXN0YW5jZSA8ICgyICogY29sbGlzaW9uUmFkaXVzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgX3BvaW50c1tpXS5hbmdsZSArPSBTVEVQXG4gICAgICAgICAgICAgICAgICAgICAgICBfcG9pbnRzW2pdLmFuZ2xlIC09IFNURVBcbiAgICAgICAgICAgICAgICAgICAgICAgIGFycmFuZ2VQb2ludHMoKSAvLz09PT09PT4gUmVjdXJzaXZlIGNhbGxcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGFycmFuZ2VQb2ludHMoKVxuXG4gICAgICAgIHJldHVybiBfcG9pbnRzLnJlZHVjZSgoYWNjdW11bGF0b3IsIHBvaW50LCBjdXJyZW50SW5kZXgpID0+IHtcbiAgICAgICAgICAgIGFjY3VtdWxhdG9yW3BvaW50Lm5hbWVdID0gcG9pbnQuYW5nbGVcbiAgICAgICAgICAgIHJldHVybiBhY2N1bXVsYXRvclxuICAgICAgICB9LCB7fSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiB0aGUgYW5nbGUgY29sbGlkZXMgd2l0aCB0aGUgcG9pbnRzXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gYW5nbGVcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBhbmdsZXNMaXN0XG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IFtjb2xsaXNpb25SYWRpdXNdXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqL1xuICAgIHN0YXRpYyBpc0NvbGxpc2lvbihhbmdsZSwgYW5nbGVzTGlzdCwgY29sbGlzaW9uUmFkaXVzID0gMTApIHtcblxuICAgICAgICBjb25zdCBwb2ludEluQ29sbGlzaW9uID0gYW5nbGVzTGlzdC5maW5kKHBvaW50ID0+IHtcblxuICAgICAgICAgICAgbGV0IGEgPSAocG9pbnQgLSBhbmdsZSkgPiBVdGlscy5ERUdfMTgwID8gYW5nbGUgKyBVdGlscy5ERUdfMzYwIDogYW5nbGVcbiAgICAgICAgICAgIGxldCBwID0gKGFuZ2xlIC0gcG9pbnQpID4gVXRpbHMuREVHXzE4MCA/IHBvaW50ICsgVXRpbHMuREVHXzM2MCA6IHBvaW50XG5cbiAgICAgICAgICAgIHJldHVybiBNYXRoLmFicyhhIC0gcCkgPD0gY29sbGlzaW9uUmFkaXVzXG4gICAgICAgIH0pXG5cbiAgICAgICAgcmV0dXJuIHBvaW50SW5Db2xsaXNpb24gPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogdHJ1ZVxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyB0aGUgY29udGVudCBvZiBhbiBlbGVtZW50XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZWxlbWVudElEXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2JlZm9yZUhvb2tdXG4gICAgICpcbiAgICAgKiBAd2FybmluZyAtIEl0IHJlbW92ZXMgRXZlbnQgTGlzdGVuZXJzIHRvby5cbiAgICAgKiBAd2FybmluZyAtIFlvdSB3aWxsIChwcm9iYWJseSkgZ2V0IG1lbW9yeSBsZWFrIGlmIHlvdSBkZWxldGUgZWxlbWVudHMgdGhhdCBoYXZlIGF0dGFjaGVkIGxpc3RlbmVyc1xuICAgICAqL1xuICAgIHN0YXRpYyBjbGVhblVwKGVsZW1lbnRJRCwgYmVmb3JlSG9vaykge1xuICAgICAgICBsZXQgZWxtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudElEKVxuICAgICAgICBpZiAoISBlbG0pIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgKHR5cGVvZiBiZWZvcmVIb29rID09PSAnZnVuY3Rpb24nKSAmJiBiZWZvcmVIb29rKClcblxuICAgICAgICBlbG0uaW5uZXJIVE1MID0gXCJcIlxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogU2ltcGxlIGNvZGUgZm9yIGNvbmZpZyBiYXNlZCB0ZW1wbGF0ZSBzdHJpbmdzXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdGVtcGxhdGVTdHJpbmdcbiAgICAgKiBAcGFyYW0gdGVtcGxhdGVWYXJzXG4gICAgICogQHJldHVybnMgeyp9XG4gICAgICovXG4gICAgc3RhdGljIGZpbGxUZW1wbGF0ZSA9IGZ1bmN0aW9uICh0ZW1wbGF0ZVN0cmluZywgdGVtcGxhdGVWYXJzKSB7XG4gICAgICAgIGxldCBmdW5jID0gbmV3IEZ1bmN0aW9uKC4uLk9iamVjdC5rZXlzKHRlbXBsYXRlVmFycyksIFwicmV0dXJuIGBcIiArIHRlbXBsYXRlU3RyaW5nICsgXCJgO1wiKVxuICAgICAgICByZXR1cm4gZnVuYyguLi5PYmplY3QudmFsdWVzKHRlbXBsYXRlVmFycykpO1xuICAgIH1cbn1cblxuXG5leHBvcnQge1xuICAgIFV0aWxzIGFzXG4gICAgICAgIGRlZmF1bHRcbn1cblxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgVW5pdmVyc2UgZnJvbSAnLi91bml2ZXJzZS9Vbml2ZXJzZS5qcydcbmltcG9ydCBTVkdVdGlscyBmcm9tICcuL3V0aWxzL1NWR1V0aWxzLmpzJ1xuaW1wb3J0IFV0aWxzIGZyb20gJy4vdXRpbHMvVXRpbHMuanMnXG5pbXBvcnQgUmFkaXhDaGFydCBmcm9tICcuL2NoYXJ0cy9SYWRpeENoYXJ0LmpzJ1xuaW1wb3J0IFRyYW5zaXRDaGFydCBmcm9tICcuL2NoYXJ0cy9UcmFuc2l0Q2hhcnQuanMnXG5cbmV4cG9ydCB7VW5pdmVyc2UsIFNWR1V0aWxzLCBVdGlscywgUmFkaXhDaGFydCwgVHJhbnNpdENoYXJ0fVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9