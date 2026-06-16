import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

/**
 * used to override apollo wrapper and direct MOHD queries to correct url
 */
export const mohdClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({ uri: "/api/mohd-graphql" }),
});