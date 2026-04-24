import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Area, AreaChart, CartesianGrid, Cell, Legend, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis, LineChart, Line,
} from "recharts";
import { Download, Search, X, LayoutDashboard, Users, Eye, ShieldAlert, Settings, ChevronRight, Copy, Check } from "lucide-react";

// ── Brand ────────────────────────────────────────────────────────────────────
const BRAND = "#1652F0";
const SIDEBAR_BG = "#0F172A";

// ── Mock data ────────────────────────────────────────────────────────────────
const TENANT = { name: "UFF African Agri Investments BV", domain: "signature-agri.nl" };

const USERS = [
  { name: "Duncan Vink",      email: "duncan.vink@signature-agri.nl",      title: "Unknown", dept: "Unknown",          activeDays: 3,  prompts: 28, maturity: "Developing", apps: ["copilot","teams","word","excel","powerpoint","outlook"] },
  { name: "Erwin Bouland",    email: "erwin.bouland@signature-agri.nl",    title: "Unknown", dept: "Unknown",          activeDays: 10, prompts: 30, maturity: "Advanced",   apps: ["copilot","teams","outlook","powerpoint"] },
  { name: "Hannah Young",     email: "Hannah.Young@signature-agri.nl",     title: "Unknown", dept: "Unknown",          activeDays: 4,  prompts: 43, maturity: "Advanced",   apps: ["copilot","teams","word","excel","outlook","onenote"] },
  { name: "Hidde Brinkman",   email: "Hidde.brinkman@signature-agri.nl",   title: "Unknown", dept: "Unknown",          activeDays: 6,  prompts: 44, maturity: "Intermediate",apps: ["copilot","teams","word","excel","powerpoint","outlook","loop"] },
  { name: "Ilhaam Sage",      email: "ilhaam.sage@signature-agri.nl",      title: "Unknown", dept: "Unknown",          activeDays: 0,  prompts: 0,  maturity: "Inactive",   apps: [] },
  { name: "Jeroen Lutters",   email: "jeroen.lutters@signature-agri.nl",   title: "Unknown", dept: "Unknown",          activeDays: 1,  prompts: 1,  maturity: "Developing", apps: ["copilot","teams","outlook"] },
  { name: "Theo van der Veen",email: "theo.van.der.veen@signature-agri.nl",title: "Unknown", dept: "Unknown",          activeDays: 3,  prompts: 11, maturity: "Developing", apps: ["copilot","teams","outlook"] },
  { name: "Tsito Raharison",  email: "Tsito.Raharison@signature-agri.nl",  title: "Unknown", dept: "Unknown",          activeDays: 8,  prompts: 48, maturity: "Advanced",   apps: ["copilot","teams","word","excel","powerpoint","outlook","onenote"] },
  { name: "Zahn Venter",      email: "Zahn.Venter@signature-agri.nl",      title: "Unknown", dept: "Unknown",          activeDays: 10, prompts: 41, maturity: "Advanced",   apps: ["copilot","teams","word","excel","powerpoint","outlook"] },
  { name: "Amara Diallo",     email: "amara.diallo@signature-agri.nl",     title: "Unknown", dept: "Unknown",          activeDays: 0,  prompts: 0,  maturity: "Inactive",   apps: [] },
  { name: "Pieter Claassen",  email: "pieter.claassen@signature-agri.nl",  title: "Unknown", dept: "Unknown",          activeDays: 2,  prompts: 9,  maturity: "Developing", apps: ["copilot","outlook"] },
];

const LICENSING = { purchased: 19, unassigned: 8, notActive: 1, noLicense: 7 };
const ADOPTION_SCORE = 33.59;

const MATURITY_DATA = [
  { name: "Advanced",     value: 8,  color: "#22C55E" },
  { name: "Intermediate", value: 2,  color: "#3B82F6" },
  { name: "Developing",   value: 0,  color: "#EAB308" },
  { name: "Inactive",     value: 8,  color: "#9CA3AF" },
];

