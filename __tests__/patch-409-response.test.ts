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
          "409": {
            description: "conflict",
          },
        },
      },
    },
  },
};

const validDocument = structuredClone(invalidDocument);
delete validDocument.paths["/articles/{id}"].patch.responses["409"];

describe("Rule patch-409-response", () => {
  let spectral = createWithRules(["patch-409-response"]);

  beforeEach(() => {
    spectral = createWithRules(["patch-409-response"]);
  });

  it("patch includes explicit 409 response", async () => {
    await expectRuleErrors(spectral, "patch-409-response", invalidDocument, [
      {
        message:
          "PATCH 409 responses should include source to explain the conflict.",
        path: ["paths", "/articles/{id}", "patch", "responses", "409"],
        severity: DiagnosticSeverity.Information,
      },
    ]);
  });

  it("valid patch-409-response case", async () => {
    await expectRuleErrors(spectral, "patch-409-response", validDocument, []);
  });
});
