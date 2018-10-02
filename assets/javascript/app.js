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
    tmdb = {
      searchUrl: "https://api.themoviedb.org/3/search/movie?",
      imageUrl: "https://image.tmdb.org/t/p/w500",
      apiKey: "api_key=951021584287e01bb1ba8473989df6da",
      lang: "&language=en-US"
    },
    db = firebase.database();

function searchForMovies(title) {
  //create request url
  var url = [tmdb.searchUrl, tmdb.apiKey, tmdb.lang, "&query=", title].join("");

  $.ajax({
    url: url,
    method: "GET"

  }).then(function (resp) {
    //get results and pass them to next function
    displaySearchResults(resp.results);

  }).catch(function (error) {
    //catch and log error from api request
    console.log(`Error: ${error}`);
  });
}

function displaySearchResults(resp) {
  var resultLimit;

  //limits results to 10 or max of returned if less than 10 results
  if (resp.length > 10) {
    resultLimit = 10;
  } else {
    resultLimit = resp.length;
  }

  //loops through results and appends movie poster to DOM
  for (var i = 0; i < resultLimit; i++) {
    var currentResp = resp[i],
        src = [tmdb.imageUrl, currentResp.poster_path].join("");
    
    //if movie poster exists add it to DOM
    if (currentResp.poster_path) {
      var newDiv = $("<div>"),
          newMovie = $("<img>"),
          addBtn = $("<btn>");
      
      //adds attributes to movie poster image
      newMovie.attr({
          "src": src,
          "alt": currentResp.title,
      });

      //adds text, movie id and classes to button
      addBtn.text("Add to Library").addClass("btn btn-primary addLib").attr("data-id", currentResp.id);

      //appends movie poster and btn to div
      newDiv.append(newMovie, addBtn).addClass("searchedMovie");

      //appends created div to DOM
      $movieSearch.append(newDiv);
    }
  }
}

function alreadyInDb(idToMatch) {
  db.ref().once("value").then(function (snapshot) {
    var dbVal = snapshot.val(),
        dbKeys = Object.keys(dbVal);

    for (var i = 0; i < dbKeys.length; i++) {
      var id = dbVal[dbKeys[i]].id;

      //id already exists
      if (id === idToMatch) {
        return true;
      }
    }

    //id doesn't exist yet
    return false;
  }).catch(function (error) {
    //catch and log error from database request
    console.log(`Error: ${error}`);
  });
}

function addMovieToDb(movieID) {
  var exists = alreadyInDb(movieID);
  
  console.log(exists);

  if (!exists) {
    db.ref().push({
      id: movieID
    });

  console.log(exists);
  }
}

//event listener to get movie id from "add to library" button and pass into another function
$(document).on("click", ".addLib", function() {
  var btn = $(this),
      id = btn.attr("data-id");

  if (!btn.hasClass("disabled")) {
    addMovieToDb(id);

    //disable button and change text
    btn.html("&#10004; Added to Library").addClass("disabled btn-secondary").removeClass("btn-primary");
  }
});