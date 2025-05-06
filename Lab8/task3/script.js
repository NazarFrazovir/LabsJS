let draggedItem = null;

// Дозволяє перетягування
function allowDrop(event) {
  event.preventDefault();
}

// Початок перетягування
function drag(event) {
  draggedItem = event.target;
}

// Обробка скидання в колонку
function drop(event) {
  event.preventDefault();
  if (event.target.classList.contains('column')) {
    event.target.appendChild(draggedItem);
  } else if (event.target.classList.contains('task')) {
    event.target.parentNode.insertBefore(draggedItem, event.target);
  }
}
