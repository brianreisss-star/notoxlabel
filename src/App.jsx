import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import Onboarding from './components/onboarding/Onboarding';
import Dashboard from './components/dashboard/Dashboard';
import ScanPage from './components/scan/ScanPage';
import ResultsPage from './components/results/ResultsPage';
import ProfilePage from './components/profile/ProfilePage';
import AuthPage from './components/auth/AuthPage';
import PlansPage from './components/plans/PlansPage';
import NotFound from './components/common/NotFound';
import ErrorBoundary from './components/common/ErrorBoundary';
import ReferralPage from './components/growth/ReferralPage';
import CommunityPage from './components/community/CommunityPage';
import EvolutionPage from './components/profile/EvolutionPage';
import LegalPage from './components/legal/LegalPage';
import SecurityPage from './components/legal/SecurityPage';
import AdminDashboard from './components/admin/AdminDashboard';
import ProfessionalDashboard from './components/professional/ProfessionalDashboard';
import BlogPage from './components/blog/BlogPage';
import LandingPage from './components/marketing/LandingPage';
import PaymentSuccessPage from './components/payment/PaymentSuccessPage';

import HistoryPage from './components/history/HistoryPage';

const ProtectedRoute = ({ children }) => {
    const { user } = useUser();
    // Entry point is now Auth
    if (!user) {
        return <Navigate to="/auth" replace />;
    }
    return children;
};

// Handle OAuth Redirects
const AuthCallback = () => {
    const { setUser } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Get the hash fragment from URL (Supabase returns tokens in hash)
                const hashParams = new URLSearchParams(window.location.hash.substring(1));
                const accessToken = hashParams.get('access_token');

                if (accessToken) {
                    // Store token and get user info
                    localStorage.setItem('notoxlabel_token', accessToken);

                    // Fetch user data from Supabase
                    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/auth/v1/user`, {
                        headers: {
                            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
                            'Authorization': `Bearer ${accessToken}`
                        }
                    });

                    if (response.ok) {
                        const userData = await response.json();
                        localStorage.setItem('notoxlabel_user', JSON.stringify(userData));
                        setUser(userData);

                        // Redirect to dashboard after successful auth
                        setTimeout(() => navigate('/'), 500);
                    } else {
                        throw new Error('Failed to fetch user data');
                    }
                } else {
                    throw new Error('No access token found');
                }
            } catch (error) {
                console.error('OAuth callback error:', error);
                // Redirect to auth page on error
                setTimeout(() => navigate('/auth'), 1500);
            }
        };

        handleCallback();
    }, [setUser, navigate]);

    return (
        <div className="h-screen flex items-center justify-center bg-white font-sans">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                <p className="text-gray-900 font-extrabold text-3xl tracking-tighter">Conectando...</p>
                <p className="text-gray-400 text-sm mt-3 font-medium italic">A verdade agora faz parte de você.</p>
            </div>
        </div>
    );
};

const AppRoutes = () => {
    const { user } = useUser();

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans">
            <Routes>
                {/* Public & Entry Routes */}
                <Route path="/" element={user ? <Dashboard /> : <LandingPage />} />
                <Route path="/landing" element={<LandingPage />} />
                <Route path="/auth" element={user ? <Navigate to="/" /> : <AuthPage />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/scan" element={<ProtectedRoute><ScanPage /></ProtectedRoute>} />
                <Route path="/results" element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="/plans" element={<ProtectedRoute><PlansPage /></ProtectedRoute>} />
                <Route path="/referral" element={<ProtectedRoute><ReferralPage /></ProtectedRoute>} />
                <Route path="/community" element={<ProtectedRoute><CommunityPage /></ProtectedRoute>} />
                <Route path="/evolution" element={<ProtectedRoute><EvolutionPage /></ProtectedRoute>} />
                <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
                <Route path="/legal" element={<ProtectedRoute><LegalPage /></ProtectedRoute>} />
                <Route path="/security" element={<ProtectedRoute><SecurityPage /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                <Route path="/professional" element={<ProtectedRoute><ProfessionalDashboard /></ProtectedRoute>} />
                <Route path="/blog" element={<ProtectedRoute><BlogPage /></ProtectedRoute>} />
                <Route path="/payment-success" element={<ProtectedRoute><PaymentSuccessPage /></ProtectedRoute>} />

                {/* Fallback */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    );
};

function App() {
    return (
        <ErrorBoundary>
            <UserProvider>
                <AppRoutes />
            </UserProvider>
        </ErrorBoundary>
    );
}

export default App;
