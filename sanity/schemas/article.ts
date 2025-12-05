import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'article',
    title: 'Article',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title (ID)',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'titleEn',
            title: 'Title (EN)',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'titleEn',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'excerpt',
            title: 'Excerpt (ID)',
            type: 'text',
            rows: 3,
        }),
        defineField({
            name: 'excerptEn',
            title: 'Excerpt (EN)',
            type: 'text',
            rows: 3,
        }),
        defineField({
            name: 'content',
            title: 'Content (ID)',
            type: 'text',
            description: 'Markdown content in Indonesian',
        }),
        defineField({
            name: 'contentEn',
            title: 'Content (EN)',
            type: 'text',
            description: 'Markdown content in English',
        }),
        defineField({
            name: 'image',
            title: 'Featured Image URL',
            type: 'url',
            description: 'External image URL (e.g., Unsplash)',
        }),
        defineField({
            name: 'category',
            title: 'Category',
            type: 'string',
            options: {
                list: [
                    { title: 'Web Development', value: 'Web Development' },
                    { title: 'UI/UX Design', value: 'UI/UX Design' },
                    { title: 'Business', value: 'Business' },
                    { title: 'Backend', value: 'Backend' },
                    { title: 'Security', value: 'Security' },
                    { title: 'Technology', value: 'Technology' },
                    { title: 'Digital Marketing', value: 'Digital Marketing' },
                ],
            },
        }),
        defineField({
            name: 'author',
            title: 'Author',
            type: 'string',
        }),
        defineField({
            name: 'date',
            title: 'Publish Date',
            type: 'date',
        }),
        defineField({
            name: 'readTime',
            title: 'Read Time (minutes)',
            type: 'number',
        }),
        defineField({
            name: 'tags',
            title: 'Tags',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                layout: 'tags',
            },
        }),
    ],
    preview: {
        select: {
            title: 'titleEn',
            subtitle: 'category',
            date: 'date',
        },
        prepare({ title, subtitle, date }) {
            return {
                title,
                subtitle: `${subtitle} • ${date}`,
            }
        },
    },
})
