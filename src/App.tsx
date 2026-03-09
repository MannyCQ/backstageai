import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuth } from './hooks/useAuth';
import { useProfile } from './hooks/useProfile';
import { useOutreach } from './hooks/useOutreach';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { Outreach } from './pages/Outreach';
import { Pricing } from './pages/Pricing';
import './App.css';

function AppContent() {
  const { user, loading, signIn, signUp, signOut } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useProfile(user?.id);
  const { outreach, loading: outreachLoading, addOutreach, updateOutreach, deleteOutreach } = useOutreach(user?.id);

  return (
    <>
      <Navbar user={user} onSignOut={signOut} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login onSignIn={signIn} />} />
          <Route path="/signup" element={<Signup onSignUp={signUp} />} />
          <Route path="/pricing" element={<Pricing profile={profile} />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute user={user} loading={loading}>
                <Dashboard profile={profile} outreach={outreach} loading={profileLoading || outreachLoading} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute user={user} loading={loading}>
                <Profile profile={profile} loading={profileLoading} onUpdate={updateProfile} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/outreach"
            element={
              <ProtectedRoute user={user} loading={loading}>
                <Outreach
                  outreach={outreach}
                  loading={outreachLoading}
                  onAdd={addOutreach}
                  onUpdate={updateOutreach}
                  onDelete={deleteOutreach}
                />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
