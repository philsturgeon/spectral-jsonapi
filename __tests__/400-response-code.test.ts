import testRule from "./__helpers__/helper";
import { base } from "./__helpers__/fixtures";

testRule("400-response-code", [
  {
    name: "missing 400 response",
    document: {
      ...base,
      paths: {
        "/articles": { get: { responses: { "200": { description: "ok" } } } },
      },
    },
    errors: [{}],
  },
]);
