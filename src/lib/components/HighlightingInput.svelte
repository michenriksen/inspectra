<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { debounce, shannonEntropy } from '$lib/utils';

	const hexRegexp = /[A-Fa-f0-9]{4,}/g;
	const hexClasses = 'bg-indigo-200 rounded-sm';

	const base64Regexp = /[A-Za-z0-9/+=_-]{4,}/gi;
	const base64Classes = 'bg-teal-200 rounded-sm';

	let inputEl: HTMLElement;
	let debouncedHighlight = debounce(highlight, 500);

	function highlight() {
		const text = inputEl.innerText;

		// Create a document fragment to avoid direct DOM manipulation and conflicts
		const fragment = document.createDocumentFragment();

		// Helper function to apply highlighting function and wrap in a span
		const applyHighlight = (text: string, highlightFunc: (input: string) => string) => {
			const wrapper = document.createElement('span');
			wrapper.innerHTML = highlightFunc(text);
			return wrapper;
		};

		// Apply highlighting functions independently
		const base64Highlighted = applyHighlight(text, highlightBase64Sequences);
		const hexHighlighted = applyHighlight(text, highlightHexSequences);

		// Use an index to iterate through both sets of highlighted nodes
		let base64Index = 0;
		let hexIndex = 0;

		// Loop over all nodes in base64Highlighted and hexHighlighted
		while (base64Index < base64Highlighted.childNodes.length || hexIndex < hexHighlighted.childNodes.length) {
			// Handle cases where base64 or hex nodes are undefined
			const base64Node = base64Highlighted.childNodes[base64Index];
			const hexNode = hexHighlighted.childNodes[hexIndex];

			// Append cloned nodes to the fragment, handling undefined nodes
			if (base64Node) {
				fragment.appendChild(base64Node.cloneNode(true));
				base64Index++;
			}
			if (hexNode) {
				fragment.appendChild(hexNode.cloneNode(true));
				hexIndex++;
			}
		}

		// Clear and append the merged highlights back into inputEl
		inputEl.innerHTML = '';
		inputEl.appendChild(fragment);
		placeCaretAtEnd();
	}

	function highlightHexSequences(text: string) {
		return text.replace(hexRegexp, (match) => {
			if (shannonEntropy(match) < 1.5) {
				return match;
			}
			return `<mark class="${hexClasses}">${match}</mark>`;
		});
	}

	function highlightBase64Sequences(text: string) {
		return text.replace(/\b[A-Za-z0-9+/=_-]{4,}\b/g, (match) => {
			console.log('here');
			// Base64 and URL-safe Base64 should be length multiple of 4
			if (match.length % 4 !== 0) {
				return match;
			}

			// Entropy check to reduce false positives
			if (shannonEntropy(match) < 1.0) {
				return match;
			}

			// Try decoding as Base64 or URL-safe Base64
			try {
				// Replace URL-safe characters with standard Base64 equivalents
				const standardMatch = match.replace(/-/g, '+').replace(/_/g, '/');
				atob(standardMatch);
				return `<mark class="${base64Classes}">${match}</mark>`;
			} catch (error) {
				// Invalid Base64 sequence, return as-is
				console.error(error);
				return match;
			}
		});
	}

	function placeCaretAtEnd() {
		const selection = window.getSelection();
		if (selection) {
			const range = document.createRange();
			range.selectNodeContents(inputEl);
			range.collapse(false);
			selection.removeAllRanges();
			selection.addRange(range);
		}
	}
</script>
