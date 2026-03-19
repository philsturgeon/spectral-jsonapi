import { DiagnosticSeverity } from "@stoplight/types";
import { createWithRules, expectRuleErrors } from "./__helpers__/helper";

const invalidDocument = {
  openapi: "3.1.0",
  info: {
    title: "Test",
    version: "1.0.0",
  },
  paths: {
    "/articles/{id}": {
      patch: {
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
          "200": {
            description: "ok",
          },
        },
      },
    },
  },
};

const validDocument = structuredClone(invalidDocument);
validDocument.paths["/articles/{id}"].patch.requestBody.content[
  "application/vnd.api+json"
].schema.properties.data.properties.relationships.properties.author.required[0] =
  "data";

describe("Rule patch-relationships", () => {
  let spectral = createWithRules(["patch-relationships"]);

  beforeEach(() => {
    spectral = createWithRules(["patch-relationships"]);
  });

  it("patch relationship required contains invalid member", async () => {
    await expectRuleErrors(spectral, "patch-relationships", invalidDocument, [
      {
        message: "If PATCH relationships are present, they must include data.",
        path: [
          "paths",
          "/articles/{id}",
          "patch",
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

  it("valid patch-relationships case", async () => {
    await expectRuleErrors(spectral, "patch-relationships", validDocument, []);
  });
});
