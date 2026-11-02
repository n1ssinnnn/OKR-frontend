import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  ChevronDown,
  ChevronUp,
  X,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building,
  Calendar,
  User,
  Target,
  BarChart2,
  Sliders,
  Sparkles,
} from 'lucide-react';

// ==========================================
// 1. DATA MODELS & TYPESCRIPT INTERFACES
// ==========================================

export type MetricType = 'PERCENTAGE' | 'CURRENCY' | 'NUMERIC' | 'BOOLEAN';
export type StatusBadge = 'ON_TRACK' | 'BEHIND' | 'AT_RISK';

export interface KeyResult {
  id: string;
  objectiveId: string;
  title: string;
  metricType: MetricType;
  startValue: number;
  targetValue: number;
  currentValue: number;
  weight: number; // Percentage 0 - 100
  status: StatusBadge;
}

export interface Objective {
  id: string;
  title: string;
  description: string;
  ownerName: string;
  ownerAvatar: string;
  departmentId: string;
  departmentName: string;
  cycleId: string;
  cycleName: string;
  progressPercentage: number;
  status: StatusBadge;
  keyResults: KeyResult[];
}

// Module 1 & 2 Integration Types
export interface Department {
  id: string;
  name: string;
}

export interface Cycle {
  id: string;
  name: string;
  isActive: boolean;
}

export interface UserOption {
  id: string;
  name: string;
  avatar: string;
  departmentId: string;
}

// ==========================================
// MOCK DATA (Modules 1 & 2 Linked Data)
// ==========================================

const MOCK_CYCLES: Cycle[] = [
  { id: 'c-2026-q3', name: '2026 Q3 Active', isActive: true },
  { id: 'c-2026-q4', name: '2026 Q4 Planning', isActive: false },
  { id: 'c-2026-h2', name: '2026 H2 Annual', isActive: false },
];

const MOCK_DEPARTMENTS: Department[] = [
  { id: 'dept-sec', name: 'Cyber Ops' },
  { id: 'dept-eng', name: 'Engineering Hub' },
  { id: 'dept-pol', name: 'Policy Strategy' },
  { id: 'dept-mkt', name: 'Marketing' },
];

