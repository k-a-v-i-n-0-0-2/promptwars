import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, RadialBarChart, RadialBar, Legend, PieChart, Pie, Cell,
} from 'recharts';
import { TrendingUp, Users, Utensils, DoorOpen, Activity } from 'lucide-react';
import GlassTooltip from './ui/GlassTooltip';

/* ──────────────────────────────────────────────────────────
   Mock data
   ────────────────────────────────────────────────────────── */
const GATE_THROUGHPUT = [
  { gate: 'Gate 1', throughput: 4200, capacity: 5000 },
  { gate: 'Gate 2', throughput: 3800, capacity: 5000 },
  { gate: 'Gate 3', throughput: 4600, capacity: 5000 },
  { gate: 'Gate 4', throughput: 3200, capacity: 5000 },
  { gate: 'Gate 5', throughput: 4900, capacity: 5000 },
  { gate: 'Gate 6', throughput: 2800, capacity: 5000 },
];

const CONCESSION_QUEUES = [
  { zone: 'Zone A', wait: 8, items: 1240 },
  { zone: 'Zone B', wait: 3, items: 890 },
  { zone: 'Zone C', wait: 5, items: 1100 },
  { zone: 'Zone D', wait: 2, items: 560 },
  { zone: 'Zone E', wait: 6, items: 980 },
];

const CROWD_PREDICTION = Array.from({ length: 12 }, (_, i) => ({
  time: `${i + 14}:00`,
  actual: Math.floor(Math.sin((i - 2) * 0.4) * 20000 + 65000 + Math.random() * 5000),
  predicted: Math.floor(Math.sin((i - 2) * 0.4) * 19000 + 64000),
  lowerBound: Math.floor(Math.sin((i - 2) * 0.4) * 17000 + 60000),
  upperBound: Math.floor(Math.sin((i - 2) * 0.4) * 21000 + 68000),
}));

const SECTION_DISTRIBUTION = [
  { name: 'North', value: 22340, fill: '#22D3EE' },
  { name: 'South', value: 19120, fill: '#A78BFA' },
  { name: 'East', value: 12400, fill: '#34D399' },
  { name: 'West', value: 18900, fill: '#FB7185' },
  { name: 'Corners', value: 25600, fill: '#FBBF24' },
];

const RADIAL_DATA = [
  { name: 'Safety', value: 98.7, fill: '#34D399' },
  { name: 'Comfort', value: 85.2, fill: '#22D3EE' },
  { name: 'Flow', value: 91.4, fill: '#A78BFA' },
  { name: 'Services', value: 88.9, fill: '#FBBF24' },
];


/* ──────────────────────────────────────────────────────────
   Section wrapper
   ────────────────────────────────────────────────────────── */
