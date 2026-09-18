import type {
  BordersData,
  ContentData,
  ExplorePlace,
  MyPlacesData,
  QuestionnaireOptions,
  Review,
  Stay,
  StaySearchDefaults,
  TripData,
  UserProfile,
} from './types'

const BASE = import.meta.env.BASE_URL

/** Resolve JSON image paths against Vite BASE_URL (GitHub Pages `/dtp-webapp/`). */
export function assetUrl(path: string): string {
  if (!path) return path
  if (/^https?:\/\//i.test(path) || path.startsWith('data:')) return path
  const clean = path.replace(/^\//, '')
  return `${BASE}${clean}`
}

function withAssetUrl<T extends { imageUrl: string }>(item: T): T {
  return { ...item, imageUrl: assetUrl(item.imageUrl) }
}

async function loadJson<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}data/${path}`)
  if (!res.ok) throw new Error(`Failed to load ${path}`)
  return res.json() as Promise<T>
}

export const dataClient = {
  getUser: () => loadJson<UserProfile>('user.json'),
  getQuestionnaireOptions: () => loadJson<QuestionnaireOptions>('questionnaire-options.json'),
  getBorders: async () => {
    const data = await loadJson<BordersData>('borders.json')
    return { ...data, items: data.items.map(withAssetUrl) }
  },
  getStays: async () => {
    const stays = await loadJson<Stay[]>('stays.json')
    return stays.map(withAssetUrl)
  },
  getStaySearchDefaults: () => loadJson<StaySearchDefaults>('stay-search-defaults.json'),
  getExplore: async () => {
    const places = await loadJson<ExplorePlace[]>('explore.json')
    return places.map(withAssetUrl)
  },
  getExploreCategories: () => loadJson<string[]>('explore-categories.json'),
  getTrip: async () => {
    const trip = await loadJson<TripData>('trip.json')
    return {
      ...trip,
      airport: {
        ...trip.airport,
        categories: trip.airport.categories.map(withAssetUrl),
      },
    }
  },
  getReviews: () => loadJson<Review[]>('reviews.json'),
  getMyPlaces: () => loadJson<MyPlacesData>('my-places.json'),
  getContent: () => loadJson<ContentData>('content.json'),
}
