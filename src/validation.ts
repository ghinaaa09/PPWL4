import { Elysia, t } from "elysia";
import { openapi } from "@elysiajs/openapi";

const app = new Elysia()
  .use(openapi())

  // PRAKTIKUM 1 - VALIDASI BODY
  .post(
    "/request",
    ({ body }) => ({
      message: "Success",
      data: body
    }),
    {
      body: t.Object({
        name: t.String({ minLength: 3 }),
        email: t.String({ format: "email" }),
        age: t.Number({ minimum: 18 })
      })
    }
  )

  // PRAKTIKUM 1 - VALIDASI RESPONSE
  .get(
    "/ping",
    () => ({
      success: true,
      message: "Server OK"
    }),
    {
      response: t.Object({
        success: t.Boolean(),
        message: t.String()
      })
    }
  )

  // PRAKTIKUM 2 - PARAMS & QUERY
  .get(
    "/products/:id",
    ({ params, query }) => ({
      success: true,
      productId: Number(params.id),
      sort: query.sort
    }),
    {
      params: t.Object({
        id: t.Numeric()
      }),
      query: t.Object({
        sort: t.Union([
          t.Literal("asc"),
          t.Literal("desc")
        ])
      }),
      response: t.Object({
        success: t.Boolean(),
        productId: t.Number(),
        sort: t.String()
      })
    }
  )

  // PRAKTIKUM 3 - VALIDASI RESPONSE
  .get(
    "/stats",
    () => ({
      total: 150,
      active: 120
    }),
    {
      response: t.Object({
        total: t.Number(),
        active: t.Number()
      })
    }
  )

  .listen(3000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);