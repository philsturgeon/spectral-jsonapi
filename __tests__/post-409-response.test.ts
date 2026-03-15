import testRule from "./__helpers__/helper";
import { asPostDoc } from "./__helpers__/fixtures";

testRule("post-409-response", [
  {
    name: "post includes explicit 409 response",
    document: asPostDoc(
      {
        type: "object",
        properties: { data: { type: "object" } },
      },
      {
        "201": { description: "created" },
        "409": { description: "conflict" },
      },
    ),
    errors: [{}],
  },
]);
