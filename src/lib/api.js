import { apiUrls } from "../constants";

export const errors = {
  network: { success: false, error: { type: "network", message: "Network error. Please check your internet connection." } },
  timeout: { success: false, error: { type: "timeout", message: "Request timed out. Please try again." } },
  server: { success: false, error: { type: "server", message: "Server error. Please try again later." } },
};

// Our API always replies with JSON. A non-JSON 502/503 therefore comes from the hosting platform
// (suspended or overloaded server), which means the request never reached our code.
export const gatewayStatuses = [502, 503];

function hash(value) {
  let result = 2166136261;

  for (let i = 0; i < value.length; i++) {
    result ^= value.charCodeAt(i);
    result = Math.imul(result, 16777619);
  }

  return result >>> 0;
}

export function getApiServerOrder({ key, preferredUrl } = {}) {
  if (!apiUrls.length) return [];

  let startIndex = preferredUrl ? apiUrls.indexOf(preferredUrl) : -1;

  if (startIndex === -1 && key) {
    let highestScore = -1;

    apiUrls.forEach((url, index) => {
      const score = hash(`${key}:${url}`);

      if (score > highestScore) {
        highestScore = score;
        startIndex = index;
      }
    });
  }

  if (startIndex === -1) {
    startIndex = Math.floor(Math.random() * apiUrls.length);
  }

  return apiUrls.map((_, offset) => apiUrls[(startIndex + offset) % apiUrls.length]);
}

// AbortSignal.timeout() rejects with a "TimeoutError" (older code paths use "AbortError").
export const isTimeout = (error) => error?.name === "TimeoutError" || error?.name === "AbortError";
