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

    #mask

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
            "points": [...this.#data.points], "cusps": [...this.#data.cusps]
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
        // .filter(aspect => aspect.aspect.name !== 'Conjunction') // Keep them inside the SVG

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
        if (typeof this.#mask !== "undefined") {
            // Appelé deux fois quand on est en mode Transit
            this.#mask.querySelector('circle[fill="black"]').setAttribute('r', this.getCenterCircleRadius());
            return;
        }

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
        this.#mask = mask
        wrapper.appendChild(this.#mask)

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
            name: _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_AS, angle: cusps[0].angle
        }, {
            name: _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_IC, angle: cusps[3].angle
        }, {
            name: _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_DS, angle: cusps[6].angle
        }, {
            name: _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_MC, angle: cusps[9].angle
        },]

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
        if (! (radix instanceof _charts_RadixChart_js__WEBPACK_IMPORTED_MODULE_0__["default"])) {
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

        // Top layer to put on top elements through <use>
        // https://developer.mozilla.org/fr/docs/Web/SVG/Reference/Element/use
        let topLayerGroup = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGGroup();
        topLayerGroup.setAttribute('id', this.#settings.TOP_LAYER_ID ?? 'c-top-layer')
        this.#radix.getUniverse().getSVGDocument().appendChild(topLayerGroup)

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
            "points": [...this.#data.points], "cusps": [...this.#data.cusps]
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
    getAspects(fromPoints, toPoints, aspects) {
        if (! this.#data) {
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
    drawAspects(fromPoints, toPoints, aspects) {
        const aspectsWrapper = this.#radix.getUniverse().getAspectsElement()
        _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].cleanUp(aspectsWrapper.getAttribute("id"), this.#beforeCleanUpHook)

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
        // .filter(aspect => aspect.aspect.name !== 'Conjunction') // Keep them inside the SVG

        const circle = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGCircle(this.#centerX, this.#centerY, this.#radix.getCenterCircleRadius())
        circle.setAttribute('fill', this.#settings.ASPECTS_BACKGROUND_COLOR)
        aspectsWrapper.appendChild(circle)

        aspectsWrapper.appendChild(_utils_AspectUtils_js__WEBPACK_IMPORTED_MODULE_4__["default"].drawAspects(this.#radix.getCenterCircleRadius(), this.#radix.getAscendantShift(), this.#settings, aspectsList))

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
        this.#drawCusps(data)
        this.#drawPoints(data)
        this.#drawRuler()
        this.#drawBorders()
        this.#settings.CHART_DRAW_MAIN_AXIS && this.#drawMainAxisDescription(data)
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
        wrapper.classList.add('c-transit-points')

        const positions = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].calculatePositionWithoutOverlapping(points, this.#settings.POINT_COLLISION_RADIUS, this.#getPointCircleRadius())

        for (const pointData of points) {
            const pointGroup = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGGroup();
            pointGroup.classList.add('c-transit-point')
            pointGroup.classList.add('c-transit-point--' + pointData.name.toLowerCase())

            const point = new _points_Point_js__WEBPACK_IMPORTED_MODULE_5__["default"](pointData, cusps, this.#settings)
            const pointPosition = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].positionOnCircle(this.#centerX, this.#centerX, this.#getRullerCircleRadius() - ((this.getRadius() - this.#getRullerCircleRadius()) / 4), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].degreeToRadian(point.getAngle(), this.#radix.getAscendantShift()))
            const symbolPosition = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].positionOnCircle(this.#centerX, this.#centerX, this.#getPointCircleRadius(), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].degreeToRadian(positions[point.getName()], this.#radix.getAscendantShift()))

            // ruler mark
            const rulerLineEndPosition = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].positionOnCircle(this.#centerX, this.#centerX, this.#getRullerCircleRadius(), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].degreeToRadian(point.getAngle(), this.#radix.getAscendantShift()))

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
            const pointerLineEndPosition = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].positionOnCircle(this.#centerX, this.#centerX, this.#getPointCircleRadius(), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].degreeToRadian(positions[point.getName()], this.#radix.getAscendantShift()))

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
            const symbol = point.getSymbol(symbolPosition.x, symbolPosition.y, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].DEG_0, this.#settings.POINT_PROPERTIES_SHOW)
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
        wrapper.classList.add('c-transit-cusps')

        const textRadius = this.#getCenterCircleRadius() + ((this.#getRullerCircleRadius() - this.#getCenterCircleRadius()) / 6)

        for (let i = 0; i < cusps.length; i++) {

            const isLineInCollisionWithPoint = ! this.#settings.CHART_ALLOW_HOUSE_OVERLAP && _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].isCollision(cusps[i].angle, pointsPositions, this.#settings.POINT_COLLISION_RADIUS / 2)

            const startPos = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].positionOnCircle(this.#centerX, this.#centerY, this.#getCenterCircleRadius(), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].degreeToRadian(cusps[i].angle, this.#radix.getAscendantShift()))
            const endPos = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].positionOnCircle(this.#centerX, this.#centerY, isLineInCollisionWithPoint ? this.#getCenterCircleRadius() + ((this.#getRullerCircleRadius() - this.#getCenterCircleRadius()) / 6) : this.#getRullerCircleRadius(), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].degreeToRadian(cusps[i].angle, this.#radix.getAscendantShift()))

            const line = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGLine(startPos.x, startPos.y, endPos.x, endPos.y)
            line.setAttribute("stroke", mainAxisIndexes.includes(i) ? this.#settings.CHART_MAIN_AXIS_COLOR : this.#settings.CHART_LINE_COLOR)
            line.setAttribute("stroke-width", mainAxisIndexes.includes(i) ? this.#settings.CHART_MAIN_STROKE : this.#settings.CHART_STROKE)
            wrapper.appendChild(line);

            const startCusp = cusps[i].angle
            const endCusp = cusps[(i + 1) % 12].angle
            const gap = endCusp - startCusp > 0 ? endCusp - startCusp : endCusp - startCusp + _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].DEG_360
            const textAngle = startCusp + gap / 2

            const textPos = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].positionOnCircle(this.#centerX, this.#centerY, textRadius, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].degreeToRadian(textAngle, this.#radix.getAscendantShift()))
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
            name: _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_AS, angle: cusps[0].angle
        }, {
            name: _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_IC, angle: cusps[3].angle
        }, {
            name: _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_DS, angle: cusps[6].angle
        }, {
            name: _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_MC, angle: cusps[9].angle
        },]

        const wrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGGroup()
        wrapper.classList.add('c-transit-axis')

        const rad1 = this.getRadius();
        const rad2 = this.getRadius() + AXIS_LENGTH;

        for (const axis of axisList) {
            const axisGroup = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGGroup()
            axisGroup.classList.add('c-transit-axis__axis')
            axisGroup.classList.add('c-transit-axis__axis--' + axis.name.toLowerCase())

            let startPoint = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].positionOnCircle(this.#centerX, this.#centerY, rad1, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].degreeToRadian(axis.angle, this.#radix.getAscendantShift()))
            let endPoint = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].positionOnCircle(this.#centerX, this.#centerY, rad2, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].degreeToRadian(axis.angle, this.#radix.getAscendantShift()))
            let line = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGLine(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
            line.setAttribute("stroke", this.#settings.CHART_MAIN_AXIS_COLOR);
            line.setAttribute("stroke-width", this.#settings.CHART_MAIN_STROKE);
            axisGroup.appendChild(line);

            let textPoint = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].positionOnCircle(this.#centerX, this.#centerY, rad2 + AXIS_LENGTH, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].degreeToRadian(axis.angle, this.#radix.getAscendantShift()))
            let symbol;
            let SHIFT_X = 0;
            let SHIFT_Y = 0;
            const STEP = 0; // Décalage disabled

            switch (axis.name) {
                case "As":
                    SHIFT_X -= STEP
                    SHIFT_Y -= STEP
                    _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_AS_CODE = this.#settings.SYMBOL_AS_CODE ?? _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_AS_CODE;
                    symbol = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGSymbol(axis.name, textPoint.x + SHIFT_X, textPoint.y + SHIFT_Y)
                    symbol.setAttribute("text-anchor", "middle")
                    symbol.setAttribute("dominant-baseline", "middle")
                    break;
                case "Ds":
                    SHIFT_X += STEP
                    SHIFT_Y -= STEP
                    _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_DS_CODE = this.#settings.SYMBOL_DS_CODE ?? _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_DS_CODE;
                    symbol = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGSymbol(axis.name, textPoint.x + SHIFT_X, textPoint.y + SHIFT_Y)
                    symbol.setAttribute("text-anchor", "middle")
                    symbol.setAttribute("dominant-baseline", "middle")
                    break;
                case "Mc":
                    SHIFT_Y -= STEP
                    _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_MC_CODE = this.#settings.SYMBOL_MC_CODE ?? _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_MC_CODE;
                    symbol = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGSymbol(axis.name, textPoint.x + SHIFT_X, textPoint.y + SHIFT_Y)
                    symbol.setAttribute("text-anchor", "middle")
                    symbol.setAttribute("dominant-baseline", "middle")
                    break;
                case "Ic":
                    SHIFT_Y += STEP
                    _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_IC_CODE = this.#settings.SYMBOL_IC_CODE ?? _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_IC_CODE;
                    symbol = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGSymbol(axis.name, textPoint.x + SHIFT_X, textPoint.y + SHIFT_Y)
                    symbol.setAttribute("text-anchor", "middle")
                    symbol.setAttribute("dominant-baseline", "middle")
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
        wrapper.classList.add('c-transit-borders')

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
        symbol.setAttribute('data-name', this.#name)

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
/* harmony export */   POINT_STROKE_LINECAP: () => (/* binding */ POINT_STROKE_LINECAP),
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
const POINT_STROKE_LINECAP = 'butt';

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

/**
 * Add <title></title> elements in the SVG
 * @type {boolean}
 */
const INSERT_ELEMENT_TITLE = false

const ELEMENT_TITLES = {
    // axis: {
    //     As: "Ascendant",
    //     Mc: "Midheaven",
    //     Ds: "Descendant",
    //     Ic: "Imum Coeli",
    // },
    // signs: {
    //     aries: "Aries",
    //     taurus: "Taurus",
    //     gemini: "Gemini",
    //     cancer: "Cancer",
    //     leo: "Leo",
    //     virgo: "Virgo",
    //     libra: "Libra",
    //     scorpio: "Scorpio",
    //     sagittarius: "Sagittarius",
    //     capricorn: "Capricorn",
    //     aquarius: "Aquarius",
    //     pisces: "Pisces"
    // },
    // points: {
    //     sun: "Sun",
    //     moon: "Moon",
    //     mercury: "Mercury",
    //     venus: "Venus",
    //     earth: "Earth",
    //     mars: "Mars",
    //     jupiter: "Jupiter",
    //     saturn: "Saturn",
    //     uranus: "Uranus",
    //     neptune: "Neptune",
    //     pluto: "Pluto",
    //     chiron: "Chiron",
    //     lilith: "Lilith",
    //     nnode: "North Node",
    //     snode: "South Node"
    // },
    // retrograde: "Retrograde",
    // aspects: {
    //     conjunction: "Conjunction",
    //     opposition: "Opposition",
    //     square: "Square",
    //     trine: "Trine",
    //     sextile: "Sextile",
    //     quincunx: "Quincunx",
    //     "semi-sextile": "Semi-sextile",
    //     "semi-square": "Semi-square",
    //     octile: "Octile",
    //     sesquisquare: "Sesquisquare",
    //     trioctile: "Trioctile",
    //     quintile: "Quintile",
    //     biquintile: "Biquintile",
    //     "semi-quintile": "Semi-quintile",
    // }
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
            // console.error("@see https://developer.mozilla.org/en-US/docs/Web/API/CSS_Font_Loading_API")
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
            aspectGroup.dataset.precision = asp.precision
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

            if (asp.aspect.name === 'Conjunction') {
                // No lines for Conjuctions
                continue;
            }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUN6QyxRQUFRLG1DQUFtQztBQUMzQyxRQUFRLG1DQUFtQztBQUMzQztBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ087QUFDUCxLQUFLLGtEQUFrRDtBQUN2RCxLQUFLLG1EQUFtRDtBQUN4RCxLQUFLLDhDQUE4QztBQUNuRCxLQUFLLDhDQUE4QztBQUNuRCxLQUFLLCtDQUErQzs7QUFFcEQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM1REE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMzUEE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNPOztBQUVQO0FBQ0EsMERBQTBELE1BQU07QUFDaEUsVUFBVTtBQUNWO0FBQ08sMEJBQTBCLE1BQU07OztBQUd2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNPO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRVA7QUFDQTtBQUNBO0FBQ087QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDcEpQOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7O0FBR0E7QUFDQTtBQUNBOztBQUVQO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDTzs7QUFFQTtBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7QUM1R0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2hCUDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNPOzs7QUFHUDtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNPOzs7QUFHUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNPOztBQUVQO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDTzs7QUFFUDtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ087O0FBRVA7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNPOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ25Kc0Q7QUFDakI7QUFDSztBQUNJOzs7QUFHckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWUsUUFBUTtBQUN2QixlQUFlLFFBQVE7QUFDdkI7QUFDQSwyQ0FBMkM7O0FBRTNDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEseUNBQXlDLEVBQUUsb0VBQWU7QUFDMUQ7QUFDQSxTQUFTO0FBQ1QsNEJBQTRCLDBEQUFRO0FBQ3BDOztBQUVBO0FBQ0EsZ0NBQWdDLDBEQUFRO0FBQ3hDO0FBQ0EsdUJBQXVCLDBEQUFRO0FBQy9CO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsK0JBQStCLDBEQUFRO0FBQ3ZDLG1EQUFtRCwrQkFBK0IsR0FBRywwQkFBMEI7QUFDL0c7O0FBRUEsMEJBQTBCLDZEQUFVO0FBQ3BDLDRCQUE0QiwrREFBWTs7QUFFeEM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGNBQWMsUUFBUTtBQUN0QixjQUFjLFFBQVE7QUFDdEIsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaURBQWlELE9BQU87O0FBRXhEO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTs7QUFLQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMzSTZCO0FBQ087O0FBRXJDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFFBQVE7QUFDdkIsZUFBZSxRQUFRO0FBQ3ZCLGVBQWUsUUFBUTtBQUN2QjtBQUNBLGdCQUFnQixRQUFRO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEseUJBQXlCLGlEQUFLO0FBQzlCLHlCQUF5QixpREFBSztBQUM5Qjs7QUFFQSxVQUFVO0FBQ1Y7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsZUFBZSxlQUFlLHFCQUFxQixHQUFHLHNCQUFzQixHQUFHLDBCQUEwQjtBQUN4SCxlQUFlLGVBQWUsYUFBYSxtQkFBbUIsR0FBRyxvQkFBb0I7QUFDckYsZUFBZSxlQUFlLFlBQVksb0NBQW9DLEdBQUcsK0JBQStCO0FBQ2hIO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0MsOENBQThDLFVBQVUsZ0JBQWdCO0FBQzVHO0FBQ0E7QUFDQSw4QkFBOEI7QUFDOUI7QUFDQTs7QUFFQTtBQUNBLHlDQUF5QyxxREFBcUQ7QUFDOUY7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFFBQVE7QUFDdkIsZUFBZSxRQUFRO0FBQ3ZCLGVBQWUsUUFBUTtBQUN2QixlQUFlLGVBQWU7QUFDOUI7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsd0JBQXdCLG9EQUFRO0FBQ2hDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxnQ0FBZ0Msb0RBQVE7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixHQUFHLHFCQUFxQixHQUFHLHFCQUFxQixJQUFJLHFCQUFxQixFQUFFLHFCQUFxQjtBQUNySDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qix3QkFBd0I7QUFDaEQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhCQUE4QixpREFBSyw0Q0FBNEMsaURBQUs7QUFDcEYsNEJBQTRCLGlEQUFLLDRDQUE0QyxpREFBSzs7QUFFbEY7O0FBRUEsMEJBQTBCLG9EQUFRO0FBQ2xDOztBQUVBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsMEJBQTBCLG9EQUFRO0FBQ2xDOztBQUVBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qix3QkFBd0I7QUFDaEQ7QUFDQTs7QUFFQTtBQUNBLDhCQUE4QixpREFBSyw0Q0FBNEMsaURBQUs7QUFDcEYsNEJBQTRCLGlEQUFLLDRDQUE0QyxpREFBSzs7QUFFbEY7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLG9EQUFRO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsbUNBQW1DLG9EQUFRO0FBQzNDOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBS0M7Ozs7Ozs7Ozs7Ozs7OztBQzVQRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EscUNBQXFDO0FBQ3JDO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSw4Q0FBOEM7QUFDOUM7O0FBRUEsaURBQWlEO0FBQ2pELDJDQUEyQzs7QUFFM0M7QUFDQTtBQUNBLGtEQUFrRDs7QUFFbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxRQUFRO0FBQ3ZCLGVBQWUsUUFBUTtBQUN2QjtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxRQUFRO0FBQ3ZCLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFFBQVE7QUFDdkI7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxLQUFLO0FBQ3BCLGVBQWUsS0FBSztBQUNwQixlQUFlLEtBQUs7QUFDcEIsZUFBZSxLQUFLO0FBQ3BCLGVBQWUsS0FBSztBQUNwQixlQUFlLEtBQUs7QUFDcEI7QUFDQSxnQkFBZ0IsWUFBWTtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLEtBQUs7QUFDcEIsZUFBZSxLQUFLO0FBQ3BCLGVBQWUsS0FBSztBQUNwQjtBQUNBLGdCQUFnQixZQUFZO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFFBQVE7QUFDdkIsZUFBZSxRQUFRO0FBQ3ZCLGVBQWUsUUFBUTtBQUN2QixlQUFlLFFBQVE7QUFDdkI7QUFDQSxnQkFBZ0IsWUFBWTtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZSxRQUFRO0FBQ3ZCLGVBQWUsUUFBUTtBQUN2QixlQUFlLFFBQVE7QUFDdkIsZUFBZSxRQUFRO0FBQ3ZCO0FBQ0EsZ0JBQWdCLFlBQVk7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFFBQVE7QUFDdkIsZUFBZSxRQUFRO0FBQ3ZCLGVBQWUsUUFBUTtBQUN2QjtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7O0FBR0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7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YXN0cm9sb2d5L3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvY2hhcnRzL0NoYXJ0LmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy9jaGFydHMvUmFkaXhDaGFydC5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvY2hhcnRzL1RyYW5zaXRDaGFydC5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvcG9pbnRzL1BvaW50LmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy9zZXR0aW5ncy9EZWZhdWx0U2V0dGluZ3MuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL3NldHRpbmdzL2NvbnN0YW50cy9Bc3BlY3RzLmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy9zZXR0aW5ncy9jb25zdGFudHMvQ29sb3JzLmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy9zZXR0aW5ncy9jb25zdGFudHMvUG9pbnQuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL3NldHRpbmdzL2NvbnN0YW50cy9SYWRpeC5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvc2V0dGluZ3MvY29uc3RhbnRzL1RyYW5zaXQuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL3NldHRpbmdzL2NvbnN0YW50cy9Vbml2ZXJzZS5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvdW5pdmVyc2UvVW5pdmVyc2UuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL3V0aWxzL0FzcGVjdFV0aWxzLmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy91dGlscy9TVkdVdGlscy5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvdXRpbHMvVXRpbHMuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2FzdHJvbG9neS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcImFzdHJvbG9neVwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJhc3Ryb2xvZ3lcIl0gPSBmYWN0b3J5KCk7XG59KShzZWxmLCAoKSA9PiB7XG5yZXR1cm4gIiwiaW1wb3J0IFV0aWxzIGZyb20gJy4uL3V0aWxzL1V0aWxzLmpzJztcblxuLy8gbm9pbnNwZWN0aW9uIEpTVW51c2VkR2xvYmFsU3ltYm9sc1xuLyoqXG4gKiBAY2xhc3NcbiAqIEBjbGFzc2Rlc2MgQW4gYWJzdHJhY3QgY2xhc3MgZm9yIGFsbCB0eXBlIG9mIENoYXJ0XG4gKiBAcHVibGljXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKiBAYWJzdHJhY3RcbiAqL1xuY2xhc3MgQ2hhcnQge1xuXG4gIC8vI3NldHRpbmdzXG5cbiAgLyoqXG4gICAqIEBjb25zdHJ1Y3RzXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzZXR0aW5nc1xuICAgKi9cbiAgY29uc3RydWN0b3Ioc2V0dGluZ3MpIHtcbiAgICAvL3RoaXMuI3NldHRpbmdzID0gc2V0dGluZ3NcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgZGF0YSBpcyB2YWxpZFxuICAgKiBAdGhyb3dzIHtFcnJvcn0gLSBpZiB0aGUgZGF0YSBpcyB1bmRlZmluZWQuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gICAqIEByZXR1cm4ge09iamVjdH0gLSB7aXNWYWxpZDpib29sZWFuLCBtZXNzYWdlOlN0cmluZ31cbiAgICovXG4gIHZhbGlkYXRlRGF0YShkYXRhKSB7XG4gICAgaWYgKCFkYXRhKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNaXNpbmcgcGFyYW0gZGF0YS5cIilcbiAgICB9XG5cbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoZGF0YS5wb2ludHMpKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpc1ZhbGlkOiBmYWxzZSxcbiAgICAgICAgbWVzc2FnZTogXCJwb2ludHMgaXMgbm90IEFycmF5LlwiXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGRhdGEuY3VzcHMpKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpc1ZhbGlkOiBmYWxzZSxcbiAgICAgICAgbWVzc2FnZTogXCJjdXBzIGlzIG5vdCBBcnJheS5cIlxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChkYXRhLmN1c3BzLmxlbmd0aCAhPT0gMTIpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlzVmFsaWQ6IGZhbHNlLFxuICAgICAgICBtZXNzYWdlOiBcImN1c3BzLmxlbmd0aCAhPT0gMTJcIlxuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAobGV0IHBvaW50IG9mIGRhdGEucG9pbnRzKSB7XG4gICAgICBpZiAodHlwZW9mIHBvaW50Lm5hbWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaXNWYWxpZDogZmFsc2UsXG4gICAgICAgICAgbWVzc2FnZTogXCJwb2ludC5uYW1lICE9PSAnc3RyaW5nJ1wiXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChwb2ludC5uYW1lLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGlzVmFsaWQ6IGZhbHNlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwicG9pbnQubmFtZS5sZW5ndGggPT0gMFwiXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgcG9pbnQuYW5nbGUgIT09ICdudW1iZXInKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaXNWYWxpZDogZmFsc2UsXG4gICAgICAgICAgbWVzc2FnZTogXCJwb2ludC5hbmdsZSAhPT0gJ251bWJlcidcIlxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChsZXQgY3VzcCBvZiBkYXRhLmN1c3BzKSB7XG4gICAgICBpZiAodHlwZW9mIGN1c3AuYW5nbGUgIT09ICdudW1iZXInKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaXNWYWxpZDogZmFsc2UsXG4gICAgICAgICAgbWVzc2FnZTogXCJjdXNwLmFuZ2xlICE9PSAnbnVtYmVyJ1wiXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgaXNWYWxpZDogdHJ1ZSxcbiAgICAgIG1lc3NhZ2U6IFwiXCJcbiAgICB9XG4gIH1cbiAgXG4gIC8qKlxuICAgKiBAYWJzdHJhY3RcbiAgICovXG4gIHNldERhdGEoZGF0YSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIk11c3QgYmUgaW1wbGVtZW50ZWQgYnkgc3ViY2xhc3MuXCIpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBhYnN0cmFjdFxuICAgKi9cbiAgZ2V0UG9pbnRzKCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIk11c3QgYmUgaW1wbGVtZW50ZWQgYnkgc3ViY2xhc3MuXCIpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBhYnN0cmFjdFxuICAgKi9cbiAgZ2V0UG9pbnQobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIk11c3QgYmUgaW1wbGVtZW50ZWQgYnkgc3ViY2xhc3MuXCIpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBhYnN0cmFjdFxuICAgKi9cbiAgYW5pbWF0ZVRvKGRhdGEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJNdXN0IGJlIGltcGxlbWVudGVkIGJ5IHN1YmNsYXNzLlwiKTtcbiAgfVxuXG4gIC8vICMjIFBST1RFQ1RFRCAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxufVxuXG5leHBvcnQge1xuICBDaGFydCBhc1xuICBkZWZhdWx0XG59XG4iLCJpbXBvcnQgVW5pdmVyc2UgZnJvbSAnLi4vdW5pdmVyc2UvVW5pdmVyc2UuanMnO1xuaW1wb3J0IFNWR1V0aWxzIGZyb20gJy4uL3V0aWxzL1NWR1V0aWxzLmpzJztcbmltcG9ydCBVdGlscyBmcm9tICcuLi91dGlscy9VdGlscy5qcyc7XG5pbXBvcnQgQXNwZWN0VXRpbHMgZnJvbSAnLi4vdXRpbHMvQXNwZWN0VXRpbHMuanMnO1xuaW1wb3J0IENoYXJ0IGZyb20gJy4vQ2hhcnQuanMnXG5pbXBvcnQgUG9pbnQgZnJvbSAnLi4vcG9pbnRzL1BvaW50LmpzJ1xuaW1wb3J0IERlZmF1bHRTZXR0aW5ncyBmcm9tICcuLi9zZXR0aW5ncy9EZWZhdWx0U2V0dGluZ3MuanMnO1xuXG4vKipcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyBQb2ludHMgYW5kIGN1cHMgYXJlIGRpc3BsYXllZCBpbnNpZGUgdGhlIFVuaXZlcnNlLlxuICogQHB1YmxpY1xuICogQGV4dGVuZHMge0NoYXJ0fVxuICovXG5jbGFzcyBSYWRpeENoYXJ0IGV4dGVuZHMgQ2hhcnQge1xuXG4gICAgLypcbiAgICAgKiBMZXZlbHMgZGV0ZXJtaW5lIHRoZSB3aWR0aCBvZiBpbmRpdmlkdWFsIHBhcnRzIG9mIHRoZSBjaGFydC5cbiAgICAgKiBJdCBjYW4gYmUgY2hhbmdlZCBkeW5hbWljYWxseSBieSBwdWJsaWMgc2V0dGVyLlxuICAgICAqL1xuICAgICNudW1iZXJPZkxldmVscyA9IDI0XG5cbiAgICAjdW5pdmVyc2VcbiAgICAjc2V0dGluZ3NcbiAgICAjcm9vdFxuICAgICNkYXRhXG5cbiAgICAjY2VudGVyWFxuICAgICNjZW50ZXJZXG4gICAgI3JhZGl1c1xuXG4gICAgI21hc2tcblxuICAgIC8qXG4gICAgICogQHNlZSBVdGlscy5jbGVhblVwKClcbiAgICAgKi9cbiAgICAjYmVmb3JlQ2xlYW5VcEhvb2tcblxuICAgIC8qKlxuICAgICAqIEBjb25zdHJ1Y3RzXG4gICAgICogQHBhcmFtIHtVbml2ZXJzZX0gVW5pdmVyc2VcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcih1bml2ZXJzZSkge1xuXG4gICAgICAgIGlmICghIHVuaXZlcnNlIGluc3RhbmNlb2YgVW5pdmVyc2UpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQmFkIHBhcmFtIHVuaXZlcnNlLicpXG4gICAgICAgIH1cblxuICAgICAgICBzdXBlcih1bml2ZXJzZS5nZXRTZXR0aW5ncygpKVxuXG4gICAgICAgIHRoaXMuI3VuaXZlcnNlID0gdW5pdmVyc2VcbiAgICAgICAgdGhpcy4jc2V0dGluZ3MgPSB0aGlzLiN1bml2ZXJzZS5nZXRTZXR0aW5ncygpXG4gICAgICAgIHRoaXMuI2NlbnRlclggPSB0aGlzLiNzZXR0aW5ncy5DSEFSVF9WSUVXQk9YX1dJRFRIIC8gMlxuICAgICAgICB0aGlzLiNjZW50ZXJZID0gdGhpcy4jc2V0dGluZ3MuQ0hBUlRfVklFV0JPWF9IRUlHSFQgLyAyXG4gICAgICAgIHRoaXMuI3JhZGl1cyA9IE1hdGgubWluKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclkpIC0gdGhpcy4jc2V0dGluZ3MuQ0hBUlRfUEFERElOR1xuXG4gICAgICAgIHRoaXMuI3Jvb3QgPSBTVkdVdGlscy5TVkdHcm91cCgpXG4gICAgICAgIHRoaXMuI3Jvb3Quc2V0QXR0cmlidXRlKFwiaWRcIiwgYCR7dGhpcy4jc2V0dGluZ3MuSFRNTF9FTEVNRU5UX0lEfS0ke3RoaXMuI3NldHRpbmdzLlJBRElYX0lEfWApXG4gICAgICAgIHRoaXMuI3VuaXZlcnNlLmdldFNWR0RvY3VtZW50KCkuYXBwZW5kQ2hpbGQodGhpcy4jcm9vdCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXQgY2hhcnQgZGF0YVxuICAgICAqIEB0aHJvd3Mge0Vycm9yfSAtIGlmIHRoZSBkYXRhIGlzIG5vdCB2YWxpZC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICAgICAqIEByZXR1cm4ge1JhZGl4Q2hhcnR9XG4gICAgICovXG4gICAgc2V0RGF0YShkYXRhKSB7XG4gICAgICAgIGxldCBzdGF0dXMgPSB0aGlzLnZhbGlkYXRlRGF0YShkYXRhKVxuICAgICAgICBpZiAoISBzdGF0dXMuaXNWYWxpZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHN0YXR1cy5tZXNzYWdlKVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy4jZGF0YSA9IGRhdGFcbiAgICAgICAgdGhpcy4jZHJhdyhkYXRhKVxuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IGRhdGFcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG4gICAgZ2V0RGF0YSgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIFwicG9pbnRzXCI6IFsuLi50aGlzLiNkYXRhLnBvaW50c10sIFwiY3VzcHNcIjogWy4uLnRoaXMuI2RhdGEuY3VzcHNdXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXQgbnVtYmVyIG9mIExldmVscy5cbiAgICAgKiBMZXZlbHMgZGV0ZXJtaW5lIHRoZSB3aWR0aCBvZiBpbmRpdmlkdWFsIHBhcnRzIG9mIHRoZSBjaGFydC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHNldE51bWJlck9mTGV2ZWxzKGxldmVscykge1xuICAgICAgICB0aGlzLiNudW1iZXJPZkxldmVscyA9IE1hdGgubWF4KDI0LCBsZXZlbHMpXG4gICAgICAgIGlmICh0aGlzLiNkYXRhKSB7XG4gICAgICAgICAgICB0aGlzLiNkcmF3KHRoaXMuI2RhdGEpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCByYWRpdXNcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAgICovXG4gICAgZ2V0UmFkaXVzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy4jcmFkaXVzXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHJhZGl1c1xuICAgICAqIEByZXR1cm4ge051bWJlcn1cbiAgICAgKi9cbiAgICBnZXRPdXRlckNpcmNsZVJhZGl1cygpIHtcbiAgICAgICAgcmV0dXJuIDI0ICogKHRoaXMuZ2V0UmFkaXVzKCkgLyB0aGlzLiNudW1iZXJPZkxldmVscylcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgcmFkaXVzXG4gICAgICogQHJldHVybiB7TnVtYmVyfVxuICAgICAqL1xuICAgIGdldElubmVyQ2lyY2xlUmFkaXVzKCkge1xuICAgICAgICByZXR1cm4gMjEgKiAodGhpcy5nZXRSYWRpdXMoKSAvIHRoaXMuI251bWJlck9mTGV2ZWxzKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCByYWRpdXNcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAgICovXG4gICAgZ2V0UnVsbGVyQ2lyY2xlUmFkaXVzKCkge1xuICAgICAgICByZXR1cm4gMjAgKiAodGhpcy5nZXRSYWRpdXMoKSAvIHRoaXMuI251bWJlck9mTGV2ZWxzKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCByYWRpdXNcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAgICovXG4gICAgZ2V0UG9pbnRDaXJjbGVSYWRpdXMoKSB7XG4gICAgICAgIHJldHVybiAxOCAqICh0aGlzLmdldFJhZGl1cygpIC8gdGhpcy4jbnVtYmVyT2ZMZXZlbHMpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHJhZGl1c1xuICAgICAqIEByZXR1cm4ge051bWJlcn1cbiAgICAgKi9cbiAgICBnZXRDZW50ZXJDaXJjbGVSYWRpdXMoKSB7XG4gICAgICAgIHJldHVybiAxMiAqICh0aGlzLmdldFJhZGl1cygpIC8gdGhpcy4jbnVtYmVyT2ZMZXZlbHMpICogKHRoaXMuI3NldHRpbmdzLkNIQVJUX0NFTlRFUl9TSVpFID8/IDEpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IFVuaXZlcnNlXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtVbml2ZXJzZX1cbiAgICAgKi9cbiAgICBnZXRVbml2ZXJzZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI3VuaXZlcnNlXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IEFzY2VuZGF0IHNoaWZ0XG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAgICovXG4gICAgZ2V0QXNjZW5kYW50U2hpZnQoKSB7XG4gICAgICAgIHJldHVybiAodGhpcy4jZGF0YT8uY3VzcHNbMF0/LmFuZ2xlID8/IDApICsgVXRpbHMuREVHXzE4MFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBhc3BlY3RzXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IFtmcm9tUG9pbnRzXSAtIFt7bmFtZTpcIk1vb25cIiwgYW5nbGU6MH0sIHtuYW1lOlwiU3VuXCIsIGFuZ2xlOjE3OX0sIHtuYW1lOlwiTWVyY3VyeVwiLCBhbmdsZToxMjF9XVxuICAgICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gW3RvUG9pbnRzXSAtIFt7bmFtZTpcIkFTXCIsIGFuZ2xlOjB9LCB7bmFtZTpcIklDXCIsIGFuZ2xlOjkwfV1cbiAgICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IFthc3BlY3RzXSAtIFt7bmFtZTpcIk9wcG9zaXRpb25cIiwgYW5nbGU6MTgwLCBvcmI6Mn0sIHtuYW1lOlwiVHJpbmVcIiwgYW5nbGU6MTIwLCBvcmI6Mn1dXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtBcnJheTxPYmplY3Q+fVxuICAgICAqL1xuICAgIGdldEFzcGVjdHMoZnJvbVBvaW50cywgdG9Qb2ludHMsIGFzcGVjdHMpIHtcbiAgICAgICAgaWYgKCEgdGhpcy4jZGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBmcm9tUG9pbnRzID0gZnJvbVBvaW50cyA/PyB0aGlzLiNkYXRhLnBvaW50cy5maWx0ZXIoeCA9PiBcImFzcGVjdFwiIGluIHggPyB4LmFzcGVjdCA6IHRydWUpXG4gICAgICAgIHRvUG9pbnRzID0gdG9Qb2ludHMgPz8gWy4uLnRoaXMuI2RhdGEucG9pbnRzLmZpbHRlcih4ID0+IFwiYXNwZWN0XCIgaW4geCA/IHguYXNwZWN0IDogdHJ1ZSksIC4uLnRoaXMuI2RhdGEuY3VzcHMuZmlsdGVyKHggPT4geC5hc3BlY3QpXVxuICAgICAgICBhc3BlY3RzID0gYXNwZWN0cyA/PyB0aGlzLiNzZXR0aW5ncy5ERUZBVUxUX0FTUEVDVFMgPz8gRGVmYXVsdFNldHRpbmdzLkRFRkFVTFRfQVNQRUNUU1xuXG4gICAgICAgIHJldHVybiBBc3BlY3RVdGlscy5nZXRBc3BlY3RzKGZyb21Qb2ludHMsIHRvUG9pbnRzLCBhc3BlY3RzKS5maWx0ZXIoYXNwZWN0ID0+IGFzcGVjdC5mcm9tLm5hbWUgIT09IGFzcGVjdC50by5uYW1lKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERyYXcgYXNwZWN0c1xuICAgICAqXG4gICAgICogQHBhcmFtIHtBcnJheTxPYmplY3Q+fSBbZnJvbVBvaW50c10gLSBbe25hbWU6XCJNb29uXCIsIGFuZ2xlOjB9LCB7bmFtZTpcIlN1blwiLCBhbmdsZToxNzl9LCB7bmFtZTpcIk1lcmN1cnlcIiwgYW5nbGU6MTIxfV1cbiAgICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IFt0b1BvaW50c10gLSBbe25hbWU6XCJBU1wiLCBhbmdsZTowfSwge25hbWU6XCJJQ1wiLCBhbmdsZTo5MH1dXG4gICAgICogQHBhcmFtIHtBcnJheTxPYmplY3Q+fSBbYXNwZWN0c10gLSBbe25hbWU6XCJPcHBvc2l0aW9uXCIsIGFuZ2xlOjE4MCwgb3JiOjJ9LCB7bmFtZTpcIlRyaW5lXCIsIGFuZ2xlOjEyMCwgb3JiOjJ9XVxuICAgICAqXG4gICAgICogQHJldHVybiB7QXJyYXk8T2JqZWN0Pn1cbiAgICAgKi9cbiAgICBkcmF3QXNwZWN0cyhmcm9tUG9pbnRzLCB0b1BvaW50cywgYXNwZWN0cykge1xuICAgICAgICBjb25zdCBhc3BlY3RzV3JhcHBlciA9IHRoaXMuI3VuaXZlcnNlLmdldEFzcGVjdHNFbGVtZW50KClcbiAgICAgICAgVXRpbHMuY2xlYW5VcChhc3BlY3RzV3JhcHBlci5nZXRBdHRyaWJ1dGUoXCJpZFwiKSwgdGhpcy4jYmVmb3JlQ2xlYW5VcEhvb2spXG5cbiAgICAgICAgY29uc3QgYXNwZWN0c0xpc3QgPSB0aGlzLmdldEFzcGVjdHMoZnJvbVBvaW50cywgdG9Qb2ludHMsIGFzcGVjdHMpXG4gICAgICAgICAgICAucmVkdWNlKChhcnIsIGFzcGVjdCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgbGV0IGlzVGhlU2FtZSA9IGFyci5zb21lKGVsbSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlbG0uZnJvbS5uYW1lID09PSBhc3BlY3QudG8ubmFtZSAmJiBlbG0udG8ubmFtZSA9PT0gYXNwZWN0LmZyb20ubmFtZVxuICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICBpZiAoISBpc1RoZVNhbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgYXJyLnB1c2goYXNwZWN0KVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBhcnJcbiAgICAgICAgICAgIH0sIFtdKVxuICAgICAgICAvLyAuZmlsdGVyKGFzcGVjdCA9PiBhc3BlY3QuYXNwZWN0Lm5hbWUgIT09ICdDb25qdW5jdGlvbicpIC8vIEtlZXAgdGhlbSBpbnNpZGUgdGhlIFNWR1xuXG4gICAgICAgIGNvbnN0IGNpcmNsZSA9IFNWR1V0aWxzLlNWR0NpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLmdldENlbnRlckNpcmNsZVJhZGl1cygpKVxuICAgICAgICBjaXJjbGUuc2V0QXR0cmlidXRlKCdmaWxsJywgdGhpcy4jc2V0dGluZ3MuQVNQRUNUU19CQUNLR1JPVU5EX0NPTE9SKVxuICAgICAgICBhc3BlY3RzV3JhcHBlci5hcHBlbmRDaGlsZChjaXJjbGUpXG5cbiAgICAgICAgYXNwZWN0c1dyYXBwZXIuYXBwZW5kQ2hpbGQoQXNwZWN0VXRpbHMuZHJhd0FzcGVjdHModGhpcy5nZXRDZW50ZXJDaXJjbGVSYWRpdXMoKSwgdGhpcy5nZXRBc2NlbmRhbnRTaGlmdCgpLCB0aGlzLiNzZXR0aW5ncywgYXNwZWN0c0xpc3QpKVxuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgLy8gIyMgUFJJVkFURSAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuICAgIC8qXG4gICAgICogRHJhdyByYWRpeCBjaGFydFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gICAgICovXG4gICAgI2RyYXcoZGF0YSkge1xuICAgICAgICBVdGlscy5jbGVhblVwKHRoaXMuI3Jvb3QuZ2V0QXR0cmlidXRlKCdpZCcpLCB0aGlzLiNiZWZvcmVDbGVhblVwSG9vaylcbiAgICAgICAgdGhpcy4jZHJhd0JhY2tncm91bmQoKVxuICAgICAgICB0aGlzLiNkcmF3QXN0cm9sb2dpY2FsU2lnbnMoKVxuICAgICAgICB0aGlzLiNkcmF3Q3VzcHMoZGF0YSlcbiAgICAgICAgdGhpcy4jZHJhd1BvaW50cyhkYXRhKVxuICAgICAgICB0aGlzLiNkcmF3UnVsZXIoKVxuICAgICAgICB0aGlzLiNkcmF3Qm9yZGVycygpXG4gICAgICAgIHRoaXMuI3NldHRpbmdzLkNIQVJUX0RSQVdfTUFJTl9BWElTICYmIHRoaXMuI2RyYXdNYWluQXhpc0Rlc2NyaXB0aW9uKGRhdGEpXG4gICAgICAgIHRoaXMuI3NldHRpbmdzLkRSQVdfQVNQRUNUUyAmJiB0aGlzLmRyYXdBc3BlY3RzKClcbiAgICB9XG5cbiAgICAjZHJhd0JhY2tncm91bmQoKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy4jbWFzayAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgLy8gQXBwZWzDqSBkZXV4IGZvaXMgcXVhbmQgb24gZXN0IGVuIG1vZGUgVHJhbnNpdFxuICAgICAgICAgICAgdGhpcy4jbWFzay5xdWVyeVNlbGVjdG9yKCdjaXJjbGVbZmlsbD1cImJsYWNrXCJdJykuc2V0QXR0cmlidXRlKCdyJywgdGhpcy5nZXRDZW50ZXJDaXJjbGVSYWRpdXMoKSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBNQVNLX0lEID0gYCR7dGhpcy4jc2V0dGluZ3MuSFRNTF9FTEVNRU5UX0lEfS0ke3RoaXMuI3NldHRpbmdzLlJBRElYX0lEfS1iYWNrZ3JvdW5kLW1hc2stMWBcblxuICAgICAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuICAgICAgICB3cmFwcGVyLmNsYXNzTGlzdC5hZGQoJ2MtcmFkaXgtYmFja2dyb3VuZCcpXG5cbiAgICAgICAgY29uc3QgbWFzayA9IFNWR1V0aWxzLlNWR01hc2soTUFTS19JRClcbiAgICAgICAgY29uc3Qgb3V0ZXJDaXJjbGUgPSBTVkdVdGlscy5TVkdDaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy5nZXRSYWRpdXMoKSlcbiAgICAgICAgb3V0ZXJDaXJjbGUuc2V0QXR0cmlidXRlKCdmaWxsJywgXCJ3aGl0ZVwiKVxuICAgICAgICBtYXNrLmFwcGVuZENoaWxkKG91dGVyQ2lyY2xlKVxuXG4gICAgICAgIGNvbnN0IGlubmVyQ2lyY2xlID0gU1ZHVXRpbHMuU1ZHQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuZ2V0Q2VudGVyQ2lyY2xlUmFkaXVzKCkpXG4gICAgICAgIGlubmVyQ2lyY2xlLnNldEF0dHJpYnV0ZSgnZmlsbCcsIFwiYmxhY2tcIilcbiAgICAgICAgbWFzay5hcHBlbmRDaGlsZChpbm5lckNpcmNsZSlcbiAgICAgICAgdGhpcy4jbWFzayA9IG1hc2tcbiAgICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLiNtYXNrKVxuXG4gICAgICAgIGNvbnN0IGNpcmNsZSA9IFNWR1V0aWxzLlNWR0NpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLmdldFJhZGl1cygpKVxuICAgICAgICBjaXJjbGUuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0VfT05MWSA/IFwibm9uZVwiIDogdGhpcy4jc2V0dGluZ3MuUExBTkVUU19CQUNLR1JPVU5EX0NPTE9SKTtcbiAgICAgICAgY2lyY2xlLnNldEF0dHJpYnV0ZShcIm1hc2tcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFX09OTFkgPyBcIm5vbmVcIiA6IGB1cmwoIyR7TUFTS19JRH0pYCk7XG4gICAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoY2lyY2xlKVxuXG4gICAgICAgIHRoaXMuI3Jvb3QucGFyZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYy1iYWNrZ3JvdW5kcycpLmFwcGVuZENoaWxkKHdyYXBwZXIpXG4gICAgfVxuXG4gICAgI2RyYXdBc3Ryb2xvZ2ljYWxTaWducygpIHtcbiAgICAgICAgY29uc3QgTlVNQkVSX09GX0FTVFJPTE9HSUNBTF9TSUdOUyA9IDEyXG4gICAgICAgIGNvbnN0IFNURVAgPSAzMCAvL2RlZ3JlZVxuICAgICAgICBjb25zdCBDT0xPUlNfU0lHTlMgPSBbdGhpcy4jc2V0dGluZ3MuQ09MT1JfQVJJRVMsIHRoaXMuI3NldHRpbmdzLkNPTE9SX1RBVVJVUywgdGhpcy4jc2V0dGluZ3MuQ09MT1JfR0VNSU5JLCB0aGlzLiNzZXR0aW5ncy5DT0xPUl9DQU5DRVIsIHRoaXMuI3NldHRpbmdzLkNPTE9SX0xFTywgdGhpcy4jc2V0dGluZ3MuQ09MT1JfVklSR08sIHRoaXMuI3NldHRpbmdzLkNPTE9SX0xJQlJBLCB0aGlzLiNzZXR0aW5ncy5DT0xPUl9TQ09SUElPLCB0aGlzLiNzZXR0aW5ncy5DT0xPUl9TQUdJVFRBUklVUywgdGhpcy4jc2V0dGluZ3MuQ09MT1JfQ0FQUklDT1JOLCB0aGlzLiNzZXR0aW5ncy5DT0xPUl9BUVVBUklVUywgdGhpcy4jc2V0dGluZ3MuQ09MT1JfUElTQ0VTXVxuICAgICAgICBjb25zdCBTWU1CT0xfU0lHTlMgPSBbU1ZHVXRpbHMuU1lNQk9MX0FSSUVTLCBTVkdVdGlscy5TWU1CT0xfVEFVUlVTLCBTVkdVdGlscy5TWU1CT0xfR0VNSU5JLCBTVkdVdGlscy5TWU1CT0xfQ0FOQ0VSLCBTVkdVdGlscy5TWU1CT0xfTEVPLCBTVkdVdGlscy5TWU1CT0xfVklSR08sIFNWR1V0aWxzLlNZTUJPTF9MSUJSQSwgU1ZHVXRpbHMuU1lNQk9MX1NDT1JQSU8sIFNWR1V0aWxzLlNZTUJPTF9TQUdJVFRBUklVUywgU1ZHVXRpbHMuU1lNQk9MX0NBUFJJQ09STiwgU1ZHVXRpbHMuU1lNQk9MX0FRVUFSSVVTLCBTVkdVdGlscy5TWU1CT0xfUElTQ0VTXVxuXG4gICAgICAgIGlmIChDT0xPUlNfU0lHTlMubGVuZ3RoICE9PSAxMikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignTWlzc2luZyBlbnRyaWVzIGluIENPTE9SX1NJR05TLCByZXF1aXJlcyAxMiBlbnRyaWVzJyk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBtYWtlU3ltYm9sID0gKHN5bWJvbEluZGV4LCBhbmdsZUluRGVncmVlKSA9PiB7XG4gICAgICAgICAgICBsZXQgcG9zaXRpb24gPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuZ2V0T3V0ZXJDaXJjbGVSYWRpdXMoKSAtICgodGhpcy5nZXRPdXRlckNpcmNsZVJhZGl1cygpIC0gdGhpcy5nZXRJbm5lckNpcmNsZVJhZGl1cygpKSAvIDIpLCBVdGlscy5kZWdyZWVUb1JhZGlhbihhbmdsZUluRGVncmVlICsgU1RFUCAvIDIsIHRoaXMuZ2V0QXNjZW5kYW50U2hpZnQoKSkpXG5cbiAgICAgICAgICAgIGxldCBzeW1ib2wgPSBTVkdVdGlscy5TVkdTeW1ib2woU1lNQk9MX1NJR05TW3N5bWJvbEluZGV4XSwgcG9zaXRpb24ueCwgcG9zaXRpb24ueSlcbiAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJmb250LWZhbWlseVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9GT05UX0ZBTUlMWSk7XG4gICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIikgLy8gc3RhcnQsIG1pZGRsZSwgZW5kXG4gICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcbiAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJmb250LXNpemVcIiwgdGhpcy4jc2V0dGluZ3MuUkFESVhfU0lHTlNfRk9OVF9TSVpFKTtcbiAgICAgICAgICAgIGlmICh0aGlzLiNzZXR0aW5ncy5TSUdOX0NPTE9SX0NJUkNMRSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIHRoaXMuI3NldHRpbmdzLlNJR05fQ09MT1JfQ0lSQ0xFKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgdGhpcy4jc2V0dGluZ3MuU0lHTl9DT0xPUlNbc3ltYm9sSW5kZXhdID8/IHRoaXMuI3NldHRpbmdzLkNIQVJUX1NJR05TX0NPTE9SKTtcbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICBpZiAodGhpcy4jc2V0dGluZ3MuQ0xBU1NfU0lHTikge1xuICAgICAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgdGhpcy4jc2V0dGluZ3MuQ0xBU1NfU0lHTiArICcgJyArIHRoaXMuI3NldHRpbmdzLkNMQVNTX1NJR04gKyAnLS0nICsgU1lNQk9MX1NJR05TW3N5bWJvbEluZGV4XS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuI3NldHRpbmdzLlNZTUJPTF9TVFJPS0UpIHtcbiAgICAgICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKCdwYWludC1vcmRlcicsICdzdHJva2UnKTtcbiAgICAgICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKCdzdHJva2UnLCB0aGlzLiNzZXR0aW5ncy5TWU1CT0xfU1RST0tFX0NPTE9SKTtcbiAgICAgICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKCdzdHJva2Utd2lkdGgnLCB0aGlzLiNzZXR0aW5ncy5TWU1CT0xfU1RST0tFX1dJRFRIKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuI3NldHRpbmdzLklOU0VSVF9FTEVNRU5UX1RJVExFKSB7XG4gICAgICAgICAgICAgICAgc3ltYm9sLmFwcGVuZENoaWxkKFNWR1V0aWxzLlNWR1RpdGxlKHRoaXMuI3NldHRpbmdzLkVMRU1FTlRfVElUTEVTLnNpZ25zW1NZTUJPTF9TSUdOU1tzeW1ib2xJbmRleF0udG9Mb3dlckNhc2UoKV0pKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gc3ltYm9sXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBtYWtlU2VnbWVudCA9IChzeW1ib2xJbmRleCwgYW5nbGVGcm9tSW5EZWdyZWUsIGFuZ2xlVG9JbkRlZ3JlZSkgPT4ge1xuICAgICAgICAgICAgbGV0IGExID0gVXRpbHMuZGVncmVlVG9SYWRpYW4oYW5nbGVGcm9tSW5EZWdyZWUsIHRoaXMuZ2V0QXNjZW5kYW50U2hpZnQoKSlcbiAgICAgICAgICAgIGxldCBhMiA9IFV0aWxzLmRlZ3JlZVRvUmFkaWFuKGFuZ2xlVG9JbkRlZ3JlZSwgdGhpcy5nZXRBc2NlbmRhbnRTaGlmdCgpKVxuICAgICAgICAgICAgbGV0IHNlZ21lbnQgPSBTVkdVdGlscy5TVkdTZWdtZW50KHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuZ2V0T3V0ZXJDaXJjbGVSYWRpdXMoKSwgYTEsIGEyLCB0aGlzLmdldElubmVyQ2lyY2xlUmFkaXVzKCkpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFX1dJVEhfQ09MT1IpIHtcbiAgICAgICAgICAgICAgICBzZWdtZW50LnNldEF0dHJpYnV0ZShcImZpbGxcIiwgQ09MT1JTX1NJR05TW3N5bWJvbEluZGV4XSk7XG4gICAgICAgICAgICAgICAgc2VnbWVudC5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0lSQ0xFX0NPTE9SKTtcbiAgICAgICAgICAgICAgICBzZWdtZW50LnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0UpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWdtZW50LnNldEF0dHJpYnV0ZShcImZpbGxcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFX09OTFkgPyBcIm5vbmVcIiA6IENPTE9SU19TSUdOU1tzeW1ib2xJbmRleF0pO1xuICAgICAgICAgICAgICAgIHNlZ21lbnQuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRV9PTkxZID8gdGhpcy4jc2V0dGluZ3MuQ0lSQ0xFX0NPTE9SIDogXCJub25lXCIpO1xuICAgICAgICAgICAgICAgIHNlZ21lbnQuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRV9PTkxZID8gdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFIDogMCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLiNzZXR0aW5ncy5DTEFTU19TSUdOX1NFR01FTlQpIHtcbiAgICAgICAgICAgICAgICBzZWdtZW50LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCB0aGlzLiNzZXR0aW5ncy5DTEFTU19TSUdOX1NFR01FTlQgKyAnICcgKyB0aGlzLiNzZXR0aW5ncy5DTEFTU19TSUdOX1NFR01FTlQgKyBTWU1CT0xfU0lHTlNbc3ltYm9sSW5kZXhdLnRvTG93ZXJDYXNlKCkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gc2VnbWVudFxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHN0YXJ0QW5nbGUgPSAwXG4gICAgICAgIGxldCBlbmRBbmdsZSA9IHN0YXJ0QW5nbGUgKyBTVEVQXG5cbiAgICAgICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcbiAgICAgICAgd3JhcHBlci5jbGFzc0xpc3QuYWRkKCdjLXJhZGl4LWFzdHJvbG9naWNhbC1zaWducycpXG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBOVU1CRVJfT0ZfQVNUUk9MT0dJQ0FMX1NJR05TOyBpKyspIHtcblxuICAgICAgICAgICAgbGV0IHNlZ21lbnQgPSBtYWtlU2VnbWVudChpLCBzdGFydEFuZ2xlLCBlbmRBbmdsZSlcbiAgICAgICAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoc2VnbWVudCk7XG5cbiAgICAgICAgICAgIGxldCBzeW1ib2wgPSBtYWtlU3ltYm9sKGksIHN0YXJ0QW5nbGUpXG4gICAgICAgICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHN5bWJvbCk7XG5cbiAgICAgICAgICAgIHN0YXJ0QW5nbGUgKz0gU1RFUDtcbiAgICAgICAgICAgIGVuZEFuZ2xlID0gc3RhcnRBbmdsZSArIFNURVBcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuI3Jvb3QuYXBwZW5kQ2hpbGQod3JhcHBlcilcbiAgICB9XG5cbiAgICAjZHJhd1J1bGVyKCkge1xuICAgICAgICBjb25zdCBOVU1CRVJfT0ZfRElWSURFUlMgPSA3MlxuICAgICAgICBjb25zdCBTVEVQID0gNVxuXG4gICAgICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG4gICAgICAgIHdyYXBwZXIuY2xhc3NMaXN0LmFkZCgnYy1yYWRpeC1ydWxlcicpXG5cbiAgICAgICAgbGV0IHN0YXJ0QW5nbGUgPSB0aGlzLmdldEFzY2VuZGFudFNoaWZ0KClcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBOVU1CRVJfT0ZfRElWSURFUlM7IGkrKykge1xuICAgICAgICAgICAgbGV0IHN0YXJ0UG9pbnQgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuZ2V0UnVsbGVyQ2lyY2xlUmFkaXVzKCksIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKHN0YXJ0QW5nbGUpKVxuICAgICAgICAgICAgbGV0IGVuZFBvaW50ID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCAoaSAlIDIpID8gdGhpcy5nZXRJbm5lckNpcmNsZVJhZGl1cygpIC0gKCh0aGlzLmdldElubmVyQ2lyY2xlUmFkaXVzKCkgLSB0aGlzLmdldFJ1bGxlckNpcmNsZVJhZGl1cygpKSAvIDIpIDogdGhpcy5nZXRJbm5lckNpcmNsZVJhZGl1cygpLCBVdGlscy5kZWdyZWVUb1JhZGlhbihzdGFydEFuZ2xlKSlcbiAgICAgICAgICAgIGNvbnN0IGxpbmUgPSBTVkdVdGlscy5TVkdMaW5lKHN0YXJ0UG9pbnQueCwgc3RhcnRQb2ludC55LCBlbmRQb2ludC54LCBlbmRQb2ludC55KTtcbiAgICAgICAgICAgIGxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0xJTkVfQ09MT1IpO1xuICAgICAgICAgICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFKTtcbiAgICAgICAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQobGluZSk7XG5cbiAgICAgICAgICAgIHN0YXJ0QW5nbGUgKz0gU1RFUFxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY2lyY2xlID0gU1ZHVXRpbHMuU1ZHQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuZ2V0UnVsbGVyQ2lyY2xlUmFkaXVzKCkpO1xuICAgICAgICBjaXJjbGUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0NJUkNMRV9DT0xPUik7XG4gICAgICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFKTtcbiAgICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChjaXJjbGUpO1xuXG4gICAgICAgIHRoaXMuI3Jvb3QuYXBwZW5kQ2hpbGQod3JhcHBlcilcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIERyYXcgcG9pbnRzXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGRhdGEgLSBjaGFydCBkYXRhXG4gICAgICovXG4gICAgI2RyYXdQb2ludHMoZGF0YSkge1xuICAgICAgICBjb25zdCBwb2ludHMgPSBkYXRhLnBvaW50c1xuICAgICAgICBjb25zdCBjdXNwcyA9IGRhdGEuY3VzcHNcbiAgICAgICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcbiAgICAgICAgd3JhcHBlci5jbGFzc0xpc3QuYWRkKCdjLXJhZGl4LXBvaW50cycpXG5cbiAgICAgICAgY29uc3QgcG9zaXRpb25zID0gVXRpbHMuY2FsY3VsYXRlUG9zaXRpb25XaXRob3V0T3ZlcmxhcHBpbmcocG9pbnRzLCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9DT0xMSVNJT05fUkFESVVTLCB0aGlzLmdldFBvaW50Q2lyY2xlUmFkaXVzKCkpXG5cbiAgICAgICAgZm9yIChjb25zdCBwb2ludERhdGEgb2YgcG9pbnRzKSB7XG4gICAgICAgICAgICBjb25zdCBwb2ludEdyb3VwID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKTtcbiAgICAgICAgICAgIHBvaW50R3JvdXAuY2xhc3NMaXN0LmFkZCgnYy1yYWRpeC1wb2ludCcpXG4gICAgICAgICAgICBwb2ludEdyb3VwLmNsYXNzTGlzdC5hZGQoJ2MtcmFkaXgtcG9pbnQtLScgKyBwb2ludERhdGEubmFtZS50b0xvd2VyQ2FzZSgpKVxuXG4gICAgICAgICAgICBjb25zdCBwb2ludCA9IG5ldyBQb2ludChwb2ludERhdGEsIGN1c3BzLCB0aGlzLiNzZXR0aW5ncylcbiAgICAgICAgICAgIGNvbnN0IHBvaW50UG9zaXRpb24gPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclgsIHRoaXMuZ2V0UnVsbGVyQ2lyY2xlUmFkaXVzKCkgLSAoKHRoaXMuZ2V0SW5uZXJDaXJjbGVSYWRpdXMoKSAtIHRoaXMuZ2V0UnVsbGVyQ2lyY2xlUmFkaXVzKCkpIC8gNCksIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKHBvaW50LmdldEFuZ2xlKCksIHRoaXMuZ2V0QXNjZW5kYW50U2hpZnQoKSkpXG4gICAgICAgICAgICBjb25zdCBzeW1ib2xQb3NpdGlvbiA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWCwgdGhpcy5nZXRQb2ludENpcmNsZVJhZGl1cygpLCBVdGlscy5kZWdyZWVUb1JhZGlhbihwb3NpdGlvbnNbcG9pbnQuZ2V0TmFtZSgpXSwgdGhpcy5nZXRBc2NlbmRhbnRTaGlmdCgpKSlcblxuICAgICAgICAgICAgLy8gcnVsZXIgbWFya1xuICAgICAgICAgICAgY29uc3QgcnVsZXJMaW5lRW5kUG9zaXRpb24gPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclgsIHRoaXMuZ2V0UnVsbGVyQ2lyY2xlUmFkaXVzKCksIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKHBvaW50LmdldEFuZ2xlKCksIHRoaXMuZ2V0QXNjZW5kYW50U2hpZnQoKSkpXG5cbiAgICAgICAgICAgIGlmICh0aGlzLiNzZXR0aW5ncy5EUkFXX1JVTEVSX01BUkspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBydWxlckxpbmUgPSBTVkdVdGlscy5TVkdMaW5lKHBvaW50UG9zaXRpb24ueCwgcG9pbnRQb3NpdGlvbi55LCBydWxlckxpbmVFbmRQb3NpdGlvbi54LCBydWxlckxpbmVFbmRQb3NpdGlvbi55KVxuICAgICAgICAgICAgICAgIHJ1bGVyTGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTElORV9DT0xPUik7XG4gICAgICAgICAgICAgICAgcnVsZXJMaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0UpO1xuICAgICAgICAgICAgICAgIHBvaW50R3JvdXAuYXBwZW5kQ2hpbGQocnVsZXJMaW5lKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBMaW5lIGZyb20gdGhlIHJ1bGVyIHRvIHRoZSBjZWxlc3RpYWwgYm9keVxuICAgICAgICAgICAgICogQHR5cGUge3t4LCB5fX1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY29uc3QgcG9pbnRlckxpbmVFbmRQb3NpdGlvbiA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWCwgdGhpcy5nZXRQb2ludENpcmNsZVJhZGl1cygpLCBVdGlscy5kZWdyZWVUb1JhZGlhbihwb3NpdGlvbnNbcG9pbnQuZ2V0TmFtZSgpXSwgdGhpcy5nZXRBc2NlbmRhbnRTaGlmdCgpKSlcblxuICAgICAgICAgICAgbGV0IHBvaW50ZXJMaW5lO1xuICAgICAgICAgICAgaWYgKHRoaXMuI3NldHRpbmdzLkRSQVdfUlVMRVJfTUFSSykge1xuICAgICAgICAgICAgICAgIHBvaW50ZXJMaW5lID0gU1ZHVXRpbHMuU1ZHTGluZShwb2ludFBvc2l0aW9uLngsIHBvaW50UG9zaXRpb24ueSwgKHBvaW50UG9zaXRpb24ueCArIHBvaW50ZXJMaW5lRW5kUG9zaXRpb24ueCkgLyAyLCAocG9pbnRQb3NpdGlvbi55ICsgcG9pbnRlckxpbmVFbmRQb3NpdGlvbi55KSAvIDIpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHBvaW50ZXJMaW5lID0gU1ZHVXRpbHMuU1ZHTGluZShydWxlckxpbmVFbmRQb3NpdGlvbi54LCBydWxlckxpbmVFbmRQb3NpdGlvbi55LCAocG9pbnRQb3NpdGlvbi54ICsgcG9pbnRlckxpbmVFbmRQb3NpdGlvbi54KSAvIDIsIChwb2ludFBvc2l0aW9uLnkgKyBwb2ludGVyTGluZUVuZFBvc2l0aW9uLnkpIC8gMilcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLiNzZXR0aW5ncy5QTEFORVRfTElORV9VU0VfUExBTkVUX0NPTE9SKSB7XG4gICAgICAgICAgICAgICAgcG9pbnRlckxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLlBMQU5FVF9DT0xPUlNbcG9pbnREYXRhLm5hbWVdID8/IHRoaXMuI3NldHRpbmdzLkNIQVJUX0xJTkVfQ09MT1IpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwb2ludGVyTGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTElORV9DT0xPUik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHBvaW50ZXJMaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0UgLyAyKTtcblxuICAgICAgICAgICAgcG9pbnRHcm91cC5hcHBlbmRDaGlsZChwb2ludGVyTGluZSk7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogU3ltbm9sIG9mIHRoZSBjZWxlc3RpYWwgYm9keSArIHBvaW50c1xuICAgICAgICAgICAgICogQHR5cGUge1NWR0VsZW1lbnR9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGNvbnN0IHN5bWJvbCA9IHBvaW50LmdldFN5bWJvbChzeW1ib2xQb3NpdGlvbi54LCBzeW1ib2xQb3NpdGlvbi55LCBVdGlscy5ERUdfMCwgdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19TSE9XKVxuICAgICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImZvbnQtZmFtaWx5XCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0ZPTlRfRkFNSUxZKTtcbiAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKSAvLyBzdGFydCwgbWlkZGxlLCBlbmRcbiAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJkb21pbmFudC1iYXNlbGluZVwiLCBcIm1pZGRsZVwiKVxuICAgICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImZvbnQtc2l6ZVwiLCB0aGlzLiNzZXR0aW5ncy5SQURJWF9QT0lOVFNfRk9OVF9TSVpFKVxuICAgICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgdGhpcy4jc2V0dGluZ3MuUExBTkVUX0NPTE9SU1twb2ludERhdGEubmFtZV0gPz8gdGhpcy4jc2V0dGluZ3MuQ0hBUlRfUE9JTlRTX0NPTE9SKVxuICAgICAgICAgICAgcG9pbnRHcm91cC5hcHBlbmRDaGlsZChzeW1ib2wpO1xuXG4gICAgICAgICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHBvaW50R3JvdXApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy4jcm9vdC5hcHBlbmRDaGlsZCh3cmFwcGVyKVxuICAgIH1cblxuICAgIC8qXG4gICAgICogRHJhdyBwb2ludHNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YSAtIGNoYXJ0IGRhdGFcbiAgICAgKi9cbiAgICAjZHJhd0N1c3BzKGRhdGEpIHtcbiAgICAgICAgY29uc3QgcG9pbnRzID0gZGF0YS5wb2ludHNcbiAgICAgICAgY29uc3QgY3VzcHMgPSBkYXRhLmN1c3BzXG5cbiAgICAgICAgY29uc3QgbWFpbkF4aXNJbmRleGVzID0gWzAsIDMsIDYsIDldIC8vQXMsIEljLCBEcywgTWNcblxuICAgICAgICBjb25zdCBwb2ludHNQb3NpdGlvbnMgPSBwb2ludHMubWFwKHBvaW50ID0+IHtcbiAgICAgICAgICAgIHJldHVybiBwb2ludC5hbmdsZVxuICAgICAgICB9KVxuXG4gICAgICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG4gICAgICAgIHdyYXBwZXIuY2xhc3NMaXN0LmFkZCgnYy1yYWRpeC1jdXNwcycpXG5cbiAgICAgICAgY29uc3QgdGV4dFJhZGl1cyA9IHRoaXMuZ2V0Q2VudGVyQ2lyY2xlUmFkaXVzKCkgKyAoKHRoaXMuZ2V0SW5uZXJDaXJjbGVSYWRpdXMoKSAtIHRoaXMuZ2V0Q2VudGVyQ2lyY2xlUmFkaXVzKCkpIC8gMTApXG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdXNwcy5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgICAgICBjb25zdCBpc0xpbmVJbkNvbGxpc2lvbldpdGhQb2ludCA9ICEgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfQUxMT1dfSE9VU0VfT1ZFUkxBUCAmJiBVdGlscy5pc0NvbGxpc2lvbihjdXNwc1tpXS5hbmdsZSwgcG9pbnRzUG9zaXRpb25zLCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9DT0xMSVNJT05fUkFESVVTIC8gMilcblxuICAgICAgICAgICAgY29uc3Qgc3RhcnRQb3MgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuZ2V0Q2VudGVyQ2lyY2xlUmFkaXVzKCksIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKGN1c3BzW2ldLmFuZ2xlLCB0aGlzLmdldEFzY2VuZGFudFNoaWZ0KCkpKVxuICAgICAgICAgICAgY29uc3QgZW5kUG9zID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCBpc0xpbmVJbkNvbGxpc2lvbldpdGhQb2ludCA/IHRoaXMuZ2V0Q2VudGVyQ2lyY2xlUmFkaXVzKCkgKyAoKHRoaXMuZ2V0UnVsbGVyQ2lyY2xlUmFkaXVzKCkgLSB0aGlzLmdldENlbnRlckNpcmNsZVJhZGl1cygpKSAvIDYpIDogdGhpcy5nZXRSdWxsZXJDaXJjbGVSYWRpdXMoKSwgVXRpbHMuZGVncmVlVG9SYWRpYW4oY3VzcHNbaV0uYW5nbGUsIHRoaXMuZ2V0QXNjZW5kYW50U2hpZnQoKSkpXG5cbiAgICAgICAgICAgIGNvbnN0IGxpbmUgPSBTVkdVdGlscy5TVkdMaW5lKHN0YXJ0UG9zLngsIHN0YXJ0UG9zLnksIGVuZFBvcy54LCBlbmRQb3MueSlcbiAgICAgICAgICAgIGxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIG1haW5BeGlzSW5kZXhlcy5pbmNsdWRlcyhpKSA/IHRoaXMuI3NldHRpbmdzLkNIQVJUX01BSU5fQVhJU19DT0xPUiA6IHRoaXMuI3NldHRpbmdzLkNIQVJUX0xJTkVfQ09MT1IpXG4gICAgICAgICAgICBsaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCBtYWluQXhpc0luZGV4ZXMuaW5jbHVkZXMoaSkgPyB0aGlzLiNzZXR0aW5ncy5DSEFSVF9NQUlOX1NUUk9LRSA6IHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRSlcbiAgICAgICAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQobGluZSk7XG5cbiAgICAgICAgICAgIGNvbnN0IHN0YXJ0Q3VzcCA9IGN1c3BzW2ldLmFuZ2xlXG4gICAgICAgICAgICBjb25zdCBlbmRDdXNwID0gY3VzcHNbKGkgKyAxKSAlIDEyXS5hbmdsZVxuICAgICAgICAgICAgY29uc3QgZ2FwID0gZW5kQ3VzcCAtIHN0YXJ0Q3VzcCA+IDAgPyBlbmRDdXNwIC0gc3RhcnRDdXNwIDogZW5kQ3VzcCAtIHN0YXJ0Q3VzcCArIFV0aWxzLkRFR18zNjBcbiAgICAgICAgICAgIGNvbnN0IHRleHRBbmdsZSA9IHN0YXJ0Q3VzcCArIGdhcCAvIDJcblxuICAgICAgICAgICAgY29uc3QgdGV4dFBvcyA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGV4dFJhZGl1cywgVXRpbHMuZGVncmVlVG9SYWRpYW4odGV4dEFuZ2xlLCB0aGlzLmdldEFzY2VuZGFudFNoaWZ0KCkpKVxuICAgICAgICAgICAgY29uc3QgdGV4dCA9IFNWR1V0aWxzLlNWR1RleHQodGV4dFBvcy54LCB0ZXh0UG9zLnksIGAke2kgKyAxfWApXG4gICAgICAgICAgICB0ZXh0LnNldEF0dHJpYnV0ZShcImZvbnQtZmFtaWx5XCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0ZPTlRfRkFNSUxZKVxuICAgICAgICAgICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKSAvLyBzdGFydCwgbWlkZGxlLCBlbmRcbiAgICAgICAgICAgIHRleHQuc2V0QXR0cmlidXRlKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcbiAgICAgICAgICAgIHRleHQuc2V0QXR0cmlidXRlKFwiZm9udC1zaXplXCIsIHRoaXMuI3NldHRpbmdzLlJBRElYX0hPVVNFX0ZPTlRfU0laRSlcbiAgICAgICAgICAgIHRleHQuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9IT1VTRV9OVU1CRVJfQ09MT1IpXG4gICAgICAgICAgICB0ZXh0LmNsYXNzTGlzdC5hZGQoJ2MtcmFkaXgtY3VzcHNfX2hvdXNlLW51bWJlcicpXG5cbiAgICAgICAgICAgIGlmICh0aGlzLiNzZXR0aW5ncy5JTlNFUlRfRUxFTUVOVF9USVRMRSkge1xuICAgICAgICAgICAgICAgIHRleHQuYXBwZW5kQ2hpbGQoU1ZHVXRpbHMuU1ZHVGl0bGUodGhpcy4jc2V0dGluZ3MuRUxFTUVOVF9USVRMRVMuY3VzcHNbaSArIDFdKSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZCh0ZXh0KVxuXG4gICAgICAgICAgICBpZiAodGhpcy4jc2V0dGluZ3MuRFJBV19IT1VTRV9ERUdSRUUpIHtcbiAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh0aGlzLiNzZXR0aW5ncy5IT1VTRV9ERUdSRUVfRklMVEVSKSAmJiAhIHRoaXMuI3NldHRpbmdzLkhPVVNFX0RFR1JFRV9GSUxURVIuaW5jbHVkZXMoaSArIDEpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCBkZWdyZWVQb3MgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuZ2V0UnVsbGVyQ2lyY2xlUmFkaXVzKCkgLSAodGhpcy5nZXRJbm5lckNpcmNsZVJhZGl1cygpIC0gdGhpcy5nZXRSdWxsZXJDaXJjbGVSYWRpdXMoKSkgLyAxLjIsIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKHN0YXJ0Q3VzcCAtIDIuNCwgdGhpcy5nZXRBc2NlbmRhbnRTaGlmdCgpKSlcbiAgICAgICAgICAgICAgICBjb25zdCBkZWdyZWUgPSBTVkdVdGlscy5TVkdUZXh0KGRlZ3JlZVBvcy54LCBkZWdyZWVQb3MueSwgTWF0aC5mbG9vcihjdXNwc1tpXS5hbmdsZSAlIDMwKSArIFwiwrpcIilcbiAgICAgICAgICAgICAgICBkZWdyZWUuc2V0QXR0cmlidXRlKFwiZm9udC1mYW1pbHlcIiwgXCJBcmlhbFwiKVxuICAgICAgICAgICAgICAgIGRlZ3JlZS5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKSAvLyBzdGFydCwgbWlkZGxlLCBlbmRcbiAgICAgICAgICAgICAgICBkZWdyZWUuc2V0QXR0cmlidXRlKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcbiAgICAgICAgICAgICAgICBkZWdyZWUuc2V0QXR0cmlidXRlKFwiZm9udC1zaXplXCIsIHRoaXMuI3NldHRpbmdzLkhPVVNFX0RFR1JFRV9TSVpFIHx8IHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfQU5HTEVfU0laRSAvIDIpXG4gICAgICAgICAgICAgICAgZGVncmVlLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgdGhpcy4jc2V0dGluZ3MuSE9VU0VfREVHUkVFX0NPTE9SIHx8IHRoaXMuI3NldHRpbmdzLkNIQVJUX0hPVVNFX05VTUJFUl9DT0xPUilcbiAgICAgICAgICAgICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGRlZ3JlZSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy4jcm9vdC5hcHBlbmRDaGlsZCh3cmFwcGVyKVxuICAgIH1cblxuICAgIC8qXG4gICAgICogRHJhdyBtYWluIGF4aXMgZGVzY3JpdGlvblxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGF4aXNMaXN0XG4gICAgICovXG4gICAgI2RyYXdNYWluQXhpc0Rlc2NyaXB0aW9uKGRhdGEpIHtcbiAgICAgICAgY29uc3QgQVhJU19MRU5HVEggPSAxMFxuICAgICAgICBjb25zdCBjdXNwcyA9IGRhdGEuY3VzcHNcblxuICAgICAgICBjb25zdCBheGlzTGlzdCA9IFt7XG4gICAgICAgICAgICBuYW1lOiBTVkdVdGlscy5TWU1CT0xfQVMsIGFuZ2xlOiBjdXNwc1swXS5hbmdsZVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBuYW1lOiBTVkdVdGlscy5TWU1CT0xfSUMsIGFuZ2xlOiBjdXNwc1szXS5hbmdsZVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBuYW1lOiBTVkdVdGlscy5TWU1CT0xfRFMsIGFuZ2xlOiBjdXNwc1s2XS5hbmdsZVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBuYW1lOiBTVkdVdGlscy5TWU1CT0xfTUMsIGFuZ2xlOiBjdXNwc1s5XS5hbmdsZVxuICAgICAgICB9LF1cblxuICAgICAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuICAgICAgICB3cmFwcGVyLmNsYXNzTGlzdC5hZGQoJ2MtcmFkaXgtYXhpcycpXG5cbiAgICAgICAgY29uc3QgcmFkMSA9IHRoaXMuI251bWJlck9mTGV2ZWxzID09PSAyNCA/IHRoaXMuZ2V0UmFkaXVzKCkgOiB0aGlzLmdldElubmVyQ2lyY2xlUmFkaXVzKCk7XG4gICAgICAgIGNvbnN0IHJhZDIgPSB0aGlzLiNudW1iZXJPZkxldmVscyA9PT0gMjQgPyB0aGlzLmdldFJhZGl1cygpICsgQVhJU19MRU5HVEggOiB0aGlzLmdldElubmVyQ2lyY2xlUmFkaXVzKCkgKyBBWElTX0xFTkdUSCAvIDI7XG5cbiAgICAgICAgZm9yIChjb25zdCBheGlzIG9mIGF4aXNMaXN0KSB7XG4gICAgICAgICAgICBjb25zdCBheGlzR3JvdXAgPSBTVkdVdGlscy5TVkdHcm91cCgpXG4gICAgICAgICAgICBheGlzR3JvdXAuY2xhc3NMaXN0LmFkZCgnYy1yYWRpeC1heGlzX19heGlzJylcbiAgICAgICAgICAgIGF4aXNHcm91cC5jbGFzc0xpc3QuYWRkKCdjLXJhZGl4LWF4aXNfX2F4aXMtLScgKyBheGlzLm5hbWUudG9Mb3dlckNhc2UoKSlcblxuICAgICAgICAgICAgbGV0IHN0YXJ0UG9pbnQgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHJhZDEsIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKGF4aXMuYW5nbGUsIHRoaXMuZ2V0QXNjZW5kYW50U2hpZnQoKSkpXG4gICAgICAgICAgICBsZXQgZW5kUG9pbnQgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHJhZDIsIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKGF4aXMuYW5nbGUsIHRoaXMuZ2V0QXNjZW5kYW50U2hpZnQoKSkpXG4gICAgICAgICAgICBsZXQgbGluZSA9IFNWR1V0aWxzLlNWR0xpbmUoc3RhcnRQb2ludC54LCBzdGFydFBvaW50LnksIGVuZFBvaW50LngsIGVuZFBvaW50LnkpO1xuICAgICAgICAgICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTUFJTl9BWElTX0NPTE9SKTtcbiAgICAgICAgICAgIGxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX01BSU5fU1RST0tFKTtcbiAgICAgICAgICAgIGF4aXNHcm91cC5hcHBlbmRDaGlsZChsaW5lKTtcblxuICAgICAgICAgICAgbGV0IHRleHRQb2ludCA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgcmFkMiwgVXRpbHMuZGVncmVlVG9SYWRpYW4oYXhpcy5hbmdsZSwgdGhpcy5nZXRBc2NlbmRhbnRTaGlmdCgpKSlcbiAgICAgICAgICAgIGxldCBzeW1ib2w7XG4gICAgICAgICAgICBsZXQgU0hJRlRfWCA9IDA7XG4gICAgICAgICAgICBsZXQgU0hJRlRfWSA9IDA7XG4gICAgICAgICAgICBjb25zdCBTVEVQID0gMlxuXG4gICAgICAgICAgICBzd2l0Y2ggKGF4aXMubmFtZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgXCJBc1wiOlxuICAgICAgICAgICAgICAgICAgICBTSElGVF9YIC09IFNURVBcbiAgICAgICAgICAgICAgICAgICAgU0hJRlRfWSAtPSBTVEVQXG4gICAgICAgICAgICAgICAgICAgIFNWR1V0aWxzLlNZTUJPTF9BU19DT0RFID0gdGhpcy4jc2V0dGluZ3MuU1lNQk9MX0FTX0NPREUgPz8gU1ZHVXRpbHMuU1lNQk9MX0FTX0NPREU7XG4gICAgICAgICAgICAgICAgICAgIHN5bWJvbCA9IFNWR1V0aWxzLlNWR1N5bWJvbChheGlzLm5hbWUsIHRleHRQb2ludC54ICsgU0hJRlRfWCwgdGV4dFBvaW50LnkgKyBTSElGVF9ZKVxuICAgICAgICAgICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwidGV4dC1hbmNob3JcIiwgXCJlbmRcIilcbiAgICAgICAgICAgICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImRvbWluYW50LWJhc2VsaW5lXCIsIFwibWlkZGxlXCIpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJEc1wiOlxuICAgICAgICAgICAgICAgICAgICBTSElGVF9YICs9IFNURVBcbiAgICAgICAgICAgICAgICAgICAgU0hJRlRfWSAtPSBTVEVQXG4gICAgICAgICAgICAgICAgICAgIFNWR1V0aWxzLlNZTUJPTF9EU19DT0RFID0gdGhpcy4jc2V0dGluZ3MuU1lNQk9MX0RTX0NPREUgPz8gU1ZHVXRpbHMuU1lNQk9MX0RTX0NPREU7XG4gICAgICAgICAgICAgICAgICAgIHN5bWJvbCA9IFNWR1V0aWxzLlNWR1N5bWJvbChheGlzLm5hbWUsIHRleHRQb2ludC54ICsgU0hJRlRfWCwgdGV4dFBvaW50LnkgKyBTSElGVF9ZKVxuICAgICAgICAgICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwidGV4dC1hbmNob3JcIiwgXCJzdGFydFwiKVxuICAgICAgICAgICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcIk1jXCI6XG4gICAgICAgICAgICAgICAgICAgIFNISUZUX1kgLT0gU1RFUFxuICAgICAgICAgICAgICAgICAgICBTVkdVdGlscy5TWU1CT0xfTUNfQ09ERSA9IHRoaXMuI3NldHRpbmdzLlNZTUJPTF9NQ19DT0RFID8/IFNWR1V0aWxzLlNZTUJPTF9NQ19DT0RFO1xuICAgICAgICAgICAgICAgICAgICBzeW1ib2wgPSBTVkdVdGlscy5TVkdTeW1ib2woYXhpcy5uYW1lLCB0ZXh0UG9pbnQueCArIFNISUZUX1gsIHRleHRQb2ludC55ICsgU0hJRlRfWSlcbiAgICAgICAgICAgICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXG4gICAgICAgICAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJkb21pbmFudC1iYXNlbGluZVwiLCBcInRleHQtdG9wXCIpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJJY1wiOlxuICAgICAgICAgICAgICAgICAgICBTSElGVF9ZICs9IFNURVBcbiAgICAgICAgICAgICAgICAgICAgU1ZHVXRpbHMuU1lNQk9MX0lDX0NPREUgPSB0aGlzLiNzZXR0aW5ncy5TWU1CT0xfSUNfQ09ERSA/PyBTVkdVdGlscy5TWU1CT0xfSUNfQ09ERTtcbiAgICAgICAgICAgICAgICAgICAgc3ltYm9sID0gU1ZHVXRpbHMuU1ZHU3ltYm9sKGF4aXMubmFtZSwgdGV4dFBvaW50LnggKyBTSElGVF9YLCB0ZXh0UG9pbnQueSArIFNISUZUX1kpXG4gICAgICAgICAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxuICAgICAgICAgICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJoYW5naW5nXCIpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYXhpcy5uYW1lKVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIGF4aXMgbmFtZS5cIilcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJmb250LWZhbWlseVwiLCB0aGlzLiNzZXR0aW5ncy5BWElTX0ZPTlRfRkFNSUxZID8/IHRoaXMuI3NldHRpbmdzLkNIQVJUX0ZPTlRfRkFNSUxZKTtcbiAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJmb250LXNpemVcIiwgdGhpcy4jc2V0dGluZ3MuUkFESVhfQVhJU19GT05UX1NJWkUpO1xuICAgICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImZvbnQtd2VpZ2h0XCIsIHRoaXMuI3NldHRpbmdzLkFYSVNfRk9OVF9XRUlHSFQgPz8gNDAwKTtcbiAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX01BSU5fQVhJU19DT0xPUik7XG4gICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKCdwYWludC1vcmRlcicsICdzdHJva2UnKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuI3NldHRpbmdzLkNMQVNTX0FYSVMpIHtcbiAgICAgICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKCdjbGFzcycsIHRoaXMuI3NldHRpbmdzLkNMQVNTX0FYSVMgKyAnICcgKyB0aGlzLiNzZXR0aW5ncy5DTEFTU19BWElTICsgJy0tJyArIGF4aXMubmFtZS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuI3NldHRpbmdzLklOU0VSVF9FTEVNRU5UX1RJVExFKSB7XG4gICAgICAgICAgICAgICAgc3ltYm9sLmFwcGVuZENoaWxkKFNWR1V0aWxzLlNWR1RpdGxlKHRoaXMuI3NldHRpbmdzLkVMRU1FTlRfVElUTEVTLmF4aXNbYXhpcy5uYW1lXSkpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGF4aXNHcm91cC5hcHBlbmRDaGlsZChzeW1ib2wpO1xuICAgICAgICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChheGlzR3JvdXApXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLiNyb290LmFwcGVuZENoaWxkKHdyYXBwZXIpXG4gICAgfVxuXG4gICAgI2RyYXdCb3JkZXJzKCkge1xuICAgICAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuICAgICAgICB3cmFwcGVyLmNsYXNzTGlzdC5hZGQoJ2MtcmFkaXgtYm9yZGVycycpXG5cbiAgICAgICAgY29uc3Qgb3V0ZXJDaXJjbGUgPSBTVkdVdGlscy5TVkdDaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy5nZXRPdXRlckNpcmNsZVJhZGl1cygpKVxuICAgICAgICBvdXRlckNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfQ0lSQ0xFX0NPTE9SKTtcbiAgICAgICAgb3V0ZXJDaXJjbGUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX01BSU5fU1RST0tFKTtcbiAgICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChvdXRlckNpcmNsZSlcblxuICAgICAgICBjb25zdCBpbm5lckNpcmNsZSA9IFNWR1V0aWxzLlNWR0NpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLmdldElubmVyQ2lyY2xlUmFkaXVzKCkpXG4gICAgICAgIGlubmVyQ2lyY2xlLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9DSVJDTEVfQ09MT1IpO1xuICAgICAgICBpbm5lckNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTUFJTl9TVFJPS0UpO1xuICAgICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGlubmVyQ2lyY2xlKVxuXG4gICAgICAgIGNvbnN0IGNlbnRlckNpcmNsZSA9IFNWR1V0aWxzLlNWR0NpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLmdldENlbnRlckNpcmNsZVJhZGl1cygpKVxuICAgICAgICBjZW50ZXJDaXJjbGUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0NJUkNMRV9DT0xPUik7XG4gICAgICAgIGNlbnRlckNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTUFJTl9TVFJPS0UpO1xuICAgICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGNlbnRlckNpcmNsZSlcblxuICAgICAgICB0aGlzLiNyb290LmFwcGVuZENoaWxkKHdyYXBwZXIpXG4gICAgfVxuXG4gICAgYW5pbWF0ZVRvKGRhdGEpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBnZXRQb2ludChuYW1lKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgZ2V0UG9pbnRzKCkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbn1cblxuZXhwb3J0IHtcbiAgICBSYWRpeENoYXJ0IGFzIGRlZmF1bHRcbn1cbiIsImltcG9ydCBSYWRpeENoYXJ0IGZyb20gJy4uL2NoYXJ0cy9SYWRpeENoYXJ0LmpzJztcbmltcG9ydCBTVkdVdGlscyBmcm9tICcuLi91dGlscy9TVkdVdGlscy5qcyc7XG5pbXBvcnQgQ2hhcnQgZnJvbSAnLi9DaGFydC5qcydcbmltcG9ydCBVdGlscyBmcm9tICcuLi91dGlscy9VdGlscy5qcyc7XG5pbXBvcnQgQXNwZWN0VXRpbHMgZnJvbSAnLi4vdXRpbHMvQXNwZWN0VXRpbHMuanMnO1xuaW1wb3J0IFBvaW50IGZyb20gJy4uL3BvaW50cy9Qb2ludC5qcydcbmltcG9ydCBEZWZhdWx0U2V0dGluZ3MgZnJvbSAnLi4vc2V0dGluZ3MvRGVmYXVsdFNldHRpbmdzLmpzJztcblxuLyoqXG4gKiBAY2xhc3NcbiAqIEBjbGFzc2Rlc2MgUG9pbnRzIGFuZCBjdXBzIGFyZSBkaXNwbGF5ZWQgZnJvbSBvdXRzaWRlIHRoZSBVbml2ZXJzZS5cbiAqIEBwdWJsaWNcbiAqIEBleHRlbmRzIHtDaGFydH1cbiAqL1xuY2xhc3MgVHJhbnNpdENoYXJ0IGV4dGVuZHMgQ2hhcnQge1xuXG4gICAgLypcbiAgICAgKiBMZXZlbHMgZGV0ZXJtaW5lIHRoZSB3aWR0aCBvZiBpbmRpdmlkdWFsIHBhcnRzIG9mIHRoZSBjaGFydC5cbiAgICAgKiBJdCBjYW4gYmUgY2hhbmdlZCBkeW5hbWljYWxseSBieSBwdWJsaWMgc2V0dGVyLlxuICAgICAqL1xuICAgICNudW1iZXJPZkxldmVscyA9IDMyXG5cbiAgICAjcmFkaXhcbiAgICAjc2V0dGluZ3NcbiAgICAjcm9vdFxuICAgICNkYXRhXG5cbiAgICAjY2VudGVyWFxuICAgICNjZW50ZXJZXG4gICAgI3JhZGl1c1xuXG4gICAgLypcbiAgICAgKiBAc2VlIFV0aWxzLmNsZWFuVXAoKVxuICAgICAqL1xuICAgICNiZWZvcmVDbGVhblVwSG9va1xuXG4gICAgLyoqXG4gICAgICogQGNvbnN0cnVjdHNcbiAgICAgKiBAcGFyYW0ge1JhZGl4Q2hhcnR9IHJhZGl4XG4gICAgICovXG4gICAgY29uc3RydWN0b3IocmFkaXgpIHtcbiAgICAgICAgaWYgKCEgKHJhZGl4IGluc3RhbmNlb2YgUmFkaXhDaGFydCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQmFkIHBhcmFtIHJhZGl4LicpXG4gICAgICAgIH1cblxuICAgICAgICBzdXBlcihyYWRpeC5nZXRVbml2ZXJzZSgpLmdldFNldHRpbmdzKCkpXG5cbiAgICAgICAgdGhpcy4jcmFkaXggPSByYWRpeFxuICAgICAgICB0aGlzLiNzZXR0aW5ncyA9IHRoaXMuI3JhZGl4LmdldFVuaXZlcnNlKCkuZ2V0U2V0dGluZ3MoKVxuICAgICAgICB0aGlzLiNjZW50ZXJYID0gdGhpcy4jc2V0dGluZ3MuQ0hBUlRfVklFV0JPWF9XSURUSCAvIDJcbiAgICAgICAgdGhpcy4jY2VudGVyWSA9IHRoaXMuI3NldHRpbmdzLkNIQVJUX1ZJRVdCT1hfSEVJR0hUIC8gMlxuICAgICAgICB0aGlzLiNyYWRpdXMgPSBNYXRoLm1pbih0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZKSAtIHRoaXMuI3NldHRpbmdzLkNIQVJUX1BBRERJTkdcblxuICAgICAgICB0aGlzLiNyb290ID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuICAgICAgICB0aGlzLiNyb290LnNldEF0dHJpYnV0ZShcImlkXCIsIGAke3RoaXMuI3NldHRpbmdzLkhUTUxfRUxFTUVOVF9JRH0tJHt0aGlzLiNzZXR0aW5ncy5UUkFOU0lUX0lEfWApXG4gICAgICAgIHRoaXMuI3JhZGl4LmdldFVuaXZlcnNlKCkuZ2V0U1ZHRG9jdW1lbnQoKS5hcHBlbmRDaGlsZCh0aGlzLiNyb290KTtcblxuICAgICAgICAvLyBUb3AgbGF5ZXIgdG8gcHV0IG9uIHRvcCBlbGVtZW50cyB0aHJvdWdoIDx1c2U+XG4gICAgICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2ZyL2RvY3MvV2ViL1NWRy9SZWZlcmVuY2UvRWxlbWVudC91c2VcbiAgICAgICAgbGV0IHRvcExheWVyR3JvdXAgPSBTVkdVdGlscy5TVkdHcm91cCgpO1xuICAgICAgICB0b3BMYXllckdyb3VwLnNldEF0dHJpYnV0ZSgnaWQnLCB0aGlzLiNzZXR0aW5ncy5UT1BfTEFZRVJfSUQgPz8gJ2MtdG9wLWxheWVyJylcbiAgICAgICAgdGhpcy4jcmFkaXguZ2V0VW5pdmVyc2UoKS5nZXRTVkdEb2N1bWVudCgpLmFwcGVuZENoaWxkKHRvcExheWVyR3JvdXApXG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXQgY2hhcnQgZGF0YVxuICAgICAqIEB0aHJvd3Mge0Vycm9yfSAtIGlmIHRoZSBkYXRhIGlzIG5vdCB2YWxpZC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICAgICAqIEByZXR1cm4ge1JhZGl4Q2hhcnR9XG4gICAgICovXG4gICAgc2V0RGF0YShkYXRhKSB7XG4gICAgICAgIGxldCBzdGF0dXMgPSB0aGlzLnZhbGlkYXRlRGF0YShkYXRhKVxuICAgICAgICBpZiAoISBzdGF0dXMuaXNWYWxpZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHN0YXR1cy5tZXNzYWdlKVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy4jZGF0YSA9IGRhdGFcbiAgICAgICAgdGhpcy4jZHJhdyhkYXRhKVxuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IGRhdGFcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG4gICAgZ2V0RGF0YSgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIFwicG9pbnRzXCI6IFsuLi50aGlzLiNkYXRhLnBvaW50c10sIFwiY3VzcHNcIjogWy4uLnRoaXMuI2RhdGEuY3VzcHNdXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgcmFkaXVzXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge051bWJlcn1cbiAgICAgKi9cbiAgICBnZXRSYWRpdXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiNyYWRpdXNcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgYXNwZWN0c1xuICAgICAqXG4gICAgICogQHBhcmFtIHtBcnJheTxPYmplY3Q+fSBbZnJvbVBvaW50c10gLSBbe25hbWU6XCJNb29uXCIsIGFuZ2xlOjB9LCB7bmFtZTpcIlN1blwiLCBhbmdsZToxNzl9LCB7bmFtZTpcIk1lcmN1cnlcIiwgYW5nbGU6MTIxfV1cbiAgICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IFt0b1BvaW50c10gLSBbe25hbWU6XCJBU1wiLCBhbmdsZTowfSwge25hbWU6XCJJQ1wiLCBhbmdsZTo5MH1dXG4gICAgICogQHBhcmFtIHtBcnJheTxPYmplY3Q+fSBbYXNwZWN0c10gLSBbe25hbWU6XCJPcHBvc2l0aW9uXCIsIGFuZ2xlOjE4MCwgb3JiOjJ9LCB7bmFtZTpcIlRyaW5lXCIsIGFuZ2xlOjEyMCwgb3JiOjJ9XVxuICAgICAqXG4gICAgICogQHJldHVybiB7QXJyYXk8T2JqZWN0Pn1cbiAgICAgKi9cbiAgICBnZXRBc3BlY3RzKGZyb21Qb2ludHMsIHRvUG9pbnRzLCBhc3BlY3RzKSB7XG4gICAgICAgIGlmICghIHRoaXMuI2RhdGEpIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgZnJvbVBvaW50cyA9IGZyb21Qb2ludHMgPz8gWy4uLnRoaXMuI2RhdGEucG9pbnRzLmZpbHRlcih4ID0+IFwiYXNwZWN0XCIgaW4geCA/IHguYXNwZWN0IDogdHJ1ZSksIC4uLnRoaXMuI2RhdGEuY3VzcHMuZmlsdGVyKHggPT4geC5hc3BlY3QpXVxuICAgICAgICB0b1BvaW50cyA9IHRvUG9pbnRzID8/IFsuLi50aGlzLiNyYWRpeC5nZXREYXRhKCkucG9pbnRzLmZpbHRlcih4ID0+IFwiYXNwZWN0XCIgaW4geCA/IHguYXNwZWN0IDogdHJ1ZSksIC4uLnRoaXMuI3JhZGl4LmdldERhdGEoKS5jdXNwcy5maWx0ZXIoeCA9PiB4LmFzcGVjdCldXG4gICAgICAgIGFzcGVjdHMgPSBhc3BlY3RzID8/IHRoaXMuI3NldHRpbmdzLkRFRkFVTFRfQVNQRUNUUyA/PyBEZWZhdWx0U2V0dGluZ3MuREVGQVVMVF9BU1BFQ1RTXG5cbiAgICAgICAgcmV0dXJuIEFzcGVjdFV0aWxzLmdldEFzcGVjdHMoZnJvbVBvaW50cywgdG9Qb2ludHMsIGFzcGVjdHMpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRHJhdyBhc3BlY3RzXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IFtmcm9tUG9pbnRzXSAtIFt7bmFtZTpcIk1vb25cIiwgYW5nbGU6MH0sIHtuYW1lOlwiU3VuXCIsIGFuZ2xlOjE3OX0sIHtuYW1lOlwiTWVyY3VyeVwiLCBhbmdsZToxMjF9XVxuICAgICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gW3RvUG9pbnRzXSAtIFt7bmFtZTpcIkFTXCIsIGFuZ2xlOjB9LCB7bmFtZTpcIklDXCIsIGFuZ2xlOjkwfV1cbiAgICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IFthc3BlY3RzXSAtIFt7bmFtZTpcIk9wcG9zaXRpb25cIiwgYW5nbGU6MTgwLCBvcmI6Mn0sIHtuYW1lOlwiVHJpbmVcIiwgYW5nbGU6MTIwLCBvcmI6Mn1dXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtBcnJheTxPYmplY3Q+fVxuICAgICAqL1xuICAgIGRyYXdBc3BlY3RzKGZyb21Qb2ludHMsIHRvUG9pbnRzLCBhc3BlY3RzKSB7XG4gICAgICAgIGNvbnN0IGFzcGVjdHNXcmFwcGVyID0gdGhpcy4jcmFkaXguZ2V0VW5pdmVyc2UoKS5nZXRBc3BlY3RzRWxlbWVudCgpXG4gICAgICAgIFV0aWxzLmNsZWFuVXAoYXNwZWN0c1dyYXBwZXIuZ2V0QXR0cmlidXRlKFwiaWRcIiksIHRoaXMuI2JlZm9yZUNsZWFuVXBIb29rKVxuXG4gICAgICAgIGNvbnN0IGFzcGVjdHNMaXN0ID0gdGhpcy5nZXRBc3BlY3RzKGZyb21Qb2ludHMsIHRvUG9pbnRzLCBhc3BlY3RzKVxuICAgICAgICAgICAgLnJlZHVjZSgoYXJyLCBhc3BlY3QpID0+IHtcblxuICAgICAgICAgICAgICAgIGxldCBpc1RoZVNhbWUgPSBhcnIuc29tZShlbG0gPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZWxtLmZyb20ubmFtZSA9PT0gYXNwZWN0LnRvLm5hbWUgJiYgZWxtLnRvLm5hbWUgPT09IGFzcGVjdC5mcm9tLm5hbWVcbiAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgaWYgKCEgaXNUaGVTYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIGFyci5wdXNoKGFzcGVjdClcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gYXJyXG4gICAgICAgICAgICB9LCBbXSlcbiAgICAgICAgLy8gLmZpbHRlcihhc3BlY3QgPT4gYXNwZWN0LmFzcGVjdC5uYW1lICE9PSAnQ29uanVuY3Rpb24nKSAvLyBLZWVwIHRoZW0gaW5zaWRlIHRoZSBTVkdcblxuICAgICAgICBjb25zdCBjaXJjbGUgPSBTVkdVdGlscy5TVkdDaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy4jcmFkaXguZ2V0Q2VudGVyQ2lyY2xlUmFkaXVzKCkpXG4gICAgICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoJ2ZpbGwnLCB0aGlzLiNzZXR0aW5ncy5BU1BFQ1RTX0JBQ0tHUk9VTkRfQ09MT1IpXG4gICAgICAgIGFzcGVjdHNXcmFwcGVyLmFwcGVuZENoaWxkKGNpcmNsZSlcblxuICAgICAgICBhc3BlY3RzV3JhcHBlci5hcHBlbmRDaGlsZChBc3BlY3RVdGlscy5kcmF3QXNwZWN0cyh0aGlzLiNyYWRpeC5nZXRDZW50ZXJDaXJjbGVSYWRpdXMoKSwgdGhpcy4jcmFkaXguZ2V0QXNjZW5kYW50U2hpZnQoKSwgdGhpcy4jc2V0dGluZ3MsIGFzcGVjdHNMaXN0KSlcblxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIC8vICMjIFBSSVZBVEUgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiAgICAvKlxuICAgICAqIERyYXcgcmFkaXggY2hhcnRcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICAgICAqL1xuICAgICNkcmF3KGRhdGEpIHtcblxuICAgICAgICAvLyByYWRpeCByZURyYXdcbiAgICAgICAgVXRpbHMuY2xlYW5VcCh0aGlzLiNyb290LmdldEF0dHJpYnV0ZSgnaWQnKSwgdGhpcy4jYmVmb3JlQ2xlYW5VcEhvb2spXG4gICAgICAgIHRoaXMuI3JhZGl4LnNldE51bWJlck9mTGV2ZWxzKHRoaXMuI251bWJlck9mTGV2ZWxzKVxuICAgICAgICB0aGlzLiNkcmF3Q3VzcHMoZGF0YSlcbiAgICAgICAgdGhpcy4jZHJhd1BvaW50cyhkYXRhKVxuICAgICAgICB0aGlzLiNkcmF3UnVsZXIoKVxuICAgICAgICB0aGlzLiNkcmF3Qm9yZGVycygpXG4gICAgICAgIHRoaXMuI3NldHRpbmdzLkNIQVJUX0RSQVdfTUFJTl9BWElTICYmIHRoaXMuI2RyYXdNYWluQXhpc0Rlc2NyaXB0aW9uKGRhdGEpXG4gICAgICAgIHRoaXMuI3NldHRpbmdzLkRSQVdfQVNQRUNUUyAmJiB0aGlzLmRyYXdBc3BlY3RzKClcbiAgICB9XG5cbiAgICAjZHJhd1J1bGVyKCkge1xuICAgICAgICBjb25zdCBOVU1CRVJfT0ZfRElWSURFUlMgPSA3MlxuICAgICAgICBjb25zdCBTVEVQID0gNVxuXG4gICAgICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG5cbiAgICAgICAgbGV0IHN0YXJ0QW5nbGUgPSB0aGlzLiNyYWRpeC5nZXRBc2NlbmRhbnRTaGlmdCgpXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgTlVNQkVSX09GX0RJVklERVJTOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBzdGFydFBvaW50ID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLiNnZXRSdWxsZXJDaXJjbGVSYWRpdXMoKSwgVXRpbHMuZGVncmVlVG9SYWRpYW4oc3RhcnRBbmdsZSkpXG4gICAgICAgICAgICBsZXQgZW5kUG9pbnQgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIChpICUgMikgPyB0aGlzLmdldFJhZGl1cygpIC0gKCh0aGlzLmdldFJhZGl1cygpIC0gdGhpcy4jZ2V0UnVsbGVyQ2lyY2xlUmFkaXVzKCkpIC8gMikgOiB0aGlzLmdldFJhZGl1cygpLCBVdGlscy5kZWdyZWVUb1JhZGlhbihzdGFydEFuZ2xlKSlcbiAgICAgICAgICAgIGNvbnN0IGxpbmUgPSBTVkdVdGlscy5TVkdMaW5lKHN0YXJ0UG9pbnQueCwgc3RhcnRQb2ludC55LCBlbmRQb2ludC54LCBlbmRQb2ludC55KTtcbiAgICAgICAgICAgIGxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0xJTkVfQ09MT1IpO1xuICAgICAgICAgICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFKTtcbiAgICAgICAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQobGluZSk7XG5cbiAgICAgICAgICAgIHN0YXJ0QW5nbGUgKz0gU1RFUFxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY2lyY2xlID0gU1ZHVXRpbHMuU1ZHQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuI2dldFJ1bGxlckNpcmNsZVJhZGl1cygpKTtcbiAgICAgICAgY2lyY2xlLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9DSVJDTEVfQ09MT1IpO1xuICAgICAgICBjaXJjbGUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRSk7XG4gICAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoY2lyY2xlKTtcblxuICAgICAgICB0aGlzLiNyb290LmFwcGVuZENoaWxkKHdyYXBwZXIpXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBEcmF3IHBvaW50c1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIC0gY2hhcnQgZGF0YVxuICAgICAqL1xuICAgICNkcmF3UG9pbnRzKGRhdGEpIHtcbiAgICAgICAgY29uc3QgcG9pbnRzID0gZGF0YS5wb2ludHNcbiAgICAgICAgY29uc3QgY3VzcHMgPSBkYXRhLmN1c3BzXG4gICAgICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG4gICAgICAgIHdyYXBwZXIuY2xhc3NMaXN0LmFkZCgnYy10cmFuc2l0LXBvaW50cycpXG5cbiAgICAgICAgY29uc3QgcG9zaXRpb25zID0gVXRpbHMuY2FsY3VsYXRlUG9zaXRpb25XaXRob3V0T3ZlcmxhcHBpbmcocG9pbnRzLCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9DT0xMSVNJT05fUkFESVVTLCB0aGlzLiNnZXRQb2ludENpcmNsZVJhZGl1cygpKVxuXG4gICAgICAgIGZvciAoY29uc3QgcG9pbnREYXRhIG9mIHBvaW50cykge1xuICAgICAgICAgICAgY29uc3QgcG9pbnRHcm91cCA9IFNWR1V0aWxzLlNWR0dyb3VwKCk7XG4gICAgICAgICAgICBwb2ludEdyb3VwLmNsYXNzTGlzdC5hZGQoJ2MtdHJhbnNpdC1wb2ludCcpXG4gICAgICAgICAgICBwb2ludEdyb3VwLmNsYXNzTGlzdC5hZGQoJ2MtdHJhbnNpdC1wb2ludC0tJyArIHBvaW50RGF0YS5uYW1lLnRvTG93ZXJDYXNlKCkpXG5cbiAgICAgICAgICAgIGNvbnN0IHBvaW50ID0gbmV3IFBvaW50KHBvaW50RGF0YSwgY3VzcHMsIHRoaXMuI3NldHRpbmdzKVxuICAgICAgICAgICAgY29uc3QgcG9pbnRQb3NpdGlvbiA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWCwgdGhpcy4jZ2V0UnVsbGVyQ2lyY2xlUmFkaXVzKCkgLSAoKHRoaXMuZ2V0UmFkaXVzKCkgLSB0aGlzLiNnZXRSdWxsZXJDaXJjbGVSYWRpdXMoKSkgLyA0KSwgVXRpbHMuZGVncmVlVG9SYWRpYW4ocG9pbnQuZ2V0QW5nbGUoKSwgdGhpcy4jcmFkaXguZ2V0QXNjZW5kYW50U2hpZnQoKSkpXG4gICAgICAgICAgICBjb25zdCBzeW1ib2xQb3NpdGlvbiA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWCwgdGhpcy4jZ2V0UG9pbnRDaXJjbGVSYWRpdXMoKSwgVXRpbHMuZGVncmVlVG9SYWRpYW4ocG9zaXRpb25zW3BvaW50LmdldE5hbWUoKV0sIHRoaXMuI3JhZGl4LmdldEFzY2VuZGFudFNoaWZ0KCkpKVxuXG4gICAgICAgICAgICAvLyBydWxlciBtYXJrXG4gICAgICAgICAgICBjb25zdCBydWxlckxpbmVFbmRQb3NpdGlvbiA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWCwgdGhpcy4jZ2V0UnVsbGVyQ2lyY2xlUmFkaXVzKCksIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKHBvaW50LmdldEFuZ2xlKCksIHRoaXMuI3JhZGl4LmdldEFzY2VuZGFudFNoaWZ0KCkpKVxuXG4gICAgICAgICAgICBpZiAodGhpcy4jc2V0dGluZ3MuRFJBV19SVUxFUl9NQVJLKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcnVsZXJMaW5lID0gU1ZHVXRpbHMuU1ZHTGluZShwb2ludFBvc2l0aW9uLngsIHBvaW50UG9zaXRpb24ueSwgcnVsZXJMaW5lRW5kUG9zaXRpb24ueCwgcnVsZXJMaW5lRW5kUG9zaXRpb24ueSlcbiAgICAgICAgICAgICAgICBydWxlckxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0xJTkVfQ09MT1IpO1xuICAgICAgICAgICAgICAgIHJ1bGVyTGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFKTtcbiAgICAgICAgICAgICAgICBwb2ludEdyb3VwLmFwcGVuZENoaWxkKHJ1bGVyTGluZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTGluZSBmcm9tIHRoZSBydWxlciB0byB0aGUgY2VsZXN0aWFsIGJvZHlcbiAgICAgICAgICAgICAqIEB0eXBlIHt7eCwgeX19XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGNvbnN0IHBvaW50ZXJMaW5lRW5kUG9zaXRpb24gPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclgsIHRoaXMuI2dldFBvaW50Q2lyY2xlUmFkaXVzKCksIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKHBvc2l0aW9uc1twb2ludC5nZXROYW1lKCldLCB0aGlzLiNyYWRpeC5nZXRBc2NlbmRhbnRTaGlmdCgpKSlcblxuICAgICAgICAgICAgbGV0IHBvaW50ZXJMaW5lO1xuICAgICAgICAgICAgaWYgKHRoaXMuI3NldHRpbmdzLkRSQVdfUlVMRVJfTUFSSykge1xuICAgICAgICAgICAgICAgIHBvaW50ZXJMaW5lID0gU1ZHVXRpbHMuU1ZHTGluZShwb2ludFBvc2l0aW9uLngsIHBvaW50UG9zaXRpb24ueSwgKHBvaW50UG9zaXRpb24ueCArIHBvaW50ZXJMaW5lRW5kUG9zaXRpb24ueCkgLyAyLCAocG9pbnRQb3NpdGlvbi55ICsgcG9pbnRlckxpbmVFbmRQb3NpdGlvbi55KSAvIDIpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHBvaW50ZXJMaW5lID0gU1ZHVXRpbHMuU1ZHTGluZShydWxlckxpbmVFbmRQb3NpdGlvbi54LCBydWxlckxpbmVFbmRQb3NpdGlvbi55LCAocG9pbnRQb3NpdGlvbi54ICsgcG9pbnRlckxpbmVFbmRQb3NpdGlvbi54KSAvIDIsIChwb2ludFBvc2l0aW9uLnkgKyBwb2ludGVyTGluZUVuZFBvc2l0aW9uLnkpIC8gMilcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLiNzZXR0aW5ncy5QTEFORVRfTElORV9VU0VfUExBTkVUX0NPTE9SKSB7XG4gICAgICAgICAgICAgICAgcG9pbnRlckxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLlBMQU5FVF9DT0xPUlNbcG9pbnREYXRhLm5hbWVdID8/IHRoaXMuI3NldHRpbmdzLkNIQVJUX0xJTkVfQ09MT1IpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwb2ludGVyTGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTElORV9DT0xPUik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHBvaW50ZXJMaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0UgLyAyKTtcblxuICAgICAgICAgICAgcG9pbnRHcm91cC5hcHBlbmRDaGlsZChwb2ludGVyTGluZSk7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogU3ltbm9sIG9mIHRoZSBjZWxlc3RpYWwgYm9keSArIHBvaW50c1xuICAgICAgICAgICAgICogQHR5cGUge1NWR0VsZW1lbnR9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGNvbnN0IHN5bWJvbCA9IHBvaW50LmdldFN5bWJvbChzeW1ib2xQb3NpdGlvbi54LCBzeW1ib2xQb3NpdGlvbi55LCBVdGlscy5ERUdfMCwgdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19TSE9XKVxuICAgICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImZvbnQtZmFtaWx5XCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0ZPTlRfRkFNSUxZKTtcbiAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKSAvLyBzdGFydCwgbWlkZGxlLCBlbmRcbiAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJkb21pbmFudC1iYXNlbGluZVwiLCBcIm1pZGRsZVwiKVxuICAgICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImZvbnQtc2l6ZVwiLCB0aGlzLiNzZXR0aW5ncy5SQURJWF9QT0lOVFNfRk9OVF9TSVpFKVxuICAgICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgdGhpcy4jc2V0dGluZ3MuUExBTkVUX0NPTE9SU1twb2ludERhdGEubmFtZV0gPz8gdGhpcy4jc2V0dGluZ3MuQ0hBUlRfUE9JTlRTX0NPTE9SKVxuICAgICAgICAgICAgcG9pbnRHcm91cC5hcHBlbmRDaGlsZChzeW1ib2wpO1xuXG4gICAgICAgICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHBvaW50R3JvdXApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy4jcm9vdC5hcHBlbmRDaGlsZCh3cmFwcGVyKVxuICAgIH1cblxuICAgIC8qXG4gICAgICogRHJhdyBwb2ludHNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YSAtIGNoYXJ0IGRhdGFcbiAgICAgKi9cbiAgICAjZHJhd0N1c3BzKGRhdGEpIHtcbiAgICAgICAgY29uc3QgcG9pbnRzID0gZGF0YS5wb2ludHNcbiAgICAgICAgY29uc3QgY3VzcHMgPSBkYXRhLmN1c3BzXG5cbiAgICAgICAgY29uc3QgbWFpbkF4aXNJbmRleGVzID0gWzAsIDMsIDYsIDldIC8vQXMsIEljLCBEcywgTWNcblxuICAgICAgICBjb25zdCBwb2ludHNQb3NpdGlvbnMgPSBwb2ludHMubWFwKHBvaW50ID0+IHtcbiAgICAgICAgICAgIHJldHVybiBwb2ludC5hbmdsZVxuICAgICAgICB9KVxuXG4gICAgICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG4gICAgICAgIHdyYXBwZXIuY2xhc3NMaXN0LmFkZCgnYy10cmFuc2l0LWN1c3BzJylcblxuICAgICAgICBjb25zdCB0ZXh0UmFkaXVzID0gdGhpcy4jZ2V0Q2VudGVyQ2lyY2xlUmFkaXVzKCkgKyAoKHRoaXMuI2dldFJ1bGxlckNpcmNsZVJhZGl1cygpIC0gdGhpcy4jZ2V0Q2VudGVyQ2lyY2xlUmFkaXVzKCkpIC8gNilcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGN1c3BzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgICAgIGNvbnN0IGlzTGluZUluQ29sbGlzaW9uV2l0aFBvaW50ID0gISB0aGlzLiNzZXR0aW5ncy5DSEFSVF9BTExPV19IT1VTRV9PVkVSTEFQICYmIFV0aWxzLmlzQ29sbGlzaW9uKGN1c3BzW2ldLmFuZ2xlLCBwb2ludHNQb3NpdGlvbnMsIHRoaXMuI3NldHRpbmdzLlBPSU5UX0NPTExJU0lPTl9SQURJVVMgLyAyKVxuXG4gICAgICAgICAgICBjb25zdCBzdGFydFBvcyA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy4jZ2V0Q2VudGVyQ2lyY2xlUmFkaXVzKCksIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKGN1c3BzW2ldLmFuZ2xlLCB0aGlzLiNyYWRpeC5nZXRBc2NlbmRhbnRTaGlmdCgpKSlcbiAgICAgICAgICAgIGNvbnN0IGVuZFBvcyA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgaXNMaW5lSW5Db2xsaXNpb25XaXRoUG9pbnQgPyB0aGlzLiNnZXRDZW50ZXJDaXJjbGVSYWRpdXMoKSArICgodGhpcy4jZ2V0UnVsbGVyQ2lyY2xlUmFkaXVzKCkgLSB0aGlzLiNnZXRDZW50ZXJDaXJjbGVSYWRpdXMoKSkgLyA2KSA6IHRoaXMuI2dldFJ1bGxlckNpcmNsZVJhZGl1cygpLCBVdGlscy5kZWdyZWVUb1JhZGlhbihjdXNwc1tpXS5hbmdsZSwgdGhpcy4jcmFkaXguZ2V0QXNjZW5kYW50U2hpZnQoKSkpXG5cbiAgICAgICAgICAgIGNvbnN0IGxpbmUgPSBTVkdVdGlscy5TVkdMaW5lKHN0YXJ0UG9zLngsIHN0YXJ0UG9zLnksIGVuZFBvcy54LCBlbmRQb3MueSlcbiAgICAgICAgICAgIGxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIG1haW5BeGlzSW5kZXhlcy5pbmNsdWRlcyhpKSA/IHRoaXMuI3NldHRpbmdzLkNIQVJUX01BSU5fQVhJU19DT0xPUiA6IHRoaXMuI3NldHRpbmdzLkNIQVJUX0xJTkVfQ09MT1IpXG4gICAgICAgICAgICBsaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCBtYWluQXhpc0luZGV4ZXMuaW5jbHVkZXMoaSkgPyB0aGlzLiNzZXR0aW5ncy5DSEFSVF9NQUlOX1NUUk9LRSA6IHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRSlcbiAgICAgICAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQobGluZSk7XG5cbiAgICAgICAgICAgIGNvbnN0IHN0YXJ0Q3VzcCA9IGN1c3BzW2ldLmFuZ2xlXG4gICAgICAgICAgICBjb25zdCBlbmRDdXNwID0gY3VzcHNbKGkgKyAxKSAlIDEyXS5hbmdsZVxuICAgICAgICAgICAgY29uc3QgZ2FwID0gZW5kQ3VzcCAtIHN0YXJ0Q3VzcCA+IDAgPyBlbmRDdXNwIC0gc3RhcnRDdXNwIDogZW5kQ3VzcCAtIHN0YXJ0Q3VzcCArIFV0aWxzLkRFR18zNjBcbiAgICAgICAgICAgIGNvbnN0IHRleHRBbmdsZSA9IHN0YXJ0Q3VzcCArIGdhcCAvIDJcblxuICAgICAgICAgICAgY29uc3QgdGV4dFBvcyA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGV4dFJhZGl1cywgVXRpbHMuZGVncmVlVG9SYWRpYW4odGV4dEFuZ2xlLCB0aGlzLiNyYWRpeC5nZXRBc2NlbmRhbnRTaGlmdCgpKSlcbiAgICAgICAgICAgIGNvbnN0IHRleHQgPSBTVkdVdGlscy5TVkdUZXh0KHRleHRQb3MueCwgdGV4dFBvcy55LCBgJHtpICsgMX1gKVxuICAgICAgICAgICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJmb250LWZhbWlseVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9GT05UX0ZBTUlMWSlcbiAgICAgICAgICAgIHRleHQuc2V0QXR0cmlidXRlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIikgLy8gc3RhcnQsIG1pZGRsZSwgZW5kXG4gICAgICAgICAgICB0ZXh0LnNldEF0dHJpYnV0ZShcImRvbWluYW50LWJhc2VsaW5lXCIsIFwibWlkZGxlXCIpXG4gICAgICAgICAgICB0ZXh0LnNldEF0dHJpYnV0ZShcImZvbnQtc2l6ZVwiLCB0aGlzLiNzZXR0aW5ncy5SQURJWF9IT1VTRV9GT05UX1NJWkUpXG4gICAgICAgICAgICB0ZXh0LnNldEF0dHJpYnV0ZShcImZpbGxcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfSE9VU0VfTlVNQkVSX0NPTE9SKVxuICAgICAgICAgICAgdGV4dC5jbGFzc0xpc3QuYWRkKCdjLXJhZGl4LWN1c3BzX19ob3VzZS1udW1iZXInKVxuXG4gICAgICAgICAgICBpZiAodGhpcy4jc2V0dGluZ3MuSU5TRVJUX0VMRU1FTlRfVElUTEUpIHtcbiAgICAgICAgICAgICAgICB0ZXh0LmFwcGVuZENoaWxkKFNWR1V0aWxzLlNWR1RpdGxlKHRoaXMuI3NldHRpbmdzLkVMRU1FTlRfVElUTEVTLmN1c3BzW2kgKyAxXSkpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQodGV4dClcblxuICAgICAgICAgICAgaWYgKHRoaXMuI3NldHRpbmdzLkRSQVdfSE9VU0VfREVHUkVFKSB7XG4gICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodGhpcy4jc2V0dGluZ3MuSE9VU0VfREVHUkVFX0ZJTFRFUikgJiYgISB0aGlzLiNzZXR0aW5ncy5IT1VTRV9ERUdSRUVfRklMVEVSLmluY2x1ZGVzKGkgKyAxKSkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgZGVncmVlUG9zID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLiNnZXRSdWxsZXJDaXJjbGVSYWRpdXMoKSAtICh0aGlzLmdldFJhZGl1cygpIC0gdGhpcy4jZ2V0UnVsbGVyQ2lyY2xlUmFkaXVzKCkpLCBVdGlscy5kZWdyZWVUb1JhZGlhbihzdGFydEN1c3AgLSAxLjc1LCB0aGlzLiNyYWRpeC5nZXRBc2NlbmRhbnRTaGlmdCgpKSlcbiAgICAgICAgICAgICAgICBjb25zdCBkZWdyZWUgPSBTVkdVdGlscy5TVkdUZXh0KGRlZ3JlZVBvcy54LCBkZWdyZWVQb3MueSwgTWF0aC5mbG9vcihjdXNwc1tpXS5hbmdsZSAlIDMwKSArIFwiwrpcIilcbiAgICAgICAgICAgICAgICBkZWdyZWUuc2V0QXR0cmlidXRlKFwiZm9udC1mYW1pbHlcIiwgXCJBcmlhbFwiKVxuICAgICAgICAgICAgICAgIGRlZ3JlZS5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKSAvLyBzdGFydCwgbWlkZGxlLCBlbmRcbiAgICAgICAgICAgICAgICBkZWdyZWUuc2V0QXR0cmlidXRlKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcbiAgICAgICAgICAgICAgICBkZWdyZWUuc2V0QXR0cmlidXRlKFwiZm9udC1zaXplXCIsIHRoaXMuI3NldHRpbmdzLkhPVVNFX0RFR1JFRV9TSVpFIHx8IHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfQU5HTEVfU0laRSAvIDIpXG4gICAgICAgICAgICAgICAgZGVncmVlLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgdGhpcy4jc2V0dGluZ3MuSE9VU0VfREVHUkVFX0NPTE9SIHx8IHRoaXMuI3NldHRpbmdzLlRSQU5TSVRfSE9VU0VfTlVNQkVSX0NPTE9SIHx8IHRoaXMuI3NldHRpbmdzLkNIQVJUX0hPVVNFX05VTUJFUl9DT0xPUilcbiAgICAgICAgICAgICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGRlZ3JlZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuI3Jvb3QuYXBwZW5kQ2hpbGQod3JhcHBlcilcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIERyYXcgbWFpbiBheGlzIGRlc2NyaXRpb25cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBheGlzTGlzdFxuICAgICAqL1xuICAgICNkcmF3TWFpbkF4aXNEZXNjcmlwdGlvbihkYXRhKSB7XG4gICAgICAgIGNvbnN0IEFYSVNfTEVOR1RIID0gMTBcbiAgICAgICAgY29uc3QgY3VzcHMgPSBkYXRhLmN1c3BzXG5cbiAgICAgICAgY29uc3QgYXhpc0xpc3QgPSBbe1xuICAgICAgICAgICAgbmFtZTogU1ZHVXRpbHMuU1lNQk9MX0FTLCBhbmdsZTogY3VzcHNbMF0uYW5nbGVcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgbmFtZTogU1ZHVXRpbHMuU1lNQk9MX0lDLCBhbmdsZTogY3VzcHNbM10uYW5nbGVcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgbmFtZTogU1ZHVXRpbHMuU1lNQk9MX0RTLCBhbmdsZTogY3VzcHNbNl0uYW5nbGVcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgbmFtZTogU1ZHVXRpbHMuU1lNQk9MX01DLCBhbmdsZTogY3VzcHNbOV0uYW5nbGVcbiAgICAgICAgfSxdXG5cbiAgICAgICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcbiAgICAgICAgd3JhcHBlci5jbGFzc0xpc3QuYWRkKCdjLXRyYW5zaXQtYXhpcycpXG5cbiAgICAgICAgY29uc3QgcmFkMSA9IHRoaXMuZ2V0UmFkaXVzKCk7XG4gICAgICAgIGNvbnN0IHJhZDIgPSB0aGlzLmdldFJhZGl1cygpICsgQVhJU19MRU5HVEg7XG5cbiAgICAgICAgZm9yIChjb25zdCBheGlzIG9mIGF4aXNMaXN0KSB7XG4gICAgICAgICAgICBjb25zdCBheGlzR3JvdXAgPSBTVkdVdGlscy5TVkdHcm91cCgpXG4gICAgICAgICAgICBheGlzR3JvdXAuY2xhc3NMaXN0LmFkZCgnYy10cmFuc2l0LWF4aXNfX2F4aXMnKVxuICAgICAgICAgICAgYXhpc0dyb3VwLmNsYXNzTGlzdC5hZGQoJ2MtdHJhbnNpdC1heGlzX19heGlzLS0nICsgYXhpcy5uYW1lLnRvTG93ZXJDYXNlKCkpXG5cbiAgICAgICAgICAgIGxldCBzdGFydFBvaW50ID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCByYWQxLCBVdGlscy5kZWdyZWVUb1JhZGlhbihheGlzLmFuZ2xlLCB0aGlzLiNyYWRpeC5nZXRBc2NlbmRhbnRTaGlmdCgpKSlcbiAgICAgICAgICAgIGxldCBlbmRQb2ludCA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgcmFkMiwgVXRpbHMuZGVncmVlVG9SYWRpYW4oYXhpcy5hbmdsZSwgdGhpcy4jcmFkaXguZ2V0QXNjZW5kYW50U2hpZnQoKSkpXG4gICAgICAgICAgICBsZXQgbGluZSA9IFNWR1V0aWxzLlNWR0xpbmUoc3RhcnRQb2ludC54LCBzdGFydFBvaW50LnksIGVuZFBvaW50LngsIGVuZFBvaW50LnkpO1xuICAgICAgICAgICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTUFJTl9BWElTX0NPTE9SKTtcbiAgICAgICAgICAgIGxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX01BSU5fU1RST0tFKTtcbiAgICAgICAgICAgIGF4aXNHcm91cC5hcHBlbmRDaGlsZChsaW5lKTtcblxuICAgICAgICAgICAgbGV0IHRleHRQb2ludCA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgcmFkMiArIEFYSVNfTEVOR1RILCBVdGlscy5kZWdyZWVUb1JhZGlhbihheGlzLmFuZ2xlLCB0aGlzLiNyYWRpeC5nZXRBc2NlbmRhbnRTaGlmdCgpKSlcbiAgICAgICAgICAgIGxldCBzeW1ib2w7XG4gICAgICAgICAgICBsZXQgU0hJRlRfWCA9IDA7XG4gICAgICAgICAgICBsZXQgU0hJRlRfWSA9IDA7XG4gICAgICAgICAgICBjb25zdCBTVEVQID0gMDsgLy8gRMOpY2FsYWdlIGRpc2FibGVkXG5cbiAgICAgICAgICAgIHN3aXRjaCAoYXhpcy5uYW1lKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBcIkFzXCI6XG4gICAgICAgICAgICAgICAgICAgIFNISUZUX1ggLT0gU1RFUFxuICAgICAgICAgICAgICAgICAgICBTSElGVF9ZIC09IFNURVBcbiAgICAgICAgICAgICAgICAgICAgU1ZHVXRpbHMuU1lNQk9MX0FTX0NPREUgPSB0aGlzLiNzZXR0aW5ncy5TWU1CT0xfQVNfQ09ERSA/PyBTVkdVdGlscy5TWU1CT0xfQVNfQ09ERTtcbiAgICAgICAgICAgICAgICAgICAgc3ltYm9sID0gU1ZHVXRpbHMuU1ZHU3ltYm9sKGF4aXMubmFtZSwgdGV4dFBvaW50LnggKyBTSElGVF9YLCB0ZXh0UG9pbnQueSArIFNISUZUX1kpXG4gICAgICAgICAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxuICAgICAgICAgICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcIkRzXCI6XG4gICAgICAgICAgICAgICAgICAgIFNISUZUX1ggKz0gU1RFUFxuICAgICAgICAgICAgICAgICAgICBTSElGVF9ZIC09IFNURVBcbiAgICAgICAgICAgICAgICAgICAgU1ZHVXRpbHMuU1lNQk9MX0RTX0NPREUgPSB0aGlzLiNzZXR0aW5ncy5TWU1CT0xfRFNfQ09ERSA/PyBTVkdVdGlscy5TWU1CT0xfRFNfQ09ERTtcbiAgICAgICAgICAgICAgICAgICAgc3ltYm9sID0gU1ZHVXRpbHMuU1ZHU3ltYm9sKGF4aXMubmFtZSwgdGV4dFBvaW50LnggKyBTSElGVF9YLCB0ZXh0UG9pbnQueSArIFNISUZUX1kpXG4gICAgICAgICAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxuICAgICAgICAgICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcIk1jXCI6XG4gICAgICAgICAgICAgICAgICAgIFNISUZUX1kgLT0gU1RFUFxuICAgICAgICAgICAgICAgICAgICBTVkdVdGlscy5TWU1CT0xfTUNfQ09ERSA9IHRoaXMuI3NldHRpbmdzLlNZTUJPTF9NQ19DT0RFID8/IFNWR1V0aWxzLlNZTUJPTF9NQ19DT0RFO1xuICAgICAgICAgICAgICAgICAgICBzeW1ib2wgPSBTVkdVdGlscy5TVkdTeW1ib2woYXhpcy5uYW1lLCB0ZXh0UG9pbnQueCArIFNISUZUX1gsIHRleHRQb2ludC55ICsgU0hJRlRfWSlcbiAgICAgICAgICAgICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXG4gICAgICAgICAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJkb21pbmFudC1iYXNlbGluZVwiLCBcIm1pZGRsZVwiKVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFwiSWNcIjpcbiAgICAgICAgICAgICAgICAgICAgU0hJRlRfWSArPSBTVEVQXG4gICAgICAgICAgICAgICAgICAgIFNWR1V0aWxzLlNZTUJPTF9JQ19DT0RFID0gdGhpcy4jc2V0dGluZ3MuU1lNQk9MX0lDX0NPREUgPz8gU1ZHVXRpbHMuU1lNQk9MX0lDX0NPREU7XG4gICAgICAgICAgICAgICAgICAgIHN5bWJvbCA9IFNWR1V0aWxzLlNWR1N5bWJvbChheGlzLm5hbWUsIHRleHRQb2ludC54ICsgU0hJRlRfWCwgdGV4dFBvaW50LnkgKyBTSElGVF9ZKVxuICAgICAgICAgICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcbiAgICAgICAgICAgICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImRvbWluYW50LWJhc2VsaW5lXCIsIFwibWlkZGxlXCIpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYXhpcy5uYW1lKVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIGF4aXMgbmFtZS5cIilcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJmb250LWZhbWlseVwiLCB0aGlzLiNzZXR0aW5ncy5BWElTX0ZPTlRfRkFNSUxZID8/IHRoaXMuI3NldHRpbmdzLkNIQVJUX0ZPTlRfRkFNSUxZKTtcbiAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJmb250LXNpemVcIiwgdGhpcy4jc2V0dGluZ3MuUkFESVhfQVhJU19GT05UX1NJWkUpO1xuICAgICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImZvbnQtd2VpZ2h0XCIsIHRoaXMuI3NldHRpbmdzLkFYSVNfRk9OVF9XRUlHSFQgPz8gNDAwKTtcbiAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX01BSU5fQVhJU19DT0xPUik7XG4gICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKCdwYWludC1vcmRlcicsICdzdHJva2UnKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuI3NldHRpbmdzLkNMQVNTX0FYSVMpIHtcbiAgICAgICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKCdjbGFzcycsIHRoaXMuI3NldHRpbmdzLkNMQVNTX0FYSVMgKyAnICcgKyB0aGlzLiNzZXR0aW5ncy5DTEFTU19BWElTICsgJy0tJyArIGF4aXMubmFtZS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuI3NldHRpbmdzLklOU0VSVF9FTEVNRU5UX1RJVExFKSB7XG4gICAgICAgICAgICAgICAgc3ltYm9sLmFwcGVuZENoaWxkKFNWR1V0aWxzLlNWR1RpdGxlKHRoaXMuI3NldHRpbmdzLkVMRU1FTlRfVElUTEVTLmF4aXNbYXhpcy5uYW1lXSkpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGF4aXNHcm91cC5hcHBlbmRDaGlsZChzeW1ib2wpO1xuICAgICAgICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChheGlzR3JvdXApXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLiNyb290LmFwcGVuZENoaWxkKHdyYXBwZXIpXG4gICAgfVxuXG4gICAgI2RyYXdCb3JkZXJzKCkge1xuICAgICAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuICAgICAgICB3cmFwcGVyLmNsYXNzTGlzdC5hZGQoJ2MtdHJhbnNpdC1ib3JkZXJzJylcblxuICAgICAgICBjb25zdCBvdXRlckNpcmNsZSA9IFNWR1V0aWxzLlNWR0NpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLmdldFJhZGl1cygpKVxuICAgICAgICBvdXRlckNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfQ0lSQ0xFX0NPTE9SKTtcbiAgICAgICAgb3V0ZXJDaXJjbGUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX01BSU5fU1RST0tFKTtcbiAgICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChvdXRlckNpcmNsZSlcblxuICAgICAgICB0aGlzLiNyb290LmFwcGVuZENoaWxkKHdyYXBwZXIpXG4gICAgfVxuXG4gICAgI2dldFBvaW50Q2lyY2xlUmFkaXVzKCkge1xuICAgICAgICByZXR1cm4gMjkgKiAodGhpcy5nZXRSYWRpdXMoKSAvIHRoaXMuI251bWJlck9mTGV2ZWxzKVxuICAgIH1cblxuICAgICNnZXRSdWxsZXJDaXJjbGVSYWRpdXMoKSB7XG4gICAgICAgIHJldHVybiAzMSAqICh0aGlzLmdldFJhZGl1cygpIC8gdGhpcy4jbnVtYmVyT2ZMZXZlbHMpXG4gICAgfVxuXG4gICAgI2dldENlbnRlckNpcmNsZVJhZGl1cygpIHtcbiAgICAgICAgcmV0dXJuIDI0ICogKHRoaXMuZ2V0UmFkaXVzKCkgLyB0aGlzLiNudW1iZXJPZkxldmVscylcbiAgICB9XG5cbiAgICBhbmltYXRlVG8oZGF0YSkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGdldFBvaW50KG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBnZXRQb2ludHMoKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxufVxuXG5leHBvcnQge1xuICAgIFRyYW5zaXRDaGFydCBhcyBkZWZhdWx0XG59XG4iLCJpbXBvcnQgU1ZHVXRpbHMgZnJvbSAnLi4vdXRpbHMvU1ZHVXRpbHMuanMnO1xuaW1wb3J0IFV0aWxzIGZyb20gJy4uL3V0aWxzL1V0aWxzLmpzJztcblxuLy8gbm9pbnNwZWN0aW9uIEpTUG90ZW50aWFsbHlJbnZhbGlkVXNhZ2VPZkNsYXNzVGhpcyxKU1VudXNlZEdsb2JhbFN5bWJvbHNcbi8qKlxuICogQGNsYXNzXG4gKiBAY2xhc3NkZXNjIFJlcHJlc2VudHMgYSBwbGFuZXQgb3IgcG9pbnQgb2YgaW50ZXJlc3QgaW4gdGhlIGNoYXJ0XG4gKiBAcHVibGljXG4gKi9cbmNsYXNzIFBvaW50IHtcblxuICAgICNuYW1lXG4gICAgI2FuZ2xlXG4gICAgI3NpZ25cbiAgICAjaXNSZXRyb2dyYWRlXG4gICAgI2N1c3BzXG4gICAgI3NldHRpbmdzXG5cbiAgICAvKipcbiAgICAgKiBAY29uc3RydWN0c1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwb2ludERhdGEgLSB7bmFtZTpTdHJpbmcsIGFuZ2xlOk51bWJlciwgaXNSZXRyb2dyYWRlOmZhbHNlfVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjdXNwcyAtIFt7YW5nbGU6TnVtYmVyfSwge2FuZ2xlOk51bWJlcn0sIHthbmdsZTpOdW1iZXJ9LCAuLi5dXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHNldHRpbmdzXG4gICAgICovXG4gICAgY29uc3RydWN0b3IocG9pbnREYXRhLCBjdXNwcywgc2V0dGluZ3MpIHtcbiAgICAgICAgdGhpcy4jbmFtZSA9IHBvaW50RGF0YS5uYW1lID8/IFwiVW5rbm93blwiXG4gICAgICAgIHRoaXMuI2FuZ2xlID0gcG9pbnREYXRhLmFuZ2xlID8/IDBcbiAgICAgICAgdGhpcy4jc2lnbiA9IHBvaW50RGF0YS5zaWduID8/IG51bGxcbiAgICAgICAgdGhpcy4jaXNSZXRyb2dyYWRlID0gcG9pbnREYXRhLmlzUmV0cm9ncmFkZSA/PyBmYWxzZVxuXG4gICAgICAgIGlmICghIEFycmF5LmlzQXJyYXkoY3VzcHMpIHx8IGN1c3BzLmxlbmd0aCAhPT0gMTIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkJhZCBwYXJhbSBjdXNwcy4gXCIpXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLiNjdXNwcyA9IGN1c3BzXG5cbiAgICAgICAgaWYgKCEgc2V0dGluZ3MpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQmFkIHBhcmFtIHNldHRpbmdzLicpXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLiNzZXR0aW5ncyA9IHNldHRpbmdzXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IG5hbWVcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgKi9cbiAgICBnZXROYW1lKCkge1xuICAgICAgICByZXR1cm4gdGhpcy4jbmFtZVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIElzIHJldHJvZ3JhZGVcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgaXNSZXRyb2dyYWRlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy4jaXNSZXRyb2dyYWRlXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IGFuZ2xlXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAgICovXG4gICAgZ2V0QW5nbGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiNhbmdsZVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBzaWduXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICovXG4gICAgZ2V0U2lnbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI3NpZ25cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgc3ltYm9sXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge051bWJlcn0geFBvc1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB5UG9zXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IFthbmdsZVNoaWZ0XVxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2lzUHJvcGVydGllc10gLSBhbmdsZUluU2lnbiwgZGlnbml0aWVzLCByZXRyb2dyYWRlXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtTVkdFbGVtZW50fVxuICAgICAqL1xuICAgIGdldFN5bWJvbCh4UG9zLCB5UG9zLCBhbmdsZVNoaWZ0ID0gMCwgaXNQcm9wZXJ0aWVzID0gdHJ1ZSkge1xuICAgICAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuXG4gICAgICAgIGNvbnN0IHN5bWJvbCA9IFNWR1V0aWxzLlNWR1N5bWJvbCh0aGlzLiNuYW1lLCB4UG9zLCB5UG9zKVxuICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKCdkYXRhLW5hbWUnLCB0aGlzLiNuYW1lKVxuXG4gICAgICAgIGlmICh0aGlzLiNzZXR0aW5ncy5DTEFTU19DRUxFU1RJQUwpIHtcbiAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgdGhpcy4jc2V0dGluZ3MuQ0xBU1NfQ0VMRVNUSUFMICsgJyAnICsgdGhpcy4jc2V0dGluZ3MuQ0xBU1NfQ0VMRVNUSUFMICsgJy0tJyArIHRoaXMuI25hbWUudG9Mb3dlckNhc2UoKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy4jc2V0dGluZ3MuUE9JTlRfU1RST0tFID8/IGZhbHNlKSB7XG4gICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKCdwYWludC1vcmRlcicsICdzdHJva2UnKTtcbiAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoJ3N0cm9rZScsIHRoaXMuI3NldHRpbmdzLlBPSU5UX1NUUk9LRV9DT0xPUik7XG4gICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKCdzdHJva2Utd2lkdGgnLCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9TVFJPS0VfV0lEVEgpO1xuICAgICAgICB9XG5cbiAgICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChzeW1ib2wpXG5cbiAgICAgICAgaWYgKGlzUHJvcGVydGllcyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHJldHVybiB3cmFwcGVyIC8vPT09PT09PlxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY2hhcnRDZW50ZXJYID0gdGhpcy4jc2V0dGluZ3MuQ0hBUlRfVklFV0JPWF9XSURUSCAvIDJcbiAgICAgICAgY29uc3QgY2hhcnRDZW50ZXJZID0gdGhpcy4jc2V0dGluZ3MuQ0hBUlRfVklFV0JPWF9IRUlHSFQgLyAyXG4gICAgICAgIGNvbnN0IGFuZ2xlRnJvbVN5bWJvbFRvQ2VudGVyID0gVXRpbHMucG9zaXRpb25Ub0FuZ2xlKHhQb3MsIHlQb3MsIGNoYXJ0Q2VudGVyWCwgY2hhcnRDZW50ZXJZKVxuXG4gICAgICAgIGlmICh0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX1NIT1dfQU5HTEUpIHtcbiAgICAgICAgICAgIGFuZ2xlSW5TaWduLmNhbGwodGhpcylcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX1NIT1dfU0lHTiAmJiB0aGlzLiNzaWduICE9PSBudWxsKSB7XG4gICAgICAgICAgICBzaG93U2lnbi5jYWxsKHRoaXMpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19TSE9XX1JFVFJPR1JBREUgJiYgdGhpcy4jaXNSZXRyb2dyYWRlKSB7XG4gICAgICAgICAgICByZXRyb2dyYWRlLmNhbGwodGhpcylcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX1NIT1dfRElHTklUWSAmJiB0aGlzLmdldERpZ25pdHkoKSkge1xuICAgICAgICAgICAgZGlnbml0aWVzLmNhbGwodGhpcylcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLiNzZXR0aW5ncy5JTlNFUlRfRUxFTUVOVF9USVRMRSkge1xuICAgICAgICAgICAgc3ltYm9sLmFwcGVuZENoaWxkKFNWR1V0aWxzLlNWR1RpdGxlKHRoaXMuI3NldHRpbmdzLkVMRU1FTlRfVElUTEVTLnBvaW50c1t0aGlzLiNuYW1lLnRvTG93ZXJDYXNlKCldKSlcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB3cmFwcGVyIC8vPT09PT09PlxuXG4gICAgICAgIC8qXG4gICAgICAgICAqICBBbmdsZSBpbiBzaWduXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBhbmdsZUluU2lnbigpIHtcbiAgICAgICAgICAgIGNvbnN0IGFuZ2xlSW5TaWduUG9zaXRpb24gPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHhQb3MsIHlQb3MsIHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfQU5HTEVfT0ZGU0VUICogdGhpcy4jc2V0dGluZ3MuUE9JTlRfQ09MTElTSU9OX1JBRElVUywgVXRpbHMuZGVncmVlVG9SYWRpYW4oLWFuZ2xlRnJvbVN5bWJvbFRvQ2VudGVyLCBhbmdsZVNoaWZ0KSlcblxuICAgICAgICAgICAgLy8gSXQgaXMgcG9zc2libGUgdG8gcm90YXRlIHRoZSB0ZXh0LCB3aGVuIHVuY29tbWVudCBhIGxpbmUgYmVsbG93LlxuICAgICAgICAgICAgLy90ZXh0V3JhcHBlci5zZXRBdHRyaWJ1dGUoXCJ0cmFuc2Zvcm1cIiwgYHJvdGF0ZSgke2FuZ2xlRnJvbVN5bWJvbFRvQ2VudGVyfSwke3RleHRQb3NpdGlvbi54fSwke3RleHRQb3NpdGlvbi55fSlgKVxuXG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICogQWxsb3dzIGNoYW5nZSB0aGUgYW5nbGUgc3RyaW5nLCBlLmcuIGFkZCB0aGUgZGVncmVlIHN5bWJvbCDCsCB3aXRoIHRoZSBeIGNoYXJhY3RlciBmcm9tIEFzdHJvbm9taWNvblxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBsZXQgYW5nbGUgPSB0aGlzLmdldEFuZ2xlSW5TaWduKCk7XG4gICAgICAgICAgICBsZXQgYW5nbGVQb3NpdGlvbiA9IFV0aWxzLmZpbGxUZW1wbGF0ZSh0aGlzLiNzZXR0aW5ncy5BTkdMRV9URU1QTEFURSwge2FuZ2xlOiBhbmdsZX0pO1xuXG4gICAgICAgICAgICBjb25zdCBhbmdsZUluU2lnblRleHQgPSBTVkdVdGlscy5TVkdUZXh0KGFuZ2xlSW5TaWduUG9zaXRpb24ueCwgYW5nbGVJblNpZ25Qb3NpdGlvbi55LCBhbmdsZVBvc2l0aW9uKVxuICAgICAgICAgICAgYW5nbGVJblNpZ25UZXh0LnNldEF0dHJpYnV0ZShcImZvbnQtZmFtaWx5XCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0ZPTlRfRkFNSUxZKTtcbiAgICAgICAgICAgIGFuZ2xlSW5TaWduVGV4dC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKSAvLyBzdGFydCwgbWlkZGxlLCBlbmRcbiAgICAgICAgICAgIGFuZ2xlSW5TaWduVGV4dC5zZXRBdHRyaWJ1dGUoXCJkb21pbmFudC1iYXNlbGluZVwiLCBcIm1pZGRsZVwiKVxuICAgICAgICAgICAgYW5nbGVJblNpZ25UZXh0LnNldEF0dHJpYnV0ZShcImZvbnQtc2l6ZVwiLCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX0FOR0xFX1NJWkUgfHwgdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19GT05UX1NJWkUpO1xuICAgICAgICAgICAgYW5nbGVJblNpZ25UZXh0LnNldEF0dHJpYnV0ZShcImZpbGxcIiwgdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19BTkdMRV9DT0xPUiB8fCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX0NPTE9SKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuI3NldHRpbmdzLkNMQVNTX1BPSU5UX0FOR0xFKSB7XG4gICAgICAgICAgICAgICAgYW5nbGVJblNpZ25UZXh0LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCB0aGlzLiNzZXR0aW5ncy5DTEFTU19QT0lOVF9BTkdMRSArICcgJyArIHRoaXMuI3NldHRpbmdzLkNMQVNTX1BPSU5UX0FOR0xFICsgJy0tJyArIGFuZ2xlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuI3NldHRpbmdzLlBPSU5UX1NUUk9LRSA/PyBmYWxzZSkge1xuICAgICAgICAgICAgICAgIGFuZ2xlSW5TaWduVGV4dC5zZXRBdHRyaWJ1dGUoJ3BhaW50LW9yZGVyJywgJ3N0cm9rZScpO1xuICAgICAgICAgICAgICAgIGFuZ2xlSW5TaWduVGV4dC5zZXRBdHRyaWJ1dGUoJ3N0cm9rZScsIHRoaXMuI3NldHRpbmdzLlBPSU5UX1NUUk9LRV9DT0xPUik7XG4gICAgICAgICAgICAgICAgYW5nbGVJblNpZ25UZXh0LnNldEF0dHJpYnV0ZSgnc3Ryb2tlLXdpZHRoJywgdGhpcy4jc2V0dGluZ3MuUE9JTlRfU1RST0tFX1dJRFRIKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChhbmdsZUluU2lnblRleHQpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAqICBTaG93IHNpZ25cbiAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gc2hvd1NpZ24oKSB7XG4gICAgICAgICAgICBjb25zdCBzaWduUG9zaXRpb24gPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHhQb3MsIHlQb3MsIHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfU0lHTl9PRkZTRVQgKiB0aGlzLiNzZXR0aW5ncy5QT0lOVF9DT0xMSVNJT05fUkFESVVTLCBVdGlscy5kZWdyZWVUb1JhZGlhbigtYW5nbGVGcm9tU3ltYm9sVG9DZW50ZXIsIGFuZ2xlU2hpZnQpKVxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEdldCB0aGUgc2lnbiBpbmRleFxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBsZXQgc3ltYm9sSW5kZXggPSB0aGlzLiNzZXR0aW5ncy5TSUdOX0xBQkVMUy5pbmRleE9mKHRoaXMuI3NpZ24pXG5cbiAgICAgICAgICAgIGNvbnN0IHNpZ25UZXh0ID0gU1ZHVXRpbHMuU1ZHU3ltYm9sKHRoaXMuI3NpZ24sIHNpZ25Qb3NpdGlvbi54LCBzaWduUG9zaXRpb24ueSlcbiAgICAgICAgICAgIHNpZ25UZXh0LnNldEF0dHJpYnV0ZShcImZvbnQtZmFtaWx5XCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0ZPTlRfRkFNSUxZKTtcbiAgICAgICAgICAgIHNpZ25UZXh0LnNldEF0dHJpYnV0ZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpIC8vIHN0YXJ0LCBtaWRkbGUsIGVuZFxuICAgICAgICAgICAgc2lnblRleHQuc2V0QXR0cmlidXRlKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcbiAgICAgICAgICAgIHNpZ25UZXh0LnNldEF0dHJpYnV0ZShcImZvbnQtc2l6ZVwiLCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX1NJR05fU0laRSB8fCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX0ZPTlRfU0laRSk7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogT3ZlcnJpZGUgc2lnbiBjb2xvcnNcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfU0lHTl9DT0xPUiAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHNpZ25UZXh0LnNldEF0dHJpYnV0ZShcImZpbGxcIiwgdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19TSUdOX0NPTE9SKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2lnblRleHQuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCB0aGlzLiNzZXR0aW5ncy5TSUdOX0NPTE9SU1tzeW1ib2xJbmRleF0gfHwgdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19DT0xPUik7XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgaWYgKHRoaXMuI3NldHRpbmdzLkNMQVNTX1BPSU5UX1NJR04pIHtcbiAgICAgICAgICAgICAgICBzaWduVGV4dC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgdGhpcy4jc2V0dGluZ3MuQ0xBU1NfUE9JTlRfU0lHTiArICcgJyArIHRoaXMuI3NldHRpbmdzLkNMQVNTX1BPSU5UX1NJR04gKyAnLS0nICsgdGhpcy4jc2lnbi50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLiNzZXR0aW5ncy5QT0lOVF9TVFJPS0UgPz8gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBzaWduVGV4dC5zZXRBdHRyaWJ1dGUoJ3BhaW50LW9yZGVyJywgJ3N0cm9rZScpO1xuICAgICAgICAgICAgICAgIHNpZ25UZXh0LnNldEF0dHJpYnV0ZSgnc3Ryb2tlJywgdGhpcy4jc2V0dGluZ3MuUE9JTlRfU1RST0tFX0NPTE9SKTtcbiAgICAgICAgICAgICAgICBzaWduVGV4dC5zZXRBdHRyaWJ1dGUoJ3N0cm9rZS13aWR0aCcsIHRoaXMuI3NldHRpbmdzLlBPSU5UX1NUUk9LRV9XSURUSCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoc2lnblRleHQpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiAgUmV0cm9ncmFkZVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gcmV0cm9ncmFkZSgpIHtcbiAgICAgICAgICAgIGNvbnN0IHJldHJvZ3JhZGVQb3NpdGlvbiA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUoeFBvcywgeVBvcywgdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19SRVRST0dSQURFX09GRlNFVCAqIHRoaXMuI3NldHRpbmdzLlBPSU5UX0NPTExJU0lPTl9SQURJVVMsIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKC1hbmdsZUZyb21TeW1ib2xUb0NlbnRlciwgYW5nbGVTaGlmdCkpXG5cbiAgICAgICAgICAgIGNvbnN0IHJldHJvZ3JhZGVUZXh0ID0gU1ZHVXRpbHMuU1ZHVGV4dChyZXRyb2dyYWRlUG9zaXRpb24ueCwgcmV0cm9ncmFkZVBvc2l0aW9uLnksIFNWR1V0aWxzLlNZTUJPTF9SRVRST0dSQURFX0NPREUpXG4gICAgICAgICAgICByZXRyb2dyYWRlVGV4dC5zZXRBdHRyaWJ1dGUoXCJmb250LWZhbWlseVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9GT05UX0ZBTUlMWSk7XG4gICAgICAgICAgICByZXRyb2dyYWRlVGV4dC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKSAvLyBzdGFydCwgbWlkZGxlLCBlbmRcbiAgICAgICAgICAgIHJldHJvZ3JhZGVUZXh0LnNldEF0dHJpYnV0ZShcImRvbWluYW50LWJhc2VsaW5lXCIsIFwibWlkZGxlXCIpXG4gICAgICAgICAgICByZXRyb2dyYWRlVGV4dC5zZXRBdHRyaWJ1dGUoXCJmb250LXNpemVcIiwgdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19SRVRST0dSQURFX1NJWkUgfHwgdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19GT05UX1NJWkUpO1xuICAgICAgICAgICAgcmV0cm9ncmFkZVRleHQuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX1JFVFJPR1JBREVfQ09MT1IgfHwgdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19DT0xPUik7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLiNzZXR0aW5ncy5DTEFTU19QT0lOVF9SRVRST0dSQURFKSB7XG4gICAgICAgICAgICAgICAgcmV0cm9ncmFkZVRleHQuc2V0QXR0cmlidXRlKCdjbGFzcycsIHRoaXMuI3NldHRpbmdzLkNMQVNTX1BPSU5UX1JFVFJPR1JBREUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy4jc2V0dGluZ3MuUE9JTlRfU1RST0tFID8/IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgcmV0cm9ncmFkZVRleHQuc2V0QXR0cmlidXRlKCdwYWludC1vcmRlcicsICdzdHJva2UnKTtcbiAgICAgICAgICAgICAgICByZXRyb2dyYWRlVGV4dC5zZXRBdHRyaWJ1dGUoJ3N0cm9rZScsIHRoaXMuI3NldHRpbmdzLlBPSU5UX1NUUk9LRV9DT0xPUik7XG4gICAgICAgICAgICAgICAgcmV0cm9ncmFkZVRleHQuc2V0QXR0cmlidXRlKCdzdHJva2Utd2lkdGgnLCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9TVFJPS0VfV0lEVEgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy4jc2V0dGluZ3MuSU5TRVJUX0VMRU1FTlRfVElUTEUpIHtcbiAgICAgICAgICAgICAgICByZXRyb2dyYWRlVGV4dC5hcHBlbmRDaGlsZChTVkdVdGlscy5TVkdUaXRsZSh0aGlzLiNzZXR0aW5ncy5FTEVNRU5UX1RJVExFUy5yZXRyb2dyYWRlKSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChyZXRyb2dyYWRlVGV4dClcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqICBEaWduaXRpZXNcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGRpZ25pdGllcygpIHtcbiAgICAgICAgICAgIGNvbnN0IGRpZ25pdGllc1Bvc2l0aW9uID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh4UG9zLCB5UG9zLCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX0RJR05JVFlfT0ZGU0VUICogdGhpcy4jc2V0dGluZ3MuUE9JTlRfQ09MTElTSU9OX1JBRElVUywgVXRpbHMuZGVncmVlVG9SYWRpYW4oLWFuZ2xlRnJvbVN5bWJvbFRvQ2VudGVyLCBhbmdsZVNoaWZ0KSlcbiAgICAgICAgICAgIGNvbnN0IGRpZ25pdGllc1RleHQgPSBTVkdVdGlscy5TVkdUZXh0KGRpZ25pdGllc1Bvc2l0aW9uLngsIGRpZ25pdGllc1Bvc2l0aW9uLnksIHRoaXMuZ2V0RGlnbml0eSgpKVxuICAgICAgICAgICAgZGlnbml0aWVzVGV4dC5zZXRBdHRyaWJ1dGUoXCJmb250LWZhbWlseVwiLCBcInNhbnMtc2VyaWZcIik7XG4gICAgICAgICAgICBkaWduaXRpZXNUZXh0LnNldEF0dHJpYnV0ZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpIC8vIHN0YXJ0LCBtaWRkbGUsIGVuZFxuICAgICAgICAgICAgZGlnbml0aWVzVGV4dC5zZXRBdHRyaWJ1dGUoXCJkb21pbmFudC1iYXNlbGluZVwiLCBcIm1pZGRsZVwiKVxuICAgICAgICAgICAgZGlnbml0aWVzVGV4dC5zZXRBdHRyaWJ1dGUoXCJmb250LXNpemVcIiwgdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19ESUdOSVRZX1NJWkUgfHwgdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19GT05UX1NJWkUpO1xuICAgICAgICAgICAgZGlnbml0aWVzVGV4dC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfRElHTklUWV9DT0xPUiB8fCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX0NPTE9SKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuI3NldHRpbmdzLkNMQVNTX1BPSU5UX0RJR05JVFkpIHtcbiAgICAgICAgICAgICAgICBkaWduaXRpZXNUZXh0LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCB0aGlzLiNzZXR0aW5ncy5DTEFTU19QT0lOVF9ESUdOSVRZICsgJyAnICsgdGhpcy4jc2V0dGluZ3MuQ0xBU1NfUE9JTlRfRElHTklUWSArICctLScgKyBkaWduaXRpZXNUZXh0LnRleHRDb250ZW50KTsgLy8gU3RyYWlnaHRmb3J3YXJkIHIvZC9lL2ZcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuI3NldHRpbmdzLlBPSU5UX1NUUk9LRSA/PyBmYWxzZSkge1xuICAgICAgICAgICAgICAgIGRpZ25pdGllc1RleHQuc2V0QXR0cmlidXRlKCdwYWludC1vcmRlcicsICdzdHJva2UnKTtcbiAgICAgICAgICAgICAgICBkaWduaXRpZXNUZXh0LnNldEF0dHJpYnV0ZSgnc3Ryb2tlJywgdGhpcy4jc2V0dGluZ3MuUE9JTlRfU1RST0tFX0NPTE9SKTtcbiAgICAgICAgICAgICAgICBkaWduaXRpZXNUZXh0LnNldEF0dHJpYnV0ZSgnc3Ryb2tlLXdpZHRoJywgdGhpcy4jc2V0dGluZ3MuUE9JTlRfU1RST0tFX1dJRFRIKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChkaWduaXRpZXNUZXh0KVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IGhvdXNlIG51bWJlclxuICAgICAqXG4gICAgICogQHJldHVybiB7TnVtYmVyfVxuICAgICAqL1xuICAgIGdldEhvdXNlTnVtYmVyKCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJOb3QgaW1wbGVtZW50ZWQgeWV0LlwiKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBzaWduIG51bWJlclxuICAgICAqIEFyaXNlID0gMSwgVGF1cnVzID0gMiwgLi4uUGlzY2VzID0gMTJcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge051bWJlcn1cbiAgICAgKi9cbiAgICBnZXRTaWduTnVtYmVyKCkge1xuICAgICAgICBsZXQgYW5nbGUgPSB0aGlzLiNhbmdsZSAlIFV0aWxzLkRFR18zNjBcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoKGFuZ2xlIC8gMzApICsgMSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgYW5nbGUgKEludGVnZXIpIGluIHRoZSBzaWduIGluIHdoaWNoIGl0IHN0YW5kcy5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge051bWJlcn1cbiAgICAgKi9cbiAgICBnZXRBbmdsZUluU2lnbigpIHtcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IodGhpcy4jYW5nbGUgJSAzMClcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgZGlnbml0eSBzeW1ib2wgKHIgLSBydWxlcnNoaXAsIGQgLSBkZXRyaW1lbnQsIGYgLSBmYWxsLCBlIC0gZXhhbHRhdGlvbilcbiAgICAgKlxuICAgICAqIFVzZSBNb2Rlcm4gZGlnbml0aWVzIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0Vzc2VudGlhbF9kaWduaXR5XG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IC0gZGlnbml0eSBzeW1ib2wgKHIsZCxmLGUpXG4gICAgICovXG4gICAgZ2V0RGlnbml0eSgpIHtcbiAgICAgICAgY29uc3QgQVJJRVMgPSAxXG4gICAgICAgIGNvbnN0IFRBVVJVUyA9IDJcbiAgICAgICAgY29uc3QgR0VNSU5JID0gM1xuICAgICAgICBjb25zdCBDQU5DRVIgPSA0XG4gICAgICAgIGNvbnN0IExFTyA9IDVcbiAgICAgICAgY29uc3QgVklSR08gPSA2XG4gICAgICAgIGNvbnN0IExJQlJBID0gN1xuICAgICAgICBjb25zdCBTQ09SUElPID0gOFxuICAgICAgICBjb25zdCBTQUdJVFRBUklVUyA9IDlcbiAgICAgICAgY29uc3QgQ0FQUklDT1JOID0gMTBcbiAgICAgICAgY29uc3QgQVFVQVJJVVMgPSAxMVxuICAgICAgICBjb25zdCBQSVNDRVMgPSAxMlxuXG4gICAgICAgIGNvbnN0IFJVTEVSU0hJUF9TWU1CT0wgPSB0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX0RJR05JVFlfU1lNQk9MU1swXTtcbiAgICAgICAgY29uc3QgREVUUklNRU5UX1NZTUJPTCA9IHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfRElHTklUWV9TWU1CT0xTWzFdO1xuICAgICAgICBjb25zdCBFWEFMVEFUSU9OX1NZTUJPTCA9IHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfRElHTklUWV9TWU1CT0xTWzJdO1xuICAgICAgICBjb25zdCBGQUxMX1NZTUJPTCA9IHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfRElHTklUWV9TWU1CT0xTWzNdO1xuXG4gICAgICAgIHN3aXRjaCAodGhpcy4jbmFtZSkge1xuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfU1VOOlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PT0gTEVPKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBSVUxFUlNISVBfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PT0gQVFVQVJJVVMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIERFVFJJTUVOVF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBWSVJHTykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gRkFMTF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBBUklFUykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gRVhBTFRBVElPTl9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiXCJcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfTU9PTjpcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IENBTkNFUikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUlVMRVJTSElQX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IENBUFJJQ09STikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gREVUUklNRU5UX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IFNDT1JQSU8pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEZBTExfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PT0gVEFVUlVTKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBFWEFMVEFUSU9OX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiXCJcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfTUVSQ1VSWTpcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IEdFTUlOSSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUlVMRVJTSElQX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IFNBR0lUVEFSSVVTKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBERVRSSU1FTlRfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PT0gUElTQ0VTKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBGQUxMX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IFZJUkdPKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBFWEFMVEFUSU9OX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiXCJcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfVkVOVVM6XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBUQVVSVVMgfHwgdGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IExJQlJBKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBSVUxFUlNISVBfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PT0gQVJJRVMgfHwgdGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IFNDT1JQSU8pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIERFVFJJTUVOVF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBWSVJHTykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gRkFMTF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBQSVNDRVMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEVYQUxUQVRJT05fU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gXCJcIlxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9NQVJTOlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PT0gQVJJRVMgfHwgdGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IFNDT1JQSU8pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFJVTEVSU0hJUF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBUQVVSVVMgfHwgdGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IExJQlJBKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBERVRSSU1FTlRfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PT0gQ0FOQ0VSKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBGQUxMX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IENBUFJJQ09STikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gRVhBTFRBVElPTl9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBcIlwiXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0pVUElURVI6XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBTQUdJVFRBUklVUyB8fCB0aGlzLmdldFNpZ25OdW1iZXIoKSA9PT0gUElTQ0VTKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBSVUxFUlNISVBfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PT0gR0VNSU5JIHx8IHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBWSVJHTykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gREVUUklNRU5UX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IENBUFJJQ09STikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gRkFMTF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBDQU5DRVIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEVYQUxUQVRJT05fU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gXCJcIlxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9TQVRVUk46XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBDQVBSSUNPUk4gfHwgdGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IEFRVUFSSVVTKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBSVUxFUlNISVBfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PT0gQ0FOQ0VSIHx8IHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBMRU8pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIERFVFJJTUVOVF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBBUklFUykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gRkFMTF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBMSUJSQSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gRVhBTFRBVElPTl9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBcIlwiXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1VSQU5VUzpcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IEFRVUFSSVVTKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBSVUxFUlNISVBfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PT0gTEVPKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBERVRSSU1FTlRfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PT0gVEFVUlVTKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBGQUxMX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IFNDT1JQSU8pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEVYQUxUQVRJT05fU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gXCJcIlxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9ORVBUVU5FOlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PT0gUElTQ0VTKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBSVUxFUlNISVBfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PT0gVklSR08pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIERFVFJJTUVOVF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBHRU1JTkkgfHwgdGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IEFRVUFSSVVTKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBGQUxMX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IFNBR0lUVEFSSVVTIHx8IHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBMRU8pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEVYQUxUQVRJT05fU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gXCJcIlxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9QTFVUTzpcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IFNDT1JQSU8pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFJVTEVSU0hJUF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBUQVVSVVMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIERFVFJJTUVOVF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBMSUJSQSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gRkFMTF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBBUklFUykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gRVhBTFRBVElPTl9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBcIlwiXG5cbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiXCJcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IHtcbiAgICBQb2ludCBhcyBkZWZhdWx0XG59XG4iLCJpbXBvcnQgKiBhcyBVbml2ZXJzZSBmcm9tIFwiLi9jb25zdGFudHMvVW5pdmVyc2UuanNcIlxuaW1wb3J0ICogYXMgUmFkaXggZnJvbSBcIi4vY29uc3RhbnRzL1JhZGl4LmpzXCJcbmltcG9ydCAqIGFzIFRyYW5zaXQgZnJvbSBcIi4vY29uc3RhbnRzL1RyYW5zaXQuanNcIlxuaW1wb3J0ICogYXMgUG9pbnQgZnJvbSBcIi4vY29uc3RhbnRzL1BvaW50LmpzXCJcbmltcG9ydCAqIGFzIENvbG9ycyBmcm9tIFwiLi9jb25zdGFudHMvQ29sb3JzLmpzXCJcbmltcG9ydCAqIGFzIEFzcGVjdHMgZnJvbSBcIi4vY29uc3RhbnRzL0FzcGVjdHMuanNcIlxuXG5jb25zdCBTRVRUSU5HUyA9IE9iamVjdC5hc3NpZ24oe30sIFVuaXZlcnNlLCBSYWRpeCwgVHJhbnNpdCwgUG9pbnQsIENvbG9ycywgQXNwZWN0cyk7XG5cbmV4cG9ydCB7XG4gIFNFVFRJTkdTIGFzXG4gIGRlZmF1bHRcbn1cbiIsIi8vIG5vaW5zcGVjdGlvbiBKU1VudXNlZEdsb2JhbFN5bWJvbHNcblxuLypcbiogQXNwZWN0cyB3cmFwcGVyIGVsZW1lbnQgSURcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0IGFzcGVjdHNcbiovXG5leHBvcnQgY29uc3QgQVNQRUNUU19JRCA9IFwiYXNwZWN0c1wiXG5cbi8qXG4qIERyYXcgYXNwZWN0cyBpbnRvIGNoYXJ0IGR1cmluZyByZW5kZXJcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtCb29sZWFufVxuKiBAZGVmYXVsdCB0cnVlXG4qL1xuZXhwb3J0IGNvbnN0IERSQVdfQVNQRUNUUyA9IHRydWVcblxuLypcbiogRm9udCBzaXplIC0gYXNwZWN0c1xuKiBAY29uc3RhbnRcbiogQHR5cGUge051bWJlcn1cbiogQGRlZmF1bHQgMjdcbiovXG5leHBvcnQgY29uc3QgQVNQRUNUU19GT05UX1NJWkUgPSAxOFxuXG4vKipcbiAqIERlZmF1bHQgYXNwZWN0c1xuICpcbiAqIEZyb20gaHR0cHM6Ly93d3cucmVkZGl0LmNvbS9yL2FzdHJvbG9neS9jb21tZW50cy94YmR5ODMvd2hhdHNfYV9nb29kX29yYl9yYW5nZV9mb3JfYXNwZWN0c19jb25qdW5jdGlvbi9cbiAqIE1hbnkgb3RoZXIgc2V0dGluZ3MsIHVzdWFsbHkgZGVwZW5kcyBvbiB0aGUgcGxhbmV0LCBTdW4gLyBNb29uIHVzZSB3aWRlciByYW5nZVxuICpcbiAqIG9yYiA6IHNldHMgdGhlIHRvbGVyYW5jZSBmb3IgdGhlIGFuZ2xlXG4gKlxuICogTWFqb3IgYXNwZWN0czpcbiAqXG4gKiAgICAge25hbWU6XCJDb25qdW5jdGlvblwiLCBhbmdsZTowLCBvcmI6NCwgaXNNYWpvcjogdHJ1ZX0sXG4gKiAgICAge25hbWU6XCJPcHBvc2l0aW9uXCIsIGFuZ2xlOjE4MCwgb3JiOjQsIGlzTWFqb3I6IHRydWV9LFxuICogICAgIHtuYW1lOlwiVHJpbmVcIiwgYW5nbGU6MTIwLCBvcmI6MiwgaXNNYWpvcjogdHJ1ZX0sXG4gKiAgICAge25hbWU6XCJTcXVhcmVcIiwgYW5nbGU6OTAsIG9yYjoyLCBpc01ham9yOiB0cnVlfSxcbiAqICAgICB7bmFtZTpcIlNleHRpbGVcIiwgYW5nbGU6NjAsIG9yYjoyLCBpc01ham9yOiB0cnVlfSxcbiAqXG4gKiBNaW5vciBhc3BlY3RzOlxuICpcbiAqICAgICB7bmFtZTpcIlF1aW5jdW54XCIsIGFuZ2xlOjE1MCwgb3JiOjF9LFxuICogICAgIHtuYW1lOlwiU2VtaXNleHRpbGVcIiwgYW5nbGU6MzAsIG9yYjoxfSxcbiAqICAgICB7bmFtZTpcIlF1aW50aWxlXCIsIGFuZ2xlOjcyLCBvcmI6MX0sXG4gKiAgICAge25hbWU6XCJUcmlvY3RpbGVcIiwgYW5nbGU6MTM1LCBvcmI6MX0sXG4gKiAgICAge25hbWU6XCJTZW1pc3F1YXJlXCIsIGFuZ2xlOjQ1LCBvcmI6MX0sXG4gKlxuICogQGNvbnN0YW50XG4gKiBAdHlwZSB7QXJyYXl9XG4gKi9cbmV4cG9ydCBjb25zdCBERUZBVUxUX0FTUEVDVFMgPSBbXG4gICAge25hbWU6XCJDb25qdW5jdGlvblwiLCBhbmdsZTowLCBvcmI6NCwgaXNNYWpvcjogdHJ1ZX0sXG4gICAge25hbWU6XCJPcHBvc2l0aW9uXCIsIGFuZ2xlOjE4MCwgb3JiOjQsIGlzTWFqb3I6IHRydWV9LFxuICAgIHtuYW1lOlwiVHJpbmVcIiwgYW5nbGU6MTIwLCBvcmI6MiwgaXNNYWpvcjogdHJ1ZX0sXG4gICAge25hbWU6XCJTcXVhcmVcIiwgYW5nbGU6OTAsIG9yYjoyLCBpc01ham9yOiB0cnVlfSxcbiAgICB7bmFtZTpcIlNleHRpbGVcIiwgYW5nbGU6NjAsIG9yYjoyLCBpc01ham9yOiB0cnVlfSxcblxuXVxuIiwiLy8gbm9pbnNwZWN0aW9uIEpTVW51c2VkR2xvYmFsU3ltYm9sc1xuXG4vKipcbiAqIENoYXJ0IGJhY2tncm91bmQgY29sb3JcbiAqIEBjb25zdGFudFxuICogQHR5cGUge1N0cmluZ31cbiAqIEBkZWZhdWx0ICNmZmZcbiAqL1xuZXhwb3J0IGNvbnN0IENIQVJUX0JBQ0tHUk9VTkRfQ09MT1IgPSBcIm5vbmVcIjtcblxuLyoqXG4gKiBQbGFuZXRzIGJhY2tncm91bmQgY29sb3JcbiAqIEBjb25zdGFudFxuICogQHR5cGUge1N0cmluZ31cbiAqIEBkZWZhdWx0ICNmZmZcbiAqL1xuZXhwb3J0IGNvbnN0IFBMQU5FVFNfQkFDS0dST1VORF9DT0xPUiA9IFwiI2ZmZlwiO1xuXG4vKipcbiAqIEFzcGVjdHMgYmFja2dyb3VuZCBjb2xvclxuICogQGNvbnN0YW50XG4gKiBAdHlwZSB7U3RyaW5nfVxuICogQGRlZmF1bHQgI2ZmZlxuICovXG5leHBvcnQgY29uc3QgQVNQRUNUU19CQUNLR1JPVU5EX0NPTE9SID0gXCIjZWVlXCI7XG5cbi8qXG4qIERlZmF1bHQgY29sb3Igb2YgY2lyY2xlcyBpbiBjaGFydHNcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICMzMzNcbiovXG5leHBvcnQgY29uc3QgQ0hBUlRfQ0lSQ0xFX0NPTE9SID0gXCIjMzMzXCI7XG5cbi8qXG4qIERlZmF1bHQgY29sb3Igb2YgbGluZXMgaW4gY2hhcnRzXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjMzMzXG4qL1xuZXhwb3J0IGNvbnN0IENIQVJUX0xJTkVfQ09MT1IgPSBcIiM2NjZcIjtcblxuLypcbiogRGVmYXVsdCBjb2xvciBvZiB0ZXh0IGluIGNoYXJ0c1xuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzMzM1xuKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9URVhUX0NPTE9SID0gXCIjYmJiXCI7XG5cbi8qXG4qIERlZmF1bHQgY29sb3Igb2YgY3VzcHMgbnVtYmVyXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjMzMzXG4qL1xuZXhwb3J0IGNvbnN0IENIQVJUX0hPVVNFX05VTUJFUl9DT0xPUiA9IFwiIzMzM1wiO1xuXG4vKlxuKiBEZWZhdWx0IGNvbG9yIG9mIG1xaW4gYXhpcyAtIEFzLCBEcywgTWMsIEljXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjMDAwXG4qL1xuZXhwb3J0IGNvbnN0IENIQVJUX01BSU5fQVhJU19DT0xPUiA9IFwiIzAwMFwiO1xuXG4vKlxuKiBEZWZhdWx0IGNvbG9yIG9mIHNpZ25zIGluIGNoYXJ0cyAoYXJpc2Ugc3ltYm9sLCB0YXVydXMgc3ltYm9sLCAuLi4pXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjMDAwXG4qL1xuZXhwb3J0IGNvbnN0IENIQVJUX1NJR05TX0NPTE9SID0gXCIjMzMzXCI7XG5cbi8qXG4qIERlZmF1bHQgY29sb3Igb2YgcGxhbmV0cyBvbiB0aGUgY2hhcnQgKFN1biBzeW1ib2wsIE1vb24gc3ltYm9sLCAuLi4pXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjMDAwXG4qL1xuZXhwb3J0IGNvbnN0IENIQVJUX1BPSU5UU19DT0xPUiA9IFwiIzAwMFwiO1xuXG4vKlxuKiBEZWZhdWx0IGNvbG9yIGZvciBwb2ludCBwcm9wZXJ0aWVzIC0gYW5nbGUgaW4gc2lnbiwgZGlnbml0aWVzLCByZXRyb2dyYWRlXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjMzMzXG4qL1xuZXhwb3J0IGNvbnN0IFBPSU5UX1BST1BFUlRJRVNfQ09MT1IgPSBcIiMzMzNcIlxuXG4vKlxuKiBBcmllcyBjb2xvclxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgI0ZGNDUwMFxuKi9cbmV4cG9ydCBjb25zdCBDT0xPUl9BUklFUyA9IFwiI0ZGNDUwMFwiO1xuXG4vKlxuKiBUYXVydXMgY29sb3JcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICM4QjQ1MTNcbiovXG5leHBvcnQgY29uc3QgQ09MT1JfVEFVUlVTID0gXCIjOEI0NTEzXCI7XG5cbi8qXG4qIEdlbWlueSBjb2xvclxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzg3Q0VFQlxuKi9cbmV4cG9ydCBjb25zdCBDT0xPUl9HRU1JTkkgPSBcIiM4N0NFRUJcIjtcblxuLypcbiogQ2FuY2VyIGNvbG9yXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjMjdBRTYwXG4qL1xuZXhwb3J0IGNvbnN0IENPTE9SX0NBTkNFUiA9IFwiIzI3QUU2MFwiO1xuXG4vKlxuKiBMZW8gY29sb3JcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICNGRjQ1MDBcbiovXG5leHBvcnQgY29uc3QgQ09MT1JfTEVPID0gXCIjRkY0NTAwXCI7XG5cbi8qXG4qIFZpcmdvIGNvbG9yXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjOEI0NTEzXG4qL1xuZXhwb3J0IGNvbnN0IENPTE9SX1ZJUkdPID0gXCIjOEI0NTEzXCI7XG5cbi8qXG4qIExpYnJhIGNvbG9yXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjODdDRUVCXG4qL1xuZXhwb3J0IGNvbnN0IENPTE9SX0xJQlJBID0gXCIjODdDRUVCXCI7XG5cbi8qXG4qIFNjb3JwaW8gY29sb3JcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICMyN0FFNjBcbiovXG5leHBvcnQgY29uc3QgQ09MT1JfU0NPUlBJTyA9IFwiIzI3QUU2MFwiO1xuXG4vKlxuKiBTYWdpdHRhcml1cyBjb2xvclxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgI0ZGNDUwMFxuKi9cbmV4cG9ydCBjb25zdCBDT0xPUl9TQUdJVFRBUklVUyA9IFwiI0ZGNDUwMFwiO1xuXG4vKlxuKiBDYXByaWNvcm4gY29sb3JcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICM4QjQ1MTNcbiovXG5leHBvcnQgY29uc3QgQ09MT1JfQ0FQUklDT1JOID0gXCIjOEI0NTEzXCI7XG5cbi8qXG4qIEFxdWFyaXVzIGNvbG9yXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjODdDRUVCXG4qL1xuZXhwb3J0IGNvbnN0IENPTE9SX0FRVUFSSVVTID0gXCIjODdDRUVCXCI7XG5cbi8qXG4qIFBpc2NlcyBjb2xvclxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzI3QUU2MFxuKi9cbmV4cG9ydCBjb25zdCBDT0xPUl9QSVNDRVMgPSBcIiMyN0FFNjBcIjtcblxuLypcbiogQ29sb3Igb2YgY2lyY2xlcyBpbiBjaGFydHNcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICMzMzNcbiovXG5leHBvcnQgY29uc3QgQ0lSQ0xFX0NPTE9SID0gXCIjMzMzXCI7XG5cbi8qXG4qIENvbG9yIG9mIGFzcGVjdHNcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtPYmplY3R9XG4qL1xuZXhwb3J0IGNvbnN0IEFTUEVDVF9DT0xPUlMgPSB7XG4gICAgQ29uanVuY3Rpb246IFwiIzMzM1wiLFxuICAgIE9wcG9zaXRpb246IFwiIzFCNEY3MlwiLFxuICAgIFNxdWFyZTogXCIjNjQxRTE2XCIsXG4gICAgVHJpbmU6IFwiIzBCNTM0NVwiLFxuICAgIFNleHRpbGU6IFwiIzMzM1wiLFxuICAgIFF1aW5jdW54OiBcIiMzMzNcIixcbiAgICBTZW1pc2V4dGlsZTogXCIjMzMzXCIsXG4gICAgUXVpbnRpbGU6IFwiIzMzM1wiLFxuICAgIFRyaW9jdGlsZTogXCIjMzMzXCJcbn1cblxuLyoqXG4gKiBPdmVycmlkZSBpbmRpdmlkdWFsIHBsYW5ldCBzeW1ib2wgY29sb3JzIGJ5IHBsYW5ldCBuYW1lXG4gKi9cbmV4cG9ydCBjb25zdCBQTEFORVRfQ09MT1JTID0ge1xuICAgIC8vU3VuOiBcIiMwMDBcIixcbiAgICAvL01vb246IFwiI2FhYVwiLFxufVxuXG4vKipcbiAqIG92ZXJyaWRlIGluZGl2aWR1YWwgc2lnbiBzeW1ib2wgY29sb3JzIGJ5IHpvZGlhYyBpbmRleFxuICovXG5leHBvcnQgY29uc3QgU0lHTl9DT0xPUlMgPSB7XG4gICAgLy8wOiBcIiMzMzNcIlxufVxuXG4vKipcbiAqIEFsbCBzaWducyBsYWJlbHMgaW4gdGhlIHJpZ2h0IG9yZGVyXG4gKiBAdHlwZSB7c3RyaW5nW119XG4gKi9cbmV4cG9ydCBjb25zdCBTSUdOX0xBQkVMUyA9IFtcbiAgICBcIkFyaWVzXCIsXG4gICAgXCJUYXVydXNcIixcbiAgICBcIkdlbWluaVwiLFxuICAgIFwiQ2FuY2VyXCIsXG4gICAgXCJMZW9cIixcbiAgICBcIlZpcmdvXCIsXG4gICAgXCJMaWJyYVwiLFxuICAgIFwiU2NvcnBpb1wiLFxuICAgIFwiU2FnaXR0YXJpdXNcIixcbiAgICBcIkNhcHJpY29yblwiLFxuICAgIFwiQXF1YXJpdXNcIixcbiAgICBcIlBpc2Nlc1wiLFxuXVxuXG4vKipcbiAqIE92ZXJyaWRlIGluZGl2aWR1YWwgcGxhbmV0IHN5bWJvbCBjb2xvcnMgYnkgcGxhbmV0IG5hbWUgb24gdHJhbnNpdCBjaGFydHNcbiAqL1xuZXhwb3J0IGNvbnN0IFRSQU5TSVRfUExBTkVUX0NPTE9SUyA9IHtcbiAgICAvL1N1bjogXCIjMDAwXCIsXG4gICAgLy9Nb29uOiBcIiNhYWFcIixcbn1cbiIsIi8vIG5vaW5zcGVjdGlvbiBKU1VudXNlZEdsb2JhbFN5bWJvbHNcblxuLypcbiogUG9pbnQgcHJvcGVydGllcyAtIGFuZ2xlIGluIHNpZ24sIGRpZ25pdGllcywgcmV0cm9ncmFkZVxuKiBAY29uc3RhbnRcbiogQHR5cGUge0Jvb2xlYW59XG4qIEBkZWZhdWx0IHRydWVcbiovXG5leHBvcnQgY29uc3QgUE9JTlRfUFJPUEVSVElFU19TSE9XID0gdHJ1ZVxuXG4vKlxuKiBQb2ludCBhbmdsZSBpbiBzaWduXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7Qm9vbGVhbn1cbiogQGRlZmF1bHQgdHJ1ZVxuKi9cbmV4cG9ydCBjb25zdCBQT0lOVF9QUk9QRVJUSUVTX1NIT1dfQU5HTEUgPSB0cnVlXG5cbi8qKlxuICogUG9pbnQgc2lnblxuICogQHR5cGUge2Jvb2xlYW59XG4gKi9cbmV4cG9ydCBjb25zdCBQT0lOVF9QUk9QRVJUSUVTX1NIT1dfU0lHTiA9IGZhbHNlXG5cbi8qXG4qIFBvaW50IGRpZ25pdHkgc3ltYm9sXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7Qm9vbGVhbn1cbiogQGRlZmF1bHQgdHJ1ZVxuKi9cbmV4cG9ydCBjb25zdCBQT0lOVF9QUk9QRVJUSUVTX1NIT1dfRElHTklUWSA9IHRydWVcblxuLypcbiogUG9pbnQgcmV0cm9ncmFkZSBzeW1ib2xcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtCb29sZWFufVxuKiBAZGVmYXVsdCB0cnVlXG4qL1xuZXhwb3J0IGNvbnN0IFBPSU5UX1BST1BFUlRJRVNfU0hPV19SRVRST0dSQURFID0gdHJ1ZVxuXG4vKlxuKiBQb2ludCBkaWduaXR5IHN5bWJvbHMgLSBbZG9taWNpbGUsIGRldHJpbWVudCwgZXhhbHRhdGlvbiwgZmFsbF1cbiogQGNvbnN0YW50XG4qIEB0eXBlIHtCb29sZWFufVxuKiBAZGVmYXVsdCB0cnVlXG4qL1xuZXhwb3J0IGNvbnN0IFBPSU5UX1BST1BFUlRJRVNfRElHTklUWV9TWU1CT0xTID0gW1wiclwiLCBcImRcIiwgXCJlXCIsIFwiZlwiXTtcblxuLypcbiogVGV4dCBzaXplIG9mIFBvaW50IGRlc2NyaXB0aW9uIC0gYW5nbGUgaW4gc2lnbiwgZGlnbml0aWVzLCByZXRyb2dyYWRlXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7TnVtYmVyfVxuKiBAZGVmYXVsdCA2XG4qL1xuZXhwb3J0IGNvbnN0IFBPSU5UX1BST1BFUlRJRVNfRk9OVF9TSVpFID0gMTZcblxuLypcbiogVGV4dCBzaXplIG9mIGFuZ2xlIG51bWJlclxuKiBAY29uc3RhbnRcbiogQHR5cGUge051bWJlcn1cbiogQGRlZmF1bHQgNlxuKi9cbmV4cG9ydCBjb25zdCBQT0lOVF9QUk9QRVJUSUVTX0FOR0xFX1NJWkUgPSAyNVxuXG4vKlxuKiBUZXh0IHNpemUgb2YgcmV0cm9ncmFkZSBzeW1ib2xcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtOdW1iZXJ9XG4qIEBkZWZhdWx0IDZcbiovXG5leHBvcnQgY29uc3QgUE9JTlRfUFJPUEVSVElFU19SRVRST0dSQURFX1NJWkUgPSAyNVxuXG4vKlxuKiBUZXh0IHNpemUgb2YgZGlnbml0eSBzeW1ib2xcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtOdW1iZXJ9XG4qIEBkZWZhdWx0IDZcbiovXG5leHBvcnQgY29uc3QgUE9JTlRfUFJPUEVSVElFU19ESUdOSVRZX1NJWkUgPSAxMlxuXG4vKlxuKiBBbmdsZSBvZmZzZXQgbXVsdGlwbGllclxuKiBAY29uc3RhbnRcbiogQHR5cGUge051bWJlcn1cbiogQGRlZmF1bHQgNlxuKi9cbmV4cG9ydCBjb25zdCBQT0lOVF9QUk9QRVJUSUVTX0FOR0xFX09GRlNFVCA9IDJcblxuLyoqXG4gKiBPZmZzZXQgZnJvbSB0aGUgcGxhbmV0XG4gKiBAdHlwZSB7bnVtYmVyfVxuICovXG5leHBvcnQgY29uc3QgUE9JTlRfUFJPUEVSVElFU19TSUdOX09GRlNFVCA9IDMuNVxuXG4vKlxuKiBSZXRyb2dyYWRlIHN5bWJvbCBvZmZzZXQgbXVsdGlwbGllclxuKiBAY29uc3RhbnRcbiogQHR5cGUge051bWJlcn1cbiogQGRlZmF1bHQgNlxuKi9cbmV4cG9ydCBjb25zdCBQT0lOVF9QUk9QRVJUSUVTX1JFVFJPR1JBREVfT0ZGU0VUID0gNVxuXG4vKlxuKiBEaWduaXR5IHN5bWJvbCBvZmZzZXQgbXVsdGlwbGllclxuKiBAY29uc3RhbnRcbiogQHR5cGUge051bWJlcn1cbiogQGRlZmF1bHQgNlxuKi9cbmV4cG9ydCBjb25zdCBQT0lOVF9QUk9QRVJUSUVTX0RJR05JVFlfT0ZGU0VUID0gNlxuXG4vKipcbiAqIEEgcG9pbnQgY29sbGlzaW9uIHJhZGl1c1xuICogQGNvbnN0YW50XG4gKiBAdHlwZSB7TnVtYmVyfVxuICogQGRlZmF1bHQgMlxuICovXG5leHBvcnQgY29uc3QgUE9JTlRfQ09MTElTSU9OX1JBRElVUyA9IDEyXG5cbi8qKlxuICogVHdlYWsgdGhlIGFuZ2xlIHN0cmluZywgZS5nLiBhZGQgdGhlIGRlZ3JlZSBzeW1ib2w6IFwiJHthbmdsZX3CsFwiXG4gKiBAdHlwZSB7c3RyaW5nfVxuICovXG5leHBvcnQgY29uc3QgQU5HTEVfVEVNUExBVEUgPSBcIiR7YW5nbGV9XCJcblxuXG4vKipcbiAqIENsYXNzZXMgZm9yIHBvaW50c1xuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cbi8qKlxuICogQ2xhc3MgZm9yIENlbGVzdGlhbCBCb2RpZXMgKFBsYW5ldCAvIEFzdGVyaW9kKVxuICogYW5kIENlbGVzdGlhbCBQb2ludHMgKG5vcnRobm9kZSwgc291dGhub2RlLCBsaWxpdGgpXG4gKiBAdHlwZSB7c3RyaW5nfVxuICovXG5leHBvcnQgY29uc3QgQ0xBU1NfQ0VMRVNUSUFMID0gJyc7XG5leHBvcnQgY29uc3QgQ0xBU1NfUE9JTlRfQU5HTEUgPSAnJztcbmV4cG9ydCBjb25zdCBDTEFTU19QT0lOVF9TSUdOID0gJyc7XG5leHBvcnQgY29uc3QgQ0xBU1NfUE9JTlRfUkVUUk9HUkFERSA9ICcnO1xuZXhwb3J0IGNvbnN0IENMQVNTX1BPSU5UX0RJR05JVFkgPSAnJztcblxuLyoqXG4gKiBBZGQgYSBzdHJva2UgYXJvdW5kIGFsbCBwb2ludHNcbiAqL1xuZXhwb3J0IGNvbnN0IFBPSU5UX1NUUk9LRSA9IGZhbHNlO1xuZXhwb3J0IGNvbnN0IFBPSU5UX1NUUk9LRV9DT0xPUiA9ICcjZmZmJztcbmV4cG9ydCBjb25zdCBQT0lOVF9TVFJPS0VfV0lEVEggPSAyO1xuZXhwb3J0IGNvbnN0IFBPSU5UX1NUUk9LRV9MSU5FQ0FQID0gJ2J1dHQnO1xuXG5leHBvcnQgY29uc3QgUE9JTlRfUFJPUEVSVElFU19TSUdOX0NPTE9SID0gbnVsbDsiLCIvLyBub2luc3BlY3Rpb24gSlNVbnVzZWRHbG9iYWxTeW1ib2xzXG5cbi8qXG4qIFJhZGl4IGNoYXJ0IGVsZW1lbnQgSURcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0IHJhZGl4XG4qL1xuZXhwb3J0IGNvbnN0IFJBRElYX0lEID0gXCJyYWRpeFwiXG5cbi8qXG4qIEZvbnQgc2l6ZSAtIHBvaW50cyAocGxhbmV0cylcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtOdW1iZXJ9XG4qIEBkZWZhdWx0IDI3XG4qL1xuZXhwb3J0IGNvbnN0IFJBRElYX1BPSU5UU19GT05UX1NJWkUgPSAyN1xuXG4vKlxuKiBGb250IHNpemUgLSBob3VzZSBjdXNwIG51bWJlclxuKiBAY29uc3RhbnRcbiogQHR5cGUge051bWJlcn1cbiogQGRlZmF1bHQgMjdcbiovXG5leHBvcnQgY29uc3QgUkFESVhfSE9VU0VfRk9OVF9TSVpFID0gMjBcblxuLypcbiogRm9udCBzaXplIC0gc2lnbnNcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtOdW1iZXJ9XG4qIEBkZWZhdWx0IDI3XG4qL1xuZXhwb3J0IGNvbnN0IFJBRElYX1NJR05TX0ZPTlRfU0laRSA9IDI3XG5cbi8qXG4qIEZvbnQgc2l6ZSAtIGF4aXMgKEFzLCBEcywgTWMsIEljKVxuKiBAY29uc3RhbnRcbiogQHR5cGUge051bWJlcn1cbiogQGRlZmF1bHQgMjRcbiovXG5leHBvcnQgY29uc3QgUkFESVhfQVhJU19GT05UX1NJWkUgPSAzMlxuXG5cbmV4cG9ydCBjb25zdCBTWU1CT0xfU1RST0tFID0gZmFsc2VcbmV4cG9ydCBjb25zdCBTWU1CT0xfU1RST0tFX0NPTE9SID0gJyNGRkYnXG5leHBvcnQgY29uc3QgU1lNQk9MX1NUUk9LRV9XSURUSCA9ICc0J1xuXG4vKipcbiAqIEFkZCA8dGl0bGU+PC90aXRsZT4gZWxlbWVudHMgaW4gdGhlIFNWR1xuICogQHR5cGUge2Jvb2xlYW59XG4gKi9cbmV4cG9ydCBjb25zdCBJTlNFUlRfRUxFTUVOVF9USVRMRSA9IGZhbHNlXG5cbmV4cG9ydCBjb25zdCBFTEVNRU5UX1RJVExFUyA9IHtcbiAgICAvLyBheGlzOiB7XG4gICAgLy8gICAgIEFzOiBcIkFzY2VuZGFudFwiLFxuICAgIC8vICAgICBNYzogXCJNaWRoZWF2ZW5cIixcbiAgICAvLyAgICAgRHM6IFwiRGVzY2VuZGFudFwiLFxuICAgIC8vICAgICBJYzogXCJJbXVtIENvZWxpXCIsXG4gICAgLy8gfSxcbiAgICAvLyBzaWduczoge1xuICAgIC8vICAgICBhcmllczogXCJBcmllc1wiLFxuICAgIC8vICAgICB0YXVydXM6IFwiVGF1cnVzXCIsXG4gICAgLy8gICAgIGdlbWluaTogXCJHZW1pbmlcIixcbiAgICAvLyAgICAgY2FuY2VyOiBcIkNhbmNlclwiLFxuICAgIC8vICAgICBsZW86IFwiTGVvXCIsXG4gICAgLy8gICAgIHZpcmdvOiBcIlZpcmdvXCIsXG4gICAgLy8gICAgIGxpYnJhOiBcIkxpYnJhXCIsXG4gICAgLy8gICAgIHNjb3JwaW86IFwiU2NvcnBpb1wiLFxuICAgIC8vICAgICBzYWdpdHRhcml1czogXCJTYWdpdHRhcml1c1wiLFxuICAgIC8vICAgICBjYXByaWNvcm46IFwiQ2Fwcmljb3JuXCIsXG4gICAgLy8gICAgIGFxdWFyaXVzOiBcIkFxdWFyaXVzXCIsXG4gICAgLy8gICAgIHBpc2NlczogXCJQaXNjZXNcIlxuICAgIC8vIH0sXG4gICAgLy8gcG9pbnRzOiB7XG4gICAgLy8gICAgIHN1bjogXCJTdW5cIixcbiAgICAvLyAgICAgbW9vbjogXCJNb29uXCIsXG4gICAgLy8gICAgIG1lcmN1cnk6IFwiTWVyY3VyeVwiLFxuICAgIC8vICAgICB2ZW51czogXCJWZW51c1wiLFxuICAgIC8vICAgICBlYXJ0aDogXCJFYXJ0aFwiLFxuICAgIC8vICAgICBtYXJzOiBcIk1hcnNcIixcbiAgICAvLyAgICAganVwaXRlcjogXCJKdXBpdGVyXCIsXG4gICAgLy8gICAgIHNhdHVybjogXCJTYXR1cm5cIixcbiAgICAvLyAgICAgdXJhbnVzOiBcIlVyYW51c1wiLFxuICAgIC8vICAgICBuZXB0dW5lOiBcIk5lcHR1bmVcIixcbiAgICAvLyAgICAgcGx1dG86IFwiUGx1dG9cIixcbiAgICAvLyAgICAgY2hpcm9uOiBcIkNoaXJvblwiLFxuICAgIC8vICAgICBsaWxpdGg6IFwiTGlsaXRoXCIsXG4gICAgLy8gICAgIG5ub2RlOiBcIk5vcnRoIE5vZGVcIixcbiAgICAvLyAgICAgc25vZGU6IFwiU291dGggTm9kZVwiXG4gICAgLy8gfSxcbiAgICAvLyByZXRyb2dyYWRlOiBcIlJldHJvZ3JhZGVcIixcbiAgICAvLyBhc3BlY3RzOiB7XG4gICAgLy8gICAgIGNvbmp1bmN0aW9uOiBcIkNvbmp1bmN0aW9uXCIsXG4gICAgLy8gICAgIG9wcG9zaXRpb246IFwiT3Bwb3NpdGlvblwiLFxuICAgIC8vICAgICBzcXVhcmU6IFwiU3F1YXJlXCIsXG4gICAgLy8gICAgIHRyaW5lOiBcIlRyaW5lXCIsXG4gICAgLy8gICAgIHNleHRpbGU6IFwiU2V4dGlsZVwiLFxuICAgIC8vICAgICBxdWluY3VueDogXCJRdWluY3VueFwiLFxuICAgIC8vICAgICBcInNlbWktc2V4dGlsZVwiOiBcIlNlbWktc2V4dGlsZVwiLFxuICAgIC8vICAgICBcInNlbWktc3F1YXJlXCI6IFwiU2VtaS1zcXVhcmVcIixcbiAgICAvLyAgICAgb2N0aWxlOiBcIk9jdGlsZVwiLFxuICAgIC8vICAgICBzZXNxdWlzcXVhcmU6IFwiU2VzcXVpc3F1YXJlXCIsXG4gICAgLy8gICAgIHRyaW9jdGlsZTogXCJUcmlvY3RpbGVcIixcbiAgICAvLyAgICAgcXVpbnRpbGU6IFwiUXVpbnRpbGVcIixcbiAgICAvLyAgICAgYmlxdWludGlsZTogXCJCaXF1aW50aWxlXCIsXG4gICAgLy8gICAgIFwic2VtaS1xdWludGlsZVwiOiBcIlNlbWktcXVpbnRpbGVcIixcbiAgICAvLyB9XG59IiwiLy8gbm9pbnNwZWN0aW9uIEpTVW51c2VkR2xvYmFsU3ltYm9sc1xuXG4vKlxuKiBUcmFuc2l0IGNoYXJ0IGVsZW1lbnQgSURcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0IHRyYW5zaXRcbiovXG5leHBvcnQgY29uc3QgVFJBTlNJVF9JRCA9IFwidHJhbnNpdFwiXG5cbi8qXG4qIEZvbnQgc2l6ZSAtIHBvaW50cyAocGxhbmV0cylcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtOdW1iZXJ9XG4qIEBkZWZhdWx0IDMyXG4qL1xuZXhwb3J0IGNvbnN0IFRSQU5TSVRfUE9JTlRTX0ZPTlRfU0laRSA9IDI3XG4iLCIvLyBub2luc3BlY3Rpb24gSlNVbnVzZWRHbG9iYWxTeW1ib2xzXG5cbi8qKlxuICogQ2hhcnQgcGFkZGluZ1xuICogQGNvbnN0YW50XG4gKiBAdHlwZSB7TnVtYmVyfVxuICogQGRlZmF1bHQgMTBweFxuICovXG5leHBvcnQgY29uc3QgQ0hBUlRfUEFERElORyA9IDQwXG5cbi8qKlxuICogU1ZHIHZpZXdCb3ggd2lkdGhcbiAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvU1ZHL0F0dHJpYnV0ZS92aWV3Qm94XG4gKiBAY29uc3RhbnRcbiAqIEB0eXBlIHtOdW1iZXJ9XG4gKiBAZGVmYXVsdCA4MDBcbiAqL1xuZXhwb3J0IGNvbnN0IENIQVJUX1ZJRVdCT1hfV0lEVEggPSA4MDBcblxuLyoqXG4gKiBTVkcgdmlld0JveCBoZWlnaHRcbiAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvU1ZHL0F0dHJpYnV0ZS92aWV3Qm94XG4gKiBAY29uc3RhbnRcbiAqIEB0eXBlIHtOdW1iZXJ9XG4gKiBAZGVmYXVsdCA4MDBcbiAqL1xuZXhwb3J0IGNvbnN0IENIQVJUX1ZJRVdCT1hfSEVJR0hUID0gODAwXG5cbi8qKlxuICogQ2hhbmdlIHRoZSBzaXplIG9mIHRoZSBjZW50ZXIgY2lyY2xlLCB3aGVyZSBhc3BlY3RzIGFyZVxuICogQHR5cGUge251bWJlcn1cbiAqL1xuZXhwb3J0IGNvbnN0IENIQVJUX0NFTlRFUl9TSVpFID0gMVxuXG4vKlxuKiBMaW5lIHN0cmVuZ3RoXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7TnVtYmVyfVxuKiBAZGVmYXVsdCAxXG4qL1xuZXhwb3J0IGNvbnN0IENIQVJUX1NUUk9LRSA9IDFcblxuLypcbiogTGluZSBzdHJlbmd0aCBvZiB0aGUgbWFpbiBsaW5lcy4gRm9yIGluc3RhbmNlIHBvaW50cywgbWFpbiBheGlzLCBtYWluIGNpcmNsZXNcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtOdW1iZXJ9XG4qIEBkZWZhdWx0IDFcbiovXG5leHBvcnQgY29uc3QgQ0hBUlRfTUFJTl9TVFJPS0UgPSAyXG5cbi8qKlxuICogTGluZSBzdHJlbmd0aCBmb3IgbWlub3IgYXNwZWN0c1xuICpcbiAqIEB0eXBlIHtudW1iZXJ9XG4gKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9TVFJPS0VfTUlOT1JfQVNQRUNUID0gMVxuXG4vKipcbiAqIE5vIGZpbGwsIG9ubHkgc3Ryb2tlXG4gKiBAY29uc3RhbnRcbiAqIEB0eXBlIHtib29sZWFufVxuICogQGRlZmF1bHQgZmFsc2VcbiAqL1xuZXhwb3J0IGNvbnN0IENIQVJUX1NUUk9LRV9PTkxZID0gZmFsc2U7XG5cbi8qKlxuICogRm9udCBmYW1pbHlcbiAqIEBjb25zdGFudFxuICogQHR5cGUge1N0cmluZ31cbiAqIEBkZWZhdWx0XG4gKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9GT05UX0ZBTUlMWSA9IFwiQXN0cm9ub21pY29uXCI7XG5cbi8qKlxuICogQWx3YXlzIGRyYXcgdGhlIGZ1bGwgaG91c2UgbGluZXMsIGV2ZW4gaWYgaXQgb3ZlcmxhcHMgd2l0aCBwbGFuZXRzXG4gKiBAY29uc3RhbnRcbiAqIEB0eXBlIHtib29sZWFufVxuICogQGRlZmF1bHQgZmFsc2VcbiAqL1xuZXhwb3J0IGNvbnN0IENIQVJUX0FMTE9XX0hPVVNFX09WRVJMQVAgPSBmYWxzZTtcblxuLyoqXG4gKiBEcmF3IG1haW5zIGF4aXMgc3ltYm9scyBvdXRzaWRlIHRoZSBjaGFydDogQWMsIE1jLCBJYywgRGNcbiAqIEBjb25zdGFudFxuICogQHR5cGUge2Jvb2xlYW59XG4gKiBAZGVmYXVsdCBmYWxzZVxuICovXG5leHBvcnQgY29uc3QgQ0hBUlRfRFJBV19NQUlOX0FYSVMgPSB0cnVlO1xuXG5cbi8qKlxuICogU3Ryb2tlICYgZmlsbFxuICogQGNvbnN0YW50XG4gKiBAdHlwZSB7Ym9vbGVhbn1cbiAqIEBkZWZhdWx0IGZhbHNlXG4gKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9TVFJPS0VfV0lUSF9DT0xPUiA9IGZhbHNlO1xuXG5cbi8qKlxuICogQWxsIGNsYXNzbmFtZXNcbiAqL1xuXG4vKipcbiAqIENsYXNzIGZvciB0aGUgc2lnbiBzZWdtZW50LCBiZWhpbmQgdGhlIGFjdHVhbCBzaWduXG4gKiBAdHlwZSB7c3RyaW5nfVxuICovXG5leHBvcnQgY29uc3QgQ0xBU1NfU0lHTl9TRUdNRU5UID0gJyc7XG5cbi8qKlxuICogQ2xhc3MgZm9yIHRoZSBzaWduXG4gKiBJZiBub3QgZW1wdHksIGFub3RoZXIgY2xhc3Mgd2lsbCBiZSBhZGRlZCB1c2luZyBzYW1lIHN0cmluZywgd2l0aCBhIG1vZGlmaWVyIGxpa2UgLS1zaWduX25hbWVcbiAqIEB0eXBlIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBjb25zdCBDTEFTU19TSUdOID0gJyc7XG5cbi8qKlxuICogQ2xhc3MgZm9yIGF4aXMgQXNjZW5kYW50LCBNaWRoZWF2ZW4sIERlc2NlbmRhbnQgYW5kIEltdW0gQ29lbGlcbiAqIElmIG5vdCBlbXB0eSwgYW5vdGhlciBjbGFzcyB3aWxsIGJlIGFkZGVkIHVzaW5nIHNhbWUgc3RyaW5nLCB3aXRoIGEgbW9kaWZpZXIgbGlrZSAtLWF4aXNfbmFtZVxuICogQHR5cGUge3N0cmluZ31cbiAqL1xuZXhwb3J0IGNvbnN0IENMQVNTX0FYSVMgPSAnJztcblxuLyoqXG4gKiBDbGFzcyBmb3IgdGhlIGFzcGVjdCBjaGFyYWN0ZXJcbiAqIEB0eXBlIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBjb25zdCBDTEFTU19TSUdOX0FTUEVDVCA9ICcnO1xuXG4vKipcbiAqIENsYXNzIGZvciBhc3BlY3QgbGluZXNcbiAqIEB0eXBlIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBjb25zdCBDTEFTU19TSUdOX0FTUEVDVF9MSU5FID0gJyc7XG5cbi8qKlxuICogVXNlIHBsYW5ldCBjb2xvciBmb3IgdGhlIGNoYXJ0IGxpbmUgbmV4dCB0byBhIHBsYW5ldFxuICogQHR5cGUge2Jvb2xlYW59XG4gKi9cbmV4cG9ydCBjb25zdCBQTEFORVRfTElORV9VU0VfUExBTkVUX0NPTE9SID0gZmFsc2U7XG5cbi8qKlxuICogRHJhdyBhIHJ1bGVyIG1hcmsgKHRpbnkgc3F1YXJlKSBhdCBwbGFuZXQgcG9zaXRpb25cbiAqL1xuZXhwb3J0IGNvbnN0IERSQVdfUlVMRVJfTUFSSyA9IHRydWU7XG5cbmV4cG9ydCBjb25zdCBGT05UX0FTVFJPTk9NSUNPTl9MT0FEID0gdHJ1ZTtcbmV4cG9ydCBjb25zdCBGT05UX0FTVFJPTk9NSUNPTl9QQVRIID0gJy4uL2Fzc2V0cy9mb250cy90dGYvQXN0cm9ub21pY29uRm9udHNfMS4xL0FzdHJvbm9taWNvbi50dGYnOyIsImltcG9ydCBEZWZhdWx0U2V0dGluZ3MgZnJvbSAnLi4vc2V0dGluZ3MvRGVmYXVsdFNldHRpbmdzLmpzJztcbmltcG9ydCBTVkdVdGlscyBmcm9tICcuLi91dGlscy9TVkdVdGlscy5qcyc7XG5pbXBvcnQgUmFkaXhDaGFydCBmcm9tICcuLi9jaGFydHMvUmFkaXhDaGFydC5qcyc7XG5pbXBvcnQgVHJhbnNpdENoYXJ0IGZyb20gJy4uL2NoYXJ0cy9UcmFuc2l0Q2hhcnQuanMnO1xuXG5cbi8qKlxuICogQGNsYXNzXG4gKiBAY2xhc3NkZXNjIEFuIHdyYXBwZXIgZm9yIGFsbCBwYXJ0cyBvZiBncmFwaC5cbiAqIEBwdWJsaWNcbiAqL1xuY2xhc3MgVW5pdmVyc2Uge1xuXG4gICAgI1NWR0RvY3VtZW50XG4gICAgI3NldHRpbmdzXG4gICAgI3JhZGl4XG4gICAgI3RyYW5zaXRcbiAgICAjYXNwZWN0c1dyYXBwZXJcblxuICAgIC8qKlxuICAgICAqIEBjb25zdHJ1Y3RzXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGh0bWxFbGVtZW50SUQgLSBJRCBvZiB0aGUgcm9vdCBlbGVtZW50IHdpdGhvdXQgdGhlICMgc2lnblxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gLSBBbiBvYmplY3QgdGhhdCBvdmVycmlkZXMgdGhlIGRlZmF1bHQgc2V0dGluZ3MgdmFsdWVzXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoaHRtbEVsZW1lbnRJRCwgb3B0aW9ucyA9IHt9KSB7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBodG1sRWxlbWVudElEICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBIHJlcXVpcmVkIHBhcmFtZXRlciBpcyBtaXNzaW5nLicpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoISBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChodG1sRWxlbWVudElEKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5vdCBmaW5kIGEgSFRNTCBlbGVtZW50IHdpdGggSUQgJyArIGh0bWxFbGVtZW50SUQpXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLiNzZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oe30sIERlZmF1bHRTZXR0aW5ncywgb3B0aW9ucywge1xuICAgICAgICAgICAgSFRNTF9FTEVNRU5UX0lEOiBodG1sRWxlbWVudElEXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLiNTVkdEb2N1bWVudCA9IFNWR1V0aWxzLlNWR0RvY3VtZW50KHRoaXMuI3NldHRpbmdzLkNIQVJUX1ZJRVdCT1hfV0lEVEgsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1ZJRVdCT1hfSEVJR0hUKVxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChodG1sRWxlbWVudElEKS5hcHBlbmRDaGlsZCh0aGlzLiNTVkdEb2N1bWVudCk7XG5cbiAgICAgICAgLy8gY2hhcnQgYmFja2dyb3VuZFxuICAgICAgICBjb25zdCBiYWNrZ3JvdW5kR3JvdXAgPSBTVkdVdGlscy5TVkdHcm91cCgpXG4gICAgICAgIGJhY2tncm91bmRHcm91cC5jbGFzc0xpc3QuYWRkKCdjLWJhY2tncm91bmRzJylcbiAgICAgICAgY29uc3QgY2lyY2xlID0gU1ZHVXRpbHMuU1ZHQ2lyY2xlKHRoaXMuI3NldHRpbmdzLkNIQVJUX1ZJRVdCT1hfV0lEVEggLyAyLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9WSUVXQk9YX0hFSUdIVCAvIDIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1ZJRVdCT1hfV0lEVEggLyAyKVxuICAgICAgICBjaXJjbGUuc2V0QXR0cmlidXRlKCdmaWxsJywgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfQkFDS0dST1VORF9DT0xPUilcbiAgICAgICAgY2lyY2xlLmNsYXNzTGlzdC5hZGQoJ2MtY2hhcnQtYmFja2dyb3VuZCcpO1xuICAgICAgICBiYWNrZ3JvdW5kR3JvdXAuYXBwZW5kQ2hpbGQoY2lyY2xlKVxuICAgICAgICB0aGlzLiNTVkdEb2N1bWVudC5hcHBlbmRDaGlsZChiYWNrZ3JvdW5kR3JvdXApXG5cbiAgICAgICAgLy8gY3JlYXRlIHdyYXBwZXIgZm9yIGFzcGVjdHNcbiAgICAgICAgdGhpcy4jYXNwZWN0c1dyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG4gICAgICAgIHRoaXMuI2FzcGVjdHNXcmFwcGVyLnNldEF0dHJpYnV0ZShcImlkXCIsIGAke3RoaXMuI3NldHRpbmdzLkhUTUxfRUxFTUVOVF9JRH0tJHt0aGlzLiNzZXR0aW5ncy5BU1BFQ1RTX0lEfWApXG4gICAgICAgIHRoaXMuI1NWR0RvY3VtZW50LmFwcGVuZENoaWxkKHRoaXMuI2FzcGVjdHNXcmFwcGVyKVxuXG4gICAgICAgIHRoaXMuI3JhZGl4ID0gbmV3IFJhZGl4Q2hhcnQodGhpcylcbiAgICAgICAgdGhpcy4jdHJhbnNpdCA9IG5ldyBUcmFuc2l0Q2hhcnQodGhpcy4jcmFkaXgpXG5cbiAgICAgICAgaWYgKHRoaXMuI3NldHRpbmdzLkZPTlRfQVNUUk9OT01JQ09OX0xPQUQpIHtcbiAgICAgICAgICAgIHRoaXMuI2xvYWRGb250KFwiQXN0cm9ub21pY29uXCIsIHRoaXMuI3NldHRpbmdzLkZPTlRfQVNUUk9OT01JQ09OX1BBVEgpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIC8vICMjIFBVQkxJQyAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuICAgIC8qKlxuICAgICAqIEdldCBSYWRpeCBjaGFydFxuICAgICAqIEByZXR1cm4ge1JhZGl4Q2hhcnR9XG4gICAgICovXG4gICAgcmFkaXgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiNyYWRpeFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBUcmFuc2l0IGNoYXJ0XG4gICAgICogQHJldHVybiB7VHJhbnNpdENoYXJ0fVxuICAgICAqL1xuICAgIHRyYW5zaXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiN0cmFuc2l0XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IGN1cnJlbnQgc2V0dGluZ3NcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG4gICAgZ2V0U2V0dGluZ3MoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiNzZXR0aW5nc1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCByb290IFNWRyBkb2N1bWVudFxuICAgICAqIEByZXR1cm4ge1NWR0RvY3VtZW50fVxuICAgICAqL1xuICAgIGdldFNWR0RvY3VtZW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy4jU1ZHRG9jdW1lbnRcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgZW1wdHkgYXNwZWN0cyB3cmFwcGVyIGVsZW1lbnRcbiAgICAgKiBAcmV0dXJuIHtTVkdHcm91cEVsZW1lbnR9XG4gICAgICovXG4gICAgZ2V0QXNwZWN0c0VsZW1lbnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiNhc3BlY3RzV3JhcHBlclxuICAgIH1cblxuICAgIC8vICMjIFBSSVZBVEUgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiAgICAvKlxuICAgICogTG9hZCBmb25kIHRvIERPTVxuICAgICpcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSBmYW1pbHlcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSBzb3VyY2VcbiAgICAqIEBwYXJhbSB7T2JqZWN0fVxuICAgICpcbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0ZvbnRGYWNlL0ZvbnRGYWNlXG4gICAgKi9cbiAgICBhc3luYyAjbG9hZEZvbnQoZmFtaWx5LCBzb3VyY2UsIGRlc2NyaXB0b3JzKSB7XG5cbiAgICAgICAgaWYgKCEgKCdGb250RmFjZScgaW4gd2luZG93KSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIk9vb3BzLCBGb250RmFjZSBpcyBub3QgYSBmdW5jdGlvbi5cIilcbiAgICAgICAgICAgIC8vIGNvbnNvbGUuZXJyb3IoXCJAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9DU1NfRm9udF9Mb2FkaW5nX0FQSVwiKVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBmb250ID0gbmV3IEZvbnRGYWNlKGZhbWlseSwgYHVybCgke3NvdXJjZX0pYCwgZGVzY3JpcHRvcnMpXG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGF3YWl0IGZvbnQubG9hZCgpO1xuICAgICAgICAgICAgZG9jdW1lbnQuZm9udHMuYWRkKGZvbnQpXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihlKVxuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQge1xuICAgIFVuaXZlcnNlIGFzXG4gICAgICAgIGRlZmF1bHRcbn1cbiIsImltcG9ydCBVdGlscyBmcm9tICcuL1V0aWxzLmpzJ1xuaW1wb3J0IFNWR1V0aWxzIGZyb20gJy4vU1ZHVXRpbHMuanMnO1xuXG4vKipcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyBVdGlsaXR5IGNsYXNzXG4gKiBAcHVibGljXG4gKiBAc3RhdGljXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKi9cbmNsYXNzIEFzcGVjdFV0aWxzIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBpZiAodGhpcyBpbnN0YW5jZW9mIEFzcGVjdFV0aWxzKSB7XG4gICAgICAgICAgICB0aHJvdyBFcnJvcignVGhpcyBpcyBhIHN0YXRpYyBjbGFzcyBhbmQgY2Fubm90IGJlIGluc3RhbnRpYXRlZC4nKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENhbGN1bGF0ZXMgdGhlIG9yYml0IG9mIHR3byBhbmdsZXMgb24gYSBjaXJjbGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBmcm9tQW5nbGUgLSBhbmdsZSBpbiBkZWdyZWUsIHBvaW50IG9uIHRoZSBjaXJjbGVcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gdG9BbmdsZSAtIGFuZ2xlIGluIGRlZ3JlZSwgcG9pbnQgb24gdGhlIGNpcmNsZVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBhc3BlY3RBbmdsZSAtIDYwLDkwLDEyMCwgLi4uXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IG9yYlxuICAgICAqL1xuICAgIHN0YXRpYyBvcmIoZnJvbUFuZ2xlLCB0b0FuZ2xlLCBhc3BlY3RBbmdsZSkge1xuICAgICAgICBsZXQgb3JiXG4gICAgICAgIGxldCBzaWduID0gZnJvbUFuZ2xlID4gdG9BbmdsZSA/IDEgOiAtMVxuICAgICAgICBsZXQgZGlmZmVyZW5jZSA9IE1hdGguYWJzKGZyb21BbmdsZSAtIHRvQW5nbGUpXG5cbiAgICAgICAgaWYgKGRpZmZlcmVuY2UgPiBVdGlscy5ERUdfMTgwKSB7XG4gICAgICAgICAgICBkaWZmZXJlbmNlID0gVXRpbHMuREVHXzM2MCAtIGRpZmZlcmVuY2U7XG4gICAgICAgICAgICBvcmIgPSAoZGlmZmVyZW5jZSAtIGFzcGVjdEFuZ2xlKSAqIC0xXG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9yYiA9IChkaWZmZXJlbmNlIC0gYXNwZWN0QW5nbGUpICogc2lnblxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIE51bWJlcihOdW1iZXIob3JiKS50b0ZpeGVkKDIpKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBhc3BlY3RzXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IGZyb21Qb2ludHMgLSBbe25hbWU6XCJNb29uXCIsIGFuZ2xlOjB9LCB7bmFtZTpcIlN1blwiLCBhbmdsZToxNzl9LCB7bmFtZTpcIk1lcmN1cnlcIiwgYW5nbGU6MTIxfV1cbiAgICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IHRvUG9pbnRzIC0gW3tuYW1lOlwiQVNcIiwgYW5nbGU6MH0sIHtuYW1lOlwiSUNcIiwgYW5nbGU6OTB9XVxuICAgICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gYXNwZWN0cyAtIFt7bmFtZTpcIk9wcG9zaXRpb25cIiwgYW5nbGU6MTgwLCBvcmI6Mn0sIHtuYW1lOlwiVHJpbmVcIiwgYW5nbGU6MTIwLCBvcmI6Mn1dXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtBcnJheTxPYmplY3Q+fVxuICAgICAqL1xuICAgIHN0YXRpYyBnZXRBc3BlY3RzKGZyb21Qb2ludHMsIHRvUG9pbnRzLCBhc3BlY3RzKSB7XG4gICAgICAgIGNvbnN0IGFzcGVjdExpc3QgPSBbXVxuICAgICAgICBmb3IgKGNvbnN0IGZyb21QIG9mIGZyb21Qb2ludHMpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgdG9QIG9mIHRvUG9pbnRzKSB7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBhc3BlY3Qgb2YgYXNwZWN0cykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBvcmIgPSBBc3BlY3RVdGlscy5vcmIoZnJvbVAuYW5nbGUsIHRvUC5hbmdsZSwgYXNwZWN0LmFuZ2xlKVxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogVXNlIGN1c3RvbSBvcmJzIGlmIGF2YWlsYWJsZTpcbiAgICAgICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgICAgICogREVGQVVMVF9BU1BFQ1RTOiBbXG4gICAgICAgICAgICAgICAgICAgICAqICAgICAgICAgICAgIHtuYW1lOiBcIkNvbmp1bmN0aW9uXCIsIGFuZ2xlOiAwLCBvcmI6IDQsIG9yYnM6IHsnU3VuJzogMTB9LCBpc01ham9yOiB0cnVlfSxcbiAgICAgICAgICAgICAgICAgICAgICogICAgICAgICAgICAgLi4uXG4gICAgICAgICAgICAgICAgICAgICAqICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICogQHR5cGUge251bWJlcn1cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGxldCBvcmJMaW1pdCA9ICgoYXNwZWN0Lm9yYnM/Lltmcm9tUC5uYW1lXSA/PyBhc3BlY3Qub3JiKSArIChhc3BlY3Qub3Jicz8uW3RvUC5uYW1lXSA/PyBhc3BlY3Qub3JiKSkgLyAyXG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKG9yYikgPD0gb3JiTGltaXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFzcGVjdExpc3QucHVzaCh7YXNwZWN0OiBhc3BlY3QsIGZyb206IGZyb21QLCB0bzogdG9QLCBwcmVjaXNpb246IG9yYn0pXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYXNwZWN0TGlzdFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERyYXcgYXNwZWN0c1xuICAgICAqXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHJhZGl1c1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBhc2NlbmRhbnRTaGlmdFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzZXR0aW5nc1xuICAgICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gYXNwZWN0c0xpc3RcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1NWR0dyb3VwRWxlbWVudH1cbiAgICAgKi9cbiAgICBzdGF0aWMgZHJhd0FzcGVjdHMocmFkaXVzLCBhc2NlbmRhbnRTaGlmdCwgc2V0dGluZ3MsIGFzcGVjdHNMaXN0KSB7XG4gICAgICAgIGNvbnN0IGNlbnRlclggPSBzZXR0aW5ncy5DSEFSVF9WSUVXQk9YX1dJRFRIIC8gMlxuICAgICAgICBjb25zdCBjZW50ZXJZID0gc2V0dGluZ3MuQ0hBUlRfVklFV0JPWF9IRUlHSFQgLyAyXG5cbiAgICAgICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcbiAgICAgICAgd3JhcHBlci5jbGFzc0xpc3QuYWRkKCdjLWFzcGVjdHMnKVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZW9yZGVyIGFzcGVjdHNcbiAgICAgICAgICogRHJhdyBtaW5vciBhc3BlY3RzIGZpcnN0XG4gICAgICAgICAqL1xuICAgICAgICBhc3BlY3RzTGlzdC5zb3J0KChhLCBiKSA9PiAoKGEuYXNwZWN0LmlzTWFqb3IgPz8gZmFsc2UpID09PSAoYi5hc3BlY3QuaXNNYWpvciA/PyBmYWxzZSkpID8gMCA6IChhLmFzcGVjdC5pc01ham9yID8/IGZhbHNlKSA/IDEgOiAtMSlcblxuICAgICAgICBjb25zdCBhc3BlY3RHcm91cHMgPSBbXTtcblxuICAgICAgICBmb3IgKGNvbnN0IGFzcCBvZiBhc3BlY3RzTGlzdCkge1xuICAgICAgICAgICAgY29uc3QgYXNwZWN0R3JvdXAgPSBTVkdVdGlscy5TVkdHcm91cCgpXG4gICAgICAgICAgICBhc3BlY3RHcm91cC5jbGFzc0xpc3QuYWRkKCdjLWFzcGVjdHNfX2FzcGVjdCcpXG4gICAgICAgICAgICBhc3BlY3RHcm91cC5jbGFzc0xpc3QuYWRkKCdjLWFzcGVjdHNfX2FzcGVjdC0tJyArIGFzcC5hc3BlY3QubmFtZS50b0xvd2VyQ2FzZSgpKVxuICAgICAgICAgICAgYXNwZWN0R3JvdXAuZGF0YXNldC5wcmVjaXNpb24gPSBhc3AucHJlY2lzaW9uXG4gICAgICAgICAgICBhc3BlY3RHcm91cHMucHVzaChhc3BlY3RHcm91cClcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTcGxpdCB0aGUgYXNwZWN0IGxpbmUgaW4gdHdvLCB3aXRoIGEgZ2FwZSBmaXhlZCBpbiBwaXhlbHNcbiAgICAgICAgICpcbiAgICAgICAgICogQGF1dGhvciBDaGF0R1BUXG4gICAgICAgICAqIEBwYXJhbSBmcm9tUG9pbnRcbiAgICAgICAgICogQHBhcmFtIHRvUG9pbnRcbiAgICAgICAgICogQHBhcmFtIGdhcFxuICAgICAgICAgKiBAcmV0dXJucyB7W1t7eDogbnVtYmVyLCB5OiBudW1iZXJ9LCB7eDogbnVtYmVyLCB5OiBudW1iZXJ9XSxbe3g6IG51bWJlciwgeTogbnVtYmVyfSx7eDogbnVtYmVyLCB5OiBudW1iZXJ9XV19XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBzcGxpdExpbmVXaXRoR2FwID0gZnVuY3Rpb24gKGZyb21Qb2ludCwgdG9Qb2ludCwgZ2FwID0gMTUpIHtcbiAgICAgICAgICAgIGNvbnN0IGR4ID0gdG9Qb2ludC54IC0gZnJvbVBvaW50Lng7XG4gICAgICAgICAgICBjb25zdCBkeSA9IHRvUG9pbnQueSAtIGZyb21Qb2ludC55O1xuXG4gICAgICAgICAgICAvLyBMaW5lIGxlbmd0aFxuICAgICAgICAgICAgY29uc3QgbGVuZ3RoID0gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcblxuICAgICAgICAgICAgLy8gTWlkcG9pbnRcbiAgICAgICAgICAgIGNvbnN0IG1pZFggPSAoZnJvbVBvaW50LnggKyB0b1BvaW50LngpIC8gMjtcbiAgICAgICAgICAgIGNvbnN0IG1pZFkgPSAoZnJvbVBvaW50LnkgKyB0b1BvaW50LnkpIC8gMjtcblxuICAgICAgICAgICAgLy8gSGFsZiBnYXAgYWxvbmcgdGhlIHBlcnBlbmRpY3VsYXJcbiAgICAgICAgICAgIGNvbnN0IG9mZnNldCA9IGdhcCAvIDI7XG5cbiAgICAgICAgICAgIC8vIEFkanVzdCBtaWRwb2ludCBhbG9uZyB0aGUgbGluZSBkaXJlY3Rpb24gdG8gZ2V0IHNwbGl0IHBvaW50c1xuICAgICAgICAgICAgY29uc3QgZGlyWCA9IGR4IC8gbGVuZ3RoO1xuICAgICAgICAgICAgY29uc3QgZGlyWSA9IGR5IC8gbGVuZ3RoO1xuXG4gICAgICAgICAgICAvLyBGaXJzdCBzZWdtZW50OiBmcm9tUG9pbnQgdG8gbWlkIC0gb2Zmc2V0IGluIGRpcmVjdGlvbiBvZiBsaW5lXG4gICAgICAgICAgICBjb25zdCBwMSA9IGZyb21Qb2ludDtcbiAgICAgICAgICAgIGNvbnN0IHAyID0ge1xuICAgICAgICAgICAgICAgIHg6IG1pZFggLSBkaXJYICogb2Zmc2V0LFxuICAgICAgICAgICAgICAgIHk6IG1pZFkgLSBkaXJZICogb2Zmc2V0XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyBTZWNvbmQgc2VnbWVudDogbWlkICsgb2Zmc2V0IHRvIHRvUG9pbnRcbiAgICAgICAgICAgIGNvbnN0IHAzID0ge1xuICAgICAgICAgICAgICAgIHg6IG1pZFggKyBkaXJYICogb2Zmc2V0LFxuICAgICAgICAgICAgICAgIHk6IG1pZFkgKyBkaXJZICogb2Zmc2V0XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgY29uc3QgcDQgPSB0b1BvaW50O1xuXG4gICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICAgIFtwMSwgcDJdLCAvLyBmaXJzdCBsaW5lIHNlZ21lbnRcbiAgICAgICAgICAgICAgICBbcDMsIHA0XSAgLy8gc2Vjb25kIGxpbmUgc2VnbWVudFxuICAgICAgICAgICAgXTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERyYXcgbGluZXMgZmlyc3RcbiAgICAgICAgICovXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXNwZWN0c0xpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGFzcCA9IGFzcGVjdHNMaXN0W2ldO1xuICAgICAgICAgICAgY29uc3QgYXNwZWN0R3JvdXAgPSBhc3BlY3RHcm91cHNbaV07XG5cbiAgICAgICAgICAgIGlmIChhc3AuYXNwZWN0Lm5hbWUgPT09ICdDb25qdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAvLyBObyBsaW5lcyBmb3IgQ29uanVjdGlvbnNcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gYXNwZWN0IGFzIHNvbGlkIGxpbmVcbiAgICAgICAgICAgIGNvbnN0IGZyb21Qb2ludCA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUoY2VudGVyWCwgY2VudGVyWSwgcmFkaXVzLCBVdGlscy5kZWdyZWVUb1JhZGlhbihhc3AuZnJvbS5hbmdsZSwgYXNjZW5kYW50U2hpZnQpKVxuICAgICAgICAgICAgY29uc3QgdG9Qb2ludCA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUoY2VudGVyWCwgY2VudGVyWSwgcmFkaXVzLCBVdGlscy5kZWdyZWVUb1JhZGlhbihhc3AudG8uYW5nbGUsIGFzY2VuZGFudFNoaWZ0KSlcblxuICAgICAgICAgICAgY29uc3QgW3NwbGl0TGluZTEsIHNwbGl0TGluZTJdID0gc3BsaXRMaW5lV2l0aEdhcChmcm9tUG9pbnQsIHRvUG9pbnQsIHNldHRpbmdzLkFTUEVDVFNfRk9OVF9TSVpFID8/IDIwKTtcblxuICAgICAgICAgICAgY29uc3QgbGluZTEgPSBTVkdVdGlscy5TVkdMaW5lKHNwbGl0TGluZTFbMF0ueCwgc3BsaXRMaW5lMVswXS55LCBzcGxpdExpbmUxWzFdLngsIHNwbGl0TGluZTFbMV0ueSlcbiAgICAgICAgICAgIGxpbmUxLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCBzZXR0aW5ncy5BU1BFQ1RfQ09MT1JTW2FzcC5hc3BlY3QubmFtZV0gPz8gXCIjMzMzXCIpO1xuXG4gICAgICAgICAgICBpZiAoc2V0dGluZ3MuQ0hBUlRfU1RST0tFX01JTk9SX0FTUEVDVCAmJiAhIChhc3AuYXNwZWN0LmlzTWFqb3IgPz8gZmFsc2UpKSB7XG4gICAgICAgICAgICAgICAgbGluZTEuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHNldHRpbmdzLkNIQVJUX1NUUk9LRV9NSU5PUl9BU1BFQ1QpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsaW5lMS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgc2V0dGluZ3MuQ0hBUlRfU1RST0tFKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHNldHRpbmdzLkNMQVNTX1NJR05fQVNQRUNUX0xJTkUpIHtcbiAgICAgICAgICAgICAgICBsaW5lMS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBzZXR0aW5ncy5DTEFTU19TSUdOX0FTUEVDVF9MSU5FKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBsaW5lMiA9IFNWR1V0aWxzLlNWR0xpbmUoc3BsaXRMaW5lMlswXS54LCBzcGxpdExpbmUyWzBdLnksIHNwbGl0TGluZTJbMV0ueCwgc3BsaXRMaW5lMlsxXS55KVxuICAgICAgICAgICAgbGluZTIuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHNldHRpbmdzLkFTUEVDVF9DT0xPUlNbYXNwLmFzcGVjdC5uYW1lXSA/PyBcIiMzMzNcIik7XG5cbiAgICAgICAgICAgIGlmIChzZXR0aW5ncy5DSEFSVF9TVFJPS0VfTUlOT1JfQVNQRUNUICYmICEgKGFzcC5hc3BlY3QuaXNNYWpvciA/PyBmYWxzZSkpIHtcbiAgICAgICAgICAgICAgICBsaW5lMi5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgc2V0dGluZ3MuQ0hBUlRfU1RST0tFX01JTk9SX0FTUEVDVCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxpbmUyLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCBzZXR0aW5ncy5DSEFSVF9TVFJPS0UpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoc2V0dGluZ3MuQ0xBU1NfU0lHTl9BU1BFQ1RfTElORSkge1xuICAgICAgICAgICAgICAgIGxpbmUyLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIHNldHRpbmdzLkNMQVNTX1NJR05fQVNQRUNUX0xJTkUpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGFzcGVjdEdyb3VwLmFwcGVuZENoaWxkKGxpbmUxKTtcbiAgICAgICAgICAgIGFzcGVjdEdyb3VwLmFwcGVuZENoaWxkKGxpbmUyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEcmF3IGFsbCBhc3BlY3RzIGFib3ZlIGxpbmVzXG4gICAgICAgICAqL1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFzcGVjdHNMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBhc3AgPSBhc3BlY3RzTGlzdFtpXTtcbiAgICAgICAgICAgIGNvbnN0IGFzcGVjdEdyb3VwID0gYXNwZWN0R3JvdXBzW2ldO1xuXG4gICAgICAgICAgICAvLyBhc3BlY3QgYXMgc29saWQgbGluZVxuICAgICAgICAgICAgY29uc3QgZnJvbVBvaW50ID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZShjZW50ZXJYLCBjZW50ZXJZLCByYWRpdXMsIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKGFzcC5mcm9tLmFuZ2xlLCBhc2NlbmRhbnRTaGlmdCkpXG4gICAgICAgICAgICBjb25zdCB0b1BvaW50ID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZShjZW50ZXJYLCBjZW50ZXJZLCByYWRpdXMsIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKGFzcC50by5hbmdsZSwgYXNjZW5kYW50U2hpZnQpKVxuXG4gICAgICAgICAgICAvLyBkcmF3IHN5bWJvbCBpbiBjZW50ZXIgb2YgYXNwZWN0XG4gICAgICAgICAgICBjb25zdCBsaW5lQ2VudGVyWCA9IChmcm9tUG9pbnQueCArIHRvUG9pbnQueCkgLyAyXG4gICAgICAgICAgICBjb25zdCBsaW5lQ2VudGVyWSA9IChmcm9tUG9pbnQueSArIHRvUG9pbnQueSkgLyAyIC0gKHNldHRpbmdzLkFTUEVDVFNfRk9OVF9TSVpFID8/IDIwKSAvIDE4IC8vIG51ZGdlIGEgYml0IGhpZ2hlciBBc3Ryb25vbWljb24gc3ltYm9sXG4gICAgICAgICAgICBjb25zdCBzeW1ib2wgPSBTVkdVdGlscy5TVkdTeW1ib2woYXNwLmFzcGVjdC5uYW1lLCBsaW5lQ2VudGVyWCwgbGluZUNlbnRlclkpXG4gICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZm9udC1mYW1pbHlcIiwgc2V0dGluZ3MuQ0hBUlRfRk9OVF9GQU1JTFkgPz8gXCJBc3Ryb25vbWljb25cIik7XG4gICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIikgLy8gc3RhcnQsIG1pZGRsZSwgZW5kXG4gICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcbiAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJmb250LXNpemVcIiwgc2V0dGluZ3MuQVNQRUNUU19GT05UX1NJWkUpO1xuICAgICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgc2V0dGluZ3MuQVNQRUNUX0NPTE9SU1thc3AuYXNwZWN0Lm5hbWVdID8/IFwiIzMzM1wiKTtcblxuICAgICAgICAgICAgaWYgKHNldHRpbmdzLkNMQVNTX1NJR05fQVNQRUNUKSB7XG4gICAgICAgICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIHNldHRpbmdzLkNMQVNTX1NJR05fQVNQRUNUICsgJyAnICsgc2V0dGluZ3MuQ0xBU1NfU0lHTl9BU1BFQ1QgKyAnLS0nICsgYXNwLmFzcGVjdC5uYW1lLnRvTG93ZXJDYXNlKCkpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzZXR0aW5ncy5JTlNFUlRfRUxFTUVOVF9USVRMRSkge1xuICAgICAgICAgICAgICAgIHN5bWJvbC5hcHBlbmRDaGlsZChTVkdVdGlscy5TVkdUaXRsZShzZXR0aW5ncy5FTEVNRU5UX1RJVExFUy5hc3BlY3RzW2FzcC5hc3BlY3QubmFtZS50b0xvd2VyQ2FzZSgpXSkpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGFzcGVjdEdyb3VwLmRhdGFzZXQuZnJvbSA9IGFzcC5mcm9tLm5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIGFzcGVjdEdyb3VwLmRhdGFzZXQudG8gPSBhc3AudG8ubmFtZS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICAgICAgICBhc3BlY3RHcm91cC5hcHBlbmRDaGlsZChzeW1ib2wpO1xuICAgICAgICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChhc3BlY3RHcm91cCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gd3JhcHBlclxuICAgIH1cblxufVxuXG5leHBvcnQge1xuICAgIEFzcGVjdFV0aWxzIGFzXG4gICAgICAgIGRlZmF1bHRcbn1cbiIsIi8vIG5vaW5zcGVjdGlvbiBKU1VudXNlZEdsb2JhbFN5bWJvbHNcbi8qKlxuICogQGNsYXNzXG4gKiBAY2xhc3NkZXNjIFNWRyB1dGlsaXR5IGNsYXNzXG4gKiBAcHVibGljXG4gKiBAc3RhdGljXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKi9cbmNsYXNzIFNWR1V0aWxzIHtcblxuICAgIHN0YXRpYyBTVkdfTkFNRVNQQUNFID0gXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiXG5cbiAgICBzdGF0aWMgU1lNQk9MX0FSSUVTID0gXCJBcmllc1wiO1xuICAgIHN0YXRpYyBTWU1CT0xfVEFVUlVTID0gXCJUYXVydXNcIjtcbiAgICBzdGF0aWMgU1lNQk9MX0dFTUlOSSA9IFwiR2VtaW5pXCI7XG4gICAgc3RhdGljIFNZTUJPTF9DQU5DRVIgPSBcIkNhbmNlclwiO1xuICAgIHN0YXRpYyBTWU1CT0xfTEVPID0gXCJMZW9cIjtcbiAgICBzdGF0aWMgU1lNQk9MX1ZJUkdPID0gXCJWaXJnb1wiO1xuICAgIHN0YXRpYyBTWU1CT0xfTElCUkEgPSBcIkxpYnJhXCI7XG4gICAgc3RhdGljIFNZTUJPTF9TQ09SUElPID0gXCJTY29ycGlvXCI7XG4gICAgc3RhdGljIFNZTUJPTF9TQUdJVFRBUklVUyA9IFwiU2FnaXR0YXJpdXNcIjtcbiAgICBzdGF0aWMgU1lNQk9MX0NBUFJJQ09STiA9IFwiQ2Fwcmljb3JuXCI7XG4gICAgc3RhdGljIFNZTUJPTF9BUVVBUklVUyA9IFwiQXF1YXJpdXNcIjtcbiAgICBzdGF0aWMgU1lNQk9MX1BJU0NFUyA9IFwiUGlzY2VzXCI7XG5cbiAgICBzdGF0aWMgU1lNQk9MX1NVTiA9IFwiU3VuXCI7XG4gICAgc3RhdGljIFNZTUJPTF9NT09OID0gXCJNb29uXCI7XG4gICAgc3RhdGljIFNZTUJPTF9NRVJDVVJZID0gXCJNZXJjdXJ5XCI7XG4gICAgc3RhdGljIFNZTUJPTF9WRU5VUyA9IFwiVmVudXNcIjtcbiAgICBzdGF0aWMgU1lNQk9MX0VBUlRIID0gXCJFYXJ0aFwiO1xuICAgIHN0YXRpYyBTWU1CT0xfTUFSUyA9IFwiTWFyc1wiO1xuICAgIHN0YXRpYyBTWU1CT0xfSlVQSVRFUiA9IFwiSnVwaXRlclwiO1xuICAgIHN0YXRpYyBTWU1CT0xfU0FUVVJOID0gXCJTYXR1cm5cIjtcbiAgICBzdGF0aWMgU1lNQk9MX1VSQU5VUyA9IFwiVXJhbnVzXCI7XG4gICAgc3RhdGljIFNZTUJPTF9ORVBUVU5FID0gXCJOZXB0dW5lXCI7XG4gICAgc3RhdGljIFNZTUJPTF9QTFVUTyA9IFwiUGx1dG9cIjtcbiAgICBzdGF0aWMgU1lNQk9MX0NISVJPTiA9IFwiQ2hpcm9uXCI7XG4gICAgc3RhdGljIFNZTUJPTF9MSUxJVEggPSBcIkxpbGl0aFwiO1xuICAgIHN0YXRpYyBTWU1CT0xfTk5PREUgPSBcIk5Ob2RlXCI7XG4gICAgc3RhdGljIFNZTUJPTF9TTk9ERSA9IFwiU05vZGVcIjtcblxuICAgIHN0YXRpYyBTWU1CT0xfQVMgPSBcIkFzXCI7XG4gICAgc3RhdGljIFNZTUJPTF9EUyA9IFwiRHNcIjtcbiAgICBzdGF0aWMgU1lNQk9MX01DID0gXCJNY1wiO1xuICAgIHN0YXRpYyBTWU1CT0xfSUMgPSBcIkljXCI7XG5cbiAgICBzdGF0aWMgU1lNQk9MX1JFVFJPR1JBREUgPSBcIlJldHJvZ3JhZGVcIlxuXG4gICAgc3RhdGljIFNZTUJPTF9DT05KVU5DVElPTiA9IFwiQ29uanVuY3Rpb25cIjtcbiAgICBzdGF0aWMgU1lNQk9MX09QUE9TSVRJT04gPSBcIk9wcG9zaXRpb25cIjtcbiAgICBzdGF0aWMgU1lNQk9MX1NRVUFSRSA9IFwiU3F1YXJlXCI7IC8vIEFLQSBRdWFydGlsZSBvciBRdWFkcmF0ZVxuICAgIHN0YXRpYyBTWU1CT0xfVFJJTkUgPSBcIlRyaW5lXCI7XG4gICAgc3RhdGljIFNZTUJPTF9TRVhUSUxFID0gXCJTZXh0aWxlXCI7XG5cbiAgICBzdGF0aWMgU1lNQk9MX1FVSU5DVU5YID0gXCJRdWluY3VueFwiO1xuICAgIHN0YXRpYyBTWU1CT0xfU0VNSVNFWFRJTEUgPSBcIlNlbWktc2V4dGlsZVwiO1xuXG4gICAgc3RhdGljIFNZTUJPTF9TRU1JU1FVQVJFID0gXCJTZW1pLXNxdWFyZVwiOyAvLyBBS0EgT2N0aWxlXG4gICAgc3RhdGljIFNZTUJPTF9PQ1RJTEUgPSBcIk9jdGlsZVwiO1xuXG4gICAgc3RhdGljIFNZTUJPTF9TRVNRVUlTUVVBUkUgPSBcIlNlc3F1aXNxdWFyZVwiOyAvLyBBS0EgVHJpb2N0aWxlXG4gICAgc3RhdGljIFNZTUJPTF9UUklPQ1RJTEUgPSBcIlRyaW9jdGlsZVwiOyAvLyBTYW1lIGFzIFNlc3F1aXNxdWFyZVxuXG4gICAgc3RhdGljIFNZTUJPTF9RVUlOVElMRSA9IFwiUXVpbnRpbGVcIjtcbiAgICBzdGF0aWMgU1lNQk9MX0JJUVVJTlRJTEUgPSBcIkJpcXVpbnRpbGVcIjtcbiAgICBzdGF0aWMgU1lNQk9MX1NFTUlRVUlOVElMRSA9IFwiU2VtaS1xdWludGlsZVwiOyAvLyBBS0EgRGVjaWxlXG5cbiAgICAvLyBBc3Ryb25vbWljb24gZm9udCBjb2Rlc1xuICAgIHN0YXRpYyBTWU1CT0xfQVJJRVNfQ09ERSA9IFwiQVwiO1xuICAgIHN0YXRpYyBTWU1CT0xfVEFVUlVTX0NPREUgPSBcIkJcIjtcbiAgICBzdGF0aWMgU1lNQk9MX0dFTUlOSV9DT0RFID0gXCJDXCI7XG4gICAgc3RhdGljIFNZTUJPTF9DQU5DRVJfQ09ERSA9IFwiRFwiO1xuICAgIHN0YXRpYyBTWU1CT0xfTEVPX0NPREUgPSBcIkVcIjtcbiAgICBzdGF0aWMgU1lNQk9MX1ZJUkdPX0NPREUgPSBcIkZcIjtcbiAgICBzdGF0aWMgU1lNQk9MX0xJQlJBX0NPREUgPSBcIkdcIjtcbiAgICBzdGF0aWMgU1lNQk9MX1NDT1JQSU9fQ09ERSA9IFwiSFwiO1xuICAgIHN0YXRpYyBTWU1CT0xfU0FHSVRUQVJJVVNfQ09ERSA9IFwiSVwiO1xuICAgIHN0YXRpYyBTWU1CT0xfQ0FQUklDT1JOX0NPREUgPSBcIkpcIjtcbiAgICBzdGF0aWMgU1lNQk9MX0FRVUFSSVVTX0NPREUgPSBcIktcIjtcbiAgICBzdGF0aWMgU1lNQk9MX1BJU0NFU19DT0RFID0gXCJMXCI7XG5cbiAgICBzdGF0aWMgU1lNQk9MX1NVTl9DT0RFID0gXCJRXCI7XG4gICAgc3RhdGljIFNZTUJPTF9NT09OX0NPREUgPSBcIlJcIjtcbiAgICBzdGF0aWMgU1lNQk9MX01FUkNVUllfQ09ERSA9IFwiU1wiO1xuICAgIHN0YXRpYyBTWU1CT0xfVkVOVVNfQ09ERSA9IFwiVFwiO1xuICAgIHN0YXRpYyBTWU1CT0xfRUFSVEhfQ09ERSA9IFwiPlwiO1xuICAgIHN0YXRpYyBTWU1CT0xfTUFSU19DT0RFID0gXCJVXCI7XG4gICAgc3RhdGljIFNZTUJPTF9KVVBJVEVSX0NPREUgPSBcIlZcIjtcbiAgICBzdGF0aWMgU1lNQk9MX1NBVFVSTl9DT0RFID0gXCJXXCI7XG4gICAgc3RhdGljIFNZTUJPTF9VUkFOVVNfQ09ERSA9IFwiWFwiO1xuICAgIHN0YXRpYyBTWU1CT0xfTkVQVFVORV9DT0RFID0gXCJZXCI7XG4gICAgc3RhdGljIFNZTUJPTF9QTFVUT19DT0RFID0gXCJaXCI7XG4gICAgc3RhdGljIFNZTUJPTF9DSElST05fQ09ERSA9IFwicVwiO1xuICAgIHN0YXRpYyBTWU1CT0xfTElMSVRIX0NPREUgPSBcInpcIjtcbiAgICBzdGF0aWMgU1lNQk9MX05OT0RFX0NPREUgPSBcImdcIjtcbiAgICBzdGF0aWMgU1lNQk9MX1NOT0RFX0NPREUgPSBcImlcIjtcblxuICAgIHN0YXRpYyBTWU1CT0xfQVNfQ09ERSA9IFwiY1wiO1xuICAgIHN0YXRpYyBTWU1CT0xfRFNfQ09ERSA9IFwiZlwiO1xuICAgIHN0YXRpYyBTWU1CT0xfTUNfQ09ERSA9IFwiZFwiO1xuICAgIHN0YXRpYyBTWU1CT0xfSUNfQ09ERSA9IFwiZVwiO1xuXG4gICAgc3RhdGljIFNZTUJPTF9SRVRST0dSQURFX0NPREUgPSBcIk1cIlxuXG5cbiAgICBzdGF0aWMgU1lNQk9MX0NPTkpVTkNUSU9OX0NPREUgPSBcIiFcIjtcbiAgICBzdGF0aWMgU1lNQk9MX09QUE9TSVRJT05fQ09ERSA9ICdcIic7XG4gICAgc3RhdGljIFNZTUJPTF9TUVVBUkVfQ09ERSA9IFwiI1wiO1xuICAgIHN0YXRpYyBTWU1CT0xfVFJJTkVfQ09ERSA9IFwiJFwiO1xuICAgIHN0YXRpYyBTWU1CT0xfU0VYVElMRV9DT0RFID0gXCIlXCI7XG5cbiAgICAvKipcbiAgICAgKiBRdWluY3VueCAoSW5jb25qdW5jdClcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAqL1xuICAgIHN0YXRpYyBTWU1CT0xfUVVJTkNVTlhfQ09ERSA9IFwiJlwiO1xuXG4gICAgc3RhdGljIFNZTUJPTF9TRU1JU0VYVElMRV9DT0RFID0gXCInXCI7XG5cbiAgICAvKipcbiAgICAgKiBTZW1pLVNxdWFyZSBvciBPY3RpbGVcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAqL1xuICAgIHN0YXRpYyBTWU1CT0xfU0VNSVNRVUFSRV9DT0RFID0gXCIoXCI7XG5cbiAgICAvKipcbiAgICAgKiBTZXNxdWlxdWFkcmF0ZSBvciBUcmktT2N0aWxlIG9yIFNlc3F1aXNxdWFyZVxuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICovXG4gICAgc3RhdGljIFNZTUJPTF9UUklPQ1RJTEVfQ09ERSA9IFwiKVwiO1xuXG4gICAgc3RhdGljIFNZTUJPTF9CSVFVSU5USUxFX0NPREUgPSBcIipcIjtcblxuICAgIHN0YXRpYyBTWU1CT0xfUVVJTlRJTEVfQ09ERSA9IFwiwrdcIjtcblxuICAgIHN0YXRpYyBTWU1CT0xfU0VNSVFVSU5USUxFX0NPREUgPSBcIixcIjtcblxuICAgIHN0YXRpYyBTWU1CT0xfUVVJTkRFQ0lMRV9DT0RFID0gXCLCuFwiO1xuXG4gICAgLyoqXG4gICAgICogUXVpbnRpbGUgKHZhcmlhbnQpXG4gICAgICpcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAqL1xuICAgIHN0YXRpYyBTWU1CT0xfUVVJTlRJTEVfVkFSSUFOVF9DT0RFID0gXCIrXCI7XG5cblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBpZiAodGhpcyBpbnN0YW5jZW9mIFNWR1V0aWxzKSB7XG4gICAgICAgICAgICB0aHJvdyBFcnJvcignVGhpcyBpcyBhIHN0YXRpYyBjbGFzcyBhbmQgY2Fubm90IGJlIGluc3RhbnRpYXRlZC4nKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIFNWRyBkb2N1bWVudFxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB3aWR0aFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBoZWlnaHRcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1NWR0RvY3VtZW50fVxuICAgICAqL1xuICAgIHN0YXRpYyBTVkdEb2N1bWVudCh3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICAgIGNvbnN0IHN2ZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTVkdVdGlscy5TVkdfTkFNRVNQQUNFLCBcInN2Z1wiKTtcbiAgICAgICAgc3ZnLnNldEF0dHJpYnV0ZSgneG1sbnMnLCBTVkdVdGlscy5TVkdfTkFNRVNQQUNFKTtcbiAgICAgICAgc3ZnLnNldEF0dHJpYnV0ZSgndmVyc2lvbicsIFwiMS4xXCIpO1xuICAgICAgICBzdmcuc2V0QXR0cmlidXRlKCd2aWV3Qm94JywgXCIwIDAgXCIgKyB3aWR0aCArIFwiIFwiICsgaGVpZ2h0KTtcbiAgICAgICAgcmV0dXJuIHN2Z1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIFNWRyBncm91cCBlbGVtZW50XG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQHJldHVybiB7U1ZHR3JvdXBFbGVtZW50fVxuICAgICAqL1xuICAgIHN0YXRpYyBTVkdHcm91cCgpIHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTVkdVdGlscy5TVkdfTkFNRVNQQUNFLCBcImdcIilcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBTVkcgdGl0bGUgZWxlbWVudFxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0aXRsZVxuICAgICAqIEByZXR1cm4ge1NWR0dyb3VwRWxlbWVudH1cbiAgICAgKi9cbiAgICBzdGF0aWMgU1ZHVGl0bGUodGl0bGUpIHtcbiAgICAgICAgY29uc3Qgc3ZnVGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoU1ZHVXRpbHMuU1ZHX05BTUVTUEFDRSwgXCJ0aXRsZVwiKVxuICAgICAgICBzdmdUaXRsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0aXRsZSkpO1xuICAgICAgICByZXR1cm4gc3ZnVGl0bGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgU1ZHIHBhdGggZWxlbWVudFxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEByZXR1cm4ge1NWR0dyb3VwRWxlbWVudH1cbiAgICAgKi9cbiAgICBzdGF0aWMgU1ZHUGF0aCgpIHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTVkdVdGlscy5TVkdfTkFNRVNQQUNFLCBcInBhdGhcIilcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBTVkcgbWFzayBlbGVtZW50XG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGVsZW1lbnRJRFxuICAgICAqXG4gICAgICogQHJldHVybiB7U1ZHTWFza0VsZW1lbnR9XG4gICAgICovXG4gICAgc3RhdGljIFNWR01hc2soZWxlbWVudElEKSB7XG4gICAgICAgIGNvbnN0IG1hc2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoU1ZHVXRpbHMuU1ZHX05BTUVTUEFDRSwgXCJtYXNrXCIpO1xuICAgICAgICBtYXNrLnNldEF0dHJpYnV0ZShcImlkXCIsIGVsZW1lbnRJRClcbiAgICAgICAgcmV0dXJuIG1hc2tcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTVkcgY2lyY3VsYXIgc2VjdG9yXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQHBhcmFtIHtpbnR9IHggLSBjaXJjbGUgeCBjZW50ZXIgcG9zaXRpb25cbiAgICAgKiBAcGFyYW0ge2ludH0geSAtIGNpcmNsZSB5IGNlbnRlciBwb3NpdGlvblxuICAgICAqIEBwYXJhbSB7aW50fSByYWRpdXMgLSBjaXJjbGUgcmFkaXVzIGluIHB4XG4gICAgICogQHBhcmFtIHtpbnR9IGExIC0gYW5nbGVGcm9tIGluIHJhZGlhbnNcbiAgICAgKiBAcGFyYW0ge2ludH0gYTIgLSBhbmdsZVRvIGluIHJhZGlhbnNcbiAgICAgKiBAcGFyYW0ge2ludH0gdGhpY2tuZXNzIC0gZnJvbSBvdXRzaWRlIHRvIGNlbnRlciBpbiBweFxuICAgICAqXG4gICAgICogQHJldHVybiB7U1ZHRWxlbWVudH0gc2VnbWVudFxuICAgICAqL1xuICAgIHN0YXRpYyBTVkdTZWdtZW50KHgsIHksIHJhZGl1cywgYTEsIGEyLCB0aGlja25lc3MsIGxGbGFnLCBzRmxhZykge1xuICAgICAgICAvLyBAc2VlIFNWRyBQYXRoIGFyYzogaHR0cHM6Ly93d3cudzMub3JnL1RSL1NWRy9wYXRocy5odG1sI1BhdGhEYXRhXG4gICAgICAgIGNvbnN0IExBUkdFX0FSQ19GTEFHID0gbEZsYWcgfHwgMDtcbiAgICAgICAgY29uc3QgU1dFRVRfRkxBRyA9IHNGbGFnIHx8IDA7XG5cbiAgICAgICAgY29uc3Qgc2VnbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTVkdVdGlscy5TVkdfTkFNRVNQQUNFLCBcInBhdGhcIik7XG4gICAgICAgIHNlZ21lbnQuc2V0QXR0cmlidXRlKFwiZFwiLCBcIk0gXCIgKyAoeCArIHRoaWNrbmVzcyAqIE1hdGguY29zKGExKSkgKyBcIiwgXCIgKyAoeSArIHRoaWNrbmVzcyAqIE1hdGguc2luKGExKSkgKyBcIiBsIFwiICsgKChyYWRpdXMgLSB0aGlja25lc3MpICogTWF0aC5jb3MoYTEpKSArIFwiLCBcIiArICgocmFkaXVzIC0gdGhpY2tuZXNzKSAqIE1hdGguc2luKGExKSkgKyBcIiBBIFwiICsgcmFkaXVzICsgXCIsIFwiICsgcmFkaXVzICsgXCIsMCAsXCIgKyBMQVJHRV9BUkNfRkxBRyArIFwiLCBcIiArIFNXRUVUX0ZMQUcgKyBcIiwgXCIgKyAoeCArIHJhZGl1cyAqIE1hdGguY29zKGEyKSkgKyBcIiwgXCIgKyAoeSArIHJhZGl1cyAqIE1hdGguc2luKGEyKSkgKyBcIiBsIFwiICsgKChyYWRpdXMgLSB0aGlja25lc3MpICogLU1hdGguY29zKGEyKSkgKyBcIiwgXCIgKyAoKHJhZGl1cyAtIHRoaWNrbmVzcykgKiAtTWF0aC5zaW4oYTIpKSArIFwiIEEgXCIgKyB0aGlja25lc3MgKyBcIiwgXCIgKyB0aGlja25lc3MgKyBcIiwwICxcIiArIExBUkdFX0FSQ19GTEFHICsgXCIsIFwiICsgMSArIFwiLCBcIiArICh4ICsgdGhpY2tuZXNzICogTWF0aC5jb3MoYTEpKSArIFwiLCBcIiArICh5ICsgdGhpY2tuZXNzICogTWF0aC5zaW4oYTEpKSk7XG4gICAgICAgIHNlZ21lbnQuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XG4gICAgICAgIHJldHVybiBzZWdtZW50O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNWRyBjaXJjbGVcbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAcGFyYW0ge2ludH0gY3hcbiAgICAgKiBAcGFyYW0ge2ludH0gY3lcbiAgICAgKiBAcGFyYW0ge2ludH0gcmFkaXVzXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtTVkdFbGVtZW50fSBjaXJjbGVcbiAgICAgKi9cbiAgICBzdGF0aWMgU1ZHQ2lyY2xlKGN4LCBjeSwgcmFkaXVzKSB7XG4gICAgICAgIGNvbnN0IGNpcmNsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTVkdVdGlscy5TVkdfTkFNRVNQQUNFLCBcImNpcmNsZVwiKTtcbiAgICAgICAgY2lyY2xlLnNldEF0dHJpYnV0ZShcImN4XCIsIGN4KTtcbiAgICAgICAgY2lyY2xlLnNldEF0dHJpYnV0ZShcImN5XCIsIGN5KTtcbiAgICAgICAgY2lyY2xlLnNldEF0dHJpYnV0ZShcInJcIiwgcmFkaXVzKTtcbiAgICAgICAgY2lyY2xlLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJub25lXCIpO1xuICAgICAgICByZXR1cm4gY2lyY2xlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNWRyBsaW5lXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge051bWJlcn0geDFcbiAgICAgKiBAcGFyYW0ge051bWJlcn0geTJcbiAgICAgKiBAcGFyYW0ge051bWJlcn0geDJcbiAgICAgKiBAcGFyYW0ge051bWJlcn0geTJcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1NWR0VsZW1lbnR9IGxpbmVcbiAgICAgKi9cbiAgICBzdGF0aWMgU1ZHTGluZSh4MSwgeTEsIHgyLCB5Mikge1xuICAgICAgICBjb25zdCBsaW5lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFNWR1V0aWxzLlNWR19OQU1FU1BBQ0UsIFwibGluZVwiKTtcbiAgICAgICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJ4MVwiLCB4MSk7XG4gICAgICAgIGxpbmUuc2V0QXR0cmlidXRlKFwieTFcIiwgeTEpO1xuICAgICAgICBsaW5lLnNldEF0dHJpYnV0ZShcIngyXCIsIHgyKTtcbiAgICAgICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJ5MlwiLCB5Mik7XG4gICAgICAgIHJldHVybiBsaW5lO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNWRyB0ZXh0XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge051bWJlcn0geFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB5XG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHR4dFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbc2NhbGVdXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtTVkdFbGVtZW50fSBsaW5lXG4gICAgICovXG4gICAgc3RhdGljIFNWR1RleHQoeCwgeSwgdHh0KSB7XG4gICAgICAgIGNvbnN0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoU1ZHVXRpbHMuU1ZHX05BTUVTUEFDRSwgXCJ0ZXh0XCIpO1xuICAgICAgICB0ZXh0LnNldEF0dHJpYnV0ZShcInhcIiwgeCk7XG4gICAgICAgIHRleHQuc2V0QXR0cmlidXRlKFwieVwiLCB5KTtcbiAgICAgICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgXCJub25lXCIpO1xuICAgICAgICB0ZXh0LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHR4dCkpO1xuXG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNWRyBzeW1ib2xcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHhQb3NcbiAgICAgKiBAcGFyYW0ge051bWJlcn0geVBvc1xuICAgICAqXG4gICAgICogQHJldHVybiB7U1ZHRWxlbWVudH1cbiAgICAgKi9cbiAgICBzdGF0aWMgU1ZHU3ltYm9sKG5hbWUsIHhQb3MsIHlQb3MsKSB7XG4gICAgICAgIHN3aXRjaCAobmFtZSkge1xuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfQVM6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFzU3ltYm9sKHhQb3MsIHlQb3MpXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0RTOlxuICAgICAgICAgICAgICAgIHJldHVybiBkc1N5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9NQzpcbiAgICAgICAgICAgICAgICByZXR1cm4gbWNTeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfSUM6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGljU3ltYm9sKHhQb3MsIHlQb3MpXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0FSSUVTOlxuICAgICAgICAgICAgICAgIHJldHVybiBhcmllc1N5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9UQVVSVVM6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRhdXJ1c1N5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9HRU1JTkk6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdlbWluaVN5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9DQU5DRVI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhbmNlclN5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9MRU86XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxlb1N5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9WSVJHTzpcbiAgICAgICAgICAgICAgICByZXR1cm4gdmlyZ29TeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfTElCUkE6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxpYnJhU3ltYm9sKHhQb3MsIHlQb3MpXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1NDT1JQSU86XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNjb3JwaW9TeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfU0FHSVRUQVJJVVM6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNhZ2l0dGFyaXVzU3ltYm9sKHhQb3MsIHlQb3MpXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0NBUFJJQ09STjpcbiAgICAgICAgICAgICAgICByZXR1cm4gY2Fwcmljb3JuU3ltYm9sKHhQb3MsIHlQb3MpXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0FRVUFSSVVTOlxuICAgICAgICAgICAgICAgIHJldHVybiBhcXVhcml1c1N5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9QSVNDRVM6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBpc2Nlc1N5bWJvbCh4UG9zLCB5UG9zKVxuXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1NVTjpcbiAgICAgICAgICAgICAgICByZXR1cm4gc3VuU3ltYm9sKHhQb3MsIHlQb3MpXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX01PT046XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1vb25TeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfTUVSQ1VSWTpcbiAgICAgICAgICAgICAgICByZXR1cm4gbWVyY3VyeVN5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9WRU5VUzpcbiAgICAgICAgICAgICAgICByZXR1cm4gdmVudXNTeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfRUFSVEg6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVhcnRoU3ltYm9sKHhQb3MsIHlQb3MpXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX01BUlM6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1hcnNTeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfSlVQSVRFUjpcbiAgICAgICAgICAgICAgICByZXR1cm4ganVwaXRlclN5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9TQVRVUk46XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNhdHVyblN5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9VUkFOVVM6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVyYW51c1N5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9ORVBUVU5FOlxuICAgICAgICAgICAgICAgIHJldHVybiBuZXB0dW5lU3ltYm9sKHhQb3MsIHlQb3MpXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1BMVVRPOlxuICAgICAgICAgICAgICAgIHJldHVybiBwbHV0b1N5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9DSElST046XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNoaXJvblN5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9MSUxJVEg6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxpbGl0aFN5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9OTk9ERTpcbiAgICAgICAgICAgICAgICByZXR1cm4gbm5vZGVTeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfU05PREU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNub2RlU3ltYm9sKHhQb3MsIHlQb3MpXG5cblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfUkVUUk9HUkFERTpcbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0cm9ncmFkZVN5bWJvbCh4UG9zLCB5UG9zKVxuXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0NPTkpVTkNUSU9OOlxuICAgICAgICAgICAgICAgIHJldHVybiBjb25qdW5jdGlvblN5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9PUFBPU0lUSU9OOlxuICAgICAgICAgICAgICAgIHJldHVybiBvcHBvc2l0aW9uU3ltYm9sKHhQb3MsIHlQb3MpXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1NRVUFSRTpcbiAgICAgICAgICAgICAgICByZXR1cm4gc3F1YXJlU3ltYm9sKHhQb3MsIHlQb3MpXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1RSSU5FOlxuICAgICAgICAgICAgICAgIHJldHVybiB0cmluZVN5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9TRVhUSUxFOlxuICAgICAgICAgICAgICAgIHJldHVybiBzZXh0aWxlU3ltYm9sKHhQb3MsIHlQb3MpXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1FVSU5DVU5YOlxuICAgICAgICAgICAgICAgIHJldHVybiBxdWluY3VueFN5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9TRU1JU0VYVElMRTpcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VtaXNleHRpbGVTeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfU0VNSVNRVUFSRTpcbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX09DVElMRTpcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VtaXNxdWFyZVN5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9UUklPQ1RJTEU6XG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9TRVNRVUlTUVVBUkU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRyaW9jdGlsZVN5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9RVUlOVElMRTpcbiAgICAgICAgICAgICAgICByZXR1cm4gcXVpbnRpbGVTeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfQklRVUlOVElMRTpcbiAgICAgICAgICAgICAgICByZXR1cm4gYmlxdWludGlsZVN5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9TRU1JUVVJTlRJTEU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbWlxdWludGlsZVN5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoJ1Vua25vd24gc3ltYm9sOiAnICsgbmFtZSlcbiAgICAgICAgICAgICAgICBjb25zdCB1bmtub3duU3ltYm9sID0gU1ZHVXRpbHMuU1ZHQ2lyY2xlKHhQb3MsIHlQb3MsIDgpXG4gICAgICAgICAgICAgICAgdW5rbm93blN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgXCIjMzMzXCIpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVua25vd25TeW1ib2xcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIEFzY2VuZGFudCBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGFzU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9BU19DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogRGVzY2VuZGFudCBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGRzU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9EU19DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogTWVkaXVtIGNvZWxpIHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gbWNTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX01DX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBJbW11bSBjb2VsaSBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGljU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9JQ19DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogQXJpZXMgc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBhcmllc1N5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfQVJJRVNfQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFRhdXJ1cyBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHRhdXJ1c1N5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfVEFVUlVTX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBHZW1pbmkgc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBnZW1pbmlTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX0dFTUlOSV9DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogQ2FuY2VyIHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gY2FuY2VyU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9DQU5DRVJfQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIExlbyBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGxlb1N5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfTEVPX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBWaXJnbyBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHZpcmdvU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9WSVJHT19DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogTGlicmEgc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBsaWJyYVN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfTElCUkFfQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFNjb3JwaW8gc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBzY29ycGlvU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9TQ09SUElPX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBTYWdpdHRhcml1cyBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHNhZ2l0dGFyaXVzU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9TQUdJVFRBUklVU19DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogQ2Fwcmljb3JuIHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gY2Fwcmljb3JuU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9DQVBSSUNPUk5fQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIEFxdWFyaXVzIHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gYXF1YXJpdXNTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX0FRVUFSSVVTX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBQaXNjZXMgc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBwaXNjZXNTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX1BJU0NFU19DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogU3VuIHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gc3VuU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9TVU5fQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIE1vb24gc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBtb29uU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9NT09OX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBNZXJjdXJ5IHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gbWVyY3VyeVN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfTUVSQ1VSWV9DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogVmVudXMgc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiB2ZW51c1N5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfVkVOVVNfQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIEVhcnRoIHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gZWFydGhTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX0VBUlRIX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBNYXJzIHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gbWFyc1N5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfTUFSU19DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogSnVwaXRlciBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGp1cGl0ZXJTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX0pVUElURVJfQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFNhdHVybiBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHNhdHVyblN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfU0FUVVJOX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBVcmFudXMgc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiB1cmFudXNTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX1VSQU5VU19DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogTmVwdHVuZSBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIG5lcHR1bmVTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX05FUFRVTkVfQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFBsdXRvIHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gcGx1dG9TeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX1BMVVRPX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBDaGlyb24gc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBjaGlyb25TeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX0NISVJPTl9DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogTGlsaXRoIHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gbGlsaXRoU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9MSUxJVEhfQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIE5Ob2RlIHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gbm5vZGVTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX05OT0RFX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBTTm9kZSBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHNub2RlU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9TTk9ERV9DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogUmV0cm9ncmFkZSBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHJldHJvZ3JhZGVTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX1JFVFJPR1JBREVfQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIENvbmp1bmN0aW9uIHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gY29uanVuY3Rpb25TeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX0NPTkpVTkNUSU9OX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBPcHBvc2l0aW9uIHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gb3Bwb3NpdGlvblN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfT1BQT1NJVElPTl9DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogU3F1YXJlc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBzcXVhcmVTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX1NRVUFSRV9DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogVHJpbmUgc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiB0cmluZVN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfVFJJTkVfQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFNleHRpbGUgc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBzZXh0aWxlU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9TRVhUSUxFX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBRdWluY3VueCBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHF1aW5jdW54U3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9RVUlOQ1VOWF9DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogU2VtaXNleHRpbGUgc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBzZW1pc2V4dGlsZVN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfU0VNSVNFWFRJTEVfQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICogU2VtaXNxdWFyZSBzeW1ib2xcbiAgICAgICAgKiBha2EgUXVpbnRpbGUvIE9jdGlsZSBzeW1ib2xcbiAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gc2VtaXNxdWFyZVN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfU0VNSVNRVUFSRV9DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogUXVpbnRpbGVcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHF1aW50aWxlU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9TRU1JU1FVQVJFX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBiaXF1aW50aWxlU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9CSVFVSU5USUxFX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzZW1pcXVpbnRpbGVTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX1NFTUlRVUlOVElMRV9DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogVHJpb2N0aWxlIHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gdHJpb2N0aWxlU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9UUklPQ1RJTEVfQ09ERSlcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IHtcbiAgICBTVkdVdGlscyBhcyBkZWZhdWx0XG59XG4iLCIvKipcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyBVdGlsaXR5IGNsYXNzXG4gKiBAcHVibGljXG4gKiBAc3RhdGljXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKi9cbmNsYXNzIFV0aWxzIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBpZiAodGhpcyBpbnN0YW5jZW9mIFV0aWxzKSB7XG4gICAgICAgICAgICB0aHJvdyBFcnJvcignVGhpcyBpcyBhIHN0YXRpYyBjbGFzcyBhbmQgY2Fubm90IGJlIGluc3RhbnRpYXRlZC4nKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBERUdfMzYwID0gMzYwXG4gICAgc3RhdGljIERFR18xODAgPSAxODBcbiAgICBzdGF0aWMgREVHXzAgPSAwXG5cbiAgICAvKipcbiAgICAgKiBHZW5lcmF0ZSByYW5kb20gSURcbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICovXG4gICAgc3RhdGljIGdlbmVyYXRlVW5pcXVlSWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnN0IHJhbmRvbU51bWJlciA9IE1hdGgucmFuZG9tKCkgKiAxMDAwMDAwO1xuICAgICAgICBjb25zdCB0aW1lc3RhbXAgPSBEYXRlLm5vdygpO1xuICAgICAgICByZXR1cm4gYGlkXyR7cmFuZG9tTnVtYmVyfV8ke3RpbWVzdGFtcH1gO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEludmVydGVkIGRlZ3JlZSB0byByYWRpYW5cbiAgICAgKiBAc3RhdGljXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gYW5nbGVJbmRlZ3JlZVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzaGlmdEluRGVncmVlXG4gICAgICogQHJldHVybiB7TnVtYmVyfVxuICAgICAqL1xuICAgIHN0YXRpYyBkZWdyZWVUb1JhZGlhbiA9IGZ1bmN0aW9uIChhbmdsZUluRGVncmVlLCBzaGlmdEluRGVncmVlID0gMCkge1xuICAgICAgICByZXR1cm4gKHNoaWZ0SW5EZWdyZWUgLSBhbmdsZUluRGVncmVlKSAqIE1hdGguUEkgLyAxODBcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDb252ZXJ0cyByYWRpYW4gdG8gZGVncmVlXG4gICAgICogQHN0YXRpY1xuICAgICAqXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHJhZGlhblxuICAgICAqIEByZXR1cm4ge051bWJlcn1cbiAgICAgKi9cbiAgICBzdGF0aWMgcmFkaWFuVG9EZWdyZWUgPSBmdW5jdGlvbiAocmFkaWFuKSB7XG4gICAgICAgIHJldHVybiAocmFkaWFuICogMTgwIC8gTWF0aC5QSSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDYWxjdWxhdGVzIGEgcG9zaXRpb24gb2YgdGhlIHBvaW50IG9uIHRoZSBjaXJjbGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gY3ggLSBjZW50ZXIgeFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBjeSAtIGNlbnRlciB5XG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHJhZGl1cyAtIGNpcmNsZSByYWRpdXNcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gYW5nbGVJblJhZGlhbnNcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gLSB7eDpOdW1iZXIsIHk6TnVtYmVyfVxuICAgICAqL1xuICAgIHN0YXRpYyBwb3NpdGlvbk9uQ2lyY2xlKGN4LCBjeSwgcmFkaXVzLCBhbmdsZUluUmFkaWFucykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeDogKHJhZGl1cyAqIE1hdGguY29zKGFuZ2xlSW5SYWRpYW5zKSArIGN4KSxcbiAgICAgICAgICAgIHk6IChyYWRpdXMgKiBNYXRoLnNpbihhbmdsZUluUmFkaWFucykgKyBjeSlcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDYWxjdWxhdGVzIHRoZSBhbmdsZSBiZXR3ZWVuIHRoZSBsaW5lICgyIHBvaW50cykgYW5kIHRoZSB4LWF4aXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge051bWJlcn0geDFcbiAgICAgKiBAcGFyYW0ge051bWJlcn0geTFcbiAgICAgKiBAcGFyYW0ge051bWJlcn0geDJcbiAgICAgKiBAcGFyYW0ge051bWJlcn0geTJcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge051bWJlcn0gLSBkZWdyZWVcbiAgICAgKi9cbiAgICBzdGF0aWMgcG9zaXRpb25Ub0FuZ2xlKHgxLCB5MSwgeDIsIHkyKSB7XG4gICAgICAgIGNvbnN0IGR4ID0geDIgLSB4MTtcbiAgICAgICAgY29uc3QgZHkgPSB5MiAtIHkxO1xuICAgICAgICBjb25zdCBhbmdsZUluUmFkaWFucyA9IE1hdGguYXRhbjIoZHksIGR4KTtcbiAgICAgICAgcmV0dXJuIFV0aWxzLnJhZGlhblRvRGVncmVlKGFuZ2xlSW5SYWRpYW5zKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENhbGN1bGF0ZXMgbmV3IHBvc2l0aW9uIG9mIHBvaW50cyBvbiBjaXJjbGUgd2l0aG91dCBvdmVybGFwcGluZyBlYWNoIG90aGVyXG4gICAgICpcbiAgICAgKiBAdGhyb3dzIHtFcnJvcn0gLSBJZiB0aGVyZSBpcyBubyBwbGFjZSBvbiB0aGUgY2lyY2xlIHRvIHBsYWNlIHBvaW50cy5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBwb2ludHMgLSBbe25hbWU6XCJhXCIsIGFuZ2xlOjEwfSwge25hbWU6XCJiXCIsIGFuZ2xlOjIwfV1cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gY29sbGlzaW9uUmFkaXVzIC0gcG9pbnQgcmFkaXVzXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHJhZGl1cyAtIGNpcmNsZSByYWRpdXNcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gLSB7XCJNb29uXCI6MzAsIFwiU3VuXCI6NjAsIFwiTWVyY3VyeVwiOjg2LCAuLi59XG4gICAgICovXG4gICAgc3RhdGljIGNhbGN1bGF0ZVBvc2l0aW9uV2l0aG91dE92ZXJsYXBwaW5nKHBvaW50cywgY29sbGlzaW9uUmFkaXVzLCBjaXJjbGVSYWRpdXMpIHtcbiAgICAgICAgY29uc3QgU1RFUCA9IDEgLy9kZWdyZWVcblxuICAgICAgICBjb25zdCBjZWxsV2lkdGggPSAxMCAvL2RlZ3JlZVxuICAgICAgICBjb25zdCBudW1iZXJPZkNlbGxzID0gVXRpbHMuREVHXzM2MCAvIGNlbGxXaWR0aFxuICAgICAgICBjb25zdCBmcmVxdWVuY3kgPSBuZXcgQXJyYXkobnVtYmVyT2ZDZWxscykuZmlsbCgwKVxuICAgICAgICBmb3IgKGNvbnN0IHBvaW50IG9mIHBvaW50cykge1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSBNYXRoLmZsb29yKHBvaW50LmFuZ2xlIC8gY2VsbFdpZHRoKVxuICAgICAgICAgICAgZnJlcXVlbmN5W2luZGV4XSArPSAxXG4gICAgICAgIH1cblxuICAgICAgICAvLyBJbiB0aGlzIGFsZ29yaXRobSB0aGUgb3JkZXIgb2YgcG9pbnRzIGlzIGNydWNpYWwuXG4gICAgICAgIC8vIEF0IHRoYXQgcG9pbnQgaW4gdGhlIGNpcmNsZSwgd2hlcmUgdGhlIHBlcmlvZCBjaGFuZ2VzIGluIHRoZSBjaXJjbGUgKGZvciBpbnN0YW5jZTpbMzU4LDM1OSwwLDFdKSwgdGhlIHBvaW50cyBhcmUgYXJyYW5nZWQgaW4gaW5jb3JyZWN0IG9yZGVyLlxuICAgICAgICAvLyBBcyBhIHN0YXJ0aW5nIHBvaW50LCBJIHRyeSB0byBmaW5kIGEgcGxhY2Ugd2hlcmUgdGhlcmUgYXJlIG5vIHBvaW50cy4gVGhpcyBwbGFjZSBJIHVzZSBhcyBTVEFSVF9BTkdMRS5cbiAgICAgICAgY29uc3QgU1RBUlRfQU5HTEUgPSBjZWxsV2lkdGggKiBmcmVxdWVuY3kuZmluZEluZGV4KGNvdW50ID0+IGNvdW50ID09PSAwKVxuXG4gICAgICAgIGNvbnN0IF9wb2ludHMgPSBwb2ludHMubWFwKHBvaW50ID0+IHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgbmFtZTogcG9pbnQubmFtZSxcbiAgICAgICAgICAgICAgICBhbmdsZTogcG9pbnQuYW5nbGUgPCBTVEFSVF9BTkdMRSA/IHBvaW50LmFuZ2xlICsgVXRpbHMuREVHXzM2MCA6IHBvaW50LmFuZ2xlXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgX3BvaW50cy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gYS5hbmdsZSAtIGIuYW5nbGVcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBSZWN1cnNpdmUgZnVuY3Rpb25cbiAgICAgICAgY29uc3QgYXJyYW5nZVBvaW50cyA9ICgpID0+IHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsbiA9IF9wb2ludHMubGVuZ3RoOyBpIDwgbG47IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBvaW50UG9zaXRpb24gPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKDAsIDAsIGNpcmNsZVJhZGl1cywgVXRpbHMuZGVncmVlVG9SYWRpYW4oX3BvaW50c1tpXS5hbmdsZSkpXG4gICAgICAgICAgICAgICAgX3BvaW50c1tpXS54ID0gcG9pbnRQb3NpdGlvbi54XG4gICAgICAgICAgICAgICAgX3BvaW50c1tpXS55ID0gcG9pbnRQb3NpdGlvbi55XG5cbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGk7IGorKykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBkaXN0YW5jZSA9IE1hdGguc3FydChNYXRoLnBvdyhfcG9pbnRzW2ldLnggLSBfcG9pbnRzW2pdLngsIDIpICsgTWF0aC5wb3coX3BvaW50c1tpXS55IC0gX3BvaW50c1tqXS55LCAyKSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkaXN0YW5jZSA8ICgyICogY29sbGlzaW9uUmFkaXVzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgX3BvaW50c1tpXS5hbmdsZSArPSBTVEVQXG4gICAgICAgICAgICAgICAgICAgICAgICBfcG9pbnRzW2pdLmFuZ2xlIC09IFNURVBcbiAgICAgICAgICAgICAgICAgICAgICAgIGFycmFuZ2VQb2ludHMoKSAvLz09PT09PT4gUmVjdXJzaXZlIGNhbGxcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGFycmFuZ2VQb2ludHMoKVxuXG4gICAgICAgIHJldHVybiBfcG9pbnRzLnJlZHVjZSgoYWNjdW11bGF0b3IsIHBvaW50LCBjdXJyZW50SW5kZXgpID0+IHtcbiAgICAgICAgICAgIGFjY3VtdWxhdG9yW3BvaW50Lm5hbWVdID0gcG9pbnQuYW5nbGVcbiAgICAgICAgICAgIHJldHVybiBhY2N1bXVsYXRvclxuICAgICAgICB9LCB7fSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiB0aGUgYW5nbGUgY29sbGlkZXMgd2l0aCB0aGUgcG9pbnRzXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gYW5nbGVcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBhbmdsZXNMaXN0XG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IFtjb2xsaXNpb25SYWRpdXNdXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqL1xuICAgIHN0YXRpYyBpc0NvbGxpc2lvbihhbmdsZSwgYW5nbGVzTGlzdCwgY29sbGlzaW9uUmFkaXVzID0gMTApIHtcblxuICAgICAgICBjb25zdCBwb2ludEluQ29sbGlzaW9uID0gYW5nbGVzTGlzdC5maW5kKHBvaW50ID0+IHtcblxuICAgICAgICAgICAgbGV0IGEgPSAocG9pbnQgLSBhbmdsZSkgPiBVdGlscy5ERUdfMTgwID8gYW5nbGUgKyBVdGlscy5ERUdfMzYwIDogYW5nbGVcbiAgICAgICAgICAgIGxldCBwID0gKGFuZ2xlIC0gcG9pbnQpID4gVXRpbHMuREVHXzE4MCA/IHBvaW50ICsgVXRpbHMuREVHXzM2MCA6IHBvaW50XG5cbiAgICAgICAgICAgIHJldHVybiBNYXRoLmFicyhhIC0gcCkgPD0gY29sbGlzaW9uUmFkaXVzXG4gICAgICAgIH0pXG5cbiAgICAgICAgcmV0dXJuIHBvaW50SW5Db2xsaXNpb24gIT09IHVuZGVmaW5lZFxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyB0aGUgY29udGVudCBvZiBhbiBlbGVtZW50XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZWxlbWVudElEXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2JlZm9yZUhvb2tdXG4gICAgICpcbiAgICAgKiBAd2FybmluZyAtIEl0IHJlbW92ZXMgRXZlbnQgTGlzdGVuZXJzIHRvby5cbiAgICAgKiBAd2FybmluZyAtIFlvdSB3aWxsIChwcm9iYWJseSkgZ2V0IG1lbW9yeSBsZWFrIGlmIHlvdSBkZWxldGUgZWxlbWVudHMgdGhhdCBoYXZlIGF0dGFjaGVkIGxpc3RlbmVyc1xuICAgICAqL1xuICAgIHN0YXRpYyBjbGVhblVwKGVsZW1lbnRJRCwgYmVmb3JlSG9vaykge1xuICAgICAgICBsZXQgZWxtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudElEKVxuICAgICAgICBpZiAoISBlbG0pIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgKHR5cGVvZiBiZWZvcmVIb29rID09PSAnZnVuY3Rpb24nKSAmJiBiZWZvcmVIb29rKClcblxuICAgICAgICBlbG0uaW5uZXJIVE1MID0gXCJcIlxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogU2ltcGxlIGNvZGUgZm9yIGNvbmZpZyBiYXNlZCB0ZW1wbGF0ZSBzdHJpbmdzXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdGVtcGxhdGVTdHJpbmdcbiAgICAgKiBAcGFyYW0gdGVtcGxhdGVWYXJzXG4gICAgICogQHJldHVybnMgeyp9XG4gICAgICovXG4gICAgc3RhdGljIGZpbGxUZW1wbGF0ZSA9IGZ1bmN0aW9uICh0ZW1wbGF0ZVN0cmluZywgdGVtcGxhdGVWYXJzKSB7XG4gICAgICAgIGxldCBmdW5jID0gbmV3IEZ1bmN0aW9uKC4uLk9iamVjdC5rZXlzKHRlbXBsYXRlVmFycyksIFwicmV0dXJuIGBcIiArIHRlbXBsYXRlU3RyaW5nICsgXCJgO1wiKVxuICAgICAgICByZXR1cm4gZnVuYyguLi5PYmplY3QudmFsdWVzKHRlbXBsYXRlVmFycykpO1xuICAgIH1cbn1cblxuXG5leHBvcnQge1xuICAgIFV0aWxzIGFzXG4gICAgICAgIGRlZmF1bHRcbn1cblxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgVW5pdmVyc2UgZnJvbSAnLi91bml2ZXJzZS9Vbml2ZXJzZS5qcydcbmltcG9ydCBTVkdVdGlscyBmcm9tICcuL3V0aWxzL1NWR1V0aWxzLmpzJ1xuaW1wb3J0IFV0aWxzIGZyb20gJy4vdXRpbHMvVXRpbHMuanMnXG5pbXBvcnQgUmFkaXhDaGFydCBmcm9tICcuL2NoYXJ0cy9SYWRpeENoYXJ0LmpzJ1xuaW1wb3J0IFRyYW5zaXRDaGFydCBmcm9tICcuL2NoYXJ0cy9UcmFuc2l0Q2hhcnQuanMnXG5cbmV4cG9ydCB7VW5pdmVyc2UsIFNWR1V0aWxzLCBVdGlscywgUmFkaXhDaGFydCwgVHJhbnNpdENoYXJ0fVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9