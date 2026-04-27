"use client";

import React, { ReactNode } from "react";
import { ApolloLink, HttpLink } from "@apollo/client";
import {
  ApolloClient,
  ApolloNextAppProvider,
  InMemoryCache,
  SSRMultipartLink,
} from "@apollo/client-integration-nextjs";
import Config from "common/config.json";

export function makeClient() {
  const isServer = typeof window === "undefined";

  const httpLink = isServer
    ? new HttpLink({
        uri: Config.API.CcreAPI,
        headers: { "api-key": process.env.SCREEN_API_KEY! },
      })
    : new HttpLink({ uri: "/api/graphql" });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: isServer
      ? ApolloLink.from([new SSRMultipartLink({ stripDefer: true }), httpLink])
      : httpLink,
  });
}

export function ApolloWrapper({ children }: { children: ReactNode }) {
  return <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>;
}
