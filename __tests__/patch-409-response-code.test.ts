import testRule from "./__helpers__/helper";
import { asPatchDoc } from "./__helpers__/fixtures";

testRule("patch-409-response-code", [
  {
    name: "patch missing 409 response",
    document: asPatchDoc(
      {
        type: "object",
        properties: { data: { type: "object" } },
      },
      {
        "200": { description: "ok" },
        "404": { description: "not found" },
      },
    ),
    errors: [{}],
  },
]);
