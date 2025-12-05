import { groq } from 'next-sanity'

// Get all articles for listing page (without full content)
export const allArticlesQuery = groq`
  *[_type == "article"] | order(date desc) {
    _id,
    "id": _id,
    title,
    titleEn,
    "slug": slug.current,
    excerpt,
    excerptEn,
    image,
    category,
    author,
    date,
    readTime,
    tags
  }
`

// Get single article by slug (with full content)
export const articleBySlugQuery = groq`
  *[_type == "article" && slug.current == $slug][0] {
    _id,
    "id": _id,
    title,
    titleEn,
    "slug": slug.current,
    excerpt,
    excerptEn,
    content,
    contentEn,
    image,
    category,
    author,
    date,
    readTime,
    tags
  }
`

// Get all slugs for static generation
export const allSlugsQuery = groq`
  *[_type == "article"] {
    "slug": slug.current
  }
`
