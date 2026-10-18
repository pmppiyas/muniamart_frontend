'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { useDeleteOrderMutation } from '@/services/api/orderApi';
import { Order } from '@/types/order';

interface OrderDeleteDialogProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderDeleteDialog({
  order,
  isOpen,
  onClose,
}: OrderDeleteDialogProps) {
  const [deleteOrder, { isLoading }] = useDeleteOrderMutation();

  if (!order) return null;

  const orderNumber = order.id.toUpperCase().startsWith('ORD-')
    ? order.id.toUpperCase()
    : `ORD-${order.id}`;

  const handleDelete = async () => {
    try {
      await deleteOrder(order.id).unwrap();
      toast.success(`Order ${orderNumber} deleted successfully`);
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to delete order');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Order"
      description={`Are you sure you want to delete order ${orderNumber}? This will remove all attached items, address, and payment history permanently.`}
      maxWidth="md"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
            className="h-9 rounded-xl px-4 text-xs font-semibold cursor-pointer"
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isLoading}
            className="h-9 rounded-xl px-4 text-xs font-semibold cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete Order'
            )}
          </Button>
        </>
      }
    >
      <div className="space-y-3 py-2 text-xs">
        <div className="flex items-start gap-2.5 rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-destructive">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            This action cannot be undone. Customer records and stock changes associated with this order will need manual reconciliation.
          </p>
        </div>

        <div className="rounded-xl border border-border/80 bg-muted/30 p-3 space-y-1 text-muted-foreground">
          <div className="flex justify-between">
            <span>Customer:</span>
            <span className="font-semibold text-foreground">{order.customer?.name || order.address?.fullName || 'Guest'}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Amount:</span>
            <span className="font-semibold text-foreground">${Number(order.totalAmount || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Items Count:</span>
            <span className="font-semibold text-foreground">{order.items?.length || 0} item(s)</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
