Video backup
============

A web application written in Rust that makes personal backups of videos with
youtube-dl application.

Requirements
============

* youtube-dl
* Rust compiler
* NodeJS and npm

Building and running
====================

1. Build frontend
```npm run build```

2. Build backend and run it
```cargo build && cargo run```

Development
===========

Build and start backend with: ```cargo build && cargo run```
Start proxy: ```node proxy.js```
Start brunch in watch mode: ```npm start```
