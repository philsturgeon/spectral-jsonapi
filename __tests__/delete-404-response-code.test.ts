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
      delete: {
        responses: {
          "204": {
            description: "no content",
          },
        },
      },
    },
  },
};

const validDocument = structuredClone(invalidDocument);
validDocument.paths["/articles/{id}"].delete.responses["404"] = {
  description: "not found",
};

describe("Rule delete-404-response-code", () => {
  let spectral = createWithRules(["delete-404-response-code"]);

  beforeEach(() => {
    spectral = createWithRules(["delete-404-response-code"]);
  });

  it("delete missing 404 response", async () => {
    await expectRuleErrors(
      spectral,
      "delete-404-response-code",
      invalidDocument,
      [
        {
          message: "DELETE operations must define a 404 response.",
          path: ["paths", "/articles/{id}", "delete", "responses"],
          severity: DiagnosticSeverity.Error,
        },
      ],
    );
  });

  it("valid delete-404-response-code case", async () => {
    await expectRuleErrors(
      spectral,
      "delete-404-response-code",
      validDocument,
      [],
    );
  });
});
