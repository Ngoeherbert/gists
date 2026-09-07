import config from "../constants/config";
import { getItem } from "../utils/storage";

const API_BASE_URL = config.api.baseUrl;
const API_TIMEOUT = config.api.timeout;

async function getAuthToken() {
  return getItem("gists_auth_token");
}

async function request(endpoint, options = {}) {
  const {
    method = "GET",
    body,
    headers = {},
    timeout = API_TIMEOUT,
    ...rest
  } = options;

  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeout);

  try {
    const token = await getAuthToken();

    const requestHeaders = {
      Accept: "application/json",
      ...headers,
    };

    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }

    const isFormData =
      typeof FormData !== "undefined" && body instanceof FormData;

    if (body !== undefined && !isFormData) {
      requestHeaders["Content-Type"] = "application/json";
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: requestHeaders,
      body:
        body === undefined
          ? undefined
          : isFormData
            ? body
            : JSON.stringify(body),
      signal: controller.signal,
      ...rest,
    });

    const contentType = response.headers.get("content-type") || "";

    let data;

    if (contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = text || null;
    }

    if (!response.ok) {
      const error = new Error(
        data?.message ||
          data?.error ||
          `Request failed with status ${response.status}`,
      );

      error.status = response.status;
      error.data = data;

      throw error;
    }

    return data;
  } catch (error) {
    if (error.name === "AbortError") {
      const timeoutError = new Error(
        "Request timed out. Please check your connection and try again.",
      );

      timeoutError.code = "TIMEOUT";

      throw timeoutError;
    }

    if (
      error instanceof TypeError &&
      /network request failed|failed to fetch/i.test(error.message)
    ) {
      const networkError = new Error(
        "Unable to connect to the server. Please check your internet connection.",
      );

      networkError.code = "NETWORK_ERROR";

      throw networkError;
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function get(endpoint, options = {}) {
  return request(endpoint, {
    ...options,
    method: "GET",
  });
}

export async function post(endpoint, body, options = {}) {
  return request(endpoint, {
    ...options,
    method: "POST",
    body,
  });
}

export async function put(endpoint, body, options = {}) {
  return request(endpoint, {
    ...options,
    method: "PUT",
    body,
  });
}

export async function patch(endpoint, body, options = {}) {
  return request(endpoint, {
    ...options,
    method: "PATCH",
    body,
  });
}

export async function del(endpoint, options = {}) {
  return request(endpoint, {
    ...options,
    method: "DELETE",
  });
}

export async function upload(endpoint, formData, options = {}) {
  return request(endpoint, {
    ...options,
    method: "POST",
    body: formData,
  });
}

export function getApiUrl(endpoint = "") {
  return `${API_BASE_URL}${endpoint}`;
}

export function isApiError(error) {
  return Boolean(error?.status || error?.code);
}

export function getApiErrorMessage(error) {
  if (!error) {
    return "Something went wrong. Please try again.";
  }

  if (error.code === "TIMEOUT") {
    return "Request timed out. Please try again.";
  }

  if (error.code === "NETWORK_ERROR") {
    return "Unable to connect to the server. Please check your internet connection.";
  }

  return (
    error.message ||
    error.data?.message ||
    "Something went wrong. Please try again."
  );
}

const api = {
  request,
  get,
  post,
  put,
  patch,
  del,
  upload,
  getApiUrl,
  isApiError,
  getApiErrorMessage,
};

export default api;
