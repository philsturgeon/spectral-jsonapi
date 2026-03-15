import testRule from "./__helpers__/helper";
import { asResponseDoc } from "./__helpers__/fixtures";

testRule("top-level-json-properties", [
  {
    name: "top-level schema has links only",
    document: asResponseDoc({
      type: "object",
      properties: {
        links: { type: "object" },
      },
    }),
    errors: [{}],
  },
]);
