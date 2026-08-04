import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from "@apollo/client";
import { RemoveTypenameFromVariablesLink } from "@apollo/client/link/remove-typename";
import Config from "common/config.json";

export const mohdClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([new RemoveTypenameFromVariablesLink(), new HttpLink({ uri: Config.API.MOHD_API })]),
});
