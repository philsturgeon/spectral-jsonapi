import testRule from "./__helpers__/helper";
import { base } from "./__helpers__/fixtures";

testRule("delete-2xx-response-codes", [
  {
    name: "delete has no success 2xx response",
    document: {
      ...base,
      paths: {
        "/articles/{id}": {
          delete: {
            responses: {
              "404": { description: "not found" },
            },
          },
        },
      },
    },
    errors: [{}],
  },
]);
