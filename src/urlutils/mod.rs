//! URL handling functions

extern crate iron;

use std::collections::HashMap;
use iron::prelude::*;

/// Parse query parameters to hashmap from given query parameters 
pub fn parse_params(params: &str) -> HashMap<&str, &str> {
  fn parse_key_and_value(param: &str) -> (&str, &str) {
    let v: Vec<&str> = param.split("=").collect();

    match v.len() {
      2 => (v[0], v[1]),
      1 => (v[0], ""),
      _ => ("", "")
    }
  }

  let mut parsed_params = HashMap::new();
  for param in params.split("&") {
    let (key, val) = parse_key_and_value(param);
    parsed_params.insert(key, val);
  }

  return parsed_params;
}

/// Parse query parameters from url
pub fn get_params<'a>(req: &'a mut Request) -> HashMap<&'a str, &'a str> {
  req.url.query()
         .map(parse_params)
         .unwrap_or(HashMap::new())
}
