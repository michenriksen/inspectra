import { AnalyzerId, type Analysis, type Analyzer } from '$lib/types';
import { uint8ArrayToString, stringToUint8Array, stripWhitespace, sha256 } from '$lib/utils';

export default class HexDecoder implements Analyzer {
	readonly id = AnalyzerId.HexDecoder;

	private readonly _hexRegex = /^[A-Fa-f0-9]+$/;

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

			if (!this._hexRegex.test(s)) {
				return analysis;
			}

			analysis.result = this._decodeHex(s);
			analysis.hash = await sha256(analysis.result);
			analysis.success = true;
		} catch (error) {
			analysis.error = error instanceof Error ? error.message : String(error);
			analysis.success = false;
		}

		return analysis;
	}

	private _decodeHex(data: string): Uint8Array {
		return stringToUint8Array(
			data
				.toLowerCase()
				.match(/.{1,2}/g)
				?.map((byte) => String.fromCharCode(parseInt(byte, 16)))
				.join('') || ''
		);
	}
}
