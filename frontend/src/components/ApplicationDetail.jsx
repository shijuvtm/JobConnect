import { useEffect, useState } from "react";
import { useParams, useNavigate,NavLink } from "react-router-dom";
import axios from "axios";

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const username = localStorage.getItem("username") || "User";
  useEffect(() => {
    const fetchDetail = async () => {
      const token = localStorage.getItem("access");
      try {
        setLoading(true);
        const res = await axios.get(`http://127.0.0.1:8000/my-application/${id}/`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        setApp(res.data);
      } catch (err) {
        console.error("API Error:", err.response || err);
        setError(err.response?.status === 404 ? "Application not found" : "Failed to load details");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetail();
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600"></div>
    </div>
  );

  if (error) return (
    <div className="text-center py-20">
      <h2 className="text-xl font-semibold text-red-600">{error}</h2>
      <button onClick={() => navigate(-1)} className="mt-4 text-blue-600 underline">Go Back</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
        <header className="border-b bg-white sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold text-blue-700">JobConnect</h1>

          <nav className="hidden md:flex text-sm font-medium text-gray-700">
            <NavLink to="/jobs" className="hover:text-blue-700 transition px-12">Jobs</NavLink>
            <NavLink to="/services" className="hover:text-blue-700 transition px-30">Companies</NavLink>
            <NavLink to="/application" className="hover:text-blue-700 transition ">My Applications</NavLink>
            <NavLink to="/login" onClick={() => { localStorage.clear();}} className="hover:text-blue-700 transition">Logout</NavLink>
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

            <span className="hidden sm:inline text-sm text-gray-600 font-medium">Hello ,{username}</span>

            {/* Login Symbol / User Icon */}
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
         <NavLink to="/application" className="block text-sm font-medium text-gray-700 hover:text-blue-700">My Applications </NavLink>
         <NavLink to="/login" onClick={() => { localStorage.clear(); }} className="block text-sm font-medium text-gray-700 hover:text-blue-700" >Logout</NavLink>
       </nav>
      )}
      </header> 
     <header className="bg-white border-b px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate("/application")} className="text-blue-700 font-medium flex items-center gap-1">
            ← Back to Applications
          </button>
          <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-100">
            ID: {id}
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">{app?.job_title}</h1>
            <p className="text-lg text-blue-600 font-medium">{app?.company}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 uppercase font-bold">Location</p>
              <p className="text-gray-800">{app?.location}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 uppercase font-bold">Salary</p>
              <p className="text-gray-800">{app?.salary}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 uppercase font-bold">Status</p>
              <p className="font-bold text-blue-700">{app?.status?.toUpperCase()}</p>
            </div>
          </div>

          <div className="space-y-6">
            <section>
              <h4 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">Job Description</h4>
              <p className="text-gray-600 whitespace-pre-line">
                {app?.job_description || "No description available."}
              </p>
            </section>

            <section>
              <h4 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">Application Notes</h4>
              <p className="text-gray-600 bg-yellow-50 p-4 rounded-lg italic">
                {app?.notes || "You didn't leave any notes for this application."}
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ApplicationDetail;
