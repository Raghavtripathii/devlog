import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionForm } from "../components/SessionForm";

// Mock axios so tests don't make real HTTP requests
vi.mock("../lib/api", () => ({
  default: {
    post: vi.fn().mockResolvedValue({ data: {} }),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
}));

function renderWithQuery(ui: React.ReactElement) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

describe("SessionForm", () => {
  it("renders the log session form", () => {
    renderWithQuery(<SessionForm />);
    expect(screen.getByText("Log a session")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/describe what you worked on/i)).toBeInTheDocument();
  });

  it("shows the language select with default TypeScript", () => {
    renderWithQuery(<SessionForm />);
    const select = screen.getByRole("combobox");
    expect(select).toHaveValue("TypeScript");
  });

  it("submit button is present", () => {
    renderWithQuery(<SessionForm />);
    expect(screen.getByRole("button", { name: /log session/i })).toBeInTheDocument();
  });
});