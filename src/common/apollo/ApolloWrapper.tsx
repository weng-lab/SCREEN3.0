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

/**
 * GenomicRange has no id, so it isn't normalized - the cache stores it inline on its parent and
 * *replaces* it wholesale on every write. Queries select different subsets of it (the genome
 * browser's own gene track asks for `coordinates { start end }` on Transcript, while useGeneData
 * asks for `{ chromosome start end }`), so the narrower write drops `chromosome` from the cached
 * object. That turns the wider query into a cache miss, which refetches it, which blanks its data
 * mid-render. Merging instead of replacing keeps the union of the fields written so far.
 */
const typePolicies = {
  GenomicRange: { merge: true },
} as const;

function makeClient() {
  if (typeof window === "undefined") {
    return new ApolloClient({
      // SSR: hit the backend directly to avoid the /api/graphql proxy hop,
      // attaching the API key which is only available server-side.
      cache: new InMemoryCache({ typePolicies }),
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
    cache: new InMemoryCache({ typePolicies }),
    link: ApolloLink.from([new RemoveTypenameFromVariablesLink(), new HttpLink({ uri: "/api/graphql" })]),
  });
}

export function ApolloWrapper({ children }: { children: ReactNode }) {
  return <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>;
}
