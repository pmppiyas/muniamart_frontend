'use client';

import * as React from 'react';
import { toast } from 'sonner';
import {
  ShieldCheck,
  Crown,
  CheckCircle2,
  Package,
  Layers,
  ShoppingCart,
  Users,
  CreditCard,
  Info,
  Check,
  X,
} from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AdminItem, AdminRole, AdminStatus, AdminPermissionKey } from '@/types/admin';
import {
  useCreateAdminMutation,
  useUpdateAdminMutation,
} from '@/services/api/adminApi';
import { cn } from '@/lib/utils';

interface AdminFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminToEdit: AdminItem | null;
  currentUserId?: string;
}

const AVAILABLE_PERMISSIONS: {
  key: AdminPermissionKey;
  name: string;
  module: string;
  description: string;
  icon: typeof Package;
  color: string;
}[] = [
  {
    key: 'MANAGE_PRODUCTS',
    name: 'Manage Products',
    module: 'Catalog',
    description: 'Create, edit, view, and delete products, inventory, and SKU data.',
    icon: Package,
    color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  },
  {
    key: 'MANAGE_CATEGORIES',
    name: 'Manage Categories',
    module: 'Catalog',
    description: 'Create, edit, and delete product categories and subcategories.',
    icon: Layers,
    color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
  },
  {
    key: 'MANAGE_ORDERS',
    name: 'Manage Orders',
    module: 'Sales',
    description: 'View customer orders, update delivery status, and handle cancellations.',
    icon: ShoppingCart,
    color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  },
  {
    key: 'MANAGE_CUSTOMERS',
    name: 'Manage Customers',
    module: 'Users',
    description: 'View customer accounts, order history, and update status (Active/Blocked).',
    icon: Users,
    color: 'text-sky-500 bg-sky-500/10 border-sky-500/20',
  },
  {
    key: 'MANAGE_PAYMENTS',
    name: 'Manage Payments',
    module: 'Finance',
    description: 'View Stripe and bKash transaction telemetry, revenue stats, and details.',
    icon: CreditCard,
    color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  },
];

