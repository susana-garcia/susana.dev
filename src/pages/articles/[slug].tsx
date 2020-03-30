import React from 'react'
import { NextPage, GetStaticProps, GetStaticPaths } from 'next'
import { loadArticles, loadArticle, ArticleMap } from 'utils/articles'
import Link from 'next/link'
import Markdown from 'components/layout/Markdown'
import Layout from 'components/layout/Layout'
import Container from 'components/layout/Container'
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi'
import { NextSeo } from 'next-seo'
import ArticleMetaInfos from 'components/ArticleMetaInfos'
import format from 'date-fns/format'

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: loadArticles().map(post => `/articles/${post.slug}`),
  fallback: false,
})

export const getStaticProps: GetStaticProps = async context => {
  const { slug } = context.params as { slug: string }

  const articleMap = loadArticle(slug)

  return {
    props: articleMap,
  }
}

const ArticlePage: NextPage<ArticleMap> = ({ article, prev, next }) => {
  const { slug, excerpt, title, publishedAt, updatedAt, content, tags } = article

  return (
    <>
      <NextSeo
        title={title}
        description={excerpt}
        openGraph={{
          title,
          description: excerpt,
          url: `${process.env.SITE_URL}/articles/${slug}`,
          type: 'article',
          article: {
            publishedTime: publishedAt,
            tags: tags,
          },
        }}
      />
      <Layout
        subheader={
          <div className="mt-12 mb-8">
            <h1 className="text-5xl font-black leading-tight mb-2">{title}</h1>
            <ArticleMetaInfos article={article} />
          </div>
        }
      >
        <Container>
          {publishedAt !== updatedAt && (
            <p className="mb-8 text-xs text-gray-500">
              Edited at {format(new Date(updatedAt), 'MMM d, yyyy')}
            </p>
          )}
          <article>
            <h1 className="hidden">{title}</h1>
            <Markdown content={content} />
            {(prev || next) && (
              <footer className="mt-16 grid grid-cols-2 font-bold">
                <div>
                  {prev && (
                    <Link
                      href={{ pathname: '/articles', query: { slug: prev.slug } }}
                      as={`/articles/${prev.slug}`}
                    >
                      <a>
                        <FiArrowLeft className="mr-1" />
                        {prev.title}
                      </a>
                    </Link>
                  )}
                </div>
                <div className="text-right">
                  {next && (
                    <Link
                      href={{ pathname: '/articles', query: { slug: next.slug } }}
                      as={`/articles/${next.slug}`}
                    >
                      <a>
                        {next.title}
                        <FiArrowRight className="ml-1" />
                      </a>
                    </Link>
                  )}
                </div>
              </footer>
            )}
          </article>
        </Container>
      </Layout>
    </>
  )
}

export default ArticlePage
