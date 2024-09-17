import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { PlayWithBrowser } from "./playwithbrowser";
import { GeoCode } from "./geocode";
import { DoRequest, DoResponse, StatisticsResponse } from "./types";

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
  private reqClient: AxiosInstance;

  /**
   * Initializes a new instance of ScrapeDo.
   * @param token - The API token used for authenticating requests.
   */
  constructor(public token: string) {
    this.reqClient = axios.create({
      baseURL: API_URL,
      params: {
        token: token,
      },
    });
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

    console.log(encodeURIComponent(cookies || ""));

    const params = {
      ...options,
      extraHeaders: options.extraHeaders ? true : undefined,
      forwardHeaders: options.forwardHeaders ? true : undefined,
      customHeaders: options.customHeaders ? true : undefined,
      setCookies: cookies,
      playWithBrowser: pwbParsed,
    };

    return this.reqClient
      .request<DoResponse>({
        method: method,
        url: "/",
        headers: headers,
        data: body,
        params: params,
        validateStatus: (status) => {
          if (options.transparentResponse) {
            return true;
          } else {
            if (ValidStatusCodes.includes(status) || ValidStatusCodeRanges.some((range) => status >= range.min && status <= range.max)) {
              return true;
            } else {
              return false;
            }
          }
        },
      })
      .then((response: AxiosResponse) => {
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
      .catch((error: AxiosError) => {
        if (error.response?.data && error.response.data["Message"]) {
          return {
            url: error.response.data["URL"],
            statusCode: error.response.data["StatusCode"],
            message: error.response.data["Message"],
            possibleCauses: error.response.data["PossibleCauses"],
            contact: error.response.data["Contact"],
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
    return this.reqClient.get<StatisticsResponse>("/info").then((response) => response.data);
  }
}
