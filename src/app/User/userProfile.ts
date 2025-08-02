import * as z from "zod"

// This matches the API response structure
export const addressSchema = z.object({
  id: z.string().optional(),
  addressname: z.string().min(1, "Address name is required"),  // Changed from 'name' to 'addressname' to match API
  local_address: z.string().min(1, "Local address is required"),
  landmark: z.string().optional(),
  district: z.string().min(1, "District is required"),
  pincode: z.string().min(1, "Pincode is required"), // Changed from min(6) to min(1) as API shows "2" as valid
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
})

export const profileSchema = z.object({
  firstname: z.string().min(2, "First name must be at least 2 characters"), // Changed from 'firstName' to 'firstname' to match API
  lastname: z.string().min(2, "Last name must be at least 2 characters"),   // Changed from 'lastName' to 'lastname' to match API
  email: z.string().email("Invalid email address"),
  number: z.string().min(10, "Phone number must be at least 10 characters"), // Changed from 'phone' to 'number' to match API
  addresses: z.array(addressSchema),
})

// Type inference from the schemas
export type AddressFormValues = z.infer<typeof addressSchema>
export type ProfileFormValues = z.infer<typeof profileSchema>