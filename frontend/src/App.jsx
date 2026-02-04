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
function App() {
 
  return (
    <BrowserRouter>
      <Routes>
       <Route path='/' element={<HomePage/>}/>
       <Route path='/job' element={<JobPage/>}/>
       <Route path='/company' element={<CompanyPage/>}/>
       <Route path='/register' element={<Register/>}/>
       <Route path='/login' element={<Login/>}/>
       <Route path='/jobs' element={<ProtectedRoute>
      <JobListPage />
       </ProtectedRoute> }/>
      <Route  path='/apply/:jobId' element={
       <ProtectedRoute>
        <ApplyPage />
      </ProtectedRoute>}/>
    </Routes>
  </BrowserRouter>   
)
}

export default App




