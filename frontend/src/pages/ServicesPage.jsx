import React from 'react';
import { NavLink } from 'react-router-dom';
export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* HERO */}
      <section className="bg-blue-600 text-white py-14 px-4 text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
          Smart Career Services 🚀
        </h1>
        <p className="text-sm sm:text-base max-w-2xl mx-auto">
          AI-powered tools to improve your resume, prepare for interviews,
          and boost your career growth.
        </p>
      </section>

      {/* SERVICES GRID */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid gap-6 
                        grid-cols-1 
                        sm:grid-cols-2 
                        lg:grid-cols-3">

          {/* Resume Score */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition duration-300">
            <h2 className="text-lg font-semibold mb-3">
              🤖 AI Resume Score Checker
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              Upload your resume and get instant AI scoring,
              keyword suggestions, and ATS optimization tips.
            </p>
            <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
              Check Resume
            </button>
          </div>

          {/* Mock Interview */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition duration-300">
            <h2 className="text-lg font-semibold mb-3">
              🎤 AI Mock Interview
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              Practice HR and technical interviews with AI-generated
              questions and real-time feedback.
            </p>
            <button className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700">
              Start Interview
            </button>
          </div>

          {/* Skill Gap */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition duration-300">
            <h2 className="text-lg font-semibold mb-3">
              📊 Skill Gap Analyzer
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              Compare your skills with job requirements and
              receive a personalized learning roadmap.
            </p>
            <button className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700">
              Analyze Skills
            </button>
          </div>

          {/* Resume Builder */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition duration-300 sm:col-span-2 lg:col-span-1">
            <h2 className="text-lg font-semibold mb-3">
              📄 Smart Resume Builder
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              Create professional ATS-friendly resumes using
              AI templates and smart suggestions.
            </p>
            <button className="w-full bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700">
              Build Resume
            </button>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-100 py-12 text-center px-4">
        <h3 className="text-xl sm:text-2xl font-bold mb-4">
          Ready to level up your career?
        </h3>
        <NavLink
          to="/register"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
        >
          Get Started
        </NavLink>
      </section>

    </div>
  );
}
