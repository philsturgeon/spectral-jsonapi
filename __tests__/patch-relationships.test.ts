import testRule from "./__helpers__/helper";
import { asPatchDoc } from "./__helpers__/fixtures";

testRule("patch-relationships", [
  {
    name: "patch relationship has links only",
    document: asPatchDoc({
      type: "object",
      properties: {
        data: {
          type: "object",
          properties: {
            type: { type: "string" },
            relationships: {
              type: "object",
              properties: {
                author: {
                  type: "object",
                  required: ["links"],
                  properties: {
                    links: { type: "object" },
                  },
                },
              },
            },
          },
        },
      },
    }),
    errors: [{}],
  },
]);
