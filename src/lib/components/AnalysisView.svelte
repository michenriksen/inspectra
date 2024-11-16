<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { type Analysis } from '$lib/types';
	import { isBinary, uint8ArrayToString, urlSafeBase64Encode } from '$lib/utils';
	import HexEditor from 'js-hex-editor/dist-svelte/HexEditor.svelte';
	import 'svelte-highlight/styles/tokyo-night-dark.css';
	import ExternalLink from 'lucide-svelte/icons/external-link';
	import DataStats from './DataStats.svelte';
	import ByteGrid from './ByteGrid.svelte';
	import JsonView from './JsonView.svelte';
	import Eye from 'lucide-svelte/icons/eye';
	import Binary from 'lucide-svelte/icons/binary';
	import ChartColumn from 'lucide-svelte/icons/chart-column';
	import FrequencyChart from '$lib/components/FrequencyChart.svelte';

	export let analysis: Analysis;
	export let index: number;
	export let open: boolean = false;
	export let arrow: boolean = false;

	let result = analysis.result;
	let classes = '';
	let tab = 'view';

	if (result && isBinary(result)) {
		tab = 'hexdump';
	}

	$: if (arrow) {
		classes += 'arrow-card-down';
	}

	$: if (analysis.error) {
		classes += 'bg-red-50 text-red-600';
	}
</script>

<Card.Root class={classes}>
	<Card.Content>
		<details {open}>
			<summary class="cursor-pointer text-lg font-semibold">
				<span>
					{index + 1}. {analysis.analyzer}
					{#if analysis.error}
						(failed)
					{/if}
				</span>
			</summary>
			{#if analysis.error}
				<div class="my-6 rounded border bg-card p-2 font-mono text-red-500">{analysis.error}</div>
			{:else if result}
				<div class="relative my-6">
					<Tabs.Root bind:value={tab}>
						<Tabs.List class="absolute -top-14 right-0 z-50">
							<Tooltip.Root openDelay={300}>
								<Tooltip.Trigger><Tabs.Trigger value="view"><Eye class="h-4 w-4" /></Tabs.Trigger></Tooltip.Trigger>
								<Tooltip.Content side="bottom"><p>View</p></Tooltip.Content>
							</Tooltip.Root>
							<Tooltip.Root openDelay={300}>
								<Tooltip.Trigger
									><Tabs.Trigger value="hexdump"><Binary class="h-4 w-4" /></Tabs.Trigger></Tooltip.Trigger
								>
								<Tooltip.Content side="bottom"><p>Hexdump</p></Tooltip.Content>
							</Tooltip.Root>
							<Tooltip.Root openDelay={300}>
								<Tooltip.Trigger
									><Tabs.Trigger value="frequency"><ChartColumn class="h-4 w-4" /></Tabs.Trigger></Tooltip.Trigger
								>
								<Tooltip.Content side="bottom"><p>Frequency Distribution</p></Tooltip.Content>
							</Tooltip.Root>
						</Tabs.List>
						<Tabs.Content value="view">
							{#if analysis.analyzer === 'JSON Decoder' || analysis.analyzer === 'MessagePack Decoder'}
								<JsonView data={result} />
							{:else}
								<pre class="rounded border bg-slate-900 p-2 font-mono text-white">{uint8ArrayToString(result)}</pre>
							{/if}
						</Tabs.Content>
						<Tabs.Content value="hexdump">
							<div class="items-top flex flex-row space-x-2">
								<HexEditor
									data={result.buffer}
									readonly={true}
									showHeader={false}
									showFooter={false}
									bytesPerLine={16}
								/>
								<ByteGrid data={result} />
							</div>
						</Tabs.Content>
						<Tabs.Content value="frequency"><FrequencyChart data={result} /></Tabs.Content>
					</Tabs.Root>
				</div>

				<div class="flex flex-row items-center justify-between">
					<DataStats data={result} />
					<div class="hidden md:block">
						<a
							href="https://gchq.github.io/CyberChef/#input={encodeURIComponent(urlSafeBase64Encode(result))}"
							target="_blank"
							class="flex flex-row items-center space-x-1 text-xs font-bold hover:text-blue-500 hover:underline hover:decoration-1"
						>
							<span>CyberChef</span>
							<ExternalLink class="h-3 w-3" />
						</a>
					</div>
				</div>
			{/if}
		</details>
	</Card.Content>
</Card.Root>
