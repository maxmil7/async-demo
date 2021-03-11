
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
const fetch = require('node-fetch');

app.use(async function call(req, res, next) {
    const r = await fetch('http://www.example.com');
    printCurrentSpanId('example.com');
    await r.text();
    next();
})

app.get('/test', function(req, res) {
    printCurrentSpanId('initial');
    res.send('OK');
})

app.listen(7000, () => 'Server started listening');

