/**
 * Converts the given document to use only _PascalCase_ property names,
 * instead of _camelCase_ ones. Does not convert inner objects' properties.
 * @param {Object} obj - The object to sanitize.
 * @returns {Object} New object with the PascalCased properties.
 * If the input is not of type 'object', the function returns it unaltered.
 */
function propsToPascalCase (obj) {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    let result = {};

    for (let i in obj) {
        let key = i;
        let val = obj[i];

        result[stringToPascalCase(key)] = val;
    }

    return result;
}

/**
 * Converts a string to PascalCase.
 * @param {String} string - The string to convert.
 * @author {@link https://stackoverflow.com/users/7768064|kalicki2k)
 * @see {@link https://stackoverflow.com/a/53952925/8691998|StackOverflow}
 */
function stringToPascalCase(string) {
    return `${string}`
      .replace(new RegExp(/[-_]+/, 'g'), ' ')
      .replace(new RegExp(/[^\w\s]/, 'g'), '')
      .replace(
        new RegExp(/\s+(.)(\w+)/, 'g'),
        ($1, $2, $3) => `${$2.toUpperCase() + $3.toLowerCase()}`
      )
      .replace(new RegExp(/\s/, 'g'), '')
      .replace(new RegExp(/\w/), s => s.toUpperCase());
}

module.exports = {
    propsToPascalCase
};