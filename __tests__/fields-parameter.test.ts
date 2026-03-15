import testRule from "./__helpers__/helper";
import { base } from "./__helpers__/fixtures";

testRule("fields-parameter", [
  {
    name: "fields incorrectly uses form style",
    document: {
      ...base,
      paths: {
        "/articles": {
          get: {
            parameters: [
              {
                name: "fields",
                in: "query",
                style: "form",
                schema: { type: "object" },
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
