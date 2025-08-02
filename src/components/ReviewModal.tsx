import { useState, useCallback, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useDropzone } from "react-dropzone"
import { BlobServiceClient } from "@azure/storage-blob"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Star, X, Loader2, ImageIcon } from "lucide-react"
import { toast } from "sonner"
import { BASE_URL, CONTAINER_NAME, FOLDER_NAME, STORAGE_ACCOUNT_SAS } from "@/lib/constant"
import axios from "axios"

const reviewSchema = z.object({
    review: z.string().min(1, "Review is required").max(500, "Review must be 500 characters or less"),
    rating: z.number().min(1, "Please select a rating").max(5, "Rating cannot exceed 5 stars"),
    imageUrls: z.array(z.string()).max(3, "Maximum 3 images allowed").optional(),
})

type ReviewFormData = z.infer<typeof reviewSchema>

interface ImageFile extends File {
    preview?: string
    id: string
}

interface ProcessedImage {
    img_Id: number
    img_name: string
    img_type: string
    img_url: string
    img_status: boolean
}

interface ReviewModalProps {
    productName: string
    productId: number
    sku: string
    orderStatus: string
    orderId: number
    isOpen: boolean
    onClose: () => void
    onReviewSubmitted: () => void
}

const getBlobServiceClient = () => {
    try {
        return new BlobServiceClient(STORAGE_ACCOUNT_SAS)
    } catch (error) {
        console.error("Error creating blob service client:", error)
        throw new Error("Failed to initialize storage client")
    }
}