const ChartCard = ({ title, subtitle, icon: Icon, iconColor, delay, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    className="glass rounded-2xl p-6"
  >
    <div className="flex items-center gap-3 mb-5">
      <div className="rounded-xl p-2.5" style={{ background: `${iconColor}15` }}>
        <Icon size={18} style={{ color: iconColor }} />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
        {subtitle && <p className="text-[10px] text-text-muted">{subtitle}</p>}
      </div>
    </div>
    {children}
  </motion.div>
);

/* ──────────────────────────────────────────────────────────
   Analytics Panel
   ────────────────────────────────────────────────────────── */
const AnalyticsPanel = () => (
  <div className="space-y-6">
    {/* Top KPIs */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { label: 'Total Entries', value: '87,432', icon: Users, color: '#22D3EE' },
        { label: 'Throughput/hr', value: '12,400', icon: Activity, color: '#34D399' },
        { label: 'Avg Wait', value: '2.4 min', icon: DoorOpen, color: '#A78BFA' },
        { label: 'Concession Rev', value: '$284K', icon: Utensils, color: '#FBBF24' },
      ].map((kpi, i) => (
        <motion.div
          key={kpi.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.06 }}
          className="glass rounded-2xl p-4"
        >
          <kpi.icon size={16} style={{ color: kpi.color }} className="mb-2" />
          <p className="text-xl font-bold text-text-primary font-display">{kpi.value}</p>
          <p className="text-[10px] text-text-muted">{kpi.label}</p>
        </motion.div>
      ))}
    </div>

    {/* Row 1: Gate throughput + Crowd prediction */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <ChartCard title="Gate Throughput" subtitle="Fans processed per gate" icon={DoorOpen} iconColor="#22D3EE" delay={0.2}>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={GATE_THROUGHPUT} barSize={20}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="gate" tick={{ fill: '#64748B', fontSize: 10 }} tickLine={false} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} />
            <YAxis tick={{ fill: '#64748B', fontSize: 10 }} tickLine={false} axisLine={false} />
            <Tooltip content={<GlassTooltip />} />
            <Bar dataKey="throughput" name="Throughput" radius={[6, 6, 0, 0]}>
              {GATE_THROUGHPUT.map((entry, i) => (
                <Cell key={i} fill={entry.throughput > 4500 ? '#34D399' : entry.throughput > 3500 ? '#22D3EE' : '#FB7185'} fillOpacity={0.7} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Crowd Flow Prediction" subtitle="Actual vs AI-predicted fan count" icon={TrendingUp} iconColor="#A78BFA" delay={0.3}>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={CROWD_PREDICTION}>
            <defs>
              <linearGradient id="aGradA" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22D3EE" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#22D3EE" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="aGradP" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#A78BFA" stopOpacity={0.1} />
                <stop offset="100%" stopColor="#A78BFA" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="time" tick={{ fill: '#64748B', fontSize: 10 }} tickLine={false} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} />
            <YAxis tick={{ fill: '#64748B', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<GlassTooltip />} />
            <Area type="monotone" dataKey="actual" name="Actual" stroke="#22D3EE" strokeWidth={2} fill="url(#aGradA)" />
            <Area type="monotone" dataKey="predicted" name="Predicted" stroke="#A78BFA" strokeWidth={1.5} strokeDasharray="4 4" fill="url(#aGradP)" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>

    {/* Row 2: Concessions + Section distribution + Radial */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <ChartCard title="Concession Queues" subtitle="Wait times by zone" icon={Utensils} iconColor="#FBBF24" delay={0.4}>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={CONCESSION_QUEUES} layout="vertical" barSize={14}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis type="number" tick={{ fill: '#64748B', fontSize: 10 }} tickLine={false} axisLine={false} unit=" min" />
            <YAxis dataKey="zone" type="category" tick={{ fill: '#64748B', fontSize: 10 }} tickLine={false} axisLine={false} width={50} />
            <Tooltip content={<GlassTooltip />} />
            <Bar dataKey="wait" name="Wait" radius={[0, 6, 6, 0]}>
              {CONCESSION_QUEUES.map((e, i) => (
                <Cell key={i} fill={e.wait > 6 ? '#FB7185' : e.wait > 4 ? '#FBBF24' : '#34D399'} fillOpacity={0.7} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Section Distribution" subtitle="Fan distribution by stand" icon={Users} iconColor="#34D399" delay={0.5}>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={SECTION_DISTRIBUTION}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {SECTION_DISTRIBUTION.map((entry, i) => (
                <Cell key={i} fill={entry.fill} fillOpacity={0.75} />
              ))}
            </Pie>
            <Tooltip content={<GlassTooltip />} />
            <Legend
              formatter={(value) => <span className="text-[10px] text-text-muted">{value}</span>}
              iconSize={8}
            />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Experience Score" subtitle="Real-time quality metrics" icon={Activity} iconColor="#22D3EE" delay={0.6}>
        <div className="space-y-3 mt-2">
          {RADIAL_DATA.map((item) => (
            <div key={item.name}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-text-secondary">{item.name}</span>
                <span className="text-text-primary font-semibold">{item.value}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-raised overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.value}%` }}
                  transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-full"
                  style={{ background: item.fill }}
                />
              </div>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  </div>
);

export default AnalyticsPanel;
