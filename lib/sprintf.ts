/**
 * Return a formatted string
 * discuss at: http://phpjs.org/functions/sprintf
 */
function sprintf() {
    let i = 0;
    const regex = /%%|%(\d+\$)?([-+\'#0 ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([scboxXuidfegEG])/g;
    const a = arguments, format = a[i++];
    const pad = function (str, len, chr, leftJustify) {
        if (!chr) {
            chr = ' ';
        }
        const padding = (str.length >= len) ? '' : Array(1 + len - str.length >>> 0).join(chr);
        return leftJustify ? str + padding : padding + str;
    };
    const justify = function (value, prefix, leftJustify, minWidth, zeroPad = undefined, customPadChar = undefined) {
        const diff = minWidth - value.length;
        if (diff > 0) {
            if (leftJustify || !zeroPad) {
                value = pad(value, minWidth, customPadChar, leftJustify);
            } else {
                value = value.slice(0, prefix.length) + pad('', diff, '0', true) + value.slice(prefix.length);
            }
        }
        return value;
    };
    const formatBaseX = function (value, base, prefix, leftJustify, minWidth, precision, zeroPad) {
        const number = value >>> 0;
        prefix = prefix && number && { '2': '0b', '8': '0', '16': '0x' }[base] || '';
        value = prefix + pad(number.toString(base), precision || 0, '0', false);
        return justify(value, prefix, leftJustify, minWidth, zeroPad);
    };
    const formatString = function (value, leftJustify, minWidth, precision, zeroPad, customPadChar = undefined) {
        if (precision != null) {
            value = value.slice(0, precision);
        }
        return justify(value, '', leftJustify, minWidth, zeroPad, customPadChar);
    };
    const doFormat = function (substring, valueIndex, flags, minWidth, _, precision, type) {
        let number;
        let prefix;
        let method;
        let textTransform;
        let value;
        if (substring === '%%') {
            return '%';
        }
        let leftJustify = false, positivePrefix = '', zeroPad = false, prefixBaseX = false, customPadChar = ' ';
        let flagsl = flags.length;
        for (let j = 0; flags && j < flagsl; j++) {
            switch (flags.charAt(j)) {
                case ' ':
                    positivePrefix = ' ';
                    break;
                case '+':
                    positivePrefix = '+';
                    break;
                case '-':
                    leftJustify = true;
                    break;
                case `'`:
                    customPadChar = flags.charAt(j + 1);
                    break;
                case '0':
                    zeroPad = true;
                    break;
                case '#':
                    prefixBaseX = true;
                    break;
            }
        }
        if (!minWidth) {
            minWidth = 0;
        } else if (minWidth === '*') {
            minWidth = +a[i++];
        } else if (minWidth.charAt(0) === '*') {
            minWidth = +a[minWidth.slice(1, -1)];
        } else {
            minWidth = +minWidth;
        }
        if (minWidth < 0) {
            minWidth = -minWidth;
            leftJustify = true;
        }
        if (!isFinite(minWidth)) {
            throw new Error('sprintf: (minimum-)width must be finite');
        }
        if (!precision) {
            precision = 'fFeE'.indexOf(type) > -1 ? 6 : (type === 'd') ? 0 : undefined;
        } else if (precision === '*') {
            precision = +a[i++];
        } else if (precision.charAt(0) === '*') {
            precision = +a[precision.slice(1, -1)];
        } else {
            precision = +precision;
        }
        value = valueIndex ? a[valueIndex.slice(0, -1)] : a[i++];
        switch (type) {
            case 's':
                return formatString(String(value), leftJustify, minWidth, precision, zeroPad, customPadChar);
            case 'c':
                return formatString(String.fromCharCode(+value), leftJustify, minWidth, precision, zeroPad);
            case 'b':
                return formatBaseX(value, 2, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
            case 'o':
                return formatBaseX(value, 8, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
            case 'x':
                return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
            case 'X':
                return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad).toUpperCase();
            case 'u':
                return formatBaseX(value, 10, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
            case 'i':
            case 'd':
                number = (+value) | 0;
                prefix = number < 0 ? '-' : positivePrefix;
                value = prefix + pad(String(Math.abs(number)), precision, '0', false);
                return justify(value, prefix, leftJustify, minWidth, zeroPad);
            case 'e':
            case 'E':
            case 'f':
            case 'F':
            case 'g':
            case 'G':
                number = +value;
                prefix = number < 0 ? '-' : positivePrefix;
                method = ['toExponential', 'toFixed', 'toPrecision']['efg'.indexOf(type.toLowerCase())];
                textTransform = ['toString', 'toUpperCase']['eEfFgG'.indexOf(type) % 2];
                value = prefix + Math.abs(number)[method](precision);
                return justify(value, prefix, leftJustify, minWidth, zeroPad)[textTransform]();
            default:
                return substring;
        }
    };
    return format.replace(regex, doFormat);
}

export default sprintf;
