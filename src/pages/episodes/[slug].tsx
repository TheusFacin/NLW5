import { GetStaticPaths, GetStaticProps } from 'next'
// import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'

import usePlayer from '../../contexts/PlayerContext'
import { api } from '../../services/api'
import { EpisodeType, RawEpisode } from '../../types/episode'
import formatEpisode from '../../utils/formatEpisode'

import styles from './episode.module.scss'

type EpisodeProps = {
  episode: EpisodeType
}

const Episode = ({ episode }: EpisodeProps) => {
  // const router = useRouter()

  // se a página ainda estiver carregando (precisa no fallback: true)
  // if (router.isFallback) return <p>Carregando...</p>

  const { play } = usePlayer()

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

          <button type="button" onClick={() => play(episode)}>
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

// definição para o next gerar páginas dinâmicas de forma
// estáticas a partir dos seus endereços
const getStaticPaths: GetStaticPaths = async () => {
  // em um e-comerce por exemplo, podemos colocar no paths as
  // categorias e os produtos mais acessados, e deixar os outros
  // para serem gerados quando acessados por algum cliente

  // para exemplificar, vamos pegar dois episódios
  const { data } = (await api.get('/episodes', {
    params: {
      _limit: 2,
      _sort: 'published_at',
      _order: 'desc',
    },
  })) as { data: RawEpisode[] }

  const paths = data.map(episode => ({ params: { slug: episode.id } }))

  return {
    // quando passamos o paths vazio, o next não vai gerar
    // nenhum episódio de forma estática.
    // ao passarmos os paths, o next vai gerar os episódios
    // descritos estaticamente na build.
    /* paths: [], */
    paths,
    // define o comportamento quando uma página não estática,
    // ou seja, que não foi definido no path, for acessada.
    // false - 404
    // true - tenta buscar os dados, pelo lado do client, e criar a página de forma estática
    // 'blocking' - igual ao true, porém pelo lado do server (melhor opção para SEO)
    fallback: 'blocking',
  }
}

// Precisamos buscar os dados na api, mas isso precisa ser
// feito de forma estática, para o next criar a página
const getStaticProps: GetStaticProps = async ctx => {
  const { slug } = ctx.params // ctx = context

  const { data } = (await api.get(`/episodes/${slug}`)) as { data: RawEpisode }

  const episode = formatEpisode(data)

  return {
    // as props do componente
    props: {
      episode,
    },
    // o tempo, em segundos, do intervalo entre as consultas
    revalidate: 24 * 60 * 60, // 24 horas
  }
}

export default Episode
export { getStaticProps, getStaticPaths }
