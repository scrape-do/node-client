# node-do

#### Scrape.do's official http client for node.js

## How to install?

```shell
npm install @scrape-do/do
# or get it from github
npm install git://git@github.com/scrape-do/node-do
```

## How to build from scratch

#### If you want to contribute to the library or include your own customisations, you can recompile the library in this way.

```shell
git clone https://github.com/scrape-do/node-do
npm i
# build with
npm build
```

## Example Usage

#### The following example returns the response of how you requested from httpbin.co. You should see the ‘A123’ header in the header section of the response.

```typescript
const client = new ScrapeDo("example_token");
const response = await client.doRequest("GET", {
  url: "https://httpbin.co/anything",
  extraHeaders: {
    "sd-A123": "Extra Header",
  },
});

console.log(response.data);
```

## More details

#### [Documentation for more information](https://scrape.do/documentation/?utm_source=github&utm_medium=node-do)

#### [Scrape.do](https://scrape.do?utm_source=github&utm_medium=node-do)

## License

### This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more details.

## Disclaimer

### Any damages arising from the use of the library or service or any other legal situation cannot be associated with the scrape.do legal entity and team. The responsibility lies entirely with the user.
