export function createUI(elements, state) {
  function announce(message) {
    try {
      const placeholder = elements.canvasPlaceholder;
      if (!placeholder) return;
      const p = placeholder.querySelector('p') || placeholder;
      p.textContent = String(message ?? '');
      placeholder.classList.remove('hidden');
      placeholder.classList.add('flash');
      setTimeout(() => {
        placeholder.classList.remove('flash');
        if (state.hasPhoto) placeholder.classList.add('hidden');
      }, 900);
    } catch {}
  }

  function updatePlaceholder() {
    elements.canvasPlaceholder.classList.toggle('hidden', state.hasPhoto);
  }

  function highlightPlaceholder() {
    elements.canvasPlaceholder.classList.remove('hidden');
    elements.canvasPlaceholder.classList.add('flash');
    setTimeout(() => {
      elements.canvasPlaceholder.classList.remove('flash');
      updatePlaceholder();
    }, 900);
  }

  return { announce, updatePlaceholder, highlightPlaceholder };
}

