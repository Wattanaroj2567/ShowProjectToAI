import React, { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import AppLayout from '@/components/layout/AppLayout.jsx'
import { AuthProvider } from '@/contexts/AuthContext.jsx'
import ProtectedRoute from '@/components/layout/ProtectedRoute.jsx'
import Loading from '@/components/common/Loading.jsx'

const Home = lazy(() => import('@/pages/Home.jsx'))
const BookDetail = lazy(() => import('@/pages/BookDetail.jsx'))
const Login = lazy(() => import('@/pages/Login.jsx'))
const Register = lazy(() => import('@/pages/Register.jsx'))
const Profile = lazy(() => import('@/pages/Profile.jsx'))
const NotFound = lazy(() => import('@/pages/NotFound.jsx'))
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword.jsx'))
const ResetPassword = lazy(() => import('@/pages/ResetPassword.jsx'))

export default function App() {
  return (
    <AuthProvider>
      <AppLayout>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/book/:id" element={<BookDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AppLayout>
    </AuthProvider>
  )
}
