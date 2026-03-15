import testRule from "./__helpers__/helper";
import { base } from "./__helpers__/fixtures";

testRule("post-201-response", [
  {
    name: "201 response schema required omits data",
    document: {
      ...base,
      paths: {
        "/articles": {
          post: {
            responses: {
              "201": {
                description: "created",
                content: {
                  "application/vnd.api+json": {
                    schema: {
                      type: "object",
                      required: ["meta"],
                      properties: { meta: { type: "object" } },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    errors: [{}],
  },
]);
