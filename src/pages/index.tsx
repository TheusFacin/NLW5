import { useContext } from 'react'
import { GetStaticProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { PlayerContext } from '../contexts/PlayerContext'

import { api } from '../services/api'
import { EpisodeType, RawEpisode } from '../types/episode'
import formatEpisode from '../utils/formatEpisode'

import styles from './home.module.scss'

type HomeProps = {
  latestEpisodes: [EpisodeType, EpisodeType]
  allEpisodes: EpisodeType[]
}

const Home = ({ latestEpisodes, allEpisodes }: HomeProps) => {
  const player = useContext(PlayerContext)

  const episodeList = [...latestEpisodes, ...allEpisodes]

  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>

        <ul>
          {latestEpisodes.map((episode, index) => (
            <li key={episode.id}>
              <Image
                width={192}
                height={192}
                src={episode.thumbnail}
                alt={episode.title}
                objectFit="cover"
              />

              <div className={styles.episodeDetails}>
                <Link href={`/episodes/${episode.id}`}>
                  <a>{episode.title}</a>
                </Link>
                <p>{episode.members}</p>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
              </div>

              <button
                type="button"
                onClick={() => player.playList(episodeList, index)}
              >
                <img src="/play-green.svg" alt="Tocar episódio" />
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
        <h2>Todos os episódios</h2>

        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Título</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {allEpisodes.map((episode, index) => (
              <tr key={episode.id}>
                <td>
                  <Image
                    width={120}
                    height={120}
                    src={episode.thumbnail}
                    alt={episode.title}
                    objectFit="cover"
                  />
                </td>
                <td>
                  <Link href={`/episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                </td>
                <td>{episode.members}</td>
                <td>{episode.publishedAt}</td>
                <td>{episode.durationAsString}</td>
                <td>
                  <button
                    type="button"
                    onClick={() =>
                      player.playList(
                        episodeList,
                        index + latestEpisodes.length
                      )
                    }
                  >
                    <img src="/play-green.svg" alt="Tocar Episódio" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}

const getStaticProps: GetStaticProps = async () => {
  const { data } = (await api.get('/episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc',
    },
  })) as { data: RawEpisode[] }

  const episodes = data.map(formatEpisode)

  const latestEpisodes = episodes.slice(0, 2)
  const allEpisodes = episodes.slice(2, episodes.length)

  return {
    props: {
      latestEpisodes,
      allEpisodes,
    },
    // tempo para refazer a requisição (em segundos)
    revalidate: 8 * 60 * 60,
  }
}

export default Home
export { getStaticProps }
