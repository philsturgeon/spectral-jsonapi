import testRule from "./__helpers__/helper";
import { asResponseDoc } from "./__helpers__/fixtures";

testRule("links-object-schema-properties", [
  {
    name: "link object uses url field instead of href",
    document: asResponseDoc({
      type: "object",
      properties: {
        links: {
          type: "object",
          properties: {
            self: {
              type: "object",
              properties: {
                url: { type: "string" },
              },
            },
          },
        },
      },
    }),
    errors: [{}, {}, {}],
  },
]);
