extern crate iron;
extern crate handlebars;
extern crate rustc_serialize;
extern crate url;

use std::path::Path;
use std::process::Command;

use iron::prelude::*;
use iron::mime::Mime;
use iron::status;
use iron::headers::{ContentDisposition,
                    DispositionType};
use iron::Handler;

use url::percent_encoding::percent_decode;
use staticfile::Static;

use self::rustc_serialize::json::Json;

use urlutils::get_params;

fn decode_url(url: &str) -> String {
    percent_decode(url.as_bytes())
        .decode_utf8_lossy()
        .into_owned()
}

fn youtubedl_download(url: &str, format: Option<&&str>) -> String {
    println!("Downloading url {}", url);

    let mut cmd = Command::new("youtube-dl");

    cmd.current_dir("tmp")
       .arg("--print-json")
       .arg(url);

    if let Some(fmt) = format {
      cmd.arg("--format")
         .arg(fmt);
    }

    let output = cmd.output()
                    .expect("failed to execute process");

    String::from_utf8_lossy(&output.stdout).to_string()
}

fn youtubedl_info(url: &str) -> String {
  let output = Command::new("youtube-dl")
                     .current_dir("tmp")
                     .arg("--dump-json")
                     .arg(url)
                     .output()
                     .expect("failed to execute process");
    String::from_utf8_lossy(&output.stdout).to_string()
}

fn get_download_url(result: &Json) -> String {
  let url = result.find("_filename").unwrap().as_string().unwrap();
  "/tmp/".to_string() + url
}

/*
 * Handler for fetching video info
 *
 * Query parameters:
 *   url - URL to the video
 */
pub fn info_handler(req: &mut Request) -> IronResult<Response> {
  let params = get_params(req);

  let response = match params.get(&"url") {
    Some(&url) => {
      let decoded_url = decode_url(url);

      println!("Fetching info for url {}", decoded_url);

      let result = youtubedl_info(&decoded_url);
      let content_type = "application/json".parse::<Mime>().unwrap();
      Response::with((content_type, status::Ok, result))
    }

    None => {
      Response::with((status::BadRequest, "url parameter is invalid"))
    }
  };

  Ok(response)
}

/*
 * Handler for preparing video download. This downloads the file locally
 * and then provides a download link where to get the file.
 *
 * Query parameters:
 *   url               - Video's URL
 *   format (optional) - Video's format ID
 *
 * Returns:
 *   Path where to download the video
 */
pub fn download_handler(req: &mut Request) -> IronResult<Response> {
  let params = get_params(req);

  let response = match params.get(&"url") {
    Some(url) => {
      let decoded_url = decode_url(url);

      let result = youtubedl_download(&decoded_url, params.get(&"format"));

      let content_type = "text/plain".parse::<Mime>().unwrap();
      let json = Json::from_str(&result).unwrap();
      let download_url = get_download_url(&json);

      Response::with((content_type, status::Ok, download_url))
    },

    None =>
      Response::with((status::BadRequest, "url parameter is invalid"))
  };

  Ok(response)
}

/*
 * A static file handler for serving downloaded videos.
 * Uses Staticfile for serving the files but adds ContentDisposition header
 * to the response to force the browser to download the file instead of
 * opening it.
 */
pub fn download_file_handler(req: &mut Request) -> IronResult<Response> {
    let static_file_handler = Static::new(Path::new("tmp/"));

    match static_file_handler.handle(req) {
        Ok(mut response) => {
            response.headers.set(ContentDisposition {
                disposition: DispositionType::Attachment,
                parameters: vec![]
            });
            Ok(response)
        },

        Err(error)   => Err(error)
    }
}


