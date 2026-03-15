import testRule from "./__helpers__/helper";
import { base } from "./__helpers__/fixtures";

testRule("415-response-code", [
  {
    name: "missing 415 on post",
    document: {
      ...base,
      paths: {
        "/articles": {
          post: { responses: { "201": { description: "created" } } },
        },
      },
    },
    errors: [{}],
  },
]);
