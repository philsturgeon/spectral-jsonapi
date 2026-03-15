import testRule from "./__helpers__/helper";
import { base } from "./__helpers__/fixtures";

testRule("error-object-links", [
  {
    name: "error links lacks about link",
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
                              links: {
                                type: "object",
                                properties: {
                                  self: { type: "string" },
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
    errors: [{}],
  },
]);
