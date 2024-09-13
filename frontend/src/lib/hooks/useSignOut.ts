import { signOut as nextSignOut } from "next-auth/react";
import { useCallback } from "react";

const { NEXT_PUBLIC_AUTH0_CLIENT_ID, NEXT_PUBLIC_AUTH0_ISSUER_BASE_URL } =
  process.env;

export const useSignOut = (callbackUrl: string) => {
  return useCallback(async () => {
    const endSessionUrl = `${NEXT_PUBLIC_AUTH0_ISSUER_BASE_URL}/v2/logout?client_id=${NEXT_PUBLIC_AUTH0_CLIENT_ID}&returnTo=${callbackUrl}`;

    let response;

    try {
      response = await fetch(endSessionUrl, {
        method: "GET",
        credentials: "include",
        mode: "no-cors",
      });
    } catch (error) {
      console.error("Error occurred in fetching senSessionUrl", error);
    }

    await nextSignOut({ callbackUrl });
    return response;
  }, [callbackUrl]);
};
