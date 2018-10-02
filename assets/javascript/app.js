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

  if (resp.length > 10) {
    resultLimit = 10;
  } else {
    resultLimit = resp.length;
  }

  for (var i = 0; i < resultLimit; i++) {
    var currentResp = resp[i],
        src = [tmdb.imageUrl, currentResp.poster_path].join("");
    
    if (currentResp.poster_path) {
      var newMovie = $("<img>");
        
      newMovie.attr({
          "src": src,
          "alt": currentResp.title
      }).addClass("searchedMovie");

      $movieSearch.append(newMovie);
    }
  }
}