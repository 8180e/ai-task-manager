import { describe, vi, it, expect } from "vitest";
import { render } from "vitest-browser-react";
import { userEvent } from "@vitest/browser/context";
import AutoForm from "../../components/AutoForm";

describe("AutoForm", () => {
  const fields = [
    { name: "name", label: "Name", type: "text" },
    {
      name: "email",
      label: "Email",
      type: "email",
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      errorMessage: "Invalid email address",
    },
  ];

  const onSubmit = vi.fn();

  it("renders the form with the correct fields and labels", async () => {
    const { getByRole } = render(
      <AutoForm onSubmit={onSubmit} fields={fields} />
    );
    await expect
      .element(getByRole("textbox", { name: "Name" }))
      .toBeInTheDocument();
    await expect
      .element(getByRole("textbox", { name: "Email" }))
      .toBeInTheDocument();
  });

  it("validates input correctly", async () => {
    const { getByRole, getByText } = render(
      <AutoForm onSubmit={onSubmit} fields={fields} />
    );
    const nameInput = getByRole("textbox", { name: "Name" });
    const emailInput = getByRole("textbox", { name: "Email" });
    const submitButton = getByRole("button");

    await userEvent.fill(nameInput, "John Doe");
    await userEvent.fill(emailInput, "invalid-email");

    await userEvent.click(submitButton);

    await expect
      .element(getByText("Invalid email address"))
      .toBeInTheDocument();
  });

  it("submits the form correctly when there are no errors", async () => {
    const { getByRole } = render(
      <AutoForm onSubmit={onSubmit} fields={fields} />
    );
    const nameInput = getByRole("textbox", { name: "Name" });
    const emailInput = getByRole("textbox", { name: "Email" });
    const submitButton = getByRole("button");

    await userEvent.fill(nameInput, "John Doe");
    await userEvent.fill(emailInput, "BZLbS@example.com");

    await userEvent.click(submitButton);

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("handles server errors correctly", async () => {
    const error = new Error("Server error");
    onSubmit.mockRejectedValue(error);

    const { getByRole } = render(
      <AutoForm onSubmit={onSubmit} fields={fields} />
    );
    const nameInput = getByRole("textbox", { name: "Name" });
    const emailInput = getByRole("textbox", { name: "Email" });
    const submitButton = getByRole("button");

    await userEvent.fill(nameInput, "John Doe");
    await userEvent.fill(emailInput, "BZLbS@example.com");

    await userEvent.click(submitButton);

    await expect
      .element(getByRole("alert"))
      .toHaveTextContent("Something went wrong");
  });
});
