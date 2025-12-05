import { createClient } from 'next-sanity'

export const projectId = 'zdgfq7md'
export const dataset = 'production'
export const apiVersion = '2024-01-01'

// Read-only client (for fetching published content)
export const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: true,
})

// Write client (for importing/creating/updating data)
export const writeClient = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
})