export default function ReviewModalWithBlob({
    productName,
    productId,
    sku,
    orderId,
    isOpen,
    onClose,
    onReviewSubmitted,
}: ReviewModalProps) {
    const [selectedImages, setSelectedImages] = useState<ImageFile[]>([])
    const [uploadedImages, setUploadedImages] = useState<ProcessedImage[]>([])
    const [isUploading, setIsUploading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<ReviewFormData>({
        resolver: zodResolver(reviewSchema),
        defaultValues: {
            review: "",
            rating: 0,
            imageUrls: [],
        },
    })

    // Cleanup object URLs when component unmounts
    useEffect(() => {
        return () => {
            selectedImages.forEach((file) => {
                if (file.preview) URL.revokeObjectURL(file.preview)
            })
        }
    }, [selectedImages])

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            form.reset()
            setSelectedImages([])
            setUploadedImages([])
        }
    }, [isOpen, form])

    const uploadToBlob = async (file: File, index: number): Promise<ProcessedImage> => {
        const blobServiceClient = getBlobServiceClient()
        const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME)
        const timestamp = Date.now()
        const blobName = `${FOLDER_NAME}/${timestamp}-${index}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`
        const blockBlobClient = containerClient.getBlockBlobClient(blobName)

        const uploadResponse = await blockBlobClient.uploadBrowserData(file, {
            blobHTTPHeaders: { blobContentType: file.type },
        })

        if (uploadResponse.errorCode) {
            throw new Error(`Upload failed: ${uploadResponse.errorCode}`)
        }

        return {
            img_Id: timestamp + index,
            img_name: file.name,
            img_type: file.type.split("/")[1],
            img_url: blockBlobClient.url,
            img_status: true,
        }
    }

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            const remainingSlots = 3 - uploadedImages.length
            const filesToProcess = acceptedFiles.slice(0, remainingSlots)

            if (filesToProcess.length === 0) {
                toast.error("Maximum 3 images allowed")
                return
            }

            const timestamp = Date.now()
            const filesWithPreview = filesToProcess.map((file, idx) => {
                return Object.assign(file, {
                    preview: URL.createObjectURL(file),
                    id: `${timestamp}-${idx}-${file.name}`,
                })
            })

            setSelectedImages((prev) => [...prev, ...filesWithPreview])
            setIsUploading(true)

            try {
                const uploadPromises = filesToProcess.map((file, index) => uploadToBlob(file, index))
                const uploadResults = await Promise.all(uploadPromises)

                setUploadedImages((prev) => [...prev, ...uploadResults])
                form.setValue("imageUrls", [...(form.getValues("imageUrls") || []), ...uploadResults.map((img) => img.img_url)])

                toast.success(`${uploadResults.length} image(s) uploaded successfully!`)
            } catch (error) {
                console.error("Upload error:", error)
                toast.error("Failed to upload images. Please try again.")
                setSelectedImages((prev) => prev.filter((img) => !filesWithPreview.some((f) => f.id === img.id)))
            } finally {
                setIsUploading(false)
            }
        },
        [uploadedImages.length, form],
    )

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/jpeg": [".jpg", ".jpeg"],
            "image/png": [".png"],
            "image/webp": [".webp"],
        },
        disabled: isUploading || uploadedImages.length >= 3,
    })

    const removeImage = (index: number) => {
        const imageToRemove = selectedImages[index]

        if (imageToRemove?.preview) {
            URL.revokeObjectURL(imageToRemove.preview)
        }

        setSelectedImages((prev) => prev.filter((_, i) => i !== index))
        setUploadedImages((prev) => prev.filter((_, i) => i !== index))

        const currentUrls = form.getValues("imageUrls") || []
        const newUrls = currentUrls.filter((_, i) => i !== index)
        form.setValue("imageUrls", newUrls)
    }

    const onSubmit = async (data: ReviewFormData) => {
        setIsSubmitting(true)

        try {
            const token = localStorage.getItem("token")

            if (!token) {
                toast.error("Authentication required. Please login again.")
                setIsSubmitting(false)
                return
            }

            const reviewPayload = {
                productId,
                sku,
                orderId,
                rating: data.rating,
                review: data.review,
                imgs: uploadedImages.map((img) => ({
                    img_Id: img.img_Id,
                    img_url: img.img_url,
                    img_name: img.img_name,
                })),
            }

            console.log("Submitting review:", reviewPayload)

            // Use a different endpoint for actual review submission
            const response = await axios.post(`${BASE_URL}/api/reviews`, reviewPayload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            })

            console.log("Review submitted successfully:", response.data)
            toast.success("Review submitted successfully!")

            // Call the callback to update parent component
            onReviewSubmitted()
        } catch (error: any) {
            console.error("Review submission error:", error)

            if (error.response?.status === 401) {
                toast.error("Authentication failed. Please login again.")
            } else {
                toast.error("Failed to submit review. Please try again.")
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    const StarRating = ({ value, onChange }: { value: number; onChange: (rating: number) => void }) => {
        const [hoverRating, setHoverRating] = useState(0)

        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        className="p-1 transition-colors"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => onChange(star)}
                    >
                        <Star
                            className={`w-6 h-6 ${star <= (hoverRating || value) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                }`}
                        />
                    </button>
                ))}
            </div>
        )
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Review Product</DialogTitle>
                    <p className="text-sm text-muted-foreground">{productName}</p>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Rating Field */}
                        <FormField
                            control={form.control}
                            name="rating"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Rating <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <StarRating value={field.value} onChange={field.onChange} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Review Text Field */}
                        <FormField
                            control={form.control}
                            name="review"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Review <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Share your experience with this product..."
                                            className="min-h-[100px] resize-none"
                                            maxLength={500}
                                            {...field}
                                        />
                                    </FormControl>
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <FormMessage />
                                        <span>{field.value?.length || 0}/500</span>
                                    </div>
                                </FormItem>
                            )}
                        />

                        {/* Image Upload Field */}
                        <FormField
                            control={form.control}
                            name="imageUrls"
                            render={() => (
                                <FormItem>
                                    <FormLabel>Images (Optional)</FormLabel>
                                    <FormControl>
                                        <div className="space-y-4">
                                            {uploadedImages.length < 3 && (
                                                <div
                                                    {...getRootProps()}
                                                    className={`
                          border-2 border-dashed rounded-lg p-4 transition-colors cursor-pointer
                          ${isDragActive
                                                            ? "border-primary bg-primary/5"
                                                            : "border-gray-300 hover:border-primary/50 hover:bg-gray-50"
                                                        }
                          ${isUploading ? "opacity-50 cursor-not-allowed" : ""}
                        `}
                                                >
                                                    <input {...getInputProps()} />
                                                    <div className="flex flex-col items-center justify-center py-4">
                                                        {isUploading ? (
                                                            <Loader2 className="w-8 h-8 text-gray-400 mb-2 animate-spin" />
                                                        ) : (
                                                            <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                                                        )}
                                                        <span className="text-sm text-gray-600">
                                                            {isUploading ? "Uploading..." : "Click to upload or drag & drop"}
                                                        </span>
                                                        <span className="text-xs text-gray-400">
                                                            {3 - uploadedImages.length} remaining • JPEG, PNG, WEBP
                                                        </span>
                                                    </div>
                                                </div>
                                            )}

                                            {selectedImages.length > 0 && (
                                                <div className="grid grid-cols-3 gap-2">
                                                    {selectedImages.map((file, index) => (
                                                        <div key={file.id} className="relative">
                                                            <img
                                                                src={file.preview || "/placeholder.svg"}
                                                                alt={`Preview ${index + 1}`}
                                                                className="w-full h-20 object-cover rounded-md"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeImage(index)}
                                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                                disabled={isUploading}
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                            {uploadedImages[index] && (
                                                                <div className="absolute bottom-1 left-1 bg-green-500 text-white rounded-full p-1">
                                                                    <div className="w-2 h-2 bg-white rounded-full" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className="flex-1"
                                disabled={isUploading || isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" className="flex-1" disabled={isUploading || isSubmitting}>
                                {isUploading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Uploading...
                                    </>
                                ) : isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    "Submit Review"
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}