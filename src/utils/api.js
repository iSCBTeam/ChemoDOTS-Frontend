import axios from "axios";

const Instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
  headers: { "X-Custom-Header": "foobar" },
});

// Add a request interceptor
Instance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
Instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    const { status, data } = response;
    return { status, data };
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    const { response = {}, message } = error;
    const { data } = response;
    return Promise.reject(data || message);
  }
);

// Alter defaults after instance has been created

export default Instance;
