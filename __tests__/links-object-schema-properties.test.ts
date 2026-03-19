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
                      properties: {
                        self: {
                          type: "object",
                          properties: {
                            url: {
                              type: "string",
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
        },
      },
    },
  },
};

const validDocument = structuredClone(invalidDocument);
delete validDocument.paths["/articles/{id}"].get.responses["200"].content[
  "application/vnd.api+json"
].schema.properties.links.properties.self.properties.url;
validDocument.paths["/articles/{id}"].get.responses["200"].content[
  "application/vnd.api+json"
].schema.properties.links.properties.self.properties.href = {
  type: "string",
};

describe("Rule links-object-schema-properties", () => {
  let spectral = createWithRules(["links-object-schema-properties"]);

  beforeEach(() => {
    spectral = createWithRules(["links-object-schema-properties"]);
  });

  it("link object uses url field instead of href", async () => {
    await expectRuleErrors(
      spectral,
      "links-object-schema-properties",
      invalidDocument,
      [
        {
          message:
            "Link objects may only contain href and meta, and must include href.",
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
            "links",
            "properties",
            "self",
            "properties",
          ],
          severity: DiagnosticSeverity.Error,
        },
        {
          message:
            "Link objects may only contain href and meta, and must include href.",
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
            "links",
            "properties",
            "self",
            "properties",
            "url",
          ],
          severity: DiagnosticSeverity.Error,
        },
      ],
    );
  });

  it("valid links-object-schema-properties case", async () => {
    await expectRuleErrors(
      spectral,
      "links-object-schema-properties",
      validDocument,
      [],
    );
  });
});
