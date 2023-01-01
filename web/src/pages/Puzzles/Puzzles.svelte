<script lang="ts">
  import { gql } from "@apollo/client/core";
  import { query } from "svelte-apollo";
  import type {
    GQLPuzzleListQuery,
    GQLPuzzleListQueryVariables,
  } from "../../graphql/generated";

  const puzzleList = query<GQLPuzzleListQuery, GQLPuzzleListQueryVariables>(gql`
    query PuzzleList {
      puzzles {
        id
      }
    }
  `);
</script>

<main>
  {#if $puzzleList.loading}
    Loading...
  {:else if $puzzleList.error}
    Error: {$puzzleList.error.message}
  {:else}
    <h1>Puzzles</h1>
    <ul>
      {#each $puzzleList.data.puzzles as puzzle}
        <li>{puzzle.id}</li>
      {/each}
    </ul>
  {/if}
</main>
