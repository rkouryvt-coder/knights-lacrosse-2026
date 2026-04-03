import { createServerFn } from '@tanstack/react-start'

export interface MediaItem {
  type: 'video' | 'article'
  title: string
  url: string
  thumbnail?: string
  date: string
  source: string
}

const YT_CHANNEL_ID = 'UCXHIF0zpRElqppM-OiuC5Pg'
const YT_RSS = `https://www.youtube.com/feeds/videos.xml?channel_id=${YT_CHANNEL_ID}`
const PROSPECTOR_RSS = 'https://prospectornow.com/?s=lacrosse&feed=rss2'

function parseXmlText(xml: string, tag: string): string {
  const m = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'))
  return m ? m[1].replace(/<[^>]*>/g, '').trim() : ''
}

function parseXmlAttr(xml: string, tag: string, attr: string): string {
  const m = xml.match(new RegExp(`<${tag}[^>]*\\s${attr}="([^"]*)"`, 'i'))
  return m ? m[1] : ''
}

function splitEntries(xml: string, tag: string): string[] {
  const re = new RegExp(`<${tag}[\\s>][\\s\\S]*?<\\/${tag}>`, 'gi')
  return xml.match(re) ?? []
}

async function fetchYouTube(): Promise<MediaItem[]> {
  try {
    const res = await fetch(YT_RSS, { signal: AbortSignal.timeout(8000) })
    if (!res.ok) return []
    const xml = await res.text()
    return splitEntries(xml, 'entry')
      .slice(0, 15)
      .map((entry) => {
        const videoId = parseXmlText(entry, 'yt:videoId')
        const title = parseXmlText(entry, 'title')
        const published = parseXmlText(entry, 'published')
        const thumbnail = videoId
          ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
          : undefined
        return {
          type: 'video' as const,
          title,
          url: `https://www.youtube.com/watch?v=${videoId}`,
          thumbnail,
          date: published,
          source: 'PHSKnightTV',
        }
      })
      .filter((v) => {
        if (!v.title) return false
        const t = v.title.toLowerCase()
        return t.includes('lacrosse') && !t.includes('girls') && !t.includes("women's")
      })
  } catch {
    return []
  }
}

async function fetchProspector(): Promise<MediaItem[]> {
  try {
    const res = await fetch(PROSPECTOR_RSS, { signal: AbortSignal.timeout(8000) })
    if (!res.ok) return []
    const xml = await res.text()
    return splitEntries(xml, 'item')
      .slice(0, 3)
      .map((item) => {
        const title = parseXmlText(item, 'title')
        const link = parseXmlText(item, 'link') || parseXmlAttr(item, 'link', 'href')
        const pubDate = parseXmlText(item, 'pubDate')
        // Try to get thumbnail from media:content or enclosure
        const thumbnail =
          parseXmlAttr(item, 'media:content', 'url') ||
          parseXmlAttr(item, 'enclosure', 'url') ||
          undefined
        return {
          type: 'article' as const,
          title,
          url: link,
          thumbnail,
          date: pubDate ? new Date(pubDate).toISOString() : '',
          source: 'Prospector Now',
        }
      })
      .filter((a) => {
        if (!a.title || !a.url) return false
        const t = a.title.toLowerCase()
        return t.includes('lacrosse') && !t.includes('girls') && !t.includes("women's")
      })
  } catch {
    return []
  }
}

export const getMediaFeed = createServerFn({ method: 'GET' }).handler(async () => {
  const [videos, articles] = await Promise.all([fetchYouTube(), fetchProspector()])
  // Merge and sort by date descending
  return [...videos, ...articles].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
})
