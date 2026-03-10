import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import Artists from './pages/Artists/Artists.tsx';
import Booking from './pages/Booking/Booking.tsx';
import Auth from './pages/Auth/Auth.tsx';
import ArtistProfile from './pages/ArtistProfile/ArtistProfile.tsx';
import ClientDashboard from './pages/Dashboard/ClientDashboard.tsx';
import ArtistDashboard from './pages/Dashboard/ArtistDashboard.tsx';
import AdminPanel from './pages/Admin/AdminPanel.tsx';
import Confirmation from './pages/Confirmation/Confirmation.tsx';
import NotFound from './pages/NotFound/NotFound.tsx';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="*" element={
                    <>
                        <Navbar />
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/artists" element={<Artists />} />
                            <Route path="/booking/:artistId" element={<Booking />} />
                            <Route path="/auth" element={<Auth />} />
                            <Route path="/artist/:username" element={<ArtistProfile />} />
                            <Route path="/dashboard/client" element={<ClientDashboard />} />
                            <Route path="/dashboard/artist" element={<ArtistDashboard />} />
                            <Route path="/confirmation" element={<Confirmation />} />
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
