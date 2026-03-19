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
validDocument.paths["/articles"].get.responses["406"] = {
  description: "not acceptable",
};

describe("Rule 406-response-code", () => {
  let spectral = createWithRules(["406-response-code"]);

  beforeEach(() => {
    spectral = createWithRules(["406-response-code"]);
  });

  it("missing 406 response", async () => {
    await expectRuleErrors(spectral, "406-response-code", invalidDocument, [
      {
        message: "Document a 406 response for invalid Accept headers.",
        path: ["paths", "/articles", "get", "responses"],
        severity: DiagnosticSeverity.Error,
      },
    ]);
  });

  it("valid 406-response-code case", async () => {
    await expectRuleErrors(spectral, "406-response-code", validDocument, []);
  });
});
