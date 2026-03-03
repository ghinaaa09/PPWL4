  import { Elysia, t } from "elysia"
  import { openapi } from "@elysiajs/openapi";

  const app = new Elysia()
    .use(openapi())

  // ==========================
  // GLOBAL LOGGER
  // ==========================
  app.onRequest(({ request }) => {
    console.log("📥", request.method, request.url)
    console.log("🕒", new Date().toISOString())
  })

  // ==========================
  // SHORT-CIRCUIT
  // ==========================
  app.onRequest(({ request, set }) => {
    if (request.headers.get("x-block") === "true") {
      set.status = 403
      return { message: "Blocked by middleware" }
    }
  })

  // ==========================
  // BEFORE HANDLE - /admin
  // ==========================
  app.get(
    "/admin",
    () => ({
      stats: 99
    }),
    {
      beforeHandle({ headers, set }) {
        if (headers.authorization !== "Bearer 123") {
          set.status = 401
          return {
            success: false,
            message: "Unauthorized"
          }
        }
      }
    }
  )

  // ==========================
  // GET /product
  // ==========================
  app.get(
    "/product",
    () => ({
      id: 1,
      name: "Laptop"
    })
  )

  // ==========================
  // PRAKTIKUM 6 - POST /login
  // ==========================
  app.post(
    "/login",
    ({ body }) => ({
      message: "Login berhasil",
      user: body.email
    }),
    {
      body: t.Object({
        email: t.String({ format: "email" }),
        password: t.String({ minLength: 8 })
      })
    }
  )

  // ==========================
  // AFTER HANDLE (GLOBAL - HARUS 1)
  // ==========================
  app.onAfterHandle(({ response }) => {
    return {
      success: true,
      message: "data tersedia",
      data: response
    }
  })

  // ==========================
  // GLOBAL ERROR HANDLER
  // ==========================
  app.onError(({ code, set }) => {

    if (code === "VALIDATION") {
      set.status = 400
      return {
        success: false,
        error: "Validation Error"
      }
    }

    if (code === "NOT_FOUND") {
      set.status = 404
      return {
        success: false,
        message: "Route not found"
      }
    }

    set.status = 500
    return {
      success: false,
      message: "Internal Server Error"
    }
  })

  app.listen(3000)

  console.log("Server running at http://localhost:3000")