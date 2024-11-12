<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import DataStats from '$lib/components/DataStats.svelte';
	import { debounce, stringToUint8Array } from '$lib/utils';

	export let onData: (data: Uint8Array) => void;

	const demos: string[] = [
		'H4sIALLwMmcA/wVAwQmAUAhdpd7ZCZygDTp/8PEviqB1inaXD8ZI6FMvBcHutQnFRfeU485yO/EPEbl9OCcAAAA=',
		'gqRkZW1vw6dtZXNzYWdlrUhlbGxvLCBXb3JsZCE%3D',
		'789c0540c1098050085da5ded9099ca00d3a7ff0f12f8aa0758a76970fc648e8532f05c1eeb509c545f794e3ce723bf10f0b110d18'
	];

	let inputEl: HTMLTextAreaElement;
	let data = new Uint8Array();

	$: classes = data && data.length > 0 ? 'arrow-card-down' : '';

	function demo(event: MouseEvent) {
		event.preventDefault();
		inputEl.value = demos[Math.floor(Math.random() * demos.length)];
		handleData();
	}

	function handleData() {
		const start = inputEl.selectionStart;
		const end = inputEl.selectionEnd;

		if (start === end) {
			data = stringToUint8Array(inputEl.value.trim());
		} else {
			data = stringToUint8Array(inputEl.value.substring(start, end).trim());
		}

		onData(data);
	}

	const debouncedHandleData = debounce(handleData, 300);
</script>

<Card.Root class={classes}>
	<Card.Header>
		<Card.Title>Input</Card.Title>
		<Card.Description
			>Enter data in the text box below, and Inspectra will automatically analyze and unpack it. Use the cursor to
			select specific parts for a closer look. Want a demo? <button
				class="hover:decoration-offset-2 underline hover:decoration-2"
				on:click={demo}>Try this</button
			>.</Card.Description
		>
	</Card.Header>
	<Card.Content>
		<textarea
			class="block w-full rounded border p-2 font-mono"
			bind:this={inputEl}
			on:select={debouncedHandleData}
			on:mouseup={debouncedHandleData}
			on:keyup={debouncedHandleData}
			spellcheck="false"
			autocapitalize="none"
			translate="no"
			contenteditable="true"
			aria-multiline="true"
		></textarea>
	</Card.Content>
	<Card.Footer>
		<DataStats {data} />
	</Card.Footer>
</Card.Root>
