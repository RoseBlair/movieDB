// Initialize Firebase
var config = {
    apiKey: "AIzaSyAcgdpSSSobcgp2hFf1wSu9yNf8Roe6WIQ",
    authDomain: "moviedb-db817.firebaseapp.com",
    databaseURL: "https://moviedb-db817.firebaseio.com",
    projectId: "moviedb-db817",
    storageBucket: "moviedb-db817.appspot.com",
    messagingSenderId: "817296084015"
  },
  db = firebase.database();

  firebase.initializeApp(config);
  
//BEGIN JS CODE FOR APP BELOW THIS POINT
var tmdbSearch = {
  baseUrl: "https://api.themoviedb.org/3/search/movie?",
  apiKey: "951021584287e01bb1ba8473989df6da"
},
tmdbImg = {
  baseUrl: "https://image.tmdb.org/t/p/w500/",
  size: "w500",
};