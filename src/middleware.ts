import { Elysia } from "elysia"
import { openapi } from "@elysiajs/openapi";

const app = new Elysia()
  .use(openapi())

// GLOBAL LOGGER (onRequest)
app.onRequest(({ request }) => {
  console.log("📥", request.method, request.url)
  console.log("🕒", new Date().toISOString())
})

// SHORT-CIRCUIT
app.onRequest(({ request, set }) => {
  if (request.headers.get("x-block") === "true") {
    set.status = 403
    return { message: "Blocked by middleware" }
  }
})

// BEFORE HANDLE (Auth Guard)
app.get(
  "/dashboard",
  () => ({
    message: "Welcome to Dashboard"
  }),
  {
    beforeHandle({ headers, set }) {
      if (!headers.authorization) {
        set.status = 401
        return {
          success: false,
          message: "Unauthorized"
        }
      }
    }
  }
)

app.listen(3000)
console.log("Server running at http://localhost:3000")