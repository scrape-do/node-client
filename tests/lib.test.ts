import { describe, expect, it, test } from "@jest/globals";
import { ScrapeDo } from "../src/lib";

const TOKEN = process.env.TOKEN || "";

describe("Usability tests", () => {
  test("Should be able to get successful response with extra headers", async () => {
    const client = new ScrapeDo(TOKEN);
    const response = await client.sendRequest("GET", {
      url: "https://httpbin.co/anything",
      extraHeaders: {
        A123: "Extra Header",
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.content.headers["A123"]).toStrictEqual(["Extra Header"]);
  });
  test("Should be able to get successful response with custom headers", async () => {
    const client = new ScrapeDo(TOKEN);
    const response = await client.sendRequest("GET", {
      url: "https://httpbin.co/anything",
      customHeaders: {
        A123: "Custom Header",
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.content.headers["A123"]).toStrictEqual(["Custom Header"]);
  });
  test("Should be able to get successful response with forward headers", async () => {
    const client = new ScrapeDo(TOKEN);
    const response = await client.sendRequest("GET", {
      url: "https://httpbin.co/anything",
      forwardHeaders: {
        A123: "Forward Header",
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.content.headers["A123"]).toStrictEqual(["Forward Header"]);
  });
  test("Should be able to get successful response with cookies", async () => {
    const client = new ScrapeDo(TOKEN);
    const response = await client.sendRequest("GET", {
      url: "https://httpbin.co/anything",
      setCookies: {
        A123: "Cookie",
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.content.headers["Cookie"]).toStrictEqual(["A123=Cookie"]);
  });
  test("Should throw error if setCookies is used with customHeaders", async () => {
    const client = new ScrapeDo(TOKEN);
    await expect(
      client.sendRequest("GET", {
        url: "https://httpbin.co/anything",
        setCookies: {
          A123: "Cookie",
        },
        customHeaders: {
          A123: "Custom Header",
        },
      })
    ).rejects.toThrow("setCookies cannot be used with customHeaders, extraHeaders or forwardHeaders");
  });
  test("Should get successful response with render and playWithBrowser", async () => {
    const client = new ScrapeDo(TOKEN);
    const response = await client.sendRequest("GET", {
      url: "https://httpbin.co/anything",
      render: true,
      returnJSON: true,
      playWithBrowser: [
        {
          Action: "WaitSelector",
          WaitSelector: "body",
        },
      ],
    });

    expect(response.statusCode).toBe(200);
    expect(response.actionResults).toHaveLength(1);
    expect(response.actionResults![0].action).toBe("WaitSelector");
    expect(response.actionResults![0].success).toBe(true);
  });
  test("Should get successful response with render and super proxy", async () => {
    const client = new ScrapeDo(TOKEN);
    const response = await client.sendRequest("GET", {
      url: "https://httpbin.co/anything",
      render: true,
      super: true,
    });

    expect(response.statusCode).toBe(200);
  });
  test("Should get successful response from statistics request", async () => {
    const client = new ScrapeDo(TOKEN);
    const stats = await client.statistics();

    expect(stats.IsActive).toBe(true);
    expect(stats.RemainingMonthlyRequest).toBeGreaterThan(0);
  });
});
