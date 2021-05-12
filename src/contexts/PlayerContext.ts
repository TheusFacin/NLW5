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
  isPlaying: boolean
  play: (episode: Episode) => void
  togglePlayPause: () => void
  setPlayingState: (state: boolean) => void
}

const PlayerContext = createContext({} as PlayerContextData)

export default PlayerContext
export type { Episode }
