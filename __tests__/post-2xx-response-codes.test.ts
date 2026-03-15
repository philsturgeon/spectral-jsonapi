import testRule from "./__helpers__/helper";
import { asPostDoc } from "./__helpers__/fixtures";

testRule("post-2xx-response-codes", [
  {
    name: "post has no success 2xx response",
    document: asPostDoc(
      {
        type: "object",
        properties: { data: { type: "object" } },
      },
      { "409": { description: "conflict" } },
    ),
    errors: [{}],
  },
]);