const MOCK_USERS: UserOption[] = [
  { id: 'u-1', name: 'Dr. Arisara', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', departmentId: 'dept-pol' },
  { id: 'u-2', name: 'Lead Engineer Team', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', departmentId: 'dept-eng' },
  { id: 'u-3', name: 'Campaign Director', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', departmentId: 'dept-mkt' },
  { id: 'u-4', name: 'Policy Drafter', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', departmentId: 'dept-pol' },
  { id: 'u-5', name: 'SecOps Lead', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', departmentId: 'dept-sec' },
];

const INITIAL_OBJECTIVES: Objective[] = [
  {
    id: 'obj-101',
    title: 'Harden Zero-Trust Infrastructure & SecOps Incident Response',
    description: 'Enforce MFA across internal microservices and minimize Mean Time To Detect (MTTD) for unauthorized access attempts.',
    ownerName: 'SecOps Lead',
    ownerAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    departmentId: 'dept-sec',
    departmentName: 'Cyber Ops',
    cycleId: 'c-2026-q3',
    cycleName: '2026 Q3 Active',
    progressPercentage: 78,
    status: 'ON_TRACK',
    keyResults: [
      {
        id: 'kr-1',
        objectiveId: 'obj-101',
        title: 'Reduce SecOps Incident Resolution Time',
        metricType: 'NUMERIC',
        startValue: 120,
        targetValue: 30,
        currentValue: 45,
        weight: 50,
        status: 'ON_TRACK',
      },
      {
        id: 'kr-2',
        objectiveId: 'obj-101',
        title: 'Complete Zero-Trust API Endpoint Migration',
        metricType: 'PERCENTAGE',
        startValue: 0,
        targetValue: 100,
        currentValue: 85,
        weight: 50,
        status: 'ON_TRACK',
      },
    ],
  },
  {
    id: 'obj-102',
    title: 'Deploy LMS Core System & Infrastructure Scaling',
    description: 'Ensure system stability, zero downtime, and high throughput backend architecture for institutional rollouts.',
    ownerName: 'Lead Engineer Team',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    departmentId: 'dept-eng',
    departmentName: 'Engineering Hub',
    cycleId: 'c-2026-q3',
    cycleName: '2026 Q3 Active',
    progressPercentage: 42,
    status: 'BEHIND',
    keyResults: [
      {
        id: 'kr-3',
        objectiveId: 'obj-102',
        title: 'Maintain Core Infrastructure Uptime',
        metricType: 'PERCENTAGE',
        startValue: 95,
        targetValue: 99.9,
        currentValue: 97.5,
        weight: 40,
        status: 'BEHIND',
      },
      {
        id: 'kr-4',
        objectiveId: 'obj-102',
        title: 'Reduce Cloud Infra Operational Expenses',
        metricType: 'CURRENCY',
        startValue: 80000,
        targetValue: 50000,
        currentValue: 65000,
        weight: 60,
        status: 'AT_RISK',
      },
    ],
  },
];

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

const formatMetricDisplay = (current: number, target: number, type: MetricType): string => {
  switch (type) {
    case 'CURRENCY':
      return `$${current.toLocaleString()} / $${target.toLocaleString()}`;
    case 'PERCENTAGE':
      return `${current}% / ${target}%`;
    case 'NUMERIC':
      return `${current} / ${target}`;
    case 'BOOLEAN':
      return current === 1 ? 'Achieved (1/1)' : 'Incomplete (0/1)';
    default:
      return `${current} / ${target}`;
  }
};

const getStatusBadgeStyle = (status: StatusBadge) => {
  switch (status) {
    case 'ON_TRACK':
      return { label: 'On Track', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: CheckCircle2 };
    case 'BEHIND':
      return { label: 'Behind', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20', icon: Clock };
    case 'AT_RISK':
      return { label: 'At Risk', bg: 'bg-rose-500/10 text-rose-400 border-rose-500/20', icon: AlertTriangle };
  }
};

// ==========================================
// 2. SUB-COMPONENTS
// ==========================================

/** KeyResultRow Component */
const KeyResultRow: React.FC<{ keyResult: KeyResult }> = ({ keyResult }) => {
  const statusInfo = getStatusBadgeStyle(keyResult.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between p-3.5 mb-2 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 transition-all gap-3">
      <div className="flex items-start md:items-center gap-3 flex-1 min-w-0">
        <div className="p-2 rounded-lg bg-slate-800 text-sky-400 flex-shrink-0 mt-0.5 md:mt-0">
          <Target className="w-4 h-4" />
        </div>
        <div className="truncate">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-slate-200 truncate">{keyResult.title}</span>
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold tracking-wider rounded bg-slate-800 text-slate-400 border border-slate-700">
              [{keyResult.metricType}]
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between md:justify-end gap-4 flex-shrink-0">
        <div className="text-right">
          <div className="text-xs font-mono font-bold text-slate-300">
            {formatMetricDisplay(keyResult.currentValue, keyResult.targetValue, keyResult.metricType)}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">Progress / Target</div>
        </div>

        <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-800/80 text-sky-400 border border-sky-500/20 font-mono">
          Weight: {keyResult.weight}%
        </span>

        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusInfo.bg}`}>
          <StatusIcon className="w-3.5 h-3.5" />
          {statusInfo.label}
        </span>
      </div>
    </div>
  );
};

/** ObjectiveCard Component */
const ObjectiveCard: React.FC<{ objective: Objective }> = ({ objective }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const statusInfo = getStatusBadgeStyle(objective.status);
  const StatusIcon = statusInfo.icon;

  const getProgressBarColor = (pct: number) => {
    if (pct >= 70) return 'bg-emerald-500';
    if (pct >= 40) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg hover:shadow-slate-950/50 transition-all duration-200 overflow-hidden mb-4">
      {/* Header Accordion */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-5 cursor-pointer hover:bg-slate-800/40 transition-colors select-none"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Objective Main Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                <Building className="w-3 h-3 text-sky-400" />
                {objective.departmentName}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                <Calendar className="w-3 h-3 text-indigo-400" />
                {objective.cycleName}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusInfo.bg}`}>
                <StatusIcon className="w-3 h-3" />
                {statusInfo.label}
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-100 tracking-tight mb-1">{objective.title}</h3>
            <p className="text-xs text-slate-400 line-clamp-1">{objective.description}</p>
          </div>

          {/* Owner & Progress Metrics */}
          <div className="flex items-center justify-between lg:justify-end gap-6 flex-shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800">
            {/* Owner Info */}
            <div className="flex items-center gap-2.5">
              <img
                src={objective.ownerAvatar}
                alt={objective.ownerName}
                className="w-8 h-8 rounded-full object-cover border border-slate-700"
              />
              <div className="text-left">
                <div className="text-xs font-semibold text-slate-200">{objective.ownerName}</div>
                <div className="text-[10px] text-slate-500">Objective Lead</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-36">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] font-medium text-slate-400">Progress</span>
                <span className="text-xs font-bold font-mono text-slate-200">{objective.progressPercentage}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden p-0.5 border border-slate-700/50">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getProgressBarColor(objective.progressPercentage)}`}
                  style={{ width: `${objective.progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Toggle Arrow */}
            <button
              type="button"
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors"
              aria-label="Toggle details"
            >
              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Accordion Body */}
      {isExpanded && (
        <div className="px-5 pb-5 pt-2 border-t border-slate-800/60 bg-slate-950/40">
          <div className="flex items-center justify-between mb-3 pt-2">
            <h4 className="text-xs font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5 text-sky-400" /> Key Results ({objective.keyResults.length})
            </h4>
            <span className="text-xs text-slate-500">Weighted Average Roll-up</span>
          </div>

          <div className="space-y-2">
            {objective.keyResults.map((kr) => (
              <KeyResultRow key={kr.id} keyResult={kr} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/** CreateObjectiveDrawer Side Modal Component */
interface DynamicKRForm {
  title: string;
  metricType: MetricType;
  startValue: number;
  targetValue: number;
  weight: number;
}

const CreateObjectiveDrawer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newObjective: Objective) => void;
}> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cycleId, setCycleId] = useState(MOCK_CYCLES[0].id);
  const [departmentId, setDepartmentId] = useState(MOCK_DEPARTMENTS[0].id);
  const [ownerId, setOwnerId] = useState(MOCK_USERS[0].id);

  const [keyResults, setKeyResults] = useState<DynamicKRForm[]>([
    { title: 'Increase system reliability metrics', metricType: 'PERCENTAGE', startValue: 0, targetValue: 100, weight: 50 },
    { title: 'Reduce critical security vulnerability count', metricType: 'NUMERIC', startValue: 20, targetValue: 0, weight: 50 },
  ]);

  const totalWeight = useMemo(() => {
    return keyResults.reduce((acc, curr) => acc + (Number(curr.weight) || 0), 0);
  }, [keyResults]);

  const addKeyResult = () => {
    setKeyResults([
      ...keyResults,
      { title: '', metricType: 'PERCENTAGE', startValue: 0, targetValue: 100, weight: 0 },
    ]);
  };

  const removeKeyResult = (index: number) => {
    if (keyResults.length <= 1) return;
    setKeyResults(keyResults.filter((_, i) => i !== index));
  };

  const updateKRField = (index: number, field: keyof DynamicKRForm, value: any) => {
    const updated = [...keyResults];
    updated[index] = { ...updated[index], [field]: value };
    setKeyResults(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || totalWeight !== 100) return;

    const selectedOwner = MOCK_USERS.find((u) => u.id === ownerId) || MOCK_USERS[0];
    const selectedDept = MOCK_DEPARTMENTS.find((d) => d.id === departmentId) || MOCK_DEPARTMENTS[0];
    const selectedCycle = MOCK_CYCLES.find((c) => c.id === cycleId) || MOCK_CYCLES[0];

    const newObjId = `obj-${Date.now()}`;

    const formattedKeyResults: KeyResult[] = keyResults.map((kr, idx) => ({
      id: `kr-${Date.now()}-${idx}`,
      objectiveId: newObjId,
      title: kr.title || 'Untitled Key Result',
      metricType: kr.metricType,
      startValue: Number(kr.startValue),
      targetValue: Number(kr.targetValue),
      currentValue: Number(kr.startValue),
      weight: Number(kr.weight),
      status: 'ON_TRACK',
    }));

    const newObjective: Objective = {
      id: newObjId,
      title,
      description,
      ownerName: selectedOwner.name,
      ownerAvatar: selectedOwner.avatar,
      departmentId: selectedDept.id,
      departmentName: selectedDept.name,
      cycleId: selectedCycle.id,
      cycleName: selectedCycle.name,
      progressPercentage: 0,
      status: 'ON_TRACK',
      keyResults: formattedKeyResults,
    };

    onSubmit(newObjective);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm transition-opacity">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-slate-900 border-l border-slate-800 text-slate-100 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Draft New Objective</h2>
                <p className="text-xs text-slate-400">Define parent strategy & child Key Results</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Section A: Objective Metadata */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Section A: Objective Metadata
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Objective Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Expand Cyber Ops Threat Hunting Capabilities"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 placeholder-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description / Scope</label>
                <textarea
                  rows={3}
                  placeholder="Detailed business outcome and target impact..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 placeholder-slate-600 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Cycle (Module 2)</label>
                  <select
                    value={cycleId}
                    onChange={(e) => setCycleId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                  >
                    {MOCK_CYCLES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
                  <select
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                  >
                    {MOCK_DEPARTMENTS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Owner (Module 1)</label>
                  <select
                    value={ownerId}
                    onChange={(e) => setOwnerId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                  >
                    {MOCK_USERS.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <hr className="border-slate-800" />

            {/* Section B: Dynamic Key Results Builder */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4" /> Section B: Key Results Builder
                </h3>
                <button
                  type="button"
                  onClick={addKeyResult}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 hover:bg-sky-500/20 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Key Result
                </button>
              </div>

              {/* Weight Sum Validation Banner */}
              <div
                className={`p-3 rounded-xl border flex items-center justify-between text-xs font-medium ${
                  totalWeight === 100
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>
                    Total Weight: <strong>{totalWeight}%</strong> {totalWeight !== 100 && '(Must equal 100%)'}
                  </span>
                </div>
                {totalWeight === 100 && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </div>

              {/* Dynamic KR Rows */}
              <div className="space-y-3">
                {keyResults.map((kr, index) => (
                  <div key={index} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-mono font-bold text-slate-500">KR #{index + 1}</span>
                      {keyResults.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeKeyResult(index)}
                          className="text-slate-500 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <input
                      type="text"
                      placeholder="Key Result title..."
                      value={kr.title}
                      onChange={(e) => updateKRField(index, 'title', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                    />

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <div>
                        <label className="block text-[10px] font-medium text-slate-400 mb-1">Metric Type</label>
                        <select
                          value={kr.metricType}
                          onChange={(e) => updateKRField(index, 'metricType', e.target.value as MetricType)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-200"
                        >
                          <option value="PERCENTAGE">PERCENTAGE</option>
                          <option value="NUMERIC">NUMERIC</option>
                          <option value="CURRENCY">CURRENCY</option>
                          <option value="BOOLEAN">BOOLEAN</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-medium text-slate-400 mb-1">Start Value</label>
                        <input
                          type="number"
                          value={kr.startValue}
                          onChange={(e) => updateKRField(index, 'startValue', e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-100"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-medium text-slate-400 mb-1">Target Value</label>
                        <input
                          type="number"
                          value={kr.targetValue}
                          onChange={(e) => updateKRField(index, 'targetValue', e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-100"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-medium text-slate-400 mb-1">Weight (%)</label>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={kr.weight}
                          onChange={(e) => updateKRField(index, 'weight', e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-100 font-bold text-sky-400"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={totalWeight !== 100 || !title}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-sky-500 text-slate-950 hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Save Objective
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. MAIN WORKSPACE CONTAINER (EXPORT)
// ==========================================

export default function OKRWorkspace() {
  const [objectives, setObjectives] = useState<Objective[]>(INITIAL_OBJECTIVES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedCycle, setSelectedCycle] = useState<string>('c-2026-q3');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Filter Logic
  const filteredObjectives = useMemo(() => {
    return objectives.filter((obj) => {
      const matchesSearch =
        obj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        obj.departmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        obj.ownerName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = selectedStatus === 'ALL' || obj.status === selectedStatus;
      const matchesCycle = !selectedCycle || obj.cycleId === selectedCycle;

      return matchesSearch && matchesStatus && matchesCycle;
    });
  }, [objectives, searchQuery, selectedStatus, selectedCycle]);

  const handleAddObjective = (newObj: Objective) => {
    setObjectives([newObj, ...objectives]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Workspace Top Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <Target className="w-7 h-7 text-sky-400" /> Core OKR Creation Engine
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Module 3 Goal Workspace &bull; Alignment & Strategy Engine
            </p>
          </div>

          {/* Action Button */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-sky-500 text-slate-950 hover:bg-sky-400 shadow-lg shadow-sky-500/20 transition-all transform active:scale-95"
          >
            <Plus className="w-4 h-4" /> New Objective
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
          {/* Search Box */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search objectives, owners, or departments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500 placeholder-slate-600"
            />
          </div>

          {/* Status Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="ON_TRACK">On Track</option>
              <option value="BEHIND">Behind</option>
              <option value="AT_RISK">At Risk</option>
            </select>
          </div>

          {/* Cycle Selector */}
          <div className="md:col-span-3">
            <select
              value={selectedCycle}
              onChange={(e) => setSelectedCycle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500 font-semibold text-sky-400"
            >
              {MOCK_CYCLES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Objectives List Section */}
        <div className="space-y-4">
          {filteredObjectives.length > 0 ? (
            filteredObjectives.map((obj) => <ObjectiveCard key={obj.id} objective={obj} />)
          ) : (
            <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800">
              <Target className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-300">No Objectives Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Try adjusting your search query or status filter to locate your target OKRs.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Slide-Over Creation Drawer */}
      <CreateObjectiveDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSubmit={handleAddObjective}
      />
    </div>
  );
}