# What this branch is

This branch is intended to be an easy to view snapshot of where the project is at. 

The commits are pretty detailed, but for an easy summary of where the project is at: 

  1. A hapi back-end was added for (among other things) multiplayer over a connection (was keyboard multiplayer previously)
  1. Bcrypt for passwords, jwts for authentication
  1. Socket.io is used for fast communication between client and server
  1. Bookshelf/Knex using Sqlite3 for easy setup. Was initially postgres but that was overkill
  1. React-router for routing
  1. And of course for convenient demo purposes, this branch uses a production build created by create react app. 

# Setup Instructions
Requirements:
`Node
NPM
KNEX
`
1. Clone this repo
1. Navigate to api directory
1. To install: `npm install` `knex migrate:latest` `knex seed:run`
1. To run: `npm start`

After the server has started, it should be possible for people to connect to your server over the local network using your ip and port 8000, ex `192.168.2.9:8000`

## Incomplete features
A mobile interface exists and is present at lower resolutions, but it is experimental and kind of the bare minimum to qualify. 

A tutorial along with a chat command feature is present, but very incomplete. By using the chat command (only do this on your own machine) "/tutorial" you will see some messages and a bot will join the game, but the bot is pretty broken. After sinking a lot of time into building something that has some basic, but still broken pathfinding, I opted to spend time learning some database things and was able to get that done in a much shorter amount of time. Also about the on your own machine thing, it might do something comparable to unplugging a console while people are playing. 

## Things to build / learn about

This feels like it is/was a good type of project to learn a lot of basics. I feel like my knowledge on how a whole web app might go together is more complete than it was before. Writing a basic react component or hapi route is one thing, but figuring out how to pull those pieces together feels like I can put them to greater use. 

This app doesn't use redux, which is obviously very popular. I will have to build something with that at some point, beyond just editing someone else's built out work.

There aren't multiple user roles/administration features. The closest that exists is I might be able to do something with the repl and socket.io's namespace, but that isn't really a feature just a debugging thing I was trying out. 

The next game I build will probably use an actual game engine of some kind. 
