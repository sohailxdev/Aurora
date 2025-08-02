import type React from "react";

import { useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowRight } from "lucide-react";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { FinalOrderData } from "@/pages/Checkout";

export interface InsufficientProduct {
  productId: number;
  sku: string;
  requestedQuantity: number;
  availableQuantity: number;
  name: string;
  image: string;
  price: number;
}

interface InsufficientQuantityModalProps {
  isOpen: boolean;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  insufficientProducts: InsufficientProduct[];
  onUpdateQuantity: (sku: string, quantity: number) => void;
  onRemoveItem: (sku: string) => void;
  orderData: FinalOrderData | undefined;
  setOrderData: React.Dispatch<
    React.SetStateAction<FinalOrderData | undefined>
  >;
  onProceed?: () => void;
  setInsufficientProducts: React.Dispatch<
    React.SetStateAction<InsufficientProduct[]>
  >;
}

export function InsufficientQuantityModal({
  isOpen,
  onClose,
  insufficientProducts,
  onUpdateQuantity,
  onRemoveItem,
  orderData,
  setOrderData,
  onProceed,
  setInsufficientProducts,
}: InsufficientQuantityModalProps) {
  const handleAcceptQuantity = (product: InsufficientProduct) => {
    if (product.availableQuantity > 0) {
      // Update the quantity to available quantity
      onUpdateQuantity(product.sku, product.availableQuantity);

      // Update order data first
      setOrderData((prevOrderData) => {
        if (!prevOrderData) return prevOrderData; // Ensure prevOrderData is not undefined
        const updatedOrderData = {
          ...prevOrderData,
          items: prevOrderData.items.map((item) =>
            item.sku === product.sku
              ? { ...item, quantity: product.availableQuantity }
              : item
          ),
          amount: Math.round(
            prevOrderData.items.reduce((total, item) => {
              const itemQuantity =
                item.sku === product.sku
                  ? product.availableQuantity
                  : item.quantity;
              return total + item.price * itemQuantity;
            }, 0) * 100
          ),
        };

        // Remove insufficient products after state is updated
        setInsufficientProducts((prevInsufficientProducts) =>
          prevInsufficientProducts.filter((item) => {
            const updatedQuantity = updatedOrderData.items.find(
              (orderItem) => orderItem.sku === item.sku
            )?.quantity;
            return !(
              item.sku === product.sku &&
              updatedQuantity &&
              updatedQuantity <= item.availableQuantity
            );
          })
        );

        return updatedOrderData;
      });
    }
  };

  const handleRemove = useCallback(
    (sku: string) => {
      onRemoveItem(sku);
      setOrderData((prevOrderData) => {
        if (!prevOrderData) return prevOrderData; // Ensure prevOrderData is not undefined
        const filteredItems = prevOrderData.items.filter(
          (item) => item.sku !== sku
        );
        return {
          ...prevOrderData,
          items: filteredItems,
          amount: Math.round(
            filteredItems.reduce(
              (total, item) => total + item.price * item.quantity,
              0
            ) * 100
          ),
        };
      });
      setInsufficientProducts((prev) =>
        prev.filter((product) => product.sku !== sku)
      );
    },
    [onRemoveItem, setOrderData, setInsufficientProducts]
  );

  // Auto-remove items with zero quantity
  useEffect(() => {
    insufficientProducts.forEach((product) => {
      if (product.availableQuantity <= 0) {
        handleRemove(product.sku);
      }
    });
  }, [insufficientProducts, handleRemove]);

  // Close modal when all products are handled
  useEffect(() => {
    if (insufficientProducts.length === 0) {
      onClose(false);
    }
  }, [insufficientProducts, onClose]);

  const canProceed = insufficientProducts.every(
    (product) =>
      product.availableQuantity > 0 &&
      (orderData?.items.find((item) => item.sku === product.sku)?.quantity ??
        0) <= product.availableQuantity
  );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !canProceed) return;
        onClose(open);
      }}
    >
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Review Cart Quantities</DialogTitle>
          <div className="text-sm text-muted-foreground">
            Some items in your cart exceed our available stock. Please review
            and adjust the quantities.
          </div>
        </DialogHeader>
        <Separator className="my-4" />
        <ScrollArea
          scrollHideDelay={180000}
          className="max-h-[400px] overflow-y-auto p-1"
        >
          <div className="grid gap-6">
            {insufficientProducts?.map((product) => (
              <div
                key={product.sku}
                className="group relative rounded-lg border p-4 transition-all hover:shadow-md"
              >
                <div className="flex gap-6">
                  <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border">
                    <img
                      src={
                        product.image || "/placeholder.svg?height=96&width=96"
                      }
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{product.name}</h3>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleRemove(product.sku)}
                        className="opacity-0 bg-red-500 group-hover:bg-red-600 group-hover:opacity-100 transition-opacity"
                      >
                        Remove
                      </Button>
                    </div>
                    {product.availableQuantity > 0 ? (
                      <div className="mt-2 space-y-4">
                        <div className="flex items-center gap-3 text-sm">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">Requested</Badge>
                            <span className="font-medium">
                              {product.requestedQuantity}
                            </span>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">Available</Badge>
                            <span className="font-medium">
                              {product.availableQuantity}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleAcceptQuantity(product)}
                          className="mt-2"
                        >
                          Accept Available Quantity
                        </Button>
                      </div>
                    ) : (
                      <div className="mt-4 flex items-center gap-2 text-sm text-destructive">
                        <AlertCircle className="h-4 w-4" />
                        <span className="font-medium">Out of Stock</span>
                        <span className="text-muted-foreground">
                          (Requested: {product.requestedQuantity})
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <Separator className="my-4" />
        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onClose(false)}
            className="flex-1 sm:flex-none"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (canProceed) {
                onProceed?.();
                onClose(false);
              }
            }}
            disabled={!canProceed}
            className="flex-1 sm:flex-none"
          >
            Proceed with Updated Cart
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default InsufficientQuantityModal;
