import { vi, describe, afterEach, it, expect } from "vitest";
import { render } from "vitest-browser-react";
import { userEvent } from "@vitest/browser/context";
import AuthPage from "../../pages/AuthPage";
import axios from "axios";
import { setCookie } from "../../utils/cookies";

vi.mock("axios");
vi.mock("../../utils/cookies");

const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  ...vi.importActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("AuthPage", () => {
  afterEach(() => vi.clearAllMocks());

  it(
    "calls axios.post with correct URL and inputs when handleSubmit is " +
      "called",
    async () => {
      const { getByRole } = render(<AuthPage method="sign-in" />);
      const emailInput = getByRole("textbox", { name: "Email" });
      const passwordInput = getByRole("textbox", { name: "Password" });
      const submitButton = getByRole("button");

      await userEvent.fill(emailInput, "test@example.com");
      await userEvent.fill(passwordInput, "Password1!");
      await userEvent.click(submitButton);

      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith("auth/sign-in", {
        email: "test@example.com",
        password: "Password1!",
      });
    }
  );

  it(
    "sets axios.defaults.headers.common['Authorization'] with correct token " +
      "when handleSubmit is called",
    async () => {
      const token = "token";
      vi.mocked(axios.post).mockResolvedValue({ data: { accessToken: token } });
      const { getByRole } = render(<AuthPage method="sign-in" />);
      const emailInput = getByRole("textbox", { name: "Email" });
      const passwordInput = getByRole("textbox", { name: "Password" });
      const submitButton = getByRole("button");

      await userEvent.fill(emailInput, "test@example.com");
      await userEvent.fill(passwordInput, "Password1!");
      await userEvent.click(submitButton);

      expect(axios.defaults.headers.common["Authorization"]).toBe(
        `Bearer ${token}`
      );
    }
  );

  it("calls setCookie with correct cookies when handleSubmit is called", async () => {
    const token = "token";
    vi.mocked(axios.post).mockResolvedValue({
      data: { accessToken: token, refreshToken: "refreshToken" },
    });
    const { getByRole } = render(<AuthPage method="sign-in" />);
    const emailInput = getByRole("textbox", { name: "Email" });
    const passwordInput = getByRole("textbox", { name: "Password" });
    const submitButton = getByRole("button");

    await userEvent.fill(emailInput, "test@example.com");
    await userEvent.fill(passwordInput, "Password1!");
    await userEvent.click(submitButton);

    expect(setCookie).toHaveBeenCalledTimes(2);
    expect(setCookie).toHaveBeenCalledWith("accessToken", token, 1);
    expect(setCookie).toHaveBeenCalledWith("refreshToken", "refreshToken", 7);
  });

  it("calls navigate with correct URL when handleSubmit is called", async () => {
    vi.mocked(axios.post).mockResolvedValue({ data: { accessToken: "token" } });
    const { getByRole } = render(<AuthPage method="sign-in" />);
    const emailInput = getByRole("textbox", { name: "Email" });
    const passwordInput = getByRole("textbox", { name: "Password" });
    const submitButton = getByRole("button");

    await userEvent.fill(emailInput, "test@example.com");
    await userEvent.fill(passwordInput, "Password1!");
    await userEvent.click(submitButton);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  it("generates form fields correctly for sign-in method", async () => {
    const { getByRole } = render(<AuthPage method="sign-in" />);
    await expect
      .element(getByRole("textbox", { name: "Email" }))
      .toBeInTheDocument();
    await expect
      .element(getByRole("textbox", { name: "Password" }))
      .toBeInTheDocument();
  });

  it("generates form fields correctly for sign-up method", async () => {
    const { getByRole } = render(<AuthPage method="sign-up" />);
    await expect
      .element(getByRole("textbox", { name: "Name" }))
      .toBeInTheDocument();
    await expect
      .element(getByRole("textbox", { name: "Email" }))
      .toBeInTheDocument();
    await expect
      .element(getByRole("textbox", { name: "Password" }))
      .toBeInTheDocument();
  });
});
