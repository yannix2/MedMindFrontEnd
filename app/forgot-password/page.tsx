"use client";

import React, { useState, useEffect } from 'react';
import { Home, Mail, Clock, Calendar, Construction, Shield } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ForgotPasswordPage() {
  const [progress, setProgress] = useState(0);
  const [daysLeft, setDaysLeft] = useState(14);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 75) {
          clearInterval(timer);
          return 75;
        }
        return prev + 1;
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  const features = [
    { name: 'Email Recovery', status: 'Completed' },
    { name: 'SMS Verification', status: 'In Progress' },
    { name: 'Security Questions', status: 'Planned' },
    { name: 'Biometric Recovery', status: 'Planned' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-950 dark:to-blue-950/20 px-4">
      <div className="max-w-lg w-full bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="relative inline-block mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center animate-pulse">
              <Construction className="h-10 w-10 text-white" />
            </div>
            <div className="absolute -top-2 -right-2">
              <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center">
                <Shield className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Feature Under Development
          </h1>
          
          <div className="flex items-center justify-center gap-4 text-gray-600 dark:text-gray-400 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">Est. Launch: Jan 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="text-sm">{daysLeft} days remaining</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Development Progress
            </span>
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
              {progress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Feature Status */}
        <div className="mb-8">
          <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">
            Recovery Features Status
          </h3>
          <div className="space-y-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {feature.name}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  feature.status === 'Completed' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : feature.status === 'In Progress'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                }`}>
                  {feature.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link href="/" className="block">
            <Button className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] group">
              <Home className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
              Return to Homepage
            </Button>
          </Link>

          <Link href="/contactus" className="block">
            <Button variant="outline" className="w-full h-12 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-300">
              <Mail className="h-5 w-5 mr-2" />
              Contact Support Team
            </Button>
          </Link>

          {/* Notify Me Button */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
              Get notified when this feature launches
            </p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                Notify Me
              </Button>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            <span className="font-medium">Security First:</span> We're building robust security measures to ensure your account protection.
          </p>
        </div>
      </div>
    </div>
  );
}