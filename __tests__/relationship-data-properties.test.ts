import testRule from "./__helpers__/helper";
import { asResponseDoc } from "./__helpers__/fixtures";

testRule("relationship-data-properties", [
  {
    name: "relationship data includes attributes",
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
                        id: { type: "string" },
                        type: { type: "string" },
                        attributes: { type: "object" },
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
