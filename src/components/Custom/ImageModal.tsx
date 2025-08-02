import type React from "react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XIcon, ChevronLeft, ChevronRight } from "lucide-react";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: {
    img_Id: string;
    img_url: string;
    img_name: string;
    img_type: string;
  }[];
  initialIndex: number;
}

export const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  images,
  initialIndex,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [translateY, setTranslateY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const touchStartY = useRef<number | null>(null);
  const mouseStartY = useRef<number | null>(null);
  const pinchStartDist = useRef<number | null>(null);
  const pinchStartScale = useRef<number>(1);
  const lastTouchY = useRef<number>(0);
  const lastMouseY = useRef<number>(0);
  const transformOriginY = useRef<number>(0.5); // Default to center

  // Calculate distance between two touch points for pinch gesture
  const getPinchDistance = (e: TouchEvent) => {
    if (e.touches.length < 2) return null;
    const touch1 = e.touches[0];
    const touch2 = e.touches[1];
    return Math.hypot(
      touch1.clientX - touch2.clientX,
      touch1.clientY - touch2.clientY
    );
  };

  // Calculate boundaries for panning
  const calculateBoundaries = () => {
    const container = containerRef.current;
    const image = imageRef.current;
    if (container && image) {
      const containerHeight = container.clientHeight;
      const scaledHeight = image.clientHeight * scale;
      const maxTranslateY = Math.max(
        0,
        (scaledHeight - containerHeight) / 2 / scale
      );
      return { minTranslateY: -maxTranslateY, maxTranslateY };
    }
    return { minTranslateY: 0, maxTranslateY: 0 };
  };

  // Update transform origin based on current viewport
  const updateTransformOrigin = (clientY: number) => {
    const container = containerRef.current;
    if (container && imageRef.current) {
      const rect = container.getBoundingClientRect();
      const relativeY = (clientY - rect.top) / rect.height;
      transformOriginY.current = Math.max(0, Math.min(1, relativeY));
    }
  };

  // Handle touch events (pinch-to-zoom and swipe up/down)
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1 && scale > 1) {
        touchStartY.current = e.touches[0].clientY;
        lastTouchY.current = e.touches[0].clientY;
        updateTransformOrigin(e.touches[0].clientY);
      } else if (e.touches.length === 2) {
        pinchStartDist.current = getPinchDistance(e);
        pinchStartScale.current = scale;
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const midY = (touch1.clientY + touch2.clientY) / 2;
        updateTransformOrigin(midY);
        e.preventDefault();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && pinchStartDist.current !== null) {
        const currentDist = getPinchDistance(e);
        if (currentDist !== null) {
          const pinchScale =
            (currentDist / pinchStartDist.current) * pinchStartScale.current;
          const newScale = Math.min(Math.max(pinchScale, 1), 3);
          setScale(newScale);
          // Adjust translateY to keep the same area in view
          const { minTranslateY, maxTranslateY } = calculateBoundaries();
          setTranslateY((prev) =>
            Math.min(Math.max(prev, minTranslateY), maxTranslateY)
          );
          e.preventDefault();
        }
      } else if (
        e.touches.length === 1 &&
        touchStartY.current !== null &&
        scale > 1
      ) {
        const currentY = e.touches[0].clientY;
        const deltaY = currentY - lastTouchY.current;
        lastTouchY.current = currentY;

        const { minTranslateY, maxTranslateY } = calculateBoundaries();
        setTranslateY((prev) => {
          const newTranslateY = prev + deltaY / scale;
          return Math.min(
            Math.max(newTranslateY, minTranslateY),
            maxTranslateY
          );
        });
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) {
        pinchStartDist.current = null;
      }
      if (e.touches.length === 0) {
        touchStartY.current = null;
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("touchstart", handleTouchStart, {
        passive: false,
      });
      container.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      container.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      if (container) {
        container.removeEventListener("touchstart", handleTouchStart);
        container.removeEventListener("touchmove", handleTouchMove);
        container.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, [isOpen, scale, translateY]);

  // Handle mouse events (wheel zoom and drag panning)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isOpen) {
        e.preventDefault();
        updateTransformOrigin(e.clientY);
        setScale((prev) => {
          const next = e.deltaY < 0 ? prev + 0.1 : prev - 0.1;
          const newScale = Math.min(Math.max(next, 1), 3);
          // Adjust translateY to keep the same area in view
          const { minTranslateY, maxTranslateY } = calculateBoundaries();
          setTranslateY((prevTranslate) =>
            Math.min(Math.max(prevTranslate, minTranslateY), maxTranslateY)
          );
          return newScale;
        });
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (scale > 1) {
        mouseStartY.current = e.clientY;
        lastMouseY.current = e.clientY;
        setIsDragging(true);
        updateTransformOrigin(e.clientY);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && mouseStartY.current !== null && scale > 1) {
        const currentY = e.clientY;
        const deltaY = currentY - lastMouseY.current;
        lastMouseY.current = currentY;

        const { minTranslateY, maxTranslateY } = calculateBoundaries();
        setTranslateY((prev) => {
          const newTranslateY = prev + deltaY / scale;
          return Math.min(
            Math.max(newTranslateY, minTranslateY),
            maxTranslateY
          );
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      mouseStartY.current = null;
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
      container.addEventListener("mousedown", handleMouseDown);
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseup", handleMouseUp);
      container.addEventListener("mouseleave", handleMouseUp);
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
        container.removeEventListener("mousedown", handleMouseDown);
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseup", handleMouseUp);
        container.removeEventListener("mouseleave", handleMouseUp);
      }
    };
  }, [isOpen, scale, translateY, isDragging]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") previousImage();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Reset translateY and transformOrigin when image changes
  useEffect(() => {
    setTranslateY(0);
    transformOriginY.current = 0.5;
  }, [currentIndex]);

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const previousImage = () =>
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#ede2ce] bg-opacity-60 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full h-[95vh] bg-white rounded-lg overflow-hidden"
            ref={containerRef}
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-2 z-10 text-white bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-75"
            >
              <XIcon size={24} />
            </button>

            {images.length > 1 && (
              <>
                <button
                  onClick={previousImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1 z-10">
              {images.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i === currentIndex ? "bg-black" : "bg-gray-400"
                  }`}
                />
              ))}
            </div>

            <div className="w-full h-full overflow-hidden flex items-center justify-center">
              <div
                className="min-w-fit"
                style={{
                  transform: `scale(${scale}) translateY(${translateY}px)`,
                  transformOrigin: `center ${transformOriginY.current * 100}%`,
                  touchAction: scale > 1 ? "pan-y pinch-zoom" : "pinch-zoom",
                  cursor:
                    scale > 1 ? (isDragging ? "grabbing" : "grab") : "default",
                }}
              >
                <img
                  ref={imageRef}
                  src={images[currentIndex]?.img_url || "/placeholder.svg"}
                  alt={`Image ${currentIndex + 1}`}
                  className="object-contain max-w-full max-h-[80vh]"
                  style={{
                    display: "block",
                    width: "100%",
                    height: "auto",
                    touchAction: "none",
                    userSelect: "none",
                  }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
