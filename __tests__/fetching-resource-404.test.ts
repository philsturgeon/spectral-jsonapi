import { DiagnosticSeverity } from "@stoplight/types";
import testRule from "./__helpers__/helper";

testRule("fetching-resource-404", [
  {
    name: "valid get includes 404",
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
    name: "invalid get missing 404",
    document: {
      openapi: "3.1.0",
      info: { title: "Test", version: "1.0.0" },
      paths: {
        "/tickets/{id}": {
          get: {
            responses: {
              "200": { description: "ok" },
            },
          },
        },
      },
    },
    errors: [
      {
        message: "Single-resource GET operations must define a 404 response.",
        path: ["paths", "/tickets/{id}", "get", "responses"],
        severity: DiagnosticSeverity.Error,
      },
    ],
  },
]);
