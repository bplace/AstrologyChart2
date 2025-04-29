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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVEsa0RBQWtEO0FBQzFELFFBQVEsbURBQW1EO0FBQzNELFFBQVEsOENBQThDO0FBQ3RELFFBQVEsOENBQThDO0FBQ3RELFFBQVEsK0NBQStDO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsa0NBQWtDO0FBQzFDLFFBQVEsb0NBQW9DO0FBQzVDLFFBQVEsaUNBQWlDO0FBQ3pDLFFBQVEsbUNBQW1DO0FBQzNDLFFBQVEsbUNBQW1DO0FBQzNDO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDTztBQUNQLEtBQUssa0RBQWtEO0FBQ3ZELEtBQUssbURBQW1EO0FBQ3hELEtBQUssOENBQThDO0FBQ25ELEtBQUssOENBQThDO0FBQ25ELEtBQUssK0NBQStDOztBQUVwRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzVEQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDM1BBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDTzs7QUFFUDtBQUNBLDBEQUEwRCxNQUFNO0FBQ2hFLFVBQVU7QUFDVjtBQUNPLDBCQUEwQixNQUFNOzs7QUFHdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDTztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVQO0FBQ0E7QUFDQTtBQUNPO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ25KUDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7O0FDL0NQOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNoQlA7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDTzs7O0FBR1A7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDTzs7O0FBR1A7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDTzs7QUFFUDtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ087O0FBRVA7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNPOztBQUVQO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDTzs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNuSnNEO0FBQ2pCO0FBQ0s7QUFDSTs7O0FBR3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFlLFFBQVE7QUFDdkIsZUFBZSxRQUFRO0FBQ3ZCO0FBQ0EsMkNBQTJDOztBQUUzQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLHlDQUF5QyxFQUFFLG9FQUFlO0FBQzFEO0FBQ0EsU0FBUztBQUNULDRCQUE0QiwwREFBUTtBQUNwQzs7QUFFQTtBQUNBLGdDQUFnQywwREFBUTtBQUN4QztBQUNBLHVCQUF1QiwwREFBUTtBQUMvQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLCtCQUErQiwwREFBUTtBQUN2QyxtREFBbUQsK0JBQStCLEdBQUcsMEJBQTBCO0FBQy9HOztBQUVBLDBCQUEwQiw2REFBVTtBQUNwQyw0QkFBNEIsK0RBQVk7O0FBRXhDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLFFBQVE7QUFDdEIsY0FBYyxRQUFRO0FBQ3RCLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlEQUFpRCxPQUFPOztBQUV4RDtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7O0FBS0M7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDM0k2QjtBQUNPOztBQUVyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZSxRQUFRO0FBQ3ZCLGVBQWUsUUFBUTtBQUN2QixlQUFlLFFBQVE7QUFDdkI7QUFDQSxnQkFBZ0IsUUFBUTtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHlCQUF5QixpREFBSztBQUM5Qix5QkFBeUIsaURBQUs7QUFDOUI7O0FBRUEsVUFBVTtBQUNWO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLGVBQWUsZUFBZSxxQkFBcUIsR0FBRyxzQkFBc0IsR0FBRywwQkFBMEI7QUFDeEgsZUFBZSxlQUFlLGFBQWEsbUJBQW1CLEdBQUcsb0JBQW9CO0FBQ3JGLGVBQWUsZUFBZSxZQUFZLG9DQUFvQyxHQUFHLCtCQUErQjtBQUNoSDtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLDhDQUE4QyxVQUFVLGdCQUFnQjtBQUM1RztBQUNBO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0E7O0FBRUE7QUFDQSx5Q0FBeUMscURBQXFEO0FBQzlGO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZSxRQUFRO0FBQ3ZCLGVBQWUsUUFBUTtBQUN2QixlQUFlLFFBQVE7QUFDdkIsZUFBZSxlQUFlO0FBQzlCO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHdCQUF3QixvREFBUTtBQUNoQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsZ0NBQWdDLG9EQUFRO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLEdBQUcscUJBQXFCLEdBQUcscUJBQXFCLElBQUkscUJBQXFCLEVBQUUscUJBQXFCO0FBQ3JIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHdCQUF3QjtBQUNoRDtBQUNBOztBQUVBO0FBQ0EsOEJBQThCLGlEQUFLLDRDQUE0QyxpREFBSztBQUNwRiw0QkFBNEIsaURBQUssNENBQTRDLGlEQUFLOztBQUVsRjs7QUFFQSwwQkFBMEIsb0RBQVE7QUFDbEM7O0FBRUE7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSwwQkFBMEIsb0RBQVE7QUFDbEM7O0FBRUE7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHdCQUF3QjtBQUNoRDtBQUNBOztBQUVBO0FBQ0EsOEJBQThCLGlEQUFLLDRDQUE0QyxpREFBSztBQUNwRiw0QkFBNEIsaURBQUssNENBQTRDLGlEQUFLOztBQUVsRjtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsb0RBQVE7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFLQzs7Ozs7Ozs7Ozs7Ozs7O0FDbFBEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxxQ0FBcUM7QUFDckM7QUFDQTs7QUFFQTtBQUNBOztBQUVBLDhDQUE4QztBQUM5Qzs7QUFFQSxpREFBaUQ7QUFDakQsMkNBQTJDOztBQUUzQztBQUNBO0FBQ0Esa0RBQWtEOztBQUVsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFFBQVE7QUFDdkIsZUFBZSxRQUFRO0FBQ3ZCO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFFBQVE7QUFDdkI7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxLQUFLO0FBQ3BCLGVBQWUsS0FBSztBQUNwQixlQUFlLEtBQUs7QUFDcEIsZUFBZSxLQUFLO0FBQ3BCLGVBQWUsS0FBSztBQUNwQixlQUFlLEtBQUs7QUFDcEI7QUFDQSxnQkFBZ0IsWUFBWTtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLEtBQUs7QUFDcEIsZUFBZSxLQUFLO0FBQ3BCLGVBQWUsS0FBSztBQUNwQjtBQUNBLGdCQUFnQixZQUFZO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFFBQVE7QUFDdkIsZUFBZSxRQUFRO0FBQ3ZCLGVBQWUsUUFBUTtBQUN2QixlQUFlLFFBQVE7QUFDdkI7QUFDQSxnQkFBZ0IsWUFBWTtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZSxRQUFRO0FBQ3ZCLGVBQWUsUUFBUTtBQUN2QixlQUFlLFFBQVE7QUFDdkIsZUFBZSxRQUFRO0FBQ3ZCO0FBQ0EsZ0JBQWdCLFlBQVk7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFFBQVE7QUFDdkIsZUFBZSxRQUFRO0FBQ3ZCLGVBQWUsUUFBUTtBQUN2QjtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7O0FBR0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUtDOzs7Ozs7Ozs7Ozs7Ozs7QUM3dUJEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsYUFBYSxHQUFHLFVBQVU7QUFDL0M7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFFBQVE7QUFDdkIsZUFBZSxRQUFRO0FBQ3ZCLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsUUFBUTtBQUN2QixnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZSxRQUFRO0FBQ3ZCLGVBQWUsUUFBUTtBQUN2QixlQUFlLFFBQVE7QUFDdkIsZUFBZSxRQUFRO0FBQ3ZCO0FBQ0EsZ0JBQWdCLFFBQVEsR0FBRztBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFFBQVE7QUFDdkIsZUFBZSxRQUFRO0FBQ3ZCLGVBQWUsUUFBUTtBQUN2QixlQUFlLFFBQVE7QUFDdkI7QUFDQSxnQkFBZ0IsUUFBUTtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsT0FBTztBQUN2QixlQUFlLE9BQU8sV0FBVyxtQkFBbUIsR0FBRyxtQkFBbUI7QUFDMUUsZUFBZSxRQUFRO0FBQ3ZCLGVBQWUsUUFBUTtBQUN2QjtBQUNBLGdCQUFnQixRQUFRLEdBQUc7QUFDM0I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQSxpREFBaUQsUUFBUTtBQUN6RDtBQUNBO0FBQ0E7O0FBRUEsZ0NBQWdDLE9BQU87QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsSUFBSTtBQUNiOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsUUFBUTtBQUN2QixlQUFlLE9BQU87QUFDdEIsZUFBZSxRQUFRO0FBQ3ZCO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxRQUFRO0FBQ3ZCLGVBQWUsVUFBVTtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsK0ZBQStGO0FBQy9GO0FBQ0E7QUFDQTs7O0FBTUM7Ozs7Ozs7O1VDcE5EO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ042QztBQUNIO0FBQ047QUFDVztBQUNJOztBQUVTIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYXN0cm9sb2d5L3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvY2hhcnRzL0NoYXJ0LmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy9jaGFydHMvUmFkaXhDaGFydC5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvY2hhcnRzL1RyYW5zaXRDaGFydC5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvcG9pbnRzL1BvaW50LmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy9zZXR0aW5ncy9EZWZhdWx0U2V0dGluZ3MuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL3NldHRpbmdzL2NvbnN0YW50cy9Bc3BlY3RzLmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy9zZXR0aW5ncy9jb25zdGFudHMvQ29sb3JzLmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy9zZXR0aW5ncy9jb25zdGFudHMvUG9pbnQuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL3NldHRpbmdzL2NvbnN0YW50cy9SYWRpeC5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvc2V0dGluZ3MvY29uc3RhbnRzL1RyYW5zaXQuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL3NldHRpbmdzL2NvbnN0YW50cy9Vbml2ZXJzZS5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvdW5pdmVyc2UvVW5pdmVyc2UuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL3V0aWxzL0FzcGVjdFV0aWxzLmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy91dGlscy9TVkdVdGlscy5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvdXRpbHMvVXRpbHMuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2FzdHJvbG9neS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcImFzdHJvbG9neVwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJhc3Ryb2xvZ3lcIl0gPSBmYWN0b3J5KCk7XG59KShzZWxmLCAoKSA9PiB7XG5yZXR1cm4gIiwiaW1wb3J0IFV0aWxzIGZyb20gJy4uL3V0aWxzL1V0aWxzLmpzJztcblxuLy8gbm9pbnNwZWN0aW9uIEpTVW51c2VkR2xvYmFsU3ltYm9sc1xuLyoqXG4gKiBAY2xhc3NcbiAqIEBjbGFzc2Rlc2MgQW4gYWJzdHJhY3QgY2xhc3MgZm9yIGFsbCB0eXBlIG9mIENoYXJ0XG4gKiBAcHVibGljXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKiBAYWJzdHJhY3RcbiAqL1xuY2xhc3MgQ2hhcnQge1xuXG4gIC8vI3NldHRpbmdzXG5cbiAgLyoqXG4gICAqIEBjb25zdHJ1Y3RzXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzZXR0aW5nc1xuICAgKi9cbiAgY29uc3RydWN0b3Ioc2V0dGluZ3MpIHtcbiAgICAvL3RoaXMuI3NldHRpbmdzID0gc2V0dGluZ3NcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgZGF0YSBpcyB2YWxpZFxuICAgKiBAdGhyb3dzIHtFcnJvcn0gLSBpZiB0aGUgZGF0YSBpcyB1bmRlZmluZWQuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gICAqIEByZXR1cm4ge09iamVjdH0gLSB7aXNWYWxpZDpib29sZWFuLCBtZXNzYWdlOlN0cmluZ31cbiAgICovXG4gIHZhbGlkYXRlRGF0YShkYXRhKSB7XG4gICAgaWYgKCFkYXRhKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNaXNpbmcgcGFyYW0gZGF0YS5cIilcbiAgICB9XG5cbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoZGF0YS5wb2ludHMpKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpc1ZhbGlkOiBmYWxzZSxcbiAgICAgICAgbWVzc2FnZTogXCJwb2ludHMgaXMgbm90IEFycmF5LlwiXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGRhdGEuY3VzcHMpKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpc1ZhbGlkOiBmYWxzZSxcbiAgICAgICAgbWVzc2FnZTogXCJjdXBzIGlzIG5vdCBBcnJheS5cIlxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChkYXRhLmN1c3BzLmxlbmd0aCAhPT0gMTIpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlzVmFsaWQ6IGZhbHNlLFxuICAgICAgICBtZXNzYWdlOiBcImN1c3BzLmxlbmd0aCAhPT0gMTJcIlxuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAobGV0IHBvaW50IG9mIGRhdGEucG9pbnRzKSB7XG4gICAgICBpZiAodHlwZW9mIHBvaW50Lm5hbWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaXNWYWxpZDogZmFsc2UsXG4gICAgICAgICAgbWVzc2FnZTogXCJwb2ludC5uYW1lICE9PSAnc3RyaW5nJ1wiXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChwb2ludC5uYW1lLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGlzVmFsaWQ6IGZhbHNlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwicG9pbnQubmFtZS5sZW5ndGggPT0gMFwiXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgcG9pbnQuYW5nbGUgIT09ICdudW1iZXInKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaXNWYWxpZDogZmFsc2UsXG4gICAgICAgICAgbWVzc2FnZTogXCJwb2ludC5hbmdsZSAhPT0gJ251bWJlcidcIlxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChsZXQgY3VzcCBvZiBkYXRhLmN1c3BzKSB7XG4gICAgICBpZiAodHlwZW9mIGN1c3AuYW5nbGUgIT09ICdudW1iZXInKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaXNWYWxpZDogZmFsc2UsXG4gICAgICAgICAgbWVzc2FnZTogXCJjdXNwLmFuZ2xlICE9PSAnbnVtYmVyJ1wiXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgaXNWYWxpZDogdHJ1ZSxcbiAgICAgIG1lc3NhZ2U6IFwiXCJcbiAgICB9XG4gIH1cbiAgXG4gIC8qKlxuICAgKiBAYWJzdHJhY3RcbiAgICovXG4gIHNldERhdGEoZGF0YSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIk11c3QgYmUgaW1wbGVtZW50ZWQgYnkgc3ViY2xhc3MuXCIpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBhYnN0cmFjdFxuICAgKi9cbiAgZ2V0UG9pbnRzKCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIk11c3QgYmUgaW1wbGVtZW50ZWQgYnkgc3ViY2xhc3MuXCIpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBhYnN0cmFjdFxuICAgKi9cbiAgZ2V0UG9pbnQobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIk11c3QgYmUgaW1wbGVtZW50ZWQgYnkgc3ViY2xhc3MuXCIpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBhYnN0cmFjdFxuICAgKi9cbiAgYW5pbWF0ZVRvKGRhdGEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJNdXN0IGJlIGltcGxlbWVudGVkIGJ5IHN1YmNsYXNzLlwiKTtcbiAgfVxuXG4gIC8vICMjIFBST1RFQ1RFRCAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxufVxuXG5leHBvcnQge1xuICBDaGFydCBhc1xuICBkZWZhdWx0XG59XG4iLCJpbXBvcnQgVW5pdmVyc2UgZnJvbSAnLi4vdW5pdmVyc2UvVW5pdmVyc2UuanMnO1xuaW1wb3J0IFNWR1V0aWxzIGZyb20gJy4uL3V0aWxzL1NWR1V0aWxzLmpzJztcbmltcG9ydCBVdGlscyBmcm9tICcuLi91dGlscy9VdGlscy5qcyc7XG5pbXBvcnQgQXNwZWN0VXRpbHMgZnJvbSAnLi4vdXRpbHMvQXNwZWN0VXRpbHMuanMnO1xuaW1wb3J0IENoYXJ0IGZyb20gJy4vQ2hhcnQuanMnXG5pbXBvcnQgUG9pbnQgZnJvbSAnLi4vcG9pbnRzL1BvaW50LmpzJ1xuaW1wb3J0IERlZmF1bHRTZXR0aW5ncyBmcm9tICcuLi9zZXR0aW5ncy9EZWZhdWx0U2V0dGluZ3MuanMnO1xuXG4vKipcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyBQb2ludHMgYW5kIGN1cHMgYXJlIGRpc3BsYXllZCBpbnNpZGUgdGhlIFVuaXZlcnNlLlxuICogQHB1YmxpY1xuICogQGV4dGVuZHMge0NoYXJ0fVxuICovXG5jbGFzcyBSYWRpeENoYXJ0IGV4dGVuZHMgQ2hhcnQge1xuXG4gICAgLypcbiAgICAgKiBMZXZlbHMgZGV0ZXJtaW5lIHRoZSB3aWR0aCBvZiBpbmRpdmlkdWFsIHBhcnRzIG9mIHRoZSBjaGFydC5cbiAgICAgKiBJdCBjYW4gYmUgY2hhbmdlZCBkeW5hbWljYWxseSBieSBwdWJsaWMgc2V0dGVyLlxuICAgICAqL1xuICAgICNudW1iZXJPZkxldmVscyA9IDI0XG5cbiAgICAjdW5pdmVyc2VcbiAgICAjc2V0dGluZ3NcbiAgICAjcm9vdFxuICAgICNkYXRhXG5cbiAgICAjY2VudGVyWFxuICAgICNjZW50ZXJZXG4gICAgI3JhZGl1c1xuXG4gICAgLypcbiAgICAgKiBAc2VlIFV0aWxzLmNsZWFuVXAoKVxuICAgICAqL1xuICAgICNiZWZvcmVDbGVhblVwSG9va1xuXG4gICAgLyoqXG4gICAgICogQGNvbnN0cnVjdHNcbiAgICAgKiBAcGFyYW0ge1VuaXZlcnNlfSBVbml2ZXJzZVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHVuaXZlcnNlKSB7XG5cbiAgICAgICAgaWYgKCEgdW5pdmVyc2UgaW5zdGFuY2VvZiBVbml2ZXJzZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdCYWQgcGFyYW0gdW5pdmVyc2UuJylcbiAgICAgICAgfVxuXG4gICAgICAgIHN1cGVyKHVuaXZlcnNlLmdldFNldHRpbmdzKCkpXG5cbiAgICAgICAgdGhpcy4jdW5pdmVyc2UgPSB1bml2ZXJzZVxuICAgICAgICB0aGlzLiNzZXR0aW5ncyA9IHRoaXMuI3VuaXZlcnNlLmdldFNldHRpbmdzKClcbiAgICAgICAgdGhpcy4jY2VudGVyWCA9IHRoaXMuI3NldHRpbmdzLkNIQVJUX1ZJRVdCT1hfV0lEVEggLyAyXG4gICAgICAgIHRoaXMuI2NlbnRlclkgPSB0aGlzLiNzZXR0aW5ncy5DSEFSVF9WSUVXQk9YX0hFSUdIVCAvIDJcbiAgICAgICAgdGhpcy4jcmFkaXVzID0gTWF0aC5taW4odGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSkgLSB0aGlzLiNzZXR0aW5ncy5DSEFSVF9QQURESU5HXG4gICAgICAgIHRoaXMuI3Jvb3QgPSBTVkdVdGlscy5TVkdHcm91cCgpXG4gICAgICAgIHRoaXMuI3Jvb3Quc2V0QXR0cmlidXRlKFwiaWRcIiwgYCR7dGhpcy4jc2V0dGluZ3MuSFRNTF9FTEVNRU5UX0lEfS0ke3RoaXMuI3NldHRpbmdzLlJBRElYX0lEfWApXG4gICAgICAgIHRoaXMuI3VuaXZlcnNlLmdldFNWR0RvY3VtZW50KCkuYXBwZW5kQ2hpbGQodGhpcy4jcm9vdCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXQgY2hhcnQgZGF0YVxuICAgICAqIEB0aHJvd3Mge0Vycm9yfSAtIGlmIHRoZSBkYXRhIGlzIG5vdCB2YWxpZC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICAgICAqIEByZXR1cm4ge1JhZGl4Q2hhcnR9XG4gICAgICovXG4gICAgc2V0RGF0YShkYXRhKSB7XG4gICAgICAgIGxldCBzdGF0dXMgPSB0aGlzLnZhbGlkYXRlRGF0YShkYXRhKVxuICAgICAgICBpZiAoISBzdGF0dXMuaXNWYWxpZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHN0YXR1cy5tZXNzYWdlKVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy4jZGF0YSA9IGRhdGFcbiAgICAgICAgdGhpcy4jZHJhdyhkYXRhKVxuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IGRhdGFcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG4gICAgZ2V0RGF0YSgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIFwicG9pbnRzXCI6IFsuLi50aGlzLiNkYXRhLnBvaW50c10sXG4gICAgICAgICAgICBcImN1c3BzXCI6IFsuLi50aGlzLiNkYXRhLmN1c3BzXVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0IG51bWJlciBvZiBMZXZlbHMuXG4gICAgICogTGV2ZWxzIGRldGVybWluZSB0aGUgd2lkdGggb2YgaW5kaXZpZHVhbCBwYXJ0cyBvZiB0aGUgY2hhcnQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge051bWJlcn1cbiAgICAgKi9cbiAgICBzZXROdW1iZXJPZkxldmVscyhsZXZlbHMpIHtcbiAgICAgICAgdGhpcy4jbnVtYmVyT2ZMZXZlbHMgPSBNYXRoLm1heCgyNCwgbGV2ZWxzKVxuICAgICAgICBpZiAodGhpcy4jZGF0YSkge1xuICAgICAgICAgICAgdGhpcy4jZHJhdyh0aGlzLiNkYXRhKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgcmFkaXVzXG4gICAgICogQHJldHVybiB7TnVtYmVyfVxuICAgICAqL1xuICAgIGdldFJhZGl1cygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI3JhZGl1c1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCByYWRpdXNcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAgICovXG4gICAgZ2V0T3V0ZXJDaXJjbGVSYWRpdXMoKSB7XG4gICAgICAgIHJldHVybiAyNCAqICh0aGlzLmdldFJhZGl1cygpIC8gdGhpcy4jbnVtYmVyT2ZMZXZlbHMpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHJhZGl1c1xuICAgICAqIEByZXR1cm4ge051bWJlcn1cbiAgICAgKi9cbiAgICBnZXRJbm5lckNpcmNsZVJhZGl1cygpIHtcbiAgICAgICAgcmV0dXJuIDIxICogKHRoaXMuZ2V0UmFkaXVzKCkgLyB0aGlzLiNudW1iZXJPZkxldmVscylcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgcmFkaXVzXG4gICAgICogQHJldHVybiB7TnVtYmVyfVxuICAgICAqL1xuICAgIGdldFJ1bGxlckNpcmNsZVJhZGl1cygpIHtcbiAgICAgICAgcmV0dXJuIDIwICogKHRoaXMuZ2V0UmFkaXVzKCkgLyB0aGlzLiNudW1iZXJPZkxldmVscylcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgcmFkaXVzXG4gICAgICogQHJldHVybiB7TnVtYmVyfVxuICAgICAqL1xuICAgIGdldFBvaW50Q2lyY2xlUmFkaXVzKCkge1xuICAgICAgICByZXR1cm4gMTggKiAodGhpcy5nZXRSYWRpdXMoKSAvIHRoaXMuI251bWJlck9mTGV2ZWxzKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCByYWRpdXNcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAgICovXG4gICAgZ2V0Q2VudGVyQ2lyY2xlUmFkaXVzKCkge1xuICAgICAgICByZXR1cm4gMTIgKiAodGhpcy5nZXRSYWRpdXMoKSAvIHRoaXMuI251bWJlck9mTGV2ZWxzKSAqICh0aGlzLiNzZXR0aW5ncy5DSEFSVF9DRU5URVJfU0laRSA/PyAxKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBVbml2ZXJzZVxuICAgICAqXG4gICAgICogQHJldHVybiB7VW5pdmVyc2V9XG4gICAgICovXG4gICAgZ2V0VW5pdmVyc2UoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiN1bml2ZXJzZVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBBc2NlbmRhdCBzaGlmdFxuICAgICAqXG4gICAgICogQHJldHVybiB7TnVtYmVyfVxuICAgICAqL1xuICAgIGdldEFzY2VuZGFudFNoaWZ0KCkge1xuICAgICAgICByZXR1cm4gKHRoaXMuI2RhdGE/LmN1c3BzWzBdPy5hbmdsZSA/PyAwKSArIFV0aWxzLkRFR18xODBcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgYXNwZWN0c1xuICAgICAqXG4gICAgICogQHBhcmFtIHtBcnJheTxPYmplY3Q+fSBbZnJvbVBvaW50c10gLSBbe25hbWU6XCJNb29uXCIsIGFuZ2xlOjB9LCB7bmFtZTpcIlN1blwiLCBhbmdsZToxNzl9LCB7bmFtZTpcIk1lcmN1cnlcIiwgYW5nbGU6MTIxfV1cbiAgICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IFt0b1BvaW50c10gLSBbe25hbWU6XCJBU1wiLCBhbmdsZTowfSwge25hbWU6XCJJQ1wiLCBhbmdsZTo5MH1dXG4gICAgICogQHBhcmFtIHtBcnJheTxPYmplY3Q+fSBbYXNwZWN0c10gLSBbe25hbWU6XCJPcHBvc2l0aW9uXCIsIGFuZ2xlOjE4MCwgb3JiOjJ9LCB7bmFtZTpcIlRyaW5lXCIsIGFuZ2xlOjEyMCwgb3JiOjJ9XVxuICAgICAqXG4gICAgICogQHJldHVybiB7QXJyYXk8T2JqZWN0Pn1cbiAgICAgKi9cbiAgICBnZXRBc3BlY3RzKGZyb21Qb2ludHMsIHRvUG9pbnRzLCBhc3BlY3RzKSB7XG4gICAgICAgIGlmICghIHRoaXMuI2RhdGEpIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgZnJvbVBvaW50cyA9IGZyb21Qb2ludHMgPz8gdGhpcy4jZGF0YS5wb2ludHMuZmlsdGVyKHggPT4gXCJhc3BlY3RcIiBpbiB4ID8geC5hc3BlY3QgOiB0cnVlKVxuICAgICAgICB0b1BvaW50cyA9IHRvUG9pbnRzID8/IFsuLi50aGlzLiNkYXRhLnBvaW50cy5maWx0ZXIoeCA9PiBcImFzcGVjdFwiIGluIHggPyB4LmFzcGVjdCA6IHRydWUpLCAuLi50aGlzLiNkYXRhLmN1c3BzLmZpbHRlcih4ID0+IHguYXNwZWN0KV1cbiAgICAgICAgYXNwZWN0cyA9IGFzcGVjdHMgPz8gdGhpcy4jc2V0dGluZ3MuREVGQVVMVF9BU1BFQ1RTID8/IERlZmF1bHRTZXR0aW5ncy5ERUZBVUxUX0FTUEVDVFNcblxuICAgICAgICByZXR1cm4gQXNwZWN0VXRpbHMuZ2V0QXNwZWN0cyhmcm9tUG9pbnRzLCB0b1BvaW50cywgYXNwZWN0cykuZmlsdGVyKGFzcGVjdCA9PiBhc3BlY3QuZnJvbS5uYW1lICE9PSBhc3BlY3QudG8ubmFtZSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEcmF3IGFzcGVjdHNcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gW2Zyb21Qb2ludHNdIC0gW3tuYW1lOlwiTW9vblwiLCBhbmdsZTowfSwge25hbWU6XCJTdW5cIiwgYW5nbGU6MTc5fSwge25hbWU6XCJNZXJjdXJ5XCIsIGFuZ2xlOjEyMX1dXG4gICAgICogQHBhcmFtIHtBcnJheTxPYmplY3Q+fSBbdG9Qb2ludHNdIC0gW3tuYW1lOlwiQVNcIiwgYW5nbGU6MH0sIHtuYW1lOlwiSUNcIiwgYW5nbGU6OTB9XVxuICAgICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gW2FzcGVjdHNdIC0gW3tuYW1lOlwiT3Bwb3NpdGlvblwiLCBhbmdsZToxODAsIG9yYjoyfSwge25hbWU6XCJUcmluZVwiLCBhbmdsZToxMjAsIG9yYjoyfV1cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge0FycmF5PE9iamVjdD59XG4gICAgICovXG4gICAgZHJhd0FzcGVjdHMoZnJvbVBvaW50cywgdG9Qb2ludHMsIGFzcGVjdHMpIHtcbiAgICAgICAgY29uc3QgYXNwZWN0c1dyYXBwZXIgPSB0aGlzLiN1bml2ZXJzZS5nZXRBc3BlY3RzRWxlbWVudCgpXG4gICAgICAgIFV0aWxzLmNsZWFuVXAoYXNwZWN0c1dyYXBwZXIuZ2V0QXR0cmlidXRlKFwiaWRcIiksIHRoaXMuI2JlZm9yZUNsZWFuVXBIb29rKVxuXG4gICAgICAgIGNvbnN0IGFzcGVjdHNMaXN0ID0gdGhpcy5nZXRBc3BlY3RzKGZyb21Qb2ludHMsIHRvUG9pbnRzLCBhc3BlY3RzKVxuICAgICAgICAgICAgLnJlZHVjZSgoYXJyLCBhc3BlY3QpID0+IHtcblxuICAgICAgICAgICAgICAgIGxldCBpc1RoZVNhbWUgPSBhcnIuc29tZShlbG0gPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZWxtLmZyb20ubmFtZSA9PT0gYXNwZWN0LnRvLm5hbWUgJiYgZWxtLnRvLm5hbWUgPT09IGFzcGVjdC5mcm9tLm5hbWVcbiAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgaWYgKCEgaXNUaGVTYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIGFyci5wdXNoKGFzcGVjdClcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gYXJyXG4gICAgICAgICAgICB9LCBbXSlcbiAgICAgICAgICAgIC5maWx0ZXIoYXNwZWN0ID0+IGFzcGVjdC5hc3BlY3QubmFtZSAhPT0gJ0Nvbmp1bmN0aW9uJylcblxuICAgICAgICBjb25zdCBjaXJjbGUgPSBTVkdVdGlscy5TVkdDaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy5nZXRDZW50ZXJDaXJjbGVSYWRpdXMoKSlcbiAgICAgICAgY2lyY2xlLnNldEF0dHJpYnV0ZSgnZmlsbCcsIHRoaXMuI3NldHRpbmdzLkFTUEVDVFNfQkFDS0dST1VORF9DT0xPUilcbiAgICAgICAgYXNwZWN0c1dyYXBwZXIuYXBwZW5kQ2hpbGQoY2lyY2xlKVxuXG4gICAgICAgIGFzcGVjdHNXcmFwcGVyLmFwcGVuZENoaWxkKEFzcGVjdFV0aWxzLmRyYXdBc3BlY3RzKHRoaXMuZ2V0Q2VudGVyQ2lyY2xlUmFkaXVzKCksIHRoaXMuZ2V0QXNjZW5kYW50U2hpZnQoKSwgdGhpcy4jc2V0dGluZ3MsIGFzcGVjdHNMaXN0KSlcblxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIC8vICMjIFBSSVZBVEUgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiAgICAvKlxuICAgICAqIERyYXcgcmFkaXggY2hhcnRcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICAgICAqL1xuICAgICNkcmF3KGRhdGEpIHtcbiAgICAgICAgVXRpbHMuY2xlYW5VcCh0aGlzLiNyb290LmdldEF0dHJpYnV0ZSgnaWQnKSwgdGhpcy4jYmVmb3JlQ2xlYW5VcEhvb2spXG4gICAgICAgIHRoaXMuI2RyYXdCYWNrZ3JvdW5kKClcbiAgICAgICAgdGhpcy4jZHJhd0FzdHJvbG9naWNhbFNpZ25zKClcbiAgICAgICAgdGhpcy4jZHJhd0N1c3BzKGRhdGEpXG4gICAgICAgIHRoaXMuI2RyYXdQb2ludHMoZGF0YSlcbiAgICAgICAgdGhpcy4jZHJhd1J1bGVyKClcbiAgICAgICAgdGhpcy4jZHJhd0JvcmRlcnMoKVxuICAgICAgICB0aGlzLiNzZXR0aW5ncy5DSEFSVF9EUkFXX01BSU5fQVhJUyAmJiB0aGlzLiNkcmF3TWFpbkF4aXNEZXNjcmlwdGlvbihkYXRhKVxuICAgICAgICB0aGlzLiNzZXR0aW5ncy5EUkFXX0FTUEVDVFMgJiYgdGhpcy5kcmF3QXNwZWN0cygpXG4gICAgfVxuXG4gICAgI2RyYXdCYWNrZ3JvdW5kKCkge1xuICAgICAgICBjb25zdCBNQVNLX0lEID0gYCR7dGhpcy4jc2V0dGluZ3MuSFRNTF9FTEVNRU5UX0lEfS0ke3RoaXMuI3NldHRpbmdzLlJBRElYX0lEfS1iYWNrZ3JvdW5kLW1hc2stMWBcblxuICAgICAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuICAgICAgICB3cmFwcGVyLmNsYXNzTGlzdC5hZGQoJ2MtcmFkaXgtYmFja2dyb3VuZCcpXG5cbiAgICAgICAgY29uc3QgbWFzayA9IFNWR1V0aWxzLlNWR01hc2soTUFTS19JRClcbiAgICAgICAgY29uc3Qgb3V0ZXJDaXJjbGUgPSBTVkdVdGlscy5TVkdDaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy5nZXRSYWRpdXMoKSlcbiAgICAgICAgb3V0ZXJDaXJjbGUuc2V0QXR0cmlidXRlKCdmaWxsJywgXCJ3aGl0ZVwiKVxuICAgICAgICBtYXNrLmFwcGVuZENoaWxkKG91dGVyQ2lyY2xlKVxuXG4gICAgICAgIGNvbnN0IGlubmVyQ2lyY2xlID0gU1ZHVXRpbHMuU1ZHQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuZ2V0Q2VudGVyQ2lyY2xlUmFkaXVzKCkpXG4gICAgICAgIGlubmVyQ2lyY2xlLnNldEF0dHJpYnV0ZSgnZmlsbCcsIFwiYmxhY2tcIilcbiAgICAgICAgbWFzay5hcHBlbmRDaGlsZChpbm5lckNpcmNsZSlcbiAgICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChtYXNrKVxuXG4gICAgICAgIGNvbnN0IGNpcmNsZSA9IFNWR1V0aWxzLlNWR0NpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLmdldFJhZGl1cygpKVxuICAgICAgICBjaXJjbGUuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0VfT05MWSA/IFwibm9uZVwiIDogdGhpcy4jc2V0dGluZ3MuUExBTkVUU19CQUNLR1JPVU5EX0NPTE9SKTtcbiAgICAgICAgY2lyY2xlLnNldEF0dHJpYnV0ZShcIm1hc2tcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFX09OTFkgPyBcIm5vbmVcIiA6IGB1cmwoIyR7TUFTS19JRH0pYCk7XG4gICAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoY2lyY2xlKVxuXG4gICAgICAgIHRoaXMuI3Jvb3QucGFyZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYy1iYWNrZ3JvdW5kcycpLmFwcGVuZENoaWxkKHdyYXBwZXIpXG4gICAgfVxuXG4gICAgI2RyYXdBc3Ryb2xvZ2ljYWxTaWducygpIHtcbiAgICAgICAgY29uc3QgTlVNQkVSX09GX0FTVFJPTE9HSUNBTF9TSUdOUyA9IDEyXG4gICAgICAgIGNvbnN0IFNURVAgPSAzMCAvL2RlZ3JlZVxuICAgICAgICBjb25zdCBDT0xPUlNfU0lHTlMgPSBbdGhpcy4jc2V0dGluZ3MuQ09MT1JfQVJJRVMsIHRoaXMuI3NldHRpbmdzLkNPTE9SX1RBVVJVUywgdGhpcy4jc2V0dGluZ3MuQ09MT1JfR0VNSU5JLCB0aGlzLiNzZXR0aW5ncy5DT0xPUl9DQU5DRVIsIHRoaXMuI3NldHRpbmdzLkNPTE9SX0xFTywgdGhpcy4jc2V0dGluZ3MuQ09MT1JfVklSR08sIHRoaXMuI3NldHRpbmdzLkNPTE9SX0xJQlJBLCB0aGlzLiNzZXR0aW5ncy5DT0xPUl9TQ09SUElPLCB0aGlzLiNzZXR0aW5ncy5DT0xPUl9TQUdJVFRBUklVUywgdGhpcy4jc2V0dGluZ3MuQ09MT1JfQ0FQUklDT1JOLCB0aGlzLiNzZXR0aW5ncy5DT0xPUl9BUVVBUklVUywgdGhpcy4jc2V0dGluZ3MuQ09MT1JfUElTQ0VTXVxuICAgICAgICBjb25zdCBTWU1CT0xfU0lHTlMgPSBbU1ZHVXRpbHMuU1lNQk9MX0FSSUVTLCBTVkdVdGlscy5TWU1CT0xfVEFVUlVTLCBTVkdVdGlscy5TWU1CT0xfR0VNSU5JLCBTVkdVdGlscy5TWU1CT0xfQ0FOQ0VSLCBTVkdVdGlscy5TWU1CT0xfTEVPLCBTVkdVdGlscy5TWU1CT0xfVklSR08sIFNWR1V0aWxzLlNZTUJPTF9MSUJSQSwgU1ZHVXRpbHMuU1lNQk9MX1NDT1JQSU8sIFNWR1V0aWxzLlNZTUJPTF9TQUdJVFRBUklVUywgU1ZHVXRpbHMuU1lNQk9MX0NBUFJJQ09STiwgU1ZHVXRpbHMuU1lNQk9MX0FRVUFSSVVTLCBTVkdVdGlscy5TWU1CT0xfUElTQ0VTXVxuXG4gICAgICAgIGlmIChDT0xPUlNfU0lHTlMubGVuZ3RoICE9PSAxMikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignTWlzc2luZyBlbnRyaWVzIGluIENPTE9SX1NJR05TLCByZXF1aXJlcyAxMiBlbnRyaWVzJyk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBtYWtlU3ltYm9sID0gKHN5bWJvbEluZGV4LCBhbmdsZUluRGVncmVlKSA9PiB7XG4gICAgICAgICAgICBsZXQgcG9zaXRpb24gPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuZ2V0T3V0ZXJDaXJjbGVSYWRpdXMoKSAtICgodGhpcy5nZXRPdXRlckNpcmNsZVJhZGl1cygpIC0gdGhpcy5nZXRJbm5lckNpcmNsZVJhZGl1cygpKSAvIDIpLCBVdGlscy5kZWdyZWVUb1JhZGlhbihhbmdsZUluRGVncmVlICsgU1RFUCAvIDIsIHRoaXMuZ2V0QXNjZW5kYW50U2hpZnQoKSkpXG5cbiAgICAgICAgICAgIGxldCBzeW1ib2wgPSBTVkdVdGlscy5TVkdTeW1ib2woU1lNQk9MX1NJR05TW3N5bWJvbEluZGV4XSwgcG9zaXRpb24ueCwgcG9zaXRpb24ueSlcbiAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJmb250LWZhbWlseVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9GT05UX0ZBTUlMWSk7XG4gICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIikgLy8gc3RhcnQsIG1pZGRsZSwgZW5kXG4gICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcbiAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJmb250LXNpemVcIiwgdGhpcy4jc2V0dGluZ3MuUkFESVhfU0lHTlNfRk9OVF9TSVpFKTtcbiAgICAgICAgICAgIGlmICh0aGlzLiNzZXR0aW5ncy5TSUdOX0NPTE9SX0NJUkNMRSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIHRoaXMuI3NldHRpbmdzLlNJR05fQ09MT1JfQ0lSQ0xFKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgdGhpcy4jc2V0dGluZ3MuU0lHTl9DT0xPUlNbc3ltYm9sSW5kZXhdID8/IHRoaXMuI3NldHRpbmdzLkNIQVJUX1NJR05TX0NPTE9SKTtcbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICBpZiAodGhpcy4jc2V0dGluZ3MuQ0xBU1NfU0lHTikge1xuICAgICAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgdGhpcy4jc2V0dGluZ3MuQ0xBU1NfU0lHTiArICcgJyArIHRoaXMuI3NldHRpbmdzLkNMQVNTX1NJR04gKyAnLS0nICsgU1lNQk9MX1NJR05TW3N5bWJvbEluZGV4XS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuI3NldHRpbmdzLlNZTUJPTF9TVFJPS0UpIHtcbiAgICAgICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKCdwYWludC1vcmRlcicsICdzdHJva2UnKTtcbiAgICAgICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKCdzdHJva2UnLCB0aGlzLiNzZXR0aW5ncy5TWU1CT0xfU1RST0tFX0NPTE9SKTtcbiAgICAgICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKCdzdHJva2Utd2lkdGgnLCB0aGlzLiNzZXR0aW5ncy5TWU1CT0xfU1RST0tFX1dJRFRIKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHN5bWJvbFxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbWFrZVNlZ21lbnQgPSAoc3ltYm9sSW5kZXgsIGFuZ2xlRnJvbUluRGVncmVlLCBhbmdsZVRvSW5EZWdyZWUpID0+IHtcbiAgICAgICAgICAgIGxldCBhMSA9IFV0aWxzLmRlZ3JlZVRvUmFkaWFuKGFuZ2xlRnJvbUluRGVncmVlLCB0aGlzLmdldEFzY2VuZGFudFNoaWZ0KCkpXG4gICAgICAgICAgICBsZXQgYTIgPSBVdGlscy5kZWdyZWVUb1JhZGlhbihhbmdsZVRvSW5EZWdyZWUsIHRoaXMuZ2V0QXNjZW5kYW50U2hpZnQoKSlcbiAgICAgICAgICAgIGxldCBzZWdtZW50ID0gU1ZHVXRpbHMuU1ZHU2VnbWVudCh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLmdldE91dGVyQ2lyY2xlUmFkaXVzKCksIGExLCBhMiwgdGhpcy5nZXRJbm5lckNpcmNsZVJhZGl1cygpKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRV9XSVRIX0NPTE9SKSB7XG4gICAgICAgICAgICAgICAgc2VnbWVudC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIENPTE9SU19TSUdOU1tzeW1ib2xJbmRleF0pO1xuICAgICAgICAgICAgICAgIHNlZ21lbnQuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNJUkNMRV9DT0xPUik7XG4gICAgICAgICAgICAgICAgc2VnbWVudC5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2VnbWVudC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRV9PTkxZID8gXCJub25lXCIgOiBDT0xPUlNfU0lHTlNbc3ltYm9sSW5kZXhdKTtcbiAgICAgICAgICAgICAgICBzZWdtZW50LnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0VfT05MWSA/IHRoaXMuI3NldHRpbmdzLkNJUkNMRV9DT0xPUiA6IFwibm9uZVwiKTtcbiAgICAgICAgICAgICAgICBzZWdtZW50LnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0VfT05MWSA/IHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRSA6IDApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy4jc2V0dGluZ3MuQ0xBU1NfU0lHTl9TRUdNRU5UKSB7XG4gICAgICAgICAgICAgICAgc2VnbWVudC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgdGhpcy4jc2V0dGluZ3MuQ0xBU1NfU0lHTl9TRUdNRU5UICsgJyAnICsgdGhpcy4jc2V0dGluZ3MuQ0xBU1NfU0lHTl9TRUdNRU5UICsgU1lNQk9MX1NJR05TW3N5bWJvbEluZGV4XS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHNlZ21lbnRcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBzdGFydEFuZ2xlID0gMFxuICAgICAgICBsZXQgZW5kQW5nbGUgPSBzdGFydEFuZ2xlICsgU1RFUFxuXG4gICAgICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG4gICAgICAgIHdyYXBwZXIuY2xhc3NMaXN0LmFkZCgnYy1yYWRpeC1hc3Ryb2xvZ2ljYWwtc2lnbnMnKVxuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgTlVNQkVSX09GX0FTVFJPTE9HSUNBTF9TSUdOUzsgaSsrKSB7XG5cbiAgICAgICAgICAgIGxldCBzZWdtZW50ID0gbWFrZVNlZ21lbnQoaSwgc3RhcnRBbmdsZSwgZW5kQW5nbGUpXG4gICAgICAgICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHNlZ21lbnQpO1xuXG4gICAgICAgICAgICBsZXQgc3ltYm9sID0gbWFrZVN5bWJvbChpLCBzdGFydEFuZ2xlKVxuICAgICAgICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChzeW1ib2wpO1xuXG4gICAgICAgICAgICBzdGFydEFuZ2xlICs9IFNURVA7XG4gICAgICAgICAgICBlbmRBbmdsZSA9IHN0YXJ0QW5nbGUgKyBTVEVQXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLiNyb290LmFwcGVuZENoaWxkKHdyYXBwZXIpXG4gICAgfVxuXG4gICAgI2RyYXdSdWxlcigpIHtcbiAgICAgICAgY29uc3QgTlVNQkVSX09GX0RJVklERVJTID0gNzJcbiAgICAgICAgY29uc3QgU1RFUCA9IDVcblxuICAgICAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuICAgICAgICB3cmFwcGVyLmNsYXNzTGlzdC5hZGQoJ2MtcmFkaXgtcnVsZXInKVxuXG4gICAgICAgIGxldCBzdGFydEFuZ2xlID0gdGhpcy5nZXRBc2NlbmRhbnRTaGlmdCgpXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgTlVNQkVSX09GX0RJVklERVJTOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBzdGFydFBvaW50ID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLmdldFJ1bGxlckNpcmNsZVJhZGl1cygpLCBVdGlscy5kZWdyZWVUb1JhZGlhbihzdGFydEFuZ2xlKSlcbiAgICAgICAgICAgIGxldCBlbmRQb2ludCA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgKGkgJSAyKSA/IHRoaXMuZ2V0SW5uZXJDaXJjbGVSYWRpdXMoKSAtICgodGhpcy5nZXRJbm5lckNpcmNsZVJhZGl1cygpIC0gdGhpcy5nZXRSdWxsZXJDaXJjbGVSYWRpdXMoKSkgLyAyKSA6IHRoaXMuZ2V0SW5uZXJDaXJjbGVSYWRpdXMoKSwgVXRpbHMuZGVncmVlVG9SYWRpYW4oc3RhcnRBbmdsZSkpXG4gICAgICAgICAgICBjb25zdCBsaW5lID0gU1ZHVXRpbHMuU1ZHTGluZShzdGFydFBvaW50LngsIHN0YXJ0UG9pbnQueSwgZW5kUG9pbnQueCwgZW5kUG9pbnQueSk7XG4gICAgICAgICAgICBsaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9MSU5FX0NPTE9SKTtcbiAgICAgICAgICAgIGxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRSk7XG4gICAgICAgICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGxpbmUpO1xuXG4gICAgICAgICAgICBzdGFydEFuZ2xlICs9IFNURVBcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNpcmNsZSA9IFNWR1V0aWxzLlNWR0NpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLmdldFJ1bGxlckNpcmNsZVJhZGl1cygpKTtcbiAgICAgICAgY2lyY2xlLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9DSVJDTEVfQ09MT1IpO1xuICAgICAgICBjaXJjbGUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRSk7XG4gICAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoY2lyY2xlKTtcblxuICAgICAgICB0aGlzLiNyb290LmFwcGVuZENoaWxkKHdyYXBwZXIpXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBEcmF3IHBvaW50c1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIC0gY2hhcnQgZGF0YVxuICAgICAqL1xuICAgICNkcmF3UG9pbnRzKGRhdGEpIHtcbiAgICAgICAgY29uc3QgcG9pbnRzID0gZGF0YS5wb2ludHNcbiAgICAgICAgY29uc3QgY3VzcHMgPSBkYXRhLmN1c3BzXG4gICAgICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG4gICAgICAgIHdyYXBwZXIuY2xhc3NMaXN0LmFkZCgnYy1yYWRpeC1wb2ludHMnKVxuXG4gICAgICAgIGNvbnN0IHBvc2l0aW9ucyA9IFV0aWxzLmNhbGN1bGF0ZVBvc2l0aW9uV2l0aG91dE92ZXJsYXBwaW5nKHBvaW50cywgdGhpcy4jc2V0dGluZ3MuUE9JTlRfQ09MTElTSU9OX1JBRElVUywgdGhpcy5nZXRQb2ludENpcmNsZVJhZGl1cygpKVxuXG4gICAgICAgIGZvciAoY29uc3QgcG9pbnREYXRhIG9mIHBvaW50cykge1xuICAgICAgICAgICAgY29uc3QgcG9pbnRHcm91cCA9IFNWR1V0aWxzLlNWR0dyb3VwKCk7XG4gICAgICAgICAgICBwb2ludEdyb3VwLmNsYXNzTGlzdC5hZGQoJ2MtcmFkaXgtcG9pbnQnKVxuICAgICAgICAgICAgcG9pbnRHcm91cC5jbGFzc0xpc3QuYWRkKCdjLXJhZGl4LXBvaW50LS0nICsgcG9pbnREYXRhLm5hbWUudG9Mb3dlckNhc2UoKSlcblxuICAgICAgICAgICAgY29uc3QgcG9pbnQgPSBuZXcgUG9pbnQocG9pbnREYXRhLCBjdXNwcywgdGhpcy4jc2V0dGluZ3MpXG4gICAgICAgICAgICBjb25zdCBwb2ludFBvc2l0aW9uID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJYLCB0aGlzLmdldFJ1bGxlckNpcmNsZVJhZGl1cygpIC0gKCh0aGlzLmdldElubmVyQ2lyY2xlUmFkaXVzKCkgLSB0aGlzLmdldFJ1bGxlckNpcmNsZVJhZGl1cygpKSAvIDQpLCBVdGlscy5kZWdyZWVUb1JhZGlhbihwb2ludC5nZXRBbmdsZSgpLCB0aGlzLmdldEFzY2VuZGFudFNoaWZ0KCkpKVxuICAgICAgICAgICAgY29uc3Qgc3ltYm9sUG9zaXRpb24gPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclgsIHRoaXMuZ2V0UG9pbnRDaXJjbGVSYWRpdXMoKSwgVXRpbHMuZGVncmVlVG9SYWRpYW4ocG9zaXRpb25zW3BvaW50LmdldE5hbWUoKV0sIHRoaXMuZ2V0QXNjZW5kYW50U2hpZnQoKSkpXG5cbiAgICAgICAgICAgIC8vIHJ1bGVyIG1hcmtcbiAgICAgICAgICAgIGNvbnN0IHJ1bGVyTGluZUVuZFBvc2l0aW9uID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJYLCB0aGlzLmdldFJ1bGxlckNpcmNsZVJhZGl1cygpLCBVdGlscy5kZWdyZWVUb1JhZGlhbihwb2ludC5nZXRBbmdsZSgpLCB0aGlzLmdldEFzY2VuZGFudFNoaWZ0KCkpKVxuXG4gICAgICAgICAgICBpZiAodGhpcy4jc2V0dGluZ3MuRFJBV19SVUxFUl9NQVJLKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcnVsZXJMaW5lID0gU1ZHVXRpbHMuU1ZHTGluZShwb2ludFBvc2l0aW9uLngsIHBvaW50UG9zaXRpb24ueSwgcnVsZXJMaW5lRW5kUG9zaXRpb24ueCwgcnVsZXJMaW5lRW5kUG9zaXRpb24ueSlcbiAgICAgICAgICAgICAgICBydWxlckxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0xJTkVfQ09MT1IpO1xuICAgICAgICAgICAgICAgIHJ1bGVyTGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFKTtcbiAgICAgICAgICAgICAgICBwb2ludEdyb3VwLmFwcGVuZENoaWxkKHJ1bGVyTGluZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTGluZSBmcm9tIHRoZSBydWxlciB0byB0aGUgY2VsZXN0aWFsIGJvZHlcbiAgICAgICAgICAgICAqIEB0eXBlIHt7eCwgeX19XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAvL2lmIChwb3NpdGlvbnNbcG9pbnQuZ2V0TmFtZSgpXSAhPSBwb2ludERhdGEucG9zaXRpb24pIHtcbiAgICAgICAgICAgIGNvbnN0IHBvaW50ZXJMaW5lRW5kUG9zaXRpb24gPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclgsIHRoaXMuZ2V0UG9pbnRDaXJjbGVSYWRpdXMoKSwgVXRpbHMuZGVncmVlVG9SYWRpYW4ocG9zaXRpb25zW3BvaW50LmdldE5hbWUoKV0sIHRoaXMuZ2V0QXNjZW5kYW50U2hpZnQoKSkpXG5cbiAgICAgICAgICAgIGxldCBwb2ludGVyTGluZTtcbiAgICAgICAgICAgIGlmICh0aGlzLiNzZXR0aW5ncy5EUkFXX1JVTEVSX01BUkspIHtcbiAgICAgICAgICAgICAgICBwb2ludGVyTGluZSA9IFNWR1V0aWxzLlNWR0xpbmUocG9pbnRQb3NpdGlvbi54LCBwb2ludFBvc2l0aW9uLnksIChwb2ludFBvc2l0aW9uLnggKyBwb2ludGVyTGluZUVuZFBvc2l0aW9uLngpIC8gMiwgKHBvaW50UG9zaXRpb24ueSArIHBvaW50ZXJMaW5lRW5kUG9zaXRpb24ueSkgLyAyKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwb2ludGVyTGluZSA9IFNWR1V0aWxzLlNWR0xpbmUocnVsZXJMaW5lRW5kUG9zaXRpb24ueCwgcnVsZXJMaW5lRW5kUG9zaXRpb24ueSwgKHBvaW50UG9zaXRpb24ueCArIHBvaW50ZXJMaW5lRW5kUG9zaXRpb24ueCkgLyAyLCAocG9pbnRQb3NpdGlvbi55ICsgcG9pbnRlckxpbmVFbmRQb3NpdGlvbi55KSAvIDIpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy4jc2V0dGluZ3MuUExBTkVUX0xJTkVfVVNFX1BMQU5FVF9DT0xPUikge1xuICAgICAgICAgICAgICAgIHBvaW50ZXJMaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5QTEFORVRfQ09MT1JTW3BvaW50RGF0YS5uYW1lXSA/PyB0aGlzLiNzZXR0aW5ncy5DSEFSVF9MSU5FX0NPTE9SKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcG9pbnRlckxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0xJTkVfQ09MT1IpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBwb2ludGVyTGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFIC8gMik7XG5cbiAgICAgICAgICAgIHBvaW50R3JvdXAuYXBwZW5kQ2hpbGQocG9pbnRlckxpbmUpO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIFN5bW5vbCBvZiB0aGUgY2VsZXN0aWFsIGJvZHkgKyBwb2ludHNcbiAgICAgICAgICAgICAqIEB0eXBlIHtTVkdFbGVtZW50fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBjb25zdCBzeW1ib2wgPSBwb2ludC5nZXRTeW1ib2woc3ltYm9sUG9zaXRpb24ueCwgc3ltYm9sUG9zaXRpb24ueSwgVXRpbHMuREVHXzAsIHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfU0hPVylcbiAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJmb250LWZhbWlseVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9GT05UX0ZBTUlMWSk7XG4gICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIikgLy8gc3RhcnQsIG1pZGRsZSwgZW5kXG4gICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcbiAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJmb250LXNpemVcIiwgdGhpcy4jc2V0dGluZ3MuUkFESVhfUE9JTlRTX0ZPTlRfU0laRSlcbiAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIHRoaXMuI3NldHRpbmdzLlBMQU5FVF9DT0xPUlNbcG9pbnREYXRhLm5hbWVdID8/IHRoaXMuI3NldHRpbmdzLkNIQVJUX1BPSU5UU19DT0xPUilcbiAgICAgICAgICAgIHBvaW50R3JvdXAuYXBwZW5kQ2hpbGQoc3ltYm9sKTtcblxuICAgICAgICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChwb2ludEdyb3VwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuI3Jvb3QuYXBwZW5kQ2hpbGQod3JhcHBlcilcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIERyYXcgcG9pbnRzXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGRhdGEgLSBjaGFydCBkYXRhXG4gICAgICovXG4gICAgI2RyYXdDdXNwcyhkYXRhKSB7XG4gICAgICAgIGNvbnN0IHBvaW50cyA9IGRhdGEucG9pbnRzXG4gICAgICAgIGNvbnN0IGN1c3BzID0gZGF0YS5jdXNwc1xuXG4gICAgICAgIGNvbnN0IG1haW5BeGlzSW5kZXhlcyA9IFswLCAzLCA2LCA5XSAvL0FzLCBJYywgRHMsIE1jXG5cbiAgICAgICAgY29uc3QgcG9pbnRzUG9zaXRpb25zID0gcG9pbnRzLm1hcChwb2ludCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gcG9pbnQuYW5nbGVcbiAgICAgICAgfSlcblxuICAgICAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuICAgICAgICB3cmFwcGVyLmNsYXNzTGlzdC5hZGQoJ2MtcmFkaXgtY3VzcHMnKVxuXG4gICAgICAgIGNvbnN0IHRleHRSYWRpdXMgPSB0aGlzLmdldENlbnRlckNpcmNsZVJhZGl1cygpICsgKCh0aGlzLmdldElubmVyQ2lyY2xlUmFkaXVzKCkgLSB0aGlzLmdldENlbnRlckNpcmNsZVJhZGl1cygpKSAvIDEwKVxuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY3VzcHMubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICAgICAgY29uc3QgaXNMaW5lSW5Db2xsaXNpb25XaXRoUG9pbnQgPSAhIHRoaXMuI3NldHRpbmdzLkNIQVJUX0FMTE9XX0hPVVNFX09WRVJMQVAgJiYgVXRpbHMuaXNDb2xsaXNpb24oY3VzcHNbaV0uYW5nbGUsIHBvaW50c1Bvc2l0aW9ucywgdGhpcy4jc2V0dGluZ3MuUE9JTlRfQ09MTElTSU9OX1JBRElVUyAvIDIpXG5cbiAgICAgICAgICAgIGNvbnN0IHN0YXJ0UG9zID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLmdldENlbnRlckNpcmNsZVJhZGl1cygpLCBVdGlscy5kZWdyZWVUb1JhZGlhbihjdXNwc1tpXS5hbmdsZSwgdGhpcy5nZXRBc2NlbmRhbnRTaGlmdCgpKSlcbiAgICAgICAgICAgIGNvbnN0IGVuZFBvcyA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgaXNMaW5lSW5Db2xsaXNpb25XaXRoUG9pbnQgPyB0aGlzLmdldENlbnRlckNpcmNsZVJhZGl1cygpICsgKCh0aGlzLmdldFJ1bGxlckNpcmNsZVJhZGl1cygpIC0gdGhpcy5nZXRDZW50ZXJDaXJjbGVSYWRpdXMoKSkgLyA2KSA6IHRoaXMuZ2V0UnVsbGVyQ2lyY2xlUmFkaXVzKCksIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKGN1c3BzW2ldLmFuZ2xlLCB0aGlzLmdldEFzY2VuZGFudFNoaWZ0KCkpKVxuXG4gICAgICAgICAgICBjb25zdCBsaW5lID0gU1ZHVXRpbHMuU1ZHTGluZShzdGFydFBvcy54LCBzdGFydFBvcy55LCBlbmRQb3MueCwgZW5kUG9zLnkpXG4gICAgICAgICAgICBsaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCBtYWluQXhpc0luZGV4ZXMuaW5jbHVkZXMoaSkgPyB0aGlzLiNzZXR0aW5ncy5DSEFSVF9NQUlOX0FYSVNfQ09MT1IgOiB0aGlzLiNzZXR0aW5ncy5DSEFSVF9MSU5FX0NPTE9SKVxuICAgICAgICAgICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgbWFpbkF4aXNJbmRleGVzLmluY2x1ZGVzKGkpID8gdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTUFJTl9TVFJPS0UgOiB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0UpXG4gICAgICAgICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGxpbmUpO1xuXG4gICAgICAgICAgICBjb25zdCBzdGFydEN1c3AgPSBjdXNwc1tpXS5hbmdsZVxuICAgICAgICAgICAgY29uc3QgZW5kQ3VzcCA9IGN1c3BzWyhpICsgMSkgJSAxMl0uYW5nbGVcbiAgICAgICAgICAgIGNvbnN0IGdhcCA9IGVuZEN1c3AgLSBzdGFydEN1c3AgPiAwID8gZW5kQ3VzcCAtIHN0YXJ0Q3VzcCA6IGVuZEN1c3AgLSBzdGFydEN1c3AgKyBVdGlscy5ERUdfMzYwXG4gICAgICAgICAgICBjb25zdCB0ZXh0QW5nbGUgPSBzdGFydEN1c3AgKyBnYXAgLyAyXG5cbiAgICAgICAgICAgIGNvbnN0IHRleHRQb3MgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRleHRSYWRpdXMsIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKHRleHRBbmdsZSwgdGhpcy5nZXRBc2NlbmRhbnRTaGlmdCgpKSlcbiAgICAgICAgICAgIGNvbnN0IHRleHQgPSBTVkdVdGlscy5TVkdUZXh0KHRleHRQb3MueCwgdGV4dFBvcy55LCBgJHtpICsgMX1gKVxuICAgICAgICAgICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJmb250LWZhbWlseVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9GT05UX0ZBTUlMWSlcbiAgICAgICAgICAgIHRleHQuc2V0QXR0cmlidXRlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIikgLy8gc3RhcnQsIG1pZGRsZSwgZW5kXG4gICAgICAgICAgICB0ZXh0LnNldEF0dHJpYnV0ZShcImRvbWluYW50LWJhc2VsaW5lXCIsIFwibWlkZGxlXCIpXG4gICAgICAgICAgICB0ZXh0LnNldEF0dHJpYnV0ZShcImZvbnQtc2l6ZVwiLCB0aGlzLiNzZXR0aW5ncy5SQURJWF9IT1VTRV9GT05UX1NJWkUpXG4gICAgICAgICAgICB0ZXh0LnNldEF0dHJpYnV0ZShcImZpbGxcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfSE9VU0VfTlVNQkVSX0NPTE9SKVxuICAgICAgICAgICAgdGV4dC5jbGFzc0xpc3QuYWRkKCdjLXJhZGl4LWN1c3BzX19ob3VzZS1udW1iZXInKVxuICAgICAgICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZCh0ZXh0KVxuXG4gICAgICAgICAgICBpZiAodGhpcy4jc2V0dGluZ3MuRFJBV19IT1VTRV9ERUdSRUUpIHtcbiAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh0aGlzLiNzZXR0aW5ncy5IT1VTRV9ERUdSRUVfRklMVEVSKSAmJiAhIHRoaXMuI3NldHRpbmdzLkhPVVNFX0RFR1JFRV9GSUxURVIuaW5jbHVkZXMoaSArIDEpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCBkZWdyZWVQb3MgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuZ2V0UnVsbGVyQ2lyY2xlUmFkaXVzKCkgLSAodGhpcy5nZXRJbm5lckNpcmNsZVJhZGl1cygpIC0gdGhpcy5nZXRSdWxsZXJDaXJjbGVSYWRpdXMoKSkgLyAxLjIsIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKHN0YXJ0Q3VzcCAtIDIuNCwgdGhpcy5nZXRBc2NlbmRhbnRTaGlmdCgpKSlcbiAgICAgICAgICAgICAgICBjb25zdCBkZWdyZWUgPSBTVkdVdGlscy5TVkdUZXh0KGRlZ3JlZVBvcy54LCBkZWdyZWVQb3MueSwgTWF0aC5mbG9vcihjdXNwc1tpXS5hbmdsZSAlIDMwKSArIFwiwrpcIilcbiAgICAgICAgICAgICAgICBkZWdyZWUuc2V0QXR0cmlidXRlKFwiZm9udC1mYW1pbHlcIiwgXCJBcmlhbFwiKVxuICAgICAgICAgICAgICAgIGRlZ3JlZS5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKSAvLyBzdGFydCwgbWlkZGxlLCBlbmRcbiAgICAgICAgICAgICAgICBkZWdyZWUuc2V0QXR0cmlidXRlKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcbiAgICAgICAgICAgICAgICBkZWdyZWUuc2V0QXR0cmlidXRlKFwiZm9udC1zaXplXCIsIHRoaXMuI3NldHRpbmdzLkhPVVNFX0RFR1JFRV9TSVpFIHx8IHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfQU5HTEVfU0laRSAvIDIpXG4gICAgICAgICAgICAgICAgZGVncmVlLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgdGhpcy4jc2V0dGluZ3MuSE9VU0VfREVHUkVFX0NPTE9SIHx8IHRoaXMuI3NldHRpbmdzLkNIQVJUX0hPVVNFX05VTUJFUl9DT0xPUilcbiAgICAgICAgICAgICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGRlZ3JlZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuI3Jvb3QuYXBwZW5kQ2hpbGQod3JhcHBlcilcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIERyYXcgbWFpbiBheGlzIGRlc2NyaXRpb25cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBheGlzTGlzdFxuICAgICAqL1xuICAgICNkcmF3TWFpbkF4aXNEZXNjcmlwdGlvbihkYXRhKSB7XG4gICAgICAgIGNvbnN0IEFYSVNfTEVOR1RIID0gMTBcbiAgICAgICAgY29uc3QgY3VzcHMgPSBkYXRhLmN1c3BzXG5cbiAgICAgICAgY29uc3QgYXhpc0xpc3QgPSBbe1xuICAgICAgICAgICAgbmFtZTogU1ZHVXRpbHMuU1lNQk9MX0FTLFxuICAgICAgICAgICAgYW5nbGU6IGN1c3BzWzBdLmFuZ2xlXG4gICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogU1ZHVXRpbHMuU1lNQk9MX0lDLFxuICAgICAgICAgICAgICAgIGFuZ2xlOiBjdXNwc1szXS5hbmdsZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiBTVkdVdGlscy5TWU1CT0xfRFMsXG4gICAgICAgICAgICAgICAgYW5nbGU6IGN1c3BzWzZdLmFuZ2xlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hbWU6IFNWR1V0aWxzLlNZTUJPTF9NQyxcbiAgICAgICAgICAgICAgICBhbmdsZTogY3VzcHNbOV0uYW5nbGVcbiAgICAgICAgICAgIH0sXG4gICAgICAgIF1cblxuICAgICAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuICAgICAgICB3cmFwcGVyLmNsYXNzTGlzdC5hZGQoJ2MtcmFkaXgtYXhpcycpXG5cbiAgICAgICAgY29uc3QgcmFkMSA9IHRoaXMuI251bWJlck9mTGV2ZWxzID09PSAyNCA/IHRoaXMuZ2V0UmFkaXVzKCkgOiB0aGlzLmdldElubmVyQ2lyY2xlUmFkaXVzKCk7XG4gICAgICAgIGNvbnN0IHJhZDIgPSB0aGlzLiNudW1iZXJPZkxldmVscyA9PT0gMjQgPyB0aGlzLmdldFJhZGl1cygpICsgQVhJU19MRU5HVEggOiB0aGlzLmdldElubmVyQ2lyY2xlUmFkaXVzKCkgKyBBWElTX0xFTkdUSCAvIDI7XG5cbiAgICAgICAgZm9yIChjb25zdCBheGlzIG9mIGF4aXNMaXN0KSB7XG4gICAgICAgICAgICBjb25zdCBheGlzR3JvdXAgPSBTVkdVdGlscy5TVkdHcm91cCgpXG4gICAgICAgICAgICBheGlzR3JvdXAuY2xhc3NMaXN0LmFkZCgnYy1yYWRpeC1heGlzX19heGlzJylcbiAgICAgICAgICAgIGF4aXNHcm91cC5jbGFzc0xpc3QuYWRkKCdjLXJhZGl4LWF4aXNfX2F4aXMtLScgKyBheGlzLm5hbWUudG9Mb3dlckNhc2UoKSlcblxuICAgICAgICAgICAgbGV0IHN0YXJ0UG9pbnQgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHJhZDEsIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKGF4aXMuYW5nbGUsIHRoaXMuZ2V0QXNjZW5kYW50U2hpZnQoKSkpXG4gICAgICAgICAgICBsZXQgZW5kUG9pbnQgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHJhZDIsIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKGF4aXMuYW5nbGUsIHRoaXMuZ2V0QXNjZW5kYW50U2hpZnQoKSkpXG4gICAgICAgICAgICBsZXQgbGluZSA9IFNWR1V0aWxzLlNWR0xpbmUoc3RhcnRQb2ludC54LCBzdGFydFBvaW50LnksIGVuZFBvaW50LngsIGVuZFBvaW50LnkpO1xuICAgICAgICAgICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTUFJTl9BWElTX0NPTE9SKTtcbiAgICAgICAgICAgIGxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX01BSU5fU1RST0tFKTtcbiAgICAgICAgICAgIGF4aXNHcm91cC5hcHBlbmRDaGlsZChsaW5lKTtcblxuICAgICAgICAgICAgbGV0IHRleHRQb2ludCA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgcmFkMiwgVXRpbHMuZGVncmVlVG9SYWRpYW4oYXhpcy5hbmdsZSwgdGhpcy5nZXRBc2NlbmRhbnRTaGlmdCgpKSlcbiAgICAgICAgICAgIGxldCBzeW1ib2w7XG4gICAgICAgICAgICBsZXQgU0hJRlRfWCA9IDA7XG4gICAgICAgICAgICBsZXQgU0hJRlRfWSA9IDA7XG4gICAgICAgICAgICBjb25zdCBTVEVQID0gMlxuXG4gICAgICAgICAgICBzd2l0Y2ggKGF4aXMubmFtZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgXCJBc1wiOlxuICAgICAgICAgICAgICAgICAgICBTSElGVF9YIC09IFNURVBcbiAgICAgICAgICAgICAgICAgICAgU0hJRlRfWSAtPSBTVEVQXG4gICAgICAgICAgICAgICAgICAgIFNWR1V0aWxzLlNZTUJPTF9BU19DT0RFID0gdGhpcy4jc2V0dGluZ3MuU1lNQk9MX0FTX0NPREUgPz8gU1ZHVXRpbHMuU1lNQk9MX0FTX0NPREU7XG4gICAgICAgICAgICAgICAgICAgIHN5bWJvbCA9IFNWR1V0aWxzLlNWR1N5bWJvbChheGlzLm5hbWUsIHRleHRQb2ludC54ICsgU0hJRlRfWCwgdGV4dFBvaW50LnkgKyBTSElGVF9ZKVxuICAgICAgICAgICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwidGV4dC1hbmNob3JcIiwgXCJlbmRcIilcbiAgICAgICAgICAgICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImRvbWluYW50LWJhc2VsaW5lXCIsIFwibWlkZGxlXCIpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJEc1wiOlxuICAgICAgICAgICAgICAgICAgICBTSElGVF9YICs9IFNURVBcbiAgICAgICAgICAgICAgICAgICAgU0hJRlRfWSAtPSBTVEVQXG4gICAgICAgICAgICAgICAgICAgIFNWR1V0aWxzLlNZTUJPTF9EU19DT0RFID0gdGhpcy4jc2V0dGluZ3MuU1lNQk9MX0RTX0NPREUgPz8gU1ZHVXRpbHMuU1lNQk9MX0RTX0NPREU7XG4gICAgICAgICAgICAgICAgICAgIHN5bWJvbCA9IFNWR1V0aWxzLlNWR1N5bWJvbChheGlzLm5hbWUsIHRleHRQb2ludC54ICsgU0hJRlRfWCwgdGV4dFBvaW50LnkgKyBTSElGVF9ZKVxuICAgICAgICAgICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwidGV4dC1hbmNob3JcIiwgXCJzdGFydFwiKVxuICAgICAgICAgICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcIk1jXCI6XG4gICAgICAgICAgICAgICAgICAgIFNISUZUX1kgLT0gU1RFUFxuICAgICAgICAgICAgICAgICAgICBTVkdVdGlscy5TWU1CT0xfTUNfQ09ERSA9IHRoaXMuI3NldHRpbmdzLlNZTUJPTF9NQ19DT0RFID8/IFNWR1V0aWxzLlNZTUJPTF9NQ19DT0RFO1xuICAgICAgICAgICAgICAgICAgICBzeW1ib2wgPSBTVkdVdGlscy5TVkdTeW1ib2woYXhpcy5uYW1lLCB0ZXh0UG9pbnQueCArIFNISUZUX1gsIHRleHRQb2ludC55ICsgU0hJRlRfWSlcbiAgICAgICAgICAgICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXG4gICAgICAgICAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJkb21pbmFudC1iYXNlbGluZVwiLCBcInRleHQtdG9wXCIpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJJY1wiOlxuICAgICAgICAgICAgICAgICAgICBTSElGVF9ZICs9IFNURVBcbiAgICAgICAgICAgICAgICAgICAgU1ZHVXRpbHMuU1lNQk9MX0lDX0NPREUgPSB0aGlzLiNzZXR0aW5ncy5TWU1CT0xfSUNfQ09ERSA/PyBTVkdVdGlscy5TWU1CT0xfSUNfQ09ERTtcbiAgICAgICAgICAgICAgICAgICAgc3ltYm9sID0gU1ZHVXRpbHMuU1ZHU3ltYm9sKGF4aXMubmFtZSwgdGV4dFBvaW50LnggKyBTSElGVF9YLCB0ZXh0UG9pbnQueSArIFNISUZUX1kpXG4gICAgICAgICAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxuICAgICAgICAgICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJoYW5naW5nXCIpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYXhpcy5uYW1lKVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIGF4aXMgbmFtZS5cIilcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJmb250LWZhbWlseVwiLCB0aGlzLiNzZXR0aW5ncy5BWElTX0ZPTlRfRkFNSUxZID8/IHRoaXMuI3NldHRpbmdzLkNIQVJUX0ZPTlRfRkFNSUxZKTtcbiAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJmb250LXNpemVcIiwgdGhpcy4jc2V0dGluZ3MuUkFESVhfQVhJU19GT05UX1NJWkUpO1xuICAgICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImZvbnQtd2VpZ2h0XCIsIHRoaXMuI3NldHRpbmdzLkFYSVNfRk9OVF9XRUlHSFQgPz8gNDAwKTtcbiAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX01BSU5fQVhJU19DT0xPUik7XG4gICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKCdwYWludC1vcmRlcicsICdzdHJva2UnKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuI3NldHRpbmdzLkNMQVNTX0FYSVMpIHtcbiAgICAgICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKCdjbGFzcycsIHRoaXMuI3NldHRpbmdzLkNMQVNTX0FYSVMgKyAnICcgKyB0aGlzLiNzZXR0aW5ncy5DTEFTU19BWElTICsgJy0tJyArIGF4aXMubmFtZS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYXhpc0dyb3VwLmFwcGVuZENoaWxkKHN5bWJvbCk7XG4gICAgICAgICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGF4aXNHcm91cClcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuI3Jvb3QuYXBwZW5kQ2hpbGQod3JhcHBlcilcbiAgICB9XG5cbiAgICAjZHJhd0JvcmRlcnMoKSB7XG4gICAgICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG4gICAgICAgIHdyYXBwZXIuY2xhc3NMaXN0LmFkZCgnYy1yYWRpeC1ib3JkZXJzJylcblxuICAgICAgICBjb25zdCBvdXRlckNpcmNsZSA9IFNWR1V0aWxzLlNWR0NpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLmdldE91dGVyQ2lyY2xlUmFkaXVzKCkpXG4gICAgICAgIG91dGVyQ2lyY2xlLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9DSVJDTEVfQ09MT1IpO1xuICAgICAgICBvdXRlckNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTUFJTl9TVFJPS0UpO1xuICAgICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKG91dGVyQ2lyY2xlKVxuXG4gICAgICAgIGNvbnN0IGlubmVyQ2lyY2xlID0gU1ZHVXRpbHMuU1ZHQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuZ2V0SW5uZXJDaXJjbGVSYWRpdXMoKSlcbiAgICAgICAgaW5uZXJDaXJjbGUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0NJUkNMRV9DT0xPUik7XG4gICAgICAgIGlubmVyQ2lyY2xlLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9NQUlOX1NUUk9LRSk7XG4gICAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoaW5uZXJDaXJjbGUpXG5cbiAgICAgICAgY29uc3QgY2VudGVyQ2lyY2xlID0gU1ZHVXRpbHMuU1ZHQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuZ2V0Q2VudGVyQ2lyY2xlUmFkaXVzKCkpXG4gICAgICAgIGNlbnRlckNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfQ0lSQ0xFX0NPTE9SKTtcbiAgICAgICAgY2VudGVyQ2lyY2xlLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9NQUlOX1NUUk9LRSk7XG4gICAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoY2VudGVyQ2lyY2xlKVxuXG4gICAgICAgIHRoaXMuI3Jvb3QuYXBwZW5kQ2hpbGQod3JhcHBlcilcbiAgICB9XG5cbiAgICBhbmltYXRlVG8oZGF0YSkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGdldFBvaW50KG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBnZXRQb2ludHMoKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxufVxuXG5leHBvcnQge1xuICAgIFJhZGl4Q2hhcnQgYXNcbiAgICAgICAgZGVmYXVsdFxufVxuIiwiaW1wb3J0IFJhZGl4Q2hhcnQgZnJvbSAnLi4vY2hhcnRzL1JhZGl4Q2hhcnQuanMnO1xuaW1wb3J0IFNWR1V0aWxzIGZyb20gJy4uL3V0aWxzL1NWR1V0aWxzLmpzJztcbmltcG9ydCBDaGFydCBmcm9tICcuL0NoYXJ0LmpzJ1xuaW1wb3J0IFV0aWxzIGZyb20gJy4uL3V0aWxzL1V0aWxzLmpzJztcbmltcG9ydCBBc3BlY3RVdGlscyBmcm9tICcuLi91dGlscy9Bc3BlY3RVdGlscy5qcyc7XG5pbXBvcnQgUG9pbnQgZnJvbSAnLi4vcG9pbnRzL1BvaW50LmpzJ1xuaW1wb3J0IERlZmF1bHRTZXR0aW5ncyBmcm9tICcuLi9zZXR0aW5ncy9EZWZhdWx0U2V0dGluZ3MuanMnO1xuXG4vKipcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyBQb2ludHMgYW5kIGN1cHMgYXJlIGRpc3BsYXllZCBmcm9tIG91dHNpZGUgdGhlIFVuaXZlcnNlLlxuICogQHB1YmxpY1xuICogQGV4dGVuZHMge0NoYXJ0fVxuICovXG5jbGFzcyBUcmFuc2l0Q2hhcnQgZXh0ZW5kcyBDaGFydCB7XG5cbiAgLypcbiAgICogTGV2ZWxzIGRldGVybWluZSB0aGUgd2lkdGggb2YgaW5kaXZpZHVhbCBwYXJ0cyBvZiB0aGUgY2hhcnQuXG4gICAqIEl0IGNhbiBiZSBjaGFuZ2VkIGR5bmFtaWNhbGx5IGJ5IHB1YmxpYyBzZXR0ZXIuXG4gICAqL1xuICAjbnVtYmVyT2ZMZXZlbHMgPSAzMlxuXG4gICNyYWRpeFxuICAjc2V0dGluZ3NcbiAgI3Jvb3RcbiAgI2RhdGFcblxuICAjY2VudGVyWFxuICAjY2VudGVyWVxuICAjcmFkaXVzXG5cbiAgLypcbiAgICogQHNlZSBVdGlscy5jbGVhblVwKClcbiAgICovXG4gICNiZWZvcmVDbGVhblVwSG9va1xuXG4gIC8qKlxuICAgKiBAY29uc3RydWN0c1xuICAgKiBAcGFyYW0ge1JhZGl4Q2hhcnR9IHJhZGl4XG4gICAqL1xuICBjb25zdHJ1Y3RvcihyYWRpeCkge1xuICAgIGlmICghKHJhZGl4IGluc3RhbmNlb2YgUmFkaXhDaGFydCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQmFkIHBhcmFtIHJhZGl4LicpXG4gICAgfVxuXG4gICAgc3VwZXIocmFkaXguZ2V0VW5pdmVyc2UoKS5nZXRTZXR0aW5ncygpKVxuXG4gICAgdGhpcy4jcmFkaXggPSByYWRpeFxuICAgIHRoaXMuI3NldHRpbmdzID0gdGhpcy4jcmFkaXguZ2V0VW5pdmVyc2UoKS5nZXRTZXR0aW5ncygpXG4gICAgdGhpcy4jY2VudGVyWCA9IHRoaXMuI3NldHRpbmdzLkNIQVJUX1ZJRVdCT1hfV0lEVEggLyAyXG4gICAgdGhpcy4jY2VudGVyWSA9IHRoaXMuI3NldHRpbmdzLkNIQVJUX1ZJRVdCT1hfSEVJR0hUIC8gMlxuICAgIHRoaXMuI3JhZGl1cyA9IE1hdGgubWluKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclkpIC0gdGhpcy4jc2V0dGluZ3MuQ0hBUlRfUEFERElOR1xuXG4gICAgdGhpcy4jcm9vdCA9IFNWR1V0aWxzLlNWR0dyb3VwKClcbiAgICB0aGlzLiNyb290LnNldEF0dHJpYnV0ZShcImlkXCIsIGAke3RoaXMuI3NldHRpbmdzLkhUTUxfRUxFTUVOVF9JRH0tJHt0aGlzLiNzZXR0aW5ncy5UUkFOU0lUX0lEfWApXG4gICAgdGhpcy4jcmFkaXguZ2V0VW5pdmVyc2UoKS5nZXRTVkdEb2N1bWVudCgpLmFwcGVuZENoaWxkKHRoaXMuI3Jvb3QpO1xuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgY2hhcnQgZGF0YVxuICAgKiBAdGhyb3dzIHtFcnJvcn0gLSBpZiB0aGUgZGF0YSBpcyBub3QgdmFsaWQuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gICAqIEByZXR1cm4ge1JhZGl4Q2hhcnR9XG4gICAqL1xuICBzZXREYXRhKGRhdGEpIHtcbiAgICBsZXQgc3RhdHVzID0gdGhpcy52YWxpZGF0ZURhdGEoZGF0YSlcbiAgICBpZiAoIXN0YXR1cy5pc1ZhbGlkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3Ioc3RhdHVzLm1lc3NhZ2UpXG4gICAgfVxuXG4gICAgdGhpcy4jZGF0YSA9IGRhdGFcbiAgICB0aGlzLiNkcmF3KGRhdGEpXG5cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBkYXRhXG4gICAqIEByZXR1cm4ge09iamVjdH1cbiAgICovXG4gIGdldERhdGEoKXtcbiAgICByZXR1cm4ge1xuICAgICAgXCJwb2ludHNcIjpbLi4udGhpcy4jZGF0YS5wb2ludHNdLFxuICAgICAgXCJjdXNwc1wiOlsuLi50aGlzLiNkYXRhLmN1c3BzXVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgcmFkaXVzXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0UmFkaXVzKCkge1xuICAgIHJldHVybiB0aGlzLiNyYWRpdXNcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYXNwZWN0c1xuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IFtmcm9tUG9pbnRzXSAtIFt7bmFtZTpcIk1vb25cIiwgYW5nbGU6MH0sIHtuYW1lOlwiU3VuXCIsIGFuZ2xlOjE3OX0sIHtuYW1lOlwiTWVyY3VyeVwiLCBhbmdsZToxMjF9XVxuICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IFt0b1BvaW50c10gLSBbe25hbWU6XCJBU1wiLCBhbmdsZTowfSwge25hbWU6XCJJQ1wiLCBhbmdsZTo5MH1dXG4gICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gW2FzcGVjdHNdIC0gW3tuYW1lOlwiT3Bwb3NpdGlvblwiLCBhbmdsZToxODAsIG9yYjoyfSwge25hbWU6XCJUcmluZVwiLCBhbmdsZToxMjAsIG9yYjoyfV1cbiAgICpcbiAgICogQHJldHVybiB7QXJyYXk8T2JqZWN0Pn1cbiAgICovXG4gIGdldEFzcGVjdHMoZnJvbVBvaW50cywgdG9Qb2ludHMsIGFzcGVjdHMpe1xuICAgIGlmKCF0aGlzLiNkYXRhKXtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGZyb21Qb2ludHMgPSBmcm9tUG9pbnRzID8/IFsuLi50aGlzLiNkYXRhLnBvaW50cy5maWx0ZXIoeCA9PiBcImFzcGVjdFwiIGluIHggPyB4LmFzcGVjdCA6IHRydWUpLCAuLi50aGlzLiNkYXRhLmN1c3BzLmZpbHRlcih4ID0+IHguYXNwZWN0KV1cbiAgICB0b1BvaW50cyA9IHRvUG9pbnRzID8/IFsuLi50aGlzLiNyYWRpeC5nZXREYXRhKCkucG9pbnRzLmZpbHRlcih4ID0+IFwiYXNwZWN0XCIgaW4geCA/IHguYXNwZWN0IDogdHJ1ZSksIC4uLnRoaXMuI3JhZGl4LmdldERhdGEoKS5jdXNwcy5maWx0ZXIoeCA9PiB4LmFzcGVjdCldXG4gICAgYXNwZWN0cyA9IGFzcGVjdHMgPz8gdGhpcy4jc2V0dGluZ3MuREVGQVVMVF9BU1BFQ1RTID8/IERlZmF1bHRTZXR0aW5ncy5ERUZBVUxUX0FTUEVDVFNcblxuICAgIHJldHVybiBBc3BlY3RVdGlscy5nZXRBc3BlY3RzKGZyb21Qb2ludHMsIHRvUG9pbnRzLCBhc3BlY3RzKVxuICB9XG5cbiAgLyoqXG4gICAqIERyYXcgYXNwZWN0c1xuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IFtmcm9tUG9pbnRzXSAtIFt7bmFtZTpcIk1vb25cIiwgYW5nbGU6MH0sIHtuYW1lOlwiU3VuXCIsIGFuZ2xlOjE3OX0sIHtuYW1lOlwiTWVyY3VyeVwiLCBhbmdsZToxMjF9XVxuICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IFt0b1BvaW50c10gLSBbe25hbWU6XCJBU1wiLCBhbmdsZTowfSwge25hbWU6XCJJQ1wiLCBhbmdsZTo5MH1dXG4gICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gW2FzcGVjdHNdIC0gW3tuYW1lOlwiT3Bwb3NpdGlvblwiLCBhbmdsZToxODAsIG9yYjoyfSwge25hbWU6XCJUcmluZVwiLCBhbmdsZToxMjAsIG9yYjoyfV1cbiAgICpcbiAgICogQHJldHVybiB7QXJyYXk8T2JqZWN0Pn1cbiAgICovXG4gIGRyYXdBc3BlY3RzKCBmcm9tUG9pbnRzLCB0b1BvaW50cywgYXNwZWN0cyApe1xuICAgIGNvbnN0IGFzcGVjdHNXcmFwcGVyID0gdGhpcy4jcmFkaXguZ2V0VW5pdmVyc2UoKS5nZXRBc3BlY3RzRWxlbWVudCgpXG4gICAgVXRpbHMuY2xlYW5VcChhc3BlY3RzV3JhcHBlci5nZXRBdHRyaWJ1dGUoXCJpZFwiKSwgdGhpcy4jYmVmb3JlQ2xlYW5VcEhvb2spXG5cbiAgICBjb25zdCBhc3BlY3RzTGlzdCA9IHRoaXMuZ2V0QXNwZWN0cyhmcm9tUG9pbnRzLCB0b1BvaW50cywgYXNwZWN0cylcbiAgICAgIC5maWx0ZXIoIGFzcGVjdCA9PiAgYXNwZWN0LmFzcGVjdC5uYW1lICE9PSAnQ29uanVuY3Rpb24nKVxuXG4gICAgY29uc3QgY2lyY2xlID0gU1ZHVXRpbHMuU1ZHQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuI3JhZGl4LmdldENlbnRlckNpcmNsZVJhZGl1cygpKVxuICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoJ2ZpbGwnLCB0aGlzLiNzZXR0aW5ncy5BU1BFQ1RTX0JBQ0tHUk9VTkRfQ09MT1IpXG4gICAgYXNwZWN0c1dyYXBwZXIuYXBwZW5kQ2hpbGQoY2lyY2xlKVxuICAgIFxuICAgIGFzcGVjdHNXcmFwcGVyLmFwcGVuZENoaWxkKCBBc3BlY3RVdGlscy5kcmF3QXNwZWN0cyh0aGlzLiNyYWRpeC5nZXRDZW50ZXJDaXJjbGVSYWRpdXMoKSwgdGhpcy4jcmFkaXguZ2V0QXNjZW5kYW50U2hpZnQoKSwgdGhpcy4jc2V0dGluZ3MsIGFzcGVjdHNMaXN0KSlcblxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICAvLyAjIyBQUklWQVRFICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gIC8qXG4gICAqIERyYXcgcmFkaXggY2hhcnRcbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGFcbiAgICovXG4gICNkcmF3KGRhdGEpIHtcblxuICAgIC8vIHJhZGl4IHJlRHJhd1xuICAgIFV0aWxzLmNsZWFuVXAodGhpcy4jcm9vdC5nZXRBdHRyaWJ1dGUoJ2lkJyksIHRoaXMuI2JlZm9yZUNsZWFuVXBIb29rKVxuICAgIHRoaXMuI3JhZGl4LnNldE51bWJlck9mTGV2ZWxzKHRoaXMuI251bWJlck9mTGV2ZWxzKVxuXG4gICAgdGhpcy4jZHJhd1J1bGVyKClcbiAgICB0aGlzLiNkcmF3Q3VzcHMoZGF0YSlcbiAgICB0aGlzLiNzZXR0aW5ncy5DSEFSVF9EUkFXX01BSU5fQVhJUyAmJiB0aGlzLiNkcmF3TWFpbkF4aXNEZXNjcmlwdGlvbihkYXRhKVxuICAgIHRoaXMuI2RyYXdQb2ludHMoZGF0YSlcbiAgICB0aGlzLiNkcmF3Qm9yZGVycygpXG4gICAgdGhpcy4jc2V0dGluZ3MuRFJBV19BU1BFQ1RTICYmIHRoaXMuZHJhd0FzcGVjdHMoKVxuICB9XG5cbiAgI2RyYXdSdWxlcigpIHtcbiAgICBjb25zdCBOVU1CRVJfT0ZfRElWSURFUlMgPSA3MlxuICAgIGNvbnN0IFNURVAgPSA1XG5cbiAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuXG4gICAgbGV0IHN0YXJ0QW5nbGUgPSB0aGlzLiNyYWRpeC5nZXRBc2NlbmRhbnRTaGlmdCgpXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBOVU1CRVJfT0ZfRElWSURFUlM7IGkrKykge1xuICAgICAgbGV0IHN0YXJ0UG9pbnQgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuI2dldFJ1bGxlckNpcmNsZVJhZGl1cygpLCBVdGlscy5kZWdyZWVUb1JhZGlhbihzdGFydEFuZ2xlKSlcbiAgICAgIGxldCBlbmRQb2ludCA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgKGkgJSAyKSA/IHRoaXMuZ2V0UmFkaXVzKCkgLSAoKHRoaXMuZ2V0UmFkaXVzKCkgLSB0aGlzLiNnZXRSdWxsZXJDaXJjbGVSYWRpdXMoKSkgLyAyKSA6IHRoaXMuZ2V0UmFkaXVzKCksIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKHN0YXJ0QW5nbGUpKVxuICAgICAgY29uc3QgbGluZSA9IFNWR1V0aWxzLlNWR0xpbmUoc3RhcnRQb2ludC54LCBzdGFydFBvaW50LnksIGVuZFBvaW50LngsIGVuZFBvaW50LnkpO1xuICAgICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTElORV9DT0xPUik7XG4gICAgICBsaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0UpO1xuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChsaW5lKTtcblxuICAgICAgc3RhcnRBbmdsZSArPSBTVEVQXG4gICAgfVxuXG4gICAgY29uc3QgY2lyY2xlID0gU1ZHVXRpbHMuU1ZHQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuI2dldFJ1bGxlckNpcmNsZVJhZGl1cygpKTtcbiAgICBjaXJjbGUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0NJUkNMRV9DT0xPUik7XG4gICAgY2lyY2xlLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0UpO1xuICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoY2lyY2xlKTtcblxuICAgIHRoaXMuI3Jvb3QuYXBwZW5kQ2hpbGQod3JhcHBlcilcbiAgfVxuXG4gIC8qXG4gICAqIERyYXcgcG9pbnRzXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIC0gY2hhcnQgZGF0YVxuICAgKi9cbiAgI2RyYXdQb2ludHMoZGF0YSkge1xuICAgIGNvbnN0IHBvaW50cyA9IGRhdGEucG9pbnRzXG4gICAgY29uc3QgY3VzcHMgPSBkYXRhLmN1c3BzXG5cbiAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuXG4gICAgY29uc3QgcG9zaXRpb25zID0gVXRpbHMuY2FsY3VsYXRlUG9zaXRpb25XaXRob3V0T3ZlcmxhcHBpbmcocG9pbnRzLCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9DT0xMSVNJT05fUkFESVVTLCB0aGlzLiNnZXRQb2ludENpcmNsZVJhZGl1cygpKVxuICAgIGZvciAoY29uc3QgcG9pbnREYXRhIG9mIHBvaW50cykge1xuICAgICAgY29uc3QgcG9pbnQgPSBuZXcgUG9pbnQocG9pbnREYXRhLCBjdXNwcywgdGhpcy4jc2V0dGluZ3MpXG4gICAgICBjb25zdCBwb2ludFBvc2l0aW9uID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJYLCB0aGlzLiNnZXRSdWxsZXJDaXJjbGVSYWRpdXMoKSAtICgodGhpcy5nZXRSYWRpdXMoKSAtIHRoaXMuI2dldFJ1bGxlckNpcmNsZVJhZGl1cygpKSAvIDQpLCBVdGlscy5kZWdyZWVUb1JhZGlhbihwb2ludC5nZXRBbmdsZSgpLCB0aGlzLiNyYWRpeC5nZXRBc2NlbmRhbnRTaGlmdCgpKSlcbiAgICAgIGNvbnN0IHN5bWJvbFBvc2l0aW9uID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJYLCB0aGlzLiNnZXRQb2ludENpcmNsZVJhZGl1cygpLCBVdGlscy5kZWdyZWVUb1JhZGlhbihwb3NpdGlvbnNbcG9pbnQuZ2V0TmFtZSgpXSwgdGhpcy4jcmFkaXguZ2V0QXNjZW5kYW50U2hpZnQoKSkpXG5cbiAgICAgIC8vIHJ1bGVyIG1hcmtcbiAgICAgIGNvbnN0IHJ1bGVyTGluZUVuZFBvc2l0aW9uID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJYLCB0aGlzLiNnZXRSdWxsZXJDaXJjbGVSYWRpdXMoKSwgVXRpbHMuZGVncmVlVG9SYWRpYW4ocG9pbnQuZ2V0QW5nbGUoKSwgdGhpcy4jcmFkaXguZ2V0QXNjZW5kYW50U2hpZnQoKSkpXG4gICAgICBjb25zdCBydWxlckxpbmUgPSBTVkdVdGlscy5TVkdMaW5lKHBvaW50UG9zaXRpb24ueCwgcG9pbnRQb3NpdGlvbi55LCBydWxlckxpbmVFbmRQb3NpdGlvbi54LCBydWxlckxpbmVFbmRQb3NpdGlvbi55KVxuICAgICAgcnVsZXJMaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9MSU5FX0NPTE9SKTtcbiAgICAgIHJ1bGVyTGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFKTtcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQocnVsZXJMaW5lKTtcblxuICAgICAgLy8gc3ltYm9sXG4gICAgICBjb25zdCBzeW1ib2wgPSBwb2ludC5nZXRTeW1ib2woc3ltYm9sUG9zaXRpb24ueCwgc3ltYm9sUG9zaXRpb24ueSwgVXRpbHMuREVHXzAsIHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfU0hPVylcbiAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJmb250LWZhbWlseVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9GT05UX0ZBTUlMWSk7XG4gICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIikgLy8gc3RhcnQsIG1pZGRsZSwgZW5kXG4gICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcbiAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJmb250LXNpemVcIiwgdGhpcy4jc2V0dGluZ3MuVFJBTlNJVF9QT0lOVFNfRk9OVF9TSVpFKVxuICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgdGhpcy4jc2V0dGluZ3MuVFJBTlNJVF9QTEFORVRfQ09MT1JTW3BvaW50RGF0YS5uYW1lXSA/PyB0aGlzLiNzZXR0aW5ncy5QTEFORVRfQ09MT1JTW3BvaW50RGF0YS5uYW1lXSA/PyB0aGlzLiNzZXR0aW5ncy5DSEFSVF9QT0lOVFNfQ09MT1IpXG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHN5bWJvbCk7XG5cbiAgICAgIC8vIHBvaW50ZXJcbiAgICAgIC8vaWYgKHBvc2l0aW9uc1twb2ludC5nZXROYW1lKCldICE9IHBvaW50RGF0YS5wb3NpdGlvbikge1xuICAgICAgY29uc3QgcG9pbnRlckxpbmVFbmRQb3NpdGlvbiA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWCwgdGhpcy4jZ2V0UG9pbnRDaXJjbGVSYWRpdXMoKSwgVXRpbHMuZGVncmVlVG9SYWRpYW4ocG9zaXRpb25zW3BvaW50LmdldE5hbWUoKV0sIHRoaXMuI3JhZGl4LmdldEFzY2VuZGFudFNoaWZ0KCkpKVxuICAgICAgY29uc3QgcG9pbnRlckxpbmUgPSBTVkdVdGlscy5TVkdMaW5lKHBvaW50UG9zaXRpb24ueCwgcG9pbnRQb3NpdGlvbi55LCAocG9pbnRQb3NpdGlvbi54ICsgcG9pbnRlckxpbmVFbmRQb3NpdGlvbi54KSAvIDIsIChwb2ludFBvc2l0aW9uLnkgKyBwb2ludGVyTGluZUVuZFBvc2l0aW9uLnkpIC8gMilcbiAgICAgIHBvaW50ZXJMaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9MSU5FX0NPTE9SKTtcbiAgICAgIHBvaW50ZXJMaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0UgLyAyKTtcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQocG9pbnRlckxpbmUpO1xuICAgIH1cblxuICAgIHRoaXMuI3Jvb3QuYXBwZW5kQ2hpbGQod3JhcHBlcilcbiAgfVxuXG4gIC8qXG4gICAqIERyYXcgcG9pbnRzXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIC0gY2hhcnQgZGF0YVxuICAgKi9cbiAgI2RyYXdDdXNwcyhkYXRhKSB7XG4gICAgY29uc3QgcG9pbnRzID0gZGF0YS5wb2ludHNcbiAgICBjb25zdCBjdXNwcyA9IGRhdGEuY3VzcHNcblxuICAgIGNvbnN0IHBvaW50c1Bvc2l0aW9ucyA9IHBvaW50cy5tYXAocG9pbnQgPT4ge1xuICAgICAgcmV0dXJuIHBvaW50LmFuZ2xlXG4gICAgfSlcblxuICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG5cbiAgICBjb25zdCB0ZXh0UmFkaXVzID0gdGhpcy4jZ2V0Q2VudGVyQ2lyY2xlUmFkaXVzKCkgKyAoKHRoaXMuI2dldFJ1bGxlckNpcmNsZVJhZGl1cygpIC0gdGhpcy4jZ2V0Q2VudGVyQ2lyY2xlUmFkaXVzKCkpIC8gNilcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY3VzcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGlzTGluZUluQ29sbGlzaW9uV2l0aFBvaW50ID0gIXRoaXMuI3NldHRpbmdzLkNIQVJUX0FMTE9XX0hPVVNFX09WRVJMQVAgJiYgVXRpbHMuaXNDb2xsaXNpb24oY3VzcHNbaV0uYW5nbGUsIHBvaW50c1Bvc2l0aW9ucywgdGhpcy4jc2V0dGluZ3MuUE9JTlRfQ09MTElTSU9OX1JBRElVUyAvIDIpXG5cbiAgICAgIGNvbnN0IHN0YXJ0UG9zID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLiNnZXRDZW50ZXJDaXJjbGVSYWRpdXMoKSwgVXRpbHMuZGVncmVlVG9SYWRpYW4oY3VzcHNbaV0uYW5nbGUsIHRoaXMuI3JhZGl4LmdldEFzY2VuZGFudFNoaWZ0KCkpKVxuICAgICAgY29uc3QgZW5kUG9zID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCBpc0xpbmVJbkNvbGxpc2lvbldpdGhQb2ludCA/IHRoaXMuI2dldENlbnRlckNpcmNsZVJhZGl1cygpICsgKCh0aGlzLiNnZXRSdWxsZXJDaXJjbGVSYWRpdXMoKSAtIHRoaXMuI2dldENlbnRlckNpcmNsZVJhZGl1cygpKSAvIDYpIDogdGhpcy4jZ2V0UnVsbGVyQ2lyY2xlUmFkaXVzKCksIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKGN1c3BzW2ldLmFuZ2xlLCB0aGlzLiNyYWRpeC5nZXRBc2NlbmRhbnRTaGlmdCgpKSlcblxuICAgICAgY29uc3QgbGluZSA9IFNWR1V0aWxzLlNWR0xpbmUoc3RhcnRQb3MueCwgc3RhcnRQb3MueSwgZW5kUG9zLngsIGVuZFBvcy55KVxuICAgICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTElORV9DT0xPUilcbiAgICAgIGxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRSlcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQobGluZSk7XG5cbiAgICAgIGNvbnN0IHN0YXJ0Q3VzcCA9IGN1c3BzW2ldLmFuZ2xlXG4gICAgICBjb25zdCBlbmRDdXNwID0gY3VzcHNbKGkgKyAxKSAlIDEyXS5hbmdsZVxuICAgICAgY29uc3QgZ2FwID0gZW5kQ3VzcCAtIHN0YXJ0Q3VzcCA+IDAgPyBlbmRDdXNwIC0gc3RhcnRDdXNwIDogZW5kQ3VzcCAtIHN0YXJ0Q3VzcCArIFV0aWxzLkRFR18zNjBcbiAgICAgIGNvbnN0IHRleHRBbmdsZSA9IHN0YXJ0Q3VzcCArIGdhcCAvIDJcblxuICAgICAgY29uc3QgdGV4dFBvcyA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGV4dFJhZGl1cywgVXRpbHMuZGVncmVlVG9SYWRpYW4odGV4dEFuZ2xlLCB0aGlzLiNyYWRpeC5nZXRBc2NlbmRhbnRTaGlmdCgpKSlcbiAgICAgIGNvbnN0IHRleHQgPSBTVkdVdGlscy5TVkdUZXh0KHRleHRQb3MueCwgdGV4dFBvcy55LCBgJHtpKzF9YClcbiAgICAgIHRleHQuc2V0QXR0cmlidXRlKFwiZm9udC1mYW1pbHlcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfRk9OVF9GQU1JTFkpXG4gICAgICB0ZXh0LnNldEF0dHJpYnV0ZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpIC8vIHN0YXJ0LCBtaWRkbGUsIGVuZFxuICAgICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJkb21pbmFudC1iYXNlbGluZVwiLCBcIm1pZGRsZVwiKVxuICAgICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJmb250LXNpemVcIiwgdGhpcy4jc2V0dGluZ3MuUkFESVhfSE9VU0VfRk9OVF9TSVpFKVxuICAgICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIHRoaXMuI3NldHRpbmdzLlRSQU5TSVRfSE9VU0VfTlVNQkVSX0NPTE9SIHx8IHRoaXMuI3NldHRpbmdzLkNIQVJUX0hPVVNFX05VTUJFUl9DT0xPUilcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQodGV4dClcblxuICAgICAgaWYodGhpcy4jc2V0dGluZ3MuRFJBV19IT1VTRV9ERUdSRUUpIHtcbiAgICAgICAgaWYoQXJyYXkuaXNBcnJheSh0aGlzLiNzZXR0aW5ncy5IT1VTRV9ERUdSRUVfRklMVEVSKSAmJiAhdGhpcy4jc2V0dGluZ3MuSE9VU0VfREVHUkVFX0ZJTFRFUi5pbmNsdWRlcyhpKzEpKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZGVncmVlUG9zID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLiNnZXRSdWxsZXJDaXJjbGVSYWRpdXMoKSAtICh0aGlzLmdldFJhZGl1cygpIC0gdGhpcy4jZ2V0UnVsbGVyQ2lyY2xlUmFkaXVzKCkpLCBVdGlscy5kZWdyZWVUb1JhZGlhbihzdGFydEN1c3AgLSAxLjc1LCB0aGlzLiNyYWRpeC5nZXRBc2NlbmRhbnRTaGlmdCgpKSlcbiAgICAgICAgY29uc3QgZGVncmVlID0gU1ZHVXRpbHMuU1ZHVGV4dChkZWdyZWVQb3MueCwgZGVncmVlUG9zLnksIE1hdGguZmxvb3IoY3VzcHNbaV0uYW5nbGUgJSAzMCkgKyBcIsK6XCIpXG4gICAgICAgIGRlZ3JlZS5zZXRBdHRyaWJ1dGUoXCJmb250LWZhbWlseVwiLCBcIkFyaWFsXCIpXG4gICAgICAgIGRlZ3JlZS5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKSAvLyBzdGFydCwgbWlkZGxlLCBlbmRcbiAgICAgICAgZGVncmVlLnNldEF0dHJpYnV0ZShcImRvbWluYW50LWJhc2VsaW5lXCIsIFwibWlkZGxlXCIpXG4gICAgICAgIGRlZ3JlZS5zZXRBdHRyaWJ1dGUoXCJmb250LXNpemVcIiwgdGhpcy4jc2V0dGluZ3MuSE9VU0VfREVHUkVFX1NJWkUgfHwgdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19BTkdMRV9TSVpFIC8gMilcbiAgICAgICAgZGVncmVlLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgdGhpcy4jc2V0dGluZ3MuSE9VU0VfREVHUkVFX0NPTE9SIHx8IHRoaXMuI3NldHRpbmdzLlRSQU5TSVRfSE9VU0VfTlVNQkVSX0NPTE9SIHx8IHRoaXMuI3NldHRpbmdzLkNIQVJUX0hPVVNFX05VTUJFUl9DT0xPUilcbiAgICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChkZWdyZWUpXG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy4jcm9vdC5hcHBlbmRDaGlsZCh3cmFwcGVyKVxuICB9XG5cbiAgLypcbiAgICogRHJhdyBtYWluIGF4aXMgZGVzY3JpdGlvblxuICAgKiBAcGFyYW0ge0FycmF5fSBheGlzTGlzdFxuICAgKi9cbiAgI2RyYXdNYWluQXhpc0Rlc2NyaXB0aW9uKGRhdGEpIHtcbiAgICBjb25zdCBBWElTX0xFTkdUSCA9IDEwXG4gICAgY29uc3QgY3VzcHMgPSBkYXRhLmN1c3BzXG5cbiAgICBjb25zdCBheGlzTGlzdCA9IFt7XG4gICAgICAgIG5hbWU6IFNWR1V0aWxzLlNZTUJPTF9BUyxcbiAgICAgICAgYW5nbGU6IGN1c3BzWzBdLmFuZ2xlXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiBTVkdVdGlscy5TWU1CT0xfSUMsXG4gICAgICAgIGFuZ2xlOiBjdXNwc1szXS5hbmdsZVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogU1ZHVXRpbHMuU1lNQk9MX0RTLFxuICAgICAgICBhbmdsZTogY3VzcHNbNl0uYW5nbGVcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFNWR1V0aWxzLlNZTUJPTF9NQyxcbiAgICAgICAgYW5nbGU6IGN1c3BzWzldLmFuZ2xlXG4gICAgICB9LFxuICAgIF1cblxuICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG5cbiAgICBjb25zdCByYWQxID0gdGhpcy5nZXRSYWRpdXMoKTtcbiAgICBjb25zdCByYWQyID0gdGhpcy5nZXRSYWRpdXMoKSArIEFYSVNfTEVOR1RIO1xuXG4gICAgZm9yIChjb25zdCBheGlzIG9mIGF4aXNMaXN0KSB7XG4gICAgICBsZXQgc3RhcnRQb2ludCA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgcmFkMSwgVXRpbHMuZGVncmVlVG9SYWRpYW4oYXhpcy5hbmdsZSwgdGhpcy4jcmFkaXguZ2V0QXNjZW5kYW50U2hpZnQoKSkpXG4gICAgICBsZXQgZW5kUG9pbnQgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHJhZDIsIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKGF4aXMuYW5nbGUsIHRoaXMuI3JhZGl4LmdldEFzY2VuZGFudFNoaWZ0KCkpKVxuICAgICAgbGV0IGxpbmUgPSBTVkdVdGlscy5TVkdMaW5lKHN0YXJ0UG9pbnQueCwgc3RhcnRQb2ludC55LCBlbmRQb2ludC54LCBlbmRQb2ludC55KTtcbiAgICAgIGxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX01BSU5fQVhJU19DT0xPUik7XG4gICAgICBsaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9NQUlOX1NUUk9LRSk7XG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGxpbmUpO1xuXG4gICAgICBsZXQgdGV4dFBvaW50ID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCByYWQyICsgQVhJU19MRU5HVEggKyAyLCBVdGlscy5kZWdyZWVUb1JhZGlhbihheGlzLmFuZ2xlLCB0aGlzLiNyYWRpeC5nZXRBc2NlbmRhbnRTaGlmdCgpKSlcbiAgICAgIGxldCBzeW1ib2w7XG4gICAgICBzd2l0Y2ggKGF4aXMubmFtZSkge1xuICAgICAgICBjYXNlIFwiQXNcIjpcbiAgICAgICAgICBzeW1ib2wgPSBTVkdVdGlscy5TVkdTeW1ib2woYXhpcy5uYW1lLCB0ZXh0UG9pbnQueCwgdGV4dFBvaW50LnkpXG4gICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXG4gICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImRvbWluYW50LWJhc2VsaW5lXCIsIFwibWlkZGxlXCIpXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJEc1wiOlxuICAgICAgICAgIHN5bWJvbCA9IFNWR1V0aWxzLlNWR1N5bWJvbChheGlzLm5hbWUsIHRleHRQb2ludC54LCB0ZXh0UG9pbnQueSlcbiAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcbiAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIk1jXCI6XG4gICAgICAgICAgc3ltYm9sID0gU1ZHVXRpbHMuU1ZHU3ltYm9sKGF4aXMubmFtZSwgdGV4dFBvaW50LngsIHRleHRQb2ludC55KVxuICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxuICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJkb21pbmFudC1iYXNlbGluZVwiLCBcIm1pZGRsZVwiKVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiSWNcIjpcbiAgICAgICAgICBzeW1ib2wgPSBTVkdVdGlscy5TVkdTeW1ib2woYXhpcy5uYW1lLCB0ZXh0UG9pbnQueCwgdGV4dFBvaW50LnkpXG4gICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXG4gICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImRvbWluYW50LWJhc2VsaW5lXCIsIFwibWlkZGxlXCIpXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgY29uc29sZS5lcnJvcihheGlzLm5hbWUpXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5rbm93biBheGlzIG5hbWUuXCIpXG4gICAgICB9XG4gICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZm9udC1mYW1pbHlcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfRk9OVF9GQU1JTFkpO1xuICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImZvbnQtc2l6ZVwiLCB0aGlzLiNzZXR0aW5ncy5SQURJWF9BWElTX0ZPTlRfU0laRSk7XG4gICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9NQUlOX0FYSVNfQ09MT1IpO1xuXG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHN5bWJvbCk7XG4gICAgfVxuXG4gICAgdGhpcy4jcm9vdC5hcHBlbmRDaGlsZCh3cmFwcGVyKVxuICB9XG5cbiAgI2RyYXdCb3JkZXJzKCkge1xuICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG5cbiAgICBjb25zdCBvdXRlckNpcmNsZSA9IFNWR1V0aWxzLlNWR0NpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLmdldFJhZGl1cygpKVxuICAgIG91dGVyQ2lyY2xlLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9DSVJDTEVfQ09MT1IpO1xuICAgIG91dGVyQ2lyY2xlLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9NQUlOX1NUUk9LRSk7XG4gICAgd3JhcHBlci5hcHBlbmRDaGlsZChvdXRlckNpcmNsZSlcblxuICAgIHRoaXMuI3Jvb3QuYXBwZW5kQ2hpbGQod3JhcHBlcilcbiAgfVxuXG4gICNnZXRQb2ludENpcmNsZVJhZGl1cygpIHtcbiAgICByZXR1cm4gMjkgKiAodGhpcy5nZXRSYWRpdXMoKSAvIHRoaXMuI251bWJlck9mTGV2ZWxzKVxuICB9XG5cbiAgI2dldFJ1bGxlckNpcmNsZVJhZGl1cygpIHtcbiAgICByZXR1cm4gMzEgKiAodGhpcy5nZXRSYWRpdXMoKSAvIHRoaXMuI251bWJlck9mTGV2ZWxzKVxuICB9XG5cbiAgI2dldENlbnRlckNpcmNsZVJhZGl1cygpIHtcbiAgICByZXR1cm4gMjQgKiAodGhpcy5nZXRSYWRpdXMoKSAvIHRoaXMuI251bWJlck9mTGV2ZWxzKVxuICB9XG5cbiAgYW5pbWF0ZVRvKGRhdGEpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgZ2V0UG9pbnQobmFtZSkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBnZXRQb2ludHMoKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxufVxuXG5leHBvcnQge1xuICBUcmFuc2l0Q2hhcnQgYXNcbiAgZGVmYXVsdFxufVxuIiwiaW1wb3J0IFNWR1V0aWxzIGZyb20gJy4uL3V0aWxzL1NWR1V0aWxzLmpzJztcbmltcG9ydCBVdGlscyBmcm9tICcuLi91dGlscy9VdGlscy5qcyc7XG5cbi8vIG5vaW5zcGVjdGlvbiBKU1BvdGVudGlhbGx5SW52YWxpZFVzYWdlT2ZDbGFzc1RoaXMsSlNVbnVzZWRHbG9iYWxTeW1ib2xzXG4vKipcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyBSZXByZXNlbnRzIGEgcGxhbmV0IG9yIHBvaW50IG9mIGludGVyZXN0IGluIHRoZSBjaGFydFxuICogQHB1YmxpY1xuICovXG5jbGFzcyBQb2ludCB7XG5cbiAgICAjbmFtZVxuICAgICNhbmdsZVxuICAgICNzaWduXG4gICAgI2lzUmV0cm9ncmFkZVxuICAgICNjdXNwc1xuICAgICNzZXR0aW5nc1xuXG4gICAgLyoqXG4gICAgICogQGNvbnN0cnVjdHNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcG9pbnREYXRhIC0ge25hbWU6U3RyaW5nLCBhbmdsZTpOdW1iZXIsIGlzUmV0cm9ncmFkZTpmYWxzZX1cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY3VzcHMgLSBbe2FuZ2xlOk51bWJlcn0sIHthbmdsZTpOdW1iZXJ9LCB7YW5nbGU6TnVtYmVyfSwgLi4uXVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzZXR0aW5nc1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHBvaW50RGF0YSwgY3VzcHMsIHNldHRpbmdzKSB7XG4gICAgICAgIHRoaXMuI25hbWUgPSBwb2ludERhdGEubmFtZSA/PyBcIlVua25vd25cIlxuICAgICAgICB0aGlzLiNhbmdsZSA9IHBvaW50RGF0YS5hbmdsZSA/PyAwXG4gICAgICAgIHRoaXMuI3NpZ24gPSBwb2ludERhdGEuc2lnbiA/PyBudWxsXG4gICAgICAgIHRoaXMuI2lzUmV0cm9ncmFkZSA9IHBvaW50RGF0YS5pc1JldHJvZ3JhZGUgPz8gZmFsc2VcblxuICAgICAgICBpZiAoISBBcnJheS5pc0FycmF5KGN1c3BzKSB8fCBjdXNwcy5sZW5ndGggIT09IDEyKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJCYWQgcGFyYW0gY3VzcHMuIFwiKVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy4jY3VzcHMgPSBjdXNwc1xuXG4gICAgICAgIGlmICghIHNldHRpbmdzKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0JhZCBwYXJhbSBzZXR0aW5ncy4nKVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy4jc2V0dGluZ3MgPSBzZXR0aW5nc1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBuYW1lXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICovXG4gICAgZ2V0TmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI25hbWVcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJcyByZXRyb2dyYWRlXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqL1xuICAgIGlzUmV0cm9ncmFkZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI2lzUmV0cm9ncmFkZVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBhbmdsZVxuICAgICAqXG4gICAgICogQHJldHVybiB7TnVtYmVyfVxuICAgICAqL1xuICAgIGdldEFuZ2xlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy4jYW5nbGVcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgc2lnblxuICAgICAqXG4gICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAqL1xuICAgIGdldFNpZ24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiNzaWduXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHN5bWJvbFxuICAgICAqXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHhQb3NcbiAgICAgKiBAcGFyYW0ge051bWJlcn0geVBvc1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbYW5nbGVTaGlmdF1cbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtpc1Byb3BlcnRpZXNdIC0gYW5nbGVJblNpZ24sIGRpZ25pdGllcywgcmV0cm9ncmFkZVxuICAgICAqXG4gICAgICogQHJldHVybiB7U1ZHRWxlbWVudH1cbiAgICAgKi9cbiAgICBnZXRTeW1ib2woeFBvcywgeVBvcywgYW5nbGVTaGlmdCA9IDAsIGlzUHJvcGVydGllcyA9IHRydWUpIHtcbiAgICAgICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcblxuICAgICAgICBjb25zdCBzeW1ib2wgPSBTVkdVdGlscy5TVkdTeW1ib2wodGhpcy4jbmFtZSwgeFBvcywgeVBvcylcblxuICAgICAgICBpZiAodGhpcy4jc2V0dGluZ3MuQ0xBU1NfQ0VMRVNUSUFMKSB7XG4gICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKCdjbGFzcycsIHRoaXMuI3NldHRpbmdzLkNMQVNTX0NFTEVTVElBTCArICcgJyArIHRoaXMuI3NldHRpbmdzLkNMQVNTX0NFTEVTVElBTCArICctLScgKyB0aGlzLiNuYW1lLnRvTG93ZXJDYXNlKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuI3NldHRpbmdzLlBPSU5UX1NUUk9LRSA/PyBmYWxzZSkge1xuICAgICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZSgncGFpbnQtb3JkZXInLCAnc3Ryb2tlJyk7XG4gICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKCdzdHJva2UnLCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9TVFJPS0VfQ09MT1IpO1xuICAgICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZSgnc3Ryb2tlLXdpZHRoJywgdGhpcy4jc2V0dGluZ3MuUE9JTlRfU1RST0tFX1dJRFRIKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoc3ltYm9sKVxuXG4gICAgICAgIGlmIChpc1Byb3BlcnRpZXMgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICByZXR1cm4gd3JhcHBlciAvLz09PT09PT5cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNoYXJ0Q2VudGVyWCA9IHRoaXMuI3NldHRpbmdzLkNIQVJUX1ZJRVdCT1hfV0lEVEggLyAyXG4gICAgICAgIGNvbnN0IGNoYXJ0Q2VudGVyWSA9IHRoaXMuI3NldHRpbmdzLkNIQVJUX1ZJRVdCT1hfSEVJR0hUIC8gMlxuICAgICAgICBjb25zdCBhbmdsZUZyb21TeW1ib2xUb0NlbnRlciA9IFV0aWxzLnBvc2l0aW9uVG9BbmdsZSh4UG9zLCB5UG9zLCBjaGFydENlbnRlclgsIGNoYXJ0Q2VudGVyWSlcblxuICAgICAgICBpZiAodGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19TSE9XX0FOR0xFKSB7XG4gICAgICAgICAgICBhbmdsZUluU2lnbi5jYWxsKHRoaXMpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19TSE9XX1NJR04gJiYgdGhpcy4jc2lnbiAhPT0gbnVsbCkge1xuICAgICAgICAgICAgc2hvd1NpZ24uY2FsbCh0aGlzKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfU0hPV19SRVRST0dSQURFICYmIHRoaXMuI2lzUmV0cm9ncmFkZSkge1xuICAgICAgICAgICAgcmV0cm9ncmFkZS5jYWxsKHRoaXMpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19TSE9XX0RJR05JVFkgJiYgdGhpcy5nZXREaWduaXR5KCkpIHtcbiAgICAgICAgICAgIGRpZ25pdGllcy5jYWxsKHRoaXMpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gd3JhcHBlciAvLz09PT09PT5cblxuICAgICAgICAvKlxuICAgICAgICAgKiAgQW5nbGUgaW4gc2lnblxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gYW5nbGVJblNpZ24oKSB7XG4gICAgICAgICAgICBjb25zdCBhbmdsZUluU2lnblBvc2l0aW9uID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh4UG9zLCB5UG9zLCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX0FOR0xFX09GRlNFVCAqIHRoaXMuI3NldHRpbmdzLlBPSU5UX0NPTExJU0lPTl9SQURJVVMsIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKC1hbmdsZUZyb21TeW1ib2xUb0NlbnRlciwgYW5nbGVTaGlmdCkpXG5cbiAgICAgICAgICAgIC8vIEl0IGlzIHBvc3NpYmxlIHRvIHJvdGF0ZSB0aGUgdGV4dCwgd2hlbiB1bmNvbW1lbnQgYSBsaW5lIGJlbGxvdy5cbiAgICAgICAgICAgIC8vdGV4dFdyYXBwZXIuc2V0QXR0cmlidXRlKFwidHJhbnNmb3JtXCIsIGByb3RhdGUoJHthbmdsZUZyb21TeW1ib2xUb0NlbnRlcn0sJHt0ZXh0UG9zaXRpb24ueH0sJHt0ZXh0UG9zaXRpb24ueX0pYClcblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqIEFsbG93cyBjaGFuZ2UgdGhlIGFuZ2xlIHN0cmluZywgZS5nLiBhZGQgdGhlIGRlZ3JlZSBzeW1ib2wgwrAgd2l0aCB0aGUgXiBjaGFyYWN0ZXIgZnJvbSBBc3Ryb25vbWljb25cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbGV0IGFuZ2xlID0gdGhpcy5nZXRBbmdsZUluU2lnbigpO1xuICAgICAgICAgICAgbGV0IGFuZ2xlUG9zaXRpb24gPSBVdGlscy5maWxsVGVtcGxhdGUodGhpcy4jc2V0dGluZ3MuQU5HTEVfVEVNUExBVEUsIHthbmdsZTogYW5nbGV9KTtcblxuICAgICAgICAgICAgY29uc3QgYW5nbGVJblNpZ25UZXh0ID0gU1ZHVXRpbHMuU1ZHVGV4dChhbmdsZUluU2lnblBvc2l0aW9uLngsIGFuZ2xlSW5TaWduUG9zaXRpb24ueSwgYW5nbGVQb3NpdGlvbilcbiAgICAgICAgICAgIGFuZ2xlSW5TaWduVGV4dC5zZXRBdHRyaWJ1dGUoXCJmb250LWZhbWlseVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9GT05UX0ZBTUlMWSk7XG4gICAgICAgICAgICBhbmdsZUluU2lnblRleHQuc2V0QXR0cmlidXRlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIikgLy8gc3RhcnQsIG1pZGRsZSwgZW5kXG4gICAgICAgICAgICBhbmdsZUluU2lnblRleHQuc2V0QXR0cmlidXRlKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcbiAgICAgICAgICAgIGFuZ2xlSW5TaWduVGV4dC5zZXRBdHRyaWJ1dGUoXCJmb250LXNpemVcIiwgdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19BTkdMRV9TSVpFIHx8IHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfRk9OVF9TSVpFKTtcbiAgICAgICAgICAgIGFuZ2xlSW5TaWduVGV4dC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfQU5HTEVfQ09MT1IgfHwgdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19DT0xPUik7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLiNzZXR0aW5ncy5DTEFTU19QT0lOVF9BTkdMRSkge1xuICAgICAgICAgICAgICAgIGFuZ2xlSW5TaWduVGV4dC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgdGhpcy4jc2V0dGluZ3MuQ0xBU1NfUE9JTlRfQU5HTEUgKyAnICcgKyB0aGlzLiNzZXR0aW5ncy5DTEFTU19QT0lOVF9BTkdMRSArICctLScgKyBhbmdsZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLiNzZXR0aW5ncy5QT0lOVF9TVFJPS0UgPz8gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBhbmdsZUluU2lnblRleHQuc2V0QXR0cmlidXRlKCdwYWludC1vcmRlcicsICdzdHJva2UnKTtcbiAgICAgICAgICAgICAgICBhbmdsZUluU2lnblRleHQuc2V0QXR0cmlidXRlKCdzdHJva2UnLCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9TVFJPS0VfQ09MT1IpO1xuICAgICAgICAgICAgICAgIGFuZ2xlSW5TaWduVGV4dC5zZXRBdHRyaWJ1dGUoJ3N0cm9rZS13aWR0aCcsIHRoaXMuI3NldHRpbmdzLlBPSU5UX1NUUk9LRV9XSURUSCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoYW5nbGVJblNpZ25UZXh0KVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgKiAgU2hvdyBzaWduXG4gICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHNob3dTaWduKCkge1xuICAgICAgICAgICAgY29uc3Qgc2lnblBvc2l0aW9uID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh4UG9zLCB5UG9zLCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX1NJR05fT0ZGU0VUICogdGhpcy4jc2V0dGluZ3MuUE9JTlRfQ09MTElTSU9OX1JBRElVUywgVXRpbHMuZGVncmVlVG9SYWRpYW4oLWFuZ2xlRnJvbVN5bWJvbFRvQ2VudGVyLCBhbmdsZVNoaWZ0KSlcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBHZXQgdGhlIHNpZ24gaW5kZXhcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbGV0IHN5bWJvbEluZGV4ID0gdGhpcy4jc2V0dGluZ3MuU0lHTl9MQUJFTFMuaW5kZXhPZih0aGlzLiNzaWduKVxuXG4gICAgICAgICAgICBjb25zdCBzaWduVGV4dCA9IFNWR1V0aWxzLlNWR1N5bWJvbCh0aGlzLiNzaWduLCBzaWduUG9zaXRpb24ueCwgc2lnblBvc2l0aW9uLnkpXG4gICAgICAgICAgICBzaWduVGV4dC5zZXRBdHRyaWJ1dGUoXCJmb250LWZhbWlseVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9GT05UX0ZBTUlMWSk7XG4gICAgICAgICAgICBzaWduVGV4dC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKSAvLyBzdGFydCwgbWlkZGxlLCBlbmRcbiAgICAgICAgICAgIHNpZ25UZXh0LnNldEF0dHJpYnV0ZShcImRvbWluYW50LWJhc2VsaW5lXCIsIFwibWlkZGxlXCIpXG4gICAgICAgICAgICBzaWduVGV4dC5zZXRBdHRyaWJ1dGUoXCJmb250LXNpemVcIiwgdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19TSUdOX1NJWkUgfHwgdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19GT05UX1NJWkUpO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE92ZXJyaWRlIHNpZ24gY29sb3JzXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlmICh0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX1NJR05fQ09MT1IgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBzaWduVGV4dC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfU0lHTl9DT0xPUik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNpZ25UZXh0LnNldEF0dHJpYnV0ZShcImZpbGxcIiwgdGhpcy4jc2V0dGluZ3MuU0lHTl9DT0xPUlNbc3ltYm9sSW5kZXhdIHx8IHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfQ09MT1IpO1xuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIGlmICh0aGlzLiNzZXR0aW5ncy5DTEFTU19QT0lOVF9TSUdOKSB7XG4gICAgICAgICAgICAgICAgc2lnblRleHQuc2V0QXR0cmlidXRlKCdjbGFzcycsIHRoaXMuI3NldHRpbmdzLkNMQVNTX1BPSU5UX1NJR04gKyAnICcgKyB0aGlzLiNzZXR0aW5ncy5DTEFTU19QT0lOVF9TSUdOICsgJy0tJyArIHRoaXMuI3NpZ24udG9Mb3dlckNhc2UoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy4jc2V0dGluZ3MuUE9JTlRfU1RST0tFID8/IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgc2lnblRleHQuc2V0QXR0cmlidXRlKCdwYWludC1vcmRlcicsICdzdHJva2UnKTtcbiAgICAgICAgICAgICAgICBzaWduVGV4dC5zZXRBdHRyaWJ1dGUoJ3N0cm9rZScsIHRoaXMuI3NldHRpbmdzLlBPSU5UX1NUUk9LRV9DT0xPUik7XG4gICAgICAgICAgICAgICAgc2lnblRleHQuc2V0QXR0cmlidXRlKCdzdHJva2Utd2lkdGgnLCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9TVFJPS0VfV0lEVEgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHNpZ25UZXh0KVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogIFJldHJvZ3JhZGVcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHJldHJvZ3JhZGUoKSB7XG4gICAgICAgICAgICBjb25zdCByZXRyb2dyYWRlUG9zaXRpb24gPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHhQb3MsIHlQb3MsIHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfUkVUUk9HUkFERV9PRkZTRVQgKiB0aGlzLiNzZXR0aW5ncy5QT0lOVF9DT0xMSVNJT05fUkFESVVTLCBVdGlscy5kZWdyZWVUb1JhZGlhbigtYW5nbGVGcm9tU3ltYm9sVG9DZW50ZXIsIGFuZ2xlU2hpZnQpKVxuXG4gICAgICAgICAgICBjb25zdCByZXRyb2dyYWRlVGV4dCA9IFNWR1V0aWxzLlNWR1RleHQocmV0cm9ncmFkZVBvc2l0aW9uLngsIHJldHJvZ3JhZGVQb3NpdGlvbi55LCBTVkdVdGlscy5TWU1CT0xfUkVUUk9HUkFERV9DT0RFKVxuICAgICAgICAgICAgcmV0cm9ncmFkZVRleHQuc2V0QXR0cmlidXRlKFwiZm9udC1mYW1pbHlcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfRk9OVF9GQU1JTFkpO1xuICAgICAgICAgICAgcmV0cm9ncmFkZVRleHQuc2V0QXR0cmlidXRlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIikgLy8gc3RhcnQsIG1pZGRsZSwgZW5kXG4gICAgICAgICAgICByZXRyb2dyYWRlVGV4dC5zZXRBdHRyaWJ1dGUoXCJkb21pbmFudC1iYXNlbGluZVwiLCBcIm1pZGRsZVwiKVxuICAgICAgICAgICAgcmV0cm9ncmFkZVRleHQuc2V0QXR0cmlidXRlKFwiZm9udC1zaXplXCIsIHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfUkVUUk9HUkFERV9TSVpFIHx8IHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfRk9OVF9TSVpFKTtcbiAgICAgICAgICAgIHJldHJvZ3JhZGVUZXh0LnNldEF0dHJpYnV0ZShcImZpbGxcIiwgdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19SRVRST0dSQURFX0NPTE9SIHx8IHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfQ09MT1IpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy4jc2V0dGluZ3MuQ0xBU1NfUE9JTlRfUkVUUk9HUkFERSkge1xuICAgICAgICAgICAgICAgIHJldHJvZ3JhZGVUZXh0LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCB0aGlzLiNzZXR0aW5ncy5DTEFTU19QT0lOVF9SRVRST0dSQURFKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuI3NldHRpbmdzLlBPSU5UX1NUUk9LRSA/PyBmYWxzZSkge1xuICAgICAgICAgICAgICAgIHJldHJvZ3JhZGVUZXh0LnNldEF0dHJpYnV0ZSgncGFpbnQtb3JkZXInLCAnc3Ryb2tlJyk7XG4gICAgICAgICAgICAgICAgcmV0cm9ncmFkZVRleHQuc2V0QXR0cmlidXRlKCdzdHJva2UnLCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9TVFJPS0VfQ09MT1IpO1xuICAgICAgICAgICAgICAgIHJldHJvZ3JhZGVUZXh0LnNldEF0dHJpYnV0ZSgnc3Ryb2tlLXdpZHRoJywgdGhpcy4jc2V0dGluZ3MuUE9JTlRfU1RST0tFX1dJRFRIKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChyZXRyb2dyYWRlVGV4dClcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqICBEaWduaXRpZXNcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGRpZ25pdGllcygpIHtcbiAgICAgICAgICAgIGNvbnN0IGRpZ25pdGllc1Bvc2l0aW9uID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh4UG9zLCB5UG9zLCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX0RJR05JVFlfT0ZGU0VUICogdGhpcy4jc2V0dGluZ3MuUE9JTlRfQ09MTElTSU9OX1JBRElVUywgVXRpbHMuZGVncmVlVG9SYWRpYW4oLWFuZ2xlRnJvbVN5bWJvbFRvQ2VudGVyLCBhbmdsZVNoaWZ0KSlcbiAgICAgICAgICAgIGNvbnN0IGRpZ25pdGllc1RleHQgPSBTVkdVdGlscy5TVkdUZXh0KGRpZ25pdGllc1Bvc2l0aW9uLngsIGRpZ25pdGllc1Bvc2l0aW9uLnksIHRoaXMuZ2V0RGlnbml0eSgpKVxuICAgICAgICAgICAgZGlnbml0aWVzVGV4dC5zZXRBdHRyaWJ1dGUoXCJmb250LWZhbWlseVwiLCBcInNhbnMtc2VyaWZcIik7XG4gICAgICAgICAgICBkaWduaXRpZXNUZXh0LnNldEF0dHJpYnV0ZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpIC8vIHN0YXJ0LCBtaWRkbGUsIGVuZFxuICAgICAgICAgICAgZGlnbml0aWVzVGV4dC5zZXRBdHRyaWJ1dGUoXCJkb21pbmFudC1iYXNlbGluZVwiLCBcIm1pZGRsZVwiKVxuICAgICAgICAgICAgZGlnbml0aWVzVGV4dC5zZXRBdHRyaWJ1dGUoXCJmb250LXNpemVcIiwgdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19ESUdOSVRZX1NJWkUgfHwgdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19GT05UX1NJWkUpO1xuICAgICAgICAgICAgZGlnbml0aWVzVGV4dC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfRElHTklUWV9DT0xPUiB8fCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX0NPTE9SKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuI3NldHRpbmdzLkNMQVNTX1BPSU5UX0RJR05JVFkpIHtcbiAgICAgICAgICAgICAgICBkaWduaXRpZXNUZXh0LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCB0aGlzLiNzZXR0aW5ncy5DTEFTU19QT0lOVF9ESUdOSVRZICsgJyAnICsgdGhpcy4jc2V0dGluZ3MuQ0xBU1NfUE9JTlRfRElHTklUWSArICctLScgKyBkaWduaXRpZXNUZXh0LnRleHRDb250ZW50KTsgLy8gU3RyYWlnaHRmb3J3YXJkIHIvZC9lL2ZcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuI3NldHRpbmdzLlBPSU5UX1NUUk9LRSA/PyBmYWxzZSkge1xuICAgICAgICAgICAgICAgIGRpZ25pdGllc1RleHQuc2V0QXR0cmlidXRlKCdwYWludC1vcmRlcicsICdzdHJva2UnKTtcbiAgICAgICAgICAgICAgICBkaWduaXRpZXNUZXh0LnNldEF0dHJpYnV0ZSgnc3Ryb2tlJywgdGhpcy4jc2V0dGluZ3MuUE9JTlRfU1RST0tFX0NPTE9SKTtcbiAgICAgICAgICAgICAgICBkaWduaXRpZXNUZXh0LnNldEF0dHJpYnV0ZSgnc3Ryb2tlLXdpZHRoJywgdGhpcy4jc2V0dGluZ3MuUE9JTlRfU1RST0tFX1dJRFRIKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChkaWduaXRpZXNUZXh0KVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IGhvdXNlIG51bWJlclxuICAgICAqXG4gICAgICogQHJldHVybiB7TnVtYmVyfVxuICAgICAqL1xuICAgIGdldEhvdXNlTnVtYmVyKCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJOb3QgaW1wbGVtZW50ZWQgeWV0LlwiKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBzaWduIG51bWJlclxuICAgICAqIEFyaXNlID0gMSwgVGF1cnVzID0gMiwgLi4uUGlzY2VzID0gMTJcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge051bWJlcn1cbiAgICAgKi9cbiAgICBnZXRTaWduTnVtYmVyKCkge1xuICAgICAgICBsZXQgYW5nbGUgPSB0aGlzLiNhbmdsZSAlIFV0aWxzLkRFR18zNjBcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoKGFuZ2xlIC8gMzApICsgMSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgYW5nbGUgKEludGVnZXIpIGluIHRoZSBzaWduIGluIHdoaWNoIGl0IHN0YW5kcy5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge051bWJlcn1cbiAgICAgKi9cbiAgICBnZXRBbmdsZUluU2lnbigpIHtcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IodGhpcy4jYW5nbGUgJSAzMClcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgZGlnbml0eSBzeW1ib2wgKHIgLSBydWxlcnNoaXAsIGQgLSBkZXRyaW1lbnQsIGYgLSBmYWxsLCBlIC0gZXhhbHRhdGlvbilcbiAgICAgKlxuICAgICAqIFVzZSBNb2Rlcm4gZGlnbml0aWVzIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0Vzc2VudGlhbF9kaWduaXR5XG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IC0gZGlnbml0eSBzeW1ib2wgKHIsZCxmLGUpXG4gICAgICovXG4gICAgZ2V0RGlnbml0eSgpIHtcbiAgICAgICAgY29uc3QgQVJJRVMgPSAxXG4gICAgICAgIGNvbnN0IFRBVVJVUyA9IDJcbiAgICAgICAgY29uc3QgR0VNSU5JID0gM1xuICAgICAgICBjb25zdCBDQU5DRVIgPSA0XG4gICAgICAgIGNvbnN0IExFTyA9IDVcbiAgICAgICAgY29uc3QgVklSR08gPSA2XG4gICAgICAgIGNvbnN0IExJQlJBID0gN1xuICAgICAgICBjb25zdCBTQ09SUElPID0gOFxuICAgICAgICBjb25zdCBTQUdJVFRBUklVUyA9IDlcbiAgICAgICAgY29uc3QgQ0FQUklDT1JOID0gMTBcbiAgICAgICAgY29uc3QgQVFVQVJJVVMgPSAxMVxuICAgICAgICBjb25zdCBQSVNDRVMgPSAxMlxuXG4gICAgICAgIGNvbnN0IFJVTEVSU0hJUF9TWU1CT0wgPSB0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX0RJR05JVFlfU1lNQk9MU1swXTtcbiAgICAgICAgY29uc3QgREVUUklNRU5UX1NZTUJPTCA9IHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfRElHTklUWV9TWU1CT0xTWzFdO1xuICAgICAgICBjb25zdCBFWEFMVEFUSU9OX1NZTUJPTCA9IHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfRElHTklUWV9TWU1CT0xTWzJdO1xuICAgICAgICBjb25zdCBGQUxMX1NZTUJPTCA9IHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfRElHTklUWV9TWU1CT0xTWzNdO1xuXG4gICAgICAgIHN3aXRjaCAodGhpcy4jbmFtZSkge1xuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfU1VOOlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PT0gTEVPKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBSVUxFUlNISVBfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PT0gQVFVQVJJVVMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIERFVFJJTUVOVF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBWSVJHTykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gRkFMTF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBBUklFUykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gRVhBTFRBVElPTl9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiXCJcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfTU9PTjpcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IENBTkNFUikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUlVMRVJTSElQX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IENBUFJJQ09STikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gREVUUklNRU5UX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IFNDT1JQSU8pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEZBTExfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PT0gVEFVUlVTKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBFWEFMVEFUSU9OX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiXCJcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfTUVSQ1VSWTpcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IEdFTUlOSSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUlVMRVJTSElQX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IFNBR0lUVEFSSVVTKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBERVRSSU1FTlRfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PT0gUElTQ0VTKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBGQUxMX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IFZJUkdPKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBFWEFMVEFUSU9OX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiXCJcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfVkVOVVM6XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBUQVVSVVMgfHwgdGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IExJQlJBKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBSVUxFUlNISVBfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PT0gQVJJRVMgfHwgdGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IFNDT1JQSU8pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIERFVFJJTUVOVF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBWSVJHTykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gRkFMTF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBQSVNDRVMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEVYQUxUQVRJT05fU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gXCJcIlxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9NQVJTOlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PT0gQVJJRVMgfHwgdGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IFNDT1JQSU8pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFJVTEVSU0hJUF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBUQVVSVVMgfHwgdGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IExJQlJBKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBERVRSSU1FTlRfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PT0gQ0FOQ0VSKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBGQUxMX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IENBUFJJQ09STikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gRVhBTFRBVElPTl9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBcIlwiXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0pVUElURVI6XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBTQUdJVFRBUklVUyB8fCB0aGlzLmdldFNpZ25OdW1iZXIoKSA9PT0gUElTQ0VTKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBSVUxFUlNISVBfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PT0gR0VNSU5JIHx8IHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBWSVJHTykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gREVUUklNRU5UX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IENBUFJJQ09STikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gRkFMTF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBDQU5DRVIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEVYQUxUQVRJT05fU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gXCJcIlxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9TQVRVUk46XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBDQVBSSUNPUk4gfHwgdGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IEFRVUFSSVVTKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBSVUxFUlNISVBfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PT0gQ0FOQ0VSIHx8IHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBMRU8pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIERFVFJJTUVOVF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBBUklFUykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gRkFMTF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBMSUJSQSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gRVhBTFRBVElPTl9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBcIlwiXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1VSQU5VUzpcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IEFRVUFSSVVTKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBSVUxFUlNISVBfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PT0gTEVPKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBERVRSSU1FTlRfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PT0gVEFVUlVTKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBGQUxMX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IFNDT1JQSU8pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEVYQUxUQVRJT05fU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gXCJcIlxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9ORVBUVU5FOlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PT0gUElTQ0VTKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBSVUxFUlNISVBfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PT0gVklSR08pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIERFVFJJTUVOVF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBHRU1JTkkgfHwgdGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IEFRVUFSSVVTKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBGQUxMX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IFNBR0lUVEFSSVVTIHx8IHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBMRU8pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEVYQUxUQVRJT05fU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gXCJcIlxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9QTFVUTzpcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IFNDT1JQSU8pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFJVTEVSU0hJUF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBUQVVSVVMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIERFVFJJTUVOVF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBMSUJSQSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gRkFMTF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBBUklFUykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gRVhBTFRBVElPTl9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBcIlwiXG5cbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiXCJcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IHtcbiAgICBQb2ludCBhcyBkZWZhdWx0XG59XG4iLCJpbXBvcnQgKiBhcyBVbml2ZXJzZSBmcm9tIFwiLi9jb25zdGFudHMvVW5pdmVyc2UuanNcIlxuaW1wb3J0ICogYXMgUmFkaXggZnJvbSBcIi4vY29uc3RhbnRzL1JhZGl4LmpzXCJcbmltcG9ydCAqIGFzIFRyYW5zaXQgZnJvbSBcIi4vY29uc3RhbnRzL1RyYW5zaXQuanNcIlxuaW1wb3J0ICogYXMgUG9pbnQgZnJvbSBcIi4vY29uc3RhbnRzL1BvaW50LmpzXCJcbmltcG9ydCAqIGFzIENvbG9ycyBmcm9tIFwiLi9jb25zdGFudHMvQ29sb3JzLmpzXCJcbmltcG9ydCAqIGFzIEFzcGVjdHMgZnJvbSBcIi4vY29uc3RhbnRzL0FzcGVjdHMuanNcIlxuXG5jb25zdCBTRVRUSU5HUyA9IE9iamVjdC5hc3NpZ24oe30sIFVuaXZlcnNlLCBSYWRpeCwgVHJhbnNpdCwgUG9pbnQsIENvbG9ycywgQXNwZWN0cyk7XG5cbmV4cG9ydCB7XG4gIFNFVFRJTkdTIGFzXG4gIGRlZmF1bHRcbn1cbiIsIi8vIG5vaW5zcGVjdGlvbiBKU1VudXNlZEdsb2JhbFN5bWJvbHNcblxuLypcbiogQXNwZWN0cyB3cmFwcGVyIGVsZW1lbnQgSURcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0IGFzcGVjdHNcbiovXG5leHBvcnQgY29uc3QgQVNQRUNUU19JRCA9IFwiYXNwZWN0c1wiXG5cbi8qXG4qIERyYXcgYXNwZWN0cyBpbnRvIGNoYXJ0IGR1cmluZyByZW5kZXJcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtCb29sZWFufVxuKiBAZGVmYXVsdCB0cnVlXG4qL1xuZXhwb3J0IGNvbnN0IERSQVdfQVNQRUNUUyA9IHRydWVcblxuLypcbiogRm9udCBzaXplIC0gYXNwZWN0c1xuKiBAY29uc3RhbnRcbiogQHR5cGUge051bWJlcn1cbiogQGRlZmF1bHQgMjdcbiovXG5leHBvcnQgY29uc3QgQVNQRUNUU19GT05UX1NJWkUgPSAxOFxuXG4vKipcbiAqIERlZmF1bHQgYXNwZWN0c1xuICpcbiAqIEZyb20gaHR0cHM6Ly93d3cucmVkZGl0LmNvbS9yL2FzdHJvbG9neS9jb21tZW50cy94YmR5ODMvd2hhdHNfYV9nb29kX29yYl9yYW5nZV9mb3JfYXNwZWN0c19jb25qdW5jdGlvbi9cbiAqIE1hbnkgb3RoZXIgc2V0dGluZ3MsIHVzdWFsbHkgZGVwZW5kcyBvbiB0aGUgcGxhbmV0LCBTdW4gLyBNb29uIHVzZSB3aWRlciByYW5nZVxuICpcbiAqIG9yYiA6IHNldHMgdGhlIHRvbGVyYW5jZSBmb3IgdGhlIGFuZ2xlXG4gKlxuICogTWFqb3IgYXNwZWN0czpcbiAqXG4gKiAgICAge25hbWU6XCJDb25qdW5jdGlvblwiLCBhbmdsZTowLCBvcmI6NCwgaXNNYWpvcjogdHJ1ZX0sXG4gKiAgICAge25hbWU6XCJPcHBvc2l0aW9uXCIsIGFuZ2xlOjE4MCwgb3JiOjQsIGlzTWFqb3I6IHRydWV9LFxuICogICAgIHtuYW1lOlwiVHJpbmVcIiwgYW5nbGU6MTIwLCBvcmI6MiwgaXNNYWpvcjogdHJ1ZX0sXG4gKiAgICAge25hbWU6XCJTcXVhcmVcIiwgYW5nbGU6OTAsIG9yYjoyLCBpc01ham9yOiB0cnVlfSxcbiAqICAgICB7bmFtZTpcIlNleHRpbGVcIiwgYW5nbGU6NjAsIG9yYjoyLCBpc01ham9yOiB0cnVlfSxcbiAqXG4gKiBNaW5vciBhc3BlY3RzOlxuICpcbiAqICAgICB7bmFtZTpcIlF1aW5jdW54XCIsIGFuZ2xlOjE1MCwgb3JiOjF9LFxuICogICAgIHtuYW1lOlwiU2VtaXNleHRpbGVcIiwgYW5nbGU6MzAsIG9yYjoxfSxcbiAqICAgICB7bmFtZTpcIlF1aW50aWxlXCIsIGFuZ2xlOjcyLCBvcmI6MX0sXG4gKiAgICAge25hbWU6XCJUcmlvY3RpbGVcIiwgYW5nbGU6MTM1LCBvcmI6MX0sXG4gKiAgICAge25hbWU6XCJTZW1pc3F1YXJlXCIsIGFuZ2xlOjQ1LCBvcmI6MX0sXG4gKlxuICogQGNvbnN0YW50XG4gKiBAdHlwZSB7QXJyYXl9XG4gKi9cbmV4cG9ydCBjb25zdCBERUZBVUxUX0FTUEVDVFMgPSBbXG4gICAge25hbWU6XCJDb25qdW5jdGlvblwiLCBhbmdsZTowLCBvcmI6NCwgaXNNYWpvcjogdHJ1ZX0sXG4gICAge25hbWU6XCJPcHBvc2l0aW9uXCIsIGFuZ2xlOjE4MCwgb3JiOjQsIGlzTWFqb3I6IHRydWV9LFxuICAgIHtuYW1lOlwiVHJpbmVcIiwgYW5nbGU6MTIwLCBvcmI6MiwgaXNNYWpvcjogdHJ1ZX0sXG4gICAge25hbWU6XCJTcXVhcmVcIiwgYW5nbGU6OTAsIG9yYjoyLCBpc01ham9yOiB0cnVlfSxcbiAgICB7bmFtZTpcIlNleHRpbGVcIiwgYW5nbGU6NjAsIG9yYjoyLCBpc01ham9yOiB0cnVlfSxcblxuXVxuIiwiLy8gbm9pbnNwZWN0aW9uIEpTVW51c2VkR2xvYmFsU3ltYm9sc1xuXG4vKipcbiAqIENoYXJ0IGJhY2tncm91bmQgY29sb3JcbiAqIEBjb25zdGFudFxuICogQHR5cGUge1N0cmluZ31cbiAqIEBkZWZhdWx0ICNmZmZcbiAqL1xuZXhwb3J0IGNvbnN0IENIQVJUX0JBQ0tHUk9VTkRfQ09MT1IgPSBcIm5vbmVcIjtcblxuLyoqXG4gKiBQbGFuZXRzIGJhY2tncm91bmQgY29sb3JcbiAqIEBjb25zdGFudFxuICogQHR5cGUge1N0cmluZ31cbiAqIEBkZWZhdWx0ICNmZmZcbiAqL1xuZXhwb3J0IGNvbnN0IFBMQU5FVFNfQkFDS0dST1VORF9DT0xPUiA9IFwiI2ZmZlwiO1xuXG4vKipcbiAqIEFzcGVjdHMgYmFja2dyb3VuZCBjb2xvclxuICogQGNvbnN0YW50XG4gKiBAdHlwZSB7U3RyaW5nfVxuICogQGRlZmF1bHQgI2ZmZlxuICovXG5leHBvcnQgY29uc3QgQVNQRUNUU19CQUNLR1JPVU5EX0NPTE9SID0gXCIjZWVlXCI7XG5cbi8qXG4qIERlZmF1bHQgY29sb3Igb2YgY2lyY2xlcyBpbiBjaGFydHNcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICMzMzNcbiovXG5leHBvcnQgY29uc3QgQ0hBUlRfQ0lSQ0xFX0NPTE9SID0gXCIjMzMzXCI7XG5cbi8qXG4qIERlZmF1bHQgY29sb3Igb2YgbGluZXMgaW4gY2hhcnRzXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjMzMzXG4qL1xuZXhwb3J0IGNvbnN0IENIQVJUX0xJTkVfQ09MT1IgPSBcIiM2NjZcIjtcblxuLypcbiogRGVmYXVsdCBjb2xvciBvZiB0ZXh0IGluIGNoYXJ0c1xuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzMzM1xuKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9URVhUX0NPTE9SID0gXCIjYmJiXCI7XG5cbi8qXG4qIERlZmF1bHQgY29sb3Igb2YgY3VzcHMgbnVtYmVyXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjMzMzXG4qL1xuZXhwb3J0IGNvbnN0IENIQVJUX0hPVVNFX05VTUJFUl9DT0xPUiA9IFwiIzMzM1wiO1xuXG4vKlxuKiBEZWZhdWx0IGNvbG9yIG9mIG1xaW4gYXhpcyAtIEFzLCBEcywgTWMsIEljXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjMDAwXG4qL1xuZXhwb3J0IGNvbnN0IENIQVJUX01BSU5fQVhJU19DT0xPUiA9IFwiIzAwMFwiO1xuXG4vKlxuKiBEZWZhdWx0IGNvbG9yIG9mIHNpZ25zIGluIGNoYXJ0cyAoYXJpc2Ugc3ltYm9sLCB0YXVydXMgc3ltYm9sLCAuLi4pXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjMDAwXG4qL1xuZXhwb3J0IGNvbnN0IENIQVJUX1NJR05TX0NPTE9SID0gXCIjMzMzXCI7XG5cbi8qXG4qIERlZmF1bHQgY29sb3Igb2YgcGxhbmV0cyBvbiB0aGUgY2hhcnQgKFN1biBzeW1ib2wsIE1vb24gc3ltYm9sLCAuLi4pXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjMDAwXG4qL1xuZXhwb3J0IGNvbnN0IENIQVJUX1BPSU5UU19DT0xPUiA9IFwiIzAwMFwiO1xuXG4vKlxuKiBEZWZhdWx0IGNvbG9yIGZvciBwb2ludCBwcm9wZXJ0aWVzIC0gYW5nbGUgaW4gc2lnbiwgZGlnbml0aWVzLCByZXRyb2dyYWRlXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjMzMzXG4qL1xuZXhwb3J0IGNvbnN0IFBPSU5UX1BST1BFUlRJRVNfQ09MT1IgPSBcIiMzMzNcIlxuXG4vKlxuKiBBcmllcyBjb2xvclxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgI0ZGNDUwMFxuKi9cbmV4cG9ydCBjb25zdCBDT0xPUl9BUklFUyA9IFwiI0ZGNDUwMFwiO1xuXG4vKlxuKiBUYXVydXMgY29sb3JcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICM4QjQ1MTNcbiovXG5leHBvcnQgY29uc3QgQ09MT1JfVEFVUlVTID0gXCIjOEI0NTEzXCI7XG5cbi8qXG4qIEdlbWlueSBjb2xvclxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzg3Q0VFQlxuKi9cbmV4cG9ydCBjb25zdCBDT0xPUl9HRU1JTkkgPSBcIiM4N0NFRUJcIjtcblxuLypcbiogQ2FuY2VyIGNvbG9yXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjMjdBRTYwXG4qL1xuZXhwb3J0IGNvbnN0IENPTE9SX0NBTkNFUiA9IFwiIzI3QUU2MFwiO1xuXG4vKlxuKiBMZW8gY29sb3JcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICNGRjQ1MDBcbiovXG5leHBvcnQgY29uc3QgQ09MT1JfTEVPID0gXCIjRkY0NTAwXCI7XG5cbi8qXG4qIFZpcmdvIGNvbG9yXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjOEI0NTEzXG4qL1xuZXhwb3J0IGNvbnN0IENPTE9SX1ZJUkdPID0gXCIjOEI0NTEzXCI7XG5cbi8qXG4qIExpYnJhIGNvbG9yXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjODdDRUVCXG4qL1xuZXhwb3J0IGNvbnN0IENPTE9SX0xJQlJBID0gXCIjODdDRUVCXCI7XG5cbi8qXG4qIFNjb3JwaW8gY29sb3JcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICMyN0FFNjBcbiovXG5leHBvcnQgY29uc3QgQ09MT1JfU0NPUlBJTyA9IFwiIzI3QUU2MFwiO1xuXG4vKlxuKiBTYWdpdHRhcml1cyBjb2xvclxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgI0ZGNDUwMFxuKi9cbmV4cG9ydCBjb25zdCBDT0xPUl9TQUdJVFRBUklVUyA9IFwiI0ZGNDUwMFwiO1xuXG4vKlxuKiBDYXByaWNvcm4gY29sb3JcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICM4QjQ1MTNcbiovXG5leHBvcnQgY29uc3QgQ09MT1JfQ0FQUklDT1JOID0gXCIjOEI0NTEzXCI7XG5cbi8qXG4qIEFxdWFyaXVzIGNvbG9yXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjODdDRUVCXG4qL1xuZXhwb3J0IGNvbnN0IENPTE9SX0FRVUFSSVVTID0gXCIjODdDRUVCXCI7XG5cbi8qXG4qIFBpc2NlcyBjb2xvclxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzI3QUU2MFxuKi9cbmV4cG9ydCBjb25zdCBDT0xPUl9QSVNDRVMgPSBcIiMyN0FFNjBcIjtcblxuLypcbiogQ29sb3Igb2YgY2lyY2xlcyBpbiBjaGFydHNcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICMzMzNcbiovXG5leHBvcnQgY29uc3QgQ0lSQ0xFX0NPTE9SID0gXCIjMzMzXCI7XG5cbi8qXG4qIENvbG9yIG9mIGFzcGVjdHNcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtPYmplY3R9XG4qL1xuZXhwb3J0IGNvbnN0IEFTUEVDVF9DT0xPUlMgPSB7XG4gICAgQ29uanVuY3Rpb246IFwiIzMzM1wiLFxuICAgIE9wcG9zaXRpb246IFwiIzFCNEY3MlwiLFxuICAgIFNxdWFyZTogXCIjNjQxRTE2XCIsXG4gICAgVHJpbmU6IFwiIzBCNTM0NVwiLFxuICAgIFNleHRpbGU6IFwiIzMzM1wiLFxuICAgIFF1aW5jdW54OiBcIiMzMzNcIixcbiAgICBTZW1pc2V4dGlsZTogXCIjMzMzXCIsXG4gICAgUXVpbnRpbGU6IFwiIzMzM1wiLFxuICAgIFRyaW9jdGlsZTogXCIjMzMzXCJcbn1cblxuLyoqXG4gKiBPdmVycmlkZSBpbmRpdmlkdWFsIHBsYW5ldCBzeW1ib2wgY29sb3JzIGJ5IHBsYW5ldCBuYW1lXG4gKi9cbmV4cG9ydCBjb25zdCBQTEFORVRfQ09MT1JTID0ge1xuICAgIC8vU3VuOiBcIiMwMDBcIixcbiAgICAvL01vb246IFwiI2FhYVwiLFxufVxuXG4vKipcbiAqIG92ZXJyaWRlIGluZGl2aWR1YWwgc2lnbiBzeW1ib2wgY29sb3JzIGJ5IHpvZGlhYyBpbmRleFxuICovXG5leHBvcnQgY29uc3QgU0lHTl9DT0xPUlMgPSB7XG4gICAgLy8wOiBcIiMzMzNcIlxufVxuXG4vKipcbiAqIEFsbCBzaWducyBsYWJlbHMgaW4gdGhlIHJpZ2h0IG9yZGVyXG4gKiBAdHlwZSB7c3RyaW5nW119XG4gKi9cbmV4cG9ydCBjb25zdCBTSUdOX0xBQkVMUyA9IFtcbiAgICBcIkFyaWVzXCIsXG4gICAgXCJUYXVydXNcIixcbiAgICBcIkdlbWluaVwiLFxuICAgIFwiQ2FuY2VyXCIsXG4gICAgXCJMZW9cIixcbiAgICBcIlZpcmdvXCIsXG4gICAgXCJMaWJyYVwiLFxuICAgIFwiU2NvcnBpb1wiLFxuICAgIFwiU2FnaXR0YXJpdXNcIixcbiAgICBcIkNhcHJpY29yblwiLFxuICAgIFwiQXF1YXJpdXNcIixcbiAgICBcIlBpc2Nlc1wiLFxuXVxuXG4vKipcbiAqIE92ZXJyaWRlIGluZGl2aWR1YWwgcGxhbmV0IHN5bWJvbCBjb2xvcnMgYnkgcGxhbmV0IG5hbWUgb24gdHJhbnNpdCBjaGFydHNcbiAqL1xuZXhwb3J0IGNvbnN0IFRSQU5TSVRfUExBTkVUX0NPTE9SUyA9IHtcbiAgICAvL1N1bjogXCIjMDAwXCIsXG4gICAgLy9Nb29uOiBcIiNhYWFcIixcbn1cbiIsIi8vIG5vaW5zcGVjdGlvbiBKU1VudXNlZEdsb2JhbFN5bWJvbHNcblxuLypcbiogUG9pbnQgcHJvcGVydGllcyAtIGFuZ2xlIGluIHNpZ24sIGRpZ25pdGllcywgcmV0cm9ncmFkZVxuKiBAY29uc3RhbnRcbiogQHR5cGUge0Jvb2xlYW59XG4qIEBkZWZhdWx0IHRydWVcbiovXG5leHBvcnQgY29uc3QgUE9JTlRfUFJPUEVSVElFU19TSE9XID0gdHJ1ZVxuXG4vKlxuKiBQb2ludCBhbmdsZSBpbiBzaWduXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7Qm9vbGVhbn1cbiogQGRlZmF1bHQgdHJ1ZVxuKi9cbmV4cG9ydCBjb25zdCBQT0lOVF9QUk9QRVJUSUVTX1NIT1dfQU5HTEUgPSB0cnVlXG5cbi8qKlxuICogUG9pbnQgc2lnblxuICogQHR5cGUge2Jvb2xlYW59XG4gKi9cbmV4cG9ydCBjb25zdCBQT0lOVF9QUk9QRVJUSUVTX1NIT1dfU0lHTiA9IGZhbHNlXG5cbi8qXG4qIFBvaW50IGRpZ25pdHkgc3ltYm9sXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7Qm9vbGVhbn1cbiogQGRlZmF1bHQgdHJ1ZVxuKi9cbmV4cG9ydCBjb25zdCBQT0lOVF9QUk9QRVJUSUVTX1NIT1dfRElHTklUWSA9IHRydWVcblxuLypcbiogUG9pbnQgcmV0cm9ncmFkZSBzeW1ib2xcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtCb29sZWFufVxuKiBAZGVmYXVsdCB0cnVlXG4qL1xuZXhwb3J0IGNvbnN0IFBPSU5UX1BST1BFUlRJRVNfU0hPV19SRVRST0dSQURFID0gdHJ1ZVxuXG4vKlxuKiBQb2ludCBkaWduaXR5IHN5bWJvbHMgLSBbZG9taWNpbGUsIGRldHJpbWVudCwgZXhhbHRhdGlvbiwgZmFsbF1cbiogQGNvbnN0YW50XG4qIEB0eXBlIHtCb29sZWFufVxuKiBAZGVmYXVsdCB0cnVlXG4qL1xuZXhwb3J0IGNvbnN0IFBPSU5UX1BST1BFUlRJRVNfRElHTklUWV9TWU1CT0xTID0gW1wiclwiLCBcImRcIiwgXCJlXCIsIFwiZlwiXTtcblxuLypcbiogVGV4dCBzaXplIG9mIFBvaW50IGRlc2NyaXB0aW9uIC0gYW5nbGUgaW4gc2lnbiwgZGlnbml0aWVzLCByZXRyb2dyYWRlXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7TnVtYmVyfVxuKiBAZGVmYXVsdCA2XG4qL1xuZXhwb3J0IGNvbnN0IFBPSU5UX1BST1BFUlRJRVNfRk9OVF9TSVpFID0gMTZcblxuLypcbiogVGV4dCBzaXplIG9mIGFuZ2xlIG51bWJlclxuKiBAY29uc3RhbnRcbiogQHR5cGUge051bWJlcn1cbiogQGRlZmF1bHQgNlxuKi9cbmV4cG9ydCBjb25zdCBQT0lOVF9QUk9QRVJUSUVTX0FOR0xFX1NJWkUgPSAyNVxuXG4vKlxuKiBUZXh0IHNpemUgb2YgcmV0cm9ncmFkZSBzeW1ib2xcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtOdW1iZXJ9XG4qIEBkZWZhdWx0IDZcbiovXG5leHBvcnQgY29uc3QgUE9JTlRfUFJPUEVSVElFU19SRVRST0dSQURFX1NJWkUgPSAyNVxuXG4vKlxuKiBUZXh0IHNpemUgb2YgZGlnbml0eSBzeW1ib2xcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtOdW1iZXJ9XG4qIEBkZWZhdWx0IDZcbiovXG5leHBvcnQgY29uc3QgUE9JTlRfUFJPUEVSVElFU19ESUdOSVRZX1NJWkUgPSAxMlxuXG4vKlxuKiBBbmdsZSBvZmZzZXQgbXVsdGlwbGllclxuKiBAY29uc3RhbnRcbiogQHR5cGUge051bWJlcn1cbiogQGRlZmF1bHQgNlxuKi9cbmV4cG9ydCBjb25zdCBQT0lOVF9QUk9QRVJUSUVTX0FOR0xFX09GRlNFVCA9IDJcblxuLyoqXG4gKiBPZmZzZXQgZnJvbSB0aGUgcGxhbmV0XG4gKiBAdHlwZSB7bnVtYmVyfVxuICovXG5leHBvcnQgY29uc3QgUE9JTlRfUFJPUEVSVElFU19TSUdOX09GRlNFVCA9IDMuNVxuXG4vKlxuKiBSZXRyb2dyYWRlIHN5bWJvbCBvZmZzZXQgbXVsdGlwbGllclxuKiBAY29uc3RhbnRcbiogQHR5cGUge051bWJlcn1cbiogQGRlZmF1bHQgNlxuKi9cbmV4cG9ydCBjb25zdCBQT0lOVF9QUk9QRVJUSUVTX1JFVFJPR1JBREVfT0ZGU0VUID0gNVxuXG4vKlxuKiBEaWduaXR5IHN5bWJvbCBvZmZzZXQgbXVsdGlwbGllclxuKiBAY29uc3RhbnRcbiogQHR5cGUge051bWJlcn1cbiogQGRlZmF1bHQgNlxuKi9cbmV4cG9ydCBjb25zdCBQT0lOVF9QUk9QRVJUSUVTX0RJR05JVFlfT0ZGU0VUID0gNlxuXG4vKipcbiAqIEEgcG9pbnQgY29sbGlzaW9uIHJhZGl1c1xuICogQGNvbnN0YW50XG4gKiBAdHlwZSB7TnVtYmVyfVxuICogQGRlZmF1bHQgMlxuICovXG5leHBvcnQgY29uc3QgUE9JTlRfQ09MTElTSU9OX1JBRElVUyA9IDEyXG5cbi8qKlxuICogVHdlYWsgdGhlIGFuZ2xlIHN0cmluZywgZS5nLiBhZGQgdGhlIGRlZ3JlZSBzeW1ib2w6IFwiJHthbmdsZX3CsFwiXG4gKiBAdHlwZSB7c3RyaW5nfVxuICovXG5leHBvcnQgY29uc3QgQU5HTEVfVEVNUExBVEUgPSBcIiR7YW5nbGV9XCJcblxuXG4vKipcbiAqIENsYXNzZXMgZm9yIHBvaW50c1xuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cbi8qKlxuICogQ2xhc3MgZm9yIENlbGVzdGlhbCBCb2RpZXMgKFBsYW5ldCAvIEFzdGVyaW9kKVxuICogYW5kIENlbGVzdGlhbCBQb2ludHMgKG5vcnRobm9kZSwgc291dGhub2RlLCBsaWxpdGgpXG4gKiBAdHlwZSB7c3RyaW5nfVxuICovXG5leHBvcnQgY29uc3QgQ0xBU1NfQ0VMRVNUSUFMID0gJyc7XG5leHBvcnQgY29uc3QgQ0xBU1NfUE9JTlRfQU5HTEUgPSAnJztcbmV4cG9ydCBjb25zdCBDTEFTU19QT0lOVF9TSUdOID0gJyc7XG5leHBvcnQgY29uc3QgQ0xBU1NfUE9JTlRfUkVUUk9HUkFERSA9ICcnO1xuZXhwb3J0IGNvbnN0IENMQVNTX1BPSU5UX0RJR05JVFkgPSAnJztcblxuLyoqXG4gKiBBZGQgYSBzdHJva2UgYXJvdW5kIGFsbCBwb2ludHNcbiAqL1xuZXhwb3J0IGNvbnN0IFBPSU5UX1NUUk9LRSA9IGZhbHNlO1xuZXhwb3J0IGNvbnN0IFBPSU5UX1NUUk9LRV9DT0xPUiA9ICcjZmZmJztcbmV4cG9ydCBjb25zdCBQT0lOVF9TVFJPS0VfV0lEVEggPSAyO1xuXG5leHBvcnQgY29uc3QgUE9JTlRfUFJPUEVSVElFU19TSUdOX0NPTE9SID0gbnVsbDsiLCIvLyBub2luc3BlY3Rpb24gSlNVbnVzZWRHbG9iYWxTeW1ib2xzXG5cbi8qXG4qIFJhZGl4IGNoYXJ0IGVsZW1lbnQgSURcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0IHJhZGl4XG4qL1xuZXhwb3J0IGNvbnN0IFJBRElYX0lEID0gXCJyYWRpeFwiXG5cbi8qXG4qIEZvbnQgc2l6ZSAtIHBvaW50cyAocGxhbmV0cylcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtOdW1iZXJ9XG4qIEBkZWZhdWx0IDI3XG4qL1xuZXhwb3J0IGNvbnN0IFJBRElYX1BPSU5UU19GT05UX1NJWkUgPSAyN1xuXG4vKlxuKiBGb250IHNpemUgLSBob3VzZSBjdXNwIG51bWJlclxuKiBAY29uc3RhbnRcbiogQHR5cGUge051bWJlcn1cbiogQGRlZmF1bHQgMjdcbiovXG5leHBvcnQgY29uc3QgUkFESVhfSE9VU0VfRk9OVF9TSVpFID0gMjBcblxuLypcbiogRm9udCBzaXplIC0gc2lnbnNcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtOdW1iZXJ9XG4qIEBkZWZhdWx0IDI3XG4qL1xuZXhwb3J0IGNvbnN0IFJBRElYX1NJR05TX0ZPTlRfU0laRSA9IDI3XG5cbi8qXG4qIEZvbnQgc2l6ZSAtIGF4aXMgKEFzLCBEcywgTWMsIEljKVxuKiBAY29uc3RhbnRcbiogQHR5cGUge051bWJlcn1cbiogQGRlZmF1bHQgMjRcbiovXG5leHBvcnQgY29uc3QgUkFESVhfQVhJU19GT05UX1NJWkUgPSAzMlxuXG5cbmV4cG9ydCBjb25zdCBTWU1CT0xfU1RST0tFID0gZmFsc2VcbmV4cG9ydCBjb25zdCBTWU1CT0xfU1RST0tFX0NPTE9SID0gJyNGRkYnXG5leHBvcnQgY29uc3QgU1lNQk9MX1NUUk9LRV9XSURUSCA9ICc0J1xuXG5leHBvcnQgY29uc3QgU0lHTl9DT0xPUl9DSVJDTEUgPSBudWxsIiwiLy8gbm9pbnNwZWN0aW9uIEpTVW51c2VkR2xvYmFsU3ltYm9sc1xuXG4vKlxuKiBUcmFuc2l0IGNoYXJ0IGVsZW1lbnQgSURcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0IHRyYW5zaXRcbiovXG5leHBvcnQgY29uc3QgVFJBTlNJVF9JRCA9IFwidHJhbnNpdFwiXG5cbi8qXG4qIEZvbnQgc2l6ZSAtIHBvaW50cyAocGxhbmV0cylcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtOdW1iZXJ9XG4qIEBkZWZhdWx0IDMyXG4qL1xuZXhwb3J0IGNvbnN0IFRSQU5TSVRfUE9JTlRTX0ZPTlRfU0laRSA9IDI3XG4iLCIvLyBub2luc3BlY3Rpb24gSlNVbnVzZWRHbG9iYWxTeW1ib2xzXG5cbi8qKlxuICogQ2hhcnQgcGFkZGluZ1xuICogQGNvbnN0YW50XG4gKiBAdHlwZSB7TnVtYmVyfVxuICogQGRlZmF1bHQgMTBweFxuICovXG5leHBvcnQgY29uc3QgQ0hBUlRfUEFERElORyA9IDQwXG5cbi8qKlxuICogU1ZHIHZpZXdCb3ggd2lkdGhcbiAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvU1ZHL0F0dHJpYnV0ZS92aWV3Qm94XG4gKiBAY29uc3RhbnRcbiAqIEB0eXBlIHtOdW1iZXJ9XG4gKiBAZGVmYXVsdCA4MDBcbiAqL1xuZXhwb3J0IGNvbnN0IENIQVJUX1ZJRVdCT1hfV0lEVEggPSA4MDBcblxuLyoqXG4gKiBTVkcgdmlld0JveCBoZWlnaHRcbiAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvU1ZHL0F0dHJpYnV0ZS92aWV3Qm94XG4gKiBAY29uc3RhbnRcbiAqIEB0eXBlIHtOdW1iZXJ9XG4gKiBAZGVmYXVsdCA4MDBcbiAqL1xuZXhwb3J0IGNvbnN0IENIQVJUX1ZJRVdCT1hfSEVJR0hUID0gODAwXG5cbi8qKlxuICogQ2hhbmdlIHRoZSBzaXplIG9mIHRoZSBjZW50ZXIgY2lyY2xlLCB3aGVyZSBhc3BlY3RzIGFyZVxuICogQHR5cGUge251bWJlcn1cbiAqL1xuZXhwb3J0IGNvbnN0IENIQVJUX0NFTlRFUl9TSVpFID0gMVxuXG4vKlxuKiBMaW5lIHN0cmVuZ3RoXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7TnVtYmVyfVxuKiBAZGVmYXVsdCAxXG4qL1xuZXhwb3J0IGNvbnN0IENIQVJUX1NUUk9LRSA9IDFcblxuLypcbiogTGluZSBzdHJlbmd0aCBvZiB0aGUgbWFpbiBsaW5lcy4gRm9yIGluc3RhbmNlIHBvaW50cywgbWFpbiBheGlzLCBtYWluIGNpcmNsZXNcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtOdW1iZXJ9XG4qIEBkZWZhdWx0IDFcbiovXG5leHBvcnQgY29uc3QgQ0hBUlRfTUFJTl9TVFJPS0UgPSAyXG5cbi8qKlxuICogTGluZSBzdHJlbmd0aCBmb3IgbWlub3IgYXNwZWN0c1xuICpcbiAqIEB0eXBlIHtudW1iZXJ9XG4gKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9TVFJPS0VfTUlOT1JfQVNQRUNUID0gMVxuXG4vKipcbiAqIE5vIGZpbGwsIG9ubHkgc3Ryb2tlXG4gKiBAY29uc3RhbnRcbiAqIEB0eXBlIHtib29sZWFufVxuICogQGRlZmF1bHQgZmFsc2VcbiAqL1xuZXhwb3J0IGNvbnN0IENIQVJUX1NUUk9LRV9PTkxZID0gZmFsc2U7XG5cbi8qKlxuICogRm9udCBmYW1pbHlcbiAqIEBjb25zdGFudFxuICogQHR5cGUge1N0cmluZ31cbiAqIEBkZWZhdWx0XG4gKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9GT05UX0ZBTUlMWSA9IFwiQXN0cm9ub21pY29uXCI7XG5cbi8qKlxuICogQWx3YXlzIGRyYXcgdGhlIGZ1bGwgaG91c2UgbGluZXMsIGV2ZW4gaWYgaXQgb3ZlcmxhcHMgd2l0aCBwbGFuZXRzXG4gKiBAY29uc3RhbnRcbiAqIEB0eXBlIHtib29sZWFufVxuICogQGRlZmF1bHQgZmFsc2VcbiAqL1xuZXhwb3J0IGNvbnN0IENIQVJUX0FMTE9XX0hPVVNFX09WRVJMQVAgPSBmYWxzZTtcblxuLyoqXG4gKiBEcmF3IG1haW5zIGF4aXMgc3ltYm9scyBvdXRzaWRlIHRoZSBjaGFydDogQWMsIE1jLCBJYywgRGNcbiAqIEBjb25zdGFudFxuICogQHR5cGUge2Jvb2xlYW59XG4gKiBAZGVmYXVsdCBmYWxzZVxuICovXG5leHBvcnQgY29uc3QgQ0hBUlRfRFJBV19NQUlOX0FYSVMgPSB0cnVlO1xuXG5cbi8qKlxuICogU3Ryb2tlICYgZmlsbFxuICogQGNvbnN0YW50XG4gKiBAdHlwZSB7Ym9vbGVhbn1cbiAqIEBkZWZhdWx0IGZhbHNlXG4gKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9TVFJPS0VfV0lUSF9DT0xPUiA9IGZhbHNlO1xuXG5cbi8qKlxuICogQWxsIGNsYXNzbmFtZXNcbiAqL1xuXG4vKipcbiAqIENsYXNzIGZvciB0aGUgc2lnbiBzZWdtZW50LCBiZWhpbmQgdGhlIGFjdHVhbCBzaWduXG4gKiBAdHlwZSB7c3RyaW5nfVxuICovXG5leHBvcnQgY29uc3QgQ0xBU1NfU0lHTl9TRUdNRU5UID0gJyc7XG5cbi8qKlxuICogQ2xhc3MgZm9yIHRoZSBzaWduXG4gKiBJZiBub3QgZW1wdHksIGFub3RoZXIgY2xhc3Mgd2lsbCBiZSBhZGRlZCB1c2luZyBzYW1lIHN0cmluZywgd2l0aCBhIG1vZGlmaWVyIGxpa2UgLS1zaWduX25hbWVcbiAqIEB0eXBlIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBjb25zdCBDTEFTU19TSUdOID0gJyc7XG5cbi8qKlxuICogQ2xhc3MgZm9yIGF4aXMgQXNjZW5kYW50LCBNaWRoZWF2ZW4sIERlc2NlbmRhbnQgYW5kIEltdW0gQ29lbGlcbiAqIElmIG5vdCBlbXB0eSwgYW5vdGhlciBjbGFzcyB3aWxsIGJlIGFkZGVkIHVzaW5nIHNhbWUgc3RyaW5nLCB3aXRoIGEgbW9kaWZpZXIgbGlrZSAtLWF4aXNfbmFtZVxuICogQHR5cGUge3N0cmluZ31cbiAqL1xuZXhwb3J0IGNvbnN0IENMQVNTX0FYSVMgPSAnJztcblxuLyoqXG4gKiBDbGFzcyBmb3IgdGhlIGFzcGVjdCBjaGFyYWN0ZXJcbiAqIEB0eXBlIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBjb25zdCBDTEFTU19TSUdOX0FTUEVDVCA9ICcnO1xuXG4vKipcbiAqIENsYXNzIGZvciBhc3BlY3QgbGluZXNcbiAqIEB0eXBlIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBjb25zdCBDTEFTU19TSUdOX0FTUEVDVF9MSU5FID0gJyc7XG5cbi8qKlxuICogVXNlIHBsYW5ldCBjb2xvciBmb3IgdGhlIGNoYXJ0IGxpbmUgbmV4dCB0byBhIHBsYW5ldFxuICogQHR5cGUge2Jvb2xlYW59XG4gKi9cbmV4cG9ydCBjb25zdCBQTEFORVRfTElORV9VU0VfUExBTkVUX0NPTE9SID0gZmFsc2U7XG5cbi8qKlxuICogRHJhdyBhIHJ1bGVyIG1hcmsgKHRpbnkgc3F1YXJlKSBhdCBwbGFuZXQgcG9zaXRpb25cbiAqL1xuZXhwb3J0IGNvbnN0IERSQVdfUlVMRVJfTUFSSyA9IHRydWU7XG5cbmV4cG9ydCBjb25zdCBGT05UX0FTVFJPTk9NSUNPTl9MT0FEID0gdHJ1ZTtcbmV4cG9ydCBjb25zdCBGT05UX0FTVFJPTk9NSUNPTl9QQVRIID0gJy4uL2Fzc2V0cy9mb250cy90dGYvQXN0cm9ub21pY29uRm9udHNfMS4xL0FzdHJvbm9taWNvbi50dGYnOyIsImltcG9ydCBEZWZhdWx0U2V0dGluZ3MgZnJvbSAnLi4vc2V0dGluZ3MvRGVmYXVsdFNldHRpbmdzLmpzJztcbmltcG9ydCBTVkdVdGlscyBmcm9tICcuLi91dGlscy9TVkdVdGlscy5qcyc7XG5pbXBvcnQgUmFkaXhDaGFydCBmcm9tICcuLi9jaGFydHMvUmFkaXhDaGFydC5qcyc7XG5pbXBvcnQgVHJhbnNpdENoYXJ0IGZyb20gJy4uL2NoYXJ0cy9UcmFuc2l0Q2hhcnQuanMnO1xuXG5cbi8qKlxuICogQGNsYXNzXG4gKiBAY2xhc3NkZXNjIEFuIHdyYXBwZXIgZm9yIGFsbCBwYXJ0cyBvZiBncmFwaC5cbiAqIEBwdWJsaWNcbiAqL1xuY2xhc3MgVW5pdmVyc2Uge1xuXG4gICAgI1NWR0RvY3VtZW50XG4gICAgI3NldHRpbmdzXG4gICAgI3JhZGl4XG4gICAgI3RyYW5zaXRcbiAgICAjYXNwZWN0c1dyYXBwZXJcblxuICAgIC8qKlxuICAgICAqIEBjb25zdHJ1Y3RzXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGh0bWxFbGVtZW50SUQgLSBJRCBvZiB0aGUgcm9vdCBlbGVtZW50IHdpdGhvdXQgdGhlICMgc2lnblxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gLSBBbiBvYmplY3QgdGhhdCBvdmVycmlkZXMgdGhlIGRlZmF1bHQgc2V0dGluZ3MgdmFsdWVzXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoaHRtbEVsZW1lbnRJRCwgb3B0aW9ucyA9IHt9KSB7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBodG1sRWxlbWVudElEICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBIHJlcXVpcmVkIHBhcmFtZXRlciBpcyBtaXNzaW5nLicpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoISBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChodG1sRWxlbWVudElEKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5vdCBmaW5kIGEgSFRNTCBlbGVtZW50IHdpdGggSUQgJyArIGh0bWxFbGVtZW50SUQpXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLiNzZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oe30sIERlZmF1bHRTZXR0aW5ncywgb3B0aW9ucywge1xuICAgICAgICAgICAgSFRNTF9FTEVNRU5UX0lEOiBodG1sRWxlbWVudElEXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLiNTVkdEb2N1bWVudCA9IFNWR1V0aWxzLlNWR0RvY3VtZW50KHRoaXMuI3NldHRpbmdzLkNIQVJUX1ZJRVdCT1hfV0lEVEgsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1ZJRVdCT1hfSEVJR0hUKVxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChodG1sRWxlbWVudElEKS5hcHBlbmRDaGlsZCh0aGlzLiNTVkdEb2N1bWVudCk7XG5cbiAgICAgICAgLy8gY2hhcnQgYmFja2dyb3VuZFxuICAgICAgICBjb25zdCBiYWNrZ3JvdW5kR3JvdXAgPSBTVkdVdGlscy5TVkdHcm91cCgpXG4gICAgICAgIGJhY2tncm91bmRHcm91cC5jbGFzc0xpc3QuYWRkKCdjLWJhY2tncm91bmRzJylcbiAgICAgICAgY29uc3QgY2lyY2xlID0gU1ZHVXRpbHMuU1ZHQ2lyY2xlKHRoaXMuI3NldHRpbmdzLkNIQVJUX1ZJRVdCT1hfV0lEVEggLyAyLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9WSUVXQk9YX0hFSUdIVCAvIDIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1ZJRVdCT1hfV0lEVEggLyAyKVxuICAgICAgICBjaXJjbGUuc2V0QXR0cmlidXRlKCdmaWxsJywgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfQkFDS0dST1VORF9DT0xPUilcbiAgICAgICAgY2lyY2xlLmNsYXNzTGlzdC5hZGQoJ2MtY2hhcnQtYmFja2dyb3VuZCcpO1xuICAgICAgICBiYWNrZ3JvdW5kR3JvdXAuYXBwZW5kQ2hpbGQoY2lyY2xlKVxuICAgICAgICB0aGlzLiNTVkdEb2N1bWVudC5hcHBlbmRDaGlsZChiYWNrZ3JvdW5kR3JvdXApXG5cbiAgICAgICAgLy8gY3JlYXRlIHdyYXBwZXIgZm9yIGFzcGVjdHNcbiAgICAgICAgdGhpcy4jYXNwZWN0c1dyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG4gICAgICAgIHRoaXMuI2FzcGVjdHNXcmFwcGVyLnNldEF0dHJpYnV0ZShcImlkXCIsIGAke3RoaXMuI3NldHRpbmdzLkhUTUxfRUxFTUVOVF9JRH0tJHt0aGlzLiNzZXR0aW5ncy5BU1BFQ1RTX0lEfWApXG4gICAgICAgIHRoaXMuI1NWR0RvY3VtZW50LmFwcGVuZENoaWxkKHRoaXMuI2FzcGVjdHNXcmFwcGVyKVxuXG4gICAgICAgIHRoaXMuI3JhZGl4ID0gbmV3IFJhZGl4Q2hhcnQodGhpcylcbiAgICAgICAgdGhpcy4jdHJhbnNpdCA9IG5ldyBUcmFuc2l0Q2hhcnQodGhpcy4jcmFkaXgpXG5cbiAgICAgICAgaWYgKHRoaXMuI3NldHRpbmdzLkZPTlRfQVNUUk9OT01JQ09OX0xPQUQpIHtcbiAgICAgICAgICAgIHRoaXMuI2xvYWRGb250KFwiQXN0cm9ub21pY29uXCIsIHRoaXMuI3NldHRpbmdzLkZPTlRfQVNUUk9OT01JQ09OX1BBVEgpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIC8vICMjIFBVQkxJQyAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuICAgIC8qKlxuICAgICAqIEdldCBSYWRpeCBjaGFydFxuICAgICAqIEByZXR1cm4ge1JhZGl4Q2hhcnR9XG4gICAgICovXG4gICAgcmFkaXgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiNyYWRpeFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBUcmFuc2l0IGNoYXJ0XG4gICAgICogQHJldHVybiB7VHJhbnNpdENoYXJ0fVxuICAgICAqL1xuICAgIHRyYW5zaXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiN0cmFuc2l0XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IGN1cnJlbnQgc2V0dGluZ3NcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG4gICAgZ2V0U2V0dGluZ3MoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiNzZXR0aW5nc1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCByb290IFNWRyBkb2N1bWVudFxuICAgICAqIEByZXR1cm4ge1NWR0RvY3VtZW50fVxuICAgICAqL1xuICAgIGdldFNWR0RvY3VtZW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy4jU1ZHRG9jdW1lbnRcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgZW1wdHkgYXNwZWN0cyB3cmFwcGVyIGVsZW1lbnRcbiAgICAgKiBAcmV0dXJuIHtTVkdHcm91cEVsZW1lbnR9XG4gICAgICovXG4gICAgZ2V0QXNwZWN0c0VsZW1lbnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiNhc3BlY3RzV3JhcHBlclxuICAgIH1cblxuICAgIC8vICMjIFBSSVZBVEUgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiAgICAvKlxuICAgICogTG9hZCBmb25kIHRvIERPTVxuICAgICpcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSBmYW1pbHlcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSBzb3VyY2VcbiAgICAqIEBwYXJhbSB7T2JqZWN0fVxuICAgICpcbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0ZvbnRGYWNlL0ZvbnRGYWNlXG4gICAgKi9cbiAgICBhc3luYyAjbG9hZEZvbnQoZmFtaWx5LCBzb3VyY2UsIGRlc2NyaXB0b3JzKSB7XG5cbiAgICAgICAgaWYgKCEgKCdGb250RmFjZScgaW4gd2luZG93KSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIk9vb3BzLCBGb250RmFjZSBpcyBub3QgYSBmdW5jdGlvbi5cIilcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9DU1NfRm9udF9Mb2FkaW5nX0FQSVwiKVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBmb250ID0gbmV3IEZvbnRGYWNlKGZhbWlseSwgYHVybCgke3NvdXJjZX0pYCwgZGVzY3JpcHRvcnMpXG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGF3YWl0IGZvbnQubG9hZCgpO1xuICAgICAgICAgICAgZG9jdW1lbnQuZm9udHMuYWRkKGZvbnQpXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihlKVxuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQge1xuICAgIFVuaXZlcnNlIGFzXG4gICAgICAgIGRlZmF1bHRcbn1cbiIsImltcG9ydCBVdGlscyBmcm9tICcuL1V0aWxzLmpzJ1xuaW1wb3J0IFNWR1V0aWxzIGZyb20gJy4vU1ZHVXRpbHMuanMnO1xuXG4vKipcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyBVdGlsaXR5IGNsYXNzXG4gKiBAcHVibGljXG4gKiBAc3RhdGljXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKi9cbmNsYXNzIEFzcGVjdFV0aWxzIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBpZiAodGhpcyBpbnN0YW5jZW9mIEFzcGVjdFV0aWxzKSB7XG4gICAgICAgICAgICB0aHJvdyBFcnJvcignVGhpcyBpcyBhIHN0YXRpYyBjbGFzcyBhbmQgY2Fubm90IGJlIGluc3RhbnRpYXRlZC4nKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENhbGN1bGF0ZXMgdGhlIG9yYml0IG9mIHR3byBhbmdsZXMgb24gYSBjaXJjbGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBmcm9tQW5nbGUgLSBhbmdsZSBpbiBkZWdyZWUsIHBvaW50IG9uIHRoZSBjaXJjbGVcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gdG9BbmdsZSAtIGFuZ2xlIGluIGRlZ3JlZSwgcG9pbnQgb24gdGhlIGNpcmNsZVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBhc3BlY3RBbmdsZSAtIDYwLDkwLDEyMCwgLi4uXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IG9yYlxuICAgICAqL1xuICAgIHN0YXRpYyBvcmIoZnJvbUFuZ2xlLCB0b0FuZ2xlLCBhc3BlY3RBbmdsZSkge1xuICAgICAgICBsZXQgb3JiXG4gICAgICAgIGxldCBzaWduID0gZnJvbUFuZ2xlID4gdG9BbmdsZSA/IDEgOiAtMVxuICAgICAgICBsZXQgZGlmZmVyZW5jZSA9IE1hdGguYWJzKGZyb21BbmdsZSAtIHRvQW5nbGUpXG5cbiAgICAgICAgaWYgKGRpZmZlcmVuY2UgPiBVdGlscy5ERUdfMTgwKSB7XG4gICAgICAgICAgICBkaWZmZXJlbmNlID0gVXRpbHMuREVHXzM2MCAtIGRpZmZlcmVuY2U7XG4gICAgICAgICAgICBvcmIgPSAoZGlmZmVyZW5jZSAtIGFzcGVjdEFuZ2xlKSAqIC0xXG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9yYiA9IChkaWZmZXJlbmNlIC0gYXNwZWN0QW5nbGUpICogc2lnblxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIE51bWJlcihOdW1iZXIob3JiKS50b0ZpeGVkKDIpKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBhc3BlY3RzXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IGZyb21Qb2ludHMgLSBbe25hbWU6XCJNb29uXCIsIGFuZ2xlOjB9LCB7bmFtZTpcIlN1blwiLCBhbmdsZToxNzl9LCB7bmFtZTpcIk1lcmN1cnlcIiwgYW5nbGU6MTIxfV1cbiAgICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IHRvUG9pbnRzIC0gW3tuYW1lOlwiQVNcIiwgYW5nbGU6MH0sIHtuYW1lOlwiSUNcIiwgYW5nbGU6OTB9XVxuICAgICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gYXNwZWN0cyAtIFt7bmFtZTpcIk9wcG9zaXRpb25cIiwgYW5nbGU6MTgwLCBvcmI6Mn0sIHtuYW1lOlwiVHJpbmVcIiwgYW5nbGU6MTIwLCBvcmI6Mn1dXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtBcnJheTxPYmplY3Q+fVxuICAgICAqL1xuICAgIHN0YXRpYyBnZXRBc3BlY3RzKGZyb21Qb2ludHMsIHRvUG9pbnRzLCBhc3BlY3RzKSB7XG4gICAgICAgIGNvbnN0IGFzcGVjdExpc3QgPSBbXVxuICAgICAgICBmb3IgKGNvbnN0IGZyb21QIG9mIGZyb21Qb2ludHMpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgdG9QIG9mIHRvUG9pbnRzKSB7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBhc3BlY3Qgb2YgYXNwZWN0cykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBvcmIgPSBBc3BlY3RVdGlscy5vcmIoZnJvbVAuYW5nbGUsIHRvUC5hbmdsZSwgYXNwZWN0LmFuZ2xlKVxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogVXNlIGN1c3RvbSBvcmJzIGlmIGF2YWlsYWJsZTpcbiAgICAgICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgICAgICogREVGQVVMVF9BU1BFQ1RTOiBbXG4gICAgICAgICAgICAgICAgICAgICAqICAgICAgICAgICAgIHtuYW1lOiBcIkNvbmp1bmN0aW9uXCIsIGFuZ2xlOiAwLCBvcmI6IDQsIG9yYnM6IHsnU3VuJzogMTB9LCBpc01ham9yOiB0cnVlfSxcbiAgICAgICAgICAgICAgICAgICAgICogICAgICAgICAgICAgLi4uXG4gICAgICAgICAgICAgICAgICAgICAqICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICogQHR5cGUge251bWJlcn1cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGxldCBvcmJMaW1pdCA9ICgoYXNwZWN0Lm9yYnM/Lltmcm9tUC5uYW1lXSA/PyBhc3BlY3Qub3JiKSArIChhc3BlY3Qub3Jicz8uW3RvUC5uYW1lXSA/PyBhc3BlY3Qub3JiKSkgLyAyXG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKG9yYikgPD0gb3JiTGltaXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFzcGVjdExpc3QucHVzaCh7YXNwZWN0OiBhc3BlY3QsIGZyb206IGZyb21QLCB0bzogdG9QLCBwcmVjaXNpb246IG9yYn0pXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYXNwZWN0TGlzdFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERyYXcgYXNwZWN0c1xuICAgICAqXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHJhZGl1c1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBhc2NlbmRhbnRTaGlmdFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzZXR0aW5nc1xuICAgICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gYXNwZWN0c0xpc3RcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1NWR0dyb3VwRWxlbWVudH1cbiAgICAgKi9cbiAgICBzdGF0aWMgZHJhd0FzcGVjdHMocmFkaXVzLCBhc2NlbmRhbnRTaGlmdCwgc2V0dGluZ3MsIGFzcGVjdHNMaXN0KSB7XG4gICAgICAgIGNvbnN0IGNlbnRlclggPSBzZXR0aW5ncy5DSEFSVF9WSUVXQk9YX1dJRFRIIC8gMlxuICAgICAgICBjb25zdCBjZW50ZXJZID0gc2V0dGluZ3MuQ0hBUlRfVklFV0JPWF9IRUlHSFQgLyAyXG5cbiAgICAgICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcbiAgICAgICAgd3JhcHBlci5jbGFzc0xpc3QuYWRkKCdjLWFzcGVjdHMnKVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZW9yZGVyIGFzcGVjdHNcbiAgICAgICAgICogRHJhdyBtaW5vciBhc3BlY3RzIGZpcnN0XG4gICAgICAgICAqL1xuICAgICAgICBhc3BlY3RzTGlzdC5zb3J0KChhLCBiKSA9PiAoKGEuYXNwZWN0LmlzTWFqb3IgPz8gZmFsc2UpID09PSAoYi5hc3BlY3QuaXNNYWpvciA/PyBmYWxzZSkpID8gMCA6IChhLmFzcGVjdC5pc01ham9yID8/IGZhbHNlKSA/IDEgOiAtMSlcblxuICAgICAgICBjb25zdCBhc3BlY3RHcm91cHMgPSBbXTtcblxuICAgICAgICBmb3IgKGNvbnN0IGFzcCBvZiBhc3BlY3RzTGlzdCkge1xuICAgICAgICAgICAgY29uc3QgYXNwZWN0R3JvdXAgPSBTVkdVdGlscy5TVkdHcm91cCgpXG4gICAgICAgICAgICBhc3BlY3RHcm91cC5jbGFzc0xpc3QuYWRkKCdjLWFzcGVjdHNfX2FzcGVjdCcpXG4gICAgICAgICAgICBhc3BlY3RHcm91cC5jbGFzc0xpc3QuYWRkKCdjLWFzcGVjdHNfX2FzcGVjdC0tJyArIGFzcC5hc3BlY3QubmFtZS50b0xvd2VyQ2FzZSgpKVxuICAgICAgICAgICAgYXNwZWN0R3JvdXBzLnB1c2goYXNwZWN0R3JvdXApXG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogU3BsaXQgdGhlIGFzcGVjdCBsaW5lIGluIHR3bywgd2l0aCBhIGdhcGUgZml4ZWQgaW4gcGl4ZWxzXG4gICAgICAgICAqXG4gICAgICAgICAqIEBhdXRob3IgQ2hhdEdQVFxuICAgICAgICAgKiBAcGFyYW0gZnJvbVBvaW50XG4gICAgICAgICAqIEBwYXJhbSB0b1BvaW50XG4gICAgICAgICAqIEBwYXJhbSBnYXBcbiAgICAgICAgICogQHJldHVybnMge1tbe3g6IG51bWJlciwgeTogbnVtYmVyfSwge3g6IG51bWJlciwgeTogbnVtYmVyfV0sW3t4OiBudW1iZXIsIHk6IG51bWJlcn0se3g6IG51bWJlciwgeTogbnVtYmVyfV1dfVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3Qgc3BsaXRMaW5lV2l0aEdhcCA9IGZ1bmN0aW9uIChmcm9tUG9pbnQsIHRvUG9pbnQsIGdhcCA9IDE1KSB7XG4gICAgICAgICAgICBjb25zdCBkeCA9IHRvUG9pbnQueCAtIGZyb21Qb2ludC54O1xuICAgICAgICAgICAgY29uc3QgZHkgPSB0b1BvaW50LnkgLSBmcm9tUG9pbnQueTtcblxuICAgICAgICAgICAgLy8gTGluZSBsZW5ndGhcbiAgICAgICAgICAgIGNvbnN0IGxlbmd0aCA9IE1hdGguc3FydChkeCAqIGR4ICsgZHkgKiBkeSk7XG5cbiAgICAgICAgICAgIC8vIE1pZHBvaW50XG4gICAgICAgICAgICBjb25zdCBtaWRYID0gKGZyb21Qb2ludC54ICsgdG9Qb2ludC54KSAvIDI7XG4gICAgICAgICAgICBjb25zdCBtaWRZID0gKGZyb21Qb2ludC55ICsgdG9Qb2ludC55KSAvIDI7XG5cbiAgICAgICAgICAgIC8vIEhhbGYgZ2FwIGFsb25nIHRoZSBwZXJwZW5kaWN1bGFyXG4gICAgICAgICAgICBjb25zdCBvZmZzZXQgPSBnYXAgLyAyO1xuXG4gICAgICAgICAgICAvLyBBZGp1c3QgbWlkcG9pbnQgYWxvbmcgdGhlIGxpbmUgZGlyZWN0aW9uIHRvIGdldCBzcGxpdCBwb2ludHNcbiAgICAgICAgICAgIGNvbnN0IGRpclggPSBkeCAvIGxlbmd0aDtcbiAgICAgICAgICAgIGNvbnN0IGRpclkgPSBkeSAvIGxlbmd0aDtcblxuICAgICAgICAgICAgLy8gRmlyc3Qgc2VnbWVudDogZnJvbVBvaW50IHRvIG1pZCAtIG9mZnNldCBpbiBkaXJlY3Rpb24gb2YgbGluZVxuICAgICAgICAgICAgY29uc3QgcDEgPSBmcm9tUG9pbnQ7XG4gICAgICAgICAgICBjb25zdCBwMiA9IHtcbiAgICAgICAgICAgICAgICB4OiBtaWRYIC0gZGlyWCAqIG9mZnNldCxcbiAgICAgICAgICAgICAgICB5OiBtaWRZIC0gZGlyWSAqIG9mZnNldFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gU2Vjb25kIHNlZ21lbnQ6IG1pZCArIG9mZnNldCB0byB0b1BvaW50XG4gICAgICAgICAgICBjb25zdCBwMyA9IHtcbiAgICAgICAgICAgICAgICB4OiBtaWRYICsgZGlyWCAqIG9mZnNldCxcbiAgICAgICAgICAgICAgICB5OiBtaWRZICsgZGlyWSAqIG9mZnNldFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGNvbnN0IHA0ID0gdG9Qb2ludDtcblxuICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICBbcDEsIHAyXSwgLy8gZmlyc3QgbGluZSBzZWdtZW50XG4gICAgICAgICAgICAgICAgW3AzLCBwNF0gIC8vIHNlY29uZCBsaW5lIHNlZ21lbnRcbiAgICAgICAgICAgIF07XG4gICAgICAgIH1cblxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEcmF3IGxpbmVzIGZpcnN0XG4gICAgICAgICAqL1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFzcGVjdHNMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBhc3AgPSBhc3BlY3RzTGlzdFtpXTtcbiAgICAgICAgICAgIGNvbnN0IGFzcGVjdEdyb3VwID0gYXNwZWN0R3JvdXBzW2ldO1xuXG4gICAgICAgICAgICAvLyBhc3BlY3QgYXMgc29saWQgbGluZVxuICAgICAgICAgICAgY29uc3QgZnJvbVBvaW50ID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZShjZW50ZXJYLCBjZW50ZXJZLCByYWRpdXMsIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKGFzcC5mcm9tLmFuZ2xlLCBhc2NlbmRhbnRTaGlmdCkpXG4gICAgICAgICAgICBjb25zdCB0b1BvaW50ID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZShjZW50ZXJYLCBjZW50ZXJZLCByYWRpdXMsIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKGFzcC50by5hbmdsZSwgYXNjZW5kYW50U2hpZnQpKVxuXG4gICAgICAgICAgICBjb25zdCBbc3BsaXRMaW5lMSwgc3BsaXRMaW5lMl0gPSBzcGxpdExpbmVXaXRoR2FwKGZyb21Qb2ludCwgdG9Qb2ludCwgc2V0dGluZ3MuQVNQRUNUU19GT05UX1NJWkUgPz8gMjApO1xuXG4gICAgICAgICAgICBjb25zdCBsaW5lMSA9IFNWR1V0aWxzLlNWR0xpbmUoc3BsaXRMaW5lMVswXS54LCBzcGxpdExpbmUxWzBdLnksIHNwbGl0TGluZTFbMV0ueCwgc3BsaXRMaW5lMVsxXS55KVxuICAgICAgICAgICAgbGluZTEuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHNldHRpbmdzLkFTUEVDVF9DT0xPUlNbYXNwLmFzcGVjdC5uYW1lXSA/PyBcIiMzMzNcIik7XG5cbiAgICAgICAgICAgIGlmIChzZXR0aW5ncy5DSEFSVF9TVFJPS0VfTUlOT1JfQVNQRUNUICYmICEgKGFzcC5hc3BlY3QuaXNNYWpvciA/PyBmYWxzZSkpIHtcbiAgICAgICAgICAgICAgICBsaW5lMS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgc2V0dGluZ3MuQ0hBUlRfU1RST0tFX01JTk9SX0FTUEVDVCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxpbmUxLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCBzZXR0aW5ncy5DSEFSVF9TVFJPS0UpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoc2V0dGluZ3MuQ0xBU1NfU0lHTl9BU1BFQ1RfTElORSkge1xuICAgICAgICAgICAgICAgIGxpbmUxLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIHNldHRpbmdzLkNMQVNTX1NJR05fQVNQRUNUX0xJTkUpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGxpbmUyID0gU1ZHVXRpbHMuU1ZHTGluZShzcGxpdExpbmUyWzBdLngsIHNwbGl0TGluZTJbMF0ueSwgc3BsaXRMaW5lMlsxXS54LCBzcGxpdExpbmUyWzFdLnkpXG4gICAgICAgICAgICBsaW5lMi5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgc2V0dGluZ3MuQVNQRUNUX0NPTE9SU1thc3AuYXNwZWN0Lm5hbWVdID8/IFwiIzMzM1wiKTtcblxuICAgICAgICAgICAgaWYgKHNldHRpbmdzLkNIQVJUX1NUUk9LRV9NSU5PUl9BU1BFQ1QgJiYgISAoYXNwLmFzcGVjdC5pc01ham9yID8/IGZhbHNlKSkge1xuICAgICAgICAgICAgICAgIGxpbmUyLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCBzZXR0aW5ncy5DSEFSVF9TVFJPS0VfTUlOT1JfQVNQRUNUKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGluZTIuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHNldHRpbmdzLkNIQVJUX1NUUk9LRSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzZXR0aW5ncy5DTEFTU19TSUdOX0FTUEVDVF9MSU5FKSB7XG4gICAgICAgICAgICAgICAgbGluZTIuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgc2V0dGluZ3MuQ0xBU1NfU0lHTl9BU1BFQ1RfTElORSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYXNwZWN0R3JvdXAuYXBwZW5kQ2hpbGQobGluZTEpO1xuICAgICAgICAgICAgYXNwZWN0R3JvdXAuYXBwZW5kQ2hpbGQobGluZTIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERyYXcgYWxsIGFzcGVjdHMgYWJvdmUgbGluZXNcbiAgICAgICAgICovXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXNwZWN0c0xpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGFzcCA9IGFzcGVjdHNMaXN0W2ldO1xuICAgICAgICAgICAgY29uc3QgYXNwZWN0R3JvdXAgPSBhc3BlY3RHcm91cHNbaV07XG5cbiAgICAgICAgICAgIC8vIGFzcGVjdCBhcyBzb2xpZCBsaW5lXG4gICAgICAgICAgICBjb25zdCBmcm9tUG9pbnQgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKGNlbnRlclgsIGNlbnRlclksIHJhZGl1cywgVXRpbHMuZGVncmVlVG9SYWRpYW4oYXNwLmZyb20uYW5nbGUsIGFzY2VuZGFudFNoaWZ0KSlcbiAgICAgICAgICAgIGNvbnN0IHRvUG9pbnQgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKGNlbnRlclgsIGNlbnRlclksIHJhZGl1cywgVXRpbHMuZGVncmVlVG9SYWRpYW4oYXNwLnRvLmFuZ2xlLCBhc2NlbmRhbnRTaGlmdCkpXG5cbiAgICAgICAgICAgIC8vIGRyYXcgc3ltYm9sIGluIGNlbnRlciBvZiBhc3BlY3RcbiAgICAgICAgICAgIGNvbnN0IGxpbmVDZW50ZXJYID0gKGZyb21Qb2ludC54ICsgdG9Qb2ludC54KSAvIDJcbiAgICAgICAgICAgIGNvbnN0IGxpbmVDZW50ZXJZID0gKGZyb21Qb2ludC55ICsgdG9Qb2ludC55KSAvIDIgLSAoc2V0dGluZ3MuQVNQRUNUU19GT05UX1NJWkUgPz8gMjApIC8gMTggLy8gbnVkZ2UgYSBiaXQgaGlnaGVyIEFzdHJvbm9taWNvbiBzeW1ib2xcbiAgICAgICAgICAgIGNvbnN0IHN5bWJvbCA9IFNWR1V0aWxzLlNWR1N5bWJvbChhc3AuYXNwZWN0Lm5hbWUsIGxpbmVDZW50ZXJYLCBsaW5lQ2VudGVyWSlcbiAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJmb250LWZhbWlseVwiLCBzZXR0aW5ncy5DSEFSVF9GT05UX0ZBTUlMWSA/PyBcIkFzdHJvbm9taWNvblwiKTtcbiAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKSAvLyBzdGFydCwgbWlkZGxlLCBlbmRcbiAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJkb21pbmFudC1iYXNlbGluZVwiLCBcIm1pZGRsZVwiKVxuICAgICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImZvbnQtc2l6ZVwiLCBzZXR0aW5ncy5BU1BFQ1RTX0ZPTlRfU0laRSk7XG4gICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBzZXR0aW5ncy5BU1BFQ1RfQ09MT1JTW2FzcC5hc3BlY3QubmFtZV0gPz8gXCIjMzMzXCIpO1xuXG4gICAgICAgICAgICBpZiAoc2V0dGluZ3MuQ0xBU1NfU0lHTl9BU1BFQ1QpIHtcbiAgICAgICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgc2V0dGluZ3MuQ0xBU1NfU0lHTl9BU1BFQ1QgKyAnICcgKyBzZXR0aW5ncy5DTEFTU19TSUdOX0FTUEVDVCArICctLScgKyBhc3AuYXNwZWN0Lm5hbWUudG9Mb3dlckNhc2UoKSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYXNwZWN0R3JvdXAuZGF0YXNldC5mcm9tID0gYXNwLmZyb20ubmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgYXNwZWN0R3JvdXAuZGF0YXNldC50byA9IGFzcC50by5uYW1lLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgICAgICAgIGFzcGVjdEdyb3VwLmFwcGVuZENoaWxkKHN5bWJvbCk7XG4gICAgICAgICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGFzcGVjdEdyb3VwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB3cmFwcGVyXG4gICAgfVxuXG59XG5cbmV4cG9ydCB7XG4gICAgQXNwZWN0VXRpbHMgYXNcbiAgICAgICAgZGVmYXVsdFxufVxuIiwiLy8gbm9pbnNwZWN0aW9uIEpTVW51c2VkR2xvYmFsU3ltYm9sc1xuLyoqXG4gKiBAY2xhc3NcbiAqIEBjbGFzc2Rlc2MgU1ZHIHV0aWxpdHkgY2xhc3NcbiAqIEBwdWJsaWNcbiAqIEBzdGF0aWNcbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqL1xuY2xhc3MgU1ZHVXRpbHMge1xuXG4gICAgc3RhdGljIFNWR19OQU1FU1BBQ0UgPSBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcblxuICAgIHN0YXRpYyBTWU1CT0xfQVJJRVMgPSBcIkFyaWVzXCI7XG4gICAgc3RhdGljIFNZTUJPTF9UQVVSVVMgPSBcIlRhdXJ1c1wiO1xuICAgIHN0YXRpYyBTWU1CT0xfR0VNSU5JID0gXCJHZW1pbmlcIjtcbiAgICBzdGF0aWMgU1lNQk9MX0NBTkNFUiA9IFwiQ2FuY2VyXCI7XG4gICAgc3RhdGljIFNZTUJPTF9MRU8gPSBcIkxlb1wiO1xuICAgIHN0YXRpYyBTWU1CT0xfVklSR08gPSBcIlZpcmdvXCI7XG4gICAgc3RhdGljIFNZTUJPTF9MSUJSQSA9IFwiTGlicmFcIjtcbiAgICBzdGF0aWMgU1lNQk9MX1NDT1JQSU8gPSBcIlNjb3JwaW9cIjtcbiAgICBzdGF0aWMgU1lNQk9MX1NBR0lUVEFSSVVTID0gXCJTYWdpdHRhcml1c1wiO1xuICAgIHN0YXRpYyBTWU1CT0xfQ0FQUklDT1JOID0gXCJDYXByaWNvcm5cIjtcbiAgICBzdGF0aWMgU1lNQk9MX0FRVUFSSVVTID0gXCJBcXVhcml1c1wiO1xuICAgIHN0YXRpYyBTWU1CT0xfUElTQ0VTID0gXCJQaXNjZXNcIjtcblxuICAgIHN0YXRpYyBTWU1CT0xfU1VOID0gXCJTdW5cIjtcbiAgICBzdGF0aWMgU1lNQk9MX01PT04gPSBcIk1vb25cIjtcbiAgICBzdGF0aWMgU1lNQk9MX01FUkNVUlkgPSBcIk1lcmN1cnlcIjtcbiAgICBzdGF0aWMgU1lNQk9MX1ZFTlVTID0gXCJWZW51c1wiO1xuICAgIHN0YXRpYyBTWU1CT0xfRUFSVEggPSBcIkVhcnRoXCI7XG4gICAgc3RhdGljIFNZTUJPTF9NQVJTID0gXCJNYXJzXCI7XG4gICAgc3RhdGljIFNZTUJPTF9KVVBJVEVSID0gXCJKdXBpdGVyXCI7XG4gICAgc3RhdGljIFNZTUJPTF9TQVRVUk4gPSBcIlNhdHVyblwiO1xuICAgIHN0YXRpYyBTWU1CT0xfVVJBTlVTID0gXCJVcmFudXNcIjtcbiAgICBzdGF0aWMgU1lNQk9MX05FUFRVTkUgPSBcIk5lcHR1bmVcIjtcbiAgICBzdGF0aWMgU1lNQk9MX1BMVVRPID0gXCJQbHV0b1wiO1xuICAgIHN0YXRpYyBTWU1CT0xfQ0hJUk9OID0gXCJDaGlyb25cIjtcbiAgICBzdGF0aWMgU1lNQk9MX0xJTElUSCA9IFwiTGlsaXRoXCI7XG4gICAgc3RhdGljIFNZTUJPTF9OTk9ERSA9IFwiTk5vZGVcIjtcbiAgICBzdGF0aWMgU1lNQk9MX1NOT0RFID0gXCJTTm9kZVwiO1xuXG4gICAgc3RhdGljIFNZTUJPTF9BUyA9IFwiQXNcIjtcbiAgICBzdGF0aWMgU1lNQk9MX0RTID0gXCJEc1wiO1xuICAgIHN0YXRpYyBTWU1CT0xfTUMgPSBcIk1jXCI7XG4gICAgc3RhdGljIFNZTUJPTF9JQyA9IFwiSWNcIjtcblxuICAgIHN0YXRpYyBTWU1CT0xfUkVUUk9HUkFERSA9IFwiUmV0cm9ncmFkZVwiXG5cbiAgICBzdGF0aWMgU1lNQk9MX0NPTkpVTkNUSU9OID0gXCJDb25qdW5jdGlvblwiO1xuICAgIHN0YXRpYyBTWU1CT0xfT1BQT1NJVElPTiA9IFwiT3Bwb3NpdGlvblwiO1xuICAgIHN0YXRpYyBTWU1CT0xfU1FVQVJFID0gXCJTcXVhcmVcIjsgLy8gQUtBIFF1YXJ0aWxlIG9yIFF1YWRyYXRlXG4gICAgc3RhdGljIFNZTUJPTF9UUklORSA9IFwiVHJpbmVcIjtcbiAgICBzdGF0aWMgU1lNQk9MX1NFWFRJTEUgPSBcIlNleHRpbGVcIjtcblxuICAgIHN0YXRpYyBTWU1CT0xfUVVJTkNVTlggPSBcIlF1aW5jdW54XCI7XG4gICAgc3RhdGljIFNZTUJPTF9TRU1JU0VYVElMRSA9IFwiU2VtaS1zZXh0aWxlXCI7XG5cbiAgICBzdGF0aWMgU1lNQk9MX1NFTUlTUVVBUkUgPSBcIlNlbWktc3F1YXJlXCI7IC8vIEFLQSBPY3RpbGVcbiAgICBzdGF0aWMgU1lNQk9MX09DVElMRSA9IFwiT2N0aWxlXCI7XG5cbiAgICBzdGF0aWMgU1lNQk9MX1NFU1FVSVNRVUFSRSA9IFwiU2VzcXVpc3F1YXJlXCI7IC8vIEFLQSBUcmlvY3RpbGVcbiAgICBzdGF0aWMgU1lNQk9MX1RSSU9DVElMRSA9IFwiVHJpb2N0aWxlXCI7IC8vIFNhbWUgYXMgU2VzcXVpc3F1YXJlXG5cbiAgICBzdGF0aWMgU1lNQk9MX1FVSU5USUxFID0gXCJRdWludGlsZVwiO1xuICAgIHN0YXRpYyBTWU1CT0xfQklRVUlOVElMRSA9IFwiQmlxdWludGlsZVwiO1xuICAgIHN0YXRpYyBTWU1CT0xfU0VNSVFVSU5USUxFID0gXCJTZW1pLXF1aW50aWxlXCI7IC8vIEFLQSBEZWNpbGVcblxuICAgIC8vIEFzdHJvbm9taWNvbiBmb250IGNvZGVzXG4gICAgc3RhdGljIFNZTUJPTF9BUklFU19DT0RFID0gXCJBXCI7XG4gICAgc3RhdGljIFNZTUJPTF9UQVVSVVNfQ09ERSA9IFwiQlwiO1xuICAgIHN0YXRpYyBTWU1CT0xfR0VNSU5JX0NPREUgPSBcIkNcIjtcbiAgICBzdGF0aWMgU1lNQk9MX0NBTkNFUl9DT0RFID0gXCJEXCI7XG4gICAgc3RhdGljIFNZTUJPTF9MRU9fQ09ERSA9IFwiRVwiO1xuICAgIHN0YXRpYyBTWU1CT0xfVklSR09fQ09ERSA9IFwiRlwiO1xuICAgIHN0YXRpYyBTWU1CT0xfTElCUkFfQ09ERSA9IFwiR1wiO1xuICAgIHN0YXRpYyBTWU1CT0xfU0NPUlBJT19DT0RFID0gXCJIXCI7XG4gICAgc3RhdGljIFNZTUJPTF9TQUdJVFRBUklVU19DT0RFID0gXCJJXCI7XG4gICAgc3RhdGljIFNZTUJPTF9DQVBSSUNPUk5fQ09ERSA9IFwiSlwiO1xuICAgIHN0YXRpYyBTWU1CT0xfQVFVQVJJVVNfQ09ERSA9IFwiS1wiO1xuICAgIHN0YXRpYyBTWU1CT0xfUElTQ0VTX0NPREUgPSBcIkxcIjtcblxuICAgIHN0YXRpYyBTWU1CT0xfU1VOX0NPREUgPSBcIlFcIjtcbiAgICBzdGF0aWMgU1lNQk9MX01PT05fQ09ERSA9IFwiUlwiO1xuICAgIHN0YXRpYyBTWU1CT0xfTUVSQ1VSWV9DT0RFID0gXCJTXCI7XG4gICAgc3RhdGljIFNZTUJPTF9WRU5VU19DT0RFID0gXCJUXCI7XG4gICAgc3RhdGljIFNZTUJPTF9FQVJUSF9DT0RFID0gXCI+XCI7XG4gICAgc3RhdGljIFNZTUJPTF9NQVJTX0NPREUgPSBcIlVcIjtcbiAgICBzdGF0aWMgU1lNQk9MX0pVUElURVJfQ09ERSA9IFwiVlwiO1xuICAgIHN0YXRpYyBTWU1CT0xfU0FUVVJOX0NPREUgPSBcIldcIjtcbiAgICBzdGF0aWMgU1lNQk9MX1VSQU5VU19DT0RFID0gXCJYXCI7XG4gICAgc3RhdGljIFNZTUJPTF9ORVBUVU5FX0NPREUgPSBcIllcIjtcbiAgICBzdGF0aWMgU1lNQk9MX1BMVVRPX0NPREUgPSBcIlpcIjtcbiAgICBzdGF0aWMgU1lNQk9MX0NISVJPTl9DT0RFID0gXCJxXCI7XG4gICAgc3RhdGljIFNZTUJPTF9MSUxJVEhfQ09ERSA9IFwielwiO1xuICAgIHN0YXRpYyBTWU1CT0xfTk5PREVfQ09ERSA9IFwiZ1wiO1xuICAgIHN0YXRpYyBTWU1CT0xfU05PREVfQ09ERSA9IFwiaVwiO1xuXG4gICAgc3RhdGljIFNZTUJPTF9BU19DT0RFID0gXCJjXCI7XG4gICAgc3RhdGljIFNZTUJPTF9EU19DT0RFID0gXCJmXCI7XG4gICAgc3RhdGljIFNZTUJPTF9NQ19DT0RFID0gXCJkXCI7XG4gICAgc3RhdGljIFNZTUJPTF9JQ19DT0RFID0gXCJlXCI7XG5cbiAgICBzdGF0aWMgU1lNQk9MX1JFVFJPR1JBREVfQ09ERSA9IFwiTVwiXG5cblxuICAgIHN0YXRpYyBTWU1CT0xfQ09OSlVOQ1RJT05fQ09ERSA9IFwiIVwiO1xuICAgIHN0YXRpYyBTWU1CT0xfT1BQT1NJVElPTl9DT0RFID0gJ1wiJztcbiAgICBzdGF0aWMgU1lNQk9MX1NRVUFSRV9DT0RFID0gXCIjXCI7XG4gICAgc3RhdGljIFNZTUJPTF9UUklORV9DT0RFID0gXCIkXCI7XG4gICAgc3RhdGljIFNZTUJPTF9TRVhUSUxFX0NPREUgPSBcIiVcIjtcblxuICAgIC8qKlxuICAgICAqIFF1aW5jdW54IChJbmNvbmp1bmN0KVxuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICovXG4gICAgc3RhdGljIFNZTUJPTF9RVUlOQ1VOWF9DT0RFID0gXCImXCI7XG5cbiAgICBzdGF0aWMgU1lNQk9MX1NFTUlTRVhUSUxFX0NPREUgPSBcIidcIjtcblxuICAgIC8qKlxuICAgICAqIFNlbWktU3F1YXJlIG9yIE9jdGlsZVxuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICovXG4gICAgc3RhdGljIFNZTUJPTF9TRU1JU1FVQVJFX0NPREUgPSBcIihcIjtcblxuICAgIC8qKlxuICAgICAqIFNlc3F1aXF1YWRyYXRlIG9yIFRyaS1PY3RpbGUgb3IgU2VzcXVpc3F1YXJlXG4gICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgKi9cbiAgICBzdGF0aWMgU1lNQk9MX1RSSU9DVElMRV9DT0RFID0gXCIpXCI7XG5cbiAgICBzdGF0aWMgU1lNQk9MX0JJUVVJTlRJTEVfQ09ERSA9IFwiKlwiO1xuXG4gICAgc3RhdGljIFNZTUJPTF9RVUlOVElMRV9DT0RFID0gXCLCt1wiO1xuXG4gICAgc3RhdGljIFNZTUJPTF9TRU1JUVVJTlRJTEVfQ09ERSA9IFwiLFwiO1xuXG4gICAgc3RhdGljIFNZTUJPTF9RVUlOREVDSUxFX0NPREUgPSBcIsK4XCI7XG5cbiAgICAvKipcbiAgICAgKiBRdWludGlsZSAodmFyaWFudClcbiAgICAgKlxuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICovXG4gICAgc3RhdGljIFNZTUJPTF9RVUlOVElMRV9WQVJJQU5UX0NPREUgPSBcIitcIjtcblxuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIGlmICh0aGlzIGluc3RhbmNlb2YgU1ZHVXRpbHMpIHtcbiAgICAgICAgICAgIHRocm93IEVycm9yKCdUaGlzIGlzIGEgc3RhdGljIGNsYXNzIGFuZCBjYW5ub3QgYmUgaW5zdGFudGlhdGVkLicpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgU1ZHIGRvY3VtZW50XG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHdpZHRoXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGhlaWdodFxuICAgICAqXG4gICAgICogQHJldHVybiB7U1ZHRG9jdW1lbnR9XG4gICAgICovXG4gICAgc3RhdGljIFNWR0RvY3VtZW50KHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgICAgY29uc3Qgc3ZnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFNWR1V0aWxzLlNWR19OQU1FU1BBQ0UsIFwic3ZnXCIpO1xuICAgICAgICBzdmcuc2V0QXR0cmlidXRlKCd4bWxucycsIFNWR1V0aWxzLlNWR19OQU1FU1BBQ0UpO1xuICAgICAgICBzdmcuc2V0QXR0cmlidXRlKCd2ZXJzaW9uJywgXCIxLjFcIik7XG4gICAgICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ3ZpZXdCb3gnLCBcIjAgMCBcIiArIHdpZHRoICsgXCIgXCIgKyBoZWlnaHQpO1xuICAgICAgICByZXR1cm4gc3ZnXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgU1ZHIGdyb3VwIGVsZW1lbnRcbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAcmV0dXJuIHtTVkdHcm91cEVsZW1lbnR9XG4gICAgICovXG4gICAgc3RhdGljIFNWR0dyb3VwKCkge1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFNWR1V0aWxzLlNWR19OQU1FU1BBQ0UsIFwiZ1wiKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIFNWRyBwYXRoIGVsZW1lbnRcbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAcmV0dXJuIHtTVkdHcm91cEVsZW1lbnR9XG4gICAgICovXG4gICAgc3RhdGljIFNWR1BhdGgoKSB7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoU1ZHVXRpbHMuU1ZHX05BTUVTUEFDRSwgXCJwYXRoXCIpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgU1ZHIG1hc2sgZWxlbWVudFxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBlbGVtZW50SURcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1NWR01hc2tFbGVtZW50fVxuICAgICAqL1xuICAgIHN0YXRpYyBTVkdNYXNrKGVsZW1lbnRJRCkge1xuICAgICAgICBjb25zdCBtYXNrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFNWR1V0aWxzLlNWR19OQU1FU1BBQ0UsIFwibWFza1wiKTtcbiAgICAgICAgbWFzay5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBlbGVtZW50SUQpXG4gICAgICAgIHJldHVybiBtYXNrXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU1ZHIGNpcmN1bGFyIHNlY3RvclxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBwYXJhbSB7aW50fSB4IC0gY2lyY2xlIHggY2VudGVyIHBvc2l0aW9uXG4gICAgICogQHBhcmFtIHtpbnR9IHkgLSBjaXJjbGUgeSBjZW50ZXIgcG9zaXRpb25cbiAgICAgKiBAcGFyYW0ge2ludH0gcmFkaXVzIC0gY2lyY2xlIHJhZGl1cyBpbiBweFxuICAgICAqIEBwYXJhbSB7aW50fSBhMSAtIGFuZ2xlRnJvbSBpbiByYWRpYW5zXG4gICAgICogQHBhcmFtIHtpbnR9IGEyIC0gYW5nbGVUbyBpbiByYWRpYW5zXG4gICAgICogQHBhcmFtIHtpbnR9IHRoaWNrbmVzcyAtIGZyb20gb3V0c2lkZSB0byBjZW50ZXIgaW4gcHhcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1NWR0VsZW1lbnR9IHNlZ21lbnRcbiAgICAgKi9cbiAgICBzdGF0aWMgU1ZHU2VnbWVudCh4LCB5LCByYWRpdXMsIGExLCBhMiwgdGhpY2tuZXNzLCBsRmxhZywgc0ZsYWcpIHtcbiAgICAgICAgLy8gQHNlZSBTVkcgUGF0aCBhcmM6IGh0dHBzOi8vd3d3LnczLm9yZy9UUi9TVkcvcGF0aHMuaHRtbCNQYXRoRGF0YVxuICAgICAgICBjb25zdCBMQVJHRV9BUkNfRkxBRyA9IGxGbGFnIHx8IDA7XG4gICAgICAgIGNvbnN0IFNXRUVUX0ZMQUcgPSBzRmxhZyB8fCAwO1xuXG4gICAgICAgIGNvbnN0IHNlZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoU1ZHVXRpbHMuU1ZHX05BTUVTUEFDRSwgXCJwYXRoXCIpO1xuICAgICAgICBzZWdtZW50LnNldEF0dHJpYnV0ZShcImRcIiwgXCJNIFwiICsgKHggKyB0aGlja25lc3MgKiBNYXRoLmNvcyhhMSkpICsgXCIsIFwiICsgKHkgKyB0aGlja25lc3MgKiBNYXRoLnNpbihhMSkpICsgXCIgbCBcIiArICgocmFkaXVzIC0gdGhpY2tuZXNzKSAqIE1hdGguY29zKGExKSkgKyBcIiwgXCIgKyAoKHJhZGl1cyAtIHRoaWNrbmVzcykgKiBNYXRoLnNpbihhMSkpICsgXCIgQSBcIiArIHJhZGl1cyArIFwiLCBcIiArIHJhZGl1cyArIFwiLDAgLFwiICsgTEFSR0VfQVJDX0ZMQUcgKyBcIiwgXCIgKyBTV0VFVF9GTEFHICsgXCIsIFwiICsgKHggKyByYWRpdXMgKiBNYXRoLmNvcyhhMikpICsgXCIsIFwiICsgKHkgKyByYWRpdXMgKiBNYXRoLnNpbihhMikpICsgXCIgbCBcIiArICgocmFkaXVzIC0gdGhpY2tuZXNzKSAqIC1NYXRoLmNvcyhhMikpICsgXCIsIFwiICsgKChyYWRpdXMgLSB0aGlja25lc3MpICogLU1hdGguc2luKGEyKSkgKyBcIiBBIFwiICsgdGhpY2tuZXNzICsgXCIsIFwiICsgdGhpY2tuZXNzICsgXCIsMCAsXCIgKyBMQVJHRV9BUkNfRkxBRyArIFwiLCBcIiArIDEgKyBcIiwgXCIgKyAoeCArIHRoaWNrbmVzcyAqIE1hdGguY29zKGExKSkgKyBcIiwgXCIgKyAoeSArIHRoaWNrbmVzcyAqIE1hdGguc2luKGExKSkpO1xuICAgICAgICBzZWdtZW50LnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJub25lXCIpO1xuICAgICAgICByZXR1cm4gc2VnbWVudDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTVkcgY2lyY2xlXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQHBhcmFtIHtpbnR9IGN4XG4gICAgICogQHBhcmFtIHtpbnR9IGN5XG4gICAgICogQHBhcmFtIHtpbnR9IHJhZGl1c1xuICAgICAqXG4gICAgICogQHJldHVybiB7U1ZHRWxlbWVudH0gY2lyY2xlXG4gICAgICovXG4gICAgc3RhdGljIFNWR0NpcmNsZShjeCwgY3ksIHJhZGl1cykge1xuICAgICAgICBjb25zdCBjaXJjbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoU1ZHVXRpbHMuU1ZHX05BTUVTUEFDRSwgXCJjaXJjbGVcIik7XG4gICAgICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJjeFwiLCBjeCk7XG4gICAgICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJjeVwiLCBjeSk7XG4gICAgICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJyXCIsIHJhZGl1cyk7XG4gICAgICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwibm9uZVwiKTtcbiAgICAgICAgcmV0dXJuIGNpcmNsZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTVkcgbGluZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHgxXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHkyXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHgyXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHkyXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtTVkdFbGVtZW50fSBsaW5lXG4gICAgICovXG4gICAgc3RhdGljIFNWR0xpbmUoeDEsIHkxLCB4MiwgeTIpIHtcbiAgICAgICAgY29uc3QgbGluZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTVkdVdGlscy5TVkdfTkFNRVNQQUNFLCBcImxpbmVcIik7XG4gICAgICAgIGxpbmUuc2V0QXR0cmlidXRlKFwieDFcIiwgeDEpO1xuICAgICAgICBsaW5lLnNldEF0dHJpYnV0ZShcInkxXCIsIHkxKTtcbiAgICAgICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJ4MlwiLCB4Mik7XG4gICAgICAgIGxpbmUuc2V0QXR0cmlidXRlKFwieTJcIiwgeTIpO1xuICAgICAgICByZXR1cm4gbGluZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTVkcgdGV4dFxuICAgICAqXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHhcbiAgICAgKiBAcGFyYW0ge051bWJlcn0geVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0eHRcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gW3NjYWxlXVxuICAgICAqXG4gICAgICogQHJldHVybiB7U1ZHRWxlbWVudH0gbGluZVxuICAgICAqL1xuICAgIHN0YXRpYyBTVkdUZXh0KHgsIHksIHR4dCkge1xuICAgICAgICBjb25zdCB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFNWR1V0aWxzLlNWR19OQU1FU1BBQ0UsIFwidGV4dFwiKTtcbiAgICAgICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJ4XCIsIHgpO1xuICAgICAgICB0ZXh0LnNldEF0dHJpYnV0ZShcInlcIiwgeSk7XG4gICAgICAgIHRleHQuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIFwibm9uZVwiKTtcbiAgICAgICAgdGV4dC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0eHQpKTtcblxuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTVkcgc3ltYm9sXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB4UG9zXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHlQb3NcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1NWR0VsZW1lbnR9XG4gICAgICovXG4gICAgc3RhdGljIFNWR1N5bWJvbChuYW1lLCB4UG9zLCB5UG9zLCkge1xuICAgICAgICBzd2l0Y2ggKG5hbWUpIHtcbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0FTOlxuICAgICAgICAgICAgICAgIHJldHVybiBhc1N5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9EUzpcbiAgICAgICAgICAgICAgICByZXR1cm4gZHNTeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfTUM6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1jU3ltYm9sKHhQb3MsIHlQb3MpXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0lDOlxuICAgICAgICAgICAgICAgIHJldHVybiBpY1N5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9BUklFUzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYXJpZXNTeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfVEFVUlVTOlxuICAgICAgICAgICAgICAgIHJldHVybiB0YXVydXNTeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfR0VNSU5JOlxuICAgICAgICAgICAgICAgIHJldHVybiBnZW1pbmlTeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfQ0FOQ0VSOlxuICAgICAgICAgICAgICAgIHJldHVybiBjYW5jZXJTeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfTEVPOlxuICAgICAgICAgICAgICAgIHJldHVybiBsZW9TeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfVklSR086XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZpcmdvU3ltYm9sKHhQb3MsIHlQb3MpXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0xJQlJBOlxuICAgICAgICAgICAgICAgIHJldHVybiBsaWJyYVN5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9TQ09SUElPOlxuICAgICAgICAgICAgICAgIHJldHVybiBzY29ycGlvU3ltYm9sKHhQb3MsIHlQb3MpXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1NBR0lUVEFSSVVTOlxuICAgICAgICAgICAgICAgIHJldHVybiBzYWdpdHRhcml1c1N5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9DQVBSSUNPUk46XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhcHJpY29yblN5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9BUVVBUklVUzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYXF1YXJpdXNTeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfUElTQ0VTOlxuICAgICAgICAgICAgICAgIHJldHVybiBwaXNjZXNTeW1ib2woeFBvcywgeVBvcylcblxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9TVU46XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN1blN5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9NT09OOlxuICAgICAgICAgICAgICAgIHJldHVybiBtb29uU3ltYm9sKHhQb3MsIHlQb3MpXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX01FUkNVUlk6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1lcmN1cnlTeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfVkVOVVM6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZlbnVzU3ltYm9sKHhQb3MsIHlQb3MpXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0VBUlRIOlxuICAgICAgICAgICAgICAgIHJldHVybiBlYXJ0aFN5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9NQVJTOlxuICAgICAgICAgICAgICAgIHJldHVybiBtYXJzU3ltYm9sKHhQb3MsIHlQb3MpXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0pVUElURVI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGp1cGl0ZXJTeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfU0FUVVJOOlxuICAgICAgICAgICAgICAgIHJldHVybiBzYXR1cm5TeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfVVJBTlVTOlxuICAgICAgICAgICAgICAgIHJldHVybiB1cmFudXNTeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfTkVQVFVORTpcbiAgICAgICAgICAgICAgICByZXR1cm4gbmVwdHVuZVN5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9QTFVUTzpcbiAgICAgICAgICAgICAgICByZXR1cm4gcGx1dG9TeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfQ0hJUk9OOlxuICAgICAgICAgICAgICAgIHJldHVybiBjaGlyb25TeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfTElMSVRIOlxuICAgICAgICAgICAgICAgIHJldHVybiBsaWxpdGhTeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfTk5PREU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ub2RlU3ltYm9sKHhQb3MsIHlQb3MpXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1NOT0RFOlxuICAgICAgICAgICAgICAgIHJldHVybiBzbm9kZVN5bWJvbCh4UG9zLCB5UG9zKVxuXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1JFVFJPR1JBREU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldHJvZ3JhZGVTeW1ib2woeFBvcywgeVBvcylcblxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9DT05KVU5DVElPTjpcbiAgICAgICAgICAgICAgICByZXR1cm4gY29uanVuY3Rpb25TeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfT1BQT1NJVElPTjpcbiAgICAgICAgICAgICAgICByZXR1cm4gb3Bwb3NpdGlvblN5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9TUVVBUkU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNxdWFyZVN5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9UUklORTpcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJpbmVTeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfU0VYVElMRTpcbiAgICAgICAgICAgICAgICByZXR1cm4gc2V4dGlsZVN5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9RVUlOQ1VOWDpcbiAgICAgICAgICAgICAgICByZXR1cm4gcXVpbmN1bnhTeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfU0VNSVNFWFRJTEU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbWlzZXh0aWxlU3ltYm9sKHhQb3MsIHlQb3MpXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1NFTUlTUVVBUkU6XG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9PQ1RJTEU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbWlzcXVhcmVTeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfVFJJT0NUSUxFOlxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfU0VTUVVJU1FVQVJFOlxuICAgICAgICAgICAgICAgIHJldHVybiB0cmlvY3RpbGVTeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfUVVJTlRJTEU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHF1aW50aWxlU3ltYm9sKHhQb3MsIHlQb3MpXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0JJUVVJTlRJTEU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGJpcXVpbnRpbGVTeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfU0VNSVFVSU5USUxFOlxuICAgICAgICAgICAgICAgIHJldHVybiBzZW1pcXVpbnRpbGVTeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmRlYnVnKCdVbmtub3duIHN5bWJvbDogJyArIG5hbWUpXG4gICAgICAgICAgICAgICAgY29uc3QgdW5rbm93blN5bWJvbCA9IFNWR1V0aWxzLlNWR0NpcmNsZSh4UG9zLCB5UG9zLCA4KVxuICAgICAgICAgICAgICAgIHVua25vd25TeW1ib2wuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIFwiIzMzM1wiKVxuICAgICAgICAgICAgICAgIHJldHVybiB1bmtub3duU3ltYm9sXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBBc2NlbmRhbnQgc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBhc1N5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfQVNfQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIERlc2NlbmRhbnQgc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBkc1N5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfRFNfQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIE1lZGl1bSBjb2VsaSBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIG1jU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9NQ19DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogSW1tdW0gY29lbGkgc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBpY1N5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfSUNfQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIEFyaWVzIHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gYXJpZXNTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX0FSSUVTX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBUYXVydXMgc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiB0YXVydXNTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX1RBVVJVU19DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogR2VtaW5pIHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gZ2VtaW5pU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9HRU1JTklfQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIENhbmNlciBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGNhbmNlclN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfQ0FOQ0VSX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBMZW8gc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBsZW9TeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX0xFT19DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogVmlyZ28gc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiB2aXJnb1N5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfVklSR09fQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIExpYnJhIHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gbGlicmFTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX0xJQlJBX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBTY29ycGlvIHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gc2NvcnBpb1N5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfU0NPUlBJT19DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogU2FnaXR0YXJpdXMgc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBzYWdpdHRhcml1c1N5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfU0FHSVRUQVJJVVNfQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIENhcHJpY29ybiBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGNhcHJpY29yblN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfQ0FQUklDT1JOX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBBcXVhcml1cyBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGFxdWFyaXVzU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9BUVVBUklVU19DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogUGlzY2VzIHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gcGlzY2VzU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9QSVNDRVNfQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFN1biBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHN1blN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfU1VOX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBNb29uIHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gbW9vblN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfTU9PTl9DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogTWVyY3VyeSBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIG1lcmN1cnlTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX01FUkNVUllfQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFZlbnVzIHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gdmVudXNTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX1ZFTlVTX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBFYXJ0aCBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGVhcnRoU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9FQVJUSF9DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogTWFycyBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIG1hcnNTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX01BUlNfQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIEp1cGl0ZXIgc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBqdXBpdGVyU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9KVVBJVEVSX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBTYXR1cm4gc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBzYXR1cm5TeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX1NBVFVSTl9DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogVXJhbnVzIHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gdXJhbnVzU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9VUkFOVVNfQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIE5lcHR1bmUgc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBuZXB0dW5lU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9ORVBUVU5FX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBQbHV0byBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHBsdXRvU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9QTFVUT19DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogQ2hpcm9uIHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gY2hpcm9uU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9DSElST05fQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIExpbGl0aCBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGxpbGl0aFN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfTElMSVRIX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBOTm9kZSBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIG5ub2RlU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9OTk9ERV9DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogU05vZGUgc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBzbm9kZVN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfU05PREVfQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFJldHJvZ3JhZGUgc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiByZXRyb2dyYWRlU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9SRVRST0dSQURFX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBDb25qdW5jdGlvbiBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGNvbmp1bmN0aW9uU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9DT05KVU5DVElPTl9DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogT3Bwb3NpdGlvbiBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIG9wcG9zaXRpb25TeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX09QUE9TSVRJT05fQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFNxdWFyZXN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gc3F1YXJlU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9TUVVBUkVfQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFRyaW5lIHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gdHJpbmVTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX1RSSU5FX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBTZXh0aWxlIHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gc2V4dGlsZVN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfU0VYVElMRV9DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogUXVpbmN1bnggc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBxdWluY3VueFN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfUVVJTkNVTlhfQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFNlbWlzZXh0aWxlIHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gc2VtaXNleHRpbGVTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX1NFTUlTRVhUSUxFX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAqIFNlbWlzcXVhcmUgc3ltYm9sXG4gICAgICAgICogYWthIFF1aW50aWxlLyBPY3RpbGUgc3ltYm9sXG4gICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHNlbWlzcXVhcmVTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX1NFTUlTUVVBUkVfQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFF1aW50aWxlXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBxdWludGlsZVN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfU0VNSVNRVUFSRV9DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gYmlxdWludGlsZVN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfQklRVUlOVElMRV9DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2VtaXF1aW50aWxlU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9TRU1JUVVJTlRJTEVfQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFRyaW9jdGlsZSBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHRyaW9jdGlsZVN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfVFJJT0NUSUxFX0NPREUpXG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCB7XG4gICAgU1ZHVXRpbHMgYXNcbiAgICAgICAgZGVmYXVsdFxufVxuIiwiLyoqXG4gKiBAY2xhc3NcbiAqIEBjbGFzc2Rlc2MgVXRpbGl0eSBjbGFzc1xuICogQHB1YmxpY1xuICogQHN0YXRpY1xuICogQGhpZGVjb25zdHJ1Y3RvclxuICovXG5jbGFzcyBVdGlscyB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgaWYgKHRoaXMgaW5zdGFuY2VvZiBVdGlscykge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoJ1RoaXMgaXMgYSBzdGF0aWMgY2xhc3MgYW5kIGNhbm5vdCBiZSBpbnN0YW50aWF0ZWQuJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgREVHXzM2MCA9IDM2MFxuICAgIHN0YXRpYyBERUdfMTgwID0gMTgwXG4gICAgc3RhdGljIERFR18wID0gMFxuXG4gICAgLyoqXG4gICAgICogR2VuZXJhdGUgcmFuZG9tIElEXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAqL1xuICAgIHN0YXRpYyBnZW5lcmF0ZVVuaXF1ZUlkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zdCByYW5kb21OdW1iZXIgPSBNYXRoLnJhbmRvbSgpICogMTAwMDAwMDtcbiAgICAgICAgY29uc3QgdGltZXN0YW1wID0gRGF0ZS5ub3coKTtcbiAgICAgICAgcmV0dXJuIGBpZF8ke3JhbmRvbU51bWJlcn1fJHt0aW1lc3RhbXB9YDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbnZlcnRlZCBkZWdyZWUgdG8gcmFkaWFuXG4gICAgICogQHN0YXRpY1xuICAgICAqXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGFuZ2xlSW5kZWdyZWVcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gc2hpZnRJbkRlZ3JlZVxuICAgICAqIEByZXR1cm4ge051bWJlcn1cbiAgICAgKi9cbiAgICBzdGF0aWMgZGVncmVlVG9SYWRpYW4gPSBmdW5jdGlvbiAoYW5nbGVJbkRlZ3JlZSwgc2hpZnRJbkRlZ3JlZSA9IDApIHtcbiAgICAgICAgcmV0dXJuIChzaGlmdEluRGVncmVlIC0gYW5nbGVJbkRlZ3JlZSkgKiBNYXRoLlBJIC8gMTgwXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29udmVydHMgcmFkaWFuIHRvIGRlZ3JlZVxuICAgICAqIEBzdGF0aWNcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSByYWRpYW5cbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAgICovXG4gICAgc3RhdGljIHJhZGlhblRvRGVncmVlID0gZnVuY3Rpb24gKHJhZGlhbikge1xuICAgICAgICByZXR1cm4gKHJhZGlhbiAqIDE4MCAvIE1hdGguUEkpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2FsY3VsYXRlcyBhIHBvc2l0aW9uIG9mIHRoZSBwb2ludCBvbiB0aGUgY2lyY2xlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGN4IC0gY2VudGVyIHhcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gY3kgLSBjZW50ZXIgeVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSByYWRpdXMgLSBjaXJjbGUgcmFkaXVzXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGFuZ2xlSW5SYWRpYW5zXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IC0ge3g6TnVtYmVyLCB5Ok51bWJlcn1cbiAgICAgKi9cbiAgICBzdGF0aWMgcG9zaXRpb25PbkNpcmNsZShjeCwgY3ksIHJhZGl1cywgYW5nbGVJblJhZGlhbnMpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHg6IChyYWRpdXMgKiBNYXRoLmNvcyhhbmdsZUluUmFkaWFucykgKyBjeCksXG4gICAgICAgICAgICB5OiAocmFkaXVzICogTWF0aC5zaW4oYW5nbGVJblJhZGlhbnMpICsgY3kpXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2FsY3VsYXRlcyB0aGUgYW5nbGUgYmV0d2VlbiB0aGUgbGluZSAoMiBwb2ludHMpIGFuZCB0aGUgeC1heGlzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHgxXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHkxXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHgyXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHkyXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IC0gZGVncmVlXG4gICAgICovXG4gICAgc3RhdGljIHBvc2l0aW9uVG9BbmdsZSh4MSwgeTEsIHgyLCB5Mikge1xuICAgICAgICBjb25zdCBkeCA9IHgyIC0geDE7XG4gICAgICAgIGNvbnN0IGR5ID0geTIgLSB5MTtcbiAgICAgICAgY29uc3QgYW5nbGVJblJhZGlhbnMgPSBNYXRoLmF0YW4yKGR5LCBkeCk7XG4gICAgICAgIHJldHVybiBVdGlscy5yYWRpYW5Ub0RlZ3JlZShhbmdsZUluUmFkaWFucylcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDYWxjdWxhdGVzIG5ldyBwb3NpdGlvbiBvZiBwb2ludHMgb24gY2lyY2xlIHdpdGhvdXQgb3ZlcmxhcHBpbmcgZWFjaCBvdGhlclxuICAgICAqXG4gICAgICogQHRocm93cyB7RXJyb3J9IC0gSWYgdGhlcmUgaXMgbm8gcGxhY2Ugb24gdGhlIGNpcmNsZSB0byBwbGFjZSBwb2ludHMuXG4gICAgICogQHBhcmFtIHtBcnJheX0gcG9pbnRzIC0gW3tuYW1lOlwiYVwiLCBhbmdsZToxMH0sIHtuYW1lOlwiYlwiLCBhbmdsZToyMH1dXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGNvbGxpc2lvblJhZGl1cyAtIHBvaW50IHJhZGl1c1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSByYWRpdXMgLSBjaXJjbGUgcmFkaXVzXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IC0ge1wiTW9vblwiOjMwLCBcIlN1blwiOjYwLCBcIk1lcmN1cnlcIjo4NiwgLi4ufVxuICAgICAqL1xuICAgIHN0YXRpYyBjYWxjdWxhdGVQb3NpdGlvbldpdGhvdXRPdmVybGFwcGluZyhwb2ludHMsIGNvbGxpc2lvblJhZGl1cywgY2lyY2xlUmFkaXVzKSB7XG4gICAgICAgIGNvbnN0IFNURVAgPSAxIC8vZGVncmVlXG5cbiAgICAgICAgY29uc3QgY2VsbFdpZHRoID0gMTAgLy9kZWdyZWVcbiAgICAgICAgY29uc3QgbnVtYmVyT2ZDZWxscyA9IFV0aWxzLkRFR18zNjAgLyBjZWxsV2lkdGhcbiAgICAgICAgY29uc3QgZnJlcXVlbmN5ID0gbmV3IEFycmF5KG51bWJlck9mQ2VsbHMpLmZpbGwoMClcbiAgICAgICAgZm9yIChjb25zdCBwb2ludCBvZiBwb2ludHMpIHtcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gTWF0aC5mbG9vcihwb2ludC5hbmdsZSAvIGNlbGxXaWR0aClcbiAgICAgICAgICAgIGZyZXF1ZW5jeVtpbmRleF0gKz0gMVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gSW4gdGhpcyBhbGdvcml0aG0gdGhlIG9yZGVyIG9mIHBvaW50cyBpcyBjcnVjaWFsLlxuICAgICAgICAvLyBBdCB0aGF0IHBvaW50IGluIHRoZSBjaXJjbGUsIHdoZXJlIHRoZSBwZXJpb2QgY2hhbmdlcyBpbiB0aGUgY2lyY2xlIChmb3IgaW5zdGFuY2U6WzM1OCwzNTksMCwxXSksIHRoZSBwb2ludHMgYXJlIGFycmFuZ2VkIGluIGluY29ycmVjdCBvcmRlci5cbiAgICAgICAgLy8gQXMgYSBzdGFydGluZyBwb2ludCwgSSB0cnkgdG8gZmluZCBhIHBsYWNlIHdoZXJlIHRoZXJlIGFyZSBubyBwb2ludHMuIFRoaXMgcGxhY2UgSSB1c2UgYXMgU1RBUlRfQU5HTEUuXG4gICAgICAgIGNvbnN0IFNUQVJUX0FOR0xFID0gY2VsbFdpZHRoICogZnJlcXVlbmN5LmZpbmRJbmRleChjb3VudCA9PiBjb3VudCA9PT0gMClcblxuICAgICAgICBjb25zdCBfcG9pbnRzID0gcG9pbnRzLm1hcChwb2ludCA9PiB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIG5hbWU6IHBvaW50Lm5hbWUsXG4gICAgICAgICAgICAgICAgYW5nbGU6IHBvaW50LmFuZ2xlIDwgU1RBUlRfQU5HTEUgPyBwb2ludC5hbmdsZSArIFV0aWxzLkRFR18zNjAgOiBwb2ludC5hbmdsZVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIF9wb2ludHMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGEuYW5nbGUgLSBiLmFuZ2xlXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gUmVjdXJzaXZlIGZ1bmN0aW9uXG4gICAgICAgIGNvbnN0IGFycmFuZ2VQb2ludHMgPSAoKSA9PiB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbG4gPSBfcG9pbnRzLmxlbmd0aDsgaSA8IGxuOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwb2ludFBvc2l0aW9uID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSgwLCAwLCBjaXJjbGVSYWRpdXMsIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKF9wb2ludHNbaV0uYW5nbGUpKVxuICAgICAgICAgICAgICAgIF9wb2ludHNbaV0ueCA9IHBvaW50UG9zaXRpb24ueFxuICAgICAgICAgICAgICAgIF9wb2ludHNbaV0ueSA9IHBvaW50UG9zaXRpb24ueVxuXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBpOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGlzdGFuY2UgPSBNYXRoLnNxcnQoTWF0aC5wb3coX3BvaW50c1tpXS54IC0gX3BvaW50c1tqXS54LCAyKSArIE1hdGgucG93KF9wb2ludHNbaV0ueSAtIF9wb2ludHNbal0ueSwgMikpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGlzdGFuY2UgPCAoMiAqIGNvbGxpc2lvblJhZGl1cykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9wb2ludHNbaV0uYW5nbGUgKz0gU1RFUFxuICAgICAgICAgICAgICAgICAgICAgICAgX3BvaW50c1tqXS5hbmdsZSAtPSBTVEVQXG4gICAgICAgICAgICAgICAgICAgICAgICBhcnJhbmdlUG9pbnRzKCkgLy89PT09PT0+IFJlY3Vyc2l2ZSBjYWxsXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBhcnJhbmdlUG9pbnRzKClcblxuICAgICAgICByZXR1cm4gX3BvaW50cy5yZWR1Y2UoKGFjY3VtdWxhdG9yLCBwb2ludCwgY3VycmVudEluZGV4KSA9PiB7XG4gICAgICAgICAgICBhY2N1bXVsYXRvcltwb2ludC5uYW1lXSA9IHBvaW50LmFuZ2xlXG4gICAgICAgICAgICByZXR1cm4gYWNjdW11bGF0b3JcbiAgICAgICAgfSwge30pXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgdGhlIGFuZ2xlIGNvbGxpZGVzIHdpdGggdGhlIHBvaW50c1xuICAgICAqXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGFuZ2xlXG4gICAgICogQHBhcmFtIHtBcnJheX0gYW5nbGVzTGlzdFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbY29sbGlzaW9uUmFkaXVzXVxuICAgICAqXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBzdGF0aWMgaXNDb2xsaXNpb24oYW5nbGUsIGFuZ2xlc0xpc3QsIGNvbGxpc2lvblJhZGl1cyA9IDEwKSB7XG5cbiAgICAgICAgY29uc3QgcG9pbnRJbkNvbGxpc2lvbiA9IGFuZ2xlc0xpc3QuZmluZChwb2ludCA9PiB7XG5cbiAgICAgICAgICAgIGxldCBhID0gKHBvaW50IC0gYW5nbGUpID4gVXRpbHMuREVHXzE4MCA/IGFuZ2xlICsgVXRpbHMuREVHXzM2MCA6IGFuZ2xlXG4gICAgICAgICAgICBsZXQgcCA9IChhbmdsZSAtIHBvaW50KSA+IFV0aWxzLkRFR18xODAgPyBwb2ludCArIFV0aWxzLkRFR18zNjAgOiBwb2ludFxuXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5hYnMoYSAtIHApIDw9IGNvbGxpc2lvblJhZGl1c1xuICAgICAgICB9KVxuXG4gICAgICAgIHJldHVybiBwb2ludEluQ29sbGlzaW9uICE9PSB1bmRlZmluZWRcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgdGhlIGNvbnRlbnQgb2YgYW4gZWxlbWVudFxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGVsZW1lbnRJRFxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtiZWZvcmVIb29rXVxuICAgICAqXG4gICAgICogQHdhcm5pbmcgLSBJdCByZW1vdmVzIEV2ZW50IExpc3RlbmVycyB0b28uXG4gICAgICogQHdhcm5pbmcgLSBZb3Ugd2lsbCAocHJvYmFibHkpIGdldCBtZW1vcnkgbGVhayBpZiB5b3UgZGVsZXRlIGVsZW1lbnRzIHRoYXQgaGF2ZSBhdHRhY2hlZCBsaXN0ZW5lcnNcbiAgICAgKi9cbiAgICBzdGF0aWMgY2xlYW5VcChlbGVtZW50SUQsIGJlZm9yZUhvb2spIHtcbiAgICAgICAgbGV0IGVsbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1lbnRJRClcbiAgICAgICAgaWYgKCEgZWxtKSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgICh0eXBlb2YgYmVmb3JlSG9vayA9PT0gJ2Z1bmN0aW9uJykgJiYgYmVmb3JlSG9vaygpXG5cbiAgICAgICAgZWxtLmlubmVySFRNTCA9IFwiXCJcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIFNpbXBsZSBjb2RlIGZvciBjb25maWcgYmFzZWQgdGVtcGxhdGUgc3RyaW5nc1xuICAgICAqXG4gICAgICogQHBhcmFtIHRlbXBsYXRlU3RyaW5nXG4gICAgICogQHBhcmFtIHRlbXBsYXRlVmFyc1xuICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAqL1xuICAgIHN0YXRpYyBmaWxsVGVtcGxhdGUgPSBmdW5jdGlvbiAodGVtcGxhdGVTdHJpbmcsIHRlbXBsYXRlVmFycykge1xuICAgICAgICBsZXQgZnVuYyA9IG5ldyBGdW5jdGlvbiguLi5PYmplY3Qua2V5cyh0ZW1wbGF0ZVZhcnMpLCBcInJldHVybiBgXCIgKyB0ZW1wbGF0ZVN0cmluZyArIFwiYDtcIilcbiAgICAgICAgcmV0dXJuIGZ1bmMoLi4uT2JqZWN0LnZhbHVlcyh0ZW1wbGF0ZVZhcnMpKTtcbiAgICB9XG59XG5cblxuZXhwb3J0IHtcbiAgICBVdGlscyBhc1xuICAgICAgICBkZWZhdWx0XG59XG5cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IFVuaXZlcnNlIGZyb20gJy4vdW5pdmVyc2UvVW5pdmVyc2UuanMnXG5pbXBvcnQgU1ZHVXRpbHMgZnJvbSAnLi91dGlscy9TVkdVdGlscy5qcydcbmltcG9ydCBVdGlscyBmcm9tICcuL3V0aWxzL1V0aWxzLmpzJ1xuaW1wb3J0IFJhZGl4Q2hhcnQgZnJvbSAnLi9jaGFydHMvUmFkaXhDaGFydC5qcydcbmltcG9ydCBUcmFuc2l0Q2hhcnQgZnJvbSAnLi9jaGFydHMvVHJhbnNpdENoYXJ0LmpzJ1xuXG5leHBvcnQge1VuaXZlcnNlLCBTVkdVdGlscywgVXRpbHMsIFJhZGl4Q2hhcnQsIFRyYW5zaXRDaGFydH1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==