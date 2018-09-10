let favMoviesArr = [];
let moviesArr = [];
// get movie list
function getMovies() {
	let html = '';
	return fetch('http://localhost:3000/movies')
	.then(response => {
		if(response.ok) {
			return Promise.resolve(response.json());
		}
		return Promise.reject(new Error(`Error: ${response}`));
	})
	.then(movies => {
		// build movies cards to be displayed
		movies.forEach(movie => {
			html = html +
			`<div class="card">
				<img class="card-img-top" src="${movie.posterPath}"/>
				<div class="card-body">
					<h5 class="card-title">${movie.title}!</h5>
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
		return new Error(`Error: ${error}`);
	});
}
// get favourite movie list
function getFavourites() {
	return fetch('http://localhost:3000/favourites')
	.then(response => {
		if(response.ok) {
			return Promise.resolve(response.json());
		}
		return Promise.reject(new Error(`Error: ${response}`));
	})
	.then(favourites => {
		let html = '';
		favMoviesArr = favourites;
		// build movies cards to be displayed
		favMoviesArr.forEach(favourite => {
			html = html +
			`<div class="card">
				<img class="card-img-top" src="${favourite.posterPath}"/>
				<div class="card-body">
					<h5 class="card-title">${favourite.title}!</h5>
				</div>
			</div>`;
		});
		let favMoviesElm = document.getElementById('favouritesList');
		favMoviesElm.innerHTML = html;
		return favourites;
	})
	.catch(error => {
		return new Error(`Error: ${error}`);
	});
}
function addFavourite(id) {
	// get validity of the movie id
	let movie = moviesArr[0].filter(item => item.id === id);
	let html = '';
	// get duplicate of favourite  list
	let favMovie = favMoviesArr.filter(item => item.id === id);
	// error check - duplicate entry to favourite list
	if (favMovie.length > 0) {
		throw new Error('Movie is already added to favourites');
	}
	// error check -  invalid movie id
	if (movie.length === 0) {
		throw new Error('Invalid movie selected');
	}
	// add to favourite list
	let promise = new Promise((resolve, reject) => {
		fetch('http://localhost:3000/favourites', {
			method: 'POST',
			body: JSON.stringify(movie[0]),
			headers: { 'content-type': 'application/json' }
		})
		.then(res => res.json())
		.then((data) => {
			// refresh favourite list
			favMoviesArr.push(data);
			favMoviesArr.forEach(favourite => {
				html = html +
				`<div class="card">
					<img class="card-img-top" src="${favourite.posterPath}"/>
					<div class="card-body">
						<h5 class="card-title">${favourite.title}!</h5>
					</div>
				</div>`;
			});
			document.getElementById('favouritesList').innerHTML = html;
			resolve(favMoviesArr);
		})
		.catch((error) => {
			reject(new Error(error));
		});
	});
	return promise;
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


