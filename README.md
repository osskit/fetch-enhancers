# fetch-enhancers

A collection of composable enhancers on top of standard js fetch api.
Does not include a fetch implementation, you need to bring your owm.

# install

```
yarn add @osskit/fetch-enhancers
```

# usage

```
import fetch from 'node-fetch'
import {withTimeout,withRetry} from '@osskit/fetch-enhancers'

const fetchWithTimeout = withTimeout(fetch, {
    timeout: {
      requestTimeoutMs: 5000
    }
  }); // *optional* global options 5 seconds timeout

await fetchWithTimeout('http://slow.com/get',{
    enhancers:{
        timeout:{
            requestTimeoutMs: 1000
        }
    }
}) // *optional* per call options 1 second timeout


const fetchWithRetry = withRetry(fetch,{
    retry:{
        minTimeout: 1000, //In MS
        retries: 3,
        factor: 5
    }
}); // *optional* global options (retry is async-retry's options object)

await fetchWithRetry('https://flakey.com/get,{
    retry:{
        minTimeout: 1000, //In MS
        retries: 10,
        factor: 2
    }
}); // *optional* per call options (retry is async-retry's options object)


// compose enhancers

const fetchWithRetryAndTimeout = withRetry(
  withTimeout(fetch, {
    timeout: {
      requestTimeoutMs: 5000
    }
  }),
  {
    retry: {
      minTimeout: 1000, //In MS
      retries: 3,
      factor: 5
    }
  }
);

const fetchWithRetryAndTimeout = withRetry(withTimeout(fetch)); // no global options

// per call options when composing enhancers
await fetchWithRetryAndTimeout('https://slow-and-flakey/get',{
    enhancers:{
        retry:{
            minTimeout: 1000, //In MS
            retries: 3,
            factor: 5
        },
        timeout:{
            requestTimeoutMs: 5000
        }
    }
})
```
