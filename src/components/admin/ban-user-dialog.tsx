'use client';

import { useState } from 'react';
import { Ban, CheckCircle } from 'lucide-react';
import { useMutation } from 'convex/react';

import { api } from '@/convex/_generated/api';
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
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface BanUserDialogProps {
  userId: string;
  userName: string;
  isBanned: boolean;
  onBanChanged?: () => void;
}

export function BanUserDialog({ userId, userName, isBanned, onBanChanged }: BanUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [banReason, setBanReason] = useState('');
  const [expirationOption, setExpirationOption] = useState<string>('never');
  const [customDays, setCustomDays] = useState('7');

  const banUserMutation = useMutation(api.admin.banUser);
  const unbanUserMutation = useMutation(api.admin.unbanUser);
  const [loading, setLoading] = useState(false);

  const handleBan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let banExpiresIn: number | undefined;

      if (expirationOption === '1day') {
        banExpiresIn = 60 * 60 * 24; // 1 day in seconds
      } else if (expirationOption === '7days') {
        banExpiresIn = 60 * 60 * 24 * 7; // 7 days in seconds
      } else if (expirationOption === '30days') {
        banExpiresIn = 60 * 60 * 24 * 30; // 30 days in seconds
      } else if (expirationOption === 'custom') {
        const days = parseInt(customDays, 10);
        if (isNaN(days) || days <= 0) {
          setError('Please enter a valid number of days');
          setLoading(false);
          return;
        }
        banExpiresIn = 60 * 60 * 24 * days;
      }
      // if 'never', banExpiresIn stays undefined

      await banUserMutation({
        userId,
        banReason: banReason || undefined,
        banExpiresIn,
      });

      // Success - close dialog and reset
      setOpen(false);
      setBanReason('');
      setExpirationOption('never');
      setCustomDays('7');

      // Notify parent to refresh user list
      if (onBanChanged) {
        onBanChanged();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to ban user');
      console.error('Error banning user:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnban = async () => {
    setLoading(true);
    setError(null);

    try {
      await unbanUserMutation({ userId });

      // Success - close dialog
      setOpen(false);

      // Notify parent to refresh user list
      if (onBanChanged) {
        onBanChanged();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unban user');
      console.error('Error unbanning user:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset form when closing
      setBanReason('');
      setExpirationOption('never');
      setCustomDays('7');
      setError(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={isBanned ? "text-green-600 hover:text-green-700" : "text-orange-600 hover:text-orange-700"}
          title={isBanned ? "Unban User" : "Ban User"}
        >
          {isBanned ? <CheckCircle className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {isBanned ? (
          // Unban Form
          <>
            <DialogHeader>
              <DialogTitle>Unban User</DialogTitle>
              <DialogDescription>
                Remove the ban from <span className="font-semibold">{userName}</span>?
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4">
                  {error}
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                This user will be able to sign in and access the application again.
              </p>
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
                onClick={handleUnban}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? 'Unbanning...' : 'Unban User'}
              </Button>
            </DialogFooter>
          </>
        ) : (
          // Ban Form
          <form onSubmit={handleBan}>
            <DialogHeader>
              <DialogTitle>Ban User</DialogTitle>
              <DialogDescription>
                Ban <span className="font-semibold">{userName}</span> from accessing the application
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                  {error}
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="banReason">Ban Reason (Optional)</Label>
                <Input
                  id="banReason"
                  placeholder="e.g., Spamming, Harassment, Policy Violation"
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">
                  The reason will be visible to other admins
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="expiration">Ban Duration</Label>
                <Select
                  value={expirationOption}
                  onValueChange={setExpirationOption}
                  disabled={loading}
                >
                  <SelectTrigger id="expiration">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1day">1 Day</SelectItem>
                    <SelectItem value="7days">7 Days</SelectItem>
                    <SelectItem value="30days">30 Days</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                    <SelectItem value="never">Permanent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {expirationOption === 'custom' && (
                <div className="grid gap-2">
                  <Label htmlFor="customDays">Number of Days</Label>
                  <Input
                    id="customDays"
                    type="number"
                    min="1"
                    placeholder="7"
                    value={customDays}
                    onChange={(e) => setCustomDays(e.target.value)}
                    disabled={loading}
                  />
                </div>
              )}

              <div className="bg-orange-50 border border-orange-200 p-3 rounded-md">
                <p className="text-sm text-orange-800">
                  <strong>Warning:</strong> Banning a user will revoke all their active sessions
                  and prevent them from signing in.
                </p>
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
                type="submit"
                disabled={loading}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {loading ? 'Banning...' : 'Ban User'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
