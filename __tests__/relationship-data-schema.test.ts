import testRule from "./__helpers__/helper";
import { asResponseDoc } from "./__helpers__/fixtures";

testRule("relationship-data-schema", [
  {
    name: "relationship data id is not string",
    document: asResponseDoc({
      type: "object",
      properties: {
        data: {
          type: "object",
          properties: {
            type: { type: "string" },
            relationships: {
              type: "object",
              properties: {
                author: {
                  type: "object",
                  properties: {
                    data: {
                      type: "object",
                      properties: {
                        id: { type: "integer" },
                        type: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    }),
    errors: [{}],
  },
]);
