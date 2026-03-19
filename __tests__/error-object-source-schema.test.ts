import { DiagnosticSeverity } from "@stoplight/types";
import { createWithRules, expectRuleErrors } from "./__helpers__/helper";

const invalidDocument = {
  openapi: "3.1.0",
  info: {
    title: "Test",
    version: "1.0.0",
  },
  paths: {
    "/articles": {
      get: {
        responses: {
          "400": {
            description: "bad request",
            content: {
              "application/vnd.api+json": {
                schema: {
                  type: "object",
                  properties: {
                    errors: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          source: {
                            type: "object",
                            properties: {
                              pointer: {
                                oneOf: [
                                  {
                                    type: "string",
                                  },
                                ],
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
validDocument.paths["/articles"].get.responses["400"].content[
  "application/vnd.api+json"
].schema.properties.errors.items.properties.source.properties.pointer.oneOf[0].format =
  "json-pointer";

describe("Rule error-object-source-schema", () => {
  let spectral = createWithRules(["error-object-source-schema"]);

  beforeEach(() => {
    spectral = createWithRules(["error-object-source-schema"]);
  });

  it("error source pointer misses json-pointer format", async () => {
    await expectRuleErrors(
      spectral,
      "error-object-source-schema",
      invalidDocument,
      [
        {
          message:
            "Error object source must include pointer or parameter and match schema.",
          path: [
            "paths",
            "/articles",
            "get",
            "responses",
            "400",
            "content",
            "application/vnd.api+json",
            "schema",
            "properties",
            "errors",
            "items",
            "properties",
            "source",
            "properties",
            "pointer",
            "oneOf",
            "0",
          ],
          severity: DiagnosticSeverity.Error,
        },
        {
          message:
            "Error object source must include pointer or parameter and match schema.",
          path: [
            "paths",
            "/articles",
            "get",
            "responses",
            "400",
            "content",
            "application/vnd.api+json",
            "schema",
            "properties",
            "errors",
            "items",
            "properties",
            "source",
            "properties",
            "pointer",
            "oneOf",
            "0",
            "type",
          ],
          severity: DiagnosticSeverity.Error,
        },
      ],
    );
  });

  it("valid error-object-source-schema case", async () => {
    await expectRuleErrors(
      spectral,
      "error-object-source-schema",
      validDocument,
      [],
    );
  });
});
