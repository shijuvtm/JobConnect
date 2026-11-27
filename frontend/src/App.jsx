import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from './components/Register';
import Login from './components/Login';
import ProtectedRoute from "./ProtectedRoute";
import JobListPage from './components/JobListPage';
import ApplyPage from './components/ApplyPage';
import HomePage from './components/HomePage';
import CompanyPage from './pages/CompanyPage';
import MyApplications from './components/MyApplications';
import ApplicationDetail from './components/ApplicationDetail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ServicesPage from './pages/ServicesPage';
import VoiceInterview from './pages/VoiceInterview';
import EmployerRegister from './components/EmployerRegister';
import EmployerDashboard from './components/EmployerDashboard';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/job' element={<ProtectedRoute role="job_seeker"><JobListPage /></ProtectedRoute>} />
        <Route path='/company' element={<CompanyPage />} />
        <Route path='/register' element={<Register />} />
        <Route path='/register/employer' element={<EmployerRegister />} />
        <Route path='/login' element={<Login />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password/:token' element={<ResetPassword />} />
        <Route path='/services' element={<ProtectedRoute>
          <ServicesPage />
        </ProtectedRoute>} />
        <Route path='/jobs' element={<ProtectedRoute role="job_seeker">
          <JobListPage />
        </ProtectedRoute>} />
        <Route path='/employer/dashboard' element={<ProtectedRoute role="employer">
          <EmployerDashboard />
        </ProtectedRoute>} />
        <Route path='/apply/:jobId' element={
          <ProtectedRoute role="job_seeker">
            <ApplyPage />
          </ProtectedRoute>} />
        <Route path="/application" element={<ProtectedRoute role="job_seeker">
          <MyApplications /></ProtectedRoute>} />
        <Route path="/application/:id" element={<ProtectedRoute role="job_seeker">
          <ApplicationDetail /> </ProtectedRoute>} />
        <Route path="/voice-interview" element={<ProtectedRoute>
          <VoiceInterview />
        </ProtectedRoute>} />


      </Routes>
    </BrowserRouter>
  )
}

export default App




