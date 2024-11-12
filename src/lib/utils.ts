import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

type FlyAndScaleParams = {
	y?: number;
	x?: number;
	start?: number;
	duration?: number;
};

export const flyAndScale = (
	node: Element,
	params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig => {
	const style = getComputedStyle(node);
	const transform = style.transform === 'none' ? '' : style.transform;

	const scaleConversion = (valueA: number, scaleA: [number, number], scaleB: [number, number]) => {
		const [minA, maxA] = scaleA;
		const [minB, maxB] = scaleB;

		const percentage = (valueA - minA) / (maxA - minA);
		const valueB = percentage * (maxB - minB) + minB;

		return valueB;
	};

	const styleToString = (style: Record<string, number | string | undefined>): string => {
		return Object.keys(style).reduce((str, key) => {
			if (style[key] === undefined) return str;
			return str + `${key}:${style[key]};`;
		}, '');
	};

	return {
		duration: params.duration ?? 200,
		delay: 0,
		css: (t) => {
			const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
			const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
			const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

			return styleToString({
				transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
				opacity: t
			});
		},
		easing: cubicOut
	};
};

export const debounce = <T extends (...args: any[]) => any>(fn: T, ms = 300) => {
	let timeoutId: ReturnType<typeof setTimeout> | null = null;

	return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
		if (timeoutId) clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			fn.apply(this, args);
		}, ms);
	};
};

export const shannonEntropy = (data: Uint8Array): number => {
	const length = data.length;
	if (length === 0) return 0;

	const frequencyMap = new Map<number, number>();
	for (const byte of data) {
		frequencyMap.set(byte, (frequencyMap.get(byte) || 0) + 1);
	}

	let entropy = 0;
	for (const count of frequencyMap.values()) {
		const probability = count / length;
		entropy -= probability * Math.log2(probability);
	}

	return entropy;
};

export const isBinary = (data: Uint8Array, threshold = 0.3): boolean => {
	const length = data.length;
	if (length === 0) return false;

	let nonPrintableCount = 0;

	for (const byte of data) {
		if (byte < 32 || byte > 126) {
			nonPrintableCount++;
		}
	}

	const nonPrintableRatio = nonPrintableCount / length;

	return nonPrintableRatio > threshold;
};

export const stripWhitespace = (data: string): string => {
	return data.replace(/[\n\r\t]/g, '').trim();
};

export const uint8ArrayToString = (data: Uint8Array): string => {
	return new TextDecoder().decode(data);
};

export const stringToUint8Array = (data: string): Uint8Array => {
	return new Uint8Array(data.split('').map((char) => char.charCodeAt(0)));
};

export const uint8ArraysEqual = (a: Uint8Array, b: Uint8Array): boolean => {
	if (a.length !== b.length) {
		return false;
	}

	for (let i = 0; i < a.length; i++) {
		if (a[i] !== b[i]) {
			return false;
		}
	}

	return true;
};

export const splitUint8Array = (data: Uint8Array, chunkSize: number): Uint8Array[] => {
	const result: Uint8Array[] = [];

	for (let i = 0; i < data.length; i += chunkSize) {
		const chunk = data.slice(i, i + chunkSize);
		result.push(chunk);
	}

	return result;
};

export const sha256 = async (data: Uint8Array): Promise<string> => {
	const hash = await window.crypto.subtle.digest('SHA-256', data.buffer);
	return [...new Uint8Array(hash)].map((x) => x.toString(16).padStart(2, '0')).join('');
};

export const isBase64 = (data: Uint8Array): boolean => {
	try {
		const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
		const base64UrlRegex = /^(?:[A-Za-z0-9_-]{2,4})*(?:[A-Za-z0-9_-]{2,3})?$/;
		const s = uint8ArrayToString(data);

		if (s.length % 4 !== 0) {
			return false;
		}

		if (!base64Regex.test(s) && !base64UrlRegex.test(s)) {
			return false;
		}

		return true;
	} catch (error) {
		return false;
	}
};

export const urlSafeBase64Encode = (data: Uint8Array): string => {
	const base64String = btoa(String.fromCharCode(...data));
	return base64String.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

export const decodeBase64 = (data: Uint8Array): Uint8Array => {
	const s = uint8ArrayToString(data);
	return stringToUint8Array(atob(s.replace(/-/g, '+').replace(/_/g, '/')));
};

export const isHex = (data: Uint8Array): boolean => {
	try {
		const hexRegex = /^[A-Fa-f0-9]+$/;
		const s = uint8ArrayToString(data);

		return s.length % 2 === 0 && hexRegex.test(s);
	} catch (error) {
		return false;
	}
};

export const decodeHex = (data: Uint8Array): Uint8Array => {
	const s = uint8ArrayToString(data);

	return stringToUint8Array(
		s
			.toLowerCase()
			.match(/.{1,2}/g)
			?.map((byte) => String.fromCharCode(parseInt(byte, 16)))
			.join('') || ''
	);
};

export const countLowercase = (data: Uint8Array): number => {
	let count = 0;

	for (const byte of data) {
		// ASCII range for 'a' to 'z'
		if (byte >= 97 && byte <= 122) {
			count++;
		}
	}

	return count;
};

export const countUppercase = (data: Uint8Array): number => {
	let count = 0;

	for (const byte of data) {
		// ASCII range for 'A' to 'Z'
		if (byte >= 65 && byte <= 90) {
			count++;
		}
	}

	return count;
};

export const countNumeric = (data: Uint8Array): number => {
	let count = 0;

	for (const byte of data) {
		// ASCII range for '0' to '9'
		if (byte >= 48 && byte <= 57) {
			count++;
		}
	}

	return count;
};

export const countSpecial = (data: Uint8Array): number => {
	let count = 0;

	for (const byte of data) {
		if (
			(byte >= 33 && byte <= 47) || // Symbols like !"#$%&'()*+,-./
			(byte >= 58 && byte <= 64) || // Symbols like :;<=>?@
			(byte >= 91 && byte <= 96) || // Symbols like [\]^_`
			(byte >= 123 && byte <= 126) // Symbols like {|}~
		) {
			count++;
		}
	}

	return count;
};

export const countLines = (data: Uint8Array): number => {
	let count = 0;

	for (let i = 0; i < data.length; i++) {
		// ASCII code for '\n'
		if (data[i] === 10) {
			count++;
		}
	}

	// If the last character isn't a newline, add one to count the final line.
	if (data.length > 0 && data[data.length - 1] !== 10) {
		count++;
	}

	return count;
};

export const countNonPrintable = (data: Uint8Array): number => {
	let count = 0;

	for (const byte of data) {
		if (byte !== 10 && ((byte >= 0 && byte <= 31) || (byte >= 128 && byte <= 159))) {
			count++;
		}
	}

	return count;
};
