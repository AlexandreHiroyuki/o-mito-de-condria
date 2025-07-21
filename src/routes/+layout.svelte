<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<main class="flex h-full w-full items-center justify-center">
	{@render children()}
</main>
