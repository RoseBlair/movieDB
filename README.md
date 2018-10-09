# Movie Collection DB

This collaborative project allows for people to add, remove, and keep track of their movie collection.

# General Use

When a user accesses the main page of the project, they are greeted with their collection of movies. This data is stored in a Firebase database and is dynamically accessed when the page loads and freshes the DOM as changes are made to the database. API integration allows for a user to search for additional movies to add to their collection. 

# Notes

All of the site's behavior and functionality takes place without the browser window refreshing, unless switching from the Library or Search pages via the navbar.

# Languages/Libraries/Concepts Used
- HTML 5
- CSS 3
- Bootstrap 4.1.3
- Javascript
- JQuery 3.3.1
- ASync JS 2.6.1
- Firebase DB 5.5.2
- The Movie Database (TMDb) API v3

# Future Enhancements

There are several things that could be done to improve this project and expand it's functionality.
1. Search functionality for existing collection to search through movies already in database by title, genre, rating. etc.
2. Trailer button creates a pop-up of the trailer video instead of opening a new browser tab.
3. Integrate JS library that allows for playback of movies in collection if mp4 file is on detected external HD.
4. TMDB API only allows for 40 calls every 10 seconds. Create paged collection structure with 40 results per page max to alleviate this bottleneck.
5. Integrate user profile functionality to allow for people to have their own collection instead of sharing the same collection.

# Acknowledgments

Big shout out to [PurpleBooth](https://gist.github.com/PurpleBooth/109311bb0361f32d87a2) for posting this Read Me template on github!

[Keith Rosenburg](https://github.com/netpoetica) for help understanding and utilizing ASync JS.
