<script lang="ts">
  import config from "../../config";
  import Crossword from "../../lib/Crossword.svelte";

  export let params: { gameId: string };

  let serializedGame = "";
  let readyState = -1;
  function joinGame(playerName: string) {
    const queryString = [
      ["gameId", params.gameId],
      ["playerName", playerName],
    ]
      .map(([k, v]) => encodeURIComponent(k) + "=" + encodeURIComponent(v))
      .join("&");

    let socket = new WebSocket(config.WEBSOCKET_ENDPOINT + "?" + queryString);
    readyState = socket.readyState;

    socket.addEventListener("open", () => {
      readyState = socket.readyState;
    });

    socket.addEventListener("message", (event) => {
      serializedGame = event.data;
      readyState = socket.readyState;
    });

    socket.addEventListener("close", () => {
      readyState = socket.readyState;
    });
  }

  $: uninitialized = readyState === -1;
  $: connecting = readyState === WebSocket.CONNECTING;
  $: connected = readyState === WebSocket.OPEN;
</script>

<main>
  {#if uninitialized}
    <form
      on:submit={(e) => {
        e.preventDefault();
        joinGame("playerName");
      }}
    >
      <label for="playerName">Player Name</label>
      <input name="playerName" type="text" />
      <button type="submit">Join Game</button>
    </form>
  {/if}
  {#if connecting}
    <div>Connecting...</div>
  {/if}
  {#if connected}
    <Crossword {serializedGame} />
  {/if}
</main>
