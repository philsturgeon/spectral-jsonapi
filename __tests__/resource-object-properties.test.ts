import testRule from "./__helpers__/helper";
import { asResponseDoc } from "./__helpers__/fixtures";

testRule("resource-object-properties", [
  {
    name: "resource object includes unknown field",
    document: asResponseDoc({
      type: "object",
      properties: {
        data: {
          type: "object",
          properties: {
            id: { type: "string" },
            type: { type: "string" },
            name: { type: "string" },
          },
        },
      },
    }),
    errors: [{}],
  },
]);
