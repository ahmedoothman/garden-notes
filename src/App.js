import React, { Suspense, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
//import './App.css';
import './App.module.scss';
import RoutingLoadSpin from './components/UI/Spinners/RoutingLoadSpin';
import SignInForm from './pages/AuthPages/SignInForm';
import SignUpForm from './pages/AuthPages/SignUpForm';
import ForgetPasswordForm from './pages/AuthPages/ForgetPasswordForm';
import GardenList from './pages/DashboardPages/Garden';
import Settings from './pages/DashboardPages/Settings/Settings';
import Inventory from './pages/DashboardPages/Inventory';
import Notes from './pages/DashboardPages/Notes';
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const AuthPage = React.lazy(() => import('./pages/AuthPages'));
const ResetPassword = React.lazy(() =>
  import('./pages/AuthPages/ResetPassword')
);
const VerifyEmail = React.lazy(() => import('./pages/AuthPages/VerifyEmail'));
const Dashboard = React.lazy(() => import('./pages/DashboardPages'));

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
        <Route path='/dashboard/*' element={<Dashboard />}>
          <Route path='garden' element={<GardenList title='Garden' />}></Route>
          <Route
            path='inventory'
            element={<Inventory title='Inventory' />}
          ></Route>
          <Route path='notes' element={<Notes title='Inventory' />}></Route>
          <Route
            path='settings'
            element={<Settings title='Settings' />}
          ></Route>
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