export function AdminFormModal({
  isOpen,
  onClose,
  adminToEdit,
  currentUserId,
}: AdminFormModalProps) {
  const isEditing = !!adminToEdit;
  const isEditingSelf = isEditing && adminToEdit.id === currentUserId;

  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [role, setRole] = React.useState<AdminRole>('ADMIN');
  const [status, setStatus] = React.useState<AdminStatus>('ACTIVE');
  const [selectedPermissions, setSelectedPermissions] = React.useState<string[]>([]);

  const [createAdmin, { isLoading: isCreating }] = useCreateAdminMutation();
  const [updateAdmin, { isLoading: isUpdating }] = useUpdateAdminMutation();
  const isSubmitting = isCreating || isUpdating;

  React.useEffect(() => {
    if (adminToEdit) {
      setName(adminToEdit.name);
      setEmail(adminToEdit.email);
      setPassword('');
      setRole(adminToEdit.role);
      setStatus(adminToEdit.status);
      setSelectedPermissions(adminToEdit.permissions || []);
    } else {
      setName('');
      setEmail('');
      setPassword('');
      setRole('ADMIN');
      setStatus('ACTIVE');
      setSelectedPermissions([]);
    }
  }, [adminToEdit, isOpen]);

  const togglePermission = (key: string) => {
    if (role === 'SUPER_ADMIN') return;
    setSelectedPermissions((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
    );
  };

  const handleSelectAll = () => {
    setSelectedPermissions(AVAILABLE_PERMISSIONS.map((p) => p.key));
  };

  const handleClearAll = () => {
    setSelectedPermissions([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }

    if (!email.trim()) {
      toast.error('Email is required');
      return;
    }

    if (!isEditing && (!password || password.length < 6)) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      if (isEditing) {
        await updateAdmin({
          id: adminToEdit.id,
          body: {
            name: name.trim(),
            email: email.trim(),
            ...(password.trim() ? { password: password.trim() } : {}),
            ...(!isEditingSelf ? { role, status } : {}),
            permissions: role === 'SUPER_ADMIN' ? [] : selectedPermissions,
          },
        }).unwrap();
        toast.success(`Administrator "${name}" updated successfully`);
      } else {
        await createAdmin({
          name: name.trim(),
          email: email.trim(),
          password: password.trim(),
          role,
          status,
          permissions: role === 'SUPER_ADMIN' ? [] : selectedPermissions,
        }).unwrap();
        toast.success(`Administrator "${name}" created successfully`);
      }
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || 'Failed to save administrator');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Administrator & Permissions' : 'Create New Administrator'}
      description={
        isEditing
          ? `Modify permissions and details for ${adminToEdit.email}`
          : 'Add a new administrative account and assign granular permissions.'
      }
      maxWidth="2xl"
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="admin-form"
            size="sm"
            disabled={isSubmitting}
            className="text-xs font-bold shadow-xs bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isSubmitting
              ? isEditing
                ? 'Saving Changes...'
                : 'Creating...'
              : isEditing
              ? 'Save Changes'
              : 'Create Administrator'}
          </Button>
        </div>
      }
    >
      <form id="admin-form" onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="space-y-1.5">
            <label htmlFor="admin-name" className="text-xs font-semibold text-foreground">
              Full Name <span className="text-destructive">*</span>
            </label>
            <Input
              id="admin-name"
              type="text"
              placeholder="e.g. Sarah Connor"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-9 text-xs"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="admin-email" className="text-xs font-semibold text-foreground">
              Email Address <span className="text-destructive">*</span>
            </label>
            <Input
              id="admin-email"
              type="email"
              placeholder="e.g. admin@muniamart.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-9 text-xs"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="space-y-1.5">
            <label htmlFor="admin-password" className="text-xs font-semibold text-foreground">
              {isEditing ? 'New Password (Optional)' : 'Password'} {!isEditing && <span className="text-destructive">*</span>}
            </label>
            <Input
              id="admin-password"
              type="password"
              placeholder={isEditing ? 'Leave empty to keep current password' : 'Min 6 characters'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-9 text-xs"
              required={!isEditing}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="admin-status" className="text-xs font-semibold text-foreground">
              Account Status
            </label>
            <select
              id="admin-status"
              value={status}
              disabled={isEditingSelf}
              onChange={(e) => setStatus(e.target.value as AdminStatus)}
              className="w-full h-9 px-3 rounded-md border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50"
            >
              <option value="ACTIVE">ACTIVE (Authorized to log in)</option>
              <option value="INACTIVE">INACTIVE (Temporarily disabled)</option>
            </select>
          </div>
        </div>

        <div className="space-y-2 pt-1">
          <label className="text-xs font-semibold text-foreground">Administrative Role</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              disabled={isEditingSelf}
              onClick={() => setRole('ADMIN')}
              className={cn(
                'flex items-start gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer disabled:cursor-not-allowed',
                role === 'ADMIN'
                  ? 'border-blue-500 bg-blue-500/5 ring-1 ring-blue-500/30'
                  : 'border-border bg-card hover:bg-muted/40'
              )}
            >
              <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border border-blue-500/20 bg-blue-500/10 text-blue-600">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">Admin</span>
                  {role === 'ADMIN' && <CheckCircle2 className="h-4 w-4 text-blue-600" />}
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Custom access based on granted module permissions below.
                </p>
              </div>
            </button>

            <button
              type="button"
              disabled={isEditingSelf}
              onClick={() => setRole('SUPER_ADMIN')}
              className={cn(
                'flex items-start gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer disabled:cursor-not-allowed',
                role === 'SUPER_ADMIN'
                  ? 'border-purple-500 bg-purple-500/5 ring-1 ring-purple-500/30'
                  : 'border-border bg-card hover:bg-muted/40'
              )}
            >
              <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border border-purple-500/20 bg-purple-500/10 text-purple-600">
                <Crown className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">Super Admin</span>
                  {role === 'SUPER_ADMIN' && <CheckCircle2 className="h-4 w-4 text-purple-600" />}
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Unrestricted god-mode access to all system features and admin management.
                </p>
              </div>
            </button>
          </div>
        </div>

        <div className="space-y-2.5 pt-2 border-t border-border">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-foreground">
                Granular Module Permissions
              </h4>
              <p className="text-[11px] text-muted-foreground">
                Select which sections this administrator is authorized to access and manage.
              </p>
            </div>

            {role === 'ADMIN' && (
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-[11px] font-semibold text-primary hover:underline cursor-pointer"
                >
                  Select All
                </button>
                <span className="text-muted-foreground/50 text-xs">|</span>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-[11px] font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>

          {role === 'SUPER_ADMIN' ? (
            <div className="flex items-start gap-2.5 p-3 rounded-xl border border-purple-500/20 bg-purple-500/5 text-purple-700 dark:text-purple-300">
              <Info className="h-4 w-4 shrink-0 mt-0.5 text-purple-600" />
              <div className="text-xs leading-relaxed">
                <span className="font-bold">Super Admin Privilege: </span>
                Super Administrators automatically have full unrestricted access to all modules and capabilities across the system. Manual permission checkboxes are bypassed.
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {AVAILABLE_PERMISSIONS.map((perm) => {
                const isSelected = selectedPermissions.includes(perm.key);
                const Icon = perm.icon;
                return (
                  <div
                    key={perm.key}
                    onClick={() => togglePermission(perm.key)}
                    className={cn(
                      'flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer select-none',
                      isSelected
                        ? 'border-primary/40 bg-primary/5'
                        : 'border-border bg-card hover:bg-muted/40'
                    )}
                  >
                    <div
                      className={cn(
                        'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all',
                        isSelected
                          ? 'bg-primary border-primary text-primary-foreground'
                          : 'border-muted-foreground/30 bg-background'
                      )}
                    >
                      {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                    </div>

                    <div
                      className={cn(
                        'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border',
                        perm.color
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-foreground">
                          {perm.name}
                        </span>
                        <Badge
                          variant="outline"
                          className="text-[10px] px-1.5 py-0 font-normal text-muted-foreground"
                        >
                          {perm.module}
                        </Badge>
                      </div>
                      <p className="text-[10.5px] text-muted-foreground truncate">
                        {perm.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </form>
    </Modal>
  );
}
