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
          "400": {
            description: "bad request",
            content: {
              "application/vnd.api+json": {
                schema: {
                  type: "object",
                  properties: {
                    errors: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          badField: {
                            type: "string",
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
  },
};

const validDocument = structuredClone(invalidDocument);
delete validDocument.paths["/articles"].get.responses["400"].content[
  "application/vnd.api+json"
].schema.properties.errors.items.properties.badField;
validDocument.paths["/articles"].get.responses["400"].content[
  "application/vnd.api+json"
].schema.properties.errors.items.properties.status = {
  type: "string",
};

describe("Rule error-object-schema", () => {
  let spectral = createWithRules(["error-object-schema"]);

  beforeEach(() => {
    spectral = createWithRules(["error-object-schema"]);
  });

  it("error object includes unsupported member", async () => {
    await expectRuleErrors(spectral, "error-object-schema", invalidDocument, [
      {
        message: "Error objects must follow the JSON:API error object schema.",
        path: [
          "paths",
          "/articles",
          "get",
          "responses",
          "400",
          "content",
          "application/vnd.api+json",
          "schema",
          "properties",
          "errors",
          "items",
          "properties",
          "badField",
        ],
        severity: DiagnosticSeverity.Error,
      },
    ]);
  });

  it("valid error-object-schema case", async () => {
    await expectRuleErrors(spectral, "error-object-schema", validDocument, []);
  });
});
