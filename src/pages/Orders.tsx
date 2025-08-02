import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { fetchOrdersAsync, selectOrdersLoading, selectOrdersProducts } from "../app/orders/ordersSlice"
import { useNavigate } from "react-router-dom"
import ReturnExchangeDialog from "@/app/return/ReturnExchangeDialog"
import ReturnExchangeDetail from "@/app/return/ReturnExchangeDetail"
import ReviewModalWithBlob from "@/components/ReviewModal"
import { Loader2, Star } from "lucide-react"
import { toast } from "sonner"
import axios from "axios"
import { BASE_URL } from "@/lib/constant"

type StatusType = "PENDING" | "PLACED" | "CONFIRMED" | "CANCELLED" | "DELIVERED" | "SHIPPED"

interface ReviewData {
  isReviewed: boolean
  rating?: number
  review?: string
}

export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function dateAfter15days(dateString: string) {
  const date = new Date(dateString)
  date.setDate(date.getDate() + 14)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
  }).format(price)
}

const statusColors: Record<StatusType, string> = {
  PENDING: "bg-red-100 text-red-800 border-red-400 shadow",
  PLACED: "bg-blue-100 text-blue-800 border-blue-400 shadow",
  CONFIRMED: "bg-green-100 text-green-800 border-green-400 shadow",
  CANCELLED: "bg-red-100 text-red-800 border-red-400 shadow",
  DELIVERED: "bg-purple-100 text-purple-800 border-purple-400 shadow",
  SHIPPED: "bg-indigo-100 text-indigo-800 border-indigo-400 shadow",
}

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const colorClass = statusColors[status as StatusType] || "bg-gray-100 text-gray-800 border-gray-400"

  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${colorClass}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

// Component to display star rating
const StarRating: React.FC<{ rating: number; size?: "sm" | "md" }> = ({ rating, size = "sm" }) => {
  const starSize = size === "sm" ? "w-4 h-4" : "w-5 h-5"

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${starSize} ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
        />
      ))}
    </div>
  )
}

// Component to display review details
const ReviewDisplay: React.FC<{ reviewData: ReviewData }> = ({ reviewData }) => {
  if (!reviewData.isReviewed || !reviewData.rating) return null

  return (
    <div>
      <span className="text-sm font-medium text-gray-700">Your review and rating:</span>
      <div className="border px-2 bg-gray-100 rounded-sm w-fit">
        {reviewData.review && <p className="text-sm text-gray-700 leading-relaxed">{reviewData.review}</p>}
        <div className="flex items-center gap-2">
          <StarRating rating={reviewData.rating} />
          <span className="text-sm text-gray-600">({reviewData.rating}/5)</span>
        </div>
      </div>
    </div>
  )
}

