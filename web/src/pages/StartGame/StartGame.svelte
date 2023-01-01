<script lang="ts">
  import Modal from "../../lib/Modal.svelte";
  import { getPuzzles } from "./getPuzzles";

  const puzzleList = getPuzzles();

  $: selectedPuzzleId = "";
  function selectPuzzleId(puzzleId: string) {
    selectedPuzzleId = puzzleId;
  }
  function deselectPuzzleId() {
    selectedPuzzleId = "";
  }

  $: gameId = "";
  $: isStartingGame = false;
  function startGame(params: { gameId: string; selectedPuzzleId: string }) {
    isStartingGame = true;
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
  <Modal open={isModalOpen} onRequestClose={deselectPuzzleId}>
    <form
      on:submit={(e) => {
        e.preventDefault();
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
