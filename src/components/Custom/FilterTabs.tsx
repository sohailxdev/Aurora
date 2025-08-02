import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { Checkbox } from "../ui/checkbox";
import {
  fetchAttributeAsync,
  selectAttributeData,
  selectAttributeLoading,
} from "@/app/attribute/attributeSlice";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useLocation, useNavigate } from "react-router-dom";
import { Dispatch, SetStateAction } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";

interface AttributeKey {
  id: string;
  attributeName: string;
  attributeType: string;
  inputType: string | null;
  values: string[];
}

interface DataItem {
  id: string;
  attributeKey: AttributeKey;
  value: string[];
  groupCompanyId: string;
}
interface FilterTabsProps {
  setOpen: Dispatch<SetStateAction<boolean>>; // Setter function for opening/closing the sheet (boolean state)
  selectedFilters: Record<string, string[]>; // Object where keys are filter names and values are arrays of selected values
  setSelectedFilters: Dispatch<SetStateAction<Record<string, string[]>>>; // Setter function for selectedFilters
  params: string; // Query parameters as a string
  setParams: Dispatch<SetStateAction<string>>; // Setter function for the params string
}

function FilterTabs({
  setOpen,
  selectedFilters,
  setSelectedFilters,
  params,
  setParams,
}: FilterTabsProps) {
  // const [filter, setFilter] = useState<DataItem[]>();
  const filter = useAppSelector(selectAttributeData);
  const loading = useAppSelector(selectAttributeLoading);
  const [resetKey, setResetKey] = useState(0);
  const [value, setValue] = useState([0, 5000]);
  const dispatch = useAppDispatch();
  const paramsPrice = useLocation().search;
  const navigate = useNavigate();

  /** Extract values from URL and set state on mount */
  useEffect(() => {
    const searchParams = new URLSearchParams(paramsPrice);
    const newFilters: Record<string, string[]> = {};

    searchParams.forEach((value, key) => {
      if (key === "minPrice" || key === "maxPrice") {
        setValue((prev) =>
          key === "minPrice"
            ? [parseInt(value || "0"), prev[1]]
            : [prev[0], parseInt(value || "5000")]
        );
      } else {
        newFilters[key] = value.split(",");
      }
    });

    setSelectedFilters(newFilters);
  }, [paramsPrice]);

  /** Handle checkbox selection */
  const handleCheckboxChange = (keyName: string, value: string) => {
    setSelectedFilters((prev) => {
      const updatedValues = prev[keyName] ? [...prev[keyName]] : [];
      const newValues = updatedValues.includes(value)
        ? updatedValues.filter((v) => v !== value)
        : [...updatedValues, value];

      const newFilters = { ...prev, [keyName]: newValues };
      if (newValues.length === 0) {
        delete newFilters[keyName];
      }

      return newFilters;
    });
  };

  /** Handle price change */
  const handlePriceChange = (newValue: number[]) => {
    setValue(newValue);
    setSelectedFilters((prev) => ({
      ...prev,
      minPrice: [newValue[0].toString()],
      maxPrice: [newValue[1].toString()],
    }));
  };

  /** Format selected filters into URL parameters */
  const formattedFilters = Object.entries(selectedFilters)
    .map(([key, values]) => {
      if (key === "minPrice" || key === "maxPrice") {
        return `${key}=${values[0]}`;
      }
      return `${key.toLowerCase()}=${values.join(",")}`;
    })
    .join("&");

  useEffect(() => {
    !filter && dispatch(fetchAttributeAsync());
  }, [filter, params]);

  return (
    <>
      {loading ? (
        <div className="h-[calc(100vh-160px)] flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-black" />
        </div>
      ) : (
        <>
          <Tabs
            key={resetKey}
            defaultValue="price"
            className="h-[calc(100dvh-160px)]  overflow-y-auto"
          >
            <div className="grid h-full grid-cols-[140px,1fr]">
              <TabsList className="flex h-full flex-col items-start justify-start rounded-none bg-transparent text-black">
                <TabsTrigger
                  value="price"
                  className="w-full capitalize justify-start px-3 py-4 border-b font-medium shadow-none"
                >
                  Price
                </TabsTrigger>
                {filter?.map((attribute) => (
                  <TabsTrigger
                    key={attribute.attributeKey.attributeName}
                    value={attribute.attributeKey.attributeName}
                    className="w-full capitalize justify-start px-3 py-4 border-b font-medium shadow-none"
                  >
                    {attribute.attributeKey.attributeName}
                  </TabsTrigger>
                ))}
              </TabsList>

              <div className="border-l">
                <TabsContent value="price" className="m-0 p-6 overflow-y-auto">
                  <ScrollArea className="h-[600px]">
                    <div className="space-y-4 py-2">
                      <Label className="leading-6">Select Price Range</Label>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <output className="font-medium tabular-nums">
                          ₹{value[0]}
                        </output>
                        <output className="font-medium tabular-nums">
                          ₹{value[1]}
                        </output>
                      </div>
                      <Slider
                        value={value}
                        onValueChange={handlePriceChange}
                        max={5000}
                        min={0}
                        step={100}
                      />
                    </div>
                  </ScrollArea>
                </TabsContent>

                {filter?.map((attribute) => (
                  <TabsContent
                    key={attribute.attributeKey.attributeName}
                    value={attribute.attributeKey.attributeName}
                    className="m-0 p-6 overflow-y-auto"
                  >
                    <ScrollArea className="h-[600px]">
                      <div className="flex-col space-y-4">
                        {attribute.attributeKey.attributeName?.toUpperCase() ===
                        "SIZE" ? (
                          <div className="text-sm text-muted-foreground flex gap-4 flex-wrap">
                            {attribute.value.map((value) => (
                              <div
                                key={value}
                                className={cn(
                                  "py-4 px-7 flex justify-center items-center cursor-pointer border-2 rounded-md transition-all",
                                  selectedFilters["size"]?.includes(value)
                                    ? "border border-black"
                                    : "border-border",
                                  "focus:outline-none focus:ring-2 focus:ring-blue-500"
                                )}
                                onClick={() =>
                                  handleCheckboxChange(
                                    attribute.attributeKey.attributeName,
                                    value
                                  )
                                }
                              >
                                {value}
                              </div>
                            ))}
                          </div>
                        ) : attribute.attributeKey.attributeName?.toUpperCase() ===
                          "COLOR" ? (
                          attribute.value.map((value) => (
                            <div
                              key={value}
                              className="flex items-center space-x-2 w-full px-3 mt-1 "
                            >
                              <Checkbox
                                id={`${value}`}
                                checked={
                                  !!selectedFilters[
                                    attribute.attributeKey.attributeName
                                  ]?.includes(value)
                                }
                                onCheckedChange={() =>
                                  handleCheckboxChange(
                                    attribute.attributeKey.attributeName,
                                    value
                                  )
                                }
                                fill={
                                  value.split("-")[0].toUpperCase() == "BLACK"
                                    ? "text-white font-semibold ring-1 ring-offset-1 ring-[#a29a75] transform scale-110"
                                    : "text-black font-semibold ring-2 ring-offset-1 ring-[#a29a75] transform scale-110"
                                }
                                style={{
                                  backgroundColor: `#${value.split("-")[1]}`,
                                }}
                              />

                              <label
                                htmlFor={`${value}`}
                                className="text-sm font-medium leading-none"
                              >
                                {value.split("-")[0]}
                              </label>
                            </div>
                          ))
                        ) : (
                          attribute.value.map(
                            (
                              value // ✅ Fixed misplaced closing parenthesis
                            ) => (
                              <div
                                key={value}
                                className="flex items-center space-x-4 w-full"
                              >
                                <Checkbox
                                  id={`${value}`}
                                  checked={
                                    !!selectedFilters[
                                      attribute.attributeKey.attributeName
                                    ]?.includes(value)
                                  }
                                  onCheckedChange={() =>
                                    handleCheckboxChange(
                                      attribute.attributeKey.attributeName,
                                      value
                                    )
                                  }
                                />
                                <label
                                  htmlFor={`${value}`}
                                  className="text-sm font-medium leading-none"
                                >
                                  {value}
                                </label>
                              </div>
                            )
                          )
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                ))}
              </div>
            </div>
          </Tabs>

          <div className="flex bg-white items-center gap-2 border-t p-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setSelectedFilters({});
                setParams("");
                navigate(`?`);
                setResetKey((prev) => prev + 1);
                setOpen(false);
              }}
            >
              Clear
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                const searchParams = formattedFilters;
                const finalParams = searchParams || "";
                setParams(finalParams);
                navigate(`?${finalParams}`);
                setOpen(false);
              }}
            >
              Apply
            </Button>
          </div>
        </>
      )}
    </>
  );
}

export default FilterTabs;
