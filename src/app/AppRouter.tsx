import { useState } from 'react'
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { BottomTabBar } from '../components/BottomTabBar'
import { MenuDrawer } from '../components/MenuDrawer'
import { LoginPage } from '../pages/LoginPage'
import { SignUpPage } from '../pages/SignUpPage'
import { BusinessComingSoonPage } from '../pages/BusinessComingSoonPage'
import { QuestionnairePage } from '../pages/QuestionnairePage'
import { BordersPage, BorderArticlePage } from '../pages/BordersPage'
import { StaysPage, StaysMapPage, StayDetailPage } from '../pages/StaysPage'
import {
  OnTheWayPage,
  FlightPage,
  AirportHubPage,
  AirportCategoryPage,
  BookingPage,
  TransportPage,
} from '../pages/OnTheWayPage'
import { ExplorePage, ExploreMapPage, PlaceDetailPage } from '../pages/ExplorePage'
import {
  ProfilePage,
  ProfileEditPage,
  TravelDocumentPage,
  VaccinationPage,
} from '../pages/ProfilePage'
import {
  MyPlacesPage,
  MyReviewsPage,
  ContactPage,
  WorkWithUsPage,
  SettingsPage,
  AboutPage,
} from '../pages/MenuPages'

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { session, ready, questionnaireDone } = useAuth()
  const location = useLocation()

  if (!ready) return <div className="loading">Loading…</div>
  if (!session?.authenticated) return <Navigate to="/login" replace state={{ from: location }} />
  if (session.role === 'business' && location.pathname !== '/business-coming-soon') {
    return <Navigate to="/business-coming-soon" replace />
  }
  if (
    !questionnaireDone &&
    !location.pathname.startsWith('/questionnaire') &&
    location.pathname !== '/business-coming-soon'
  ) {
    return <Navigate to="/questionnaire" replace />
  }
  return children
}

function GuestOnly({ children }: { children: React.ReactNode }) {
  const { session, ready, questionnaireDone } = useAuth()
  if (!ready) return <div className="loading">Loading…</div>
  if (session?.authenticated) {
    if (session.role === 'business') return <Navigate to="/business-coming-soon" replace />
    if (!questionnaireDone) return <Navigate to="/questionnaire" replace />
    return <Navigate to="/borders" replace />
  }
  return children
}

function AppShell() {
  const location = useLocation()
  const hideTabs =
    location.pathname.startsWith('/login') ||
    location.pathname.startsWith('/signup') ||
    location.pathname.startsWith('/questionnaire') ||
    location.pathname.startsWith('/business-coming-soon')

  return (
    <div className="app-root">
      <div className="phone-shell">
        <Outlet />
        {!hideTabs ? <BottomTabBar /> : null}
      </div>
    </div>
  )
}

function withMenu(Page: React.ComponentType<{ onMenu: () => void }>) {
  return function Wrapped() {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Page onMenu={() => setOpen(true)} />
        <MenuDrawer open={open} onClose={() => setOpen(false)} />
      </>
    )
  }
}

const Borders = withMenu(BordersPage)
const Stays = withMenu(StaysPage)
const OnTheWay = withMenu(OnTheWayPage)
const Explore = withMenu(ExplorePage)
const Profile = withMenu(ProfilePage)

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route
          path="/login"
          element={
            <GuestOnly>
              <LoginPage />
            </GuestOnly>
          }
        />
        <Route
          path="/signup"
          element={
            <GuestOnly>
              <SignUpPage />
            </GuestOnly>
          }
        />
        <Route path="/business-coming-soon" element={<BusinessComingSoonPage />} />
        <Route
          path="/questionnaire"
          element={
            <RequireAuth>
              <QuestionnairePage />
            </RequireAuth>
          }
        />

        <Route
          path="/"
          element={
            <RequireAuth>
              <Navigate to="/borders" replace />
            </RequireAuth>
          }
        />
        <Route
          path="/borders"
          element={
            <RequireAuth>
              <Borders />
            </RequireAuth>
          }
        />
        <Route
          path="/borders/:articleId"
          element={
            <RequireAuth>
              <BorderArticlePage />
            </RequireAuth>
          }
        />
        <Route
          path="/stays"
          element={
            <RequireAuth>
              <Stays />
            </RequireAuth>
          }
        />
        <Route
          path="/stays/map"
          element={
            <RequireAuth>
              <StaysMapPage />
            </RequireAuth>
          }
        />
        <Route
          path="/stays/:id"
          element={
            <RequireAuth>
              <StayDetailPage />
            </RequireAuth>
          }
        />
        <Route
          path="/on-the-way"
          element={
            <RequireAuth>
              <OnTheWay />
            </RequireAuth>
          }
        />
        <Route
          path="/on-the-way/flight"
          element={
            <RequireAuth>
              <FlightPage />
            </RequireAuth>
          }
        />
        <Route
          path="/on-the-way/airport"
          element={
            <RequireAuth>
              <AirportHubPage />
            </RequireAuth>
          }
        />
        <Route
          path="/on-the-way/airport/:categoryId"
          element={
            <RequireAuth>
              <AirportCategoryPage />
            </RequireAuth>
          }
        />
        <Route
          path="/on-the-way/booking"
          element={
            <RequireAuth>
              <BookingPage />
            </RequireAuth>
          }
        />
        <Route
          path="/on-the-way/transport"
          element={
            <RequireAuth>
              <TransportPage />
            </RequireAuth>
          }
        />
        <Route
          path="/explore"
          element={
            <RequireAuth>
              <Explore />
            </RequireAuth>
          }
        />
        <Route
          path="/explore/map"
          element={
            <RequireAuth>
              <ExploreMapPage />
            </RequireAuth>
          }
        />
        <Route
          path="/explore/:id"
          element={
            <RequireAuth>
              <PlaceDetailPage />
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />
        <Route
          path="/profile/edit"
          element={
            <RequireAuth>
              <ProfileEditPage />
            </RequireAuth>
          }
        />
        <Route
          path="/profile/travel-document"
          element={
            <RequireAuth>
              <TravelDocumentPage />
            </RequireAuth>
          }
        />
        <Route
          path="/profile/vaccination"
          element={
            <RequireAuth>
              <VaccinationPage />
            </RequireAuth>
          }
        />
        <Route
          path="/my-places"
          element={
            <RequireAuth>
              <MyPlacesPage />
            </RequireAuth>
          }
        />
        <Route
          path="/my-reviews"
          element={
            <RequireAuth>
              <MyReviewsPage />
            </RequireAuth>
          }
        />
        <Route
          path="/contact"
          element={
            <RequireAuth>
              <ContactPage />
            </RequireAuth>
          }
        />
        <Route
          path="/work-with-us"
          element={
            <RequireAuth>
              <WorkWithUsPage />
            </RequireAuth>
          }
        />
        <Route
          path="/settings"
          element={
            <RequireAuth>
              <SettingsPage />
            </RequireAuth>
          }
        />
        <Route
          path="/about"
          element={
            <RequireAuth>
              <AboutPage />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
