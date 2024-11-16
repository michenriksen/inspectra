<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import SearchCode from 'lucide-svelte/icons/search-code';
	import CircleHelp from 'lucide-svelte/icons/circle-help';
	import { analyzers } from '$lib/stores';
	import '../app.css';

	let { children } = $props();
</script>

<div class="container space-y-10 py-10">
	<header class="flex flex-row items-center justify-between space-x-2">
		<div class="flex flex-row items-center space-x-2">
			<SearchCode class="h-8 w-8" />
			<span class="text-xl font-semibold">Inspectra</span>
			<span class="rounded bg-sky-300 px-2 py-1 text-sm font-semibold text-white shadow-sm">alpha</span>
		</div>

		<div class="flex flex-row items-center space-x-4 text-foreground/50">
			<Dialog.Root>
				<Dialog.Trigger>
					<CircleHelp class="h-5 w-5 text-foreground/50 transition-colors hover:text-foreground" />
				</Dialog.Trigger>
				<a href="https://github.com/michenriksen/inspectra" target="_blank" aria-label="GitHub repository">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 98 96"
						class="h-5 w-5 fill-foreground/50 transition-colors hover:fill-foreground"
						><path
							fill-rule="evenodd"
							d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
							clip-rule="evenodd"
						/></svg
					>
				</a>
				<Dialog.Content class="!min-w-[70vw]">
					<Dialog.Header>
						<Dialog.Title>About Inspectra</Dialog.Title>
					</Dialog.Header>

					<p>
						Inspectra is a client-side web tool for inspecting and analyzing arbitrary data. It processes all data
						locally in the browser, ensuring privacy and security by not transferring any data over the network.
					</p>

					<h2 class="text-lg font-semibold">Features</h2>

					<ul class="list-inside list-disc">
						<li>
							<strong>Automatic detection and processing:</strong> Detects and processes encodings (e.g., Hex, Base64) and
							compressions (e.g., Gzip, Zlib). The tool iterates through layers of encoding or compression until no further
							processing is needed.
						</li>
						<li>
							<strong>Raw and hex dump views:</strong> Displays data as raw text or a hex dump for detailed inspection.
						</li>
						<li><strong>Selective inspection:</strong> Allows analysis of specific portions of the input data.</li>
						<li>
							<strong>Structured data formatting:</strong> Decodes and formats structured data formats such as JSON and MessagePack.
						</li>
						<li>
							<strong>Frequency distribution analysis:</strong> Generates a chart to analyze the frequency distribution of
							data.
						</li>
					</ul>
				</Dialog.Content>
			</Dialog.Root>
		</div>
	</header>

	<section class="main">
		{@render children()}
	</section>
</div>

<style lang="postcss">
	a {
		@apply text-blue-500;
	}
</style>
