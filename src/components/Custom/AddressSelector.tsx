import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import EditAddress from "@/pages/AddressModal";

interface Address {
  id?: string;
  addressName: string;
  local_address: string;
  landmark?: string;
  district: string;
  pincode: string;
  city: string;
  state: string;
  country: string;
}

interface AddressSelectorProps {
  addresses: Address[];
  selectedAddress: Address | undefined;
  setSelectedAddress: (address: Address) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function AddressSelector({
  addresses,
  selectedAddress,
  setSelectedAddress,
  onNext,
  onBack,
}: AddressSelectorProps) {
  const [addressError, setAddressError] = useState(false);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Shipping Address</h2>
      <div className="mx-auto p-6 border rounded-lg">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold border-b">Your addresses</h2>
          <ScrollArea className="max-h-[300px] overflow-y-auto p-1">
            <RadioGroup
              value={selectedAddress}
              onValueChange={setSelectedAddress}
              onClick={() => setAddressError(false)}
              className="space-y-4 p-2"
            >
              {addresses?.map((address, index) => (
                <div key={index} className="relative flex items-start">
                  <RadioGroupItem
                    id={`address-${index}`}
                    className="absolute left-4 top-4 mt-1"
                    value={address}
                  />
                  <label
                    htmlFor={`address-${index}`}
                    className="flex-1 cursor-pointer rounded-lg border p-4 pl-12 hover:bg-muted/50"
                  >
                    <div className="space-y-1">
                      <div className="font-medium">{address.addressName}</div>
                      <div className="text-sm text-muted-foreground">
                        {address.local_address}, {address.landmark},{" "}
                        {address.district}, {address.city}, {address.state},{" "}
                        {address.country} - {address.pincode}
                      </div>
                    </div>
                  </label>
                </div>
              ))}
            </RadioGroup>
          </ScrollArea>

          <EditAddress />
          {addressError && (
            <div className="text-red-600">
              Please select an address or add a new address
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" type="button" onClick={onBack}>
          Back
        </Button>
        <Button
          type="button"
          disabled={!selectedAddress}
          onClick={() => {
            if (selectedAddress) {
              onNext();
            } else {
              setAddressError(true);
            }
          }}
        >
          Next: User Information
        </Button>
      </div>
    </div>
  );
}
