<script lang="ts">
	import { splitUint8Array } from '$lib/utils';

	export let data: Uint8Array;
	export let columns: number = 16;

	$: chunks = splitUint8Array(data, columns);
</script>

<table class="border">
	<tbody>
		{#each chunks as bytes}
			<tr>
				{#each bytes as byte}
					<td
						class="h-3 w-3"
						style="background-color: rgb({byte}, {byte}, {byte})"
						title={byte.toString(16).padStart(2, '0').toUpperCase()}
					></td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>
