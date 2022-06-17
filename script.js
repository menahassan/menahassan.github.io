API_KEY = "658568773162c3aaffcb3981d4f5587b"
const imageBaseUrl = 'https://image.tmdb.org/t/p'
let PAGE = 1
let currentMovie = "" 
var movieCardsEl = ""
BASE_URL = "https://api.themoviedb.org/3"


MOVIES_URL = BASE_URL + `/movie/popular?api_key=${API_KEY}&language=en-US&page=`
SEARCH_URL = BASE_URL + `/search/movie?api_key=${API_KEY}&query=`
var CURRENT_URL = MOVIES_URL
VIDEO_URL = `/videos?api_key=${API_KEY}&language=en-US`

const moviesGridEl = document.querySelector("#movies-grid")
const movieButtonEl = document.querySelector("#load-more-movies-btn")
const modal = document.querySelector(".modal");

const searchInputEl = document.getElementById("search-input")
const closeSearchEl = document.getElementById("close-search-btn")

/* 
"/movie/{movie_id}/videos"
iframes:
URL format: https://www.youtube.com/embed/VIDEO_ID

<iframe id="ytplayer" type="text/html" width="640" height="360"
  src="https://www.youtube.com/embed/M7lc1UVf-VE?autoplay=1&origin=http://example.com"
  frameborder="0"></iframe>
*/

async function getVideo(id){
    console.log("running")
    const response = await fetch(BASE_URL + `/movie/${id}${VIDEO_URL}`)
    const result = await response.json()
    console.log(result.results[0])
    return result.results[0].key
}

function closeModal(){
    modal.classList.toggle("show-modal");
}

function toggleModal(title, overview, video) {
    overview = overview.replace("&apos","'")
    modal.classList.toggle("show-modal");
    modal.innerHTML = `
    <div class="modal-content">
        <span class="close-button">&times;</span>
        <h1 class = "modal-title">${title}</h1>
        <div class = "ytplayer-container">
            <iframe id="ytplayer" type="text/html" width="640" height="360" src="https://www.youtube.com/embed/${video}" frameborder="0">
            </iframe>
        </div>
        <p class = "modal-overview">${overview}</p>
    </div>
    `
    const closeButton = document.querySelector(".close-button");
    closeButton.addEventListener("click", function(){closeModal()});
}

//create a movie card
async function listMovie(movie){
    var video = await getVideo(movie.id)
    console.log(video)
    
    //replace apostrophe so it doesn't throw an error
    var overview = movie.overview.replace("'","&apos")
    moviesGridEl.innerHTML = moviesGridEl.innerHTML + `
    <div class="movie-card">
        <p class="movie-title">${movie.title}</p>
        <a href="javascript:toggleModal('${movie.title}','${overview}', '${video}')">
            <img class="movie-poster" src="${imageBaseUrl}/w342${movie.poster_path}" alt="${movie.title}" title="${movie.title}"/>
        </a>
        <p class="movie-votes">Rating: ${movie.vote_average}</p>
    </div>
    `
}

//create a movie card for each movie
async function getResults(PAGE_URL){
    const response = await fetch(PAGE_URL)
    const result = await response.json()
    console.log("result: ",result.results)
    for(var i = 0; i < result.results.length; i++){
        listMovie(result.results[i])
    }
}

//load more movies if button is clicked
movieButtonEl.addEventListener('click', () => {
    PAGE += 1
    getResults(CURRENT_URL + PAGE)
})

//search
document.getElementById("search-form").addEventListener('submit', (event) => {
    event.preventDefault()
    PAGE = 1
    moviesGridEl.innerHTML = ""
    var QUERY = searchInputEl.value
    if(QUERY == ""){
        getResults(MOVIES_URL + PAGE)
    }
    else{
        var SEARCH = SEARCH_URL + `${QUERY}&page=${PAGE}`
        CURRENT_URL = SEARCH
        getResults(SEARCH)
        closeSearchEl.style.visibility = "visible"
    }
})

closeSearchEl.addEventListener('click', (event) => {
    event.preventDefault()
    PAGE = 1
    moviesGridEl.innerHTML = ""
    closeSearchEl.style.visibility = "hidden"
    getResults(MOVIES_URL + PAGE)
})


window.onload = function(){
    getResults(MOVIES_URL + PAGE)
}
