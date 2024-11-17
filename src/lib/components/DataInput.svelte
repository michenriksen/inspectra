<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import DataStats from '$lib/components/DataStats.svelte';
	import { type Data } from '$lib/types';
	import { debounce, stringToUint8Array } from '$lib/utils';

	export let onData: (data: Data) => void;

	const demos: string[] = [
		'H4sIALLwMmcA/wVAwQmAUAhdpd7ZCZygDTp/8PEviqB1inaXD8ZI6FMvBcHutQnFRfeU485yO/EPEbl9OCcAAAA=',
		'gqRkZW1vw6dtZXNzYWdlrUhlbGxvLCBXb3JsZCE%3D',
		'789c0540c1098050085da5ded9099ca00d3a7ff0f12f8aa0758a76970fc648e8532f05c1eeb509c545f794e3ce723bf10f0b110d18',
		'eJwFQLEJACEMXEV7B3EDayGHzYUDs8HP8mDlFC4Wvt_gescRMRduB6lWhjatJsfIDDE',
		'H4sIAIbCOWcA/z2OSw7EMAhDrzSNDVGWVOX+V6rdRLOoUnj+wMbgmotPViz82HoDI4qMysd7cbFgwnxqBthB6S9xaY6/8j5+aFcJaTVTefYd/T/v620yp7nySqyd5379+7P+ks9+37P7R3wZusc8dn8y7xdLzE8j0AAAAA=='
	];

	let inputEl: HTMLTextAreaElement;
	let inputElValue = new Uint8Array();
	let data: Data | null = null;

	$: classes = data && data.data.length > 0 ? 'arrow-card-down' : '';

	function demo(event: MouseEvent) {
		event.preventDefault();
		while (true) {
			let demo = demos[Math.floor(Math.random() * demos.length)];
			if (inputEl.value !== demo) {
				inputEl.value = demo;
				break;
			}
		}
		handleData();
	}

	function handleData() {
		const value = inputEl.value.trim();
		const start = inputEl.selectionStart;
		const end = inputEl.selectionEnd;

		inputElValue = stringToUint8Array(value);

		let dataArray;

		if (start === end) {
			dataArray = stringToUint8Array(value);
		} else {
			dataArray = stringToUint8Array(value.substring(start, end).trim());
		}

		const newData = {
			data: dataArray,
			selection: start !== end,
			offsetStart: start,
			offsetEnd: end
		};

		if (JSON.stringify(data) !== JSON.stringify(newData)) {
			data = newData;
			onData(data);
		}
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
		<DataStats data={inputElValue} />
	</Card.Footer>
</Card.Root>
