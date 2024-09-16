import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { PlayWithBrowser } from "./playwithbrowser";
import { GeoCode } from "./geocode";

export const API_URL = "https://api.scrape.do";

/**
 * Proxy options for the request
 * @property {boolean} [super] - Use super proxy
 * @property {GeoCode} [geoCode] - Geographical code
 * @property {"europe" | "asia" | "africa" | "oceania" | "northamerica" | "southamerica"} [regionalGeoCode] - Regional geographical code
 * @property {string} [sessionId] - Session ID for the proxy
 *
 * @see https://scrape.do/documentation/
 */
type ProxyOptions = {
  super?: boolean;
  geoCode?: GeoCode;
  regionalGeoCode?: "europe" | "asia" | "africa" | "oceania" | "northamerica" | "southamerica";
  sessionId?: string;
};

/**
 * Render options for the request
 * @property {boolean} [render] - Render the page
 * @property {"load" | "domcontentloaded" | "networkidle0" | "networkidle2"} [waitUntil] - Wait until the page is loaded
 * @property {number} [customWait] - Custom wait time
 * @property {string} [waitSelector] - Wait until the selector is loaded
 * @property {number} [width] - Width of the viewport
 * @property {number} [height] - Height of the viewport
 * @property {boolean} [blockResources] - Block unnecessary resources
 * @property {boolean} [screenShot] - Take a screenshot
 * @property {boolean} [fullScreenShot] - Take a full page screenshot
 * @property {string} [particularScreenShot] - Take a screenshot of a particular element
 * @property {PlayWithBrowser} [playWithBrowser] - Play with browser actions
 * @property {boolean} [returnJSON] - Return JSON response
 *
 * @see https://scrape.do/documentation/
 */
type RenderOptions = {
  render?: boolean;
  waitUntil?: "load" | "domcontentloaded" | "networkidle0" | "networkidle2";
  customWait?: number;
  waitSelector?: string;
  width?: number;
  height?: number;
  blockResources?: boolean;
  screenShot?: boolean;
  fullScreenShot?: boolean;
  particularScreenShot?: string;
  playWithBrowser?: PlayWithBrowser;
  returnJSON?: boolean;
};

/**
 * Request options for the API
 * @property {string} url - URL of the request
 * @property {Record<string, string>} [customHeaders] - Custom headers for the request
 * @property {Record<string, string>} [extraHeaders] - Extra headers for the request (needs "sd-*" prefix!)
 * @property {Record<string, string>} [forwardHeaders] - Forward headers for the request
 * @property {Record<string, string>} [setCookies] - Set cookies for the request
 * @property {boolean} [disableRedirection] - Disable redirection
 * @property {string} [callback] - Callback URL
 * @property {number} [timeout] - Timeout for the request
 * @property {number} [retryTimeout] - Retry timeout for the request
 * @property {boolean} [disableRetry] - Disable retry
 * @property {"Desktop" | "Mobile"} [device] - Device for the request
 * @property {"raw" | "markdown"} [output] - Output format
 * @property {boolean} [transparentResponse] - Get transparent response
 * @property {ProxyOptions} [super] - Proxy options
 * @property {RenderOptions} [render] - Render options
 *
 * @see https://scrape.do/documentation/
 */
export type DoRequest = {
  url: string;
  customHeaders?: Record<string, string>;
  extraHeaders?: Record<string, string>;
  forwardHeaders?: Record<string, string>;
  setCookies?: Record<string, string>;
  disableRedirection?: boolean;
  callback?: string;
  timeout?: number;
  retryTimeout?: number;
  disableRetry?: boolean;
  device?: "Desktop" | "Mobile";
  output?: "raw" | "markdown";
  transparentResponse?: boolean;
} & ProxyOptions &
  RenderOptions;

/**
 * Response of a failed request
 * @property {string} URL - URL of the request
 * @property {number} StatusCode - Status code of the response
 * @property {string[]} [Message] - Error message
 * @property {string[]} [PossibleCauses] - Possible causes of the error
 * @property {string} [Contact] - Contact information
 *
 * @see https://scrape.do/documentation/
 */
export type DoErrorResponse = {
  url: string;
  statusCode: number;
  message?: string[];
  possibleCauses?: string[];
  contact?: string;
} & DoHeaders;

