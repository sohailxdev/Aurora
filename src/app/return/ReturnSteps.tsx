"use client";

import { useEffect, useState } from "react";
import { ClipboardList, Truck, FileCheck, X, CircleHelp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAppDispatch, useAppSelector } from "../hooks";
import { getUserDetails, selectUser } from "../User/userSlice";
import { dateAfter15days, formatDate } from "@/pages/Orders";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  fetchReaonsAsync,
  selectReasonsEntity,
} from "../reasonMaster/reasonsMasterSlice";
import axios from "axios";
import { BASE_URL } from "@/lib/constant";
import { fetchOrdersAsync } from "../orders/ordersSlice";
import type { Order } from "../orders/types";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface ReturnSteps {
  order: Order;
  onComplete: () => void;
  requestType: string;
}

const steps = [
  { id: "choice", label: "Return or Exchange", icon: CircleHelp },
  { id: "details", label: "Your details", icon: ClipboardList },
  { id: "pickup", label: "Address", icon: Truck },
  { id: "review", label: "Review & Submit", icon: FileCheck },
];

export interface ReturnResponse {
  id: string;
  returnProductId: string;
  orderId: string;
  productId: string;
  productName: string;
  sku: string;
  skuDetails: string | null;
  price: string;
  orderQuantity: string;
  returnReason: string;
  returnDate: string;
  returnStatus: string;
  rejectedReason: string | null;
  userId: string;
  userName: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  quantity: string;
  refundAmount: string;
  processedDate: string | null;
  remark: string | null;
  localAddress: string;
  landmark: string;
  district: string;
  state: string;
  city: string;
  country: string;
  pincode: string;
}

interface Image {
  img_Id: string;
  img_url: string;
  img_name: string;
  img_type: string;
}

interface SKU {
  sku: string;
  imgs: Image[];
  size: string;
  color: string;
  price: string;
  keyName: string;
  pattern: string;
  quantity: string;
}

interface Product {
  skus: SKU[];
  productId: number;
}

