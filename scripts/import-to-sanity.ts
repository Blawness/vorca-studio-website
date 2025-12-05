/**
 * Migration script to import articles from JSON to Sanity
 * 
 * Usage:
 * 1. Get a write token from Sanity Dashboard > API > Tokens
 * 2. Run: SANITY_WRITE_TOKEN=your_token bun run scripts/import-to-sanity.ts
 */

import { createClient } from '@sanity/client'
import articles from '../app/data/articles.json'

const client = createClient({
    projectId: 'zdgfq7md',
    dataset: 'production',
    token: process.env.SANITY_WRITE_TOKEN,
    useCdn: false,
    apiVersion: '2024-01-01',
})

interface ArticleJSON {
    id: string
    slug: string
    title: string
    titleEn: string
    excerpt: string
    excerptEn: string
    content: string
    contentEn: string
    image: string
    category: string
    author: string
    date: string
    readTime: number
    tags: string[]
}

async function importArticles() {
    console.log('🚀 Starting migration...')
    console.log(`📦 Found ${articles.length} articles to import\n`)

    for (const article of articles as ArticleJSON[]) {
        try {
            const doc = {
                _type: 'article',
                _id: `article-${article.id}`,
                title: article.title,
                titleEn: article.titleEn,
                slug: {
                    _type: 'slug',
                    current: article.slug,
                },
                excerpt: article.excerpt,
                excerptEn: article.excerptEn,
                content: article.content,
                contentEn: article.contentEn,
                image: article.image,
                category: article.category,
                author: article.author,
                date: article.date,
                readTime: article.readTime,
                tags: article.tags,
            }

            await client.createOrReplace(doc)
            console.log(`✅ Imported: ${article.titleEn}`)
        } catch (error) {
            console.error(`❌ Failed: ${article.titleEn}`, error)
        }
    }

    console.log('\n🎉 Migration complete!')
}

importArticles()
