import { GetStaticProps } from 'next'
import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

import { api } from '../services/api'
import convertDurationToTimeString from '../utils/convertDurationToTimeString'

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
  episodes: Episode[]
}

const Home = (props: HomeProps) => {
  return (
    <>
      <h1>Index</h1>
      <p>{JSON.stringify(props.episodes)}</p>
    </>
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

  return {
    props: {
      episodes,
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
