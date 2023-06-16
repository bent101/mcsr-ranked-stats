export function ignFilter(node: HTMLInputElement) {
	function beforeInput(event: InputEvent) {
		if (event.data) {
			if (event.data.match(/[^a-zA-Z0-9_]/) || node.value.length >= 16) {
				event.preventDefault();
			}
		}
	}

	node.addEventListener("beforeinput", beforeInput);

	return {
		destroy() {
			node.removeEventListener("beforeinput", beforeInput);
		},
	};
}
