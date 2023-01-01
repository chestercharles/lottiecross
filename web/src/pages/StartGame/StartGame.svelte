<script lang="ts">
  import { gql } from "@apollo/client/core";
  import { query } from "svelte-apollo";
  import type {
    GQLPuzzleListQuery,
    GQLPuzzleListQueryVariables,
  } from "../../graphql/generated";
  import Modal from "../../lib/Modal.svelte";

  const puzzleList = query<GQLPuzzleListQuery, GQLPuzzleListQueryVariables>(gql`
    query PuzzleList {
      puzzles {
        id
      }
    }
  `);

  let puzzleToStart: string = null;

  function openModal(puzzleId: string) {
    puzzleToStart = puzzleId;
  }
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
        <li>
          <div
            on:click={() => openModal(puzzle.id)}
            on:keypress={() => openModal(puzzle.id)}
          >
            {puzzle.id}
          </div>
        </li>
      {/each}
    </ul>
  {/if}
  <Modal open={Boolean(puzzleToStart)} />
</main>
