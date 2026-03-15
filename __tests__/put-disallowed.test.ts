import testRule from "./__helpers__/helper";
import { base } from "./__helpers__/fixtures";

testRule("put-disallowed", [
  {
    name: "put operation is present",
    document: {
      ...base,
      paths: {
        "/articles/{id}": {
          put: {
            responses: {
              "200": { description: "ok" },
            },
          },
        },
      },
    },
    errors: [{}],
  },
]);
