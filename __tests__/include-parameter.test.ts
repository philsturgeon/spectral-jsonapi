import testRule from "./__helpers__/helper";
import { base } from "./__helpers__/fixtures";

testRule("include-parameter", [
  {
    name: "include incorrectly uses explode true",
    document: {
      ...base,
      paths: {
        "/articles": {
          get: {
            parameters: [
              {
                name: "include",
                in: "query",
                style: "form",
                explode: true,
                schema: { type: "array", items: { type: "string" } },
              },
            ],
            responses: { "200": { description: "ok" } },
          },
        },
      },
    },
    errors: [{}],
  },
  {
    name: "include supports dotted relationship paths",
    document: {
      ...base,
      paths: {
        "/articles/{id}": {
          get: {
            parameters: [
              {
                name: "include",
                in: "query",
                style: "form",
                explode: false,
                schema: { type: "array", items: { type: "string" } },
                example: ["comments.author", "ratings"],
              },
            ],
            responses: { "200": { description: "ok" } },
          },
        },
      },
    },
    errors: [],
  },
]);
