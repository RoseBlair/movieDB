// Initialize Firebase
var config = {
  apiKey: "AIzaSyCY9N-yelWHlH-kuAxNl2txT9uPgE9w1SU",
  authDomain: "project1-moviedatabase.firebaseapp.com",
  databaseURL: "https://project1-moviedatabase.firebaseio.com",
  projectId: "project1-moviedatabase",
  storageBucket: "",
  messagingSenderId: "1058494403971"
};


firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding Employees
$("#add-movie-btn").on("click", function (event) {
  event.preventDefault();

  // Grabs user input
  var movieTitle = $("#movie-title-input").val().trim();
  var omdb = $("#omdb-input").val().trim();

  // Creates local "temporary" object for holding movie data
  var newMovie = {
    title: movieTitle,
    omdbnumber: omdb
  };

  // Uploads movie data to the database
  database.ref().push(newMovie);

  // Logs everything to console
  console.log(newMovie.title);
  console.log(newMovie.omdbnumber);

  alert("Movie successfully added");

  // Clears all of the text-boxes
  $("#movie-title-input").val("");
  $("#omdb-input").val("");

});

// 3. Create Firebase event for adding movie to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a variable.
  var movieTitle = childSnapshot.val().title;
  var omdb = childSnapshot.val().omdbnumber;
  var newRow = $("<tr>").append(
    $("<td>").text(movieTitle),
    $("<td>").text(omdb),
  );

  // Append the new row to the table
  $("#movie-table > tbody").append(newRow);
});

