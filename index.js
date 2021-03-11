
const { NodeTracerProvider } = require('@opentelemetry/node');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { SimpleSpanProcessor, ConsoleSpanExporter } = require('@opentelemetry/tracing');
const { context, getSpanContext } = require('@opentelemetry/api');


const provider = new NodeTracerProvider();

registerInstrumentations({
  tracerProvider: provider,
  instrumentations: [
      new HttpInstrumentation()
  ]

});

provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
provider.register();



function printCurrentSpanId(domain) {
    const { spanId } = getSpanContext(context.active());
    console.log(`SpanID for ${domain}: ', ${spanId}`);
}


const app = require('express')();
const http = require('http');

app.use(function call(req, res, next) {

    http.request({ host: 'www.example.com' }, function(response) {
        let str = '';

        response.on('data', function (chunk) {
            printCurrentSpanId('example.com');
            str += chunk;
        });

        response.on('end', function () {
            next();
        });
    }).end();
});


app.get('/test', function(req, res) {
    printCurrentSpanId('initial');
    res.send('OK');
})

app.listen(7000, () => 'Server started listening');

