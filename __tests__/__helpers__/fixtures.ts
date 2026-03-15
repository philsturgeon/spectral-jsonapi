export const base = {
  openapi: "3.1.0",
  info: { title: "Test", version: "1.0.0" },
};

export const asResponseDoc = (schema: Record<string, unknown>) => ({
  ...base,
  paths: {
    "/articles/{id}": {
      get: {
        responses: {
          "200": {
            description: "ok",
            content: {
              "application/vnd.api+json": {
                schema,
              },
            },
          },
        },
      },
    },
  },
});

export const asPostDoc = (
  requestSchema: Record<string, unknown>,
  responses: Record<string, unknown> = { "201": { description: "created" } },
) => ({
  ...base,
  paths: {
    "/articles": {
      post: {
        requestBody: {
          content: {
            "application/vnd.api+json": {
              schema: requestSchema,
            },
          },
        },
        responses,
      },
    },
  },
});

export const asPatchDoc = (
  requestSchema: Record<string, unknown>,
  responses: Record<string, unknown> = { "200": { description: "ok" } },
) => ({
  ...base,
  paths: {
    "/articles/{id}": {
      patch: {
        requestBody: {
          content: {
            "application/vnd.api+json": {
              schema: requestSchema,
            },
          },
        },
        responses,
      },
    },
  },
});
