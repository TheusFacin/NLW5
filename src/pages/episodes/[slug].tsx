import { GetStaticPaths, GetStaticProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { api } from '../../services/api'
import { EpisodeType, RawEpisode } from '../../types/episode'
import formatEpisode from '../../utils/formatEpisode'

import styles from './episode.module.scss'

type EpisodeProps = {
  episode: EpisodeType
}

const Episode = ({ episode }: EpisodeProps) => {
  return (
    <div className={styles.episodeContainer}>
      <div className={styles.episode}>
        <div className={styles.thumbnailContainer}>
          <Link href="/">
            <button type="button">
              <img src="/arrow-left.svg" alt="Voltar" />
            </button>
          </Link>

          <Image
            width={700}
            height={300}
            src={episode.thumbnail}
            alt={episode.title}
            objectFit="cover"
          />

          <button type="button">
            <img src="/play.svg" alt="Tocar episódio" />
          </button>
        </div>

        <header>
          <h1>{episode.title}</h1>
          <span>{episode.members}</span>
          <span>{episode.publishedAt}</span>
          <span>{episode.durationAsString}</span>
        </header>

        <div
          className={styles.description}
          dangerouslySetInnerHTML={{ __html: episode.description }}
        />
      </div>
    </div>
  )
}

const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

const getStaticProps: GetStaticProps = async ctx => {
  const { slug } = ctx.params // ctx = context

  const { data } = (await api.get(`/episodes/${slug}`)) as { data: RawEpisode }

  const episode = formatEpisode(data)

  return {
    props: {
      episode,
    },
    revalidate: 24 * 60 * 60, // 24 horas
  }
}

export default Episode
export { getStaticProps, getStaticPaths }
