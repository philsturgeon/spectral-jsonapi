import testRule from "./__helpers__/helper";
import { asResponseDoc } from "./__helpers__/fixtures";

testRule("relationships-object-type", [
  {
    name: "relationships declared as array",
    document: asResponseDoc({
      type: "object",
      properties: {
        data: {
          type: "object",
          properties: {
            type: { type: "string" },
            relationships: { type: "array" },
          },
        },
      },
    }),
    errors: [{}],
  },
]);
