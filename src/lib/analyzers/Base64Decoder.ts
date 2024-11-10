import { AnalyzerId, type Analysis, type Analyzer } from '$lib/types';
import { stringToUint8Array, stripWhitespace, uint8ArrayToString, sha256 } from '$lib/utils';

export default class Base64Decoder implements Analyzer {
	public readonly id = AnalyzerId.Base64Decoder;

	private readonly _base64Regex =
		/^(?:[A-Za-z0-9+\/_-]{4})*(?:[A-Za-z0-9+\/_-]{2}==|[A-Za-z0-9+\/_-]{3}=|[A-Za-z0-9+\/_-]{2,3})?$/;

	public async analyze(data: Uint8Array): Promise<Analysis> {
		const analysis: Analysis = {
			analyzer: this.id,
			success: false,
			data: data,
			result: null,
			hash: null
		};

		try {
			let s = stripWhitespace(uint8ArrayToString(data));

			if (!this._base64Regex.test(s)) {
				return analysis;
			}

			analysis.result = stringToUint8Array(atob(s.replace(/-/g, '+').replace(/_/g, '/')));
			analysis.hash = await sha256(analysis.result);
			analysis.success = true;
		} catch (error) {
			analysis.error = error instanceof Error ? error.message : String(error);
			analysis.success = false;
		}

		return analysis;
	}
}
