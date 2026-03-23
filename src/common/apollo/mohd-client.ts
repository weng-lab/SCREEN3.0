import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import Config from "common/config.json";

export const mohdClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({ uri: Config.API.MOHD_API }),
});