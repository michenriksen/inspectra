import BaseAnalyzer from '$lib/analyzers/BaseAnalyzer';
import Analysis from '$lib/analyzers/Analysis';
import { type Analyzer } from '$lib/types';
import { stringToUint8Array, stripWhitespace, uint8ArrayToString } from '$lib/utils';

export default class Base64Decoder extends BaseAnalyzer implements Analyzer {
	public readonly name = 'Base64 Decoder';
	public readonly handles = 'Base64 encoding';
	public readonly description =
		'Decodes regular and URL-safe <a href="https://en.wikipedia.org/wiki/Base64" target="_blank">Base64</a> encoded data.';

	private readonly _base64Regex =
		/^(?:[A-Za-z0-9+\/_-]{4})*(?:[A-Za-z0-9+\/_-]{2}==|[A-Za-z0-9+\/_-]{3}=|[A-Za-z0-9+\/_-]{2,3})?$/;

	public async analyze(data: Uint8Array): Promise<Analysis> {
		const analysis = new Analysis(this.name, data);

		try {
			let s = stripWhitespace(uint8ArrayToString(data));

			analysis.match = this._base64Regex.test(s);
			if (!analysis.match) {
				return analysis;
			}

			await analysis.success(stringToUint8Array(atob(s.replace(/-/g, '+').replace(/_/g, '/'))));
		} catch (error) {
			analysis.fail(error);
		}

		return analysis;
	}
}
