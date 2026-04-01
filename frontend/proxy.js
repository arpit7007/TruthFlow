import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"

export async function proxy(req) {
  const token = await getToken({ req })
  const { pathname } = req.nextUrl

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  console.log("proxy hit")
  console.log(token)

  return NextResponse.next()

}

export const config = {
    matcher: ['/document', '/chat']
}