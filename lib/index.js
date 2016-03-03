/**
 * @module dfsio-parse
 */
var readStream = require('./read-stream');

function splitRecords (delim, source) {
    if (arguments.length < 2) {
        return splitRecords.bind(null, delim);
    }
    return source.split(delim);
}

function splitFields (delim, source) {
    if (arguments.length < 2) {
        return splitFields.bind(null, delim);
    }
    return source.split(delim);
}

function trim (source) {
    return source.
        replace(/^(-|\s)+/, '').
        replace(/(-|\s)+$/, '');
}

function splitValues (delim, source) {
    if (arguments.length < 2) {
        return splitValues.bind(null, delim);
    }
    var idx = source.indexOf(delim);

    return [
        trim(source.slice(0, idx)),
        trim(source.slice(idx + 1))
    ];
}

function parse (error, source) {
    process.stdout.write(
        JSON.stringify(
            splitRecords('\n\n', source).
                // filter out empty chunks
                filter(function (chunk) { return chunk; }).
                // map to records/objects
                map(function (chunk) {
                    return splitFields('\n', chunk).
                        reduce(function (record, line) {
                            var props = splitValues(':', line);
                            record[props[0]] = props[1];
                            return record;
                        }, {});
                }),
            null,
            4
        ) + '\n'
    );
}

module.exports = {
    run: function () {
        readStream(parse, process.stdin);
    }
};
