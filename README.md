# Demo app
Steps to reproduce issue:
```
git clone git@github.com:maxmil7/async-demo.git -b no-context
cd async-demo
npm i
node .
```
+ Navigate to http://localhost:7000/test
+ In the console, you'll notice the following statements printed out:

    ```
    Creating span for request undefined
    Creating span for request /
    Creating span for request /v1/trace
    Creating span for request /v1/trace
    Creating span for request /v1/trace
    ```

