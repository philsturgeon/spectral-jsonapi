import testRule from "./__helpers__/helper";
import { asResponseDoc } from "./__helpers__/fixtures";

testRule("jsonapi-object", [
  {
    name: "jsonapi contains unsupported property",
    document: asResponseDoc({
      type: "object",
      properties: {
        jsonapi: {
          type: "object",
          properties: {
            revision: { type: "string" },
          },
        },
      },
    }),
    errors: [{}, {}],
  },
]);
