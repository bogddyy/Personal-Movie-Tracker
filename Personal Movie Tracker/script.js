// Așteaptă până se încarcă pagina
window.onload = () => {
  loadMovies();
  document
    .getElementById("movieSearchForm")
    .addEventListener("submit", searchMovie);
  document.getElementById("movieForm").addEventListener("submit", addMovie);
  document.getElementById("toggleView").addEventListener("click", toggleView);
};

// Lista de filme (va fi stocată în localStorage)
let movies = [];

// Funcția pentru a căuta filmul folosind API
async function searchMovie(event) {
  event.preventDefault();

  const movieSearchName = document.getElementById("movieSearchName").value;
  const apiKey = "fced3ba8";
  const url = `https://www.omdbapi.com/?t=${encodeURIComponent(
    movieSearchName
  )}&apikey=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.Response === "True") {
      const movie = {
        name: data.Title,
        description: data.Plot,
        image: data.Poster,
        year: data.Year,
        rating: data.imdbRating,
        addedDate: new Date().toLocaleString(),
      };

      // Adaugă filmul căutat la lista de filme
      movies.push(movie);
      localStorage.setItem("movies", JSON.stringify(movies));
      renderMovies();
      document.getElementById("movieSearchForm").reset();
    } else {
      alert("Film nu a fost găsit!");
    }
  } catch (error) {
    console.error("Eroare la obținerea datelor despre film:", error);
    alert("A apărut o eroare. Te rugăm să încerci din nou.");
  }
}

// Funcția pentru a adăuga un film manual
function addMovie(event) {
  event.preventDefault();

  const name = document.getElementById("movieName").value;
  const description = document.getElementById("movieDescription").value;
  const image = document.getElementById("movieImage").value;
  const year = parseInt(document.getElementById("movieYear").value);
  const rating = parseFloat(document.getElementById("movieRating").value);
  const addedDate = new Date().toLocaleString();

  const movie = { name, description, image, year, rating, addedDate };
  movies.push(movie);
  localStorage.setItem("movies", JSON.stringify(movies));
  renderMovies();
  resetForms();
}

// Funcția pentru a reseta formularele
function resetForms() {
  document.getElementById("movieForm").reset();
  document.getElementById("movieSearchForm").reset();
}

// Funcția pentru a încărca filmele din localStorage
function loadMovies() {
  const storedMovies = localStorage.getItem("movies");
  if (storedMovies) {
    movies = JSON.parse(storedMovies);
    renderMovies();
  } else {
    // Filme prepopulate
    movies = [
      {
        name: "The Shawshank Redemption",
        description:
          "Two men form a friendship over the years while serving their time in prison",
        image:
          "https://upload.wikimedia.org/wikipedia/en/8/81/ShawshankRedemptionMoviePoster.jpg",
        year: 1994,
        rating: 9.3,
        addedDate: new Date().toLocaleString(),
      },
      {
        name: "The Godfather",
        description:
          "The story of Vito Corleone, the head of an influential mafia family in America.",
        image:
          "https://upload.wikimedia.org/wikipedia/en/1/1c/Godfather_ver1.jpg",
        year: 1972,
        rating: 9.2,
        addedDate: new Date().toLocaleString(),
      },
      {
        name: "Spider-Man",
        description:
          "A young man with special powers uses his abilities to protect New York City from criminals and supernatural threats.",
        image:
          "https://m.media-amazon.com/images/M/MV5BZWM0OWVmNTEtNWVkOS00MzgyLTkyMzgtMmE2ZTZiNjY4MmFiXkEyXkFqcGc@._V1_SX300.jpg",
        year: 2002,
        rating: 7.3,
        addedDate: new Date().toLocaleString(),
      },
    ];

    localStorage.setItem("movies", JSON.stringify(movies));
    renderMovies();
  }
}

// Funcția pentru a reda filmele în listă/tabel
function renderMovies() {
  const moviesListUl = document.getElementById("moviesListUl");
  const moviesListTable = document.getElementById("moviesList");

  moviesListUl.innerHTML = "";
  moviesListTable.innerHTML = "";

  movies.forEach((movie) => {
    // Afisare în tabel
    const row = `<tr>
              <td>${movie.name}</td>
              <td>${movie.description}</td>
              <td><img src="${movie.image}" alt="${movie.name}" width="50"></td>
              <td>${movie.year}</td>
              <td>${movie.rating}</td>
              <td>${calculateTimeAgo(movie.addedDate)}</td>
          </tr>`;
    moviesListTable.innerHTML += row;

    // Afisare în listă
    const li = `<li>
              <strong>${movie.name}</strong> - ${movie.description} <br>
              <img src="${movie.image}" alt="${movie.name}" width="50"> <br>
              An: ${movie.year}, Rating: ${
      movie.rating
    }, Adăugat: ${calculateTimeAgo(movie.addedDate)}
          </li>`;
    moviesListUl.innerHTML += li;
  });
}

// Funcția pentru a calcula timpul de la adăugare
function calculateTimeAgo(dateString) {
  const now = new Date();
  const addedDate = new Date(dateString);
  const seconds = Math.floor((now - addedDate) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return `${seconds} sec.`;
  if (minutes < 60) return `${minutes} min.`;
  if (hours < 24) return `${hours} ore.`;
  return `${days} zile.`;
}

// Funcție pentru comutarea între modurile de vizualizare
function toggleView() {
  const moviesListUl = document.getElementById("moviesListUl");
  const moviesListTable = document.getElementById("moviesList");

  if (moviesListUl.classList.contains("hidden")) {
    moviesListUl.classList.remove("hidden");
    moviesListTable.classList.add("hidden");
  } else {
    moviesListUl.classList.add("hidden");
    moviesListTable.classList.remove("hidden");
  }
}

// Inițial ascundem lista si afisam tabela
document.getElementById("moviesListUl").classList.add("hidden");
