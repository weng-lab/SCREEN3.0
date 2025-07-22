import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client"
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support"
import Config from "../../config.json"

export const client = new ApolloClient({
  uri: Config.API.CcreAPI,
  cache: new InMemoryCache(),
})

// See https://www.apollographql.com/blog/using-apollo-client-with-next-js-13-releasing-an-official-library-to-support-the-app-router

export const { getClient, query } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: Config.API.CcreAPI,
    }),
  });
});