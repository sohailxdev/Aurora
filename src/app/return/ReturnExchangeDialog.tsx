"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import ReturnSteps from "./ReturnSteps";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { X } from "lucide-react";
import { Order } from "../orders/types";
import { Label } from "@/components/ui/label";

interface ReturnExchangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order;
}

export default function ReturnExchangeDialog({
  open,
  onOpenChange,
  order,
}: ReturnExchangeDialogProps) {
  const [startReturn, setStartReturn] = useState(false);
  const [selectRequestType, setRequestType] = useState("");

  const handleCloseDialog = () => {
    setRequestType("");
    setStartReturn(false);
    onOpenChange(false);
  };

  if (startReturn) {
    return (
      <AlertDialog open={open} onOpenChange={handleCloseDialog}>
        <AlertDialogContent className="max-w-4xl max-h-[95vh] overflow-auto">
          <ReturnSteps
            order={order}
            requestType={selectRequestType}
            onComplete={handleCloseDialog}
          />
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={handleCloseDialog}>
      <AlertDialogContent className="max-w-4xl max-h-[95vh] overflow-auto">
        <AlertDialogHeader className="flex flex-row justify-between">
          <AlertDialogTitle>
            Do you want to return or exchange the product?
          </AlertDialogTitle>
          <AlertDialogDescription>
            <X onClick={handleCloseDialog} />
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-6">
          <RadioGroup
            onValueChange={(value) => setRequestType(value)}
            className="space-y-4"
          >
            <Label
              htmlFor="choice-return"
              className={`flex items-start p-4 border rounded-lg ${
                selectRequestType === "return"
                  ? "border-primary"
                  : "border-border"
              }`}
            >
              <RadioGroupItem
                value="return"
                id="choice-return"
                className="mt-1 mr-4"
              />
              <div>
                <div className="font-medium">Return</div>
                <div className="text-sm text-muted-foreground">
                  Return the product for a refund.
                </div>
              </div>
            </Label>

            <Label
              htmlFor="choice-exchange"
              className={`flex items-start p-4 border rounded-lg ${
                selectRequestType === "exchange"
                  ? "border-primary"
                  : "border-border"
              }`}
            >
              <RadioGroupItem
                value="exchange"
                id="choice-exchange"
                className="mt-1 mr-4"
              />
              <div>
                <div className="font-medium">Exchange</div>
                <div className="text-sm text-muted-foreground">
                  Exchange the product for a different size.
                </div>
              </div>
            </Label>
          </RadioGroup>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleCloseDialog}>
            Cancel
          </Button>
          <Button
            onClick={() => setStartReturn(true)}
            disabled={!selectRequestType}
          >
            Continue
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
