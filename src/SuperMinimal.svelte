<script lang="ts">
  let count = 0;
</script>

<main>
  <h1>Discordant Test</h1>
  <p>Count: {count}</p>
  <button on:click={() => count++}>Increment</button>
</main>

<style>
  main {
    padding: 2rem;
  }
  h1 {
    color: #956a28;
  }
</style>
