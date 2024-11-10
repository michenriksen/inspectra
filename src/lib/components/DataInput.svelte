<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import DataStats from '$lib/components/DataStats.svelte';
	import { debounce, stringToUint8Array } from '$lib/utils';

	export let onData: (data: Uint8Array) => void;

	const demoData =
		'N2IyMjY0NjU2ZDZmMjIzYTIyNzQ3Mjc1NjUyMjJjMjI2ZDY1NzM3MzYxNjc2NTIyM2EyMjQ4NjU2YzZjNmYyYzIwNTc2ZjcyNmM2NDIxMjI3ZA%3D%3D';

	let inputEl: HTMLTextAreaElement;
	let data = new Uint8Array();

	$: classes = data && data.length > 0 ? 'arrow-card-down' : '';

	function demo(event: MouseEvent) {
		event.preventDefault();
		inputEl.value = demoData;
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
