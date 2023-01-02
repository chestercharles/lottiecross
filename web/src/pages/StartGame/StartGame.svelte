<script lang="ts">
  import Modal from "../../lib/Modal.svelte";
  import { push } from "svelte-spa-router";
  import { gql } from "@apollo/client/core";
  import { mutation, query } from "svelte-apollo";
  import type {
    GQLPuzzleListQuery,
    GQLPuzzleListQueryVariables,
    GQLStartGameMutation,
    GQLStartGameMutationVariables,
  } from "../../graphql/generated";

  const puzzleList = query<GQLPuzzleListQuery, GQLPuzzleListQueryVariables>(gql`
    query PuzzleList {
      puzzles {
        id
      }
    }
  `);

  const startGameMutation = mutation<
    GQLStartGameMutation,
    GQLStartGameMutationVariables
  >(
    gql`
      mutation StartGame($input: StartGameInput!) {
        startGame(input: $input) {
          id
        }
      }
    `
  );

  function selectPuzzleId(puzzleId: string) {
    selectedPuzzleId = puzzleId;
  }
  function deselectPuzzleId() {
    selectedPuzzleId = "";
  }

  async function startGame(params: {
    gameId: string;
    selectedPuzzleId: string;
  }) {
    const result = await startGameMutation({
      variables: {
        input: {
          gameId: params.gameId,
          puzzleId: params.selectedPuzzleId,
        },
      },
    });
    push(`/game/${result.data.startGame.id}`);
  }

  $: gameId = "";
  $: isStartingGame = false;
  $: selectedPuzzleId = "";
  $: isModalOpen = Boolean(selectedPuzzleId);
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
            on:click={() => selectPuzzleId(puzzle.id)}
            on:keypress={() => selectPuzzleId(puzzle.id)}
          >
            {puzzle.id}
          </div>
        </li>
      {/each}
    </ul>
  {/if}
  <Modal open={isModalOpen} onRequestClose={deselectPuzzleId}>
    <form
      on:submit={(e) => {
        e.preventDefault();
        isStartingGame = true;
        startGame({
          gameId,
          selectedPuzzleId,
        });
      }}
    >
      <h3>Start {selectedPuzzleId}</h3>
      <p>
        Game ID: <input
          placeholder="Spoon Unit Alpha"
          type="text"
          bind:value={gameId}
        />
      </p>
      <button on:click={deselectPuzzleId}>Cancel</button>
      {#if isStartingGame}
        <button disabled>Starting...</button>
      {:else}
        <button type="submit">Start</button>
      {/if}
    </form>
  </Modal>
</main>
