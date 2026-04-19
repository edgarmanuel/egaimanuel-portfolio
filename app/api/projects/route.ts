import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export const revalidate = 86400 // ISR 24hr — refreshes at midnight via Vercel cron

export async function GET() {
  const projectsDir = path.join(process.cwd(), 'projects')

  if (!fs.existsSync(projectsDir)) {
    return NextResponse.json([])
  }

  const files = fs.readdirSync(projectsDir).filter(f => f.endsWith('.md'))

  const projects = files.map(filename => {
    const raw = fs.readFileSync(path.join(projectsDir, filename), 'utf-8')
    const { data, content } = matter(raw)
    return {
      slug: filename.replace('.md', ''),
      title: data.title ?? '',
      tags: data.tags ?? [],
      metric: data.metric ?? '',
      metricLabel: data.metricLabel ?? '',
      status: data.status ?? 'completed',
      screenshot: data.screenshot ?? null,
      description: content.trim(),
    }
  })

  return NextResponse.json(projects)
}
