import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { Card, CardContent } from "../components/ui/Card";
import useLoadTax from "../hooks/useLoadTax";
import useSaveTax from "../hooks/useSaveTax";
import toast from "react-hot-toast";

const Settings = () => {
  const [taxPercentage, setTaxPercentage] = useState("");
  const [showTaxDetails, setShowTaxDetails] = useState(false);

  const [servicePercentage, setServicePercentage] = useState("");
  const [showServiceDetails, setShowServiceDetails] = useState(false);

  const { loadTax } = useLoadTax();
  const { saveTax } = useSaveTax();

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await loadTax();
        setTaxPercentage(data.taxPercentage);
        setShowTaxDetails(JSON.parse(data.showTax));
        setServicePercentage(data.serviceChargePercentage);
        setShowServiceDetails(JSON.parse(data.showServiceCharge));
      } catch (error) {
        console.log(error);
      }
    };
    load();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // Placeholder for form submission logic

    try {
      await saveTax({
        taxPercentage,
        showTaxDetails,
        servicePercentage,
        showServiceDetails,
      });
      toast.success("Details saved success");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Link to="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">Manage your store settings</p>
          </div>
        </div>
      </div>

      {/* Settings Form */}
      <Card className="max-w-2xl">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tax Percentage Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Tax Percentage
              </label>
              <Input
                type="number"
                placeholder="Enter tax percentage (e.g., 8.5)"
                value={taxPercentage}
                onChange={(e) => setTaxPercentage(e.target.value)}
                min="0"
                step="0.1"
                required
                className="w-full"
              />
            </div>

            {/* Show Tax Details Checkbox */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showTaxDetails"
                checked={showTaxDetails}
                onChange={(e) => setShowTaxDetails(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label
                htmlFor="showTaxDetails"
                className="text-sm font-medium text-foreground"
              >
                Show tax details to customer
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button type="submit" leftIcon={<Save className="h-4 w-4" />}>
                Save Settings
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="max-w-2xl">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tax Percentage Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Service Charge Percentage
              </label>
              <Input
                type="number"
                placeholder="Enter tax percentage (e.g., 8.5)"
                value={servicePercentage}
                onChange={(e) => setServicePercentage(e.target.value)}
                min="0"
                step="0.1"
                required
                className="w-full"
              />
            </div>

            {/* Show Tax Details Checkbox */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showTaxDetails"
                checked={showServiceDetails}
                onChange={(e) => setShowServiceDetails(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label
                htmlFor="showTaxDetails"
                className="text-sm font-medium text-foreground"
              >
                Show service charges details to customer
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button type="submit" leftIcon={<Save className="h-4 w-4" />}>
                Save Settings
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
