let favMoviesArr = [];
let moviesArr = [];
function populateFavMovies() {
	let html = '';
	favMoviesArr.forEach(favourite => {
		html = html +
		`<div class="card">
			<img class="card-img-top" src="${favourite.posterPath}"/>
			<div class="card-body">
				<h5 class="card-title">${favourite.title}!</h5>
				<p class="card-text">${favourite.overview}</p>
			</div>
		</div>`;
	});
	let favMoviesElm = document.getElementById('favouritesList');
	favMoviesElm.innerHTML = html;
}
function getMovies() {
	let html = '';
	return fetch('http://localhost:3000/movies')
	.then(response => {
		if(response.status === 200) {
			return response.json();
		}
		let modal = document.getElementById('errorModal');
		let errorMsg = document.getElementById('errorMsg');
		errorMsg.innerText = `Error while fetching movies: ${response.statusText}`;
		modal.style.display = 'block';
		return Promise.reject(new Error(`Error: ${response}`));
	})
	.then(movies => {
		movies.forEach(movie => {
			html = html +
			`<div class="card">
				<img class="card-img-top" src="${movie.posterPath}"/>
				<div class="card-body">
					<h5 class="card-title">${movie.title}!</h5>
					<p class="card-text">${movie.overview}</p>
					<a href="#" class="btn btn-primary" onclick="addFavourite(${movie.id})">
						Add to Favourite
					</a>
				</div>
			</div>`;
		});
		moviesArr.push(movies);
		let moviesElm = document.getElementById('moviesList');
		moviesElm.innerHTML = html;
		return movies;
	}).catch(error => {
		let modal = document.getElementById('errorModal');
		let errorMsg = document.getElementById('errorMsg');
		errorMsg.innerText = 'Error occurred while populating movie list';
		modal.style.display = 'block';
		return new Error(`Error: ${error}`);
	});
}
function getFavourites() {
	return fetch('http://localhost:3000/favourites')
	.then(response => {
		if(response.status === 200) {
			return response.json();
		}
		let modal = document.getElementById('errorModal');
		let errorMsg = document.getElementById('errorMsg');
		errorMsg.innerText = `Error while fetching favourites list: ${response.statusText}`;
		modal.style.display = 'block';
		return Promise.reject(new Error(`Error: ${response}`));
	})
	.then(favourites => {
		favMoviesArr = favourites;
		populateFavMovies();
		return favourites;
	})
	.catch(error => {
		let modal = document.getElementById('errorModal');
		let errorMsg = document.getElementById('errorMsg');
		errorMsg.innerText = 'Error occurred while populating favourite list';
		modal.style.display = 'block';
		return new Error(`Error: ${error}`);
	});
}
function addFavourite(id) {
	const addedMovies = favMoviesArr.filter(movie => movie.id === id);
	if(Array.isArray(addedMovies) && addedMovies.length) {
		let modal = document.getElementById('errorModal');
		let errorMsg = document.getElementById('errorMsg');
		errorMsg.innerText = 'Already added to favourite list';
		modal.style.display = 'block';
		throw new Error('Already added in favourites');
	}
	else{
		const movies = moviesArr[0].filter(movie => movie.id === id);
		favMoviesArr.push(movies[0]);
		return fetch('http://localhost:3000/favourites', {
			method: 'post',
			body: JSON.stringify(movies[0]),
			headers: {
				'content-type': 'application/json'
			}
		})
		.then(response => {
			if(response.status >= 201 && response.status < 300) {
				return response.json();
			}
			let modal = document.getElementById('errorModal');
			let errorMsg = document.getElementById('errorMsg');
			errorMsg.innerText = `Error while adding to favourite list: ${response.statusText}`;
			modal.style.display = 'block';
			return Promise.reject(new Error(`Error: ${response}`));
		})
		.then(() => {
			populateFavMovies();
			return favMoviesArr;
		})
		.catch(error => {
			let modal = document.getElementById('errorModal');
			let errorMsg = document.getElementById('errorMsg');
			errorMsg.innerText = 'Error occurred while populating favourite list';
			modal.style.display = 'block';
			return Promise.reject(error);
		});
	}
}

module.exports = {
	getMovies,
	getFavourites,
	addFavourite
};

// You will get error - Uncaught ReferenceError: module is not defined
// while running this script on browser which you shall ignore
// as this is required for testing purposes and shall not hinder
// it's normal execution


