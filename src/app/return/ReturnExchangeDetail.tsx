import { DialogDescription } from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate, formatPrice } from "@/pages/Orders";
import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/lib/constant";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Calendar, MapPin, Package } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ReturnDetails {
  returnProductId: string;
  orderId: string;
  productId: string;
  productName: string;
  sku: string;
  price: string;
  orderQuantity: string;
  returnReason: string;
  returnDate: string;
  returnStatus: string;
  rejectedReason: string;
  userId: string;
  userName: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  quantity: string;
  refundAmount: string;
  processedDate: string;
  remark: string;
  localAddress: string;
  landmark: string;
  district: string;
  state: string;
  city: string;
  country: string;
  pincode: string;
}

interface ExchangeDetails {
  id: string;
  orderId: string;
  productId: string;
  sku: {
    sku: string;
    color: string;
    size: string;
    price: string;
    images: string;
  };
  exchangeSku: {
    sku: string;
    color: string;
    size: string;
    price: string;
    images: string;
  };
  quantity: string;
  exchangeReason: string;
  exchangeStatus: string;
  remark: string;
  rejectedReason: string;
  userId: string;
  firstName: string;
  lastName: string;
  userEmail: string;
  exchangeDate: string;
  exchangeDelivered: string;
  localAddress: string;
  landmark: string;
  district: string;
  state: string;
  city: string;
  country: string;
  pincode: string;
}

