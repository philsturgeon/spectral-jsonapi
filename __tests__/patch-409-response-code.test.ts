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
          "404": {
            description: "not found",
          },
        },
      },
    },
  },
};

const validDocument = structuredClone(invalidDocument);
validDocument.paths["/articles/{id}"].patch.responses["409"] = {
  description: "conflict",
};

describe("Rule patch-409-response-code", () => {
  let spectral = createWithRules(["patch-409-response-code"]);

  beforeEach(() => {
    spectral = createWithRules(["patch-409-response-code"]);
  });

  it("patch missing 409 response", async () => {
    await expectRuleErrors(
      spectral,
      "patch-409-response-code",
      invalidDocument,
      [
        {
          message: "PATCH operations must define a 409 conflict response.",
          path: ["paths", "/articles/{id}", "patch", "responses"],
          severity: DiagnosticSeverity.Error,
        },
      ],
    );
  });

  it("valid patch-409-response-code case", async () => {
    await expectRuleErrors(
      spectral,
      "patch-409-response-code",
      validDocument,
      [],
    );
  });
});
