import testRule from "./__helpers__/helper";
import { base } from "./__helpers__/fixtures";

testRule("201-response-location-header", [
  {
    name: "201 response omits Location header",
    document: {
      ...base,
      paths: {
        "/articles": {
          post: {
            responses: {
              "201": {
                description: "created",
                headers: {},
              },
            },
          },
        },
      },
    },
    errors: [{}],
  },
]);
