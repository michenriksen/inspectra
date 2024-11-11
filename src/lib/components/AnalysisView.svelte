<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import { Button } from '$lib/components/ui/button';
	import { AnalyzerId, type Analysis } from '$lib/types';
	import { isBinary, uint8ArrayToString, urlSafeBase64Encode } from '$lib/utils';
	import Highlight from 'svelte-highlight';
	import json from 'svelte-highlight/languages/json';
	import HexEditor from 'js-hex-editor/dist-svelte/HexEditor.svelte';
	import 'svelte-highlight/styles/tokyo-night-dark.css';
	import ExternalLink from 'lucide-svelte/icons/external-link';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import ChevronsDownUp from 'lucide-svelte/icons/chevrons-down-up';
	import DataStats from './DataStats.svelte';

	export let analysis: Analysis;
	export let index: number;
	export let expanded: boolean = false;
	export let arrow: boolean = false;

	const analyzerTitles: Record<AnalyzerId, string> = {
		[AnalyzerId.Base64Decoder]: 'Base64 encoding',
		[AnalyzerId.GzipDecompressor]: 'Gzip compression',
		[AnalyzerId.HexDecoder]: 'Hex encoding',
		[AnalyzerId.JsonDecoder]: 'JSON encoding',
		[AnalyzerId.MessagePackDecoder]: 'MessagePack encoding',
		[AnalyzerId.UrlDecoder]: 'URL encoding',
		[AnalyzerId.ZlibDecompressor]: 'Zlib compression'
	};

	let title = analyzerTitles[analysis.analyzer];
	let result = analysis.result!;
	let classes = '';

	$: if (arrow) {
		classes = 'arrow-card-down';
	}
</script>

<Collapsible.Root bind:open={expanded}>
	<Card.Root class={classes}>
		<Card.Header class="flex flex-row items-center space-x-2 pt-3">
			<Card.Title>{index + 1}. {title}</Card.Title>
			<Collapsible.Trigger asChild let:builder>
				<Button builders={[builder]} variant="ghost" size="sm" class="w-9 p-0">
					{#if expanded}
						<ChevronsDownUp class="h-4 w-4" />
						<span class="sr-only">Collapse</span>
					{:else}
						<ChevronsUpDown class="h-4 w-4" />
						<span class="sr-only">Expand</span>
					{/if}
				</Button>
			</Collapsible.Trigger>
		</Card.Header>
		<Collapsible.Content>
			<Card.Content>
				{#if analysis.analyzer === AnalyzerId.JsonDecoder}
					<Highlight language={json} code={uint8ArrayToString(result)} />
				{:else if isBinary(result)}
					<HexEditor data={result.buffer} readonly={true} showHeader={false} showFooter={false} bytesPerLine={16} />
				{:else}
					<pre class="rounded border bg-slate-900 p-2 font-mono text-white">{uint8ArrayToString(analysis.result!)}</pre>
				{/if}
			</Card.Content>
		</Collapsible.Content>
		<Card.Footer class="flex flex-row items-center justify-between pb-3">
			{#if expanded}
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
			{/if}
		</Card.Footer>
	</Card.Root>
</Collapsible.Root>