const SHADOW_APPS = [
  { name: "Anthropic Claude",              users: 35, sessions: 4688,  data: "202.99 GB", risk: 2, category: "AI Assistant" },
  { name: "Superhuman Grammarly",          users: 4,  sessions: 39089, data: "939.58 MB", risk: 1, category: "Writing" },
  { name: "v0",                            users: 7,  sessions: 7438,  data: "766 MB",    risk: 1, category: "Dev AI" },
  { name: "ChatGPT (Consumer & Enterprise)",users: 34, sessions: 2599,  data: "513.8 MB",  risk: 1, category: "AI Assistant" },
  { name: "ElevenLabs",                    users: 8,  sessions: 387,   data: "281.71 MB", risk: 3, category: "Audio AI" },
  { name: "Gamma App",                     users: 5,  sessions: 266,   data: "210.33 MB", risk: 4, category: "Presentations" },
  { name: "Freepik",                       users: 9,  sessions: 122,   data: "170.25 MB", risk: 2, category: "Image AI" },
  { name: "Perplexity",                    users: 12, sessions: 891,   data: "142.6 MB",  risk: 2, category: "Search AI" },
  { name: "Midjourney",                    users: 3,  sessions: 44,    data: "98.4 MB",   risk: 3, category: "Image AI" },
];

// Generate 30-day M365 area chart data
function buildAreaData() {
  const apps = ["Teams","Outlook","Word","Excel","PowerPoint","Copilot Chat"];
  const bases = [7, 5, 4, 3, 2, 4];
  const rows = [];
  const now = new Date("2026-04-24");
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    const label = `${d.getMonth()+1}/${d.getDate()}`;
    const row: Record<string, number | string> = { date: label };
    apps.forEach((app, idx) => {
      const base = bases[idx];
      const noise = Math.sin(i * 0.7 + idx) * base * 0.4;
      row[app] = Math.max(0, Math.round((base + noise) * (isWeekend ? 0.3 : 1)));
    });
    rows.push(row);
  }
  return rows;
}
const AREA_DATA = buildAreaData();

// Adoption score trend (single data point with trend line)
const SCORE_TREND = Array.from({ length: 8 }, (_, i) => ({
  week: `W${i+1}`, score: Math.round(20 + i * 2 + (i > 5 ? 2 : 0)),
}));

const APP_COLORS: Record<string, string> = {
  Teams: "#F59E0B", Outlook: "#06B6D4", Word: "#3B82F6",
  Excel: "#22C55E", PowerPoint: "#EF4444", "Copilot Chat": "#A855F7",
};

const APP_ICONS: Record<string, { bg: string; text: string; label: string }> = {
  copilot:     { bg: "#7C3AED", text: "C",  label: "Copilot" },
  teams:       { bg: "#5B50BD", text: "T",  label: "Teams" },
  word:        { bg: "#1E4DB7", text: "W",  label: "Word" },
  excel:       { bg: "#1D6F42", text: "X",  label: "Excel" },
  powerpoint:  { bg: "#B7472A", text: "P",  label: "PowerPoint" },
  outlook:     { bg: "#0078D4", text: "O",  label: "Outlook" },
  onenote:     { bg: "#7B1FA2", text: "N",  label: "OneNote" },
  loop:        { bg: "#0078D4", text: "L",  label: "Loop" },
};

const MATURITY_COLORS: Record<string, string> = {
  Advanced: "#16A34A", Intermediate: "#2563EB", Developing: "#CA8A04", Inactive: "#9CA3AF",
};

const riskColor = (r: number) =>
  r <= 1 ? "#22C55E" : r === 2 ? "#F59E0B" : r === 3 ? "#F97316" : "#EF4444";

// ── Sub-components ────────────────────────────────────────────────────────────
const StatBox = ({ label, value, sub }: { label: string; value: number | string; sub?: string }) => (
  <div className="flex items-baseline gap-2">
    <span className="text-2xl font-bold text-gray-900">{value}</span>
    <span className="text-sm text-gray-500">{label}</span>
    {sub && <span className="ml-auto text-xs text-gray-400">{sub}</span>}
  </div>
);

