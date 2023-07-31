const url = 'https://www.omdbapi.com/?apikey=1f50d832'

const inputTxtEl = document.getElementById('input-txt')
const mainBodyEl = document.getElementById('main-body')
let imdbIDArray = []

const localStorageWatchlist = JSON.parse(localStorage.getItem("watchlistArray")) || []

document.addEventListener('DOMContentLoaded', () => {
    renderPage()
})

document.addEventListener('click', (e) => {
    if (e.target.id === 'input-btn'){
        e.preventDefault()
        showLoading()
        const inputValue = inputTxtEl.value
        searchMovie(inputValue)
        form.reset()
    }
    else if (e.target.dataset.add){
        let movieID = e.target.dataset.add
        if (localStorageWatchlist.includes(movieID)){
            alert("This movie is already in the watchlist")
        } else {
            localStorageWatchlist.push(movieID)
            localStorage.setItem("watchlistArray", JSON.stringify(localStorageWatchlist))
            document.querySelector(`[data-add=${movieID}`).style.color = 'yellow'
        }
    }
    else if (e.target.dataset.remove){
        let movieID = e.target.dataset.remove
        let index = localStorageWatchlist.indexOf(movieID)
        if (index >= 0){
            localStorageWatchlist.splice(index, 1)
            localStorage.setItem("watchlistArray", JSON.stringify(localStorageWatchlist))
            getWatchlist()
        }
    }
})

function searchMovie(searchValue) {
    if(searchValue) {
        fetch(`${url}&s=${searchValue}`)
        .then(res => res.json())
        .then(data => {
            if (data.Response === "False") {
                throw Error("Movie not Found!!")
            } else {
                const movieSearch = data.Search
                if (imdbIDArray.length > 0){
                    imdbIDArray = []
                }
                for (let movie of movieSearch){
                    imdbIDArray.push(movie.imdbID)
                }
                getMoviesHtml()
            }
        })
        .catch(err => {
            renderErrorMsg()
        })
    } else {
        renderSearchPageCover()
    }
}

async function getMoviesHtml() {
    mainBodyEl.innerHTML = ''
    for (let id of imdbIDArray) {
        const res = await fetch(`${url}&i=${id}`)
        const data = await res.json()
        const {Title, imdbID, Poster, imdbRating, Runtime, Genre, Type, Plot} = data
        let movieHtml = `
            <div class="movie-parent-container" id="${imdbID}">
                <div class="movie-container">
                    <img class="movie-poster" src="${Poster}"/>
                    <div class="movie-sub-container">
                        <h3>${Title} <span>⭐ ${imdbRating}</span></h3>
                        <div class="detail-container">
                            <div>
                                <p class="movie-details">
                                    <span>${Runtime}</span> 
                                    <span>${Genre}</span> 
                                    <span>${Type}</span>
                                </p>
                            </div>
                            <div>
                                <button id="add-btn" class="btn" data-add="${imdbID}">
                                    <i class="fa-solid fa-circle-plus" data-add="${imdbID}"></i>
                                    Watchlist
                                </button>
                            </div>
                        </div>
                        <div class="plot">
                            <p class="movie-plot">${Plot}</p>
                        </div>
                    </div>
                </div>
            </div>
        `
        mainBodyEl.innerHTML += movieHtml
    }
}

async function getWatchlist() {
    if (localStorageWatchlist.length > 0){
        showLoading()
        mainBodyEl.innerHTML = ''
        for (let movieID of localStorageWatchlist) {
            const res = await fetch(`${url}&i=${movieID}`)
            const data = await res.json()
            const {Title, imdbID, Poster, imdbRating, Runtime, Genre, Type, Plot} = data
            let movieHtml = `
                <div class="movie-parent-container" id="${imdbID}">
                    <div class="movie-container">
                        <img class="movie-poster" src="${Poster}"/>
                        <div class="movie-sub-container">
                            <h3>${Title} <span>⭐ ${imdbRating}</span></h3>
                            <div class="detail-container">
                                <p class="movie-details">
                                    <span>${Runtime}</span> 
                                    <span>${Genre}</span> 
                                    <span>${Type}</span>
                                </p>
                                <button id="add-remove" class="btn" data-remove="${imdbID}">
                                    <i class="fa-solid fa-circle-minus" data-remove="${imdbID}"></i>
                                    Watchlist
                                </button>
                            </div>
                            <div class="plot">
                                <p class="movie-plot">${Plot}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `
            mainBodyEl.innerHTML += movieHtml
        }
    } else {
        renderWatchlistPageCover()
    }
}

function renderSearchPageCover() {
    mainBodyEl.innerHTML = `
        <div class="temp-container">
            <div id="body-placeholder" class="body-placeholder">
                <img class="body-icon-img" src="img/movie-icon.png"/>
                <p>Start exploring</p>
            </div>
        </div>
    `
}

function renderWatchlistPageCover() {
    mainBodyEl.innerHTML = `
        <div class="temp-container">
            <div class="body-placeholder">
                <p>Your watchlist is looking a little empty...</p>
                <p id="body-placeholder-watchlist-p"><a href="index.html">
                    <span>
                        <i class="fa-solid fa-circle-plus"></i>
                    </span>
                    Let's add some movies!
                    </a>
                </p>
            </div>
        </div>
    `
}

function renderErrorMsg() {
    mainBodyEl.innerHTML = `
        <div class="temp-container">
            <div class="error-msg">
                Unable to find what you’re looking for. Please try another search.
            </div>
        </div>
    `
}

function renderPage() {
    let page = document.body.id
    switch (page) {
        case "search":
            searchMovie()
            break
        case "watchlist":
            getWatchlist()
            break
    }
}

function showLoading() {
    let h3 = document.createElement("h3")
    h3.textContent = "Loading..."
    h3.className = "loading"
    mainBodyEl.prepend(h3)
}