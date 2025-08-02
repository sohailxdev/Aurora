import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeftRight, Truck } from "lucide-react";

export default function ProductSpecifications() {
  const specs = [
    {
      icon: Truck,
      label: "DELIVERY",
      value: "Delivery within 7-10 working days",
    },
    {
      icon: ArrowLeftRight,
      label: "EXCHANGE",
      value: "Hassle free 15 days Return & Exchange",
    },
   
  ];

  return (
    <div className="grid font-opensans grid-cols-2 gap-4 p-4">
      {specs.map((spec, index) => (
        <Card key={index} className="border-none shadow-none">
          <CardContent className="flex flex-col items-center text-center p-4">
            <spec.icon className="w-8 h-8 mb-2 text-gray-600" />
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              {spec.label}
            </h3>
            <p className="text-sm text-gray-900">{spec.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
