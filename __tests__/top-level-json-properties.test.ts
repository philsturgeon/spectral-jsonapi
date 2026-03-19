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
};

const validDocument = structuredClone(invalidDocument);
validDocument.paths["/articles/{id}"].get.responses["200"].content[
  "application/vnd.api+json"
].schema.properties.meta = {
  type: "object",
};

describe("Rule top-level-json-properties", () => {
  let spectral = createWithRules(["top-level-json-properties"]);

  beforeEach(() => {
    spectral = createWithRules(["top-level-json-properties"]);
  });

  it("top-level schema has links only", async () => {
    await expectRuleErrors(
      spectral,
      "top-level-json-properties",
      invalidDocument,
      [
        {
          message:
            "Top-level documents must include data, errors, or meta and follow JSON:API member rules.",
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
          ],
          severity: DiagnosticSeverity.Error,
        },
      ],
    );
  });

  it("valid top-level-json-properties case", async () => {
    await expectRuleErrors(
      spectral,
      "top-level-json-properties",
      validDocument,
      [],
    );
  });
});
