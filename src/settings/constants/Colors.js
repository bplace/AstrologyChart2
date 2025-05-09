// noinspection JSUnusedGlobalSymbols

/**
 * Chart background color
 * @constant
 * @type {String}
 * @default #fff
 */
export const CHART_BACKGROUND_COLOR = "none";

/**
 * Planets background color
 * @constant
 * @type {String}
 * @default #fff
 */
export const PLANETS_BACKGROUND_COLOR = "#fff";

/**
 * Aspects background color
 * @constant
 * @type {String}
 * @default #fff
 */
export const ASPECTS_BACKGROUND_COLOR = "#eee";

/*
* Default color of circles in charts
* @constant
* @type {String}
* @default #333
*/
export const CHART_CIRCLE_COLOR = "#333";

/*
* Default color of lines in charts
* @constant
* @type {String}
* @default #333
*/
export const CHART_LINE_COLOR = "#666";

/*
* Default color of text in charts
* @constant
* @type {String}
* @default #333
*/
export const CHART_TEXT_COLOR = "#bbb";

/*
* Default color of cusps number
* @constant
* @type {String}
* @default #333
*/
export const CHART_HOUSE_NUMBER_COLOR = "#333";

/*
* Default color of mqin axis - As, Ds, Mc, Ic
* @constant
* @type {String}
* @default #000
*/
export const CHART_MAIN_AXIS_COLOR = "#000";

/*
* Default color of signs in charts (arise symbol, taurus symbol, ...)
* @constant
* @type {String}
* @default #000
*/
export const CHART_SIGNS_COLOR = "#333";

/*
* Default color of planets on the chart (Sun symbol, Moon symbol, ...)
* @constant
* @type {String}
* @default #000
*/
export const CHART_POINTS_COLOR = "#000";

/*
* Default color for point properties - angle in sign, dignities, retrograde
* @constant
* @type {String}
* @default #333
*/
export const POINT_PROPERTIES_COLOR = "#333"

/*
* Aries color
* @constant
* @type {String}
* @default #FF4500
*/
export const COLOR_ARIES = "#FF4500";

/*
* Taurus color
* @constant
* @type {String}
* @default #8B4513
*/
export const COLOR_TAURUS = "#8B4513";

/*
* Geminy color
* @constant
* @type {String}
* @default #87CEEB
*/
export const COLOR_GEMINI = "#87CEEB";

/*
* Cancer color
* @constant
* @type {String}
* @default #27AE60
*/
export const COLOR_CANCER = "#27AE60";

/*
* Leo color
* @constant
* @type {String}
* @default #FF4500
*/
export const COLOR_LEO = "#FF4500";

/*
* Virgo color
* @constant
* @type {String}
* @default #8B4513
*/
export const COLOR_VIRGO = "#8B4513";

/*
* Libra color
* @constant
* @type {String}
* @default #87CEEB
*/
export const COLOR_LIBRA = "#87CEEB";

/*
* Scorpio color
* @constant
* @type {String}
* @default #27AE60
*/
export const COLOR_SCORPIO = "#27AE60";

/*
* Sagittarius color
* @constant
* @type {String}
* @default #FF4500
*/
export const COLOR_SAGITTARIUS = "#FF4500";

/*
* Capricorn color
* @constant
* @type {String}
* @default #8B4513
*/
export const COLOR_CAPRICORN = "#8B4513";

/*
* Aquarius color
* @constant
* @type {String}
* @default #87CEEB
*/
export const COLOR_AQUARIUS = "#87CEEB";

/*
* Pisces color
* @constant
* @type {String}
* @default #27AE60
*/
export const COLOR_PISCES = "#27AE60";

/*
* Color of circles in charts
* @constant
* @type {String}
* @default #333
*/
export const CIRCLE_COLOR = "#333";

/*
* Color of aspects
* @constant
* @type {Object}
*/
export const ASPECT_COLORS = {
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
export const PLANET_COLORS = {
    //Sun: "#000",
    //Moon: "#aaa",
}

/**
 * override individual sign symbol colors by zodiac index
 */
export const SIGN_COLORS = {
    //0: "#333"
}

/**
 * All signs labels in the right order
 * @type {string[]}
 */
export const SIGN_LABELS = [
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
export const TRANSIT_PLANET_COLORS = {
    //Sun: "#000",
    //Moon: "#aaa",
}
