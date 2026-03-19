import { DiagnosticSeverity } from "@stoplight/types";
import { createWithRules, expectRuleErrors } from "./__helpers__/helper";

describe("Rule fetching-resource-404", () => {
  let spectral = createWithRules(["fetching-resource-404"]);

  beforeEach(() => {
    spectral = createWithRules(["fetching-resource-404"]);
  });

  it("valid get includes 404", async () => {
    await expectRuleErrors(
      spectral,
      "fetching-resource-404",
      {
        openapi: "3.1.0",
        info: { title: "Test", version: "1.0.0" },
        paths: {
          "/tickets/{id}": {
            get: {
              responses: {
                "200": { description: "ok" },
                "404": { description: "not found" },
              },
            },
          },
        },
      },
      [],
    );
  });

  it("invalid get missing 404", async () => {
    await expectRuleErrors(
      spectral,
      "fetching-resource-404",
      {
        openapi: "3.1.0",
        info: { title: "Test", version: "1.0.0" },
        paths: {
          "/tickets/{id}": {
            get: {
              responses: {
                "200": { description: "ok" },
              },
            },
          },
        },
      },
      [
        {
          message: "Single-resource GET operations must define a 404 response.",
          path: ["paths", "/tickets/{id}", "get", "responses"],
          severity: DiagnosticSeverity.Error,
        },
      ],
    );
  });
});
