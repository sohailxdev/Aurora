import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";
import { BASE_URL } from "@/lib/constant";
import { toast } from "sonner";
import { useAppDispatch } from "@/app/hooks";
import { getUserDetails } from "@/app/User/userSlice";
import { useState } from "react";

const addressSchema = z.object({
  id: z.string().optional(),
  addressName: z.string().min(1, "Address name is required"),
  local_address: z.string().min(1, "Local address is required"),
  landmark: z.string().optional(),
  district: z.string().min(1, "District is required"),
  pincode: z.string().min(1, "Pincode is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
});

function EditAddress() {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      addressName: "",
      local_address: "",
      landmark: "",
      district: "",
      pincode: "",
      city: "",
      state: "",
      country: "",
    },
  });
  const dispatch = useAppDispatch();

  const onSubmit = async (data: z.infer<typeof addressSchema>) => {
    try {
      const res = await axios.post(BASE_URL + "/api/addAddress", data);
      if (res.status === 200) {
        toast.success("Address Added successfully", {
          duration: 1000,
          position: "top-center",
        });
        dispatch(getUserDetails());
        setOpen(false);
      }
    } catch (error) {
      toast.error("An error occurred while updating profile");
    }
  };
  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button
            variant="link"
            type="button"
            className="h-auto p-0 text-primary"
          >
            <Plus className="h-4 w-4" />
            Add a new address
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[95dvh] overflow-y-auto border">
          <DialogHeader>
            <DialogTitle>Add a new address</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 bg-white rounded-lg  text-black"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-black">
                <FormField
                  control={form.control}
                  name="addressName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className=" after:ml-0.5 after:text-red-500 after:content-['*']">
                        Address Name
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Home, Work" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className=" after:ml-0.5 after:text-red-500 after:content-['*']">
                        Country
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter your country" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="local_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" after:ml-0.5 after:text-red-500 after:content-['*']">
                      Local Address
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter full address" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="landmark"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" after:ml-0.5 after:text-red-500 after:content-['*']">
                      Landmark (Optional)
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Near a famous place (Optional)"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className=" after:ml-0.5 after:text-red-500 after:content-['*']">
                        District
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter your district" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pincode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className=" after:ml-0.5 after:text-red-500 after:content-['*']">
                        Pincode
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          placeholder="Enter 6-digit pincode"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className=" after:ml-0.5 after:text-red-500 after:content-['*']">
                        City
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter your city" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className=" after:ml-0.5 after:text-red-500 after:content-['*']">
                        State
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter your state" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EditAddress;
