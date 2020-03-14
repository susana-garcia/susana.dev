import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { NextPage, GetStaticProps } from 'next'
import format from 'date-fns/format'
import { loadArticles, Article } from '../utils/articles'

export const getStaticProps: GetStaticProps = async () => {
  const articles = loadArticles()
  return { props: { articles } }
}

interface IndexPageProps {
  articles: Article[]
}

const IndexPage: NextPage<IndexPageProps> = ({ articles }) => (
  <>
    <Head>
      <title>My Blog</title>
    </Head>
    <ul>
      {articles.map(article => (
        <li key={article.slug} className="mb-10">
          <time
            dateTime={article.date}
            itemProp="datePublished"
            className="text-xs text-gray-700"
          >
            {format(new Date(article.date), 'MMM d, yyyy')}
          </time>
          <Link
            href={{ pathname: '/articles', query: { slug: article.slug } }}
            as={`/articles/${article.slug}`}
          >
            <a>
              <h3 className="text-xl font-black my-1">{article.title}</h3>
            </a>
          </Link>

          <ul className="flex">
            {article.tags.map(tag => (
              <li
                key={tag}
                className="mr-1 text-xs text-gray-600 px-2 border border-gray-400 rounded-full"
              >
                <Link
                  href={{ pathname: '/tags', query: { tag } }}
                  as={`/tags/${tag}`}
                >
                  <a>{tag}</a>
                </Link>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  </>
)

export default IndexPage
