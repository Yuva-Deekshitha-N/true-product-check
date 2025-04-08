
import { useState } from 'react';
import { Package, PlusCircle, Search, CheckCircle, AlertCircle, Eye, Pencil, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useProduct } from '@/contexts/ProductContext';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Product } from '@/types';
import { useToast } from '@/components/ui/use-toast';

const AdminProducts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // New product form state
  const [formData, setFormData] = useState({
    serialId: '',
    name: '',
    manufacturer: '',
    productOrigin: '',
    manufactureDate: '',
    expiryDate: '',
    seller: '',
    description: '',
    category: '',
    image: ''
  });
  
  const { products, addProduct, deleteProduct } = useProduct();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Filter products based on search query
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.serialId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.manufacturer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await addProduct({
        ...formData,
        image: formData.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'
      });
      
      toast({
        title: "Product added successfully",
        description: "The product has been registered on the blockchain",
      });
      
      setIsAddDialogOpen(false);
      // Reset form
      setFormData({
        serialId: '',
        name: '',
        manufacturer: '',
        productOrigin: '',
        manufactureDate: '',
        expiryDate: '',
        seller: '',
        description: '',
        category: '',
        image: ''
      });
    } catch (error) {
      toast({
        title: "Error adding product",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const confirmDelete = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;
    
    try {
      await deleteProduct(selectedProduct.id);
      toast({
        title: "Product deleted",
        description: "The product has been removed from the database",
      });
    } catch (error) {
      toast({
        title: "Error deleting product",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedProduct(null);
    }
  };

  // Admin access check
  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-500">Access Denied</CardTitle>
              <CardDescription>
                You need admin privileges to access this page.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/')}>Return to Home</Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Package className="h-7 w-7 mr-2 text-algorand-blue" />
              Product Management
            </h1>
            <p className="text-gray-600 mt-1">
              Register and manage products on the Algorand blockchain
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add New Product
            </Button>
          </div>
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Search className="h-5 w-5 text-gray-400 mr-2" />
              <Input
                placeholder="Search products by name, serial ID, or manufacturer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="px-6 py-5">
            <CardTitle className="text-xl">Registered Products</CardTitle>
            <CardDescription>
              {filteredProducts.length === 1
                ? '1 product registered'
                : `${filteredProducts.length} products registered`}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead>Serial ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Manufacturer</TableHead>
                    <TableHead>Origin</TableHead>
                    <TableHead>Date Added</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center">
                          {product.blockchainVerified ? (
                            <div className="bg-green-100 text-green-700 flex items-center rounded-full px-2 py-1 text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              <span>Verified</span>
                            </div>
                          ) : (
                            <div className="bg-red-100 text-red-700 flex items-center rounded-full px-2 py-1 text-xs">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              <span>Unverified</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {product.serialId}
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.manufacturer}</TableCell>
                      <TableCell>{product.productOrigin}</TableCell>
                      <TableCell>
                        {new Date(product.manufactureDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/verify?id=${product.serialId}`)}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => confirmDelete(product)}
                            className="text-red-600"
                          >
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Register a new product on the Algorand blockchain
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddProduct}>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <label htmlFor="serialId" className="text-sm font-medium">
                  Serial ID*
                </label>
                <Input
                  id="serialId"
                  name="serialId"
                  value={formData.serialId}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Product Name*
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="manufacturer" className="text-sm font-medium">
                  Manufacturer*
                </label>
                <Input
                  id="manufacturer"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="productOrigin" className="text-sm font-medium">
                  Product Origin*
                </label>
                <Input
                  id="productOrigin"
                  name="productOrigin"
                  value={formData.productOrigin}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="manufactureDate" className="text-sm font-medium">
                  Manufacture Date*
                </label>
                <Input
                  id="manufactureDate"
                  name="manufactureDate"
                  type="date"
                  value={formData.manufactureDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="expiryDate" className="text-sm font-medium">
                  Expiry Date (Optional)
                </label>
                <Input
                  id="expiryDate"
                  name="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="seller" className="text-sm font-medium">
                  Seller*
                </label>
                <Input
                  id="seller"
                  name="seller"
                  value={formData.seller}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">
                  Category
                </label>
                <Input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <label htmlFor="image" className="text-sm font-medium">
                  Image URL (Optional)
                </label>
                <Input
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Register Product</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-red-500">Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedProduct && (
              <p>
                <span className="font-medium">{selectedProduct.name}</span> with Serial ID{' '}
                <span className="font-mono text-xs">{selectedProduct.serialId}</span> will be removed.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default AdminProducts;
