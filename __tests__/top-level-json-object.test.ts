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
                  type: "array",
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
].schema.type = "object";

describe("Rule top-level-json-object", () => {
  let spectral = createWithRules(["top-level-json-object"]);

  beforeEach(() => {
    spectral = createWithRules(["top-level-json-object"]);
  });

  it("top-level schema is not an object", async () => {
    await expectRuleErrors(spectral, "top-level-json-object", invalidDocument, [
      {
        message:
          "Request and response bodies must have a top-level JSON object.",
        path: [
          "paths",
          "/articles/{id}",
          "get",
          "responses",
          "200",
          "content",
          "application/vnd.api+json",
          "schema",
          "type",
        ],
        severity: DiagnosticSeverity.Error,
      },
    ]);
  });

  it("valid top-level-json-object case", async () => {
    await expectRuleErrors(
      spectral,
      "top-level-json-object",
      validDocument,
      [],
    );
  });
});
