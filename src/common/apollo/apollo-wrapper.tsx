"use client";

import React, { ReactNode } from "react";
import { ApolloLink, HttpLink } from "@apollo/client";
import { RemoveTypenameFromVariablesLink } from "@apollo/client/link/remove-typename";
import {
  ApolloClient,
  ApolloNextAppProvider,
  InMemoryCache,
  SSRMultipartLink,
} from "@apollo/client-integration-nextjs";
import Config from "common/config.json";

function makeClient() {
  if (typeof window === "undefined") {
    return new ApolloClient({
      // SSR: hit the backend directly to avoid the /api/graphql proxy hop,
      // attaching the API key which is only available server-side.
      cache: new InMemoryCache(),
      link: ApolloLink.from([
        // Query results carry __typename, which input types reject. Strip it so
        // data from one query can be fed back in as variables to another.
        new RemoveTypenameFromVariablesLink(),
        new SSRMultipartLink({ stripDefer: true }),
        new HttpLink({
          uri: Config.API.CcreAPI,
          headers: { Authorization: "Bearer " + process.env.SCREEN_API_KEY! },
        }),
      ]),
    });
  }

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([new RemoveTypenameFromVariablesLink(), new HttpLink({ uri: "/api/graphql" })]),
  });
}

export function ApolloWrapper({ children }: { children: ReactNode }) {
  return <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>;
}
