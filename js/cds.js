document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('cds-container');

    if (!container) return;

    // Clear loading state
    container.innerHTML = '';

    cdsData.forEach(cd => {
        const article = document.createElement('article');
        article.className = 'cd-entry';

        // Conditional buttons
        let buttonsHtml = '';
        if (cd.spotifyLink) {
            buttonsHtml += `<a href="${cd.spotifyLink}" target="_blank" class="btn btn-sm">Listen on Spotify</a>`;
        }
        buttonsHtml += `<a href="contact.html" class="btn btn-sm btn-outline">Enquire for Copy</a>`;

        article.innerHTML = `
            <div class="cd-header">
                <span class="text-premium">${cd.subtitle}</span>
                <h3>${cd.title}</h3>
                <p class="cd-details text-sm text-muted" style="margin-top: 0.5rem; font-style: italic;">${cd.details}</p>
            </div>
            <div class="cd-body">
                <p class="cd-description">${cd.description}</p>
                <div class="cd-footer" style="display: flex; gap: 1rem; flex-wrap: wrap;">
                    ${buttonsHtml}
                </div>
            </div>
        `;

        container.appendChild(article);
    });
});
