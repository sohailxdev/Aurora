import { CreditCard, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function PaymentModal({
  open,
  setOpen,
  paymentMode,
  setPaymentMode,
  handleConfirm,
}: any) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Payment Method</DialogTitle>
          <DialogDescription>
            Choose your preferred payment method to continue
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <RadioGroup
            defaultValue="online"
            value={paymentMode}
            onValueChange={setPaymentMode}
            className="grid grid-cols-2 gap-4"
          >
            <div className="cursor-pointer">
              <RadioGroupItem
                value="ONLINE"
                id="online"
                className="peer sr-only"
              />
              <Label
                htmlFor="online"
                className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <CreditCard className="mb-3 h-6 w-6" />
                Online Payment
              </Label>
            </div>
            <div>
              <RadioGroupItem value="COD" id="cod" className="peer sr-only" />
              <Label
                htmlFor="cod"
                className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <Wallet className="mb-3 h-6 w-6" />
                Cash on Delivery
              </Label>
            </div>
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button onClick={() => handleConfirm(paymentMode)} className="w-full">
            Confirm Payment Method
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}