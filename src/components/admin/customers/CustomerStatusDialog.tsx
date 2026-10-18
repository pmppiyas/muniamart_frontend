'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { ShieldAlert, CheckCircle2, UserCheck, UserX } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { CustomerListItem, CustomerStatusType } from '@/types/customer';
import { useUpdateCustomerStatusMutation } from '@/services/api/customerApi';
import { cn } from '@/lib/utils';

interface CustomerStatusDialogProps {
  customer: CustomerListItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const STATUSES: {
  value: CustomerStatusType;
  label: string;
  desc: string;
  icon: typeof UserCheck;
  color: string;
}[] = [
  {
    value: 'ACTIVE',
    label: 'Active',
    desc: 'Customer has full access to browse and place orders.',
    icon: UserCheck,
    color: 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10',
  },
  {
    value: 'INACTIVE',
    label: 'Inactive',
    desc: 'Account is temporarily paused or inactive.',
    icon: UserX,
    color: 'text-amber-500 border-amber-500/30 bg-amber-500/10',
  },
  {
    value: 'BLOCKED',
    label: 'Blocked',
    desc: 'Customer is blocked from placing new orders or logging in.',
    icon: ShieldAlert,
    color: 'text-rose-500 border-rose-500/30 bg-rose-500/10',
  },
];

export function CustomerStatusDialog({
  customer,
  isOpen,
  onClose,
}: CustomerStatusDialogProps) {
  const [selectedStatus, setSelectedStatus] = React.useState<CustomerStatusType>(
    customer?.status || 'ACTIVE'
  );
  const [updateStatus, { isLoading }] = useUpdateCustomerStatusMutation();

  React.useEffect(() => {
    if (customer) {
      setSelectedStatus(customer.status);
    }
  }, [customer]);

  if (!customer) return null;

  const handleSave = async () => {
    try {
      await updateStatus({
        id: customer.id,
        status: selectedStatus,
      }).unwrap();
      toast.success(`Customer status updated to ${selectedStatus}`);
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update customer status');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Customer Status"
      description={`Change account status for ${customer.name} (${customer.email})`}
      maxWidth="md"
      footer={
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleSave}
            disabled={isLoading || selectedStatus === customer.status}
            className="text-xs"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </>
      }
    >
      <div className="space-y-2.5">
        {STATUSES.map((st) => {
          const Icon = st.icon;
          const isSelected = selectedStatus === st.value;
          return (
            <button
              key={st.value}
              type="button"
              onClick={() => setSelectedStatus(st.value)}
              className={cn(
                'w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer',
                isSelected
                  ? 'border-primary bg-primary/5 ring-1 ring-primary/40'
                  : 'border-border bg-card hover:bg-muted/50'
              )}
            >
              <div
                className={cn(
                  'h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border',
                  st.color
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">
                    {st.label}
                  </span>
                  {isSelected && (
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {st.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </Modal>
  );
}
