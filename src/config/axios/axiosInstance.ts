// axiosInstance.js
import { sessionAtom } from "@/lib/jotai";
import axios from "axios";
import { useSetAtom } from "jotai";
import { parseCookies, setCookie } from "nookies"; // Use nookies for easier cookie handling in Next.js

const axiosInstance = axios.create({
  baseURL: "http://localhost:9001/", // Set your API base URL
  withCredentials: false, // Allow cookies to be sent with requests
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Get cookies
    const cookies = parseCookies();

    // Get JSESSIONID from cookies if available
    const jsessionid = cookies.JSESSIONID;
    if (jsessionid) {
      config.headers["Cookie"] = `JSESSIONID=${jsessionid}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Extract JSESSIONID from the set-cookie header if available
    const setCookieHeader = response.headers["set-cookie"];
    if (setCookieHeader) {
      const matches = setCookieHeader.find((cookie) =>
        cookie.startsWith("JSESSIONID=")
      );
      if (matches) {
        const jsessionid = matches.split(";")[0].split("=")[1];
        setCookie(null, "JSESSIONID", jsessionid, {
          path: "/",
          httpOnly: true, // Set to true if you want to prevent client-side JavaScript from accessing the cookie
        });
      }
    }

    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
