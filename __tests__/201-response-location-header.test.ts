import { DiagnosticSeverity } from "@stoplight/types";
import { createWithRules, expectRuleErrors } from "./__helpers__/helper";

describe("Rule 201-response-location-header", () => {
  let spectral = createWithRules(["201-response-location-header"]);

  beforeEach(() => {
    spectral = createWithRules(["201-response-location-header"]);
  });

  it("201 response omits Location header", async () => {
    const document = {
      openapi: "3.1.0",
      info: {
        title: "Test",
        version: "1.0.0",
      },
      paths: {
        "/articles": {
          post: {
            responses: {
              "201": {
                description: "created",
                headers: {},
              },
            },
          },
        },
      },
    };

    await expectRuleErrors(spectral, "201-response-location-header", document, [
      {
        message: "POST 201 responses should include a Location header.",
        path: ["paths", "/articles", "post", "responses", "201", "headers"],
        severity: DiagnosticSeverity.Information,
      },
    ]);
  });

  it("valid 201-response-location-header case", async () => {
    const document = {
      openapi: "3.1.0",
      info: {
        title: "Test",
        version: "1.0.0",
      },
      paths: {
        "/articles": {
          post: {
            responses: {
              "201": {
                description: "created",
                headers: {
                  Location: {
                    schema: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
        },
      },
    };

    await expectRuleErrors(
      spectral,
      "201-response-location-header",
      document,
      [],
    );
  });
});
