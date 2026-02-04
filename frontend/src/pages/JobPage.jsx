import { MapPin, Briefcase, IndianRupee, Clock, ArrowRight } from "lucide-react";
import { NavLink } from "react-router-dom";

const jobs = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: `Software Engineer ${i + 1}`,
  company: ["SuperNova", "CodeCraft", "PixelWorks", "NextGen", "TechHive"][i % 5],
  location: ["Chennai", "Bangalore", "Hyderabad", "Pune", "Remote"][i % 5],
  salary: "₹4 – 10 LPA",
  type: ["Full Time", "Remote", "Hybrid"][i % 3],
  posted: "2 days ago",
}));

export default function JobPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header with Stats */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Latest Openings
            </h1>
            <p className="text-slate-500 mt-1">Find your next challenge among {jobs.length} curated roles.</p>
          </div>
          <div className="flex gap-2">
            <span className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-medium shadow-sm">
              ✨ Newest First
            </span>
          </div>
        </div>

        {/* Job Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="group relative flex flex-col bg-white rounded-3xl border border-slate-100 p-1 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300"
            >
              <div className="p-6">
                {/* Top Section: Role & Time */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                    <Clock size={12} /> {job.posted}
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                    job.type === 'Remote' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {job.type}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                  {job.title}
                </h2>
                <p className="text-slate-500 font-medium mt-1">{job.company}</p>

                {/* Tags */}
                <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={16} className="text-slate-400" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Briefcase size={16} className="text-slate-400" />
                    {job.type}
                  </div>
                </div>
              </div>

              {/* Bottom "Action" Bar */}
              <div className="mt-auto bg-slate-50/80 rounded-b-[22px] p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Salary Range</p>
                  <p className="text-slate-900 font-bold flex items-center gap-1">
                    {job.salary}
                  </p>
                </div>
                
                <NavLink 
                  to="/register" 
                  className="inline-flex items-center justify-center h-11 w-11 rounded-full bg-white text-slate-900 border border-slate-200 shadow-sm group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300"
                >
                  <ArrowRight size={20} />
                </NavLink>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
