<p align="center">
  <img width="100" height="100" src="https://avatars.githubusercontent.com/u/67231321?s=200&v=4">
   <h3 align="center">Scrape Do Node Client</h3>
   <p align="center">Scrape.do's official http client for node.js</p>
</p>

## How to install?

```bash
npm i @scrape-do/client
```
or install with github

```bash
npm install git://git@github.com/scrape-do/node-client
```

## How to build from scratch
If you want to contribute to the library or include your own customisations, you can recompile the library in this way.

```bash
git clone https://github.com/scrape-do/node-client
npm i
# build with
npm build
```

## Example Usages

### [Super (Residential & Mobile)](https://scrape.do/documentation/#super-residential--mobile?utm_source=github&utm_medium=node-client)

The super parameter enables the use of a residential proxy for the request. When this parameter is set to true, the request will be routed through a residential IP address. This means that the IP address will typically appear as if it belongs to a mobile network provider, adding an additional layer of anonymity and making the request look more like regular web traffic.

```typescript
const { ScrapeDo } = require("@scrape-do/client");

const client = new ScrapeDo("your_api_token");
const response = await client.sendRequest("GET", {
  url: "https://httpbin.co/anything",
  super: true,
});

console.log(response);
```

### [Geo Targeting](https://scrape.do/documentation/#geo-targeting?utm_source=github&utm_medium=node-client)

The geoCode parameter allows you to specify the geographic location from which the request should appear to originate. By setting a specific country code, such as "us" for the United States, the request will be routed through an IP address from that region. This is especially useful for scraping websites that serve region-specific content or pricing, allowing you to access data as if you were browsing from that location.

```typescript
const { ScrapeDo } = require("@scrape-do/client");

const client = new ScrapeDo("your_api_token");
const response = await client.sendRequest("GET", {
  url: "https://httpbin.co/anything",
  geoCode: "us",
});

console.log(response);
```

### [Regional Geo Targeting](https://scrape.do/documentation/#regional-geo-targeting?utm_source=github&utm_medium=node-client)

The regionalGeoCode parameter allows you to target requests from a broader geographic region, rather than a specific country. By specifying a regional code such as "europe" or "asia", your request will be routed through an IP address from that particular region. This is useful for scraping content that may be region-restricted, or for accessing region-specific data without the need to specify individual country codes.

```typescript
const { ScrapeDo } = require("@scrape-do/client");

const client = new ScrapeDo("your_api_token");
const response = await client.sendRequest("GET", {
  url: "https://httpbin.co/anything",
  regionalGeoCode: "europe",
});

console.log(response);
```

### [Sticky Sessions](https://scrape.do/documentation/#sticky-sessions?utm_source=github&utm_medium=node-client)

The sessionId parameter enables you to use the same proxy address for multiple requests over a certain period. By passing a unique integer value (e.g., sessionId=1234), you can maintain a persistent session with a single proxy. This is useful when you need consistent IP continuity for scraping operations or interacting with websites that track user sessions.

Key points to note:

- Session ID Range: The sessionId must be an integer between 0 and 1,000,000.
- Session Timeout: If no request is made using the sessionId for 5 minutes, the session will automatically expire.
- Session Failure: If a request made with a session ID fails, a new proxy will be assigned, and the session will reset.
- Geo Targeting Compatibility: When used with Geo Targeting or Regional Geo Targeting, the session will be locked to the specified country or region.
- No session required for new proxies: If you want to use a different proxy for each request, you don’t need to set a sessionId.
- Sessions only for successful requests: A session will only be created if the initial request is successful.

```typescript
const { ScrapeDo } = require("@scrape-do/client");

const client = new ScrapeDo("your_api_token");
const response = await client.sendRequest("GET", {
  url: "https://httpbin.co/anything",
  sessionId: "1234",
});

console.log(response);
```

### [Custom Headers](https://scrape.do/documentation/#custom-headers?utm_source=github&utm_medium=node-client)

The customHeaders option gives you full control over all headers sent to the target website. When you use customHeaders, the headers you provide will completely replace the default ones. This feature is useful when you need to define specific headers like User-Agent, Accept, Cookies, and more, ensuring that only your specified headers are sent with the request.

```typescript
const { ScrapeDo } = require("@scrape-do/client");

const client = new ScrapeDo("your_api_token");
const response = await client.sendRequest("GET", {
  url: "https://httpbin.co/anything",
  customHeaders: {
    Key: "Value",
  },
});

console.log(response);
```

### [Extra Headers](https://scrape.do/documentation/#extra-headers?utm_source=github&utm_medium=node-client)

extraHeaders is used when you want to add one or more headers specifically required by the target website, without altering the core headers automatically generated by the service. This is useful for passing additional information while maintaining the integrity of the existing request headers.

The following example returns the response of how you requested from httpbin.co. You should see the ‘Key’ header in the header section of the response.

