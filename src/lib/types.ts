export interface Data {
	data: Uint8Array;
	selection: boolean;
	offsetStart: number;
	offsetEnd: number;
}

export interface Analysis {
	id: string;
	analyzer: string;
	match: boolean;
	data: Uint8Array;
	result: Uint8Array | null;
	hash: string | null;
	error: string | null;
	toJSON(): any;
}

export interface Analyzer {
	name: string;
	handles: string;
	description: string;
	analyze(data: Uint8Array): Promise<Analysis>;
}
