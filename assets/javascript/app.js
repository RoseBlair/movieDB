// Initialize Firebase
var config = {
    apiKey: "AIzaSyAcgdpSSSobcgp2hFf1wSu9yNf8Roe6WIQ",
    authDomain: "moviedb-db817.firebaseapp.com",
    databaseURL: "https://moviedb-db817.firebaseio.com",
    projectId: "moviedb-db817",
    storageBucket: "moviedb-db817.appspot.com",
    messagingSenderId: "817296084015"
  };

  firebase.initializeApp(config);
 
//BEGIN JS CODE FOR APP BELOW THIS POINT
var $movieSearch = $("#movieSearch"),
    $movieCollection = $("#movieCollection"),
    tmdb = {
      searchUrl: "https://api.themoviedb.org/3/search/movie",
      imageUrl: "https://image.tmdb.org/t/p/w500",
      idUrl: "https://api.themoviedb.org/3/movie/",
      apiKey: "?api_key=951021584287e01bb1ba8473989df6da",
      lang: "&language=en-US"
    },
    db = firebase.database(),
    movies = [];

//Adds movie data to database
function addMovieToDb(movieID, movieTitle) {
  //clear array before update
  movies = [];

  //push entry to db
  db.ref().push({
    id: parseInt(movieID),
    title: movieTitle.trim().toLowerCase()
  });
}

//Removes movie entry from database
function removeFromDB(key) {
  //clear array before update
  movies = [];

  //remove entry from db
  db.ref().child(key).remove();
}

function searchMovie(title) {
  //create request url
  var url = [tmdb.searchUrl, tmdb.apiKey, tmdb.lang, "&query=", title].join("");

  $.ajax({
    url: url,
    method: "GET"
  }).then(function (resp) {
    //pass response into display function
    displayMovieSearch(resp.results);
  }).catch(function (error) {
    //catch error message
    console.log(`Error: ${error}`);
  });
}

function ajaxParallelCalls() {
  //empty array for calls
  var ajaxCalls = [];

  //loop through the movies in the collection
  for(var i = 0; i < movies.length; i++) {
    var url = [tmdb.idUrl, movies[i].id, tmdb.apiKey, tmdb.lang].join(""),
        call;

    //assign ajax call to array
    //add an anonymous function enclosure to create a new level of scope to pass the url through
    call = (function (url) {
      return function(callback) {
        $.ajax({
          url: url,
          method: "GET"
        }).then(function(resp) {
          callback(null, resp);
        }).catch(function(err) {
          callback(err, null);
        });
      };
    }(url));

    ajaxCalls.push(call);
  }

  //run all ajax calls in parallel of each other
  async.parallel(ajaxCalls, function(err, resp) {
    //if error was thown, log it
    if (err !== null) {
      console.log(`Async Error: ${err}`);
    } else {
      displayCollection(resp);
    }
  });
}

function displayCollection(resp) {  
  //clear DOM
  $movieCollection.empty();

  resp.sort(function sortAlphaByTitle(movieA, movieB) {
    movieA = movieA.title.replace(/^the /gi, "");
    movieB = movieB.title.replace(/^the /gi, "");

    if (movieA < movieB) {
      return -1;
    } else if (movieA > movieB) {
      return 1;
    } else {
      return 0;
    }
  });

  //display results
  for (var i = 0; i < resp.length; i++) {
    var currMovie = resp[i];

    //if movie poster exists...
    if (currMovie.poster_path) {
      var src = [tmdb.imageUrl, currMovie.poster_path].join(""),
          newDiv = $("<div>"),
          detailsDiv = $("<div>"),
          movie = $("<img>"),
          genre = $("<p>"),
          genreList = [],
          plot = $("<p>"),
          btn = $("<btn>"),
          rowDiv;
      
      //add attributes to movie poster
      movie.attr({
          "src": src,
          "alt": currMovie.title
      }).addClass("movieImg");

      //Loop though genres
      for (var x = 0; x < currMovie.genres.length; x++) {
        genreList.push(currMovie.genres[x].name);
      }

      //join genres together into list
      genre.text(genreList.sort().join(", "));

      //get movie plot
      plot.text(currMovie.overview).addClass("plot");
      
      //loop through local array to find firebase key
      for (var y = 0; y < movies.length; y++) {
        if (movies[y].id === currMovie.id) {
          btn.attr("data-key", movies[y].key);
          //exit loop
          break;
        }
      }
      
      //Add classes and text to button
      btn.addClass("btn btn-danger rmLib").html("&#10008; Remove from Library");

      //append into div
      detailsDiv.addClass("movieDetails").append(genre, plot);
      newDiv.append(movie, detailsDiv, btn).addClass("col-lg-4 movieDiv");

      //creates a new row div if the element is the 1st, 4th, etc.
      if (i % 3 === 0) {
        rowDiv = $("<div>").addClass("row");
      }
      
      //add movie to row
      rowDiv.append(newDiv);

      //append row to DOM
      $movieCollection.append(rowDiv);
    }
  }
}

