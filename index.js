
const { startTracing } = require('@splunk/otel');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');

startTracing({
    instrumentations: [
        new HttpInstrumentation({
            requestHook: (span, req) => {
                console.log('Creating span for request', req.path);
            }
        })
    ]
});

const app = require('express')();
const http = require('http');

app.use(function call(req, res, next) {

    http.request({ host: 'www.example.com' }, function(response) {
        let str = '';

        response.on('data', function (chunk) {
            str += chunk;
        });

        response.on('end', function () {
            next();
        });
    }).end();
});


app.get('/test', function(req, res) {
    res.send('OK');
})

app.listen(7000, () => 'Server started listening');

