import testRule from "./__helpers__/helper";
import { asPostDoc } from "./__helpers__/fixtures";

testRule("post-requests-single-object", [
  {
    name: "post data is incorrectly an array",
    document: asPostDoc({
      type: "object",
      properties: {
        data: {
          type: "array",
          items: { type: "object" },
        },
      },
    }),
    errors: [{}],
  },
]);
