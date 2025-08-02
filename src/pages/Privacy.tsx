import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLocation } from "react-router-dom";

const privacyItems = [
  {
    title: "Returns & Exchange Policy",
    content: `
      Risk free Shopping - You can RETURN or EXCHANGE any product if you are not satisfied with the fit or size, within 15 days from the date of delivery. 

      Eligibility - Product must be unused, unwashed, undamaged and should have all the original tags and packaging. Once the return is processed, the full product price, including taxes, will be returned to you. Any additional shipping charges, if paid, are not returned.

      Process - To initiate Return/Exchange, create a request here, you can also contact us with your order details. Our warehouse team takes around 48-72 hours to inspect all items due for returns or exchanges. Once approved, it will take upto 7 business days for the amount to reflect in your bank account in case of a refund. For an exchange, we'll ship out your new size/product once the pickup is completed.

      Note - Please share the package unboxing video for wrong/damaged product received on ( mail id ) within 24 hours of delivery.
    `,
  },
  {
    title: "Privacy Guarantee",
    content:
      "We take your privacy seriously and are committed to protecting your personal information. Our privacy guarantee ensures that your data is handled securely and responsibly.",
  },
  {
    title: "Collection of Information",
    content:
      "We collect information that you provide directly to us, including but not limited to your name, email address, and shipping information when you make a purchase.",
  },
  {
    title: "Use of Your Information",
    content:
      "Your information is used to process your orders, communicate with you about our products and services, and improve your shopping experience.",
  },
  {
    title: "Disclosure of Your Information",
    content:
      "We do not sell or rent your personal information to third parties. We may share your information with service providers who assist us in operating our website and conducting our business.",
  },
  {
    title: "Security",
    content:
      "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.",
  },
  {
    title: "Changes in policy",
    content:
      "We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.",
  },
  {
    title: "Shipping Policy",
    content:
      "Orders are shipped within 7-10 working days. Returns or exchanges can be made within 15 days of delivery.",
  },
];

export default function Privacy() {
  const location = useLocation();

  const openIndex = Number(location.state?.openAccordion);

  const defaultValue =
    !isNaN(openIndex) && openIndex >= 0 && openIndex < privacyItems.length
      ? `item-${openIndex}`
      : "item-0"; // Third item by default (0-based index: 2)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:py-12 text-[#6d6d6d] font-custom font-extralight">
      <div className="text-left space-y-10">
        <Accordion
          type="single"
          collapsible
          defaultValue={defaultValue}
          className="w-full space-y-4"
        >
          {privacyItems.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="last:border-none py-3"
            >
              <AccordionTrigger className="text-sm text-logoGreen hover:no-underline">
                {item.title}
              </AccordionTrigger>
              <AccordionContent className="text-sm font-opensans text-black text-muted-foreground">
                {item.content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
