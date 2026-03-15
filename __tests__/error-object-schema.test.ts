import testRule from "./__helpers__/helper";
import { base } from "./__helpers__/fixtures";

testRule("error-object-schema", [
  {
    name: "error object includes unsupported member",
    document: {
      ...base,
      paths: {
        "/articles": {
          get: {
            responses: {
              "400": {
                description: "bad request",
                content: {
                  "application/vnd.api+json": {
                    schema: {
                      type: "object",
                      properties: {
                        errors: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              badField: { type: "string" },
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
    errors: [{}],
  },
]);
