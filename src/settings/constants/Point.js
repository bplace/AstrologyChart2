/*
* Point properties - angle in sign, dignities, retrograde
* @constant
* @type {Boolean}
* @default true
*/
export const POINT_PROPERTIES_SHOW = true

/*
* Point angle in sign
* @constant
* @type {Boolean}
* @default true
*/
export const POINT_PROPERTIES_SHOW_ANGLE = true

/**
 * Point sign
 * @type {boolean}
 */
export const POINT_PROPERTIES_SHOW_SIGN = false

/*
* Point dignity symbol
* @constant
* @type {Boolean}
* @default true
*/
export const POINT_PROPERTIES_SHOW_DIGNITY = true

/*
* Point retrograde symbol
* @constant
* @type {Boolean}
* @default true
*/
export const POINT_PROPERTIES_SHOW_RETROGRADE = true

/*
* Point dignity symbols - [domicile, detriment, exaltation, fall]
* @constant
* @type {Boolean}
* @default true
*/
export const POINT_PROPERTIES_DIGNITY_SYMBOLS = ["r", "d", "e", "f"];

/*
* Text size of Point description - angle in sign, dignities, retrograde
* @constant
* @type {Number}
* @default 6
*/
export const POINT_PROPERTIES_FONT_SIZE = 16

/*
* Text size of angle number
* @constant
* @type {Number}
* @default 6
*/
export const POINT_PROPERTIES_ANGLE_SIZE = 25

/*
* Text size of retrograde symbol
* @constant
* @type {Number}
* @default 6
*/
export const POINT_PROPERTIES_RETROGRADE_SIZE = 25

/*
* Text size of dignity symbol
* @constant
* @type {Number}
* @default 6
*/
export const POINT_PROPERTIES_DIGNITY_SIZE = 12

/*
* Angle offset multiplier
* @constant
* @type {Number}
* @default 6
*/
export const POINT_PROPERTIES_ANGLE_OFFSET = 2

/**
 * Offset from the planet
 * @type {number}
 */
export const POINT_PROPERTIES_SIGN_OFFSET = 3.5

/*
* Retrograde symbol offset multiplier
* @constant
* @type {Number}
* @default 6
*/
export const POINT_PROPERTIES_RETROGRADE_OFFSET = 5

/*
* Dignity symbol offset multiplier
* @constant
* @type {Number}
* @default 6
*/
export const POINT_PROPERTIES_DIGNITY_OFFSET = 6

/**
 * A point collision radius
 * @constant
 * @type {Number}
 * @default 2
 */
export const POINT_COLLISION_RADIUS = 12

/**
 * Tweak the angle string, e.g. add the degree symbol: "${angle}°"
 * @type {string}
 */
export const ANGLE_TEMPLATE = "${angle}"


/**
 * Classes for points
 * ====================================
 */
/**
 * Class for Celestial Bodies (Planet / Asteriod)
 * and Celestial Points (northnode, southnode, lilith)
 * @type {string}
 */
export const CLASS_CELESTIAL = '';
export const CLASS_POINT_ANGLE = '';
export const CLASS_POINT_SIGN = '';
export const CLASS_POINT_RETROGRADE = '';
export const CLASS_POINT_DIGNITY = '';

/**
 * Add a stroke around all points
 */
export const POINT_STROKE = false;
export const POINT_STROKE_COLOR = '#fff';
export const POINT_STROKE_WIDTH = 2;

export const POINT_PROPERTIES_SIGN_COLOR = null;