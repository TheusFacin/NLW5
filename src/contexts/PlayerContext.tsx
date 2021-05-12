import { createContext, useContext, useEffect, useState } from 'react'

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
  isLooping: boolean
  isShuffling: boolean
  play: (episode: Episode) => void
  playList: (list: Episode[], index: number) => void
  playNext: () => void
  playPrevious: () => void
  togglePlayPause: () => void
  toggleLoop: () => void
  toggleShuffle: () => void
  setPlayingState: (state: boolean) => void
  hasNext: boolean
  hasPrevious: boolean
}

const PlayerContext = createContext({} as PlayerContextData)

const PlayerContextProvider: React.FC = ({ children }) => {
  const [episodeList, setEpisodeList] = useState<Episode[]>([])
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasNext, setHasNext] = useState(false)
  const [hasPrevious, sethasPrevious] = useState(false)
  const [isLooping, setIsLooping] = useState(false)
  const [isShuffling, setIsShuffling] = useState(false)

  useEffect(() => {
    setHasNext(currentEpisodeIndex + 1 < episodeList.length)
    sethasPrevious(currentEpisodeIndex > 0)
  }, [episodeList, currentEpisodeIndex])

  const play = (episode: Episode) => {
    setEpisodeList([episode])
    setCurrentEpisodeIndex(0)
    setIsPlaying(true)
    setIsShuffling(false)
  }

  const playList = (list: Episode[], index: number) => {
    setEpisodeList(list)
    setCurrentEpisodeIndex(index)
    setIsPlaying(true)
  }

  const togglePlayPause = () => {
    setIsPlaying(prev => !prev)
  }

  const toggleLoop = () => {
    setIsLooping(prev => !prev)
  }

  const toggleShuffle = () => {
    setIsShuffling(prev => !prev)
  }

  const setPlayingState = (state: boolean) => {
    setIsPlaying(state)
  }

  const playNext = () => {
    if (isShuffling) {
      const nextRandomEpisodeIndex = Math.floor(
        Math.random() * episodeList.length
      )
      setCurrentEpisodeIndex(nextRandomEpisodeIndex)
      return
    }

    if (!hasNext) return

    setCurrentEpisodeIndex(prev => prev + 1)
  }

  const playPrevious = () => {
    if (!hasPrevious) return

    setCurrentEpisodeIndex(prev => prev - 1)
  }

  return (
    <PlayerContext.Provider
      value={{
        episodeList,
        currentEpisodeIndex,
        isPlaying,
        isLooping,
        isShuffling,
        play,
        playList,
        playNext,
        playPrevious,
        togglePlayPause,
        toggleLoop,
        toggleShuffle,
        setPlayingState,
        hasNext,
        hasPrevious,
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}

const usePlayer = () => {
  return useContext(PlayerContext)
}

export default usePlayer
export { PlayerContext, PlayerContextProvider }
