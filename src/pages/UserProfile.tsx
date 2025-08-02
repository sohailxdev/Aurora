import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, X, Check } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
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
import { profileSchema, type ProfileFormValues } from "@/app/User/userProfile";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { AddressManager } from "@/components/Custom/AddressManager";
import { getUserDetails, selectUser } from "@/app/User/userSlice";
import axios from "axios";
import { toast } from "sonner";
import { BASE_URL } from "@/lib/constant";
import { useAppDispatch } from "@/app/hooks";
import { Link } from "react-router-dom";
import { ForgotPassword } from "@/components/ForgotPassword";

export function UserProfile() {
  const dispatch = useAppDispatch();
  const { user, profileLoading } = useSelector(selectUser);
  const [editingPersonal, setEditingPersonal] = useState(false);

  useEffect(() => {
    dispatch(getUserDetails());
  }, [dispatch]);

  const defaultValues: ProfileFormValues = {
    firstname: user.firstname || "",
    lastname: user.lastname || "",
    email: user.email || "",
    number: user.number || "",
    addresses:
      user.addresses?.map((addr) => ({
        addressname: addr.addressName,
        local_address: addr.local_address,
        landmark: addr.landmark,
        district: addr.district,
        pincode: addr.pincode,
        city: addr.city,
        state: addr.state,
        country: addr.country,
      })) || [],
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues,
    values: defaultValues,
  });

  async function onSubmit(data: ProfileFormValues) {
    try {
      const res = await axios.put(BASE_URL + "/api/updateDetails", data);
      if (res.status === 200) {
        toast.success("Profile updated successfully", {
          duration: 1000,
          position: "top-center",
        });
        await dispatch(getUserDetails());
      }
    } catch (error) {
      toast.error("An error occurred while updating profile");
    }
    setEditingPersonal(false);
  }

  if (profileLoading) {
    return <div>Loading...</div>; // Consider using a proper loading component
  }

  return (
    <>
      <div className="space-y-8 my-8 max-w-7xl mx-auto mt-10">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="text-4xl">
              {user.firstname?.[0]}
              {user.lastname?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-semibold">
              {user.firstname} {user.lastname}
            </h1>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Personal Information Section */}
            <div>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold">
                      Personal Information
                    </h2>
                    {!editingPersonal ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingPersonal(true)}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button type="submit" size="sm" variant="ghost">
                          <Check className="mr-2 h-4 w-4" />
                          Save
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingPersonal(false)}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>

                  {!editingPersonal ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          First Name
                        </p>
                        <p className="mt-1">{form.getValues("firstname")}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Last Name
                        </p>
                        <p className="mt-1">{form.getValues("lastname")}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Email address
                        </p>
                        <p className="mt-1">{form.getValues("email")}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Phone
                        </p>
                        <p className="mt-1">{form.getValues("number")}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="firstname"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastname"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email address</FormLabel>
                            <FormControl>
                              <Input {...field} type="email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input {...field} type="tel" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            <div>
              {/* Address Section */}
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-lg font-semibold mb-6">Addresses</h2>
                  <AddressManager
                    addresses={user?.addresses}
                    onAddressesChange={(newAddresses) =>
                      form.setValue("addresses", newAddresses)
                    }
                  />
                </CardContent>
              </Card>
            </div>
          </form>
        </Form>
        <>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Password</h2>
                {/* <Button type="button" variant="outline">
                  <Link to="#">Change Password</Link>
                </Button> */}
                <ForgotPassword />
              </div>
            </CardContent>
          </Card>
        </>
      </div>
    </>
  );
}