// ── Views ─────────────────────────────────────────────────────────────────────
const CopilotAdoptionView = () => {
  const [copied, setCopied] = useState(false);
  const insightText = `Analysis of the M365 Copilot adoption data reveals that among licensed users, engagement levels are highly variable. While several users demonstrate consistent and recent activity across multiple Copilot-integrated apps — such as Word, Outlook, Teams, and PowerPoint — others show little to no usage, with some having zero prompts or active days. Notably, a subset of users is highly engaged, submitting 40+ prompts and being active on up to 10 days, indicating strong adoption and potential champions for further Copilot rollout.\n\nThe data also highlights that certain apps, particularly Word, Outlook, and Teams, are the most frequently used Copilot touchpoints. However, usage of Excel, OneNote, and Loop is sporadic, suggesting either lower awareness or less perceived value in these contexts. There are no Copilot candidates using shadow AI tools, which may indicate limited alternative AI adoption or effective Copilot coverage.\n\nTo drive broader adoption, targeted enablement is recommended. Focus on peer-led training leveraging power users, and address gaps in awareness or use cases for underutilised apps. Regular check-ins and sharing of best practices can help convert low-engagement users and maximise ROI on Copilot licensing.`;

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs text-gray-400 font-medium">Home › Copilot › {TENANT.name} › Copilot Adoption</p>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">Copilot Adoption</h1>
        <p className="text-sm text-gray-500">User-centric view of Copilot usage across {TENANT.name}</p>
      </div>

      {/* AI Insights */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-gray-800">✦ Adoption Insights</span>
            <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200">AI</span>
          </div>
          <button
            onClick={() => { navigator.clipboard.writeText(insightText); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            className="flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 rounded px-3 py-1.5 hover:bg-gray-50 transition-colors"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
          {insightText.split("\n\n").map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </div>

      {/* 3 metric cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Licensing */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <p className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <span className="text-gray-400">📊</span> Copilot Licensing
          </p>
          <div className="space-y-2.5">
            <StatBox value={LICENSING.purchased} label="Licenses purchased" />
            <StatBox value={LICENSING.unassigned} label="Licenses unassigned" />
            <StatBox value={LICENSING.notActive} label="Licenses not actively used" />
            <StatBox value={LICENSING.noLicense} label="Users without a Copilot license" />
          </div>
        </div>

        {/* Adoption Score */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="text-gray-400">📈</span> Copilot Adoption Score
            </p>
            <span className="text-lg font-bold text-gray-900">{ADOPTION_SCORE}%</span>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SCORE_TREND} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 10, fill: "#9CA3AF" }} stroke="#E5E7EB" />
                <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} stroke="#E5E7EB" domain={[0, 100]} />
                <Tooltip contentStyle={{ background: "white", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 11 }} />
                <Line type="monotone" dataKey="score" stroke={BRAND} strokeWidth={2} dot={{ r: 3, fill: BRAND }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Maturity */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span className="text-gray-400">🔄</span> Copilot Maturity
          </p>
          <div className="flex items-center gap-2">
            <div className="h-36 w-36 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={MATURITY_DATA} cx="50%" cy="50%" innerRadius={28} outerRadius={56} dataKey="value" strokeWidth={1} stroke="#fff">
                    {MATURITY_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 11, border: "1px solid #E5E7EB", borderRadius: 6 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {MATURITY_DATA.map((m) => (
                <div key={m.name} className="flex items-center gap-2 text-xs">
                  <span className="h-2.5 w-2.5 rounded-sm shrink-0" style={{ backgroundColor: m.color }} />
                  <span className="text-gray-600">{m.value} {m.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stacked area chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <p className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
          <span className="text-gray-400">📉</span> Use of Copilot Features Within M365 Apps
        </p>
        <p className="text-xs text-gray-400 mb-4">Daily active users per M365 Copilot app</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={AREA_DATA} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: "#9CA3AF" }} stroke="#E5E7EB" interval={3} />
              <YAxis tick={{ fontSize: 9, fill: "#9CA3AF" }} stroke="#E5E7EB" />
              <Tooltip contentStyle={{ background: "white", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 11 }} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
              {Object.entries(APP_COLORS).map(([app, color]) => (
                <Area key={app} type="monotone" dataKey={app} stackId="1" stroke={color} fill={color} fillOpacity={0.75} strokeWidth={0} />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const CopilotUsersView = () => {
  const [search, setSearch] = useState("");
  const filtered = USERS.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Copilot Licensed Users</h1>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        {/* Table header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search"
              className="pl-8 pr-8 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-blue-400 w-56"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2">
                <X className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Showing {filtered.length} of {USERS.length} users</span>
            <button className="flex items-center gap-1.5 text-xs font-medium text-white rounded px-3 py-1.5 transition-opacity hover:opacity-90" style={{ backgroundColor: BRAND }}>
              <Download className="h-3.5 w-3.5" /> Export CSV
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="px-4 py-3 w-8"><input type="checkbox" className="rounded border-gray-300" /></th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">User ↑↓</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Job Title ↑↓</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Department ↑↓</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Copilot Active Days ↑↓</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Copilot Prompts ↑↓</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Copilot Usage within M365</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, i) => (
                <tr key={user.email} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${i % 2 === 0 ? "" : "bg-gray-50/50"}`}>
                  <td className="px-4 py-3"><input type="checkbox" className="rounded border-gray-300" /></td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-blue-600 hover:underline cursor-pointer">{user.name}</div>
                    <div className="text-xs text-gray-400">{user.email}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{user.title}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded border border-gray-200 px-2 py-0.5 text-xs text-gray-500">{user.dept}</span>
                  </td>
                  <td className="px-4 py-3">
                    {user.activeDays === 0
                      ? <span className="inline-flex rounded border border-gray-200 px-2 py-0.5 text-xs text-gray-400">Inactive</span>
                      : <span className="font-medium text-gray-800">{user.activeDays}</span>
                    }
                  </td>
                  <td className="px-4 py-3">
                    {user.prompts > 0
                      ? <span className="font-medium text-gray-800">{user.prompts}</span>
                      : <span className="text-gray-400">–</span>
                    }
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {user.apps.map(app => {
                        const ic = APP_ICONS[app];
                        return ic ? (
                          <div key={app} title={ic.label} className="h-5 w-5 rounded-sm flex items-center justify-center text-[9px] font-bold text-white" style={{ backgroundColor: ic.bg }}>
                            {ic.text}
                          </div>
                        ) : null;
                      })}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Maturity legend */}
      <div className="flex flex-wrap gap-4">
        {Object.entries(MATURITY_COLORS).map(([label, color]) => (
          <div key={label} className="flex items-center gap-1.5 text-sm text-gray-600">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: color }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
};

const ShadowAIView = () => {
  const [search, setSearch] = useState("");
  const filtered = SHADOW_APPS.filter(a => a.name.toLowerCase().includes(search.toLowerCase()));
  const totalUsers = SHADOW_APPS.reduce((s, a) => s + a.users, 0);
  const totalSessions = SHADOW_APPS.reduce((s, a) => s + a.sessions, 0);
  const highRisk = SHADOW_APPS.filter(a => a.risk >= 3).length;

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs text-gray-400 font-medium">Home › Copilot › {TENANT.name} › Shadow AI Detection</p>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">Shadow AI Detection</h1>
        <p className="text-sm text-gray-500">Applications detected as Shadow AI with usage metrics</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Apps detected", value: SHADOW_APPS.length, color: "#3B82F6" },
          { label: "Total users exposed", value: totalUsers, color: "#F59E0B" },
          { label: "High-risk apps", value: highRisk, color: "#EF4444" },
        ].map(card => (
          <div key={card.label} className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-4">
            <span className="text-3xl font-bold" style={{ color: card.color }}>{card.value}</span>
            <span className="text-sm text-gray-500">{card.label}</span>
          </div>
        ))}
      </div>

      {/* Shadow AI apps table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-orange-500" />
            <span className="font-semibold text-gray-800">Shadow AI Apps</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search for app name"
                className="pl-8 py-1.5 pr-3 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-blue-400 w-52"
              />
            </div>
            <span className="text-sm text-gray-500">Showing {filtered.length} of {SHADOW_APPS.length} apps</span>
            <button className="flex items-center gap-1.5 text-xs font-medium text-white rounded px-3 py-1.5 hover:opacity-90" style={{ backgroundColor: BRAND }}>
              <Download className="h-3.5 w-3.5" /> Export CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">App Name ↑↓</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Users ↑↓</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Sessions ↑↓</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Data Transmitted ↓</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-center">Risk Score ↑↓</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((app, i) => (
                <tr key={app.name} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${i % 2 === 0 ? "" : "bg-gray-50/50"}`}>
                  <td className="px-4 py-3 font-medium text-gray-800">{app.name}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-500 border border-gray-200 rounded px-2 py-0.5">{app.category}</span>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-gray-700">{app.users}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-gray-700">{app.sessions.toLocaleString("nl-NL")}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-gray-700">{app.data}</td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className="inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: riskColor(app.risk) }}
                    >
                      {app.risk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Risk legend */}
        <div className="flex items-center gap-5 px-4 py-3 border-t border-gray-100">
          <span className="text-xs text-gray-400 font-medium">Risk legend:</span>
          {[
            { score: "1", label: "Low", color: "#22C55E" },
            { score: "2", label: "Medium", color: "#F59E0B" },
            { score: "3", label: "High", color: "#F97316" },
            { score: "4", label: "Critical", color: "#EF4444" },
          ].map(r => (
            <div key={r.score} className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: r.color }}>{r.score}</span>
              {r.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Main page ─────────────────────────────────────────────────────────────────
type View = "adoption" | "users" | "shadow";

const NAV_ITEMS: { id: View; label: string; icon: React.ReactNode }[] = [
  { id: "adoption",  label: "Copilot Adoption",    icon: <Eye className="h-4 w-4" /> },
  { id: "users",     label: "Licensed Users",       icon: <Users className="h-4 w-4" /> },
  { id: "shadow",    label: "Shadow AI Detection",  icon: <ShieldAlert className="h-4 w-4" /> },
];

export default function InforcerTest() {
  const [view, setView] = useState<View>("adoption");
  const [open, setOpen] = useState(true);

  return (
    <div className="flex min-h-screen" style={{ fontFamily: "'Manrope','Segoe UI',sans-serif", backgroundColor: "#F9FAFB" }}>

      {/* ── Sidebar ── */}
      <aside style={{ backgroundColor: SIDEBAR_BG, width: open ? 240 : 64 }} className="shrink-0 flex flex-col transition-all duration-200">
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
          <div className="h-7 w-7 rounded flex items-center justify-center text-white font-black text-sm shrink-0" style={{ backgroundColor: BRAND }}>
            i
          </div>
          {open && <span className="text-white font-bold text-base tracking-tight">inforcer</span>}
        </div>

        {/* Top nav */}
        <nav className="flex-1 py-3">
          {/* Global items */}
          {[
            { icon: <LayoutDashboard className="h-4 w-4" />, label: "Dashboard" },
            { icon: <Users className="h-4 w-4" />, label: "Tenants" },
          ].map(item => (
            <button key={item.label} className="w-full flex items-center gap-3 px-4 py-2.5 text-white/50 hover:text-white hover:bg-white/5 transition-colors text-sm">
              {item.icon}
              {open && item.label}
            </button>
          ))}

          {/* Divider + tenant */}
          {open && (
            <div className="mt-3 mb-1 px-4">
              <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2">Active Tenant</p>
              <p className="text-xs font-semibold text-white/80 leading-snug">{TENANT.name}</p>
            </div>
          )}

          <div className="mt-2">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  view === item.id
                    ? "text-white bg-white/10 border-r-2 border-blue-400"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.icon}
                {open && item.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Bottom */}
        <div className="border-t border-white/10 p-3 flex items-center gap-2">
          <button onClick={() => setOpen(o => !o)} className="text-white/40 hover:text-white transition-colors">
            <ChevronRight className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
          {open && (
            <Link to="/" className="text-xs text-white/30 hover:text-white/60 transition-colors">
              ← Terug naar AI Compass
            </Link>
          )}
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="font-semibold text-gray-800">Copilot Manager</span>
            <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200">BETA</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400 border border-gray-200 rounded px-2 py-1">📅 Last 30 days ▾</span>
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
              JK
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          {view === "adoption" && <CopilotAdoptionView />}
          {view === "users"    && <CopilotUsersView />}
          {view === "shadow"   && <ShadowAIView />}
        </main>
      </div>
    </div>
  );
}
