'use client';

import { useContext } from "react";
import UserContext from "./user-context";


export default function useAuth() {
  const consumer = useContext(UserContext);

  if (!consumer) {
    throw new Error("useAuth must be used within a UserProvider");
  }

  return consumer;
}