import { readable } from 'svelte/store';
import { type Analyzer } from '$lib/types';
import Base64Decoder from '$lib/analyzers/Base64Decoder';
import GzipDecompressor from '$lib/analyzers/GzipDecompressor';
import HexDecoder from '$lib/analyzers/HexDecoder';
import JsonDecoder from '$lib/analyzers/JsonDecoder';
import MessagePackDecoder from '$lib/analyzers/MessagePackDecoder';
import UrlDecoder from '$lib/analyzers/UrlDecoder';
import ZlibDecompressor from '$lib/analyzers/ZlibDecompressor';

export const analyzers = readable<Analyzer[]>([
	new UrlDecoder(),
	new HexDecoder(),
	new Base64Decoder(),
	new GzipDecompressor(),
	new ZlibDecompressor(),
	new MessagePackDecoder(),
	new JsonDecoder()
]);
