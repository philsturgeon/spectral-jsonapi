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
                        type: {
                          type: "string",
                        },
                        relationships: {
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
    },
  },
};

const validDocument = structuredClone(invalidDocument);
validDocument.paths["/articles/{id}"].get.responses["200"].content[
  "application/vnd.api+json"
].schema.properties.data.properties.relationships.type = "object";

describe("Rule relationships-object-type", () => {
  let spectral = createWithRules(["relationships-object-type"]);

  beforeEach(() => {
    spectral = createWithRules(["relationships-object-type"]);
  });

  it("relationships declared as array", async () => {
    await expectRuleErrors(
      spectral,
      "relationships-object-type",
      invalidDocument,
      [
        {
          message: expect.stringContaining(
            "relationships **MUST** be an `object`",
          ),
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
            "relationships",
            "type",
          ],
          severity: DiagnosticSeverity.Error,
        },
      ],
    );
  });

  it("valid relationships-object-type case", async () => {
    await expectRuleErrors(
      spectral,
      "relationships-object-type",
      validDocument,
      [],
    );
  });
});
