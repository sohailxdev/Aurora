import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, X, Check, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { addressSchema, type AddressFormValues } from "@/app/User/userProfile";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "react-router-dom";

type AddressManagerProps = {
  addresses: AddressFormValues[];
  onAddressesChange: (addresses: AddressFormValues[]) => void;
};


export function AddressManager({
  addresses,
  onAddressesChange,
}: AddressManagerProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const form = useForm<{ addresses: AddressFormValues[] }>({
    resolver: zodResolver(addressSchema.array()),
    defaultValues: { addresses },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "addresses",
  });

  const onSubmit = (data: { addresses: AddressFormValues[] }) => {
    onAddressesChange(data.addresses);
    setEditingIndex(null);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4">
          {fields.map((field, index) => (
            <Card key={field.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    {field.addressname || `Address ${index + 1}`}
                  </h3>
                  <div className="flex gap-2">
                    {editingIndex === index ? (
                      <>
                        <Button size="sm" variant="ghost">
                          <Check className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={(e) => setEditingIndex(null)}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingIndex(index)}
                        >
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                {editingIndex === index ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name={`addresses.${index}.addressname`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address Name</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`addresses.${index}.local_address`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Local Address</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`addresses.${index}.landmark`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Landmark (Optional)</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`addresses.${index}.district`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>District</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`addresses.${index}.pincode`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pincode</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`addresses.${index}.city`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`addresses.${index}.state`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`addresses.${index}.country`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ) : (
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Local Address
                      </p>
                      <p className="mt-1">{field.local_address}</p>
                    </div>
                    {field.landmark && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Landmark
                        </p>
                        <p className="mt-1">{field.landmark}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        District
                      </p>
                      <p className="mt-1">{field.district}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Pincode
                      </p>
                      <p className="mt-1">{field.pincode}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">City</p>
                      <p className="mt-1">{field.city}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">State</p>
                      <p className="mt-1">{field.state}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Country
                      </p>
                      <p className="mt-1">{field.country}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </form>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-4"
        onClick={() => {
          append({
            addressname: "",
            local_address: "",
            landmark: "",
            district: "",
            pincode: "",
            city: "",
            state: "",
            country: "",
          });
          setEditingIndex(fields.length);
        }}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add New Address
      </Button>
    </Form>
  );
}
