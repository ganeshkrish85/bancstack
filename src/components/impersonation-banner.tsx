'use client';

import { AlertTriangle, X } from 'lucide-react';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { useImpersonation } from '@/hooks/use-impersonation';
import { authClient } from '@/lib/auth-client';

export function ImpersonationBanner() {
  const { isImpersonating, impersonatedUser } = useImpersonation();
  const [loading, setLoading] = useState(false);

  const handleStopImpersonating = async () => {
    setLoading(true);
    try {
      await authClient.admin.stopImpersonating();

      // Force a hard refresh to restore admin session
      window.location.href = '/admin';
    } catch (error) {
      console.error('Error stopping impersonation:', error);
      alert('Failed to stop impersonating. Please try again.');
      setLoading(false);
    }
  };

  if (!isImpersonating || !impersonatedUser) {
    return null;
  }

  return (
    <div className="w-full bg-gradient-to-r relative z-50 from-orange-500 via-yellow-500 to-orange-500 border-b-4 border-orange-700 shadow-lg">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between gap-4">
          {/* Left side - Warning and info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex-shrink-0">
              <div className="relative">
                <AlertTriangle className="h-5 w-5 text-gray-900 animate-pulse" />
                <span className="absolute -top-1 -right-1 text-lg">🎭</span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-gray-900 font-bold text-sm uppercase tracking-wide">
                Impersonating:
              </span>
              <span className="text-gray-900 font-semibold text-sm truncate">
                {impersonatedUser.name || 'Unknown User'}
              </span>
              <span className="text-gray-800 font-mono text-xs bg-white/30 px-2 py-0.5 rounded truncate">
                ({impersonatedUser.email})
              </span>
              <span className="text-xs text-gray-900 font-medium ml-2">
                ⚠️ Session expires in 1 hour
              </span>
            </div>
          </div>

          {/* Right side - Stop button */}
          <div className="flex-shrink-0">
            <Button
              onClick={handleStopImpersonating}
              disabled={loading}
              size="sm"
              className="bg-gray-900 hover:bg-gray-800 text-white font-bold shadow-lg border-2 border-gray-800"
            >
              <X className="h-4 w-4 mr-2" />
              {loading ? 'Stopping...' : 'Stop Impersonating'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
