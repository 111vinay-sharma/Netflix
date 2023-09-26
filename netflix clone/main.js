// main variables
const apiKey = 'a0698213d7282a56053e02a9251a46a1';
const youtubeApiKey = 'AIzaSyDetsepsCoHvwInh0ooID8f0e09sA-4hKc';
const apiEndpoint = 'https://api.themoviedb.org/3';
const imgPath = 'https://image.tmdb.org/t/p/original';
const apiPath = {
    fetchMoviescategories: `${apiEndpoint}/genre/movie/list?api_key=${apiKey}`,
    fetchMoviesList: (id) => `${apiEndpoint}/discover/movie?api_key=${apiKey}&with_genres=${id}`,
    fetchTrendingMovies: `${apiEndpoint}/trending/all/day?api_key=${apiKey}&language=en-US`,
    fetchTrailer: (query) => `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${youtubeApiKey}`
}

const init = () => {
    makingBannersecion(apiPath.fetchTrendingMovies);
    fatchAndBuildAllSection();
}

const makingBannersecion = (Banner_Movies) => {
    fetchAndBuldingMoviesSections(Banner_Movies, "Trending Now");
    fetch(Banner_Movies)
        .then(res => res.json())
        .then(data => {
            let Banner_movie = data.results;
            const Banner_sec = document.querySelector('.banner-section');
            const random_Movie = Math.round(Math.random() * Banner_movie.length);
            Banner_movie = data.results[random_Movie];
            const main_section = document.querySelector('.main_section');
            // main_section.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, .5), rgba(0, 0, 0, .4)), url(${imgPath}${Banner_movie.backdrop_path})`;

            // if (!Banner_movie.original_name) return;
            const div = document.createElement('div');
            div.classList.add('container');
            div.innerHTML =
                `
            <div class = 'banner_content'> 
    <h2 class="banner__title">${Banner_movie.title ||  Banner_movie.name}</h2>
    <p class="banner__info">Trending in movies | ${!Banner_movie.first_air_date + 'Release -' ? Banner_movie.popularity : Banner_movie.first_air_date}</p>
    <p class="banner__overview">${Banner_movie.overview && Banner_movie.overview.length > 200 ? Banner_movie.overview.slice(0, 200).trim() + '...' : Banner_movie.overview}</p>
    <div class="action-buttons-cont">
        <button class="action-button"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                xmlns="http://www.w3.org/2000/svg" class="Hawkins-Icon Hawkins-Icon-Standard">
                <path
                    d="M4 2.69127C4 1.93067 4.81547 1.44851 5.48192 1.81506L22.4069 11.1238C23.0977 11.5037 23.0977 12.4963 22.4069 12.8762L5.48192 22.1849C4.81546 22.5515 4 22.0693 4 21.3087V2.69127Z"
                    fill="currentColor"></path>
            </svg> &nbsp;&nbsp; Play</button>
        <button class="action-button"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                xmlns="http://www.w3.org/2000/svg" class="Hawkins-Icon Hawkins-Icon-Standard">
                <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3ZM1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM13 10V18H11V10H13ZM12 8.5C12.8284 8.5 13.5 7.82843 13.5 7C13.5 6.17157 12.8284 5.5 12 5.5C11.1716 5.5 10.5 6.17157 10.5 7C10.5 7.82843 11.1716 8.5 12 8.5Z"
                    fill="currentColor"></path>
            </svg> &nbsp;&nbsp; More Info</button>
    </div>
    </div>
    `
            Banner_sec.appendChild(div);
            gettingYoutubeTiser(Banner_movie.name || Banner_movie.title ,Banner_movie);
        });

}

const fatchAndBuildAllSection = () => {
    fetch(apiPath.fetchMoviescategories)
        .then(res => res.json())
        .then(data => {
            const moviesCategories = data.genres;
            if (Array.isArray(moviesCategories) && moviesCategories.length) {
                moviesCategories.forEach(singleMovieCategorie => {
                    fetchAndBuldingMoviesSections(apiPath.fetchMoviesList(singleMovieCategorie.id),
                        singleMovieCategorie.name);
                });
            }
        })
        .catch(err => console.error(err));
}

const fetchAndBuldingMoviesSections = (fetchURL, singleMovieCategorie) => {
    fetch(fetchURL)
        .then(res => res.json())
        .then(data => {
            const moviesSection = data.results;
            if (Array.isArray(moviesSection) && moviesSection.length) {
                buildMoviesSection(moviesSection, singleMovieCategorie)
            };
        });
}

const buildMoviesSection = (list, moviesSectionHeading) => {
    const GettingMoviesHtml = list.map((res) => {

        return `<div class="img_cont"><img src ="${imgPath}${res.backdrop_path}" onclick = "gettingYoutubeTiser('${res.title || res.name}')" ></div>  `;

    }).join('');
    // console.log(GettingMoviesHtml);
    // GettingMoviesHtml.splice(0,5)
    const movie_cont = document.querySelector('.movies_cont');
    const moviesHtml = `
    <h2 class = "sectionHeading">${moviesSectionHeading}</h2>
    <div class="movies_row">
          ${GettingMoviesHtml}>   
          <div>    
    </div>
    `
    const div = document.createElement('div');
    div.classList.add('movies_section');
    div.innerHTML = moviesHtml;
    movie_cont.appendChild(div);
}


const gettingYoutubeTiser = (youtubeTrailer , Banner_movie) => {
    fetch(apiPath.fetchTrailer(youtubeTrailer))
        .then(res => res.json())
        .then(data => {
            const youtubeData = data.items[0];
            const youtubeUrl = `https://www.youtube.com/watch?v=${youtubeData.id.videoId}`;
            window.open(youtubeUrl, '-blank');
            if(window.innerWidth < 500){
                const main_section = document.querySelector('.main_section');
                main_section.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, .5), rgba(0, 0, 0, .4)), url(${imgPath}${Banner_movie.backdrop_path})`;
                console.log('red');
            }
            else{
                const iframe = document.querySelector('.main_video');
                iframe.src = `https://www.youtube.com/embed/${youtubeData.id.videoId}?autoplay=1&mute=1&controls=0`;
                console.log('green');
            }
          
        })
    console.log(youtubeTrailer, Banner_movie);
}

window.addEventListener('load', () => {
    init();
})



// ==================== responsive nav bar =========================
const hamburger = document.querySelector('.hemburger');
hamburger.addEventListener('click',()=>{
    document.body.classList.toggle('res');
});

//  ===========making sticky nav bar===============

 const obsever = new IntersectionObserver((entries)=>{
    const entrie = entries[0];
 });