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
                        name: {
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
delete validDocument.paths["/articles/{id}"].get.responses["200"].content[
  "application/vnd.api+json"
].schema.properties.data.properties.name;

describe("Rule resource-object-properties", () => {
  let spectral = createWithRules(["resource-object-properties"]);

  beforeEach(() => {
    spectral = createWithRules(["resource-object-properties"]);
  });

  it("resource object includes unknown field", async () => {
    await expectRuleErrors(
      spectral,
      "resource-object-properties",
      invalidDocument,
      [
        {
          message:
            "Resource objects may only use id, type, attributes, relationships, links, and meta.",
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
            "name",
          ],
          severity: DiagnosticSeverity.Error,
        },
      ],
    );
  });

  it("valid resource-object-properties case", async () => {
    await expectRuleErrors(
      spectral,
      "resource-object-properties",
      validDocument,
      [],
    );
  });
});
