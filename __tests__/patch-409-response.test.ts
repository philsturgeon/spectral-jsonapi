import { DiagnosticSeverity } from "@stoplight/types";
import { createWithRules, expectRuleErrors } from "./__helpers__/helper";
import { openApiBase } from "./__helpers__/fixtures";

describe("Rule patch-409-response", () => {
  let spectral = createWithRules(["patch-409-response"]);

  beforeEach(() => {
    spectral = createWithRules(["patch-409-response"]);
  });

  it("invalid: 409 response errors object does not define source", async () => {
    const document = {
      ...openApiBase,
      paths: {
        "/articles/{id}": {
          patch: {
            requestBody: {
              content: {
                "application/vnd.api+json": {
                  schema: {
                    type: "object",
                    properties: {
                      data: {
                        type: "object",
                      },
                    },
                  },
                },
              },
            },
            responses: {
              "200": {
                description: "ok",
              },
              "409": {
                description: "conflict",
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
                              title: { type: "string" },
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

    await expectRuleErrors(spectral, "patch-409-response", document, [
      {
        message:
          "PATCH 409 error objects should include source to explain the conflict.",
        path: [
          "paths",
          "/articles/{id}",
          "patch",
          "responses",
          "409",
          "content",
          "application/vnd.api+json",
          "schema",
          "properties",
          "errors",
          "items",
          "properties",
        ],
        severity: DiagnosticSeverity.Information,
      },
    ]);
  });

  it("valid: 409 response errors object includes source", async () => {
    const document = {
      ...openApiBase,
      paths: {
        "/articles/{id}": {
          patch: {
            requestBody: {
              content: {
                "application/vnd.api+json": {
                  schema: {
                    type: "object",
                    properties: {
                      data: {
                        type: "object",
                      },
                    },
                  },
                },
              },
            },
            responses: {
              "200": {
                description: "ok",
              },
              "409": {
                description: "conflict",
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
                                    type: "string",
                                    format: "json-pointer",
                                  },
                                  parameter: {
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
      },
    };

    await expectRuleErrors(spectral, "patch-409-response", document, []);
  });
});
