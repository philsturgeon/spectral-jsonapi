import testRule from "./__helpers__/helper";
import { asResponseDoc } from "./__helpers__/fixtures";

testRule("resource-object-reserved-fields", [
  {
    name: "attributes contains reserved id",
    document: asResponseDoc({
      type: "object",
      properties: {
        data: {
          type: "object",
          properties: {
            id: { type: "string" },
            type: { type: "string" },
            attributes: {
              type: "object",
              properties: {
                id: { type: "string" },
              },
            },
          },
        },
      },
    }),
    errors: [{}, {}],
  },
]);
