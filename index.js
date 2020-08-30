
const { SimpleSpanProcessor, ConsoleSpanExporter } = require('@opentelemetry/tracing');
const { NodeTracerProvider } = require('@opentelemetry/node');

//Registering Otel provider
const provider = new NodeTracerProvider({
    plugins: {
        express: { enabled: false }
    }
});
provider.register();
provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
    
//Creating app 
const app = require('express')();
const https = require('https');
const Wreck = require('wreck');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

//Middleware uses wreck v12 to make a downstream request to github.com
app.use((req, res, next) => {
    Wreck.request('GET', 'https://github.com', {}, 
    function (error, response) {
        if (error) {
            console.log(err.stack);
            next(error);
            return;
        }
        Wreck.read(response, null, function (error, body) {
            if (error) {
                next(error);
                return;
            }
            response.body = body;
            next();
        });
    })
});

//Application makes downstream request to example.com
app.get('/test', async (req, res) => {
    https.request('https://www.example.com', (remote) => {
        remote.pipe(res);
    }).end();
});

app.listen(7000, () => 'Server started listening');

