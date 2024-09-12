"use server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { cookies, headers } from "next/headers";
import { getToken } from "next-auth/jwt";
import { getUserByEmail } from "./actions/auth0/users";

export async function getSessionUser() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email || "";

  if (!email) {
    return null;
  }

  const user = await getUserByEmail(email);
  return user;
}

export async function getSessionAccessToken() {
  const req = {
    headers: Object.fromEntries(headers() as Headers),
    cookies: Object.fromEntries(
      cookies()
        .getAll()
        .map((c) => [c.name, c.value])
    ),
  };

  // @ts-ignore
  const session = await getToken({ req });
  // @ts-ignore the types are wrong for some reason
  return session?.accessToken;
}
