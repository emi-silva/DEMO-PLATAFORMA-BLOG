import { describe, expect, it } from "vitest";
import { slugify } from "./slugify";

describe("slugify", () => {
  it("lowercases and replaces spaces", () => {
    expect(slugify("Hola Mundo")).toBe("hola-mundo");
  });

  it("removes punctuation and symbols", () => {
    expect(slugify("Hello, world!")).toBe("hello-world");
  });

  it("collapses multiple dashes", () => {
    expect(slugify("uno  -- dos")).toBe("uno-dos");
  });
});
