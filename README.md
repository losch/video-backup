Video backup
============

A web application written in Rust that helps making personal backups of videos
with youtube-dl application.

![Screenshot](./screenshots/screenshot.png?raw=true)

Requirements
============

* youtube-dl (https://rg3.github.io/youtube-dl/)
* Rust compiler (https://www.rust-lang.org/)
* NodeJS and npm (https://nodejs.org/)

Building and running
====================

1. Install dependencies
```npm install```

2. Build frontend
```npm run build```

3. Then build backend and run it
```cargo run```

4. Video backup server starts in http://localhost:3000

Development
===========

Open three terminal windows and run the following commands:

**Terminal #1** Build and start backend with: ```cargo run```

**Terminal #2** Start proxy server: ```node proxy.js```

**Terminal #3** Start brunch in watch mode: ```npm start```

Open browser to http://localhost:3333

Directory structure
===================

```
app - Frontend code
app/assets - Asset files that are just copied under /public directory
src - Backend code
public - Brunch build frontend code here. Do not modify this directory's contents manually.
typings - TypeScript typings
```

Docker usage
============

Docker and Docker compose are required.

For starting up the container run ```docker-compose up```

And for stopping run ```docker-compose stop```
