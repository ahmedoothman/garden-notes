import React, { Suspense, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
//import './App.css';
import './App.module.scss';
import RoutingLoadSpin from './components/UI/RoutingLoadSpin';
import SignInForm from './components/Auth/SignInForm';
import SignUpForm from './components/Auth/SignUpForm';
import ForgetPasswordForm from './components/Auth/ForgetPasswordForm';

const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const AuthPage = React.lazy(() => import('./pages/AuthPage'));
const ResetPassword = React.lazy(() => import('./pages/ResetPassword'));
const VerifyEmail = React.lazy(() => import('./pages/VerifyEmail'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));

function App() {
  return (
    <Suspense fallback={<RoutingLoadSpin />}>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/authentication/*' element={<AuthPage />}>
          <Route path='sign-in' element={<SignInForm />}></Route>
          <Route path='sign-up' element={<SignUpForm />}></Route>
          <Route
            path='forget-password'
            element={<ForgetPasswordForm />}
          ></Route>
        </Route>
        <Route path='/reset-password/:resetToken' element={<ResetPassword />} />
        <Route path='/verify-email/:verifyToken' element={<VerifyEmail />} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
    </Suspense>
  );
}

export default App;