function displayMovieSearch(resp) {
  var resultLimit;

  //clear DOM
  $movieSearch.empty();

  //limit results to 10 or max of returned, if less than 10 results
  if (resp.length > 10) {
    resultLimit = 10;
  } else {
    resultLimit = resp.length;
  }

  //loop through results and appends movie poster to DOM
  for (var i = 0; i < resultLimit; i++) {
    var currResp = resp[i],
        src = [tmdb.imageUrl, currResp.poster_path].join(""),
        inDatabase = false;
    
    //if movie poster exists...
    if (currResp.poster_path) {
      var newDiv = $("<div>"),
          movie = $("<img>"),
          btn = $("<btn>"),
          rowDiv;
      
      //add attributes to movie poster
      movie.attr({
          "src": src,
          "alt": currResp.title,
      }).addClass("movieImg");

      //loops through local array of movies to determine if movie exists
      for (var x= 0; x < movies.length; x++) {
        if (movies[x].id === currResp.id) {
          inDatabase = true;
          //exit for loop
          break;
        }
      }

      //change button if the movie already in database
      if (inDatabase === false) {
        //movie not in collection
        btn.attr({
            "data-id": currResp.id,
            "data-title": currResp.title
          }).text("Add to Library").addClass("btn btn-primary addLib");
      } else {
        //movie in collection
        btn.html("&#10008; Already in Library").addClass("btn btn-secondary addLib disabled");
      }

      //append movie poster and btn to div
      newDiv.append(movie, btn).addClass("col-lg-4 movieDiv");

      //creates a new row div if the element is the 1st, 4th, etc.
      if (i % 3 === 0) {
        rowDiv = $("<div>").addClass("row searchRow");
      }
      
      //add movie to row
      rowDiv.append(newDiv);

      //append row to DOM
      $movieSearch.append(rowDiv);
    }
  }
}

//event listener for "Add to Library" btn
$(document).on("click", ".addLib", function() {
  var btn = $(this),
      id = btn.attr("data-id"),
      title = btn.attr("data-title");

    //if the button hasn't been disabled...
    if (!btn.hasClass("disabled")) {
      addMovieToDb(id, title);

      //disable button and change text
      btn.html("&#10004; Added to Library").addClass("disabled btn-secondary").removeClass("btn-primary");
    }
});

//event listener for "Remove from Library" btn
$(document).on("click", ".rmLib", function() {
  var key = $(this).attr("data-key");

  //remove entry from db
  removeFromDB(key);
});

//when movies are added or removed from the database or when the page first loads, create/update the local array
db.ref().on("value", function(snapshot) {
  var dbVal = snapshot.val(),
      dbKeys;

  if (dbVal !== null) {
    //get keys
    dbKeys = Object.keys(dbVal);

    //loop through data
    for (var i = 0; i < dbKeys.length; i++) {
      var newMovie = {
            key: dbKeys[i],
            id: dbVal[dbKeys[i]].id
          };

      //push object into local array
      movies.push(newMovie);
    }

    //create ajax calls for existing collection
    ajaxParallelCalls();
  } else {
    //there are no movies to display
    var header = $("<h3>"),
        msg = $("<p>");

    header.text("No Movies in Collection").addClass("noMovieMsg");
    msg.text("Begin adding movies by searching for titles below.").addClass("noMovieMsg");

    $movieCollection.append(header, msg);
  }
}, function(error) {
  //catch error message
  console.log(`Error: ${error}`);
});

//event listener for movie search button
$("#searchMovie").on("click", function() {
  //prevent page from refreshing
  event.preventDefault();

  //get user input
  var title = $("#titleInput").val().trim().toLowerCase();

  //pass title into search function
  searchMovie(title);
});