import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'article',
    title: 'Artikel',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Judul Artikel',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
            description: 'URL artikel (klik Generate untuk auto-generate)',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'excerpt',
            title: 'Ringkasan',
            type: 'text',
            rows: 3,
            description: 'Ringkasan singkat artikel',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'content',
            title: 'Konten Artikel',
            type: 'text',
            description: 'Konten lengkap (format Markdown)',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'image',
            title: 'Gambar Utama',
            type: 'url',
            description: 'URL gambar (contoh: dari Unsplash)',
        }),
        defineField({
            name: 'category',
            title: 'Kategori',
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
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'author',
            title: 'Penulis',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'date',
            title: 'Tanggal Publish',
            type: 'date',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'readTime',
            title: 'Waktu Baca (menit)',
            type: 'number',
            validation: (Rule) => Rule.required().min(1),
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
            title: 'title',
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
