import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './sanity/schemas'

export default defineConfig({
    name: 'vorca-studio',
    title: 'Vorca Studio CMS',
    projectId: 'zdgfq7md',
    dataset: 'production',
    basePath: '/studio',
    plugins: [structureTool()],
    schema: {
        types: schemaTypes,
    },
})
