import { GeoCode } from "./geocode";
import { PlayWithBrowser } from "./playwithbrowser";

/**
 * Proxy options for the request.
 * @property {boolean} [super] - Indicates whether to use a super proxy.
 * @property {GeoCode} [geoCode] - Geographical code for the request.
 * @property {"europe" | "asia" | "africa" | "oceania" | "northamerica" | "southamerica"} [regionalGeoCode] - Regional geographical code.
 * @property {string} [sessionId] - Session ID for the proxy session.
 */
export type ProxyOptions = {
  super?: boolean;
  geoCode?: GeoCode;
  regionalGeoCode?: "europe" | "asia" | "africa" | "oceania" | "northamerica" | "southamerica";
  sessionId?: string;
};

/**
 * Render options for the request.
 * @property {boolean} [render] - If true, renders the page.
 * @property {"load" | "domcontentloaded" | "networkidle0" | "networkidle2"} [waitUntil] - Determines the page load event to wait for.
 * @property {number} [customWait] - Custom wait time (in ms) before proceeding.
 * @property {string} [waitSelector] - Wait until the specific element is loaded.
 * @property {number} [width] - The width of the viewport.
 * @property {number} [height] - The height of the viewport.
 * @property {boolean} [blockResources] - If true, blocks unnecessary resources such as ads.
 * @property {boolean} [screenShot] - If true, takes a screenshot of the page.
 * @property {boolean} [fullScreenShot] - If true, takes a full-page screenshot.
 * @property {string} [particularScreenShot] - Takes a screenshot of a specific element based on the selector.
 * @property {PlayWithBrowser} [playWithBrowser] - Allows additional interactions with the browser.
 * @property {boolean} [returnJSON] - If true, returns the response in JSON format.
 */
export type RenderOptions = {
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
 * Options for making an API request.
 * @property {string} url - The target URL for the request.
 * @property {Record<string, string>} [customHeaders] - Custom headers for the request.
 * @property {Record<string, string>} [extraHeaders] - Additional headers that need to start with "sd-*".
 * @property {Record<string, string>} [forwardHeaders] - Headers that need to be forwarded in the request.
 * @property {Record<string, string>} [setCookies] - Cookies to be sent with the request.
 * @property {boolean} [disableRedirection] - If true, disables redirection in the request.
 * @property {string} [callback] - URL for the callback.
 * @property {number} [timeout] - Request timeout in milliseconds.
 * @property {number} [retryTimeout] - Timeout in milliseconds for retrying the request.
 * @property {boolean} [disableRetry] - If true, disables retry for the request.
 * @property {"Desktop" | "Mobile"} [device] - Specifies the device type (Desktop or Mobile).
 * @property {"raw" | "markdown"} [output] - Defines the response output format.
 * @property {boolean} [transparentResponse] - If true, retrieves the full response without status validation.
 * @property {ProxyOptions} [super] - Proxy settings for the request.
 * @property {RenderOptions} [render] - Render settings for the request.
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
 * The structure of a successful response.
 * @property {any[]} [networkRequests] - List of network requests made during the scrape.
 * @property {any[]} [websocketResponses] - List of websocket responses.
 * @property {any[]} [actionResults] - List of actions performed.
 * @property {any} content - The content of the response.
 * @property {any[]} [screenShots] - Screenshots taken during the request.
 * @property {string} screenShots.type - Screenshot type (e.g., full or partial).
 * @property {string} screenShots.image - Base64 encoded screenshot image.
 * @property {string} screenShots.error - Screenshot error message if any.
 * @property {number} statusCode - HTTP status code of the response.
 * @property {string} [cookies] - Cookies returned in the response.
 * @property {string} [remainingCredits] - Remaining API credits.
 * @property {string} [requestCost] - Cost of the request.
 * @property {string} [resolvedURL] - Final resolved URL after redirects.
 * @property {string} [targetURL] - The originally requested URL.
 * @property {string} [initialStatusCode] - The initial HTTP status code of the request.
 * @property {string} [targetRedirectedLocation] - The final location after any redirections.
 */
export type DoResponse = {
  content: any;
  statusCode: number;
  url: string;
} & DoHeaders &
  DoRenderResponse;

/**
 * Headers returned in the response of the scraping request
 * @property {string} [cookies] - Cookies returned from the scrape request
 * @property {string} [remainingCredits] - Remaining credits for the user account
 * @property {string} [requestCost] - Cost of the scrape request in credits
 * @property {string} [resolvedURL] - Final resolved URL after any redirects
 * @property {string} [targetURL] - The target URL that was scraped
 * @property {string} [initialStatusCode] - The status code of the initial request before any redirects
 * @property {string} [targetRedirectedLocation] - Final location after following redirects
 */
export interface DoHeaders {
  cookies?: string;
  remainingCredits?: string;
  requestCost?: string;
  resolvedURL?: string;
  targetURL?: string;
  initialStatusCode?: string;
  targetRedirectedLocation?: string;
}

/**
 * Structure of an error response.
 * @property {string[]} [message] - List of error messages.
 * @property {string[]} [possibleCauses] - Possible causes for the error.
 * @property {string} [contact] - Contact details for further assistance.
 */
export type DoErrorResponse = {
  message?: string[];
  possibleCauses?: string[];
  contact?: string;
};

/**
 * Details about the rendered response.
 * @property {any[]} [networkRequests] - List of network requests made during the render.
 * @property {any[]} [websocketResponses] - List of websocket responses.
 * @property {any[]} [actionResults] - List of actions performed during the render.
 * @property {any[]} [screenShots] - Screenshots taken during the render.
 */
export interface DoRenderResponse {
  networkRequests?: any[];
  websocketResponses?: any[];
  actionResults?: {
    action: string;
    error?: string;
    success: boolean;
    index: number;
    response?: any;
  }[];
  screenShots?: { type: string; image; string; error: string }[];
}

/**
 * Response structure for statistics requests.
 * @property {boolean} IsActive - Whether the subscription is active.
 * @property {number} ConcurrentRequest - Number of allowed concurrent requests.
 * @property {number} MaxMonthlyRequest - Maximum number of requests allowed per month.
 * @property {number} RemainingConcurrentRequest - Number of remaining concurrent requests.
 * @property {number} RemainingMonthlyRequest - Number of remaining requests for the month.
 */
export interface StatisticsResponse {
  IsActive: boolean;
  ConcurrentRequest: number;
  MaxMonthlyRequest: number;
  RemainingConcurrentRequest: number;
  RemainingMonthlyRequest: number;
}
