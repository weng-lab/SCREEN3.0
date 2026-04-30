import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { registerApolloClient } from "@apollo/client-integration-nextjs";
import Config from "common/config.json";
/**
 * @returns an ApolloClient instance scoped for the current request
 */

export const { getClient, query, PreloadQuery } = registerApolloClient(() => {
  return new ApolloClient({
    ssrMode: true,
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: Config.API.CcreAPI,
      headers: {
        "api-key": process.env.SCREEN_API_KEY!,
      },
    }),
  });
});
