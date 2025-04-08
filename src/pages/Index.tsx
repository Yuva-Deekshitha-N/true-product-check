import { useNavigate } from 'react-router-dom';
import { Shield, Package, Database, AlertTriangle, Barcode, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-algorand-blue to-algorand-teal text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Secure Product Verification with Algorand Blockchain
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Combat counterfeit products with our decentralized, tamper-proof verification system. 
              Protect your brand and ensure consumer safety with blockchain-powered authenticity.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                onClick={() => navigate('/verify')}
                className="bg-white text-algorand-blue hover:bg-gray-100"
              >
                <Shield className="mr-2 h-5 w-5" />
                Verify Product
              </Button>
              {!isAuthenticated && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/register')}
                  className="border-white text-white hover:bg-white/10"
                >
                  Create Account
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our system uses Algorand blockchain technology to create an immutable record 
              of product authenticity that cannot be tampered with or counterfeited.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-none shadow-md">
              <CardContent className="pt-6">
                <div className="p-3 bg-algorand-teal/10 rounded-full w-14 h-14 flex items-center justify-center mb-4 mx-auto">
                  <Package className="h-7 w-7 text-algorand-teal" />
                </div>
                <h3 className="font-bold text-xl mb-2 text-center">Product Registration</h3>
                <p className="text-gray-600 text-center">
                  Manufacturers register products with unique identifiers and store details securely on the blockchain
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardContent className="pt-6">
                <div className="p-3 bg-algorand-teal/10 rounded-full w-14 h-14 flex items-center justify-center mb-4 mx-auto">
                  <Barcode className="h-7 w-7 text-algorand-teal" />
                </div>
                <h3 className="font-bold text-xl mb-2 text-center">Verification Process</h3>
                <p className="text-gray-600 text-center">
                  Consumers scan product barcodes using our app to instantly verify authenticity against blockchain records
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardContent className="pt-6">
                <div className="p-3 bg-algorand-teal/10 rounded-full w-14 h-14 flex items-center justify-center mb-4 mx-auto">
                  <AlertTriangle className="h-7 w-7 text-algorand-teal" />
                </div>
                <h3 className="font-bold text-xl mb-2 text-center">Counterfeit Reporting</h3>
                <p className="text-gray-600 text-center">
                  Users can report suspected counterfeit products, helping protect other consumers and brands
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Authentico?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our blockchain-powered solution offers unique advantages over traditional verification methods.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle2 className="h-6 w-6 text-algorand-green" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-1">Immutable Records</h3>
                <p className="text-gray-600">
                  Once data is recorded on the Algorand blockchain, it cannot be altered or deleted, ensuring complete data integrity.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle2 className="h-6 w-6 text-algorand-green" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-1">Decentralized Security</h3>
                <p className="text-gray-600">
                  No central point of failure means higher reliability and resistance to attacks or data manipulation.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle2 className="h-6 w-6 text-algorand-green" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-1">Fast Verification</h3>
                <p className="text-gray-600">
                  Instant product verification allows consumers to check authenticity in seconds before making a purchase.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle2 className="h-6 w-6 text-algorand-green" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-1">Eco-Friendly</h3>
                <p className="text-gray-600">
                  Algorand's Pure Proof-of-Stake consensus mechanism is energy efficient compared to other blockchain technologies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-algorand-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to protect your products?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of brands using Authentico to verify product authenticity
            and build consumer trust through blockchain technology.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="lg"
              onClick={() => navigate('/verify')}
              className="bg-white text-algorand-blue hover:bg-gray-100"
            >
              <Shield className="mr-2 h-5 w-5" />
              Verify a Product
            </Button>
            {isAuthenticated ? (
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/scan')}
                className="border-white text-white hover:bg-white/10"
              >
                <Barcode className="mr-2 h-5 w-5" />
                Scan Barcode
              </Button>
            ) : (
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/login')}
                className="border-white text-white hover:bg-white/10"
              >
                Login to Account
              </Button>
            )}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
