import { describe, expect, it } from "vitest";
import { parseAndValidate } from "@/lib/validation/parseAndValidate";

describe("upload validation", () => {
  it("fails when required families missing", () => {
    const result = parseAndValidate([]);
    expect(result.success).toBe(false);
    expect(result.usedFallback).toBe(true);
  });
});
