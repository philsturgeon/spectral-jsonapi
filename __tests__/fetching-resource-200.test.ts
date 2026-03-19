import { DiagnosticSeverity } from "@stoplight/types";
import { createWithRules, expectRuleErrors } from "./__helpers__/helper";

describe("Rule fetching-resource-200", () => {
  let spectral = createWithRules(["fetching-resource-200"]);

  beforeEach(() => {
    spectral = createWithRules(["fetching-resource-200"]);
  });

  it("valid get includes 200", async () => {
    await expectRuleErrors(
      spectral,
      "fetching-resource-200",
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

  it("invalid get missing 200", async () => {
    await expectRuleErrors(
      spectral,
      "fetching-resource-200",
      {
        openapi: "3.1.0",
        info: { title: "Test", version: "1.0.0" },
        paths: {
          "/tickets/{id}": {
            get: {
              responses: {
                "404": { description: "not found" },
              },
            },
          },
        },
      },
      [
        {
          message: "GET operations must define a 200 response.",
          path: ["paths", "/tickets/{id}", "get", "responses"],
          severity: DiagnosticSeverity.Error,
        },
      ],
    );
  });
});
