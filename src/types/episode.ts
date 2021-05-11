type RawEpisode = {
  id: string
  title: string
  members: string
  published_at: string
  thumbnail: string
  description: string
  file: {
    url: string
    type: string
    duration: number
  }
}

type EpisodeType = {
  id: string
  title: string
  thumbnail: string
  members: string
  publishedAt: string
  duration: number
  durationAsString: string
  description: string
  url: string
}

export type { EpisodeType, RawEpisode }
