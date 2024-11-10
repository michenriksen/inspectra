import { AnalyzerId, type Analysis, type Analyzer } from '$lib/types';
import { uint8ArrayToString, stringToUint8Array, sha256 } from '$lib/utils';

export default class UrlDecoder implements Analyzer {
	readonly id = AnalyzerId.UrlDecoder;

	private readonly _urlEncRegex = /%[0-9A-Fa-f]{2}/;

	public async analyze(data: Uint8Array): Promise<Analysis> {
		const analysis: Analysis = {
			analyzer: this.id,
			success: false,
			data: data,
			result: null,
			hash: null
		};

		try {
			const s = uint8ArrayToString(data);

			if (!this._urlEncRegex.test(s)) {
				return analysis;
			}

			analysis.result = stringToUint8Array(decodeURIComponent(s));
			analysis.hash = await sha256(analysis.result);
			analysis.success = true;
		} catch (error) {
			analysis.error = error instanceof Error ? error.message : String(error);
			analysis.success = false;
		}

		return analysis;
	}
}
