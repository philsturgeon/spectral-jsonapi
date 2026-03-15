import testRule from "./__helpers__/helper";
import { asResponseDoc } from "./__helpers__/fixtures";

testRule("top-level-json-object", [
  {
    name: "top-level schema is not an object",
    document: asResponseDoc({ type: "array" }),
    errors: [{}],
  },
]);
