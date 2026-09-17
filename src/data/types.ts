export interface UserProfile {
  id: string
  name: string
  email: string
  gender: string
  occupation: string
  countryOfResidence: string
  origin: string
  destination: string
  preferredTravelType: string
  vaccinationStatus: string
  locationSharing: boolean
  notifications: boolean
  companions: string
  travelMeans: string
  avatarUrl?: string
}

export interface QuestionnaireOptions {
  genders: string[]
  companions: string[]
  travelMeans: string[]
  travelTypes: string[]
  countries: string[]
  destinations: string[]
  vaccinationOptions: string[]
}

export interface BorderLink {
  id: string
  title: string
  body: string
}

export interface BorderSection {
  id: string
  title: string
  links: BorderLink[]
}

export interface BordersData {
  country: string
  flagEmoji: string
  bannerTitle: string
  sections: BorderSection[]
}

export interface Stay {
  id: string
  name: string
  neighborhood: string
  address: string
  rating: number
  priceFrom: number
  currency: string
  website: string
  phone: string
  petFriendly: boolean
  amenities: string[]
  lat: number
  lng: number
  imageUrl: string
  description: string
}

export interface StaySearchDefaults {
  location: string
  checkIn: string
  checkOut: string
  checkInLabel: string
  checkOutLabel: string
  rooms: number
  guests: number
  petFriendly: boolean
  heading: string
}

export interface ExplorePlace {
  id: string
  name: string
  category: string
  categories: string[]
  address: string
  description: string
  lat: number
  lng: number
  imageUrl: string
  hours: string
}

export interface FlightInfo {
  flightNumber: string
  airline: string
  from: string
  to: string
  departureDate: string
  departureTime: string
  departureLabel: string
  checkInBefore: string
  boarding: string
  gate: string
  class: string
  seat: string
  status: string
  terminal: string
  passengerName: string
  confirmationCode: string
}

export interface AirportCategory {
  id: string
  title: string
  summary: string
  imageUrl: string
  tips: string[]
}

export interface BookingInfo {
  hotelConfirmation: string
  hotelName: string
  checkIn: string
  checkOut: string
  rooms: number
  guests: number
  flightSummary: string
  notes: string
}

export interface TransportOption {
  id: string
  name: string
  detail: string
  tips: string
}

export interface TripData {
  flight: FlightInfo
  airport: {
    name: string
    code: string
    categories: AirportCategory[]
  }
  booking: BookingInfo
  transportation: TransportOption[]
}

export interface Review {
  id: string
  author: string
  placeName: string
  placeId: string
  placeType: 'stay' | 'explore'
  rating: number
  date: string
  text: string
}

export interface MyPlacesData {
  stays: string[]
  places: string[]
}

export interface ContentData {
  about: { title: string; body: string }
  contact: { title: string; email: string; website: string; body: string }
  workWithUs: { title: string; body: string }
  settings: { title: string; items: { id: string; label: string; value: string }[] }
  copyright: string
}
