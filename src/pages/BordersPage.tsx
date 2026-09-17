import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { dataClient } from '../data/client'
import type { BordersData } from '../data/types'
import { Header } from '../components/Header'

interface BordersPageProps {
  onMenu: () => void
}

export function BordersPage({ onMenu }: BordersPageProps) {
  const [data, setData] = useState<BordersData | null>(null)

  useEffect(() => {
    void dataClient.getBorders().then(setData)
  }, [])

  if (!data) return <div className="loading">Loading…</div>

  return (
    <div className="page with-tabs with-header">
      <Header title="Borders" showMenu onMenu={onMenu} />
      <div className="banner">
        <span style={{ marginRight: 8 }}>{data.flagEmoji}</span>
        {data.bannerTitle}
      </div>
      {data.sections.map((section) => (
        <section key={section.id} className="section-block">
          <h2 className="h2">{section.title}</h2>
          {section.links.map((link) => (
            <Link key={link.id} className="list-link" to={`/borders/article/${link.id}`}>
              {link.title}
            </Link>
          ))}
        </section>
      ))}
    </div>
  )
}

export function BorderArticlePage() {
  const { articleId } = useParams()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  useEffect(() => {
    void dataClient.getBorders().then((data) => {
      for (const section of data.sections) {
        const found = section.links.find((l) => l.id === articleId)
        if (found) {
          setTitle(found.title)
          setBody(found.body)
          return
        }
      }
      setTitle('Article')
      setBody('Content not found.')
    })
  }, [articleId])

  return (
    <div className="page with-tabs with-header">
      <Header title="Borders" showBack backTo="/borders" />
      <h1 className="h1">{title}</h1>
      <p className="muted" style={{ lineHeight: 1.55 }}>
        {body}
      </p>
    </div>
  )
}
