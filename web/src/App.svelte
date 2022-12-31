<script lang="ts">
  import Router from "svelte-spa-router";
  import routes from "./routes";
  import initializeApolloClient from "./scripts/initializeApolloClient";

  initializeApolloClient();
</script>

<Router {routes} />
