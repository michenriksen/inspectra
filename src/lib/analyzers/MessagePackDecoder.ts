import { decodeAsync } from '@msgpack/msgpack';
import { AnalyzerId, type Analysis, type Analyzer } from '$lib/types';
import { sha256, stringToUint8Array } from '$lib/utils';

export default class MessagePackDecoder implements Analyzer {
	public readonly id = AnalyzerId.MessagePackDecoder;

	public async analyze(data: Uint8Array): Promise<Analysis> {
		const analysis: Analysis = {
			analyzer: this.id,
			success: false,
			data: data,
			result: null,
			hash: null
		};

		try {
			if (!this._isMessagePack(data)) {
				return analysis;
			}

			const stream = new ReadableStream({
				start(controller) {
					controller.enqueue(data);
					controller.close();
				}
			});
			const obj = await decodeAsync(stream);
			const formatted = JSON.stringify(obj, null, 4);

			analysis.result = stringToUint8Array(formatted);
			analysis.hash = await sha256(analysis.result);
			analysis.success = true;
		} catch (error) {
			analysis.error = error instanceof Error ? error.message : String(error);
			analysis.success = false;
		}

		return analysis;
	}

	private _isMessagePack(data: Uint8Array): boolean {
		if (data.length === 0) return false;

		const firstByte = data[0];

		return (
			(firstByte >= 0x80 && firstByte <= 0x8f) || // FixMap
			(firstByte >= 0x90 && firstByte <= 0x9f) || // FixArray
			(firstByte >= 0xa0 && firstByte <= 0xbf) || // FixStr
			firstByte === 0xc0 || // Nil
			firstByte === 0xc2 ||
			firstByte === 0xc3 || // Booleans
			firstByte === 0xdc ||
			firstByte === 0xdd || // Array
			firstByte === 0xde ||
			firstByte === 0xdf || // Map
			firstByte === 0xd9 ||
			firstByte === 0xda ||
			firstByte === 0xdb // Str
		);
	}
}
