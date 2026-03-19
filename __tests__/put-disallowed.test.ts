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
      put: {
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
delete validDocument.paths["/articles/{id}"].put;
validDocument.paths["/articles/{id}"].patch = {
  responses: {
    "200": {
      description: "ok",
    },
  },
};

describe("Rule put-disallowed", () => {
  let spectral = createWithRules(["put-disallowed"]);

  beforeEach(() => {
    spectral = createWithRules(["put-disallowed"]);
  });

  it("put operation is present", async () => {
    await expectRuleErrors(spectral, "put-disallowed", invalidDocument, [
      {
        message: "PUT is not allowed by JSON:API; use PATCH.",
        path: ["paths", "/articles/{id}", "put"],
        severity: DiagnosticSeverity.Error,
      },
    ]);
  });

  it("valid put-disallowed case", async () => {
    await expectRuleErrors(spectral, "put-disallowed", validDocument, []);
  });
});
