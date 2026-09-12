'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Trash2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { AdminItem } from '@/types/admin';
import { useDeleteAdminMutation } from '@/services/api/adminApi';

interface AdminDeleteDialogProps {
  admin: AdminItem | null;
  isOpen: boolean;
  onClose: () => void;
  currentUserId?: string;
}

export function AdminDeleteDialog({
  admin,
  isOpen,
  onClose,
  currentUserId,
}: AdminDeleteDialogProps) {
  const [deleteAdmin, { isLoading }] = useDeleteAdminMutation();

  if (!admin) return null;

  const isSelf = admin.id === currentUserId;

  const handleDelete = async () => {
    if (isSelf) {
      toast.error('You cannot delete your own administrator account');
      return;
    }

    try {
      await deleteAdmin(admin.id).unwrap();
      toast.success(`Administrator "${admin.name}" deleted successfully`);
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || 'Failed to delete administrator');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Administrator"
      description="Permanent removal of administrative access"
      maxWidth="md"
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isLoading || isSelf}
            className="text-xs font-bold shadow-xs"
          >
            {isLoading ? 'Deleting...' : 'Confirm Deletion'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {isSelf ? (
          <div className="flex items-start gap-3 p-3.5 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive">
            <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <p className="font-bold">Self-Deletion Prevented</p>
              <p className="mt-0.5 text-muted-foreground">
                You cannot delete your own account while signed in. To remove this administrator, another Super Administrator must perform the action.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3 p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-200">
            <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <div className="text-xs leading-relaxed">
              <p className="font-bold">Are you sure you want to delete this administrator?</p>
              <p className="mt-1 text-muted-foreground">
                Administrator <span className="font-semibold text-foreground">{admin.name}</span> (
                <span className="font-mono text-[11px] text-foreground">{admin.email}</span>) will permanently lose all access to the administrative dashboard.
              </p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
