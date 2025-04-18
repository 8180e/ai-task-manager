import { lazy, Suspense } from "react";
import axios from "axios";
import { getCookie, setCookie } from "./utils/cookies";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CenteredCircularProgress from "./components/CenteredCircularProgress";

const Home = lazy(() => import("./pages/Home"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const NoPage = lazy(() => import("./pages/NoPage"));

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.headers.common["Authorization"] = `Bearer ${getCookie(
  "accessToken"
)}`;
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      ["No token provided", "Invalid token"].includes(
        error.response.data.error
      ) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = getCookie("refreshToken");
        const response = await axios.post("auth/refresh", { refreshToken });
        const {
          data: { accessToken, refreshToken: newRefreshToken },
        } = response;
        setCookie("accessToken", accessToken, 1);
        setCookie("refreshToken", newRefreshToken, 1);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return axios(originalRequest);
      } catch (error) {
        console.error("Token refresh failed:", error);
        setCookie("accessToken", "", -1);
        setCookie("refreshToken", "", -1);
        window.location.href = "/sign-in";
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<CenteredCircularProgress />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-up" element={<AuthPage method="sign-up" />} />
          <Route path="/sign-in" element={<AuthPage method="sign-in" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
