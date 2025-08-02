import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { PromoCode, PromoCodeResponse } from "./type";
import { isPromoCodeValid } from "./PromoCode";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  applyPromoCode,
  clearPromoCode,
  selectPromoLoading,
  selectSelectedPromo,
} from "./promoSlice";
import { ProductType } from "../Product/type";

interface PromoCodeListProps {
  promoCodes: PromoCodeResponse | null | undefined;
  subtotal: number;
  products: ProductType[] | null;
}

export default function PromoCodeList({
  promoCodes,
  subtotal,
  products,
}: PromoCodeListProps) {
  const dispatch = useAppDispatch();
  const selectedPromo = useAppSelector(selectSelectedPromo);
  const isLoading = useAppSelector(selectPromoLoading);
  const [expanded, setExpanded] = useState(false);
  const [promoInput, setPromoInput] = useState("");
  const [filteredPromoCodes, setFilteredPromoCodes] = useState<
    PromoCode[] | undefined
  >([]);
  const [inputError, setInputError] = useState("");

  // Filter visible promo codes
  useEffect(() => {
    if (!promoInput) {
      // Show only visible promo codes when no input
      setFilteredPromoCodes(
        promoCodes?.content?.filter((promo) => promo.isVisible && promo.status)
      );
      setInputError("");
    } else {
      // When user inputs a promo code, show matching codes (including hidden ones if status is true)
      const matchingCodes = promoCodes?.content?.filter(
        (promo) =>
          promo.promoName.toLowerCase().includes(promoInput.toLowerCase()) &&
          promo.status
      );

      if (matchingCodes?.length === 0) {
        setInputError("No matching promo code found");
      } else {
        setInputError("");
      }

      setFilteredPromoCodes(matchingCodes);
    }
  }, [promoInput, promoCodes]);

  const handlePromoClick = (promo: PromoCode) => {
    // If the same promo is clicked again, remove it
    if (selectedPromo?.id === promo.id) {
      dispatch(clearPromoCode());
    } else {
      // Apply the promo code
      dispatch(applyPromoCode({ promoCode: promo, products, subtotal }));
    }
  };

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!promoInput) {
      setInputError("Please enter a promo code");
      return;
    }

    const matchingPromo = promoCodes?.content?.find(
      (promo) => promo.promoName.toLowerCase() === promoInput.toLowerCase()
    );

    if (!matchingPromo) {
      setInputError("Invalid promo code");
      return;
    }

    if (!isPromoCodeValid(matchingPromo, subtotal)) {
      setInputError(
        `Minimum order amount of ₹${matchingPromo.minimumAmount} required`
      );
      return;
    }

    dispatch(applyPromoCode({ promoCode: matchingPromo, products, subtotal }));
    toast.success(
      `Promo code ${matchingPromo.promoName} applied successfully!`
    );
    setPromoInput("");
  };

  return (
    <div className="mt-4 space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Available Promo Codes</h3>
        {filteredPromoCodes && filteredPromoCodes.length > 2 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="text-xs"
          >
            {expanded ? "Hide" : "View All"}
          </Button>
        )}
      </div>

      {/* Promo code input */}
      <form onSubmit={handlePromoSubmit} className="flex gap-2">
        <Input
          placeholder="Enter promo code"
          value={promoInput}
          onChange={(e) => setPromoInput(e.target.value)}
          className="text-sm"
          disabled={isLoading}
        />
        <Button type="submit" size="sm" disabled={isLoading}>
          {isLoading ? "Applying..." : "Apply"}
        </Button>
      </form>
      {inputError && <p className="text-xs text-destructive">{inputError}</p>}

      {/* Selected promo code */}
      {selectedPromo &&
        !expanded &&
        // Only show selectedPromo separately if it's NOT in the default 2 promos
        filteredPromoCodes &&
        !filteredPromoCodes.slice(0, 2).some((promo) => promo.id === selectedPromo.id) && (
          <div className="p-2 border border-primary rounded-md bg-primary/10">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{selectedPromo.promoName}</span>
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground">
                  {selectedPromo.description}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => dispatch(clearPromoCode())}
                disabled={isLoading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-xs text-green-600 mt-1">
              {selectedPromo.valueType === "PERCENTAGE"
                ? `${selectedPromo.value}% discount applied`
                : `₹${selectedPromo.value} discount applied`}
            </div>
          </div>
      )}

      {/* Promo code list */}
      {filteredPromoCodes && filteredPromoCodes.length > 0 && (
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {(expanded ? filteredPromoCodes : filteredPromoCodes.slice(0, 2)).map(
            (promo) => {
              const meetsMinimumAmount = subtotal >= promo.minimumAmount;
              return (
                <div
                  key={promo.id}
                  className={`p-2 rounded-md cursor-pointer transition-colors ${
                    selectedPromo?.id === promo.id
                      ? "border-primary bg-primary/10 border"
                      : meetsMinimumAmount
                      ? "border hover:bg-accent"
                      : "border-dashed border hover:bg-accent opacity-70"
                  }`}
                  onClick={() => {
                    if (meetsMinimumAmount) handlePromoClick(promo);
                  }}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{promo.promoName}</span>
                        {selectedPromo?.id === promo.id && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {promo.description}
                      </p>
                    </div>
                    <Badge
                      variant={
                        promo.valueType === "PERCENTAGE"
                          ? "outline"
                          : "secondary"
                      }
                    >
                      {promo.valueType === "PERCENTAGE"
                        ? `${promo.value}% OFF`
                        : `₹${promo.value} OFF`}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Min. order: ₹{promo.minimumAmount}
                    {promo.endDate && (
                      <span> • Valid till: {promo.endDate}</span>
                    )}
                  </div>
                  {!meetsMinimumAmount && (
                    <div className="text-xs text-amber-600 mt-1">
                      Add ₹{promo.minimumAmount - subtotal} more to apply
                    </div>
                  )}
                </div>
              );
            }
          )}
        </div>
      )}

      {/* No promos available message */}
      {filteredPromoCodes &&
        filteredPromoCodes.length === 0 &&
        !selectedPromo && (
          <div className="p-2 border rounded-md text-center text-sm text-muted-foreground">
            No matching promo codes available
          </div>
        )}
    </div>
  );
}
