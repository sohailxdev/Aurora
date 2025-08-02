import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { UseFormReturn } from "react-hook-form";

interface UserInfoFormProps {
  form: UseFormReturn<{
    firstname: string;
    lastname: string;
    email: string;
    number: string;
  }>;
  onBack: () => void;
  onNext: () => void;
}

export default function UserInfoForm({
  form,
  onBack,
  onNext,
}: UserInfoFormProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        Contact Information{" "}
        <sup>
          <small className="text-red-600">
            (This will be used for delivery & order updates)
          </small>
        </sup>
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="firstname"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="after:ml-0.5 after:text-red-500 after:content-['*']">
                First Name
              </FormLabel>
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
              <FormLabel className="after:ml-0.5 after:text-red-500 after:content-['*']">
                Last Name
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="after:ml-0.5 after:text-red-500 after:content-['*']">
              Email
            </FormLabel>
            <FormControl>
              <Input {...field} type="email" disabled />
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
            <FormLabel className="after:ml-0.5 after:text-red-500 after:content-['*']">
              Phone
            </FormLabel>
            <FormControl>
              <Input {...field} type="tel" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex justify-between">
        <Button variant="outline" type="button" onClick={onBack}>
          Back
        </Button>
        <Button type="button" onClick={onNext}>
          Next: Payment Details
        </Button>
      </div>
    </div>
  );
}
