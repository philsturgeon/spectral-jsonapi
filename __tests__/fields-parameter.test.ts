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
        parameters: [
          {
            name: "fields",
            in: "query",
            style: "form",
            schema: {
              type: "object",
            },
          },
        ],
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
validDocument.paths["/articles"].get.parameters[0].style = "deepObject";

describe("Rule fields-parameter", () => {
  let spectral = createWithRules(["fields-parameter"]);

  beforeEach(() => {
    spectral = createWithRules(["fields-parameter"]);
  });

  it("fields incorrectly uses form style", async () => {
    await expectRuleErrors(spectral, "fields-parameter", invalidDocument, [
      {
        message: "fields must be a query parameter using deepObject style.",
        path: ["paths", "/articles", "get", "parameters", "0", "style"],
        severity: DiagnosticSeverity.Error,
      },
    ]);
  });

  it("valid fields-parameter case", async () => {
    await expectRuleErrors(spectral, "fields-parameter", validDocument, []);
  });
});
