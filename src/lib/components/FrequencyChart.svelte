<script lang="ts">
	import { Chart, BarElement, LinearScale, BarController, CategoryScale } from 'chart.js';
	import { onDestroy, onMount } from 'svelte';

	export let data: Uint8Array;

	let ctx: HTMLCanvasElement;
	let chart: Chart;
	let frequencies: Record<string, number>;

	$: if (data) {
		frequencies = {};
		Array.from({ length: 256 }, (_, i) => i.toString()).forEach((b) => (frequencies[b] = 0));
		data.forEach((byte) => {
			const bStr = byte.toString();
			frequencies[bStr] += 1;
		});
	}

	onMount(() => {
		Chart.register(BarElement, LinearScale, BarController, CategoryScale);

		chart = new Chart(ctx, {
			type: 'bar',
			data: {
				labels: Object.keys(frequencies),
				datasets: [
					{
						label: 'Frequency',
						data: Object.values(frequencies),
						backgroundColor: '#1a1b26'
					}
				]
			},
			options: {
				scales: {
					x: {
						min: 0,
						max: 255
					},
					y: {
						beginAtZero: true
					}
				}
			}
		});
	});

	onDestroy(() => {
		chart?.destroy();
	});
</script>

<canvas bind:this={ctx}></canvas>
