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
                    data: {
                      type: "object",
                      properties: {
                        id: {
                          type: "integer",
                        },
                        type: {
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
validDocument.paths["/articles/{id}"].get.responses["200"].content[
  "application/vnd.api+json"
].schema.properties.data.properties.id.type = "string";

describe("Rule resource-object-property-types", () => {
  let spectral = createWithRules(["resource-object-property-types"]);

  beforeEach(() => {
    spectral = createWithRules(["resource-object-property-types"]);
  });

  it("resource id typed as integer", async () => {
    await expectRuleErrors(
      spectral,
      "resource-object-property-types",
      invalidDocument,
      [
        {
          message: "Resource object id and type must both be strings.",
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
            "data",
            "properties",
            "id",
            "type",
          ],
          severity: DiagnosticSeverity.Error,
        },
      ],
    );
  });

  it("valid resource-object-property-types case", async () => {
    await expectRuleErrors(
      spectral,
      "resource-object-property-types",
      validDocument,
      [],
    );
  });
});
