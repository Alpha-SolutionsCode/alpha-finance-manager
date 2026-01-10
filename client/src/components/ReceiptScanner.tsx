import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Camera, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface ReceiptScannerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScanComplete: (data: ScannedReceiptData) => void;
}

export interface ScannedReceiptData {
  vendor: string;
  amount: number;
  date: string;
  category: string;
  description: string;
  imageUrl?: string;
}

const categories = [
  "Food & Groceries",
  "Transportation",
  "Entertainment",
  "Utilities",
  "Healthcare",
  "Shopping",
  "Dining",
  "Other",
];

export default function ReceiptScanner({ open, onOpenChange, onScanComplete }: ReceiptScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [scannedData, setScannedData] = useState<Partial<ScannedReceiptData>>({
    vendor: "",
    amount: 0,
    date: new Date().toISOString().split("T")[0],
    category: "Food & Groceries",
    description: "",
  });
  const [step, setStep] = useState<"capture" | "edit">("capture");

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (error) {
      toast.error("Could not access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      setCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const imageData = canvasRef.current.toDataURL("image/jpeg");
        setCapturedImage(imageData);
        stopCamera();
        extractReceiptData(imageData);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        setCapturedImage(imageData);
        extractReceiptData(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const extractReceiptData = (imageData: string) => {
    // Simulate OCR extraction - in production, this would call a real OCR API
    // For now, we'll show a form to manually enter the data
    toast.info("Receipt captured! Please review and edit the details below.");
    setStep("edit");

    // Simulated OCR data extraction
    const mockExtractedData: Partial<ScannedReceiptData> = {
      vendor: "Grocery Store",
      amount: 45.99,
      date: new Date().toISOString().split("T")[0],
      category: "Food & Groceries",
      description: "Groceries",
      imageUrl: imageData,
    };

    setScannedData(mockExtractedData);
  };

  const handleSubmit = () => {
    if (!scannedData.vendor || !scannedData.amount) {
      toast.error("Please fill in vendor and amount");
      return;
    }

    onScanComplete(scannedData as ScannedReceiptData);
    toast.success("Receipt added to expenses!");
    resetScanner();
    onOpenChange(false);
  };

  const resetScanner = () => {
    setCapturedImage(null);
    setScannedData({
      vendor: "",
      amount: 0,
      date: new Date().toISOString().split("T")[0],
      category: "Food & Groceries",
      description: "",
    });
    setStep("capture");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Scan Receipt</DialogTitle>
          <DialogDescription>
            {step === "capture"
              ? "Take a photo or upload an image of your receipt"
              : "Review and edit the extracted receipt data"}
          </DialogDescription>
        </DialogHeader>

        {step === "capture" ? (
          <div className="space-y-4">
            {!cameraActive && !capturedImage && (
              <div className="space-y-3">
                <Button onClick={startCamera} className="w-full" size="lg">
                  <Camera className="h-5 w-5 mr-2" />
                  Open Camera
                </Button>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  <Upload className="h-5 w-5 mr-2" />
                  Upload Image
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            )}

            {cameraActive && (
              <div className="space-y-3">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full rounded-lg bg-black"
                />
                <canvas ref={canvasRef} className="hidden" />
                <div className="flex gap-2">
                  <Button onClick={capturePhoto} className="flex-1" size="lg">
                    <Camera className="h-5 w-5 mr-2" />
                    Capture
                  </Button>
                  <Button
                    onClick={stopCamera}
                    variant="outline"
                    className="flex-1"
                    size="lg"
                  >
                    <X className="h-5 w-5 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {capturedImage && !cameraActive && (
              <div className="space-y-3">
                <img
                  src={capturedImage}
                  alt="Captured receipt"
                  className="w-full rounded-lg max-h-96 object-contain"
                />
                <div className="flex gap-2">
                  <Button onClick={() => setStep("edit")} className="flex-1">
                    Continue
                  </Button>
                  <Button
                    onClick={() => {
                      setCapturedImage(null);
                      setStep("capture");
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Retake
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {capturedImage && (
              <img
                src={capturedImage}
                alt="Captured receipt"
                className="w-full rounded-lg max-h-48 object-contain"
              />
            )}

            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="vendor">Vendor Name</Label>
                <Input
                  id="vendor"
                  value={scannedData.vendor || ""}
                  onChange={(e) =>
                    setScannedData({ ...scannedData, vendor: e.target.value })
                  }
                  placeholder="e.g., Whole Foods"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={scannedData.amount || ""}
                    onChange={(e) =>
                      setScannedData({
                        ...scannedData,
                        amount: parseFloat(e.target.value),
                      })
                    }
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={scannedData.date || ""}
                    onChange={(e) =>
                      setScannedData({ ...scannedData, date: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={scannedData.category || "Food & Groceries"}
                  onValueChange={(value) =>
                    setScannedData({ ...scannedData, category: value })
                  }
                >
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  value={scannedData.description || ""}
                  onChange={(e) =>
                    setScannedData({ ...scannedData, description: e.target.value })
                  }
                  placeholder="e.g., Weekly groceries"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setCapturedImage(null);
                  setStep("capture");
                }}
                variant="outline"
                className="flex-1"
              >
                Back
              </Button>
              <Button onClick={handleSubmit} className="flex-1">
                Add to Expenses
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
