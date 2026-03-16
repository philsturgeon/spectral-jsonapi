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

testRule("relationship-schema", [
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
          "Each relationship object must include links, data, or meta and match JSON:API structure.",
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
          "Each relationship object must include links, data, or meta and match JSON:API structure.",
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
    name: "valid: relationship that only has links.related passes",
    document: documentTemplate({
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
    }),
    errors: [],
  },
]);
