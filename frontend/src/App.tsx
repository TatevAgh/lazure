import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Home from './pages/Home/Home'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import Artists from './pages/Artists/Artists'
import Booking from './pages/Booking/Booking'
import Auth from './pages/Auth/Auth'
import ArtistProfile from './pages/ArtistProfile/ArtistProfile'
import ClientDashboard from './pages/Dashboard/ClientDashboard'
import ArtistDashboard from './pages/Dashboard/ArtistDashboard'
import AdminPanel from './pages/Admin/AdminPanel'
import AdminLogin from './pages/AdminLogin/AdminLogin'
import Confirmation from './pages/Confirmation/Confirmation'
import NotFound from './pages/NotFound/NotFound'
import Services from './pages/Services/Services'
import About from './pages/About/About'

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation()
    const token = localStorage.getItem('lazure_token')
    if (!token) {
        return <Navigate to="/auth" state={{ redirectTo: location.pathname }} replace />
    }
    return <>{children}</>
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminPanel />} />

                <Route path="*" element={
                    <>
                        <Navbar />
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/artists" element={<Artists />} />
                            <Route path="/services" element={<Services />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/artist/:username" element={<ArtistProfile />} />
                            <Route path="/auth" element={<Auth />} />
                            <Route path="/confirmation" element={<Confirmation />} />

                            <Route path="/booking/:artistId" element={
                                <RequireAuth>
                                    <Booking />
                                </RequireAuth>
                            } />
                            <Route path="/dashboard/client" element={
                                <RequireAuth>
                                    <ClientDashboard />
                                </RequireAuth>
                            } />
                            <Route path="/dashboard/artist" element={
                                <RequireAuth>
                                    <ArtistDashboard />
                                </RequireAuth>
                            } />

                            <Route path="*" element={<NotFound />} />
                        </Routes>
                        <Footer />
                    </>
                } />
            </Routes>
        </BrowserRouter>
    )
}

export default App
