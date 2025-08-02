import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown } from "lucide-react";

const cmData = {
  slim: [
    { size: "S", collar: 39, shoulder: 43.5, chest: 95, waist: 85, length: 73 },
    { size: "M", collar: 40, shoulder: 45.5, chest: 99, waist: 89, length: 76 },
    {
      size: "L",
      collar: 42,
      shoulder: 47.5,
      chest: 105,
      waist: 95,
      length: 78,
    },
    {
      size: "XL",
      collar: 44,
      shoulder: 49.5,
      chest: 111,
      waist: 101,
      length: 80,
    },
    {
      size: "XXL",
      collar: 45,
      shoulder: 51.5,
      chest: 117,
      waist: 107,
      length: 82,
    },
  ],
  regular: [
    { size: "S", collar: 39, shoulder: 44, chest: 96, waist: 97, length: 73 },
    { size: "M", collar: 40, shoulder: 46, chest: 100, waist: 101, length: 76 },
    { size: "L", collar: 42, shoulder: 48, chest: 106, waist: 107, length: 78 },
    {
      size: "XL",
      collar: 44,
      shoulder: 50,
      chest: 112,
      waist: 113,
      length: 80,
    },
    {
      size: "XXL",
      collar: 45,
      shoulder: 52,
      chest: 118,
      waist: 119,
      length: 82,
    },
  ],
};
const inchData = {
  slim: [
    {
      size: "S",
      sizeNumber: 38,
      chest: 42,
      waist: 40,
      length: 28.5,
      shoulder: 18,
    },
    {
      size: "M",
      sizeNumber: 40,
      chest: 44,
      waist: 42,
      length: 29,
      shoulder: 18.5,
    },
    {
      size: "L",
      sizeNumber: 42,
      chest: 46,
      waist: 44,
      length: 29.5,
      shoulder: 19,
    },
    {
      size: "XL",
      sizeNumber: 44,
      chest: 49,
      waist: 47,
      length: 30,
      shoulder: 19.5,
    },
    {
      size: "XXL",
      sizeNumber: 46,
      chest: 52,
      waist: 49,
      length: 30.5,
      shoulder: 20,
    },
  ],
  regular: [
    {
      size: "S",
      sizeNumber: 38,
      chest: 44,
      waist: 43,
      length: 28.5,
      shoulder: 17.75,
    },
    {
      size: "M",
      sizeNumber: 40,
      chest: 47,
      waist: 46,
      length: 29,
      shoulder: 18.5,
    },
    {
      size: "L",
      sizeNumber: 42,
      chest: 52,
      waist: 51,
      length: 29.5,
      shoulder: 19.5,
    },
    {
      size: "XL",
      sizeNumber: 44,
      chest: 53,
      waist: 52,
      length: 30,
      shoulder: 19.75,
    },
    {
      size: "XXL",
      sizeNumber: 46,
      chest: 56,
      waist: 55,
      length: 30.5,
      shoulder: 20.5,
    },
  ],
};

