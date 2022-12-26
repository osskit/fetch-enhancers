<p align="center"> 
<img width="350" height="200" src="https://user-images.githubusercontent.com/15312980/175094325-5d4a0459-79e5-4386-ade9-e46d4cef36f2.svg"/>
</p>

<div align="center">
A collection of composable enhancers on top of standard JS FetchAPI.

Bring your own FetchAPI implementation :pray:       
 </div>


# install

```
yarn add @osskit/fetch-enhancers
```

# Usage

```
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
