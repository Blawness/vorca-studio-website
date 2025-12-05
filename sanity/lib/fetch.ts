import { client } from './client'
import { allArticlesQuery, articleBySlugQuery, allSlugsQuery } from './queries'

export interface Article {
    id: string
    slug: string
    title: string
    excerpt: string
    content?: string
    image: string
    category: string
    author: string
    date: string
    readTime: number
    tags: string[]
}

export async function getAllArticles(): Promise<Article[]> {
    return client.fetch(allArticlesQuery)
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
    return client.fetch(articleBySlugQuery, { slug })
}

export async function getAllSlugs(): Promise<{ slug: string }[]> {
    return client.fetch(allSlugsQuery)
}
