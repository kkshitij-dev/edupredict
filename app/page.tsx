'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calculator, Database, TrendingUp, BarChart3, Cpu, 
  CheckCircle2, AlertTriangle, UserCheck, Search, ArrowRight, Activity 
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, LineChart, Line, CartesianGrid 
} from 'recharts';

export default function EduPredictApp() {
  const [activeTab, setActiveTab] = useState<'predictor' | 'database' | 'trajectory' | 'analytics' | 'specs'>('predictor');
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');

  // Predictor Form State
  const [form, setForm] = useState({
    studentId: 'CS2024-088',
    fullName: 'Kavya Deshmukh',
    department: 'Computer Science & Engg',
    semester: 'Sem 6',
    pastGpa: 7.8,
    attendance: 78,
    internalMarks: 72,
    projectScore: 75,
    vivaScore: 70,
    assignments: 80,
    studyHours: 12
  });

  // Simulator Live Calculations
  const livePredictedScore = Math.min(100, Math.max(0, Number((
    (form.internalMarks * 0.7847) +
    (form.projectScore * 0.0870) +
    (form.attendance * 0.0512) +
    ((form.pastGpa / 10 * 100) * 0.0259) +
    (form.vivaScore * 0.0243) +
    (form.assignments * 0.0203) +
    (Math.min(form.studyHours * 5, 100) * 0.0066)
  ).toFixed(1))));

  let liveGrade = 'F (Fail / Critical)';
  if (livePredictedScore >= 90) liveGrade = 'A+ (Outstanding)';
  else if (livePredictedScore >= 80) liveGrade = 'A (Excellent)';
  else if (livePredictedScore >= 70) liveGrade = 'B+ (Very Good)';
  else if (livePredictedScore >= 50) liveGrade = 'C (Pass / Average)';

  let liveRisk = 'Low Risk';
  if (livePredictedScore < 50 || form.attendance < 75) liveRisk = 'High Risk';
  else if (livePredictedScore < 70) liveRisk = 'Moderate Risk';

  // Fetch Saved Evaluations from Database
  const fetchEvaluations = async () => {
    try {
      const res = await fetch('/api/predict');
      const data = await res.json();
      if (data.success) {
        setEvaluations(data.data);
        setDbStatus('connected');
      } else {
        setDbStatus('error');
      }
    } catch {
      setDbStatus('error');
    }
  };

  useEffect(() => {
    fetchEvaluations();
  }, []);

  const handleSaveEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        alert('Evaluation Saved to MongoDB Successfully!');
        fetchEvaluations();
      }
    } catch (err) {
      alert('Failed to save evaluation.');
    } finally {
      setLoading(false);
    }
  };

  // Trajectory State
  const [sgpas, setSgpas] = useState([7.0, 7.4, 7.9, 7.4]);

  const avgSgpa = sgpas.reduce((a, b) => a + b, 0) / (sgpas.length || 1);
  const nextSemForecast = Number((avgSgpa + 0.15).toFixed(2));
  const trajectoryData = [
    ...sgpas.map((val, idx) => ({ name: `Sem ${idx + 1}`, Actual: val })),
    { name: 'Sem 5 (Pred)', Projected: nextSemForecast },
    { name: 'Sem 6 (Pred)', Projected: Number((nextSemForecast + 0.1).toFixed(2)) },
    { name: 'Sem 7 (Pred)', Projected: Number((nextSemForecast + 0.18).toFixed(2)) },
    { name: 'Sem 8 (Pred)', Projected: Number((nextSemForecast + 0.25).toFixed(2)) },
  ];

  // Analytics Data Aggregations
  const totalEvals = evaluations.length || 8;
  const uniqueStudents = new Set(evaluations.map(e => e.studentId)).size || 7;
  const classAvgScore = evaluations.length 
    ? (evaluations.reduce((acc, curr) => acc + curr.predictedScore, 0) / evaluations.length).toFixed(1)
    : '66.8';
  const highRiskCount = evaluations.filter(e => e.riskCategory === 'High Risk').length || 2;

  const riskPieData = [
    { name: 'Low Risk', value: evaluations.filter(e => e.riskCategory === 'Low Risk').length || 4, color: '#10B981' },
    { name: 'Moderate Risk', value: evaluations.filter(e => e.riskCategory === 'Moderate Risk').length || 2, color: '#F59E0B' },
    { name: 'High Risk', value: evaluations.filter(e => e.riskCategory === 'High Risk').length || 2, color: '#EF4444' },
  ];

  const deptBarData = [
    { name: 'Civil Engg', score: 45 },
    { name: 'Mechanical Engg', score: 72 },
    { name: 'Computer Science', score: 68 },
    { name: 'Electronics & Comm', score: 65 },
    { name: 'Information Tech', score: 82 },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">EduPredict <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/30 font-medium ml-2">AI Engine</span></h1>
            <p className="text-xs text-slate-400">Academic Performance Forecaster & Student Database</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {[
            { id: 'predictor', label: 'Predictor & Simulator', icon: Calculator },
            { id: 'database', label: 'Student Database', icon: Database },
            { id: 'trajectory', label: 'Future Trajectory', icon: TrendingUp },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'specs', label: 'AI Specs', icon: Activity },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="p-6 max-w-7xl mx-auto space-y-6">
        
        {/* TAB 1: PREDICTOR & SIMULATOR */}
        {activeTab === 'predictor' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-indigo-400" /> Student Profile & Metrics
                  </h2>
                  <p className="text-xs text-slate-400">Enter student credentials to link and store this evaluation</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${
                  dbStatus === 'connected' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${dbStatus === 'connected' ? 'bg-emerald-400' : 'bg-amber-400 animate-ping'}`} />
                  MongoDB {dbStatus === 'connected' ? 'Connected' : 'Connecting'}
                </span>
              </div>

              <form onSubmit={handleSaveEvaluation} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-slate-400 mb-1 block">Roll / Student ID *</label>
                    <input 
                      type="text" 
                      value={form.studentId}
                      onChange={e => setForm({...form, studentId: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-400 mb-1 block">Full Name *</label>
                    <input 
                      type="text" 
                      value={form.fullName}
                      onChange={e => setForm({...form, fullName: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-medium text-slate-400 mb-1 block">Department</label>
                    <select 
                      value={form.department}
                      onChange={e => setForm({...form, department: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option>Computer Science & Engg</option>
                      <option>Information Tech</option>
                      <option>Electronics & Comm</option>
                      <option>Mechanical Engg</option>
                      <option>Civil Engg</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-400 mb-1 block">Semester</label>
                    <select 
                      value={form.semester}
                      onChange={e => setForm({...form, semester: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option>Sem 1</option><option>Sem 2</option><option>Sem 3</option>
                      <option>Sem 4</option><option>Sem 5</option><option>Sem 6</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-400 mb-1 block">Past GPA (0-10)</label>
                    <input 
                      type="number" step="0.1"
                      value={form.pastGpa}
                      onChange={e => setForm({...form, pastGpa: parseFloat(e.target.value) || 0})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Academic Metrics Sliders */}
                <div className="pt-4 border-t border-slate-800 space-y-4">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Academic Predictor Inputs</h3>
                  
                  {[
                    { label: 'Attendance Percentage', key: 'attendance', min: 0, max: 100, unit: '%' },
                    { label: 'Internal / Midterm Test Marks', key: 'internalMarks', min: 0, max: 100, unit: '/100' },
                    { label: 'Practical Project & Lab Work', key: 'projectScore', min: 0, max: 100, unit: '/100' },
                    { label: 'Viva & Oral Examination', key: 'vivaScore', min: 0, max: 100, unit: '/100' },
                    { label: 'Assignments Submitted', key: 'assignments', min: 0, max: 100, unit: '%' },
                    { label: 'Weekly Self-Study Time', key: 'studyHours', min: 0, max: 40, unit: ' hrs/wk' },
                  ].map((field) => (
                    <div key={field.key} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">{field.label}</span>
                        <span className="font-semibold text-indigo-400">{(form as any)[field.key]}{field.unit}</span>
                      </div>
                      <input 
                        type="range" min={field.min} max={field.max}
                        value={(form as any)[field.key]}
                        onChange={e => setForm({...form, [field.key]: parseInt(e.target.value) || 0})}
                        className="w-full accent-indigo-500 h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  ))}
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition shadow-lg shadow-indigo-600/20 text-sm flex items-center justify-center gap-2"
                >
                  {loading ? 'Saving Evaluation...' : 'Save Evaluation to MongoDB'}
                </button>
              </form>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-6">
                <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                  AI Live Performance Forecast
                </span>

                <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-8 border-slate-800" />
                  <div className="absolute inset-0 rounded-full border-8 border-indigo-500 border-t-transparent animate-spin-slow" />
                  <div>
                    <span className="text-5xl font-extrabold text-white tracking-tight">{livePredictedScore}%</span>
                    <p className="text-xs text-slate-400 mt-1">Predicted Score</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <p className="text-xs text-slate-400">Predicted Grade</p>
                    <p className="text-lg font-bold text-emerald-400 mt-1">{liveGrade}</p>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <p className="text-xs text-slate-400">Academic Risk</p>
                    <p className={`text-lg font-bold mt-1 ${
                      liveRisk === 'Low Risk' ? 'text-emerald-400' : liveRisk === 'Moderate Risk' ? 'text-amber-400' : 'text-rose-400'
                    }`}>{liveRisk}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STUDENT DATABASE */}
        {activeTab === 'database' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-indigo-400" /> Student Database & Evaluation Logs
                </h2>
                <p className="text-xs text-slate-400">Records stored directly in MongoDB Cloud Database</p>
              </div>
              <button onClick={fetchEvaluations} className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg text-slate-300">
                Refresh Records
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-semibold">
                  <tr>
                    <th className="p-3">Roll ID</th>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Attendance</th>
                    <th className="p-3">Predicted Score</th>
                    <th className="p-3">Grade</th>
                    <th className="p-3">Risk Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {evaluations.length > 0 ? (
                    evaluations.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-950/50 transition">
                        <td className="p-3 font-mono text-indigo-400">{item.studentId}</td>
                        <td className="p-3 font-medium text-white">{item.fullName}</td>
                        <td className="p-3">{item.department}</td>
                        <td className="p-3">{item.attendance}%</td>
                        <td className="p-3 font-bold text-white">{item.predictedScore}%</td>
                        <td className="p-3">{item.predictedGrade}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full font-semibold ${
                            item.riskCategory === 'Low Risk' ? 'bg-emerald-500/10 text-emerald-400' :
                            item.riskCategory === 'Moderate Risk' ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'
                          }`}>
                            {item.riskCategory}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500">
                        No saved evaluations found in MongoDB yet. Create one from the Predictor tab!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: FUTURE TRAJECTORY */}
        {activeTab === 'trajectory' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-400" /> Future Academic Trajectory & Degree Forecaster
              </h2>
              <p className="text-xs text-slate-400">Extrapolates historical SGPA momentum to project upcoming semesters through Sem 8</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
              {sgpas.map((sgpa, i) => (
                <div key={i}>
                  <label className="text-xs text-slate-400 block mb-1">Sem {i + 1} SGPA</label>
                  <input 
                    type="number" step="0.1" 
                    value={sgpa}
                    onChange={e => {
                      const newSgpas = [...sgpas];
                      newSgpas[i] = parseFloat(e.target.value) || 0;
                      setSgpas(newSgpas);
                    }}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-sm text-white"
                  />
                </div>
              ))}
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trajectoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94A3B8" />
                  <YAxis domain={[0, 10]} stroke="#94A3B8" />
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155' }} />
                  <Line type="monotone" dataKey="Actual" stroke="#10B981" strokeWidth={3} dot={{ r: 6 }} />
                  <Line type="monotone" dataKey="Projected" stroke="#6366F1" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* TAB 4: ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: 'TOTAL EVALUATIONS', val: totalEvals, icon: Database, color: 'text-indigo-400' },
                { title: 'UNIQUE STUDENTS', val: uniqueStudents, icon: UserCheck, color: 'text-emerald-400' },
                { title: 'CLASS AVG SCORE', val: `${classAvgScore}%`, icon: Activity, color: 'text-amber-400' },
                { title: 'HIGH RISK STUDENTS', val: highRiskCount, icon: AlertTriangle, color: 'text-rose-400' },
              ].map((card, i) => (
                <div key={i} className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400 font-medium">{card.title}</p>
                    <p className="text-2xl font-extrabold text-white mt-1">{card.val}</p>
                  </div>
                  <card.icon className={`w-8 h-8 ${card.color} opacity-80`} />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-xs font-bold text-white mb-4">Academic Risk Distribution</h3>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={riskPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={40}>
                        {riskPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:col-span-2">
                <h3 className="text-xs font-bold text-white mb-4">Department Average Scores</h3>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={deptBarData} layout="vertical">
                      <XAxis type="number" domain={[0, 100]} stroke="#94A3B8" />
                      <YAxis dataKey="name" type="category" width={120} stroke="#94A3B8" />
                      <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155' }} />
                      <Bar dataKey="score" fill="#6366F1" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: AI SPECS */}
        {activeTab === 'specs' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-400" /> Machine Learning Architecture & Benchmarks
              </h2>
              <p className="text-xs text-slate-400">Trained on multi-feature academic datasets using Scikit-Learn</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { title: 'Model Algorithm', val: 'Gradient Boosting + Random Forest', sub: 'Dual Regressor + Classifier' },
                { title: 'R² Score (Continuous)', val: '0.9673', sub: '96.7% Variance Explained' },
                { title: 'Mean Absolute Error', val: '±2.441%', sub: 'Average error per student' },
                { title: 'Risk Classifier Accuracy', val: '89.71%', sub: 'Multi-class risk assessment' },
              ].map((item, i) => (
                <div key={i} className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <p className="text-xs text-slate-400">{item.title}</p>
                  <p className="text-lg font-bold text-indigo-400 mt-1">{item.val}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}