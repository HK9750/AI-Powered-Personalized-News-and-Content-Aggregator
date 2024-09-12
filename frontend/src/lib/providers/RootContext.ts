"use client";
import React, { useContext } from "react";

interface RootContextProps {
  user: any;
}

export const RootContext = React.createContext<RootContextProps | null>(null);

export const useRootContext = () => useContext(RootContext);
