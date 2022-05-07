# Wiki Map

A web app that allows users to collaboratively create maps which list multiple "points". For example: "Best Places to Eat Around Town" or "Locations of Movie Scenes".

## Requirements:

* 1 - users can see a list of the available maps
* 2 - users can view a map
* 3 - a map can contain many points
* 4 - each point can have: a title, description, and image
* 5 - authenticated users can create maps
* 6 - authenticated users can modify maps (add, edit, remove points)
* 7 - users can favourite a map
* 8 - users have profiles, indicating their favourite maps and maps  they've contributed to
* 9 - use http://leafletjs.com/ or https://developers.google.com/maps/

## Stack Requirements
* ES6 for server-side (NodeJS) code
* NodeJS
* Express
  *  RESTful routes
* One or more CSS or UI "framework"s:
* jQuery
* A CSS preprocessor such as SASS, Stylus, or PostCSS for styling -- or CSS Custom properties and no CSS preprocessor
* PostgreSQL and pg (with promises) for DBMS
* git for version control
### Optional Requirements
* SPA (Single-Page Application) Behaviour
* Hosting, such as heroku, netlify, github pages, AWS, or Azure
* Project Options

# Agile 

### Users


### Stack decisions 
- Single page app? No

## Pages
### Home page 
  * Search bar (1) 
  * Suggestions (1)

### Create map 
  * To start have a form 
    * Title
    * City
    * Country
    * (Create) button
  * *Map create button pressed*
    * Map API displayed
    * Pin icon, favourite

### Favourites 
  * Grid of favourite maps

### THE MAP PAGE
  * Show the selected map


## Divs
### Nav bar
  * Logo/ App name (Top Left)
  * User logged in shown as initials (Top right)
    * Login button if not logged in
  * Create button (Icon (not plus sign))
  * Search icon

### Footer 
  * Thin (50px w.e.)
  * copy right, contacts blah blah

### Side Bar (Click on username)
  * Favourites 
  * Contributions (My maps)
  * Log out



# Stretch

* Login in page 
* Add permissions for there maps. 
  * User can fork a map
* If they are no signed in and hit 
* Grab users geolocation form browser
* Method Overrides 
* Have the map zoom in as the user is creating the map. As they type a city. 
* Have multiple maps displayed
* Randomly generate suggestions (exploritory catigories)
* Single page app