const getStatusBadge = (status?: string) => {
  if (!status) return <Badge variant="outline">Unknown</Badge>;

  switch (status.toLowerCase()) {
    case "refund_initiated":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          Approved
        </Badge>
      );
    case "picked_up":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          Picked Up
        </Badge>
      );
    case "rejected":
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          Rejected
        </Badge>
      );
    case "exchange_approved":
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          Approved
        </Badge>
      );
    case "completed":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          Completed
        </Badge>
      );
    case "refunded":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          Refunded
        </Badge>
      );
    case "initiated":
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          Initiated
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const ReturnExchangeDetail = ({
  orderId,
  sku,
}: {
  orderId: number;
  sku: string;
}) => {
  const [returnDetails, setReturnDetails] = useState<ReturnDetails[]>([]);
  const [exchangeDetails, setExchangeDetails] = useState<ExchangeDetails[]>([]);
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("return");
  
  const getReturnDetails = async () => {
    try {
      const res = await axios.get(
        BASE_URL + `/api/returns/user?orderId=${orderId}&sku=${sku}`
      );
      setReturnDetails(res.data);
    } catch (error) {
      console.error("Error fetching return details:", error);
    }
  };

  const getExchangeDetails = async () => {
    try {
      const res = await axios.get(
        BASE_URL + `/api/exchange/user?orderId=${orderId}&sku=${sku}`
      );
      setExchangeDetails(res.data);
    } catch (error) {
      console.error("Error fetching exchange details:", error);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "return") {
      getReturnDetails();
    } else if (value === "exchange") {
      getExchangeDetails();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => {
            setOpen(true);
            getReturnDetails(); // Load return details by default
          }}
          size="sm"
          variant="outline"
        >
          Return / Exchange Details
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Return & Exchange Details</DialogTitle>
          <DialogDescription>
            Complete information about your product return and exchange requests
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue="return"
          value={activeTab}
          onValueChange={handleTabChange}
        >
          <TabsList className="grid w-fit grid-cols-2 mb-4">
            <TabsTrigger value="return">Return</TabsTrigger>
            <TabsTrigger value="exchange">Exchange</TabsTrigger>
          </TabsList>

          <TabsContent value="return">
            <ScrollArea className="pr-4 max-h-[calc(90vh-220px)]  overflow-scroll">
              {returnDetails.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                  <Package className="w-12 h-12 mb-3 opacity-20" />
                  <p>No return details available</p>
                </div>
              ) : (
                <Accordion type="single" collapsible className="w-full">
                  {returnDetails.map((returnItem, index) => (
                    <AccordionItem
                      key={returnItem.returnProductId || index}
                      value={returnItem.returnProductId || `return-${index}`}
                      className="border-b"
                    >
                      <AccordionTrigger className="py-4 hover:no-underline">
                        <div className="flex flex-1 items-center justify-between pr-4">
                          <div className="flex items-center gap-2">
                            <Package className="w-5 h-5 text-primary" />
                            <span className="font-medium">
                              Return #{returnItem.returnProductId}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(returnItem.returnStatus)}
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="flex flex-col gap-2">
                        {returnItem.rejectedReason && (
                          <div className="p-2 space-y-1 col-span-full text-red-600 rounded-md">
                            <p className="font-medium">Rejection Reason: </p>
                            <p className="capitalize">
                              {returnItem.rejectedReason || "NA"}
                            </p>
                          </div>
                        )}
                        <div className="space-y-6 bg-muted/70 p-3">
                          {returnItem.returnStatus?.toLowerCase() ===
                            "rejected" &&
                            returnItem.rejectedReason && (
                              <div className="space-y-1">
                                <p className="text-muted-foreground flex items-center gap-1">
                                  <AlertCircle className="w-4 h-4 text-destructive" />
                                  Rejection Reason
                                </p>
                                <p className="p-2 bg-destructive/10 text-destructive rounded-md">
                                  {returnItem.rejectedReason}
                                </p>
                              </div>
                            )}

                          <div className="space-y-3 p-3 rounded-lg">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                              <div className="space-y-1">
                                <p className="text-muted-foreground">Price: </p>
                                <p className="font-medium">
                                  {formatPrice(+returnItem.price) || "N/A"}
                                </p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-muted-foreground">
                                  Return Quantity:
                                </p>
                                <p className="font-medium">
                                  {returnItem.quantity || "0"}
                                </p>
                              </div>
                            </div>
                          </div>
                          {/* Return Details */}
                          <div className="space-y-3">
                            <h4 className="font-medium text-sm flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              Return Information
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                              <div className="space-y-1">
                                <p className="text-muted-foreground">
                                  Return Date:
                                </p>
                                <p>{formatDate(returnItem.returnDate)}</p>
                              </div>

                              <div className="space-y-1">
                                <p className="text-muted-foreground">
                                  Refund Amount
                                </p>
                                <p className="font-medium">
                                  {returnItem.refundAmount
                                    ? formatPrice(+returnItem.refundAmount)
                                    : "N/A"}
                                </p>
                              </div>
                            </div>

                            <div className="space-y-1 mt-2">
                              <p className="text-muted-foreground">
                                Return Reason
                              </p>
                              <p className="rounded-md">
                                {returnItem.returnReason ||
                                  "No reason provided"}
                              </p>
                            </div>

                            {/* {returnItem.remark && ( */}
                            <div className="space-y-1 mt-2">
                              <p className="text-muted-foreground">Remarks</p>
                              <p className="rounded-md">
                                {returnItem.remark || "No remarks added"}
                              </p>
                            </div>
                            {/* )} */}
                          </div>
                          {/* Address Details */}
                          <div className="space-y-3">
                            <h4 className="font-medium text-sm flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              Address Information
                            </h4>
                            <div className="text-sm space-y-2">
                              <p>{returnItem.localAddress}</p>
                              <p>Landmark: {returnItem.landmark || "None"}</p>
                              <p>
                                Local Address: {returnItem.city}
                                {returnItem.city && returnItem.district
                                  ? ", "
                                  : ""}
                                {returnItem.district}
                              </p>
                              <p>
                                {returnItem.state}
                                {returnItem.state && returnItem.country
                                  ? ", "
                                  : ""}
                                {returnItem.country} {returnItem.pincode}
                              </p>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="exchange">
            <ScrollArea className="pr-4 max-h-[calc(90vh-220px)] overflow-scroll">
              {exchangeDetails.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                  <Package className="w-12 h-12 mb-3 opacity-20" />
                  <p>No exchange details available</p>
                </div>
              ) : (
                <Accordion type="single" collapsible className="w-full">
                  {exchangeDetails.map((exchangeItem, index) => (
                    <AccordionItem
                      key={exchangeItem.id || index}
                      value={exchangeItem.id || `exchange-${index}`}
                      className="border-b"
                    >
                      <AccordionTrigger className="py-4 hover:no-underline">
                        <div className="flex flex-1 items-center justify-between pr-4">
                          <div className="flex items-center gap-2">
                            <Package className="w-5 h-5 text-primary" />
                            <span className="font-medium">
                              Exchange #{exchangeItem.id}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(exchangeItem.exchangeStatus)}
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="flex flex-col gap-2">
                        {exchangeItem.rejectedReason && (
                          <div className="p-2 space-y-1 col-span-full text-red-600 rounded-md">
                            <p className="font-medium">Rejection Reason: </p>
                            <p className="capitalize">
                              {exchangeItem.rejectedReason}
                            </p>
                          </div>
                        )}
                        <div className="space-y-6 bg-muted/70 p-3">
                          <div className="space-y-3 rounded-lg">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                              <div className="space-y-1">
                                <p className="text-muted-foreground">
                                  Exchange Date:{" "}
                                </p>
                                <p className="font-medium">
                                  {exchangeItem.exchangeDate
                                    ? formatDate(exchangeItem.exchangeDate)
                                    : "N/A"}
                                </p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-muted-foreground">
                                  Exchange Quantity:
                                </p>
                                <p className="font-medium">
                                  {exchangeItem.quantity || "0"}
                                </p>
                              </div>
                              {exchangeItem.exchangeDelivered && (
                                <div className="space-y-1">
                                  <p className="text-muted-foreground">
                                    {exchangeItem.exchangeStatus?.toLowerCase() ==
                                    "rejected"
                                      ? "Rejection"
                                      : "Exchange Delivered"}{" "}
                                    Date:
                                  </p>
                                  <p className="font-medium">
                                    {exchangeItem.exchangeDelivered
                                      ? formatDate(
                                          exchangeItem.exchangeDelivered
                                        )
                                      : "N/A"}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                          {/* Exchange Details */}
                          <div className="space-y-3">
                            <h4 className="font-medium text-sm flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              Exchange Information
                            </h4>

                            <div className="space-y-1 mt-2">
                              <p className="text-muted-foreground">
                                Exchange Reason
                              </p>
                              <p className="rounded-md ">
                                {exchangeItem.exchangeReason ||
                                  "No reason provided"}
                              </p>
                            </div>

                            {/* Exchange Size Attachment - Extra field for exchange */}
                            <div className="space-y-1 mt-2">
                              <p className="text-muted-foreground">
                                Exchanged Size
                              </p>
                              <p className="font-medium rounded-md ">
                                {exchangeItem.exchangeSku.size ||
                                  "Not specified"}
                              </p>
                            </div>

                            {exchangeItem.remark && (
                              <div className="space-y-1 mt-2">
                                <p className="text-muted-foreground">Remarks</p>
                                <p className="p-2 rounded-md">
                                  {exchangeItem.remark}
                                </p>
                              </div>
                            )}
                          </div>
                          {/* Address Details */}
                          <div className="space-y-3">
                            <h4 className="font-medium text-sm flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              Address Information
                            </h4>
                            <div className="text-sm space-y-2">
                              <p>{exchangeItem.localAddress}</p>
                              <p>Landmark: {exchangeItem.landmark || "None"}</p>
                              <p>
                                Local Address: {exchangeItem.city}
                                {exchangeItem.city && exchangeItem.district
                                  ? ", "
                                  : ""}
                                {exchangeItem.district}
                              </p>
                              <p>
                                {exchangeItem.state}
                                {exchangeItem.state && exchangeItem.country
                                  ? ", "
                                  : ""}
                                {exchangeItem.country} {exchangeItem.pincode}
                              </p>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReturnExchangeDetail;
