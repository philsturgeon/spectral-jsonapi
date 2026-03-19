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
      post: {
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
          "201": {
            description: "created",
          },
        },
      },
    },
  },
};

const validDocument = structuredClone(invalidDocument);
delete validDocument.paths["/articles"].post.requestBody.content[
  "application/vnd.api+json"
].schema.properties.data.items;
validDocument.paths["/articles"].post.requestBody.content[
  "application/vnd.api+json"
].schema.properties.data.type = "object";

describe("Rule post-requests-single-object", () => {
  let spectral = createWithRules(["post-requests-single-object"]);

  beforeEach(() => {
    spectral = createWithRules(["post-requests-single-object"]);
  });

  it("post data is incorrectly an array", async () => {
    await expectRuleErrors(
      spectral,
      "post-requests-single-object",
      invalidDocument,
      [
        {
          message:
            "POST request data must be a single resource object, not an array.",
          path: [
            "paths",
            "/articles",
            "post",
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

  it("valid post-requests-single-object case", async () => {
    await expectRuleErrors(
      spectral,
      "post-requests-single-object",
      validDocument,
      [],
    );
  });
});