export default function ReturnSteps({
  order,
  onComplete,
  requestType,
}: ReturnSteps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    choice: "",
    returnReason: "",
    additionalInfo: "",
    pickupAddress: "",
    quantities: {} as { [key: string]: string },
    itemReasons: {} as { [key: string]: string },
    itemRemarks: {} as { [key: string]: string },
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [responseData, setResponseData] = useState<ReturnResponse[]>([]);
  const [availableSkusByColor, setAvailableSkusByColor] = useState<Product[]>(
    []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAlternativeSkus, setSelectedAlternativeSkus] = useState<{
    [key: string]: string;
  }>({});

  const address = useAppSelector(selectUser).user?.addresses;

  useEffect(() => {
    !address && dispatch(getUserDetails());
  }, [address]);

  const returnExchangeReasons = useAppSelector(selectReasonsEntity);
  const dispatch = useAppDispatch();
  useEffect(() => {
    !returnExchangeReasons && dispatch(fetchReaonsAsync());
  }, [returnExchangeReasons]);

  const selectedProducts = order.items.filter((item) =>
    selectedItems.includes(item.sku)
  );

  const handleItemToggle = (item: any) => {
    setSelectedItems((prev) =>
      prev.includes(item.sku)
        ? prev.filter((id) => id !== item.sku)
        : [...prev, item.sku]
    );

    if (!selectedItems.includes(item.sku)) {
      const quantity =
        item.remainingQuantity > 1 ? "1" : item.remainingQuantity.toString();
      updateProductData(item.sku, "quantities", quantity);
    } else {
      updateProductData(item.sku, "quantities", "");
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return selectedItems.length > 0;
      case 1:
        return selectedProducts.every(
          (product) =>
            formData.itemReasons[product.sku] &&
            (requestType !== "exchange" || selectedAlternativeSkus[product.sku])
        );
      case 2:
        return formData.pickupAddress !== "";
      case 3:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    try {
      if (currentStep < steps.length - 1) {
        setCurrentStep((prev) => prev + 1);
        if (currentStep == 2) {
          !address && dispatch(getUserDetails());
        }
      } else {
        setIsSubmitted(true);
      }
    } catch (error) {}
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateProductData = <K extends keyof typeof formData>(
    sku: string,
    field: K,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...(prev[field] as Record<string, string>),
        [sku]: value,
      },
    }));
  };

  const handleStepClick = (index: number) => {
    setCurrentStep(index);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const pickupAddress = address.find((a) => a.id == formData.pickupAddress);

    if (requestType == "return") {
      try {
        const returnRequest = {
          orderId: order.orderId,
          items: selectedProducts.map((product) => ({
            productId: product.productId,
            sku: product.sku,
            quantity: formData.quantities[product.sku],
            returnReason: formData.itemReasons[product.sku],
            remarks: formData.itemRemarks[product.sku] || "",
          })),
          city: pickupAddress?.city || "",
          country: pickupAddress?.country || "",
          state: pickupAddress?.state || "",
          district: pickupAddress?.district || "",
          localAddress: pickupAddress?.local_address || "",
          landmark: pickupAddress?.landmark || "",
          pincode: pickupAddress?.pincode || "",
        };
        // return;
        const res = await axios.post(
          BASE_URL + "/api/returns/addReturn",
          returnRequest
        );
        setResponseData(res.data);
        setIsSubmitted(true);
      } catch (error: any) {
        toast.error(error);
      } finally {
        setIsSubmitting(false);
      }
    } else if (requestType == "exchange") {
      const exchangeReuqest = {
        orderId: order.orderId,
        items: selectedProducts.map((product) => ({
          productId: product.productId,
          sku: product.sku,
          quantity: formData.quantities[product.sku],
          exchangeReason: formData.itemReasons[product.sku],
          remark: formData.itemRemarks[product.sku] || "",
          exchangeSKU: selectedAlternativeSkus[product.sku] || "",
        })),
        city: pickupAddress?.city || "",
        country: pickupAddress?.country || "",
        state: pickupAddress?.state || "",
        district: pickupAddress?.district || "",
        localAddress: pickupAddress?.local_address || "",
        landmark: pickupAddress?.landmark || "",
        pincode: pickupAddress?.pincode || "",
      };
      // return;
      const res = await axios.post(
        BASE_URL + "/api/exchange/add",
        exchangeReuqest
      );
      setResponseData(res.data);
      // setResponseData(resData);
      setIsSubmitted(true);
    }
  };

  const fetchSkusByColorAndProdId = async () => {
    try {
      const res = await axios.post<Product[]>(
        BASE_URL + "/api/products/findSkuByColor",
        {
          skus: selectedProducts.map((a) => ({
            productId: a.productId,
            color: a.color,
          })),
        }
      );
      setAvailableSkusByColor(res.data);
    } catch (error) {}
  };

  useEffect(() => {
    if (requestType == "exchange" && currentStep == 1) {
      fetchSkusByColorAndProdId();
    }
  }, [requestType, currentStep]);

  if (isSubmitted) {
    return (
      <div className="px-4 text-center">
        <div className="flex items-end justify-end">
          <X
            onClick={async () => {
              onComplete();
              await dispatch(fetchOrdersAsync(0)).unwrap();
            }}
          />
        </div>
        {responseData.map((data, index) => {
          responseData;
          return (
            <>
              <div key={index} className="space-y-6 py-2">
                <div className="flex flex-col text-2xl font-bold">
                  <h2>
                    Return id{" "}
                    {
                      <>
                        {requestType == "return" ? (
                          <>#{data.returnProductId}</>
                        ) : (
                          <>#{data.id}</>
                        )}{" "}
                      </>
                    }
                  </h2>
                </div>
                <div className="flex justify-center items-center space-x-4 ">
                  {steps.map((step, index) => (
                    <div
                      key={step.id}
                      onClick={() => handleStepClick(index)}
                      className="flex items-center"
                    >
                      <div
                        className={`rounded-full p-2 ${
                          index === steps.length - 1
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <step.icon className="h-5 w-5 cursor-pointer" />
                      </div>
                      {index < steps.length - 1 && (
                        <div className="w-12 h-px bg-border mx-1"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="max-w-md mx-auto text-left space-y-4">
                <h3 className="text-xl font-medium">
                  Your {requestType} request has been successfully received.
                </h3>
                <p className="text-muted-foreground">
                  We are currently reviewing your request to {requestType} your
                  items. You can track the progress for updates.
                </p>
              </div>
            </>
          );
        })}
        <Button
          onClick={async () => {
            onComplete();
            await dispatch(fetchOrdersAsync(0)).unwrap();
          }}
          className="mt-6"
        >
          Close
        </Button>
      </div>
    );
  }

  return (
    <div className="py-6 px-4">
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="flex flex-col text-2xl font-bold">
              <h2>
                <span className="capitalize">{requestType}</span> my order(s)
              </h2>
              <h2>for Order #{order.orderId}</h2>
            </div>
            <X onClick={onComplete} />
          </div>
          <div className="flex items-center space-x-4 hover:cursor-pointer">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`rounded-full p-2 ${
                    index === currentStep
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <step.icon className="h-5 w-5" />
                </div>
                {index < steps.length - 1 && (
                  <div className="w-12 h-px bg-border mx-1"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {currentStep === 0 && (
          <div className="space-y-4 my-4">
            <p className="text-sm text-muted-foreground">
              Select the items from that you want to {requestType}.
            </p>

            <div className="border rounded-md overflow-hidden">
              <div className="bg-muted px-4 py-2 grid grid-cols-12 text-sm font-medium">
                <div className="col-span-1"></div>
                <div className="col-span-7">Product</div>
                <div className="col-span-2">Price</div>
                <div className="col-span-2">Quantity</div>
              </div>

              {order.items.map((item) => (
                <div className="flex flex-col p-4 border-t ">
                  <div key={item.sku} className=" relative ">
                    <div
                      onClick={() => {
                        if (item.remainingQuantity > 0) {
                          handleItemToggle(item);
                        }
                      }}
                      className={`grid grid-cols-12 items-center ${
                        item.remainingQuantity <= 0
                          ? "opacity-35 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <div className="col-span-1">
                        {item.remainingQuantity > 0 && (
                          <Checkbox
                            disabled={item.remainingQuantity <= 0}
                            checked={selectedItems.includes(item.sku)}
                          />
                        )}
                      </div>

                      <div className="col-span-7 flex gap-3">
                        <div className="w-18 h-24 relative bg-muted rounded-md">
                          <img
                            src={`${item.images && item.images[0]}`}
                            alt={item.productName}
                            className="object-cover border rounded-lg w-full h-full flex-shrink-0"
                          />
                        </div>
                        <div className="flex items-start justify-center flex-col">
                          <div className="font-medium capitalize">
                            {item.productName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {item.color?.split("-")[0]} | SKU: {item.sku} |
                            Size: {item.size}
                          </div>
                        </div>
                      </div>
                      <div className="col-span-2">{item.price}</div>
                      <div className="col-span-2">{item.remainingQuantity}</div>
                    </div>
                  </div>
                  {item.remainingQuantity <= 0 ? (
                    <div className="italic text-green-600 font-medium">
                      Return Not Applicable anymore
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">
              Select the quantity you want to {requestType}
            </h3>
            <div className="border rounded-md overflow-hidden">
              <div className="grid grid-cols-12 gap-4 p-4 bg-muted text-sm font-medium">
                <div className="col-span-4">Product</div>
                <div className="col-span-2">Choose Quantity</div>
                <div className="col-span-3">Delivered On</div>
                <div className="col-span-3">
                  {requestType == "return" ? "Return" : "Exchange"} Validity
                </div>
              </div>
              {selectedProducts.map((product, index) => {
                return (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-4 p-4 border-t items-center"
                  >
                    <div className="col-span-4 flex gap-3">
                      <div className="w-18 h-24 relative bg-muted rounded-md">
                        <img
                          src={`${product.images && product.images[0]}`}
                          alt={product.productName}
                          className="object-cover border rounded-lg w-full h-full flex-shrink-0"
                        />
                      </div>
                      <div className="text-sm flex flex-col justify-center capitalize">
                        <span>{product.productName}</span>
                        <span>Size: {product.size}</span>
                      </div>
                    </div>
                    <div className="col-span-2 text-sm">
                      {product.remainingQuantity <= 1 ? (
                        product.remainingQuantity
                      ) : (
                        <Select
                          defaultValue="1"
                          onValueChange={(e) =>
                            updateProductData(product.sku, "quantities", e)
                          }
                        >
                          <SelectTrigger className="w-fit">
                            <SelectValue placeholder="Choose" />
                          </SelectTrigger>
                          <SelectContent className="min-w-0">
                            {Array.from({
                              length: product.remainingQuantity,
                            }).map((_, i) => {
                              return (
                                <SelectGroup>
                                  <SelectItem value={`${i + 1}`}>
                                    {i + 1}
                                  </SelectItem>
                                </SelectGroup>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                    <div className="col-span-3 text-sm">
                      {formatDate(order.deliveredOn)}
                    </div>
                    <div className="col-span-3 text-sm">
                      {dateAfter15days(order.deliveredOn)}
                    </div>
                    <div className="col-span-12 mt-4">
                      <h4 className="font-medium mb-2">
                        What is the primary reason for returning this product?
                      </h4>
                      <RadioGroup
                        value={formData.itemReasons[product.sku]}
                        onValueChange={(value) =>
                          updateProductData(product.sku, "itemReasons", value)
                        }
                        className="space-y-2"
                      >
                        {returnExchangeReasons
                          ?.filter(
                            (a) =>
                              a.reasonType?.toLowerCase() == formData?.choice ||
                              a.reasonType == "BOTH"
                          )
                          .map((d) => {
                            return (
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value={d.statusReason}
                                  id={`reason-${product.sku}-${d.statusReason}`}
                                />
                                <Label
                                  htmlFor={`reason-${product.sku}-${d.statusReason}`}
                                  className="capitalize"
                                >
                                  {d.statusReason}
                                </Label>
                              </div>
                            );
                          })}
                      </RadioGroup>
                      <div className="mt-4">
                        <Label
                          htmlFor={`remarks-${product.sku}`}
                          className="font-medium"
                        >
                          Remarks (Optional)
                        </Label>
                        <Textarea
                          id={`remarks-${product.sku}`}
                          placeholder="Please provide any additional details about your return..."
                          value={formData.itemRemarks[product.sku]}
                          onChange={(e) =>
                            updateProductData(
                              product.sku,
                              "itemRemarks",
                              e.target.value
                            )
                          }
                          className="mt-2"
                        />
                      </div>
                      {requestType === "exchange" && (
                        <div className="mt-4">
                          <h4 className="font-medium mb-2">
                            Available Alternatives
                          </h4>
                          <div className="border rounded-md p-4">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                              {availableSkusByColor
                                .filter(
                                  (a) => a.productId === product.productId
                                )
                                .flatMap((p) =>
                                  p.skus.filter(
                                    (sku) =>
                                      sku.sku !== product.sku &&
                                      sku.color === product.color
                                  )
                                )
                                .map((sku, skuIndex) => (
                                  <div
                                    key={skuIndex}
                                    // className={`flex flex-col items-center p-2 rounded-md cursor-pointer ${
                                    //   selectedAlternativeSkus[product.sku] ===
                                    //   sku.sku
                                    //     ? "border-2 border-blue-600 bg-blue-50"
                                    //     : "border border-gray-200 hover:border-blue-300"
                                    // }`}

                                    className={`relative flex flex-col items-center p-2 rounded-md cursor-pointer ${
                                      selectedAlternativeSkus[product.sku] ===
                                      sku.sku
                                        ? "border-2 border-blue-600 bg-blue-50"
                                        : +sku.quantity > 0
                                        ? "border border-gray-200 hover:border-blue-300"
                                        : "border-2 border-dashed border-gray-400 opacity-50 cursor-not-allowed"
                                    }`}
                                    onClick={() => {
                                      if (+sku.quantity > 0) {
                                        setSelectedAlternativeSkus((prev) => ({
                                          ...prev,
                                          [product.sku]: sku.sku,
                                        }));
                                      }
                                    }}
                                  >
                                    <div className="w-16 h-16 relative bg-gray-100 rounded-md overflow-hidden mb-2">
                                      {sku.imgs && sku.imgs.length > 0 ? (
                                        <img
                                          src={
                                            sku.imgs[0].img_url ||
                                            "/placeholder.svg" ||
                                            "/placeholder.svg"
                                          }
                                          alt={`${sku.color} ${sku.size}`}
                                          className="object-cover w-full h-full"
                                        />
                                      ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                                          No image
                                        </div>
                                      )}
                                    </div>
                                    <span className="text-xs font-medium text-center">
                                      Size: {sku.size}
                                    </span>
                                    <span className="text-xs font-medium text-center">
                                      Qty: {sku.quantity}
                                    </span>
                                    {+sku.quantity <= 0 && (
                                      <div
                                        className="absolute inset-0 flex items-center justify-center overflow-hidden"
                                        aria-hidden="true"
                                      >
                                        <div className="w-[200%] h-[1px] bg-gray-400 rotate-45 transform origin-center" />
                                      </div>
                                    )}
                                  </div>
                                ))}
                            </div>
                            {availableSkusByColor
                              .filter((a) => a.productId === product.productId)
                              .flatMap((p) =>
                                p.skus.filter((sku) => sku.sku !== product.sku)
                              ).length === 0 && (
                              <p className="text-sm text-gray-500 text-center py-4">
                                No alternative options available
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Choose the address</h3>

            {address ? (
              <RadioGroup
                value={`${formData.pickupAddress}`}
                onValueChange={(value) => {
                  updateFormData("pickupAddress", value);
                }}
                className="space-y-4"
              >
                {address?.map((add, index) => {
                  return (
                    <Label
                      htmlFor={`address-${index}`}
                      className={`flex items-start p-4 border rounded-lg ${
                        `${formData.pickupAddress}` == add.id
                          ? "border-primary"
                          : "border-border"
                      }`}
                    >
                      <RadioGroupItem
                        value={`${add.id}`}
                        id={`address-${index}`}
                        className="mt-1 mr-4"
                      />
                      <div>
                        <div className="font-medium">{add.addressName}</div>
                        <div className="text-sm text-muted-foreground capitalize">
                          {add.local_address}, {add.landmark}, {add.district},{" "}
                          {add.city}, {add.state}, {add.country} - {add.pincode}
                        </div>
                      </div>
                    </Label>
                  );
                })}
              </RadioGroup>
            ) : (
              <span className="space-y-4">No address found</span>
            )}
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">
              Review your {requestType} request
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium">Address for pickup:</span>
                {address
                  .filter((a) => a.id == formData.pickupAddress)
                  .map((a) => {
                    return (
                      <>
                        <span> {a.addressName}, </span>
                        <span>{a.local_address}, </span>
                        <span>
                          {a.city}, {a.district}, {a.state}, {a.country} -{" "}
                          {a.pincode}
                        </span>
                      </>
                    );
                  })}
              </div>

              <div className="border rounded-md overflow-hidden">
                <div className="grid grid-cols-12 gap-4 p-4 bg-muted text-sm font-medium">
                  <div className="col-span-4">Product</div>
                  <div className="col-span-2">Order Id</div>
                  <div className="col-span-2">
                    {requestType == "return" ? "Return " : "Exchange "}
                    Quantity
                  </div>
                  <div className="col-span-3">Delivered On</div>
                </div>

                {selectedProducts.map((product, index) => (
                  <div className="p-4 flex flex-col border-t gap-4">
                    <div key={index} className="grid grid-cols-12 items-center">
                      <div className="col-span-4 flex gap-3">
                        <div className="w-18 h-24 relative bg-muted rounded-md">
                          <img
                            src={`${product.images && product.images[0]}`}
                            alt={product.productName}
                            className="object-cover border rounded-lg w-full h-full flex-shrink-0"
                          />
                        </div>
                        <div className="text-sm flex items-center capitalize">
                          {product.productName} | Size: {product.size}
                        </div>
                      </div>
                      <div className="col-span-2 text-sm">{order.orderId}</div>
                      <div className="col-span-2 text-sm">
                        {formData.quantities[product.sku]}
                      </div>
                      <div className="col-span-3 text-sm">
                        {dateAfter15days(order.deliveredOn)}
                      </div>
                    </div>
                    {requestType === "exchange" && (
                      <div>
                        <span className="font-medium">Exchange size:</span>{" "}
                        {availableSkusByColor
                          .flatMap((p) =>
                            p.skus.filter(
                              (sku) =>
                                sku.sku === selectedAlternativeSkus[product.sku]
                            )
                          )
                          .map((sku) => sku.size)
                          .join(", ")}
                      </div>
                    )}
                    <div>
                      <span className="font-medium">
                        Reason for{" "}
                        <>
                          {requestType == "return" ? "returning" : "exchanging"}
                        </>{" "}
                        the product:
                      </span>{" "}
                      {formData.itemReasons[product.sku]}
                    </div>
                  </div>
                ))}
              </div>

              {formData.additionalInfo && (
                <div>
                  <span className="font-medium">Additional information:</span>{" "}
                  {formData.additionalInfo}
                </div>
              )}
            </div>
          </div>
        )}

        {currentStep < 4 && (
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            {currentStep == 3 ? (
              <div>
                <Button
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                  className="w-fit"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </div>
            ) : (
              <Button onClick={handleNext} disabled={!isStepValid()}>
                Next
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
