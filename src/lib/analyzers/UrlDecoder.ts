import { type Analyzer } from '$lib/types';
import BaseAnalyzer from '$lib/analyzers/BaseAnalyzer';
import Analysis from '$lib/analyzers/Analysis';
import { uint8ArrayToString, stringToUint8Array } from '$lib/utils';

export default class UrlDecoder extends BaseAnalyzer implements Analyzer {
	public readonly name = 'URL Decoder';
	public readonly handles = 'URL encoding';
	public readonly description =
		'Decodes <a href="https://en.wikipedia.org/wiki/Percent-encoding" target="_blank">URL/percent-encoded</a> data.';

	private readonly _urlEncRegex = /%[0-9A-Fa-f]{2}/;

	public async analyze(data: Uint8Array): Promise<Analysis> {
		const analysis = new Analysis(this.name, data);

		try {
			const s = uint8ArrayToString(data);

			analysis.match = this._urlEncRegex.test(s);
			if (!analysis.match) {
				return analysis;
			}

			await analysis.success(stringToUint8Array(decodeURIComponent(s)));
		} catch (error) {
			analysis.fail(error);
		}

		return analysis;
	}
}
