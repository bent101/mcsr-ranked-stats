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

type OnPressCallback = () => void;

export function onpress(node: HTMLElement, callback: OnPressCallback) {
  function handleMouseDown(event: MouseEvent) {
    if (event.button === 0) {
      // Left click only
      callback();
    }
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      callback();
    }
  }

  node.addEventListener("mousedown", handleMouseDown);
  node.addEventListener("keydown", handleKeyDown);

  // Ensure the element is keyboard focusable
  if (!node.hasAttribute("tabindex")) {
    node.setAttribute("tabindex", "0");
  }

  // Add role="button" if not already a button
  if (node.tagName.toLowerCase() !== "button" && !node.hasAttribute("role")) {
    node.setAttribute("role", "button");
  }

  return {
    destroy() {
      node.removeEventListener("mousedown", handleMouseDown);
      node.removeEventListener("keydown", handleKeyDown);
    },
    update(newCallback: OnPressCallback) {
      callback = newCallback;
    },
  };
}
