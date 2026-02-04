import { Building2, MapPin, ArrowUpRight } from "lucide-react";
import { NavLink } from "react-router-dom";

const companies = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `Company ${i + 1}`,
  industry: ["Product", "Service", "Startup", "AI", "FinTech", "EdTech"][i % 6],
  location: ["Chennai", "Bangalore", "Hyderabad", "Pune", "Delhi", "Remote"][i % 6],
}));

export default function CompanyPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              Featured Companies
            </h1>
            <p className="text-slate-500 mt-2 text-lg">
              Discover your next career move at world-class workplaces.
            </p>
          </div>
          <div className="text-sm font-medium text-slate-400">
            Showing {companies.length} Results
          </div>
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {companies.map((company) => (
            <NavLink
              key={company.id}
              to="/job"
              className="group relative flex flex-col bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-400 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)]"
            >
              {/* Icon Section */}
              <div className="flex items-center justify-between mb-8">
                <div className="w-12 h-12 flex items-center justify-center bg-slate-50 rounded-xl text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <Building2 size={24} />
                </div>
                <ArrowUpRight size={20} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              </div>

              {/* Text Content */}
              <div className="mb-6">
                <h2 className="text-lg font-bold text-slate-900 mb-1">
                  {company.name}
                </h2>
                <p className="text-sm font-medium text-blue-600/80 uppercase tracking-wider">
                  {company.industry}
                </p>
              </div>

              {/* Footer Detail */}
              <div className="mt-auto pt-4 border-t border-slate-50 flex items-center gap-2 text-slate-500">
                <MapPin size={16} />
                <span className="text-sm font-medium">{company.location}</span>
              </div>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}
