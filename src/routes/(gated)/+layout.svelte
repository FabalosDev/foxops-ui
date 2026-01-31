<script>
  import '../../app.css';

  let { children } = $props();
</script>

<div class="min-h-screen bg-[#050914] text-white">
    {@render children()}
</div>