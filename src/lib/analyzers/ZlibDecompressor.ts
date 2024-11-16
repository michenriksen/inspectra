import { AnalyzerId, type Analysis, type Analyzer } from '$lib/types';
import { sha256 } from '$lib/utils';
import { unzlibSync } from 'fflate';

export default class ZlibDecompressor implements Analyzer {
	public readonly id = AnalyzerId.ZlibDecompressor;

	public async analyze(data: Uint8Array): Promise<Analysis> {
		const analysis: Analysis = {
			analyzer: this.id,
			success: false,
			data: data,
			result: null,
			hash: null
		};

		if (data[0] !== 0x78 || data[1] !== 0x9c) {
			return analysis;
		}

		try {
			analysis.result = unzlibSync(data);
			analysis.hash = await sha256(analysis.result);
			analysis.success = true;
		} catch (error) {
			analysis.error = error instanceof Error ? error.message : String(error);
			analysis.success = false;
		}

		return analysis;
	}
}
