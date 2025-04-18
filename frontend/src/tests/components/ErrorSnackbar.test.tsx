import { describe, it, expect } from "vitest";
import { render } from "vitest-browser-react";
import { userEvent } from "@vitest/browser/context";
import ErrorSnackbar from "../../components/ErrorSnackbar";
import { AxiosError } from "axios";

describe("ErrorSnackbar", () => {
  it("renders with error message when error prop is provided", async () => {
    const error = {
      response: { data: { error: "Test error message" } },
    } as AxiosError;
    const { getByRole } = render(<ErrorSnackbar error={error} />);
    await expect
      .element(getByRole("alert"))
      .toHaveTextContent("Test error message");
  });

  it("renders with default error message when error is not provided", async () => {
    const error = new AxiosError();
    const { getByRole } = render(<ErrorSnackbar error={error} />);
    await expect
      .element(getByRole("alert"))
      .toHaveTextContent("Something went wrong");
  });

  it("closes snackbar when close button is clicked", async () => {
    const error = {
      response: { data: { error: "Test error message" } },
    } as AxiosError;
    const { getByRole } = render(<ErrorSnackbar error={error} />);
    const closeButton = getByRole("button");
    await userEvent.click(closeButton);
    await expect.element(getByRole("alert")).not.toBeInTheDocument();
  });

  it("does not close snackbar when clicked away", async () => {
    const error = {
      response: { data: { error: "Test error message" } },
    } as AxiosError;
    const { getByRole } = render(<ErrorSnackbar error={error} />);
    const snackbar = getByRole("alert");
    await userEvent.click(snackbar);
    await expect.element(snackbar).toBeVisible();
  });
});
