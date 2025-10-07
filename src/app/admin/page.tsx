'use client';

import { ArrowLeft } from 'lucide-react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { AdminDashboard } from '@/components/admin/admin-dashboard';
import { AdminGuard } from '@/components/admin/admin-guard';
import { ImpersonationBanner } from '@/components/impersonation-banner';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function AdminPage() {
  return (
    <AdminGuard
      fallback={
        <div className="min-h-screen flex items-center justify-center py-8">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>
                You need to be logged in with admin privileges to access this page.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/login">Login</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      }
    >
      <AdminPageContent />
    </AdminGuard>
  );
}

function AdminPageContent() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <>
      <ImpersonationBanner />
      <div className="py-8">
        <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={handleGoBack}
              className="flex items-center gap-2 hover:bg-muted/50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>

          {/* Admin Dashboard */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Admin Panel
              </h1>
              <p className="text-muted-foreground">
                Manage users, permissions, and application settings.
              </p>
            </div>
            
            <AdminDashboard />
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
