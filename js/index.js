document.addEventListener('DOMContentLoaded', () => {
    const introTitle = document.getElementById('intro-title');
    const introLead = document.getElementById('intro-lead');

    if (!introTitle || !introLead) {
        return;
    }

    if (typeof indexContent === 'undefined') {
        console.error('Index content data not found.');
        return;
    }

    if (indexContent.introTitle) {
        introTitle.innerHTML = indexContent.introTitle;
    }

    if (indexContent.introLead) {
        introLead.textContent = indexContent.introLead;
    }
});
