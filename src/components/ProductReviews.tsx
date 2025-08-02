"use client"
import { useState, useEffect } from "react"
import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import axios from "axios"
import { FiImage } from "react-icons/fi";
import { BASE_URL } from "@/lib/constant"

interface ReviewImage {
    img_Id: number
    img_url: string
    img_name: string
}

interface Review {
    sku: string
    rating: number
    review: string
    reviewDate: string
    reviewerName: string
    productTitle: string
    isVerifiedPurchase: boolean
    imgs: ReviewImage[]
}

interface ReviewsData {
    productId: number
    overallRating: number
    totalReviews: number
    reviews: Review[]
}

interface ProductReviewsProps {
    productId: string
}

function ReviewImageBox({ img, alt }: { img: ReviewImage; alt: string }) {
    const [imgError, setImgError] = useState(false);

    return (
        <div className="w-20 h-20 rounded-lg overflow-hidden border hover:shadow-md transition-shadow cursor-pointer flex items-center justify-center bg-gray-100">
            {!imgError ? (
                <img
                    src={img.img_url || "/placeholder.svg"}
                    alt={alt}
                    className="w-full h-full object-cover hover:scale-110 transition-transform"
                    onError={() => setImgError(true)}
                />
            ) : (
                <FiImage className="w-8 h-8 text-gray-400" />
            )}
        </div>
    );
}

const StarRating = ({ rating, size = "w-4 h-4" }: { rating: number; size?: string }) => {
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`${size} ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                />
            ))}
        </div>
    )
}

const getInitials = (name: string) => {
    return name
        .split(" ")
        .map((word) => word.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2)
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    })
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
    const [reviewsData, setReviewsData] = useState<ReviewsData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [expandedReviews, setExpandedReviews] = useState<Set<number>>(new Set())

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true)
                setError(null)

                const response = await axios.get(`${BASE_URL}/api/reviews/product/${productId}?groupCompanyId=1`)

                setReviewsData(response.data)
                console.log("Reviews data:", response.data)
            } catch (error: unknown) {
                console.error("Error fetching reviews:", error)
                setError("Failed to load reviews")
            } finally {
                setLoading(false)
            }
        }

        if (productId) {
            fetchReviews()
        }
    }, [productId])

    const toggleReviewExpansion = (index: number) => {
        const newExpanded = new Set(expandedReviews)
        if (newExpanded.has(index)) {
            newExpanded.delete(index)
        } else {
            newExpanded.add(index)
        }
        setExpandedReviews(newExpanded)
    }

    if (loading) {
        return (
            <div className="container mx-auto mb-8 px-4">
                <div className="space-y-4">
                    <div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <Card key={i} className="animate-pulse">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 bg-gray-200 rounded w-32"></div>
                                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                                            <div className="h-16 bg-gray-200 rounded"></div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container mx-auto mb-8 px-4">
                <div className="text-center py-8">
                    <p className="text-gray-500">{error}</p>
                </div>
            </div>
        )
    }

    if (!reviewsData || reviewsData.reviews.length === 0) {
        return null
    }

    return (
        <div className="container mx-auto mb-8 px-4">
            <div className="space-y-6">
                {/* Reviews Header */}
                <h2 className="font-semibold font-opensans text-xl">Customer Reviews</h2>

                {/* Main Layout: 30% Summary + 70% Reviews */}
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left Sidebar - Reviews Summary (30%) */}
                    <div className="lg:w-[30%] space-y-4">
                        <Card className="p-6">
                            <div className="space-y-4">
                                {/* Overall Rating */}
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-lg">Customer reviews</h3>
                                    <div className="flex items-center gap-2">
                                        <StarRating rating={Math.round(reviewsData.overallRating)} size="w-5 h-5" />
                                        <span className="font-medium text-lg">{reviewsData.overallRating.toFixed(1)} out of 5</span>
                                    </div>
                                    <p className="text-sm text-gray-600">{reviewsData.totalReviews.toLocaleString()} global ratings</p>
                                </div>

                                {/* Rating Distribution */}
                                <div className="space-y-2">
                                    {[5, 4, 3, 2, 1].map((starLevel) => {
                                        const count = reviewsData.reviews.filter((review) => review.rating === starLevel).length
                                        const percentage =
                                            reviewsData.totalReviews > 0 ? Math.round((count / reviewsData.totalReviews) * 100) : 0

                                        return (
                                            <div key={starLevel} className="flex items-center gap-2 text-sm">
                                                <span className="w-12 text-right">{starLevel} star</span>
                                                <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-orange-400 transition-all duration-300"
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                                <span className="w-8 text-blue-600 font-medium">{percentage}%</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Right Section - Detailed Reviews (70%) */}
                    <div className="lg:w-[70%] space-y-4">
                        {reviewsData.reviews.map((review, index) => {
                            const isExpanded = expandedReviews.has(index)
                            const shouldShowReadMore = review.review.length > 200

                            return (
                                <Card key={index} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-4">
                                            {/* Avatar */}
                                            <Avatar className="w-12 h-12">
                                                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                                    {getInitials(review.reviewerName)}
                                                </AvatarFallback>
                                            </Avatar>

                                            <div className="flex-1 space-y-3">
                                                {/* Reviewer Info */}
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="font-medium">{review.reviewerName}</span>
                                                    {review.isVerifiedPurchase && (
                                                        <Badge variant="secondary" className="text-xs text-orange-500">
                                                            Verified Purchase
                                                        </Badge>
                                                    )}
                                                    <span className="text-sm text-gray-500">{formatDate(review.reviewDate)}</span>
                                                </div>

                                                {/* Rating */}
                                                <div className="flex items-center gap-2">
                                                    <StarRating rating={review.rating} />
                                                    <span className="text-sm text-gray-600">({review.rating}/5)</span>
                                                </div>

                                                {/* Product Title */}
                                                <p className="text-sm text-gray-600 font-medium">{review.productTitle}</p>

                                                {/* Review Text */}
                                                <div className="space-y-2">
                                                    <p className="text-gray-700 leading-relaxed">
                                                        {shouldShowReadMore && !isExpanded
                                                            ? `${review.review.substring(0, 200)}...`
                                                            : review.review}
                                                    </p>
                                                    {shouldShowReadMore && (
                                                        <button
                                                            onClick={() => toggleReviewExpansion(index)}
                                                            className="text-primary hover:underline text-sm font-medium"
                                                        >
                                                            {isExpanded ? "Read Less" : "Read More"}
                                                        </button>
                                                    )}
                                                </div>

                                                {/* Review Images */}
                                                {review.imgs && review.imgs.length > 0 && (
                                                    <div className="flex gap-2 flex-wrap">
                                                        {review.imgs.map((img, imgIndex) => (
                                                            <ReviewImageBox
                                                                key={imgIndex}
                                                                img={img}
                                                                alt={img.img_name || `Review image ${imgIndex + 1}`}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}

                        {/* Load More Button (if needed) */}
                        {reviewsData.reviews.length < reviewsData.totalReviews && (
                            <div className="text-center">
                                <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                    Load More Reviews
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}