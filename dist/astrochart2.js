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
                dignitiesText.setAttribute('class', this.#settings.CLASS_POINT_DIGNITY + ' ' + this.#settings.CLASS_POINT_DIGNITY + '--' + dignitiesText); // Straightforward r/d/e/f
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
         * Draw lines first
         */
        for (let i = 0; i < aspectsList.length; i++) {
            const asp = aspectsList[i];
            const aspectGroup = aspectGroups[i];

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
            const lineCenterY = (fromPoint.y + toPoint.y) / 2
            const symbol = _SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGSymbol(asp.aspect.name, lineCenterX, lineCenterY)
            symbol.setAttribute("font-family", settings.CHART_FONT_FAMILY);
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
    static SYMBOL_SEMISQUARE = "Semisquare";
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
    static SVGSymbol(name, xPos, yPos, ) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QStDO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsa0NBQWtDO0FBQzFDLFFBQVEsb0NBQW9DO0FBQzVDLFFBQVEsaUNBQWlDO0FBQ3pDLFFBQVEsbUNBQW1DO0FBQzNDLFFBQVEsbUNBQW1DO0FBQzNDO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDTztBQUNQLEtBQUssa0RBQWtEO0FBQ3ZELEtBQUssbURBQW1EO0FBQ3hELEtBQUssOENBQThDO0FBQ25ELEtBQUssOENBQThDO0FBQ25ELEtBQUssK0NBQStDOztBQUVwRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzFEQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDelBBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDTzs7QUFFUDtBQUNBLDBEQUEwRCxNQUFNO0FBQ2hFLFVBQVU7QUFDVjtBQUNPLDBCQUEwQixNQUFNOzs7QUFHdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDTztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVQO0FBQ0E7QUFDQTtBQUNPO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2pKUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7O0FDN0NQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNkUDtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNPOzs7QUFHUDtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNPOzs7QUFHUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNPOztBQUVQO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDTzs7QUFFUDtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ087O0FBRVA7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNPOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2pKc0Q7QUFDakI7QUFDSztBQUNJOzs7QUFHckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWUsUUFBUTtBQUN2QixlQUFlLFFB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QzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZSxRQUFRO0FBQ3ZCLGVBQWUsUUFBUTtBQUN2QixlQUFlLFFBQVE7QUFDdkI7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7OztBQUdBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7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O0FDTjZDO0FBQ0g7QUFDTjtBQUNXO0FBQ0k7O0FBRVMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy9jaGFydHMvQ2hhcnQuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL2NoYXJ0cy9SYWRpeENoYXJ0LmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy9jaGFydHMvVHJhbnNpdENoYXJ0LmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy9wb2ludHMvUG9pbnQuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL3NldHRpbmdzL0RlZmF1bHRTZXR0aW5ncy5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvc2V0dGluZ3MvY29uc3RhbnRzL0FzcGVjdHMuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL3NldHRpbmdzL2NvbnN0YW50cy9Db2xvcnMuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL3NldHRpbmdzL2NvbnN0YW50cy9Qb2ludC5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvc2V0dGluZ3MvY29uc3RhbnRzL1JhZGl4LmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy9zZXR0aW5ncy9jb25zdGFudHMvVHJhbnNpdC5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvc2V0dGluZ3MvY29uc3RhbnRzL1VuaXZlcnNlLmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy91bml2ZXJzZS9Vbml2ZXJzZS5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvdXRpbHMvQXNwZWN0VXRpbHMuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL3V0aWxzL1NWR1V0aWxzLmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy91dGlscy9VdGlscy5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiYXN0cm9sb2d5XCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcImFzdHJvbG9neVwiXSA9IGZhY3RvcnkoKTtcbn0pKHNlbGYsICgpID0+IHtcbnJldHVybiAiLCJpbXBvcnQgVXRpbHMgZnJvbSAnLi4vdXRpbHMvVXRpbHMuanMnO1xuXG4vKipcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyBBbiBhYnN0cmFjdCBjbGFzcyBmb3IgYWxsIHR5cGUgb2YgQ2hhcnRcbiAqIEBwdWJsaWNcbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqIEBhYnN0cmFjdFxuICovXG5jbGFzcyBDaGFydCB7XG5cbiAgLy8jc2V0dGluZ3NcblxuICAvKipcbiAgICogQGNvbnN0cnVjdHNcbiAgICogQHBhcmFtIHtPYmplY3R9IHNldHRpbmdzXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzZXR0aW5ncykge1xuICAgIC8vdGhpcy4jc2V0dGluZ3MgPSBzZXR0aW5nc1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBkYXRhIGlzIHZhbGlkXG4gICAqIEB0aHJvd3Mge0Vycm9yfSAtIGlmIHRoZSBkYXRhIGlzIHVuZGVmaW5lZC5cbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGFcbiAgICogQHJldHVybiB7T2JqZWN0fSAtIHtpc1ZhbGlkOmJvb2xlYW4sIG1lc3NhZ2U6U3RyaW5nfVxuICAgKi9cbiAgdmFsaWRhdGVEYXRhKGRhdGEpIHtcbiAgICBpZiAoIWRhdGEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIk1pc2luZyBwYXJhbSBkYXRhLlwiKVxuICAgIH1cblxuICAgIGlmICghQXJyYXkuaXNBcnJheShkYXRhLnBvaW50cykpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlzVmFsaWQ6IGZhbHNlLFxuICAgICAgICBtZXNzYWdlOiBcInBvaW50cyBpcyBub3QgQXJyYXkuXCJcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoZGF0YS5jdXNwcykpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlzVmFsaWQ6IGZhbHNlLFxuICAgICAgICBtZXNzYWdlOiBcImN1cHMgaXMgbm90IEFycmF5LlwiXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGRhdGEuY3VzcHMubGVuZ3RoICE9PSAxMikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaXNWYWxpZDogZmFsc2UsXG4gICAgICAgIG1lc3NhZ2U6IFwiY3VzcHMubGVuZ3RoICE9PSAxMlwiXG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChsZXQgcG9pbnQgb2YgZGF0YS5wb2ludHMpIHtcbiAgICAgIGlmICh0eXBlb2YgcG9pbnQubmFtZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBpc1ZhbGlkOiBmYWxzZSxcbiAgICAgICAgICBtZXNzYWdlOiBcInBvaW50Lm5hbWUgIT09ICdzdHJpbmcnXCJcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHBvaW50Lm5hbWUubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaXNWYWxpZDogZmFsc2UsXG4gICAgICAgICAgbWVzc2FnZTogXCJwb2ludC5uYW1lLmxlbmd0aCA9PSAwXCJcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBwb2ludC5hbmdsZSAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBpc1ZhbGlkOiBmYWxzZSxcbiAgICAgICAgICBtZXNzYWdlOiBcInBvaW50LmFuZ2xlICE9PSAnbnVtYmVyJ1wiXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGxldCBjdXNwIG9mIGRhdGEuY3VzcHMpIHtcbiAgICAgIGlmICh0eXBlb2YgY3VzcC5hbmdsZSAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBpc1ZhbGlkOiBmYWxzZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImN1c3AuYW5nbGUgIT09ICdudW1iZXInXCJcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBpc1ZhbGlkOiB0cnVlLFxuICAgICAgbWVzc2FnZTogXCJcIlxuICAgIH1cbiAgfVxuICBcbiAgLyoqXG4gICAqIEBhYnN0cmFjdFxuICAgKi9cbiAgc2V0RGF0YShkYXRhKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiTXVzdCBiZSBpbXBsZW1lbnRlZCBieSBzdWJjbGFzcy5cIik7XG4gIH1cblxuICAvKipcbiAgICogQGFic3RyYWN0XG4gICAqL1xuICBnZXRQb2ludHMoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiTXVzdCBiZSBpbXBsZW1lbnRlZCBieSBzdWJjbGFzcy5cIik7XG4gIH1cblxuICAvKipcbiAgICogQGFic3RyYWN0XG4gICAqL1xuICBnZXRQb2ludChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiTXVzdCBiZSBpbXBsZW1lbnRlZCBieSBzdWJjbGFzcy5cIik7XG4gIH1cblxuICAvKipcbiAgICogQGFic3RyYWN0XG4gICAqL1xuICBhbmltYXRlVG8oZGF0YSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIk11c3QgYmUgaW1wbGVtZW50ZWQgYnkgc3ViY2xhc3MuXCIpO1xuICB9XG5cbiAgLy8gIyMgUFJPVEVDVEVEICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG59XG5cbmV4cG9ydCB7XG4gIENoYXJ0IGFzXG4gIGRlZmF1bHRcbn1cbiIsImltcG9ydCBVbml2ZXJzZSBmcm9tICcuLi91bml2ZXJzZS9Vbml2ZXJzZS5qcyc7XG5pbXBvcnQgU1ZHVXRpbHMgZnJvbSAnLi4vdXRpbHMvU1ZHVXRpbHMuanMnO1xuaW1wb3J0IFV0aWxzIGZyb20gJy4uL3V0aWxzL1V0aWxzLmpzJztcbmltcG9ydCBBc3BlY3RVdGlscyBmcm9tICcuLi91dGlscy9Bc3BlY3RVdGlscy5qcyc7XG5pbXBvcnQgQ2hhcnQgZnJvbSAnLi9DaGFydC5qcydcbmltcG9ydCBQb2ludCBmcm9tICcuLi9wb2ludHMvUG9pbnQuanMnXG5pbXBvcnQgRGVmYXVsdFNldHRpbmdzIGZyb20gJy4uL3NldHRpbmdzL0RlZmF1bHRTZXR0aW5ncy5qcyc7XG5cbi8qKlxuICogQGNsYXNzXG4gKiBAY2xhc3NkZXNjIFBvaW50cyBhbmQgY3VwcyBhcmUgZGlzcGxheWVkIGluc2lkZSB0aGUgVW5pdmVyc2UuXG4gKiBAcHVibGljXG4gKiBAZXh0ZW5kcyB7Q2hhcnR9XG4gKi9cbmNsYXNzIFJhZGl4Q2hhcnQgZXh0ZW5kcyBDaGFydCB7XG5cbiAgICAvKlxuICAgICAqIExldmVscyBkZXRlcm1pbmUgdGhlIHdpZHRoIG9mIGluZGl2aWR1YWwgcGFydHMgb2YgdGhlIGNoYXJ0LlxuICAgICAqIEl0IGNhbiBiZSBjaGFuZ2VkIGR5bmFtaWNhbGx5IGJ5IHB1YmxpYyBzZXR0ZXIuXG4gICAgICovXG4gICAgI251bWJlck9mTGV2ZWxzID0gMjRcblxuICAgICN1bml2ZXJzZVxuICAgICNzZXR0aW5nc1xuICAgICNyb290XG4gICAgI2RhdGFcblxuICAgICNjZW50ZXJYXG4gICAgI2NlbnRlcllcbiAgICAjcmFkaXVzXG5cbiAgICAvKlxuICAgICAqIEBzZWUgVXRpbHMuY2xlYW5VcCgpXG4gICAgICovXG4gICAgI2JlZm9yZUNsZWFuVXBIb29rXG5cbiAgICAvKipcbiAgICAgKiBAY29uc3RydWN0c1xuICAgICAqIEBwYXJhbSB7VW5pdmVyc2V9IFVuaXZlcnNlXG4gICAgICovXG4gICAgY29uc3RydWN0b3IodW5pdmVyc2UpIHtcblxuICAgICAgICBpZiAoISB1bml2ZXJzZSBpbnN0YW5jZW9mIFVuaXZlcnNlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0JhZCBwYXJhbSB1bml2ZXJzZS4nKVxuICAgICAgICB9XG5cbiAgICAgICAgc3VwZXIodW5pdmVyc2UuZ2V0U2V0dGluZ3MoKSlcblxuICAgICAgICB0aGlzLiN1bml2ZXJzZSA9IHVuaXZlcnNlXG4gICAgICAgIHRoaXMuI3NldHRpbmdzID0gdGhpcy4jdW5pdmVyc2UuZ2V0U2V0dGluZ3MoKVxuICAgICAgICB0aGlzLiNjZW50ZXJYID0gdGhpcy4jc2V0dGluZ3MuQ0hBUlRfVklFV0JPWF9XSURUSCAvIDJcbiAgICAgICAgdGhpcy4jY2VudGVyWSA9IHRoaXMuI3NldHRpbmdzLkNIQVJUX1ZJRVdCT1hfSEVJR0hUIC8gMlxuICAgICAgICB0aGlzLiNyYWRpdXMgPSBNYXRoLm1pbih0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZKSAtIHRoaXMuI3NldHRpbmdzLkNIQVJUX1BBRERJTkdcbiAgICAgICAgdGhpcy4jcm9vdCA9IFNWR1V0aWxzLlNWR0dyb3VwKClcbiAgICAgICAgdGhpcy4jcm9vdC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBgJHt0aGlzLiNzZXR0aW5ncy5IVE1MX0VMRU1FTlRfSUR9LSR7dGhpcy4jc2V0dGluZ3MuUkFESVhfSUR9YClcbiAgICAgICAgdGhpcy4jdW5pdmVyc2UuZ2V0U1ZHRG9jdW1lbnQoKS5hcHBlbmRDaGlsZCh0aGlzLiNyb290KTtcblxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldCBjaGFydCBkYXRhXG4gICAgICogQHRocm93cyB7RXJyb3J9IC0gaWYgdGhlIGRhdGEgaXMgbm90IHZhbGlkLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gICAgICogQHJldHVybiB7UmFkaXhDaGFydH1cbiAgICAgKi9cbiAgICBzZXREYXRhKGRhdGEpIHtcbiAgICAgICAgbGV0IHN0YXR1cyA9IHRoaXMudmFsaWRhdGVEYXRhKGRhdGEpXG4gICAgICAgIGlmICghIHN0YXR1cy5pc1ZhbGlkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3Ioc3RhdHVzLm1lc3NhZ2UpXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLiNkYXRhID0gZGF0YVxuICAgICAgICB0aGlzLiNkcmF3KGRhdGEpXG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgZGF0YVxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICBnZXREYXRhKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgXCJwb2ludHNcIjogWy4uLnRoaXMuI2RhdGEucG9pbnRzXSxcbiAgICAgICAgICAgIFwiY3VzcHNcIjogWy4uLnRoaXMuI2RhdGEuY3VzcHNdXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXQgbnVtYmVyIG9mIExldmVscy5cbiAgICAgKiBMZXZlbHMgZGV0ZXJtaW5lIHRoZSB3aWR0aCBvZiBpbmRpdmlkdWFsIHBhcnRzIG9mIHRoZSBjaGFydC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHNldE51bWJlck9mTGV2ZWxzKGxldmVscykge1xuICAgICAgICB0aGlzLiNudW1iZXJPZkxldmVscyA9IE1hdGgubWF4KDI0LCBsZXZlbHMpXG4gICAgICAgIGlmICh0aGlzLiNkYXRhKSB7XG4gICAgICAgICAgICB0aGlzLiNkcmF3KHRoaXMuI2RhdGEpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCByYWRpdXNcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAgICovXG4gICAgZ2V0UmFkaXVzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy4jcmFkaXVzXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHJhZGl1c1xuICAgICAqIEByZXR1cm4ge051bWJlcn1cbiAgICAgKi9cbiAgICBnZXRPdXRlckNpcmNsZVJhZGl1cygpIHtcbiAgICAgICAgcmV0dXJuIDI0ICogKHRoaXMuZ2V0UmFkaXVzKCkgLyB0aGlzLiNudW1iZXJPZkxldmVscylcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgcmFkaXVzXG4gICAgICogQHJldHVybiB7TnVtYmVyfVxuICAgICAqL1xuICAgIGdldElubmVyQ2lyY2xlUmFkaXVzKCkge1xuICAgICAgICByZXR1cm4gMjEgKiAodGhpcy5nZXRSYWRpdXMoKSAvIHRoaXMuI251bWJlck9mTGV2ZWxzKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCByYWRpdXNcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAgICovXG4gICAgZ2V0UnVsbGVyQ2lyY2xlUmFkaXVzKCkge1xuICAgICAgICByZXR1cm4gMjAgKiAodGhpcy5nZXRSYWRpdXMoKSAvIHRoaXMuI251bWJlck9mTGV2ZWxzKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCByYWRpdXNcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAgICovXG4gICAgZ2V0UG9pbnRDaXJjbGVSYWRpdXMoKSB7XG4gICAgICAgIHJldHVybiAxOCAqICh0aGlzLmdldFJhZGl1cygpIC8gdGhpcy4jbnVtYmVyT2ZMZXZlbHMpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHJhZGl1c1xuICAgICAqIEByZXR1cm4ge051bWJlcn1cbiAgICAgKi9cbiAgICBnZXRDZW50ZXJDaXJjbGVSYWRpdXMoKSB7XG4gICAgICAgIHJldHVybiAxMiAqICh0aGlzLmdldFJhZGl1cygpIC8gdGhpcy4jbnVtYmVyT2ZMZXZlbHMpICogKHRoaXMuI3NldHRpbmdzLkNIQVJUX0NFTlRFUl9TSVpFID8/IDEpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IFVuaXZlcnNlXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtVbml2ZXJzZX1cbiAgICAgKi9cbiAgICBnZXRVbml2ZXJzZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI3VuaXZlcnNlXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IEFzY2VuZGF0IHNoaWZ0XG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAgICovXG4gICAgZ2V0QXNjZW5kYW50U2hpZnQoKSB7XG4gICAgICAgIHJldHVybiAodGhpcy4jZGF0YT8uY3VzcHNbMF0/LmFuZ2xlID8/IDApICsgVXRpbHMuREVHXzE4MFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBhc3BlY3RzXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IFtmcm9tUG9pbnRzXSAtIFt7bmFtZTpcIk1vb25cIiwgYW5nbGU6MH0sIHtuYW1lOlwiU3VuXCIsIGFuZ2xlOjE3OX0sIHtuYW1lOlwiTWVyY3VyeVwiLCBhbmdsZToxMjF9XVxuICAgICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gW3RvUG9pbnRzXSAtIFt7bmFtZTpcIkFTXCIsIGFuZ2xlOjB9LCB7bmFtZTpcIklDXCIsIGFuZ2xlOjkwfV1cbiAgICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IFthc3BlY3RzXSAtIFt7bmFtZTpcIk9wcG9zaXRpb25cIiwgYW5nbGU6MTgwLCBvcmI6Mn0sIHtuYW1lOlwiVHJpbmVcIiwgYW5nbGU6MTIwLCBvcmI6Mn1dXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtBcnJheTxPYmplY3Q+fVxuICAgICAqL1xuICAgIGdldEFzcGVjdHMoZnJvbVBvaW50cywgdG9Qb2ludHMsIGFzcGVjdHMpIHtcbiAgICAgICAgaWYgKCEgdGhpcy4jZGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBmcm9tUG9pbnRzID0gZnJvbVBvaW50cyA/PyB0aGlzLiNkYXRhLnBvaW50cy5maWx0ZXIoeCA9PiBcImFzcGVjdFwiIGluIHggPyB4LmFzcGVjdCA6IHRydWUpXG4gICAgICAgIHRvUG9pbnRzID0gdG9Qb2ludHMgPz8gWy4uLnRoaXMuI2RhdGEucG9pbnRzLmZpbHRlcih4ID0+IFwiYXNwZWN0XCIgaW4geCA/IHguYXNwZWN0IDogdHJ1ZSksIC4uLnRoaXMuI2RhdGEuY3VzcHMuZmlsdGVyKHggPT4geC5hc3BlY3QpXVxuICAgICAgICBhc3BlY3RzID0gYXNwZWN0cyA/PyB0aGlzLiNzZXR0aW5ncy5ERUZBVUxUX0FTUEVDVFMgPz8gRGVmYXVsdFNldHRpbmdzLkRFRkFVTFRfQVNQRUNUU1xuXG4gICAgICAgIHJldHVybiBBc3BlY3RVdGlscy5nZXRBc3BlY3RzKGZyb21Qb2ludHMsIHRvUG9pbnRzLCBhc3BlY3RzKS5maWx0ZXIoYXNwZWN0ID0+IGFzcGVjdC5mcm9tLm5hbWUgIT0gYXNwZWN0LnRvLm5hbWUpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRHJhdyBhc3BlY3RzXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IFtmcm9tUG9pbnRzXSAtIFt7bmFtZTpcIk1vb25cIiwgYW5nbGU6MH0sIHtuYW1lOlwiU3VuXCIsIGFuZ2xlOjE3OX0sIHtuYW1lOlwiTWVyY3VyeVwiLCBhbmdsZToxMjF9XVxuICAgICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gW3RvUG9pbnRzXSAtIFt7bmFtZTpcIkFTXCIsIGFuZ2xlOjB9LCB7bmFtZTpcIklDXCIsIGFuZ2xlOjkwfV1cbiAgICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IFthc3BlY3RzXSAtIFt7bmFtZTpcIk9wcG9zaXRpb25cIiwgYW5nbGU6MTgwLCBvcmI6Mn0sIHtuYW1lOlwiVHJpbmVcIiwgYW5nbGU6MTIwLCBvcmI6Mn1dXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtBcnJheTxPYmplY3Q+fVxuICAgICAqL1xuICAgIGRyYXdBc3BlY3RzKGZyb21Qb2ludHMsIHRvUG9pbnRzLCBhc3BlY3RzKSB7XG4gICAgICAgIGNvbnN0IGFzcGVjdHNXcmFwcGVyID0gdGhpcy4jdW5pdmVyc2UuZ2V0QXNwZWN0c0VsZW1lbnQoKVxuICAgICAgICBVdGlscy5jbGVhblVwKGFzcGVjdHNXcmFwcGVyLmdldEF0dHJpYnV0ZShcImlkXCIpLCB0aGlzLiNiZWZvcmVDbGVhblVwSG9vaylcblxuICAgICAgICBjb25zdCBhc3BlY3RzTGlzdCA9IHRoaXMuZ2V0QXNwZWN0cyhmcm9tUG9pbnRzLCB0b1BvaW50cywgYXNwZWN0cylcbiAgICAgICAgICAgIC5yZWR1Y2UoKGFyciwgYXNwZWN0KSA9PiB7XG5cbiAgICAgICAgICAgICAgICBsZXQgaXNUaGVTYW1lID0gYXJyLnNvbWUoZWxtID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVsbS5mcm9tLm5hbWUgPT0gYXNwZWN0LnRvLm5hbWUgJiYgZWxtLnRvLm5hbWUgPT0gYXNwZWN0LmZyb20ubmFtZVxuICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICBpZiAoISBpc1RoZVNhbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgYXJyLnB1c2goYXNwZWN0KVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBhcnJcbiAgICAgICAgICAgIH0sIFtdKVxuICAgICAgICAgICAgLmZpbHRlcihhc3BlY3QgPT4gYXNwZWN0LmFzcGVjdC5uYW1lICE9ICdDb25qdW5jdGlvbicpXG5cbiAgICAgICAgY29uc3QgY2lyY2xlID0gU1ZHVXRpbHMuU1ZHQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuZ2V0Q2VudGVyQ2lyY2xlUmFkaXVzKCkpXG4gICAgICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoJ2ZpbGwnLCB0aGlzLiNzZXR0aW5ncy5BU1BFQ1RTX0JBQ0tHUk9VTkRfQ09MT1IpXG4gICAgICAgIGFzcGVjdHNXcmFwcGVyLmFwcGVuZENoaWxkKGNpcmNsZSlcblxuICAgICAgICBhc3BlY3RzV3JhcHBlci5hcHBlbmRDaGlsZChBc3BlY3RVdGlscy5kcmF3QXNwZWN0cyh0aGlzLmdldENlbnRlckNpcmNsZVJhZGl1cygpLCB0aGlzLmdldEFzY2VuZGFudFNoaWZ0KCksIHRoaXMuI3NldHRpbmdzLCBhc3BlY3RzTGlzdCkpXG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICAvLyAjIyBQUklWQVRFICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gICAgLypcbiAgICAgKiBEcmF3IHJhZGl4IGNoYXJ0XG4gICAgICogQHBhcmFtIHtPYmplY3R9IGRhdGFcbiAgICAgKi9cbiAgICAjZHJhdyhkYXRhKSB7XG4gICAgICAgIFV0aWxzLmNsZWFuVXAodGhpcy4jcm9vdC5nZXRBdHRyaWJ1dGUoJ2lkJyksIHRoaXMuI2JlZm9yZUNsZWFuVXBIb29rKVxuICAgICAgICB0aGlzLiNkcmF3QmFja2dyb3VuZCgpXG4gICAgICAgIHRoaXMuI2RyYXdBc3Ryb2xvZ2ljYWxTaWducygpXG4gICAgICAgIHRoaXMuI2RyYXdDdXNwcyhkYXRhKVxuICAgICAgICB0aGlzLiNkcmF3UG9pbnRzKGRhdGEpXG4gICAgICAgIHRoaXMuI2RyYXdSdWxlcigpXG4gICAgICAgIHRoaXMuI2RyYXdCb3JkZXJzKClcbiAgICAgICAgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfRFJBV19NQUlOX0FYSVMgJiYgdGhpcy4jZHJhd01haW5BeGlzRGVzY3JpcHRpb24oZGF0YSlcbiAgICAgICAgdGhpcy4jc2V0dGluZ3MuRFJBV19BU1BFQ1RTICYmIHRoaXMuZHJhd0FzcGVjdHMoKVxuICAgIH1cblxuICAgICNkcmF3QmFja2dyb3VuZCgpIHtcbiAgICAgICAgY29uc3QgTUFTS19JRCA9IGAke3RoaXMuI3NldHRpbmdzLkhUTUxfRUxFTUVOVF9JRH0tJHt0aGlzLiNzZXR0aW5ncy5SQURJWF9JRH0tYmFja2dyb3VuZC1tYXNrLTFgXG5cbiAgICAgICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcbiAgICAgICAgd3JhcHBlci5jbGFzc0xpc3QuYWRkKCdjLXJhZGl4LWJhY2tncm91bmQnKVxuXG4gICAgICAgIGNvbnN0IG1hc2sgPSBTVkdVdGlscy5TVkdNYXNrKE1BU0tfSUQpXG4gICAgICAgIGNvbnN0IG91dGVyQ2lyY2xlID0gU1ZHVXRpbHMuU1ZHQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuZ2V0UmFkaXVzKCkpXG4gICAgICAgIG91dGVyQ2lyY2xlLnNldEF0dHJpYnV0ZSgnZmlsbCcsIFwid2hpdGVcIilcbiAgICAgICAgbWFzay5hcHBlbmRDaGlsZChvdXRlckNpcmNsZSlcblxuICAgICAgICBjb25zdCBpbm5lckNpcmNsZSA9IFNWR1V0aWxzLlNWR0NpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLmdldENlbnRlckNpcmNsZVJhZGl1cygpKVxuICAgICAgICBpbm5lckNpcmNsZS5zZXRBdHRyaWJ1dGUoJ2ZpbGwnLCBcImJsYWNrXCIpXG4gICAgICAgIG1hc2suYXBwZW5kQ2hpbGQoaW5uZXJDaXJjbGUpXG4gICAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQobWFzaylcblxuICAgICAgICBjb25zdCBjaXJjbGUgPSBTVkdVdGlscy5TVkdDaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy5nZXRSYWRpdXMoKSlcbiAgICAgICAgY2lyY2xlLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFX09OTFkgPyBcIm5vbmVcIiA6IHRoaXMuI3NldHRpbmdzLlBMQU5FVFNfQkFDS0dST1VORF9DT0xPUik7XG4gICAgICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJtYXNrXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRV9PTkxZID8gXCJub25lXCIgOiBgdXJsKCMke01BU0tfSUR9KWApO1xuICAgICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGNpcmNsZSlcblxuICAgICAgICB0aGlzLiNyb290LnBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvcignLmMtYmFja2dyb3VuZHMnKS5hcHBlbmRDaGlsZCh3cmFwcGVyKVxuICAgIH1cblxuICAgICNkcmF3QXN0cm9sb2dpY2FsU2lnbnMoKSB7XG4gICAgICAgIGNvbnN0IE5VTUJFUl9PRl9BU1RST0xPR0lDQUxfU0lHTlMgPSAxMlxuICAgICAgICBjb25zdCBTVEVQID0gMzAgLy9kZWdyZWVcbiAgICAgICAgY29uc3QgQ09MT1JTX1NJR05TID0gW3RoaXMuI3NldHRpbmdzLkNPTE9SX0FSSUVTLCB0aGlzLiNzZXR0aW5ncy5DT0xPUl9UQVVSVVMsIHRoaXMuI3NldHRpbmdzLkNPTE9SX0dFTUlOSSwgdGhpcy4jc2V0dGluZ3MuQ09MT1JfQ0FOQ0VSLCB0aGlzLiNzZXR0aW5ncy5DT0xPUl9MRU8sIHRoaXMuI3NldHRpbmdzLkNPTE9SX1ZJUkdPLCB0aGlzLiNzZXR0aW5ncy5DT0xPUl9MSUJSQSwgdGhpcy4jc2V0dGluZ3MuQ09MT1JfU0NPUlBJTywgdGhpcy4jc2V0dGluZ3MuQ09MT1JfU0FHSVRUQVJJVVMsIHRoaXMuI3NldHRpbmdzLkNPTE9SX0NBUFJJQ09STiwgdGhpcy4jc2V0dGluZ3MuQ09MT1JfQVFVQVJJVVMsIHRoaXMuI3NldHRpbmdzLkNPTE9SX1BJU0NFU11cbiAgICAgICAgY29uc3QgU1lNQk9MX1NJR05TID0gW1NWR1V0aWxzLlNZTUJPTF9BUklFUywgU1ZHVXRpbHMuU1lNQk9MX1RBVVJVUywgU1ZHVXRpbHMuU1lNQk9MX0dFTUlOSSwgU1ZHVXRpbHMuU1lNQk9MX0NBTkNFUiwgU1ZHVXRpbHMuU1lNQk9MX0xFTywgU1ZHVXRpbHMuU1lNQk9MX1ZJUkdPLCBTVkdVdGlscy5TWU1CT0xfTElCUkEsIFNWR1V0aWxzLlNZTUJPTF9TQ09SUElPLCBTVkdVdGlscy5TWU1CT0xfU0FHSVRUQVJJVVMsIFNWR1V0aWxzLlNZTUJPTF9DQVBSSUNPUk4sIFNWR1V0aWxzLlNZTUJPTF9BUVVBUklVUywgU1ZHVXRpbHMuU1lNQk9MX1BJU0NFU11cblxuICAgICAgICBpZiAoQ09MT1JTX1NJR05TLmxlbmd0aCAhPT0gMTIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ01pc3NpbmcgZW50cmllcyBpbiBDT0xPUl9TSUdOUywgcmVxdWlyZXMgMTIgZW50cmllcycpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbWFrZVN5bWJvbCA9IChzeW1ib2xJbmRleCwgYW5nbGVJbkRlZ3JlZSkgPT4ge1xuICAgICAgICAgICAgbGV0IHBvc2l0aW9uID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLmdldE91dGVyQ2lyY2xlUmFkaXVzKCkgLSAoKHRoaXMuZ2V0T3V0ZXJDaXJjbGVSYWRpdXMoKSAtIHRoaXMuZ2V0SW5uZXJDaXJjbGVSYWRpdXMoKSkgLyAyKSwgVXRpbHMuZGVncmVlVG9SYWRpYW4oYW5nbGVJbkRlZ3JlZSArIFNURVAgLyAyLCB0aGlzLmdldEFzY2VuZGFudFNoaWZ0KCkpKVxuXG4gICAgICAgICAgICBsZXQgc3ltYm9sID0gU1ZHVXRpbHMuU1ZHU3ltYm9sKFNZTUJPTF9TSUdOU1tzeW1ib2xJbmRleF0sIHBvc2l0aW9uLngsIHBvc2l0aW9uLnkpXG4gICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZm9udC1mYW1pbHlcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfRk9OVF9GQU1JTFkpO1xuICAgICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpIC8vIHN0YXJ0LCBtaWRkbGUsIGVuZFxuICAgICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImRvbWluYW50LWJhc2VsaW5lXCIsIFwibWlkZGxlXCIpXG4gICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZm9udC1zaXplXCIsIHRoaXMuI3NldHRpbmdzLlJBRElYX1NJR05TX0ZPTlRfU0laRSk7XG4gICAgICAgICAgICBpZiAodGhpcy4jc2V0dGluZ3MuU0lHTl9DT0xPUl9DSVJDTEUgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCB0aGlzLiNzZXR0aW5ncy5TSUdOX0NPTE9SX0NJUkNMRSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIHRoaXMuI3NldHRpbmdzLlNJR05fQ09MT1JTW3N5bWJvbEluZGV4XSA/PyB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TSUdOU19DT0xPUik7XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgaWYgKHRoaXMuI3NldHRpbmdzLkNMQVNTX1NJR04pIHtcbiAgICAgICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKCdjbGFzcycsIHRoaXMuI3NldHRpbmdzLkNMQVNTX1NJR04gKyAnICcgKyB0aGlzLiNzZXR0aW5ncy5DTEFTU19TSUdOICsgJy0tJyArIFNZTUJPTF9TSUdOU1tzeW1ib2xJbmRleF0udG9Mb3dlckNhc2UoKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLiNzZXR0aW5ncy5TWU1CT0xfU1RST0tFKSB7XG4gICAgICAgICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZSgncGFpbnQtb3JkZXInLCAnc3Ryb2tlJyk7XG4gICAgICAgICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZSgnc3Ryb2tlJywgdGhpcy4jc2V0dGluZ3MuU1lNQk9MX1NUUk9LRV9DT0xPUik7XG4gICAgICAgICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZSgnc3Ryb2tlLXdpZHRoJywgdGhpcy4jc2V0dGluZ3MuU1lNQk9MX1NUUk9LRV9XSURUSCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBzeW1ib2xcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG1ha2VTZWdtZW50ID0gKHN5bWJvbEluZGV4LCBhbmdsZUZyb21JbkRlZ3JlZSwgYW5nbGVUb0luRGVncmVlKSA9PiB7XG4gICAgICAgICAgICBsZXQgYTEgPSBVdGlscy5kZWdyZWVUb1JhZGlhbihhbmdsZUZyb21JbkRlZ3JlZSwgdGhpcy5nZXRBc2NlbmRhbnRTaGlmdCgpKVxuICAgICAgICAgICAgbGV0IGEyID0gVXRpbHMuZGVncmVlVG9SYWRpYW4oYW5nbGVUb0luRGVncmVlLCB0aGlzLmdldEFzY2VuZGFudFNoaWZ0KCkpXG4gICAgICAgICAgICBsZXQgc2VnbWVudCA9IFNWR1V0aWxzLlNWR1NlZ21lbnQodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy5nZXRPdXRlckNpcmNsZVJhZGl1cygpLCBhMSwgYTIsIHRoaXMuZ2V0SW5uZXJDaXJjbGVSYWRpdXMoKSk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0VfV0lUSF9DT0xPUikge1xuICAgICAgICAgICAgICAgIHNlZ21lbnQuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBDT0xPUlNfU0lHTlNbc3ltYm9sSW5kZXhdKTtcbiAgICAgICAgICAgICAgICBzZWdtZW50LnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSVJDTEVfQ09MT1IpO1xuICAgICAgICAgICAgICAgIHNlZ21lbnQuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNlZ21lbnQuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0VfT05MWSA/IFwibm9uZVwiIDogQ09MT1JTX1NJR05TW3N5bWJvbEluZGV4XSk7XG4gICAgICAgICAgICAgICAgc2VnbWVudC5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFX09OTFkgPyB0aGlzLiNzZXR0aW5ncy5DSVJDTEVfQ09MT1IgOiBcIm5vbmVcIik7XG4gICAgICAgICAgICAgICAgc2VnbWVudC5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFX09OTFkgPyB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0UgOiAwKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuI3NldHRpbmdzLkNMQVNTX1NJR05fU0VHTUVOVCkge1xuICAgICAgICAgICAgICAgIHNlZ21lbnQuc2V0QXR0cmlidXRlKCdjbGFzcycsIHRoaXMuI3NldHRpbmdzLkNMQVNTX1NJR05fU0VHTUVOVCArICcgJyArIHRoaXMuI3NldHRpbmdzLkNMQVNTX1NJR05fU0VHTUVOVCArIFNZTUJPTF9TSUdOU1tzeW1ib2xJbmRleF0udG9Mb3dlckNhc2UoKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBzZWdtZW50XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgc3RhcnRBbmdsZSA9IDBcbiAgICAgICAgbGV0IGVuZEFuZ2xlID0gc3RhcnRBbmdsZSArIFNURVBcblxuICAgICAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuICAgICAgICB3cmFwcGVyLmNsYXNzTGlzdC5hZGQoJ2MtcmFkaXgtYXN0cm9sb2dpY2FsLXNpZ25zJylcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IE5VTUJFUl9PRl9BU1RST0xPR0lDQUxfU0lHTlM7IGkrKykge1xuXG4gICAgICAgICAgICBsZXQgc2VnbWVudCA9IG1ha2VTZWdtZW50KGksIHN0YXJ0QW5nbGUsIGVuZEFuZ2xlKVxuICAgICAgICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChzZWdtZW50KTtcblxuICAgICAgICAgICAgbGV0IHN5bWJvbCA9IG1ha2VTeW1ib2woaSwgc3RhcnRBbmdsZSlcbiAgICAgICAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoc3ltYm9sKTtcblxuICAgICAgICAgICAgc3RhcnRBbmdsZSArPSBTVEVQO1xuICAgICAgICAgICAgZW5kQW5nbGUgPSBzdGFydEFuZ2xlICsgU1RFUFxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy4jcm9vdC5hcHBlbmRDaGlsZCh3cmFwcGVyKVxuICAgIH1cblxuICAgICNkcmF3UnVsZXIoKSB7XG4gICAgICAgIGNvbnN0IE5VTUJFUl9PRl9ESVZJREVSUyA9IDcyXG4gICAgICAgIGNvbnN0IFNURVAgPSA1XG5cbiAgICAgICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcbiAgICAgICAgd3JhcHBlci5jbGFzc0xpc3QuYWRkKCdjLXJhZGl4LXJ1bGVyJylcblxuICAgICAgICBsZXQgc3RhcnRBbmdsZSA9IHRoaXMuZ2V0QXNjZW5kYW50U2hpZnQoKVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IE5VTUJFUl9PRl9ESVZJREVSUzsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgc3RhcnRQb2ludCA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy5nZXRSdWxsZXJDaXJjbGVSYWRpdXMoKSwgVXRpbHMuZGVncmVlVG9SYWRpYW4oc3RhcnRBbmdsZSkpXG4gICAgICAgICAgICBsZXQgZW5kUG9pbnQgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIChpICUgMikgPyB0aGlzLmdldElubmVyQ2lyY2xlUmFkaXVzKCkgLSAoKHRoaXMuZ2V0SW5uZXJDaXJjbGVSYWRpdXMoKSAtIHRoaXMuZ2V0UnVsbGVyQ2lyY2xlUmFkaXVzKCkpIC8gMikgOiB0aGlzLmdldElubmVyQ2lyY2xlUmFkaXVzKCksIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKHN0YXJ0QW5nbGUpKVxuICAgICAgICAgICAgY29uc3QgbGluZSA9IFNWR1V0aWxzLlNWR0xpbmUoc3RhcnRQb2ludC54LCBzdGFydFBvaW50LnksIGVuZFBvaW50LngsIGVuZFBvaW50LnkpO1xuICAgICAgICAgICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTElORV9DT0xPUik7XG4gICAgICAgICAgICBsaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0UpO1xuICAgICAgICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChsaW5lKTtcblxuICAgICAgICAgICAgc3RhcnRBbmdsZSArPSBTVEVQXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjaXJjbGUgPSBTVkdVdGlscy5TVkdDaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy5nZXRSdWxsZXJDaXJjbGVSYWRpdXMoKSk7XG4gICAgICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfQ0lSQ0xFX0NPTE9SKTtcbiAgICAgICAgY2lyY2xlLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0UpO1xuICAgICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGNpcmNsZSk7XG5cbiAgICAgICAgdGhpcy4jcm9vdC5hcHBlbmRDaGlsZCh3cmFwcGVyKVxuICAgIH1cblxuICAgIC8qXG4gICAgICogRHJhdyBwb2ludHNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YSAtIGNoYXJ0IGRhdGFcbiAgICAgKi9cbiAgICAjZHJhd1BvaW50cyhkYXRhKSB7XG4gICAgICAgIGNvbnN0IHBvaW50cyA9IGRhdGEucG9pbnRzXG4gICAgICAgIGNvbnN0IGN1c3BzID0gZGF0YS5jdXNwc1xuICAgICAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuICAgICAgICB3cmFwcGVyLmNsYXNzTGlzdC5hZGQoJ2MtcmFkaXgtcG9pbnRzJylcblxuICAgICAgICBjb25zdCBwb3NpdGlvbnMgPSBVdGlscy5jYWxjdWxhdGVQb3NpdGlvbldpdGhvdXRPdmVybGFwcGluZyhwb2ludHMsIHRoaXMuI3NldHRpbmdzLlBPSU5UX0NPTExJU0lPTl9SQURJVVMsIHRoaXMuZ2V0UG9pbnRDaXJjbGVSYWRpdXMoKSlcblxuICAgICAgICBmb3IgKGNvbnN0IHBvaW50RGF0YSBvZiBwb2ludHMpIHtcbiAgICAgICAgICAgIGNvbnN0IHBvaW50R3JvdXAgPSBTVkdVdGlscy5TVkdHcm91cCgpO1xuICAgICAgICAgICAgcG9pbnRHcm91cC5jbGFzc0xpc3QuYWRkKCdjLXJhZGl4LXBvaW50JylcbiAgICAgICAgICAgIHBvaW50R3JvdXAuY2xhc3NMaXN0LmFkZCgnYy1yYWRpeC1wb2ludC0tJyArIHBvaW50RGF0YS5uYW1lLnRvTG93ZXJDYXNlKCkpXG5cbiAgICAgICAgICAgIGNvbnN0IHBvaW50ID0gbmV3IFBvaW50KHBvaW50RGF0YSwgY3VzcHMsIHRoaXMuI3NldHRpbmdzKVxuICAgICAgICAgICAgY29uc3QgcG9pbnRQb3NpdGlvbiA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWCwgdGhpcy5nZXRSdWxsZXJDaXJjbGVSYWRpdXMoKSAtICgodGhpcy5nZXRJbm5lckNpcmNsZVJhZGl1cygpIC0gdGhpcy5nZXRSdWxsZXJDaXJjbGVSYWRpdXMoKSkgLyA0KSwgVXRpbHMuZGVncmVlVG9SYWRpYW4ocG9pbnQuZ2V0QW5nbGUoKSwgdGhpcy5nZXRBc2NlbmRhbnRTaGlmdCgpKSlcbiAgICAgICAgICAgIGNvbnN0IHN5bWJvbFBvc2l0aW9uID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJYLCB0aGlzLmdldFBvaW50Q2lyY2xlUmFkaXVzKCksIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKHBvc2l0aW9uc1twb2ludC5nZXROYW1lKCldLCB0aGlzLmdldEFzY2VuZGFudFNoaWZ0KCkpKVxuXG4gICAgICAgICAgICAvLyBydWxlciBtYXJrXG4gICAgICAgICAgICBjb25zdCBydWxlckxpbmVFbmRQb3NpdGlvbiA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWCwgdGhpcy5nZXRSdWxsZXJDaXJjbGVSYWRpdXMoKSwgVXRpbHMuZGVncmVlVG9SYWRpYW4ocG9pbnQuZ2V0QW5nbGUoKSwgdGhpcy5nZXRBc2NlbmRhbnRTaGlmdCgpKSlcblxuICAgICAgICAgICAgaWYgKHRoaXMuI3NldHRpbmdzLkRSQVdfUlVMRVJfTUFSSykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJ1bGVyTGluZSA9IFNWR1V0aWxzLlNWR0xpbmUocG9pbnRQb3NpdGlvbi54LCBwb2ludFBvc2l0aW9uLnksIHJ1bGVyTGluZUVuZFBvc2l0aW9uLngsIHJ1bGVyTGluZUVuZFBvc2l0aW9uLnkpXG4gICAgICAgICAgICAgICAgcnVsZXJMaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9MSU5FX0NPTE9SKTtcbiAgICAgICAgICAgICAgICBydWxlckxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRSk7XG4gICAgICAgICAgICAgICAgcG9pbnRHcm91cC5hcHBlbmRDaGlsZChydWxlckxpbmUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIExpbmUgZnJvbSB0aGUgcnVsZXIgdG8gdGhlIGNlbGVzdGlhbCBib2R5XG4gICAgICAgICAgICAgKiBAdHlwZSB7e3gsIHl9fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgLy9pZiAocG9zaXRpb25zW3BvaW50LmdldE5hbWUoKV0gIT0gcG9pbnREYXRhLnBvc2l0aW9uKSB7XG4gICAgICAgICAgICBjb25zdCBwb2ludGVyTGluZUVuZFBvc2l0aW9uID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJYLCB0aGlzLmdldFBvaW50Q2lyY2xlUmFkaXVzKCksIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKHBvc2l0aW9uc1twb2ludC5nZXROYW1lKCldLCB0aGlzLmdldEFzY2VuZGFudFNoaWZ0KCkpKVxuXG4gICAgICAgICAgICBsZXQgcG9pbnRlckxpbmU7XG4gICAgICAgICAgICBpZiAodGhpcy4jc2V0dGluZ3MuRFJBV19SVUxFUl9NQVJLKSB7XG4gICAgICAgICAgICAgICAgcG9pbnRlckxpbmUgPSBTVkdVdGlscy5TVkdMaW5lKHBvaW50UG9zaXRpb24ueCwgcG9pbnRQb3NpdGlvbi55LCAocG9pbnRQb3NpdGlvbi54ICsgcG9pbnRlckxpbmVFbmRQb3NpdGlvbi54KSAvIDIsIChwb2ludFBvc2l0aW9uLnkgKyBwb2ludGVyTGluZUVuZFBvc2l0aW9uLnkpIC8gMilcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcG9pbnRlckxpbmUgPSBTVkdVdGlscy5TVkdMaW5lKHJ1bGVyTGluZUVuZFBvc2l0aW9uLngsIHJ1bGVyTGluZUVuZFBvc2l0aW9uLnksIChwb2ludFBvc2l0aW9uLnggKyBwb2ludGVyTGluZUVuZFBvc2l0aW9uLngpIC8gMiwgKHBvaW50UG9zaXRpb24ueSArIHBvaW50ZXJMaW5lRW5kUG9zaXRpb24ueSkgLyAyKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuI3NldHRpbmdzLlBMQU5FVF9MSU5FX1VTRV9QTEFORVRfQ09MT1IpIHtcbiAgICAgICAgICAgICAgICBwb2ludGVyTGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuUExBTkVUX0NPTE9SU1twb2ludERhdGEubmFtZV0gPz8gdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTElORV9DT0xPUik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHBvaW50ZXJMaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9MSU5FX0NPTE9SKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcG9pbnRlckxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRSAvIDIpO1xuXG4gICAgICAgICAgICBwb2ludEdyb3VwLmFwcGVuZENoaWxkKHBvaW50ZXJMaW5lKTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBTeW1ub2wgb2YgdGhlIGNlbGVzdGlhbCBib2R5ICsgcG9pbnRzXG4gICAgICAgICAgICAgKiBAdHlwZSB7U1ZHRWxlbWVudH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY29uc3Qgc3ltYm9sID0gcG9pbnQuZ2V0U3ltYm9sKHN5bWJvbFBvc2l0aW9uLngsIHN5bWJvbFBvc2l0aW9uLnksIFV0aWxzLkRFR18wLCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX1NIT1cpXG4gICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZm9udC1mYW1pbHlcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfRk9OVF9GQU1JTFkpO1xuICAgICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpIC8vIHN0YXJ0LCBtaWRkbGUsIGVuZFxuICAgICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImRvbWluYW50LWJhc2VsaW5lXCIsIFwibWlkZGxlXCIpXG4gICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZm9udC1zaXplXCIsIHRoaXMuI3NldHRpbmdzLlJBRElYX1BPSU5UU19GT05UX1NJWkUpXG4gICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCB0aGlzLiNzZXR0aW5ncy5QTEFORVRfQ09MT1JTW3BvaW50RGF0YS5uYW1lXSA/PyB0aGlzLiNzZXR0aW5ncy5DSEFSVF9QT0lOVFNfQ09MT1IpXG4gICAgICAgICAgICBwb2ludEdyb3VwLmFwcGVuZENoaWxkKHN5bWJvbCk7XG5cbiAgICAgICAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQocG9pbnRHcm91cCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLiNyb290LmFwcGVuZENoaWxkKHdyYXBwZXIpXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBEcmF3IHBvaW50c1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIC0gY2hhcnQgZGF0YVxuICAgICAqL1xuICAgICNkcmF3Q3VzcHMoZGF0YSkge1xuICAgICAgICBjb25zdCBwb2ludHMgPSBkYXRhLnBvaW50c1xuICAgICAgICBjb25zdCBjdXNwcyA9IGRhdGEuY3VzcHNcblxuICAgICAgICBjb25zdCBtYWluQXhpc0luZGV4ZXMgPSBbMCwgMywgNiwgOV0gLy9BcywgSWMsIERzLCBNY1xuXG4gICAgICAgIGNvbnN0IHBvaW50c1Bvc2l0aW9ucyA9IHBvaW50cy5tYXAocG9pbnQgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHBvaW50LmFuZ2xlXG4gICAgICAgIH0pXG5cbiAgICAgICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcbiAgICAgICAgd3JhcHBlci5jbGFzc0xpc3QuYWRkKCdjLXJhZGl4LWN1c3BzJylcblxuICAgICAgICBjb25zdCB0ZXh0UmFkaXVzID0gdGhpcy5nZXRDZW50ZXJDaXJjbGVSYWRpdXMoKSArICgodGhpcy5nZXRJbm5lckNpcmNsZVJhZGl1cygpIC0gdGhpcy5nZXRDZW50ZXJDaXJjbGVSYWRpdXMoKSkgLyAxMClcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGN1c3BzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgICAgIGNvbnN0IGlzTGluZUluQ29sbGlzaW9uV2l0aFBvaW50ID0gISB0aGlzLiNzZXR0aW5ncy5DSEFSVF9BTExPV19IT1VTRV9PVkVSTEFQICYmIFV0aWxzLmlzQ29sbGlzaW9uKGN1c3BzW2ldLmFuZ2xlLCBwb2ludHNQb3NpdGlvbnMsIHRoaXMuI3NldHRpbmdzLlBPSU5UX0NPTExJU0lPTl9SQURJVVMgLyAyKVxuXG4gICAgICAgICAgICBjb25zdCBzdGFydFBvcyA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy5nZXRDZW50ZXJDaXJjbGVSYWRpdXMoKSwgVXRpbHMuZGVncmVlVG9SYWRpYW4oY3VzcHNbaV0uYW5nbGUsIHRoaXMuZ2V0QXNjZW5kYW50U2hpZnQoKSkpXG4gICAgICAgICAgICBjb25zdCBlbmRQb3MgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIGlzTGluZUluQ29sbGlzaW9uV2l0aFBvaW50ID8gdGhpcy5nZXRDZW50ZXJDaXJjbGVSYWRpdXMoKSArICgodGhpcy5nZXRSdWxsZXJDaXJjbGVSYWRpdXMoKSAtIHRoaXMuZ2V0Q2VudGVyQ2lyY2xlUmFkaXVzKCkpIC8gNikgOiB0aGlzLmdldFJ1bGxlckNpcmNsZVJhZGl1cygpLCBVdGlscy5kZWdyZWVUb1JhZGlhbihjdXNwc1tpXS5hbmdsZSwgdGhpcy5nZXRBc2NlbmRhbnRTaGlmdCgpKSlcblxuICAgICAgICAgICAgY29uc3QgbGluZSA9IFNWR1V0aWxzLlNWR0xpbmUoc3RhcnRQb3MueCwgc3RhcnRQb3MueSwgZW5kUG9zLngsIGVuZFBvcy55KVxuICAgICAgICAgICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgbWFpbkF4aXNJbmRleGVzLmluY2x1ZGVzKGkpID8gdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTUFJTl9BWElTX0NPTE9SIDogdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTElORV9DT0xPUilcbiAgICAgICAgICAgIGxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIG1haW5BeGlzSW5kZXhlcy5pbmNsdWRlcyhpKSA/IHRoaXMuI3NldHRpbmdzLkNIQVJUX01BSU5fU1RST0tFIDogdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFKVxuICAgICAgICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChsaW5lKTtcblxuICAgICAgICAgICAgY29uc3Qgc3RhcnRDdXNwID0gY3VzcHNbaV0uYW5nbGVcbiAgICAgICAgICAgIGNvbnN0IGVuZEN1c3AgPSBjdXNwc1soaSArIDEpICUgMTJdLmFuZ2xlXG4gICAgICAgICAgICBjb25zdCBnYXAgPSBlbmRDdXNwIC0gc3RhcnRDdXNwID4gMCA/IGVuZEN1c3AgLSBzdGFydEN1c3AgOiBlbmRDdXNwIC0gc3RhcnRDdXNwICsgVXRpbHMuREVHXzM2MFxuICAgICAgICAgICAgY29uc3QgdGV4dEFuZ2xlID0gc3RhcnRDdXNwICsgZ2FwIC8gMlxuXG4gICAgICAgICAgICBjb25zdCB0ZXh0UG9zID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0ZXh0UmFkaXVzLCBVdGlscy5kZWdyZWVUb1JhZGlhbih0ZXh0QW5nbGUsIHRoaXMuZ2V0QXNjZW5kYW50U2hpZnQoKSkpXG4gICAgICAgICAgICBjb25zdCB0ZXh0ID0gU1ZHVXRpbHMuU1ZHVGV4dCh0ZXh0UG9zLngsIHRleHRQb3MueSwgYCR7aSArIDF9YClcbiAgICAgICAgICAgIHRleHQuc2V0QXR0cmlidXRlKFwiZm9udC1mYW1pbHlcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfRk9OVF9GQU1JTFkpXG4gICAgICAgICAgICB0ZXh0LnNldEF0dHJpYnV0ZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpIC8vIHN0YXJ0LCBtaWRkbGUsIGVuZFxuICAgICAgICAgICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJkb21pbmFudC1iYXNlbGluZVwiLCBcIm1pZGRsZVwiKVxuICAgICAgICAgICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJmb250LXNpemVcIiwgdGhpcy4jc2V0dGluZ3MuUkFESVhfSE9VU0VfRk9OVF9TSVpFKVxuICAgICAgICAgICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0hPVVNFX05VTUJFUl9DT0xPUilcbiAgICAgICAgICAgIHRleHQuY2xhc3NMaXN0LmFkZCgnYy1yYWRpeC1jdXNwc19faG91c2UtbnVtYmVyJylcbiAgICAgICAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQodGV4dClcblxuICAgICAgICAgICAgaWYgKHRoaXMuI3NldHRpbmdzLkRSQVdfSE9VU0VfREVHUkVFKSB7XG4gICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodGhpcy4jc2V0dGluZ3MuSE9VU0VfREVHUkVFX0ZJTFRFUikgJiYgISB0aGlzLiNzZXR0aW5ncy5IT1VTRV9ERUdSRUVfRklMVEVSLmluY2x1ZGVzKGkgKyAxKSkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgZGVncmVlUG9zID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLmdldFJ1bGxlckNpcmNsZVJhZGl1cygpIC0gKHRoaXMuZ2V0SW5uZXJDaXJjbGVSYWRpdXMoKSAtIHRoaXMuZ2V0UnVsbGVyQ2lyY2xlUmFkaXVzKCkpIC8gMS4yLCBVdGlscy5kZWdyZWVUb1JhZGlhbihzdGFydEN1c3AgLSAyLjQsIHRoaXMuZ2V0QXNjZW5kYW50U2hpZnQoKSkpXG4gICAgICAgICAgICAgICAgY29uc3QgZGVncmVlID0gU1ZHVXRpbHMuU1ZHVGV4dChkZWdyZWVQb3MueCwgZGVncmVlUG9zLnksIE1hdGguZmxvb3IoY3VzcHNbaV0uYW5nbGUgJSAzMCkgKyBcIsK6XCIpXG4gICAgICAgICAgICAgICAgZGVncmVlLnNldEF0dHJpYnV0ZShcImZvbnQtZmFtaWx5XCIsIFwiQXJpYWxcIilcbiAgICAgICAgICAgICAgICBkZWdyZWUuc2V0QXR0cmlidXRlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIikgLy8gc3RhcnQsIG1pZGRsZSwgZW5kXG4gICAgICAgICAgICAgICAgZGVncmVlLnNldEF0dHJpYnV0ZShcImRvbWluYW50LWJhc2VsaW5lXCIsIFwibWlkZGxlXCIpXG4gICAgICAgICAgICAgICAgZGVncmVlLnNldEF0dHJpYnV0ZShcImZvbnQtc2l6ZVwiLCB0aGlzLiNzZXR0aW5ncy5IT1VTRV9ERUdSRUVfU0laRSB8fCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX0FOR0xFX1NJWkUgLyAyKVxuICAgICAgICAgICAgICAgIGRlZ3JlZS5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIHRoaXMuI3NldHRpbmdzLkhPVVNFX0RFR1JFRV9DT0xPUiB8fCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9IT1VTRV9OVU1CRVJfQ09MT1IpXG4gICAgICAgICAgICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChkZWdyZWUpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLiNyb290LmFwcGVuZENoaWxkKHdyYXBwZXIpXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBEcmF3IG1haW4gYXhpcyBkZXNjcml0aW9uXG4gICAgICogQHBhcmFtIHtBcnJheX0gYXhpc0xpc3RcbiAgICAgKi9cbiAgICAjZHJhd01haW5BeGlzRGVzY3JpcHRpb24oZGF0YSkge1xuICAgICAgICBjb25zdCBBWElTX0xFTkdUSCA9IDEwXG4gICAgICAgIGNvbnN0IGN1c3BzID0gZGF0YS5jdXNwc1xuXG4gICAgICAgIGNvbnN0IGF4aXNMaXN0ID0gW3tcbiAgICAgICAgICAgIG5hbWU6IFNWR1V0aWxzLlNZTUJPTF9BUyxcbiAgICAgICAgICAgIGFuZ2xlOiBjdXNwc1swXS5hbmdsZVxuICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hbWU6IFNWR1V0aWxzLlNZTUJPTF9JQyxcbiAgICAgICAgICAgICAgICBhbmdsZTogY3VzcHNbM10uYW5nbGVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogU1ZHVXRpbHMuU1lNQk9MX0RTLFxuICAgICAgICAgICAgICAgIGFuZ2xlOiBjdXNwc1s2XS5hbmdsZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiBTVkdVdGlscy5TWU1CT0xfTUMsXG4gICAgICAgICAgICAgICAgYW5nbGU6IGN1c3BzWzldLmFuZ2xlXG4gICAgICAgICAgICB9LFxuICAgICAgICBdXG5cbiAgICAgICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcbiAgICAgICAgd3JhcHBlci5jbGFzc0xpc3QuYWRkKCdjLXJhZGl4LWF4aXMnKVxuXG4gICAgICAgIGNvbnN0IHJhZDEgPSB0aGlzLiNudW1iZXJPZkxldmVscyA9PT0gMjQgPyB0aGlzLmdldFJhZGl1cygpIDogdGhpcy5nZXRJbm5lckNpcmNsZVJhZGl1cygpO1xuICAgICAgICBjb25zdCByYWQyID0gdGhpcy4jbnVtYmVyT2ZMZXZlbHMgPT09IDI0ID8gdGhpcy5nZXRSYWRpdXMoKSArIEFYSVNfTEVOR1RIIDogdGhpcy5nZXRJbm5lckNpcmNsZVJhZGl1cygpICsgQVhJU19MRU5HVEggLyAyO1xuXG4gICAgICAgIGZvciAoY29uc3QgYXhpcyBvZiBheGlzTGlzdCkge1xuICAgICAgICAgICAgY29uc3QgYXhpc0dyb3VwID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuICAgICAgICAgICAgYXhpc0dyb3VwLmNsYXNzTGlzdC5hZGQoJ2MtcmFkaXgtYXhpc19fYXhpcycpXG4gICAgICAgICAgICBheGlzR3JvdXAuY2xhc3NMaXN0LmFkZCgnYy1yYWRpeC1heGlzX19heGlzLS0nICsgYXhpcy5uYW1lLnRvTG93ZXJDYXNlKCkpXG5cbiAgICAgICAgICAgIGxldCBzdGFydFBvaW50ID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCByYWQxLCBVdGlscy5kZWdyZWVUb1JhZGlhbihheGlzLmFuZ2xlLCB0aGlzLmdldEFzY2VuZGFudFNoaWZ0KCkpKVxuICAgICAgICAgICAgbGV0IGVuZFBvaW50ID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCByYWQyLCBVdGlscy5kZWdyZWVUb1JhZGlhbihheGlzLmFuZ2xlLCB0aGlzLmdldEFzY2VuZGFudFNoaWZ0KCkpKVxuICAgICAgICAgICAgbGV0IGxpbmUgPSBTVkdVdGlscy5TVkdMaW5lKHN0YXJ0UG9pbnQueCwgc3RhcnRQb2ludC55LCBlbmRQb2ludC54LCBlbmRQb2ludC55KTtcbiAgICAgICAgICAgIGxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX01BSU5fQVhJU19DT0xPUik7XG4gICAgICAgICAgICBsaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9NQUlOX1NUUk9LRSk7XG4gICAgICAgICAgICBheGlzR3JvdXAuYXBwZW5kQ2hpbGQobGluZSk7XG5cbiAgICAgICAgICAgIGxldCB0ZXh0UG9pbnQgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHJhZDIsIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKGF4aXMuYW5nbGUsIHRoaXMuZ2V0QXNjZW5kYW50U2hpZnQoKSkpXG4gICAgICAgICAgICBsZXQgc3ltYm9sO1xuICAgICAgICAgICAgbGV0IFNISUZUX1ggPSAwO1xuICAgICAgICAgICAgbGV0IFNISUZUX1kgPSAwO1xuICAgICAgICAgICAgY29uc3QgU1RFUCA9IDJcblxuICAgICAgICAgICAgc3dpdGNoIChheGlzLm5hbWUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIFwiQXNcIjpcbiAgICAgICAgICAgICAgICAgICAgU0hJRlRfWCAtPSBTVEVQXG4gICAgICAgICAgICAgICAgICAgIFNISUZUX1kgLT0gU1RFUFxuICAgICAgICAgICAgICAgICAgICBTVkdVdGlscy5TWU1CT0xfQVNfQ09ERSA9IHRoaXMuI3NldHRpbmdzLlNZTUJPTF9BU19DT0RFID8/IFNWR1V0aWxzLlNZTUJPTF9BU19DT0RFO1xuICAgICAgICAgICAgICAgICAgICBzeW1ib2wgPSBTVkdVdGlscy5TVkdTeW1ib2woYXhpcy5uYW1lLCB0ZXh0UG9pbnQueCArIFNISUZUX1gsIHRleHRQb2ludC55ICsgU0hJRlRfWSlcbiAgICAgICAgICAgICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcInRleHQtYW5jaG9yXCIsIFwiZW5kXCIpXG4gICAgICAgICAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJkb21pbmFudC1iYXNlbGluZVwiLCBcIm1pZGRsZVwiKVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFwiRHNcIjpcbiAgICAgICAgICAgICAgICAgICAgU0hJRlRfWCArPSBTVEVQXG4gICAgICAgICAgICAgICAgICAgIFNISUZUX1kgLT0gU1RFUFxuICAgICAgICAgICAgICAgICAgICBTVkdVdGlscy5TWU1CT0xfRFNfQ09ERSA9IHRoaXMuI3NldHRpbmdzLlNZTUJPTF9EU19DT0RFID8/IFNWR1V0aWxzLlNZTUJPTF9EU19DT0RFO1xuICAgICAgICAgICAgICAgICAgICBzeW1ib2wgPSBTVkdVdGlscy5TVkdTeW1ib2woYXhpcy5uYW1lLCB0ZXh0UG9pbnQueCArIFNISUZUX1gsIHRleHRQb2ludC55ICsgU0hJRlRfWSlcbiAgICAgICAgICAgICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcInRleHQtYW5jaG9yXCIsIFwic3RhcnRcIilcbiAgICAgICAgICAgICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImRvbWluYW50LWJhc2VsaW5lXCIsIFwibWlkZGxlXCIpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJNY1wiOlxuICAgICAgICAgICAgICAgICAgICBTSElGVF9ZIC09IFNURVBcbiAgICAgICAgICAgICAgICAgICAgU1ZHVXRpbHMuU1lNQk9MX01DX0NPREUgPSB0aGlzLiNzZXR0aW5ncy5TWU1CT0xfTUNfQ09ERSA/PyBTVkdVdGlscy5TWU1CT0xfTUNfQ09ERTtcbiAgICAgICAgICAgICAgICAgICAgc3ltYm9sID0gU1ZHVXRpbHMuU1ZHU3ltYm9sKGF4aXMubmFtZSwgdGV4dFBvaW50LnggKyBTSElGVF9YLCB0ZXh0UG9pbnQueSArIFNISUZUX1kpXG4gICAgICAgICAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxuICAgICAgICAgICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJ0ZXh0LXRvcFwiKVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFwiSWNcIjpcbiAgICAgICAgICAgICAgICAgICAgU0hJRlRfWSArPSBTVEVQXG4gICAgICAgICAgICAgICAgICAgIFNWR1V0aWxzLlNZTUJPTF9JQ19DT0RFID0gdGhpcy4jc2V0dGluZ3MuU1lNQk9MX0lDX0NPREUgPz8gU1ZHVXRpbHMuU1lNQk9MX0lDX0NPREU7XG4gICAgICAgICAgICAgICAgICAgIHN5bWJvbCA9IFNWR1V0aWxzLlNWR1N5bWJvbChheGlzLm5hbWUsIHRleHRQb2ludC54ICsgU0hJRlRfWCwgdGV4dFBvaW50LnkgKyBTSElGVF9ZKVxuICAgICAgICAgICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcbiAgICAgICAgICAgICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImRvbWluYW50LWJhc2VsaW5lXCIsIFwiaGFuZ2luZ1wiKVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGF4aXMubmFtZSlcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5rbm93biBheGlzIG5hbWUuXCIpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZm9udC1mYW1pbHlcIiwgdGhpcy4jc2V0dGluZ3MuQVhJU19GT05UX0ZBTUlMWSA/PyB0aGlzLiNzZXR0aW5ncy5DSEFSVF9GT05UX0ZBTUlMWSk7XG4gICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZm9udC1zaXplXCIsIHRoaXMuI3NldHRpbmdzLlJBRElYX0FYSVNfRk9OVF9TSVpFKTtcbiAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJmb250LXdlaWdodFwiLCB0aGlzLiNzZXR0aW5ncy5BWElTX0ZPTlRfV0VJR0hUID8/IDQwMCk7XG4gICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9NQUlOX0FYSVNfQ09MT1IpO1xuICAgICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZSgncGFpbnQtb3JkZXInLCAnc3Ryb2tlJyk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLiNzZXR0aW5ncy5DTEFTU19BWElTKSB7XG4gICAgICAgICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCB0aGlzLiNzZXR0aW5ncy5DTEFTU19BWElTICsgJyAnICsgdGhpcy4jc2V0dGluZ3MuQ0xBU1NfQVhJUyArICctLScgKyBheGlzLm5hbWUudG9Mb3dlckNhc2UoKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGF4aXNHcm91cC5hcHBlbmRDaGlsZChzeW1ib2wpO1xuICAgICAgICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChheGlzR3JvdXApXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLiNyb290LmFwcGVuZENoaWxkKHdyYXBwZXIpXG4gICAgfVxuXG4gICAgI2RyYXdCb3JkZXJzKCkge1xuICAgICAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuICAgICAgICB3cmFwcGVyLmNsYXNzTGlzdC5hZGQoJ2MtcmFkaXgtYm9yZGVycycpXG5cbiAgICAgICAgY29uc3Qgb3V0ZXJDaXJjbGUgPSBTVkdVdGlscy5TVkdDaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy5nZXRPdXRlckNpcmNsZVJhZGl1cygpKVxuICAgICAgICBvdXRlckNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfQ0lSQ0xFX0NPTE9SKTtcbiAgICAgICAgb3V0ZXJDaXJjbGUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX01BSU5fU1RST0tFKTtcbiAgICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChvdXRlckNpcmNsZSlcblxuICAgICAgICBjb25zdCBpbm5lckNpcmNsZSA9IFNWR1V0aWxzLlNWR0NpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLmdldElubmVyQ2lyY2xlUmFkaXVzKCkpXG4gICAgICAgIGlubmVyQ2lyY2xlLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9DSVJDTEVfQ09MT1IpO1xuICAgICAgICBpbm5lckNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTUFJTl9TVFJPS0UpO1xuICAgICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGlubmVyQ2lyY2xlKVxuXG4gICAgICAgIGNvbnN0IGNlbnRlckNpcmNsZSA9IFNWR1V0aWxzLlNWR0NpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLmdldENlbnRlckNpcmNsZVJhZGl1cygpKVxuICAgICAgICBjZW50ZXJDaXJjbGUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0NJUkNMRV9DT0xPUik7XG4gICAgICAgIGNlbnRlckNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTUFJTl9TVFJPS0UpO1xuICAgICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGNlbnRlckNpcmNsZSlcblxuICAgICAgICB0aGlzLiNyb290LmFwcGVuZENoaWxkKHdyYXBwZXIpXG4gICAgfVxufVxuXG5leHBvcnQge1xuICAgIFJhZGl4Q2hhcnQgYXNcbiAgICAgICAgZGVmYXVsdFxufVxuIiwiaW1wb3J0IFJhZGl4Q2hhcnQgZnJvbSAnLi4vY2hhcnRzL1JhZGl4Q2hhcnQuanMnO1xuaW1wb3J0IFNWR1V0aWxzIGZyb20gJy4uL3V0aWxzL1NWR1V0aWxzLmpzJztcbmltcG9ydCBDaGFydCBmcm9tICcuL0NoYXJ0LmpzJ1xuaW1wb3J0IFV0aWxzIGZyb20gJy4uL3V0aWxzL1V0aWxzLmpzJztcbmltcG9ydCBBc3BlY3RVdGlscyBmcm9tICcuLi91dGlscy9Bc3BlY3RVdGlscy5qcyc7XG5pbXBvcnQgUG9pbnQgZnJvbSAnLi4vcG9pbnRzL1BvaW50LmpzJ1xuaW1wb3J0IERlZmF1bHRTZXR0aW5ncyBmcm9tICcuLi9zZXR0aW5ncy9EZWZhdWx0U2V0dGluZ3MuanMnO1xuXG4vKipcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyBQb2ludHMgYW5kIGN1cHMgYXJlIGRpc3BsYXllZCBmcm9tIG91dHNpZGUgdGhlIFVuaXZlcnNlLlxuICogQHB1YmxpY1xuICogQGV4dGVuZHMge0NoYXJ0fVxuICovXG5jbGFzcyBUcmFuc2l0Q2hhcnQgZXh0ZW5kcyBDaGFydCB7XG5cbiAgLypcbiAgICogTGV2ZWxzIGRldGVybWluZSB0aGUgd2lkdGggb2YgaW5kaXZpZHVhbCBwYXJ0cyBvZiB0aGUgY2hhcnQuXG4gICAqIEl0IGNhbiBiZSBjaGFuZ2VkIGR5bmFtaWNhbGx5IGJ5IHB1YmxpYyBzZXR0ZXIuXG4gICAqL1xuICAjbnVtYmVyT2ZMZXZlbHMgPSAzMlxuXG4gICNyYWRpeFxuICAjc2V0dGluZ3NcbiAgI3Jvb3RcbiAgI2RhdGFcblxuICAjY2VudGVyWFxuICAjY2VudGVyWVxuICAjcmFkaXVzXG5cbiAgLypcbiAgICogQHNlZSBVdGlscy5jbGVhblVwKClcbiAgICovXG4gICNiZWZvcmVDbGVhblVwSG9va1xuXG4gIC8qKlxuICAgKiBAY29uc3RydWN0c1xuICAgKiBAcGFyYW0ge1JhZGl4Q2hhcnR9IHJhZGl4XG4gICAqL1xuICBjb25zdHJ1Y3RvcihyYWRpeCkge1xuICAgIGlmICghKHJhZGl4IGluc3RhbmNlb2YgUmFkaXhDaGFydCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQmFkIHBhcmFtIHJhZGl4LicpXG4gICAgfVxuXG4gICAgc3VwZXIocmFkaXguZ2V0VW5pdmVyc2UoKS5nZXRTZXR0aW5ncygpKVxuXG4gICAgdGhpcy4jcmFkaXggPSByYWRpeFxuICAgIHRoaXMuI3NldHRpbmdzID0gdGhpcy4jcmFkaXguZ2V0VW5pdmVyc2UoKS5nZXRTZXR0aW5ncygpXG4gICAgdGhpcy4jY2VudGVyWCA9IHRoaXMuI3NldHRpbmdzLkNIQVJUX1ZJRVdCT1hfV0lEVEggLyAyXG4gICAgdGhpcy4jY2VudGVyWSA9IHRoaXMuI3NldHRpbmdzLkNIQVJUX1ZJRVdCT1hfSEVJR0hUIC8gMlxuICAgIHRoaXMuI3JhZGl1cyA9IE1hdGgubWluKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclkpIC0gdGhpcy4jc2V0dGluZ3MuQ0hBUlRfUEFERElOR1xuXG4gICAgdGhpcy4jcm9vdCA9IFNWR1V0aWxzLlNWR0dyb3VwKClcbiAgICB0aGlzLiNyb290LnNldEF0dHJpYnV0ZShcImlkXCIsIGAke3RoaXMuI3NldHRpbmdzLkhUTUxfRUxFTUVOVF9JRH0tJHt0aGlzLiNzZXR0aW5ncy5UUkFOU0lUX0lEfWApXG4gICAgdGhpcy4jcmFkaXguZ2V0VW5pdmVyc2UoKS5nZXRTVkdEb2N1bWVudCgpLmFwcGVuZENoaWxkKHRoaXMuI3Jvb3QpO1xuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgY2hhcnQgZGF0YVxuICAgKiBAdGhyb3dzIHtFcnJvcn0gLSBpZiB0aGUgZGF0YSBpcyBub3QgdmFsaWQuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gICAqIEByZXR1cm4ge1JhZGl4Q2hhcnR9XG4gICAqL1xuICBzZXREYXRhKGRhdGEpIHtcbiAgICBsZXQgc3RhdHVzID0gdGhpcy52YWxpZGF0ZURhdGEoZGF0YSlcbiAgICBpZiAoIXN0YXR1cy5pc1ZhbGlkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3Ioc3RhdHVzLm1lc3NhZ2UpXG4gICAgfVxuXG4gICAgdGhpcy4jZGF0YSA9IGRhdGFcbiAgICB0aGlzLiNkcmF3KGRhdGEpXG5cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBkYXRhXG4gICAqIEByZXR1cm4ge09iamVjdH1cbiAgICovXG4gIGdldERhdGEoKXtcbiAgICByZXR1cm4ge1xuICAgICAgXCJwb2ludHNcIjpbLi4udGhpcy4jZGF0YS5wb2ludHNdLFxuICAgICAgXCJjdXNwc1wiOlsuLi50aGlzLiNkYXRhLmN1c3BzXVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgcmFkaXVzXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0UmFkaXVzKCkge1xuICAgIHJldHVybiB0aGlzLiNyYWRpdXNcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYXNwZWN0c1xuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IFtmcm9tUG9pbnRzXSAtIFt7bmFtZTpcIk1vb25cIiwgYW5nbGU6MH0sIHtuYW1lOlwiU3VuXCIsIGFuZ2xlOjE3OX0sIHtuYW1lOlwiTWVyY3VyeVwiLCBhbmdsZToxMjF9XVxuICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IFt0b1BvaW50c10gLSBbe25hbWU6XCJBU1wiLCBhbmdsZTowfSwge25hbWU6XCJJQ1wiLCBhbmdsZTo5MH1dXG4gICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gW2FzcGVjdHNdIC0gW3tuYW1lOlwiT3Bwb3NpdGlvblwiLCBhbmdsZToxODAsIG9yYjoyfSwge25hbWU6XCJUcmluZVwiLCBhbmdsZToxMjAsIG9yYjoyfV1cbiAgICpcbiAgICogQHJldHVybiB7QXJyYXk8T2JqZWN0Pn1cbiAgICovXG4gIGdldEFzcGVjdHMoZnJvbVBvaW50cywgdG9Qb2ludHMsIGFzcGVjdHMpe1xuICAgIGlmKCF0aGlzLiNkYXRhKXtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGZyb21Qb2ludHMgPSBmcm9tUG9pbnRzID8/IFsuLi50aGlzLiNkYXRhLnBvaW50cy5maWx0ZXIoeCA9PiBcImFzcGVjdFwiIGluIHggPyB4LmFzcGVjdCA6IHRydWUpLCAuLi50aGlzLiNkYXRhLmN1c3BzLmZpbHRlcih4ID0+IHguYXNwZWN0KV1cbiAgICB0b1BvaW50cyA9IHRvUG9pbnRzID8/IFsuLi50aGlzLiNyYWRpeC5nZXREYXRhKCkucG9pbnRzLmZpbHRlcih4ID0+IFwiYXNwZWN0XCIgaW4geCA/IHguYXNwZWN0IDogdHJ1ZSksIC4uLnRoaXMuI3JhZGl4LmdldERhdGEoKS5jdXNwcy5maWx0ZXIoeCA9PiB4LmFzcGVjdCldXG4gICAgYXNwZWN0cyA9IGFzcGVjdHMgPz8gdGhpcy4jc2V0dGluZ3MuREVGQVVMVF9BU1BFQ1RTID8/IERlZmF1bHRTZXR0aW5ncy5ERUZBVUxUX0FTUEVDVFNcblxuICAgIHJldHVybiBBc3BlY3RVdGlscy5nZXRBc3BlY3RzKGZyb21Qb2ludHMsIHRvUG9pbnRzLCBhc3BlY3RzKVxuICB9XG5cbiAgLyoqXG4gICAqIERyYXcgYXNwZWN0c1xuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IFtmcm9tUG9pbnRzXSAtIFt7bmFtZTpcIk1vb25cIiwgYW5nbGU6MH0sIHtuYW1lOlwiU3VuXCIsIGFuZ2xlOjE3OX0sIHtuYW1lOlwiTWVyY3VyeVwiLCBhbmdsZToxMjF9XVxuICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IFt0b1BvaW50c10gLSBbe25hbWU6XCJBU1wiLCBhbmdsZTowfSwge25hbWU6XCJJQ1wiLCBhbmdsZTo5MH1dXG4gICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gW2FzcGVjdHNdIC0gW3tuYW1lOlwiT3Bwb3NpdGlvblwiLCBhbmdsZToxODAsIG9yYjoyfSwge25hbWU6XCJUcmluZVwiLCBhbmdsZToxMjAsIG9yYjoyfV1cbiAgICpcbiAgICogQHJldHVybiB7QXJyYXk8T2JqZWN0Pn1cbiAgICovXG4gIGRyYXdBc3BlY3RzKCBmcm9tUG9pbnRzLCB0b1BvaW50cywgYXNwZWN0cyApe1xuICAgIGNvbnN0IGFzcGVjdHNXcmFwcGVyID0gdGhpcy4jcmFkaXguZ2V0VW5pdmVyc2UoKS5nZXRBc3BlY3RzRWxlbWVudCgpXG4gICAgVXRpbHMuY2xlYW5VcChhc3BlY3RzV3JhcHBlci5nZXRBdHRyaWJ1dGUoXCJpZFwiKSwgdGhpcy4jYmVmb3JlQ2xlYW5VcEhvb2spXG5cbiAgICBjb25zdCBhc3BlY3RzTGlzdCA9IHRoaXMuZ2V0QXNwZWN0cyhmcm9tUG9pbnRzLCB0b1BvaW50cywgYXNwZWN0cylcbiAgICAgIC5maWx0ZXIoIGFzcGVjdCA9PiAgYXNwZWN0LmFzcGVjdC5uYW1lICE9ICdDb25qdW5jdGlvbicpXG5cbiAgICBjb25zdCBjaXJjbGUgPSBTVkdVdGlscy5TVkdDaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy4jcmFkaXguZ2V0Q2VudGVyQ2lyY2xlUmFkaXVzKCkpXG4gICAgY2lyY2xlLnNldEF0dHJpYnV0ZSgnZmlsbCcsIHRoaXMuI3NldHRpbmdzLkFTUEVDVFNfQkFDS0dST1VORF9DT0xPUilcbiAgICBhc3BlY3RzV3JhcHBlci5hcHBlbmRDaGlsZChjaXJjbGUpXG4gICAgXG4gICAgYXNwZWN0c1dyYXBwZXIuYXBwZW5kQ2hpbGQoIEFzcGVjdFV0aWxzLmRyYXdBc3BlY3RzKHRoaXMuI3JhZGl4LmdldENlbnRlckNpcmNsZVJhZGl1cygpLCB0aGlzLiNyYWRpeC5nZXRBc2NlbmRhbnRTaGlmdCgpLCB0aGlzLiNzZXR0aW5ncywgYXNwZWN0c0xpc3QpKVxuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIC8vICMjIFBSSVZBVEUgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiAgLypcbiAgICogRHJhdyByYWRpeCBjaGFydFxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICAgKi9cbiAgI2RyYXcoZGF0YSkge1xuXG4gICAgLy8gcmFkaXggcmVEcmF3XG4gICAgVXRpbHMuY2xlYW5VcCh0aGlzLiNyb290LmdldEF0dHJpYnV0ZSgnaWQnKSwgdGhpcy4jYmVmb3JlQ2xlYW5VcEhvb2spXG4gICAgdGhpcy4jcmFkaXguc2V0TnVtYmVyT2ZMZXZlbHModGhpcy4jbnVtYmVyT2ZMZXZlbHMpXG5cbiAgICB0aGlzLiNkcmF3UnVsZXIoKVxuICAgIHRoaXMuI2RyYXdDdXNwcyhkYXRhKVxuICAgIHRoaXMuI3NldHRpbmdzLkNIQVJUX0RSQVdfTUFJTl9BWElTICYmIHRoaXMuI2RyYXdNYWluQXhpc0Rlc2NyaXB0aW9uKGRhdGEpXG4gICAgdGhpcy4jZHJhd1BvaW50cyhkYXRhKVxuICAgIHRoaXMuI2RyYXdCb3JkZXJzKClcbiAgICB0aGlzLiNzZXR0aW5ncy5EUkFXX0FTUEVDVFMgJiYgdGhpcy5kcmF3QXNwZWN0cygpXG4gIH1cblxuICAjZHJhd1J1bGVyKCkge1xuICAgIGNvbnN0IE5VTUJFUl9PRl9ESVZJREVSUyA9IDcyXG4gICAgY29uc3QgU1RFUCA9IDVcblxuICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG5cbiAgICBsZXQgc3RhcnRBbmdsZSA9IHRoaXMuI3JhZGl4LmdldEFzY2VuZGFudFNoaWZ0KClcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IE5VTUJFUl9PRl9ESVZJREVSUzsgaSsrKSB7XG4gICAgICBsZXQgc3RhcnRQb2ludCA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy4jZ2V0UnVsbGVyQ2lyY2xlUmFkaXVzKCksIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKHN0YXJ0QW5nbGUpKVxuICAgICAgbGV0IGVuZFBvaW50ID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCAoaSAlIDIpID8gdGhpcy5nZXRSYWRpdXMoKSAtICgodGhpcy5nZXRSYWRpdXMoKSAtIHRoaXMuI2dldFJ1bGxlckNpcmNsZVJhZGl1cygpKSAvIDIpIDogdGhpcy5nZXRSYWRpdXMoKSwgVXRpbHMuZGVncmVlVG9SYWRpYW4oc3RhcnRBbmdsZSkpXG4gICAgICBjb25zdCBsaW5lID0gU1ZHVXRpbHMuU1ZHTGluZShzdGFydFBvaW50LngsIHN0YXJ0UG9pbnQueSwgZW5kUG9pbnQueCwgZW5kUG9pbnQueSk7XG4gICAgICBsaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9MSU5FX0NPTE9SKTtcbiAgICAgIGxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRSk7XG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGxpbmUpO1xuXG4gICAgICBzdGFydEFuZ2xlICs9IFNURVBcbiAgICB9XG5cbiAgICBjb25zdCBjaXJjbGUgPSBTVkdVdGlscy5TVkdDaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy4jZ2V0UnVsbGVyQ2lyY2xlUmFkaXVzKCkpO1xuICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfQ0lSQ0xFX0NPTE9SKTtcbiAgICBjaXJjbGUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRSk7XG4gICAgd3JhcHBlci5hcHBlbmRDaGlsZChjaXJjbGUpO1xuXG4gICAgdGhpcy4jcm9vdC5hcHBlbmRDaGlsZCh3cmFwcGVyKVxuICB9XG5cbiAgLypcbiAgICogRHJhdyBwb2ludHNcbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGEgLSBjaGFydCBkYXRhXG4gICAqL1xuICAjZHJhd1BvaW50cyhkYXRhKSB7XG4gICAgY29uc3QgcG9pbnRzID0gZGF0YS5wb2ludHNcbiAgICBjb25zdCBjdXNwcyA9IGRhdGEuY3VzcHNcblxuICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG5cbiAgICBjb25zdCBwb3NpdGlvbnMgPSBVdGlscy5jYWxjdWxhdGVQb3NpdGlvbldpdGhvdXRPdmVybGFwcGluZyhwb2ludHMsIHRoaXMuI3NldHRpbmdzLlBPSU5UX0NPTExJU0lPTl9SQURJVVMsIHRoaXMuI2dldFBvaW50Q2lyY2xlUmFkaXVzKCkpXG4gICAgZm9yIChjb25zdCBwb2ludERhdGEgb2YgcG9pbnRzKSB7XG4gICAgICBjb25zdCBwb2ludCA9IG5ldyBQb2ludChwb2ludERhdGEsIGN1c3BzLCB0aGlzLiNzZXR0aW5ncylcbiAgICAgIGNvbnN0IHBvaW50UG9zaXRpb24gPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclgsIHRoaXMuI2dldFJ1bGxlckNpcmNsZVJhZGl1cygpIC0gKCh0aGlzLmdldFJhZGl1cygpIC0gdGhpcy4jZ2V0UnVsbGVyQ2lyY2xlUmFkaXVzKCkpIC8gNCksIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKHBvaW50LmdldEFuZ2xlKCksIHRoaXMuI3JhZGl4LmdldEFzY2VuZGFudFNoaWZ0KCkpKVxuICAgICAgY29uc3Qgc3ltYm9sUG9zaXRpb24gPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclgsIHRoaXMuI2dldFBvaW50Q2lyY2xlUmFkaXVzKCksIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKHBvc2l0aW9uc1twb2ludC5nZXROYW1lKCldLCB0aGlzLiNyYWRpeC5nZXRBc2NlbmRhbnRTaGlmdCgpKSlcblxuICAgICAgLy8gcnVsZXIgbWFya1xuICAgICAgY29uc3QgcnVsZXJMaW5lRW5kUG9zaXRpb24gPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclgsIHRoaXMuI2dldFJ1bGxlckNpcmNsZVJhZGl1cygpLCBVdGlscy5kZWdyZWVUb1JhZGlhbihwb2ludC5nZXRBbmdsZSgpLCB0aGlzLiNyYWRpeC5nZXRBc2NlbmRhbnRTaGlmdCgpKSlcbiAgICAgIGNvbnN0IHJ1bGVyTGluZSA9IFNWR1V0aWxzLlNWR0xpbmUocG9pbnRQb3NpdGlvbi54LCBwb2ludFBvc2l0aW9uLnksIHJ1bGVyTGluZUVuZFBvc2l0aW9uLngsIHJ1bGVyTGluZUVuZFBvc2l0aW9uLnkpXG4gICAgICBydWxlckxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0xJTkVfQ09MT1IpO1xuICAgICAgcnVsZXJMaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0UpO1xuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChydWxlckxpbmUpO1xuXG4gICAgICAvLyBzeW1ib2xcbiAgICAgIGNvbnN0IHN5bWJvbCA9IHBvaW50LmdldFN5bWJvbChzeW1ib2xQb3NpdGlvbi54LCBzeW1ib2xQb3NpdGlvbi55LCBVdGlscy5ERUdfMCwgdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19TSE9XKVxuICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImZvbnQtZmFtaWx5XCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0ZPTlRfRkFNSUxZKTtcbiAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKSAvLyBzdGFydCwgbWlkZGxlLCBlbmRcbiAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJkb21pbmFudC1iYXNlbGluZVwiLCBcIm1pZGRsZVwiKVxuICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImZvbnQtc2l6ZVwiLCB0aGlzLiNzZXR0aW5ncy5UUkFOU0lUX1BPSU5UU19GT05UX1NJWkUpXG4gICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCB0aGlzLiNzZXR0aW5ncy5UUkFOU0lUX1BMQU5FVF9DT0xPUlNbcG9pbnREYXRhLm5hbWVdID8/IHRoaXMuI3NldHRpbmdzLlBMQU5FVF9DT0xPUlNbcG9pbnREYXRhLm5hbWVdID8/IHRoaXMuI3NldHRpbmdzLkNIQVJUX1BPSU5UU19DT0xPUilcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoc3ltYm9sKTtcblxuICAgICAgLy8gcG9pbnRlclxuICAgICAgLy9pZiAocG9zaXRpb25zW3BvaW50LmdldE5hbWUoKV0gIT0gcG9pbnREYXRhLnBvc2l0aW9uKSB7XG4gICAgICBjb25zdCBwb2ludGVyTGluZUVuZFBvc2l0aW9uID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJYLCB0aGlzLiNnZXRQb2ludENpcmNsZVJhZGl1cygpLCBVdGlscy5kZWdyZWVUb1JhZGlhbihwb3NpdGlvbnNbcG9pbnQuZ2V0TmFtZSgpXSwgdGhpcy4jcmFkaXguZ2V0QXNjZW5kYW50U2hpZnQoKSkpXG4gICAgICBjb25zdCBwb2ludGVyTGluZSA9IFNWR1V0aWxzLlNWR0xpbmUocG9pbnRQb3NpdGlvbi54LCBwb2ludFBvc2l0aW9uLnksIChwb2ludFBvc2l0aW9uLnggKyBwb2ludGVyTGluZUVuZFBvc2l0aW9uLngpIC8gMiwgKHBvaW50UG9zaXRpb24ueSArIHBvaW50ZXJMaW5lRW5kUG9zaXRpb24ueSkgLyAyKVxuICAgICAgcG9pbnRlckxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0xJTkVfQ09MT1IpO1xuICAgICAgcG9pbnRlckxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRSAvIDIpO1xuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChwb2ludGVyTGluZSk7XG4gICAgfVxuXG4gICAgdGhpcy4jcm9vdC5hcHBlbmRDaGlsZCh3cmFwcGVyKVxuICB9XG5cbiAgLypcbiAgICogRHJhdyBwb2ludHNcbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGEgLSBjaGFydCBkYXRhXG4gICAqL1xuICAjZHJhd0N1c3BzKGRhdGEpIHtcbiAgICBjb25zdCBwb2ludHMgPSBkYXRhLnBvaW50c1xuICAgIGNvbnN0IGN1c3BzID0gZGF0YS5jdXNwc1xuXG4gICAgY29uc3QgcG9pbnRzUG9zaXRpb25zID0gcG9pbnRzLm1hcChwb2ludCA9PiB7XG4gICAgICByZXR1cm4gcG9pbnQuYW5nbGVcbiAgICB9KVxuXG4gICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcblxuICAgIGNvbnN0IHRleHRSYWRpdXMgPSB0aGlzLiNnZXRDZW50ZXJDaXJjbGVSYWRpdXMoKSArICgodGhpcy4jZ2V0UnVsbGVyQ2lyY2xlUmFkaXVzKCkgLSB0aGlzLiNnZXRDZW50ZXJDaXJjbGVSYWRpdXMoKSkgLyA2KVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdXNwcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgaXNMaW5lSW5Db2xsaXNpb25XaXRoUG9pbnQgPSAhdGhpcy4jc2V0dGluZ3MuQ0hBUlRfQUxMT1dfSE9VU0VfT1ZFUkxBUCAmJiBVdGlscy5pc0NvbGxpc2lvbihjdXNwc1tpXS5hbmdsZSwgcG9pbnRzUG9zaXRpb25zLCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9DT0xMSVNJT05fUkFESVVTIC8gMilcblxuICAgICAgY29uc3Qgc3RhcnRQb3MgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuI2dldENlbnRlckNpcmNsZVJhZGl1cygpLCBVdGlscy5kZWdyZWVUb1JhZGlhbihjdXNwc1tpXS5hbmdsZSwgdGhpcy4jcmFkaXguZ2V0QXNjZW5kYW50U2hpZnQoKSkpXG4gICAgICBjb25zdCBlbmRQb3MgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIGlzTGluZUluQ29sbGlzaW9uV2l0aFBvaW50ID8gdGhpcy4jZ2V0Q2VudGVyQ2lyY2xlUmFkaXVzKCkgKyAoKHRoaXMuI2dldFJ1bGxlckNpcmNsZVJhZGl1cygpIC0gdGhpcy4jZ2V0Q2VudGVyQ2lyY2xlUmFkaXVzKCkpIC8gNikgOiB0aGlzLiNnZXRSdWxsZXJDaXJjbGVSYWRpdXMoKSwgVXRpbHMuZGVncmVlVG9SYWRpYW4oY3VzcHNbaV0uYW5nbGUsIHRoaXMuI3JhZGl4LmdldEFzY2VuZGFudFNoaWZ0KCkpKVxuXG4gICAgICBjb25zdCBsaW5lID0gU1ZHVXRpbHMuU1ZHTGluZShzdGFydFBvcy54LCBzdGFydFBvcy55LCBlbmRQb3MueCwgZW5kUG9zLnkpXG4gICAgICBsaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9MSU5FX0NPTE9SKVxuICAgICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFKVxuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChsaW5lKTtcblxuICAgICAgY29uc3Qgc3RhcnRDdXNwID0gY3VzcHNbaV0uYW5nbGVcbiAgICAgIGNvbnN0IGVuZEN1c3AgPSBjdXNwc1soaSArIDEpICUgMTJdLmFuZ2xlXG4gICAgICBjb25zdCBnYXAgPSBlbmRDdXNwIC0gc3RhcnRDdXNwID4gMCA/IGVuZEN1c3AgLSBzdGFydEN1c3AgOiBlbmRDdXNwIC0gc3RhcnRDdXNwICsgVXRpbHMuREVHXzM2MFxuICAgICAgY29uc3QgdGV4dEFuZ2xlID0gc3RhcnRDdXNwICsgZ2FwIC8gMlxuXG4gICAgICBjb25zdCB0ZXh0UG9zID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0ZXh0UmFkaXVzLCBVdGlscy5kZWdyZWVUb1JhZGlhbih0ZXh0QW5nbGUsIHRoaXMuI3JhZGl4LmdldEFzY2VuZGFudFNoaWZ0KCkpKVxuICAgICAgY29uc3QgdGV4dCA9IFNWR1V0aWxzLlNWR1RleHQodGV4dFBvcy54LCB0ZXh0UG9zLnksIGAke2krMX1gKVxuICAgICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJmb250LWZhbWlseVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9GT05UX0ZBTUlMWSlcbiAgICAgIHRleHQuc2V0QXR0cmlidXRlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIikgLy8gc3RhcnQsIG1pZGRsZSwgZW5kXG4gICAgICB0ZXh0LnNldEF0dHJpYnV0ZShcImRvbWluYW50LWJhc2VsaW5lXCIsIFwibWlkZGxlXCIpXG4gICAgICB0ZXh0LnNldEF0dHJpYnV0ZShcImZvbnQtc2l6ZVwiLCB0aGlzLiNzZXR0aW5ncy5SQURJWF9IT1VTRV9GT05UX1NJWkUpXG4gICAgICB0ZXh0LnNldEF0dHJpYnV0ZShcImZpbGxcIiwgdGhpcy4jc2V0dGluZ3MuVFJBTlNJVF9IT1VTRV9OVU1CRVJfQ09MT1IgfHwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfSE9VU0VfTlVNQkVSX0NPTE9SKVxuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZCh0ZXh0KVxuXG4gICAgICBpZih0aGlzLiNzZXR0aW5ncy5EUkFXX0hPVVNFX0RFR1JFRSkge1xuICAgICAgICBpZihBcnJheS5pc0FycmF5KHRoaXMuI3NldHRpbmdzLkhPVVNFX0RFR1JFRV9GSUxURVIpICYmICF0aGlzLiNzZXR0aW5ncy5IT1VTRV9ERUdSRUVfRklMVEVSLmluY2x1ZGVzKGkrMSkpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBkZWdyZWVQb3MgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuI2dldFJ1bGxlckNpcmNsZVJhZGl1cygpIC0gKHRoaXMuZ2V0UmFkaXVzKCkgLSB0aGlzLiNnZXRSdWxsZXJDaXJjbGVSYWRpdXMoKSksIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKHN0YXJ0Q3VzcCAtIDEuNzUsIHRoaXMuI3JhZGl4LmdldEFzY2VuZGFudFNoaWZ0KCkpKVxuICAgICAgICBjb25zdCBkZWdyZWUgPSBTVkdVdGlscy5TVkdUZXh0KGRlZ3JlZVBvcy54LCBkZWdyZWVQb3MueSwgTWF0aC5mbG9vcihjdXNwc1tpXS5hbmdsZSAlIDMwKSArIFwiwrpcIilcbiAgICAgICAgZGVncmVlLnNldEF0dHJpYnV0ZShcImZvbnQtZmFtaWx5XCIsIFwiQXJpYWxcIilcbiAgICAgICAgZGVncmVlLnNldEF0dHJpYnV0ZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpIC8vIHN0YXJ0LCBtaWRkbGUsIGVuZFxuICAgICAgICBkZWdyZWUuc2V0QXR0cmlidXRlKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcbiAgICAgICAgZGVncmVlLnNldEF0dHJpYnV0ZShcImZvbnQtc2l6ZVwiLCB0aGlzLiNzZXR0aW5ncy5IT1VTRV9ERUdSRUVfU0laRSB8fCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX0FOR0xFX1NJWkUgLyAyKVxuICAgICAgICBkZWdyZWUuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCB0aGlzLiNzZXR0aW5ncy5IT1VTRV9ERUdSRUVfQ09MT1IgfHwgdGhpcy4jc2V0dGluZ3MuVFJBTlNJVF9IT1VTRV9OVU1CRVJfQ09MT1IgfHwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfSE9VU0VfTlVNQkVSX0NPTE9SKVxuICAgICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGRlZ3JlZSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLiNyb290LmFwcGVuZENoaWxkKHdyYXBwZXIpXG4gIH1cblxuICAvKlxuICAgKiBEcmF3IG1haW4gYXhpcyBkZXNjcml0aW9uXG4gICAqIEBwYXJhbSB7QXJyYXl9IGF4aXNMaXN0XG4gICAqL1xuICAjZHJhd01haW5BeGlzRGVzY3JpcHRpb24oZGF0YSkge1xuICAgIGNvbnN0IEFYSVNfTEVOR1RIID0gMTBcbiAgICBjb25zdCBjdXNwcyA9IGRhdGEuY3VzcHNcblxuICAgIGNvbnN0IGF4aXNMaXN0ID0gW3tcbiAgICAgICAgbmFtZTogU1ZHVXRpbHMuU1lNQk9MX0FTLFxuICAgICAgICBhbmdsZTogY3VzcHNbMF0uYW5nbGVcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFNWR1V0aWxzLlNZTUJPTF9JQyxcbiAgICAgICAgYW5nbGU6IGN1c3BzWzNdLmFuZ2xlXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiBTVkdVdGlscy5TWU1CT0xfRFMsXG4gICAgICAgIGFuZ2xlOiBjdXNwc1s2XS5hbmdsZVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogU1ZHVXRpbHMuU1lNQk9MX01DLFxuICAgICAgICBhbmdsZTogY3VzcHNbOV0uYW5nbGVcbiAgICAgIH0sXG4gICAgXVxuXG4gICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcblxuICAgIGNvbnN0IHJhZDEgPSB0aGlzLmdldFJhZGl1cygpO1xuICAgIGNvbnN0IHJhZDIgPSB0aGlzLmdldFJhZGl1cygpICsgQVhJU19MRU5HVEg7XG5cbiAgICBmb3IgKGNvbnN0IGF4aXMgb2YgYXhpc0xpc3QpIHtcbiAgICAgIGxldCBzdGFydFBvaW50ID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCByYWQxLCBVdGlscy5kZWdyZWVUb1JhZGlhbihheGlzLmFuZ2xlLCB0aGlzLiNyYWRpeC5nZXRBc2NlbmRhbnRTaGlmdCgpKSlcbiAgICAgIGxldCBlbmRQb2ludCA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgcmFkMiwgVXRpbHMuZGVncmVlVG9SYWRpYW4oYXhpcy5hbmdsZSwgdGhpcy4jcmFkaXguZ2V0QXNjZW5kYW50U2hpZnQoKSkpXG4gICAgICBsZXQgbGluZSA9IFNWR1V0aWxzLlNWR0xpbmUoc3RhcnRQb2ludC54LCBzdGFydFBvaW50LnksIGVuZFBvaW50LngsIGVuZFBvaW50LnkpO1xuICAgICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTUFJTl9BWElTX0NPTE9SKTtcbiAgICAgIGxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX01BSU5fU1RST0tFKTtcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQobGluZSk7XG5cbiAgICAgIGxldCB0ZXh0UG9pbnQgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHJhZDIgKyBBWElTX0xFTkdUSCArIDIsIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKGF4aXMuYW5nbGUsIHRoaXMuI3JhZGl4LmdldEFzY2VuZGFudFNoaWZ0KCkpKVxuICAgICAgbGV0IHN5bWJvbDtcbiAgICAgIHN3aXRjaCAoYXhpcy5uYW1lKSB7XG4gICAgICAgIGNhc2UgXCJBc1wiOlxuICAgICAgICAgIHN5bWJvbCA9IFNWR1V0aWxzLlNWR1N5bWJvbChheGlzLm5hbWUsIHRleHRQb2ludC54LCB0ZXh0UG9pbnQueSlcbiAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcbiAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIkRzXCI6XG4gICAgICAgICAgc3ltYm9sID0gU1ZHVXRpbHMuU1ZHU3ltYm9sKGF4aXMubmFtZSwgdGV4dFBvaW50LngsIHRleHRQb2ludC55KVxuICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxuICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJkb21pbmFudC1iYXNlbGluZVwiLCBcIm1pZGRsZVwiKVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiTWNcIjpcbiAgICAgICAgICBzeW1ib2wgPSBTVkdVdGlscy5TVkdTeW1ib2woYXhpcy5uYW1lLCB0ZXh0UG9pbnQueCwgdGV4dFBvaW50LnkpXG4gICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXG4gICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImRvbWluYW50LWJhc2VsaW5lXCIsIFwibWlkZGxlXCIpXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJJY1wiOlxuICAgICAgICAgIHN5bWJvbCA9IFNWR1V0aWxzLlNWR1N5bWJvbChheGlzLm5hbWUsIHRleHRQb2ludC54LCB0ZXh0UG9pbnQueSlcbiAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcbiAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGF4aXMubmFtZSlcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIGF4aXMgbmFtZS5cIilcbiAgICAgIH1cbiAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJmb250LWZhbWlseVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9GT05UX0ZBTUlMWSk7XG4gICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZm9udC1zaXplXCIsIHRoaXMuI3NldHRpbmdzLlJBRElYX0FYSVNfRk9OVF9TSVpFKTtcbiAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX01BSU5fQVhJU19DT0xPUik7XG5cbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoc3ltYm9sKTtcbiAgICB9XG5cbiAgICB0aGlzLiNyb290LmFwcGVuZENoaWxkKHdyYXBwZXIpXG4gIH1cblxuICAjZHJhd0JvcmRlcnMoKSB7XG4gICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcblxuICAgIGNvbnN0IG91dGVyQ2lyY2xlID0gU1ZHVXRpbHMuU1ZHQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuZ2V0UmFkaXVzKCkpXG4gICAgb3V0ZXJDaXJjbGUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0NJUkNMRV9DT0xPUik7XG4gICAgb3V0ZXJDaXJjbGUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX01BSU5fU1RST0tFKTtcbiAgICB3cmFwcGVyLmFwcGVuZENoaWxkKG91dGVyQ2lyY2xlKVxuXG4gICAgdGhpcy4jcm9vdC5hcHBlbmRDaGlsZCh3cmFwcGVyKVxuICB9XG5cbiAgI2dldFBvaW50Q2lyY2xlUmFkaXVzKCkge1xuICAgIHJldHVybiAyOSAqICh0aGlzLmdldFJhZGl1cygpIC8gdGhpcy4jbnVtYmVyT2ZMZXZlbHMpXG4gIH1cblxuICAjZ2V0UnVsbGVyQ2lyY2xlUmFkaXVzKCkge1xuICAgIHJldHVybiAzMSAqICh0aGlzLmdldFJhZGl1cygpIC8gdGhpcy4jbnVtYmVyT2ZMZXZlbHMpXG4gIH1cblxuICAjZ2V0Q2VudGVyQ2lyY2xlUmFkaXVzKCkge1xuICAgIHJldHVybiAyNCAqICh0aGlzLmdldFJhZGl1cygpIC8gdGhpcy4jbnVtYmVyT2ZMZXZlbHMpXG4gIH1cblxufVxuXG5leHBvcnQge1xuICBUcmFuc2l0Q2hhcnQgYXNcbiAgZGVmYXVsdFxufVxuIiwiaW1wb3J0IFNWR1V0aWxzIGZyb20gJy4uL3V0aWxzL1NWR1V0aWxzLmpzJztcbmltcG9ydCBVdGlscyBmcm9tICcuLi91dGlscy9VdGlscy5qcyc7XG5cbi8qKlxuICogQGNsYXNzXG4gKiBAY2xhc3NkZXNjIFJlcHJlc2VudHMgYSBwbGFuZXQgb3IgcG9pbnQgb2YgaW50ZXJlc3QgaW4gdGhlIGNoYXJ0XG4gKiBAcHVibGljXG4gKi9cbmNsYXNzIFBvaW50IHtcblxuICAgICNuYW1lXG4gICAgI2FuZ2xlXG4gICAgI3NpZ25cbiAgICAjaXNSZXRyb2dyYWRlXG4gICAgI2N1c3BzXG4gICAgI3NldHRpbmdzXG5cbiAgICAvKipcbiAgICAgKiBAY29uc3RydWN0c1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwb2ludERhdGEgLSB7bmFtZTpTdHJpbmcsIGFuZ2xlOk51bWJlciwgaXNSZXRyb2dyYWRlOmZhbHNlfVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjdXNwcyAtIFt7YW5nbGU6TnVtYmVyfSwge2FuZ2xlOk51bWJlcn0sIHthbmdsZTpOdW1iZXJ9LCAuLi5dXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHNldHRpbmdzXG4gICAgICovXG4gICAgY29uc3RydWN0b3IocG9pbnREYXRhLCBjdXNwcywgc2V0dGluZ3MpIHtcbiAgICAgICAgdGhpcy4jbmFtZSA9IHBvaW50RGF0YS5uYW1lID8/IFwiVW5rbm93blwiXG4gICAgICAgIHRoaXMuI2FuZ2xlID0gcG9pbnREYXRhLmFuZ2xlID8/IDBcbiAgICAgICAgdGhpcy4jc2lnbiA9IHBvaW50RGF0YS5zaWduID8/IG51bGxcbiAgICAgICAgdGhpcy4jaXNSZXRyb2dyYWRlID0gcG9pbnREYXRhLmlzUmV0cm9ncmFkZSA/PyBmYWxzZVxuXG4gICAgICAgIGlmICghIEFycmF5LmlzQXJyYXkoY3VzcHMpIHx8IGN1c3BzLmxlbmd0aCAhPT0gMTIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkJhZCBwYXJhbSBjdXNwcy4gXCIpXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLiNjdXNwcyA9IGN1c3BzXG5cbiAgICAgICAgaWYgKCEgc2V0dGluZ3MpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQmFkIHBhcmFtIHNldHRpbmdzLicpXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLiNzZXR0aW5ncyA9IHNldHRpbmdzXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IG5hbWVcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgKi9cbiAgICBnZXROYW1lKCkge1xuICAgICAgICByZXR1cm4gdGhpcy4jbmFtZVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIElzIHJldHJvZ3JhZGVcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgaXNSZXRyb2dyYWRlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy4jaXNSZXRyb2dyYWRlXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IGFuZ2xlXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAgICovXG4gICAgZ2V0QW5nbGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiNhbmdsZVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBzaWduXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICovXG4gICAgZ2V0U2lnbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI3NpZ25cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgc3ltYm9sXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge051bWJlcn0geFBvc1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB5UG9zXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IFthbmdsZVNoaWZ0XVxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2lzUHJvcGVydGllc10gLSBhbmdsZUluU2lnbiwgZGlnbml0aWVzLCByZXRyb2dyYWRlXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtTVkdFbGVtZW50fVxuICAgICAqL1xuICAgIGdldFN5bWJvbCh4UG9zLCB5UG9zLCBhbmdsZVNoaWZ0ID0gMCwgaXNQcm9wZXJ0aWVzID0gdHJ1ZSkge1xuICAgICAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuXG4gICAgICAgIGNvbnN0IHN5bWJvbCA9IFNWR1V0aWxzLlNWR1N5bWJvbCh0aGlzLiNuYW1lLCB4UG9zLCB5UG9zKVxuXG4gICAgICAgIGlmICh0aGlzLiNzZXR0aW5ncy5DTEFTU19DRUxFU1RJQUwpIHtcbiAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgdGhpcy4jc2V0dGluZ3MuQ0xBU1NfQ0VMRVNUSUFMICsgJyAnICsgdGhpcy4jc2V0dGluZ3MuQ0xBU1NfQ0VMRVNUSUFMICsgJy0tJyArIHRoaXMuI25hbWUudG9Mb3dlckNhc2UoKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy4jc2V0dGluZ3MuUE9JTlRfU1RST0tFID8/IGZhbHNlKSB7XG4gICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKCdwYWludC1vcmRlcicsICdzdHJva2UnKTtcbiAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoJ3N0cm9rZScsIHRoaXMuI3NldHRpbmdzLlBPSU5UX1NUUk9LRV9DT0xPUik7XG4gICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKCdzdHJva2Utd2lkdGgnLCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9TVFJPS0VfV0lEVEgpO1xuICAgICAgICB9XG5cbiAgICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChzeW1ib2wpXG5cbiAgICAgICAgaWYgKGlzUHJvcGVydGllcyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHJldHVybiB3cmFwcGVyIC8vPT09PT09PlxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY2hhcnRDZW50ZXJYID0gdGhpcy4jc2V0dGluZ3MuQ0hBUlRfVklFV0JPWF9XSURUSCAvIDJcbiAgICAgICAgY29uc3QgY2hhcnRDZW50ZXJZID0gdGhpcy4jc2V0dGluZ3MuQ0hBUlRfVklFV0JPWF9IRUlHSFQgLyAyXG4gICAgICAgIGNvbnN0IGFuZ2xlRnJvbVN5bWJvbFRvQ2VudGVyID0gVXRpbHMucG9zaXRpb25Ub0FuZ2xlKHhQb3MsIHlQb3MsIGNoYXJ0Q2VudGVyWCwgY2hhcnRDZW50ZXJZKVxuXG4gICAgICAgIGlmICh0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX1NIT1dfQU5HTEUpIHtcbiAgICAgICAgICAgIGFuZ2xlSW5TaWduLmNhbGwodGhpcylcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX1NIT1dfU0lHTiAmJiB0aGlzLiNzaWduICE9PSBudWxsKSB7XG4gICAgICAgICAgICBzaG93U2lnbi5jYWxsKHRoaXMpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19TSE9XX1JFVFJPR1JBREUgJiYgdGhpcy4jaXNSZXRyb2dyYWRlKSB7XG4gICAgICAgICAgICByZXRyb2dyYWRlLmNhbGwodGhpcylcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX1NIT1dfRElHTklUWSAmJiB0aGlzLmdldERpZ25pdHkoKSkge1xuICAgICAgICAgICAgZGlnbml0aWVzLmNhbGwodGhpcylcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB3cmFwcGVyIC8vPT09PT09PlxuXG4gICAgICAgIC8qXG4gICAgICAgICAqICBBbmdsZSBpbiBzaWduXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBhbmdsZUluU2lnbigpIHtcbiAgICAgICAgICAgIGNvbnN0IGFuZ2xlSW5TaWduUG9zaXRpb24gPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHhQb3MsIHlQb3MsIHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfQU5HTEVfT0ZGU0VUICogdGhpcy4jc2V0dGluZ3MuUE9JTlRfQ09MTElTSU9OX1JBRElVUywgVXRpbHMuZGVncmVlVG9SYWRpYW4oLWFuZ2xlRnJvbVN5bWJvbFRvQ2VudGVyLCBhbmdsZVNoaWZ0KSlcblxuICAgICAgICAgICAgLy8gSXQgaXMgcG9zc2libGUgdG8gcm90YXRlIHRoZSB0ZXh0LCB3aGVuIHVuY29tbWVudCBhIGxpbmUgYmVsbG93LlxuICAgICAgICAgICAgLy90ZXh0V3JhcHBlci5zZXRBdHRyaWJ1dGUoXCJ0cmFuc2Zvcm1cIiwgYHJvdGF0ZSgke2FuZ2xlRnJvbVN5bWJvbFRvQ2VudGVyfSwke3RleHRQb3NpdGlvbi54fSwke3RleHRQb3NpdGlvbi55fSlgKVxuXG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICogQWxsb3dzIGNoYW5nZSB0aGUgYW5nbGUgc3RyaW5nLCBlLmcuIGFkZCB0aGUgZGVncmVlIHN5bWJvbCDCsCB3aXRoIHRoZSBeIGNoYXJhY3RlciBmcm9tIEFzdHJvbm9taWNvblxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBsZXQgYW5nbGUgPSB0aGlzLmdldEFuZ2xlSW5TaWduKCk7XG4gICAgICAgICAgICBsZXQgYW5nbGVQb3NpdGlvbiA9IFV0aWxzLmZpbGxUZW1wbGF0ZSh0aGlzLiNzZXR0aW5ncy5BTkdMRV9URU1QTEFURSwge2FuZ2xlOiBhbmdsZX0pO1xuXG4gICAgICAgICAgICBjb25zdCBhbmdsZUluU2lnblRleHQgPSBTVkdVdGlscy5TVkdUZXh0KGFuZ2xlSW5TaWduUG9zaXRpb24ueCwgYW5nbGVJblNpZ25Qb3NpdGlvbi55LCBhbmdsZVBvc2l0aW9uKVxuICAgICAgICAgICAgYW5nbGVJblNpZ25UZXh0LnNldEF0dHJpYnV0ZShcImZvbnQtZmFtaWx5XCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0ZPTlRfRkFNSUxZKTtcbiAgICAgICAgICAgIGFuZ2xlSW5TaWduVGV4dC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKSAvLyBzdGFydCwgbWlkZGxlLCBlbmRcbiAgICAgICAgICAgIGFuZ2xlSW5TaWduVGV4dC5zZXRBdHRyaWJ1dGUoXCJkb21pbmFudC1iYXNlbGluZVwiLCBcIm1pZGRsZVwiKVxuICAgICAgICAgICAgYW5nbGVJblNpZ25UZXh0LnNldEF0dHJpYnV0ZShcImZvbnQtc2l6ZVwiLCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX0FOR0xFX1NJWkUgfHwgdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19GT05UX1NJWkUpO1xuICAgICAgICAgICAgYW5nbGVJblNpZ25UZXh0LnNldEF0dHJpYnV0ZShcImZpbGxcIiwgdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19BTkdMRV9DT0xPUiB8fCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX0NPTE9SKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuI3NldHRpbmdzLkNMQVNTX1BPSU5UX0FOR0xFKSB7XG4gICAgICAgICAgICAgICAgYW5nbGVJblNpZ25UZXh0LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCB0aGlzLiNzZXR0aW5ncy5DTEFTU19QT0lOVF9BTkdMRSArICcgJyArIHRoaXMuI3NldHRpbmdzLkNMQVNTX1BPSU5UX0FOR0xFICsgJy0tJyArIGFuZ2xlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuI3NldHRpbmdzLlBPSU5UX1NUUk9LRSA/PyBmYWxzZSkge1xuICAgICAgICAgICAgICAgIGFuZ2xlSW5TaWduVGV4dC5zZXRBdHRyaWJ1dGUoJ3BhaW50LW9yZGVyJywgJ3N0cm9rZScpO1xuICAgICAgICAgICAgICAgIGFuZ2xlSW5TaWduVGV4dC5zZXRBdHRyaWJ1dGUoJ3N0cm9rZScsIHRoaXMuI3NldHRpbmdzLlBPSU5UX1NUUk9LRV9DT0xPUik7XG4gICAgICAgICAgICAgICAgYW5nbGVJblNpZ25UZXh0LnNldEF0dHJpYnV0ZSgnc3Ryb2tlLXdpZHRoJywgdGhpcy4jc2V0dGluZ3MuUE9JTlRfU1RST0tFX1dJRFRIKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChhbmdsZUluU2lnblRleHQpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAqICBTaG93IHNpZ25cbiAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gc2hvd1NpZ24oKSB7XG4gICAgICAgICAgICBjb25zdCBzaWduUG9zaXRpb24gPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHhQb3MsIHlQb3MsIHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfU0lHTl9PRkZTRVQgKiB0aGlzLiNzZXR0aW5ncy5QT0lOVF9DT0xMSVNJT05fUkFESVVTLCBVdGlscy5kZWdyZWVUb1JhZGlhbigtYW5nbGVGcm9tU3ltYm9sVG9DZW50ZXIsIGFuZ2xlU2hpZnQpKVxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEdldCB0aGUgc2lnbiBpbmRleFxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBsZXQgc3ltYm9sSW5kZXggPSB0aGlzLiNzZXR0aW5ncy5TSUdOX0xBQkVMUy5pbmRleE9mKHRoaXMuI3NpZ24pXG5cbiAgICAgICAgICAgIGNvbnN0IHNpZ25UZXh0ID0gU1ZHVXRpbHMuU1ZHU3ltYm9sKHRoaXMuI3NpZ24sIHNpZ25Qb3NpdGlvbi54LCBzaWduUG9zaXRpb24ueSlcbiAgICAgICAgICAgIHNpZ25UZXh0LnNldEF0dHJpYnV0ZShcImZvbnQtZmFtaWx5XCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0ZPTlRfRkFNSUxZKTtcbiAgICAgICAgICAgIHNpZ25UZXh0LnNldEF0dHJpYnV0ZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpIC8vIHN0YXJ0LCBtaWRkbGUsIGVuZFxuICAgICAgICAgICAgc2lnblRleHQuc2V0QXR0cmlidXRlKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcbiAgICAgICAgICAgIHNpZ25UZXh0LnNldEF0dHJpYnV0ZShcImZvbnQtc2l6ZVwiLCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX1NJR05fU0laRSB8fCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX0ZPTlRfU0laRSk7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogT3ZlcnJpZGUgc2lnbiBjb2xvcnNcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfU0lHTl9DT0xPUiAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHNpZ25UZXh0LnNldEF0dHJpYnV0ZShcImZpbGxcIiwgdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19TSUdOX0NPTE9SKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2lnblRleHQuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCB0aGlzLiNzZXR0aW5ncy5TSUdOX0NPTE9SU1tzeW1ib2xJbmRleF0gfHwgdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19DT0xPUik7XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgaWYgKHRoaXMuI3NldHRpbmdzLkNMQVNTX1BPSU5UX1NJR04pIHtcbiAgICAgICAgICAgICAgICBzaWduVGV4dC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgdGhpcy4jc2V0dGluZ3MuQ0xBU1NfUE9JTlRfU0lHTiArICcgJyArIHRoaXMuI3NldHRpbmdzLkNMQVNTX1BPSU5UX1NJR04gKyAnLS0nICsgdGhpcy4jc2lnbi50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLiNzZXR0aW5ncy5QT0lOVF9TVFJPS0UgPz8gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBzaWduVGV4dC5zZXRBdHRyaWJ1dGUoJ3BhaW50LW9yZGVyJywgJ3N0cm9rZScpO1xuICAgICAgICAgICAgICAgIHNpZ25UZXh0LnNldEF0dHJpYnV0ZSgnc3Ryb2tlJywgdGhpcy4jc2V0dGluZ3MuUE9JTlRfU1RST0tFX0NPTE9SKTtcbiAgICAgICAgICAgICAgICBzaWduVGV4dC5zZXRBdHRyaWJ1dGUoJ3N0cm9rZS13aWR0aCcsIHRoaXMuI3NldHRpbmdzLlBPSU5UX1NUUk9LRV9XSURUSCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoc2lnblRleHQpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiAgUmV0cm9ncmFkZVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gcmV0cm9ncmFkZSgpIHtcbiAgICAgICAgICAgIGNvbnN0IHJldHJvZ3JhZGVQb3NpdGlvbiA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUoeFBvcywgeVBvcywgdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19SRVRST0dSQURFX09GRlNFVCAqIHRoaXMuI3NldHRpbmdzLlBPSU5UX0NPTExJU0lPTl9SQURJVVMsIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKC1hbmdsZUZyb21TeW1ib2xUb0NlbnRlciwgYW5nbGVTaGlmdCkpXG5cbiAgICAgICAgICAgIGNvbnN0IHJldHJvZ3JhZGVUZXh0ID0gU1ZHVXRpbHMuU1ZHVGV4dChyZXRyb2dyYWRlUG9zaXRpb24ueCwgcmV0cm9ncmFkZVBvc2l0aW9uLnksIFNWR1V0aWxzLlNZTUJPTF9SRVRST0dSQURFX0NPREUpXG4gICAgICAgICAgICByZXRyb2dyYWRlVGV4dC5zZXRBdHRyaWJ1dGUoXCJmb250LWZhbWlseVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9GT05UX0ZBTUlMWSk7XG4gICAgICAgICAgICByZXRyb2dyYWRlVGV4dC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKSAvLyBzdGFydCwgbWlkZGxlLCBlbmRcbiAgICAgICAgICAgIHJldHJvZ3JhZGVUZXh0LnNldEF0dHJpYnV0ZShcImRvbWluYW50LWJhc2VsaW5lXCIsIFwibWlkZGxlXCIpXG4gICAgICAgICAgICByZXRyb2dyYWRlVGV4dC5zZXRBdHRyaWJ1dGUoXCJmb250LXNpemVcIiwgdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19SRVRST0dSQURFX1NJWkUgfHwgdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19GT05UX1NJWkUpO1xuICAgICAgICAgICAgcmV0cm9ncmFkZVRleHQuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX1JFVFJPR1JBREVfQ09MT1IgfHwgdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19DT0xPUik7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLiNzZXR0aW5ncy5DTEFTU19QT0lOVF9SRVRST0dSQURFKSB7XG4gICAgICAgICAgICAgICAgcmV0cm9ncmFkZVRleHQuc2V0QXR0cmlidXRlKCdjbGFzcycsIHRoaXMuI3NldHRpbmdzLkNMQVNTX1BPSU5UX1JFVFJPR1JBREUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy4jc2V0dGluZ3MuUE9JTlRfU1RST0tFID8/IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgcmV0cm9ncmFkZVRleHQuc2V0QXR0cmlidXRlKCdwYWludC1vcmRlcicsICdzdHJva2UnKTtcbiAgICAgICAgICAgICAgICByZXRyb2dyYWRlVGV4dC5zZXRBdHRyaWJ1dGUoJ3N0cm9rZScsIHRoaXMuI3NldHRpbmdzLlBPSU5UX1NUUk9LRV9DT0xPUik7XG4gICAgICAgICAgICAgICAgcmV0cm9ncmFkZVRleHQuc2V0QXR0cmlidXRlKCdzdHJva2Utd2lkdGgnLCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9TVFJPS0VfV0lEVEgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHJldHJvZ3JhZGVUZXh0KVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogIERpZ25pdGllc1xuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gZGlnbml0aWVzKCkge1xuICAgICAgICAgICAgY29uc3QgZGlnbml0aWVzUG9zaXRpb24gPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHhQb3MsIHlQb3MsIHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfRElHTklUWV9PRkZTRVQgKiB0aGlzLiNzZXR0aW5ncy5QT0lOVF9DT0xMSVNJT05fUkFESVVTLCBVdGlscy5kZWdyZWVUb1JhZGlhbigtYW5nbGVGcm9tU3ltYm9sVG9DZW50ZXIsIGFuZ2xlU2hpZnQpKVxuICAgICAgICAgICAgY29uc3QgZGlnbml0aWVzVGV4dCA9IFNWR1V0aWxzLlNWR1RleHQoZGlnbml0aWVzUG9zaXRpb24ueCwgZGlnbml0aWVzUG9zaXRpb24ueSwgdGhpcy5nZXREaWduaXR5KCkpXG4gICAgICAgICAgICBkaWduaXRpZXNUZXh0LnNldEF0dHJpYnV0ZShcImZvbnQtZmFtaWx5XCIsIFwic2Fucy1zZXJpZlwiKTtcbiAgICAgICAgICAgIGRpZ25pdGllc1RleHQuc2V0QXR0cmlidXRlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIikgLy8gc3RhcnQsIG1pZGRsZSwgZW5kXG4gICAgICAgICAgICBkaWduaXRpZXNUZXh0LnNldEF0dHJpYnV0ZShcImRvbWluYW50LWJhc2VsaW5lXCIsIFwibWlkZGxlXCIpXG4gICAgICAgICAgICBkaWduaXRpZXNUZXh0LnNldEF0dHJpYnV0ZShcImZvbnQtc2l6ZVwiLCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX0RJR05JVFlfU0laRSB8fCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX0ZPTlRfU0laRSk7XG4gICAgICAgICAgICBkaWduaXRpZXNUZXh0LnNldEF0dHJpYnV0ZShcImZpbGxcIiwgdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19ESUdOSVRZX0NPTE9SIHx8IHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfQ09MT1IpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy4jc2V0dGluZ3MuQ0xBU1NfUE9JTlRfRElHTklUWSkge1xuICAgICAgICAgICAgICAgIGRpZ25pdGllc1RleHQuc2V0QXR0cmlidXRlKCdjbGFzcycsIHRoaXMuI3NldHRpbmdzLkNMQVNTX1BPSU5UX0RJR05JVFkgKyAnICcgKyB0aGlzLiNzZXR0aW5ncy5DTEFTU19QT0lOVF9ESUdOSVRZICsgJy0tJyArIGRpZ25pdGllc1RleHQpOyAvLyBTdHJhaWdodGZvcndhcmQgci9kL2UvZlxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy4jc2V0dGluZ3MuUE9JTlRfU1RST0tFID8/IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgZGlnbml0aWVzVGV4dC5zZXRBdHRyaWJ1dGUoJ3BhaW50LW9yZGVyJywgJ3N0cm9rZScpO1xuICAgICAgICAgICAgICAgIGRpZ25pdGllc1RleHQuc2V0QXR0cmlidXRlKCdzdHJva2UnLCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9TVFJPS0VfQ09MT1IpO1xuICAgICAgICAgICAgICAgIGRpZ25pdGllc1RleHQuc2V0QXR0cmlidXRlKCdzdHJva2Utd2lkdGgnLCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9TVFJPS0VfV0lEVEgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGRpZ25pdGllc1RleHQpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgaG91c2UgbnVtYmVyXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAgICovXG4gICAgZ2V0SG91c2VOdW1iZXIoKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZCB5ZXQuXCIpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHNpZ24gbnVtYmVyXG4gICAgICogQXJpc2UgPSAxLCBUYXVydXMgPSAyLCAuLi5QaXNjZXMgPSAxMlxuICAgICAqXG4gICAgICogQHJldHVybiB7TnVtYmVyfVxuICAgICAqL1xuICAgIGdldFNpZ25OdW1iZXIoKSB7XG4gICAgICAgIGxldCBhbmdsZSA9IHRoaXMuI2FuZ2xlICUgVXRpbHMuREVHXzM2MFxuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcigoYW5nbGUgLyAzMCkgKyAxKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBhbmdsZSAoSW50ZWdlcikgaW4gdGhlIHNpZ24gaW4gd2hpY2ggaXQgc3RhbmRzLlxuICAgICAqXG4gICAgICogQHJldHVybiB7TnVtYmVyfVxuICAgICAqL1xuICAgIGdldEFuZ2xlSW5TaWduKCkge1xuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcih0aGlzLiNhbmdsZSAlIDMwKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBkaWduaXR5IHN5bWJvbCAociAtIHJ1bGVyc2hpcCwgZCAtIGRldHJpbWVudCwgZiAtIGZhbGwsIGUgLSBleGFsdGF0aW9uKVxuICAgICAqXG4gICAgICogVXNlIE1vZGVybiBkaWduaXRpZXMgaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvRXNzZW50aWFsX2RpZ25pdHlcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1N0cmluZ30gLSBkaWduaXR5IHN5bWJvbCAocixkLGYsZSlcbiAgICAgKi9cbiAgICBnZXREaWduaXR5KCkge1xuICAgICAgICBjb25zdCBBUklFUyA9IDFcbiAgICAgICAgY29uc3QgVEFVUlVTID0gMlxuICAgICAgICBjb25zdCBHRU1JTkkgPSAzXG4gICAgICAgIGNvbnN0IENBTkNFUiA9IDRcbiAgICAgICAgY29uc3QgTEVPID0gNVxuICAgICAgICBjb25zdCBWSVJHTyA9IDZcbiAgICAgICAgY29uc3QgTElCUkEgPSA3XG4gICAgICAgIGNvbnN0IFNDT1JQSU8gPSA4XG4gICAgICAgIGNvbnN0IFNBR0lUVEFSSVVTID0gOVxuICAgICAgICBjb25zdCBDQVBSSUNPUk4gPSAxMFxuICAgICAgICBjb25zdCBBUVVBUklVUyA9IDExXG4gICAgICAgIGNvbnN0IFBJU0NFUyA9IDEyXG5cbiAgICAgICAgY29uc3QgUlVMRVJTSElQX1NZTUJPTCA9IHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfRElHTklUWV9TWU1CT0xTWzBdO1xuICAgICAgICBjb25zdCBERVRSSU1FTlRfU1lNQk9MID0gdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19ESUdOSVRZX1NZTUJPTFNbMV07XG4gICAgICAgIGNvbnN0IEVYQUxUQVRJT05fU1lNQk9MID0gdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19ESUdOSVRZX1NZTUJPTFNbMl07XG4gICAgICAgIGNvbnN0IEZBTExfU1lNQk9MID0gdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19ESUdOSVRZX1NZTUJPTFNbM107XG5cbiAgICAgICAgc3dpdGNoICh0aGlzLiNuYW1lKSB7XG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9TVU46XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBMRU8pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFJVTEVSU0hJUF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBBUVVBUklVUykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gREVUUklNRU5UX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IFZJUkdPKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBGQUxMX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IEFSSUVTKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBFWEFMVEFUSU9OX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gXCJcIlxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9NT09OOlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PT0gQ0FOQ0VSKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBSVUxFUlNISVBfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PT0gQ0FQUklDT1JOKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBERVRSSU1FTlRfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PT0gU0NPUlBJTykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gRkFMTF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBUQVVSVVMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEVYQUxUQVRJT05fU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gXCJcIlxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9NRVJDVVJZOlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PT0gR0VNSU5JKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBSVUxFUlNISVBfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PT0gU0FHSVRUQVJJVVMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIERFVFJJTUVOVF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBQSVNDRVMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEZBTExfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PT0gVklSR08pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEVYQUxUQVRJT05fU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gXCJcIlxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9WRU5VUzpcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IFRBVVJVUyB8fCB0aGlzLmdldFNpZ25OdW1iZXIoKSA9PT0gTElCUkEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFJVTEVSU0hJUF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBBUklFUyB8fCB0aGlzLmdldFNpZ25OdW1iZXIoKSA9PT0gU0NPUlBJTykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gREVUUklNRU5UX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IFZJUkdPKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBGQUxMX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IFBJU0NFUykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gRVhBTFRBVElPTl9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBcIlwiXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX01BUlM6XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBBUklFUyB8fCB0aGlzLmdldFNpZ25OdW1iZXIoKSA9PT0gU0NPUlBJTykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUlVMRVJTSElQX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IFRBVVJVUyB8fCB0aGlzLmdldFNpZ25OdW1iZXIoKSA9PT0gTElCUkEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIERFVFJJTUVOVF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBDQU5DRVIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEZBTExfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PT0gQ0FQUklDT1JOKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBFWEFMVEFUSU9OX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiXCJcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfSlVQSVRFUjpcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IFNBR0lUVEFSSVVTIHx8IHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBQSVNDRVMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFJVTEVSU0hJUF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBHRU1JTkkgfHwgdGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IFZJUkdPKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBERVRSSU1FTlRfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PT0gQ0FQUklDT1JOKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBGQUxMX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IENBTkNFUikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gRVhBTFRBVElPTl9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBcIlwiXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1NBVFVSTjpcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IENBUFJJQ09STiB8fCB0aGlzLmdldFNpZ25OdW1iZXIoKSA9PT0gQVFVQVJJVVMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFJVTEVSU0hJUF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBDQU5DRVIgfHwgdGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IExFTykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gREVUUklNRU5UX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IEFSSUVTKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBGQUxMX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IExJQlJBKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBFWEFMVEFUSU9OX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiXCJcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfVVJBTlVTOlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PT0gQVFVQVJJVVMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFJVTEVSU0hJUF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBMRU8pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIERFVFJJTUVOVF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBUQVVSVVMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEZBTExfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PT0gU0NPUlBJTykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gRVhBTFRBVElPTl9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBcIlwiXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX05FUFRVTkU6XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBQSVNDRVMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFJVTEVSU0hJUF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09PSBWSVJHTykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gREVUUklNRU5UX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IEdFTUlOSSB8fCB0aGlzLmdldFNpZ25OdW1iZXIoKSA9PT0gQVFVQVJJVVMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEZBTExfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PT0gU0FHSVRUQVJJVVMgfHwgdGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IExFTykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gRVhBTFRBVElPTl9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBcIlwiXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1BMVVRPOlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PT0gU0NPUlBJTykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUlVMRVJTSElQX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IFRBVVJVUykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gREVUUklNRU5UX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IExJQlJBKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBGQUxMX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT09IEFSSUVTKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBFWEFMVEFUSU9OX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiXCJcblxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJcIlxuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQge1xuICAgIFBvaW50IGFzIGRlZmF1bHRcbn1cbiIsImltcG9ydCAqIGFzIFVuaXZlcnNlIGZyb20gXCIuL2NvbnN0YW50cy9Vbml2ZXJzZS5qc1wiXG5pbXBvcnQgKiBhcyBSYWRpeCBmcm9tIFwiLi9jb25zdGFudHMvUmFkaXguanNcIlxuaW1wb3J0ICogYXMgVHJhbnNpdCBmcm9tIFwiLi9jb25zdGFudHMvVHJhbnNpdC5qc1wiXG5pbXBvcnQgKiBhcyBQb2ludCBmcm9tIFwiLi9jb25zdGFudHMvUG9pbnQuanNcIlxuaW1wb3J0ICogYXMgQ29sb3JzIGZyb20gXCIuL2NvbnN0YW50cy9Db2xvcnMuanNcIlxuaW1wb3J0ICogYXMgQXNwZWN0cyBmcm9tIFwiLi9jb25zdGFudHMvQXNwZWN0cy5qc1wiXG5cbmNvbnN0IFNFVFRJTkdTID0gT2JqZWN0LmFzc2lnbih7fSwgVW5pdmVyc2UsIFJhZGl4LCBUcmFuc2l0LCBQb2ludCwgQ29sb3JzLCBBc3BlY3RzKTtcblxuZXhwb3J0IHtcbiAgU0VUVElOR1MgYXNcbiAgZGVmYXVsdFxufVxuIiwiLypcbiogQXNwZWN0cyB3cmFwcGVyIGVsZW1lbnQgSURcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0IGFzcGVjdHNcbiovXG5leHBvcnQgY29uc3QgQVNQRUNUU19JRCA9IFwiYXNwZWN0c1wiXG5cbi8qXG4qIERyYXcgYXNwZWN0cyBpbnRvIGNoYXJ0IGR1cmluZyByZW5kZXJcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtCb29sZWFufVxuKiBAZGVmYXVsdCB0cnVlXG4qL1xuZXhwb3J0IGNvbnN0IERSQVdfQVNQRUNUUyA9IHRydWVcblxuLypcbiogRm9udCBzaXplIC0gYXNwZWN0c1xuKiBAY29uc3RhbnRcbiogQHR5cGUge051bWJlcn1cbiogQGRlZmF1bHQgMjdcbiovXG5leHBvcnQgY29uc3QgQVNQRUNUU19GT05UX1NJWkUgPSAxOFxuXG4vKipcbiAqIERlZmF1bHQgYXNwZWN0c1xuICpcbiAqIEZyb20gaHR0cHM6Ly93d3cucmVkZGl0LmNvbS9yL2FzdHJvbG9neS9jb21tZW50cy94YmR5ODMvd2hhdHNfYV9nb29kX29yYl9yYW5nZV9mb3JfYXNwZWN0c19jb25qdW5jdGlvbi9cbiAqIE1hbnkgb3RoZXIgc2V0dGluZ3MsIHVzdWFsbHkgZGVwZW5kcyBvbiB0aGUgcGxhbmV0LCBTdW4gLyBNb29uIHVzZSB3aWRlciByYW5nZVxuICpcbiAqIG9yYiA6IHNldHMgdGhlIHRvbGVyYW5jZSBmb3IgdGhlIGFuZ2xlXG4gKlxuICogTWFqb3IgYXNwZWN0czpcbiAqXG4gKiAgICAge25hbWU6XCJDb25qdW5jdGlvblwiLCBhbmdsZTowLCBvcmI6NCwgaXNNYWpvcjogdHJ1ZX0sXG4gKiAgICAge25hbWU6XCJPcHBvc2l0aW9uXCIsIGFuZ2xlOjE4MCwgb3JiOjQsIGlzTWFqb3I6IHRydWV9LFxuICogICAgIHtuYW1lOlwiVHJpbmVcIiwgYW5nbGU6MTIwLCBvcmI6MiwgaXNNYWpvcjogdHJ1ZX0sXG4gKiAgICAge25hbWU6XCJTcXVhcmVcIiwgYW5nbGU6OTAsIG9yYjoyLCBpc01ham9yOiB0cnVlfSxcbiAqICAgICB7bmFtZTpcIlNleHRpbGVcIiwgYW5nbGU6NjAsIG9yYjoyLCBpc01ham9yOiB0cnVlfSxcbiAqXG4gKiBNaW5vciBhc3BlY3RzOlxuICpcbiAqICAgICB7bmFtZTpcIlF1aW5jdW54XCIsIGFuZ2xlOjE1MCwgb3JiOjF9LFxuICogICAgIHtuYW1lOlwiU2VtaXNleHRpbGVcIiwgYW5nbGU6MzAsIG9yYjoxfSxcbiAqICAgICB7bmFtZTpcIlF1aW50aWxlXCIsIGFuZ2xlOjcyLCBvcmI6MX0sXG4gKiAgICAge25hbWU6XCJUcmlvY3RpbGVcIiwgYW5nbGU6MTM1LCBvcmI6MX0sXG4gKiAgICAge25hbWU6XCJTZW1pc3F1YXJlXCIsIGFuZ2xlOjQ1LCBvcmI6MX0sXG4gKlxuICogQGNvbnN0YW50XG4gKiBAdHlwZSB7QXJyYXl9XG4gKi9cbmV4cG9ydCBjb25zdCBERUZBVUxUX0FTUEVDVFMgPSBbXG4gICAge25hbWU6XCJDb25qdW5jdGlvblwiLCBhbmdsZTowLCBvcmI6NCwgaXNNYWpvcjogdHJ1ZX0sXG4gICAge25hbWU6XCJPcHBvc2l0aW9uXCIsIGFuZ2xlOjE4MCwgb3JiOjQsIGlzTWFqb3I6IHRydWV9LFxuICAgIHtuYW1lOlwiVHJpbmVcIiwgYW5nbGU6MTIwLCBvcmI6MiwgaXNNYWpvcjogdHJ1ZX0sXG4gICAge25hbWU6XCJTcXVhcmVcIiwgYW5nbGU6OTAsIG9yYjoyLCBpc01ham9yOiB0cnVlfSxcbiAgICB7bmFtZTpcIlNleHRpbGVcIiwgYW5nbGU6NjAsIG9yYjoyLCBpc01ham9yOiB0cnVlfSxcblxuXVxuIiwiLyoqXG4gKiBDaGFydCBiYWNrZ3JvdW5kIGNvbG9yXG4gKiBAY29uc3RhbnRcbiAqIEB0eXBlIHtTdHJpbmd9XG4gKiBAZGVmYXVsdCAjZmZmXG4gKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9CQUNLR1JPVU5EX0NPTE9SID0gXCJub25lXCI7XG5cbi8qKlxuICogUGxhbmV0cyBiYWNrZ3JvdW5kIGNvbG9yXG4gKiBAY29uc3RhbnRcbiAqIEB0eXBlIHtTdHJpbmd9XG4gKiBAZGVmYXVsdCAjZmZmXG4gKi9cbmV4cG9ydCBjb25zdCBQTEFORVRTX0JBQ0tHUk9VTkRfQ09MT1IgPSBcIiNmZmZcIjtcblxuLyoqXG4gKiBBc3BlY3RzIGJhY2tncm91bmQgY29sb3JcbiAqIEBjb25zdGFudFxuICogQHR5cGUge1N0cmluZ31cbiAqIEBkZWZhdWx0ICNmZmZcbiAqL1xuZXhwb3J0IGNvbnN0IEFTUEVDVFNfQkFDS0dST1VORF9DT0xPUiA9IFwiI2VlZVwiO1xuXG4vKlxuKiBEZWZhdWx0IGNvbG9yIG9mIGNpcmNsZXMgaW4gY2hhcnRzXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjMzMzXG4qL1xuZXhwb3J0IGNvbnN0IENIQVJUX0NJUkNMRV9DT0xPUiA9IFwiIzMzM1wiO1xuXG4vKlxuKiBEZWZhdWx0IGNvbG9yIG9mIGxpbmVzIGluIGNoYXJ0c1xuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzMzM1xuKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9MSU5FX0NPTE9SID0gXCIjNjY2XCI7XG5cbi8qXG4qIERlZmF1bHQgY29sb3Igb2YgdGV4dCBpbiBjaGFydHNcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICMzMzNcbiovXG5leHBvcnQgY29uc3QgQ0hBUlRfVEVYVF9DT0xPUiA9IFwiI2JiYlwiO1xuXG4vKlxuKiBEZWZhdWx0IGNvbG9yIG9mIGN1c3BzIG51bWJlclxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzMzM1xuKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9IT1VTRV9OVU1CRVJfQ09MT1IgPSBcIiMzMzNcIjtcblxuLypcbiogRGVmYXVsdCBjb2xvciBvZiBtcWluIGF4aXMgLSBBcywgRHMsIE1jLCBJY1xuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzAwMFxuKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9NQUlOX0FYSVNfQ09MT1IgPSBcIiMwMDBcIjtcblxuLypcbiogRGVmYXVsdCBjb2xvciBvZiBzaWducyBpbiBjaGFydHMgKGFyaXNlIHN5bWJvbCwgdGF1cnVzIHN5bWJvbCwgLi4uKVxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzAwMFxuKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9TSUdOU19DT0xPUiA9IFwiIzMzM1wiO1xuXG4vKlxuKiBEZWZhdWx0IGNvbG9yIG9mIHBsYW5ldHMgb24gdGhlIGNoYXJ0IChTdW4gc3ltYm9sLCBNb29uIHN5bWJvbCwgLi4uKVxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzAwMFxuKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9QT0lOVFNfQ09MT1IgPSBcIiMwMDBcIjtcblxuLypcbiogRGVmYXVsdCBjb2xvciBmb3IgcG9pbnQgcHJvcGVydGllcyAtIGFuZ2xlIGluIHNpZ24sIGRpZ25pdGllcywgcmV0cm9ncmFkZVxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzMzM1xuKi9cbmV4cG9ydCBjb25zdCBQT0lOVF9QUk9QRVJUSUVTX0NPTE9SID0gXCIjMzMzXCJcblxuLypcbiogQXJpZXMgY29sb3JcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICNGRjQ1MDBcbiovXG5leHBvcnQgY29uc3QgQ09MT1JfQVJJRVMgPSBcIiNGRjQ1MDBcIjtcblxuLypcbiogVGF1cnVzIGNvbG9yXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjOEI0NTEzXG4qL1xuZXhwb3J0IGNvbnN0IENPTE9SX1RBVVJVUyA9IFwiIzhCNDUxM1wiO1xuXG4vKlxuKiBHZW1pbnkgY29sb3JcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICM4N0NFRUJcbiovXG5leHBvcnQgY29uc3QgQ09MT1JfR0VNSU5JID0gXCIjODdDRUVCXCI7XG5cbi8qXG4qIENhbmNlciBjb2xvclxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzI3QUU2MFxuKi9cbmV4cG9ydCBjb25zdCBDT0xPUl9DQU5DRVIgPSBcIiMyN0FFNjBcIjtcblxuLypcbiogTGVvIGNvbG9yXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjRkY0NTAwXG4qL1xuZXhwb3J0IGNvbnN0IENPTE9SX0xFTyA9IFwiI0ZGNDUwMFwiO1xuXG4vKlxuKiBWaXJnbyBjb2xvclxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzhCNDUxM1xuKi9cbmV4cG9ydCBjb25zdCBDT0xPUl9WSVJHTyA9IFwiIzhCNDUxM1wiO1xuXG4vKlxuKiBMaWJyYSBjb2xvclxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzg3Q0VFQlxuKi9cbmV4cG9ydCBjb25zdCBDT0xPUl9MSUJSQSA9IFwiIzg3Q0VFQlwiO1xuXG4vKlxuKiBTY29ycGlvIGNvbG9yXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjMjdBRTYwXG4qL1xuZXhwb3J0IGNvbnN0IENPTE9SX1NDT1JQSU8gPSBcIiMyN0FFNjBcIjtcblxuLypcbiogU2FnaXR0YXJpdXMgY29sb3JcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICNGRjQ1MDBcbiovXG5leHBvcnQgY29uc3QgQ09MT1JfU0FHSVRUQVJJVVMgPSBcIiNGRjQ1MDBcIjtcblxuLypcbiogQ2Fwcmljb3JuIGNvbG9yXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjOEI0NTEzXG4qL1xuZXhwb3J0IGNvbnN0IENPTE9SX0NBUFJJQ09STiA9IFwiIzhCNDUxM1wiO1xuXG4vKlxuKiBBcXVhcml1cyBjb2xvclxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzg3Q0VFQlxuKi9cbmV4cG9ydCBjb25zdCBDT0xPUl9BUVVBUklVUyA9IFwiIzg3Q0VFQlwiO1xuXG4vKlxuKiBQaXNjZXMgY29sb3JcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICMyN0FFNjBcbiovXG5leHBvcnQgY29uc3QgQ09MT1JfUElTQ0VTID0gXCIjMjdBRTYwXCI7XG5cbi8qXG4qIENvbG9yIG9mIGNpcmNsZXMgaW4gY2hhcnRzXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjMzMzXG4qL1xuZXhwb3J0IGNvbnN0IENJUkNMRV9DT0xPUiA9IFwiIzMzM1wiO1xuXG4vKlxuKiBDb2xvciBvZiBhc3BlY3RzXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7T2JqZWN0fVxuKi9cbmV4cG9ydCBjb25zdCBBU1BFQ1RfQ09MT1JTID0ge1xuICAgIENvbmp1bmN0aW9uOiBcIiMzMzNcIixcbiAgICBPcHBvc2l0aW9uOiBcIiMxQjRGNzJcIixcbiAgICBTcXVhcmU6IFwiIzY0MUUxNlwiLFxuICAgIFRyaW5lOiBcIiMwQjUzNDVcIixcbiAgICBTZXh0aWxlOiBcIiMzMzNcIixcbiAgICBRdWluY3VueDogXCIjMzMzXCIsXG4gICAgU2VtaXNleHRpbGU6IFwiIzMzM1wiLFxuICAgIFF1aW50aWxlOiBcIiMzMzNcIixcbiAgICBUcmlvY3RpbGU6IFwiIzMzM1wiXG59XG5cbi8qKlxuICogT3ZlcnJpZGUgaW5kaXZpZHVhbCBwbGFuZXQgc3ltYm9sIGNvbG9ycyBieSBwbGFuZXQgbmFtZVxuICovXG5leHBvcnQgY29uc3QgUExBTkVUX0NPTE9SUyA9IHtcbiAgICAvL1N1bjogXCIjMDAwXCIsXG4gICAgLy9Nb29uOiBcIiNhYWFcIixcbn1cblxuLyoqXG4gKiBvdmVycmlkZSBpbmRpdmlkdWFsIHNpZ24gc3ltYm9sIGNvbG9ycyBieSB6b2RpYWMgaW5kZXhcbiAqL1xuZXhwb3J0IGNvbnN0IFNJR05fQ09MT1JTID0ge1xuICAgIC8vMDogXCIjMzMzXCJcbn1cblxuLyoqXG4gKiBBbGwgc2lnbnMgbGFiZWxzIGluIHRoZSByaWdodCBvcmRlclxuICogQHR5cGUge3N0cmluZ1tdfVxuICovXG5leHBvcnQgY29uc3QgU0lHTl9MQUJFTFMgPSBbXG4gICAgXCJBcmllc1wiLFxuICAgIFwiVGF1cnVzXCIsXG4gICAgXCJHZW1pbmlcIixcbiAgICBcIkNhbmNlclwiLFxuICAgIFwiTGVvXCIsXG4gICAgXCJWaXJnb1wiLFxuICAgIFwiTGlicmFcIixcbiAgICBcIlNjb3JwaW9cIixcbiAgICBcIlNhZ2l0dGFyaXVzXCIsXG4gICAgXCJDYXByaWNvcm5cIixcbiAgICBcIkFxdWFyaXVzXCIsXG4gICAgXCJQaXNjZXNcIixcbl1cblxuLyoqXG4gKiBPdmVycmlkZSBpbmRpdmlkdWFsIHBsYW5ldCBzeW1ib2wgY29sb3JzIGJ5IHBsYW5ldCBuYW1lIG9uIHRyYW5zaXQgY2hhcnRzXG4gKi9cbmV4cG9ydCBjb25zdCBUUkFOU0lUX1BMQU5FVF9DT0xPUlMgPSB7XG4gICAgLy9TdW46IFwiIzAwMFwiLFxuICAgIC8vTW9vbjogXCIjYWFhXCIsXG59XG4iLCIvKlxuKiBQb2ludCBwcm9wZXJ0aWVzIC0gYW5nbGUgaW4gc2lnbiwgZGlnbml0aWVzLCByZXRyb2dyYWRlXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7Qm9vbGVhbn1cbiogQGRlZmF1bHQgdHJ1ZVxuKi9cbmV4cG9ydCBjb25zdCBQT0lOVF9QUk9QRVJUSUVTX1NIT1cgPSB0cnVlXG5cbi8qXG4qIFBvaW50IGFuZ2xlIGluIHNpZ25cbiogQGNvbnN0YW50XG4qIEB0eXBlIHtCb29sZWFufVxuKiBAZGVmYXVsdCB0cnVlXG4qL1xuZXhwb3J0IGNvbnN0IFBPSU5UX1BST1BFUlRJRVNfU0hPV19BTkdMRSA9IHRydWVcblxuLyoqXG4gKiBQb2ludCBzaWduXG4gKiBAdHlwZSB7Ym9vbGVhbn1cbiAqL1xuZXhwb3J0IGNvbnN0IFBPSU5UX1BST1BFUlRJRVNfU0hPV19TSUdOID0gZmFsc2VcblxuLypcbiogUG9pbnQgZGlnbml0eSBzeW1ib2xcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtCb29sZWFufVxuKiBAZGVmYXVsdCB0cnVlXG4qL1xuZXhwb3J0IGNvbnN0IFBPSU5UX1BST1BFUlRJRVNfU0hPV19ESUdOSVRZID0gdHJ1ZVxuXG4vKlxuKiBQb2ludCByZXRyb2dyYWRlIHN5bWJvbFxuKiBAY29uc3RhbnRcbiogQHR5cGUge0Jvb2xlYW59XG4qIEBkZWZhdWx0IHRydWVcbiovXG5leHBvcnQgY29uc3QgUE9JTlRfUFJPUEVSVElFU19TSE9XX1JFVFJPR1JBREUgPSB0cnVlXG5cbi8qXG4qIFBvaW50IGRpZ25pdHkgc3ltYm9scyAtIFtkb21pY2lsZSwgZGV0cmltZW50LCBleGFsdGF0aW9uLCBmYWxsXVxuKiBAY29uc3RhbnRcbiogQHR5cGUge0Jvb2xlYW59XG4qIEBkZWZhdWx0IHRydWVcbiovXG5leHBvcnQgY29uc3QgUE9JTlRfUFJPUEVSVElFU19ESUdOSVRZX1NZTUJPTFMgPSBbXCJyXCIsIFwiZFwiLCBcImVcIiwgXCJmXCJdO1xuXG4vKlxuKiBUZXh0IHNpemUgb2YgUG9pbnQgZGVzY3JpcHRpb24gLSBhbmdsZSBpbiBzaWduLCBkaWduaXRpZXMsIHJldHJvZ3JhZGVcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtOdW1iZXJ9XG4qIEBkZWZhdWx0IDZcbiovXG5leHBvcnQgY29uc3QgUE9JTlRfUFJPUEVSVElFU19GT05UX1NJWkUgPSAxNlxuXG4vKlxuKiBUZXh0IHNpemUgb2YgYW5nbGUgbnVtYmVyXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7TnVtYmVyfVxuKiBAZGVmYXVsdCA2XG4qL1xuZXhwb3J0IGNvbnN0IFBPSU5UX1BST1BFUlRJRVNfQU5HTEVfU0laRSA9IDI1XG5cbi8qXG4qIFRleHQgc2l6ZSBvZiByZXRyb2dyYWRlIHN5bWJvbFxuKiBAY29uc3RhbnRcbiogQHR5cGUge051bWJlcn1cbiogQGRlZmF1bHQgNlxuKi9cbmV4cG9ydCBjb25zdCBQT0lOVF9QUk9QRVJUSUVTX1JFVFJPR1JBREVfU0laRSA9IDI1XG5cbi8qXG4qIFRleHQgc2l6ZSBvZiBkaWduaXR5IHN5bWJvbFxuKiBAY29uc3RhbnRcbiogQHR5cGUge051bWJlcn1cbiogQGRlZmF1bHQgNlxuKi9cbmV4cG9ydCBjb25zdCBQT0lOVF9QUk9QRVJUSUVTX0RJR05JVFlfU0laRSA9IDEyXG5cbi8qXG4qIEFuZ2xlIG9mZnNldCBtdWx0aXBsaWVyXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7TnVtYmVyfVxuKiBAZGVmYXVsdCA2XG4qL1xuZXhwb3J0IGNvbnN0IFBPSU5UX1BST1BFUlRJRVNfQU5HTEVfT0ZGU0VUID0gMlxuXG4vKipcbiAqIE9mZnNldCBmcm9tIHRoZSBwbGFuZXRcbiAqIEB0eXBlIHtudW1iZXJ9XG4gKi9cbmV4cG9ydCBjb25zdCBQT0lOVF9QUk9QRVJUSUVTX1NJR05fT0ZGU0VUID0gMy41XG5cbi8qXG4qIFJldHJvZ3JhZGUgc3ltYm9sIG9mZnNldCBtdWx0aXBsaWVyXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7TnVtYmVyfVxuKiBAZGVmYXVsdCA2XG4qL1xuZXhwb3J0IGNvbnN0IFBPSU5UX1BST1BFUlRJRVNfUkVUUk9HUkFERV9PRkZTRVQgPSA1XG5cbi8qXG4qIERpZ25pdHkgc3ltYm9sIG9mZnNldCBtdWx0aXBsaWVyXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7TnVtYmVyfVxuKiBAZGVmYXVsdCA2XG4qL1xuZXhwb3J0IGNvbnN0IFBPSU5UX1BST1BFUlRJRVNfRElHTklUWV9PRkZTRVQgPSA2XG5cbi8qKlxuICogQSBwb2ludCBjb2xsaXNpb24gcmFkaXVzXG4gKiBAY29uc3RhbnRcbiAqIEB0eXBlIHtOdW1iZXJ9XG4gKiBAZGVmYXVsdCAyXG4gKi9cbmV4cG9ydCBjb25zdCBQT0lOVF9DT0xMSVNJT05fUkFESVVTID0gMTJcblxuLyoqXG4gKiBUd2VhayB0aGUgYW5nbGUgc3RyaW5nLCBlLmcuIGFkZCB0aGUgZGVncmVlIHN5bWJvbDogXCIke2FuZ2xlfcKwXCJcbiAqIEB0eXBlIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBjb25zdCBBTkdMRV9URU1QTEFURSA9IFwiJHthbmdsZX1cIlxuXG5cbi8qKlxuICogQ2xhc3NlcyBmb3IgcG9pbnRzXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuLyoqXG4gKiBDbGFzcyBmb3IgQ2VsZXN0aWFsIEJvZGllcyAoUGxhbmV0IC8gQXN0ZXJpb2QpXG4gKiBhbmQgQ2VsZXN0aWFsIFBvaW50cyAobm9ydGhub2RlLCBzb3V0aG5vZGUsIGxpbGl0aClcbiAqIEB0eXBlIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBjb25zdCBDTEFTU19DRUxFU1RJQUwgPSAnJztcbmV4cG9ydCBjb25zdCBDTEFTU19QT0lOVF9BTkdMRSA9ICcnO1xuZXhwb3J0IGNvbnN0IENMQVNTX1BPSU5UX1NJR04gPSAnJztcbmV4cG9ydCBjb25zdCBDTEFTU19QT0lOVF9SRVRST0dSQURFID0gJyc7XG5leHBvcnQgY29uc3QgQ0xBU1NfUE9JTlRfRElHTklUWSA9ICcnO1xuXG4vKipcbiAqIEFkZCBhIHN0cm9rZSBhcm91bmQgYWxsIHBvaW50c1xuICovXG5leHBvcnQgY29uc3QgUE9JTlRfU1RST0tFID0gZmFsc2U7XG5leHBvcnQgY29uc3QgUE9JTlRfU1RST0tFX0NPTE9SID0gJyNmZmYnO1xuZXhwb3J0IGNvbnN0IFBPSU5UX1NUUk9LRV9XSURUSCA9IDI7XG5cbmV4cG9ydCBjb25zdCBQT0lOVF9QUk9QRVJUSUVTX1NJR05fQ09MT1IgPSBudWxsOyIsIi8qXG4qIFJhZGl4IGNoYXJ0IGVsZW1lbnQgSURcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0IHJhZGl4XG4qL1xuZXhwb3J0IGNvbnN0IFJBRElYX0lEID0gXCJyYWRpeFwiXG5cbi8qXG4qIEZvbnQgc2l6ZSAtIHBvaW50cyAocGxhbmV0cylcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtOdW1iZXJ9XG4qIEBkZWZhdWx0IDI3XG4qL1xuZXhwb3J0IGNvbnN0IFJBRElYX1BPSU5UU19GT05UX1NJWkUgPSAyN1xuXG4vKlxuKiBGb250IHNpemUgLSBob3VzZSBjdXNwIG51bWJlclxuKiBAY29uc3RhbnRcbiogQHR5cGUge051bWJlcn1cbiogQGRlZmF1bHQgMjdcbiovXG5leHBvcnQgY29uc3QgUkFESVhfSE9VU0VfRk9OVF9TSVpFID0gMjBcblxuLypcbiogRm9udCBzaXplIC0gc2lnbnNcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtOdW1iZXJ9XG4qIEBkZWZhdWx0IDI3XG4qL1xuZXhwb3J0IGNvbnN0IFJBRElYX1NJR05TX0ZPTlRfU0laRSA9IDI3XG5cbi8qXG4qIEZvbnQgc2l6ZSAtIGF4aXMgKEFzLCBEcywgTWMsIEljKVxuKiBAY29uc3RhbnRcbiogQHR5cGUge051bWJlcn1cbiogQGRlZmF1bHQgMjRcbiovXG5leHBvcnQgY29uc3QgUkFESVhfQVhJU19GT05UX1NJWkUgPSAzMlxuXG5cbmV4cG9ydCBjb25zdCBTWU1CT0xfU1RST0tFID0gZmFsc2VcbmV4cG9ydCBjb25zdCBTWU1CT0xfU1RST0tFX0NPTE9SID0gJyNGRkYnXG5leHBvcnQgY29uc3QgU1lNQk9MX1NUUk9LRV9XSURUSCA9ICc0J1xuXG5leHBvcnQgY29uc3QgU0lHTl9DT0xPUl9DSVJDTEUgPSBudWxsIiwiLypcbiogVHJhbnNpdCBjaGFydCBlbGVtZW50IElEXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCB0cmFuc2l0XG4qL1xuZXhwb3J0IGNvbnN0IFRSQU5TSVRfSUQgPSBcInRyYW5zaXRcIlxuXG4vKlxuKiBGb250IHNpemUgLSBwb2ludHMgKHBsYW5ldHMpXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7TnVtYmVyfVxuKiBAZGVmYXVsdCAzMlxuKi9cbmV4cG9ydCBjb25zdCBUUkFOU0lUX1BPSU5UU19GT05UX1NJWkUgPSAyN1xuIiwiLyoqXG4gKiBDaGFydCBwYWRkaW5nXG4gKiBAY29uc3RhbnRcbiAqIEB0eXBlIHtOdW1iZXJ9XG4gKiBAZGVmYXVsdCAxMHB4XG4gKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9QQURESU5HID0gNDBcblxuLyoqXG4gKiBTVkcgdmlld0JveCB3aWR0aFxuICogQHNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9TVkcvQXR0cmlidXRlL3ZpZXdCb3hcbiAqIEBjb25zdGFudFxuICogQHR5cGUge051bWJlcn1cbiAqIEBkZWZhdWx0IDgwMFxuICovXG5leHBvcnQgY29uc3QgQ0hBUlRfVklFV0JPWF9XSURUSCA9IDgwMFxuXG4vKipcbiAqIFNWRyB2aWV3Qm94IGhlaWdodFxuICogQHNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9TVkcvQXR0cmlidXRlL3ZpZXdCb3hcbiAqIEBjb25zdGFudFxuICogQHR5cGUge051bWJlcn1cbiAqIEBkZWZhdWx0IDgwMFxuICovXG5leHBvcnQgY29uc3QgQ0hBUlRfVklFV0JPWF9IRUlHSFQgPSA4MDBcblxuLyoqXG4gKiBDaGFuZ2UgdGhlIHNpemUgb2YgdGhlIGNlbnRlciBjaXJjbGUsIHdoZXJlIGFzcGVjdHMgYXJlXG4gKiBAdHlwZSB7bnVtYmVyfVxuICovXG5leHBvcnQgY29uc3QgQ0hBUlRfQ0VOVEVSX1NJWkUgPSAxXG5cbi8qXG4qIExpbmUgc3RyZW5ndGhcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtOdW1iZXJ9XG4qIEBkZWZhdWx0IDFcbiovXG5leHBvcnQgY29uc3QgQ0hBUlRfU1RST0tFID0gMVxuXG4vKlxuKiBMaW5lIHN0cmVuZ3RoIG9mIHRoZSBtYWluIGxpbmVzLiBGb3IgaW5zdGFuY2UgcG9pbnRzLCBtYWluIGF4aXMsIG1haW4gY2lyY2xlc1xuKiBAY29uc3RhbnRcbiogQHR5cGUge051bWJlcn1cbiogQGRlZmF1bHQgMVxuKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9NQUlOX1NUUk9LRSA9IDJcblxuLyoqXG4gKiBMaW5lIHN0cmVuZ3RoIGZvciBtaW5vciBhc3BlY3RzXG4gKlxuICogQHR5cGUge251bWJlcn1cbiAqL1xuZXhwb3J0IGNvbnN0IENIQVJUX1NUUk9LRV9NSU5PUl9BU1BFQ1QgPSAxXG5cbi8qKlxuICogTm8gZmlsbCwgb25seSBzdHJva2VcbiAqIEBjb25zdGFudFxuICogQHR5cGUge2Jvb2xlYW59XG4gKiBAZGVmYXVsdCBmYWxzZVxuICovXG5leHBvcnQgY29uc3QgQ0hBUlRfU1RST0tFX09OTFkgPSBmYWxzZTtcblxuLyoqXG4gKiBGb250IGZhbWlseVxuICogQGNvbnN0YW50XG4gKiBAdHlwZSB7U3RyaW5nfVxuICogQGRlZmF1bHRcbiAqL1xuZXhwb3J0IGNvbnN0IENIQVJUX0ZPTlRfRkFNSUxZID0gXCJBc3Ryb25vbWljb25cIjtcblxuLyoqXG4gKiBBbHdheXMgZHJhdyB0aGUgZnVsbCBob3VzZSBsaW5lcywgZXZlbiBpZiBpdCBvdmVybGFwcyB3aXRoIHBsYW5ldHNcbiAqIEBjb25zdGFudFxuICogQHR5cGUge2Jvb2xlYW59XG4gKiBAZGVmYXVsdCBmYWxzZVxuICovXG5leHBvcnQgY29uc3QgQ0hBUlRfQUxMT1dfSE9VU0VfT1ZFUkxBUCA9IGZhbHNlO1xuXG4vKipcbiAqIERyYXcgbWFpbnMgYXhpcyBzeW1ib2xzIG91dHNpZGUgdGhlIGNoYXJ0OiBBYywgTWMsIEljLCBEY1xuICogQGNvbnN0YW50XG4gKiBAdHlwZSB7Ym9vbGVhbn1cbiAqIEBkZWZhdWx0IGZhbHNlXG4gKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9EUkFXX01BSU5fQVhJUyA9IHRydWU7XG5cblxuLyoqXG4gKiBTdHJva2UgJiBmaWxsXG4gKiBAY29uc3RhbnRcbiAqIEB0eXBlIHtib29sZWFufVxuICogQGRlZmF1bHQgZmFsc2VcbiAqL1xuZXhwb3J0IGNvbnN0IENIQVJUX1NUUk9LRV9XSVRIX0NPTE9SID0gZmFsc2U7XG5cblxuLyoqXG4gKiBBbGwgY2xhc3NuYW1lc1xuICovXG5cbi8qKlxuICogQ2xhc3MgZm9yIHRoZSBzaWduIHNlZ21lbnQsIGJlaGluZCB0aGUgYWN0dWFsIHNpZ25cbiAqIEB0eXBlIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBjb25zdCBDTEFTU19TSUdOX1NFR01FTlQgPSAnJztcblxuLyoqXG4gKiBDbGFzcyBmb3IgdGhlIHNpZ25cbiAqIElmIG5vdCBlbXB0eSwgYW5vdGhlciBjbGFzcyB3aWxsIGJlIGFkZGVkIHVzaW5nIHNhbWUgc3RyaW5nLCB3aXRoIGEgbW9kaWZpZXIgbGlrZSAtLXNpZ25fbmFtZVxuICogQHR5cGUge3N0cmluZ31cbiAqL1xuZXhwb3J0IGNvbnN0IENMQVNTX1NJR04gPSAnJztcblxuLyoqXG4gKiBDbGFzcyBmb3IgYXhpcyBBc2NlbmRhbnQsIE1pZGhlYXZlbiwgRGVzY2VuZGFudCBhbmQgSW11bSBDb2VsaVxuICogSWYgbm90IGVtcHR5LCBhbm90aGVyIGNsYXNzIHdpbGwgYmUgYWRkZWQgdXNpbmcgc2FtZSBzdHJpbmcsIHdpdGggYSBtb2RpZmllciBsaWtlIC0tYXhpc19uYW1lXG4gKiBAdHlwZSB7c3RyaW5nfVxuICovXG5leHBvcnQgY29uc3QgQ0xBU1NfQVhJUyA9ICcnO1xuXG4vKipcbiAqIENsYXNzIGZvciB0aGUgYXNwZWN0IGNoYXJhY3RlclxuICogQHR5cGUge3N0cmluZ31cbiAqL1xuZXhwb3J0IGNvbnN0IENMQVNTX1NJR05fQVNQRUNUID0gJyc7XG5cbi8qKlxuICogQ2xhc3MgZm9yIGFzcGVjdCBsaW5lc1xuICogQHR5cGUge3N0cmluZ31cbiAqL1xuZXhwb3J0IGNvbnN0IENMQVNTX1NJR05fQVNQRUNUX0xJTkUgPSAnJztcblxuLyoqXG4gKiBVc2UgcGxhbmV0IGNvbG9yIGZvciB0aGUgY2hhcnQgbGluZSBuZXh0IHRvIGEgcGxhbmV0XG4gKiBAdHlwZSB7Ym9vbGVhbn1cbiAqL1xuZXhwb3J0IGNvbnN0IFBMQU5FVF9MSU5FX1VTRV9QTEFORVRfQ09MT1IgPSBmYWxzZTtcblxuLyoqXG4gKiBEcmF3IGEgcnVsZXIgbWFyayAodGlueSBzcXVhcmUpIGF0IHBsYW5ldCBwb3NpdGlvblxuICovXG5leHBvcnQgY29uc3QgRFJBV19SVUxFUl9NQVJLID0gdHJ1ZTtcblxuZXhwb3J0IGNvbnN0IEZPTlRfQVNUUk9OT01JQ09OX0xPQUQgPSB0cnVlO1xuZXhwb3J0IGNvbnN0IEZPTlRfQVNUUk9OT01JQ09OX1BBVEggPSAnLi4vYXNzZXRzL2ZvbnRzL3R0Zi9Bc3Ryb25vbWljb25Gb250c18xLjEvQXN0cm9ub21pY29uLnR0Zic7IiwiaW1wb3J0IERlZmF1bHRTZXR0aW5ncyBmcm9tICcuLi9zZXR0aW5ncy9EZWZhdWx0U2V0dGluZ3MuanMnO1xuaW1wb3J0IFNWR1V0aWxzIGZyb20gJy4uL3V0aWxzL1NWR1V0aWxzLmpzJztcbmltcG9ydCBSYWRpeENoYXJ0IGZyb20gJy4uL2NoYXJ0cy9SYWRpeENoYXJ0LmpzJztcbmltcG9ydCBUcmFuc2l0Q2hhcnQgZnJvbSAnLi4vY2hhcnRzL1RyYW5zaXRDaGFydC5qcyc7XG5cblxuLyoqXG4gKiBAY2xhc3NcbiAqIEBjbGFzc2Rlc2MgQW4gd3JhcHBlciBmb3IgYWxsIHBhcnRzIG9mIGdyYXBoLlxuICogQHB1YmxpY1xuICovXG5jbGFzcyBVbml2ZXJzZSB7XG5cbiAgICAjU1ZHRG9jdW1lbnRcbiAgICAjc2V0dGluZ3NcbiAgICAjcmFkaXhcbiAgICAjdHJhbnNpdFxuICAgICNhc3BlY3RzV3JhcHBlclxuXG4gICAgLyoqXG4gICAgICogQGNvbnN0cnVjdHNcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gaHRtbEVsZW1lbnRJRCAtIElEIG9mIHRoZSByb290IGVsZW1lbnQgd2l0aG91dCB0aGUgIyBzaWduXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSAtIEFuIG9iamVjdCB0aGF0IG92ZXJyaWRlcyB0aGUgZGVmYXVsdCBzZXR0aW5ncyB2YWx1ZXNcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihodG1sRWxlbWVudElELCBvcHRpb25zID0ge30pIHtcblxuICAgICAgICBpZiAodHlwZW9mIGh0bWxFbGVtZW50SUQgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0EgcmVxdWlyZWQgcGFyYW1ldGVyIGlzIG1pc3NpbmcuJylcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGh0bWxFbGVtZW50SUQpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm90IGZpbmQgYSBIVE1MIGVsZW1lbnQgd2l0aCBJRCAnICsgaHRtbEVsZW1lbnRJRClcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuI3NldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgRGVmYXVsdFNldHRpbmdzLCBvcHRpb25zLCB7XG4gICAgICAgICAgICBIVE1MX0VMRU1FTlRfSUQ6IGh0bWxFbGVtZW50SURcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuI1NWR0RvY3VtZW50ID0gU1ZHVXRpbHMuU1ZHRG9jdW1lbnQodGhpcy4jc2V0dGluZ3MuQ0hBUlRfVklFV0JPWF9XSURUSCwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfVklFV0JPWF9IRUlHSFQpXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGh0bWxFbGVtZW50SUQpLmFwcGVuZENoaWxkKHRoaXMuI1NWR0RvY3VtZW50KTtcblxuICAgICAgICAvLyBjaGFydCBiYWNrZ3JvdW5kXG4gICAgICAgIGNvbnN0IGJhY2tncm91bmRHcm91cCA9IFNWR1V0aWxzLlNWR0dyb3VwKClcbiAgICAgICAgYmFja2dyb3VuZEdyb3VwLmNsYXNzTGlzdC5hZGQoJ2MtYmFja2dyb3VuZHMnKVxuICAgICAgICBjb25zdCBjaXJjbGUgPSBTVkdVdGlscy5TVkdDaXJjbGUodGhpcy4jc2V0dGluZ3MuQ0hBUlRfVklFV0JPWF9XSURUSCAvIDIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1ZJRVdCT1hfSEVJR0hUIC8gMiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfVklFV0JPWF9XSURUSCAvIDIpXG4gICAgICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoJ2ZpbGwnLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9CQUNLR1JPVU5EX0NPTE9SKVxuICAgICAgICBjaXJjbGUuY2xhc3NMaXN0LmFkZCgnYy1jaGFydC1iYWNrZ3JvdW5kJyk7XG4gICAgICAgIGJhY2tncm91bmRHcm91cC5hcHBlbmRDaGlsZChjaXJjbGUpXG4gICAgICAgIHRoaXMuI1NWR0RvY3VtZW50LmFwcGVuZENoaWxkKGJhY2tncm91bmRHcm91cClcblxuICAgICAgICAvLyBjcmVhdGUgd3JhcHBlciBmb3IgYXNwZWN0c1xuICAgICAgICB0aGlzLiNhc3BlY3RzV3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcbiAgICAgICAgdGhpcy4jYXNwZWN0c1dyYXBwZXIuc2V0QXR0cmlidXRlKFwiaWRcIiwgYCR7dGhpcy4jc2V0dGluZ3MuSFRNTF9FTEVNRU5UX0lEfS0ke3RoaXMuI3NldHRpbmdzLkFTUEVDVFNfSUR9YClcbiAgICAgICAgdGhpcy4jU1ZHRG9jdW1lbnQuYXBwZW5kQ2hpbGQodGhpcy4jYXNwZWN0c1dyYXBwZXIpXG5cbiAgICAgICAgdGhpcy4jcmFkaXggPSBuZXcgUmFkaXhDaGFydCh0aGlzKVxuICAgICAgICB0aGlzLiN0cmFuc2l0ID0gbmV3IFRyYW5zaXRDaGFydCh0aGlzLiNyYWRpeClcblxuICAgICAgICBpZiAodGhpcy4jc2V0dGluZ3MuRk9OVF9BU1RST05PTUlDT05fTE9BRCkge1xuICAgICAgICAgICAgdGhpcy4jbG9hZEZvbnQoXCJBc3Ryb25vbWljb25cIiwgdGhpcy4jc2V0dGluZ3MuRk9OVF9BU1RST05PTUlDT05fUEFUSClcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgLy8gIyMgUFVCTElDICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gICAgLyoqXG4gICAgICogR2V0IFJhZGl4IGNoYXJ0XG4gICAgICogQHJldHVybiB7UmFkaXhDaGFydH1cbiAgICAgKi9cbiAgICByYWRpeCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI3JhZGl4XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IFRyYW5zaXQgY2hhcnRcbiAgICAgKiBAcmV0dXJuIHtUcmFuc2l0Q2hhcnR9XG4gICAgICovXG4gICAgdHJhbnNpdCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI3RyYW5zaXRcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgY3VycmVudCBzZXR0aW5nc1xuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICBnZXRTZXR0aW5ncygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI3NldHRpbmdzXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHJvb3QgU1ZHIGRvY3VtZW50XG4gICAgICogQHJldHVybiB7U1ZHRG9jdW1lbnR9XG4gICAgICovXG4gICAgZ2V0U1ZHRG9jdW1lbnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiNTVkdEb2N1bWVudFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBlbXB0eSBhc3BlY3RzIHdyYXBwZXIgZWxlbWVudFxuICAgICAqIEByZXR1cm4ge1NWR0dyb3VwRWxlbWVudH1cbiAgICAgKi9cbiAgICBnZXRBc3BlY3RzRWxlbWVudCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI2FzcGVjdHNXcmFwcGVyXG4gICAgfVxuXG4gICAgLy8gIyMgUFJJVkFURSAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuICAgIC8qXG4gICAgKiBMb2FkIGZvbmQgdG8gRE9NXG4gICAgKlxuICAgICogQHBhcmFtIHtTdHJpbmd9IGZhbWlseVxuICAgICogQHBhcmFtIHtTdHJpbmd9IHNvdXJjZVxuICAgICogQHBhcmFtIHtPYmplY3R9XG4gICAgKlxuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRm9udEZhY2UvRm9udEZhY2VcbiAgICAqL1xuICAgIGFzeW5jICNsb2FkRm9udChmYW1pbHksIHNvdXJjZSwgZGVzY3JpcHRvcnMpIHtcblxuICAgICAgICBpZiAoISAoJ0ZvbnRGYWNlJyBpbiB3aW5kb3cpKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiT29vcHMsIEZvbnRGYWNlIGlzIG5vdCBhIGZ1bmN0aW9uLlwiKVxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0NTU19Gb250X0xvYWRpbmdfQVBJXCIpXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGZvbnQgPSBuZXcgRm9udEZhY2UoZmFtaWx5LCBgdXJsKCR7c291cmNlfSlgLCBkZXNjcmlwdG9ycylcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgYXdhaXQgZm9udC5sb2FkKCk7XG4gICAgICAgICAgICBkb2N1bWVudC5mb250cy5hZGQoZm9udClcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGUpXG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCB7XG4gICAgVW5pdmVyc2UgYXNcbiAgICAgICAgZGVmYXVsdFxufVxuIiwiaW1wb3J0IFV0aWxzIGZyb20gJy4vVXRpbHMuanMnXG5pbXBvcnQgU1ZHVXRpbHMgZnJvbSAnLi9TVkdVdGlscy5qcyc7XG5cbi8qKlxuICogQGNsYXNzXG4gKiBAY2xhc3NkZXNjIFV0aWxpdHkgY2xhc3NcbiAqIEBwdWJsaWNcbiAqIEBzdGF0aWNcbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqL1xuY2xhc3MgQXNwZWN0VXRpbHMge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIGlmICh0aGlzIGluc3RhbmNlb2YgQXNwZWN0VXRpbHMpIHtcbiAgICAgICAgICAgIHRocm93IEVycm9yKCdUaGlzIGlzIGEgc3RhdGljIGNsYXNzIGFuZCBjYW5ub3QgYmUgaW5zdGFudGlhdGVkLicpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2FsY3VsYXRlcyB0aGUgb3JiaXQgb2YgdHdvIGFuZ2xlcyBvbiBhIGNpcmNsZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGZyb21BbmdsZSAtIGFuZ2xlIGluIGRlZ3JlZSwgcG9pbnQgb24gdGhlIGNpcmNsZVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0b0FuZ2xlIC0gYW5nbGUgaW4gZGVncmVlLCBwb2ludCBvbiB0aGUgY2lyY2xlXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGFzcGVjdEFuZ2xlIC0gNjAsOTAsMTIwLCAuLi5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge051bWJlcn0gb3JiXG4gICAgICovXG4gICAgc3RhdGljIG9yYihmcm9tQW5nbGUsIHRvQW5nbGUsIGFzcGVjdEFuZ2xlKSB7XG4gICAgICAgIGxldCBvcmJcbiAgICAgICAgbGV0IHNpZ24gPSBmcm9tQW5nbGUgPiB0b0FuZ2xlID8gMSA6IC0xXG4gICAgICAgIGxldCBkaWZmZXJlbmNlID0gTWF0aC5hYnMoZnJvbUFuZ2xlIC0gdG9BbmdsZSlcblxuICAgICAgICBpZiAoZGlmZmVyZW5jZSA+IFV0aWxzLkRFR18xODApIHtcbiAgICAgICAgICAgIGRpZmZlcmVuY2UgPSBVdGlscy5ERUdfMzYwIC0gZGlmZmVyZW5jZTtcbiAgICAgICAgICAgIG9yYiA9IChkaWZmZXJlbmNlIC0gYXNwZWN0QW5nbGUpICogLTFcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3JiID0gKGRpZmZlcmVuY2UgLSBhc3BlY3RBbmdsZSkgKiBzaWduXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gTnVtYmVyKE51bWJlcihvcmIpLnRvRml4ZWQoMikpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IGFzcGVjdHNcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gZnJvbVBvaW50cyAtIFt7bmFtZTpcIk1vb25cIiwgYW5nbGU6MH0sIHtuYW1lOlwiU3VuXCIsIGFuZ2xlOjE3OX0sIHtuYW1lOlwiTWVyY3VyeVwiLCBhbmdsZToxMjF9XVxuICAgICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gdG9Qb2ludHMgLSBbe25hbWU6XCJBU1wiLCBhbmdsZTowfSwge25hbWU6XCJJQ1wiLCBhbmdsZTo5MH1dXG4gICAgICogQHBhcmFtIHtBcnJheTxPYmplY3Q+fSBhc3BlY3RzIC0gW3tuYW1lOlwiT3Bwb3NpdGlvblwiLCBhbmdsZToxODAsIG9yYjoyfSwge25hbWU6XCJUcmluZVwiLCBhbmdsZToxMjAsIG9yYjoyfV1cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge0FycmF5PE9iamVjdD59XG4gICAgICovXG4gICAgc3RhdGljIGdldEFzcGVjdHMoZnJvbVBvaW50cywgdG9Qb2ludHMsIGFzcGVjdHMpIHtcbiAgICAgICAgY29uc3QgYXNwZWN0TGlzdCA9IFtdXG4gICAgICAgIGZvciAoY29uc3QgZnJvbVAgb2YgZnJvbVBvaW50cykge1xuICAgICAgICAgICAgZm9yIChjb25zdCB0b1Agb2YgdG9Qb2ludHMpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGFzcGVjdCBvZiBhc3BlY3RzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG9yYiA9IEFzcGVjdFV0aWxzLm9yYihmcm9tUC5hbmdsZSwgdG9QLmFuZ2xlLCBhc3BlY3QuYW5nbGUpXG4gICAgICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyhvcmIpIDw9IGFzcGVjdC5vcmIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFzcGVjdExpc3QucHVzaCh7YXNwZWN0OiBhc3BlY3QsIGZyb206IGZyb21QLCB0bzogdG9QLCBwcmVjaXNpb246IG9yYn0pXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYXNwZWN0TGlzdFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERyYXcgYXNwZWN0c1xuICAgICAqXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHJhZGl1c1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBhc2NlbmRhbnRTaGlmdFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzZXR0aW5nc1xuICAgICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gYXNwZWN0c0xpc3RcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1NWR0dyb3VwRWxlbWVudH1cbiAgICAgKi9cbiAgICBzdGF0aWMgZHJhd0FzcGVjdHMocmFkaXVzLCBhc2NlbmRhbnRTaGlmdCwgc2V0dGluZ3MsIGFzcGVjdHNMaXN0KSB7XG4gICAgICAgIGNvbnN0IGNlbnRlclggPSBzZXR0aW5ncy5DSEFSVF9WSUVXQk9YX1dJRFRIIC8gMlxuICAgICAgICBjb25zdCBjZW50ZXJZID0gc2V0dGluZ3MuQ0hBUlRfVklFV0JPWF9IRUlHSFQgLyAyXG5cbiAgICAgICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcbiAgICAgICAgd3JhcHBlci5jbGFzc0xpc3QuYWRkKCdjLWFzcGVjdHMnKVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZW9yZGVyIGFzcGVjdHNcbiAgICAgICAgICogRHJhdyBtaW5vciBhc3BlY3RzIGZpcnN0XG4gICAgICAgICAqL1xuICAgICAgICBhc3BlY3RzTGlzdC5zb3J0KChhLCBiKSA9PiAoKGEuYXNwZWN0LmlzTWFqb3IgPz8gZmFsc2UpID09PSAoYi5hc3BlY3QuaXNNYWpvciA/PyBmYWxzZSkpID8gMCA6IChhLmFzcGVjdC5pc01ham9yID8/IGZhbHNlKSA/IDEgOiAtMSlcblxuICAgICAgICBjb25zdCBhc3BlY3RHcm91cHMgPSBbXTtcblxuICAgICAgICBmb3IgKGNvbnN0IGFzcCBvZiBhc3BlY3RzTGlzdCkge1xuICAgICAgICAgICAgY29uc3QgYXNwZWN0R3JvdXAgPSBTVkdVdGlscy5TVkdHcm91cCgpXG4gICAgICAgICAgICBhc3BlY3RHcm91cC5jbGFzc0xpc3QuYWRkKCdjLWFzcGVjdHNfX2FzcGVjdCcpXG4gICAgICAgICAgICBhc3BlY3RHcm91cC5jbGFzc0xpc3QuYWRkKCdjLWFzcGVjdHNfX2FzcGVjdC0tJyArIGFzcC5hc3BlY3QubmFtZS50b0xvd2VyQ2FzZSgpKVxuICAgICAgICAgICAgYXNwZWN0R3JvdXBzLnB1c2goYXNwZWN0R3JvdXApXG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogRHJhdyBsaW5lcyBmaXJzdFxuICAgICAgICAgKi9cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhc3BlY3RzTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgYXNwID0gYXNwZWN0c0xpc3RbaV07XG4gICAgICAgICAgICBjb25zdCBhc3BlY3RHcm91cCA9IGFzcGVjdEdyb3Vwc1tpXTtcblxuICAgICAgICAgICAgLy8gYXNwZWN0IGFzIHNvbGlkIGxpbmVcbiAgICAgICAgICAgIGNvbnN0IGZyb21Qb2ludCA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUoY2VudGVyWCwgY2VudGVyWSwgcmFkaXVzLCBVdGlscy5kZWdyZWVUb1JhZGlhbihhc3AuZnJvbS5hbmdsZSwgYXNjZW5kYW50U2hpZnQpKVxuICAgICAgICAgICAgY29uc3QgdG9Qb2ludCA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUoY2VudGVyWCwgY2VudGVyWSwgcmFkaXVzLCBVdGlscy5kZWdyZWVUb1JhZGlhbihhc3AudG8uYW5nbGUsIGFzY2VuZGFudFNoaWZ0KSlcblxuICAgICAgICAgICAgLy8gc3BhY2UgZm9yIHN5bWJvbCAoZnJvbVBvaW50IC0gY2VudGVyKVxuICAgICAgICAgICAgY29uc3QgZnJvbVBvaW50U3BhY2VYID0gZnJvbVBvaW50LnggKyAodG9Qb2ludC54IC0gZnJvbVBvaW50LngpIC8gMi4yXG4gICAgICAgICAgICBjb25zdCBmcm9tUG9pbnRTcGFjZVkgPSBmcm9tUG9pbnQueSArICh0b1BvaW50LnkgLSBmcm9tUG9pbnQueSkgLyAyLjJcblxuICAgICAgICAgICAgLy8gc3BhY2UgZm9yIHN5bWJvbCAoY2VudGVyIC0gdG9Qb2ludClcbiAgICAgICAgICAgIGNvbnN0IHRvUG9pbnRTcGFjZVggPSB0b1BvaW50LnggKyAoZnJvbVBvaW50LnggLSB0b1BvaW50LngpIC8gMi4yXG4gICAgICAgICAgICBjb25zdCB0b1BvaW50U3BhY2VZID0gdG9Qb2ludC55ICsgKGZyb21Qb2ludC55IC0gdG9Qb2ludC55KSAvIDIuMlxuXG4gICAgICAgICAgICAvLyBsaW5lOiBmcm9tUG9pbnQgLSBjZW50ZXJcbiAgICAgICAgICAgIGNvbnN0IGxpbmUxID0gU1ZHVXRpbHMuU1ZHTGluZShmcm9tUG9pbnQueCwgZnJvbVBvaW50LnksIGZyb21Qb2ludFNwYWNlWCwgZnJvbVBvaW50U3BhY2VZKVxuICAgICAgICAgICAgbGluZTEuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHNldHRpbmdzLkFTUEVDVF9DT0xPUlNbYXNwLmFzcGVjdC5uYW1lXSA/PyBcIiMzMzNcIik7XG5cbiAgICAgICAgICAgIGlmIChzZXR0aW5ncy5DSEFSVF9TVFJPS0VfTUlOT1JfQVNQRUNUICYmICEgKGFzcC5hc3BlY3QuaXNNYWpvciA/PyBmYWxzZSkpIHtcbiAgICAgICAgICAgICAgICBsaW5lMS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgc2V0dGluZ3MuQ0hBUlRfU1RST0tFX01JTk9SX0FTUEVDVCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxpbmUxLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCBzZXR0aW5ncy5DSEFSVF9TVFJPS0UpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoc2V0dGluZ3MuQ0xBU1NfU0lHTl9BU1BFQ1RfTElORSkge1xuICAgICAgICAgICAgICAgIGxpbmUxLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIHNldHRpbmdzLkNMQVNTX1NJR05fQVNQRUNUX0xJTkUpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGxpbmU6IGNlbnRlciAtIHRvUG9pbnRcbiAgICAgICAgICAgIGNvbnN0IGxpbmUyID0gU1ZHVXRpbHMuU1ZHTGluZSh0b1BvaW50U3BhY2VYLCB0b1BvaW50U3BhY2VZLCB0b1BvaW50LngsIHRvUG9pbnQueSlcbiAgICAgICAgICAgIGxpbmUyLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCBzZXR0aW5ncy5BU1BFQ1RfQ09MT1JTW2FzcC5hc3BlY3QubmFtZV0gPz8gXCIjMzMzXCIpO1xuXG4gICAgICAgICAgICBpZiAoc2V0dGluZ3MuQ0hBUlRfU1RST0tFX01JTk9SX0FTUEVDVCAmJiAhIChhc3AuYXNwZWN0LmlzTWFqb3IgPz8gZmFsc2UpKSB7XG4gICAgICAgICAgICAgICAgbGluZTIuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHNldHRpbmdzLkNIQVJUX1NUUk9LRV9NSU5PUl9BU1BFQ1QpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsaW5lMi5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgc2V0dGluZ3MuQ0hBUlRfU1RST0tFKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHNldHRpbmdzLkNMQVNTX1NJR05fQVNQRUNUX0xJTkUpIHtcbiAgICAgICAgICAgICAgICBsaW5lMi5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBzZXR0aW5ncy5DTEFTU19TSUdOX0FTUEVDVF9MSU5FKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhc3BlY3RHcm91cC5hcHBlbmRDaGlsZChsaW5lMSk7XG4gICAgICAgICAgICBhc3BlY3RHcm91cC5hcHBlbmRDaGlsZChsaW5lMik7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogRHJhdyBhbGwgYXNwZWN0cyBhYm92ZSBsaW5lc1xuICAgICAgICAgKi9cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhc3BlY3RzTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgYXNwID0gYXNwZWN0c0xpc3RbaV07XG4gICAgICAgICAgICBjb25zdCBhc3BlY3RHcm91cCA9IGFzcGVjdEdyb3Vwc1tpXTtcblxuICAgICAgICAgICAgLy8gYXNwZWN0IGFzIHNvbGlkIGxpbmVcbiAgICAgICAgICAgIGNvbnN0IGZyb21Qb2ludCA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUoY2VudGVyWCwgY2VudGVyWSwgcmFkaXVzLCBVdGlscy5kZWdyZWVUb1JhZGlhbihhc3AuZnJvbS5hbmdsZSwgYXNjZW5kYW50U2hpZnQpKVxuICAgICAgICAgICAgY29uc3QgdG9Qb2ludCA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUoY2VudGVyWCwgY2VudGVyWSwgcmFkaXVzLCBVdGlscy5kZWdyZWVUb1JhZGlhbihhc3AudG8uYW5nbGUsIGFzY2VuZGFudFNoaWZ0KSlcblxuICAgICAgICAgICAgLy8gZHJhdyBzeW1ib2wgaW4gY2VudGVyIG9mIGFzcGVjdFxuICAgICAgICAgICAgY29uc3QgbGluZUNlbnRlclggPSAoZnJvbVBvaW50LnggKyB0b1BvaW50LngpIC8gMlxuICAgICAgICAgICAgY29uc3QgbGluZUNlbnRlclkgPSAoZnJvbVBvaW50LnkgKyB0b1BvaW50LnkpIC8gMlxuICAgICAgICAgICAgY29uc3Qgc3ltYm9sID0gU1ZHVXRpbHMuU1ZHU3ltYm9sKGFzcC5hc3BlY3QubmFtZSwgbGluZUNlbnRlclgsIGxpbmVDZW50ZXJZKVxuICAgICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImZvbnQtZmFtaWx5XCIsIHNldHRpbmdzLkNIQVJUX0ZPTlRfRkFNSUxZKTtcbiAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKSAvLyBzdGFydCwgbWlkZGxlLCBlbmRcbiAgICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJkb21pbmFudC1iYXNlbGluZVwiLCBcIm1pZGRsZVwiKVxuICAgICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImZvbnQtc2l6ZVwiLCBzZXR0aW5ncy5BU1BFQ1RTX0ZPTlRfU0laRSk7XG4gICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBzZXR0aW5ncy5BU1BFQ1RfQ09MT1JTW2FzcC5hc3BlY3QubmFtZV0gPz8gXCIjMzMzXCIpO1xuXG4gICAgICAgICAgICBpZiAoc2V0dGluZ3MuQ0xBU1NfU0lHTl9BU1BFQ1QpIHtcbiAgICAgICAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgc2V0dGluZ3MuQ0xBU1NfU0lHTl9BU1BFQ1QgKyAnICcgKyBzZXR0aW5ncy5DTEFTU19TSUdOX0FTUEVDVCArICctLScgKyBhc3AuYXNwZWN0Lm5hbWUudG9Mb3dlckNhc2UoKSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYXNwZWN0R3JvdXAuZGF0YXNldC5mcm9tID0gYXNwLmZyb20ubmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgYXNwZWN0R3JvdXAuZGF0YXNldC50byA9IGFzcC50by5uYW1lLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgICAgICAgIGFzcGVjdEdyb3VwLmFwcGVuZENoaWxkKHN5bWJvbCk7XG4gICAgICAgICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGFzcGVjdEdyb3VwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB3cmFwcGVyXG4gICAgfVxuXG59XG5cbmV4cG9ydCB7XG4gICAgQXNwZWN0VXRpbHMgYXNcbiAgICAgICAgZGVmYXVsdFxufVxuIiwiLyoqXG4gKiBAY2xhc3NcbiAqIEBjbGFzc2Rlc2MgU1ZHIHV0aWxpdHkgY2xhc3NcbiAqIEBwdWJsaWNcbiAqIEBzdGF0aWNcbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqL1xuY2xhc3MgU1ZHVXRpbHMge1xuXG4gICAgc3RhdGljIFNWR19OQU1FU1BBQ0UgPSBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcblxuICAgIHN0YXRpYyBTWU1CT0xfQVJJRVMgPSBcIkFyaWVzXCI7XG4gICAgc3RhdGljIFNZTUJPTF9UQVVSVVMgPSBcIlRhdXJ1c1wiO1xuICAgIHN0YXRpYyBTWU1CT0xfR0VNSU5JID0gXCJHZW1pbmlcIjtcbiAgICBzdGF0aWMgU1lNQk9MX0NBTkNFUiA9IFwiQ2FuY2VyXCI7XG4gICAgc3RhdGljIFNZTUJPTF9MRU8gPSBcIkxlb1wiO1xuICAgIHN0YXRpYyBTWU1CT0xfVklSR08gPSBcIlZpcmdvXCI7XG4gICAgc3RhdGljIFNZTUJPTF9MSUJSQSA9IFwiTGlicmFcIjtcbiAgICBzdGF0aWMgU1lNQk9MX1NDT1JQSU8gPSBcIlNjb3JwaW9cIjtcbiAgICBzdGF0aWMgU1lNQk9MX1NBR0lUVEFSSVVTID0gXCJTYWdpdHRhcml1c1wiO1xuICAgIHN0YXRpYyBTWU1CT0xfQ0FQUklDT1JOID0gXCJDYXByaWNvcm5cIjtcbiAgICBzdGF0aWMgU1lNQk9MX0FRVUFSSVVTID0gXCJBcXVhcml1c1wiO1xuICAgIHN0YXRpYyBTWU1CT0xfUElTQ0VTID0gXCJQaXNjZXNcIjtcblxuICAgIHN0YXRpYyBTWU1CT0xfU1VOID0gXCJTdW5cIjtcbiAgICBzdGF0aWMgU1lNQk9MX01PT04gPSBcIk1vb25cIjtcbiAgICBzdGF0aWMgU1lNQk9MX01FUkNVUlkgPSBcIk1lcmN1cnlcIjtcbiAgICBzdGF0aWMgU1lNQk9MX1ZFTlVTID0gXCJWZW51c1wiO1xuICAgIHN0YXRpYyBTWU1CT0xfRUFSVEggPSBcIkVhcnRoXCI7XG4gICAgc3RhdGljIFNZTUJPTF9NQVJTID0gXCJNYXJzXCI7XG4gICAgc3RhdGljIFNZTUJPTF9KVVBJVEVSID0gXCJKdXBpdGVyXCI7XG4gICAgc3RhdGljIFNZTUJPTF9TQVRVUk4gPSBcIlNhdHVyblwiO1xuICAgIHN0YXRpYyBTWU1CT0xfVVJBTlVTID0gXCJVcmFudXNcIjtcbiAgICBzdGF0aWMgU1lNQk9MX05FUFRVTkUgPSBcIk5lcHR1bmVcIjtcbiAgICBzdGF0aWMgU1lNQk9MX1BMVVRPID0gXCJQbHV0b1wiO1xuICAgIHN0YXRpYyBTWU1CT0xfQ0hJUk9OID0gXCJDaGlyb25cIjtcbiAgICBzdGF0aWMgU1lNQk9MX0xJTElUSCA9IFwiTGlsaXRoXCI7XG4gICAgc3RhdGljIFNZTUJPTF9OTk9ERSA9IFwiTk5vZGVcIjtcbiAgICBzdGF0aWMgU1lNQk9MX1NOT0RFID0gXCJTTm9kZVwiO1xuXG4gICAgc3RhdGljIFNZTUJPTF9BUyA9IFwiQXNcIjtcbiAgICBzdGF0aWMgU1lNQk9MX0RTID0gXCJEc1wiO1xuICAgIHN0YXRpYyBTWU1CT0xfTUMgPSBcIk1jXCI7XG4gICAgc3RhdGljIFNZTUJPTF9JQyA9IFwiSWNcIjtcblxuICAgIHN0YXRpYyBTWU1CT0xfUkVUUk9HUkFERSA9IFwiUmV0cm9ncmFkZVwiXG5cbiAgICBzdGF0aWMgU1lNQk9MX0NPTkpVTkNUSU9OID0gXCJDb25qdW5jdGlvblwiO1xuICAgIHN0YXRpYyBTWU1CT0xfT1BQT1NJVElPTiA9IFwiT3Bwb3NpdGlvblwiO1xuICAgIHN0YXRpYyBTWU1CT0xfU1FVQVJFID0gXCJTcXVhcmVcIjtcbiAgICBzdGF0aWMgU1lNQk9MX1RSSU5FID0gXCJUcmluZVwiO1xuICAgIHN0YXRpYyBTWU1CT0xfU0VYVElMRSA9IFwiU2V4dGlsZVwiO1xuICAgIHN0YXRpYyBTWU1CT0xfUVVJTkNVTlggPSBcIlF1aW5jdW54XCI7XG4gICAgc3RhdGljIFNZTUJPTF9TRU1JU0VYVElMRSA9IFwiU2VtaXNleHRpbGVcIjtcbiAgICBzdGF0aWMgU1lNQk9MX1NFTUlTUVVBUkUgPSBcIlNlbWlzcXVhcmVcIjtcbiAgICBzdGF0aWMgU1lNQk9MX09DVElMRSA9IFwiT2N0aWxlXCI7XG4gICAgc3RhdGljIFNZTUJPTF9UUklPQ1RJTEUgPSBcIlRyaW9jdGlsZVwiO1xuICAgIHN0YXRpYyBTWU1CT0xfUVVJTlRJTEUgPSBcIlF1aW50aWxlXCI7XG5cbiAgICAvLyBBc3Ryb25vbWljb24gZm9udCBjb2Rlc1xuICAgIHN0YXRpYyBTWU1CT0xfQVJJRVNfQ09ERSA9IFwiQVwiO1xuICAgIHN0YXRpYyBTWU1CT0xfVEFVUlVTX0NPREUgPSBcIkJcIjtcbiAgICBzdGF0aWMgU1lNQk9MX0dFTUlOSV9DT0RFID0gXCJDXCI7XG4gICAgc3RhdGljIFNZTUJPTF9DQU5DRVJfQ09ERSA9IFwiRFwiO1xuICAgIHN0YXRpYyBTWU1CT0xfTEVPX0NPREUgPSBcIkVcIjtcbiAgICBzdGF0aWMgU1lNQk9MX1ZJUkdPX0NPREUgPSBcIkZcIjtcbiAgICBzdGF0aWMgU1lNQk9MX0xJQlJBX0NPREUgPSBcIkdcIjtcbiAgICBzdGF0aWMgU1lNQk9MX1NDT1JQSU9fQ09ERSA9IFwiSFwiO1xuICAgIHN0YXRpYyBTWU1CT0xfU0FHSVRUQVJJVVNfQ09ERSA9IFwiSVwiO1xuICAgIHN0YXRpYyBTWU1CT0xfQ0FQUklDT1JOX0NPREUgPSBcIkpcIjtcbiAgICBzdGF0aWMgU1lNQk9MX0FRVUFSSVVTX0NPREUgPSBcIktcIjtcbiAgICBzdGF0aWMgU1lNQk9MX1BJU0NFU19DT0RFID0gXCJMXCI7XG5cbiAgICBzdGF0aWMgU1lNQk9MX1NVTl9DT0RFID0gXCJRXCI7XG4gICAgc3RhdGljIFNZTUJPTF9NT09OX0NPREUgPSBcIlJcIjtcbiAgICBzdGF0aWMgU1lNQk9MX01FUkNVUllfQ09ERSA9IFwiU1wiO1xuICAgIHN0YXRpYyBTWU1CT0xfVkVOVVNfQ09ERSA9IFwiVFwiO1xuICAgIHN0YXRpYyBTWU1CT0xfRUFSVEhfQ09ERSA9IFwiPlwiO1xuICAgIHN0YXRpYyBTWU1CT0xfTUFSU19DT0RFID0gXCJVXCI7XG4gICAgc3RhdGljIFNZTUJPTF9KVVBJVEVSX0NPREUgPSBcIlZcIjtcbiAgICBzdGF0aWMgU1lNQk9MX1NBVFVSTl9DT0RFID0gXCJXXCI7XG4gICAgc3RhdGljIFNZTUJPTF9VUkFOVVNfQ09ERSA9IFwiWFwiO1xuICAgIHN0YXRpYyBTWU1CT0xfTkVQVFVORV9DT0RFID0gXCJZXCI7XG4gICAgc3RhdGljIFNZTUJPTF9QTFVUT19DT0RFID0gXCJaXCI7XG4gICAgc3RhdGljIFNZTUJPTF9DSElST05fQ09ERSA9IFwicVwiO1xuICAgIHN0YXRpYyBTWU1CT0xfTElMSVRIX0NPREUgPSBcInpcIjtcbiAgICBzdGF0aWMgU1lNQk9MX05OT0RFX0NPREUgPSBcImdcIjtcbiAgICBzdGF0aWMgU1lNQk9MX1NOT0RFX0NPREUgPSBcImlcIjtcblxuICAgIHN0YXRpYyBTWU1CT0xfQVNfQ09ERSA9IFwiY1wiO1xuICAgIHN0YXRpYyBTWU1CT0xfRFNfQ09ERSA9IFwiZlwiO1xuICAgIHN0YXRpYyBTWU1CT0xfTUNfQ09ERSA9IFwiZFwiO1xuICAgIHN0YXRpYyBTWU1CT0xfSUNfQ09ERSA9IFwiZVwiO1xuXG4gICAgc3RhdGljIFNZTUJPTF9SRVRST0dSQURFX0NPREUgPSBcIk1cIlxuXG5cbiAgICBzdGF0aWMgU1lNQk9MX0NPTkpVTkNUSU9OX0NPREUgPSBcIiFcIjtcbiAgICBzdGF0aWMgU1lNQk9MX09QUE9TSVRJT05fQ09ERSA9ICdcIic7XG4gICAgc3RhdGljIFNZTUJPTF9TUVVBUkVfQ09ERSA9IFwiI1wiO1xuICAgIHN0YXRpYyBTWU1CT0xfVFJJTkVfQ09ERSA9IFwiJFwiO1xuICAgIHN0YXRpYyBTWU1CT0xfU0VYVElMRV9DT0RFID0gXCIlXCI7XG5cbiAgICAvKipcbiAgICAgKiBRdWluY3VueCAoSW5jb25qdW5jdClcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAqL1xuICAgIHN0YXRpYyBTWU1CT0xfUVVJTkNVTlhfQ09ERSA9IFwiJlwiO1xuXG4gICAgc3RhdGljIFNZTUJPTF9TRU1JU0VYVElMRV9DT0RFID0gXCInXCI7XG5cbiAgICAvKipcbiAgICAgKiBTZW1pLVNxdWFyZSBvciBPY3RpbGVcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAqL1xuICAgIHN0YXRpYyBTWU1CT0xfU0VNSVNRVUFSRV9DT0RFID0gXCIoXCI7XG5cbiAgICAvKipcbiAgICAgKiBTZXNxdWlxdWFkcmF0ZSBvciBUcmktT2N0aWxlIG9yIFNlc3F1aXNxdWFyZVxuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICovXG4gICAgc3RhdGljIFNZTUJPTF9UUklPQ1RJTEVfQ09ERSA9IFwiKVwiO1xuXG4gICAgc3RhdGljIFNZTUJPTF9CSVFVSU5USUxFX0NPREUgPSBcIipcIjtcblxuICAgIHN0YXRpYyBTWU1CT0xfUVVJTlRJTEVfQ09ERSA9IFwiwrdcIjtcblxuICAgIHN0YXRpYyBTWU1CT0xfU0VNSVFVSU5USUxFX0NPREUgPSBcIixcIjtcblxuICAgIHN0YXRpYyBTWU1CT0xfUVVJTkRFQ0lMRV9DT0RFID0gXCLCuFwiO1xuXG4gICAgLyoqXG4gICAgICogUXVpbnRpbGUgKHZhcmlhbnQpXG4gICAgICpcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAqL1xuICAgIHN0YXRpYyBTWU1CT0xfUVVJTlRJTEVfVkFSSUFOVF9DT0RFID0gXCIrXCI7XG5cblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBpZiAodGhpcyBpbnN0YW5jZW9mIFNWR1V0aWxzKSB7XG4gICAgICAgICAgICB0aHJvdyBFcnJvcignVGhpcyBpcyBhIHN0YXRpYyBjbGFzcyBhbmQgY2Fubm90IGJlIGluc3RhbnRpYXRlZC4nKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIFNWRyBkb2N1bWVudFxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB3aWR0aFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBoZWlnaHRcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1NWR0RvY3VtZW50fVxuICAgICAqL1xuICAgIHN0YXRpYyBTVkdEb2N1bWVudCh3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICAgIGNvbnN0IHN2ZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTVkdVdGlscy5TVkdfTkFNRVNQQUNFLCBcInN2Z1wiKTtcbiAgICAgICAgc3ZnLnNldEF0dHJpYnV0ZSgneG1sbnMnLCBTVkdVdGlscy5TVkdfTkFNRVNQQUNFKTtcbiAgICAgICAgc3ZnLnNldEF0dHJpYnV0ZSgndmVyc2lvbicsIFwiMS4xXCIpO1xuICAgICAgICBzdmcuc2V0QXR0cmlidXRlKCd2aWV3Qm94JywgXCIwIDAgXCIgKyB3aWR0aCArIFwiIFwiICsgaGVpZ2h0KTtcbiAgICAgICAgcmV0dXJuIHN2Z1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIFNWRyBncm91cCBlbGVtZW50XG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQHJldHVybiB7U1ZHR3JvdXBFbGVtZW50fVxuICAgICAqL1xuICAgIHN0YXRpYyBTVkdHcm91cCgpIHtcbiAgICAgICAgY29uc3QgZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTVkdVdGlscy5TVkdfTkFNRVNQQUNFLCBcImdcIik7XG4gICAgICAgIHJldHVybiBnXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgU1ZHIHBhdGggZWxlbWVudFxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEByZXR1cm4ge1NWR0dyb3VwRWxlbWVudH1cbiAgICAgKi9cbiAgICBzdGF0aWMgU1ZHUGF0aCgpIHtcbiAgICAgICAgY29uc3QgcGF0aCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTVkdVdGlscy5TVkdfTkFNRVNQQUNFLCBcInBhdGhcIik7XG4gICAgICAgIHJldHVybiBwYXRoXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgU1ZHIG1hc2sgZWxlbWVudFxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBlbGVtZW50SURcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1NWR01hc2tFbGVtZW50fVxuICAgICAqL1xuICAgIHN0YXRpYyBTVkdNYXNrKGVsZW1lbnRJRCkge1xuICAgICAgICBjb25zdCBtYXNrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFNWR1V0aWxzLlNWR19OQU1FU1BBQ0UsIFwibWFza1wiKTtcbiAgICAgICAgbWFzay5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBlbGVtZW50SUQpXG4gICAgICAgIHJldHVybiBtYXNrXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU1ZHIGNpcmN1bGFyIHNlY3RvclxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBwYXJhbSB7aW50fSB4IC0gY2lyY2xlIHggY2VudGVyIHBvc2l0aW9uXG4gICAgICogQHBhcmFtIHtpbnR9IHkgLSBjaXJjbGUgeSBjZW50ZXIgcG9zaXRpb25cbiAgICAgKiBAcGFyYW0ge2ludH0gcmFkaXVzIC0gY2lyY2xlIHJhZGl1cyBpbiBweFxuICAgICAqIEBwYXJhbSB7aW50fSBhMSAtIGFuZ2xlRnJvbSBpbiByYWRpYW5zXG4gICAgICogQHBhcmFtIHtpbnR9IGEyIC0gYW5nbGVUbyBpbiByYWRpYW5zXG4gICAgICogQHBhcmFtIHtpbnR9IHRoaWNrbmVzcyAtIGZyb20gb3V0c2lkZSB0byBjZW50ZXIgaW4gcHhcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1NWR0VsZW1lbnR9IHNlZ21lbnRcbiAgICAgKi9cbiAgICBzdGF0aWMgU1ZHU2VnbWVudCh4LCB5LCByYWRpdXMsIGExLCBhMiwgdGhpY2tuZXNzLCBsRmxhZywgc0ZsYWcpIHtcbiAgICAgICAgLy8gQHNlZSBTVkcgUGF0aCBhcmM6IGh0dHBzOi8vd3d3LnczLm9yZy9UUi9TVkcvcGF0aHMuaHRtbCNQYXRoRGF0YVxuICAgICAgICBjb25zdCBMQVJHRV9BUkNfRkxBRyA9IGxGbGFnIHx8IDA7XG4gICAgICAgIGNvbnN0IFNXRUVUX0ZMQUcgPSBzRmxhZyB8fCAwO1xuXG4gICAgICAgIGNvbnN0IHNlZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoU1ZHVXRpbHMuU1ZHX05BTUVTUEFDRSwgXCJwYXRoXCIpO1xuICAgICAgICBzZWdtZW50LnNldEF0dHJpYnV0ZShcImRcIiwgXCJNIFwiICsgKHggKyB0aGlja25lc3MgKiBNYXRoLmNvcyhhMSkpICsgXCIsIFwiICsgKHkgKyB0aGlja25lc3MgKiBNYXRoLnNpbihhMSkpICsgXCIgbCBcIiArICgocmFkaXVzIC0gdGhpY2tuZXNzKSAqIE1hdGguY29zKGExKSkgKyBcIiwgXCIgKyAoKHJhZGl1cyAtIHRoaWNrbmVzcykgKiBNYXRoLnNpbihhMSkpICsgXCIgQSBcIiArIHJhZGl1cyArIFwiLCBcIiArIHJhZGl1cyArIFwiLDAgLFwiICsgTEFSR0VfQVJDX0ZMQUcgKyBcIiwgXCIgKyBTV0VFVF9GTEFHICsgXCIsIFwiICsgKHggKyByYWRpdXMgKiBNYXRoLmNvcyhhMikpICsgXCIsIFwiICsgKHkgKyByYWRpdXMgKiBNYXRoLnNpbihhMikpICsgXCIgbCBcIiArICgocmFkaXVzIC0gdGhpY2tuZXNzKSAqIC1NYXRoLmNvcyhhMikpICsgXCIsIFwiICsgKChyYWRpdXMgLSB0aGlja25lc3MpICogLU1hdGguc2luKGEyKSkgKyBcIiBBIFwiICsgdGhpY2tuZXNzICsgXCIsIFwiICsgdGhpY2tuZXNzICsgXCIsMCAsXCIgKyBMQVJHRV9BUkNfRkxBRyArIFwiLCBcIiArIDEgKyBcIiwgXCIgKyAoeCArIHRoaWNrbmVzcyAqIE1hdGguY29zKGExKSkgKyBcIiwgXCIgKyAoeSArIHRoaWNrbmVzcyAqIE1hdGguc2luKGExKSkpO1xuICAgICAgICBzZWdtZW50LnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJub25lXCIpO1xuICAgICAgICByZXR1cm4gc2VnbWVudDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTVkcgY2lyY2xlXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQHBhcmFtIHtpbnR9IGN4XG4gICAgICogQHBhcmFtIHtpbnR9IGN5XG4gICAgICogQHBhcmFtIHtpbnR9IHJhZGl1c1xuICAgICAqXG4gICAgICogQHJldHVybiB7U1ZHRWxlbWVudH0gY2lyY2xlXG4gICAgICovXG4gICAgc3RhdGljIFNWR0NpcmNsZShjeCwgY3ksIHJhZGl1cykge1xuICAgICAgICBjb25zdCBjaXJjbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoU1ZHVXRpbHMuU1ZHX05BTUVTUEFDRSwgXCJjaXJjbGVcIik7XG4gICAgICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJjeFwiLCBjeCk7XG4gICAgICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJjeVwiLCBjeSk7XG4gICAgICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJyXCIsIHJhZGl1cyk7XG4gICAgICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwibm9uZVwiKTtcbiAgICAgICAgcmV0dXJuIGNpcmNsZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTVkcgbGluZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHgxXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHkyXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHgyXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHkyXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtTVkdFbGVtZW50fSBsaW5lXG4gICAgICovXG4gICAgc3RhdGljIFNWR0xpbmUoeDEsIHkxLCB4MiwgeTIpIHtcbiAgICAgICAgY29uc3QgbGluZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTVkdVdGlscy5TVkdfTkFNRVNQQUNFLCBcImxpbmVcIik7XG4gICAgICAgIGxpbmUuc2V0QXR0cmlidXRlKFwieDFcIiwgeDEpO1xuICAgICAgICBsaW5lLnNldEF0dHJpYnV0ZShcInkxXCIsIHkxKTtcbiAgICAgICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJ4MlwiLCB4Mik7XG4gICAgICAgIGxpbmUuc2V0QXR0cmlidXRlKFwieTJcIiwgeTIpO1xuICAgICAgICByZXR1cm4gbGluZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTVkcgdGV4dFxuICAgICAqXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHhcbiAgICAgKiBAcGFyYW0ge051bWJlcn0geVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0eHRcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gW3NjYWxlXVxuICAgICAqXG4gICAgICogQHJldHVybiB7U1ZHRWxlbWVudH0gbGluZVxuICAgICAqL1xuICAgIHN0YXRpYyBTVkdUZXh0KHgsIHksIHR4dCkge1xuICAgICAgICBjb25zdCB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFNWR1V0aWxzLlNWR19OQU1FU1BBQ0UsIFwidGV4dFwiKTtcbiAgICAgICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJ4XCIsIHgpO1xuICAgICAgICB0ZXh0LnNldEF0dHJpYnV0ZShcInlcIiwgeSk7XG4gICAgICAgIHRleHQuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIFwibm9uZVwiKTtcbiAgICAgICAgdGV4dC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0eHQpKTtcblxuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTVkcgc3ltYm9sXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB4UG9zXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHlQb3NcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1NWR0VsZW1lbnR9XG4gICAgICovXG4gICAgc3RhdGljIFNWR1N5bWJvbChuYW1lLCB4UG9zLCB5UG9zLCApIHtcbiAgICAgICAgc3dpdGNoIChuYW1lKSB7XG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9BUzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYXNTeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfRFM6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRzU3ltYm9sKHhQb3MsIHlQb3MpXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX01DOlxuICAgICAgICAgICAgICAgIHJldHVybiBtY1N5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9JQzpcbiAgICAgICAgICAgICAgICByZXR1cm4gaWNTeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfQVJJRVM6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFyaWVzU3ltYm9sKHhQb3MsIHlQb3MpXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1RBVVJVUzpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGF1cnVzU3ltYm9sKHhQb3MsIHlQb3MpXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0dFTUlOSTpcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2VtaW5pU3ltYm9sKHhQb3MsIHlQb3MpXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0NBTkNFUjpcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FuY2VyU3ltYm9sKHhQb3MsIHlQb3MpXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0xFTzpcbiAgICAgICAgICAgICAgICByZXR1cm4gbGVvU3ltYm9sKHhQb3MsIHlQb3MpXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1ZJUkdPOlxuICAgICAgICAgICAgICAgIHJldHVybiB2aXJnb1N5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9MSUJSQTpcbiAgICAgICAgICAgICAgICByZXR1cm4gbGlicmFTeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfU0NPUlBJTzpcbiAgICAgICAgICAgICAgICByZXR1cm4gc2NvcnBpb1N5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9TQUdJVFRBUklVUzpcbiAgICAgICAgICAgICAgICByZXR1cm4gc2FnaXR0YXJpdXNTeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfQ0FQUklDT1JOOlxuICAgICAgICAgICAgICAgIHJldHVybiBjYXByaWNvcm5TeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfQVFVQVJJVVM6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFxdWFyaXVzU3ltYm9sKHhQb3MsIHlQb3MpXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1BJU0NFUzpcbiAgICAgICAgICAgICAgICByZXR1cm4gcGlzY2VzU3ltYm9sKHhQb3MsIHlQb3MpXG5cblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfU1VOOlxuICAgICAgICAgICAgICAgIHJldHVybiBzdW5TeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfTU9PTjpcbiAgICAgICAgICAgICAgICByZXR1cm4gbW9vblN5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9NRVJDVVJZOlxuICAgICAgICAgICAgICAgIHJldHVybiBtZXJjdXJ5U3ltYm9sKHhQb3MsIHlQb3MpXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1ZFTlVTOlxuICAgICAgICAgICAgICAgIHJldHVybiB2ZW51c1N5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9FQVJUSDpcbiAgICAgICAgICAgICAgICByZXR1cm4gZWFydGhTeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfTUFSUzpcbiAgICAgICAgICAgICAgICByZXR1cm4gbWFyc1N5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9KVVBJVEVSOlxuICAgICAgICAgICAgICAgIHJldHVybiBqdXBpdGVyU3ltYm9sKHhQb3MsIHlQb3MpXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1NBVFVSTjpcbiAgICAgICAgICAgICAgICByZXR1cm4gc2F0dXJuU3ltYm9sKHhQb3MsIHlQb3MpXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1VSQU5VUzpcbiAgICAgICAgICAgICAgICByZXR1cm4gdXJhbnVzU3ltYm9sKHhQb3MsIHlQb3MpXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX05FUFRVTkU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5lcHR1bmVTeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfUExVVE86XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBsdXRvU3ltYm9sKHhQb3MsIHlQb3MpXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0NISVJPTjpcbiAgICAgICAgICAgICAgICByZXR1cm4gY2hpcm9uU3ltYm9sKHhQb3MsIHlQb3MpXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0xJTElUSDpcbiAgICAgICAgICAgICAgICByZXR1cm4gbGlsaXRoU3ltYm9sKHhQb3MsIHlQb3MpXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX05OT0RFOlxuICAgICAgICAgICAgICAgIHJldHVybiBubm9kZVN5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9TTk9ERTpcbiAgICAgICAgICAgICAgICByZXR1cm4gc25vZGVTeW1ib2woeFBvcywgeVBvcylcblxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9SRVRST0dSQURFOlxuICAgICAgICAgICAgICAgIHJldHVybiByZXRyb2dyYWRlU3ltYm9sKHhQb3MsIHlQb3MpXG5cblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfQ09OSlVOQ1RJT046XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbmp1bmN0aW9uU3ltYm9sKHhQb3MsIHlQb3MpXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX09QUE9TSVRJT046XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9wcG9zaXRpb25TeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfU1FVQVJFOlxuICAgICAgICAgICAgICAgIHJldHVybiBzcXVhcmVTeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfVFJJTkU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRyaW5lU3ltYm9sKHhQb3MsIHlQb3MpXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1NFWFRJTEU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNleHRpbGVTeW1ib2woeFBvcywgeVBvcylcblxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfUVVJTkNVTlg6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHF1aW5jdW54U3ltYm9sKHhQb3MsIHlQb3MpXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1NFTUlTRVhUSUxFOlxuICAgICAgICAgICAgICAgIHJldHVybiBzZW1pc2V4dGlsZVN5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9TRU1JU1FVQVJFOlxuICAgICAgICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfT0NUSUxFOlxuICAgICAgICAgICAgICAgIHJldHVybiBzZW1pc3F1YXJlU3ltYm9sKHhQb3MsIHlQb3MpXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1RSSU9DVElMRTpcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJpb2N0aWxlU3ltYm9sKHhQb3MsIHlQb3MpXG5cbiAgICAgICAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1FVSU5USUxFOlxuICAgICAgICAgICAgICAgIHJldHVybiBxdWludGlsZVN5bWJvbCh4UG9zLCB5UG9zKVxuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGNvbnN0IHVua25vd25TeW1ib2wgPSBTVkdVdGlscy5TVkdDaXJjbGUoeFBvcywgeVBvcywgOClcbiAgICAgICAgICAgICAgICB1bmtub3duU3ltYm9sLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCBcIiMzMzNcIilcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5rbm93blN5bWJvbFxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogQXNjZW5kYW50IHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gYXNTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX0FTX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBEZXNjZW5kYW50IHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gZHNTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX0RTX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBNZWRpdW0gY29lbGkgc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBtY1N5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfTUNfQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIEltbXVtIGNvZWxpIHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gaWNTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX0lDX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBBcmllcyBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGFyaWVzU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9BUklFU19DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogVGF1cnVzIHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gdGF1cnVzU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9UQVVSVVNfQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIEdlbWluaSBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGdlbWluaVN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfR0VNSU5JX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBDYW5jZXIgc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBjYW5jZXJTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX0NBTkNFUl9DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogTGVvIHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gbGVvU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9MRU9fQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFZpcmdvIHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gdmlyZ29TeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX1ZJUkdPX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBMaWJyYSBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGxpYnJhU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9MSUJSQV9DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogU2NvcnBpbyBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHNjb3JwaW9TeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX1NDT1JQSU9fQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFNhZ2l0dGFyaXVzIHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gc2FnaXR0YXJpdXNTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX1NBR0lUVEFSSVVTX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBDYXByaWNvcm4gc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBjYXByaWNvcm5TeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX0NBUFJJQ09STl9DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogQXF1YXJpdXMgc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBhcXVhcml1c1N5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfQVFVQVJJVVNfQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFBpc2NlcyBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHBpc2Nlc1N5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfUElTQ0VTX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBTdW4gc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBzdW5TeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX1NVTl9DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogTW9vbiBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIG1vb25TeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX01PT05fQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIE1lcmN1cnkgc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBtZXJjdXJ5U3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9NRVJDVVJZX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBWZW51cyBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHZlbnVzU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9WRU5VU19DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogRWFydGggc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBlYXJ0aFN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfRUFSVEhfQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIE1hcnMgc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBtYXJzU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9NQVJTX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBKdXBpdGVyIHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24ganVwaXRlclN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfSlVQSVRFUl9DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogU2F0dXJuIHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gc2F0dXJuU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9TQVRVUk5fQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFVyYW51cyBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHVyYW51c1N5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfVVJBTlVTX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBOZXB0dW5lIHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gbmVwdHVuZVN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfTkVQVFVORV9DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogUGx1dG8gc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBwbHV0b1N5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfUExVVE9fQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIENoaXJvbiBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGNoaXJvblN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfQ0hJUk9OX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBMaWxpdGggc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBsaWxpdGhTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX0xJTElUSF9DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogTk5vZGUgc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBubm9kZVN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfTk5PREVfQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFNOb2RlIHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gc25vZGVTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX1NOT0RFX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXRyb2dyYWRlIHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gcmV0cm9ncmFkZVN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfUkVUUk9HUkFERV9DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogQ29uanVuY3Rpb24gc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBjb25qdW5jdGlvblN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfQ09OSlVOQ1RJT05fQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIE9wcG9zaXRpb24gc3ltYm9sXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBvcHBvc2l0aW9uU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9PUFBPU0lUSU9OX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBTcXVhcmVzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHNxdWFyZVN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfU1FVQVJFX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBUcmluZSBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHRyaW5lU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9UUklORV9DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogU2V4dGlsZSBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHNleHRpbGVTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX1NFWFRJTEVfQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFF1aW5jdW54IHN5bWJvbFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gcXVpbmN1bnhTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX1FVSU5DVU5YX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBTZW1pc2V4dGlsZSBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHNlbWlzZXh0aWxlU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9TRU1JU0VYVElMRV9DT0RFKVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgKiBTZW1pc3F1YXJlIHN5bWJvbFxuICAgICAgICAqIGFrYSBRdWludGlsZS8gT2N0aWxlIHN5bWJvbFxuICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBzZW1pc3F1YXJlU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9TRU1JU1FVQVJFX0NPREUpXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBRdWludGlsZVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gcXVpbnRpbGVTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX1NFTUlTUVVBUkVfQ09ERSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFRyaW9jdGlsZSBzeW1ib2xcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHRyaW9jdGlsZVN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfVFJJT0NUSUxFX0NPREUpXG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCB7XG4gICAgU1ZHVXRpbHMgYXNcbiAgICAgICAgZGVmYXVsdFxufVxuIiwiLyoqXG4gKiBAY2xhc3NcbiAqIEBjbGFzc2Rlc2MgVXRpbGl0eSBjbGFzc1xuICogQHB1YmxpY1xuICogQHN0YXRpY1xuICogQGhpZGVjb25zdHJ1Y3RvclxuICovXG5jbGFzcyBVdGlscyB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgaWYgKHRoaXMgaW5zdGFuY2VvZiBVdGlscykge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoJ1RoaXMgaXMgYSBzdGF0aWMgY2xhc3MgYW5kIGNhbm5vdCBiZSBpbnN0YW50aWF0ZWQuJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgREVHXzM2MCA9IDM2MFxuICAgIHN0YXRpYyBERUdfMTgwID0gMTgwXG4gICAgc3RhdGljIERFR18wID0gMFxuXG4gICAgLyoqXG4gICAgICogR2VuZXJhdGUgcmFuZG9tIElEXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAqL1xuICAgIHN0YXRpYyBnZW5lcmF0ZVVuaXF1ZUlkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zdCByYW5kb21OdW1iZXIgPSBNYXRoLnJhbmRvbSgpICogMTAwMDAwMDtcbiAgICAgICAgY29uc3QgdGltZXN0YW1wID0gRGF0ZS5ub3coKTtcbiAgICAgICAgY29uc3QgdW5pcXVlSWQgPSBgaWRfJHtyYW5kb21OdW1iZXJ9XyR7dGltZXN0YW1wfWA7XG4gICAgICAgIHJldHVybiB1bmlxdWVJZDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbnZlcnRlZCBkZWdyZWUgdG8gcmFkaWFuXG4gICAgICogQHN0YXRpY1xuICAgICAqXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGFuZ2xlSW5kZWdyZWVcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gc2hpZnRJbkRlZ3JlZVxuICAgICAqIEByZXR1cm4ge051bWJlcn1cbiAgICAgKi9cbiAgICBzdGF0aWMgZGVncmVlVG9SYWRpYW4gPSBmdW5jdGlvbiAoYW5nbGVJbkRlZ3JlZSwgc2hpZnRJbkRlZ3JlZSA9IDApIHtcbiAgICAgICAgcmV0dXJuIChzaGlmdEluRGVncmVlIC0gYW5nbGVJbkRlZ3JlZSkgKiBNYXRoLlBJIC8gMTgwXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29udmVydHMgcmFkaWFuIHRvIGRlZ3JlZVxuICAgICAqIEBzdGF0aWNcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSByYWRpYW5cbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAgICovXG4gICAgc3RhdGljIHJhZGlhblRvRGVncmVlID0gZnVuY3Rpb24gKHJhZGlhbikge1xuICAgICAgICByZXR1cm4gKHJhZGlhbiAqIDE4MCAvIE1hdGguUEkpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2FsY3VsYXRlcyBhIHBvc2l0aW9uIG9mIHRoZSBwb2ludCBvbiB0aGUgY2lyY2xlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGN4IC0gY2VudGVyIHhcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gY3kgLSBjZW50ZXIgeVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSByYWRpdXMgLSBjaXJjbGUgcmFkaXVzXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGFuZ2xlSW5SYWRpYW5zXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IC0ge3g6TnVtYmVyLCB5Ok51bWJlcn1cbiAgICAgKi9cbiAgICBzdGF0aWMgcG9zaXRpb25PbkNpcmNsZShjeCwgY3ksIHJhZGl1cywgYW5nbGVJblJhZGlhbnMpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHg6IChyYWRpdXMgKiBNYXRoLmNvcyhhbmdsZUluUmFkaWFucykgKyBjeCksXG4gICAgICAgICAgICB5OiAocmFkaXVzICogTWF0aC5zaW4oYW5nbGVJblJhZGlhbnMpICsgY3kpXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2FsY3VsYXRlcyB0aGUgYW5nbGUgYmV0d2VlbiB0aGUgbGluZSAoMiBwb2ludHMpIGFuZCB0aGUgeC1heGlzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHgxXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHkxXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHgyXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHkyXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IC0gZGVncmVlXG4gICAgICovXG4gICAgc3RhdGljIHBvc2l0aW9uVG9BbmdsZSh4MSwgeTEsIHgyLCB5Mikge1xuICAgICAgICBjb25zdCBkeCA9IHgyIC0geDE7XG4gICAgICAgIGNvbnN0IGR5ID0geTIgLSB5MTtcbiAgICAgICAgY29uc3QgYW5nbGVJblJhZGlhbnMgPSBNYXRoLmF0YW4yKGR5LCBkeCk7XG4gICAgICAgIHJldHVybiBVdGlscy5yYWRpYW5Ub0RlZ3JlZShhbmdsZUluUmFkaWFucylcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDYWxjdWxhdGVzIG5ldyBwb3NpdGlvbiBvZiBwb2ludHMgb24gY2lyY2xlIHdpdGhvdXQgb3ZlcmxhcHBpbmcgZWFjaCBvdGhlclxuICAgICAqXG4gICAgICogQHRocm93cyB7RXJyb3J9IC0gSWYgdGhlcmUgaXMgbm8gcGxhY2Ugb24gdGhlIGNpcmNsZSB0byBwbGFjZSBwb2ludHMuXG4gICAgICogQHBhcmFtIHtBcnJheX0gcG9pbnRzIC0gW3tuYW1lOlwiYVwiLCBhbmdsZToxMH0sIHtuYW1lOlwiYlwiLCBhbmdsZToyMH1dXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGNvbGxpc2lvblJhZGl1cyAtIHBvaW50IHJhZGl1c1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSByYWRpdXMgLSBjaXJjbGUgcmFkaXVzXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IC0ge1wiTW9vblwiOjMwLCBcIlN1blwiOjYwLCBcIk1lcmN1cnlcIjo4NiwgLi4ufVxuICAgICAqL1xuICAgIHN0YXRpYyBjYWxjdWxhdGVQb3NpdGlvbldpdGhvdXRPdmVybGFwcGluZyhwb2ludHMsIGNvbGxpc2lvblJhZGl1cywgY2lyY2xlUmFkaXVzKSB7XG4gICAgICAgIGNvbnN0IFNURVAgPSAxIC8vZGVncmVlXG5cbiAgICAgICAgY29uc3QgY2VsbFdpZHRoID0gMTAgLy9kZWdyZWVcbiAgICAgICAgY29uc3QgbnVtYmVyT2ZDZWxscyA9IFV0aWxzLkRFR18zNjAgLyBjZWxsV2lkdGhcbiAgICAgICAgY29uc3QgZnJlcXVlbmN5ID0gbmV3IEFycmF5KG51bWJlck9mQ2VsbHMpLmZpbGwoMClcbiAgICAgICAgZm9yIChjb25zdCBwb2ludCBvZiBwb2ludHMpIHtcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gTWF0aC5mbG9vcihwb2ludC5hbmdsZSAvIGNlbGxXaWR0aClcbiAgICAgICAgICAgIGZyZXF1ZW5jeVtpbmRleF0gKz0gMVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gSW4gdGhpcyBhbGdvcml0aG0gdGhlIG9yZGVyIG9mIHBvaW50cyBpcyBjcnVjaWFsLlxuICAgICAgICAvLyBBdCB0aGF0IHBvaW50IGluIHRoZSBjaXJjbGUsIHdoZXJlIHRoZSBwZXJpb2QgY2hhbmdlcyBpbiB0aGUgY2lyY2xlIChmb3IgaW5zdGFuY2U6WzM1OCwzNTksMCwxXSksIHRoZSBwb2ludHMgYXJlIGFycmFuZ2VkIGluIGluY29ycmVjdCBvcmRlci5cbiAgICAgICAgLy8gQXMgYSBzdGFydGluZyBwb2ludCwgSSB0cnkgdG8gZmluZCBhIHBsYWNlIHdoZXJlIHRoZXJlIGFyZSBubyBwb2ludHMuIFRoaXMgcGxhY2UgSSB1c2UgYXMgU1RBUlRfQU5HTEUuXG4gICAgICAgIGNvbnN0IFNUQVJUX0FOR0xFID0gY2VsbFdpZHRoICogZnJlcXVlbmN5LmZpbmRJbmRleChjb3VudCA9PiBjb3VudCA9PSAwKVxuXG4gICAgICAgIGNvbnN0IF9wb2ludHMgPSBwb2ludHMubWFwKHBvaW50ID0+IHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgbmFtZTogcG9pbnQubmFtZSxcbiAgICAgICAgICAgICAgICBhbmdsZTogcG9pbnQuYW5nbGUgPCBTVEFSVF9BTkdMRSA/IHBvaW50LmFuZ2xlICsgVXRpbHMuREVHXzM2MCA6IHBvaW50LmFuZ2xlXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgX3BvaW50cy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gYS5hbmdsZSAtIGIuYW5nbGVcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBSZWN1cnNpdmUgZnVuY3Rpb25cbiAgICAgICAgY29uc3QgYXJyYW5nZVBvaW50cyA9ICgpID0+IHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsbiA9IF9wb2ludHMubGVuZ3RoOyBpIDwgbG47IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBvaW50UG9zaXRpb24gPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKDAsIDAsIGNpcmNsZVJhZGl1cywgVXRpbHMuZGVncmVlVG9SYWRpYW4oX3BvaW50c1tpXS5hbmdsZSkpXG4gICAgICAgICAgICAgICAgX3BvaW50c1tpXS54ID0gcG9pbnRQb3NpdGlvbi54XG4gICAgICAgICAgICAgICAgX3BvaW50c1tpXS55ID0gcG9pbnRQb3NpdGlvbi55XG5cbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGk7IGorKykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBkaXN0YW5jZSA9IE1hdGguc3FydChNYXRoLnBvdyhfcG9pbnRzW2ldLnggLSBfcG9pbnRzW2pdLngsIDIpICsgTWF0aC5wb3coX3BvaW50c1tpXS55IC0gX3BvaW50c1tqXS55LCAyKSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkaXN0YW5jZSA8ICgyICogY29sbGlzaW9uUmFkaXVzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgX3BvaW50c1tpXS5hbmdsZSArPSBTVEVQXG4gICAgICAgICAgICAgICAgICAgICAgICBfcG9pbnRzW2pdLmFuZ2xlIC09IFNURVBcbiAgICAgICAgICAgICAgICAgICAgICAgIGFycmFuZ2VQb2ludHMoKSAvLz09PT09PT4gUmVjdXJzaXZlIGNhbGxcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGFycmFuZ2VQb2ludHMoKVxuXG4gICAgICAgIHJldHVybiBfcG9pbnRzLnJlZHVjZSgoYWNjdW11bGF0b3IsIHBvaW50LCBjdXJyZW50SW5kZXgpID0+IHtcbiAgICAgICAgICAgIGFjY3VtdWxhdG9yW3BvaW50Lm5hbWVdID0gcG9pbnQuYW5nbGVcbiAgICAgICAgICAgIHJldHVybiBhY2N1bXVsYXRvclxuICAgICAgICB9LCB7fSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiB0aGUgYW5nbGUgY29sbGlkZXMgd2l0aCB0aGUgcG9pbnRzXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gYW5nbGVcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBhbmdsZXNMaXN0XG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IFtjb2xsaXNpb25SYWRpdXNdXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqL1xuICAgIHN0YXRpYyBpc0NvbGxpc2lvbihhbmdsZSwgYW5nbGVzTGlzdCwgY29sbGlzaW9uUmFkaXVzID0gMTApIHtcblxuICAgICAgICBjb25zdCBwb2ludEluQ29sbGlzaW9uID0gYW5nbGVzTGlzdC5maW5kKHBvaW50ID0+IHtcblxuICAgICAgICAgICAgbGV0IGEgPSAocG9pbnQgLSBhbmdsZSkgPiBVdGlscy5ERUdfMTgwID8gYW5nbGUgKyBVdGlscy5ERUdfMzYwIDogYW5nbGVcbiAgICAgICAgICAgIGxldCBwID0gKGFuZ2xlIC0gcG9pbnQpID4gVXRpbHMuREVHXzE4MCA/IHBvaW50ICsgVXRpbHMuREVHXzM2MCA6IHBvaW50XG5cbiAgICAgICAgICAgIHJldHVybiBNYXRoLmFicyhhIC0gcCkgPD0gY29sbGlzaW9uUmFkaXVzXG4gICAgICAgIH0pXG5cbiAgICAgICAgcmV0dXJuIHBvaW50SW5Db2xsaXNpb24gPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogdHJ1ZVxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyB0aGUgY29udGVudCBvZiBhbiBlbGVtZW50XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZWxlbWVudElEXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2JlZm9yZUhvb2tdXG4gICAgICpcbiAgICAgKiBAd2FybmluZyAtIEl0IHJlbW92ZXMgRXZlbnQgTGlzdGVuZXJzIHRvby5cbiAgICAgKiBAd2FybmluZyAtIFlvdSB3aWxsIChwcm9iYWJseSkgZ2V0IG1lbW9yeSBsZWFrIGlmIHlvdSBkZWxldGUgZWxlbWVudHMgdGhhdCBoYXZlIGF0dGFjaGVkIGxpc3RlbmVyc1xuICAgICAqL1xuICAgIHN0YXRpYyBjbGVhblVwKGVsZW1lbnRJRCwgYmVmb3JlSG9vaykge1xuICAgICAgICBsZXQgZWxtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudElEKVxuICAgICAgICBpZiAoISBlbG0pIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgKHR5cGVvZiBiZWZvcmVIb29rID09PSAnZnVuY3Rpb24nKSAmJiBiZWZvcmVIb29rKClcblxuICAgICAgICBlbG0uaW5uZXJIVE1MID0gXCJcIlxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogU2ltcGxlIGNvZGUgZm9yIGNvbmZpZyBiYXNlZCB0ZW1wbGF0ZSBzdHJpbmdzXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdGVtcGxhdGVTdHJpbmdcbiAgICAgKiBAcGFyYW0gdGVtcGxhdGVWYXJzXG4gICAgICogQHJldHVybnMgeyp9XG4gICAgICovXG4gICAgc3RhdGljIGZpbGxUZW1wbGF0ZSA9IGZ1bmN0aW9uICh0ZW1wbGF0ZVN0cmluZywgdGVtcGxhdGVWYXJzKSB7XG4gICAgICAgIGxldCBmdW5jID0gbmV3IEZ1bmN0aW9uKC4uLk9iamVjdC5rZXlzKHRlbXBsYXRlVmFycyksIFwicmV0dXJuIGBcIiArIHRlbXBsYXRlU3RyaW5nICsgXCJgO1wiKVxuICAgICAgICByZXR1cm4gZnVuYyguLi5PYmplY3QudmFsdWVzKHRlbXBsYXRlVmFycykpO1xuICAgIH1cbn1cblxuXG5leHBvcnQge1xuICAgIFV0aWxzIGFzXG4gICAgICAgIGRlZmF1bHRcbn1cblxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgVW5pdmVyc2UgZnJvbSAnLi91bml2ZXJzZS9Vbml2ZXJzZS5qcydcbmltcG9ydCBTVkdVdGlscyBmcm9tICcuL3V0aWxzL1NWR1V0aWxzLmpzJ1xuaW1wb3J0IFV0aWxzIGZyb20gJy4vdXRpbHMvVXRpbHMuanMnXG5pbXBvcnQgUmFkaXhDaGFydCBmcm9tICcuL2NoYXJ0cy9SYWRpeENoYXJ0LmpzJ1xuaW1wb3J0IFRyYW5zaXRDaGFydCBmcm9tICcuL2NoYXJ0cy9UcmFuc2l0Q2hhcnQuanMnXG5cbmV4cG9ydCB7VW5pdmVyc2UsIFNWR1V0aWxzLCBVdGlscywgUmFkaXhDaGFydCwgVHJhbnNpdENoYXJ0fVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9