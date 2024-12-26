// utils/redirect.ts
import Router from "next/router";

export const redirectToRoot = () => {
  if (typeof window !== "undefined") {
    Router.push("/");
  }
};