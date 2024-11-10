<script lang="ts">
	import '../app.css';
	import SearchCode from 'lucide-svelte/icons/search-code';

	let { children } = $props();
</script>

<div class="container pt-8">
	<header class="flex flex-row items-center space-x-2 pb-8">
		<SearchCode class="h-8 w-8" />
		<span class="text-xl font-semibold">Inspectra</span>
		<span class="rounded bg-sky-300 px-2 py-1 text-sm font-semibold text-white shadow-sm">alpha</span>
	</header>
	{@render children()}
</div>
