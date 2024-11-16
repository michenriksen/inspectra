import { type Analyzer } from '$lib/types';
import { uint8ArrayToString, stringToUint8Array, stripWhitespace } from '$lib/utils';
import BaseAnalyzer from '$lib/analyzers/BaseAnalyzer';
import Analysis from '$lib/analyzers/Analysis';

export default class HexDecoder extends BaseAnalyzer implements Analyzer {
	public readonly name = 'Hex Decoder';
	public readonly handles = 'Hex encoding';
	public readonly description =
		'Decodes <a href="https://en.wikipedia.org/wiki/Hexadecimal" target="_blanl">hex</a> encoded data.';

	private readonly _hexRegex = /^[A-Fa-f0-9]+$/;

	public async analyze(data: Uint8Array): Promise<Analysis> {
		const analysis = new Analysis(this.name, data);

		try {
			let s = stripWhitespace(uint8ArrayToString(data));

			analysis.match = this._hexRegex.test(s);
			if (!analysis.match) {
				return analysis;
			}

			await analysis.success(this._decodeHex(s));
		} catch (error) {
			analysis.fail(error);
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
