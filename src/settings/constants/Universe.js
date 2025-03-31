/**
 * Chart padding
 * @constant
 * @type {Number}
 * @default 10px
 */
export const CHART_PADDING = 40

/**
 * SVG viewBox width
 * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/viewBox
 * @constant
 * @type {Number}
 * @default 800
 */
export const CHART_VIEWBOX_WIDTH = 800

/**
 * SVG viewBox height
 * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/viewBox
 * @constant
 * @type {Number}
 * @default 800
 */
export const CHART_VIEWBOX_HEIGHT = 800

/*
* Line strength
* @constant
* @type {Number}
* @default 1
*/
export const CHART_STROKE = 1

/*
* Line strength of the main lines. For instance points, main axis, main circles
* @constant
* @type {Number}
* @default 1
*/
export const CHART_MAIN_STROKE = 2

/**
 * Line strength for minor aspects
 *
 * @type {number}
 */
export const CHART_STROKE_MINOR_ASPECT = 1

/**
 * No fill, only stroke
 * @constant
 * @type {boolean}
 * @default false
 */
export const CHART_STROKE_ONLY = false;

/**
 * Font family
 * @constant
 * @type {String}
 * @default
 */
export const CHART_FONT_FAMILY = "Astronomicon";

/**
 * Always draw the full house lines, even if it overlaps with planets
 * @constant
 * @type {boolean}
 * @default false
 */
export const CHART_ALLOW_HOUSE_OVERLAP = false;

/**
 * Draw mains axis symbols outside the chart: Ac, Mc, Ic, Dc
 * @constant
 * @type {boolean}
 * @default false
 */
export const CHART_DRAW_MAIN_AXIS = true;


/**
 * Stroke & fill
 * @constant
 * @type {boolean}
 * @default false
 */
export const CHART_STROKE_WITH_COLOR = false;


/**
 * All classnames
 */

/**
 * Class for the sign segment, behind the actual sign
 * @type {string}
 */
export const CLASS_SIGN_SEGMENT = '';

/**
 * Class for the sign
 * If not empty, another class will be added using same string, with a modifier like --sign_name
 * @type {string}
 */
export const CLASS_SIGN = '';

/**
 * Class for axis Ascendant, Midheaven, Descendant and Imum Coeli
 * If not empty, another class will be added using same string, with a modifier like --axis_name
 * @type {string}
 */
export const CLASS_AXIS = '';

/**
 * Class for Celestial Bodies (Planet / Asteriod)
 * and Celestial Points (northnode, southnode, lilith)
 * @type {string}
 */
export const CLASS_CELESTIAL = '';

/**
 * Class for the aspect character
 * @type {string}
 */
export const CLASS_SIGN_ASPECT = '';

/**
 * Class for aspect lines
 * @type {string}
 */
export const CLASS_SIGN_ASPECT_LINE = '';

/**
 * Use planet color for the chart line next to a planet
 * @type {boolean}
 */
export const PLANET_LINE_USE_PLANET_COLOR = false;

/**
 * Draw a ruler mark (tiny square) at planet position
 */
export const DRAW_RULER_MARK = true;