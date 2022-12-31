import { ApolloClient, InMemoryCache } from "@apollo/client/core";
import { setClient } from "svelte-apollo";
import config from "../config";

function initializeApolloClient() {
  const client = new ApolloClient({
    uri: config.GRAPHQL_ENDPOINT,
    cache: new InMemoryCache(),
  });
  setClient(client);
}

export default initializeApolloClient;
