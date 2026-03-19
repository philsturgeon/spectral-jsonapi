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
                          type: "object",
                          properties: {
                            links: {
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
};

const validDocument = structuredClone(invalidDocument);
delete validDocument.paths["/articles/{id}"].get.responses["200"].content[
  "application/vnd.api+json"
].schema.properties.data.properties.attributes.properties.links;

describe("Rule attributes-object-properties", () => {
  let spectral = createWithRules(["attributes-object-properties"]);

  beforeEach(() => {
    spectral = createWithRules(["attributes-object-properties"]);
  });

  it("attributes declares links property", async () => {
    await expectRuleErrors(
      spectral,
      "attributes-object-properties",
      invalidDocument,
      [
        {
          message: "attributes must not contain links or relationships.",
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
            "links",
          ],
          severity: DiagnosticSeverity.Error,
        },
      ],
    );
  });

  it("valid attributes-object-properties case", async () => {
    await expectRuleErrors(
      spectral,
      "attributes-object-properties",
      validDocument,
      [],
    );
  });
});
