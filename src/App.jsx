import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import ErrorBoundary from './components/common/ErrorBoundary';

// Lazy-loaded pages for code splitting
const Onboarding = lazy(() => import('./components/onboarding/Onboarding'));
const Dashboard = lazy(() => import('./components/dashboard/Dashboard'));
const ScanPage = lazy(() => import('./components/scan/ScanPage'));
const ResultsPage = lazy(() => import('./components/results/ResultsPage'));
const ProfilePage = lazy(() => import('./components/profile/ProfilePage'));
const AuthPage = lazy(() => import('./components/auth/AuthPage'));
const PlansPage = lazy(() => import('./components/plans/PlansPage'));
const NotFound = lazy(() => import('./components/common/NotFound'));
const ReferralPage = lazy(() => import('./components/growth/ReferralPage'));
const CommunityPage = lazy(() => import('./components/community/CommunityPage'));
const EvolutionPage = lazy(() => import('./components/profile/EvolutionPage'));
const LegalPage = lazy(() => import('./components/legal/LegalPage'));
const SecurityPage = lazy(() => import('./components/legal/SecurityPage'));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'));
const ProfessionalDashboard = lazy(() => import('./components/professional/ProfessionalDashboard'));
const BlogPage = lazy(() => import('./components/blog/BlogPage'));
const LandingPage = lazy(() => import('./components/marketing/LandingPage'));
const PaymentSuccessPage = lazy(() => import('./components/payment/PaymentSuccessPage'));
const HistoryPage = lazy(() => import('./components/history/HistoryPage'));

// Loading fallback
const PageLoader = () => (
    <div className="h-screen flex items-center justify-center bg-white font-sans">
        <div className="text-center">
            <div className="w-10 h-10 border-3 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400 text-sm font-medium">Carregando...</p>
        </div>
    </div>
);

const ProtectedRoute = ({ children }) => {
    const { user, profile, loading } = useUser();

    if (loading) return <PageLoader />;

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
                const hashParams = new URLSearchParams(window.location.hash.substring(1));
                const accessToken = hashParams.get('access_token');

                if (accessToken) {
                    localStorage.setItem('notoxlabel_token', accessToken);

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
                        setTimeout(() => navigate('/'), 500);
                    } else {
                        throw new Error('Failed to fetch user data');
                    }
                } else {
                    throw new Error('No access token found');
                }
            } catch (error) {
                console.error('OAuth callback error:', error);
                setTimeout(() => navigate('/auth'), 1500);
            }
        };

        handleCallback();
    }, [setUser, navigate]);

    return <PageLoader />;
};

const AppRoutes = () => {
    const { user } = useUser();

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans">
            <Suspense fallback={<PageLoader />}>
                <Routes>
                    {/* Public & Entry Routes */}
                    <Route path="/" element={user ? <Dashboard /> : <LandingPage />} />
                    <Route path="/landing" element={<LandingPage />} />
                    <Route path="/auth" element={user ? <Navigate to="/" /> : <AuthPage />} />
                    <Route path="/auth/callback" element={<AuthCallback />} />
                    <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
                    <Route path="/scan" element={<ProtectedRoute><ScanPage /></ProtectedRoute>} />
                    <Route path="/results" element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} />
                    <Route path="/results/:scanId" element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                    <Route path="/plans" element={<ProtectedRoute><PlansPage /></ProtectedRoute>} />
                    <Route path="/referral" element={<ProtectedRoute><ReferralPage /></ProtectedRoute>} />
                    <Route path="/community" element={<ProtectedRoute><CommunityPage /></ProtectedRoute>} />
                    <Route path="/evolution" element={<ProtectedRoute><EvolutionPage /></ProtectedRoute>} />
                    <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
                    <Route path="/legal" element={<LegalPage />} />
                    <Route path="/security" element={<SecurityPage />} />
                    <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                    <Route path="/professional" element={<ProtectedRoute><ProfessionalDashboard /></ProtectedRoute>} />
                    <Route path="/blog" element={<ProtectedRoute><BlogPage /></ProtectedRoute>} />
                    <Route path="/payment-success" element={<ProtectedRoute><PaymentSuccessPage /></ProtectedRoute>} />

                    {/* Fallback */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
        </div>
    );
};

function App() {
    return (
        <ErrorBoundary>
            <UserProvider>
                <HashTokenHandler />
                <AppRoutes />
            </UserProvider>
        </ErrorBoundary>
    );
}

// Global listener for access tokens in Hash (Supabase redirects)
const HashTokenHandler = () => {
    const { setUser } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        const checkHash = async () => {
            const hash = window.location.hash;
            if (hash && (hash.includes('access_token=') || hash.includes('type=recovery'))) {
                const params = new URLSearchParams(hash.substring(1));
                const accessToken = params.get('access_token');

                if (accessToken) {
                    localStorage.setItem('notoxlabel_token', accessToken);

                    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
                    if (!supabaseUrl) return;

                    const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
                        headers: {
                            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || '',
                            'Authorization': `Bearer ${accessToken}`
                        }
                    });

                    if (response.ok) {
                        const userData = await response.json();
                        localStorage.setItem('notoxlabel_user', JSON.stringify(userData));
                        setUser(userData);
                        window.history.replaceState(null, null, window.location.pathname);
                        navigate('/onboarding');
                    }
                }
            }
        };
        checkHash();

        window.addEventListener('hashchange', checkHash);
        return () => window.removeEventListener('hashchange', checkHash);
    }, [setUser, navigate]);

    return null;
};

export default App;
