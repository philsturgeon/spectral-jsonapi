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
        requestBody: {
          content: {
            "application/vnd.api+json": {
              schema: {
                type: "object",
                properties: {
                  data: {
                    type: "object",
                  },
                },
              },
            },
          },
        },
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
validDocument.paths["/articles"].post.responses["409"] = {
  description: "conflict",
};

describe("Rule post-409-response-code", () => {
  let spectral = createWithRules(["post-409-response-code"]);

  beforeEach(() => {
    spectral = createWithRules(["post-409-response-code"]);
  });

  it("post missing 409 response", async () => {
    await expectRuleErrors(
      spectral,
      "post-409-response-code",
      invalidDocument,
      [
        {
          message: "POST operations must define a 409 conflict response.",
          path: ["paths", "/articles", "post", "responses"],
          severity: DiagnosticSeverity.Error,
        },
      ],
    );
  });

  it("valid post-409-response-code case", async () => {
    await expectRuleErrors(
      spectral,
      "post-409-response-code",
      validDocument,
      [],
    );
  });
});
