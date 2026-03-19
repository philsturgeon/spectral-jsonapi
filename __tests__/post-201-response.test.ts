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
            content: {
              "application/vnd.api+json": {
                schema: {
                  type: "object",
                  required: ["errors"],
                  properties: {
                    meta: {
                      type: "object",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

const validDocument = structuredClone(invalidDocument);
validDocument.paths["/articles"].post.responses["201"].content[
  "application/vnd.api+json"
].schema.required[0] = "data";
validDocument.paths["/articles"].post.responses["201"].content[
  "application/vnd.api+json"
].schema.properties.data = {
  type: "object",
};

describe("Rule post-201-response", () => {
  let spectral = createWithRules(["post-201-response"]);

  beforeEach(() => {
    spectral = createWithRules(["post-201-response"]);
  });

  it("201 response required contains invalid member", async () => {
    await expectRuleErrors(spectral, "post-201-response", invalidDocument, [
      {
        message: "POST 201 responses should include primary resource data.",
        path: [
          "paths",
          "/articles",
          "post",
          "responses",
          "201",
          "content",
          "application/vnd.api+json",
          "schema",
          "required",
          "0",
        ],
        severity: DiagnosticSeverity.Information,
      },
    ]);
  });

  it("valid post-201-response case", async () => {
    await expectRuleErrors(spectral, "post-201-response", validDocument, []);
  });
});
