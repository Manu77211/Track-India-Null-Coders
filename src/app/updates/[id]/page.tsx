'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Building2,
  IndianRupee,
  FileText,
  Radio,
  AlertCircle,
  MapPin,
  Calendar,
  Briefcase,
  ArrowLeft,
  ExternalLink,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { fetchUpdateById } from '@/lib/api';

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
  impact: number;
}

export default function UpdateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [update, setUpdate] = useState<Update | null>(null);
  const [relatedUpdates, setRelatedUpdates] = useState<Update[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUpdate = async () => {
      try {
        // Use the new dedicated endpoint for fetching by ID
        const result = await fetchUpdateById(params.id as string);
        
        if (result.success && result.update) {
          setUpdate(result.update);
          setRelatedUpdates(result.related || []);
        }
      } catch (error) {
        console.error('Error loading update:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUpdate();
  }, [params.id]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'infrastructure': return <Building2 className="w-6 h-6" />;
      case 'funding': return <IndianRupee className="w-6 h-6" />;
      case 'policy': return <FileText className="w-6 h-6" />;
      case 'announcement': return <Radio className="w-6 h-6" />;
      default: return <AlertCircle className="w-6 h-6" />;
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

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-900 dark:border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading update details...</p>
        </div>
      </div>
    );
  }

  if (!update) {
    return (
      <div className="min-h-screen pt-16 bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Update Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The update you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            href="/updates"
            prefetch={true}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Updates
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-white dark:bg-black transition-colors duration-300">
      {/* Back Button */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link
          href="/updates"
          prefetch={true}
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to all updates
        </Link>
      </div>

      {/* Header Section */}
      <div className="relative overflow-hidden bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-start gap-6">
              <div className={`p-4 rounded-2xl ${getTypeGradient(update.type)} ${getTypeTextColor(update.type)} shadow-xl`}>
                {getTypeIcon(update.type)}
              </div>
              
              <div className="flex-grow">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className={`px-4 py-1.5 rounded-lg text-xs font-semibold border ${getStatusColor(update.status)}`}>
                    {update.status.toUpperCase()}
                  </span>
                  <span className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                    {update.type.toUpperCase()}
                  </span>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {update.title}
                </h1>
                
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                  {update.description}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Key Information Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-900 dark:text-white" />
                Key Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-700 dark:text-gray-300 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Location</p>
                    <p className="font-medium text-gray-900 dark:text-white">{update.location}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-700 dark:text-gray-300 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Date</p>
                    <p className="font-medium text-gray-900 dark:text-white">{update.date}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Briefcase className="w-5 h-5 text-gray-700 dark:text-gray-300 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Ministry</p>
                    <p className="font-medium text-gray-900 dark:text-white">{update.ministry}</p>
                  </div>
                </div>
                
                {update.amount && (
                  <div className="flex items-start gap-3">
                    <IndianRupee className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Budget</p>
                      <p className="font-bold text-gray-900 dark:text-white">{update.amount}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Impact Analysis */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-gray-900 dark:text-white" />
                Impact Analysis
              </h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Overall Impact Score</span>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{Math.round(update.impact)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-4 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${update.impact}%` }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                      className="h-full rounded-full bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 shadow-lg"
                    />
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    This {update.type} initiative is expected to have a {update.impact >= 80 ? 'high' : update.impact >= 60 ? 'moderate' : 'significant'} impact on the development and progress of the region. The implementation aligns with national development goals and addresses critical infrastructure needs.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 text-white dark:text-gray-900 rounded-xl p-6 shadow-xl"
            >
              <h3 className="text-lg font-bold mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Status
                  </span>
                  <span className="font-bold">{update.status}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Priority
                  </span>
                  <span className="font-bold capitalize">{update.priority}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Impact
                  </span>
                  <span className="font-bold">{Math.round(update.impact)}%</span>
                </div>
              </div>
            </motion.div>

            {/* Related Updates */}
            {relatedUpdates.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6"
              >
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Related Updates</h3>
                <div className="space-y-3">
                  {relatedUpdates.map((related) => (
                    <Link
                      key={related.id}
                      href={`/updates/${related.id}`}
                      prefetch={true}
                      className="block p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-transparent hover:border-gray-300 dark:hover:border-gray-600 transition-all"
                    >
                      <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 mb-1">
                        {related.title}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{related.location}</p>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
