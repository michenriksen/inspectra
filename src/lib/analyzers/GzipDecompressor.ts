import { AnalyzerId, type Analysis, type Analyzer } from '$lib/types';
import { stringToUint8Array, sha256 } from '$lib/utils';

export default class GzipDecompressor implements Analyzer {
	public readonly id = AnalyzerId.GzipDecompressor;

	public async analyze(data: Uint8Array): Promise<Analysis> {
		const analysis: Analysis = {
			analyzer: this.id,
			success: false,
			data: data,
			result: null,
			hash: null
		};

		if (data[0] !== 0x1f || data[1] !== 0x8b) {
			return analysis;
		}

		try {
			const stream = new Response(data).body!;
			const decompressed = await new Response(stream.pipeThrough(new DecompressionStream('gzip'))).text();

			analysis.result = stringToUint8Array(decompressed);
			analysis.hash = await sha256(analysis.result);
			analysis.success = true;
		} catch (error) {
			analysis.error = error instanceof Error ? error.message : String(error);
			analysis.success = false;
		}

		return analysis;
	}
}
