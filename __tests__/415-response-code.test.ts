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
      post: {
        responses: {
          "201": {
            description: "created",
          },
        },
      },
    },
  },
};

const validDocument = structuredClone(invalidDocument);
validDocument.paths["/articles"].post.responses["415"] = {
  description: "unsupported media type",
};

describe("Rule 415-response-code", () => {
  let spectral = createWithRules(["415-response-code"]);

  beforeEach(() => {
    spectral = createWithRules(["415-response-code"]);
  });

  it("missing 415 on post", async () => {
    await expectRuleErrors(spectral, "415-response-code", invalidDocument, [
      {
        message:
          "Document a 415 response for invalid Content-Type headers on POST and PATCH.",
        path: ["paths", "/articles", "post", "responses"],
        severity: DiagnosticSeverity.Error,
      },
    ]);
  });

  it("valid 415-response-code case", async () => {
    await expectRuleErrors(spectral, "415-response-code", validDocument, []);
  });
});
