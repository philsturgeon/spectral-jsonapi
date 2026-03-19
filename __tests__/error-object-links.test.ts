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
                          links: {
                            type: "object",
                            properties: {
                              self: {
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
    },
  },
};

const validDocument = structuredClone(invalidDocument);
delete validDocument.paths["/articles"].get.responses["400"].content[
  "application/vnd.api+json"
].schema.properties.errors.items.properties.links.properties.self;
validDocument.paths["/articles"].get.responses["400"].content[
  "application/vnd.api+json"
].schema.properties.errors.items.properties.links.properties.about = {
  type: "string",
};

describe("Rule error-object-links", () => {
  let spectral = createWithRules(["error-object-links"]);

  beforeEach(() => {
    spectral = createWithRules(["error-object-links"]);
  });

  it("error links lacks about link", async () => {
    await expectRuleErrors(spectral, "error-object-links", invalidDocument, [
      {
        message: "Error object links must include about.",
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
          "links",
          "properties",
        ],
        severity: DiagnosticSeverity.Error,
      },
    ]);
  });

  it("valid error-object-links case", async () => {
    await expectRuleErrors(spectral, "error-object-links", validDocument, []);
  });
});
