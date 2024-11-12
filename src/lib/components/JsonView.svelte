<script lang="ts">
	import Highlight from 'svelte-highlight';
	import json from 'svelte-highlight/languages/json';
	import { uint8ArrayToString } from '$lib/utils';

	export let data: Uint8Array;
</script>

<Highlight language={json} code={uint8ArrayToString(data)} />
