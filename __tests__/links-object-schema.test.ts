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
                    links: {
                      type: "object",
                      properties: {
                        self: {
                          type: "number",
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
validDocument.paths["/articles/{id}"].get.responses["200"].content[
  "application/vnd.api+json"
].schema.properties.links.properties.self.type = "string";

describe("Rule links-object-schema", () => {
  let spectral = createWithRules(["links-object-schema"]);

  beforeEach(() => {
    spectral = createWithRules(["links-object-schema"]);
  });

  it("link member is number", async () => {
    await expectRuleErrors(spectral, "links-object-schema", invalidDocument, [
      {
        message: "Each link value must be a string URL or a link object.",
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
          "links",
          "properties",
          "self",
          "type",
        ],
        severity: DiagnosticSeverity.Error,
      },
    ]);
  });

  it("valid links-object-schema case", async () => {
    await expectRuleErrors(spectral, "links-object-schema", validDocument, []);
  });
});
