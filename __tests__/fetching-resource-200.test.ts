import { DiagnosticSeverity } from "@stoplight/types";
import testRule from "./__helpers__/helper";

testRule("fetching-resource-200", [
  {
    name: "valid get includes 200",
    document: {
      openapi: "3.1.0",
      info: { title: "Test", version: "1.0.0" },
      paths: {
        "/tickets/{id}": {
          get: {
            responses: {
              "200": { description: "ok" },
              "404": { description: "not found" },
            },
          },
        },
      },
    },
    errors: [],
  },
  {
    name: "invalid get missing 200",
    document: {
      openapi: "3.1.0",
      info: { title: "Test", version: "1.0.0" },
      paths: {
        "/tickets/{id}": {
          get: {
            responses: {
              "404": { description: "not found" },
            },
          },
        },
      },
    },
    errors: [
      {
        message: "GET paths must support response code: 200",
        path: ["paths", "/tickets/{id}", "get", "responses"],
        severity: DiagnosticSeverity.Error,
      },
    ],
  },
]);
