<script lang="ts">
	import HexDecoder from '$lib/analyzers/HexDecoder';
	import Base64Decoder from '$lib/analyzers/Base64Decoder';
	import JsonDecoder from '$lib/analyzers/JsonDecoder';
	import UrlDecoder from '$lib/analyzers/UrlDecoder';
	import GzipDecompressor from '$lib/analyzers/GzipDecompressor';
	import ZlibDecompressor from '$lib/analyzers/ZlibDecompressor';
	import type { Analysis, Analyzer } from '$lib/types';
	import AnalysisView from '$lib/components/AnalysisView.svelte';
	import DataInput from '$lib/components/DataInput.svelte';
	import MessagePackDecoder from '$lib/analyzers/MessagePackDecoder';

	const analyzers: Analyzer[] = [
		new UrlDecoder(),
		new HexDecoder(),
		new Base64Decoder(),
		new GzipDecompressor(),
		new ZlibDecompressor(),
		new MessagePackDecoder(),
		new JsonDecoder()
	];

	let analysisSteps: Analysis[] = [];
	let analyzed = false;

	async function analyzeData(data: Uint8Array) {
		analysisSteps = [];

		if (data.length === 0) {
			analyzed = false;
			return;
		}

		const steps: Analysis[] = [];
		let result = data;

		while (analysisSteps.length < 1000) {
			let success = false;

			for (const analyzer of analyzers) {
				let analysis = await analyzer.analyze(result);

				if (!analysis.success) {
					continue;
				}

				steps.push(analysis);
				result = analysis.result!;
				success = true;

				break;
			}

			if (!success) {
				break;
			}
		}

		analysisSteps = steps;
	}
</script>

<div class="flex flex-col space-y-5">
	<DataInput onData={analyzeData} />

	{#if analyzed && analysisSteps.length === 0}
		<div class="pb-6 text-center text-gray-500">
			<h2 class="text-xl font-semibold">Nothing found.</h2>
			<p>Inspectra was unable to uncover anything from your current selection. Try selecting another part.</p>
		</div>
	{:else}
		{#each analysisSteps as analysis, index (analysis.analyzer + analysis.hash!)}
			{@const arrow = index !== analysisSteps.length - 1}
			{@const open = index === analysisSteps.length - 1}
			<AnalysisView {analysis} {index} {arrow} {open} />
		{/each}
	{/if}
</div>
