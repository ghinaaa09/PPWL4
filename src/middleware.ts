    import { Elysia } from "elysia"
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
    // AFTER HANDLE
    // ==========================
    app.onAfterHandle(({ response }) => {
    return {
      success: true,
      data: response
    }
  })

    app.listen(3000)

    console.log("Server running at http://localhost:3000")