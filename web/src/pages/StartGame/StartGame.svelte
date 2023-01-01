<script lang="ts">
  import Modal from "../../lib/Modal.svelte";
  import { getPuzzles } from "./getPuzzles";

  const puzzleList = getPuzzles();

  let selectedPuzzleId = "";

  function selectPuzzleId(puzzleId: string) {
    selectedPuzzleId = puzzleId;
  }

  function deselectPuzzleId() {
    selectedPuzzleId = "";
  }

  function startGame(gameId: string) {
    console.log("Starting game", gameId, " with puzzle", selectedPuzzleId);
  }

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
  <Modal open={isModalOpen} onRequestClose={deselectPuzzleId} />
</main>
