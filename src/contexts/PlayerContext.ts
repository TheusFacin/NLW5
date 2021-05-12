import { createContext } from 'react'

type Episode = {
  title: string
  members: string
  thumbnail: string
  duration: number
  url: string
}

type PlayerContextData = {
  episodeList: Episode[]
  currentEpisodeIndex: number
  play: (episode: Episode) => void
}

const PlayerContext = createContext({} as PlayerContextData)

export default PlayerContext
export type { Episode }
