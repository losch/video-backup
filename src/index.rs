extern crate iron;
extern crate handlebars;
extern crate rustc_serialize;

use std::path::Path;
use std::collections::BTreeMap;

use iron::prelude::*;
use iron::mime::Mime;
use iron::status;
use self::handlebars::Handlebars;
use self::rustc_serialize::json::{Json, ToJson};

struct IndexData {}

impl ToJson for IndexData {
  fn to_json(&self) -> Json {
    let m: BTreeMap<String, Json> = BTreeMap::new();
    m.to_json()
  }
}

pub fn handler(_: &mut Request) -> IronResult<Response> {
    let content_type = "text/html".parse::<Mime>().unwrap();

    let mut handlebars = Handlebars::new();

    handlebars.register_template_file(
      "header", &Path::new("templates/header.hbs")).ok().unwrap();
    handlebars.register_template_file(
      "footer", &Path::new("templates/footer.hbs")).ok().unwrap();
    handlebars.register_template_file(
      "template", &Path::new("templates/index.hbs")).ok().unwrap();

    let data = IndexData {};
    if let Ok(contents) = handlebars.render("template", &data) {
      Ok(Response::with((content_type, status::Ok, contents)))
    }
    else {
      Ok(Response::with((status::BadRequest, "could not load template")))
    }
}
