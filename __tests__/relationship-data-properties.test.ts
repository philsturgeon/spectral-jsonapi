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
                          type: "object",
                          properties: {
                            author: {
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
      },
    },
  },
};

const validDocument = structuredClone(invalidDocument);
delete validDocument.paths["/articles/{id}"].get.responses["200"].content[
  "application/vnd.api+json"
].schema.properties.data.properties.relationships.properties.author.properties
  .data.properties.attributes;

describe("Rule relationship-data-properties", () => {
  let spectral = createWithRules(["relationship-data-properties"]);

  beforeEach(() => {
    spectral = createWithRules(["relationship-data-properties"]);
  });

  it("relationship data includes attributes", async () => {
    await expectRuleErrors(
      spectral,
      "relationship-data-properties",
      invalidDocument,
      [
        {
          message: "Relationship data may only include id, type, and meta.",
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
            "properties",
            "author",
            "properties",
            "data",
            "properties",
            "attributes",
          ],
          severity: DiagnosticSeverity.Error,
        },
      ],
    );
  });

  it("valid relationship-data-properties case", async () => {
    await expectRuleErrors(
      spectral,
      "relationship-data-properties",
      validDocument,
      [],
    );
  });
});
