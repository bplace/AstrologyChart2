import RadixChart from '../charts/RadixChart.js';
import SVGUtils from '../utils/SVGUtils.js';
import Chart from './Chart.js'
import Utils from '../utils/Utils.js';
import AspectUtils from '../utils/AspectUtils.js';
import Point from '../points/Point.js'
import DefaultSettings from '../settings/DefaultSettings.js';

/**
 * @class
 * @classdesc Points and cups are displayed from outside the Universe.
 * @public
 * @extends {Chart}
 */
class TransitChart extends Chart {

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
        if (! (radix instanceof RadixChart)) {
            throw new Error('Bad param radix.')
        }

        super(radix.getUniverse().getSettings())

        this.#radix = radix
        this.#settings = this.#radix.getUniverse().getSettings()
        this.#centerX = this.#settings.CHART_VIEWBOX_WIDTH / 2
        this.#centerY = this.#settings.CHART_VIEWBOX_HEIGHT / 2
        this.#radius = Math.min(this.#centerX, this.#centerY) - this.#settings.CHART_PADDING

        this.#root = SVGUtils.SVGGroup()
        this.#root.setAttribute("id", `${this.#settings.HTML_ELEMENT_ID}-${this.#settings.TRANSIT_ID}`)
        this.#radix.getUniverse().getSVGDocument().appendChild(this.#root);

        // Top layer to put on top elements through <use>
        // https://developer.mozilla.org/fr/docs/Web/SVG/Reference/Element/use
        let topLayerGroup = SVGUtils.SVGGroup();
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
        aspects = aspects ?? this.#settings.DEFAULT_ASPECTS ?? DefaultSettings.DEFAULT_ASPECTS

