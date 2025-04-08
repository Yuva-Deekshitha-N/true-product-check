
import { useState } from 'react';
import { Barcode, Camera, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useProduct } from '@/contexts/ProductContext';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const ScanProduct = () => {
  const [serialId, setSerialId] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<'authentic' | 'counterfeit' | 'notFound' | null>(null);
  const { getProduct } = useProduct();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Simulate barcode scanning
  const handleScan = () => {
    if (!serialId.trim()) return;
    
    setIsScanning(true);

    // Simulate scanning delay
    setTimeout(() => {
      const product = getProduct(serialId);
      
      if (product) {
        if (product.blockchainVerified) {
          setScanResult('authentic');
        } else {
          setScanResult('counterfeit');
        }
      } else {
        setScanResult('notFound');
      }
      
      setIsScanning(false);
    }, 1500);
  };

  const handleReportFake = () => {
    navigate('/report');
  };

  // Camera access simulation
  const handleCameraAccess = () => {
    toast({
      title: "Camera access requested",
      description: "This is a demo. In a real app, we would access your camera for barcode scanning.",
    });
    
    // Simulate finding a product after "scanning"
    setTimeout(() => {
      // Randomly select one of our demo products
      const demoProducts = ['PROD-001-2023', 'PROD-002-2023', 'FAKE-001-2023'];
      const randomProduct = demoProducts[Math.floor(Math.random() * demoProducts.length)];
      setSerialId(randomProduct);
      handleScan();
    }, 2000);
  };

  if (!isAuthenticated) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Authentication Required</CardTitle>
              <CardDescription>
                You need to be logged in to scan and verify products.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/login')}>
                Login to Continue
              </Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Scan Product</h1>
            <p className="text-gray-600">
              Scan a product's barcode or enter its serial ID to verify authenticity
            </p>
          </div>

          <Card className="mb-6">
            <CardContent className="pt-6 flex flex-col items-center">
              <div className="w-full">
                <div className="flex space-x-2 mb-4">
                  <Input
                    type="text"
                    placeholder="Enter product serial ID"
                    value={serialId}
                    onChange={(e) => setSerialId(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleScan} disabled={isScanning || !serialId}>
                    {isScanning ? 'Scanning...' : 'Scan'}
                  </Button>
                </div>
                
                <div className="flex items-center justify-center">
                  <div className="relative w-full max-w-xs aspect-[4/3] border-2 border-dashed rounded-lg flex items-center justify-center bg-gray-50">
                    <div className="text-center p-4">
                      {isScanning ? (
                        <div className="animate-pulse">
                          <div className="relative mb-3">
                            <Barcode className="h-12 w-12 mx-auto text-algorand-blue" />
                            <div className="absolute inset-0 bg-algorand-teal/20 animate-ping rounded-full"></div>
                          </div>
                          <p className="text-sm text-gray-500">Scanning...</p>
                        </div>
                      ) : (
                        <>
                          <Camera className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500 mb-4">
                            Point your camera at the product barcode
                          </p>
                          <Button size="sm" onClick={handleCameraAccess} className="text-xs">
                            Access Camera
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {scanResult && (
            <Card className={`
              ${scanResult === 'authentic' ? 'border-green-500' : ''}
              ${scanResult === 'counterfeit' ? 'border-red-500' : ''}
              ${scanResult === 'notFound' ? 'border-orange-500' : ''}
            `}>
              <div className={`
                px-6 py-4 flex items-center
                ${scanResult === 'authentic' ? 'bg-green-500 text-white' : ''}
                ${scanResult === 'counterfeit' ? 'bg-red-500 text-white' : ''}
                ${scanResult === 'notFound' ? 'bg-orange-500 text-white' : ''}
              `}>
                {scanResult === 'authentic' && <CheckCircle className="h-5 w-5 mr-2" />}
                {scanResult === 'counterfeit' && <AlertCircle className="h-5 w-5 mr-2" />}
                {scanResult === 'notFound' && <Info className="h-5 w-5 mr-2" />}
                <h2 className="font-semibold">
                  {scanResult === 'authentic' && 'Authentic Product'}
                  {scanResult === 'counterfeit' && 'Potential Counterfeit Detected'}
                  {scanResult === 'notFound' && 'Product Not Found'}
                </h2>
              </div>
              
              <CardContent className="pt-6">
                {scanResult === 'authentic' && (
                  <div className="space-y-4">
                    <p className="text-green-700">
                      This product has been verified as authentic on the Algorand blockchain.
                    </p>
                    <Button variant="outline" onClick={() => navigate(`/verify?id=${serialId}`)}>
                      View Detailed Information
                    </Button>
                  </div>
                )}
                
                {scanResult === 'counterfeit' && (
                  <div className="space-y-4">
                    <p className="text-red-700">
                      Warning: This product couldn't be verified on the blockchain. It might be counterfeit.
                    </p>
                    <div className="flex flex-col space-y-2">
                      <Button 
                        variant="outline" 
                        onClick={() => navigate(`/verify?id=${serialId}`)}
                      >
                        View Details
                      </Button>
                      <Button onClick={handleReportFake} variant="destructive">
                        Report Counterfeit Product
                      </Button>
                    </div>
                  </div>
                )}
                
                {scanResult === 'notFound' && (
                  <div className="space-y-4">
                    <p className="text-orange-700">
                      This product was not found in our database. It may be counterfeit or not registered yet.
                    </p>
                    <Button onClick={handleReportFake}>
                      Report Suspicious Product
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Try these demo serial IDs: PROD-001-2023 (authentic), FAKE-001-2023 (counterfeit)
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ScanProduct;
