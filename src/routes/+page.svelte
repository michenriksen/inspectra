<script lang="ts">
	import type { Analysis as IAnalysis, Data } from '$lib/types';
	import AnalysisView from '$lib/components/AnalysisView.svelte';
	import DataInput from '$lib/components/DataInput.svelte';
	import Analysis from '$lib/analyzers/Analysis';
	import { analyzers } from '$lib/stores';

	let analysisSteps: IAnalysis[] = [];
	let nothing = false;

	async function analyzeData(data: Data) {
		analysisSteps = [];

		if (data.data.length === 0) {
			return;
		}

		const steps: IAnalysis[] = [];

		if (data.selection) {
			const selectionAnalysis = new Analysis(`Selection (${data.offsetStart + 1}:${data.offsetEnd + 1})`, data.data);
			selectionAnalysis.success(data.data);
			steps.push(selectionAnalysis);
		}

		let result = data.data;

		while (analysisSteps.length < 1000) {
			let success = false;

			for (const analyzer of $analyzers) {
				let analysis = await analyzer.analyze(result);

				if (!analysis.match) {
					continue;
				}

				steps.push(analysis);

				if (analysis.result && !analysis.error) {
					result = analysis.result;
					success = true;
				}

				break;
			}

			if (!success) {
				break;
			}
		}

		console.groupCollapsed('Analysis steps');
		console.table(steps.map((s) => s.toJSON()));
		console.groupEnd();

		if (steps.length === 0 || (steps.length === 1 && data.selection)) {
			nothing = true;
		} else {
			nothing = false;
		}

		analysisSteps = steps;
	}
</script>

<div class="flex flex-col space-y-5">
	<DataInput onData={analyzeData} />

	{#each analysisSteps as analysis, index (analysis.id)}
		{@const arrow = index !== analysisSteps.length - 1}
		{@const open = index === analysisSteps.length - 1}
		<AnalysisView {analysis} {index} {arrow} {open} />
	{/each}

	{#if nothing}
		<div class="pt-6 text-center text-gray-500">
			<h2 class="text-xl font-semibold">Nothing found.</h2>
			<p>Inspectra was unable to uncover anything from the current input.</p>
		</div>
	{/if}
</div>
