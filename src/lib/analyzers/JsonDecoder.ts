import BaseAnalyzer from '$lib/analyzers/BaseAnalyzer';
import Analysis from '$lib/analyzers/Analysis';
import { type Analyzer } from '$lib/types';
import { stringToUint8Array, uint8ArrayToString } from '$lib/utils';

export default class JsonDecoder extends BaseAnalyzer implements Analyzer {
	public readonly name = 'JSON Decoder';
	public readonly handles = 'JSON encoding';
	public description =
		'Decodes and formats <a href="https://en.wikipedia.org/wiki/JSON" target="_blanl">JSON</a> encoded data.';

	public async analyze(data: Uint8Array): Promise<Analysis> {
		const analysis = new Analysis(this.name, data);

		try {
			const s = uint8ArrayToString(data).trim();

			analysis.match = this._isUnformattedJson(data);
			if (!analysis.match) {
				return analysis;
			}

			const obj = JSON.parse(s);
			const formatted = JSON.stringify(obj, null, 4);

			if (s === formatted) {
				return analysis;
			}

			await analysis.success(stringToUint8Array(formatted));
		} catch (error) {
			analysis.fail(error);
		}

		return analysis;
	}

	private _isUnformattedJson(data: Uint8Array): boolean {
		try {
			const s = uint8ArrayToString(data).trim();
			const isObj = s.startsWith('{') && s.endsWith('}');
			const isArray = s.startsWith('[') && s.endsWith(']');

			if (!isObj && !isArray) {
				return false;
			}

			const obj = JSON.parse(s);

			return s !== JSON.stringify(obj, null, 4);
		} catch (error) {
			return false;
		}
	}
}
