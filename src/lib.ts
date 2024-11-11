import { PlayWithBrowser } from "./playwithbrowser";
import { GeoCode } from "./geocode";
import { DoRequest, DoResponse, StatisticsResponse, FetchConfig, MakeRequestResponse } from "./types";
import qs from "qs";

export const API_URL = "https://api.scrape.do";

export const ValidStatusCodes: number[] = [400, 401, 404, 405, 406, 409, 410, 411, 413, 414, 415, 416, 417, 418, 422, 424, 426, 428];
export const ValidStatusCodeRanges: { min: number; max: number }[] = [
  { min: 100, max: 299 },
  { min: 300, max: 399 },
];

/**
 * The client used to interact with the Scrape.do API.
 * @property {string} token - API token for authentication.
 * @method {function} sendRequest - Sends a request to the Scrape.do API.
 * @method {function} statistics - Retrieves usage statistics of the subscription.
 * @example
 * const client = new ScrapeDo("API_TOKEN");
 * const response = await client.sendRequest("GET", {
 *   url: "https://httpbin.co/anything",
 *   render: false,
 * });
 * console.log(response);
 */
export class ScrapeDo {

  /**
   * Initializes a new instance of ScrapeDo.
   * @param token - The API token used for authenticating requests.
   */
  constructor(public token: string) {
    this.token = token;
  }

  /**
   * Make a scrape request to the API
   * @param config - Configuration for the request
   * @returns Response of the scraping result or error
   */

  async makeRequest(config: FetchConfig): Promise<MakeRequestResponse> {
    let headers: Record<string, string> = config.headers || {};

    if (typeof config?.data === 'object') {
      config.data = JSON.stringify(config.data);
      headers['content-type'] = 'application/json';
    }
    let reqUrl = `${API_URL}${config.path}?${qs.stringify(config.params, { indices: false })}`

    let response: MakeRequestResponse = await fetch(reqUrl, {
      headers,
      method: config.method || 'GET',
      body: config.data
    })

    let data: string | any = await response.text();
    try { data = JSON.parse(data) } catch { }

    response.data = data

    if (ValidStatusCodes.includes(response.status) || ValidStatusCodeRanges.some((range) => response.status >= range.min && response.status <= range.max)) {
      return response
    } else {
      throw response
    }

  }

  /**
   * Make a scrape request to the API
   * @param method - HTTP method
   * @param options - Scraping options
   * @param body - Request body if method is POST
   * @returns Response of the scraping result or error message
   *
   * @see https://scrape.do/documentation/
   */
  async sendRequest(method: string, options: DoRequest, body?: any): Promise<DoResponse> {
    let headers: Record<string, string> = {};
    let cookies: string | undefined;
    let pwbParsed: string | undefined;

    if (options.setCookies && (options.customHeaders || options.extraHeaders || options.forwardHeaders)) {
      throw new Error("setCookies cannot be used with customHeaders, extraHeaders or forwardHeaders");
    }

    if (options.customHeaders) {
      headers = {
        ...headers,
        ...options.customHeaders,
      };
    }

    if (options.extraHeaders) {
      for (let key in options.extraHeaders) {
        if (key.startsWith("sd-")) {
          headers[key] = options.extraHeaders[key];
        } else {
          headers[`sd-${key}`] = options.extraHeaders[key];
        }
      }
    }

    if (options.forwardHeaders) {
      headers = {
        ...headers,
        ...options.forwardHeaders,
      };
    }

    if (method == "GET" && body) {
      throw new Error("GET method does not support body");
    }

    if (options.setCookies) {
      cookies = "";
      for (const key in options.setCookies) {
        cookies += `${key}=${options.setCookies[key]};`;
      }
    }

    if (options.playWithBrowser) {
      pwbParsed = JSON.stringify(options.playWithBrowser);
    }

    const params = {
      ...options,
      extraHeaders: options.extraHeaders ? true : undefined,
      forwardHeaders: options.forwardHeaders ? true : undefined,
      customHeaders: options.customHeaders ? true : undefined,
      setCookies: cookies,
      playWithBrowser: pwbParsed,
      token: this.token
    };

    return this.makeRequest({
      method: method,
      path: "/",
      headers: headers,
      data: body,
      params,
    })
      .then((response: MakeRequestResponse) => {
        const sdoHeaders: Partial<DoResponse> = {
          cookies: response.headers["Scrape.do-Cookies"],
          remainingCredits: response.headers["Scrape.do-Remaining-Credits"],
          requestCost: response.headers["Scrape.do-Request-Cost"],
          resolvedURL: response.headers["Scrape.do-Resolved-Url"],
          targetURL: response.headers["Scrape.do-Target-Url"],
          initialStatusCode: response.headers["Scrape.do-Initial-Status-Code"],
          targetRedirectedLocation: response.headers["Scrape.do-Target-Redirected-Location"],
        };

        if (options.returnJSON) {
          return {
            url: options.url,
            statusCode: response.status,
            ...response.data,
            ...sdoHeaders,
          };
        } else if (response.data["Message"]) {
          return {
            url: options.url,
            statusCode: response.status,
            message: response.data["Message"],
            possibleCauses: response.data["PossibleCauses"],
            contact: response.data["Contact"],
          };
        } else {
          return {
            url: options.url,
            statusCode: response.status,
            content: response.data,
            ...sdoHeaders,
          };
        }
      })
      .catch((error: MakeRequestResponse) => {
        if (error.data && error.data["Message"]) {
          return {
            url: error.data["URL"],
            statusCode: error.data["StatusCode"],
            message: error.data["Message"],
            possibleCauses: error.data["PossibleCauses"],
            contact: error.data["Contact"],
          };
        } else {
          throw error;
        }
      });
  }

  /**
   * Get statistics of the subscription
   * @returns Statistics of the subscription
   *
   * @see https://scrape.do/documentation/#usage-statistics-api
   */
  async statistics() {
    return this.makeRequest({ path: "/info", params: { token: this.token } })
      .then((response): StatisticsResponse => response.data);
  }
}
