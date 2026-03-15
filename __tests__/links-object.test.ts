import testRule from "./__helpers__/helper";
import { asResponseDoc } from "./__helpers__/fixtures";

testRule("links-object", [
  {
    name: "links is typed as array",
    document: asResponseDoc({
      type: "object",
      properties: { links: { type: "array" } },
    }),
    errors: [{}],
  },
]);
