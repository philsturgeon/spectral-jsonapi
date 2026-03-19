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
      get: {
        responses: {
          "200": {
            description: "ok",
            content: {
              "application/vnd.api+json": {
                schema: {
                  type: "object",
                  properties: {
                    jsonapi: {
                      type: "object",
                      properties: {
                        revision: {
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
};

const validDocument = structuredClone(invalidDocument);
delete validDocument.paths["/articles/{id}"].get.responses["200"].content[
  "application/vnd.api+json"
].schema.properties.jsonapi.properties.revision;
validDocument.paths["/articles/{id}"].get.responses["200"].content[
  "application/vnd.api+json"
].schema.properties.jsonapi.properties.version = {
  type: "string",
};

describe("Rule jsonapi-object", () => {
  let spectral = createWithRules(["jsonapi-object"]);

  beforeEach(() => {
    spectral = createWithRules(["jsonapi-object"]);
  });

  it("jsonapi contains unsupported property", async () => {
    await expectRuleErrors(spectral, "jsonapi-object", invalidDocument, [
      {
        message: "jsonapi must be an object with a string version.",
        path: [
          "paths",
          "/articles/{id}",
          "get",
          "responses",
          "200",
          "content",
          "application/vnd.api+json",
          "schema",
          "properties",
          "jsonapi",
          "properties",
        ],
        severity: DiagnosticSeverity.Error,
      },
    ]);
  });

  it("valid jsonapi-object case", async () => {
    await expectRuleErrors(spectral, "jsonapi-object", validDocument, []);
  });
});
