import testRule from "./__helpers__/helper";
import { asResponseDoc } from "./__helpers__/fixtures";

testRule("resource-object-id-required", [
  {
    name: "resource object omits id",
    document: asResponseDoc({
      type: "object",
      properties: {
        data: {
          type: "object",
          properties: {
            type: { type: "string" },
          },
        },
      },
    }),
    errors: [{}],
  },
]);
