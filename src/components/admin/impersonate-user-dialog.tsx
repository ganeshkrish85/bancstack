'use client';

import { useState } from 'react';
import { UserCircle } from 'lucide-react';

import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ImpersonateUserDialogProps {
  userId: string;
  userName: string;
  userEmail: string;
}

export function ImpersonateUserDialog({ userId, userName, userEmail }: ImpersonateUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImpersonate = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await authClient.admin.impersonateUser({
        userId,
      });

      if (result.error) {
        setError(result.error.message || 'Failed to impersonate user');
      } else {
        // Success - close dialog
        setOpen(false);

        // Force a hard refresh to update the session
        window.location.href = '/dashboard';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to impersonate user');
      console.error('Error impersonating user:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setError(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-blue-600 hover:text-blue-700"
          title="Impersonate User"
        >
          <UserCircle className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Impersonate User</DialogTitle>
          <DialogDescription>
            View the application as <span className="font-semibold">{userName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-md space-y-2">
            <div className="flex items-center gap-2">
              <UserCircle className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-900">User Details</span>
            </div>
            <div className="text-sm space-y-1">
              <div>
                <span className="text-gray-600">Name:</span>{' '}
                <span className="font-medium text-gray-900">{userName}</span>
              </div>
              <div>
                <span className="text-gray-600">Email:</span>{' '}
                <span className="font-mono text-sm text-gray-900">{userEmail}</span>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 p-3 rounded-md">
            <p className="text-sm text-orange-800">
              <strong>⚠️ Important:</strong>
            </p>
            <ul className="text-sm text-orange-800 mt-2 space-y-1 list-disc list-inside">
              <li>You&apos;ll see the app as this user</li>
              <li>Session expires in 1 hour</li>
              <li>A banner will show you&apos;re impersonating</li>
              <li>Click &quot;Stop Impersonating&quot; to return</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleImpersonate}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? 'Starting...' : 'Start Impersonating'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
