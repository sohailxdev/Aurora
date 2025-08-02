import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { XIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useUrlParam } from "@/hooks/useUrlParams";
import { closeLoginModal as cleanUrlParams } from "@/lib/utils";
import { useAppDispatch } from "@/app/hooks";
import { userLogin } from "@/app/User/userSlice";
import { Navigate, useNavigate } from "react-router-dom";
import { BASE_URL } from "@/lib/constant";
import axios from "axios";
import { toast } from "sonner";
import { Label } from "../ui/label";

const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(4, {
    message: "Password is required.",
  }),
  groupCompanyId: z.literal("1"),
});

const registrationSchema = loginSchema
  .extend({
    confirmPassword: z.string().min(4, {
      message: "Confirm password is required.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof registrationSchema>;

export function AuthModal() {
  const [isLogin, setIsLogin] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [registrationEmail, setRegistrationEmail] = useState("");
  const [showEmailField, setShowEmailField] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");

  const dispatch = useAppDispatch();

  const authParam = useUrlParam("auth");
  const redirectParams = useUrlParam("redirect");
  const navigate = useNavigate();

  useEffect(() => {
    setIsOpen(authParam === "login");

    // Check for stored credentials when component mounts
    const storedCredentials = localStorage.getItem("rememberedCredentials");
    if (storedCredentials) {
      const { email, password } = JSON.parse(storedCredentials);
      form.setValue("email", email);
      form.setValue("password", password);
      setRememberMe(true);
    }
  }, [authParam]);

  const form = useForm<FormData>({
    resolver: zodResolver(isLogin ? loginSchema : registrationSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      groupCompanyId: "1",
    },
  });

  useEffect(() => {
    // Update the form schema dynamically when isLogin changes
    form.reset({
      email: "",
      password: "",
      confirmPassword: "",
      groupCompanyId: '1'
    });
  }, [isLogin]);

  const handleLogin = async (data: FormData) => {
    const res = await dispatch(userLogin(data));
    if (res.meta.requestStatus === "fulfilled") {
      // Get redirect path
      const redirectPath = redirectParams || "/user/profile";
      // Navigate after login
      navigate(decodeURIComponent(redirectPath));
      setIsOpen(false);
      return <Navigate to={decodeURIComponent(redirectPath)} replace />;
    } else {
      const errorMsg =
        res?.payload?.error?.response?.data?.message ||
        res?.payload?.error?.response?.data;
      toast.error(errorMsg || "Something went wrong.", {
        position: "top-center",
        duration: 3000,
      });
    }
  };

  async function onSubmit(values: FormData) {
    // Handling remember me functionality
    if (isLogin) {
      if (rememberMe) {
        localStorage.setItem(
          "rememberedCredentials",
          JSON.stringify({
            email: values.email,
            password: values.password,
          })
        );
      } else {
        localStorage.removeItem("rememberedCredentials");
      }

      // Handle form submission
      handleLogin(values);
    } else {
      if (values.password !== values.confirmPassword) {
        toast.error("Passwords don't match", { position: "top-center" });
        return;
      }

      try {
        const res = await axios.post(BASE_URL + "/api/addCustomer", {
          email: values.email,
          password: values.password,
        });

        if (res.status === 201) {
          toast.success(
            "Registration successful! Please verify your email with OTP",
            { position: "top-center" }
          );
          setShowOtpField(true);
          setRegistrationEmail(values.email);
        }
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
          if (error.response.status === 409) {
            toast.error("Email already exists", { position: "top-center" });
          } else {
            toast.error(
              `${error?.response?.data?.message?.charAt(0).toUpperCase() +
              error?.response?.data?.message?.slice(1)
              }!`,
              { position: "top-center" }
            );
          }
        } else {
          // Handle non-Axios errors or unexpected errors
          console.error("Unexpected error:", error);
          toast.error("An unexpected error occurred. Please try again.", {
            position: "top-center",
          });
        }
      }
    }
  }

  const closeLoginModal = () => {
    // if (localStorage.getItem("token")) {
    //   window.history.pushState({}, "", window.location.pathname);
    // } else {
    //   // navigate("/");
    // }
    cleanUrlParams();
    setIsOpen(false);
  };

  const handleRememberMeChange = (checked: boolean) => {
    setRememberMe(checked);
    if (!checked) {
      localStorage.removeItem("rememberedCredentials");
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await axios.post(BASE_URL + "/auth/verifyotp", {
        email: registrationEmail,
        otp: otp,
        purpose: "VERIFY_EMAIL",
      });

      if (res.status === 200) {
        toast.success("Email verified successfully!", {
          position: "top-center",
        });
        setShowOtpField(false);
        setIsLogin(true);

        // Pre-fill login form with registration email and password
        form.setValue("email", registrationEmail);
        // Note: We don't have the password at this point since we've moved to a new state
        // The user will need to enter their password again
      }
    } catch (error) {
      setOtpError("Invalid OTP. Please try again.");
      toast.error("Invalid OTP. Please try again.", { position: "top-center" });
    } finally {
      setOtp("");
    }
  };

  const resendOtp = async () => {
    try {
      const res = await axios.post(BASE_URL + "/api/resend-otp", {
        email: registrationEmail,
      });

      if (res.status === 200) {
        toast.success("OTP resent successfully!", { position: "top-center" });
      }
    } catch (error: any) {
      const errMsg = error?.response?.data?.message || error?.response?.data;
      toast.error(errMsg || "Failed to resend OTP. Please try again.", {
        position: "top-center",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed z-40 inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white relative rounded-xl mt-[8%] overflow-hidden min-w-[400px] p-8">
        <XIcon
          className="absolute top-4 right-4 w-6 h-6 text-gray-500 cursor-pointer"
          onClick={closeLoginModal}
        />
        <div className="flex justify-center mb-6">
          <img
            src="/LOGO.png"
            alt="House of Valor"
            className="w-28 object-cover"
          />
        </div>

        <AnimatePresence mode="popLayout" initial={false}>
          {isLogin && !showEmailField ? (
            <motion.div
              key="login"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
            >
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold">Welcome back</h2>
                  <p className="text-sm text-gray-500">
                    Please enter your details to sign in.
                  </p>
                </div>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your email..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="remember"
                          checked={rememberMe}
                          onCheckedChange={handleRememberMeChange}
                        />
                        <label htmlFor="remember" className="text-sm">
                          Remember me
                        </label>
                      </div>
                      <button className="text-sm text-primary hover:underline">
                        Forgot password?
                      </button>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-[#776e45] text-white hover:bg-[#776e45]/90"
                    >
                      Sign in
                    </Button>
                  </form>
                </Form>

                <p className="text-center text-sm text-gray-500">
                  Don't have an account?{" "}
                  <button
                    onClick={() => setIsLogin(false)}
                    className="text-[#776e45] hover:underline"
                  >
                    Sign Up
                  </button>
                </p>
                <p className="text-center text-sm text-gray-500">
                  Need to verify your email?{" "}
                  <button
                    onClick={() => setShowEmailField(true)}
                    className="text-[#776e45] hover:underline"
                  >
                    Verify Email
                  </button>
                </p>
              </div>
            </motion.div>
          ) : showEmailField ? (
            <motion.div
              key="verify-email"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
            >
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold">Verify Email</h2>
                  <p className="text-sm text-gray-500">
                    Enter your email to receive an OTP.
                  </p>
                </div>
                {!showOtpField ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={verificationEmail}
                        onChange={(e) => setVerificationEmail(e.target.value)}
                        placeholder="Enter your email"
                      />
                    </div>
                    <Button
                      onClick={resendOtp}
                      className="w-full bg-[#776e45] text-white hover:bg-[#776e45]/90"
                    >
                      Send OTP
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Enter OTP</Label>
                      <Input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter OTP"
                      />
                      {otpError && (
                        <p className="text-sm text-red-500">{otpError}</p>
                      )}
                    </div>
                    <Button
                      onClick={handleVerifyOtp}
                      className="w-full bg-[#776e45] text-white hover:bg-[#776e45]/90"
                    >
                      Verify OTP
                    </Button>
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={resendOtp}
                        className="text-sm text-[#776e45] hover:underline"
                      >
                        Resend the OTP
                      </button>
                    </div>
                  </div>
                )}
                <p className="text-center text-sm text-gray-500">
                  Back to{" "}
                  <button
                    onClick={() => {
                      setShowEmailField(false);
                      setShowOtpField(false);
                    }}
                    className="text-primary hover:underline"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="register"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
            >
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold">Create an account</h2>
                  <p className="text-sm text-gray-500">
                    Please enter your details to sign up.
                  </p>
                </div>

                {!showOtpField ? (
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your email..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full bg-[#776e45] text-white hover:bg-[#776e45]/90"
                      >
                        Create account
                      </Button>
                    </form>
                  </Form>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Enter OTP sent to your email</Label>
                      <Input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter OTP"
                      />
                      {otpError && (
                        <p className="text-sm text-red-500">{otpError}</p>
                      )}
                    </div>
                    <Button
                      onClick={handleVerifyOtp}
                      className="w-full bg-[#776e45] text-white hover:bg-[#776e45]/90"
                    >
                      Verify OTP
                    </Button>
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={resendOtp}
                        className="text-sm text-[#776e45] hover:underline"
                      >
                        Resend the OTP
                      </button>
                    </div>
                  </div>
                )}

                <p className="text-center text-sm text-gray-500">
                  Already have an account?{" "}
                  <button
                    onClick={() => {
                      setIsLogin(true);
                      setShowOtpField(false);
                    }}
                    className="text-primary hover:underline"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
