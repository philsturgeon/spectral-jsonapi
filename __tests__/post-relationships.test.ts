import testRule from "./__helpers__/helper";
import { asPostDoc } from "./__helpers__/fixtures";

testRule("post-relationships", [
  {
    name: "post relationship has links only",
    document: asPostDoc({
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
