"use client";
import { RootContext } from "@/lib/providers/RootContext";
import { SessionProvider } from "next-auth/react";

type Props = {
  children: React.ReactNode;
  user?: any;
};

const Providers = ({ children, user }: Props) => {
  return (
    <SessionProvider>
      <RootContext.Provider value={{ user }}>{children}</RootContext.Provider>
    </SessionProvider>
  );
};

export default Providers;
