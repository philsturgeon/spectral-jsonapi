import testRule from "./__helpers__/helper";
import { base } from "./__helpers__/fixtures";

testRule("sort-parameter", [
  {
    name: "sort incorrectly uses explode true",
    document: {
      ...base,
      paths: {
        "/articles": {
          get: {
            parameters: [
              {
                name: "sort",
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
]);