const Orders = () => {
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isFetchingMore, setIsFetchingMore] = useState(false)

  // State to track review data and loading states
  const [reviewData, setReviewData] = useState<Record<string, ReviewData>>({})
  const [reviewLoading, setReviewLoading] = useState<Record<string, boolean>>({})
  const [openAccordions, setOpenAccordions] = useState<Set<string>>(new Set())

  // State for review modal
  const [reviewModal, setReviewModal] = useState<{
    isOpen: boolean
    productName: string
    productId: number
    sku: string
    orderStatus: string
    orderId: number
  } | null>(null)

  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const ordersData = useAppSelector(selectOrdersProducts)
  const orders = ordersData?.content ?? []
  const orderLoading = useAppSelector(selectOrdersLoading)

  useEffect(() => {
    if (!orders || orders.length === 0) {
      dispatch(fetchOrdersAsync(0))
    }
  }, [dispatch])

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight
      const scrollTop = document.documentElement.scrollTop
      const clientHeight = window.innerHeight

      if (scrollTop + clientHeight >= scrollHeight - 300 && hasMore && !ordersData?.last && !isFetchingMore) {
        setIsFetchingMore(true)
        const nextPage = page + 1
        dispatch(fetchOrdersAsync(nextPage))
          .unwrap()
          .then((res) => {
            setPage(nextPage)
            if (!res.content || res.content.length === 0) {
              setHasMore(false)
            }
          })
          .finally(() => {
            setIsFetchingMore(false)
          })
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [dispatch, page, hasMore, isFetchingMore])

  // Function to check review status for all items in an order
  const checkReviewStatuses = async (order: any) => {
    const orderId = order.orderId.toString()

    if (openAccordions.has(orderId)) {
      return // Already checked
    }

    setOpenAccordions((prev) => new Set([...prev, orderId]))

    // Only check for delivered orders
    if (order.orderStatus !== "DELIVERED") {
      return
    }

    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Authentication required. Please login again.")
      return
    }

    // Check review status for each item
    const promises =
      order.items?.map(async (item: any) => {
        const key = `${order.orderId}-${item.sku}`

        setReviewLoading((prev) => ({ ...prev, [key]: true }))

        try {
          const payload = {
            productId: item.productId,
            sku: item.sku,
            orderId: order.orderId,
          }

          const response = await axios.post(`${BASE_URL}/api/reviews/isReviewed`, payload, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })

          console.log("Review status response:", response.data)

          // Extract all review data from response
          const { isReviewed, rating, review } = response.data

          setReviewData((prev) => ({
            ...prev,
            [key]: {
              isReviewed,
              rating: rating || undefined,
              review: review || undefined,
            },
          }))
        } catch (error: any) {
          console.error("Error checking review status:", error)

          if (error.response?.data?.error === "You have already reviewed this SKU.") {
            setReviewData((prev) => ({
              ...prev,
              [key]: { isReviewed: true },
            }))
          } else {
            setReviewData((prev) => ({
              ...prev,
              [key]: { isReviewed: false },
            }))
          }
        } finally {
          setReviewLoading((prev) => ({ ...prev, [key]: false }))
        }
      }) || []

    await Promise.all(promises)
  }

  // Handle accordion value change
  const handleAccordionChange = (value: string) => {
    if (value) {
      const order = orders.find((o) => o.orderId.toString() === value)
      if (order) {
        checkReviewStatuses(order)
      }
    }
  }

  // Handle review button click
  const handleReviewClick = (item: any, order: any) => {
    setReviewModal({
      isOpen: true,
      productName: item.productName,
      productId: item.productId,
      sku: item.sku,
      orderStatus: order.orderStatus,
      orderId: order.orderId,
    })
  }

  // Handle review submission success
  const handleReviewSubmitted = () => {
    if (reviewModal) {
      const key = `${reviewModal.orderId}-${reviewModal.sku}`
      setReviewData((prev) => ({
        ...prev,
        [key]: { isReviewed: true },
      }))
      setReviewModal(null)
    }
  }

  // Get review data for an item
  const getReviewData = (orderId: number, sku: string): ReviewData => {
    const key = `${orderId}-${sku}`
    return reviewData[key] || { isReviewed: false }
  }

  // Get loading status for an item
  const getLoadingStatus = (orderId: number, sku: string): boolean => {
    const key = `${orderId}-${sku}`
    return reviewLoading[key] || false
  }

  return (
    <div className="grid min-h-[50vh] bg-white mt-5 max-w-7xl container mx-auto">
      <main className="px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Order History</h1>
          <p className="text-sm text-muted-foreground">
            Check the status of recent orders, manage returns, and discover similar products
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4" onValueChange={handleAccordionChange}>
          {orderLoading && orders.length === 0 ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="border rounded-lg px-6 py-4">
                  <div className="flex gap-3 flex-col sm:flex-row items-start justify-between">
                    <div className="flex flex-col w-full md:flex-row md:items-center gap-4 md:gap-8 text-left">
                      <div className="w-24 h-6 bg-gray-200 rounded"></div>
                      <div className="w-24 h-6 bg-gray-200 rounded"></div>
                      <div className="w-24 h-6 bg-gray-200 rounded"></div>
                    </div>
                    <div className="w-24 h-6 bg-gray-200 rounded"></div>
                  </div>
                  <div className="space-y-4 mt-4">
                    <div className="grid gap-2 text-sm">
                      <div className="w-48 h-6 bg-gray-200 rounded"></div>
                      <div className="w-48 h-6 bg-gray-200 rounded"></div>
                      <div className="w-48 h-6 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : orders && orders.length > 0 ? (
            orders.map((order, index) => (
              <AccordionItem key={index} value={order.orderId?.toString()} className="border rounded-lg px-6">
                <AccordionTrigger className="hover:no-underline flex gap-3 flex-col sm:flex-row items-start justify-between">
                  <div className="grid grid-cols-2 md:flex w-full md:flex-row md:items-center gap-4 md:gap-8 text-left">
                    <div>
                      <div className="font-medium">{index + 1}. Order ID</div>
                      <div className="text-sm mt-2 text-muted-foreground">#{order.orderId}</div>
                    </div>

                    <div>
                      <div className="font-medium">Total Amount</div>
                      <div className="text-sm mt-2 text-muted-foreground">{formatPrice(order.orderAmount)}</div>
                    </div>
                    <div>
                      <div className="font-medium">Placed On</div>
                      <div className="text-sm mt-2 text-muted-foreground">{formatDate(order.orderDate)}</div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:items-center justify-center gap-1">
                    <StatusBadge status={order.orderStatus === "PACKED" ? "PLACED" : order.orderStatus} />
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <div className="grid gap-2 text-sm">
                    <div className="flex gap-2">
                      <span className="text-muted-foreground">Payment Method:</span>
                      <span className="font-medium capitalize">{order.paymentMethod}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-muted-foreground">Payment Status:</span>
                      <span className="font-medium capitalize">{order.paymentStatus}</span>
                    </div>
                    {order.deliveredOn && (
                      <>
                        <div className="flex gap-2">
                          <span className="text-muted-foreground">Delivered On:</span>
                          <span className="font-medium capitalize">{formatDate(order.deliveredOn)}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-muted-foreground">Return/Exchange is available till:</span>
                          <span className="font-medium capitalize">{dateAfter15days(order.deliveredOn)}</span>
                        </div>
                      </>
                    )}
                    {order.transactionId && (
                      <div className="flex gap-2">
                        <span className="text-muted-foreground">Transaction ID:</span>
                        <span className="font-medium">{order.transactionId}</span>
                      </div>
                    )}
                  </div>
                  {order.items?.map((item, itemIndex) => {
                    const itemReviewData = getReviewData(order.orderId, item.sku)
                    const isLoading = getLoadingStatus(order.orderId, item.sku)

                    return (
                      <div key={itemIndex}>
                        <Separator className="my-4" />
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="w-18 h-24 relative bg-muted rounded-md">
                            <img
                              src={`${item.images && item.images[0]}`}
                              alt={item.productName}
                              className="object-contain w-full h-full rounded-md"
                            />
                          </div>
                          <div className="flex-1 space-y-1">
                            <h3 className="font-semibold capitalize">{item.productName}</h3>
                            <p className="text-sm text-muted-foreground">{item.productSubheading}</p>
                            <div className="text-sm">
                              <span className="text-muted-foreground">Size: {item.size}</span>
                              <span className="ml-4 text-muted-foreground">Color: {item.color?.split("-")[0]}</span>
                            </div>
                            <div className="text-sm">
                              Qty: {item.quantity} x {formatPrice(item.price)}
                            </div>

                            {/* Display Review Data */}
                            <ReviewDisplay reviewData={itemReviewData} />
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <div className="font-semibold">{formatPrice(item.price * item.quantity)}</div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                navigate(`/category/products/${item.productId}/${item.sku}`)
                              }}
                            >
                              View Product
                            </Button>

                            {/* Review Button Logic */}
                            {order.orderStatus === "DELIVERED" && (
                              <>
                                {isLoading ? (
                                  <Button size="sm" variant="outline" disabled>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Loading...
                                  </Button>
                                ) : itemReviewData.isReviewed ? (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    disabled
                                    className="bg-gray-200 text-gray-600 cursor-not-allowed"
                                  >
                                    Reviewed
                                  </Button>
                                ) : (
                                  <Button size="sm" variant="outline" onClick={() => handleReviewClick(item, order)}>
                                    Review product
                                  </Button>
                                )}
                              </>
                            )}

                            {order.orderStatus === "DELIVERED" && item.remainingQuantity < item.quantity && (
                              <ReturnExchangeDetail orderId={order.orderId} sku={item.sku} />
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  <div className="mt-4 flex flex-col justify-end items-end">
                    <div className="max-w-xs space-y-2">
                      <div className="flex text-lg gap-2 font-medium">
                        <span>Total</span>
                        <span>{formatPrice(order.orderAmount)}</span>
                      </div>
                      {order.deliveredOn &&
                        (() => {
                          const deliveredDate = new Date(order.deliveredOn)
                          const returnDeadline = new Date(deliveredDate)
                          returnDeadline.setDate(deliveredDate.getDate() + 14)

                          const today = new Date()
                          const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate())
                          const returnDeadlineDateOnly = new Date(
                            returnDeadline.getFullYear(),
                            returnDeadline.getMonth(),
                            returnDeadline.getDate(),
                          )

                          return todayDateOnly <= returnDeadlineDateOnly
                        })() && (
                          <Button
                            variant="default"
                            size="sm"
                            className="bg-amber-800 hover:bg-amber-700 text-white"
                            onClick={() => setIsReturnDialogOpen(true)}
                          >
                            Return / Exchange
                          </Button>
                        )}
                    </div>
                  </div>
                  <ReturnExchangeDialog open={isReturnDialogOpen} onOpenChange={setIsReturnDialogOpen} order={order} />
                </AccordionContent>
              </AccordionItem>
            ))
          ) : (
            <p>No order placed yet!</p>
          )}
        </Accordion>
        {isFetchingMore && <div className="text-center py-4 text-muted-foreground">Loading...</div>}
      </main>

      {/* Review Modal */}
      {reviewModal && (
        <ReviewModalWithBlob
          productName={reviewModal.productName}
          productId={reviewModal.productId}
          sku={reviewModal.sku}
          orderStatus={reviewModal.orderStatus}
          orderId={reviewModal.orderId}
          isOpen={reviewModal.isOpen}
          onClose={() => setReviewModal(null)}
          onReviewSubmitted={handleReviewSubmitted}
        />
      )}
    </div>
  )
}

export default Orders