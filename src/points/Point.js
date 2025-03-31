import SVGUtils from '../utils/SVGUtils.js';
import Utils from '../utils/Utils.js';

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
        const wrapper = SVGUtils.SVGGroup()

        const symbol = SVGUtils.SVGSymbol(this.#name, xPos, yPos)

        if (this.#settings.CLASS_CELESTIAL) {
            symbol.setAttribute('class', this.#settings.CLASS_CELESTIAL + ' ' + this.#settings.CLASS_CELESTIAL + '--' + this.#name.toLowerCase());
        }

        wrapper.appendChild(symbol)

        if (isProperties === false) {
            return wrapper //======>
        }

        const chartCenterX = this.#settings.CHART_VIEWBOX_WIDTH / 2
        const chartCenterY = this.#settings.CHART_VIEWBOX_HEIGHT / 2
        const angleFromSymbolToCenter = Utils.positionToAngle(xPos, yPos, chartCenterX, chartCenterY)

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
            const angleInSignPosition = Utils.positionOnCircle(xPos, yPos, this.#settings.POINT_PROPERTIES_ANGLE_OFFSET * this.#settings.POINT_COLLISION_RADIUS, Utils.degreeToRadian(-angleFromSymbolToCenter, angleShift))

            // It is possible to rotate the text, when uncomment a line bellow.
            //textWrapper.setAttribute("transform", `rotate(${angleFromSymbolToCenter},${textPosition.x},${textPosition.y})`)

            /*
             * Allows change the angle string, e.g. add the degree symbol ° with the ^ character from Astronomicon
             */
            let anglePosition = Utils.fillTemplate(this.#settings.ANGLE_TEMPLATE, {angle: this.getAngleInSign()});

            const angleInSignText = SVGUtils.SVGText(angleInSignPosition.x, angleInSignPosition.y, anglePosition)
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
            const retrogradePosition = Utils.positionOnCircle(xPos, yPos, this.#settings.POINT_PROPERTIES_RETROGRADE_OFFSET * this.#settings.POINT_COLLISION_RADIUS, Utils.degreeToRadian(-angleFromSymbolToCenter, angleShift))

            const retrogradeText = SVGUtils.SVGText(retrogradePosition.x, retrogradePosition.y, SVGUtils.SYMBOL_RETROGRADE_CODE)
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
            const dignitiesPosition = Utils.positionOnCircle(xPos, yPos, this.#settings.POINT_PROPERTIES_DIGNITY_OFFSET * this.#settings.POINT_COLLISION_RADIUS, Utils.degreeToRadian(-angleFromSymbolToCenter, angleShift))
            const dignitiesText = SVGUtils.SVGText(dignitiesPosition.x, dignitiesPosition.y, this.getDignity())
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
        let angle = this.#angle % Utils.DEG_360
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
            case SVGUtils.SYMBOL_SUN:
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

            case SVGUtils.SYMBOL_MOON:
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

            case SVGUtils.SYMBOL_MERCURY:
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

            case SVGUtils.SYMBOL_VENUS:
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

            case SVGUtils.SYMBOL_MARS:
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

            case SVGUtils.SYMBOL_JUPITER:
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

            case SVGUtils.SYMBOL_SATURN:
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

            case SVGUtils.SYMBOL_URANUS:
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

            case SVGUtils.SYMBOL_NEPTUNE:
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

            case SVGUtils.SYMBOL_PLUTO:
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

export {
    Point as
        default
}
