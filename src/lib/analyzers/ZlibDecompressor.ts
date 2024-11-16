import Analysis from './Analysis';
import BaseAnalyzer from './BaseAnalyzer';
import { type Analyzer } from '$lib/types';
import { unzlibSync } from 'fflate';

export default class ZlibDecompressor extends BaseAnalyzer implements Analyzer {
	public readonly name = 'Zlib Decompressor';
	public readonly handles = 'Zlib compression';
	public readonly description =
		'Decompresses <a href="https://en.wikipedia.org/wiki/Zlib" target="_blank">Zlib</a> compressed data.';

	public async analyze(data: Uint8Array): Promise<Analysis> {
		const analysis = new Analysis(this.name, data);

		analysis.match = data.length > 2 && data[0] === 0x78 && data[1] === 0x9c;
		if (!analysis.match) {
			return analysis;
		}

		try {
			analysis.success(unzlibSync(data));
		} catch (error) {
			analysis.fail(error);
		}

		return analysis;
	}
}
