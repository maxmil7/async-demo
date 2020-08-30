# async-demo
App to demo context mixup when Open telemetry library is used with wreck request library v12  
Demo app is a simple express app which makes a downstream call to `example.com`  
It has a middleware which makes a call to `github.com`
Execution flow is as follows
```
App receives request -> Middleware calls github.com -> Request handler calls `example.com`
```

+ To reproduce the issue, please execute the following steps
```
git clone git@github.com:maxmil7/async-demo.git
cd async-demo
npm i
node .
```
+ Navigate to http://localhost:7000/test
+ In the console, you will see three spans create for the request
    + Incoming request span for `/test`
    + Outgoing request span for `github.com`
    + Outgoing request span for `example.com`

+ Ideally, both the outgoing request spans should be children of the incoming request span
But the `example.com` span is a child of `github.com` span