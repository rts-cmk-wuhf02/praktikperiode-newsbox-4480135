exports.handler = function(event, context, callback) {
    console.log(event, context)
    callback(null, {
        statusCode: 200,
        body: "Hello, World"
    });
}