```typescript
const { ScrapeDo } = require("@scrape-do/client");

const client = new ScrapeDo("your_api_token");
const response = await client.sendRequest("GET", {
  url: "https://httpbin.co/anything",
  extraHeaders: {
    Key: "Value",
  },
});

console.log(response);
```

### [Forward Headers](https://scrape.do/documentation/#forward-headers?utm_source=github&utm_medium=node-client)

The forwardHeaders option is ideal when you want to forward your custom headers directly to the target website without any additional headers being generated or modified by the service. This approach makes the request appear as if it is being made directly from your end, preserving the original header structure.

```typescript
const { ScrapeDo } = require("@scrape-do/client");

const client = new ScrapeDo("your_api_token");
const response = await client.sendRequest("GET", {
  url: "https://httpbin.co/anything",
  forwardHeaders: {
    Key: "Value",
  },
});

console.log(response);
```

### [JS Render](https://scrape.do/documentation/#js-render?utm_source=github&utm_medium=node-client)

The render parameter allows for the execution of JavaScript during the request, enabling full browser-like rendering. When this parameter is set to true, the service will render the target webpage as if it were being loaded in a real browser, executing all JavaScript, loading dynamic content, and handling client-side interactions. This approach is particularly useful for scraping websites that rely heavily on JavaScript to display their content, providing a more accurate and “humanized” view of the page.

```typescript
const { ScrapeDo } = require("@scrape-do/client");

const client = new ScrapeDo("your_api_token");
const response = await client.sendRequest("GET", {
  url: "https://httpbin.co/anything",
  render: true,
});

console.log(response);
```

### [Get account statistics](https://scrape.do/documentation/#usage-statistics-api?utm_source=github&utm_medium=node-client)

The statistics() method allows you to retrieve real-time usage statistics for your subscription. This API call returns details such as your current subscription status, the number of concurrent requests allowed, the total and remaining requests per month, and how many concurrent requests are still available.

Key information retrieved:

- IsActive: Indicates whether your subscription is active.
- ConcurrentRequest: The total number of concurrent requests your subscription supports.
- MaxMonthlyRequest: The maximum number of requests allowed per month.
- RemainingConcurrentRequest: The number of concurrent requests you have left at the current time.
- RemainingMonthlyRequest: The remaining number of requests you can send this month.

> [!WARNING]
> For security reasons, you can send up to 10 requests per minute to this endpoint. If you exceed this rate, you will receive a 429 Too Many Requests error.

```typescript
const { ScrapeDo } = require("@scrape-do/client");

const client = new ScrapeDo("your_api_token");
const stats = await client.statistics();

console.log(stats);
```

### Final bonus example (render, super, geoCode, playWithBrowser)

In this example, multiple parameters are combined to showcase advanced scraping capabilities. By using a combination of render, super, geoCode, and playWithBrowser, you can perform complex scraping tasks that require JavaScript execution, residential proxies, geographical targeting, and interactive browser actions:

- [render: true](https://scrape.do/documentation/#js-render?utm_source=github&utm_medium=node-client): Enables JavaScript execution to fully render the webpage, allowing for the scraping of dynamic content that relies on client-side scripting.
- [super: true](https://scrape.do/documentation/#super-residential--mobile?utm_source=github&utm_medium=node-client): Utilizes a residential proxy, which makes the request appear as if it is coming from a typical user on a mobile network, providing enhanced anonymity and avoiding blocks from anti-scraping measures.
- [geoCode](https://scrape.do/documentation/#geo-targeting?utm_source=github&utm_medium=node-client): "us": Targets a specific geographic location for the request, in this case, the United States. This is useful for scraping content that varies by region, such as localized prices or region-specific data.
- [playWithBrowser](https://scrape.do/documentation/#play-with-browser?utm_source=github&utm_medium=node-client): Provides the ability to interact with the browser while rendering the page. For example, you can wait for specific elements to load or perform actions like clicking buttons. In this case, it waits for the <body> element to ensure the page is fully loaded before proceeding.

```typescript
const { ScrapeDo } = require("@scrape-do/client");

const client = new ScrapeDo("your_api_token");
const response = await client.sendRequest("GET", {
  url: "https://example.com",
  render: true,
  super: true,
  geoCode: "us",
  playWithBrowser: [
    {
      Action: "WaitSelector",
      WaitSelector: "body",
    },
  ],
});

console.log(response);
```

## Official links

- [Scrape.do](https://scrape.do?utm_source=github&utm_medium=node-client)
  - [Documentation](https://scrape.do/documentation/?utm_source=github&utm_medium=node-client)
  - [Features](https://scrape.do/#features?utm_source=github&utm_medium=node-client)
- [Blog](https://scrape.do/blog/?utm_source=github&utm_medium=node-client)
- [LinkedIn](https://www.linkedin.com/company/scrape-do/)

## License

#### This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more details.

## Disclaimer

#### Any damages arising from the use of the library or service or any other legal situation cannot be associated with the scrape.do legal entity and team. The responsibility lies entirely with the user.