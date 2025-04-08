
import { useState } from 'react';
import { AlertTriangle, Search, Eye, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Badge } from '@/components/ui/badge';
import { useProduct } from '@/contexts/ProductContext';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Report } from '@/types';
import { useToast } from '@/components/ui/use-toast';

const AdminReports = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  
  const { reports, updateReportStatus } = useProduct();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Filter reports based on search query and status filter
  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reporterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.location.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = async (status: Report['status']) => {
    if (!selectedReport) return;
    
    try {
      await updateReportStatus(selectedReport.id, status);
      toast({
        title: "Report status updated",
        description: `The report is now marked as ${status}`,
      });
      setSelectedReport(prev => prev ? { ...prev, status } : null);
    } catch (error) {
      toast({
        title: "Error updating status",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const viewReport = (report: Report) => {
    setSelectedReport(report);
    setIsViewDialogOpen(true);
  };

  // Helper function to display report status badge
  const getStatusBadge = (status: Report['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'reviewed':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Reviewed</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Resolved</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center">
            <AlertTriangle className="h-7 w-7 mr-2 text-algorand-blue" />
            Fake Product Reports
          </h1>
          <p className="text-gray-600 mt-1">
            Review and manage counterfeit product reports submitted by users
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex items-center flex-1">
                <Search className="h-5 w-5 text-gray-400 mr-2" />
                <Input
                  placeholder="Search reports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
              </div>
              <div className="w-full md:w-52">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="reviewed">Reviewed</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="px-6 py-5">
            <CardTitle className="text-xl">Submitted Reports</CardTitle>
            <CardDescription>
              {filteredReports.length === 1
                ? '1 report found'
                : `${filteredReports.length} reports found`}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Reporter</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Report Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.length > 0 ? (
                    filteredReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell>
                          {getStatusBadge(report.status)}
                        </TableCell>
                        <TableCell className="font-medium">
                          {report.productName}
                        </TableCell>
                        <TableCell>{report.reporterName}</TableCell>
                        <TableCell>{report.location}</TableCell>
                        <TableCell>
                          {new Date(report.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => viewReport(report)}
                              className="text-blue-600"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No reports found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Fake Product Report</DialogTitle>
            <DialogDescription>
              Review details of the reported counterfeit product
            </DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="py-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="font-medium mb-1">Product Information</h3>
                  <p className="text-sm mb-3">{selectedReport.productName}</p>
                  
                  <h3 className="font-medium mb-1">Reported By</h3>
                  <p className="text-sm mb-3">{selectedReport.reporterName}</p>
                  
                  <h3 className="font-medium mb-1">Location Found</h3>
                  <p className="text-sm mb-3">{selectedReport.location}</p>
                  
                  <h3 className="font-medium mb-1">Report Date</h3>
                  <p className="text-sm mb-3">
                    {new Date(selectedReport.createdAt).toLocaleString()}
                  </p>
                  
                  <h3 className="font-medium mb-1">Status</h3>
                  <div>{getStatusBadge(selectedReport.status)}</div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-1">Description</h3>
                  <p className="text-sm p-3 bg-gray-50 rounded-md border mb-4 min-h-[100px]">
                    {selectedReport.description}
                  </p>
                  
                  {selectedReport.imageUrl && (
                    <>
                      <h3 className="font-medium mb-1">Submitted Image</h3>
                      <div className="border rounded-md overflow-hidden">
                        <img 
                          src={selectedReport.imageUrl} 
                          alt="Reported product"
                          className="w-full h-40 object-cover" 
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <h3 className="font-medium mb-3">Update Report Status</h3>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant={selectedReport.status === 'pending' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleUpdateStatus('pending')}
                  >
                    Mark as Pending
                  </Button>
                  <Button
                    variant={selectedReport.status === 'reviewed' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleUpdateStatus('reviewed')}
                  >
                    Mark as Reviewed
                  </Button>
                  <Button
                    variant={selectedReport.status === 'resolved' ? 'default' : 'outline'}
                    size="sm"
                    className="text-green-700"
                    onClick={() => handleUpdateStatus('resolved')}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Mark as Resolved
                  </Button>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default AdminReports;
