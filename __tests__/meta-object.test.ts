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
                    meta: {
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
};

const validDocument = structuredClone(invalidDocument);
validDocument.paths["/articles/{id}"].get.responses["200"].content[
  "application/vnd.api+json"
].schema.properties.meta.type = "object";

describe("Rule meta-object", () => {
  let spectral = createWithRules(["meta-object"]);

  beforeEach(() => {
    spectral = createWithRules(["meta-object"]);
  });

  it("meta is typed as string", async () => {
    await expectRuleErrors(spectral, "meta-object", invalidDocument, [
      {
        message: "meta must be an object.",
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
          "meta",
          "type",
        ],
        severity: DiagnosticSeverity.Error,
      },
    ]);
  });

  it("valid meta-object case", async () => {
    await expectRuleErrors(spectral, "meta-object", validDocument, []);
  });
});
