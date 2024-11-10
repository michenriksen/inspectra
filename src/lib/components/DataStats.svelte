<script lang="ts">
	import {
		countLines,
		countLowercase,
		countNonPrintable,
		countNumeric,
		countSpecial,
		countUppercase,
		shannonEntropy
	} from '$lib/utils';

	export let data: Uint8Array;

	let length = data.length;
	let entropy = 0;
	let uppercaseCount = 0;
	let lowercaseCount = 0;
	let numericCount = 0;
	let specialCount = 0;
	let lineCount = 0;
	let nonPrintCount = 0;

	$: if (data) {
		length = data.length;
		entropy = shannonEntropy(data);
		uppercaseCount = countUppercase(data);
		lowercaseCount = countLowercase(data);
		numericCount = countNumeric(data);
		specialCount = countSpecial(data);
		lineCount = countLines(data);
		nonPrintCount = countNonPrintable(data);
	}
</script>

<ol class="flex flex-row items-center space-x-8 text-xs">
	<li><strong>length:</strong> {length}</li>
	<li><strong>entropy:</strong> {entropy.toFixed(1)}</li>
	<li class="hidden md:block"><strong>numeric:</strong> {numericCount}</li>
	<li class="hidden md:block"><strong>uppercase:</strong> {uppercaseCount}</li>
	<li class="hidden md:block"><strong>lowercase:</strong> {lowercaseCount}</li>
	<li class="hidden md:block"><strong>special:</strong> {specialCount}</li>
	{#if nonPrintCount > 0}
		<li class="hidden md:block"><strong>non-printable:</strong> {nonPrintCount}</li>
	{/if}
	{#if lineCount > 1}
		<li class="hidden md:block"><strong>lines:</strong> {lineCount}</li>
	{/if}
</ol>
