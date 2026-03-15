import testRule from "./__helpers__/helper";
import { asResponseDoc } from "./__helpers__/fixtures";

testRule("links-object-schema", [
  {
    name: "link member is number",
    document: asResponseDoc({
      type: "object",
      properties: {
        links: {
          type: "object",
          properties: {
            self: { type: "number" },
          },
        },
      },
    }),
    errors: [{}],
  },
]);
