module.exports = function readStream (callback, stream) {
    var result = '';

    stream.setEncoding('utf8');

    stream.on('data', function (chunk) {
        result += chunk;
    });

    stream.on('end', function () {
        callback(null, result);
    });
}
