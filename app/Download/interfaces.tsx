export interface VideoFormat {
  // ID
  format_id: string,

  // Format
  format: string,

  // Extension
  ext: string,

  // Video codec
  vcodec: string,

  // Audio codec
  acodec: string,

  // File size
  filesize?: number
}

export interface VideoInfo {
  // Title
  title: string,

  // Description
  description: string,

  // Link to the original URL
  webpage_url: string,

  // Available formats
  formats: Array<VideoFormat>
}
