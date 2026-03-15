import testRule from "./__helpers__/helper";
import { asPatchDoc } from "./__helpers__/fixtures";

testRule("patch-2xx-response-codes", [
  {
    name: "patch has no success 2xx response",
    document: asPatchDoc(
      {
        type: "object",
        properties: { data: { type: "object" } },
      },
      { "409": { description: "conflict" } },
    ),
    errors: [{}],
  },
]);
