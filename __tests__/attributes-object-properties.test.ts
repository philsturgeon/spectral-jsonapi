import testRule from "./__helpers__/helper";
import { asResponseDoc } from "./__helpers__/fixtures";

testRule("attributes-object-properties", [
  {
    name: "attributes declares links property",
    document: asResponseDoc({
      type: "object",
      properties: {
        data: {
          type: "object",
          properties: {
            type: { type: "string" },
            attributes: {
              type: "object",
              properties: {
                links: { type: "object" },
              },
            },
          },
        },
      },
    }),
    errors: [{}, {}],
  },
]);
