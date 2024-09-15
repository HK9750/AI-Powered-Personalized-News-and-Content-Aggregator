import { createUser, getUserByEmail } from "@/lib/actions/auth0/users";
import { NextAuthOptions } from "next-auth";
import NextAuth, { getServerSession } from "next-auth/next";
import Auth0 from "next-auth/providers/auth0";

const {
  NEXT_PUBLIC_AUTH0_CLIENT_ID,
  NEXT_PUBLIC_AUTH0_CLIENT_SECRET,
  NEXT_PUBLIC_AUTH0_ISSUER_BASE_URL,
  NEXT_PUBLIC_AUTH0_SECRET,
  NEXT_PUBLIC_AUTH0_SCOPE,
} = process.env;

export const authOptions: NextAuthOptions = {
  providers: [
    Auth0({
      idToken: true,
      clientId: NEXT_PUBLIC_AUTH0_CLIENT_ID ?? "",
      clientSecret: NEXT_PUBLIC_AUTH0_CLIENT_SECRET ?? "",
      issuer: NEXT_PUBLIC_AUTH0_ISSUER_BASE_URL ?? "",
      authorization: {
        params: {
          scope: NEXT_PUBLIC_AUTH0_SCOPE,
        },
      },
    }),
  ],
  secret: NEXT_PUBLIC_AUTH0_SECRET,
  callbacks: {
    async signIn({ user, account, profile }) {
      let userData;
      if (!account || !user?.email) {
        console.error("No account or email found", account, user);
        return false;
      }

      const userEmail = user.email.toLowerCase();

      if (!userEmail) {
        const message = "No user email in signin callback";
        console.error(message);
        return false;
      }

      try {
        userData = await getUserByEmail(userEmail);

        if (!userData.success) {
          userData = await createUser(userEmail, user.name ?? "");
        }
      } catch (error) {
        console.error("Error in signin callback", error);
        return false;
      }

      return true;
    },
    async session({ session, token }: any) {
      session.accessToken = token.accessToken;
      session.idToken = token.idToken;

      return session;
    },

    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
        token.refreshToken = account.refresh_token;
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === process.env.AUTH0_ISSUER) return url;
      return baseUrl;
    },
  },
};

const handler = NextAuth(authOptions);

export const useGetSession = () => {
  return getServerSession(authOptions);
};

export { handler as GET, handler as POST };
