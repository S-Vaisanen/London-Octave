document.addEventListener('DOMContentLoaded', () => {
    const concertsContainer = document.getElementById('concerts-container');
    if (concertsContainer && typeof concertsData !== 'undefined') {
        renderConcerts(concertsData);
    } else {
        console.error('Concert container or data not found.');
    }

    function renderConcerts(data) {
        let html = '';

        // Upcoming Concerts Section
        if (data.upcoming && data.upcoming.length > 0) {
            html += `<section class="concerts-section upcoming-concerts">
                <h2 class="section-title text-center">Upcoming Concerts</h2>
                <div class="concerts-grid">`;

            html += data.upcoming.map(concert => createConcertCard(concert, true)).join('');

            html += `</div></section>`;
        }

        // Past Concerts Section
        if (data.past && data.past.length > 0) {
            html += `<section class="concerts-section past-concerts">
                <h2 class="section-title text-center">Past Concerts</h2>
                <div class="concerts-grid">`;

            html += data.past.map(concert => createConcertCard(concert, false)).join('');

            html += `</div></section>`;
        }

        concertsContainer.innerHTML = html;
    }

    function createConcertCard(concert, isUpcoming) {
        // Build Program List if it exists
        let programHtml = '';
        if (concert.program && Array.isArray(concert.program)) {
            programHtml = `<ul class="concert-program">
                ${concert.program.map(item => `<li>${item}</li>`).join('')}
            </ul>`;
        }

        // Build Ticket Button/Link if it exists
        let actionHtml = '';
        if (isUpcoming) {
            if (concert.ticketLink) {
                actionHtml = `<a href="${concert.ticketLink}" target="_blank" class="btn btn-primary">Book Tickets</a>`;
            } else if (concert.description && concert.description.toLowerCase().includes('no tickets')) {
                actionHtml = `<span class="ticket-status">No Tickets Required</span>`;
            }
        }

        return `
            <article class="concert-card ${isUpcoming ? 'upcoming' : 'past'}">
                <div class="concert-header">
                    <span class="concert-date">${concert.date}</span>
                    ${concert.time ? `<span class="concert-time">${concert.time}</span>` : ''}
                </div>
                <div class="concert-details">
                    <h3 class="concert-title">${concert.title}</h3>
                    <div class="concert-venue">
                        <span class="venue-name">${concert.venue}</span>
                        ${concert.address ? `<span class="venue-address">${concert.address}</span>` : ''}
                    </div>
                    
                    ${programHtml}
                    
                    ${concert.description && !concert.description.toLowerCase().includes('no tickets') ?
                `<p class="concert-description">${concert.description}</p>` : ''}
                    
                    ${concert.performers ? `<p class="concert-performers"><strong>Performers:</strong> ${concert.performers}</p>` : ''}
                </div>
                ${actionHtml ? `<div class="concert-actions">${actionHtml}</div>` : ''}
            </article>
        `;
    }
});
