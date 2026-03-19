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
                          type: "string",
                        },
                        type: {
                          type: "string",
                        },
                        attributes: {
                          type: "object",
                          properties: {
                            id: {
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
};

const validDocument = structuredClone(invalidDocument);
delete validDocument.paths["/articles/{id}"].get.responses["200"].content[
  "application/vnd.api+json"
].schema.properties.data.properties.attributes.properties.id;

describe("Rule resource-object-reserved-fields", () => {
  let spectral = createWithRules(["resource-object-reserved-fields"]);

  beforeEach(() => {
    spectral = createWithRules(["resource-object-reserved-fields"]);
  });

  it("attributes contains reserved id", async () => {
    await expectRuleErrors(
      spectral,
      "resource-object-reserved-fields",
      invalidDocument,
      [
        {
          message:
            "Do not define id or type inside attributes or relationships.",
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
            "properties",
            "id",
          ],
          severity: DiagnosticSeverity.Error,
        },
      ],
    );
  });

  it("valid resource-object-reserved-fields case", async () => {
    await expectRuleErrors(
      spectral,
      "resource-object-reserved-fields",
      validDocument,
      [],
    );
  });
});
