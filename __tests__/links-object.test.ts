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
                      type: "array",
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
].schema.properties.links.type = "object";

describe("Rule links-object", () => {
  let spectral = createWithRules(["links-object"]);

  beforeEach(() => {
    spectral = createWithRules(["links-object"]);
  });

  it("links is typed as array", async () => {
    await expectRuleErrors(spectral, "links-object", invalidDocument, [
      {
        message: "links must be an object.",
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
          "type",
        ],
        severity: DiagnosticSeverity.Error,
      },
    ]);
  });

  it("valid links-object case", async () => {
    await expectRuleErrors(spectral, "links-object", validDocument, []);
  });
});
