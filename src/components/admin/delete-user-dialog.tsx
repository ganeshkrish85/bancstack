'use client';

import { useState } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import { useMutation } from 'convex/react';

import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface DeleteUserDialogProps {
  userId: string;
  userName: string;
  userEmail: string;
  onUserDeleted?: () => void;
}

export function DeleteUserDialog({ userId, userName, userEmail, onUserDeleted }: DeleteUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const removeUser = useMutation(api.admin.removeUser);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      await removeUser({ userId });

      // Success - close dialog
      setOpen(false);

      // Notify parent to refresh user list
      if (onUserDeleted) {
        onUserDeleted();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
      console.error('Error deleting user:', err);
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
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive"
          title="Delete User"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="space-y-2">
            <p>
              Are you sure you want to permanently delete{' '}
              <span className="font-semibold text-foreground">{userName}</span> (
              <span className="font-mono text-sm">{userEmail}</span>)?
            </p>
            <div className="bg-destructive/10 border border-destructive/20 p-3 rounded-md mt-3">
              <p className="text-sm text-destructive font-medium">
                ⚠️ This action cannot be undone!
              </p>
              <ul className="text-sm text-destructive mt-2 space-y-1 list-disc list-inside">
                <li>All user data will be permanently deleted</li>
                <li>All active sessions will be terminated</li>
                <li>The user will be unable to sign in</li>
              </ul>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
            {error}
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={loading}
            className="bg-destructive hover:bg-destructive/90"
          >
            {loading ? 'Deleting...' : 'Delete User'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
