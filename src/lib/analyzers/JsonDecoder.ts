import { AnalyzerId, type Analysis, type Analyzer } from '$lib/types';
import { sha256, stringToUint8Array, uint8ArrayToString } from '$lib/utils';

export default class JsonDecoder implements Analyzer {
	public readonly id = AnalyzerId.JsonDecoder;

	public async analyze(data: Uint8Array): Promise<Analysis> {
		const analysis: Analysis = {
			analyzer: this.id,
			success: false,
			data: data,
			result: null,
			hash: null
		};

		try {
			const s = uint8ArrayToString(data).trim();

			if ((s.startsWith('{') && s.endsWith('}')) || (s.startsWith('[') && s.endsWith(']'))) {
				const obj = JSON.parse(s);
				const formatted = JSON.stringify(obj, null, 4);

				if (s === formatted) {
					return analysis;
				}

				analysis.result = stringToUint8Array(formatted);
				analysis.hash = await sha256(analysis.result);
				analysis.success = true;
			}
		} catch (error) {
			analysis.error = error instanceof Error ? error.message : String(error);
			analysis.success = false;
		}

		return analysis;
	}
}
