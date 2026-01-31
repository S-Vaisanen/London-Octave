/* captcha.js */
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('captcha-grid');
    const status = document.getElementById('captcha-status');
    const form = document.getElementById('contact-form');
    const submitButton = document.getElementById('contact-submit');

    if (!grid || !status || !form || !submitButton) {
        return;
    }

    const target = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let current = [];
    let initial = [];
    let selectedIndex = null;
    let dragIndex = null;
    let dragGhost = null;
    let dragOffset = { x: 0, y: 0 };
    let solved = false;

    const shuffle = (array) => {
        const copy = [...array];
        for (let i = copy.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    };

    const isSolved = (array) => array.every((value, index) => value === target[index]);

    const updateStatus = (message, isWarning = false) => {
        status.textContent = message;
        status.classList.toggle('is-warning', isWarning);
        status.classList.toggle('is-success', !isWarning && solved);
    };

    const render = () => {
        grid.innerHTML = '';
        current.forEach((value, index) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'captcha-tile';
            if (selectedIndex === index) {
                button.classList.add('is-selected');
            }
            if (value === target[index]) {
                button.classList.add('is-correct');
            }
            if (dragIndex === index) {
                button.classList.add('is-dragging');
            }
            button.dataset.index = String(index);
            button.textContent = value;
            button.setAttribute('role', 'gridcell');
            button.setAttribute('aria-label', `Tile ${value}`);
            grid.appendChild(button);
        });

        solved = isSolved(current);
        submitButton.disabled = !solved;
        submitButton.classList.toggle('is-success', solved);
        updateStatus(
            solved ? 'Captcha complete. You can send your message.' : 'Captcha not solved.',
            !solved
        );
    };

    const resetPuzzle = (state) => {
        current = [...state];
        selectedIndex = null;
        render();
    };

    const shufflePuzzle = () => {
        let next = shuffle(target);
        if (isSolved(next)) {
            [next[0], next[1]] = [next[1], next[0]];
        }
        initial = [...next];
        resetPuzzle(next);
    };

    const buildGhost = (source, x, y) => {
        const rect = source.getBoundingClientRect();
        dragGhost = source.cloneNode(true);
        dragGhost.classList.add('captcha-ghost');
        dragGhost.style.width = `${rect.width}px`;
        dragGhost.style.height = `${rect.height}px`;
        dragGhost.style.left = '0px';
        dragGhost.style.top = '0px';
        document.body.appendChild(dragGhost);
        dragOffset = { x: x - rect.left, y: y - rect.top };
    };

    const moveGhost = (x, y) => {
        if (!dragGhost) {
            return;
        }
        dragGhost.style.transform = `translate(${x - dragOffset.x}px, ${y - dragOffset.y}px)`;
    };

    const cleanupGhost = () => {
        if (dragGhost) {
            dragGhost.remove();
            dragGhost = null;
        }
    };

    const getClosestIndex = (x, y) => {
        const tiles = [...grid.querySelectorAll('button.captcha-tile')];
        let closest = null;
        let best = Number.POSITIVE_INFINITY;
        tiles.forEach((tile) => {
            const rect = tile.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const distance = Math.hypot(centerX - x, centerY - y);
            if (distance < best) {
                best = distance;
                closest = Number(tile.dataset.index);
            }
        });
        return closest;
    };

    grid.addEventListener('pointerdown', (event) => {
        if (solved) {
            return;
        }
        const button = event.target.closest('button.captcha-tile');
        if (!button) {
            return;
        }
        if (event.pointerType === 'mouse' && event.button !== 0) {
            return;
        }
        const index = Number(button.dataset.index);
        if (Number.isNaN(index)) {
            return;
        }
        dragIndex = index;
        selectedIndex = null;
        button.classList.add('is-dragging');
        button.setPointerCapture(event.pointerId);
        buildGhost(button, event.clientX, event.clientY);
        moveGhost(event.clientX, event.clientY);
        event.preventDefault();
    });

    grid.addEventListener('pointermove', (event) => {
        if (dragIndex === null) {
            return;
        }
        moveGhost(event.clientX, event.clientY);
    });

    const finishDrag = (event) => {
        if (dragIndex === null) {
            return;
        }
        const source = grid.querySelector(`button.captcha-tile[data-index="${dragIndex}"]`);
        if (source) {
            source.classList.remove('is-dragging');
        }
        const dropIndex = getClosestIndex(event.clientX, event.clientY);
        if (dropIndex !== null && dropIndex !== dragIndex) {
            [current[dragIndex], current[dropIndex]] = [current[dropIndex], current[dragIndex]];
        }
        dragIndex = null;
        cleanupGhost();
        render();
    };

    grid.addEventListener('pointerup', finishDrag);
    grid.addEventListener('pointercancel', finishDrag);

    form.addEventListener('submit', (event) => {
        if (!isSolved(current)) {
            event.preventDefault();
            updateStatus('Please solve the captcha before sending.', true);
        }
    });

    shufflePuzzle();
});
