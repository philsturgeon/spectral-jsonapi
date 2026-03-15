import testRule from "./__helpers__/helper";
import { asPostDoc } from "./__helpers__/fixtures";

testRule("post-409-response-code", [
  {
    name: "post missing 409 response",
    document: asPostDoc(
      {
        type: "object",
        properties: { data: { type: "object" } },
      },
      { "201": { description: "created" } },
    ),
    errors: [{}],
  },
]);
