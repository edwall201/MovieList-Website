// 所有電影資料   https://movie-list.alphacamp.io/api/v1/movies/
// 特定電影資料   https://movie-list.alphacamp.io/api/v1/movies/1
// 圖片網址前半段  http://movie-list.alphacamp.io/posters/

/* 
<div class="col">
  <div class="card">
    <img src="" class="card-img-top" alt="" />
    <div class="card-body">
      <h5 class="card-title">Card title</h5>
      <p class="card-text">
      </p>
    </div>
  </div>
</div> 
*/

/*
<div class="modal-header">
  <h5 class="modal-title" id="movieInfoLabel">Modal title</h5>
  <button
    type="button"
    class="btn-close"
    data-bs-dismiss="modal"
    aria-label="Close"
  ></button>
</div>
<div class="modal-body">...</div>
*/

// naming data atrribute
// data-*(使用者自定義)
// example
/*
  data-my-data

  dataset.myData

*/

// accessing data attribute
// HTMLELEMENT(queryselector,父層去觸發).dataset.(使用者自定義名稱「camelCase」)

// matches
// HTMLELEMENT.matches() css選取器比對(id,class,attribute)

const MOVIE_URL = 'https://movie-list.alphacamp.io/api/v1/movies/';
const POSTER_IMG_URL_PREFIX = 'http://movie-list.alphacamp.io/posters/';
const moviesElement = document.querySelector('.movies');
const modalContentEl = document.querySelector('.modal-content');

let movieDataset = [];

const movieInfoModal = new bootstrap.Modal(
  document.querySelector('#movieInfo'),
  {
    backdrop: true,
    keyboard: true,
    focus: true
  }
);

const getMovieList = async (movieId = '') => {
  try {
    return await axios.get(`${MOVIE_URL}${movieId}`);
  } catch (error) {
    console.log(error);
  }
};

async function initial() {
  const response = await getMovieList();
  movieDataset = response.data.results;
  const favoriteMovieId = JSON.parse(localStorage.getItem('favorite')) || []  ;
  const filteredMovies = filteredFatoriteMovies(movieDataset,favoriteMovieId);
  displayCards(movieDataset);
  moviesElement.addEventListener('click', async (event) => {
    if (event.target.matches('.moreButton')) {
      const movieId = event.target.dataset.movieId;
      const targetMovie = await getMovieList(movieId);
      const movieInfo = targetMovie.data.results;
      let characters = '';
      movieInfo.cast.forEach((character) => {
        characters += `
          <li>${character.character} - ${character.name}</li>
        `;
      });
      modalContentEl.innerHTML = `
      <div class="modal-header">
        <h5 class="modal-title" id="movieInfoLabel">${movieInfo.title}</h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>
      <div class="modal-body">
        <div class="row">
          <div class="col-12 d-flex justify-content-center">
            <img class="modal-image shadow" src="${POSTER_IMG_URL_PREFIX}${movieInfo.image}" alt="movie-image">
          </div>
          <div class="col-12 mt-3">
            <ul class="list-group list-group-flush">
              <li class="list-group-item">
                <h6 class="fw-bold">Description</h6>
                <p>${movieInfo.description}</p>
              </li>
              <li class="list-group-item"><span class="fw-bold">Director: </span>${movieInfo.director}</li>
              <li class="list-group-item">
                <h6 class="fw-bold">Cast</h6>
                <ul>
                  ${characters}
                </ul>
              </li>
              <li class="list-group-item"><span class="fw-bold">Release Date: </span>${movieInfo.release_date}</li>
            </ul>
          </div>
        </div>
      </div>
      `;
      movieInfoModal.show();
    }
  });
}

/**
 *
 * @param {Array} movieData
 */
function displayCards(movieData) {
  let moviesHTMLContent = '';
  if (movieData.length === 0) {
    moviesElement.innerHTML = `
    <div class="col-12 text-center">
      <h5>No favoriye movie</h5>
    </div>
    `;
    return;
  }

  movieData.forEach((movie) => {
    moviesHTMLContent += `
    <div class="col">
      <div class="card shadow">
        <img src="${POSTER_IMG_URL_PREFIX}${movie.image}" class="card-img-top poster-image" alt="movie-image" />
        <div class="card-body">
          <h5 class="card-title">${movie.title}</h5>
          <p class="card-text">
            <button class="btn btn-primary rounded-pill moreButton" data-movie-id="${movie.id}">More</button>
          </p>
        </div>
      </div>
    </div> 
    `;
  });
  moviesElement.innerHTML = moviesHTMLContent;
}

function filteredFatoriteMovies(movieDataset,favoriteMovieIdArray){
  if (favoriteMovieIdArray.length === 0){
    return [];
  }
  const transferToNumber = favoriteMovieIdArray.map((id) => Number(id));
  console.log(transferToNumber)
  return movieDataset.filter((movie) =>{
    return transferToNumber.includes(movie.id);
    
  });

}

initial();
