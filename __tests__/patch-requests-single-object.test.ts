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
      patch: {
        requestBody: {
          content: {
            "application/vnd.api+json": {
              schema: {
                type: "object",
                properties: {
                  data: {
                    type: "array",
                    items: {
                      type: "object",
                    },
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
        },
      },
    },
  },
};

const validDocument = structuredClone(invalidDocument);
delete validDocument.paths["/articles/{id}"].patch.requestBody.content[
  "application/vnd.api+json"
].schema.properties.data.items;
validDocument.paths["/articles/{id}"].patch.requestBody.content[
  "application/vnd.api+json"
].schema.properties.data.type = "object";

describe("Rule patch-requests-single-object", () => {
  let spectral = createWithRules(["patch-requests-single-object"]);

  beforeEach(() => {
    spectral = createWithRules(["patch-requests-single-object"]);
  });

  it("patch data is incorrectly an array", async () => {
    await expectRuleErrors(
      spectral,
      "patch-requests-single-object",
      invalidDocument,
      [
        {
          message:
            "PATCH request data must be a single resource object, not an array.",
          path: [
            "paths",
            "/articles/{id}",
            "patch",
            "requestBody",
            "content",
            "application/vnd.api+json",
            "schema",
            "properties",
            "data",
            "type",
          ],
          severity: DiagnosticSeverity.Error,
        },
      ],
    );
  });

  it("valid patch-requests-single-object case", async () => {
    await expectRuleErrors(
      spectral,
      "patch-requests-single-object",
      validDocument,
      [],
    );
  });
});