/**
 * Response of a successful request
 * @property {any[]} [networkRequests] - List of network requests
 * @property {any[]} [websocketResponses] - List of websocket responses
 * @property {any[]} [actionResults] - List of action results
 * @property {string} content - Rendered content
 * @property {any[]} [screenShots] - List of screenshots
 * @property {string} screenShots.type - Type of screenshot
 * @property {string} screenShots.image - Base64 encoded image
 * @property {string} screenShots.error - Error message
 * @property {number} statusCode - Status code of the response
 * @property {string} [cookies] - Cookies
 * @property {string} [remainingCredits] - Remaining credits
 * @property {string} [requestCost] - Request cost
 * @property {string} [resolvedURL] - Resolved URL
 * @property {string} [targetURL] - Target URL
 * @property {string} [initialStatusCode] - Initial status code
 * @property {string} [targetRedirectedLocation] - Target redirected location

 * @see https://scrape.do/documentation/
 */
export type DoResponse = {
  content: string;
  statusCode: number;
} & DoHeaders &
  DoRenderResponse;

export interface DoHeaders {
  cookies?: string;
  remainingCredits?: string;
  requestCost?: string;
  resolvedURL?: string;
  targetURL?: string;
  initialStatusCode?: string;
  targetRedirectedLocation?: string;
}

export interface DoRenderResponse {
  networkRequests?: any[];
  websocketResponses?: any[];
  actionResults?: any[];
  screenShots?: { type: string; image; string; error: string }[];
}
/**
 * Response of a statistics request
 * @property {boolean} IsActive - Subscription status
 * @property {number} ConcurrentRequest - Number of concurrent requests
 * @property {number} MaxMonthlyRequest - Maximum number of requests per month
 * @property {number} RemainingConcurrentRequest - Remaining number of concurrent requests
 * @property {number} RemainingMonthlyRequest - Remaining number of requests per month
 *
 * @see https://scrape.do/documentation/
 */
export interface StatisticsResponse {
  IsActive: boolean;
  ConcurrentRequest: number;
  MaxMonthlyRequest: number;
  RemainingConcurrentRequest: number;
  RemainingMonthlyRequest: number;
}

/**
 * Request client for scrape.do API
 * @property {string} token - API token
 * @method {function} doRequest - Make a request to the API
 * @method {function} statistics - Get statistics of the subscription
 * @example
 * const client = new ScrapeDo("API_TOKEN");
 *   const response = await client.doRequest("GET", {
 *     url: "https://httpbin.co/anything",
 *     render: false,
 *   });
 * console.log(response.data);
 *
 * @see https://scrape.do/documentation/
 */
export class ScrapeDo {
  private reqClient: AxiosInstance;

  /**
   * @param token - API token
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
   * @param validateStatus - Function to validate status code of the response (default: axios default)
   * @returns Response of the scraping result or error message
   *
   * @see https://scrape.do/documentation/
   */
  async sendRequest(method: string, options: DoRequest, body?: any): Promise<DoResponse | DoErrorResponse> {
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
      setCookies: encodeURIComponent(cookies || ""),
      playWithBrowser: pwbParsed,
    };

    return this.reqClient
      .request({
        method: method,
        url: "/",
        headers: headers,
        data: body,
        params: params,
        validateStatus: (status) => {
          if (options.transparentResponse) {
            return true;
          } else {
            if (status == 502 || status == 503 || status == 504 || status == 429 || status == 400) {
              return false;
            } else {
              return status >= 200 && status < 300;
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
            statusCode: response.status,
            ...response.data,
            ...sdoHeaders,
          };
        } else {
          return {
            statusCode: response.status,
            content: response.data,
            ...sdoHeaders,
          };
        }
      })
      .catch((error: AxiosError) => {
        if (error.response?.data && error.response.status == 400 && error.response.data["Message"]) {
          return {
            url: error.response.data["URL"],
            statusCode: error.response.data["StatusCode"],
            message: error.response.data["Message"],
            possibleCauses: error.response.data["PossibleCauses"],
            contact: error.response.data["Contact"],
          } as DoErrorResponse;
        } else {
          throw error;
        }
      });
  }

  /**
   * Get statistics of the subscription
   * @returns Statistics of the subscription
   *
   * @see https://scrape.do/documentation/
   */
  async statistics() {
    return this.reqClient.get<StatisticsResponse>("/statistics");
  }
}