export function SizeChartDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-1/2">
          View Size Chart <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg flex flex-col overflow-auto min-h-[80dvh] h-fit">
        <DialogHeader>
          <DialogTitle className="text-2xl">Size Guide</DialogTitle>
          <DialogDescription className="text-xs">
            Our sizes are engineered for Indian men. Every fit has been iterated
            & perfected over years of testing, resulting in two base fits: Slim
            and Regular.
          </DialogDescription>
        </DialogHeader>
        <Tabs
          defaultValue="inches"
          className="w-full flex flex-col items-center justify-center"
        >
          <TabsList className="w-fit">
            <TabsTrigger value="inches">Inches</TabsTrigger>
          </TabsList>
          <TabsContent value="inches" className="bg-white w-full space-y-3">
            <div>
              <h3 className="mb-1 text-md font-semibold">Regular Fit</h3>
              <div className="rounded-lg border">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr className="border-b">
                      <th className="p-[5px] text-xs text-center font-medium">
                        Size
                      </th>
                      <th className="p-[5px] text-xs text-center font-medium">
                        Standard Size
                      </th>
                      <th className="p-[5px] text-xs text-center font-medium">
                        Chest
                      </th>
                      <th className="p-[5px] text-xs text-center font-medium">
                        Waist
                      </th>
                      <th className="p-[5px] text-xs text-center font-medium">
                        Length
                      </th>
                      <th className="p-[5px] text-xs text-center font-medium">
                        Shoulder
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {inchData.regular.map((row) => (
                      <tr key={row.size} className="border-b last:border-0">
                        <td className="p-[5px] text-xs font-medium text-center">
                          {row.size}
                        </td>
                        <td className="p-[5px] text-xs text-center ">
                          {row.sizeNumber}
                        </td>
                        <td className="p-[5px] text-xs text-center ">
                          {row.chest}"
                        </td>
                        <td className="p-[5px] text-xs text-center ">
                          {row.waist}"
                        </td>
                        <td className="p-[5px] text-xs text-center ">
                          {row.length}"
                        </td>
                        <td className="p-[5px] text-xs text-center ">
                          {row.shoulder}"
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <h3 className="mb-1 text-md font-semibold">Slim Fit</h3>
              <div className="rounded-lg border">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr className="border-b">
                      <th className="p-[5px] text-xs text-center font-medium">
                        Size
                      </th>
                      <th className="p-[5px] text-xs text-center font-medium">
                        Standard Size
                      </th>
                      <th className="p-[5px] text-xs text-center font-medium">
                        Chest
                      </th>
                      <th className="p-[5px] text-xs text-center font-medium">
                        Waist
                      </th>
                      <th className="p-[5px] text-xs text-center font-medium">
                        Length
                      </th>
                      <th className="p-[5px] text-xs text-center font-medium">
                        Shoulder
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {inchData.slim.map((row) => (
                      <tr key={row.size} className="border-b last:border-0">
                        <td className="p-[5px] text-xs font-medium text-center font-center">
                          {row.size}
                        </td>
                        <td className="p-[5px] text-xs text-center ">
                          {row.sizeNumber}
                        </td>
                        <td className="p-[5px] text-xs text-center ">
                          {row.chest}"
                        </td>
                        <td className="p-[5px] text-xs text-center ">
                          {row.waist}"
                        </td>
                        <td className="p-[5px] text-xs text-center ">
                          {row.length}"
                        </td>
                        <td className="p-[5px] text-xs text-center ">
                          {row.shoulder}"
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              In case you run between sizes, size up for a relaxed fit or size
              down for a snug fit.
            </p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export default function SizeChart() {
  return (
    <div className="max-w-4xl bg-white mx-auto p-4 space-y-8">
      <div className="space-y-8">
        {/* Slim Fit Table */}
        <div>
          <h2 className="text-md font-medium mb-4">Slim Fit</h2>
          <div className="rounded-lg border">
            <table className="w-full border-collapse">
              <thead className="bg-muted/50">
                <tr className="border-b">
                  <th className="text-left py-2 px-4 font-medium">Size</th>
                  <th className="text-center py-2 px-4 font-medium">S</th>
                  <th className="text-center py-2 px-4 font-medium">M</th>
                  <th className="text-center py-2 px-4 font-medium">L</th>
                  <th className="text-center py-2 px-4 font-medium">XL</th>
                  <th className="text-center py-2 px-4 font-medium">XXL</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 px-4">Collar</td>
                  <td className="text-center py-2 px-4">39</td>
                  <td className="text-center py-2 px-4">40</td>
                  <td className="text-center py-2 px-4">42</td>
                  <td className="text-center py-2 px-4">44</td>
                  <td className="text-center py-2 px-4">45</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4">Shoulder</td>
                  <td className="text-center py-2 px-4">43.5</td>
                  <td className="text-center py-2 px-4">45.5</td>
                  <td className="text-center py-2 px-4">47.5</td>
                  <td className="text-center py-2 px-4">49.5</td>
                  <td className="text-center py-2 px-4">51.5</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4">Chest</td>
                  <td className="text-center py-2 px-4">95</td>
                  <td className="text-center py-2 px-4">99</td>
                  <td className="text-center py-2 px-4">105</td>
                  <td className="text-center py-2 px-4">111</td>
                  <td className="text-center py-2 px-4">117</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4">Waist</td>
                  <td className="text-center py-2 px-4">85</td>
                  <td className="text-center py-2 px-4">89</td>
                  <td className="text-center py-2 px-4">95</td>
                  <td className="text-center py-2 px-4">101</td>
                  <td className="text-center py-2 px-4">107</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4">Front Length</td>
                  <td className="text-center py-2 px-4">73</td>
                  <td className="text-center py-2 px-4">76</td>
                  <td className="text-center py-2 px-4">78</td>
                  <td className="text-center py-2 px-4">80</td>
                  <td className="text-center py-2 px-4">82</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Regular Fit Table */}
        <div>
          <h2 className="text-md font-medium mb-4">Regular Fit</h2>
          <div className="rounded-lg border">
            <table className="w-full border-collapse">
              <thead className="bg-muted/50">
                <tr className="border-b">
                  <th className="text-left py-2 px-4 font-medium">Size</th>
                  <th className="text-center py-2 px-4 font-medium">S</th>
                  <th className="text-center py-2 px-4 font-medium">M</th>
                  <th className="text-center py-2 px-4 font-medium">L</th>
                  <th className="text-center py-2 px-4 font-medium">XL</th>
                  <th className="text-center py-2 px-4 font-medium">XXL</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 px-4">Collar</td>
                  <td className="text-center py-2 px-4">39</td>
                  <td className="text-center py-2 px-4">40</td>
                  <td className="text-center py-2 px-4">42</td>
                  <td className="text-center py-2 px-4">44</td>
                  <td className="text-center py-2 px-4">45</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4">Shoulder</td>
                  <td className="text-center py-2 px-4">44</td>
                  <td className="text-center py-2 px-4">46</td>
                  <td className="text-center py-2 px-4">48</td>
                  <td className="text-center py-2 px-4">50</td>
                  <td className="text-center py-2 px-4">52</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4">Chest</td>
                  <td className="text-center py-2 px-4">96</td>
                  <td className="text-center py-2 px-4">100</td>
                  <td className="text-center py-2 px-4">106</td>
                  <td className="text-center py-2 px-4">112</td>
                  <td className="text-center py-2 px-4">118</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4">Waist</td>
                  <td className="text-center py-2 px-4">97</td>
                  <td className="text-center py-2 px-4">101</td>
                  <td className="text-center py-2 px-4">107</td>
                  <td className="text-center py-2 px-4">113</td>
                  <td className="text-center py-2 px-4">119</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4">Front Length</td>
                  <td className="text-center py-2 px-4">73</td>
                  <td className="text-center py-2 px-4">76</td>
                  <td className="text-center py-2 px-4">78</td>
                  <td className="text-center py-2 px-4">80</td>
                  <td className="text-center py-2 px-4">82</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-700">
        <p>All measurements are body measurements.</p>
        <p>
          Incase you run between sizes, size up for a relaxed fit or a size down
          for a snug fit.
        </p>
      </div>
    </div>
  );
}
