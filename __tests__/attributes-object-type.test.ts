import testRule from "./__helpers__/helper";
import { asResponseDoc } from "./__helpers__/fixtures";

testRule("attributes-object-type", [
  {
    name: "attributes is declared as array",
    document: asResponseDoc({
      type: "object",
      properties: {
        data: {
          type: "object",
          properties: {
            type: { type: "string" },
            attributes: { type: "array" },
          },
        },
      },
    }),
    errors: [{}],
  },
]);
