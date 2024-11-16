import type { Analysis as IAnalysis } from '$lib/types';
import { sha256, fnv1a64 } from '$lib/utils';

export default class Analysis implements IAnalysis {
	private _result: Uint8Array | null = null;
	private _hash: string | null = null;
	private _match: boolean = false;
	private _error: string | null = null;

	public constructor(
		private _analyzer: string,
		private _data: Uint8Array
	) {}

	public get id(): string {
		return fnv1a64([this.analyzer, this.result, this.hash, this.match, this.error]);
	}

	public get analyzer(): string {
		return this._analyzer;
	}

	public get data(): Uint8Array {
		return this._data;
	}

	public get result(): Uint8Array | null {
		return this._result;
	}

	public get hash(): string | null {
		return this._hash;
	}

	public get match(): boolean {
		return this._match;
	}

	public set match(val: boolean) {
		this._match = val;
	}

	public get error(): string | null {
		return this._error;
	}

	public async success(data: Uint8Array) {
		this._result = data;
		this._hash = await sha256(data);
		this._match = true;
		this._error = null;
	}

	public fail(error: any) {
		this._result = null;
		this._hash = null;
		this._error = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
	}

	public toJSON() {
		return {
			id: this.id,
			analyzer: this.analyzer,
			match: this.match,
			data: this.data,
			result: this.result,
			hash: this.hash,
			error: this.error
		};
	}
}
