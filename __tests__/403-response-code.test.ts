import { DiagnosticSeverity } from "@stoplight/types";
import { createWithRules, expectRuleErrors } from "./__helpers__/helper";

const invalidDocument = {
  openapi: "3.1.0",
  info: {
    title: "Test",
    version: "1.0.0",
  },
  paths: {
    "/articles": {
      get: {
        responses: {
          "200": {
            description: "ok",
          },
        },
      },
    },
  },
};

const validDocument = structuredClone(invalidDocument);
validDocument.paths["/articles"].get.responses["403"] = {
  description: "forbidden",
};

describe("Rule 403-response-code", () => {
  let spectral = createWithRules(["403-response-code"]);

  beforeEach(() => {
    spectral = createWithRules(["403-response-code"]);
  });

  it("missing 403 response", async () => {
    await expectRuleErrors(spectral, "403-response-code", invalidDocument, [
      {
        message: "Document a 403 response for every operation.",
        path: ["paths", "/articles", "get", "responses"],
        severity: DiagnosticSeverity.Error,
      },
    ]);
  });

  it("valid 403-response-code case", async () => {
    await expectRuleErrors(spectral, "403-response-code", validDocument, []);
  });
});
