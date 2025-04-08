
import { useState } from 'react';
import { AlertTriangle, Upload, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useProduct } from '@/contexts/ProductContext';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const ReportFake = () => {
  const [productName, setProductName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const { submitReport } = useProduct();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) return;
    
    setIsSubmitting(true);
    
    try {
      await submitReport({
        productName,
        reporterId: user.id,
        reporterName: user.name,
        description,
        location,
        imageUrl,
      });
      
      setIsSuccess(true);
      toast({
        title: "Report submitted successfully",
        description: "Thank you for helping combat counterfeit products.",
        variant: "default",
      });
      
      // Reset form after submission
      setTimeout(() => {
        setProductName('');
        setLocation('');
        setDescription('');
        setImageUrl('');
        setIsSuccess(false);
      }, 3000);
    } catch (error) {
      toast({
        title: "Error submitting report",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    // Simulate file upload
    toast({
      title: "Image upload simulation",
      description: "In a real app, this would upload your image.",
    });
    
    // Set a random placeholder image
    const placeholders = [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
      'https://images.unsplash.com/photo-1560343090-f0409e92791a',
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519',
    ];
    setImageUrl(placeholders[Math.floor(Math.random() * placeholders.length)]);
  };

  const handleImageUpload = () => {
    // Simulate file selection
    toast({
      title: "Image upload simulation",
      description: "In a real app, this would open your file picker.",
    });
    
    // Set a random placeholder image
    const placeholders = [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
      'https://images.unsplash.com/photo-1560343090-f0409e92791a',
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519',
    ];
    setImageUrl(placeholders[Math.floor(Math.random() * placeholders.length)]);
  };

  const removeImage = () => {
    setImageUrl('');
  };

  if (!isAuthenticated) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Authentication Required</CardTitle>
              <CardDescription>
                You need to be logged in to report fake products.
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
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Report Counterfeit Product</h1>
            <p className="text-gray-600">
              Help us combat fake products by submitting information about potential counterfeits
            </p>
          </div>

          <Card>
            <CardHeader className="bg-gray-50 border-b">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-orange-500 mt-1 mr-2" />
                <div>
                  <CardTitle>Submit a Report</CardTitle>
                  <CardDescription>
                    Your information helps protect other consumers and legitimate brands
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {isSuccess ? (
                <div className="text-center py-6">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-green-600 mb-2">Report Submitted Successfully</h3>
                  <p className="text-gray-600 mb-6">
                    Thank you for helping combat counterfeit products. Our team will review your report.
                  </p>
                  <Button onClick={() => navigate('/')}>Return to Home</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
                      Product Name*
                    </label>
                    <Input
                      id="productName"
                      placeholder="E.g., Brand X Headphones"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                      Where Found*
                    </label>
                    <Input
                      id="location"
                      placeholder="E.g., Downtown Market, New York"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description*
                    </label>
                    <Textarea
                      id="description"
                      placeholder="Describe why you believe this product is counterfeit"
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Upload Image (Optional)
                    </label>
                    {!imageUrl ? (
                      <div
                        className={`border-2 border-dashed rounded-lg p-6 text-center ${
                          isDragging ? 'border-algorand-teal bg-algorand-teal/5' : 'border-gray-300'
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                        <Upload className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500 mb-2">
                          Drag and drop an image here, or click to select
                        </p>
                        <Button type="button" size="sm" onClick={handleImageUpload}>
                          Upload Image
                        </Button>
                      </div>
                    ) : (
                      <div className="relative rounded-lg overflow-hidden border">
                        <img src={imageUrl} alt="Product" className="w-full h-48 object-cover" />
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          className="absolute top-2 right-2"
                          onClick={removeImage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Images help our team better identify counterfeit products
                    </p>
                  </div>
                  
                  <div className="pt-4">
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? 'Submitting Report...' : 'Submit Report'}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default ReportFake;
