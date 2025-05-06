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


// noinspection JSUnusedGlobalSymbols
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
        return 12 * (this.getRadius() / this.#numberOfLevels) * (this.#settings.CHART_CENTER_SIZE ?? 1)
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

        return _utils_AspectUtils_js__WEBPACK_IMPORTED_MODULE_3__["default"].getAspects(fromPoints, toPoints, aspects).filter(aspect => aspect.from.name !== aspect.to.name)
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
                    return elm.from.name === aspect.to.name && elm.to.name === aspect.from.name
                })

                if (! isTheSame) {
                    arr.push(aspect)
                }

                return arr
            }, [])
            .filter(aspect => aspect.aspect.name !== 'Conjunction')

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
        this.#drawCusps(data)
        this.#drawPoints(data)
        this.#drawRuler()
        this.#drawBorders()
        this.#settings.CHART_DRAW_MAIN_AXIS && this.#drawMainAxisDescription(data)
        this.#settings.DRAW_ASPECTS && this.drawAspects()
    }

    #drawBackground() {
        const MASK_ID = `${this.#settings.HTML_ELEMENT_ID}-${this.#settings.RADIX_ID}-background-mask-1`

        const wrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGGroup()
        wrapper.classList.add('c-radix-background')

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

        this.#root.parentElement.querySelector('.c-backgrounds').appendChild(wrapper)
    }

    #drawAstrologicalSigns() {
        const NUMBER_OF_ASTROLOGICAL_SIGNS = 12
        const STEP = 30 //degree
        const COLORS_SIGNS = [this.#settings.COLOR_ARIES, this.#settings.COLOR_TAURUS, this.#settings.COLOR_GEMINI, this.#settings.COLOR_CANCER, this.#settings.COLOR_LEO, this.#settings.COLOR_VIRGO, this.#settings.COLOR_LIBRA, this.#settings.COLOR_SCORPIO, this.#settings.COLOR_SAGITTARIUS, this.#settings.COLOR_CAPRICORN, this.#settings.COLOR_AQUARIUS, this.#settings.COLOR_PISCES]
        const SYMBOL_SIGNS = [_utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_ARIES, _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_TAURUS, _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_GEMINI, _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_CANCER, _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_LEO, _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_VIRGO, _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_LIBRA, _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_SCORPIO, _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_SAGITTARIUS, _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_CAPRICORN, _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_AQUARIUS, _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_PISCES]

        if (COLORS_SIGNS.length !== 12) {
            console.error('Missing entries in COLOR_SIGNS, requires 12 entries');
        }

        const makeSymbol = (symbolIndex, angleInDegree) => {
            let position = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].positionOnCircle(this.#centerX, this.#centerY, this.getOuterCircleRadius() - ((this.getOuterCircleRadius() - this.getInnerCircleRadius()) / 2), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(angleInDegree + STEP / 2, this.getAscendantShift()))

            let symbol = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGSymbol(SYMBOL_SIGNS[symbolIndex], position.x, position.y)
            symbol.setAttribute("font-family", this.#settings.CHART_FONT_FAMILY);
            symbol.setAttribute("text-anchor", "middle") // start, middle, end
            symbol.setAttribute("dominant-baseline", "middle")
            symbol.setAttribute("font-size", this.#settings.RADIX_SIGNS_FONT_SIZE);
            if (this.#settings.SIGN_COLOR_CIRCLE !== null) {
                symbol.setAttribute("fill", this.#settings.SIGN_COLOR_CIRCLE);
            } else {
                symbol.setAttribute("fill", this.#settings.SIGN_COLORS[symbolIndex] ?? this.#settings.CHART_SIGNS_COLOR);
            }


            if (this.#settings.CLASS_SIGN) {
                symbol.setAttribute('class', this.#settings.CLASS_SIGN + ' ' + this.#settings.CLASS_SIGN + '--' + SYMBOL_SIGNS[symbolIndex].toLowerCase());
            }

            if (this.#settings.SYMBOL_STROKE) {
                symbol.setAttribute('paint-order', 'stroke');
                symbol.setAttribute('stroke', this.#settings.SYMBOL_STROKE_COLOR);
                symbol.setAttribute('stroke-width', this.#settings.SYMBOL_STROKE_WIDTH);
            }

            if (this.#settings.INSERT_ELEMENT_TITLE) {
                symbol.appendChild(_utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGTitle(this.#settings.ELEMENT_TITLES.signs[SYMBOL_SIGNS[symbolIndex].toLowerCase()]))
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
        wrapper.classList.add('c-radix-astrological-signs')

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
        wrapper.classList.add('c-radix-ruler')

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
        wrapper.classList.add('c-radix-points')

        const positions = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].calculatePositionWithoutOverlapping(points, this.#settings.POINT_COLLISION_RADIUS, this.getPointCircleRadius())

        for (const pointData of points) {
            const pointGroup = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGGroup();
            pointGroup.classList.add('c-radix-point')
            pointGroup.classList.add('c-radix-point--' + pointData.name.toLowerCase())

            const point = new _points_Point_js__WEBPACK_IMPORTED_MODULE_5__["default"](pointData, cusps, this.#settings)
            const pointPosition = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].positionOnCircle(this.#centerX, this.#centerX, this.getRullerCircleRadius() - ((this.getInnerCircleRadius() - this.getRullerCircleRadius()) / 4), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(point.getAngle(), this.getAscendantShift()))
            const symbolPosition = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].positionOnCircle(this.#centerX, this.#centerX, this.getPointCircleRadius(), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(positions[point.getName()], this.getAscendantShift()))

            // ruler mark
            const rulerLineEndPosition = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].positionOnCircle(this.#centerX, this.#centerX, this.getRullerCircleRadius(), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(point.getAngle(), this.getAscendantShift()))

            if (this.#settings.DRAW_RULER_MARK) {
                const rulerLine = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGLine(pointPosition.x, pointPosition.y, rulerLineEndPosition.x, rulerLineEndPosition.y)
                rulerLine.setAttribute("stroke", this.#settings.CHART_LINE_COLOR);
                rulerLine.setAttribute("stroke-width", this.#settings.CHART_STROKE);
                pointGroup.appendChild(rulerLine);
            }

            /**
             * Line from the ruler to the celestial body
             * @type {{x, y}}
             */
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

            pointGroup.appendChild(pointerLine);

            /**
             * Symnol of the celestial body + points
             * @type {SVGElement}
             */
            const symbol = point.getSymbol(symbolPosition.x, symbolPosition.y, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].DEG_0, this.#settings.POINT_PROPERTIES_SHOW)
            symbol.setAttribute("font-family", this.#settings.CHART_FONT_FAMILY);
            symbol.setAttribute("text-anchor", "middle") // start, middle, end
            symbol.setAttribute("dominant-baseline", "middle")
            symbol.setAttribute("font-size", this.#settings.RADIX_POINTS_FONT_SIZE)
            symbol.setAttribute("fill", this.#settings.PLANET_COLORS[pointData.name] ?? this.#settings.CHART_POINTS_COLOR)
            pointGroup.appendChild(symbol);

            wrapper.appendChild(pointGroup);
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
        wrapper.classList.add('c-radix-cusps')

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
            text.classList.add('c-radix-cusps__house-number')

            if (this.#settings.INSERT_ELEMENT_TITLE) {
                text.appendChild(_utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGTitle(this.#settings.ELEMENT_TITLES.cusps[i + 1]))
            }

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
        wrapper.classList.add('c-radix-axis')

        const rad1 = this.#numberOfLevels === 24 ? this.getRadius() : this.getInnerCircleRadius();
        const rad2 = this.#numberOfLevels === 24 ? this.getRadius() + AXIS_LENGTH : this.getInnerCircleRadius() + AXIS_LENGTH / 2;

        for (const axis of axisList) {
            const axisGroup = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGGroup()
            axisGroup.classList.add('c-radix-axis__axis')
            axisGroup.classList.add('c-radix-axis__axis--' + axis.name.toLowerCase())

            let startPoint = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].positionOnCircle(this.#centerX, this.#centerY, rad1, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(axis.angle, this.getAscendantShift()))
            let endPoint = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].positionOnCircle(this.#centerX, this.#centerY, rad2, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(axis.angle, this.getAscendantShift()))
            let line = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGLine(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
            line.setAttribute("stroke", this.#settings.CHART_MAIN_AXIS_COLOR);
            line.setAttribute("stroke-width", this.#settings.CHART_MAIN_STROKE);
            axisGroup.appendChild(line);

            let textPoint = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].positionOnCircle(this.#centerX, this.#centerY, rad2, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(axis.angle, this.getAscendantShift()))
            let symbol;
            let SHIFT_X = 0;
            let SHIFT_Y = 0;
            const STEP = 2

            switch (axis.name) {
                case "As":
                    SHIFT_X -= STEP
                    SHIFT_Y -= STEP
                    _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_AS_CODE = this.#settings.SYMBOL_AS_CODE ?? _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_AS_CODE;
                    symbol = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGSymbol(axis.name, textPoint.x + SHIFT_X, textPoint.y + SHIFT_Y)
                    symbol.setAttribute("text-anchor", "end")
                    symbol.setAttribute("dominant-baseline", "middle")
                    break;
                case "Ds":
                    SHIFT_X += STEP
                    SHIFT_Y -= STEP
                    _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_DS_CODE = this.#settings.SYMBOL_DS_CODE ?? _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_DS_CODE;
                    symbol = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGSymbol(axis.name, textPoint.x + SHIFT_X, textPoint.y + SHIFT_Y)
                    symbol.setAttribute("text-anchor", "start")
                    symbol.setAttribute("dominant-baseline", "middle")
                    break;
                case "Mc":
                    SHIFT_Y -= STEP
                    _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_MC_CODE = this.#settings.SYMBOL_MC_CODE ?? _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_MC_CODE;
                    symbol = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGSymbol(axis.name, textPoint.x + SHIFT_X, textPoint.y + SHIFT_Y)
                    symbol.setAttribute("text-anchor", "middle")
                    symbol.setAttribute("dominant-baseline", "text-top")
                    break;
                case "Ic":
                    SHIFT_Y += STEP
                    _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_IC_CODE = this.#settings.SYMBOL_IC_CODE ?? _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_IC_CODE;
                    symbol = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGSymbol(axis.name, textPoint.x + SHIFT_X, textPoint.y + SHIFT_Y)
                    symbol.setAttribute("text-anchor", "middle")
                    symbol.setAttribute("dominant-baseline", "hanging")
                    break;
                default:
                    console.error(axis.name)
                    throw new Error("Unknown axis name.")
            }
            symbol.setAttribute("font-family", this.#settings.AXIS_FONT_FAMILY ?? this.#settings.CHART_FONT_FAMILY);
            symbol.setAttribute("font-size", this.#settings.RADIX_AXIS_FONT_SIZE);
            symbol.setAttribute("font-weight", this.#settings.AXIS_FONT_WEIGHT ?? 400);
            symbol.setAttribute("fill", this.#settings.CHART_MAIN_AXIS_COLOR);
            symbol.setAttribute('paint-order', 'stroke');

            if (this.#settings.CLASS_AXIS) {
                symbol.setAttribute('class', this.#settings.CLASS_AXIS + ' ' + this.#settings.CLASS_AXIS + '--' + axis.name.toLowerCase());
            }

            if (this.#settings.INSERT_ELEMENT_TITLE) {
                symbol.appendChild(_utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGTitle(this.#settings.ELEMENT_TITLES.axis[axis.name]))
            }

            axisGroup.appendChild(symbol);
            wrapper.appendChild(axisGroup)
        }

        this.#root.appendChild(wrapper)
    }

    #drawBorders() {
        const wrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGGroup()
        wrapper.classList.add('c-radix-borders')

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

    animateTo(data) {
        return undefined;
    }

    getPoint(name) {
        return undefined;
    }

    getPoints() {
        return undefined;
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
      .filter( aspect =>  aspect.aspect.name !== 'Conjunction')

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

  animateTo(data) {
    return undefined;
  }

  getPoint(name) {
    return undefined;
  }

  getPoints() {
    return undefined;
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



// noinspection JSPotentiallyInvalidUsageOfClassThis,JSUnusedGlobalSymbols
/**
 * @class
 * @classdesc Represents a planet or point of interest in the chart
 * @public
 */
class Point {

    #name
    #angle
    #sign
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
        this.#sign = pointData.sign ?? null
        this.#isRetrograde = pointData.isRetrograde ?? false

        if (! Array.isArray(cusps) || cusps.length !== 12) {
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
     * Get sign
     *
     * @return {String}
     */
    getSign() {
        return this.#sign
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

        if (this.#settings.POINT_STROKE ?? false) {
            symbol.setAttribute('paint-order', 'stroke');
            symbol.setAttribute('stroke', this.#settings.POINT_STROKE_COLOR);
            symbol.setAttribute('stroke-width', this.#settings.POINT_STROKE_WIDTH);
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

        if (this.#settings.POINT_PROPERTIES_SHOW_SIGN && this.#sign !== null) {
            showSign.call(this)
        }

        if (this.#settings.POINT_PROPERTIES_SHOW_RETROGRADE && this.#isRetrograde) {
            retrograde.call(this)
        }

        if (this.#settings.POINT_PROPERTIES_SHOW_DIGNITY && this.getDignity()) {
            dignities.call(this)
        }

        if (this.#settings.INSERT_ELEMENT_TITLE) {
            symbol.appendChild(_utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGTitle(this.#settings.ELEMENT_TITLES.points[this.#name.toLowerCase()]))
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
            let angle = this.getAngleInSign();
            let anglePosition = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].fillTemplate(this.#settings.ANGLE_TEMPLATE, {angle: angle});

            const angleInSignText = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGText(angleInSignPosition.x, angleInSignPosition.y, anglePosition)
            angleInSignText.setAttribute("font-family", this.#settings.CHART_FONT_FAMILY);
            angleInSignText.setAttribute("text-anchor", "middle") // start, middle, end
            angleInSignText.setAttribute("dominant-baseline", "middle")
            angleInSignText.setAttribute("font-size", this.#settings.POINT_PROPERTIES_ANGLE_SIZE || this.#settings.POINT_PROPERTIES_FONT_SIZE);
            angleInSignText.setAttribute("fill", this.#settings.POINT_PROPERTIES_ANGLE_COLOR || this.#settings.POINT_PROPERTIES_COLOR);

            if (this.#settings.CLASS_POINT_ANGLE) {
                angleInSignText.setAttribute('class', this.#settings.CLASS_POINT_ANGLE + ' ' + this.#settings.CLASS_POINT_ANGLE + '--' + angle);
            }

            if (this.#settings.POINT_STROKE ?? false) {
                angleInSignText.setAttribute('paint-order', 'stroke');
                angleInSignText.setAttribute('stroke', this.#settings.POINT_STROKE_COLOR);
                angleInSignText.setAttribute('stroke-width', this.#settings.POINT_STROKE_WIDTH);
            }

            wrapper.appendChild(angleInSignText)
        }

        /*
        *  Show sign
        */
        function showSign() {
            const signPosition = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].positionOnCircle(xPos, yPos, this.#settings.POINT_PROPERTIES_SIGN_OFFSET * this.#settings.POINT_COLLISION_RADIUS, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].degreeToRadian(-angleFromSymbolToCenter, angleShift))

            /**
             * Get the sign index
             */
            let symbolIndex = this.#settings.SIGN_LABELS.indexOf(this.#sign)

            const signText = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGSymbol(this.#sign, signPosition.x, signPosition.y)
            signText.setAttribute("font-family", this.#settings.CHART_FONT_FAMILY);
            signText.setAttribute("text-anchor", "middle") // start, middle, end
            signText.setAttribute("dominant-baseline", "middle")
            signText.setAttribute("font-size", this.#settings.POINT_PROPERTIES_SIGN_SIZE || this.#settings.POINT_PROPERTIES_FONT_SIZE);

            /**
             * Override sign colors
             */
            if (this.#settings.POINT_PROPERTIES_SIGN_COLOR !== null) {
                signText.setAttribute("fill", this.#settings.POINT_PROPERTIES_SIGN_COLOR);
            } else {
                signText.setAttribute("fill", this.#settings.SIGN_COLORS[symbolIndex] || this.#settings.POINT_PROPERTIES_COLOR);
            }


            if (this.#settings.CLASS_POINT_SIGN) {
                signText.setAttribute('class', this.#settings.CLASS_POINT_SIGN + ' ' + this.#settings.CLASS_POINT_SIGN + '--' + this.#sign.toLowerCase());
            }
            if (this.#settings.POINT_STROKE ?? false) {
                signText.setAttribute('paint-order', 'stroke');
                signText.setAttribute('stroke', this.#settings.POINT_STROKE_COLOR);
                signText.setAttribute('stroke-width', this.#settings.POINT_STROKE_WIDTH);
            }

            wrapper.appendChild(signText)
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

            if (this.#settings.CLASS_POINT_RETROGRADE) {
                retrogradeText.setAttribute('class', this.#settings.CLASS_POINT_RETROGRADE);
            }

            if (this.#settings.POINT_STROKE ?? false) {
                retrogradeText.setAttribute('paint-order', 'stroke');
                retrogradeText.setAttribute('stroke', this.#settings.POINT_STROKE_COLOR);
                retrogradeText.setAttribute('stroke-width', this.#settings.POINT_STROKE_WIDTH);
            }

            if (this.#settings.INSERT_ELEMENT_TITLE) {
                retrogradeText.appendChild(_utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGTitle(this.#settings.ELEMENT_TITLES.retrograde))
            }

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

            if (this.#settings.CLASS_POINT_DIGNITY) {
                dignitiesText.setAttribute('class', this.#settings.CLASS_POINT_DIGNITY + ' ' + this.#settings.CLASS_POINT_DIGNITY + '--' + dignitiesText.textContent); // Straightforward r/d/e/f
            }

            if (this.#settings.POINT_STROKE ?? false) {
                dignitiesText.setAttribute('paint-order', 'stroke');
                dignitiesText.setAttribute('stroke', this.#settings.POINT_STROKE_COLOR);
                dignitiesText.setAttribute('stroke-width', this.#settings.POINT_STROKE_WIDTH);
            }

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
     * Use Modern dignities https://en.wikipedia.org/wiki/Essential_dignity
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
                if (this.getSignNumber() === LEO) {
                    return RULERSHIP_SYMBOL //======>
                }

                if (this.getSignNumber() === AQUARIUS) {
                    return DETRIMENT_SYMBOL //======>
                }

                if (this.getSignNumber() === VIRGO) {
                    return FALL_SYMBOL //======>
                }

                if (this.getSignNumber() === ARIES) {
                    return EXALTATION_SYMBOL //======>
                }

                return ""

            case _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SYMBOL_MOON:
                if (this.getSignNumber() === CANCER) {
                    return RULERSHIP_SYMBOL //======>
                }

                if (this.getSignNumber() === CAPRICORN) {
                    return DETRIMENT_SYMBOL //======>
                }

                if (this.getSignNumber() === SCORPIO) {
                    return FALL_SYMBOL //======>
                }

                if (this.getSignNumber() === TAURUS) {
                    return EXALTATION_SYMBOL //======>
                }
                return ""

            case _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SYMBOL_MERCURY:
                if (this.getSignNumber() === GEMINI) {
                    return RULERSHIP_SYMBOL //======>
                }

                if (this.getSignNumber() === SAGITTARIUS) {
                    return DETRIMENT_SYMBOL //======>
                }

                if (this.getSignNumber() === PISCES) {
                    return FALL_SYMBOL //======>
                }

                if (this.getSignNumber() === VIRGO) {
                    return EXALTATION_SYMBOL //======>
                }
                return ""

            case _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SYMBOL_VENUS:
                if (this.getSignNumber() === TAURUS || this.getSignNumber() === LIBRA) {
                    return RULERSHIP_SYMBOL //======>
                }

                if (this.getSignNumber() === ARIES || this.getSignNumber() === SCORPIO) {
                    return DETRIMENT_SYMBOL //======>
                }

                if (this.getSignNumber() === VIRGO) {
                    return FALL_SYMBOL //======>
                }

                if (this.getSignNumber() === PISCES) {
                    return EXALTATION_SYMBOL //======>
                }
                return ""

            case _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SYMBOL_MARS:
                if (this.getSignNumber() === ARIES || this.getSignNumber() === SCORPIO) {
                    return RULERSHIP_SYMBOL //======>
                }

                if (this.getSignNumber() === TAURUS || this.getSignNumber() === LIBRA) {
                    return DETRIMENT_SYMBOL //======>
                }

                if (this.getSignNumber() === CANCER) {
                    return FALL_SYMBOL //======>
                }

                if (this.getSignNumber() === CAPRICORN) {
                    return EXALTATION_SYMBOL //======>
                }
                return ""

            case _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SYMBOL_JUPITER:
                if (this.getSignNumber() === SAGITTARIUS || this.getSignNumber() === PISCES) {
                    return RULERSHIP_SYMBOL //======>
                }

                if (this.getSignNumber() === GEMINI || this.getSignNumber() === VIRGO) {
                    return DETRIMENT_SYMBOL //======>
                }

                if (this.getSignNumber() === CAPRICORN) {
                    return FALL_SYMBOL //======>
                }

                if (this.getSignNumber() === CANCER) {
                    return EXALTATION_SYMBOL //======>
                }
                return ""

            case _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SYMBOL_SATURN:
                if (this.getSignNumber() === CAPRICORN || this.getSignNumber() === AQUARIUS) {
                    return RULERSHIP_SYMBOL //======>
                }

                if (this.getSignNumber() === CANCER || this.getSignNumber() === LEO) {
                    return DETRIMENT_SYMBOL //======>
                }

                if (this.getSignNumber() === ARIES) {
                    return FALL_SYMBOL //======>
                }

                if (this.getSignNumber() === LIBRA) {
                    return EXALTATION_SYMBOL //======>
                }
                return ""

            case _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SYMBOL_URANUS:
                if (this.getSignNumber() === AQUARIUS) {
                    return RULERSHIP_SYMBOL //======>
                }

                if (this.getSignNumber() === LEO) {
                    return DETRIMENT_SYMBOL //======>
                }

                if (this.getSignNumber() === TAURUS) {
                    return FALL_SYMBOL //======>
                }

                if (this.getSignNumber() === SCORPIO) {
                    return EXALTATION_SYMBOL //======>
                }
                return ""

            case _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SYMBOL_NEPTUNE:
                if (this.getSignNumber() === PISCES) {
                    return RULERSHIP_SYMBOL //======>
                }

                if (this.getSignNumber() === VIRGO) {
                    return DETRIMENT_SYMBOL //======>
                }

                if (this.getSignNumber() === GEMINI || this.getSignNumber() === AQUARIUS) {
                    return FALL_SYMBOL //======>
                }

                if (this.getSignNumber() === SAGITTARIUS || this.getSignNumber() === LEO) {
                    return EXALTATION_SYMBOL //======>
                }
                return ""

            case _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SYMBOL_PLUTO:
                if (this.getSignNumber() === SCORPIO) {
                    return RULERSHIP_SYMBOL //======>
                }

                if (this.getSignNumber() === TAURUS) {
                    return DETRIMENT_SYMBOL //======>
                }

                if (this.getSignNumber() === LIBRA) {
                    return FALL_SYMBOL //======>
                }

                if (this.getSignNumber() === ARIES) {
                    return EXALTATION_SYMBOL //======>
                }
                return ""

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
// noinspection JSUnusedGlobalSymbols

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
/* harmony export */   SIGN_LABELS: () => (/* binding */ SIGN_LABELS),
/* harmony export */   TRANSIT_PLANET_COLORS: () => (/* binding */ TRANSIT_PLANET_COLORS)
/* harmony export */ });
// noinspection JSUnusedGlobalSymbols

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
const COLOR_GEMINI = "#87CEEB";

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
    Conjunction: "#333",
    Opposition: "#1B4F72",
    Square: "#641E16",
    Trine: "#0B5345",
    Sextile: "#333",
    Quincunx: "#333",
    Semisextile: "#333",
    Quintile: "#333",
    Trioctile: "#333"
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
 * All signs labels in the right order
 * @type {string[]}
 */
const SIGN_LABELS = [
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces",
]

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
/* harmony export */   CLASS_CELESTIAL: () => (/* binding */ CLASS_CELESTIAL),
/* harmony export */   CLASS_POINT_ANGLE: () => (/* binding */ CLASS_POINT_ANGLE),
/* harmony export */   CLASS_POINT_DIGNITY: () => (/* binding */ CLASS_POINT_DIGNITY),
/* harmony export */   CLASS_POINT_RETROGRADE: () => (/* binding */ CLASS_POINT_RETROGRADE),
/* harmony export */   CLASS_POINT_SIGN: () => (/* binding */ CLASS_POINT_SIGN),
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
/* harmony export */   POINT_PROPERTIES_SHOW_RETROGRADE: () => (/* binding */ POINT_PROPERTIES_SHOW_RETROGRADE),
/* harmony export */   POINT_PROPERTIES_SHOW_SIGN: () => (/* binding */ POINT_PROPERTIES_SHOW_SIGN),
/* harmony export */   POINT_PROPERTIES_SIGN_COLOR: () => (/* binding */ POINT_PROPERTIES_SIGN_COLOR),
/* harmony export */   POINT_PROPERTIES_SIGN_OFFSET: () => (/* binding */ POINT_PROPERTIES_SIGN_OFFSET),
/* harmony export */   POINT_STROKE: () => (/* binding */ POINT_STROKE),
/* harmony export */   POINT_STROKE_COLOR: () => (/* binding */ POINT_STROKE_COLOR),
/* harmony export */   POINT_STROKE_WIDTH: () => (/* binding */ POINT_STROKE_WIDTH)
/* harmony export */ });
// noinspection JSUnusedGlobalSymbols

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

/**
 * Point sign
 * @type {boolean}
 */
const POINT_PROPERTIES_SHOW_SIGN = false

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

/**
 * Offset from the planet
 * @type {number}
 */
const POINT_PROPERTIES_SIGN_OFFSET = 3.5

/*
* Retrograde symbol offset multiplier
* @constant
* @type {Number}
* @default 6
*/
const POINT_PROPERTIES_RETROGRADE_OFFSET = 5

/*
* Dignity symbol offset multiplier
* @constant
* @type {Number}
* @default 6
*/
const POINT_PROPERTIES_DIGNITY_OFFSET = 6

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


/**
 * Classes for points
 * ====================================
 */
/**
 * Class for Celestial Bodies (Planet / Asteriod)
 * and Celestial Points (northnode, southnode, lilith)
 * @type {string}
 */
const CLASS_CELESTIAL = '';
const CLASS_POINT_ANGLE = '';
const CLASS_POINT_SIGN = '';
const CLASS_POINT_RETROGRADE = '';
const CLASS_POINT_DIGNITY = '';

/**
 * Add a stroke around all points
 */
const POINT_STROKE = false;
const POINT_STROKE_COLOR = '#fff';
const POINT_STROKE_WIDTH = 2;

const POINT_PROPERTIES_SIGN_COLOR = null;

/***/ }),

/***/ "./src/settings/constants/Radix.js":
/*!*****************************************!*\
  !*** ./src/settings/constants/Radix.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ELEMENT_TITLES: () => (/* binding */ ELEMENT_TITLES),
/* harmony export */   INSERT_ELEMENT_TITLE: () => (/* binding */ INSERT_ELEMENT_TITLE),
/* harmony export */   RADIX_AXIS_FONT_SIZE: () => (/* binding */ RADIX_AXIS_FONT_SIZE),
/* harmony export */   RADIX_HOUSE_FONT_SIZE: () => (/* binding */ RADIX_HOUSE_FONT_SIZE),
/* harmony export */   RADIX_ID: () => (/* binding */ RADIX_ID),
/* harmony export */   RADIX_POINTS_FONT_SIZE: () => (/* binding */ RADIX_POINTS_FONT_SIZE),
/* harmony export */   RADIX_SIGNS_FONT_SIZE: () => (/* binding */ RADIX_SIGNS_FONT_SIZE),
/* harmony export */   SIGN_COLOR_CIRCLE: () => (/* binding */ SIGN_COLOR_CIRCLE),
/* harmony export */   SYMBOL_STROKE: () => (/* binding */ SYMBOL_STROKE),
/* harmony export */   SYMBOL_STROKE_COLOR: () => (/* binding */ SYMBOL_STROKE_COLOR),
/* harmony export */   SYMBOL_STROKE_WIDTH: () => (/* binding */ SYMBOL_STROKE_WIDTH)
/* harmony export */ });
// noinspection JSUnusedGlobalSymbols

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


const SYMBOL_STROKE = false
const SYMBOL_STROKE_COLOR = '#FFF'
const SYMBOL_STROKE_WIDTH = '4'

const SIGN_COLOR_CIRCLE = null

/**
 * Add <title></title> elements in the SVG
 * @type {boolean}
 */
const INSERT_ELEMENT_TITLE = true

const ELEMENT_TITLES = {
    "axis": {
        "As": "Ascendant",
        "Mc": "Midheaven",
        "Ds": "Descendant",
        "Ic": "Imum Coeli",
    },
    "signs": {
        "aries": "Aries",
        "taurus": "Taurus",
        "gemini": "Gemini",
        "cancer": "Cancer",
        "leo": "Leo",
        "virgo": "Virgo",
        "libra": "Libra",
        "scorpio": "Scorpio",
        "sagittarius": "Sagittarius",
        "capricorn": "Capricorn",
        "aquarius": "Aquarius",
        "pisces": "Pisces"
    },
    "points": {
        "sun": "Sun",
        "moon": "Moon",
        "mercury": "Mercury",
        "venus": "Venus",
        "earth": "Earth",
        "mars": "Mars",
        "jupiter": "Jupiter",
        "saturn": "Saturn",
        "uranus": "Uranus",
        "neptune": "Neptune",
        "pluto": "Pluto",
        "chiron": "Chiron",
        "lilith": "Lilith",
        "nnode": "North Node",
        "snode": "South Node"
    },
    "retrograde": "Retrograde",
    "aspects": {
        "conjunction": "Conjunction",
        "opposition": "Opposition",
        "square": "Square",
        "trine": "Trine",
        "sextile": "Sextile",
        "quincunx": "Quincunx",
        "semi-sextile": "Semi-sextile",
        "semi-square": "Semi-square",
        "octile": "Octile",
        "sesquisquare": "Sesquisquare",
        "trioctile": "Trioctile",
        "quintile": "Quintile",
        "biquintile": "Biquintile",
        "semi-quintile": "Semi-quintile",
    },
    'cusps': {
        1: "Identité : image de soi, personnalité, apparence physique",
        2: "Ressources : argent, biens, sécurité matérielle, talents",
        3: "Communication : esprit, échanges, frères et sœurs, déplacements",
        4: "Origines : famille, racines, foyer, intimité",
        5: "Expression : créativité, enfants, loisirs, amours",
        6: "Quotidien : travail, santé, routines, service",
        7: "Relations : couple, partenariats, contrats, ennemis déclarés",
        8: "Transformation : crises, sexualité, héritages, pouvoir partagé",
        9: "Expansion : voyages, spiritualité, études supérieures, croyances",
        10: "Réalisation : carrière, image publique, vocation",
        11: "Collectif : amis, projets, causes sociales, réseaux",
        12: "Intériorité : inconscient, solitude, secrets, limitations"
    }
}

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
// noinspection JSUnusedGlobalSymbols

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
/* harmony export */   CHART_CENTER_SIZE: () => (/* binding */ CHART_CENTER_SIZE),
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
/* harmony export */   CLASS_SIGN: () => (/* binding */ CLASS_SIGN),
/* harmony export */   CLASS_SIGN_ASPECT: () => (/* binding */ CLASS_SIGN_ASPECT),
/* harmony export */   CLASS_SIGN_ASPECT_LINE: () => (/* binding */ CLASS_SIGN_ASPECT_LINE),
/* harmony export */   CLASS_SIGN_SEGMENT: () => (/* binding */ CLASS_SIGN_SEGMENT),
/* harmony export */   DRAW_RULER_MARK: () => (/* binding */ DRAW_RULER_MARK),
/* harmony export */   FONT_ASTRONOMICON_LOAD: () => (/* binding */ FONT_ASTRONOMICON_LOAD),
/* harmony export */   FONT_ASTRONOMICON_PATH: () => (/* binding */ FONT_ASTRONOMICON_PATH),
/* harmony export */   PLANET_LINE_USE_PLANET_COLOR: () => (/* binding */ PLANET_LINE_USE_PLANET_COLOR)
/* harmony export */ });
// noinspection JSUnusedGlobalSymbols

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

/**
 * Change the size of the center circle, where aspects are
 * @type {number}
 */
const CHART_CENTER_SIZE = 1

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

const FONT_ASTRONOMICON_LOAD = true;
const FONT_ASTRONOMICON_PATH = '../assets/fonts/ttf/AstronomiconFonts_1.1/Astronomicon.ttf';

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
/* harmony import */ var _charts_RadixChart_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../charts/RadixChart.js */ "./src/charts/RadixChart.js");
/* harmony import */ var _charts_TransitChart_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../charts/TransitChart.js */ "./src/charts/TransitChart.js");






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

        if (! document.getElementById(htmlElementID)) {
            throw new Error('Canot find a HTML element with ID ' + htmlElementID)
        }

        this.#settings = Object.assign({}, _settings_DefaultSettings_js__WEBPACK_IMPORTED_MODULE_0__["default"], options, {
            HTML_ELEMENT_ID: htmlElementID
        });
        this.#SVGDocument = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGDocument(this.#settings.CHART_VIEWBOX_WIDTH, this.#settings.CHART_VIEWBOX_HEIGHT)
        document.getElementById(htmlElementID).appendChild(this.#SVGDocument);

        // chart background
        const backgroundGroup = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGGroup()
        backgroundGroup.classList.add('c-backgrounds')
        const circle = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGCircle(this.#settings.CHART_VIEWBOX_WIDTH / 2, this.#settings.CHART_VIEWBOX_HEIGHT / 2, this.#settings.CHART_VIEWBOX_WIDTH / 2)
        circle.setAttribute('fill', this.#settings.CHART_BACKGROUND_COLOR)
        circle.classList.add('c-chart-background');
        backgroundGroup.appendChild(circle)
        this.#SVGDocument.appendChild(backgroundGroup)

        // create wrapper for aspects
        this.#aspectsWrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGGroup()
        this.#aspectsWrapper.setAttribute("id", `${this.#settings.HTML_ELEMENT_ID}-${this.#settings.ASPECTS_ID}`)
        this.#SVGDocument.appendChild(this.#aspectsWrapper)

        this.#radix = new _charts_RadixChart_js__WEBPACK_IMPORTED_MODULE_2__["default"](this)
        this.#transit = new _charts_TransitChart_js__WEBPACK_IMPORTED_MODULE_3__["default"](this.#radix)

        if (this.#settings.FONT_ASTRONOMICON_LOAD) {
            this.#loadFont("Astronomicon", this.#settings.FONT_ASTRONOMICON_PATH)
        }

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
    async #loadFont(family, source, descriptors) {

        if (! ('FontFace' in window)) {
            console.error("Ooops, FontFace is not a function.")
            console.error("@see https://developer.mozilla.org/en-US/docs/Web/API/CSS_Font_Loading_API")
            return
        }

        const font = new FontFace(family, `url(${source})`, descriptors)

        try {
            await font.load();
            document.fonts.add(font)
        } catch (e) {
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
                    /**
                     * Use custom orbs if available:
                     *
                     * DEFAULT_ASPECTS: [
                     *             {name: "Conjunction", angle: 0, orb: 4, orbs: {'Sun': 10}, isMajor: true},
                     *             ...
                     *             ]
                     * @type {number}
                     */
                    let orbLimit = ((aspect.orbs?.[fromP.name] ?? aspect.orb) + (aspect.orbs?.[toP.name] ?? aspect.orb)) / 2

                    if (Math.abs(orb) <= orbLimit) {
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
        wrapper.classList.add('c-aspects')

        /**
         * Reorder aspects
         * Draw minor aspects first
         */
        aspectsList.sort((a, b) => ((a.aspect.isMajor ?? false) === (b.aspect.isMajor ?? false)) ? 0 : (a.aspect.isMajor ?? false) ? 1 : -1)

        const aspectGroups = [];

        for (const asp of aspectsList) {
            const aspectGroup = _SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGGroup()
            aspectGroup.classList.add('c-aspects__aspect')
            aspectGroup.classList.add('c-aspects__aspect--' + asp.aspect.name.toLowerCase())
            aspectGroups.push(aspectGroup)
        }

        /**
         * Split the aspect line in two, with a gape fixed in pixels
         *
         * @author ChatGPT
         * @param fromPoint
         * @param toPoint
         * @param gap
         * @returns {[[{x: number, y: number}, {x: number, y: number}],[{x: number, y: number},{x: number, y: number}]]}
         */
        const splitLineWithGap = function (fromPoint, toPoint, gap = 15) {
            const dx = toPoint.x - fromPoint.x;
            const dy = toPoint.y - fromPoint.y;

            // Line length
            const length = Math.sqrt(dx * dx + dy * dy);

            // Midpoint
            const midX = (fromPoint.x + toPoint.x) / 2;
            const midY = (fromPoint.y + toPoint.y) / 2;

            // Half gap along the perpendicular
            const offset = gap / 2;

            // Adjust midpoint along the line direction to get split points
            const dirX = dx / length;
            const dirY = dy / length;

            // First segment: fromPoint to mid - offset in direction of line
            const p1 = fromPoint;
            const p2 = {
                x: midX - dirX * offset,
                y: midY - dirY * offset
            };

            // Second segment: mid + offset to toPoint
            const p3 = {
                x: midX + dirX * offset,
                y: midY + dirY * offset
            };
            const p4 = toPoint;

            return [
                [p1, p2], // first line segment
                [p3, p4]  // second line segment
            ];
        }


        /**
         * Draw lines first
         */
        for (let i = 0; i < aspectsList.length; i++) {
            const asp = aspectsList[i];
            const aspectGroup = aspectGroups[i];

            // aspect as solid line
            const fromPoint = _Utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].positionOnCircle(centerX, centerY, radius, _Utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].degreeToRadian(asp.from.angle, ascendantShift))
            const toPoint = _Utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].positionOnCircle(centerX, centerY, radius, _Utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].degreeToRadian(asp.to.angle, ascendantShift))

            const [splitLine1, splitLine2] = splitLineWithGap(fromPoint, toPoint, settings.ASPECTS_FONT_SIZE ?? 20);

            const line1 = _SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGLine(splitLine1[0].x, splitLine1[0].y, splitLine1[1].x, splitLine1[1].y)
            line1.setAttribute("stroke", settings.ASPECT_COLORS[asp.aspect.name] ?? "#333");

            if (settings.CHART_STROKE_MINOR_ASPECT && ! (asp.aspect.isMajor ?? false)) {
                line1.setAttribute("stroke-width", settings.CHART_STROKE_MINOR_ASPECT);
            } else {
                line1.setAttribute("stroke-width", settings.CHART_STROKE);
            }

            if (settings.CLASS_SIGN_ASPECT_LINE) {
                line1.setAttribute("class", settings.CLASS_SIGN_ASPECT_LINE)
            }

            const line2 = _SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGLine(splitLine2[0].x, splitLine2[0].y, splitLine2[1].x, splitLine2[1].y)
            line2.setAttribute("stroke", settings.ASPECT_COLORS[asp.aspect.name] ?? "#333");

            if (settings.CHART_STROKE_MINOR_ASPECT && ! (asp.aspect.isMajor ?? false)) {
                line2.setAttribute("stroke-width", settings.CHART_STROKE_MINOR_ASPECT);
            } else {
                line2.setAttribute("stroke-width", settings.CHART_STROKE);
            }

            if (settings.CLASS_SIGN_ASPECT_LINE) {
                line2.setAttribute("class", settings.CLASS_SIGN_ASPECT_LINE)
            }

            aspectGroup.appendChild(line1);
            aspectGroup.appendChild(line2);
        }

        /**
         * Draw all aspects above lines
         */
        for (let i = 0; i < aspectsList.length; i++) {
            const asp = aspectsList[i];
            const aspectGroup = aspectGroups[i];

            // aspect as solid line
            const fromPoint = _Utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].positionOnCircle(centerX, centerY, radius, _Utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].degreeToRadian(asp.from.angle, ascendantShift))
            const toPoint = _Utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].positionOnCircle(centerX, centerY, radius, _Utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].degreeToRadian(asp.to.angle, ascendantShift))

            // draw symbol in center of aspect
            const lineCenterX = (fromPoint.x + toPoint.x) / 2
            const lineCenterY = (fromPoint.y + toPoint.y) / 2 - (settings.ASPECTS_FONT_SIZE ?? 20) / 18 // nudge a bit higher Astronomicon symbol
            const symbol = _SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGSymbol(asp.aspect.name, lineCenterX, lineCenterY)
            symbol.setAttribute("font-family", settings.CHART_FONT_FAMILY ?? "Astronomicon");
            symbol.setAttribute("text-anchor", "middle") // start, middle, end
            symbol.setAttribute("dominant-baseline", "middle")
            symbol.setAttribute("font-size", settings.ASPECTS_FONT_SIZE);
            symbol.setAttribute("fill", settings.ASPECT_COLORS[asp.aspect.name] ?? "#333");

            if (settings.CLASS_SIGN_ASPECT) {
                symbol.setAttribute("class", settings.CLASS_SIGN_ASPECT + ' ' + settings.CLASS_SIGN_ASPECT + '--' + asp.aspect.name.toLowerCase())
            }

            if (settings.INSERT_ELEMENT_TITLE) {
                symbol.appendChild(_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGTitle(settings.ELEMENT_TITLES.aspects[asp.aspect.name.toLowerCase()]))
            }

            aspectGroup.dataset.from = asp.from.name.toLowerCase();
            aspectGroup.dataset.to = asp.to.name.toLowerCase();

            aspectGroup.appendChild(symbol);
            wrapper.appendChild(aspectGroup);
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
// noinspection JSUnusedGlobalSymbols
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
    static SYMBOL_SQUARE = "Square"; // AKA Quartile or Quadrate
    static SYMBOL_TRINE = "Trine";
    static SYMBOL_SEXTILE = "Sextile";

    static SYMBOL_QUINCUNX = "Quincunx";
    static SYMBOL_SEMISEXTILE = "Semi-sextile";

    static SYMBOL_SEMISQUARE = "Semi-square"; // AKA Octile
    static SYMBOL_OCTILE = "Octile";

    static SYMBOL_SESQUISQUARE = "Sesquisquare"; // AKA Trioctile
    static SYMBOL_TRIOCTILE = "Trioctile"; // Same as Sesquisquare

    static SYMBOL_QUINTILE = "Quintile";
    static SYMBOL_BIQUINTILE = "Biquintile";
    static SYMBOL_SEMIQUINTILE = "Semi-quintile"; // AKA Decile

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
    static SYMBOL_SEMISQUARE_CODE = "(";

    /**
     * Sesquiquadrate or Tri-Octile or Sesquisquare
     * @type {string}
     */
    static SYMBOL_TRIOCTILE_CODE = ")";

    static SYMBOL_BIQUINTILE_CODE = "*";

    static SYMBOL_QUINTILE_CODE = "·";

    static SYMBOL_SEMIQUINTILE_CODE = ",";

    static SYMBOL_QUINDECILE_CODE = "¸";

    /**
     * Quintile (variant)
     *
     * @type {string}
     */
    static SYMBOL_QUINTILE_VARIANT_CODE = "+";


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
        return document.createElementNS(SVGUtils.SVG_NAMESPACE, "g")
    }

    /**
     * Create a SVG title element
     *
     * @static
     * @param {String} title
     * @return {SVGGroupElement}
     */
    static SVGTitle(title) {
        const svgTitle = document.createElementNS(SVGUtils.SVG_NAMESPACE, "title")
        svgTitle.appendChild(document.createTextNode(title));
        return svgTitle;
    }

    /**
     * Create a SVG path element
     *
     * @static
     * @return {SVGGroupElement}
     */
    static SVGPath() {
        return document.createElementNS(SVGUtils.SVG_NAMESPACE, "path")
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
    static SVGSymbol(name, xPos, yPos,) {
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

            case SVGUtils.SYMBOL_SEMISQUARE:
            case SVGUtils.SYMBOL_OCTILE:
                return semisquareSymbol(xPos, yPos)

            case SVGUtils.SYMBOL_TRIOCTILE:
            case SVGUtils.SYMBOL_SESQUISQUARE:
                return trioctileSymbol(xPos, yPos)

            case SVGUtils.SYMBOL_QUINTILE:
                return quintileSymbol(xPos, yPos)

            case SVGUtils.SYMBOL_BIQUINTILE:
                return biquintileSymbol(xPos, yPos)

            case SVGUtils.SYMBOL_SEMIQUINTILE:
                return semiquintileSymbol(xPos, yPos)

            default:
                console.debug('Unknown symbol: ' + name)
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
        * Semisquare symbol
        * aka Quintile/ Octile symbol
        */
        function semisquareSymbol(xPos, yPos) {
            return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_SEMISQUARE_CODE)
        }

        /*
         * Quintile
         */
        function quintileSymbol(xPos, yPos) {
            return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_SEMISQUARE_CODE)
        }

        function biquintileSymbol(xPos, yPos) {
            return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_BIQUINTILE_CODE)
        }

        function semiquintileSymbol(xPos, yPos) {
            return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_SEMIQUINTILE_CODE)
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
        return `id_${randomNumber}_${timestamp}`;
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
        const START_ANGLE = cellWidth * frequency.findIndex(count => count === 0)

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

        return pointInCollision !== undefined
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMzUEE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNPOztBQUVQO0FBQ0EsMERBQTBELE1BQU07QUFDaEUsVUFBVTtBQUNWO0FBQ08sMEJBQTBCLE1BQU07OztBQUd2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNPO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRVA7QUFDQTtBQUNBO0FBQ087QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNuSlA7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRVA7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNPOztBQUVBO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQzVIQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDaEJQOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ087O0FBRVA7QUFD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QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFFBQVE7QUFDdkIsZUFBZSxRQUFRO0FBQ3ZCLGVBQWUsUUFBUTtBQUN2QixlQUFlLFFBQVE7QUFDdkI7QUFDQSxnQkFBZ0IsWUFBWTtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZSxRQUFRO0FBQ3ZCLGVBQWUsUUFBUTtBQUN2QixlQUFlLFFBQVE7QUFDdkIsZUFBZSxRQUFRO0FBQ3ZCO0FBQ0EsZ0JBQWdCLFlBQVk7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFFBQVE7QUFDdkIsZUFBZSxRQUFRO0FBQ3ZCLGVBQWUsUUFBUTtBQUN2QjtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7O0FBR0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtB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QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsK0ZBQStGO0FBQy9GO0FBQ0E7QUFDQTs7O0FBTUM7Ozs7Ozs7O1VDcE5EO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ042QztBQUNIO0FBQ047QUFDVztBQUNJOztBQUVTIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYXN0cm9sb2d5L3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvY2hhcnRzL0NoYXJ0LmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy9jaGFydHMvUmFkaXhDaGFydC5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvY2hhcnRzL1RyYW5zaXRDaGFydC5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvcG9pbnRzL1BvaW50LmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy9zZXR0aW5ncy9EZWZhdWx0U2V0dGluZ3MuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL3NldHRpbmdzL2NvbnN0YW50cy9Bc3BlY3RzLmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy9zZXR0aW5ncy9jb25zdGFudHMvQ29sb3JzLmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy9zZXR0aW5ncy9jb25zdGFudHMvUG9pbnQuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL3NldHRpbmdzL2NvbnN0YW50cy9SYWRpeC5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvc2V0dGluZ3MvY29uc3RhbnRzL1RyYW5zaXQuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL3NldHRpbmdzL2NvbnN0YW50cy9Vbml2ZXJzZS5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvdW5pdmVyc2UvVW5pdmVyc2UuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL3V0aWxzL0FzcGVjdFV0aWxzLmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy91dGlscy9TVkdVdGlscy5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvdXRpbHMvVXRpbHMuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2FzdHJvbG9neS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcImFzdHJvbG9neVwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJhc3Ryb2xvZ3lcIl0gPSBmYWN0b3J5KCk7XG59KShzZWxmLCAoKSA9PiB7XG5yZXR1cm4gIiwiaW1wb3J0IFV0aWxzIGZyb20gJy4uL3V0aWxzL1V0aWxzLmpzJztcblxuLy8gbm9pbnNwZWN0aW9uIEpTVW51c2VkR2xvYmFsU3ltYm9sc1xuLyoqXG4gKiBAY2xhc3NcbiAqIEBjbGFzc2Rlc2MgQW4gYWJzdHJhY3QgY2xhc3MgZm9yIGFsbCB0eXBlIG9mIENoYXJ0XG4gKiBAcHVibGljXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKiBAYWJzdHJhY3RcbiAqL1xuY2xhc3MgQ2hhcnQge1xuXG4gIC8vI3NldHRpbmdzXG5cbiAgLyoqXG4gICAqIEBjb25zdHJ1Y3RzXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzZXR0aW5nc1xuICAgKi9cbiAgY29uc3RydWN0b3Ioc2V0dGluZ3MpIHtcbiAgICAvL3RoaXMuI3NldHRpbmdzID0gc2V0dGluZ3NcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgZGF0YSBpcyB2YWxpZFxuICAgKiBAdGhyb3dzIHtFcnJvcn0gLSBpZiB0aGUgZGF0YSBpcyB1bmRlZmluZWQuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gICAqIEByZXR1cm4ge09iamVjdH0gLSB7aXNWYWxpZDpib29sZWFuLCBtZXNzYWdlOlN0cmluZ31cbiAgICovXG4gIHZhbGlkYXRlRGF0YShkYXRhKSB7XG4gICAgaWYgKCFkYXRhKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNaXNpbmcgcGFyYW0gZGF0YS5cIilcbiAgICB9XG5cbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoZGF0YS5wb2ludHMpKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpc1ZhbGlkOiBmYWxzZSxcbiAgICAgICAgbWVzc2FnZTogXCJwb2ludHMgaXMgbm90IEFycmF5LlwiXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGRhdGEuY3VzcHMpKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpc1ZhbGlkOiBmYWxzZSxcbiAgICAgICAgbWVzc2FnZTogXCJjdXBzIGlzIG5vdCBBcnJheS5cIlxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChkYXRhLmN1c3BzLmxlbmd0aCAhPT0gMTIpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlzVmFsaWQ6IGZhbHNlLFxuICAgICAgICBtZXNzYWdlOiBcImN1c3BzLmxlbmd0aCAhPT0gMTJcIlxuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAobGV0IHBvaW50IG9mIGRhdGEucG9pbnRzKSB7XG4gICAgICBpZiAodHlwZW9mIHBvaW50Lm5hbWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaXNWYWxpZDogZmFsc2UsXG4gICAgICAgICAgbWVzc2FnZTogXCJwb2ludC5uYW1lICE9PSAnc3RyaW5nJ1wiXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChwb2ludC5uYW1lLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGlzVmFsaWQ6IGZhbHNlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwicG9pbnQubmFtZS5sZW5ndGggPT0gMFwiXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgcG9pbnQuYW5nbGUgIT09ICdudW1iZXInKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaXNWYWxpZDogZmFsc2UsXG4gICAgICAgICAgbWVzc2FnZTogXCJwb2ludC5hbmdsZSAhPT0gJ251bWJlcidcIlxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChsZXQgY3VzcCBvZiBkYXRhLmN1c3BzKSB7XG4gICAgICBpZiAodHlwZW9mIGN1c3AuYW5nbGUgIT09ICdudW1iZXInKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaXNWYWxpZDogZmFsc2UsXG4gICAgICAgICAgbWVzc2FnZTogXCJjdXNwLmFuZ2xlICE9PSAnbnVtYmVyJ1wiXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgaXNWYWxpZDogdHJ1ZSxcbiAgICAgIG1lc3NhZ2U6IFwiXCJcbiAgICB9XG4gIH1cbiAgXG4gIC8qKlxuICAgKiBAYWJzdHJhY3RcbiAgICovXG4gIHNldERhdGEoZGF0YSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIk11c3QgYmUgaW1wbGVtZW50ZWQgYnkgc3ViY2xhc3MuXCIpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBhYnN0cmFjdFxuICAgKi9cbiAgZ2V0UG9pbnRzKCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIk11c3QgYmUgaW1wbGVtZW50ZWQgYnkgc3ViY2xhc3MuXCIpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBhYnN0cmFjdFxuICAgKi9cbiAgZ2V0UG9pbnQobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIk11c3QgYmUgaW1wbGVtZW50ZWQgYnkgc3ViY2xhc3MuXCIpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBhYnN0cmFjdFxuICAgKi9cbiAgYW5pbWF0ZVRvKGRhdGEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJNdXN0IGJlIGltcGxlbWVudGVkIGJ5IHN1YmNsYXNzLlwiKTtcbiAgfVxuXG4gIC8vICMjIFBST1RFQ1RFRCAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxufVxuXG5leHBvcnQge1xuICBDaGFydCBhc1xuICBkZWZhdWx0XG59XG4iLCJpbXBvcnQgVW5pdmVyc2UgZnJvbSAnLi4vdW5pdmVyc2UvVW5pdmVyc2UuanMnO1xuaW1wb3J0IFNWR1V0aWxzIGZyb20gJy4uL3V0aWxzL1NWR1V0aWxzLmpzJztcbmltcG9ydCBVdGlscyBmcm9tICcuLi91dGlscy9VdGlscy5qcyc7XG5pbXBvcnQgQXNwZWN0VXRpbHMgZnJvbSAnLi4vdXRpbHMvQXNwZWN0VXRpbHMuanMnO1xuaW1wb3J0IENoYXJ0IGZyb20gJy4vQ2hhcnQuanMnXG5pbXBvcnQgUG9pbnQgZnJvbSAnLi4vcG9pbnRzL1BvaW50LmpzJ1xuaW1wb3J0IERlZmF1bHRTZXR0aW5ncyBmcm9tICcuLi9zZXR0aW5ncy9EZWZhdWx0U2V0dGluZ3MuanMnO1xuXG4vKipcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyBQb2ludHMgYW5kIGN1cHMgYXJlIGRpc3BsYXllZCBpbnNpZGUgdGhlIFVuaXZlcnNlLlxuICogQHB1YmxpY1xuICogQGV4dGVuZHMge0NoYXJ0fVxuICovXG5jbGFzcyBSYWRpeENoYXJ0IGV4dGVuZHMgQ2hhcnQge1xuXG4gICAgLypcbiAgICAgKiBMZXZlbHMgZGV0ZXJtaW5lIHRoZSB3aWR0aCBvZiBpbmRpdmlkdWFsIHBhcnRzIG9mIHRoZSBjaGFydC5cbiAgICAgKiBJdCBjYW4gYmUgY2hhbmdlZCBkeW5hbWljYWxseSBieSBwdWJsaWMgc2V0dGVyLlxuICAgICAqL1xuICAgICNudW1iZXJPZkxldmVscyA9IDI0XG5cbiAgICAjdW5pdmVyc2VcbiAgICAjc2V0dGluZ3NcbiAgICAjcm9vdFxuICAgICNkYXRhXG5cbiAgICAjY2VudGVyWFxuICAgICNjZW50ZXJZXG4gICAgI3JhZGl1c1xuXG4gICAgLypcbiAgICAgKiBAc2VlIFV0aWxzLmNsZWFuVXAoKVxuICAgICAqL1xuICAgICNiZWZvcmVDbGVhblVwSG9va1xuXG4gICAgLyoqXG4gICAgICogQGNvbnN0cnVjdHNcbiAgICAgKiBAcGFyYW0ge1VuaXZlcnNlfSBVbml2ZXJzZVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHVuaXZlcnNlKSB7XG5cbiAgICAgICAgaWYgKCEgdW5pdmVyc2UgaW5zdGFuY2VvZiBVbml2ZXJzZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdCYWQgcGFyYW0gdW5pdmVyc2UuJylcbiAgICAgICAgfVxuXG4gICAgICAgIHN1cGVyKHVuaXZlcnNlLmdldFNldHRpbmdzKCkpXG5cbiAgICAgICAgdGhpcy4jdW5pdmVyc2UgPSB1bml2ZXJzZVxuICAgICAgICB0aGlzLiNzZXR0aW5ncyA9IHRoaXMuI3VuaXZlcnNlLmdldFNldHRpbmdzKClcbiAgICAgICAgdGhpcy4jY2VudGVyWCA9IHRoaXMuI3NldHRpbmdzLkNIQVJUX1ZJRVdCT1hfV0lEVEggLyAyXG4gICAgICAgIHRoaXMuI2NlbnRlclkgPSB0aGlzLiNzZXR0aW5ncy5DSEFSVF9WSUVXQk9YX0hFSUdIVCAvIDJcbiAgICAgICAgdGhpcy4jcmFkaXVzID0gTWF0aC5taW4odGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSkgLSB0aGlzLiNzZXR0aW5ncy5DSEFSVF9QQURESU5HXG4gICAgICAgIHRoaXMuI3Jvb3QgPSBTVkdVdGlscy5TVkdHcm91cCgpXG4gICAgICAgIHRoaXMuI3Jvb3Quc2V0QXR0cmlidXRlKFwiaWRcIiwgYCR7dGhpcy4jc2V0dGluZ3MuSFRNTF9FTEVNRU5UX0lEfS0ke3RoaXMuI3NldHRpbmdzLlJBRElYX0lEfWApXG4gICAgICAgIHRoaXMuI3VuaXZlcnNlLmdldFNWR0RvY3VtZW50KCkuYXBwZW5kQ2hpbGQodGhpcy4jcm9vdCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXQgY2hhcnQgZGF0YVxuICAgICAqIEB0aHJvd3Mge0Vycm9yfSAtIGlmIHRoZSBkYXRhIGlzIG5vdCB2YWxpZC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICAgICAqIEByZXR1cm4ge1JhZGl4Q2hhcnR9XG4gICAgICovXG4gICAgc2V0RGF0YShkYXRhKSB7XG4gICAgICAgIGxldCBzdGF0dXMgPSB0aGlzLnZhbGlkYXRlRGF0YShkYXRhKVxuICAgICAgICBpZiAoISBzdGF0dXMuaXNWYWxpZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHN0YXR1cy5tZXNzYWdlKVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy4jZGF0YSA9IGRhdGFcbiAgICAgICAgdGhpcy4jZHJhdyhkYXRhKVxuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IGRhdGFcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG4gICAgZ2V0RGF0YSgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIFwicG9pbnRzXCI6IFsuLi50aGlzLiNkYXRhLnBvaW50c10sXG4gICAgICAgICAgICBcImN1c3BzXCI6IFsuLi50aGlzLiNkYXRhLmN1c3BzXVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0IG51bWJlciBvZiBMZXZlbHMuXG4gICAgICogTGV2ZWxzIGRldGVybWluZSB0aGUgd2lkdGggb2YgaW5kaXZpZHVhbCBwYXJ0cyBvZiB0aGUgY2hhcnQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge051bWJlcn1cbiAgICAgKi9cbiAgICBzZXROdW1iZXJPZkxldmVscyhsZXZlbHMpIHtcbiAgICAgICAgdGhpcy4jbnVtYmVyT2ZMZXZlbHMgPSBNYXRoLm1heCgyNCwgbGV2ZWxzKVxuICAgICAgICBpZiAodGhpcy4jZGF0YSkge1xuICAgICAgICAgICAgdGhpcy4jZHJhdyh0aGlzLiNkYXRhKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgcmFkaXVzXG4gICAgICogQHJldHVybiB7TnVtYmVyfVxuICAgICAqL1xuICAgIGdldFJhZGl1cygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI3JhZGl1c1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCByYWRpdXNcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAgICovXG4gICAgZ2V0T3V0ZXJDaXJjbGVSYWRpdXMoKSB7XG4gICAgICAgIHJldHVybiAyNCAqICh0aGlzLmdldFJhZGl1cygpIC8gdGhpcy4jbnVtYmVyT2ZMZXZlbHMpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHJhZGl1c1xuICAgICAqIEByZXR1cm4ge051bWJlcn1cbiAgICAgKi9cbiAgICBnZXRJbm5lckNpcmNsZVJhZGl1cygpIHtcbiAgICAgICAgcmV0dXJuIDIxICogKHRoaXMuZ2V0UmFkaXVzKCkgLyB0aGlzLiNudW1iZXJPZkxldmVscylcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgcmFkaXVzXG4gICAgICogQHJldHVybiB7TnVtYmVyfVxuICAgICAqL1xuICAgIGdldFJ1bGxlckNpcmNsZVJhZGl1cygpIHtcbiAgICAgICAgcmV0dXJuIDIwICogKHRoaXMuZ2V0UmFkaXVzKCkgLyB0aGlzLiNudW1iZXJPZkxldmVscylcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgcmFkaXVzXG4gICAgICogQHJldHVybiB7TnVtYmVyfVxuICAgICAqL1xuICAgIGdldFBvaW50Q2lyY2xlUmFkaXVzKCkge1xuICAgICAgICByZXR1cm4gMTggKiAodGhpcy5nZXRSYWRpdXMoKSAvIHRoaXMuI251bWJlck9mTGV2ZWxzKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCByYWRpdXNcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAgICovXG4gICAgZ2V0Q2VudGVyQ2lyY2xlUmFkaXVzKCkge1xuICAgICAgICByZXR1cm4gMTIgKiAodGhpcy5nZXRSYWRpdXMoKSAvIHRoaXMuI251bWJlck9mTGV2ZWxzKSAqICh0aGlzLiNzZXR0aW5ncy5DSEFSVF9DRU5URVJfU0laRSA/PyAxKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBVbml2ZXJzZVxuICAgICAqXG4gICAgICogQHJldHVybiB7VW5pdmVyc2V9XG4gICAgICovXG4gICAgZ2V0VW5pdmVyc2UoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiN1bml2ZXJzZVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBBc2NlbmRhdCBzaGlmdFxuICAgICAqXG4gICAgICogQHJldHVybiB7TnVtYmVyfVxuICAgICAqL1xuICAgIGdldEFzY2VuZGFudFNoaWZ0KCkge1xuICAgICAgICByZXR1cm4gKHRoaXMuI2RhdGE/LmN1c3BzWzBdPy5hbmdsZSA/PyAwKSArIFV0aWxzLkRFR18xODBcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgYXNwZWN0c1xuICAgICAqXG4gICAgICogQHBhcmFtIHtBcnJheTxPYmplY3Q+fSBbZnJvbVBvaW50c10gLSBbe25hbWU6XCJNb29uXCIsIGFuZ2xlOjB9LCB7bmFtZTpcIlN1blwiLCBhbmdsZToxNzl9LCB7bmFtZTpcIk1lcmN1cnlcIiwgYW5nbGU6MTIxfV1cbiAgICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IFt0b1BvaW50c10gLSBbe25hbWU6XCJBU1wiLCBhbmdsZTowfSwge25hbWU6XCJJQ1wiLCBhbmdsZTo5MH1dXG4gICAgICogQHBhcmFtIHtBcnJheTxPYmplY3Q+fSBbYXNwZWN0c10gLSBbe25hbWU6XCJPcHBvc2l0aW9uXCIsIGFuZ2xlOjE4MCwgb3JiOjJ9LCB7bmFtZTpcIlRyaW5lXCIsIGFuZ2xlOjEyMCwgb3JiOjJ9XVxuICAgICAqXG4gICAgICogQHJldHVybiB7QXJyYXk8T2JqZWN0Pn1cbiAgICAgKi9cbiAgICBnZXRBc3BlY3RzKGZyb21Qb2ludHMsIHRvUG9pbnRzLCBhc3BlY3RzKSB7XG4gICAgICAgIGlmICghIHRoaXMuI2RhdGEpIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgZnJvbVBvaW50cyA9IGZyb21Qb2ludHMgPz8gdGhpcy4jZGF0YS5wb2ludHMuZmlsdGVyKHggPT4gXCJhc3BlY3RcIiBpbiB4ID8geC5hc3BlY3QgOiB0cnVlKVxuICAgICAgICB0b1BvaW50cyA9IHRvUG9pbnRzID8/IFsuLi50aGlzLiNkYXRhLnBvaW50cy5maWx0ZXIoeCA9PiBcImFzcGVjdFwiIGluIHggPyB4LmFzcGVjdCA6IHRydWUpLCAuLi50aGlzLiNkYXRhLmN1c3BzLmZpbHRlcih4ID0+IHguYXNwZWN0KV1cbiAgICAgICAgYXNwZWN0cyA9IGFzcGVjdHMgPz8gdGhpcy4jc2V0dGluZ3MuREVGQVVMVF9BU1BFQ1RTID8/IERlZmF1bHRTZXR0aW5ncy5ERUZBVUxUX0FTUEVDVFNcblxuICAgICAgICByZXR1cm4gQXNwZWN0VXRpbHMuZ2V0QXNwZWN0cyhmcm9tUG9pbnRzLCB0b1BvaW50cywgYXNwZWN0cykuZmlsdGVyKGFzcGVjdCA9PiBhc3BlY3QuZnJvbS5uYW1lICE9PSBhc3BlY3QudG8ubmFtZSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEcmF3IGFzcGVjdHNcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gW2Zyb21Qb2ludHNdIC0gW3tuYW1lOlwiTW9vblwiLCBhbmdsZTowfSwge25hbWU6XCJTdW5cIiwgYW5nbGU6MTc5fSwge25hbWU6XCJNZXJjdXJ5XCIsIGFuZ2xlOjEyMX1dXG4gICAgICogQHBhcmFtIHtBcnJheTxPYmplY3Q+fSBbdG9Qb2ludHNdIC0gW3tuYW1lOlwiQVNcIiwgYW5nbGU6MH0sIHtuYW1lOlwiSUNcIiwgYW5nbGU6OTB9XVxuICAgICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gW2FzcGVjdHNdIC0gW3tuYW1lOlwiT3Bwb3NpdGlvblwiLCBhbmdsZToxODAsIG9yYjoyfSwge25hbWU6XCJUcmluZVwiLCBhbmdsZToxMjAsIG9yYjoyfV1cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge0FycmF5PE9iamVjdD59XG4gICAgICovXG4gICAgZHJhd0FzcGVjdHMoZnJvbVBvaW50cywgdG9Qb2ludHMsIGFzcGVjdHMpIHtcbiAgICAgICAgY29uc3QgYXNwZWN0c1dyYXBwZXIgPSB0aGlzLiN1bml2ZXJzZS5nZXRBc3BlY3RzRWxlbWVudCgpXG4gICAgICAgIFV0aWxzLmNsZWFuVXAoYXNwZWN0c1dyYXBwZXIuZ2V0QXR0cmlidXRlKFwiaWRcIiksIHRoaXMuI2JlZm9yZUNsZWFuVXBIb29rKVxuXG4gICAgICAgIGNvbnN0IGFzcGVjdHNMaXN0ID0gdGhpcy5nZXRBc3BlY3RzKGZyb21Qb2ludHMsIHRvUG9pbnRzLCBhc3BlY3RzKVxuICAgICAgICAgICAgLnJlZHVjZSgoYXJyLCBhc3BlY3QpID0+IHtcblxuICAgICAgICAgICAgICAgIGxldCBpc1RoZVNhbWUgPSBhcnIuc29tZShlbG0gPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZWxtLmZyb20ubmFtZSA9PT0gYXNwZWN0LnRvLm5hbWUgJiYgZWxtLnRvLm5hbWUgPT09IGFzcGVjdC5mcm9tLm5hbWVcbiAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgaWYgKCEgaXNUaGVTYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIGFyci5wdXNoKGFzcGVjdClcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gYXJyXG4gICAgICAgICAgICB9LCBbXSlcbiAgICAgICAgICAgIC5maWx0ZXIoYXNwZWN0ID0+IGFzcGVjdC5hc3BlY3QubmFtZSAhPT0gJ0Nvbmp1bmN0aW9uJylcblxuICAgICAgICBjb25zdCBjaXJjbGUgPSBTVkdVdGlscy5TVkdDaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy5nZXRDZW50ZXJDaXJjbGVSYWRpdXMoKSlcbiAgICAgICAgY2lyY2xlLnNldEF0dHJpYnV0ZSgnZmlsbCcsIHRoaXMuI3NldHRpbmdzLkFTUEVDVFNfQkFDS0dST1VORF9DT0xPUilcbiAgICAgICAgYXNwZWN0c1dyYXBwZXIuYXBwZW5kQ2hpbGQoY2lyY2xlKVxuXG4gICAgICAgIGFzcGVjdHNXcmFwcGVyLmFwcGVuZENoaWxkKEFzcGVjdFV0aWxzLmRyYXdBc3BlY3RzKHRoaXMuZ2V0Q2VudGVyQ2lyY2xlUmFkaXVzKCksIHRoaXMuZ2V0QXNjZW5kYW50U2hpZnQoKSwgdGhpcy4jc2V0dGluZ3MsIGFzcGVjdHNMaXN0KSlcblxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIC8vICMjIFBSSVZBVEUgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiAgICAvKlxuICAgICAqIERyYXcgcmFkaXggY2hhcnRcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICAgICAqL1xuICAgICNkcmF3KGRhdGEpIHtcbiAgICAgICAgVXRpbHMuY2xlYW5VcCh0aGlzLiNyb290LmdldEF0dHJpYnV0ZSgnaWQnKSwgdGhpcy4jYmVmb3JlQ2xlYW5VcEhvb2spXG4gICAgICAgIHRoaXMuI2RyYXdCYWNrZ3JvdW5kKClcbiAgICAgICAgdGhpcy4jZHJhd0FzdHJvbG9naWNhbFNpZ25zKClcbiAgICAgICAgdGhpcy4jZHJhd0N1c3BzKGRhdGEpXG4gICAgICAgIHRoaXMuI2RyYXdQb2ludHMoZGF0YSlcbiAgICAgICAgdGhpcy4jZHJhd1J1bGVyKClcbiAgICAgICAgdGhpcy4jZHJhd0JvcmRlcnMoKVxuICAgICAgICB0aGlzLiNzZXR0aW5ncy5DSEFSVF9EUkFXX01BSU5fQVhJUyAmJiB0aGlzLiNkcmF3TWFpbkF4aXNEZXNjcmlwdGlvbihkYXRhKVxuICAgICAgICB0aGlzLiNzZXR0aW5ncy5EUkFXX0FTUEVDVFMgJiYgdGhpcy5kcmF3QXNwZWN0cygpXG4gICAgfVxuXG4gICAgI2RyYXdCYWNrZ3JvdW5kKCkge1xuICAgICAgICBjb25zdCBNQVNLX0lEID0gYCR7dGhpcy4jc2V0dGluZ3MuSFRNTF9FTEVNRU5UX0lEfS0ke3RoaXMuI3NldHRpbmdzLlJBRElYX0lEfS1iYWNrZ3JvdW5kLW1hc2stMWBcblxuICAgICAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuICAgICAgICB3cmFwcGVyLmNsYXNzTGlzdC5hZGQoJ2MtcmFkaXgtYmFja2dyb3VuZCcpXG5cbiAgICAgICAgY29uc3QgbWFzayA9IFNWR1V0aWxzLlNWR01hc2soTUFTS19JRClcbiAgICAgICAgY29uc3Qgb3V0ZXJDaXJjbGUgPSBTVkdVdGlscy5TVkdDaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy5nZXRSYWRpdXMoKSlcbiAgICAgICAgb3V0ZXJDaXJjbGUuc2V0QXR0cmlidXRlKCdmaWxsJywgXCJ3aGl0ZVwiKVxuICAgICAgICBtYXNrLmFwcGVuZENoaWxkKG91dGVyQ2lyY2xlKVxuXG4gICAgICAgIGNvbnN0IGlubmVyQ2lyY2xlID0gU1ZHVXRpbHMuU1ZHQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuZ2V0Q2VudGVyQ2lyY2xlUmFkaXVzKCkpXG4gICAgICAgIGlubmVyQ2lyY2xlLnNldEF0dHJpYnV0ZSgnZmlsbCcsIFwiYmxhY2tcIilcbiAgICAgICAgbWFzay5hcHBlbmRDaGlsZChpbm5lckNpcmNsZSlcbiAgICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChtYXNrKVxuXG4gICAgICAgIGNvbnN0IGNpcmNsZSA9IFNWR1V0aWxzLlNWR0NpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLmdldFJhZGl1cygpKVxuICAgICAgICBjaXJjbGUuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0VfT05MWSA/IFwibm9uZVwiIDogdGhpcy4jc2V0dGluZ3MuUExBTkVUU19CQUNLR1JPVU5EX0NPTE9SKTtcbiAgICAgICAgY2lyY2xlLnNldEF0dHJpYnV0ZShcIm1hc2tcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFX09OTFkgPyBcIm5vbmVcIiA6IGB1cmwoIyR7TUFTS19JRH0pYCk7XG4gICAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoY2lyY2xlKVxuXG4gICAgICAgIHRoaXMuI3Jvb3QucGFyZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYy1iYWNrZ3JvdW5kcycpLmFwcGVuZENoaWxkKHdyYXBwZXIpXG4gICAgfVxuXG4gICAgI2RyYXdBc3Ryb2xvZ2ljYWxTaWducygpIHtcbiAgICAgICAgY29uc3QgTlVNQkVSX09GX0FTVFJPTE9HSUNBTF9TSUdOUyA9IDEyXG4gICAgICAgIGNvbnN0IFNURVAgPSAzMCAvL2RlZ3JlZVxuICAgICAgICBjb25zdCBDT0xPUlNfU0lHTlMgPSBbdGhpcy4jc2V0dGluZ3MuQ09MT1JfQVJJRVMsIHRoaXMuI3NldHRpbmdzLkNPTE9SX1RBVVJVUywgdGhpcy4jc2V0dGluZ3MuQ09MT1JfR0VNSU5JLCB0aGlzLiNzZXR0aW5ncy5DT0xPUl9DQU5DRVIsIHRoaXMuI3NldHRpbmdzLkNPTE9SX0xFTywgdGhpcy4jc2V0dGluZ3MuQ09MT1JfVklSR08sIHRoaXMuI3NldHRpbmdzLkNPTE9SX0xJQlJBLCB0aGlzLiNzZXR0aW5ncy5DT0xPUl9TQ09SUElPLCB0aGlzLiNzZXR0aW5ncy5DT0xPUl9TQUdJVFRBUklVUywgdGhpcy4jc2V0dGluZ3MuQ09MT1JfQ0FQUklDT1JOLCB0aGlzLiNzZXR0aW5ncy5DT0xPUl9BUVVBUklVUywgdGhpcy4jc2V0dGluZ3MuQ09MT1JfUElTQ0VTXVxuICAgICAgICBjb25zdCBTWU1CT0xfU0lHTlMgPSBbU1ZHVXRpbHMuU1lNQk9MX0FSSUVTLCBTVkdVdGlscy5TWU1CT0xfVEFVUlVTLCBTVkdVdGlscy5TWU1CT0xfR0VNSU5JLCBTVkdVdGlscy5TWU1CT0xfQ0FOQ0VSLCBTVkdVdGlscy5TWU1CT0xfTEVPLCBTVkdVdGlscy5TWU1CT0xfVklSR08sIFNWR1V0aWxzLlNZTUJPTF9MSUJSQSwgU1ZHVXRpbHMuU1lNQk9MX1NDT1JQSU8sIFNWR1V0aWxzLlNZTUJPTF9TQUdJVFRBUklVUywgU1ZHVXRpbHMuU1lNQk9MX0NBUFJJQ09STiwgU1ZHVXRpbHMuU1lNQk9MX0FRVUFSSVVTLCBTVkdVdGlscy5TWU1CT0xfUElTQ0VTXVxuXG4gICAgICAgIGlmIChDT0xPUlNfU0lHTlMubGVuZ3RoICE9PSAxMikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignTWlzc2luZyBlbnRyaWVzIGluIENPTE9SX1NJR05TLCByZXF1aXJlcyAxMiBlbnRyaWVzJyk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBtYWtlU3ltYm9sID0gKHN5bWJvbEluZGV4LCBhbmdsZUluRGVncmVlKSA9PiB7XG4gICAgICAgICAgICBsZXQgcG9zaXRpb24gPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuZ2V0T3V0ZXJDaXJjbGVSYWRpdXMoKSAtICgodGhpcy5nZXRPdXRlckNpcmNsZVJhZGl1cygpIC0gdGhpcy5nZXRJbm5lckNpcmNsZVJhZGl1cygpKSAvIDIpLCBVdGlscy5kZWdyZWVUb1JhZGlhbihhbmdsZUluRGVncmVlICsgU1RFUCAvIDIsIHRoaXMuZ2V0QXNjZW5kYW50U2hpZnQoKSkpXG5cbiAgICAgICAgICAgIGxldCBzeW1ib2wgPSBTVkdVdGlscy5TVkdTeW1ib2woU1lNQk9MX1NJR05TW3N5bWJvbEluZGV4XSwgcG9zaXRpb24ueCwgcG9zaXRpb24ueSlcbiAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJmb250LWZhbWlseVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9GT05UX0ZBTUlMWSk7XG4gICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIikgLy8gc3RhcnQsIG1pZGRsZSwgZW5kXG4gICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcbiAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJmb250LXNpemVcIiwgdGhpcy4jc2V0dGluZ3MuUkFESVhfU0lHTlNfRk9OVF9TSVpFKTtcbiAgICAgICAgICAgIGlmICh0aGlzLiNzZXR0aW5ncy5TSUdOX0NPTE9SX0NJUkNMRSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIHRoaXMuI3NldHRpbmdzLlNJR05fQ09MT1JfQ0lSQ0xFKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgdGhpcy4jc2V0dGluZ3MuU0lHTl9DT0xPUlNbc3ltYm9sSW5kZXhdID8/IHRoaXMuI3NldHRpbmdzLkNIQVJUX1NJR05TX0NPTE9SKTtcbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICBpZiAodGhpcy4jc2V0dGluZ3MuQ0xBU1NfU0lHTikge1xuICAgICAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgdGhpcy4jc2V0dGluZ3MuQ0xBU1NfU0lHTiArICcgJyArIHRoaXMuI3NldHRpbmdzLkNMQVNTX1NJR04gKyAnLS0nICsgU1lNQk9MX1NJR05TW3N5bWJvbEluZGV4XS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuI3NldHRpbmdzLlNZTUJPTF9TVFJPS0UpIHtcbiAgICAgICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKCdwYWludC1vcmRlcicsICdzdHJva2UnKTtcbiAgICAgICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKCdzdHJva2UnLCB0aGlzLiNzZXR0aW5ncy5TWU1CT0xfU1RST0tFX0NPTE9SKTtcbiAgICAgICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKCdzdHJva2Utd2lkdGgnLCB0aGlzLiNzZXR0aW5ncy5TWU1CT0xfU1RST0tFX1dJRFRIKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuI3NldHRpbmdzLklOU0VSVF9FTEVNRU5UX1RJVExFKSB7XG4gICAgICAgICAgICAgICAgc3ltYm9sLmFwcGVuZENoaWxkKFNWR1V0aWxzLlNWR1RpdGxlKHRoaXMuI3NldHRpbmdzLkVMRU1FTlRfVElUTEVTLnNpZ25zW1NZTUJPTF9TSUdOU1tzeW1ib2xJbmRleF0udG9Mb3dlckNhc2UoKV0pKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gc3ltYm9sXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBtYWtlU2VnbWVudCA9IChzeW1ib2xJbmRleCwgYW5nbGVGcm9tSW5EZWdyZWUsIGFuZ2xlVG9JbkRlZ3JlZSkgPT4ge1xuICAgICAgICAgICAgbGV0IGExID0gVXRpbHMuZGVncmVlVG9SYWRpYW4oYW5nbGVGcm9tSW5EZWdyZWUsIHRoaXMuZ2V0QXNjZW5kYW50U2hpZnQoKSlcbiAgICAgICAgICAgIGxldCBhMiA9IFV0aWxzLmRlZ3JlZVRvUmFkaWFuKGFuZ2xlVG9JbkRlZ3JlZSwgdGhpcy5nZXRBc2NlbmRhbnRTaGlmdCgpKVxuICAgICAgICAgICAgbGV0IHNlZ21lbnQgPSBTVkdVdGlscy5TVkdTZWdtZW50KHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuZ2V0T3V0ZXJDaXJjbGVSYWRpdXMoKSwgYTEsIGEyLCB0aGlzLmdldElubmVyQ2lyY2xlUmFkaXVzKCkpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFX1dJVEhfQ09MT1IpIHtcbiAgICAgICAgICAgICAgICBzZWdtZW50LnNldEF0dHJpYnV0ZShcImZpbGxcIiwgQ09MT1JTX1NJR05TW3N5bWJvbEluZGV4XSk7XG4gICAgICAgICAgICAgICAgc2VnbWVudC5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0lSQ0xFX0NPTE9SKTtcbiAgICAgICAgICAgICAgICBzZWdtZW50LnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0UpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWdtZW50LnNldEF0dHJpYnV0ZShcImZpbGxcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFX09OTFkgPyBcIm5vbmVcIiA6IENPTE9SU19TSUdOU1tzeW1ib2xJbmRleF0pO1xuICAgICAgICAgICAgICAgIHNlZ21lbnQuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRV9PTkxZID8gdGhpcy4jc2V0dGluZ3MuQ0lSQ0xFX0NPTE9SIDogXCJub25lXCIpO1xuICAgICAgICAgICAgICAgIHNlZ21lbnQuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRV9PTkxZID8gdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFIDogMCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLiNzZXR0aW5ncy5DTEFTU19TSUdOX1NFR01FTlQpIHtcbiAgICAgICAgICAgICAgICBzZWdtZW50LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCB0aGlzLiNzZXR0aW5ncy5DTEFTU19TSUdOX1NFR01FTlQgKyAnICcgKyB0aGlzLiNzZXR0aW5ncy5DTEFTU19TSUdOX1NFR01FTlQgKyBTWU1CT0xfU0lHTlNbc3ltYm9sSW5kZXhdLnRvTG93ZXJDYXNlKCkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gc2VnbWVudFxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHN0YXJ0QW5nbGUgPSAwXG4gICAgICAgIGxldCBlbmRBbmdsZSA9IHN0YXJ0QW5nbGUgKyBTVEVQXG5cbiAgICAgICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcbiAgICAgICAgd3JhcHBlci5jbGFzc0xpc3QuYWRkKCdjLXJhZGl4LWFzdHJvbG9naWNhbC1zaWducycpXG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBOVU1CRVJfT0ZfQVNUUk9MT0dJQ0FMX1NJR05TOyBpKyspIHtcblxuICAgICAgICAgICAgbGV0IHNlZ21lbnQgPSBtYWtlU2VnbWVudChpLCBzdGFydEFuZ2xlLCBlbmRBbmdsZSlcbiAgICAgICAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoc2VnbWVudCk7XG5cbiAgICAgICAgICAgIGxldCBzeW1ib2wgPSBtYWtlU3ltYm9sKGksIHN0YXJ0QW5nbGUpXG4gICAgICAgICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHN5bWJvbCk7XG5cbiAgICAgICAgICAgIHN0YXJ0QW5nbGUgKz0gU1RFUDtcbiAgICAgICAgICAgIGVuZEFuZ2xlID0gc3RhcnRBbmdsZSArIFNURVBcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuI3Jvb3QuYXBwZW5kQ2hpbGQod3JhcHBlcilcbiAgICB9XG5cbiAgICAjZHJhd1J1bGVyKCkge1xuICAgICAgICBjb25zdCBOVU1CRVJfT0ZfRElWSURFUlMgPSA3MlxuICAgICAgICBjb25zdCBTVEVQID0gNVxuXG4gICAgICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG4gICAgICAgIHdyYXBwZXIuY2xhc3NMaXN0LmFkZCgnYy1yYWRpeC1ydWxlcicpXG5cbiAgICAgICAgbGV0IHN0YXJ0QW5nbGUgPSB0aGlzLmdldEFzY2VuZGFudFNoaWZ0KClcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBOVU1CRVJfT0ZfRElWSURFUlM7IGkrKykge1xuICAgICAgICAgICAgbGV0IHN0YXJ0UG9pbnQgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuZ2V0UnVsbGVyQ2lyY2xlUmFkaXVzKCksIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKHN0YXJ0QW5nbGUpKVxuICAgICAgICAgICAgbGV0IGVuZFBvaW50ID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCAoaSAlIDIpID8gdGhpcy5nZXRJbm5lckNpcmNsZVJhZGl1cygpIC0gKCh0aGlzLmdldElubmVyQ2lyY2xlUmFkaXVzKCkgLSB0aGlzLmdldFJ1bGxlckNpcmNsZVJhZGl1cygpKSAvIDIpIDogdGhpcy5nZXRJbm5lckNpcmNsZVJhZGl1cygpLCBVdGlscy5kZWdyZWVUb1JhZGlhbihzdGFydEFuZ2xlKSlcbiAgICAgICAgICAgIGNvbnN0IGxpbmUgPSBTVkdVdGlscy5TVkdMaW5lKHN0YXJ0UG9pbnQueCwgc3RhcnRQb2ludC55LCBlbmRQb2ludC54LCBlbmRQb2ludC55KTtcbiAgICAgICAgICAgIGxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0xJTkVfQ09MT1IpO1xuICAgICAgICAgICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFKTtcbiAgICAgICAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQobGluZSk7XG5cbiAgICAgICAgICAgIHN0YXJ0QW5nbGUgKz0gU1RFUFxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY2lyY2xlID0gU1ZHVXRpbHMuU1ZHQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuZ2V0UnVsbGVyQ2lyY2xlUmFkaXVzKCkpO1xuICAgICAgICBjaXJjbGUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0NJUkNMRV9DT0xPUik7XG4gICAgICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFKTtcbiAgICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChjaXJjbGUpO1xuXG4gICAgICAgIHRoaXMuI3Jvb3QuYXBwZW5kQ2hpbGQod3JhcHBlcilcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIERyYXcgcG9pbnRzXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGRhdGEgLSBjaGFydCBkYXRhXG4gICAgICovXG4gICAgI2RyYXdQb2ludHMoZGF0YSkge1xuICAgICAgICBjb25zdCBwb2ludHMgPSBkYXRhLnBvaW50c1xuICAgICAgICBjb25zdCBjdXNwcyA9IGRhdGEuY3VzcHNcbiAgICAgICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcbiAgICAgICAgd3JhcHBlci5jbGFzc0xpc3QuYWRkKCdjLXJhZGl4LXBvaW50cycpXG5cbiAgICAgICAgY29uc3QgcG9zaXRpb25zID0gVXRpbHMuY2FsY3VsYXRlUG9zaXRpb25XaXRob3V0T3ZlcmxhcHBpbmcocG9pbnRzLCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9DT0xMSVNJT05fUkFESVVTLCB0aGlzLmdldFBvaW50Q2lyY2xlUmFkaXVzKCkpXG5cbiAgICAgICAgZm9yIChjb25zdCBwb2ludERhdGEgb2YgcG9pbnRzKSB7XG4gICAgICAgICAgICBjb25zdCBwb2ludEdyb3VwID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKTtcbiAgICAgICAgICAgIHBvaW50R3JvdXAuY2xhc3NMaXN0LmFkZCgnYy1yYWRpeC1wb2ludCcpXG4gICAgICAgICAgICBwb2ludEdyb3VwLmNsYXNzTGlzdC5hZGQoJ2MtcmFkaXgtcG9pbnQtLScgKyBwb2ludERhdGEubmFtZS50b0xvd2VyQ2FzZSgpKVxuXG4gICAgICAgICAgICBjb25zdCBwb2ludCA9IG5ldyBQb2ludChwb2ludERhdGEsIGN1c3BzLCB0aGlzLiNzZXR0aW5ncylcbiAgICAgICAgICAgIGNvbnN0IHBvaW50UG9zaXRpb24gPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclgsIHRoaXMuZ2V0UnVsbGVyQ2lyY2xlUmFkaXVzKCkgLSAoKHRoaXMuZ2V0SW5uZXJDaXJjbGVSYWRpdXMoKSAtIHRoaXMuZ2V0UnVsbGVyQ2lyY2xlUmFkaXVzKCkpIC8gNCksIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKHBvaW50LmdldEFuZ2xlKCksIHRoaXMuZ2V0QXNjZW5kYW50U2hpZnQoKSkpXG4gICAgICAgICAgICBjb25zdCBzeW1ib2xQb3NpdGlvbiA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWCwgdGhpcy5nZXRQb2ludENpcmNsZVJhZGl1cygpLCBVdGlscy5kZWdyZWVUb1JhZGlhbihwb3NpdGlvbnNbcG9pbnQuZ2V0TmFtZSgpXSwgdGhpcy5nZXRBc2NlbmRhbnRTaGlmdCgpKSlcblxuICAgICAgICAgICAgLy8gcnVsZXIgbWFya1xuICAgICAgICAgICAgY29uc3QgcnVsZXJMaW5lRW5kUG9zaXRpb24gPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclgsIHRoaXMuZ2V0UnVsbGVyQ2lyY2xlUmFkaXVzKCksIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKHBvaW50LmdldEFuZ2xlKCksIHRoaXMuZ2V0QXNjZW5kYW50U2hpZnQoKSkpXG5cbiAgICAgICAgICAgIGlmICh0aGlzLiNzZXR0aW5ncy5EUkFXX1JVTEVSX01BUkspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBydWxlckxpbmUgPSBTVkdVdGlscy5TVkdMaW5lKHBvaW50UG9zaXRpb24ueCwgcG9pbnRQb3NpdGlvbi55LCBydWxlckxpbmVFbmRQb3NpdGlvbi54LCBydWxlckxpbmVFbmRQb3NpdGlvbi55KVxuICAgICAgICAgICAgICAgIHJ1bGVyTGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTElORV9DT0xPUik7XG4gICAgICAgICAgICAgICAgcnVsZXJMaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0UpO1xuICAgICAgICAgICAgICAgIHBvaW50R3JvdXAuYXBwZW5kQ2hpbGQocnVsZXJMaW5lKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBMaW5lIGZyb20gdGhlIHJ1bGVyIHRvIHRoZSBjZWxlc3RpYWwgYm9keVxuICAgICAgICAgICAgICogQHR5cGUge3t4LCB5fX1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIC8vaWYgKHBvc2l0aW9uc1twb2ludC5nZXROYW1lKCldICE9IHBvaW50RGF0YS5wb3NpdGlvbikge1xuICAgICAgICAgICAgY29uc3QgcG9pbnRlckxpbmVFbmRQb3NpdGlvbiA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWCwgdGhpcy5nZXRQb2ludENpcmNsZVJhZGl1cygpLCBVdGlscy5kZWdyZWVUb1JhZGlhbihwb3NpdGlvbnNbcG9pbnQuZ2V0TmFtZSgpXSwgdGhpcy5nZXRBc2NlbmRhbnRTaGlmdCgpKSlcblxuICAgICAgICAgICAgbGV0IHBvaW50ZXJMaW5lO1xuICAgICAgICAgICAgaWYgKHRoaXMuI3NldHRpbmdzLkRSQVdfUlVMRVJfTUFSSykge1xuICAgICAgICAgICAgICAgIHBvaW50ZXJMaW5lID0gU1ZHVXRpbHMuU1ZHTGluZShwb2ludFBvc2l0aW9uLngsIHBvaW50UG9zaXRpb24ueSwgKHBvaW50UG9zaXRpb24ueCArIHBvaW50ZXJMaW5lRW5kUG9zaXRpb24ueCkgLyAyLCAocG9pbnRQb3NpdGlvbi55ICsgcG9pbnRlckxpbmVFbmRQb3NpdGlvbi55KSAvIDIpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHBvaW50ZXJMaW5lID0gU1ZHVXRpbHMuU1ZHTGluZShydWxlckxpbmVFbmRQb3NpdGlvbi54LCBydWxlckxpbmVFbmRQb3NpdGlvbi55LCAocG9pbnRQb3NpdGlvbi54ICsgcG9pbnRlckxpbmVFbmRQb3NpdGlvbi54KSAvIDIsIChwb2ludFBvc2l0aW9uLnkgKyBwb2ludGVyTGluZUVuZFBvc2l0aW9uLnkpIC8gMilcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLiNzZXR0aW5ncy5QTEFORVRfTElORV9VU0VfUExBTkVUX0NPTE9SKSB7XG4gICAgICAgICAgICAgICAgcG9pbnRlckxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLlBMQU5FVF9DT0xPUlNbcG9pbnREYXRhLm5hbWVdID8/IHRoaXMuI3NldHRpbmdzLkNIQVJUX0xJTkVfQ09MT1IpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwb2ludGVyTGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTElORV9DT0xPUik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHBvaW50ZXJMaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0UgLyAyKTtcblxuICAgICAgICAgICAgcG9pbnRHcm91cC5hcHBlbmRDaGlsZChwb2ludGVyTGluZSk7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogU3ltbm9sIG9mIHRoZSBjZWxlc3RpYWwgYm9keSArIHBvaW50c1xuICAgICAgICAgICAgICogQHR5cGUge1NWR0VsZW1lbnR9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGNvbnN0IHN5bWJvbCA9IHBvaW50LmdldFN5bWJvbChzeW1ib2xQb3NpdGlvbi54LCBzeW1ib2xQb3NpdGlvbi55LCBVdGlscy5ERUdfMCwgdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19TSE9XKVxuICAgICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImZvbnQtZmFtaWx5XCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0ZPTlRfRkFNSUxZKTtcbiAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKSAvLyBzdGFydCwgbWlkZGxlLCBlbmRcbiAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJkb21pbmFudC1iYXNlbGluZVwiLCBcIm1pZGRsZVwiKVxuICAgICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImZvbnQtc2l6ZVwiLCB0aGlzLiNzZXR0aW5ncy5SQURJWF9QT0lOVFNfRk9OVF9TSVpFKVxuICAgICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgdGhpcy4jc2V0dGluZ3MuUExBTkVUX0NPTE9SU1twb2ludERhdGEubmFtZV0gPz8gdGhpcy4jc2V0dGluZ3MuQ0hBUlRfUE9JTlRTX0NPTE9SKVxuICAgICAgICAgICAgcG9pbnRHcm91cC5hcHBlbmRDaGlsZChzeW1ib2wpO1xuXG4gICAgICAgICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHBvaW50R3JvdXApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy4jcm9vdC5hcHBlbmRDaGlsZCh3cmFwcGVyKVxuICAgIH1cblxuICAgIC8qXG4gICAgICogRHJhdyBwb2ludHNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YSAtIGNoYXJ0IGRhdGFcbiAgICAgKi9cbiAgICAjZHJhd0N1c3BzKGRhdGEpIHtcbiAgICAgICAgY29uc3QgcG9pbnRzID0gZGF0YS5wb2ludHNcbiAgICAgICAgY29uc3QgY3VzcHMgPSBkYXRhLmN1c3BzXG5cbiAgICAgICAgY29uc3QgbWFpbkF4aXNJbmRleGVzID0gWzAsIDMsIDYsIDldIC8vQXMsIEljLCBEcywgTWNcblxuICAgICAgICBjb25zdCBwb2ludHNQb3NpdGlvbnMgPSBwb2ludHMubWFwKHBvaW50ID0+IHtcbiAgICAgICAgICAgIHJldHVybiBwb2ludC5hbmdsZVxuICAgICAgICB9KVxuXG4gICAgICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG4gICAgICAgIHdyYXBwZXIuY2xhc3NMaXN0LmFkZCgnYy1yYWRpeC1jdXNwcycpXG5cbiAgICAgICAgY29uc3QgdGV4dFJhZGl1cyA9IHRoaXMuZ2V0Q2VudGVyQ2lyY2xlUmFkaXVzKCkgKyAoKHRoaXMuZ2V0SW5uZXJDaXJjbGVSYWRpdXMoKSAtIHRoaXMuZ2V0Q2VudGVyQ2lyY2xlUmFkaXVzKCkpIC8gMTApXG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdXNwcy5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgICAgICBjb25zdCBpc0xpbmVJbkNvbGxpc2lvbldpdGhQb2ludCA9ICEgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfQUxMT1dfSE9VU0VfT1ZFUkxBUCAmJiBVdGlscy5pc0NvbGxpc2lvbihjdXNwc1tpXS5hbmdsZSwgcG9pbnRzUG9zaXRpb25zLCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9DT0xMSVNJT05fUkFESVVTIC8gMilcblxuICAgICAgICAgICAgY29uc3Qgc3RhcnRQb3MgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuZ2V0Q2VudGVyQ2lyY2xlUmFkaXVzKCksIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKGN1c3BzW2ldLmFuZ2xlLCB0aGlzLmdldEFzY2VuZGFudFNoaWZ0KCkpKVxuICAgICAgICAgICAgY29uc3QgZW5kUG9zID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCBpc0xpbmVJbkNvbGxpc2lvbldpdGhQb2ludCA/IHRoaXMuZ2V0Q2VudGVyQ2lyY2xlUmFkaXVzKCkgKyAoKHRoaXMuZ2V0UnVsbGVyQ2lyY2xlUmFkaXVzKCkgLSB0aGlzLmdldENlbnRlckNpcmNsZVJhZGl1cygpKSAvIDYpIDogdGhpcy5nZXRSdWxsZXJDaXJjbGVSYWRpdXMoKSwgVXRpbHMuZGVncmVlVG9SYWRpYW4oY3VzcHNbaV0uYW5nbGUsIHRoaXMuZ2V0QXNjZW5kYW50U2hpZnQoKSkpXG5cbiAgICAgICAgICAgIGNvbnN0IGxpbmUgPSBTVkdVdGlscy5TVkdMaW5lKHN0YXJ0UG9zLngsIHN0YXJ0UG9zLnksIGVuZFBvcy54LCBlbmRQb3MueSlcbiAgICAgICAgICAgIGxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIG1haW5BeGlzSW5kZXhlcy5pbmNsdWRlcyhpKSA/IHRoaXMuI3NldHRpbmdzLkNIQVJUX01BSU5fQVhJU19DT0xPUiA6IHRoaXMuI3NldHRpbmdzLkNIQVJUX0xJTkVfQ09MT1IpXG4gICAgICAgICAgICBsaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCBtYWluQXhpc0luZGV4ZXMuaW5jbHVkZXMoaSkgPyB0aGlzLiNzZXR0aW5ncy5DSEFSVF9NQUlOX1NUUk9LRSA6IHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRSlcbiAgICAgICAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQobGluZSk7XG5cbiAgICAgICAgICAgIGNvbnN0IHN0YXJ0Q3VzcCA9IGN1c3BzW2ldLmFuZ2xlXG4gICAgICAgICAgICBjb25zdCBlbmRDdXNwID0gY3VzcHNbKGkgKyAxKSAlIDEyXS5hbmdsZVxuICAgICAgICAgICAgY29uc3QgZ2FwID0gZW5kQ3VzcCAtIHN0YXJ0Q3VzcCA+IDAgPyBlbmRDdXNwIC0gc3RhcnRDdXNwIDogZW5kQ3VzcCAtIHN0YXJ0Q3VzcCArIFV0aWxzLkRFR18zNjBcbiAgICAgICAgICAgIGNvbnN0IHRleHRBbmdsZSA9IHN0YXJ0Q3VzcCArIGdhcCAvIDJcblxuICAgICAgICAgICAgY29uc3QgdGV4dFBvcyA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGV4dFJhZGl1cywgVXRpbHMuZGVncmVlVG9SYWRpYW4odGV4dEFuZ2xlLCB0aGlzLmdldEFzY2VuZGFudFNoaWZ0KCkpKVxuICAgICAgICAgICAgY29uc3QgdGV4dCA9IFNWR1V0aWxzLlNWR1RleHQodGV4dFBvcy54LCB0ZXh0UG9zLnksIGAke2kgKyAxfWApXG4gICAgICAgICAgICB0ZXh0LnNldEF0dHJpYnV0ZShcImZvbnQtZmFtaWx5XCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0ZPTlRfRkFNSUxZKVxuICAgICAgICAgICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKSAvLyBzdGFydCwgbWlkZGxlLCBlbmRcbiAgICAgICAgICAgIHRleHQuc2V0QXR0cmlidXRlKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcbiAgICAgICAgICAgIHRleHQuc2V0QXR0cmlidXRlKFwiZm9udC1zaXplXCIsIHRoaXMuI3NldHRpbmdzLlJBRElYX0hPVVNFX0ZPTlRfU0laRSlcbiAgICAgICAgICAgIHRleHQuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9IT1VTRV9OVU1CRVJfQ09MT1IpXG4gICAgICAgICAgICB0ZXh0LmNsYXNzTGlzdC5hZGQoJ2MtcmFkaXgtY3VzcHNfX2hvdXNlLW51bWJlcicpXG5cbiAgICAgICAgICAgIGlmICh0aGlzLiNzZXR0aW5ncy5JTlNFUlRfRUxFTUVOVF9USVRMRSkge1xuICAgICAgICAgICAgICAgIHRleHQuYXBwZW5kQ2hpbGQoU1ZHVXRpbHMuU1ZHVGl0bGUodGhpcy4jc2V0dGluZ3MuRUxFTUVOVF9USVRMRVMuY3VzcHNbaSArIDFdKSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZCh0ZXh0KVxuXG4gICAgICAgICAgICBpZiAodGhpcy4jc2V0dGluZ3MuRFJBV19IT1VTRV9ERUdSRUUpIHtcbiAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh0aGlzLiNzZXR0aW5ncy5IT1VTRV9ERUdSRUVfRklMVEVSKSAmJiAhIHRoaXMuI3NldHRpbmdzLkhPVVNFX0RFR1JFRV9GSUxURVIuaW5jbHVkZXMoaSArIDEpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCBkZWdyZWVQb3MgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuZ2V0UnVsbGVyQ2lyY2xlUmFkaXVzKCkgLSAodGhpcy5nZXRJbm5lckNpcmNsZVJhZGl1cygpIC0gdGhpcy5nZXRSdWxsZXJDaXJjbGVSYWRpdXMoKSkgLyAxLjIsIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKHN0YXJ0Q3VzcCAtIDIuNCwgdGhpcy5nZXRBc2NlbmRhbnRTaGlmdCgpKSlcbiAgICAgICAgICAgICAgICBjb25zdCBkZWdyZWUgPSBTVkdVdGlscy5TVkdUZXh0KGRlZ3JlZVBvcy54LCBkZWdyZWVQb3MueSwgTWF0aC5mbG9vcihjdXNwc1tpXS5hbmdsZSAlIDMwKSArIFwiwrpcIilcbiAgICAgICAgICAgICAgICBkZWdyZWUuc2V0QXR0cmlidXRlKFwiZm9udC1mYW1pbHlcIiwgXCJBcmlhbFwiKVxuICAgICAgICAgICAgICAgIGRlZ3JlZS5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKSAvLyBzdGFydCwgbWlkZGxlLCBlbmRcbiAgICAgICAgICAgICAgICBkZWdyZWUuc2V0QXR0cmlidXRlKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcbiAgICAgICAgICAgICAgICBkZWdyZWUuc2V0QXR0cmlidXRlKFwiZm9udC1zaXplXCIsIHRoaXMuI3NldHRpbmdzLkhPVVNFX0RFR1JFRV9TSVpFIHx8IHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfQU5HTEVfU0laRSAvIDIpXG4gICAgICAgICAgICAgICAgZGVncmVlLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgdGhpcy4jc2V0dGluZ3MuSE9VU0VfREVHUkVFX0NPTE9SIHx8IHRoaXMuI3NldHRpbmdzLkNIQVJUX0hPVVNFX05VTUJFUl9DT0xPUilcbiAgICAgICAgICAgICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGRlZ3JlZSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy4jcm9vdC5hcHBlbmRDaGlsZCh3cmFwcGVyKVxuICAgIH1cblxuICAgIC8qXG4gICAgICogRHJhdyBtYWluIGF4aXMgZGVzY3JpdGlvblxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGF4aXNMaXN0XG4gICAgICovXG4gICAgI2RyYXdNYWluQXhpc0Rlc2NyaXB0aW9uKGRhdGEpIHtcbiAgICAgICAgY29uc3QgQVhJU19MRU5HVEggPSAxMFxuICAgICAgICBjb25zdCBjdXNwcyA9IGRhdGEuY3VzcHNcblxuICAgICAgICBjb25zdCBheGlzTGlzdCA9IFt7XG4gICAgICAgICAgICBuYW1lOiBTVkdVdGlscy5TWU1CT0xfQVMsXG4gICAgICAgICAgICBhbmdsZTogY3VzcHNbMF0uYW5nbGVcbiAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiBTVkdVdGlscy5TWU1CT0xfSUMsXG4gICAgICAgICAgICAgICAgYW5nbGU6IGN1c3BzWzNdLmFuZ2xlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hbWU6IFNWR1V0aWxzLlNZTUJPTF9EUyxcbiAgICAgICAgICAgICAgICBhbmdsZTogY3VzcHNbNl0uYW5nbGVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogU1ZHVXRpbHMuU1lNQk9MX01DLFxuICAgICAgICAgICAgICAgIGFuZ2xlOiBjdXNwc1s5XS5hbmdsZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgXVxuXG4gICAgICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG4gICAgICAgIHdyYXBwZXIuY2xhc3NMaXN0LmFkZCgnYy1yYWRpeC1heGlzJylcblxuICAgICAgICBjb25zdCByYWQxID0gdGhpcy4jbnVtYmVyT2ZMZXZlbHMgPT09IDI0ID8gdGhpcy5nZXRSYWRpdXMoKSA6IHRoaXMuZ2V0SW5uZXJDaXJjbGVSYWRpdXMoKTtcbiAgICAgICAgY29uc3QgcmFkMiA9IHRoaXMuI251bWJlck9mTGV2ZWxzID09PSAyNCA/IHRoaXMuZ2V0UmFkaXVzKCkgKyBBWElTX0xFTkdUSCA6IHRoaXMuZ2V0SW5uZXJDaXJjbGVSYWRpdXMoKSArIEFYSVNfTEVOR1RIIC8gMjtcblxuICAgICAgICBmb3IgKGNvbnN0IGF4aXMgb2YgYXhpc0xpc3QpIHtcbiAgICAgICAgICAgIGNvbnN0IGF4aXNHcm91cCA9IFNWR1V0aWxzLlNWR0dyb3VwKClcbiAgICAgICAgICAgIGF4aXNHcm91cC5jbGFzc0xpc3QuYWRkKCdjLXJhZGl4LWF4aXNfX2F4aXMnKVxuICAgICAgICAgICAgYXhpc0dyb3VwLmNsYXNzTGlzdC5hZGQoJ2MtcmFkaXgtYXhpc19fYXhpcy0tJyArIGF4aXMubmFtZS50b0xvd2VyQ2FzZSgpKVxuXG4gICAgICAgICAgICBsZXQgc3RhcnRQb2ludCA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgcmFkMSwgVXRpbHMuZGVncmVlVG9SYWRpYW4oYXhpcy5hbmdsZSwgdGhpcy5nZXRBc2NlbmRhbnRTaGlmdCgpKSlcbiAgICAgICAgICAgIGxldCBlbmRQb2ludCA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgcmFkMiwgVXRpbHMuZGVncmVlVG9SYWRpYW4oYXhpcy5hbmdsZSwgdGhpcy5nZXRBc2NlbmRhbnRTaGlmdCgpKSlcbiAgICAgICAgICAgIGxldCBsaW5lID0gU1ZHVXRpbHMuU1ZHTGluZShzdGFydFBvaW50LngsIHN0YXJ0UG9pbnQueSwgZW5kUG9pbnQueCwgZW5kUG9pbnQueSk7XG4gICAgICAgICAgICBsaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9NQUlOX0FYSVNfQ09MT1IpO1xuICAgICAgICAgICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTUFJTl9TVFJPS0UpO1xuICAgICAgICAgICAgYXhpc0dyb3VwLmFwcGVuZENoaWxkKGxpbmUpO1xuXG4gICAgICAgICAgICBsZXQgdGV4dFBvaW50ID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCByYWQyLCBVdGlscy5kZWdyZWVUb1JhZGlhbihheGlzLmFuZ2xlLCB0aGlzLmdldEFzY2VuZGFudFNoaWZ0KCkpKVxuICAgICAgICAgICAgbGV0IHN5bWJvbDtcbiAgICAgICAgICAgIGxldCBTSElGVF9YID0gMDtcbiAgICAgICAgICAgIGxldCBTSElGVF9ZID0gMDtcbiAgICAgICAgICAgIGNvbnN0IFNURVAgPSAyXG5cbiAgICAgICAgICAgIHN3aXRjaCAoYXhpcy5uYW1lKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBcIkFzXCI6XG4gICAgICAgICAgICAgICAgICAgIFNISUZUX1ggLT0gU1RFUFxuICAgICAgICAgICAgICAgICAgICBTSElGVF9ZIC09IFNURVBcbiAgICAgICAgICAgICAgICAgICAgU1ZHVXRpbHMuU1lNQk9MX0FTX0NPREUgPSB0aGlzLiNzZXR0aW5ncy5TWU1CT0xfQVNfQ09ERSA/PyBTVkdVdGlscy5TWU1CT0xfQVNfQ09ERTtcbiAgICAgICAgICAgICAgICAgICAgc3ltYm9sID0gU1ZHVXRpbHMuU1ZHU3ltYm9sKGF4aXMubmFtZSwgdGV4dFBvaW50LnggKyBTSElGVF9YLCB0ZXh0UG9pbnQueSArIFNISUZUX1kpXG4gICAgICAgICAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcImVuZFwiKVxuICAgICAgICAgICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcIkRzXCI6XG4gICAgICAgICAgICAgICAgICAgIFNISUZUX1ggKz0gU1RFUFxuICAgICAgICAgICAgICAgICAgICBTSElGVF9ZIC09IFNURVBcbiAgICAgICAgICAgICAgICAgICAgU1ZHVXRpbHMuU1lNQk9MX0RTX0NPREUgPSB0aGlzLiNzZXR0aW5ncy5TWU1CT0xfRFNfQ09ERSA/PyBTVkdVdGlscy5TWU1CT0xfRFNfQ09ERTtcbiAgICAgICAgICAgICAgICAgICAgc3ltYm9sID0gU1ZHVXRpbHMuU1ZHU3ltYm9sKGF4aXMubmFtZSwgdGV4dFBvaW50LnggKyBTSElGVF9YLCB0ZXh0UG9pbnQueSArIFNISUZUX1kpXG4gICAgICAgICAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcInN0YXJ0XCIpXG4gICAgICAgICAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJkb21pbmFudC1iYXNlbGluZVwiLCBcIm1pZGRsZVwiKVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFwiTWNcIjpcbiAgICAgICAgICAgICAgICAgICAgU0hJRlRfWSAtPSBTVEVQXG4gICAgICAgICAgICAgICAgICAgIFNWR1V0aWxzLlNZTUJPTF9NQ19DT0RFID0gdGhpcy4jc2V0dGluZ3MuU1lNQk9MX01DX0NPREUgPz8gU1ZHVXRpbHMuU1lNQk9MX01DX0NPREU7XG4gICAgICAgICAgICAgICAgICAgIHN5bWJvbCA9IFNWR1V0aWxzLlNWR1N5bWJvbChheGlzLm5hbWUsIHRleHRQb2ludC54ICsgU0hJRlRfWCwgdGV4dFBvaW50LnkgKyBTSElGVF9ZKVxuICAgICAgICAgICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcbiAgICAgICAgICAgICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImRvbWluYW50LWJhc2VsaW5lXCIsIFwidGV4dC10b3BcIilcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcIkljXCI6XG4gICAgICAgICAgICAgICAgICAgIFNISUZUX1kgKz0gU1RFUFxuICAgICAgICAgICAgICAgICAgICBTVkdVdGlscy5TWU1CT0xfSUNfQ09ERSA9IHRoaXMuI3NldHRpbmdzLlNZTUJPTF9JQ19DT0RFID8/IFNWR1V0aWxzLlNZTUJPTF9JQ19DT0RFO1xuICAgICAgICAgICAgICAgICAgICBzeW1ib2wgPSBTVkdVdGlscy5TVkdTeW1ib2woYXhpcy5uYW1lLCB0ZXh0UG9pbnQueCArIFNISUZUX1gsIHRleHRQb2ludC55ICsgU0hJRlRfWSlcbiAgICAgICAgICAgICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXG4gICAgICAgICAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJkb21pbmFudC1iYXNlbGluZVwiLCBcImhhbmdpbmdcIilcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihheGlzLm5hbWUpXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVua25vd24gYXhpcyBuYW1lLlwiKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImZvbnQtZmFtaWx5XCIsIHRoaXMuI3NldHRpbmdzLkFYSVNfRk9OVF9GQU1JTFkgPz8gdGhpcy4jc2V0dGluZ3MuQ0hBUlRfRk9OVF9GQU1JTFkpO1xuICAgICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImZvbnQtc2l6ZVwiLCB0aGlzLiNzZXR0aW5ncy5SQURJWF9BWElTX0ZPTlRfU0laRSk7XG4gICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZm9udC13ZWlnaHRcIiwgdGhpcy4jc2V0dGluZ3MuQVhJU19GT05UX1dFSUdIVCA/PyA0MDApO1xuICAgICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTUFJTl9BWElTX0NPTE9SKTtcbiAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoJ3BhaW50LW9yZGVyJywgJ3N0cm9rZScpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy4jc2V0dGluZ3MuQ0xBU1NfQVhJUykge1xuICAgICAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgdGhpcy4jc2V0dGluZ3MuQ0xBU1NfQVhJUyArICcgJyArIHRoaXMuI3NldHRpbmdzLkNMQVNTX0FYSVMgKyAnLS0nICsgYXhpcy5uYW1lLnRvTG93ZXJDYXNlKCkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy4jc2V0dGluZ3MuSU5TRVJUX0VMRU1FTlRfVElUTEUpIHtcbiAgICAgICAgICAgICAgICBzeW1ib2wuYXBwZW5kQ2hpbGQoU1ZHVXRpbHMuU1ZHVGl0bGUodGhpcy4jc2V0dGluZ3MuRUxFTUVOVF9USVRMRVMuYXhpc1theGlzLm5hbWVdKSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYXhpc0dyb3VwLmFwcGVuZENoaWxkKHN5bWJvbCk7XG4gICAgICAgICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGF4aXNHcm91cClcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuI3Jvb3QuYXBwZW5kQ2hpbGQod3JhcHBlcilcbiAgICB9XG5cbiAgICAjZHJhd0JvcmRlcnMoKSB7XG4gICAgICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG4gICAgICAgIHdyYXBwZXIuY2xhc3NMaXN0LmFkZCgnYy1yYWRpeC1ib3JkZXJzJylcblxuICAgICAgICBjb25zdCBvdXRlckNpcmNsZSA9IFNWR1V0aWxzLlNWR0NpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLmdldE91dGVyQ2lyY2xlUmFkaXVzKCkpXG4gICAgICAgIG91dGVyQ2lyY2xlLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9DSVJDTEVfQ09MT1IpO1xuICAgICAgICBvdXRlckNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTUFJTl9TVFJPS0UpO1xuICAgICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKG91dGVyQ2lyY2xlKVxuXG4gICAgICAgIGNvbnN0IGlubmVyQ2lyY2xlID0gU1ZHVXRpbHMuU1ZHQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuZ2V0SW5uZXJDaXJjbGVSYWRpdXMoKSlcbiAgICAgICAgaW5uZXJDaXJjbGUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0NJUkNMRV9DT0xPUik7XG4gICAgICAgIGlubmVyQ2lyY2xlLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9NQUlOX1NUUk9LRSk7XG4gICAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoaW5uZXJDaXJjbGUpXG5cbiAgICAgICAgY29uc3QgY2VudGVyQ2lyY2xlID0gU1ZHVXRpbHMuU1ZHQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuZ2V0Q2VudGVyQ2lyY2xlUmFkaXVzKCkpXG4gICAgICAgIGNlbnRlckNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfQ0lSQ0xFX0NPTE9SKTtcbiAgICAgICAgY2VudGVyQ2lyY2xlLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9NQUlOX1NUUk9LRSk7XG4gICAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoY2VudGVyQ2lyY2xlKVxuXG4gICAgICAgIHRoaXMuI3Jvb3QuYXBwZW5kQ2hpbGQod3JhcHBlcilcbiAgICB9XG5cbiAgICBhbmltYXRlVG8oZGF0YSkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGdldFBvaW50KG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBnZXRQb2ludHMoKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxufVxuXG5leHBvcnQge1xuICAgIFJhZGl4Q2hhcnQgYXNcbiAgICAgICAgZGVmYXVsdFxufVxuIiwiaW1wb3J0IFJhZGl4Q2hhcnQgZnJvbSAnLi4vY2hhcnRzL1JhZGl4Q2hhcnQuanMnO1xuaW1wb3J0IFNWR1V0aWxzIGZyb20gJy4uL3V0aWxzL1NWR1V0aWxzLmpzJztcbmltcG9ydCBDaGFydCBmcm9tICcuL0NoYXJ0LmpzJ1xuaW1wb3J0IFV0aWxzIGZyb20gJy4uL3V0aWxzL1V0aWxzLmpzJztcbmltcG9ydCBBc3BlY3RVdGlscyBmcm9tICcuLi91dGlscy9Bc3BlY3RVdGlscy5qcyc7XG5pbXBvcnQgUG9pbnQgZnJvbSAnLi4vcG9pbnRzL1BvaW50LmpzJ1xuaW1wb3J0IERlZmF1bHRTZXR0aW5ncyBmcm9tICcuLi9zZXR0aW5ncy9EZWZhdWx0U2V0dGluZ3MuanMnO1xuXG4vKipcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyBQb2ludHMgYW5kIGN1cHMgYXJlIGRpc3BsYXllZCBmcm9tIG91dHNpZGUgdGhlIFVuaXZlcnNlLlxuICogQHB1YmxpY1xuICogQGV4dGVuZHMge0NoYXJ0fVxuICovXG5jbGFzcyBUcmFuc2l0Q2hhcnQgZXh0ZW5kcyBDaGFydCB7XG5cbiAgLypcbiAgICogTGV2ZWxzIGRldGVybWluZSB0aGUgd2lkdGggb2YgaW5kaXZpZHVhbCBwYXJ0cyBvZiB0aGUgY2hhcnQuXG4gICAqIEl0IGNhbiBiZSBjaGFuZ2VkIGR5bmFtaWNhbGx5IGJ5IHB1YmxpYyBzZXR0ZXIuXG4gICAqL1xuICAjbnVtYmVyT2ZMZXZlbHMgPSAzMlxuXG4gICNyYWRpeFxuICAjc2V0dGluZ3NcbiAgI3Jvb3RcbiAgI2RhdGFcblxuICAjY2VudGVyWFxuICAjY2VudGVyWVxuICAjcmFkaXVzXG5cbiAgLypcbiAgICogQHNlZSBVdGlscy5jbGVhblVwKClcbiAgICovXG4gICNiZWZvcmVDbGVhblVwSG9va1xuXG4gIC8qKlxuICAgKiBAY29uc3RydWN0c1xuICAgKiBAcGFyYW0ge1JhZGl4Q2hhcnR9IHJhZGl4XG4gICAqL1xuICBjb25zdHJ1Y3RvcihyYWRpeCkge1xuICAgIGlmICghKHJhZGl4IGluc3RhbmNlb2YgUmFkaXhDaGFydCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQmFkIHBhcmFtIHJhZGl4LicpXG4gICAgfVxuXG4gICAgc3VwZXIocmFkaXguZ2V0VW5pdmVyc2UoKS5nZXRTZXR0aW5ncygpKVxuXG4gICAgdGhpcy4jcmFkaXggPSByYWRpeFxuICAgIHRoaXMuI3NldHRpbmdzID0gdGhpcy4jcmFkaXguZ2V0VW5pdmVyc2UoKS5nZXRTZXR0aW5ncygpXG4gICAgdGhpcy4jY2VudGVyWCA9IHRoaXMuI3NldHRpbmdzLkNIQVJUX1ZJRVdCT1hfV0lEVEggLyAyXG4gICAgdGhpcy4jY2VudGVyWSA9IHRoaXMuI3NldHRpbmdzLkNIQVJUX1ZJRVdCT1hfSEVJR0hUIC8gMlxuICAgIHRoaXMuI3JhZGl1cyA9IE1hdGgubWluKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclkpIC0gdGhpcy4jc2V0dGluZ3MuQ0hBUlRfUEFERElOR1xuXG4gICAgdGhpcy4jcm9vdCA9IFNWR1V0aWxzLlNWR0dyb3VwKClcbiAgICB0aGlzLiNyb290LnNldEF0dHJpYnV0ZShcImlkXCIsIGAke3RoaXMuI3NldHRpbmdzLkhUTUxfRUxFTUVOVF9JRH0tJHt0aGlzLiNzZXR0aW5ncy5UUkFOU0lUX0lEfWApXG4gICAgdGhpcy4jcmFkaXguZ2V0VW5pdmVyc2UoKS5nZXRTVkdEb2N1bWVudCgpLmFwcGVuZENoaWxkKHRoaXMuI3Jvb3QpO1xuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgY2hhcnQgZGF0YVxuICAgKiBAdGhyb3dzIHtFcnJvcn0gLSBpZiB0aGUgZGF0YSBpcyBub3QgdmFsaWQuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gICAqIEByZXR1cm4ge1JhZGl4Q2hhcnR9XG4gICAqL1xuICBzZXREYXRhKGRhdGEpIHtcbiAgICBsZXQgc3RhdHVzID0gdGhpcy52YWxpZGF0ZURhdGEoZGF0YSlcbiAgICBpZiAoIXN0YXR1cy5pc1ZhbGlkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3Ioc3RhdHVzLm1lc3NhZ2UpXG4gICAgfVxuXG4gICAgdGhpcy4jZGF0YSA9IGRhdGFcbiAgICB0aGlzLiNkcmF3KGRhdGEpXG5cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBkYXRhXG4gICAqIEByZXR1cm4ge09iamVjdH1cbiAgICovXG4gIGdldERhdGEoKXtcbiAgICByZXR1cm4ge1xuICAgICAgXCJwb2ludHNcIjpbLi4udGhpcy4jZGF0YS5wb2ludHNdLFxuICAgICAgXCJjdXNwc1wiOlsuLi50aGlzLiNkYXRhLmN1c3BzXVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgcmFkaXVzXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0UmFkaXVzKCkge1xuICAgIHJldHVybiB0aGlzLiNyYWRpdXNcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYXNwZWN0c1xuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IFtmcm9tUG9pbnRzXSAtIFt7bmFtZTpcIk1vb25cIiwgYW5nbGU6MH0sIHtuYW1lOlwiU3VuXCIsIGFuZ2xlOjE3OX0sIHtuYW1lOlwiTWVyY3VyeVwiLCBhbmdsZToxMjF9XVxuICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IFt0b1BvaW50c10gLSBbe25hbWU6XCJBU1wiLCBhbmdsZTowfSwge25hbWU6XCJJQ1wiLCBhbmdsZTo5MH1dXG4gICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gW2FzcGVjdHNdIC0gW3tuYW1lOlwiT3Bwb3NpdGlvblwiLCBhbmdsZToxODAsIG9yYjoyfSwge25hbWU6XCJUcmluZVwiLCBhbmdsZToxMjAsIG9yYjoyfV1cbiAgICpcbiAgICogQHJldHVybiB7QXJyYXk8T2JqZWN0Pn1cbiAgICovXG4gIGdldEFzcGVjdHMoZnJvbVBvaW50cywgdG9Qb2ludHMsIGFzcGVjdHMpe1xuICAgIGlmKCF0aGlzLiNkYXRhKXtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGZyb21Qb2ludHMgPSBmcm9tUG9pbnRzID8/IFsuLi50aGlzLiNkYXRhLnBvaW50cy5maWx0ZXIoeCA9PiBcImFzcGVjdFwiIGluIHggPyB4LmFzcGVjdCA6IHRydWUpLCAuLi50aGlzLiNkYXRhLmN1c3BzLmZpbHRlcih4ID0+IHguYXNwZWN0KV1cbiAgICB0b1BvaW50cyA9IHRvUG9pbnRzID8/IFsuLi50aGlzLiNyYWRpeC5nZXREYXRhKCkucG9pbnRzLmZpbHRlcih4ID0+IFwiYXNwZWN0XCIgaW4geCA/IHguYXNwZWN0IDogdHJ1ZSksIC4uLnRoaXMuI3JhZGl4LmdldERhdGEoKS5jdXNwcy5maWx0ZXIoeCA9PiB4LmFzcGVjdCldXG4gICAgYXNwZWN0cyA9IGFzcGVjdHMgPz8gdGhpcy4jc2V0dGluZ3MuREVGQVVMVF9BU1BFQ1RTID8/IERlZmF1bHRTZXR0aW5ncy5ERUZBVUxUX0FTUEVDVFNcblxuICAgIHJldHVybiBBc3BlY3RVdGlscy5nZXRBc3BlY3RzKGZyb21Qb2ludHMsIHRvUG9pbnRzLCBhc3BlY3RzKVxuICB9XG5cbiAgLyoqXG4gICAqIERyYXcgYXNwZWN0c1xuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IFtmcm9tUG9pbnRzXSAtIFt7bmFtZTpcIk1vb25cIiwgYW5nbGU6MH0sIHtuYW1lOlwiU3VuXCIsIGFuZ2xlOjE3OX0sIHtuYW1lOlwiTWVyY3VyeVwiLCBhbmdsZToxMjF9XVxuICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IFt0b1BvaW50c10gLSBbe25hbWU6XCJBU1wiLCBhbmdsZTowfSwge25hbWU6XCJJQ1wiLCBhbmdsZTo5MH1dXG4gICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gW2FzcGVjdHNdIC0gW3tuYW1lOlwiT3Bwb3NpdGlvblwiLCBhbmdsZToxODAsIG9yYjoyfSwge25hbWU6XCJUcmluZVwiLCBhbmdsZToxMjAsIG9yYjoyfV1cbiAgICpcbiAgICogQHJldHVybiB7QXJyYXk8T2JqZWN0Pn1cbiAgICovXG4gIGRyYXdBc3BlY3RzKCBmcm9tUG9pbnRzLCB0b1BvaW50cywgYXNwZWN0cyApe1xuICAgIGNvbnN0IGFzcGVjdHNXcmFwcGVyID0gdGhpcy4jcmFkaXguZ2V0VW5pdmVyc2UoKS5nZXRBc3BlY3RzRWxlbWVudCgpXG4gICAgVXRpbHMuY2xlYW5VcChhc3BlY3RzV3JhcHBlci5nZXRBdHRyaWJ1dGUoXCJpZFwiKSwgdGhpcy4jYmVmb3JlQ2xlYW5VcEhvb2spXG5cbiAgICBjb25zdCBhc3BlY3RzTGlzdCA9IHRoaXMuZ2V0QXNwZWN0cyhmcm9tUG9pbnRzLCB0b1BvaW50cywgYXNwZWN0cylcbiAgICAgIC5maWx0ZXIoIGFzcGVjdCA9PiAgYXNwZWN0LmFzcGVjdC5uYW1lICE9PSAnQ29uanVuY3Rpb24nKVxuXG4gICAgY29uc3QgY2lyY2xlID0gU1ZHVXRpbHMuU1ZHQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuI3JhZGl4LmdldENlbnRlckNpcmNsZVJhZGl1cygpKVxuICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoJ2ZpbGwnLCB0aGlzLiNzZXR0aW5ncy5BU1BFQ1RTX0JBQ0tHUk9VTkRfQ09MT1IpXG4gICAgYXNwZWN0c1dyYXBwZXIuYXBwZW5kQ2hpbGQoY2lyY2xlKVxuICAgIFxuICAgIGFzcGVjdHNXcmFwcGVyLmFwcGVuZENoaWxkKCBBc3BlY3RVdGlscy5kcmF3QXNwZWN0cyh0aGlzLiNyYWRpeC5nZXRDZW50ZXJDaXJjbGVSYWRpdXMoKSwgdGhpcy4jcmFkaXguZ2V0QXNjZW5kYW50U2hpZnQoKSwgdGhpcy4jc2V0dGluZ3MsIGFzcGVjdHNMaXN0KSlcblxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICAvLyAjIyBQUklWQVRFICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gIC8qXG4gICAqIERyYXcgcmFkaXggY2hhcnRcbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGFcbiAgICovXG4gICNkcmF3KGRhdGEpIHtcblxuICAgIC8vIHJhZGl4IHJlRHJhd1xuICAgIFV0aWxzLmNsZWFuVXAodGhpcy4jcm9vdC5nZXRBdHRyaWJ1dGUoJ2lkJyksIHRoaXMuI2JlZm9yZUNsZWFuVXBIb29rKVxuICAgIHRoaXMuI3JhZGl4LnNldE51bWJlck9mTGV2ZWxzKHRoaXMuI251bWJlck9mTGV2ZWxzKVxuXG4gICAgdGhpcy4jZHJhd1J1bGVyKClcbiAgICB0aGlzLiNkcmF3Q3VzcHMoZGF0YSlcbiAgICB0aGlzLiNzZXR0aW5ncy5DSEFSVF9EUkFXX01BSU5fQVhJUyAmJiB0aGlzLiNkcmF3TWFpbkF4aXNEZXNjcmlwdGlvbihkYXRhKVxuICAgIHRoaXMuI2RyYXdQb2ludHMoZGF0YSlcbiAgICB0aGlzLiNkcmF3Qm9yZGVycygpXG4gICAgdGhpcy4jc2V0dGluZ3MuRFJBV19BU1BFQ1RTICYmIHRoaXMuZHJhd0FzcGVjdHMoKVxuICB9XG5cbiAgI2RyYXdSdWxlcigpIHtcbiAgICBjb25zdCBOVU1CRVJfT0ZfRElWSURFUlMgPSA3MlxuICAgIGNvbnN0IFNURVAgPSA1XG5cbiAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuXG4gICAgbGV0IHN0YXJ0QW5nbGUgPSB0aGlzLiNyYWRpeC5nZXRBc2NlbmRhbnRTaGlmdCgpXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBOVU1CRVJfT0ZfRElWSURFUlM7IGkrKykge1xuICAgICAgbGV0IHN0YXJ0UG9pbnQgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuI2dldFJ1bGxlckNpcmNsZVJhZGl1cygpLCBVdGlscy5kZWdyZWVUb1JhZGlhbihzdGFydEFuZ2xlKSlcbiAgICAgIGxldCBlbmRQb2ludCA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgKGkgJSAyKSA/IHRoaXMuZ2V0UmFkaXVzKCkgLSAoKHRoaXMuZ2V0UmFkaXVzKCkgLSB0aGlzLiNnZXRSdWxsZXJDaXJjbGVSYWRpdXMoKSkgLyAyKSA6IHRoaXMuZ2V0UmFkaXVzKCksIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKHN0YXJ0QW5nbGUpKVxuICAgICAgY29uc3QgbGluZSA9IFNWR1V0aWxzLlNWR0xpbmUoc3RhcnRQb2ludC54LCBzdGFydFBvaW50LnksIGVuZFBvaW50LngsIGVuZFBvaW50LnkpO1xuICAgICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTElORV9DT0xPUik7XG4gICAgICBsaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0UpO1xuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChsaW5lKTtcblxuICAgICAgc3RhcnRBbmdsZSArPSBTVEVQXG4gICAgfVxuXG4gICAgY29uc3QgY2lyY2xlID0gU1ZHVXRpbHMuU1ZHQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuI2dldFJ1bGxlckNpcmNsZVJhZGl1cygpKTtcbiAgICBjaXJjbGUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0NJUkNMRV9DT0xPUik7XG4gICAgY2lyY2xlLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0UpO1xuICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoY2lyY2xlKTtcblxuICAgIHRoaXMuI3Jvb3QuYXBwZW5kQ2hpbGQod3JhcHBlcilcbiAgfVxuXG4gIC8qXG4gICAqIERyYXcgcG9pbnRzXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIC0gY2hhcnQgZGF0YVxuICAgKi9cbiAgI2RyYXdQb2ludHMoZGF0YSkge1xuICAgIGNvbnN0IHBvaW50cyA9IGRhdGEucG9pbnRzXG4gICAgY29uc3QgY3VzcHMgPSBkYXRhLmN1c3BzXG5cbiAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuXG4gICAgY29uc3QgcG9zaXRpb25zID0gVXRpbHMuY2FsY3VsYXRlUG9zaXRpb25XaXRob3V0T3ZlcmxhcHBpbmcocG9pbnRzLCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9DT0xMSVNJT05fUkFESVVTLCB0aGlzLiNnZXRQb2ludENpcmNsZVJhZGl1cygpKVxuICAgIGZvciAoY29uc3QgcG9pbnREYXRhIG9mIHBvaW50cykge1xuICAgICAgY29uc3QgcG9pbnQgPSBuZXcgUG9pbnQocG9pbnREYXRhLCBjdXNwcywgdGhpcy4jc2V0dGluZ3MpXG4gICAgICBjb25zdCBwb2ludFBvc2l0aW9uID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJYLCB0aGlzLiNnZXRSdWxsZXJDaXJjbGVSYWRpdXMoKSAtICgodGhpcy5nZXRSYWRpdXMoKSAtIHRoaXMuI2dldFJ1bGxlckNpcmNsZVJhZGl1cygpKSAvIDQpLCBVdGlscy5kZWdyZWVUb1JhZGlhbihwb2ludC5nZXRBbmdsZSgpLCB0aGlzLiNyYWRpeC5nZXRBc2NlbmRhbnRTaGlmdCgpKSlcbiAgICAgIGNvbnN0IHN5bWJvbFBvc2l0aW9uID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJYLCB0aGlzLiNnZXRQb2ludENpcmNsZVJhZGl1cygpLCBVdGlscy5kZWdyZWVUb1JhZGlhbihwb3NpdGlvbnNbcG9pbnQuZ2V0TmFtZSgpXSwgdGhpcy4jcmFkaXguZ2V0QXNjZW5kYW50U2hpZnQoKSkpXG5cbiAgICAgIC8vIHJ1bGVyIG1hcmtcbiAgICAgIGNvbnN0IHJ1bGVyTGluZUVuZFBvc2l0aW9uID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJYLCB0aGlzLiNnZXRSdWxsZXJDaXJjbGVSYWRpdXMoKSwgVXRpbHMuZGVncmVlVG9SYWRpYW4ocG9pbnQuZ2V0QW5nbGUoKSwgdGhpcy4jcmFkaXguZ2V0QXNjZW5kYW50U2hpZnQoKSkpXG4gICAgICBjb25zdCBydWxlckxpbmUgPSBTVkdVdGlscy5TVkdMaW5lKHBvaW50UG9zaXRpb24ueCwgcG9pbnRQb3NpdGlvbi55LCBydWxlckxpbmVFbmRQb3NpdGlvbi54LCBydWxlckxpbmVFbmRQb3NpdGlvbi55KVxuICAgICAgcnVsZXJMaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9MSU5FX0NPTE9SKTtcbiAgICAgIHJ1bGVyTGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFKTtcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQocnVsZXJMaW5lKTtcblxuICAgICAgLy8gc3ltYm9sXG4gICAgICBjb25zdCBzeW1ib2wgPSBwb2ludC5nZXRTeW1ib2woc3ltYm9sUG9zaXRpb24ueCwgc3ltYm9sUG9zaXRpb24ueSwgVXRpbHMuREVHXzAsIHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfU0hPVylcbiAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJmb250LWZhbWlseVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9GT05UX0ZBTUlMWSk7XG4gICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIikgLy8gc3RhcnQsIG1pZGRsZSwgZW5kXG4gICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcbiAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJmb250LXNpemVcIiwgdGhpcy4jc2V0dGluZ3MuVFJBTlNJVF9QT0lOVFNfRk9OVF9TSVpFKVxuICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgdGhpcy4jc2V0dGluZ3MuVFJBTlNJVF9QTEFORVRfQ09MT1JTW3BvaW50RGF0YS5uYW1lXSA/PyB0aGlzLiNzZXR0aW5ncy5QTEFORVRfQ09MT1JTW3BvaW50RGF0YS5uYW1lXSA/PyB0aGlzLiNzZXR0aW5ncy5DSEFSVF9QT0lOVFNfQ09MT1IpXG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHN5bWJvbCk7XG5cbiAgICAgIC8vIHBvaW50ZXJcbiAgICAgIC8vaWYgKHBvc2l0aW9uc1twb2ludC5nZXROYW1lKCldICE9IHBvaW50RGF0YS5wb3NpdGlvbikge1xuICAgICAgY29uc3QgcG9pbnRlckxpbmVFbmRQb3NpdGlvbiA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWCwgdGhpcy4jZ2V0UG9pbnRDaXJjbGVSYWRpdXMoKSwgVXRpbHMuZGVncmVlVG9SYWRpYW4ocG9zaXRpb25zW3BvaW50LmdldE5hbWUoKV0sIHRoaXMuI3JhZGl4LmdldEFzY2VuZGFudFNoaWZ0KCkpKVxuICAgICAgY29uc3QgcG9pbnRlckxpbmUgPSBTVkdVdGlscy5TVkdMaW5lKHBvaW50UG9zaXRpb24ueCwgcG9pbnRQb3NpdGlvbi55LCAocG9pbnRQb3NpdGlvbi54ICsgcG9pbnRlckxpbmVFbmRQb3NpdGlvbi54KSAvIDIsIChwb2ludFBvc2l0aW9uLnkgKyBwb2ludGVyTGluZUVuZFBvc2l0aW9uLnkpIC8gMilcbiAgICAgIHBvaW50ZXJMaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9MSU5FX0NPTE9SKTtcbiAgICAgIHBvaW50ZXJMaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0UgLyAyKTtcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQocG9pbnRlckxpbmUpO1xuICAgIH1cblxuICAgIHRoaXMuI3Jvb3QuYXBwZW5kQ2hpbGQod3JhcHBlcilcbiAgfVxuXG4gIC8qXG4gICAqIERyYXcgcG9pbnRzXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIC0gY2hhcnQgZGF0YVxuICAgKi9cbiAgI2RyYXdDdXNwcyhkYXRhKSB7XG4gICAgY29uc3QgcG9pbnRzID0gZGF0YS5wb2ludHNcbiAgICBjb25zdCBjdXNwcyA9IGRhdGEuY3VzcHNcblxuICAgIGNvbnN0IHBvaW50c1Bvc2l0aW9ucyA9IHBvaW50cy5tYXAocG9pbnQgPT4ge1xuICAgICAgcmV0dXJuIHBvaW50LmFuZ2xlXG4gICAgfSlcblxuICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG5cbiAgICBjb25zdCB0ZXh0UmFkaXVzID0gdGhpcy4jZ2V0Q2VudGVyQ2lyY2xlUmFkaXVzKCkgKyAoKHRoaXMuI2dldFJ1bGxlckNpcmNsZVJhZGl1cygpIC0gdGhpcy4jZ2V0Q2VudGVyQ2lyY2xlUmFkaXVzKCkpIC8gNilcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY3VzcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGlzTGluZUluQ29sbGlzaW9uV2l0aFBvaW50ID0gIXRoaXMuI3NldHRpbmdzLkNIQVJUX0FMTE9XX0hPVVNFX09WRVJMQVAgJiYgVXRpbHMuaXNDb2xsaXNpb24oY3VzcHNbaV0uYW5nbGUsIHBvaW50c1Bvc2l0aW9ucywgdGhpcy4jc2V0dGluZ3MuUE9JTlRfQ09MTElTSU9OX1JBRElVUyAvIDIpXG5cbiAgICAgIGNvbnN0IHN0YXJ0UG9zID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLiNnZXRDZW50ZXJDaXJjbGVSYWRpdXMoKSwgVXRpbHMuZGVncmVlVG9SYWRpYW4oY3VzcHNbaV0uYW5nbGUsIHRoaXMuI3JhZGl4LmdldEFzY2VuZGFudFNoaWZ0KCkpKVxuICAgICAgY29uc3QgZW5kUG9zID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCBpc0xpbmVJbkNvbGxpc2lvbldpdGhQb2ludCA/IHRoaXMuI2dldENlbnRlckNpcmNsZVJhZGl1cygpICsgKCh0aGlzLiNnZXRSdWxsZXJDaXJjbGVSYWRpdXMoKSAtIHRoaXMuI2dldENlbnRlckNpcmNsZVJhZGl1cygpKSAvIDYpIDogdGhpcy4jZ2V0UnVsbGVyQ2lyY2xlUmFkaXVzKCksIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKGN1c3BzW2ldLmFuZ2xlLCB0aGlzLiNyYWRpeC5nZXRBc2NlbmRhbnRTaGlmdCgpKSlcblxuICAgICAgY29uc3QgbGluZSA9IFNWR1V0aWxzLlNWR0xpbmUoc3RhcnRQb3MueCwgc3RhcnRQb3MueSwgZW5kUG9zLngsIGVuZFBvcy55KVxuICAgICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTElORV9DT0xPUilcbiAgICAgIGxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRSlcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQobGluZSk7XG5cbiAgICAgIGNvbnN0IHN0YXJ0Q3VzcCA9IGN1c3BzW2ldLmFuZ2xlXG4gICAgICBjb25zdCBlbmRDdXNwID0gY3VzcHNbKGkgKyAxKSAlIDEyXS5hbmdsZVxuICAgICAgY29uc3QgZ2FwID0gZW5kQ3VzcCAtIHN0YXJ0Q3VzcCA+IDAgPyBlbmRDdXNwIC0gc3RhcnRDdXNwIDogZW5kQ3VzcCAtIHN0YXJ0Q3VzcCArIFV0aWxzLkRFR18zNjBcbiAgICAgIGNvbnN0IHRleHRBbmdsZSA9IHN0YXJ0Q3VzcCArIGdhcCAvIDJcblxuICAgICAgY29uc3QgdGV4dFBvcyA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGV4dFJhZGl1cywgVXRpbHMuZGVncmVlVG9SYWRpYW4odGV4dEFuZ2xlLCB0aGlzLiNyYWRpeC5nZXRBc2NlbmRhbnRTaGlmdCgpKSlcbiAgICAgIGNvbnN0IHRleHQgPSBTVkdVdGlscy5TVkdUZXh0KHRleHRQb3MueCwgdGV4dFBvcy55LCBgJHtpKzF9YClcbiAgICAgIHRleHQuc2V0QXR0cmlidXRlKFwiZm9udC1mYW1pbHlcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfRk9OVF9GQU1JTFkpXG4gICAgICB0ZXh0LnNldEF0dHJpYnV0ZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpIC8vIHN0YXJ0LCBtaWRkbGUsIGVuZFxuICAgICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJkb21pbmFudC1iYXNlbGluZVwiLCBcIm1pZGRsZVwiKVxuICAgICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJmb250LXNpemVcIiwgdGhpcy4jc2V0dGluZ3MuUkFESVhfSE9VU0VfRk9OVF9TSVpFKVxuICAgICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIHRoaXMuI3NldHRpbmdzLlRSQU5TSVRfSE9VU0VfTlVNQkVSX0NPTE9SIHx8IHRoaXMuI3NldHRpbmdzLkNIQVJUX0hPVVNFX05VTUJFUl9DT0xPUilcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQodGV4dClcblxuICAgICAgaWYodGhpcy4jc2V0dGluZ3MuRFJBV19IT1VTRV9ERUdSRUUpIHtcbiAgICAgICAgaWYoQXJyYXkuaXNBcnJheSh0aGlzLiNzZXR0aW5ncy5IT1VTRV9ERUdSRUVfRklMVEVSKSAmJiAhdGhpcy4jc2V0dGluZ3MuSE9VU0VfREVHUkVFX0ZJTFRFUi5pbmNsdWRlcyhpKzEpKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZGVncmVlUG9zID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLiNnZXRSdWxsZXJDaXJjbGVSYWRpdXMoKSAtICh0aGlzLmdldFJhZGl1cygpIC0gdGhpcy4jZ2V0UnVsbGVyQ2lyY2xlUmFkaXVzKCkpLCBVdGlscy5kZWdyZWVUb1JhZGlhbihzdGFydEN1c3AgLSAxLjc1LCB0aGlzLiNyYWRpeC5nZXRBc2NlbmRhbnRTaGlmdCgpKSlcbiAgICAgICAgY29uc3QgZGVncmVlID0gU1ZHVXRpbHMuU1ZHVGV4dChkZWdyZWVQb3MueCwgZGVncmVlUG9zLnksIE1hdGguZmxvb3IoY3VzcHNbaV0uYW5nbGUgJSAzMCkgKyBcIsK6XCIpXG4gICAgICAgIGRlZ3JlZS5zZXRBdHRyaWJ1dGUoXCJmb250LWZhbWlseVwiLCBcIkFyaWFsXCIpXG4gICAgICAgIGRlZ3JlZS5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKSAvLyBzdGFydCwgbWlkZGxlLCBlbmRcbiAgICAgICAgZGVncmVlLnNldEF0dHJpYnV0ZShcImRvbWluYW50LWJhc2VsaW5lXCIsIFwibWlkZGxlXCIpXG4gICAgICAgIGRlZ3JlZS5zZXRBdHRyaWJ1dGUoXCJmb250LXNpemVcIiwgdGhpcy4jc2V0dGluZ3MuSE9VU0VfREVHUkVFX1NJWkUgfHwgdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19BTkdMRV9TSVpFIC8gMilcbiAgICAgICAgZGVncmVlLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgdGhpcy4jc2V0dGluZ3MuSE9VU0VfREVHUkVFX0NPTE9SIHx8IHRoaXMuI3NldHRpbmdzLlRSQU5TSVRfSE9VU0VfTlVNQkVSX0NPTE9SIHx8IHRoaXMuI3NldHRpbmdzLkNIQVJUX0hPVVNFX05VTUJFUl9DT0xPUilcbiAgICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChkZWdyZWUpXG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy4jcm9vdC5hcHBlbmRDaGlsZCh3cmFwcGVyKVxuICB9XG5cbiAgLypcbiAgICogRHJhdyBtYWluIGF4aXMgZGVzY3JpdGlvblxuICAgKiBAcGFyYW0ge0FycmF5fSBheGlzTGlzdFxuICAgKi9cbiAgI2RyYXdNYWluQXhpc0Rlc2NyaXB0aW9uKGRhdGEpIHtcbiAgICBjb25zdCBBWElTX0xFTkdUSCA9IDEwXG4gICAgY29uc3QgY3VzcHMgPSBkYXRhLmN1c3BzXG5cbiAgICBjb25zdCBheGlzTGlzdCA9IFt7XG4gICAgICAgIG5hbWU6IFNWR1V0aWxzLlNZTUJPTF9BUyxcbiAgICAgICAgYW5nbGU6IGN1c3BzWzBdLmFuZ2xlXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiBTVkdVdGlscy5TWU1CT0xfSUMsXG4gICAgICAgIGFuZ2xlOiBjdXNwc1szXS5hbmdsZVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogU1ZHVXRpbHMuU1lNQk9MX0RTLFxuICAgICAgICBhbmdsZTogY3VzcHNbNl0uYW5nbGVcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFNWR1V0aWxzLlNZTUJPTF9NQyxcbiAgICAgICAgYW5nbGU6IGN1c3BzWzldLmFuZ2xlXG4gICAgICB9LFxuICAgIF1cblxuICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG5cbiAgICBjb25zdCByYWQxID0gdGhpcy5nZXRSYWRpdXMoKTtcbiAgICBjb25zdCByYWQyID0gdGhpcy5nZXRSYWRpdXMoKSArIEFYSVNfTEVOR1RIO1xuXG4gICAgZm9yIChjb25zdCBheGlzIG9mIGF4aXNMaXN0KSB7XG4gICAgICBsZXQgc3RhcnRQb2ludCA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgcmFkMSwgVXRpbHMuZGVncmVlVG9SYWRpYW4oYXhpcy5hbmdsZSwgdGhpcy4jcmFkaXguZ2V0QXNjZW5kYW50U2hpZnQoKSkpXG4gICAgICBsZXQgZW5kUG9pbnQgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHJhZDIsIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKGF4aXMuYW5nbGUsIHRoaXMuI3JhZGl4LmdldEFzY2VuZGFudFNoaWZ0KCkpKVxuICAgICAgbGV0IGxpbmUgPSBTVkdVdGlscy5TVkdMaW5lKHN0YXJ0UG9pbnQueCwgc3RhcnRQb2ludC55LCBlbmRQb2ludC54LCBlbmRQb2ludC55KTtcbiAgICAgIGxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX01BSU5fQVhJU19DT0xPUik7XG4gICAgICBsaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9NQUlOX1NUUk9LRSk7XG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGxpbmUpO1xuXG4gICAgICBsZXQgdGV4dFBvaW50ID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCByYWQyICsgQVhJU19MRU5HVEggKyAyLCBVdGlscy5kZWdyZWVUb1JhZGlhbihheGlzLmFuZ2xlLCB0aGlzLiNyYWRpeC5nZXRBc2NlbmRhbnRTaGlmdCgpKSlcbiAgICAgIGxldCBzeW1ib2w7XG4gICAgICBzd2l0Y2ggKGF4aXMubmFtZSkge1xuICAgICAgICBjYXNlIFwiQXNcIjpcbiAgICAgICAgICBzeW1ib2wgPSBTVkdVdGlscy5TVkdTeW1ib2woYXhpcy5uYW1lLCB0ZXh0UG9pbnQueCwgdGV4dFBvaW50LnkpXG4gICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXG4gICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImRvbWluYW50LWJhc2VsaW5lXCIsIFwibWlkZGxlXCIpXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJEc1wiOlxuICAgICAgICAgIHN5bWJvbCA9IFNWR1V0aWxzLlNWR1N5bWJvbChheGlzLm5hbWUsIHRleHRQb2ludC54LCB0ZXh0UG9pbnQueSlcbiAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcbiAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIk1jXCI6XG4gICAgICAgICAgc3ltYm9sID0gU1ZHVXRpbHMuU1ZHU3ltYm9sKGF4aXMubmFtZSwgdGV4dFBvaW50LngsIHRleHRQb2ludC55KVxuICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxuICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJkb21pbmFudC1iYXNlbGluZVwiLCBcIm1pZGRsZVwiKVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiSWNcIjpcbiAgICAgICAgICBzeW1ib2wgPSBTVkdVdGlscy5TVkdTeW1ib2woYXhpcy5uYW1lLCB0ZXh0UG9pbnQueCwgdGV4dFBvaW50LnkpXG4gICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXG4gICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImRvbWluYW50LWJhc2VsaW5lXCIsIFwibWlkZGxlXCIpXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgY29uc29sZS5lcnJvcihheGlzLm5hbWUpXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5rbm93biBheGlzIG5hbWUuXCIpXG4gICAgICB9XG4gICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZm9udC1mYW1pbHlcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfRk9OVF9GQU1JTFkpO1xuICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImZvbnQtc2l6ZVwiLCB0aGlzLiNzZXR0aW5ncy5SQURJWF9BWElTX0ZPTlRfU0laRSk7XG4gICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9NQUlOX0FYSVNfQ09MT1IpO1xuXG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHN5bWJvbCk7XG4gICAgfVxuXG4gICAgdGhpcy4jcm9vdC5hcHBlbmRDaGlsZCh3cmFwcGVyKVxuICB9XG5cbiAgI2RyYXdCb3JkZXJzKCkge1xuICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG5cbiAgICBjb25zdCBvdXRlckNpcmNsZSA9IFNWR1V0aWxzLlNWR0NpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLmdldFJhZGl1cygpKVxuICAgIG91dGVyQ2lyY2xlLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9DSVJDTEVfQ09MT1IpO1xuICAgIG91dGVyQ2lyY2xlLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9NQUlOX1NUUk9LRSk7XG4gICAgd3JhcHBlci5hcHBlbmRDaGlsZChvdXRlckNpcmNsZSlcblxuICAgIHRoaXMuI3Jvb3QuYXBwZW5kQ2hpbGQod3JhcHBlcilcbiAgfVxuXG4gICNnZXRQb2ludENpcmNsZVJhZGl1cygpIHtcbiAgICByZXR1cm4gMjkgKiAodGhpcy5nZXRSYWRpdXMoKSAvIHRoaXMuI251bWJlck9mTGV2ZWxzKVxuICB9XG5cbiAgI2dldFJ1bGxlckNpcmNsZVJhZGl1cygpIHtcbiAgICByZXR1cm4gMzEgKiAodGhpcy5nZXRSYWRpdXMoKSAvIHRoaXMuI251bWJlck9mTGV2ZWxzKVxuICB9XG5cbiAgI2dldENlbnRlckNpcmNsZVJhZGl1cygpIHtcbiAgICByZXR1cm4gMjQgKiAodGhpcy5nZXRSYWRpdXMoKSAvIHRoaXMuI251bWJlck9mTGV2ZWxzKVxuICB9XG5cbiAgYW5pbWF0ZVRvKGRhdGEpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgZ2V0UG9pbnQobmFtZSkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBnZXRQb2ludHMoKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxufVxuXG5leHBvcnQge1xuICBUcmFuc2l0Q2hhcnQgYXNcbiAgZGVmYXVsdFxufVxuIiwiaW1wb3J0IFNWR1V0aWxzIGZyb20gJy4uL3V0aWxzL1NWR1V0aWxzLmpzJztcbmltcG9ydCBVdGlscyBmcm9tICcuLi91dGlscy9VdGlscy5qcyc7XG5cbi8vIG5vaW5zcGVjdGlvbiBKU1BvdGVudGlhbGx5SW52YWxpZFVzYWdlT2ZDbGFzc1RoaXMsSlNVbnVzZWRHbG9iYWxTeW1ib2xzXG4vKipcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyBSZXByZXNlbnRzIGEgcGxhbmV0IG9yIHBvaW50IG9mIGludGVyZXN0IGluIHRoZSBjaGFydFxuICogQHB1YmxpY1xuICovXG5jbGFzcyBQb2ludCB7XG5cbiAgICAjbmFtZVxuICAgICNhbmdsZVxuICAgICNzaWduXG4gICAgI2lzUmV0cm9ncmFkZVxuICAgICNjdXNwc1xuICAgICNzZXR0aW5nc1xuXG4gICAgLyoqXG4gICAgICogQGNvbnN0cnVjdHNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcG9pbnREYXRhIC0ge25hbWU6U3RyaW5nLCBhbmdsZTpOdW1iZXIsIGlzUmV0cm9ncmFkZTpmYWxzZX1cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY3VzcHMgLSBbe2FuZ2xlOk51bWJlcn0sIHthbmdsZTpOdW1iZXJ9LCB7YW5nbGU6TnVtYmVyfSwgLi4uXVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzZXR0aW5nc1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHBvaW50RGF0YSwgY3VzcHMsIHNldHRpbmdzKSB7XG4gICAgICAgIHRoaXMuI25hbWUgPSBwb2ludERhdGEubmFtZSA/PyBcIlVua25vd25cIlxuICAgICAgICB0aGlzLiNhbmdsZSA9IHBvaW50RGF0YS5hbmdsZSA/PyAwXG4gICAgICAgIHRoaXMuI3NpZ24gPSBwb2ludERhdGEuc2lnbiA/PyBudWxsXG4gICAgICAgIHRoaXMuI2lzUmV0cm9ncmFkZSA9IHBvaW50RGF0YS5pc1JldHJvZ3JhZGUgPz8gZmFsc2VcblxuICAgICAgICBpZiAoISBBcnJheS5pc0FycmF5KGN1c3BzKSB8fCBjdXNwcy5sZW5ndGggIT09IDEyKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJCYWQgcGFyYW0gY3VzcHMuIFwiKVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy4jY3VzcHMgPSBjdXNwc1xuXG4gICAgICAgIGlmICghIHNldHRpbmdzKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0JhZCBwYXJhbSBzZXR0aW5ncy4nKVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy4jc2V0dGluZ3MgPSBzZXR0aW5nc1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBuYW1lXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICovXG4gICAgZ2V0TmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI25hbWVcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJcyByZXRyb2dyYWRlXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqL1xuICAgIGlzUmV0cm9ncmFkZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI2lzUmV0cm9ncmFkZVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBhbmdsZVxuICAgICAqXG4gICAgICogQHJldHVybiB7TnVtYmVyfVxuICAgICAqL1xuICAgIGdldEFuZ2xlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy4jYW5nbGVcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgc2lnblxuICAgICAqXG4gICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAqL1xuICAgIGdldFNpZ24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiNzaWduXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHN5bWJvbFxuICAgICAqXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHhQb3NcbiAgICAgKiBAcGFyYW0ge051bWJlcn0geVBvc1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbYW5nbGVTaGlmdF1cbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtpc1Byb3BlcnRpZXNdIC0gYW5nbGVJblNpZ24sIGRpZ25pdGllcywgcmV0cm9ncmFkZVxuICAgICAqXG4gICAgICogQHJldHVybiB7U1ZHRWxlbWVudH1cbiAgICAgKi9cbiAgICBnZXRTeW1ib2woeFBvcywgeVBvcywgYW5nbGVTaGlmdCA9IDAsIGlzUHJvcGVydGllcyA9IHRydWUpIHtcbiAgICAgICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcblxuICAgICAgICBjb25zdCBzeW1ib2wgPSBTVkdVdGlscy5TVkdTeW1ib2wodGhpcy4jbmFtZSwgeFBvcywgeVBvcylcblxuICAgICAgICBpZiAodGhpcy4jc2V0dGluZ3MuQ0xBU1NfQ0VMRVNUSUFMKSB7XG4gICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKCdjbGFzcycsIHRoaXMuI3NldHRpbmdzLkNMQVNTX0NFTEVTVElBTCArICcgJyArIHRoaXMuI3NldHRpbmdzLkNMQVNTX0NFTEVTVElBTCArICctLScgKyB0aGlzLiNuYW1lLnRvTG93ZXJDYXNlKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuI3NldHRpbmdzLlBPSU5UX1NUUk9LRSA/PyBmYWxzZSkge1xuICAgICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZSgncGFpbnQtb3JkZXInLCAnc3Ryb2tlJyk7XG4gICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKCdzdHJva2UnLCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9TVFJPS0VfQ09MT1IpO1xuICAgICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZSgnc3Ryb2tlLXdpZHRoJywgdGhpcy4jc2V0dGluZ3MuUE9JTlRfU1RST0tFX1dJRFRIKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoc3ltYm9sKVxuXG4gICAgICAgIGlmIChpc1Byb3BlcnRpZXMgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICByZXR1cm4gd3JhcHBlciAvLz09PT09PT5cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNoYXJ0Q2VudGVyWCA9IHRoaXMuI3NldHRpbmdzLkNIQVJUX1ZJRVdCT1hfV0lEVEggLyAyXG4gICAgICAgIGNvbnN0IGNoYXJ0Q2VudGVyWSA9IHRoaXMuI3NldHRpbmdzLkNIQVJUX1ZJRVdCT1hfSEVJR0hUIC8gMlxuICAgICAgICBjb25zdCBhbmdsZUZyb21TeW1ib2xUb0NlbnRlciA9IFV0aWxzLnBvc2l0aW9uVG9BbmdsZSh4UG9zLCB5UG9zLCBjaGFydENlbnRlclgsIGNoYXJ0Q2VudGVyWSlcblxuICAgICAgICBpZiAodGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19TSE9XX0FOR0xFKSB7XG4gICAgICAgICAgICBhbmdsZUluU2lnbi5jYWxsKHRoaXMpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19TSE9XX1NJR04gJiYgdGhpcy4jc2lnbiAhPT0gbnVsbCkge1xuICAgICAgICAgICAgc2hvd1NpZ24uY2FsbCh0aGlzKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfU0hPV19SRVRST0dSQURFICYmIHRoaXMuI2lzUmV0cm9ncmFkZSkge1xuICAgICAgICAgICAgcmV0cm9ncmFkZS5jYWxsKHRoaXMpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19TSE9XX0RJR05JVFkgJiYgdGhpcy5nZXREaWduaXR5KCkpIHtcbiAgICAgICAgICAgIGRpZ25pdGllcy5jYWxsKHRoaXMpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy4jc2V0dGluZ3MuSU5TRVJUX0VMRU1FTlRfVElUTEUpIHtcbiAgICAgICAgICAgIHN5bWJvbC5hcHBlbmRDaGlsZChTVkdVdGlscy5TVkdUaXRsZSh0aGlzLiNzZXR0aW5ncy5FTEVNRU5UX1RJVExFUy5wb2ludHNbdGhpcy4jbmFtZS50b0xvd2VyQ2FzZSgpXSkpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gd3JhcHBlciAvLz09PT09PT5cblxuICAgICAgICAvKlxuICAgICAgICAgKiAgQW5nbGUgaW4gc2lnblxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gYW5nbGVJblNpZ24oKSB7XG4gICAgICAgICAgICBjb25zdCBhbmdsZUluU2lnblBvc2l0aW9uID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh4UG9zLCB5UG9zLCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX0FOR0xFX09GRlNFVCAqIHRoaXMuI3NldHRpbmdzLlBPSU5UX0NPTExJU0lPTl9SQURJVVMsIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKC1hbmdsZUZyb21TeW1ib2xUb0NlbnRlciwgYW5nbGVTaGlmdCkpXG5cbiAgICAgICAgICAgIC8vIEl0IGlzIHBvc3NpYmxlIHRvIHJvdGF0ZSB0aGUgdGV4dCwgd2hlbiB1bmNvbW1lbnQgYSBsaW5lIGJlbGxvdy5cbiAgICAgICAgICAgIC8vdGV4dFdyYXBwZXIuc2V0QXR0cmlidXRlKFwidHJhbnNmb3JtXCIsIGByb3RhdGUoJHthbmdsZUZyb21TeW1ib2xUb0NlbnRlcn0sJHt0ZXh0UG9zaXRpb24ueH0sJHt0ZXh0UG9zaXRpb24ueX0pYClcblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqIEFsbG93cyBjaGFuZ2UgdGhlIGFuZ2xlIHN0cmluZywgZS5nLiBhZGQgdGhlIGRlZ3JlZSBzeW1ib2wgwrAgd2l0aCB0aGUgXiBjaGFyYWN0ZXIgZnJvbSBBc3Ryb25vbWljb25cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbGV0IGFuZ2xlID0gdGhpcy5nZXRBbmdsZUluU2lnbigpO1xuICAgICAgICAgICAgbGV0IGFuZ2xlUG9zaXRpb24gPSBVdGlscy5maWxsVGVtcGxhdGUodGhpcy4jc2V0dGluZ3MuQU5HTEVfVEVNUExBVEUsIHthbmdsZTogYW5nbGV9KTtcblxuICAgICAgICAgICAgY29uc3QgYW5nbGVJblNpZ25UZXh0ID0gU1ZHVXRpbHMuU1ZHVGV4dChhbmdsZUluU2lnblBvc2l0aW9uLngsIGFuZ2xlSW5TaWduUG9zaXRpb24ueSwgYW5nbGVQb3NpdGlvbilcbiAgICAgICAgICAgIGFuZ2xlSW5TaWduVGV4dC5zZXRBdHRyaWJ1dGUoXCJmb250LWZhbWlseVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9GT05UX0ZBTUlMWSk7XG4gICAgICAgICAgICBhbmdsZUluU2lnblRleHQuc2V0QXR0cmlidXRlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIikgLy8gc3RhcnQsIG1pZGRsZSwgZW5kXG4gICAgICAgICAgICBhbmdsZUluU2lnblRleHQuc2V0QXR0cmlidXRlKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcbiAgICAgICAgICAgIGFuZ2xlSW5TaWduVGV4dC5zZXRBdHRyaWJ1dGUoXCJmb250LXNpemVcIiwgdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19BTkdMRV9TSVpFIHx8IHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfRk9OVF9TSVpFKTtcbiAgICAgICAgICAgIGFuZ2xlSW5TaWduVGV4dC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfQU5HTEVfQ09MT1IgfHwgdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19DT0xPUik7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLiNzZXR0aW5ncy5DTEFTU19QT0lOVF9BTkdMRSkge1xuICAgICAgICAgICAgICAgIGFuZ2xlSW5TaWduVGV4dC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgdGhpcy4jc2V0dGluZ3MuQ0xBU1NfUE9JTlRfQU5HTEUgKyAnICcgKyB0aGlzLiNzZXR0aW5ncy5DTEFTU19QT0lOVF9BTkdMRSArICctLScgKyBhbmdsZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLiNzZXR0aW5ncy5QT0lOVF9TVFJPS0UgPz8gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBhbmdsZUluU2lnblRleHQuc2V0QXR0cmlidXRlKCdwYWludC1vcmRlcicsICdzdHJva2UnKTtcbiAgICAgICAgICAgICAgICBhbmdsZUluU2lnblRleHQuc2V0QXR0cmlidXRlKCdzdHJva2UnLCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9TVFJPS0VfQ09MT1IpO1xuICAgICAgICAgICAgICAgIGFuZ2xlSW5TaWduVGV4dC5zZXRBdHRyaWJ1dGUoJ3N0cm9rZS13aWR0aCcsIHRoaXMuI3NldHRpbmdzLlBPSU5UX1NUUk9LRV9XSURUSCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoYW5nbGVJblNpZ25UZXh0KVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgKiAgU2hvdyBzaWduXG4gICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHNob3dTaWduKCkge1xuICAgICAgICAgICAgY29uc3Qgc2lnblBvc2l0aW9uID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh4UG9zLCB5UG9zLCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX1NJR05fT0ZGU0VUICogdGhpcy4jc2V0dGluZ3MuUE9JTlRfQ09MTElTSU9OX1JBRElVUywgVXRpbHMuZGVncmVlVG9SYWRpYW4oLWFuZ2xlRnJvbVN5bWJvbFRvQ2VudGVyLCBhbmdsZVNoaWZ0KSlcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBHZXQgdGhlIHNpZ24gaW5kZXhcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbGV0IHN5bWJvbEluZGV4ID0gdGhpcy4jc2V0dGluZ3MuU0lHTl9MQUJFTFMuaW5kZXhPZih0aGlzLiNzaWduKVxuXG4gICAgICAgICAgICBjb25zdCBzaWduVGV4dCA9IFNWR1V0aWxzLlNWR1N5bWJvbCh0aGlzLiNzaWduLCBzaWduUG9zaXRpb24ueCwgc2lnblBvc2l0aW9uLnkpXG4gICAgICAgICAgICBzaWduVGV4dC5zZXRBdHRyaWJ1dGUoXCJmb250LWZhbWlseVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9GT05UX0ZBTUlMWSk7XG4gICAgICAgICAgICBzaWduVGV4dC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKSAvLyBzdGFydCwgbWlkZGxlLCBlbmRcbiAgICAgICAgICAgIHNpZ25UZXh0LnNldEF0dHJpYnV0ZShcImRvbWluYW50LWJhc2VsaW5lXCIsIFwibWlkZGxlXCIpXG4gICAgICAgICAgICBzaWduVGV4dC5zZXRBdHRyaWJ1dGUoXCJmb250LXNpemVcIiwgdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19TSUdOX1NJWkUgfHwgdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19GT05UX1NJWkUpO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE92ZXJyaWRlIHNpZ24gY29sb3JzXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlmICh0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX1NJR05fQ09MT1IgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBzaWduVGV4dC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfU0lHTl9DT0xPUik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNpZ25UZXh0LnNldEF0dHJpYnV0ZShcImZpbGxcIiwgdGhpcy4jc2V0dGluZ3MuU0lHTl9DT0xPUlNbc3ltYm9sSW5kZXhdIHx8IHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfQ09MT1IpO1xuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIGlmICh0aGlzLiNzZXR0aW5ncy5DTEFTU19QT0lOVF9TSUdOKSB7XG4gICAgICAgICAgICAgICAgc2lnblRleHQuc2V0QXR0cmlidXRlKCdjbGFzcycsIHRoaXMuI3NldHRpbmdzLkNMQVNTX1BPSU5UX1NJR04gKyAnICcgKyB0aGlzLiNzZXR0aW5ncy5DTEFTU19QT0lOVF9TSUdOICsgJy0tJyArIHRoaXMuI3NpZ24udG9Mb3dlckNhc2UoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy4jc2V0dGluZ3MuUE9JTlRfU1RST0tFID8/IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgc2lnblRleHQuc2V0QXR0cmlidXRlKCdwYWludC1vcmRlcicsICdzdHJva2UnKTtcbiAgICAgICAgICAgICAgICBzaWduVGV4dC5zZXRBdHRyaWJ1dGUoJ3N0cm9rZScsIHRoaXMuI3NldHRpbmdzLlBPSU5UX1NUUk9LRV9DT0xPUik7XG4gICAgICAgICAgICAgICAgc2lnblRleHQuc2V0QXR0cmlidXRlKCdzdHJva2Utd2lkdGgnLCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9TVFJPS0VfV0lEVEgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHNpZ25UZXh0KVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogIFJldHJvZ3JhZGVcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHJldHJvZ3JhZGUoKSB7XG4gICAgICAgICAgICBjb25zdCByZXRyb2dyYWRlUG9zaXRpb24gPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHhQb3MsIHlQb3MsIHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfUkVUUk9HUkFERV9PRkZTRVQgKiB0aGlzLiNzZXR0aW5ncy5QT0lOVF9DT0xMSVNJT05fUkFESVVTLCBVdGlscy5kZWdyZWVUb1JhZGlhbigtYW5nbGVGcm9tU3ltYm9sVG9DZW50ZXIsIGFuZ2xlU2hpZnQpKVxuXG4gICAgICAgICAgICBjb25zdCByZXRyb2dyYWRlVGV4dCA9IFNWR1V0aWxzLlNWR1RleHQocmV0cm9ncmFkZVBvc2l0aW9uLngsIHJldHJvZ3JhZGVQb3NpdGlvbi55LCBTVkdVdGlscy5TWU1CT0xfUkVUUk9HUkFERV9DT0RFKVxuICAgICAgICAgICAgcmV0cm9ncmFkZVRleHQuc2V0QXR0cmlidXRlKFwiZm9udC1mYW1pbHlcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfRk9OVF9GQU1JTFkpO1xuICAgICAgICAgICAgcmV0cm9ncmFkZVRleHQuc2V0QXR0cmlidXRlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIikgLy8gc3RhcnQsIG1pZGRsZSwgZW5kXG4gICAgICAgICAgICByZXRyb2dyYWRlVGV4dC5zZXRBdHRyaWJ1dGUoXCJkb21pbmFudC1iYXNlbGluZVwiLCBcIm1pZGRsZVwiKVxuICAgICAgICAgICAgcmV0cm9ncmFkZVRleHQuc2V0QXR0cmlidXRlKFwiZm9udC1zaXplXCIsIHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfUkVUUk9HUkFERV9TSVpFIHx8IHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfRk9OVF9TSVpFKTtcbiAgICAgICAgICAgIHJldHJvZ3JhZGVUZXh0LnNldEF0dHJpYnV0ZShcImZpbGxcIiwgdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19SRVRST0dSQURFX0NPTE9SIHx8IHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfQ09MT1IpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy4jc2V0dGluZ3MuQ0xBU1NfUE9JTlRfUkVUUk9HUkFERSkge1xuICAgICAgICAgICAgICAgIHJldHJvZ3JhZGVUZXh0LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCB0aGlzLiNzZXR0aW5ncy5DTEFTU19QT0lOVF9SRVRST0dSQURFKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuI3NldHRpbmdzLlBPSU5UX1NUUk9LRSA/PyBmYWxzZSkge1xuICAgICAgICAgICAgICAgIHJldHJvZ3JhZGVUZXh0LnNldEF0dHJpYnV0ZSgncGFpbnQtb3JkZXInLCAnc3Ryb2tlJyk7XG4gICAgICAgICAgICAgICAgcmV0cm9ncmFkZVRleHQuc2V0QXR0cmlidXRlKCdzdHJva2UnLCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9TVFJPS0VfQ09MT1IpO1xuICAgICAgICAgICAgICAgIHJldHJvZ3JhZGVUZXh0LnNldEF0dHJpYnV0ZSgnc3Ryb2tlLXdpZHRoJywgdGhpcy4jc2V0dGluZ3MuUE9JTlRfU1RST0tFX1dJRFRIKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuI3NldHRpbmdzLklOU0VSVF9FTEVNRU5UX1RJVExFKSB7XG4gICAgICAgICAgICAgICAgcmV0cm9ncmFkZVRleHQuYXBwZW5kQ2hpbGQoU1ZHVXRpbHMuU1ZHVGl0bGUodGhpcy4jc2V0dGluZ3MuRUxFTUVOVF9USVRMRVMucmV0cm9ncmFkZSkpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQocmV0cm9ncmFkZVRleHQpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiAgRGlnbml0aWVzXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBkaWduaXRpZXMoKSB7XG4gICAgICAgICAgICBjb25zdCBkaWduaXRpZXNQb3NpdGlvbiA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUoeFBvcywgeVBvcywgdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19ESUdOSVRZX09GRlNFVCAqIHRoaXMuI3NldHRpbmdzLlBPSU5UX0NPTExJU0lPTl9SQURJVVMsIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKC1hbmdsZUZyb21TeW1ib2xUb0NlbnRlciwgYW5nbGVTaGlmdCkpXG4gICAgICAgICAgICBjb25zdCBkaWduaXRpZXNUZXh0ID0gU1ZHVXRpbHMuU1ZHVGV4dChkaWduaXRpZXNQb3NpdGlvbi54LCBkaWduaXRpZXNQb3NpdGlvbi55LCB0aGlzLmdldERpZ25pdHkoKSlcbiAgICAgICAgICAgIGRpZ25pdGllc1RleHQuc2V0QXR0cmlidXRlKFwiZm9udC1mYW1pbHlcIiwgXCJzYW5zLXNlcmlmXCIpO1xuICAgICAgICAgICAgZGlnbml0aWVzVGV4dC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKSAvLyBzdGFydCwgbWlkZGxlLCBlbmRcbiAgICAgICAgICAgIGRpZ25pdGllc1RleHQuc2V0QXR0cmlidXRlKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcbiAgICAgICAgICAgIGRpZ25pdGllc1RleHQuc2V0QXR0cmlidXRlKFwiZm9udC1zaXplXCIsIHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfRElHTklUWV9TSVpFIHx8IHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfRk9OVF9TSVpFKTtcbiAgICAgICAgICAgIGRpZ25pdGllc1RleHQuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX0RJR05JVFlfQ09MT1IgfHwgdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19DT0xPUik7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLiNzZXR0aW5ncy5DTEFTU19QT0lOVF9ESUdOSVRZKSB7XG4gICAgICAgICAgICAgICAgZGlnbml0aWVzVGV4dC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgdGhpcy4jc2V0dGluZ3MuQ0xBU1NfUE9JTlRfRElHTklUWSArICcgJyArIHRoaXMuI3NldHRpbmdzLkNMQVNTX1BPSU5UX0RJR05JVFkgKyAnLS0nICsgZGlnbml0aWVzVGV4dC50ZXh0Q29udGVudCk7IC8vIFN0cmFpZ2h0Zm9yd2FyZCByL2QvZS9mXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLiNzZXR0aW5ncy5QT0lOVF9TVFJPS0UgPz8gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBkaWduaXRpZXNUZXh0LnNldEF0dHJpYnV0ZSgncGFpbnQtb3JkZXInLCAnc3Ryb2tlJyk7XG4gICAgICAgICAgICAgICAgZGlnbml0aWVzVGV4dC5zZXRBdHRyaWJ1dGUoJ3N0cm9rZScsIHRoaXMuI3NldHRpbmdzLlBPSU5UX1NUUk9LRV9DT0xPUik7XG4gICAgICAgICAgICAgICAgZGlnbml0aWVzVGV4dC5zZXRBdHRyaWJ1dGUoJ3N0cm9rZS13aWR0aCcsIHRoaXMuI3NldHRpbmdzLlBPSU5UX1NUUk9LRV9XSURUSCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoZGlnbml0aWVzVGV4dClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBob3VzZSBudW1iZXJcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge051bWJlcn1cbiAgICAgKi9cbiAgICBnZXRIb3VzZU51bWJlcigpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm90IGltcGxlbWVudGVkIHlldC5cIilcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgc2lnbiBudW1iZXJcbiAgICAgKiBBcmlzZSA9IDEsIFRhdXJ1cyA9IDIsIC4uLlBpc2NlcyA9IDEyXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAgICovXG4gICAgZ2V0U2lnbk51bWJlcigpIHtcbiAgICAgICAgbGV0IGFuZ2xlID0gdGhpcy4jYW5nbGUgJSBVdGlscy5ERUdfMzYwXG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKChhbmdsZSAvIDMwKSArIDEpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGFuZ2xlIChJbnRlZ2VyKSBpbiB0aGUgc2lnbiBpbiB3aGljaCBpdCBzdGFuZHMuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAgICovXG4gICAgZ2V0QW5nbGVJblNpZ24oKSB7XG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKHRoaXMuI2FuZ2xlICUgMzApXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IGRpZ25pdHkgc3ltYm9sIChyIC0gcnVsZXJzaGlwLCBkIC0gZGV0cmltZW50LCBmIC0gZmFsbCwgZSAtIGV4YWx0YXRpb24pXG4gICAgICpcbiAgICAgKiBVc2UgTW9kZXJuIGRpZ25pdGllcyBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9Fc3NlbnRpYWxfZGlnbml0eVxuICAgICAqXG4gICAgICogQHJldHVybiB7U3RyaW5nfSAtIGRpZ25pdHkgc3ltYm9sIChyLGQsZixlKVxuICAgICAqL1xuICAgIGdldERpZ25pdHkoKSB7XG4gICAgICAgIGNvbnN0IEFSSUVTID0gMVxuICAgICAgICBjb25zdCBUQVVSVVMgPSAyXG4gICAgICAgIGNvbnN0IEdFTUlOSSA9IDNcbiAgICAgICAgY29uc3QgQ0FOQ0VSID0gNFxuICAgICAgICBjb25zdCBMRU8gPSA1XG4gICAgICAgIGNvbnN0IFZJUkdPID0gNlxuICAgICAgICBjb25zdCBMSUJSQSA9IDdcbiAgICAgICAgY29uc3QgU0NPUlBJTyA9IDhcbiAgICAgICAgY29uc3QgU0FHSVRUQVJJVVMgPSA5XG4gICAgICAgIGNvbnN0IENBUFJJQ09STiA9IDEwXG4gICAgICAgIGNvbnN0IEFRVUFSSVVTID0gMTFcbiAgICAgICAgY29uc3QgUElTQ0VTID0gMTJcblxuICAgICAgICBjb25zdCBSVUxFUlNISVBfU1lNQk9MID0gdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19ESUdOSVRZX1NZTUJPTFNbMF07XG4gICAgICAgIGNvbnN0IERFVFJJTUVOVF9TWU1CT0wgPSB0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX0RJR05JVFlfU1lNQk9MU1sxXTtcbiAgICAgICAgY29uc3QgRVhBTFRBVElPTl9TWU1CT0wgPSB0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX0RJR05JVFlfU1lNQk9MU1syXTtcbiAgICAgICAgY29uc3QgRkFMTF9TWU1CT0wgPSB0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX0RJR05JVFlfU1lNQk9MU1szXTtcblxuICAgICAgICBzd2l0Y2ggKHRoaXMuI25hbWUpIHtcbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1NVTjpcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IExFTykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUlVMRVJTSElQX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IEFRVUFSSVVTKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBERVRSSU1FTlRfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PT0gVklSR08pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEZBTExfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PT0gQVJJRVMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEVYQUxUQVRJT05fU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBcIlwiXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX01PT046XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBDQU5DRVIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFJVTEVSU0hJUF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBDQVBSSUNPUk4pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIERFVFJJTUVOVF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBTQ09SUElPKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBGQUxMX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IFRBVVJVUykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gRVhBTFRBVElPTl9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBcIlwiXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX01FUkNVUlk6XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBHRU1JTkkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFJVTEVSU0hJUF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBTQUdJVFRBUklVUykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gREVUUklNRU5UX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IFBJU0NFUykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gRkFMTF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBWSVJHTykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gRVhBTFRBVElPTl9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBcIlwiXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1ZFTlVTOlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PT0gVEFVUlVTIHx8IHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBMSUJSQSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUlVMRVJTSElQX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IEFSSUVTIHx8IHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBTQ09SUElPKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBERVRSSU1FTlRfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PT0gVklSR08pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEZBTExfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PT0gUElTQ0VTKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBFWEFMVEFUSU9OX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiXCJcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfTUFSUzpcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IEFSSUVTIHx8IHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBTQ09SUElPKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBSVUxFUlNISVBfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PT0gVEFVUlVTIHx8IHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBMSUJSQSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gREVUUklNRU5UX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IENBTkNFUikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gRkFMTF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBDQVBSSUNPUk4pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEVYQUxUQVRJT05fU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gXCJcIlxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9KVVBJVEVSOlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PT0gU0FHSVRUQVJJVVMgfHwgdGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IFBJU0NFUykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUlVMRVJTSElQX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IEdFTUlOSSB8fCB0aGlzLmdldFNpZ25OdW1iZXIoKSA9PT0gVklSR08pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIERFVFJJTUVOVF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBDQVBSSUNPUk4pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEZBTExfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PT0gQ0FOQ0VSKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBFWEFMVEFUSU9OX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiXCJcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfU0FUVVJOOlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PT0gQ0FQUklDT1JOIHx8IHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBBUVVBUklVUykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUlVMRVJTSElQX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IENBTkNFUiB8fCB0aGlzLmdldFNpZ25OdW1iZXIoKSA9PT0gTEVPKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBERVRSSU1FTlRfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PT0gQVJJRVMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEZBTExfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PT0gTElCUkEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEVYQUxUQVRJT05fU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gXCJcIlxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9VUkFOVVM6XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBBUVVBUklVUykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUlVMRVJTSElQX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IExFTykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gREVUUklNRU5UX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IFRBVVJVUykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gRkFMTF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBTQ09SUElPKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBFWEFMVEFUSU9OX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiXCJcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfTkVQVFVORTpcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IFBJU0NFUykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUlVMRVJTSElQX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IFZJUkdPKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBERVRSSU1FTlRfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PT0gR0VNSU5JIHx8IHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBBUVVBUklVUykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gRkFMTF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBTQUdJVFRBUklVUyB8fCB0aGlzLmdldFNpZ25OdW1iZXIoKSA9PT0gTEVPKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBFWEFMVEFUSU9OX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiXCJcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfUExVVE86XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBTQ09SUElPKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBSVUxFUlNISVBfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PT0gVEFVUlVTKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBERVRSSU1FTlRfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PT0gTElCUkEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEZBTExfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PT0gQVJJRVMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEVYQUxUQVRJT05fU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gXCJcIlxuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiBcIlwiXG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCB7XG4gICAgUG9pbnQgYXMgZGVmYXVsdFxufVxuIiwiaW1wb3J0ICogYXMgVW5pdmVyc2UgZnJvbSBcIi4vY29uc3RhbnRzL1VuaXZlcnNlLmpzXCJcbmltcG9ydCAqIGFzIFJhZGl4IGZyb20gXCIuL2NvbnN0YW50cy9SYWRpeC5qc1wiXG5pbXBvcnQgKiBhcyBUcmFuc2l0IGZyb20gXCIuL2NvbnN0YW50cy9UcmFuc2l0LmpzXCJcbmltcG9ydCAqIGFzIFBvaW50IGZyb20gXCIuL2NvbnN0YW50cy9Qb2ludC5qc1wiXG5pbXBvcnQgKiBhcyBDb2xvcnMgZnJvbSBcIi4vY29uc3RhbnRzL0NvbG9ycy5qc1wiXG5pbXBvcnQgKiBhcyBBc3BlY3RzIGZyb20gXCIuL2NvbnN0YW50cy9Bc3BlY3RzLmpzXCJcblxuY29uc3QgU0VUVElOR1MgPSBPYmplY3QuYXNzaWduKHt9LCBVbml2ZXJzZSwgUmFkaXgsIFRyYW5zaXQsIFBvaW50LCBDb2xvcnMsIEFzcGVjdHMpO1xuXG5leHBvcnQge1xuICBTRVRUSU5HUyBhc1xuICBkZWZhdWx0XG59XG4iLCIvLyBub2luc3BlY3Rpb24gSlNVbnVzZWRHbG9iYWxTeW1ib2xzXG5cbi8qXG4qIEFzcGVjdHMgd3JhcHBlciBlbGVtZW50IElEXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCBhc3BlY3RzXG4qL1xuZXhwb3J0IGNvbnN0IEFTUEVDVFNfSUQgPSBcImFzcGVjdHNcIlxuXG4vKlxuKiBEcmF3IGFzcGVjdHMgaW50byBjaGFydCBkdXJpbmcgcmVuZGVyXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7Qm9vbGVhbn1cbiogQGRlZmF1bHQgdHJ1ZVxuKi9cbmV4cG9ydCBjb25zdCBEUkFXX0FTUEVDVFMgPSB0cnVlXG5cbi8qXG4qIEZvbnQgc2l6ZSAtIGFzcGVjdHNcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtOdW1iZXJ9XG4qIEBkZWZhdWx0IDI3XG4qL1xuZXhwb3J0IGNvbnN0IEFTUEVDVFNfRk9OVF9TSVpFID0gMThcblxuLyoqXG4gKiBEZWZhdWx0IGFzcGVjdHNcbiAqXG4gKiBGcm9tIGh0dHBzOi8vd3d3LnJlZGRpdC5jb20vci9hc3Ryb2xvZ3kvY29tbWVudHMveGJkeTgzL3doYXRzX2FfZ29vZF9vcmJfcmFuZ2VfZm9yX2FzcGVjdHNfY29uanVuY3Rpb24vXG4gKiBNYW55IG90aGVyIHNldHRpbmdzLCB1c3VhbGx5IGRlcGVuZHMgb24gdGhlIHBsYW5ldCwgU3VuIC8gTW9vbiB1c2Ugd2lkZXIgcmFuZ2VcbiAqXG4gKiBvcmIgOiBzZXRzIHRoZSB0b2xlcmFuY2UgZm9yIHRoZSBhbmdsZVxuICpcbiAqIE1ham9yIGFzcGVjdHM6XG4gKlxuICogICAgIHtuYW1lOlwiQ29uanVuY3Rpb25cIiwgYW5nbGU6MCwgb3JiOjQsIGlzTWFqb3I6IHRydWV9LFxuICogICAgIHtuYW1lOlwiT3Bwb3NpdGlvblwiLCBhbmdsZToxODAsIG9yYjo0LCBpc01ham9yOiB0cnVlfSxcbiAqICAgICB7bmFtZTpcIlRyaW5lXCIsIGFuZ2xlOjEyMCwgb3JiOjIsIGlzTWFqb3I6IHRydWV9LFxuICogICAgIHtuYW1lOlwiU3F1YXJlXCIsIGFuZ2xlOjkwLCBvcmI6MiwgaXNNYWpvcjogdHJ1ZX0sXG4gKiAgICAge25hbWU6XCJTZXh0aWxlXCIsIGFuZ2xlOjYwLCBvcmI6MiwgaXNNYWpvcjogdHJ1ZX0sXG4gKlxuICogTWlub3IgYXNwZWN0czpcbiAqXG4gKiAgICAge25hbWU6XCJRdWluY3VueFwiLCBhbmdsZToxNTAsIG9yYjoxfSxcbiAqICAgICB7bmFtZTpcIlNlbWlzZXh0aWxlXCIsIGFuZ2xlOjMwLCBvcmI6MX0sXG4gKiAgICAge25hbWU6XCJRdWludGlsZVwiLCBhbmdsZTo3Miwgb3JiOjF9LFxuICogICAgIHtuYW1lOlwiVHJpb2N0aWxlXCIsIGFuZ2xlOjEzNSwgb3JiOjF9LFxuICogICAgIHtuYW1lOlwiU2VtaXNxdWFyZVwiLCBhbmdsZTo0NSwgb3JiOjF9LFxuICpcbiAqIEBjb25zdGFudFxuICogQHR5cGUge0FycmF5fVxuICovXG5leHBvcnQgY29uc3QgREVGQVVMVF9BU1BFQ1RTID0gW1xuICAgIHtuYW1lOlwiQ29uanVuY3Rpb25cIiwgYW5nbGU6MCwgb3JiOjQsIGlzTWFqb3I6IHRydWV9LFxuICAgIHtuYW1lOlwiT3Bwb3NpdGlvblwiLCBhbmdsZToxODAsIG9yYjo0LCBpc01ham9yOiB0cnVlfSxcbiAgICB7bmFtZTpcIlRyaW5lXCIsIGFuZ2xlOjEyMCwgb3JiOjIsIGlzTWFqb3I6IHRydWV9LFxuICAgIHtuYW1lOlwiU3F1YXJlXCIsIGFuZ2xlOjkwLCBvcmI6MiwgaXNNYWpvcjogdHJ1ZX0sXG4gICAge25hbWU6XCJTZXh0aWxlXCIsIGFuZ2xlOjYwLCBvcmI6MiwgaXNNYWpvcjogdHJ1ZX0sXG5cbl1cbiIsIi8vIG5vaW5zcGVjdGlvbiBKU1VudXNlZEdsb2JhbFN5bWJvbHNcblxuLyoqXG4gKiBDaGFydCBiYWNrZ3JvdW5kIGNvbG9yXG4gKiBAY29uc3RhbnRcbiAqIEB0eXBlIHtTdHJpbmd9XG4gKiBAZGVmYXVsdCAjZmZmXG4gKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9CQUNLR1JPVU5EX0NPTE9SID0gXCJub25lXCI7XG5cbi8qKlxuICogUGxhbmV0cyBiYWNrZ3JvdW5kIGNvbG9yXG4gKiBAY29uc3RhbnRcbiAqIEB0eXBlIHtTdHJpbmd9XG4gKiBAZGVmYXVsdCAjZmZmXG4gKi9cbmV4cG9ydCBjb25zdCBQTEFORVRTX0JBQ0tHUk9VTkRfQ09MT1IgPSBcIiNmZmZcIjtcblxuLyoqXG4gKiBBc3BlY3RzIGJhY2tncm91bmQgY29sb3JcbiAqIEBjb25zdGFudFxuICogQHR5cGUge1N0cmluZ31cbiAqIEBkZWZhdWx0ICNmZmZcbiAqL1xuZXhwb3J0IGNvbnN0IEFTUEVDVFNfQkFDS0dST1VORF9DT0xPUiA9IFwiI2VlZVwiO1xuXG4vKlxuKiBEZWZhdWx0IGNvbG9yIG9mIGNpcmNsZXMgaW4gY2hhcnRzXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjMzMzXG4qL1xuZXhwb3J0IGNvbnN0IENIQVJUX0NJUkNMRV9DT0xPUiA9IFwiIzMzM1wiO1xuXG4vKlxuKiBEZWZhdWx0IGNvbG9yIG9mIGxpbmVzIGluIGNoYXJ0c1xuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzMzM1xuKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9MSU5FX0NPTE9SID0gXCIjNjY2XCI7XG5cbi8qXG4qIERlZmF1bHQgY29sb3Igb2YgdGV4dCBpbiBjaGFydHNcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICMzMzNcbiovXG5leHBvcnQgY29uc3QgQ0hBUlRfVEVYVF9DT0xPUiA9IFwiI2JiYlwiO1xuXG4vKlxuKiBEZWZhdWx0IGNvbG9yIG9mIGN1c3BzIG51bWJlclxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzMzM1xuKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9IT1VTRV9OVU1CRVJfQ09MT1IgPSBcIiMzMzNcIjtcblxuLypcbiogRGVmYXVsdCBjb2xvciBvZiBtcWluIGF4aXMgLSBBcywgRHMsIE1jLCBJY1xuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzAwMFxuKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9NQUlOX0FYSVNfQ09MT1IgPSBcIiMwMDBcIjtcblxuLypcbiogRGVmYXVsdCBjb2xvciBvZiBzaWducyBpbiBjaGFydHMgKGFyaXNlIHN5bWJvbCwgdGF1cnVzIHN5bWJvbCwgLi4uKVxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzAwMFxuKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9TSUdOU19DT0xPUiA9IFwiIzMzM1wiO1xuXG4vKlxuKiBEZWZhdWx0IGNvbG9yIG9mIHBsYW5ldHMgb24gdGhlIGNoYXJ0IChTdW4gc3ltYm9sLCBNb29uIHN5bWJvbCwgLi4uKVxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzAwMFxuKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9QT0lOVFNfQ09MT1IgPSBcIiMwMDBcIjtcblxuLypcbiogRGVmYXVsdCBjb2xvciBmb3IgcG9pbnQgcHJvcGVydGllcyAtIGFuZ2xlIGluIHNpZ24sIGRpZ25pdGllcywgcmV0cm9ncmFkZVxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzMzM1xuKi9cbmV4cG9ydCBjb25zdCBQT0lOVF9QUk9QRVJUSUVTX0NPTE9SID0gXCIjMzMzXCJcblxuLypcbiogQXJpZXMgY29sb3JcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICNGRjQ1MDBcbiovXG5leHBvcnQgY29uc3QgQ09MT1JfQVJJRVMgPSBcIiNGRjQ1MDBcIjtcblxuLypcbiogVGF1cnVzIGNvbG9yXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjOEI0NTEzXG4qL1xuZXhwb3J0IGNvbnN0IENPTE9SX1RBVVJVUyA9IFwiIzhCNDUxM1wiO1xuXG4vKlxuKiBHZW1pbnkgY29sb3JcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICM4N0NFRUJcbiovXG5leHBvcnQgY29uc3QgQ09MT1JfR0VNSU5JID0gXCIjODdDRUVCXCI7XG5cbi8qXG4qIENhbmNlciBjb2xvclxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzI3QUU2MFxuKi9cbmV4cG9ydCBjb25zdCBDT0xPUl9DQU5DRVIgPSBcIiMyN0FFNjBcIjtcblxuLypcbiogTGVvIGNvbG9yXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjRkY0NTAwXG4qL1xuZXhwb3J0IGNvbnN0IENPTE9SX0xFTyA9IFwiI0ZGNDUwMFwiO1xuXG4vKlxuKiBWaXJnbyBjb2xvclxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzhCNDUxM1xuKi9cbmV4cG9ydCBjb25zdCBDT0xPUl9WSVJHTyA9IFwiIzhCNDUxM1wiO1xuXG4vKlxuKiBMaWJyYSBjb2xvclxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzg3Q0VFQlxuKi9cbmV4cG9ydCBjb25zdCBDT0xPUl9MSUJSQSA9IFwiIzg3Q0VFQlwiO1xuXG4vKlxuKiBTY29ycGlvIGNvbG9yXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjMjdBRTYwXG4qL1xuZXhwb3J0IGNvbnN0IENPTE9SX1NDT1JQSU8gPSBcIiMyN0FFNjBcIjtcblxuLypcbiogU2FnaXR0YXJpdXMgY29sb3JcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICNGRjQ1MDBcbiovXG5leHBvcnQgY29uc3QgQ09MT1JfU0FHSVRUQVJJVVMgPSBcIiNGRjQ1MDBcIjtcblxuLypcbiogQ2Fwcmljb3JuIGNvbG9yXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjOEI0NTEzXG4qL1xuZXhwb3J0IGNvbnN0IENPTE9SX0NBUFJJQ09STiA9IFwiIzhCNDUxM1wiO1xuXG4vKlxuKiBBcXVhcml1cyBjb2xvclxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzg3Q0VFQlxuKi9cbmV4cG9ydCBjb25zdCBDT0xPUl9BUVVBUklVUyA9IFwiIzg3Q0VFQlwiO1xuXG4vKlxuKiBQaXNjZXMgY29sb3JcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICMyN0FFNjBcbiovXG5leHBvcnQgY29uc3QgQ09MT1JfUElTQ0VTID0gXCIjMjdBRTYwXCI7XG5cbi8qXG4qIENvbG9yIG9mIGNpcmNsZXMgaW4gY2hhcnRzXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjMzMzXG4qL1xuZXhwb3J0IGNvbnN0IENJUkNMRV9DT0xPUiA9IFwiIzMzM1wiO1xuXG4vKlxuKiBDb2xvciBvZiBhc3BlY3RzXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7T2JqZWN0fVxuKi9cbmV4cG9ydCBjb25zdCBBU1BFQ1RfQ09MT1JTID0ge1xuICAgIENvbmp1bmN0aW9uOiBcIiMzMzNcIixcbiAgICBPcHBvc2l0aW9uOiBcIiMxQjRGNzJcIixcbiAgICBTcXVhcmU6IFwiIzY0MUUxNlwiLFxuICAgIFRyaW5lOiBcIiMwQjUzNDVcIixcbiAgICBTZXh0aWxlOiBcIiMzMzNcIixcbiAgICBRdWluY3VueDogXCIjMzMzXCIsXG4gICAgU2VtaXNleHRpbGU6IFwiIzMzM1wiLFxuICAgIFF1aW50aWxlOiBcIiMzMzNcIixcbiAgICBUcmlvY3RpbGU6IFwiIzMzM1wiXG59XG5cbi8qKlxuICogT3ZlcnJpZGUgaW5kaXZpZHVhbCBwbGFuZXQgc3ltYm9sIGNvbG9ycyBieSBwbGFuZXQgbmFtZVxuICovXG5leHBvcnQgY29uc3QgUExBTkVUX0NPTE9SUyA9IHtcbiAgICAvL1N1bjogXCIjMDAwXCIsXG4gICAgLy9Nb29uOiBcIiNhYWFcIixcbn1cblxuLyoqXG4gKiBvdmVycmlkZSBpbmRpdmlkdWFsIHNpZ24gc3ltYm9sIGNvbG9ycyBieSB6b2RpYWMgaW5kZXhcbiAqL1xuZXhwb3J0IGNvbnN0IFNJR05fQ09MT1JTID0ge1xuICAgIC8vMDogXCIjMzMzXCJcbn1cblxuLyoqXG4gKiBBbGwgc2lnbnMgbGFiZWxzIGluIHRoZSByaWdodCBvcmRlclxuICogQHR5cGUge3N0cmluZ1tdfVxuICovXG5leHBvcnQgY29uc3QgU0lHTl9MQUJFTFMgPSBbXG4gICAgXCJBcmllc1wiLFxuICAgIFwiVGF1cnVzXCIsXG4gICAgXCJHZW1pbmlcIixcbiAgICBcIkNhbmNlclwiLFxuICAgIFwiTGVvXCIsXG4gICAgXCJWaXJnb1wiLFxuICAgIFwiTGlicmFcIixcbiAgICBcIlNjb3JwaW9cIixcbiAgICBcIlNhZ2l0dGFyaXVzXCIsXG4gICAgXCJDYXByaWNvcm5cIixcbiAgICBcIkFxdWFyaXVzXCIsXG4gICAgXCJQaXNjZXNcIixcbl1cblxuLyoqXG4gKiBPdmVycmlkZSBpbmRpdmlkdWFsIHBsYW5ldCBzeW1ib2wgY29sb3JzIGJ5IHBsYW5ldCBuYW1lIG9uIHRyYW5zaXQgY2hhcnRzXG4gKi9cbmV4cG9ydCBjb25zdCBUUkFOU0lUX1BMQU5FVF9DT0xPUlMgPSB7XG4gICAgLy9TdW46IFwiIzAwMFwiLFxuICAgIC8vTW9vbjogXCIjYWFhXCIsXG59XG4iLCIvLyBub2luc3BlY3Rpb24gSlNVbnVzZWRHbG9iYWxTeW1ib2xzXG5cbi8qXG4qIFBvaW50IHByb3BlcnRpZXMgLSBhbmdsZSBpbiBzaWduLCBkaWduaXRpZXMsIHJldHJvZ3JhZGVcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtCb29sZWFufVxuKiBAZGVmYXVsdCB0cnVlXG4qL1xuZXhwb3J0IGNvbnN0IFBPSU5UX1BST1BFUlRJRVNfU0hPVyA9IHRydWVcblxuLypcbiogUG9pbnQgYW5nbGUgaW4gc2lnblxuKiBAY29uc3RhbnRcbiogQHR5cGUge0Jvb2xlYW59XG4qIEBkZWZhdWx0IHRydWVcbiovXG5leHBvcnQgY29uc3QgUE9JTlRfUFJPUEVSVElFU19TSE9XX0FOR0xFID0gdHJ1ZVxuXG4vKipcbiAqIFBvaW50IHNpZ25cbiAqIEB0eXBlIHtib29sZWFufVxuICovXG5leHBvcnQgY29uc3QgUE9JTlRfUFJPUEVSVElFU19TSE9XX1NJR04gPSBmYWxzZVxuXG4vKlxuKiBQb2ludCBkaWduaXR5IHN5bWJvbFxuKiBAY29uc3RhbnRcbiogQHR5cGUge0Jvb2xlYW59XG4qIEBkZWZhdWx0IHRydWVcbiovXG5leHBvcnQgY29uc3QgUE9JTlRfUFJPUEVSVElFU19TSE9XX0RJR05JVFkgPSB0cnVlXG5cbi8qXG4qIFBvaW50IHJldHJvZ3JhZGUgc3ltYm9sXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7Qm9vbGVhbn1cbiogQGRlZmF1bHQgdHJ1ZVxuKi9cbmV4cG9ydCBjb25zdCBQT0lOVF9QUk9QRVJUSUVTX1NIT1dfUkVUUk9HUkFERSA9IHRydWVcblxuLypcbiogUG9pbnQgZGlnbml0eSBzeW1ib2xzIC0gW2RvbWljaWxlLCBkZXRyaW1lbnQsIGV4YWx0YXRpb24sIGZhbGxdXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7Qm9vbGVhbn1cbiogQGRlZmF1bHQgdHJ1ZVxuKi9cbmV4cG9ydCBjb25zdCBQT0lOVF9QUk9QRVJUSUVTX0RJR05JVFlfU1lNQk9MUyA9IFtcInJcIiwgXCJkXCIsIFwiZVwiLCBcImZcIl07XG5cbi8qXG4qIFRleHQgc2l6ZSBvZiBQb2ludCBkZXNjcmlwdGlvbiAtIGFuZ2xlIGluIHNpZ24sIGRpZ25pdGllcywgcmV0cm9ncmFkZVxuKiBAY29uc3RhbnRcbiogQHR5cGUge051bWJlcn1cbiogQGRlZmF1bHQgNlxuKi9cbmV4cG9ydCBjb25zdCBQT0lOVF9QUk9QRVJUSUVTX0ZPTlRfU0laRSA9IDE2XG5cbi8qXG4qIFRleHQgc2l6ZSBvZiBhbmdsZSBudW1iZXJcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtOdW1iZXJ9XG4qIEBkZWZhdWx0IDZcbiovXG5leHBvcnQgY29uc3QgUE9JTlRfUFJPUEVSVElFU19BTkdMRV9TSVpFID0gMjVcblxuLypcbiogVGV4dCBzaXplIG9mIHJldHJvZ3JhZGUgc3ltYm9sXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7TnVtYmVyfVxuKiBAZGVmYXVsdCA2XG4qL1xuZXhwb3J0IGNvbnN0IFBPSU5UX1BST1BFUlRJRVNfUkVUUk9HUkFERV9TSVpFID0gMjVcblxuLypcbiogVGV4dCBzaXplIG9mIGRpZ25pdHkgc3ltYm9sXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7TnVtYmVyfVxuKiBAZGVmYXVsdCA2XG4qL1xuZXhwb3J0IGNvbnN0IFBPSU5UX1BST1BFUlRJRVNfRElHTklUWV9TSVpFID0gMTJcblxuLypcbiogQW5nbGUgb2Zmc2V0IG11bHRpcGxpZXJcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtOdW1iZXJ9XG4qIEBkZWZhdWx0IDZcbiovXG5leHBvcnQgY29uc3QgUE9JTlRfUFJPUEVSVElFU19BTkdMRV9PRkZTRVQgPSAyXG5cbi8qKlxuICogT2Zmc2V0IGZyb20gdGhlIHBsYW5ldFxuICogQHR5cGUge251bWJlcn1cbiAqL1xuZXhwb3J0IGNvbnN0IFBPSU5UX1BST1BFUlRJRVNfU0lHTl9PRkZTRVQgPSAzLjVcblxuLypcbiogUmV0cm9ncmFkZSBzeW1ib2wgb2Zmc2V0IG11bHRpcGxpZXJcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtOdW1iZXJ9XG4qIEBkZWZhdWx0IDZcbiovXG5leHBvcnQgY29uc3QgUE9JTlRfUFJPUEVSVElFU19SRVRST0dSQURFX09GRlNFVCA9IDVcblxuLypcbiogRGlnbml0eSBzeW1ib2wgb2Zmc2V0IG11bHRpcGxpZXJcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtOdW1iZXJ9XG4qIEBkZWZhdWx0IDZcbiovXG5leHBvcnQgY29uc3QgUE9JTlRfUFJPUEVSVElFU19ESUdOSVRZX09GRlNFVCA9IDZcblxuLyoqXG4gKiBBIHBvaW50IGNvbGxpc2lvbiByYWRpdXNcbiAqIEBjb25zdGFudFxuICogQHR5cGUge051bWJlcn1cbiAqIEBkZWZhdWx0IDJcbiAqL1xuZXhwb3J0IGNvbnN0IFBPSU5UX0NPTExJU0lPTl9SQURJVVMgPSAxMlxuXG4vKipcbiAqIFR3ZWFrIHRoZSBhbmdsZSBzdHJpbmcsIGUuZy4gYWRkIHRoZSBkZWdyZWUgc3ltYm9sOiBcIiR7YW5nbGV9wrBcIlxuICogQHR5cGUge3N0cmluZ31cbiAqL1xuZXhwb3J0IGNvbnN0IEFOR0xFX1RFTVBMQVRFID0gXCIke2FuZ2xlfVwiXG5cblxuLyoqXG4gKiBDbGFzc2VzIGZvciBwb2ludHNcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG4vKipcbiAqIENsYXNzIGZvciBDZWxlc3RpYWwgQm9kaWVzIChQbGFuZXQgLyBBc3RlcmlvZClcbiAqIGFuZCBDZWxlc3RpYWwgUG9pbnRzIChub3J0aG5vZGUsIHNvdXRobm9kZSwgbGlsaXRoKVxuICogQHR5cGUge3N0cmluZ31cbiAqL1xuZXhwb3J0IGNvbnN0IENMQVNTX0NFTEVTVElBTCA9ICcnO1xuZXhwb3J0IGNvbnN0IENMQVNTX1BPSU5UX0FOR0xFID0gJyc7XG5leHBvcnQgY29uc3QgQ0xBU1NfUE9JTlRfU0lHTiA9ICcnO1xuZXhwb3J0IGNvbnN0IENMQVNTX1BPSU5UX1JFVFJPR1JBREUgPSAnJztcbmV4cG9ydCBjb25zdCBDTEFTU19QT0lOVF9ESUdOSVRZID0gJyc7XG5cbi8qKlxuICogQWRkIGEgc3Ryb2tlIGFyb3VuZCBhbGwgcG9pbnRzXG4gKi9cbmV4cG9ydCBjb25zdCBQT0lOVF9TVFJPS0UgPSBmYWxzZTtcbmV4cG9ydCBjb25zdCBQT0lOVF9TVFJPS0VfQ09MT1IgPSAnI2ZmZic7XG5leHBvcnQgY29uc3QgUE9JTlRfU1RST0tFX1dJRFRIID0gMjtcblxuZXhwb3J0IGNvbnN0IFBPSU5UX1BST1BFUlRJRVNfU0lHTl9DT0xPUiA9IG51bGw7IiwiLy8gbm9pbnNwZWN0aW9uIEpTVW51c2VkR2xvYmFsU3ltYm9sc1xuXG4vKlxuKiBSYWRpeCBjaGFydCBlbGVtZW50IElEXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCByYWRpeFxuKi9cbmV4cG9ydCBjb25zdCBSQURJWF9JRCA9IFwicmFkaXhcIlxuXG4vKlxuKiBGb250IHNpemUgLSBwb2ludHMgKHBsYW5ldHMpXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7TnVtYmVyfVxuKiBAZGVmYXVsdCAyN1xuKi9cbmV4cG9ydCBjb25zdCBSQURJWF9QT0lOVFNfRk9OVF9TSVpFID0gMjdcblxuLypcbiogRm9udCBzaXplIC0gaG91c2UgY3VzcCBudW1iZXJcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtOdW1iZXJ9XG4qIEBkZWZhdWx0IDI3XG4qL1xuZXhwb3J0IGNvbnN0IFJBRElYX0hPVVNFX0ZPTlRfU0laRSA9IDIwXG5cbi8qXG4qIEZvbnQgc2l6ZSAtIHNpZ25zXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7TnVtYmVyfVxuKiBAZGVmYXVsdCAyN1xuKi9cbmV4cG9ydCBjb25zdCBSQURJWF9TSUdOU19GT05UX1NJWkUgPSAyN1xuXG4vKlxuKiBGb250IHNpemUgLSBheGlzIChBcywgRHMsIE1jLCBJYylcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtOdW1iZXJ9XG4qIEBkZWZhdWx0IDI0XG4qL1xuZXhwb3J0IGNvbnN0IFJBRElYX0FYSVNfRk9OVF9TSVpFID0gMzJcblxuXG5leHBvcnQgY29uc3QgU1lNQk9MX1NUUk9LRSA9IGZhbHNlXG5leHBvcnQgY29uc3QgU1lNQk9MX1NUUk9LRV9DT0xPUiA9ICcjRkZGJ1xuZXhwb3J0IGNvbnN0IFNZTUJPTF9TVFJPS0VfV0lEVEggPSAnNCdcblxuZXhwb3J0IGNvbnN0IFNJR05fQ09MT1JfQ0lSQ0xFID0gbnVsbFxuXG4vKipcbiAqIEFkZCA8dGl0bGU+PC90aXRsZT4gZWxlbWVudHMgaW4gdGhlIFNWR1xuICogQHR5cGUge2Jvb2xlYW59XG4gKi9cbmV4cG9ydCBjb25zdCBJTlNFUlRfRUxFTUVOVF9USVRMRSA9IHRydWVcblxuZXhwb3J0IGNvbnN0IEVMRU1FTlRfVElUTEVTID0ge1xuICAgIFwiYXhpc1wiOiB7XG4gICAgICAgIFwiQXNcIjogXCJBc2NlbmRhbnRcIixcbiAgICAgICAgXCJNY1wiOiBcIk1pZGhlYXZlblwiLFxuICAgICAgICBcIkRzXCI6IFwiRGVzY2VuZGFudFwiLFxuICAgICAgICBcIkljXCI6IFwiSW11bSBDb2VsaVwiLFxuICAgIH0sXG4gICAgXCJzaWduc1wiOiB7XG4gICAgICAgIFwiYXJpZXNcIjogXCJBcmllc1wiLFxuICAgICAgICBcInRhdXJ1c1wiOiBcIlRhdXJ1c1wiLFxuICAgICAgICBcImdlbWluaVwiOiBcIkdlbWluaVwiLFxuICAgICAgICBcImNhbmNlclwiOiBcIkNhbmNlclwiLFxuICAgICAgICBcImxlb1wiOiBcIkxlb1wiLFxuICAgICAgICBcInZpcmdvXCI6IFwiVmlyZ29cIixcbiAgICAgICAgXCJsaWJyYVwiOiBcIkxpYnJhXCIsXG4gICAgICAgIFwic2NvcnBpb1wiOiBcIlNjb3JwaW9cIixcbiAgICAgICAgXCJzYWdpdHRhcml1c1wiOiBcIlNhZ2l0dGFyaXVzXCIsXG4gICAgICAgIFwiY2Fwcmljb3JuXCI6IFwiQ2Fwcmljb3JuXCIsXG4gICAgICAgIFwiYXF1YXJpdXNcIjogXCJBcXVhcml1c1wiLFxuICAgICAgICBcInBpc2Nlc1wiOiBcIlBpc2Nlc1wiXG4gICAgfSxcbiAgICBcInBvaW50c1wiOiB7XG4gICAgICAgIFwic3VuXCI6IFwiU3VuXCIsXG4gICAgICAgIFwibW9vblwiOiBcIk1vb25cIixcbiAgICAgICAgXCJtZXJjdXJ5XCI6IFwiTWVyY3VyeVwiLFxuICAgICAgICBcInZlbnVzXCI6IFwiVmVudXNcIixcbiAgICAgICAgXCJlYXJ0aFwiOiBcIkVhcnRoXCIsXG4gICAgICAgIFwibWFyc1wiOiBcIk1hcnNcIixcbiAgICAgICAgXCJqdXBpdGVyXCI6IFwiSnVwaXRlclwiLFxuICAgICAgICBcInNhdHVyblwiOiBcIlNhdHVyblwiLFxuICAgICAgICBcInVyYW51c1wiOiBcIlVyYW51c1wiLFxuICAgICAgICBcIm5lcHR1bmVcIjogXCJOZXB0dW5lXCIsXG4gICAgICAgIFwicGx1dG9cIjogXCJQbHV0b1wiLFxuICAgICAgICBcImNoaXJvblwiOiBcIkNoaXJvblwiLFxuICAgICAgICBcImxpbGl0aFwiOiBcIkxpbGl0aFwiLFxuICAgICAgICBcIm5ub2RlXCI6IFwiTm9ydGggTm9kZVwiLFxuICAgICAgICBcInNub2RlXCI6IFwiU291dGggTm9kZVwiXG4gICAgfSxcbiAgICBcInJldHJvZ3JhZGVcIjogXCJSZXRyb2dyYWRlXCIsXG4gICAgXCJhc3BlY3RzXCI6IHtcbiAgICAgICAgXCJjb25qdW5jdGlvblwiOiBcIkNvbmp1bmN0aW9uXCIsXG4gICAgICAgIFwib3Bwb3NpdGlvblwiOiBcIk9wcG9zaXRpb25cIixcbiAgICAgICAgXCJzcXVhcmVcIjogXCJTcXVhcmVcIixcbiAgICAgICAgXCJ0cmluZVwiOiBcIlRyaW5lXCIsXG4gICAgICAgIFwic2V4dGlsZVwiOiBcIlNleHRpbGVcIixcbiAgICAgICAgXCJxdWluY3VueFwiOiBcIlF1aW5jdW54XCIsXG4gICAgICAgIFwic2VtaS1zZXh0aWxlXCI6IFwiU2VtaS1zZXh0aWxlXCIsXG4gICAgICAgIFwic2VtaS1zcXVhcmVcIjogXCJTZW1pLXNxdWFyZVwiLFxuICAgICAgICBcIm9jdGlsZVwiOiBcIk9jdGlsZVwiLFxuICAgICAgICBcInNlc3F1aXNxdWFyZVwiOiBcIlNlc3F1aXNxdWFyZVwiLFxuICAgICAgICBcInRyaW9jdGlsZVwiOiBcIlRyaW9jdGlsZVwiLFxuICAgICAgICBcInF1aW50aWxlXCI6IFwiUXVpbnRpbGVcIixcbiAgICAgICAgXCJiaXF1aW50aWxlXCI6IFwiQmlxdWludGlsZVwiLFxuICAgICAgICBcInNlbWktcXVpbnRpbGVcIjogXCJTZW1pLXF1aW50aWxlXCIsXG4gICAgfSxcbiAgICAnY3VzcHMnOiB7XG4gICAgICAgIDE6IFwiSWRlbnRpdMOpIDogaW1hZ2UgZGUgc29pLCBwZXJzb25uYWxpdMOpLCBhcHBhcmVuY2UgcGh5c2lxdWVcIixcbiAgICAgICAgMjogXCJSZXNzb3VyY2VzIDogYXJnZW50LCBiaWVucywgc8OpY3VyaXTDqSBtYXTDqXJpZWxsZSwgdGFsZW50c1wiLFxuICAgICAgICAzOiBcIkNvbW11bmljYXRpb24gOiBlc3ByaXQsIMOpY2hhbmdlcywgZnLDqHJlcyBldCBzxZN1cnMsIGTDqXBsYWNlbWVudHNcIixcbiAgICAgICAgNDogXCJPcmlnaW5lcyA6IGZhbWlsbGUsIHJhY2luZXMsIGZveWVyLCBpbnRpbWl0w6lcIixcbiAgICAgICAgNTogXCJFeHByZXNzaW9uIDogY3LDqWF0aXZpdMOpLCBlbmZhbnRzLCBsb2lzaXJzLCBhbW91cnNcIixcbiAgICAgICAgNjogXCJRdW90aWRpZW4gOiB0cmF2YWlsLCBzYW50w6ksIHJvdXRpbmVzLCBzZXJ2aWNlXCIsXG4gICAgICAgIDc6IFwiUmVsYXRpb25zIDogY291cGxlLCBwYXJ0ZW5hcmlhdHMsIGNvbnRyYXRzLCBlbm5lbWlzIGTDqWNsYXLDqXNcIixcbiAgICAgICAgODogXCJUcmFuc2Zvcm1hdGlvbiA6IGNyaXNlcywgc2V4dWFsaXTDqSwgaMOpcml0YWdlcywgcG91dm9pciBwYXJ0YWfDqVwiLFxuICAgICAgICA5OiBcIkV4cGFuc2lvbiA6IHZveWFnZXMsIHNwaXJpdHVhbGl0w6ksIMOpdHVkZXMgc3Vww6lyaWV1cmVzLCBjcm95YW5jZXNcIixcbiAgICAgICAgMTA6IFwiUsOpYWxpc2F0aW9uIDogY2FycmnDqHJlLCBpbWFnZSBwdWJsaXF1ZSwgdm9jYXRpb25cIixcbiAgICAgICAgMTE6IFwiQ29sbGVjdGlmIDogYW1pcywgcHJvamV0cywgY2F1c2VzIHNvY2lhbGVzLCByw6lzZWF1eFwiLFxuICAgICAgICAxMjogXCJJbnTDqXJpb3JpdMOpIDogaW5jb25zY2llbnQsIHNvbGl0dWRlLCBzZWNyZXRzLCBsaW1pdGF0aW9uc1wiXG4gICAgfVxufSIsIi8vIG5vaW5zcGVjdGlvbiBKU1VudXNlZEdsb2JhbFN5bWJvbHNcblxuLypcbiogVHJhbnNpdCBjaGFydCBlbGVtZW50IElEXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCB0cmFuc2l0XG4qL1xuZXhwb3J0IGNvbnN0IFRSQU5TSVRfSUQgPSBcInRyYW5zaXRcIlxuXG4vKlxuKiBGb250IHNpemUgLSBwb2ludHMgKHBsYW5ldHMpXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7TnVtYmVyfVxuKiBAZGVmYXVsdCAzMlxuKi9cbmV4cG9ydCBjb25zdCBUUkFOU0lUX1BPSU5UU19GT05UX1NJWkUgPSAyN1xuIiwiLy8gbm9pbnNwZWN0aW9uIEpTVW51c2VkR2xvYmFsU3ltYm9sc1xuXG4vKipcbiAqIENoYXJ0IHBhZGRpbmdcbiAqIEBjb25zdGFudFxuICogQHR5cGUge051bWJlcn1cbiAqIEBkZWZhdWx0IDEwcHhcbiAqL1xuZXhwb3J0IGNvbnN0IENIQVJUX1BBRERJTkcgPSA0MFxuXG4vKipcbiAqIFNWRyB2aWV3Qm94IHdpZHRoXG4gKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL1NWRy9BdHRyaWJ1dGUvdmlld0JveFxuICogQGNvbnN0YW50XG4gKiBAdHlwZSB7TnVtYmVyfVxuICogQGRlZmF1bHQgODAwXG4gKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9WSUVXQk9YX1dJRFRIID0gODAwXG5cbi8qKlxuICogU1ZHIHZpZXdCb3ggaGVpZ2h0XG4gKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL1NWRy9BdHRyaWJ1dGUvdmlld0JveFxuICogQGNvbnN0YW50XG4gKiBAdHlwZSB7TnVtYmVyfVxuICogQGRlZmF1bHQgODAwXG4gKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9WSUVXQk9YX0hFSUdIVCA9IDgwMFxuXG4vKipcbiAqIENoYW5nZSB0aGUgc2l6ZSBvZiB0aGUgY2VudGVyIGNpcmNsZSwgd2hlcmUgYXNwZWN0cyBhcmVcbiAqIEB0eXBlIHtudW1iZXJ9XG4gKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9DRU5URVJfU0laRSA9IDFcblxuLypcbiogTGluZSBzdHJlbmd0aFxuKiBAY29uc3RhbnRcbiogQHR5cGUge051bWJlcn1cbiogQGRlZmF1bHQgMVxuKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9TVFJPS0UgPSAxXG5cbi8qXG4qIExpbmUgc3RyZW5ndGggb2YgdGhlIG1haW4gbGluZXMuIEZvciBpbnN0YW5jZSBwb2ludHMsIG1haW4gYXhpcywgbWFpbiBjaXJjbGVzXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7TnVtYmVyfVxuKiBAZGVmYXVsdCAxXG4qL1xuZXhwb3J0IGNvbnN0IENIQVJUX01BSU5fU1RST0tFID0gMlxuXG4vKipcbiAqIExpbmUgc3RyZW5ndGggZm9yIG1pbm9yIGFzcGVjdHNcbiAqXG4gKiBAdHlwZSB7bnVtYmVyfVxuICovXG5leHBvcnQgY29uc3QgQ0hBUlRfU1RST0tFX01JTk9SX0FTUEVDVCA9IDFcblxuLyoqXG4gKiBObyBmaWxsLCBvbmx5IHN0cm9rZVxuICogQGNvbnN0YW50XG4gKiBAdHlwZSB7Ym9vbGVhbn1cbiAqIEBkZWZhdWx0IGZhbHNlXG4gKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9TVFJPS0VfT05MWSA9IGZhbHNlO1xuXG4vKipcbiAqIEZvbnQgZmFtaWx5XG4gKiBAY29uc3RhbnRcbiAqIEB0eXBlIHtTdHJpbmd9XG4gKiBAZGVmYXVsdFxuICovXG5leHBvcnQgY29uc3QgQ0hBUlRfRk9OVF9GQU1JTFkgPSBcIkFzdHJvbm9taWNvblwiO1xuXG4vKipcbiAqIEFsd2F5cyBkcmF3IHRoZSBmdWxsIGhvdXNlIGxpbmVzLCBldmVuIGlmIGl0IG92ZXJsYXBzIHdpdGggcGxhbmV0c1xuICogQGNvbnN0YW50XG4gKiBAdHlwZSB7Ym9vbGVhbn1cbiAqIEBkZWZhdWx0IGZhbHNlXG4gKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9BTExPV19IT1VTRV9PVkVSTEFQID0gZmFsc2U7XG5cbi8qKlxuICogRHJhdyBtYWlucyBheGlzIHN5bWJvbHMgb3V0c2lkZSB0aGUgY2hhcnQ6IEFjLCBNYywgSWMsIERjXG4gKiBAY29uc3RhbnRcbiAqIEB0eXBlIHtib29sZWFufVxuICogQGRlZmF1bHQgZmFsc2VcbiAqL1xuZXhwb3J0IGNvbnN0IENIQVJUX0RSQVdfTUFJTl9BWElTID0gdHJ1ZTtcblxuXG4vKipcbiAqIFN0cm9rZSAmIGZpbGxcbiAqIEBjb25zdGFudFxuICogQHR5cGUge2Jvb2xlYW59XG4gKiBAZGVmYXVsdCBmYWxzZVxuICovXG5leHBvcnQgY29uc3QgQ0hBUlRfU1RST0tFX1dJVEhfQ09MT1IgPSBmYWxzZTtcblxuXG4vKipcbiAqIEFsbCBjbGFzc25hbWVzXG4gKi9cblxuLyoqXG4gKiBDbGFzcyBmb3IgdGhlIHNpZ24gc2VnbWVudCwgYmVoaW5kIHRoZSBhY3R1YWwgc2lnblxuICogQHR5cGUge3N0cmluZ31cbiAqL1xuZXhwb3J0IGNvbnN0IENMQVNTX1NJR05fU0VHTUVOVCA9ICcnO1xuXG4vKipcbiAqIENsYXNzIGZvciB0aGUgc2lnblxuICogSWYgbm90IGVtcHR5LCBhbm90aGVyIGNsYXNzIHdpbGwgYmUgYWRkZWQgdXNpbmcgc2FtZSBzdHJpbmcsIHdpdGggYSBtb2RpZmllciBsaWtlIC0tc2lnbl9uYW1lXG4gKiBAdHlwZSB7c3RyaW5nfVxuICovXG5leHBvcnQgY29uc3QgQ0xBU1NfU0lHTiA9ICcnO1xuXG4vKipcbiAqIENsYXNzIGZvciBheGlzIEFzY2VuZGFudCwgTWlkaGVhdmVuLCBEZXNjZW5kYW50IGFuZCBJbXVtIENvZWxpXG4gKiBJZiBub3QgZW1wdHksIGFub3RoZXIgY2xhc3Mgd2lsbCBiZSBhZGRlZCB1c2luZyBzYW1lIHN0cmluZywgd2l0aCBhIG1vZGlmaWVyIGxpa2UgLS1heGlzX25hbWVcbiAqIEB0eXBlIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBjb25zdCBDTEFTU19BWElTID0gJyc7XG5cbi8qKlxuICogQ2xhc3MgZm9yIHRoZSBhc3BlY3QgY2hhcmFjdGVyXG4gKiBAdHlwZSB7c3RyaW5nfVxuICovXG5leHBvcnQgY29uc3QgQ0xBU1NfU0lHTl9BU1BFQ1QgPSAnJztcblxuLyoqXG4gKiBDbGFzcyBmb3IgYXNwZWN0IGxpbmVzXG4gKiBAdHlwZSB7c3RyaW5nfVxuICovXG5leHBvcnQgY29uc3QgQ0xBU1NfU0lHTl9BU1BFQ1RfTElORSA9ICcnO1xuXG4vKipcbiAqIFVzZSBwbGFuZXQgY29sb3IgZm9yIHRoZSBjaGFydCBsaW5lIG5leHQgdG8gYSBwbGFuZXRcbiAqIEB0eXBlIHtib29sZWFufVxuICovXG5leHBvcnQgY29uc3QgUExBTkVUX0xJTkVfVVNFX1BMQU5FVF9DT0xPUiA9IGZhbHNlO1xuXG4vKipcbiAqIERyYXcgYSBydWxlciBtYXJrICh0aW55IHNxdWFyZSkgYXQgcGxhbmV0IHBvc2l0aW9uXG4gKi9cbmV4cG9ydCBjb25zdCBEUkFXX1JVTEVSX01BUksgPSB0cnVlO1xuXG5leHBvcnQgY29uc3QgRk9OVF9BU1RST05PTUlDT05fTE9BRCA9IHRydWU7XG5leHBvcnQgY29uc3QgRk9OVF9BU1RST05PTUlDT05fUEFUSCA9ICcuLi9hc3NldHMvZm9udHMvdHRmL0FzdHJvbm9taWNvbkZvbnRzXzEuMS9Bc3Ryb25vbWljb24udHRmJzsiLCJpbXBvcnQgRGVmYXVsdFNldHRpbmdzIGZyb20gJy4uL3NldHRpbmdzL0RlZmF1bHRTZXR0aW5ncy5qcyc7XG5pbXBvcnQgU1ZHVXRpbHMgZnJvbSAnLi4vdXRpbHMvU1ZHVXRpbHMuanMnO1xuaW1wb3J0IFJhZGl4Q2hhcnQgZnJvbSAnLi4vY2hhcnRzL1JhZGl4Q2hhcnQuanMnO1xuaW1wb3J0IFRyYW5zaXRDaGFydCBmcm9tICcuLi9jaGFydHMvVHJhbnNpdENoYXJ0LmpzJztcblxuXG4vKipcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyBBbiB3cmFwcGVyIGZvciBhbGwgcGFydHMgb2YgZ3JhcGguXG4gKiBAcHVibGljXG4gKi9cbmNsYXNzIFVuaXZlcnNlIHtcblxuICAgICNTVkdEb2N1bWVudFxuICAgICNzZXR0aW5nc1xuICAgICNyYWRpeFxuICAgICN0cmFuc2l0XG4gICAgI2FzcGVjdHNXcmFwcGVyXG5cbiAgICAvKipcbiAgICAgKiBAY29uc3RydWN0c1xuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBodG1sRWxlbWVudElEIC0gSUQgb2YgdGhlIHJvb3QgZWxlbWVudCB3aXRob3V0IHRoZSAjIHNpZ25cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIC0gQW4gb2JqZWN0IHRoYXQgb3ZlcnJpZGVzIHRoZSBkZWZhdWx0IHNldHRpbmdzIHZhbHVlc1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGh0bWxFbGVtZW50SUQsIG9wdGlvbnMgPSB7fSkge1xuXG4gICAgICAgIGlmICh0eXBlb2YgaHRtbEVsZW1lbnRJRCAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQSByZXF1aXJlZCBwYXJhbWV0ZXIgaXMgbWlzc2luZy4nKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCEgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaHRtbEVsZW1lbnRJRCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fub3QgZmluZCBhIEhUTUwgZWxlbWVudCB3aXRoIElEICcgKyBodG1sRWxlbWVudElEKVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy4jc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKHt9LCBEZWZhdWx0U2V0dGluZ3MsIG9wdGlvbnMsIHtcbiAgICAgICAgICAgIEhUTUxfRUxFTUVOVF9JRDogaHRtbEVsZW1lbnRJRFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy4jU1ZHRG9jdW1lbnQgPSBTVkdVdGlscy5TVkdEb2N1bWVudCh0aGlzLiNzZXR0aW5ncy5DSEFSVF9WSUVXQk9YX1dJRFRILCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9WSUVXQk9YX0hFSUdIVClcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaHRtbEVsZW1lbnRJRCkuYXBwZW5kQ2hpbGQodGhpcy4jU1ZHRG9jdW1lbnQpO1xuXG4gICAgICAgIC8vIGNoYXJ0IGJhY2tncm91bmRcbiAgICAgICAgY29uc3QgYmFja2dyb3VuZEdyb3VwID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuICAgICAgICBiYWNrZ3JvdW5kR3JvdXAuY2xhc3NMaXN0LmFkZCgnYy1iYWNrZ3JvdW5kcycpXG4gICAgICAgIGNvbnN0IGNpcmNsZSA9IFNWR1V0aWxzLlNWR0NpcmNsZSh0aGlzLiNzZXR0aW5ncy5DSEFSVF9WSUVXQk9YX1dJRFRIIC8gMiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfVklFV0JPWF9IRUlHSFQgLyAyLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9WSUVXQk9YX1dJRFRIIC8gMilcbiAgICAgICAgY2lyY2xlLnNldEF0dHJpYnV0ZSgnZmlsbCcsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0JBQ0tHUk9VTkRfQ09MT1IpXG4gICAgICAgIGNpcmNsZS5jbGFzc0xpc3QuYWRkKCdjLWNoYXJ0LWJhY2tncm91bmQnKTtcbiAgICAgICAgYmFja2dyb3VuZEdyb3VwLmFwcGVuZENoaWxkKGNpcmNsZSlcbiAgICAgICAgdGhpcy4jU1ZHRG9jdW1lbnQuYXBwZW5kQ2hpbGQoYmFja2dyb3VuZEdyb3VwKVxuXG4gICAgICAgIC8vIGNyZWF0ZSB3cmFwcGVyIGZvciBhc3BlY3RzXG4gICAgICAgIHRoaXMuI2FzcGVjdHNXcmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuICAgICAgICB0aGlzLiNhc3BlY3RzV3JhcHBlci5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBgJHt0aGlzLiNzZXR0aW5ncy5IVE1MX0VMRU1FTlRfSUR9LSR7dGhpcy4jc2V0dGluZ3MuQVNQRUNUU19JRH1gKVxuICAgICAgICB0aGlzLiNTVkdEb2N1bWVudC5hcHBlbmRDaGlsZCh0aGlzLiNhc3BlY3RzV3JhcHBlcilcblxuICAgICAgICB0aGlzLiNyYWRpeCA9IG5ldyBSYWRpeENoYXJ0KHRoaXMpXG4gICAgICAgIHRoaXMuI3RyYW5zaXQgPSBuZXcgVHJhbnNpdENoYXJ0KHRoaXMuI3JhZGl4KVxuXG4gICAgICAgIGlmICh0aGlzLiNzZXR0aW5ncy5GT05UX0FTVFJPTk9NSUNPTl9MT0FEKSB7XG4gICAgICAgICAgICB0aGlzLiNsb2FkRm9udChcIkFzdHJvbm9taWNvblwiLCB0aGlzLiNzZXR0aW5ncy5GT05UX0FTVFJPTk9NSUNPTl9QQVRIKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICAvLyAjIyBQVUJMSUMgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiAgICAvKipcbiAgICAgKiBHZXQgUmFkaXggY2hhcnRcbiAgICAgKiBAcmV0dXJuIHtSYWRpeENoYXJ0fVxuICAgICAqL1xuICAgIHJhZGl4KCkge1xuICAgICAgICByZXR1cm4gdGhpcy4jcmFkaXhcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgVHJhbnNpdCBjaGFydFxuICAgICAqIEByZXR1cm4ge1RyYW5zaXRDaGFydH1cbiAgICAgKi9cbiAgICB0cmFuc2l0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy4jdHJhbnNpdFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBjdXJyZW50IHNldHRpbmdzXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIGdldFNldHRpbmdzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy4jc2V0dGluZ3NcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgcm9vdCBTVkcgZG9jdW1lbnRcbiAgICAgKiBAcmV0dXJuIHtTVkdEb2N1bWVudH1cbiAgICAgKi9cbiAgICBnZXRTVkdEb2N1bWVudCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI1NWR0RvY3VtZW50XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IGVtcHR5IGFzcGVjdHMgd3JhcHBlciBlbGVtZW50XG4gICAgICogQHJldHVybiB7U1ZHR3JvdXBFbGVtZW50fVxuICAgICAqL1xuICAgIGdldEFzcGVjdHNFbGVtZW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy4jYXNwZWN0c1dyYXBwZXJcbiAgICB9XG5cbiAgICAvLyAjIyBQUklWQVRFICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gICAgLypcbiAgICAqIExvYWQgZm9uZCB0byBET01cbiAgICAqXG4gICAgKiBAcGFyYW0ge1N0cmluZ30gZmFtaWx5XG4gICAgKiBAcGFyYW0ge1N0cmluZ30gc291cmNlXG4gICAgKiBAcGFyYW0ge09iamVjdH1cbiAgICAqXG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9Gb250RmFjZS9Gb250RmFjZVxuICAgICovXG4gICAgYXN5bmMgI2xvYWRGb250KGZhbWlseSwgc291cmNlLCBkZXNjcmlwdG9ycykge1xuXG4gICAgICAgIGlmICghICgnRm9udEZhY2UnIGluIHdpbmRvdykpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJPb29wcywgRm9udEZhY2UgaXMgbm90IGEgZnVuY3Rpb24uXCIpXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiQHNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvQ1NTX0ZvbnRfTG9hZGluZ19BUElcIilcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZm9udCA9IG5ldyBGb250RmFjZShmYW1pbHksIGB1cmwoJHtzb3VyY2V9KWAsIGRlc2NyaXB0b3JzKVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhd2FpdCBmb250LmxvYWQoKTtcbiAgICAgICAgICAgIGRvY3VtZW50LmZvbnRzLmFkZChmb250KVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZSlcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IHtcbiAgICBVbml2ZXJzZSBhc1xuICAgICAgICBkZWZhdWx0XG59XG4iLCJpbXBvcnQgVXRpbHMgZnJvbSAnLi9VdGlscy5qcydcbmltcG9ydCBTVkdVdGlscyBmcm9tICcuL1NWR1V0aWxzLmpzJztcblxuLyoqXG4gKiBAY2xhc3NcbiAqIEBjbGFzc2Rlc2MgVXRpbGl0eSBjbGFzc1xuICogQHB1YmxpY1xuICogQHN0YXRpY1xuICogQGhpZGVjb25zdHJ1Y3RvclxuICovXG5jbGFzcyBBc3BlY3RVdGlscyB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgaWYgKHRoaXMgaW5zdGFuY2VvZiBBc3BlY3RVdGlscykge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoJ1RoaXMgaXMgYSBzdGF0aWMgY2xhc3MgYW5kIGNhbm5vdCBiZSBpbnN0YW50aWF0ZWQuJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDYWxjdWxhdGVzIHRoZSBvcmJpdCBvZiB0d28gYW5nbGVzIG9uIGEgY2lyY2xlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gZnJvbUFuZ2xlIC0gYW5nbGUgaW4gZGVncmVlLCBwb2ludCBvbiB0aGUgY2lyY2xlXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHRvQW5nbGUgLSBhbmdsZSBpbiBkZWdyZWUsIHBvaW50IG9uIHRoZSBjaXJjbGVcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gYXNwZWN0QW5nbGUgLSA2MCw5MCwxMjAsIC4uLlxuICAgICAqXG4gICAgICogQHJldHVybiB7TnVtYmVyfSBvcmJcbiAgICAgKi9cbiAgICBzdGF0aWMgb3JiKGZyb21BbmdsZSwgdG9BbmdsZSwgYXNwZWN0QW5nbGUpIHtcbiAgICAgICAgbGV0IG9yYlxuICAgICAgICBsZXQgc2lnbiA9IGZyb21BbmdsZSA+IHRvQW5nbGUgPyAxIDogLTFcbiAgICAgICAgbGV0IGRpZmZlcmVuY2UgPSBNYXRoLmFicyhmcm9tQW5nbGUgLSB0b0FuZ2xlKVxuXG4gICAgICAgIGlmIChkaWZmZXJlbmNlID4gVXRpbHMuREVHXzE4MCkge1xuICAgICAgICAgICAgZGlmZmVyZW5jZSA9IFV0aWxzLkRFR18zNjAgLSBkaWZmZXJlbmNlO1xuICAgICAgICAgICAgb3JiID0gKGRpZmZlcmVuY2UgLSBhc3BlY3RBbmdsZSkgKiAtMVxuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvcmIgPSAoZGlmZmVyZW5jZSAtIGFzcGVjdEFuZ2xlKSAqIHNpZ25cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBOdW1iZXIoTnVtYmVyKG9yYikudG9GaXhlZCgyKSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgYXNwZWN0c1xuICAgICAqXG4gICAgICogQHBhcmFtIHtBcnJheTxPYmplY3Q+fSBmcm9tUG9pbnRzIC0gW3tuYW1lOlwiTW9vblwiLCBhbmdsZTowfSwge25hbWU6XCJTdW5cIiwgYW5nbGU6MTc5fSwge25hbWU6XCJNZXJjdXJ5XCIsIGFuZ2xlOjEyMX1dXG4gICAgICogQHBhcmFtIHtBcnJheTxPYmplY3Q+fSB0b1BvaW50cyAtIFt7bmFtZTpcIkFTXCIsIGFuZ2xlOjB9LCB7bmFtZTpcIklDXCIsIGFuZ2xlOjkwfV1cbiAgICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IGFzcGVjdHMgLSBbe25hbWU6XCJPcHBvc2l0aW9uXCIsIGFuZ2xlOjE4MCwgb3JiOjJ9LCB7bmFtZTpcIlRyaW5lXCIsIGFuZ2xlOjEyMCwgb3JiOjJ9XVxuICAgICAqXG4gICAgICogQHJldHVybiB7QXJyYXk8T2JqZWN0Pn1cbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0QXNwZWN0cyhmcm9tUG9pbnRzLCB0b1BvaW50cywgYXNwZWN0cykge1xuICAgICAgICBjb25zdCBhc3BlY3RMaXN0ID0gW11cbiAgICAgICAgZm9yIChjb25zdCBmcm9tUCBvZiBmcm9tUG9pbnRzKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHRvUCBvZiB0b1BvaW50cykge1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgYXNwZWN0IG9mIGFzcGVjdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3JiID0gQXNwZWN0VXRpbHMub3JiKGZyb21QLmFuZ2xlLCB0b1AuYW5nbGUsIGFzcGVjdC5hbmdsZSlcbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIFVzZSBjdXN0b20gb3JicyBpZiBhdmFpbGFibGU6XG4gICAgICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICAgICAqIERFRkFVTFRfQVNQRUNUUzogW1xuICAgICAgICAgICAgICAgICAgICAgKiAgICAgICAgICAgICB7bmFtZTogXCJDb25qdW5jdGlvblwiLCBhbmdsZTogMCwgb3JiOiA0LCBvcmJzOiB7J1N1bic6IDEwfSwgaXNNYWpvcjogdHJ1ZX0sXG4gICAgICAgICAgICAgICAgICAgICAqICAgICAgICAgICAgIC4uLlxuICAgICAgICAgICAgICAgICAgICAgKiAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICBsZXQgb3JiTGltaXQgPSAoKGFzcGVjdC5vcmJzPy5bZnJvbVAubmFtZV0gPz8gYXNwZWN0Lm9yYikgKyAoYXNwZWN0Lm9yYnM/Llt0b1AubmFtZV0gPz8gYXNwZWN0Lm9yYikpIC8gMlxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyhvcmIpIDw9IG9yYkxpbWl0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhc3BlY3RMaXN0LnB1c2goe2FzcGVjdDogYXNwZWN0LCBmcm9tOiBmcm9tUCwgdG86IHRvUCwgcHJlY2lzaW9uOiBvcmJ9KVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGFzcGVjdExpc3RcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEcmF3IGFzcGVjdHNcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSByYWRpdXNcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gYXNjZW5kYW50U2hpZnRcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gc2V0dGluZ3NcbiAgICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IGFzcGVjdHNMaXN0XG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtTVkdHcm91cEVsZW1lbnR9XG4gICAgICovXG4gICAgc3RhdGljIGRyYXdBc3BlY3RzKHJhZGl1cywgYXNjZW5kYW50U2hpZnQsIHNldHRpbmdzLCBhc3BlY3RzTGlzdCkge1xuICAgICAgICBjb25zdCBjZW50ZXJYID0gc2V0dGluZ3MuQ0hBUlRfVklFV0JPWF9XSURUSCAvIDJcbiAgICAgICAgY29uc3QgY2VudGVyWSA9IHNldHRpbmdzLkNIQVJUX1ZJRVdCT1hfSEVJR0hUIC8gMlxuXG4gICAgICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG4gICAgICAgIHdyYXBwZXIuY2xhc3NMaXN0LmFkZCgnYy1hc3BlY3RzJylcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVvcmRlciBhc3BlY3RzXG4gICAgICAgICAqIERyYXcgbWlub3IgYXNwZWN0cyBmaXJzdFxuICAgICAgICAgKi9cbiAgICAgICAgYXNwZWN0c0xpc3Quc29ydCgoYSwgYikgPT4gKChhLmFzcGVjdC5pc01ham9yID8/IGZhbHNlKSA9PT0gKGIuYXNwZWN0LmlzTWFqb3IgPz8gZmFsc2UpKSA/IDAgOiAoYS5hc3BlY3QuaXNNYWpvciA/PyBmYWxzZSkgPyAxIDogLTEpXG5cbiAgICAgICAgY29uc3QgYXNwZWN0R3JvdXBzID0gW107XG5cbiAgICAgICAgZm9yIChjb25zdCBhc3Agb2YgYXNwZWN0c0xpc3QpIHtcbiAgICAgICAgICAgIGNvbnN0IGFzcGVjdEdyb3VwID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuICAgICAgICAgICAgYXNwZWN0R3JvdXAuY2xhc3NMaXN0LmFkZCgnYy1hc3BlY3RzX19hc3BlY3QnKVxuICAgICAgICAgICAgYXNwZWN0R3JvdXAuY2xhc3NMaXN0LmFkZCgnYy1hc3BlY3RzX19hc3BlY3QtLScgKyBhc3AuYXNwZWN0Lm5hbWUudG9Mb3dlckNhc2UoKSlcbiAgICAgICAgICAgIGFzcGVjdEdyb3Vwcy5wdXNoKGFzcGVjdEdyb3VwKVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNwbGl0IHRoZSBhc3BlY3QgbGluZSBpbiB0d28sIHdpdGggYSBnYXBlIGZpeGVkIGluIHBpeGVsc1xuICAgICAgICAgKlxuICAgICAgICAgKiBAYXV0aG9yIENoYXRHUFRcbiAgICAgICAgICogQHBhcmFtIGZyb21Qb2ludFxuICAgICAgICAgKiBAcGFyYW0gdG9Qb2ludFxuICAgICAgICAgKiBAcGFyYW0gZ2FwXG4gICAgICAgICAqIEByZXR1cm5zIHtbW3t4OiBudW1iZXIsIHk6IG51bWJlcn0sIHt4OiBudW1iZXIsIHk6IG51bWJlcn1dLFt7eDogbnVtYmVyLCB5OiBudW1iZXJ9LHt4OiBudW1iZXIsIHk6IG51bWJlcn1dXX1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IHNwbGl0TGluZVdpdGhHYXAgPSBmdW5jdGlvbiAoZnJvbVBvaW50LCB0b1BvaW50LCBnYXAgPSAxNSkge1xuICAgICAgICAgICAgY29uc3QgZHggPSB0b1BvaW50LnggLSBmcm9tUG9pbnQueDtcbiAgICAgICAgICAgIGNvbnN0IGR5ID0gdG9Qb2ludC55IC0gZnJvbVBvaW50Lnk7XG5cbiAgICAgICAgICAgIC8vIExpbmUgbGVuZ3RoXG4gICAgICAgICAgICBjb25zdCBsZW5ndGggPSBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xuXG4gICAgICAgICAgICAvLyBNaWRwb2ludFxuICAgICAgICAgICAgY29uc3QgbWlkWCA9IChmcm9tUG9pbnQueCArIHRvUG9pbnQueCkgLyAyO1xuICAgICAgICAgICAgY29uc3QgbWlkWSA9IChmcm9tUG9pbnQueSArIHRvUG9pbnQueSkgLyAyO1xuXG4gICAgICAgICAgICAvLyBIYWxmIGdhcCBhbG9uZyB0aGUgcGVycGVuZGljdWxhclxuICAgICAgICAgICAgY29uc3Qgb2Zmc2V0ID0gZ2FwIC8gMjtcblxuICAgICAgICAgICAgLy8gQWRqdXN0IG1pZHBvaW50IGFsb25nIHRoZSBsaW5lIGRpcmVjdGlvbiB0byBnZXQgc3BsaXQgcG9pbnRzXG4gICAgICAgICAgICBjb25zdCBkaXJYID0gZHggLyBsZW5ndGg7XG4gICAgICAgICAgICBjb25zdCBkaXJZID0gZHkgLyBsZW5ndGg7XG5cbiAgICAgICAgICAgIC8vIEZpcnN0IHNlZ21lbnQ6IGZyb21Qb2ludCB0byBtaWQgLSBvZmZzZXQgaW4gZGlyZWN0aW9uIG9mIGxpbmVcbiAgICAgICAgICAgIGNvbnN0IHAxID0gZnJvbVBvaW50O1xuICAgICAgICAgICAgY29uc3QgcDIgPSB7XG4gICAgICAgICAgICAgICAgeDogbWlkWCAtIGRpclggKiBvZmZzZXQsXG4gICAgICAgICAgICAgICAgeTogbWlkWSAtIGRpclkgKiBvZmZzZXRcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIFNlY29uZCBzZWdtZW50OiBtaWQgKyBvZmZzZXQgdG8gdG9Qb2ludFxuICAgICAgICAgICAgY29uc3QgcDMgPSB7XG4gICAgICAgICAgICAgICAgeDogbWlkWCArIGRpclggKiBvZmZzZXQsXG4gICAgICAgICAgICAgICAgeTogbWlkWSArIGRpclkgKiBvZmZzZXRcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBjb25zdCBwNCA9IHRvUG9pbnQ7XG5cbiAgICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgICAgW3AxLCBwMl0sIC8vIGZpcnN0IGxpbmUgc2VnbWVudFxuICAgICAgICAgICAgICAgIFtwMywgcDRdICAvLyBzZWNvbmQgbGluZSBzZWdtZW50XG4gICAgICAgICAgICBdO1xuICAgICAgICB9XG5cblxuICAgICAgICAvKipcbiAgICAgICAgICogRHJhdyBsaW5lcyBmaXJzdFxuICAgICAgICAgKi9cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhc3BlY3RzTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgYXNwID0gYXNwZWN0c0xpc3RbaV07XG4gICAgICAgICAgICBjb25zdCBhc3BlY3RHcm91cCA9IGFzcGVjdEdyb3Vwc1tpXTtcblxuICAgICAgICAgICAgLy8gYXNwZWN0IGFzIHNvbGlkIGxpbmVcbiAgICAgICAgICAgIGNvbnN0IGZyb21Qb2ludCA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUoY2VudGVyWCwgY2VudGVyWSwgcmFkaXVzLCBVdGlscy5kZWdyZWVUb1JhZGlhbihhc3AuZnJvbS5hbmdsZSwgYXNjZW5kYW50U2hpZnQpKVxuICAgICAgICAgICAgY29uc3QgdG9Qb2ludCA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUoY2VudGVyWCwgY2VudGVyWSwgcmFkaXVzLCBVdGlscy5kZWdyZWVUb1JhZGlhbihhc3AudG8uYW5nbGUsIGFzY2VuZGFudFNoaWZ0KSlcblxuICAgICAgICAgICAgY29uc3QgW3NwbGl0TGluZTEsIHNwbGl0TGluZTJdID0gc3BsaXRMaW5lV2l0aEdhcChmcm9tUG9pbnQsIHRvUG9pbnQsIHNldHRpbmdzLkFTUEVDVFNfRk9OVF9TSVpFID8/IDIwKTtcblxuICAgICAgICAgICAgY29uc3QgbGluZTEgPSBTVkdVdGlscy5TVkdMaW5lKHNwbGl0TGluZTFbMF0ueCwgc3BsaXRMaW5lMVswXS55LCBzcGxpdExpbmUxWzFdLngsIHNwbGl0TGluZTFbMV0ueSlcbiAgICAgICAgICAgIGxpbmUxLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCBzZXR0aW5ncy5BU1BFQ1RfQ09MT1JTW2FzcC5hc3BlY3QubmFtZV0gPz8gXCIjMzMzXCIpO1xuXG4gICAgICAgICAgICBpZiAoc2V0dGluZ3MuQ0hBUlRfU1RST0tFX01JTk9SX0FTUEVDVCAmJiAhIChhc3AuYXNwZWN0LmlzTWFqb3IgPz8gZmFsc2UpKSB7XG4gICAgICAgICAgICAgICAgbGluZTEuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHNldHRpbmdzLkNIQVJUX1NUUk9LRV9NSU5PUl9BU1BFQ1QpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsaW5lMS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgc2V0dGluZ3MuQ0hBUlRfU1RST0tFKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHNldHRpbmdzLkNMQVNTX1NJR05fQVNQRUNUX0xJTkUpIHtcbiAgICAgICAgICAgICAgICBsaW5lMS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBzZXR0aW5ncy5DTEFTU19TSUdOX0FTUEVDVF9MSU5FKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBsaW5lMiA9IFNWR1V0aWxzLlNWR0xpbmUoc3BsaXRMaW5lMlswXS54LCBzcGxpdExpbmUyWzBdLnksIHNwbGl0TGluZTJbMV0ueCwgc3BsaXRMaW5lMlsxXS55KVxuICAgICAgICAgICAgbGluZTIuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHNldHRpbmdzLkFTUEVDVF9DT0xPUlNbYXNwLmFzcGVjdC5uYW1lXSA/PyBcIiMzMzNcIik7XG5cbiAgICAgICAgICAgIGlmIChzZXR0aW5ncy5DSEFSVF9TVFJPS0VfTUlOT1JfQVNQRUNUICYmICEgKGFzcC5hc3BlY3QuaXNNYWpvciA/PyBmYWxzZSkpIHtcbiAgICAgICAgICAgICAgICBsaW5lMi5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgc2V0dGluZ3MuQ0hBUlRfU1RST0tFX01JTk9SX0FTUEVDVCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxpbmUyLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCBzZXR0aW5ncy5DSEFSVF9TVFJPS0UpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoc2V0dGluZ3MuQ0xBU1NfU0lHTl9BU1BFQ1RfTElORSkge1xuICAgICAgICAgICAgICAgIGxpbmUyLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIHNldHRpbmdzLkNMQVNTX1NJR05fQVNQRUNUX0xJTkUpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGFzcGVjdEdyb3VwLmFwcGVuZENoaWxkKGxpbmUxKTtcbiAgICAgICAgICAgIGFzcGVjdEdyb3VwLmFwcGVuZENoaWxkKGxpbmUyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEcmF3IGFsbCBhc3BlY3RzIGFib3ZlIGxpbmVzXG4gICAgICAgICAqL1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFzcGVjdHNMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBhc3AgPSBhc3BlY3RzTGlzdFtpXTtcbiAgICAgICAgICAgIGNvbnN0IGFzcGVjdEdyb3VwID0gYXNwZWN0R3JvdXBzW2ldO1xuXG4gICAgICAgICAgICAvLyBhc3BlY3QgYXMgc29saWQgbGluZVxuICAgICAgICAgICAgY29uc3QgZnJvbVBvaW50ID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZShjZW50ZXJYLCBjZW50ZXJZLCByYWRpdXMsIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKGFzcC5mcm9tLmFuZ2xlLCBhc2NlbmRhbnRTaGlmdCkpXG4gICAgICAgICAgICBjb25zdCB0b1BvaW50ID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZShjZW50ZXJYLCBjZW50ZXJZLCByYWRpdXMsIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKGFzcC50by5hbmdsZSwgYXNjZW5kYW50U2hpZnQpKVxuXG4gICAgICAgICAgICAvLyBkcmF3IHN5bWJvbCBpbiBjZW50ZXIgb2YgYXNwZWN0XG4gICAgICAgICAgICBjb25zdCBsaW5lQ2VudGVyWCA9IChmcm9tUG9pbnQueCArIHRvUG9pbnQueCkgLyAyXG4gICAgICAgICAgICBjb25zdCBsaW5lQ2VudGVyWSA9IChmcm9tUG9pbnQueSArIHRvUG9pbnQueSkgLyAyIC0gKHNldHRpbmdzLkFTUEVDVFNfRk9OVF9TSVpFID8/IDIwKSAvIDE4IC8vIG51ZGdlIGEgYml0IGhpZ2hlciBBc3Ryb25vbWljb24gc3ltYm9sXG4gICAgICAgICAgICBjb25zdCBzeW1ib2wgPSBTVkdVdGlscy5TVkdTeW1ib2woYXNwLmFzcGVjdC5uYW1lLCBsaW5lQ2VudGVyWCwgbGluZUNlbnRlclkpXG4gICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZm9udC1mYW1pbHlcIiwgc2V0dGluZ3MuQ0hBUlRfRk9OVF9GQU1JTFkgPz8gXCJBc3Ryb25vbWljb25cIik7XG4gICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIikgLy8gc3RhcnQsIG1pZGRsZSwgZW5kXG4gICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcbiAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJmb250LXNpemVcIiwgc2V0dGluZ3MuQVNQRUNUU19GT05UX1NJWkUpO1xuICAgICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgc2V0dGluZ3MuQVNQRUNUX0NPTE9SU1thc3AuYXNwZWN0Lm5hbWVdID8/IFwiIzMzM1wiKTtcblxuICAgICAgICAgICAgaWYgKHNldHRpbmdzLkNMQVNTX1NJR05fQVNQRUNUKSB7XG4gICAgICAgICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIHNldHRpbmdzLkNMQVNTX1NJR05fQVNQRUNUICsgJyAnICsgc2V0dGluZ3MuQ0xBU1NfU0lHTl9BU1BFQ1QgKyAnLS0nICsgYXNwLmFzcGVjdC5uYW1lLnRvTG93ZXJDYXNlKCkpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzZXR0aW5ncy5JTlNFUlRfRUxFTUVOVF9USVRMRSkge1xuICAgICAgICAgICAgICAgIHN5bWJvbC5hcHBlbmRDaGlsZChTVkdVdGlscy5TVkdUaXRsZShzZXR0aW5ncy5FTEVNRU5UX1RJVExFUy5hc3BlY3RzW2FzcC5hc3BlY3QubmFtZS50b0xvd2VyQ2FzZSgpXSkpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGFzcGVjdEdyb3VwLmRhdGFzZXQuZnJvbSA9IGFzcC5mcm9tLm5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIGFzcGVjdEdyb3VwLmRhdGFzZXQudG8gPSBhc3AudG8ubmFtZS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICAgICAgICBhc3BlY3RHcm91cC5hcHBlbmRDaGlsZChzeW1ib2wpO1xuICAgICAgICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChhc3BlY3RHcm91cCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gd3JhcHBlclxuICAgIH1cblxufVxuXG5leHBvcnQge1xuICAgIEFzcGVjdFV0aWxzIGFzXG4gICAgICAgIGRlZmF1bHRcbn1cbiIsIi8vIG5vaW5zcGVjdGlvbiBKU1VudXNlZEdsb2JhbFN5bWJvbHNcbi8qKlxuICogQGNsYXNzXG4gKiBAY2xhc3NkZXNjIFNWRyB1dGlsaXR5IGNsYXNzXG4gKiBAcHVibGljXG4gKiBAc3RhdGljXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKi9cbmNsYXNzIFNWR1V0aWxzIHtcblxuICAgIHN0YXRpYyBTVkdfTkFNRVNQQUNFID0gXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiXG5cbiAgICBzdGF0aWMgU1lNQk9MX0FSSUVTID0gXCJBcmllc1wiO1xuICAgIHN0YXRpYyBTWU1CT0xfVEFVUlVTID0gXCJUYXVydXNcIjtcbiAgICBzdGF0aWMgU1lNQk9MX0dFTUlOSSA9IFwiR2VtaW5pXCI7XG4gICAgc3RhdGljIFNZTUJPTF9DQU5DRVIgPSBcIkNhbmNlclwiO1xuICAgIHN0YXRpYyBTWU1CT0xfTEVPID0gXCJMZW9cIjtcbiAgICBzdGF0aWMgU1lNQk9MX1ZJUkdPID0gXCJWaXJnb1wiO1xuICAgIHN0YXRpYyBTWU1CT0xfTElCUkEgPSBcIkxpYnJhXCI7XG4gICAgc3RhdGljIFNZTUJPTF9TQ09SUElPID0gXCJTY29ycGlvXCI7XG4gICAgc3RhdGljIFNZTUJPTF9TQUdJVFRBUklVUyA9IFwiU2FnaXR0YXJpdXNcIjtcbiAgICBzdGF0aWMgU1lNQk9MX0NBUFJJQ09STiA9IFwiQ2Fwcmljb3JuXCI7XG4gICAgc3RhdGljIFNZTUJPTF9BUVVBUklVUyA9IFwiQXF1YXJpdXNcIjtcbiAgICBzdGF0aWMgU1lNQk9MX1BJU0NFUyA9IFwiUGlzY2VzXCI7XG5cbiAgICBzdGF0aWMgU1lNQk9MX1NVTiA9IFwiU3VuXCI7XG4gICAgc3RhdGljIFNZTUJPTF9NT09OID0gXCJNb29uXCI7XG4gICAgc3RhdGljIFNZTUJPTF9NRVJDVVJZID0gXCJNZXJjdXJ5XCI7XG4gICAgc3RhdGljIFNZTUJPTF9WRU5VUyA9IFwiVmVudXNcIjtcbiAgICBzdGF0aWMgU1lNQk9MX0VBUlRIID0gXCJFYXJ0aFwiO1xuICAgIHN0YXRpYyBTWU1CT0xfTUFSUyA9IFwiTWFyc1wiO1xuICAgIHN0YXRpYyBTWU1CT0xfSlVQSVRFUiA9IFwiSnVwaXRlclwiO1xuICAgIHN0YXRpYyBTWU1CT0xfU0FUVVJOID0gXCJTYXR1cm5cIjtcbiAgICBzdGF0aWMgU1lNQk9MX1VSQU5VUyA9IFwiVXJhbnVzXCI7XG4gICAgc3RhdGljIFNZTUJPTF9ORVBUVU5FID0gXCJOZXB0dW5lXCI7XG4gICAgc3RhdGljIFNZTUJPTF9QTFVUTyA9IFwiUGx1dG9cIjtcbiAgICBzdGF0aWMgU1lNQk9MX0NISVJPTiA9IFwiQ2hpcm9uXCI7XG4gICAgc3RhdGljIFNZTUJPTF9MSUxJVEggPSBcIkxpbGl0aFwiO1xuICAgIHN0YXRpYyBTWU1CT0xfTk5PREUgPSBcIk5Ob2RlXCI7XG4gICAgc3RhdGljIFNZTUJPTF9TTk9ERSA9IFwiU05vZGVcIjtcblxuICAgIHN0YXRpYyBTWU1CT0xfQVMgPSBcIkFzXCI7XG4gICAgc3RhdGljIFNZTUJPTF9EUyA9IFwiRHNcIjtcbiAgICBzdGF0aWMgU1lNQk9MX01DID0gXCJNY1wiO1xuICAgIHN0YXRpYyBTWU1CT0xfSUMgPSBcIkljXCI7XG5cbiAgICBzdGF0aWMgU1lNQk9MX1JFVFJPR1JBREUgPSBcIlJldHJvZ3JhZGVcIlxuXG4gICAgc3RhdGljIFNZTUJPTF9DT05KVU5DVElPTiA9IFwiQ29uanVuY3Rpb25cIjtcbiAgICBzdGF0aWMgU1lNQk9MX09QUE9TSVRJT04gPSBcIk9wcG9zaXRpb25cIjtcbiAgICBzdGF0aWMgU1lNQk9MX1NRVUFSRSA9IFwiU3F1YXJlXCI7IC8vIEFLQSBRdWFydGlsZSBvciBRdWFkcmF0ZVxuICAgIHN0YXRpYyBTWU1CT0xfVFJJTkUgPSBcIlRyaW5lXCI7XG4gICAgc3RhdGljIFNZTUJPTF9TRVhUSUxFID0gXCJTZXh0aWxlXCI7XG5cbiAgICBzdGF0aWMgU1lNQk9MX1FVSU5DVU5YID0gXCJRdWluY3VueFwiO1xuICAgIHN0YXRpYyBTWU1CT0xfU0VNSVNFWFRJTEUgPSBcIlNlbWktc2V4dGlsZVwiO1xuXG4gICAgc3RhdGljIFNZTUJPTF9TRU1JU1FVQVJFID0gXCJTZW1pLXNxdWFyZVwiOyAvLyBBS0EgT2N0aWxlXG4gICAgc3RhdGljIFNZTUJPTF9PQ1RJTEUgPSBcIk9jdGlsZVwiO1xuXG4gICAgc3RhdGljIFNZTUJPTF9TRVNRVUlTUVVBUkUgPSBcIlNlc3F1aXNxdWFyZVwiOyAvLyBBS0EgVHJpb2N0aWxlXG4gICAgc3RhdGljIFNZTUJPTF9UUklPQ1RJTEUgPSBcIlRyaW9jdGlsZVwiOyAvLyBTYW1lIGFzIFNlc3F1aXNxdWFyZVxuXG4gICAgc3RhdGljIFNZTUJPTF9RVUlOVElMRSA9IFwiUXVpbnRpbGVcIjtcbiAgICBzdGF0aWMgU1lNQk9MX0JJUVVJTlRJTEUgPSBcIkJpcXVpbnRpbGVcIjtcbiAgICBzdGF0aWMgU1lNQk9MX1NFTUlRVUlOVElMRSA9IFwiU2VtaS1xdWludGlsZVwiOyAvLyBBS0EgRGVjaWxlXG5cbiAgICAvLyBBc3Ryb25vbWljb24gZm9udCBjb2Rlc1xuICAgIHN0YXRpYyBTWU1CT0xfQVJJRVNfQ09ERSA9IFwiQVwiO1xuICAgIHN0YXRpYyBTWU1CT0xfVEFVUlVTX0NPREUgPSBcIkJcIjtcbiAgICBzdGF0aWMgU1lNQk9MX0dFTUlOSV9DT0RFID0gXCJDXCI7XG4gICAgc3RhdGljIFNZTUJPTF9DQU5DRVJfQ09ERSA9IFwiRFwiO1xuICAgIHN0YXRpYyBTWU1CT0xfTEVPX0NPREUgPSBcIkVcIjtcbiAgICBzdGF0aWMgU1lNQk9MX1ZJUkdPX0NPREUgPSBcIkZcIjtcbiAgICBzdGF0aWMgU1lNQk9MX0xJQlJBX0NPREUgPSBcIkdcIjtcbiAgICBzdGF0aWMgU1lNQk9MX1NDT1JQSU9fQ09ERSA9IFwiSFwiO1xuICAgIHN0YXRpYyBTWU1CT0xfU0FHSVRUQVJJVVNfQ09ERSA9IFwiSVwiO1xuICAgIHN0YXRpYyBTWU1CT0xfQ0FQUklDT1JOX0NPREUgPSBcIkpcIjtcbiAgICBzdGF0aWMgU1lNQk9MX0FRVUFSSVVTX0NPREUgPSBcIktcIjtcbiAgICBzdGF0aWMgU1lNQk9MX1BJU0NFU19DT0RFID0gXCJMXCI7XG5cbiAgICBzdGF0aWMgU1lNQk9MX1NVTl9DT0RFID0gXCJRXCI7XG4gICAgc3RhdGljIFNZTUJPTF9NT09OX0NPREUgPSBcIlJcIjtcbiAgICBzdGF0aWMgU1lNQk9MX01FUkNVUllfQ09ERSA9IFwiU1wiO1xuICAgIHN0YXRpYyBTWU1CT0xfVkVOVVNfQ09ERSA9IFwiVFwiO1xuICAgIHN0YXRpYyBTWU1CT0xfRUFSVEhfQ09ERSA9IFwiPlwiO1xuICAgIHN0YXRpYyBTWU1CT0xfTUFSU19DT0RFID0gXCJVXCI7XG4gICAgc3RhdGljIFNZTUJPTF9KVVBJVEVSX0NPREUgPSBcIlZcIjtcbiAgICBzdGF0aWMgU1lNQk9MX1NBVFVSTl9DT0RFID0gXCJXXCI7XG4gICAgc3RhdGljIFNZTUJPTF9VUkFOVVNfQ09ERSA9IFwiWFwiO1xuICAgIHN0YXRpYyBTWU1CT0xfTkVQVFVORV9DT0RFID0gXCJZXCI7XG4gICAgc3RhdGljIFNZTUJPTF9QTFVUT19DT0RFID0gXCJaXCI7XG4gICAgc3RhdGljIFNZTUJPTF9DSElST05fQ09ERSA9IFwicVwiO1xuICAgIHN0YXRpYyBTWU1CT0xfTElMSVRIX0NPREUgPSBcInpcIjtcbiAgICBzdGF0aWMgU1lNQk9MX05OT0RFX0NPREUgPSBcImdcIjtcbiAgICBzdGF0aWMgU1lNQk9MX1NOT0RFX0NPREUgPSBcImlcIjtcblxuICAgIHN0YXRpYyBTWU1CT0xfQVNfQ09ERSA9IFwiY1wiO1xuICAgIHN0YXRpYyBTWU1CT0xfRFNfQ09ERSA9IFwiZlwiO1xuICAgIHN0YXRpYyBTWU1CT0xfTUNfQ09ERSA9IFwiZFwiO1xuICAgIHN0YXRpYyBTWU1CT0xfSUNfQ09ERSA9IFwiZVwiO1xuXG4gICAgc3RhdGljIFNZTUJPTF9SRVRST0dSQURFX0NPREUgPSBcIk1cIlxuXG5cbiAgICBzdGF0aWMgU1lNQk9MX0NPTkpVTkNUSU9OX0NPREUgPSBcIiFcIjtcbiAgICBzdGF0aWMgU1lNQk9MX09QUE9TSVRJT05fQ09ERSA9ICdcIic7XG4gICAgc3RhdGljIFNZTUJPTF9TUVVBUkVfQ09ERSA9IFwiI1wiO1xuICAgIHN0YXRpYyBTWU1CT0xfVFJJTkVfQ09ERSA9IFwiJFwiO1xuICAgIHN0YXRpYyBTWU1CT0xfU0VYVElMRV9DT0RFID0gXCIlXCI7XG5cbiAgICAvKipcbiAgICAgKiBRdWluY3VueCAoSW5jb25qdW5jdClcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAqL1xuICAgIHN0YXRpYyBTWU1CT0xfUVVJTkNVTlhfQ09ERSA9IFwiJlwiO1xuXG4gICAgc3RhdGljIFNZTUJPTF9TRU1JU0VYVElMRV9DT0RFID0gXCInXCI7XG5cbiAgICAvKipcbiAgICAgKiBTZW1pLVNxdWFyZSBvciBPY3RpbGVcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAqL1xuICAgIHN0YXRpYyBTWU1CT0xfU0VNSVNRVUFSRV9DT0RFID0gXCIoXCI7XG5cbiAgICAvKipcbiAgICAgKiBTZXNxdWlxdWFkcmF0ZSBvciBUcmktT2N0aWxlIG9yIFNlc3F1aXNxdWFyZVxuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICovXG4gICAgc3RhdGljIFNZTUJPTF9UUklPQ1RJTEVfQ09ERSA9IFwiKVwiO1xuXG4gICAgc3RhdGljIFNZTUJPTF9CSVFVSU5USUxFX0NPREUgPSBcIipcIjtcblxuICAgIHN0YXRpYyBTWU1CT0xfUVVJTlRJTEVfQ09ERSA9IFwiwrdcIjtcblxuICAgIHN0YXRpYyBTWU1CT0xfU0VNSVFVSU5USUxFX0NPREUgPSBcIixcIjtcblxuICAgIHN0YXRpYyBTWU1CT0xfUVVJTkRFQ0lMRV9DT0RFID0gXCLCuFwiO1xuXG4gICAgLyoqXG4gICAgICogUXVpbnRpbGUgKHZhcmlhbnQpXG4gICAgICpcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAqL1xuICAgIHN0YXRpYyBTWU1CT0xfUVVJTlRJTEVfVkFSSUFOVF9DT0RFID0gXCIrXCI7XG5cblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBpZiAodGhpcyBpbnN0YW5jZW9mIFNWR1V0aWxzKSB7XG4gICAgICAgICAgICB0aHJvdyBFcnJvcignVGhpcyBpcyBhIHN0YXRpYyBjbGFzcyBhbmQgY2Fubm90IGJlIGluc3RhbnRpYXRlZC4nKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIFNWRyBkb2N1bWVudFxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB3aWR0aFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBoZWlnaHRcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1NWR0RvY3VtZW50fVxuICAgICAqL1xuICAgIHN0YXRpYyBTVkdEb2N1bWVudCh3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICAgIGNvbnN0IHN2ZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTVkdVdGlscy5TVkdfTkFNRVNQQUNFLCBcInN2Z1wiKTtcbiAgICAgICAgc3ZnLnNldEF0dHJpYnV0ZSgneG1sbnMnLCBTVkdVdGlscy5TVkdfTkFNRVNQQUNFKTtcbiAgICAgICAgc3ZnLnNldEF0dHJpYnV0ZSgndmVyc2lvbicsIFwiMS4xXCIpO1xuICAgICAgICBzdmcuc2V0QXR0cmlidXRlKCd2aWV3Qm94JywgXCIwIDAgXCIgKyB3aWR0aCArIFwiIFwiICsgaGVpZ2h0KTtcbiAgICAgICAgcmV0dXJuIHN2Z1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIFNWRyBncm91cCBlbGVtZW50XG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQHJldHVybiB7U1ZHR3JvdXBFbGVtZW50fVxuICAgICAqL1xuICAgIHN0YXRpYyBTVkdHcm91cCgpIHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTVkdVdGlscy5TVkdfTkFNRVNQQUNFLCBcImdcIilcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBTVkcgdGl0bGUgZWxlbWVudFxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0aXRsZVxuICAgICAqIEByZXR1cm4ge1NWR0dyb3VwRWxlbWVudH1cbiAgICAgKi9cbiAgICBzdGF0aWMgU1ZHVGl0bGUodGl0bGUpIHtcbiAgICAgICAgY29uc3Qgc3ZnVGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoU1ZHVXRpbHMuU1ZHX05BTUVTUEFDRSwgXCJ0aXRsZVwiKVxuICAgICAgICBzdmdUaXRsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0aXRsZSkpO1xuICAgICAgICByZXR1cm4gc3ZnVGl0bGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgU1ZHIHBhdGggZWxlbWVudFxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEByZXR1cm4ge1NWR0dyb3VwRWxlbWVudH1cbiAgICAgKi9cbiAgICBzdGF0aWMgU1ZHUGF0aCgpIHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTVkdVdGlscy5TVkdfTkFNRVNQQUNFLCBcInBhdGhcIilcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBTVkcgbWFzayBlbGVtZW50XG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGVsZW1lbnRJRFxuICAgICAqXG4gICAgICogQHJldHVybiB7U1ZHTWFza0VsZW1lbnR9XG4gICAgICovXG4gICAgc3RhdGljIFNWR01hc2soZWxlbWVudElEKSB7XG4gICAgICAgIGNvbnN0IG1hc2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoU1ZHVXRpbHMuU1ZHX05BTUVTUEFDRSwgXCJtYXNrXCIpO1xuICAgICAgICBtYXNrLnNldEF0dHJpYnV0ZShcImlkXCIsIGVsZW1lbnRJRClcbiAgICAgICAgcmV0dXJuIG1hc2tcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTVkcgY2lyY3VsYXIgc2VjdG9yXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQHBhcmFtIHtpbnR9IHggLSBjaXJjbGUgeCBjZW50ZXIgcG9zaXRpb25cbiAgICAgKiBAcGFyYW0ge2ludH0geSAtIGNpcmNsZSB5IGNlbnRlciBwb3NpdGlvblxuICAgICAqIEBwYXJhbSB7aW50fSByYWRpdXMgLSBjaXJjbGUgcmFkaXVzIGluIHB4XG4gICAgICogQHBhcmFtIHtpbnR9IGExIC0gYW5nbGVGcm9tIGluIHJhZGlhbnNcbiAgICAgKiBAcGFyYW0ge2ludH0gYTIgLSBhbmdsZVRvIGluIHJhZGlhbnNcbiAgICAgKiBAcGFyYW0ge2ludH0gdGhpY2tuZXNzIC0gZnJvbSBvdXRzaWRlIHRvIGNlbnRlciBpbiBweFxuICAgICAqXG4gICAgICogQHJldHVybiB7U1ZHRWxlbWVudH0gc2VnbWVudFxuICAgICAqL1xuICAgIHN0YXRpYyBTVkdTZWdtZW50KHgsIHksIHJhZGl1cywgYTEsIGEyLCB0aGlja25lc3MsIGxGbGFnLCBzRmxhZykge1xuICAgICAgICAvLyBAc2VlIFNWRyBQYXRoIGFyYzogaHR0cHM6Ly93d3cudzMub3JnL1RSL1NWRy9wYXRocy5odG1sI1BhdGhEYXRhXG4gICAgICAgIGNvbnN0IExBUkdFX0FSQ19GTEFHID0gbEZsYWcgfHwgMDtcbiAgICAgICAgY29uc3QgU1dFRVRfRkxBRyA9IHNGbGFnIHx8IDA7XG5cbiAgICAgICAgY29uc3Qgc2VnbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTVkdVdGlscy5TVkdfTkFNRVNQQUNFLCBcInBhdGhcIik7XG4gICAgICAgIHNlZ21lbnQuc2V0QXR0cmlidXRlKFwiZFwiLCBcIk0gXCIgKyAoeCArIHRoaWNrbmVzcyAqIE1hdGguY29zKGExKSkgKyBcIiwgXCIgKyAoeSArIHRoaWNrbmVzcyAqIE1hdGguc2luKGExKSkgKyBcIiBsIFwiICsgKChyYWRpdXMgLSB0aGlja25lc3MpICogTWF0aC5jb3MoYTEpKSArIFwiLCBcIiArICgocmFkaXVzIC0gdGhpY2tuZXNzKSAqIE1hdGguc2luKGExKSkgKyBcIiBBIFwiICsgcmFkaXVzICsgXCIsIFwiICsgcmFkaXVzICsgXCIsMCAsXCIgKyBMQVJHRV9BUkNfRkxBRyArIFwiLCBcIiArIFNXRUVUX0ZMQUcgKyBcIiwgXCIgKyAoeCArIHJhZGl1cyAqIE1hdGguY29zKGEyKSkgKyBcIiwgXCIgKyAoeSArIHJhZGl1cyAqIE1hdGguc2luKGEyKSkgKyBcIiBsIFwiICsgKChyYWRpdXMgLSB0aGlja25lc3MpICogLU1hdGguY29zKGEyKSkgKyBcIiwgXCIgKyAoKHJhZGl1cyAtIHRoaWNrbmVzcykgKiAtTWF0aC5zaW4oYTIpKSArIFwiIEEgXCIgKyB0aGlja25lc3MgKyBcIiwgXCIgKyB0aGlja25lc3MgKyBcIiwwICxcIiArIExBUkdFX0FSQ19GTEFHICsgXCIsIFwiICsgMSArIFwiLCBcIiArICh4ICsgdGhpY2tuZXNzICogTWF0aC5jb3MoYTEpKSArIFwiLCBcIiArICh5ICsgdGhpY2tuZXNzICogTWF0aC5zaW4oYTEpKSk7XG4gICAgICAgIHNlZ21lbnQuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XG4gICAgICAgIHJldHVybiBzZWdtZW50O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNWRyBjaXJjbGVcbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAcGFyYW0ge2ludH0gY3hcbiAgICAgKiBAcGFyYW0ge2ludH0gY3lcbiAgICAgKiBAcGFyYW0ge2ludH0gcmFkaXVzXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtTVkdFbGVtZW50fSBjaXJjbGVcbiAgICAgKi9cbiAgICBzdGF0aWMgU1ZHQ2lyY2xlKGN4LCBjeSwgcmFkaXVzKSB7XG4gICAgICAgIGNvbnN0IGNpcmNsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTVkdVdGlscy5TVkdfTkFNRVNQQUNFLCBcImNpcmNsZVwiKTtcbiAgICAgICAgY2lyY2xlLnNldEF0dHJpYnV0ZShcImN4XCIsIGN4KTtcbiAgICAgICAgY2lyY2xlLnNldEF0dHJpYnV0ZShcImN5XCIsIGN5KTtcbiAgICAgICAgY2lyY2xlLnNldEF0dHJpYnV0ZShcInJcIiwgcmFkaXVzKTtcbiAgICAgICAgY2lyY2xlLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJub25lXCIpO1xuICAgICAgICByZXR1cm4gY2lyY2xlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNWRyBsaW5lXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge051bWJlcn0geDFcbiAgICAgKiBAcGFyYW0ge051bWJlcn0geTJcbiAgICAgKiBAcGFyYW0ge051bWJlcn0geDJcbiAgICAgKiBAcGFyYW0ge051bWJlcn0geTJcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1NWR0VsZW1lbnR9IGxpbmVcbiAgICAgKi9cbiAgICBzdGF0aWMgU1ZHTGluZSh4MSwgeTEsIHgyLCB5Mikge1xuICAgICAgICBjb25zdCBsaW5lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFNWR1V0aWxzLlNWR19OQU1FU1BBQ0UsIFwibGluZVwiKTtcbiAgICAgICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJ4MVwiLCB4MSk7XG4gICAgICAgIGxpbmUuc2V0QXR0cmlidXRlKFwieTFcIiwgeTEpO1xuICAgICAgICBsaW5lLnNldEF0dHJpYnV0ZShcIngyXCIsIHgyKTtcbiAgICAgICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJ5MlwiLCB5Mik7XG4gICAgICAgIHJldHVybiBsaW5lO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNWRyB0ZXh0XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge051bWJlcn0geFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB5XG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHR4dFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbc2NhbGVdXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtTVkdFbGVtZW50fSBsaW5lXG4gICAgICovXG4gICAgc3RhdGljIFNWR1RleHQoeCwgeSwgdHh0KSB7XG4gICAgICAgIGNvbnN0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoU1ZHVXRpbHMuU1ZHX05BTUVTUEFDRSwgXCJ0ZXh0XCIpO1xuICAgICAgICB0ZXh0LnNldEF0dHJpYnV0ZShcInhcIiwgeCk7XG4gICAgICAgIHRleHQuc2V0QXR0cmlidXRlKFwieVwiLCB5KTtcbiAgICAgICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgXCJub25lXCIpO1xuICAgICAgICB0ZXh0LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHR4dCkpO1xuXG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNWRyBzeW1ib2xcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHhQb3NcbiAgICAgKiBAcGFyYW0ge051bWJlcn0geVBvc1xuICAgICAqXG4gICAgICogQHJldHVybiB7U1ZHRWxlbWVudH1cbiAgICAgKi9cbiAgICBzdGF0aWMgU1ZHU3ltYm9sKG5hbWUsIHhQb3MsIHlQb3MsKSB7XG4gICAgICAgIHN3aXRjaCAobmFtZSkge1xuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfQVM6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFzU3ltYm9sKHhQb3MsIHlQb3MpXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0RTOlxuICAgICAgICAgICAgICAgIHJldHVybiBkc1N5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9NQzpcbiAgICAgICAgICAgICAgICByZXR1cm4gbWNTeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfSUM6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGljU3ltYm9sKHhQb3MsIHlQb3MpXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0FSSUVTOlxuICAgICAgICAgICAgICAgIHJldHVybiBhcmllc1N5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9UQVVSVVM6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRhdXJ1c1N5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9HRU1JTkk6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdlbWluaVN5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9DQU5DRVI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhbmNlclN5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9MRU86XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxlb1N5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9WSVJHTzpcbiAgICAgICAgICAgICAgICByZXR1cm4gdmlyZ29TeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfTElCUkE6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxpYnJhU3ltYm9sKHhQb3MsIHlQb3MpXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1NDT1JQSU86XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNjb3JwaW9TeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfU0FHSVRUQVJJVVM6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNhZ2l0dGFyaXVzU3ltYm9sKHhQb3MsIHlQb3MpXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0NBUFJJQ09STjpcbiAgICAgICAgICAgICAgICByZXR1cm4gY2Fwcmljb3JuU3ltYm9sKHhQb3MsIHlQb3MpXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0FRVUFSSVVTOlxuICAgICAgICAgICAgICAgIHJldHVybiBhcXVhcml1c1N5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9QSVNDRVM6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBpc2Nlc1N5bWJvbCh4UG9zLCB5UG9zKVxuXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1NVTjpcbiAgICAgICAgICAgICAgICByZXR1cm4gc3VuU3ltYm9sKHhQb3MsIHlQb3MpXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX01PT046XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1vb25TeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfTUVSQ1VSWTpcbiAgICAgICAgICAgICAgICByZXR1cm4gbWVyY3VyeVN5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9WRU5VUzpcbiAgICAgICAgICAgICAgICByZXR1cm4gdmVudXNTeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfRUFSVEg6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVhcnRoU3ltYm9sKHhQb3MsIHlQb3MpXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX01BUlM6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1hcnNTeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfSlVQSVRFUjpcbiAgICAgICAgICAgICAgICByZXR1cm4ganVwaXRlclN5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9TQVRVUk46XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNhdHVyblN5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9VUkFOVVM6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVyYW51c1N5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9ORVBUVU5FOlxuICAgICAgICAgICAgICAgIHJldHVybiBuZXB0dW5lU3ltYm9sKHhQb3MsIHlQb3MpXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1BMVVRPOlxuICAgICAgICAgICAgICAgIHJldHVybiBwbHV0b1N5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9DSElST046XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNoaXJvblN5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9MSUxJVEg6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxpbGl0aFN5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9OTk9ERTpcbiAgICAgICAgICAgICAgICByZXR1cm4gbm5vZGVTeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfU05PREU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNub2RlU3ltYm9sKHhQb3MsIHlQb3MpXG5cblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfUkVUUk9HUkFERTpcbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0cm9ncmFkZVN5bWJvbCh4UG9zLCB5UG9zKVxuXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0NPTkpVTkNUSU9OOlxuICAgICAgICAgICAgICAgIHJldHVybiBjb25qdW5jdGlvblN5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9PUFBPU0lUSU9OOlxuICAgICAgICAgICAgICAgIHJldHVybiBvcHBvc2l0aW9uU3ltYm9sKHhQb3MsIHlQb3MpXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1NRVUFSRTpcbiAgICAgICAgICAgICAgICByZXR1cm4gc3F1YXJlU3ltYm9sKHhQb3MsIHlQb3MpXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1RSSU5FOlxuICAgICAgICAgICAgICAgIHJldHVybiB0cmluZVN5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9TRVhUSUxFOlxuICAgICAgICAgICAgICAgIHJldHVybiBzZXh0aWxlU3ltYm9sKHhQb3MsIHlQb3MpXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1FVSU5DVU5YOlxuICAgICAgICAgICAgICAgIHJldHVybiBxdWluY3VueFN5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9TRU1JU0VYVElMRTpcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VtaXNleHRpbGVTeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfU0VNSVNRVUFSRTpcbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX09DVElMRTpcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VtaXNxdWFyZVN5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9UUklPQ1RJTEU6XG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9TRVNRVUlTUVVBUkU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRyaW9jdGlsZVN5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9RVUlOVElMRTpcbiAgICAgICAgICAgICAgICByZXR1cm4gcXVpbnRpbGVTeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfQklRVUlOVElMRTpcbiAgICAgICAgICAgICAgICByZXR1cm4gYmlxdWludGlsZVN5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9TRU1JUVVJTlRJTEU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbWlxdWludGlsZVN5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoJ1Vua25vd24gc3ltYm9sOiAnICsgbmFtZSlcbiAgICAgICAgICAgICAgICBjb25zdCB1bmtub3duU3ltYm9sID0gU1ZHVXRpbHMuU1ZHQ2lyY2xlKHhQb3MsIHlQb3MsIDgpXG4gICAgICAgICAgICAgICAgdW5rbm93blN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgXCIjMzMzXCIpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVua25vd25TeW1ib2xcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIEFzY2VuZGFudCBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGFzU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9BU19DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogRGVzY2VuZGFudCBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGRzU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9EU19DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogTWVkaXVtIGNvZWxpIHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gbWNTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX01DX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBJbW11bSBjb2VsaSBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGljU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9JQ19DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogQXJpZXMgc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBhcmllc1N5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfQVJJRVNfQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFRhdXJ1cyBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHRhdXJ1c1N5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfVEFVUlVTX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBHZW1pbmkgc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBnZW1pbmlTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX0dFTUlOSV9DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogQ2FuY2VyIHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gY2FuY2VyU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9DQU5DRVJfQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIExlbyBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGxlb1N5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfTEVPX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBWaXJnbyBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHZpcmdvU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9WSVJHT19DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogTGlicmEgc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBsaWJyYVN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfTElCUkFfQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFNjb3JwaW8gc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBzY29ycGlvU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9TQ09SUElPX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBTYWdpdHRhcml1cyBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHNhZ2l0dGFyaXVzU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9TQUdJVFRBUklVU19DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogQ2Fwcmljb3JuIHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gY2Fwcmljb3JuU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9DQVBSSUNPUk5fQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIEFxdWFyaXVzIHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gYXF1YXJpdXNTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX0FRVUFSSVVTX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBQaXNjZXMgc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBwaXNjZXNTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX1BJU0NFU19DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogU3VuIHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gc3VuU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9TVU5fQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIE1vb24gc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBtb29uU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9NT09OX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBNZXJjdXJ5IHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gbWVyY3VyeVN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfTUVSQ1VSWV9DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogVmVudXMgc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiB2ZW51c1N5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfVkVOVVNfQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIEVhcnRoIHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gZWFydGhTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX0VBUlRIX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBNYXJzIHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gbWFyc1N5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfTUFSU19DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogSnVwaXRlciBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGp1cGl0ZXJTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX0pVUElURVJfQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFNhdHVybiBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHNhdHVyblN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfU0FUVVJOX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBVcmFudXMgc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiB1cmFudXNTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX1VSQU5VU19DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogTmVwdHVuZSBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIG5lcHR1bmVTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX05FUFRVTkVfQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFBsdXRvIHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gcGx1dG9TeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX1BMVVRPX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBDaGlyb24gc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBjaGlyb25TeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX0NISVJPTl9DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogTGlsaXRoIHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gbGlsaXRoU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9MSUxJVEhfQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIE5Ob2RlIHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gbm5vZGVTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX05OT0RFX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBTTm9kZSBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHNub2RlU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9TTk9ERV9DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogUmV0cm9ncmFkZSBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHJldHJvZ3JhZGVTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX1JFVFJPR1JBREVfQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIENvbmp1bmN0aW9uIHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gY29uanVuY3Rpb25TeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX0NPTkpVTkNUSU9OX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBPcHBvc2l0aW9uIHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gb3Bwb3NpdGlvblN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfT1BQT1NJVElPTl9DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogU3F1YXJlc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBzcXVhcmVTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX1NRVUFSRV9DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogVHJpbmUgc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiB0cmluZVN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfVFJJTkVfQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFNleHRpbGUgc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBzZXh0aWxlU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9TRVhUSUxFX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBRdWluY3VueCBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHF1aW5jdW54U3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9RVUlOQ1VOWF9DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogU2VtaXNleHRpbGUgc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBzZW1pc2V4dGlsZVN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfU0VNSVNFWFRJTEVfQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICogU2VtaXNxdWFyZSBzeW1ib2xcbiAgICAgICAgKiBha2EgUXVpbnRpbGUvIE9jdGlsZSBzeW1ib2xcbiAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gc2VtaXNxdWFyZVN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfU0VNSVNRVUFSRV9DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogUXVpbnRpbGVcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHF1aW50aWxlU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9TRU1JU1FVQVJFX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBiaXF1aW50aWxlU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9CSVFVSU5USUxFX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzZW1pcXVpbnRpbGVTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX1NFTUlRVUlOVElMRV9DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogVHJpb2N0aWxlIHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gdHJpb2N0aWxlU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9UUklPQ1RJTEVfQ09ERSlcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IHtcbiAgICBTVkdVdGlscyBhcyBkZWZhdWx0XG59XG4iLCIvKipcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyBVdGlsaXR5IGNsYXNzXG4gKiBAcHVibGljXG4gKiBAc3RhdGljXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKi9cbmNsYXNzIFV0aWxzIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBpZiAodGhpcyBpbnN0YW5jZW9mIFV0aWxzKSB7XG4gICAgICAgICAgICB0aHJvdyBFcnJvcignVGhpcyBpcyBhIHN0YXRpYyBjbGFzcyBhbmQgY2Fubm90IGJlIGluc3RhbnRpYXRlZC4nKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBERUdfMzYwID0gMzYwXG4gICAgc3RhdGljIERFR18xODAgPSAxODBcbiAgICBzdGF0aWMgREVHXzAgPSAwXG5cbiAgICAvKipcbiAgICAgKiBHZW5lcmF0ZSByYW5kb20gSURcbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICovXG4gICAgc3RhdGljIGdlbmVyYXRlVW5pcXVlSWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnN0IHJhbmRvbU51bWJlciA9IE1hdGgucmFuZG9tKCkgKiAxMDAwMDAwO1xuICAgICAgICBjb25zdCB0aW1lc3RhbXAgPSBEYXRlLm5vdygpO1xuICAgICAgICByZXR1cm4gYGlkXyR7cmFuZG9tTnVtYmVyfV8ke3RpbWVzdGFtcH1gO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEludmVydGVkIGRlZ3JlZSB0byByYWRpYW5cbiAgICAgKiBAc3RhdGljXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gYW5nbGVJbmRlZ3JlZVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzaGlmdEluRGVncmVlXG4gICAgICogQHJldHVybiB7TnVtYmVyfVxuICAgICAqL1xuICAgIHN0YXRpYyBkZWdyZWVUb1JhZGlhbiA9IGZ1bmN0aW9uIChhbmdsZUluRGVncmVlLCBzaGlmdEluRGVncmVlID0gMCkge1xuICAgICAgICByZXR1cm4gKHNoaWZ0SW5EZWdyZWUgLSBhbmdsZUluRGVncmVlKSAqIE1hdGguUEkgLyAxODBcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDb252ZXJ0cyByYWRpYW4gdG8gZGVncmVlXG4gICAgICogQHN0YXRpY1xuICAgICAqXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHJhZGlhblxuICAgICAqIEByZXR1cm4ge051bWJlcn1cbiAgICAgKi9cbiAgICBzdGF0aWMgcmFkaWFuVG9EZWdyZWUgPSBmdW5jdGlvbiAocmFkaWFuKSB7XG4gICAgICAgIHJldHVybiAocmFkaWFuICogMTgwIC8gTWF0aC5QSSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDYWxjdWxhdGVzIGEgcG9zaXRpb24gb2YgdGhlIHBvaW50IG9uIHRoZSBjaXJjbGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gY3ggLSBjZW50ZXIgeFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBjeSAtIGNlbnRlciB5XG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHJhZGl1cyAtIGNpcmNsZSByYWRpdXNcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gYW5nbGVJblJhZGlhbnNcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gLSB7eDpOdW1iZXIsIHk6TnVtYmVyfVxuICAgICAqL1xuICAgIHN0YXRpYyBwb3NpdGlvbk9uQ2lyY2xlKGN4LCBjeSwgcmFkaXVzLCBhbmdsZUluUmFkaWFucykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeDogKHJhZGl1cyAqIE1hdGguY29zKGFuZ2xlSW5SYWRpYW5zKSArIGN4KSxcbiAgICAgICAgICAgIHk6IChyYWRpdXMgKiBNYXRoLnNpbihhbmdsZUluUmFkaWFucykgKyBjeSlcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDYWxjdWxhdGVzIHRoZSBhbmdsZSBiZXR3ZWVuIHRoZSBsaW5lICgyIHBvaW50cykgYW5kIHRoZSB4LWF4aXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge051bWJlcn0geDFcbiAgICAgKiBAcGFyYW0ge051bWJlcn0geTFcbiAgICAgKiBAcGFyYW0ge051bWJlcn0geDJcbiAgICAgKiBAcGFyYW0ge051bWJlcn0geTJcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge051bWJlcn0gLSBkZWdyZWVcbiAgICAgKi9cbiAgICBzdGF0aWMgcG9zaXRpb25Ub0FuZ2xlKHgxLCB5MSwgeDIsIHkyKSB7XG4gICAgICAgIGNvbnN0IGR4ID0geDIgLSB4MTtcbiAgICAgICAgY29uc3QgZHkgPSB5MiAtIHkxO1xuICAgICAgICBjb25zdCBhbmdsZUluUmFkaWFucyA9IE1hdGguYXRhbjIoZHksIGR4KTtcbiAgICAgICAgcmV0dXJuIFV0aWxzLnJhZGlhblRvRGVncmVlKGFuZ2xlSW5SYWRpYW5zKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENhbGN1bGF0ZXMgbmV3IHBvc2l0aW9uIG9mIHBvaW50cyBvbiBjaXJjbGUgd2l0aG91dCBvdmVybGFwcGluZyBlYWNoIG90aGVyXG4gICAgICpcbiAgICAgKiBAdGhyb3dzIHtFcnJvcn0gLSBJZiB0aGVyZSBpcyBubyBwbGFjZSBvbiB0aGUgY2lyY2xlIHRvIHBsYWNlIHBvaW50cy5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBwb2ludHMgLSBbe25hbWU6XCJhXCIsIGFuZ2xlOjEwfSwge25hbWU6XCJiXCIsIGFuZ2xlOjIwfV1cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gY29sbGlzaW9uUmFkaXVzIC0gcG9pbnQgcmFkaXVzXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHJhZGl1cyAtIGNpcmNsZSByYWRpdXNcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gLSB7XCJNb29uXCI6MzAsIFwiU3VuXCI6NjAsIFwiTWVyY3VyeVwiOjg2LCAuLi59XG4gICAgICovXG4gICAgc3RhdGljIGNhbGN1bGF0ZVBvc2l0aW9uV2l0aG91dE92ZXJsYXBwaW5nKHBvaW50cywgY29sbGlzaW9uUmFkaXVzLCBjaXJjbGVSYWRpdXMpIHtcbiAgICAgICAgY29uc3QgU1RFUCA9IDEgLy9kZWdyZWVcblxuICAgICAgICBjb25zdCBjZWxsV2lkdGggPSAxMCAvL2RlZ3JlZVxuICAgICAgICBjb25zdCBudW1iZXJPZkNlbGxzID0gVXRpbHMuREVHXzM2MCAvIGNlbGxXaWR0aFxuICAgICAgICBjb25zdCBmcmVxdWVuY3kgPSBuZXcgQXJyYXkobnVtYmVyT2ZDZWxscykuZmlsbCgwKVxuICAgICAgICBmb3IgKGNvbnN0IHBvaW50IG9mIHBvaW50cykge1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSBNYXRoLmZsb29yKHBvaW50LmFuZ2xlIC8gY2VsbFdpZHRoKVxuICAgICAgICAgICAgZnJlcXVlbmN5W2luZGV4XSArPSAxXG4gICAgICAgIH1cblxuICAgICAgICAvLyBJbiB0aGlzIGFsZ29yaXRobSB0aGUgb3JkZXIgb2YgcG9pbnRzIGlzIGNydWNpYWwuXG4gICAgICAgIC8vIEF0IHRoYXQgcG9pbnQgaW4gdGhlIGNpcmNsZSwgd2hlcmUgdGhlIHBlcmlvZCBjaGFuZ2VzIGluIHRoZSBjaXJjbGUgKGZvciBpbnN0YW5jZTpbMzU4LDM1OSwwLDFdKSwgdGhlIHBvaW50cyBhcmUgYXJyYW5nZWQgaW4gaW5jb3JyZWN0IG9yZGVyLlxuICAgICAgICAvLyBBcyBhIHN0YXJ0aW5nIHBvaW50LCBJIHRyeSB0byBmaW5kIGEgcGxhY2Ugd2hlcmUgdGhlcmUgYXJlIG5vIHBvaW50cy4gVGhpcyBwbGFjZSBJIHVzZSBhcyBTVEFSVF9BTkdMRS5cbiAgICAgICAgY29uc3QgU1RBUlRfQU5HTEUgPSBjZWxsV2lkdGggKiBmcmVxdWVuY3kuZmluZEluZGV4KGNvdW50ID0+IGNvdW50ID09PSAwKVxuXG4gICAgICAgIGNvbnN0IF9wb2ludHMgPSBwb2ludHMubWFwKHBvaW50ID0+IHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgbmFtZTogcG9pbnQubmFtZSxcbiAgICAgICAgICAgICAgICBhbmdsZTogcG9pbnQuYW5nbGUgPCBTVEFSVF9BTkdMRSA/IHBvaW50LmFuZ2xlICsgVXRpbHMuREVHXzM2MCA6IHBvaW50LmFuZ2xlXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgX3BvaW50cy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gYS5hbmdsZSAtIGIuYW5nbGVcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBSZWN1cnNpdmUgZnVuY3Rpb25cbiAgICAgICAgY29uc3QgYXJyYW5nZVBvaW50cyA9ICgpID0+IHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsbiA9IF9wb2ludHMubGVuZ3RoOyBpIDwgbG47IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBvaW50UG9zaXRpb24gPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKDAsIDAsIGNpcmNsZVJhZGl1cywgVXRpbHMuZGVncmVlVG9SYWRpYW4oX3BvaW50c1tpXS5hbmdsZSkpXG4gICAgICAgICAgICAgICAgX3BvaW50c1tpXS54ID0gcG9pbnRQb3NpdGlvbi54XG4gICAgICAgICAgICAgICAgX3BvaW50c1tpXS55ID0gcG9pbnRQb3NpdGlvbi55XG5cbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGk7IGorKykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBkaXN0YW5jZSA9IE1hdGguc3FydChNYXRoLnBvdyhfcG9pbnRzW2ldLnggLSBfcG9pbnRzW2pdLngsIDIpICsgTWF0aC5wb3coX3BvaW50c1tpXS55IC0gX3BvaW50c1tqXS55LCAyKSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkaXN0YW5jZSA8ICgyICogY29sbGlzaW9uUmFkaXVzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgX3BvaW50c1tpXS5hbmdsZSArPSBTVEVQXG4gICAgICAgICAgICAgICAgICAgICAgICBfcG9pbnRzW2pdLmFuZ2xlIC09IFNURVBcbiAgICAgICAgICAgICAgICAgICAgICAgIGFycmFuZ2VQb2ludHMoKSAvLz09PT09PT4gUmVjdXJzaXZlIGNhbGxcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGFycmFuZ2VQb2ludHMoKVxuXG4gICAgICAgIHJldHVybiBfcG9pbnRzLnJlZHVjZSgoYWNjdW11bGF0b3IsIHBvaW50LCBjdXJyZW50SW5kZXgpID0+IHtcbiAgICAgICAgICAgIGFjY3VtdWxhdG9yW3BvaW50Lm5hbWVdID0gcG9pbnQuYW5nbGVcbiAgICAgICAgICAgIHJldHVybiBhY2N1bXVsYXRvclxuICAgICAgICB9LCB7fSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiB0aGUgYW5nbGUgY29sbGlkZXMgd2l0aCB0aGUgcG9pbnRzXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gYW5nbGVcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBhbmdsZXNMaXN0XG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IFtjb2xsaXNpb25SYWRpdXNdXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqL1xuICAgIHN0YXRpYyBpc0NvbGxpc2lvbihhbmdsZSwgYW5nbGVzTGlzdCwgY29sbGlzaW9uUmFkaXVzID0gMTApIHtcblxuICAgICAgICBjb25zdCBwb2ludEluQ29sbGlzaW9uID0gYW5nbGVzTGlzdC5maW5kKHBvaW50ID0+IHtcblxuICAgICAgICAgICAgbGV0IGEgPSAocG9pbnQgLSBhbmdsZSkgPiBVdGlscy5ERUdfMTgwID8gYW5nbGUgKyBVdGlscy5ERUdfMzYwIDogYW5nbGVcbiAgICAgICAgICAgIGxldCBwID0gKGFuZ2xlIC0gcG9pbnQpID4gVXRpbHMuREVHXzE4MCA/IHBvaW50ICsgVXRpbHMuREVHXzM2MCA6IHBvaW50XG5cbiAgICAgICAgICAgIHJldHVybiBNYXRoLmFicyhhIC0gcCkgPD0gY29sbGlzaW9uUmFkaXVzXG4gICAgICAgIH0pXG5cbiAgICAgICAgcmV0dXJuIHBvaW50SW5Db2xsaXNpb24gIT09IHVuZGVmaW5lZFxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyB0aGUgY29udGVudCBvZiBhbiBlbGVtZW50XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZWxlbWVudElEXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2JlZm9yZUhvb2tdXG4gICAgICpcbiAgICAgKiBAd2FybmluZyAtIEl0IHJlbW92ZXMgRXZlbnQgTGlzdGVuZXJzIHRvby5cbiAgICAgKiBAd2FybmluZyAtIFlvdSB3aWxsIChwcm9iYWJseSkgZ2V0IG1lbW9yeSBsZWFrIGlmIHlvdSBkZWxldGUgZWxlbWVudHMgdGhhdCBoYXZlIGF0dGFjaGVkIGxpc3RlbmVyc1xuICAgICAqL1xuICAgIHN0YXRpYyBjbGVhblVwKGVsZW1lbnRJRCwgYmVmb3JlSG9vaykge1xuICAgICAgICBsZXQgZWxtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudElEKVxuICAgICAgICBpZiAoISBlbG0pIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgKHR5cGVvZiBiZWZvcmVIb29rID09PSAnZnVuY3Rpb24nKSAmJiBiZWZvcmVIb29rKClcblxuICAgICAgICBlbG0uaW5uZXJIVE1MID0gXCJcIlxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogU2ltcGxlIGNvZGUgZm9yIGNvbmZpZyBiYXNlZCB0ZW1wbGF0ZSBzdHJpbmdzXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdGVtcGxhdGVTdHJpbmdcbiAgICAgKiBAcGFyYW0gdGVtcGxhdGVWYXJzXG4gICAgICogQHJldHVybnMgeyp9XG4gICAgICovXG4gICAgc3RhdGljIGZpbGxUZW1wbGF0ZSA9IGZ1bmN0aW9uICh0ZW1wbGF0ZVN0cmluZywgdGVtcGxhdGVWYXJzKSB7XG4gICAgICAgIGxldCBmdW5jID0gbmV3IEZ1bmN0aW9uKC4uLk9iamVjdC5rZXlzKHRlbXBsYXRlVmFycyksIFwicmV0dXJuIGBcIiArIHRlbXBsYXRlU3RyaW5nICsgXCJgO1wiKVxuICAgICAgICByZXR1cm4gZnVuYyguLi5PYmplY3QudmFsdWVzKHRlbXBsYXRlVmFycykpO1xuICAgIH1cbn1cblxuXG5leHBvcnQge1xuICAgIFV0aWxzIGFzXG4gICAgICAgIGRlZmF1bHRcbn1cblxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgVW5pdmVyc2UgZnJvbSAnLi91bml2ZXJzZS9Vbml2ZXJzZS5qcydcbmltcG9ydCBTVkdVdGlscyBmcm9tICcuL3V0aWxzL1NWR1V0aWxzLmpzJ1xuaW1wb3J0IFV0aWxzIGZyb20gJy4vdXRpbHMvVXRpbHMuanMnXG5pbXBvcnQgUmFkaXhDaGFydCBmcm9tICcuL2NoYXJ0cy9SYWRpeENoYXJ0LmpzJ1xuaW1wb3J0IFRyYW5zaXRDaGFydCBmcm9tICcuL2NoYXJ0cy9UcmFuc2l0Q2hhcnQuanMnXG5cbmV4cG9ydCB7VW5pdmVyc2UsIFNWR1V0aWxzLCBVdGlscywgUmFkaXhDaGFydCwgVHJhbnNpdENoYXJ0fVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9