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
          "404": {
            description: "not found",
          },
        },
      },
    },
  },
};

const validDocument = structuredClone(invalidDocument);
validDocument.paths["/articles/{id}"].delete.responses["204"] = {
  description: "no content",
};

describe("Rule delete-2xx-response-codes", () => {
  let spectral = createWithRules(["delete-2xx-response-codes"]);

  beforeEach(() => {
    spectral = createWithRules(["delete-2xx-response-codes"]);
  });

  it("delete has no success 2xx response", async () => {
    await expectRuleErrors(
      spectral,
      "delete-2xx-response-codes",
      invalidDocument,
      [
        {
          message:
            "DELETE operations must define at least one success response: 200, 202, or 204.",
          path: ["paths", "/articles/{id}", "delete", "responses"],
          severity: DiagnosticSeverity.Error,
        },
      ],
    );
  });

  it("valid delete-2xx-response-codes case", async () => {
    await expectRuleErrors(
      spectral,
      "delete-2xx-response-codes",
      validDocument,
      [],
    );
  });
});
