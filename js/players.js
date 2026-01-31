document.addEventListener('DOMContentLoaded', () => {
    const playersContainer = document.getElementById('players-container');

    if (playersContainer) {
        // Check if playersData is loaded (from players_data.js)
        if (typeof playersData !== 'undefined' && Array.isArray(playersData)) {
            renderPlayers(playersData);
        } else {
            console.error('Player data not found. Ensure js/players_data.js is loaded.');
            playersContainer.innerHTML = '<p class="text-center">Unable to load player data at this time.</p>';
        }
    }

    function renderPlayers(players) {
        playersContainer.innerHTML = players.map(player => `
            <article class="player-card">
                <div class="player-img">
                    <img src="${player.image}" alt="${player.name}">
                </div>
                <div class="player-info">
                    <h3>${player.name}</h3>
                    <span class="player-role text-premium">${player.role}</span>
                    <p>${player.bio}</p>
                </div>
            </article>
        `).join('');

        // Add scroll listeners for fade effect
        const bios = playersContainer.querySelectorAll('.player-info p');
        bios.forEach(bio => {
            // Check if content is short enough to not need scrolling -> remove mask immediately
            if (bio.scrollHeight <= bio.clientHeight) {
                bio.classList.add('no-mask');
            }

            bio.addEventListener('scroll', () => {
                // If scrolled to bottom (allow 2px buffer)
                if (Math.ceil(bio.scrollTop + bio.clientHeight) >= bio.scrollHeight - 2) {
                    bio.classList.add('no-mask');
                } else {
                    bio.classList.remove('no-mask');
                }
            });
        });
    }
});
