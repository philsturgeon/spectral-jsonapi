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
                    properties: {
                      type: {
                        type: "string",
                      },
                      relationships: {
                        type: "object",
                        properties: {
                          author: {
                            type: "object",
                            required: ["foo"],
                            properties: {
                              links: {
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
validDocument.paths["/articles"].post.requestBody.content[
  "application/vnd.api+json"
].schema.properties.data.properties.relationships.properties.author.required[0] =
  "data";

describe("Rule post-relationships", () => {
  let spectral = createWithRules(["post-relationships"]);

  beforeEach(() => {
    spectral = createWithRules(["post-relationships"]);
  });

  it("post relationship required contains invalid member", async () => {
    await expectRuleErrors(spectral, "post-relationships", invalidDocument, [
      {
        message: "If POST relationships are present, they must include data.",
        path: [
          "paths",
          "/articles",
          "post",
          "requestBody",
          "content",
          "application/vnd.api+json",
          "schema",
          "properties",
          "data",
          "properties",
          "relationships",
          "properties",
          "author",
          "required",
          "0",
        ],
        severity: DiagnosticSeverity.Error,
      },
    ]);
  });

  it("valid post-relationships case", async () => {
    await expectRuleErrors(spectral, "post-relationships", validDocument, []);
  });
});
