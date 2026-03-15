import testRule from "./__helpers__/helper";
import { asResponseDoc } from "./__helpers__/fixtures";

testRule("meta-object", [
  {
    name: "meta is typed as string",
    document: asResponseDoc({
      type: "object",
      properties: { meta: { type: "string" } },
    }),
    errors: [{}],
  },
]);
