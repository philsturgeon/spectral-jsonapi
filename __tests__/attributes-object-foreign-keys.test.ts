import { DiagnosticSeverity } from "@stoplight/types";
import testRule from "./__helpers__/helper";
import { asResponseDoc } from "./__helpers__/fixtures";

const document = (attributes: Record<string, any>) => {
  return asResponseDoc({
    type: "object",
    properties: {
      data: {
        type: "object",
        properties: {
          type: {},
          attributes: attributes,
        },
      },
    },
  });
};

testRule("attributes-object-foreign-keys", [
  {
    name: "invalid: attributes includes foreign key field",
    document: document({
      author_id: { type: "string" },
    }),
    errors: [
      {
        message:
          "attributes should not include *_id foreign keys; model links with relationships.",
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
          "attributes",
          "properties",
          "author_id",
        ],
        severity: DiagnosticSeverity.Information,
      },
    ],
  },
  {
    name: "valid: snake_case field that is not a foreign key",
    document: document({
      profile_image: { type: "string" },
    }),
    errors: [],
  },
  {
    name: "valid: snake_case _id field is not greedy",
    document: document({
      user_idea: { type: "string" },
    }),
    errors: [],
  },
]);
