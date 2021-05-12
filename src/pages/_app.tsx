import { useState } from 'react'
import Header from '../components/Header'
import Player from '../components/Player'
import PlayerContext, { Episode } from '../contexts/PlayerContext'

import styles from '../styles/app.module.scss'
import '../styles/global.scss'

const MyApp = ({ Component, pageProps }) => {
  const [episodeList, setEpisodeList] = useState<Episode[]>([])
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)

  const play = (episode: Episode) => {
    setEpisodeList([episode])
    setCurrentEpisodeIndex(0)
  }

  return (
    <PlayerContext.Provider value={{ episodeList, currentEpisodeIndex, play }}>
      <div className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>

        <Player />
      </div>
    </PlayerContext.Provider>
  )
}

export default MyApp
