# no-span-context demo
App to demo that outgoing http request spans are not set as active in context.  
This app makes a request to `example.com` as part of middleware execution.  
The issue is that the spanId in context is always of the root span.

+ To reproduce the issue, please execute the following steps
```
git clone git@github.com:maxmil7/async-demo.git -b no-context
cd async-demo
npm i
node .
```
+ Navigate to http://localhost:7000/test
+ In the console, you'll notice the following statements printed out:

    ```
    SpanID for example.com: ', 2fd4c74a87ccc888
    SpanID for initial: ', 2fd4c74a87ccc888
    ```

