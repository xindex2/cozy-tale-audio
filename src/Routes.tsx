import { lazy, Suspense } from 'react';
import { Routes as RouterRoutes, Route } from 'react-router-dom';
import { LoadingScreen } from '@/components/ui/loading-screen';
import AuthGuard from '@/components/auth/AuthGuard';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import Stories from '@/pages/Stories';
import Story from '@/pages/Story';
import CreateStory from '@/pages/CreateStory';
import Chat from '@/pages/Chat';
import Quiz from '@/pages/Quiz';
import Pricing from '@/pages/Pricing';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';

// Lazy load the Billing page
const Billing = lazy(() => import('@/pages/Billing'));

export default function Routes() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <RouterRoutes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <AuthGuard>
              <Dashboard />
            </AuthGuard>
          }
        />
        <Route
          path="/stories"
          element={
            <AuthGuard>
              <Stories />
            </AuthGuard>
          }
        />
        <Route
          path="/story/:id"
          element={
            <AuthGuard>
              <Story />
            </AuthGuard>
          }
        />
        <Route
          path="/create"
          element={
            <AuthGuard>
              <CreateStory />
            </AuthGuard>
          }
        />
        <Route
          path="/chat"
          element={
            <AuthGuard>
              <Chat />
            </AuthGuard>
          }
        />
        <Route
          path="/quiz"
          element={
            <AuthGuard>
              <Quiz />
            </AuthGuard>
          }
        />
        <Route path="/pricing" element={<Pricing />} />
        <Route
          path="/settings"
          element={
            <AuthGuard>
              <Settings />
            </AuthGuard>
          }
        />
        <Route
          path="/billing"
          element={
            <AuthGuard>
              <Billing />
            </AuthGuard>
          }
        />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
    </Suspense>
  );
}