"use client";

import { getOfferSummary, getTotalOfferSavings } from "@/app/cart/cartApi";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface OfferSummaryProps {
  products: any[];
  className?: string;
}

export default function OfferSummary({
  products,
  className,
}: OfferSummaryProps) {
  const offerSummary = getOfferSummary(products);
  const totalSavings = getTotalOfferSavings(products);

  if (Object.keys(offerSummary).length === 0) {
    return null;
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          🎉 Offer Savings
          <Badge variant="secondary" className="bg-green-50 text-green-700">
            ₹{Math.round(totalSavings)} saved
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {Object.entries(offerSummary).map(([offerName, details]) => (
          <div key={offerName} className="space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="font-medium">
                {offerName}
              </Badge>
              <span className="text-sm text-green-600 font-medium">
                ₹{Math.round(details.totalSavings)} off
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              {offerName} free item{details.totalFreeItems !== 1 ? "s" : ""} •
              Applied {details.timesApplied} time
              {details.timesApplied !== 1 ? "s" : ""}
            </div>
            <Separator />
            <div className="text-xs text-muted-foreground">
              {details.totalFreeItems} free item
              {details.totalFreeItems !== 1 ? "s" : ""} • Applied{" "}
              {details.timesApplied} time{details.timesApplied !== 1 ? "s" : ""}
            </div>
            <Separator />
          </div>
        ))}
        <div className="flex items-center justify-between font-medium text-green-600">
          <span>Total Offer Savings:</span>
          <span>₹{Math.round(totalSavings)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
