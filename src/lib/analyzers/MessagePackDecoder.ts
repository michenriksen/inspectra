import BaseAnalyzer from './BaseAnalyzer';
import Analysis from './Analysis';
import { type Analyzer } from '$lib/types';
import { decodeAsync } from '@msgpack/msgpack';
import { stringToUint8Array } from '$lib/utils';

export default class MessagePackDecoder extends BaseAnalyzer implements Analyzer {
	public readonly name = 'MessagePack Decoder';
	public readonly handles = 'MessagePack encoding';
	public readonly description =
		'Decodes and formats <a href="https://en.wikipedia.org/wiki/MessagePack" target="_blank">MessagePack</a> encoded data.';

	public async analyze(data: Uint8Array): Promise<Analysis> {
		const analysis = new Analysis(this.name, data);

		try {
			analysis.match = this._isMessagePack(data);
			if (!analysis.match) {
				return analysis;
			}

			const stream = new ReadableStream({
				start(controller) {
					controller.enqueue(data);
					controller.close();
				}
			});

			let obj;

			try {
				obj = await decodeAsync(stream);
			} catch (error) {
				analysis.match = false;
				return analysis;
			}

			const formatted = JSON.stringify(obj, null, 4);

			await analysis.success(stringToUint8Array(formatted));
		} catch (error) {
			analysis.fail(error);
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
