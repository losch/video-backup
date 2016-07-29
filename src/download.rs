extern crate iron;
extern crate handlebars;
extern crate rustc_serialize;
extern crate url;

use std::path::Path;
use std::collections::BTreeMap;
use std::process::Command;

use iron::prelude::*;
use iron::mime::Mime;
use iron::status;
use url::percent_encoding::percent_decode;
use self::handlebars::Handlebars;
use self::rustc_serialize::json::{Json, ToJson};

use urlutils::get_params;

fn decode_url(url: &str) -> String {
    percent_decode(url.as_bytes())
        .decode_utf8_lossy()
        .into_owned()
}

fn youtubedl(url: &str) -> String {
    let output = Command::new("youtube-dl")
                         .current_dir("tmp")
                         .arg("--print-json")
                         .arg(url)
                         .output()
                         .expect("failed to execute process");
    String::from_utf8_lossy(&output.stdout).to_string()
}

struct ResponseData {
  url: String,
  thumbnail: String,
  result: String,
  download_url: String,
  title: String,
  description: String
}

impl ToJson for ResponseData {
  fn to_json(&self) -> Json {
    let mut m: BTreeMap<String, Json> = BTreeMap::new();
    m.insert("url".to_string(), self.url.to_json());
    m.insert("thumbnail".to_string(), self.thumbnail.to_json());
    m.insert("result".to_string(), self.result.to_json());
    m.insert("download_url".to_string(), self.download_url.to_json());
    m.insert("title".to_string(), self.title.to_json());
    m.insert("description".to_string(), self.description.to_json());
    m.to_json()
  }
}

fn get_thumbnail(result: &Json) -> String {
  let url = result.find("thumbnail").unwrap().as_string().unwrap().to_string();
  url.replace("maxresdefault", "hqdefault")
}

fn get_download_url(result: &Json) -> String {
  let url = result.find("_filename").unwrap().as_string().unwrap();
  "/tmp/".to_string() + url
}

fn get_title(result: &Json) -> String {
  result.find("title").unwrap().as_string().unwrap().to_string()
}

fn get_description(result: &Json) -> String {
  result.find("description").unwrap().as_string().unwrap().to_string()
}

fn response(result: Json) -> Response {
  let content_type = "text/html".parse::<Mime>().unwrap();

  let mut handlebars = Handlebars::new();

  handlebars.register_template_file(
    "header", &Path::new("templates/header.hbs")).ok().unwrap();
  handlebars.register_template_file(
    "footer", &Path::new("templates/footer.hbs")).ok().unwrap();
  handlebars.register_template_file(
    "template", &Path::new("templates/download.hbs")).ok().unwrap();

  let obj = result.as_object().unwrap();

  let data = ResponseData {
    url: obj.get("webpage_url").unwrap().as_string().unwrap().to_string(),
    thumbnail: get_thumbnail(&result),
    result: result.to_string(),
    title: get_title(&result),
    description: get_description(&result),
    download_url: get_download_url(&result)
  };

  if let Ok(contents) = handlebars.render("template", &data) {
    Response::with((content_type, status::Ok, contents))
  }
  else {
    Response::with((status::BadRequest, "could not render template"))
  }
}

pub fn handler(req: &mut Request) -> IronResult<Response> {
  let params = get_params(req);

  let response = match params.get(&"url") {
    Some(&url) => {
      let decoded_url = decode_url(url);

      println!("Dowloading url {}", decoded_url);

      let result = youtubedl(&decoded_url);

      println!("Result: {}", result);

      let json = Json::from_str(&result).unwrap();
      response(json)
    }

    _ =>
      Response::with((status::BadRequest, "url parameter is invalid"))
  };

  Ok(response)
}
