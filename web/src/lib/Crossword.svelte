<script lang="ts">
  export let serializedGame: string;
  $: game = JSON.parse(serializedGame);
</script>

<div>{game}</div>
