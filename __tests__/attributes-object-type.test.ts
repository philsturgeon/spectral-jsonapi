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
                        attributes: {
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
].schema.properties.data.properties.attributes.type = "object";

describe("Rule attributes-object-type", () => {
  let spectral = createWithRules(["attributes-object-type"]);

  beforeEach(() => {
    spectral = createWithRules(["attributes-object-type"]);
  });

  it("attributes is declared as array", async () => {
    await expectRuleErrors(
      spectral,
      "attributes-object-type",
      invalidDocument,
      [
        {
          message: "attributes must be an object.",
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
            "attributes",
            "type",
          ],
          severity: DiagnosticSeverity.Error,
        },
      ],
    );
  });

  it("valid attributes-object-type case", async () => {
    await expectRuleErrors(
      spectral,
      "attributes-object-type",
      validDocument,
      [],
    );
  });
});
