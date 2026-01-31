<script>
  import '../../app.css';
  import Gatekeeper from "$lib/components/Gatekeeper.svelte";
  let { children } = $props();
</script>

<Gatekeeper>
  {@render children()}
</Gatekeeper>