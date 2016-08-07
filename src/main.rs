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
    router.get("/api/download", download::download_handler);
    router.get("/api/info", download::info_handler);

    let mut mount = Mount::new();
    mount
        .mount("/", router)
        .mount("/tmp/", download::download_file_handler)
        .mount("/static/", Static::new(Path::new("public/static/")));

    Iron::new(mount).http("0.0.0.0:3000")
                    .unwrap();
}
