import { GetStaticProps } from 'next'
import Image from 'next/image'
import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

import { api } from '../services/api'
import convertDurationToTimeString from '../utils/convertDurationToTimeString'

import styles from './home.module.scss'

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

type Episode = {
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

type HomeProps = {
  latestEpisodes: [Episode, Episode]
  allEpisodes: Episode[]
}

const Home = ({ latestEpisodes, allEpisodes }: HomeProps) => {
  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>

        <ul>
          {latestEpisodes.map(episode => (
            <li key={episode.id}>
              <Image
                width={192}
                height={192}
                src={episode.thumbnail}
                alt={episode.title}
                objectFit="cover"
              />

              <div className={styles.episodeDetails}>
                <a href="">{episode.title}</a>
                <p>{episode.members}</p>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
              </div>

              <button type="button">
                <img src="/play-green.svg" alt="Tocar episódio" />
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
        <h2>Todos os episódios</h2>
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

const formatEpisode = (episode: RawEpisode): Episode => ({
  id: episode.id,
  title: episode.title,
  thumbnail: episode.thumbnail,
  members: episode.members,
  publishedAt: format(parseISO(episode.published_at), 'd MMM yy', {
    locale: ptBR,
  }),
  duration: Number(episode.file.duration),
  durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
  description: episode.description,
  url: episode.file.url,
})

export default Home
export { getStaticProps }
