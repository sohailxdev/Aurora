import { AlertCircle, Copy, ShoppingBag } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Link, Navigate } from "react-router-dom";
import { FinalOrderData } from "./Checkout";

interface OrderErrorData {
  city: string;
  country: string;
  district: string;
  items: Array<{
    productId: number;
    quantity: number;
    sku: string;
    price: number;
  }>;
  landmark: string | null;
  amount: number;
  paymentMethod: "ONLINE" | "COD";
  // paymentStatus: "SUCCESSFUL" | "PENDING";
  pincode: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  state: string;
}

export default function OrderError() {
  const errorData: FinalOrderData | null = JSON.parse(
    sessionStorage.getItem("orderData") || "null"
  );

  // Redirect if no error data is present
  if (!errorData) {
    return <Navigate to="/category" replace />;
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast("Payment details copied to clipboard");
  };

  const paymentDetails =
    errorData.paymentMethod === "ONLINE"
      ? `
Payment ID: ${errorData.razorpay_payment_id}
Order ID: ${errorData.razorpay_order_id}
Signature: ${errorData.razorpay_signature}
Amount: ${
          errorData.order_amount
            ? errorData.order_amount / 100
            : errorData.order_amount
        }
    `.trim()
      : "";

  return (
    <div className="container max-w-3xl py-12 mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <CardTitle className="text-xl">Order Processing Error</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert variant="destructive">
            <AlertCircle className="w-4 h-4" />
            <AlertTitle>Order Creation Failed</AlertTitle>
            <AlertDescription>
              {errorData.paymentMethod === "ONLINE"
                ? "Your payment was successful, but we encountered an issue while creating your order."
                : "We encountered an issue while processing your order."}
            </AlertDescription>
          </Alert>

          {errorData.paymentMethod === "ONLINE" && (
            <div className="space-y-4">
              <h3 className="font-medium">Payment Details</h3>
              <div className="p-4 space-y-2 text-sm bg-muted rounded-lg">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment ID:</span>
                  <span className="font-mono">
                    {errorData.razorpay_payment_id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order ID:</span>
                  <span className="font-mono">
                    {errorData.razorpay_order_id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <span>₹{errorData.order_amount}</span>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => copyToClipboard(paymentDetails)}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Payment Details
              </Button>
            </div>
          )}

          <div>
            <h3 className="mb-4 font-medium">Order Summary</h3>
            <div className="space-y-4">
              {errorData?.items?.map((item) => (
                <div key={item.sku} className="flex justify-between text-sm">
                  <span>
                    {item.quantity}x {item.sku}
                  </span>
                  <span>₹{item.price}</span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>₹{errorData.order_amount}</span>
              </div>
            </div>
          </div>

          <div className="p-4 text-sm bg-muted rounded-lg">
            {errorData.paymentMethod === "ONLINE" ? (
              <p>
                Please save these payment details{" "}
                <b>(either copy or take a screenshot)</b> and contact our
                customer support team for assistance. We will help resolve this
                issue as quickly as possible.
              </p>
            ) : (
              <p>
                We apologize for the inconvenience. Please try placing your
                order again or contact our customer support team if the issue
                persists.
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center gap-2 sm:flex-row">
          {errorData.paymentMethod === "COD" ? (
            <Link className="w-1/2" to="/user/checkout">
              <Button className="w-full">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </Link>
          ) : (
            <Link className="w-1/2" to="/support">
              <Button className="w-full">Contact Support</Button>
            </Link>
          )}
          <Link className="w-1/2" to="/category">
            <Button variant="outline" className="w-full">
              Continue Shopping
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
