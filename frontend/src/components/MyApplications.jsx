import { useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { API_URL } from '../config';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const username = localStorage.getItem("username") || "User";

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    axios.get(`${API_URL}/my-application/`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => setApplications(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'shortlisted': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold text-blue-700">JobConnect</h1>

          <nav className="hidden md:flex text-sm font-medium text-gray-700 items-center">
            <NavLink to="/jobs" className="hover:text-blue-700 transition px-6">Jobs</NavLink>
            <NavLink to="/services" className="hover:text-blue-700 transition px-6">Services</NavLink>
            <NavLink to="/application" className="hover:text-blue-700 transition px-6">My Applications</NavLink>
            <NavLink to="/login" onClick={() => { localStorage.clear(); }} className="hover:text-blue-700 transition px-6">Logout</NavLink>
          </nav>

          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-1 text-gray-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>

            <span className="hidden sm:inline text-sm text-gray-600 font-medium">Hello, {username}</span>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700 border border-blue-200">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden border-t bg-white px-4 py-4 space-y-3 shadow-inner">
            <NavLink to="/jobs" className="block text-sm font-medium text-gray-700 hover:text-blue-700">Jobs</NavLink>
            <NavLink to="/services" className="block text-sm font-medium text-gray-700 hover:text-blue-700">Services</NavLink>
            <NavLink to="/application" className="block text-sm font-medium text-gray-700 hover:text-blue-700">My Applications</NavLink>
            <NavLink to="/login" onClick={() => { localStorage.clear(); }} className="block text-sm font-medium text-gray-700 hover:text-blue-700">Logout</NavLink>
          </nav>
        )}
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">My Applications</h3>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
            <p className="text-gray-500">No applications found.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {applications.map(app => (
              <div key={app.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="text-lg font-semibold text-gray-900">{app.job_title}</h5>
                    <p className="text-gray-600 mb-2">
                      <span className="font-medium">{app.company}</span> • {app.location}
                    </p>

                    <div className="flex gap-2 mb-3">
                      <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600">
                        {app.experience}
                      </span>
                      <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-green-50 text-green-700">
                        {app.salary}
                      </span>
                    </div>
                  </div>

                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getStatusStyles(app.status)}`}>
                    {(app.status || 'pending').toUpperCase()}
                  </span>
                </div>

                <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                  <small className="text-gray-400 italic">
                    Applied on {new Date(app.applied_on).toLocaleDateString()}
                  </small>
                  <NavLink to={`/application/${app.id}`} className="text-blue-600 text-sm font-medium hover:underline">
                    View Details
                  </NavLink>

                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyApplications;
