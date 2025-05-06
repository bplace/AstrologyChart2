// noinspection JSUnusedGlobalSymbols

/*
* Radix chart element ID
* @constant
* @type {String}
* @default radix
*/
export const RADIX_ID = "radix"

/*
* Font size - points (planets)
* @constant
* @type {Number}
* @default 27
*/
export const RADIX_POINTS_FONT_SIZE = 27

/*
* Font size - house cusp number
* @constant
* @type {Number}
* @default 27
*/
export const RADIX_HOUSE_FONT_SIZE = 20

/*
* Font size - signs
* @constant
* @type {Number}
* @default 27
*/
export const RADIX_SIGNS_FONT_SIZE = 27

/*
* Font size - axis (As, Ds, Mc, Ic)
* @constant
* @type {Number}
* @default 24
*/
export const RADIX_AXIS_FONT_SIZE = 32


export const SYMBOL_STROKE = false
export const SYMBOL_STROKE_COLOR = '#FFF'
export const SYMBOL_STROKE_WIDTH = '4'

export const SIGN_COLOR_CIRCLE = null

/**
 * Add <title></title> elements in the SVG
 * @type {boolean}
 */
export const INSERT_ELEMENT_TITLE = false

export const ELEMENT_TITLES = {
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