<script lang="ts">
	import { isHex, decodeHex } from '$lib/utils';

	export let data: string;
	export let onDecode: (newData: string) => void;

	$: if (isHex(data)) {
		onDecode(decodeHex(data));
	}
</script>
