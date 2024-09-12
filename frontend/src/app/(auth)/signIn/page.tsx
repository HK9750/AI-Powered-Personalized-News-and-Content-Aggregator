"use client";

import { AUTH_PROVIDER } from "@/lib/constants";
import { ROUTING } from "@/lib/routing";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useRootContext } from "@/lib/providers/RootContext";
import { useEffect } from "react";

export default function SignIn() {
  const rootContext = useRootContext();
  const router = useRouter();

  useEffect(() => {
    const handleSignIn = async () => {
      if (!window) {
        return;
      }
      if (rootContext?.user) {
        return router.replace(ROUTING.APP.LANDING);
      } else {
        return signIn(AUTH_PROVIDER, {
          callbackUrl: process.env.NEXT_PUBLIC_NEXTAUTH_URL,
        });
      }
    };
    void handleSignIn();
  }, []);

  return null;
}
