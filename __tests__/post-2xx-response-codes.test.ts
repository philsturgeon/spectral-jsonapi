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
                    type: "object",
                  },
                },
              },
            },
          },
        },
        responses: {
          "409": {
            description: "conflict",
          },
        },
      },
    },
  },
};

const validDocument = structuredClone(invalidDocument);
validDocument.paths["/articles"].post.responses["201"] = {
  description: "created",
};

describe("Rule post-2xx-response-codes", () => {
  let spectral = createWithRules(["post-2xx-response-codes"]);

  beforeEach(() => {
    spectral = createWithRules(["post-2xx-response-codes"]);
  });

  it("post has no success 2xx response", async () => {
    await expectRuleErrors(
      spectral,
      "post-2xx-response-codes",
      invalidDocument,
      [
        {
          message:
            "POST operations must define at least one success response: 201, 202, or 204.",
          path: ["paths", "/articles", "post", "responses"],
          severity: DiagnosticSeverity.Error,
        },
      ],
    );
  });

  it("valid post-2xx-response-codes case", async () => {
    await expectRuleErrors(
      spectral,
      "post-2xx-response-codes",
      validDocument,
      [],
    );
  });
});
