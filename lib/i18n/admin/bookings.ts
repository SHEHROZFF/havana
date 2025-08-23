// Bookings-specific translations - ONLY what appears in the actual bookings page
export const bookingsTranslations = {
  el: {
    // Main header
    bookings_management: 'Διαχείριση Κρατήσεων',
    manage_customer_bookings: 'Διαχείριση όλων των κρατήσεων και των κρατήσεων πελατών',
    new_booking: 'Νέα Κράτηση',
    
    // Search and filters
    search_bookings: 'Αναζήτηση κρατήσεων...',
    all_statuses: 'Όλες οι Καταστάσεις',
    pending: 'Σε Αναμονή',
    confirmed: 'Επιβεβαιωμένη',
    completed: 'Ολοκληρωμένη',
    cancelled: 'Ακυρωμένη',
    
    // Bookings list
    all_bookings_count: 'Όλες οι Κρατήσεις ({count})',
    no_bookings_found: 'Δεν βρέθηκαν κρατήσεις',
    try_adjusting_search: 'Δοκιμάστε να προσαρμόσετε τα κριτήρια αναζήτησης ή προσθέστε μια νέα κράτηση.',
    
    // Booking details sections
    event_details: 'Λεπτομέρειες Εκδήλωσης',
    guests: 'καλεσμένοι',
    date_time: 'Ημερομηνία & Ώρα',
    total_amount: 'Συνολικό Ποσό',
    booked_on: 'Κράτηση στις {date}',
    
    // Action buttons
    confirm: '✓ Επιβεβαίωση',
    cancel: '✕ Ακύρωση',
    complete: '✓ Ολοκλήρωση',
    view_details: '👁 Προβολή Λεπτομερειών',
    
    // Pagination
    previous: 'Προηγούμενο',
    next: 'Επόμενο',
    page_of: 'Σελίδα {current} από {total}',
    showing_results: 'Εμφάνιση {start}-{end} από {total} αποτελέσματα',
    
    // Loading and fallbacks
    loading: 'Φόρτωση...',
    unknown: 'Άγνωστο',
    
    // Payment methods
    bank_transfer: 'Τραπεζικό Έμβασμα',
    paypal: 'PayPal',
    reservation: 'Κράτηση',
    
    // Payment slip status
    verified: 'Επιβεβαιωμένο',
    
    // Admin Modal translations
    admin_success: 'Επιτυχία',
    admin_error: 'Σφάλμα', 
    admin_warning: 'Προειδοποίηση',
    admin_info: 'Πληροφορία',
    close: 'Κλείσιμο',
    payment_slip_verified: 'Το παραστατικό πληρωμής επιβεβαιώθηκε επιτυχώς',
    payment_slip_rejected: 'Το παραστατικό πληρωμής απορρίφθηκε',
    booking_status_updated: 'Η κατάσταση της κράτησης ενημερώθηκε',
    booking_cancelled: 'Η κράτηση ακυρώθηκε επιτυχώς',
    rejected: 'Απορρίφθηκε',
    no_slip: 'Χωρίς Απόδειξη',
    
    // Booking details labels
    cart: 'Καλάθι',
    event_date: 'Ημερομηνία Εκδήλωσης',
    admin_total: 'Σύνολο',
    admin_view_details: 'Προβολή Λεπτομερειών',
    edit_status: 'Επεξεργασία Κατάστασης',
    hide_details: 'Απόκρυψη Λεπτομερειών',
    created_at: 'Δημιουργήθηκε στις',
    updated_at: 'Ενημερώθηκε στις',
    
    // Multi-date booking details
    date: 'Ημερομηνία',
    time: 'Ώρα',
    duration: 'Διάρκεια',
    cost: 'Κόστος',
    
    // Customer information section
    customer_information: 'Στοιχεία Πελάτη',
    full_name: 'Πλήρες Όνομα',
    email: 'Email',
    phone: 'Τηλέφωνο',
    address: 'Διεύθυνση',
    city: 'Πόλη',
    state: 'Νομός',
    zip: 'Ταχυδρομικός Κώδικας',
    country: 'Χώρα',
    
    // Payment information section
    payment_information: 'Στοιχεία Πληρωμής',
    payment_method: 'Μέθοδος Πληρωμής',
    transaction_id: 'ID Συναλλαγής',
    cart_service: 'Υπηρεσία Καλαθιού',
    admin_food_items: 'Είδη Φαγητού',
    admin_additional_services: 'Πρόσθετες Υπηρεσίες',
    shipping: 'Αποστολή',
    admin_total_amount: 'Συνολικό Ποσό',
    
    // Delivery information section
    delivery_information: 'Στοιχεία Παράδοσης',
    delivery_method: 'Μέθοδος Παράδοσης',
    customer_pickup_location: 'Ο πελάτης θα παραλάβει το καλάθι από την τοποθεσία μας',
    
    // Event details section
    selected_cart: 'Επιλεγμένο Καλάθι',
    event_type: 'Τύπος Εκδήλωσης',
    guest_count: 'Αριθμός Καλεσμένων',
    timing_type: 'Τύπος Χρονοδιάγραμματος',
    custom_times: 'Προσαρμοσμένες Ώρες',
    preset_slots: 'Προκαθορισμένες Ώρες',
    slot_type: 'Τύπος Slot',
    special_notes: 'Ειδικές Σημειώσεις',
    
    // Food items and services sections
    food_items_ordered: 'Είδη Φαγητού που Παραγγέλθηκαν',
    unknown_category: 'Άγνωστη Κατηγορία',
    quantity: 'Ποσότητα',
    no_food_items_ordered: 'Δεν παραγγέλθηκαν είδη φαγητού',
    no_additional_services_ordered: 'Δεν παραγγέλθηκαν πρόσθετες υπηρεσίες',
    hours: 'Ώρες',
    
    // Technical information section
    technical_information: 'Τεχνικές Πληροφορίες',
    system_details: 'Στοιχεία Συστήματος',
    booking_id: 'ID Κράτησης',
    cart_id: 'ID Καλαθιού',
    user_id: 'ID Χρήστη',
    booking_settings: 'Ρυθμίσεις Κράτησης',
    custom_timing: 'Προσαρμοσμένη Ώρα',
    multi_day: 'Πολλαπλές Ημέρες',
    total_dates: 'Συνολικές Ημερομηνίες',
    timestamps: 'Χρονικές Σφραγίδες',
    created: 'Δημιουργήθηκε',
    last_updated: 'Τελευταία Ενημέρωση',
    yes: 'Ναι',
    no: 'Όχι',
    
    // Bank transfer payment slip section
    bank_transfer_payment_slip: 'Απόδειξη Πληρωμής Τραπεζικού Εμβάσματος',
    file_name: 'Όνομα Αρχείου',
    file_size: 'Μέγεθος Αρχείου',
    uploaded: 'Ανέβηκε',
    status: 'Κατάσταση',
    verified_at: 'Επιβεβαιώθηκε στις',
    payment_receipt_link: 'Σύνδεσμος Απόδειξης Πληρωμής',
    customer_provided_payment_receipt_link: 'Ο πελάτης παρείχε σύνδεσμο απόδειξης πληρωμής',
    view_receipt: 'Προβολή Απόδειξης',
    payment_slip: 'Απόδειξη Πληρωμής',
    pdf_document: 'Έγγραφο PDF',
    open_pdf: 'Άνοιγμα PDF',
    unsupported_file_type: 'Μη υποστηριζόμενος τύπος αρχείου',
    verify_payment_slip: 'Επιβεβαίωση Απόδειξης Πληρωμής',
    admin_notes_optional: 'Σημειώσεις Διαχειριστή (Προαιρετικό)',
    add_payment_verification_notes: 'Προσθέστε σημειώσεις για αυτήν την επιβεβαίωση πληρωμής...',
    verify_approve: 'Επιβεβαίωση & Έγκριση',
    reject: 'Απόρριψη',
    admin_notes: 'Σημειώσεις Διαχειριστή',
    no_payment_slip_uploaded: 'Δεν Ανέβηκε Απόδειξη Πληρωμής',
    customer_bank_transfer_no_slip: 'Ο πελάτης έχει επιλέξει τραπεζικό έμβασμα αλλά δεν έχει ανεβάσει ακόμη απόδειξη πληρωμής.',
    
    // Quick actions section
    quick_actions: 'Γρήγορες Ενέργειες',
    confirm_booking: 'Επιβεβαίωση Κράτησης',
    cancel_booking: 'Ακύρωση Κράτησης',
    mark_as_completed: 'Σήμανση ως Ολοκληρωμένη',
    contact_customer: 'Επικοινωνία με Πελάτη',
  },
  
  en: {
    // Main header
    bookings_management: 'Bookings Management',
    manage_customer_bookings: 'Manage all customer bookings and reservations',
    new_booking: 'New Booking',
    
    // Search and filters
    search_bookings: 'Search bookings...',
    all_statuses: 'All Statuses',
    pending: 'Pending',
    confirmed: 'Confirmed',
    completed: 'Completed',
    cancelled: 'Cancelled',
    
    // Bookings list
    all_bookings_count: 'All Bookings ({count})',
    no_bookings_found: 'No bookings found',
    try_adjusting_search: 'Try adjusting your search criteria or add a new booking.',
    
    // Booking details sections
    event_details: 'Event Details',
    guests: 'guests',
    date_time: 'Date & Time',
    total_amount: 'Total Amount',
    booked_on: 'Booked on {date}',
    
    // Action buttons
    confirm: '✓ Confirm',
    cancel: '✕ Cancel',
    complete: '✓ Complete',
    view_details: '👁 View Details',
    
    // Pagination
    previous: 'Previous',
    next: 'Next',
    page_of: 'Page {current} of {total}',
    showing_results: 'Showing {start}-{end} of {total} results',
    
    // Loading and fallbacks
    loading: 'Loading...',
    unknown: 'Unknown',
    
    // Payment methods
    bank_transfer: 'Bank Transfer',
    paypal: 'PayPal',
    reservation: 'Reservation',
    
    // Payment slip status
    verified: 'Verified',
    
    // Admin Modal translations
    admin_success: 'Success',
    admin_error: 'Error',
    admin_warning: 'Warning',
    admin_info: 'Information',
    close: 'Close',
    payment_slip_verified: 'Payment slip has been verified successfully',
    payment_slip_rejected: 'Payment slip has been rejected',
    booking_status_updated: 'Booking status has been updated',
    booking_cancelled: 'Booking has been cancelled successfully',
    rejected: 'Rejected',
    no_slip: 'No Slip',
    
    // Booking details labels
    cart: 'Cart',
    event_date: 'Event Date',
    admin_total: 'Total',
    admin_view_details: 'View Details',
    edit_status: 'Edit Status',
    hide_details: 'Hide Details',
    created_at: 'Created At',
    updated_at: 'Updated At',
    
    // Multi-date booking details
    date: 'Date',
    time: 'Time',
    duration: 'Duration',
    cost: 'Cost',
    
    // Customer information section
    customer_information: 'Customer Information',
    full_name: 'Full Name',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    city: 'City',
    state: 'State',
    zip: 'Zip',
    country: 'Country',
    
    // Payment information section
    payment_information: 'Payment Information',
    payment_method: 'Payment Method',
    transaction_id: 'Transaction ID',
    cart_service: 'Cart Service',
    admin_food_items: 'Food Items',
    admin_additional_services: 'Additional Services',
    shipping: 'Shipping',
    admin_total_amount: 'Total Amount',
    
    // Delivery information section
    delivery_information: 'Delivery Information',
    delivery_method: 'Delivery Method',
    customer_pickup_location: 'Customer will pick up the cart from our location',
    
    // Event details section
    selected_cart: 'Selected Cart',
    event_type: 'Event Type',
    guest_count: 'Guest Count',
    timing_type: 'Timing Type',
    custom_times: 'Custom Times',
    preset_slots: 'Preset Slots',
    slot_type: 'Slot Type',
    special_notes: 'Special Notes',
    
    // Food items and services sections
    food_items_ordered: 'Food Items Ordered',
    unknown_category: 'Unknown Category',
    quantity: 'Quantity',
    no_food_items_ordered: 'No food items ordered',
    no_additional_services_ordered: 'No additional services ordered',
    hours: 'Hours',
    
    // Technical information section
    technical_information: 'Technical Information',
    system_details: 'System Details',
    booking_id: 'Booking ID',
    cart_id: 'Cart ID',
    user_id: 'User ID',
    booking_settings: 'Booking Settings',
    custom_timing: 'Custom Timing',
    multi_day: 'Multi-Day',
    total_dates: 'Total Dates',
    timestamps: 'Timestamps',
    created: 'Created',
    last_updated: 'Last Updated',
    yes: 'Yes',
    no: 'No',
    
    // Bank transfer payment slip section
    bank_transfer_payment_slip: 'Bank Transfer Payment Slip',
    file_name: 'File Name',
    file_size: 'File Size',
    uploaded: 'Uploaded',
    status: 'Status',
    verified_at: 'Verified At',
    payment_receipt_link: 'Payment Receipt Link',
    customer_provided_payment_receipt_link: 'Customer provided payment receipt link',
    view_receipt: 'View Receipt',
    payment_slip: 'Payment Slip',
    pdf_document: 'PDF Document',
    open_pdf: 'Open PDF',
    unsupported_file_type: 'Unsupported file type',
    verify_payment_slip: 'Verify Payment Slip',
    admin_notes_optional: 'Admin Notes (Optional)',
    add_payment_verification_notes: 'Add any notes about this payment verification...',
    verify_approve: 'Verify & Approve',
    reject: 'Reject',
    admin_notes: 'Admin Notes',
    no_payment_slip_uploaded: 'No Payment Slip Uploaded',
    customer_bank_transfer_no_slip: 'Customer has selected bank transfer but hasn\'t uploaded a payment slip yet.',
    
    // Quick actions section
    quick_actions: 'Quick Actions',
    confirm_booking: 'Confirm Booking',
    cancel_booking: 'Cancel Booking',
    mark_as_completed: 'Mark as Completed',
    contact_customer: 'Contact Customer',
  }
}