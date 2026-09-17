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

async function loadJson<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}data/${path}`)
  if (!res.ok) throw new Error(`Failed to load ${path}`)
  return res.json() as Promise<T>
}

export const dataClient = {
  getUser: () => loadJson<UserProfile>('user.json'),
  getQuestionnaireOptions: () => loadJson<QuestionnaireOptions>('questionnaire-options.json'),
  getBorders: () => loadJson<BordersData>('borders.json'),
  getStays: () => loadJson<Stay[]>('stays.json'),
  getStaySearchDefaults: () => loadJson<StaySearchDefaults>('stay-search-defaults.json'),
  getExplore: () => loadJson<ExplorePlace[]>('explore.json'),
  getExploreCategories: () => loadJson<string[]>('explore-categories.json'),
  getTrip: () => loadJson<TripData>('trip.json'),
  getReviews: () => loadJson<Review[]>('reviews.json'),
  getMyPlaces: () => loadJson<MyPlacesData>('my-places.json'),
  getContent: () => loadJson<ContentData>('content.json'),
}
