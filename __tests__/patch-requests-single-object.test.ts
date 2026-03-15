import testRule from "./__helpers__/helper";
import { asPatchDoc } from "./__helpers__/fixtures";

testRule("patch-requests-single-object", [
  {
    name: "patch data is incorrectly an array",
    document: asPatchDoc({
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
