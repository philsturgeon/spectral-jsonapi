import testRule from "./__helpers__/helper";
import { base } from "./__helpers__/fixtures";

testRule("delete-404-response-code", [
  {
    name: "delete missing 404 response",
    document: {
      ...base,
      paths: {
        "/articles/{id}": {
          delete: {
            responses: {
              "204": { description: "no content" },
            },
          },
        },
      },
    },
    errors: [{}],
  },
]);
