export enum AnalyzerId {
	Base64Decoder,
	HexDecoder,
	JsonDecoder,
	UrlDecoder
}

export interface Analysis {
	analyzer: AnalyzerId;
	success: boolean;
	data: Uint8Array;
	result: Uint8Array | null;
	hash: string | null;
	error?: string;
}

export interface Analyzer {
	id: AnalyzerId;
	analyze(data: Uint8Array): Promise<Analysis>;
}
