import { useState } from 'react'
import { BrowserRouter,Routes,Route } from "react-router-dom";
import Register from './components/Register';
import Login from './components/Login';
import ProtectedRoute from "./ProtectedRoute";
import JobListPage from './components/JobListPage';
import ApplyPage from './components/ApplyPage';
import HomePage from './components/HomePage';
import CompanyPage from './pages/CompanyPage';
import JobPage from './pages/JobPage';
import MyApplications from './components/MyApplications';
import ApplicationDetail  from './components/ApplicationDetail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ServicesPage from './pages/ServicesPage';
import ServicesPageO from './components/ServicesPageO';

function App() {
 
  return (
    <BrowserRouter>
      <Routes>
       <Route path='/' element={<HomePage/>}/>
       <Route path='/job' element={<JobPage/>}/>
       <Route path='/company' element={<CompanyPage/>}/>
       <Route path='/register' element={<Register/>}/>
       <Route path='/login' element={<Login/>}/>
       <Route path='/forgot-password' element={<ForgotPassword />} />
       <Route path='/reset-password/:token' element={<ResetPassword />} />
      <Route path='/services' element={<ServicesPage/>}/>
       <Route path='/jobs' element={<ProtectedRoute>
      <JobListPage />
       </ProtectedRoute> }/>
      <Route  path='/apply/:jobId' element={
       <ProtectedRoute>
        <ApplyPage />
      </ProtectedRoute>}/>
      <Route path="/application" element={<ProtectedRoute>
    <MyApplications /></ProtectedRoute> } />
     <Route path="/application/:id" element={ <ProtectedRoute>
   <ApplicationDetail /> </ProtectedRoute>} />
       <Route path="/services1" element={ <ProtectedRoute>
       <ServicesPageO />
       </ProtectedRoute> } />
        

    </Routes>
  </BrowserRouter>   
)
}

export default App




