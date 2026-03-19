import { DiagnosticSeverity } from "@stoplight/types";
import testRule from "./__helpers__/helper";
import { asResponseDoc } from "./__helpers__/fixtures";

const documentTemplate = (relationshipsSchema: any) =>
  asResponseDoc({
    type: "object",
    properties: {
      data: {
        type: "object",
        properties: {
          type: { type: "string" },
          relationships: relationshipsSchema,
        },
      },
    },
  });

const sharedRelationshipSchemas = {
  BaseModel: {
    type: "object",
    properties: {
      id: {
        type: "string",
      },
    },
  },
  Link: {
    type: "object",
  },
  RelationshipSingular: {
    title: "Relationship Singular",
    type: "object",
    properties: {
      data: {
        oneOf: [
          {
            type: "object",
            properties: {
              type: {
                type: "string",
              },
              id: {
                type: "string",
              },
            },
            required: ["type", "id"],
          },
          {
            type: "null",
          },
        ],
      },
      links: {
        type: "object",
        properties: {
          self: {
            $ref: "#/components/schemas/Link",
          },
          related: {
            $ref: "#/components/schemas/Link",
          },
        },
      },
    },
  },
  RelationshipPlural: {
    title: "Relationship Plural",
    type: "object",
    properties: {
      data: {
        type: "array",
        items: {
          type: "object",
          properties: {
            type: {
              type: "string",
            },
            id: {
              type: "string",
            },
          },
        },
      },
      links: {
        type: "object",
        properties: {
          self: {
            $ref: "#/components/schemas/Link",
          },
          related: {
            $ref: "#/components/schemas/Link",
          },
        },
      },
    },
  },
};

const componentResponseDocument = (
  schemaName: string,
  schemas: Record<string, unknown>,
) => ({
  ...asResponseDoc({
    type: "object",
    properties: {
      data: {
        $ref: `#/components/schemas/${schemaName}`,
      },
    },
  }),
  components: {
    schemas,
  },
});

testRule("relationship-schema", [
  {
    name: "valid: relationship that only has links.related passes",
    document: documentTemplate({
      type: "object",
      properties: {
        comments: {
          type: "object",
          properties: {
            links: {
              type: "object",
              properties: {
                related: { type: "object" },
              },
            },
          },
        },
      },
    }),
    errors: [],
  },
  {
    name: "valid: having both links and data works even when using allOf",
    document: {
      ...documentTemplate({
        comments: {
          allOf: [
            {
              $ref: "#/components/schemas/RelationshipPlural",
            },
            {
              type: "object",
              properties: {
                data2: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      type: {
                        type: "string",
                        const: "people",
                      },
                    },
                  },
                },
              },
            },
          ],
        },
      }),
      components: {
        schemas: {
          RelationshipPlural: {
            type: "object",
            properties: {
              links: {
                type: "object",
                properties: {},
              },
            },
          },
        },
      },
    },
    errors: [],
  },
  {
    name: "invalid: relationship entry missing links data and meta",
    document: documentTemplate({
      type: "object",
      properties: {
        author: {
          type: "object",
          properties: {},
        },
      },
    }),
    errors: [
      {
        message:
          "Each relationship object must include links, data, or meta, and match JSON:API structure.",
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
          "data",
          "properties",
          "relationships",
          "properties",
          "author",
        ],
        severity: DiagnosticSeverity.Error,
      },
      {
        message:
          "Each relationship object must include links, data, or meta, and match JSON:API structure.",
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
          "data",
          "properties",
          "relationships",
          "properties",
          "author",
          "properties",
        ],
        severity: DiagnosticSeverity.Error,
      },
    ],
  },
  {
    name: "invalid: relationship entry with link data but no meta",
    document: documentTemplate({
      type: "object",
      properties: {
        author: {
          type: "object",
          properties: {
            links: {
              type: "object",
              properties: {
                href: { type: "string" },
              },
            },
          },
        },
      },
    }),
    errors: [
      {
        message:
          "Each relationship object must include links, data, or meta, and match JSON:API structure.",
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
          "data",
          "properties",
          "relationships",
          "properties",
          "author",
        ],
        severity: DiagnosticSeverity.Error,
      },
      {
        message:
          "Each relationship object must include links, data, or meta, and match JSON:API structure.",
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
          "data",
          "properties",
          "relationships",
          "properties",
          "author",
          "properties",
          "links",
          "properties",
        ],
        severity: DiagnosticSeverity.Error,
      },
    ],
  },
  {
    name: "valid: real PortalListing relationship composed with allOf is not flagged",
    document: componentResponseDocument("PortalListing", {
      ...sharedRelationshipSchemas,
      PortalListing: {
        allOf: [
          {
            $ref: "#/components/schemas/BaseModel",
          },
          {
            type: "object",
            properties: {
              type: {
                type: "string",
                enum: ["portal_listing"],
              },
              relationships: {
                type: "object",
                properties: {
                  portal: {
                    allOf: [
                      {
                        $ref: "#/components/schemas/RelationshipSingular",
                      },
                      {
                        type: "object",
                        properties: {
                          data: {
                            type: ["object", "null"],
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        ],
      },
    }),
    errors: [],
  },
  {
    name: "valid: real IncludedQuestionnaire plural relationship composed with allOf is not flagged",
    document: componentResponseDocument("IncludedQuestionnaire", {
      ...sharedRelationshipSchemas,
      IncludedQuestionnaire: {
        allOf: [
          {
            $ref: "#/components/schemas/BaseModel",
          },
          {
            type: "object",
            properties: {
              type: {
                type: "string",
                enum: ["questionnaire"],
              },
              relationships: {
                type: "object",
                properties: {
                  sections: {
                    allOf: [
                      {
                        $ref: "#/components/schemas/RelationshipPlural",
                      },
                      {
                        type: "object",
                        properties: {
                          data: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                type: {
                                  type: "string",
                                  enum: ["questionnaire_section"],
                                },
                              },
                            },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        ],
      },
    }),
    errors: [],
  },
]);
