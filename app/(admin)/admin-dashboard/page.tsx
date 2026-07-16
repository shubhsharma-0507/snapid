'use client';

import { motion } from 'framer-motion';
import { Users, Image, Download, BarChart3, AlertCircle } from 'lucide-react';

export default function AdminDashboardPage() {
  const stats = [
    { label: 'Total Users', value: '1,234', icon: Users, color: 'primary' },
    { label: 'Photos Generated', value: '5,678', icon: Image, color: 'accent' },
    { label: 'Total Downloads', value: '12,345', icon: Download, color: 'secondary' },
    { label: 'Active Sessions', value: '89', icon: BarChart3, color: 'primary' },
  ];

  const recentActivity = [
    { user: 'john@example.com', action: 'Generated photo', time: '2 minutes ago' },
    { user: 'jane@example.com', action: 'Registered', time: '15 minutes ago' },
    { user: 'bob@example.com', action: 'Downloaded file', time: '1 hour ago' },
  ];

  return (
    <div className="min-h-screen w-full bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-primary/10 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
            <p className="text-xs text-muted-foreground">System overview and management</p>
          </div>
          <div className="text-xs text-muted-foreground">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="rounded-xl border border-primary/20 bg-card/50 p-6 space-y-3 hover:border-primary/50 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm text-muted-foreground">{stat.label}</h3>
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </motion.div>
              );
            })}
          </div>

          {/* System Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-xl border border-primary/20 bg-card/50 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">System Status</h2>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                All Systems Operational
              </div>
            </div>

            <div className="space-y-3">
              {[
                { name: 'Database', status: 'Connected' },
                { name: 'File Storage', status: 'Connected' },
                { name: 'Email Service', status: 'Connected' },
                { name: 'Image Processing', status: 'Connected' },
              ].map((service, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-primary/10"
                >
                  <span className="text-sm font-medium">{service.name}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">
                    {service.status}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-xl border border-primary/20 bg-card/50 p-6"
          >
            <h2 className="text-lg font-semibold mb-6">Recent Activity</h2>

            <div className="space-y-3">
              {recentActivity.map((activity, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-primary/10 hover:border-primary/30 transition-all"
                >
                  <div>
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.user}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {[
              { label: 'Manage Users', href: '#' },
              { label: 'View Photos', href: '#' },
              { label: 'System Settings', href: '#' },
            ].map((action, idx) => (
              <a
                key={idx}
                href={action.href}
                className="p-4 rounded-lg border border-primary/20 bg-card/50 hover:border-primary/50 transition-all text-center font-medium text-sm"
              >
                {action.label}
              </a>
            ))}
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
