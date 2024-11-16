import { type Analyzer } from '$lib/types';
import BaseAnalyzer from '$lib/analyzers/BaseAnalyzer';
import Analysis from '$lib/analyzers/Analysis';
import { gunzipSync } from 'fflate';

export default class GzipDecompressor extends BaseAnalyzer implements Analyzer {
	public readonly name = 'Gzip Decompressor';
	public readonly handles = 'Gzip compression';
	public readonly description =
		'Decompresses <a href="https://en.wikipedia.org/wiki/Gzip" target="_blank">Gzip</a> compressed data.';

	public async analyze(data: Uint8Array): Promise<Analysis> {
		const analysis = new Analysis(this.name, data);

		analysis.match = data.length > 2 && data[0] === 0x1f && data[1] === 0x8b;
		if (!analysis.match) {
			return analysis;
		}

		try {
			await analysis.success(gunzipSync(data));
		} catch (error) {
			analysis.fail(error);
		}

		return analysis;
	}
}