        return AspectUtils.getAspects(fromPoints, toPoints, aspects)
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
        Utils.cleanUp(aspectsWrapper.getAttribute("id"), this.#beforeCleanUpHook)

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

        const circle = SVGUtils.SVGCircle(this.#centerX, this.#centerY, this.#radix.getCenterCircleRadius())
        circle.setAttribute('fill', this.#settings.ASPECTS_BACKGROUND_COLOR)
        aspectsWrapper.appendChild(circle)

        aspectsWrapper.appendChild(AspectUtils.drawAspects(this.#radix.getCenterCircleRadius(), this.#radix.getAscendantShift(), this.#settings, aspectsList))

        return this
    }

    // ## PRIVATE ##############################

    /*
     * Draw radix chart
     * @param {Object} data
     */
    #draw(data) {

        // radix reDraw
        Utils.cleanUp(this.#root.getAttribute('id'), this.#beforeCleanUpHook)
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

        const wrapper = SVGUtils.SVGGroup()

        let startAngle = this.#radix.getAscendantShift()
        for (let i = 0; i < NUMBER_OF_DIVIDERS; i++) {
            let startPoint = Utils.positionOnCircle(this.#centerX, this.#centerY, this.#getRullerCircleRadius(), Utils.degreeToRadian(startAngle))
            let endPoint = Utils.positionOnCircle(this.#centerX, this.#centerY, (i % 2) ? this.getRadius() - ((this.getRadius() - this.#getRullerCircleRadius()) / 2) : this.getRadius(), Utils.degreeToRadian(startAngle))
            const line = SVGUtils.SVGLine(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
            line.setAttribute("stroke", this.#settings.CHART_LINE_COLOR);
            line.setAttribute("stroke-width", this.#settings.CHART_STROKE);
            wrapper.appendChild(line);

            startAngle += STEP
        }

        const circle = SVGUtils.SVGCircle(this.#centerX, this.#centerY, this.#getRullerCircleRadius());
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
        const wrapper = SVGUtils.SVGGroup()
        wrapper.classList.add('c-transit-points')

        const positions = Utils.calculatePositionWithoutOverlapping(points, this.#settings.POINT_COLLISION_RADIUS, this.#getPointCircleRadius())

        for (const pointData of points) {
            const pointGroup = SVGUtils.SVGGroup();
            pointGroup.classList.add('c-transit-point')
            pointGroup.classList.add('c-transit-point--' + pointData.name.toLowerCase())

            const point = new Point(pointData, cusps, this.#settings)
            const pointPosition = Utils.positionOnCircle(this.#centerX, this.#centerX, this.#getRullerCircleRadius() - ((this.getRadius() - this.#getRullerCircleRadius()) / 4), Utils.degreeToRadian(point.getAngle(), this.#radix.getAscendantShift()))
            const symbolPosition = Utils.positionOnCircle(this.#centerX, this.#centerX, this.#getPointCircleRadius(), Utils.degreeToRadian(positions[point.getName()], this.#radix.getAscendantShift()))

            // ruler mark
            const rulerLineEndPosition = Utils.positionOnCircle(this.#centerX, this.#centerX, this.#getRullerCircleRadius(), Utils.degreeToRadian(point.getAngle(), this.#radix.getAscendantShift()))

            if (this.#settings.DRAW_RULER_MARK) {
                const rulerLine = SVGUtils.SVGLine(pointPosition.x, pointPosition.y, rulerLineEndPosition.x, rulerLineEndPosition.y)
                rulerLine.setAttribute("stroke", this.#settings.CHART_LINE_COLOR);
                rulerLine.setAttribute("stroke-width", this.#settings.CHART_STROKE);
                pointGroup.appendChild(rulerLine);
            }

            /**
             * Line from the ruler to the celestial body
             * @type {{x, y}}
             */
            const pointerLineEndPosition = Utils.positionOnCircle(this.#centerX, this.#centerX, this.#getPointCircleRadius(), Utils.degreeToRadian(positions[point.getName()], this.#radix.getAscendantShift()))

            let pointerLine;
            if (this.#settings.DRAW_RULER_MARK) {
                pointerLine = SVGUtils.SVGLine(pointPosition.x, pointPosition.y, (pointPosition.x + pointerLineEndPosition.x) / 2, (pointPosition.y + pointerLineEndPosition.y) / 2)
            } else {
                pointerLine = SVGUtils.SVGLine(rulerLineEndPosition.x, rulerLineEndPosition.y, (pointPosition.x + pointerLineEndPosition.x) / 2, (pointPosition.y + pointerLineEndPosition.y) / 2)
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
            const symbol = point.getSymbol(symbolPosition.x, symbolPosition.y, Utils.DEG_0, this.#settings.POINT_PROPERTIES_SHOW)
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

        const wrapper = SVGUtils.SVGGroup()
        wrapper.classList.add('c-transit-cusps')

        const textRadius = this.#getCenterCircleRadius() + ((this.#getRullerCircleRadius() - this.#getCenterCircleRadius()) / 6)

        for (let i = 0; i < cusps.length; i++) {

            const isLineInCollisionWithPoint = ! this.#settings.CHART_ALLOW_HOUSE_OVERLAP && Utils.isCollision(cusps[i].angle, pointsPositions, this.#settings.POINT_COLLISION_RADIUS / 2)

            const startPos = Utils.positionOnCircle(this.#centerX, this.#centerY, this.#getCenterCircleRadius(), Utils.degreeToRadian(cusps[i].angle, this.#radix.getAscendantShift()))
            const endPos = Utils.positionOnCircle(this.#centerX, this.#centerY, isLineInCollisionWithPoint ? this.#getCenterCircleRadius() + ((this.#getRullerCircleRadius() - this.#getCenterCircleRadius()) / 6) : this.#getRullerCircleRadius(), Utils.degreeToRadian(cusps[i].angle, this.#radix.getAscendantShift()))

            const line = SVGUtils.SVGLine(startPos.x, startPos.y, endPos.x, endPos.y)
            line.setAttribute("stroke", mainAxisIndexes.includes(i) ? this.#settings.CHART_MAIN_AXIS_COLOR : this.#settings.CHART_LINE_COLOR)
            line.setAttribute("stroke-width", mainAxisIndexes.includes(i) ? this.#settings.CHART_MAIN_STROKE : this.#settings.CHART_STROKE)
            wrapper.appendChild(line);

            const startCusp = cusps[i].angle
            const endCusp = cusps[(i + 1) % 12].angle
            const gap = endCusp - startCusp > 0 ? endCusp - startCusp : endCusp - startCusp + Utils.DEG_360
            const textAngle = startCusp + gap / 2

            const textPos = Utils.positionOnCircle(this.#centerX, this.#centerY, textRadius, Utils.degreeToRadian(textAngle, this.#radix.getAscendantShift()))
            const text = SVGUtils.SVGText(textPos.x, textPos.y, `${i + 1}`)
            text.setAttribute("font-family", this.#settings.CHART_FONT_FAMILY)
            text.setAttribute("text-anchor", "middle") // start, middle, end
            text.setAttribute("dominant-baseline", "middle")
            text.setAttribute("font-size", this.#settings.RADIX_HOUSE_FONT_SIZE)
            text.setAttribute("fill", this.#settings.CHART_HOUSE_NUMBER_COLOR)
            text.classList.add('c-radix-cusps__house-number')

            if (this.#settings.INSERT_ELEMENT_TITLE) {
                text.appendChild(SVGUtils.SVGTitle(this.#settings.ELEMENT_TITLES.cusps[i + 1]))
            }

            wrapper.appendChild(text)

            if (this.#settings.DRAW_HOUSE_DEGREE) {
                if (Array.isArray(this.#settings.HOUSE_DEGREE_FILTER) && ! this.#settings.HOUSE_DEGREE_FILTER.includes(i + 1)) {
                    continue;
                }
                const degreePos = Utils.positionOnCircle(this.#centerX, this.#centerY, this.#getRullerCircleRadius() - (this.getRadius() - this.#getRullerCircleRadius()), Utils.degreeToRadian(startCusp - 1.75, this.#radix.getAscendantShift()))
                const degree = SVGUtils.SVGText(degreePos.x, degreePos.y, Math.floor(cusps[i].angle % 30) + "º")
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
            name: SVGUtils.SYMBOL_AS, angle: cusps[0].angle
        }, {
            name: SVGUtils.SYMBOL_IC, angle: cusps[3].angle
        }, {
            name: SVGUtils.SYMBOL_DS, angle: cusps[6].angle
        }, {
            name: SVGUtils.SYMBOL_MC, angle: cusps[9].angle
        },]

        const wrapper = SVGUtils.SVGGroup()
        wrapper.classList.add('c-transit-axis')

        const rad1 = this.getRadius();
        const rad2 = this.getRadius() + AXIS_LENGTH;

        for (const axis of axisList) {
            const axisGroup = SVGUtils.SVGGroup()
            axisGroup.classList.add('c-transit-axis__axis')
            axisGroup.classList.add('c-transit-axis__axis--' + axis.name.toLowerCase())

            let startPoint = Utils.positionOnCircle(this.#centerX, this.#centerY, rad1, Utils.degreeToRadian(axis.angle, this.#radix.getAscendantShift()))
            let endPoint = Utils.positionOnCircle(this.#centerX, this.#centerY, rad2, Utils.degreeToRadian(axis.angle, this.#radix.getAscendantShift()))
            let line = SVGUtils.SVGLine(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
            line.setAttribute("stroke", this.#settings.CHART_MAIN_AXIS_COLOR);
            line.setAttribute("stroke-width", this.#settings.CHART_MAIN_STROKE);
            axisGroup.appendChild(line);

            let textPoint = Utils.positionOnCircle(this.#centerX, this.#centerY, rad2 + AXIS_LENGTH, Utils.degreeToRadian(axis.angle, this.#radix.getAscendantShift()))
            let symbol;
            let SHIFT_X = 0;
            let SHIFT_Y = 0;
            const STEP = 0; // Décalage disabled

            switch (axis.name) {
                case "As":
                    SHIFT_X -= STEP
                    SHIFT_Y -= STEP
                    SVGUtils.SYMBOL_AS_CODE = this.#settings.SYMBOL_AS_CODE ?? SVGUtils.SYMBOL_AS_CODE;
                    symbol = SVGUtils.SVGSymbol(axis.name, textPoint.x + SHIFT_X, textPoint.y + SHIFT_Y)
                    symbol.setAttribute("text-anchor", "middle")
                    symbol.setAttribute("dominant-baseline", "middle")
                    break;
                case "Ds":
                    SHIFT_X += STEP
                    SHIFT_Y -= STEP
                    SVGUtils.SYMBOL_DS_CODE = this.#settings.SYMBOL_DS_CODE ?? SVGUtils.SYMBOL_DS_CODE;
                    symbol = SVGUtils.SVGSymbol(axis.name, textPoint.x + SHIFT_X, textPoint.y + SHIFT_Y)
                    symbol.setAttribute("text-anchor", "middle")
                    symbol.setAttribute("dominant-baseline", "middle")
                    break;
                case "Mc":
                    SHIFT_Y -= STEP
                    SVGUtils.SYMBOL_MC_CODE = this.#settings.SYMBOL_MC_CODE ?? SVGUtils.SYMBOL_MC_CODE;
                    symbol = SVGUtils.SVGSymbol(axis.name, textPoint.x + SHIFT_X, textPoint.y + SHIFT_Y)
                    symbol.setAttribute("text-anchor", "middle")
                    symbol.setAttribute("dominant-baseline", "middle")
                    break;
                case "Ic":
                    SHIFT_Y += STEP
                    SVGUtils.SYMBOL_IC_CODE = this.#settings.SYMBOL_IC_CODE ?? SVGUtils.SYMBOL_IC_CODE;
                    symbol = SVGUtils.SVGSymbol(axis.name, textPoint.x + SHIFT_X, textPoint.y + SHIFT_Y)
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
                symbol.appendChild(SVGUtils.SVGTitle(this.#settings.ELEMENT_TITLES.axis[axis.name]))
            }

            axisGroup.appendChild(symbol);
            wrapper.appendChild(axisGroup)
        }

        this.#root.appendChild(wrapper)
    }

    #drawBorders() {
        const wrapper = SVGUtils.SVGGroup()
        wrapper.classList.add('c-transit-borders')

        const outerCircle = SVGUtils.SVGCircle(this.#centerX, this.#centerY, this.getRadius())
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

export {
    TransitChart as default
}
