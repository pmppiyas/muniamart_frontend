'use client';

import * as React from 'react';
import { CartItem as CartItemType } from '@/types/cart';
import { CartItemImage } from './CartItemImage';
import { CartItemInfo } from './CartItemInfo';
import { CartItemPrice } from './CartItemPrice';
import { CartQuantitySelector } from './CartQuantitySelector';
import { CartItemActions } from './CartItemActions';
import { useCart } from '@/hooks/useCart';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface CartItemProps {
  item: CartItemType;
  className?: string;
}

export function CartItem({ item, className }: CartItemProps) {
  const { updateItemQuantity, removeItem } = useCart();
  const productHref = item.slug ? `/products/${item.slug}` : `/products/${item.productId}`;

  const handleQuantityChange = async (newQty: number) => {
    await updateItemQuantity(item.id, newQty);
  };

  const handleRemove = async () => {
    await removeItem(item.id);
    toast.info(`Removed "${item.name}" from your cart.`);
  };

  return (
    <div
      className={cn(
        'group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-2xs transition-all hover:border-border/80 hover:shadow-xs',
        className
      )}
    >
      <div className="flex items-center gap-3.5 sm:gap-4 flex-1 min-w-0">
        <CartItemImage
          src={item.photoUrl}
          alt={item.name}
          href={productHref}
          className="h-20 w-20 sm:h-24 sm:w-24"
        />

        <div className="flex-1 min-w-0">
          <CartItemInfo item={item} />
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto border-t sm:border-t-0 border-border/80 pt-3 sm:pt-0">
        <div className="sm:hidden">
          <CartItemPrice
            price={item.price}
            quantity={item.quantity}
          />
        </div>

        <CartQuantitySelector
          quantity={item.quantity}
          maxStock={item.stock}
          onQuantityChange={handleQuantityChange}
        />

        <div className="hidden sm:block min-w-[90px] text-right">
          <CartItemPrice
            price={item.price}
            quantity={item.quantity}
          />
        </div>

        <CartItemActions
          onRemove={handleRemove}
        />
      </div>
    </div>
  );
}
