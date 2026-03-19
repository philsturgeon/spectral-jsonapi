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
          "409": {
            description: "conflict",
          },
        },
      },
    },
  },
};

const validDocument = structuredClone(invalidDocument);
delete validDocument.paths["/articles"].post.responses["409"];

describe("Rule post-409-response", () => {
  let spectral = createWithRules(["post-409-response"]);

  beforeEach(() => {
    spectral = createWithRules(["post-409-response"]);
  });

  it("post includes explicit 409 response", async () => {
    await expectRuleErrors(spectral, "post-409-response", invalidDocument, [
      {
        message:
          "POST 409 responses should include source to explain the conflict.",
        path: ["paths", "/articles", "post", "responses", "409"],
        severity: DiagnosticSeverity.Information,
      },
    ]);
  });

  it("valid post-409-response case", async () => {
    await expectRuleErrors(spectral, "post-409-response", validDocument, []);
  });
});
