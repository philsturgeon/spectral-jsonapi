import testRule from "./__helpers__/helper";
import { asResponseDoc } from "./__helpers__/fixtures";

testRule("resource-object-property-types", [
  {
    name: "resource id typed as integer",
    document: asResponseDoc({
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
    }),
    errors: [{}],
  },
]);
