import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Navbar } from '@/shared/components/Navbar';
import { Footer } from '@/shared/components/Footer';
import { useAuth } from '@/features/auth/AuthContext';
import { Eye, LogOut } from 'lucide-react';

export const RootLayout: React.FC = () => {
  const { isImpersonating, impersonatedUser, stopImpersonation } = useAuth();
  const navigate = useNavigate();

  const handleExitImpersonation = () => {
    stopImpersonation();
    navigate('/admin/impersonate');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-primary/30">
      {/* Read-Only Impersonation Warning Banner */}
      {isImpersonating && impersonatedUser && (
        <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-zinc-950 font-medium py-2 px-4 shadow-xl sticky top-0 z-[60] flex items-center justify-between text-xs border-b border-amber-600">
          <div className="flex items-center gap-2 font-bold">
            <Eye className="w-4 h-4 shrink-0 text-zinc-950" />
            <span>
              STUDENT IMPERSONATION ACTIVE: Currently viewing as <strong>{impersonatedUser.fullName}</strong> ({impersonatedUser.email}) &bull; Read-Only Safety Protocol Enabled
            </span>
          </div>
          <button
            onClick={handleExitImpersonation}
            className="px-3 py-1 bg-zinc-950 hover:bg-zinc-900 text-amber-300 hover:text-white rounded-lg font-extrabold text-[11px] shadow transition cursor-pointer flex items-center gap-1.5"
          >
            <LogOut className="w-3 h-3" />
            <span>Exit Impersonation</span>
          </button>
        </div>
      )}

      <Navbar />
      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};
