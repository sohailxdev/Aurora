import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ShoppingBag, Package2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRef } from "react";
import { Confetti, type ConfettiRef } from "@/components/magicui/confetti";

interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
}

interface OrderItem {
  productId: number;
  productName: string;
  productSubheading: string | null;
  productDescription: string;
  sku: string;
  images: string[];
  color: string | null;
  price: number;
  quantity: number;
}

interface OrderData {
  orderId: number;
  razorpayOrderId?: string;
  paymentMethod: "ONLINE" | "COD";
  paymentStatus: "SUCCESSFUL" | "PENDING";
  orderAmount: number;
  city: string;
  country: string;
  state: string;
  district: string;
  landmark: string | null;
  localAddress: string | null;
  pincode: string;
  orderDate: string;
  user: User;
  items: OrderItem[];
}

const checkmarkAnimation = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.8, ease: "easeInOut" },
  },
};

const containerAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function PostOrderPage() {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const [hideConfetti, setHideConfetti] = useState(false);

  const confettiRef = useRef<ConfettiRef>(null);

  // Use the state from router or fallback to null
  const orderData: OrderData | null = JSON.parse(
    sessionStorage.getItem("orderData") || "null"
  );

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  useEffect(() => {
    if (orderData) {
      confettiRef.current?.fire({});
    }
    setTimeout(() => {
      setHideConfetti(true);
    }, 3000);
  }, []);

  // Clear sessionStorage after displaying order data (optional)
  useEffect(() => {
    return () => {
      sessionStorage.removeItem("orderData");
    };
  }, []);

  if (!orderData) {
    setTimeout(() => {
      navigate("/user/orders");
    }, 2000);

    return (
      <div className="container mx-auto h-[60vh] flex items-center justify-center py-12 px-4 text-center">
        No order data available
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 max-w-7xl">
      <Confetti
        ref={confettiRef}
        className={`absolute left-0 top-0 z-0 size-full ${
          hideConfetti ? "hidden" : "block"
        }`}
      />
      <Confetti
        ref={confettiRef}
        className={`absolute left-0 top-0 z-0 size-full ${
          hideConfetti ? "hidden" : "block"
        }`}
      />

      <motion.div
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        variants={containerAnimation}
      >
        <Card className="border-2 border-muted">
          <CardHeader className="border-b bg-muted/10">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-green-50 p-2">
                <motion.div initial="hidden" animate="visible">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </motion.div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">
                  Order #{orderData.orderId}
                </div>
                <CardTitle className="text-xl">
                  Thank you, {orderData.user.firstname}{" "}
                  {orderData.user.lastname}!
                </CardTitle>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Order Updates</h3>
                  <div className="bg-muted/10 rounded-lg p-4">
                    <p className="text-sm mt-2">
                      Payment Method: {orderData.paymentMethod}
                      <br />
                      Status: {orderData.paymentStatus}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Contact</h3>
                  <p className="text-sm">{orderData.user.email}</p>
                  <p className="text-sm">{orderData.user.phone}</p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Shipping Address</h3>
                  <div className="text-sm space-y-1">
                    <p>
                      {orderData.user.firstname} {orderData.user.lastname}
                    </p>
                    <p>{orderData.localAddress}</p>
                    {orderData.landmark && <p>{orderData.landmark}</p>}
                    <p>
                      {orderData.city}, {orderData.state} {orderData.pincode}
                    </p>
                    <p>{orderData.country}</p>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div>
                <div className="mb-4">
                  <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
                  <ScrollArea
                    scrollHideDelay={1800000}
                    className={`${
                      orderData.items.length > 3 ? "h-[300px]" : "h-max"
                    } min-h-fit border rounded pr-4 mb-6`}
                  >
                    <div className="space-y-4">
                      {orderData.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 p-3 rounded-lg bg-muted/10"
                        >
                          <div className="w-16 h-16 rounded-lg flex items-center justify-center overflow-hidden">
                            <img
                              src={item.images[0]}
                              alt={item.productName}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">
                              {item.productName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              SKU: {item.sku}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">
                              {formatPrice(item.price)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              x{item.quantity}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  <div className="space-y-3 border-t pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Total Amount
                      </span>
                      <span>{formatPrice(orderData.orderAmount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-green-500">Free</span>
                    </div>
                    <div className="flex justify-between font-medium pt-3 border-t text-lg">
                      <span>Total</span>
                      <span>{formatPrice(orderData.orderAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="border-t bg-muted/10 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => navigate("/user/orders")}
              className="mt-6 cursor-pointer"
            >
              <Package2 className="w-4 h-4 mr-2" />
              View Orders
            </Button>
            <Button
              onClick={() => navigate("/category")}
              className="mt-6 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
