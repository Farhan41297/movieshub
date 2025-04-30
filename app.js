// Debug function
function debug(message) {
    console.log(message);
}

// Initialize variables
document.addEventListener('DOMContentLoaded', function() {
    debug('DOM Content Loaded');
    
    try {
        let left_btn = document.getElementsByClassName('bi-chevron-left')[0];
        let right_btn = document.getElementsByClassName('bi-chevron-right')[0];
        let cards = document.getElementsByClassName('cards')[0];
        let search = document.getElementsByClassName('search')[0];
        let search_input = document.getElementById('search_input');

        debug('Elements initialized');

        // Add event listeners for scroll buttons
        if (left_btn && right_btn && cards) {
            left_btn.addEventListener('click', () => {
                cards.scrollLeft -= 400;
            });

            right_btn.addEventListener('click', () => {
                cards.scrollLeft += 400;
            });
            debug('Scroll buttons initialized');
        }

        // Load movie data
        let json_url = "movie.json";
        debug('Fetching movie data from: ' + json_url);

        fetch(json_url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                debug('Movie data loaded successfully');
                console.log('Loaded data:', data);

                // Load featured movie
                if (data && data.length > 0) {
                    const featuredMovie = data[0];
                    const titleElement = document.getElementById('title');
                    const genElement = document.getElementById('gen');
                    const rateElement = document.getElementById('rate');

                    if (titleElement) titleElement.innerText = featuredMovie.name;
                    if (genElement) genElement.innerText = featuredMovie.gener;
                    if (rateElement) rateElement.innerHTML = `<span>IMDB</span><i class="bi bi-star-fill"></i> ${featuredMovie.imdb}`;
                    debug('Featured movie loaded');
                }

                // Load movie cards
                if (cards) {
                    data.forEach((movie, index) => {
                        const { name, imdb, date, sposter, bposter, gener, url } = movie;
                        const movieCard = document.createElement('div');
                        movieCard.className = 'movie-list-item';
                        movieCard.innerHTML = `
                            <img class="movie-list-item-img" src="${sposter}" alt="${name}">
                            <div class="rest-card">
                                <img src="${bposter}" alt="${name}">
                                <div class="movie-list-item-title">
                                    <h4>${name}</h4>
                                    <div class="sub">
                                        <p>${gener}, ${date}</p>
                                        <h3><span>IMDB</span><i class="bi bi-star-fill"></i> ${imdb}</h3>
                                    </div>
                                </div>
                            </div>
                        `;
                        cards.appendChild(movieCard);
                    });
                    debug('Movie cards loaded');
                }

                // Setup search functionality
                if (search_input && search) {
                    search_input.addEventListener('input', (e) => {
                        const searchTerm = e.target.value.toLowerCase();
                        const movieCards = document.querySelectorAll('.movie-list-item');
                        
                        movieCards.forEach(card => {
                            const title = card.querySelector('h4').textContent.toLowerCase();
                            if (title.includes(searchTerm)) {
                                card.style.display = 'block';
                            } else {
                                card.style.display = 'none';
                            }
                        });
                    });
                    debug('Search functionality initialized');
                }
            })
            .catch(error => {
                console.error('Error loading movie data:', error);
                debug('Error loading movie data: ' + error.message);
            });

        // Modal functionality
        const modal = document.getElementById('movieModal');
        const closeBtn = document.querySelector('.close');

        // Get all movie list items
        const movieItems = document.querySelectorAll('.movie-list-item');

        // Add click event to each movie item
        movieItems.forEach(item => {
            item.addEventListener('click', function() {
                const poster = this.querySelector('.movie-list-item-img').src;
                const title = this.querySelector('h4').textContent;
                const genre = this.querySelector('.sub p').textContent.split(',')[0];
                const year = this.querySelector('.sub p').textContent.split(',')[1].trim();
                const rating = this.querySelector('.sub h3').textContent;
                const trailerInput = this.querySelector('.sub input')?.value;

                // Set modal content
                document.getElementById('trailerLink').value = trailerInput;
                document.getElementById('modalPoster').src = poster;
                document.getElementById('modalTitle').textContent = title;
                document.getElementById('modalGenre').textContent = genre;
                document.getElementById('modalYear').textContent = year;
                document.getElementById('modalRating').textContent = rating;


                // Show modal
                modal.style.display = 'block';
            });
        });

        // Close modal when clicking the close button
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                modal.style.display = 'none';
            });
        }

        // Close modal when clicking outside the modal
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });

        // Handle download and watch buttons
        document.getElementById('modalDownload')?.addEventListener('click', function() {
            alert('Download functionality will be implemented soon!');
        });

        document.getElementById('modalWatch')?.addEventListener('click', function() {
            // Get the video URL from the hidden input field
            const trailerInput = document.getElementById('trailerLink');
            const trailerUrl = trailerInput?.value;
            console.log(trailerUrl);
            if (trailerUrl) {
                // Open the trailer in a new window or embed it in a modal
                window.open(trailerUrl, '_blank');
            } else {
                alert('Trailer link not found!');
            }
        });
        

        // Handle comment button
        document.getElementById('modalComment')?.addEventListener('click', function() {
            const commentSection = document.getElementById('commentSection');
            commentSection.style.display = commentSection.style.display === 'none' ? 'block' : 'none';
        });

        // Handle comment submission
        document.getElementById('submitComment')?.addEventListener('click', function() {
            const commentText = document.getElementById('commentText').value.trim();
            if (commentText) {
                const commentsList = document.getElementById('commentsList');
                const commentDiv = document.createElement('div');
                commentDiv.className = 'comment';
                
                const now = new Date();
                const dateString = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
                
                commentDiv.innerHTML = `
                    <div class="comment-header">
                        <span>Anonymous User</span>
                        <span>${dateString}</span>
                    </div>
                    <div class="comment-content">${commentText}</div>
                `;
                
                commentsList.appendChild(commentDiv);
                document.getElementById('commentText').value = '';
                
                // Scroll to the new comment
                commentDiv.scrollIntoView({ behavior: 'smooth' });
            }
        });

        // Initialize comment section as hidden
        const commentSection = document.getElementById('commentSection');
        if (commentSection) {
            commentSection.style.display = 'none';
        }

        debug('All event listeners initialized');
    } catch (error) {
        console.error('Error in initialization:', error);
        debug('Error in initialization: ' + error.message);
    }
});
