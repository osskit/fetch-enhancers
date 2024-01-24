<p align="center"> 
<img width="350" height="200" src="https://user-images.githubusercontent.com/15312980/175094325-5d4a0459-79e5-4386-ade9-e46d4cef36f2.svg" alt="fetch-enhancers logo"/>
</p>

<div align="center">
A collection of composable enhancers on top of standard JS FetchAPI.

Bring your own FetchAPI implementation :pray:

</div>

# Install

```shell
yarn add @osskit/fetch-enhancers
```

# Usage

```js
import { withTimeout, withRetry } from '@osskit/fetch-enhancers';

const fetchWithTimeout = withTimeout(fetch, {
  requestTimeoutMs: 5000,
}); // *optional* global options 5 seconds timeout

const fetchWithRetry = withRetry(fetch, {
  retries: 3,
  minTimeout: 1000, // In ms
  maxTimeout: 5000, // In ms
  factor: 5,
  randomize: false,
}); // *optional* global options object is async-retry's options object

// Compose enhancers:

const fetchWithRetryAndTimeout = withRetry(
  withTimeout(fetch, {
    requestTimeoutMs: 5000,
  }),
  {
    minTimeout: 1000, // In ms
    retries: 3,
    factor: 5,
  },
);
```
