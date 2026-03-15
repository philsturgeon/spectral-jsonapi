import testRule from "./__helpers__/helper";
import { base } from "./__helpers__/fixtures";

testRule("error-object-source-schema", [
  {
    name: "error source pointer misses json-pointer format",
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
                              source: {
                                type: "object",
                                properties: {
                                  pointer: {
                                    oneOf: [{ type: "string" }],
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
      },
    },
    errors: [{}, {}],
  },
]);
