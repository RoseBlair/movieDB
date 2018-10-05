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
    movieIDs;

//Adds movie data to database
function addMovieToDb(movieID, movieTitle) {
  db.ref().push({
    id: parseInt(movieID),
    title: movieTitle.trim().toLowerCase()
  });
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

function displayCollection() {
  //clear DOM
  $movieCollection.empty();

  //loops through each movie in db
  for (var i = 0; i < movieIDs.length; i++) {
    var url = [tmdb.idUrl, movieIDs[i], tmdb.apiKey, tmdb.lang].join("");

    $.ajax({
      url: url,
      method: "GET"
    }).then(function (resp) {        
      //if movie poster exists...
      if (resp.poster_path) {
        var src = [tmdb.imageUrl, resp.poster_path].join(""),
            newDiv = $("<div>"),
            detailsDiv = $("<div>"),
            movie = $("<img>"),
            genre = $("<p>"),
            genreList = [],
            plot = $("<p>"),
            removeBtn = $("<btn>");
        
        //add attributes to movie poster
        movie.attr({
            "src": src,
            "alt": resp.title,
        });

        //Loop though genres
        for (var x = 0; x < resp.genres.length; x++) {
          genreList.push(resp.genres[x].name);
        }

        //join genres together into list
        genre.text(genreList.sort().join(", "));

        //get movie plot
        plot.text(resp.overview);
        
        removeBtn.attr("data-id", resp.id).html("&#9747; Remove from Library").addClass("btn btn-danger removeBtn");

        //append into div
        detailsDiv.addClass("movieDetails").append(genre, plot, removeBtn);
        newDiv.append(movie, detailsDiv);

        //append div to DOM
        $movieCollection.append(newDiv);
      }
    }).catch(function (error) {
      //catch error message
      console.log(`Error: ${error}`);
    });
  }
}

function removeMovie() {
  var id = $(this).attr("data-id");

  console.log(id);
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
        src = [tmdb.imageUrl, currResp.poster_path].join("");
    
    //if movie poster exists...
    if (currResp.poster_path) {
      var newDiv = $("<div>"),
          movie = $("<img>"),
          btn = $("<btn>");
      
      //add attributes to movie poster
      movie.attr({
          "src": src,
          "alt": currResp.title,
      });

      //change button if the movie already in database
      if (movieIDs.indexOf(currResp.id) === -1) {
        //movie not in collection
        btn.attr({
            "data-id": currResp.id,
            "data-title": currResp.title
          }).text("Add to Library").addClass("btn btn-primary addLib");
      } else {
        //movie in collection
        btn.html("&#9747; Already in Library").addClass("btn btn-secondary disabled");
      }

      //append movie poster and btn to div
      newDiv.append(movie, btn);

      //append created div to DOM
      $movieSearch.append(newDiv);
    }
  }
}

//event listener for "Add to Library" btn
$(document).on("click", ".addLib", function() {
  var btn = $(this),
      id = btn.attr("data-id"),
      title = btn.attr("data-title");

    addMovieToDb(id, title);

    //disable button and change text
    btn.html("&#10004; Added to Library").addClass("disabled btn-secondary").removeClass("btn-primary");
});

//when movies are added or removed from the database or when the page first loads, create/update the local array
db.ref().on("value", function(snapshot) {
  var dbVal = snapshot.val(),
      dbKeys;
    
  //create empty array for ID's
  movieIDs = [];

  if (dbVal !== null) {
    //get keys
    dbKeys = Object.keys(dbVal);

    //append ID's to array
    for (var i = 0; i < dbKeys.length; i++) {
      movieIDs.push(dbVal[dbKeys[i]].id);
    }

    //display existing collection
    displayCollection();
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

//event listener to remove movie from collection
$(document).on("click", ".removeBtn", removeMovie);