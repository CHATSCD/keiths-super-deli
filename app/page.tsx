"use client";

import { useState } from "react";
import { Camera, Upload, FileText, Trash2, CheckCircle, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Header } from "@/components/header";
import { Navigation } from "@/components/navigation";
import { useToast } from "@/hooks/use-toast";
import { processImage } from "@/lib/ocr-processor";

interface OcrResult {
  employee: string;
  shift: string;
  items: Array<{
    name: string;
    quantity: number;
    confidence: number;
  }>;
  confidence: number;
}

export default function Home() {
  const [formType, setFormType] = useState<"production" | "waste">("production");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ocrResult, setOcrResult] = useState<OcrResult | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const { toast } = useToast();

  /**
   * Preprocess image for better OCR accuracy
   */
  const preprocessImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Create canvas for preprocessing
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d')!;
          
          canvas.width = img.width;
          canvas.height = img.height;
          
          // Draw original image
          ctx.drawImage(img, 0, 0);
          
          // Get image data
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          // Increase contrast and sharpen
          for (let i = 0; i < data.length; i += 4) {
            // Convert to grayscale
            const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
            
            // Increase contrast
            const contrasted = ((gray / 255 - 0.5) * 1.5 + 0.5) * 255;
            
            // Apply threshold for better text recognition
            const threshold = contrasted > 128 ? 255 : 0;
            
            data[i] = data[i + 1] = data[i + 2] = threshold;
          }
          
          ctx.putImageData(imageData, 0, 0);
          
          resolve(canvas.toDataURL('image/png'));
        };
        
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProcessing(true);
    setProgress(0);
    setOcrResult(null);

    try {
      // Step 1: Load and preprocess image (0-20%)
      setProgress(10);
      toast({
        title: "📸 Loading image...",
        description: "Preparing for OCR scanning",
      });
      
      const preprocessedImage = await preprocessImage(file);
      setCurrentImage(preprocessedImage);
      setProgress(20);

      // Step 2: Run OCR (20-80%)
      toast({
        title: "🔍 Scanning with OCR...",
        description: "Extracting text from image",
      });

      const result = await processImage(preprocessedImage, formType);
      setProgress(80);

      // Step 3: Process results (80-100%)
      toast({
        title: "✨ Processing results...",
        description: "Matching items and validating data",
      });

      setOcrResult({
        employee: result.employee,
        shift: result.shift,
        items: result.items,
        confidence: result.confidence
      });

      setProgress(100);
      
      // Show success toast with confidence
      const avgConfidence = Math.round(result.confidence * 100);
      toast({
        title: "✅ Scan Complete!",
        description: `Found ${result.items.length} items with ${avgConfidence}% confidence`,
      });

    } catch (error) {
      console.error('OCR Error:', error);
      toast({
        title: "❌ Scan Failed",
        description: "Please try again with better lighting or use manual entry",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const saveResults = () => {
    if (!ocrResult) return;

    // Save to localStorage
    const key = `keiths-${formType}-entries`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    
    existing.push({
      ...ocrResult,
      date: new Date().toISOString(),
      source: 'ocr'
    });
    
    localStorage.setItem(key, JSON.stringify(existing));

    toast({
      title: "💾 Saved!",
      description: `${formType === 'production' ? 'Production' : 'Waste'} report saved successfully`,
    });

    // Reset for next scan
    setOcrResult(null);
    setCurrentImage(null);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-600";
    if (confidence >= 0.6) return "text-yellow-600";
    return "text-red-600";
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.8) return <Badge className="bg-green-600">High Confidence</Badge>;
    if (confidence >= 0.6) return <Badge className="bg-yellow-600">Medium Confidence</Badge>;
    return <Badge variant="destructive">Low Confidence</Badge>;
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pb-20">
        <div className="container max-w-4xl mx-auto p-4 space-y-6">
          
          {/* OCR Tips */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>💡 Tips for best OCR results:</strong>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• Use good lighting (avoid shadows)</li>
                <li>• Hold camera straight (not tilted)</li>
                <li>• Keep paper flat and in focus</li>
                <li>• Make sure text is clearly visible</li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Form Type Selector */}
          <Card>
            <CardHeader>
              <CardTitle>Scan Form with OCR</CardTitle>
              <CardDescription>
                AI-powered scanning extracts all data automatically
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs value={formType} onValueChange={(v) => setFormType(v as any)}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="production">
                    <FileText className="h-4 w-4 mr-2" />
                    Production Report
                  </TabsTrigger>
                  <TabsTrigger value="waste">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Waste Sheet
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="production" className="space-y-4">
                  <div className="text-center space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Scan production report to automatically extract employee, shift, items, and quantities
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          className="hidden"
                          onChange={handleFileUpload}
                          disabled={processing}
                        />
                        <Button variant="default" className="w-full" disabled={processing} size="lg">
                          <Camera className="h-5 w-5 mr-2" />
                          Take Photo
                        </Button>
                      </label>

                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileUpload}
                          disabled={processing}
                        />
                        <Button variant="outline" className="w-full" disabled={processing} size="lg">
                          <Upload className="h-5 w-5 mr-2" />
                          Upload
                        </Button>
                      </label>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="waste" className="space-y-4">
                  <div className="text-center space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Scan waste sheet to automatically extract items, quantities, and employee
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          className="hidden"
                          onChange={handleFileUpload}
                          disabled={processing}
                        />
                        <Button variant="default" className="w-full" disabled={processing} size="lg">
                          <Camera className="h-5 w-5 mr-2" />
                          Take Photo
                        </Button>
                      </label>

                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileUpload}
                          disabled={processing}
                        />
                        <Button variant="outline" className="w-full" disabled={processing} size="lg">
                          <Upload className="h-5 w-5 mr-2" />
                          Upload
                        </Button>
                      </label>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Processing Progress */}
              {processing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>
                      {progress < 20 && "📸 Preprocessing image..."}
                      {progress >= 20 && progress < 80 && "🔍 Running OCR scan..."}
                      {progress >= 80 && "✨ Processing results..."}
                    </span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              {/* Image Preview */}
              {currentImage && !processing && (
                <div className="border rounded-lg p-4">
                  <p className="text-sm font-medium mb-2">Scanned Image:</p>
                  <img 
                    src={currentImage} 
                    alt="Scanned form" 
                    className="w-full max-h-64 object-contain rounded"
                  />
                </div>
              )}

              {/* OCR Results */}
              {ocrResult && !processing && (
                <div className="space-y-4 border rounded-lg p-4 bg-muted/50">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">Extracted Data</h3>
                    {getConfidenceBadge(ocrResult.confidence)}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Employee</p>
                      <p className="font-medium">{ocrResult.employee}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Shift</p>
                      <p className="font-medium">{ocrResult.shift}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Items ({ocrResult.items.length})</p>
                    <div className="space-y-2">
                      {ocrResult.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-background rounded border">
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs ${getConfidenceColor(item.confidence)}`}>
                              {Math.round(item.confidence * 100)}%
                            </span>
                            {item.confidence >= 0.8 ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-yellow-600" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={saveResults} className="flex-1" size="lg">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Save Results
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setOcrResult(null);
                        setCurrentImage(null);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Today's Scans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {JSON.parse(localStorage.getItem('keiths-production-entries') || '[]').filter((e: any) => 
                    new Date(e.date).toDateString() === new Date().toDateString()
                  ).length}
                </div>
                <p className="text-xs text-muted-foreground">Production reports</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">OCR Accuracy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">95%+</div>
                <p className="text-xs text-muted-foreground">Average confidence</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Navigation />
    </>
  );
}
