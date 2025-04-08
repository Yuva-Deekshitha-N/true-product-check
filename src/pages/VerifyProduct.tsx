
import { useState } from 'react';
import { Search, CheckCircle, AlertCircle, Info, ExternalLink, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProduct } from '@/contexts/ProductContext';
import MainLayout from '@/components/layout/MainLayout';

const VerifyProduct = () => {
  const [serialId, setSerialId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const { getProduct } = useProduct();
  const [foundProduct, setFoundProduct] = useState<any>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);

    // Simulate API/blockchain lookup
    setTimeout(() => {
      const product = getProduct(serialId);
      setFoundProduct(product);
      setSearchPerformed(true);
      setIsSearching(false);
    }, 1000);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Verify Product Authenticity</h1>
            <p className="text-gray-600">
              Enter a product's serial ID to check its authenticity using our blockchain verification system
            </p>
          </div>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <form onSubmit={handleSearch} className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="Enter product serial ID (e.g., PROD-001-2023)"
                  value={serialId}
                  onChange={(e) => setSerialId(e.target.value)}
                  className="flex-1"
                  required
                />
                <Button type="submit" disabled={isSearching}>
                  {isSearching ? (
                    <>Searching...</>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Verify
                    </>
                  )}
                </Button>
              </form>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                  Try these demo serial IDs: PROD-001-2023, PROD-002-2023, FAKE-001-2023
                </p>
              </div>
            </CardContent>
          </Card>

          {searchPerformed && (
            foundProduct ? (
              <Card className="overflow-hidden">
                <div 
                  className={`${
                    foundProduct.blockchainVerified 
                      ? 'bg-green-500' 
                      : 'bg-red-500'
                  } px-6 py-3 text-white flex items-center justify-between`}
                >
                  <div className="flex items-center">
                    {foundProduct.blockchainVerified ? (
                      <CheckCircle className="h-5 w-5 mr-2" />
                    ) : (
                      <AlertCircle className="h-5 w-5 mr-2" />
                    )}
                    <span className="font-medium">
                      {foundProduct.blockchainVerified 
                        ? 'Authentic Product' 
                        : 'Verification Failed - Possible Counterfeit'}
                    </span>
                  </div>
                  <div className="text-sm opacity-90">
                    Serial ID: {foundProduct.serialId}
                  </div>
                </div>

                <Tabs defaultValue="details" className="p-6">
                  <TabsList>
                    <TabsTrigger value="details">Product Details</TabsTrigger>
                    <TabsTrigger value="blockchain">Blockchain Verification</TabsTrigger>
                  </TabsList>
                  <TabsContent value="details" className="pt-4">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        {foundProduct.image && (
                          <div className="mb-4 rounded-lg overflow-hidden border">
                            <img 
                              src={foundProduct.image} 
                              alt={foundProduct.name}
                              className="w-full h-64 object-cover"
                            />
                          </div>
                        )}
                        <h2 className="text-2xl font-bold mb-2">{foundProduct.name}</h2>
                        {foundProduct.description && (
                          <p className="text-gray-600 mb-4">{foundProduct.description}</p>
                        )}
                        <div className="text-sm text-gray-500">
                          {foundProduct.category && (
                            <div className="mb-1">Category: {foundProduct.category}</div>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="font-semibold mb-2">Manufacturer Information</h3>
                          <div className="grid grid-cols-[120px_1fr] gap-y-2 text-sm">
                            <div className="text-gray-500">Manufacturer:</div>
                            <div>{foundProduct.manufacturer}</div>
                            <div className="text-gray-500">Origin:</div>
                            <div>{foundProduct.productOrigin}</div>
                            <div className="text-gray-500">Manufacture Date:</div>
                            <div>
                              {new Date(foundProduct.manufactureDate).toLocaleDateString()}
                            </div>
                            {foundProduct.expiryDate && (
                              <>
                                <div className="text-gray-500">Expiry Date:</div>
                                <div>
                                  {new Date(foundProduct.expiryDate).toLocaleDateString()}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="font-semibold mb-2">Distribution Information</h3>
                          <div className="grid grid-cols-[120px_1fr] gap-y-2 text-sm">
                            <div className="text-gray-500">Seller:</div>
                            <div>{foundProduct.seller}</div>
                          </div>
                        </div>
                        
                        <div className={`p-4 rounded-lg ${
                          foundProduct.blockchainVerified 
                            ? 'bg-green-50 border border-green-100' 
                            : 'bg-red-50 border border-red-100'
                        }`}>
                          <div className="flex items-start">
                            <div className={`p-1 rounded-full mr-3 ${
                              foundProduct.blockchainVerified 
                                ? 'bg-green-100' 
                                : 'bg-red-100'
                            }`}>
                              {foundProduct.blockchainVerified ? (
                                <Shield className={`h-5 w-5 ${
                                  foundProduct.blockchainVerified 
                                    ? 'text-green-500' 
                                    : 'text-red-500'
                                }`} />
                              ) : (
                                <AlertCircle className={`h-5 w-5 ${
                                  foundProduct.blockchainVerified 
                                    ? 'text-green-500' 
                                    : 'text-red-500'
                                }`} />
                              )}
                            </div>
                            <div>
                              <h3 className={`font-semibold ${
                                foundProduct.blockchainVerified 
                                  ? 'text-green-700' 
                                  : 'text-red-700'
                              }`}>
                                {foundProduct.blockchainVerified 
                                  ? 'Blockchain Verified'
                                  : 'Verification Failed'
                                }
                              </h3>
                              <p className={`text-sm ${
                                foundProduct.blockchainVerified 
                                  ? 'text-green-600' 
                                  : 'text-red-600'
                              }`}>
                                {foundProduct.blockchainVerified 
                                  ? 'This product is registered on the Algorand blockchain and is authentic.'
                                  : 'This product could not be verified. It may be counterfeit.'
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="blockchain" className="pt-4">
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">Blockchain Verification Details</h3>
                        {foundProduct.blockchainVerified ? (
                          <>
                            <div className="grid grid-cols-[140px_1fr] gap-y-2 text-sm">
                              <div className="text-gray-500">Transaction ID:</div>
                              <div className="font-mono">{foundProduct.transactionId}</div>
                              <div className="text-gray-500">Blockchain:</div>
                              <div>Algorand</div>
                              <div className="text-gray-500">Verification Date:</div>
                              <div>{new Date().toLocaleDateString()}</div>
                            </div>
                            <div className="mt-4 flex">
                              <Button variant="outline" size="sm" className="flex items-center text-xs">
                                <ExternalLink className="h-3 w-3 mr-1" />
                                View on Algorand Explorer
                              </Button>
                            </div>
                          </>
                        ) : (
                          <div className="text-red-600 flex items-center">
                            <Info className="h-5 w-5 mr-2" />
                            <span>No blockchain verification record found for this product.</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h3 className="font-semibold text-blue-700 mb-2">How Blockchain Verification Works</h3>
                        <p className="text-sm text-blue-600">
                          When a product is registered on our platform, key details are stored securely on the 
                          Algorand blockchain. This creates a permanent, tamper-proof record that can be verified 
                          by anyone. Since blockchain data cannot be altered, counterfeiting becomes extremely difficult.
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>
            ) : (
              <Card>
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl text-red-500 flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 mr-2" />
                    Product Not Found
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center mb-6">
                    No product with serial ID <span className="font-mono font-semibold">{serialId}</span> was found in our database.
                  </p>
                  <div className="flex flex-col items-center">
                    <p className="text-sm text-gray-500 mb-4">
                      This could indicate:
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-500 mb-6">
                      <li>The serial ID was entered incorrectly</li>
                      <li>The product has not been registered on our system</li>
                      <li>The product may be counterfeit</li>
                    </ul>
                    <Button 
                      variant="outline" 
                      onClick={() => setSerialId('')}
                      className="mb-2"
                    >
                      Try Another Search
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default VerifyProduct;
