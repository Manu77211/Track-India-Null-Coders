'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Building2, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  MapPin, 
  IndianRupee,
  Users,
  Briefcase,
  FileText,
  Calendar,
  Radio,
  RefreshCw,
  Wifi,
  WifiOff
} from 'lucide-react';
import { fetchGovernmentUpdates, fetchUpdateStats } from '@/lib/api';

interface Update {
  id: string;
  type: 'infrastructure' | 'funding' | 'policy' | 'announcement';
  title: string;
  description: string;
  amount?: string;
  location: string;
  date: string;
  status: 'active' | 'completed' | 'planned' | 'ongoing';
  priority: 'high' | 'medium' | 'low';
  ministry: string;
  impact: number; // 1-100
}

interface Stats {
  active_projects: number;
  total_funding: string;
  new_policies: number;
  completed: number;
}

export default function UpdatesPage() {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [isLive, setIsLive] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch updates from API
  const loadUpdates = useCallback(async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    
    try {
      const result = await fetchGovernmentUpdates(filter, 20);
      
      if (result.success) {
        setUpdates(result.updates);
        setLastUpdated(new Date().toLocaleTimeString());
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    } catch (error) {
      console.error('Error loading updates:', error);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
      if (showRefresh) {
        setTimeout(() => setIsRefreshing(false), 500);
      }
    }
  }, [filter]);

  // Fetch stats from API
  const loadStats = async () => {
    try {
      const result = await fetchUpdateStats();
      
      if (result.success && result.stats) {
        setStats(result.stats);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  // Initial load
  useEffect(() => {
    loadUpdates();
    loadStats();
  }, [filter, loadUpdates]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      loadUpdates();
      loadStats();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [isLive, loadUpdates]);

  const filteredUpdates = updates;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'infrastructure': return <Building2 className="w-5 h-5" />;
      case 'funding': return <IndianRupee className="w-5 h-5" />;
      case 'policy': return <FileText className="w-5 h-5" />;
      case 'announcement': return <Radio className="w-5 h-5" />;
      default: return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getTypeGradient = (type: string) => {
    switch (type) {
      case 'infrastructure': return 'bg-gray-900 dark:bg-white';
      case 'funding': return 'bg-gray-800 dark:bg-gray-200';
      case 'policy': return 'bg-gray-700 dark:bg-gray-300';
      case 'announcement': return 'bg-gray-600 dark:bg-gray-400';
      default: return 'bg-gray-500 dark:bg-gray-500';
    }
  };

  const getTypeTextColor = (type: string) => {
    switch (type) {
      case 'infrastructure': return 'text-white dark:text-gray-900';
      case 'funding': return 'text-white dark:text-gray-900';
      case 'policy': return 'text-white dark:text-gray-900';
      case 'announcement': return 'text-white dark:text-gray-900';
      default: return 'text-white dark:text-gray-900';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'active': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'ongoing': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
      case 'planned': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800';
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 dark:text-red-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'low': return 'text-green-600 dark:text-green-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-white dark:bg-black transition-colors duration-300">
      {/* Header - Redesigned to match brand */}
      <div className="relative overflow-hidden bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  {isConnected ? (
                    <>
                      <div className="relative">
                        <Radio className="w-7 h-7 text-gray-900 dark:text-white" />
                        {isLive && (
                          <motion.div
                            animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full"
                          />
                        )}
                      </div>
                      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                        Live Government Updates
                      </h1>
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-7 h-7 text-gray-400" />
                      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                        Government Updates
                      </h1>
                    </>
                  )}
                  <button
                    onClick={() => loadUpdates(true)}
                    disabled={isRefreshing}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                    title="Refresh updates"
                  >
                    <RefreshCw className={`w-5 h-5 text-gray-600 dark:text-gray-400 ${isRefreshing ? 'animate-spin' : ''}`} />
                  </button>
                </div>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
                  Real-time tracking of infrastructure projects, funding allocations, and policy changes across India
                </p>
              </div>

              {/* Status indicators */}
              <div className="flex flex-wrap gap-3">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                  isConnected 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
                }`}>
                  {isConnected ? (
                    <>
                      <motion.div
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-2 h-2 bg-green-500 rounded-full"
                      />
                      <span>Live</span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-gray-400 rounded-full" />
                      <span>Offline</span>
                    </>
                  )}
                </div>
                
                {lastUpdated && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                    <Clock className="w-4 h-4" />
                    <span>{lastUpdated}</span>
                  </div>
                )}
                
                <button
                  onClick={() => setIsLive(!isLive)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isLive 
                      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {isLive ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                  <span>Auto-refresh {isLive ? 'ON' : 'OFF'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="sticky top-16 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto py-4 gap-2 scrollbar-hide">
            {['all', 'infrastructure', 'funding', 'policy', 'announcement'].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-5 py-2.5 rounded-lg font-medium text-sm whitespace-nowrap transition-all duration-300 ${
                  filter === type
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Active Projects', value: stats?.active_projects || '...', icon: <Building2 className="w-5 h-5" />, color: 'gray-900 dark:text-white' },
            { label: 'Total Funding', value: stats?.total_funding || '...', icon: <IndianRupee className="w-5 h-5" />, color: 'gray-900 dark:text-white' },
            { label: 'New Policies', value: stats?.new_policies || '...', icon: <FileText className="w-5 h-5" />, color: 'gray-900 dark:text-white' },
            { label: 'Completed', value: stats?.completed || '...', icon: <CheckCircle className="w-5 h-5" />, color: 'gray-900 dark:text-white' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 hover:shadow-xl hover:shadow-gray-900/5 dark:hover:shadow-white/5 hover:scale-[1.02] transition-all duration-300"
            >
              <div className={`inline-flex p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white mb-3 group-hover:scale-110 transition-transform duration-300`}>
                {stat.icon}
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Updates List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <RefreshCw className="w-12 h-12 text-gray-900 dark:text-white animate-spin mx-auto mb-4" />
              <p className="text-xl text-gray-600 dark:text-gray-400">Loading updates...</p>
            </div>
          </div>
        ) : filteredUpdates.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {isConnected ? 'No updates found for this category' : 'Unable to connect to server. Please check if Flask backend is running.'}
            </p>
            {!isConnected && (
              <button
                onClick={() => loadUpdates(true)}
                className="mt-4 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Retry Connection
              </button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredUpdates.map((update, index) => (
                <motion.div
                  key={update.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className="h-full"
                >
                  <Link
                    href={`/updates/${update.id}`}
                    prefetch={true}
                    className="block h-full group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:shadow-2xl hover:shadow-gray-900/5 dark:hover:shadow-white/5 hover:border-gray-400 dark:hover:border-gray-600 transition-all duration-300 cursor-pointer"
                  >
                    {/* Icon and Status */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl ${getTypeGradient(update.type)} ${getTypeTextColor(update.type)} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        {getTypeIcon(update.type)}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getStatusColor(update.status)}`}>
                          {update.status.toUpperCase()}
                        </span>
                        <span className={`${getPriorityColor(update.priority)}`}>
                          <AlertCircle className="w-4 h-4" />
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors mb-3 line-clamp-2">
                      {update.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 leading-relaxed">
                      {update.description}
                    </p>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 mb-3">
                      <MapPin className="w-4 h-4 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                      <span className="line-clamp-1">{update.location}</span>
                    </div>

                    {/* Amount (if available) */}
                    {update.amount && (
                      <div className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white mb-4 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-2 rounded-lg">
                        <IndianRupee className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                        <span>{update.amount}</span>
                      </div>
                    )}

                    {/* Impact Bar */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400 font-medium">Impact Score</span>
                        <span className="font-bold text-gray-900 dark:text-white">{Math.round(update.impact)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2.5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${update.impact}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          className={`h-full rounded-full ${
                            update.impact >= 90 ? 'bg-gray-900 dark:bg-white' :
                            update.impact >= 70 ? 'bg-gray-700 dark:bg-gray-300' :
                            update.impact >= 50 ? 'bg-gray-600 dark:bg-gray-400' :
                            'bg-gray-500 dark:bg-gray-500'
                          } shadow-lg`}
                        />
                      </div>
                    </div>

                    {/* Read more indicator */}
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <span className="text-sm text-gray-900 dark:text-white font-medium group-hover:underline">
                        View Details →
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
