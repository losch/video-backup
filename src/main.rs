extern crate iron;
extern crate url;
extern crate staticfile;
extern crate mount;
extern crate router;

mod urlutils;
mod index;
mod download;

use iron::prelude::*;
use staticfile::Static;
use router::Router;
use std::path::Path;
use mount::Mount;

fn main() {
    let mut router = Router::new();
    router.get("/", index::handler);
    router.get("/download", download::handler);

    let mut mount = Mount::new();
    mount
        .mount("/", router)
        .mount("/static/", Static::new(Path::new("")))
        .mount("/tmp/", Static::new(Path::new("")));

    Iron::new(mount).http("localhost:3000")
                    .unwrap();
}
