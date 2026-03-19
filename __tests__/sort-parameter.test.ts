import { DiagnosticSeverity } from "@stoplight/types";
import { createWithRules, expectRuleErrors } from "./__helpers__/helper";
import { base } from "./__helpers__/fixtures";

const invalidDocument = {
  ...base,
  paths: {
    "/articles": {
      get: {
        parameters: [
          {
            name: "sort",
            in: "query",
            style: "form",
            explode: true,
            schema: {
              type: "array",
              items: {
                type: "string",
              },
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
validDocument.paths["/articles"].get.parameters[0].explode = false;

describe("Rule sort-parameter", () => {
  let spectral = createWithRules(["sort-parameter"]);

  beforeEach(() => {
    spectral = createWithRules(["sort-parameter"]);
  });

  it("sort incorrectly uses explode true", async () => {
    await expectRuleErrors(spectral, "sort-parameter", invalidDocument, [
      {
        message: "sort must be a query parameter using CSV array style.",
        path: ["paths", "/articles", "get", "parameters", "0", "explode"],
        severity: DiagnosticSeverity.Error,
      },
    ]);
  });

  it("valid sort-parameter case", async () => {
    await expectRuleErrors(spectral, "sort-parameter", validDocument, []);
  });
});
