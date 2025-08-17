'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { clsx } from 'clsx'
import { useAdminI18n } from '../../../lib/i18n/admin-context'
import { FileText, Check, X, Eye, Search, Filter, Calendar, User, CreditCard, Clock, AlertTriangle } from 'lucide-react'

interface PaymentSlip {
  id: string
  bookingId: string
  fileName: string
  filePath: string
  fileSize: number
  mimeType: string
  uploadedAt: string
  verifiedAt?: string
  verifiedBy?: string
  status: 'PENDING' | 'VERIFIED' | 'REJECTED'
  adminNotes?: string
  booking: {
    id: string
    customerFirstName: string
    customerLastName: string
    customerEmail: string
    totalAmount: number
    bookingDate: string
    cart: {
      name: string
    }
  }
}

export default function PaymentSlipsPage() {
  const { t } = useAdminI18n()
  const [paymentSlips, setPaymentSlips] = useState<PaymentSlip[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedSlip, setSelectedSlip] = useState<PaymentSlip | null>(null)
  const [verificationNotes, setVerificationNotes] = useState('')
  const [verifying, setVerifying] = useState(false)
  const itemsPerPage = 10

  // Fetch payment slips
  const fetchPaymentSlips = async () => {
    try {
      const params = new URLSearchParams({
        status: statusFilter !== 'all' ? statusFilter : '',
        page: currentPage.toString(),
        limit: itemsPerPage.toString()
      })

      const response = await fetch(`/api/payment-slips?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setPaymentSlips(data.paymentSlips)
        setTotalPages(data.totalPages)
      }
    } catch (error) {
      console.error('Error fetching payment slips:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPaymentSlips()
  }, [statusFilter, currentPage])

  // Filter slips by search term
  const filteredSlips = paymentSlips.filter(slip => 
    slip.booking.customerFirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    slip.booking.customerLastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    slip.booking.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    slip.booking.cart.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Handle verification
  const handleVerification = async (slipId: string, action: 'verify' | 'reject') => {
    setVerifying(true)
    try {
      const response = await fetch(`/api/payment-slips/${slipId}/verify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          adminNotes: verificationNotes || undefined,
          verifiedBy: 'admin' // In a real app, this would be the admin user ID
        })
      })

      const data = await response.json()
      
      if (data.success) {
        alert(data.message)
        setSelectedSlip(null)
        setVerificationNotes('')
        fetchPaymentSlips() // Refresh the list
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error('Error verifying payment slip:', error)
      alert(`Failed to ${action} payment slip: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setVerifying(false)
    }
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED': return 'text-green-400 bg-green-500/20'
      case 'REJECTED': return 'text-red-400 bg-red-500/20'
      case 'PENDING': return 'text-yellow-400 bg-yellow-500/20'
      default: return 'text-gray-400 bg-gray-500/20'
    }
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'VERIFIED', label: 'Verified' },
    { value: 'REJECTED', label: 'Rejected' }
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading payment slips...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Payment Slip Verification
          </h1>
          <p className="text-gray-400">
            Review and verify customer payment slips for bank transfers
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-slate-700/50 backdrop-blur-sm border-slate-600">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search customers, emails, carts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-white pl-10"
              />
            </div>
            <div>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={statusOptions}
                className="text-white"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">
                {filteredSlips.length} of {paymentSlips.length} slips
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Slips List */}
      <Card className="bg-slate-700/50 backdrop-blur-sm border-slate-600">
        <CardHeader>
          <CardTitle className="text-white">Payment Slips</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredSlips.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Payment Slips Found</h3>
              <p className="text-gray-400">
                {paymentSlips.length === 0 
                  ? "No payment slips have been uploaded yet."
                  : "No slips match your current filters."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSlips.map((slip) => (
                <div
                  key={slip.id}
                  className="bg-slate-600/50 rounded-lg p-4 border border-slate-500/50 hover:border-slate-400/50 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-1">
                          <h3 className="font-semibold text-white">
                            {slip.booking.customerFirstName} {slip.booking.customerLastName}
                          </h3>
                          <span className={clsx(
                            'px-2 py-1 rounded-full text-xs font-medium',
                            getStatusColor(slip.status)
                          )}>
                            {slip.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm text-gray-300">
                          <div className="flex items-center space-x-1">
                            <User className="w-3 h-3" />
                            <span>{slip.booking.customerEmail}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <CreditCard className="w-3 h-3" />
                            <span>€{slip.booking.totalAmount.toFixed(2)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(slip.booking.bookingDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(slip.uploadedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="mt-1 text-xs text-gray-400">
                          {slip.booking.cart.name} • {slip.fileName} ({formatFileSize(slip.fileSize)})
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedSlip(slip)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Review
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-600">
              <p className="text-sm text-gray-400">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Slip Review Modal */}
      {selectedSlip && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-600">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Payment Slip Review</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedSlip(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Booking Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-3">Booking Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Customer:</span>
                      <span className="text-white">{selectedSlip.booking.customerFirstName} {selectedSlip.booking.customerLastName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Email:</span>
                      <span className="text-white">{selectedSlip.booking.customerEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Amount:</span>
                      <span className="text-white font-semibold">€{selectedSlip.booking.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Booking Date:</span>
                      <span className="text-white">{new Date(selectedSlip.booking.bookingDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Cart:</span>
                      <span className="text-white">{selectedSlip.booking.cart.name}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-3">File Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">File Name:</span>
                      <span className="text-white">{selectedSlip.fileName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">File Size:</span>
                      <span className="text-white">{formatFileSize(selectedSlip.fileSize)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">File Type:</span>
                      <span className="text-white">{selectedSlip.mimeType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Uploaded:</span>
                      <span className="text-white">{new Date(selectedSlip.uploadedAt).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span className={clsx('px-2 py-1 rounded text-xs font-medium', getStatusColor(selectedSlip.status))}>
                        {selectedSlip.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Slip Image/PDF */}
              <div className="bg-slate-700/50 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-3">Payment Slip</h3>
                <div className="flex justify-center">
                  {selectedSlip.mimeType.startsWith('image/') ? (
                    <img
                      src={selectedSlip.filePath}
                      alt="Payment Slip"
                      className="max-w-full max-h-96 rounded-lg border border-slate-600"
                    />
                  ) : selectedSlip.mimeType === 'application/pdf' ? (
                    <div className="text-center p-8">
                      <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-300 mb-4">PDF Document</p>
                      <Button
                        variant="outline"
                        onClick={() => window.open(selectedSlip.filePath, '_blank')}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Open PDF
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center p-8">
                      <AlertTriangle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                      <p className="text-gray-300">Unsupported file type</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Verification Actions (only if pending) */}
              {selectedSlip.status === 'PENDING' && (
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-3">Verification</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Admin Notes (Optional)
                      </label>
                      <textarea
                        value={verificationNotes}
                        onChange={(e) => setVerificationNotes(e.target.value)}
                        placeholder="Add any notes about this payment verification..."
                        rows={3}
                        className="w-full px-4 py-3 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>
                    <div className="flex space-x-4">
                      <Button
                        onClick={() => handleVerification(selectedSlip.id, 'verify')}
                        disabled={verifying}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {verifying ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                        ) : (
                          <Check className="w-4 h-4 mr-2" />
                        )}
                        Verify & Approve
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleVerification(selectedSlip.id, 'reject')}
                        disabled={verifying}
                        className="border-red-500 text-red-400 hover:bg-red-500/20"
                      >
                        {verifying ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-400 border-t-transparent mr-2"></div>
                        ) : (
                          <X className="w-4 h-4 mr-2" />
                        )}
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Previous Verification Info */}
              {selectedSlip.status !== 'PENDING' && (
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-3">Verification History</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Verified By:</span>
                      <span className="text-white">{selectedSlip.verifiedBy || 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Verified At:</span>
                      <span className="text-white">
                        {selectedSlip.verifiedAt ? new Date(selectedSlip.verifiedAt).toLocaleString() : 'N/A'}
                      </span>
                    </div>
                    {selectedSlip.adminNotes && (
                      <div>
                        <span className="text-gray-400 block mb-1">Admin Notes:</span>
                        <p className="text-white bg-slate-600 p-2 rounded">{selectedSlip.adminNotes}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}