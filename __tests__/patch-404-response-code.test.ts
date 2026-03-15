import testRule from "./__helpers__/helper";
import { asPatchDoc } from "./__helpers__/fixtures";

testRule("patch-404-response-code", [
  {
    name: "patch missing 404 response",
    document: asPatchDoc(
      {
        type: "object",
        properties: { data: { type: "object" } },
      },
      { "200": { description: "ok" } },
    ),
    errors: [{}],
  },
]);
