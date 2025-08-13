export type ServicesTranslationKey = 
  // Page header
  | 'services_management'
  | 'manage_services_description'
  
  // Buttons and actions
  | 'add_service'
  | 'create_service'
  | 'creating'
  | 'edit'
  | 'update_service'
  | 'updating'
  | 'cancel'
  | 'activate'
  | 'deactivate'
  | 'delete'
  | 'deleting'
  
  // Form fields
  | 'service_name'
  | 'service_name_placeholder'
  | 'service_category'
  | 'select_category'
  | 'description'
  | 'description_placeholder'
  | 'price_per_hour'
  | 'price_per_hour_placeholder'
  | 'price_per_hour_helper'
  | 'assign_to_cart'
  | 'select_cart_optional'
  | 'global_service'
  | 'availability'
  | 'available'
  | 'unavailable'
  
  // Service categories
  | 'staff_category'
  | 'kitchen_category'
  | 'support_category'
  | 'management_category'
  | 'special_category'
  | 'staff_description'
  | 'kitchen_description'
  | 'support_description'
  | 'management_description'
  | 'special_description'
  
  // Filters
  | 'filter_by_category'
  | 'all_categories'
  
  // Card labels
  | 'price_label'
  | 'category_label'
  | 'cart_label'
  | 'global_service_label'
  
  // Status
  | 'loading'
  | 'error_loading_data'
  | 'error_creating_service'
  | 'error_updating_service'
  | 'error_deleting_service'
  
  // Stats
  | 'total_services'
  | 'active_services'
  | 'staff_services'
  | 'avg_hourly_rate'
  
  // Empty state
  | 'no_services_yet'
  | 'start_by_adding_services'
  | 'add_your_first_service'
  
  // Confirmation
  | 'confirm_delete_service'
  | 'delete_service_warning'

export const servicesTranslations = {
  el: {
    // Page header
    services_management: 'Διαχείριση Υπηρεσιών',
    manage_services_description: 'Διαχειριστείτε το προσωπικό και τις υπηρεσίες για τα κάρτ φαγητού σας',
    
    // Buttons and actions
    add_service: 'Προσθήκη Υπηρεσίας',
    create_service: 'Δημιουργία Υπηρεσίας',
    creating: 'Δημιουργία...',
    edit: 'Επεξεργασία',
    update_service: 'Ενημέρωση Υπηρεσίας',
    updating: 'Ενημέρωση...',
    cancel: 'Ακύρωση',
    activate: 'Ενεργοποίηση',
    deactivate: 'Απενεργοποίηση',
    delete: 'Διαγραφή',
    deleting: 'Διαγραφή...',
    
    // Form fields
    service_name: 'Όνομα Υπηρεσίας',
    service_name_placeholder: 'π.χ., Σερβιτόρος, Μάγειρας',
    service_category: 'Κατηγορία Υπηρεσίας',
    select_category: 'Επιλέξτε κατηγορία',
    description: 'Περιγραφή',
    description_placeholder: 'Περιγράψτε την υπηρεσία...',
    price_per_hour: 'Τιμή ανά Ώρα',
    price_per_hour_placeholder: '15.00',
    price_per_hour_helper: 'Τιμή σε ευρώ (€) ανά ώρα',
    assign_to_cart: 'Ανάθεση σε Κάρτ',
    select_cart_optional: 'Επιλέξτε κάρτ (προαιρετικό)',
    global_service: 'Καθολική Υπηρεσία',
    availability: 'Διαθεσιμότητα',
    available: 'Διαθέσιμο',
    unavailable: 'Μη Διαθέσιμο',
    
    // Service categories
    staff_category: 'Προσωπικό',
    kitchen_category: 'Κουζίνα',
    support_category: 'Υποστήριξη',
    management_category: 'Διαχείριση',
    special_category: 'Ειδικές Υπηρεσίες',
    staff_description: 'Σερβιτόροι, Σερβιτόρες',
    kitchen_description: 'Μάγειρες, Κουζινιέρες',
    support_description: 'Εργαζόμενοι, Εγκατάσταση',
    management_description: 'Συντονιστές',
    special_description: 'Ειδικές Υπηρεσίες',
    
    // Filters
    filter_by_category: 'Φιλτράρισμα κατά κατηγορία',
    all_categories: 'Όλες οι Κατηγορίες',
    
    // Card labels
    price_label: 'Τιμή:',
    category_label: 'Κατηγορία:',
    cart_label: 'Κάρτ:',
    global_service_label: 'Καθολική',
    
    // Status
    loading: 'Φόρτωση...',
    error_loading_data: 'Σφάλμα φόρτωσης δεδομένων',
    error_creating_service: 'Σφάλμα δημιουργίας υπηρεσίας',
    error_updating_service: 'Σφάλμα ενημέρωσης υπηρεσίας',
    error_deleting_service: 'Σφάλμα διαγραφής υπηρεσίας',
    
    // Stats
    total_services: 'Συνολικές Υπηρεσίες',
    active_services: 'Ενεργές Υπηρεσίες',
    staff_services: 'Υπηρεσίες Προσωπικού',
    avg_hourly_rate: 'Μέση Ωριαία Αμοιβή',
    
    // Empty state
    no_services_yet: 'Δεν Υπάρχουν Υπηρεσίες Ακόμα',
    start_by_adding_services: 'Ξεκινήστε προσθέτοντας προσωπικό και υπηρεσίες για τα κάρτ φαγητού σας.',
    add_your_first_service: 'Προσθέστε την Πρώτη σας Υπηρεσία',
    
    // Confirmation
    confirm_delete_service: 'Επιβεβαίωση Διαγραφής Υπηρεσίας',
    delete_service_warning: 'Είστε σίγουροι ότι θέλετε να διαγράψετε αυτή την υπηρεσία; Αυτή η ενέργεια δεν μπορεί να αναιρεθεί.',
  },
  en: {
    // Page header
    services_management: 'Services Management',
    manage_services_description: 'Manage staff and services for your food carts',
    
    // Buttons and actions
    add_service: 'Add Service',
    create_service: 'Create Service',
    creating: 'Creating...',
    edit: 'Edit',
    update_service: 'Update Service',
    updating: 'Updating...',
    cancel: 'Cancel',
    activate: 'Activate',
    deactivate: 'Deactivate',
    delete: 'Delete',
    deleting: 'Deleting...',
    
    // Form fields
    service_name: 'Service Name',
    service_name_placeholder: 'e.g., Waiter, Chef',
    service_category: 'Service Category',
    select_category: 'Select a category',
    description: 'Description',
    description_placeholder: 'Describe the service...',
    price_per_hour: 'Price per Hour',
    price_per_hour_placeholder: '15.00',
    price_per_hour_helper: 'Price in euros (€) per hour',
    assign_to_cart: 'Assign to Cart',
    select_cart_optional: 'Select a cart (optional)',
    global_service: 'Global Service',
    availability: 'Availability',
    available: 'Available',
    unavailable: 'Unavailable',
    
    // Service categories
    staff_category: 'Staff',
    kitchen_category: 'Kitchen',
    support_category: 'Support',
    management_category: 'Management',
    special_category: 'Special Services',
    staff_description: 'Waiters, Servers',
    kitchen_description: 'Chefs, Cooks',
    support_description: 'Workers, Setup',
    management_description: 'Coordinators',
    special_description: 'Special Services',
    
    // Filters
    filter_by_category: 'Filter by category',
    all_categories: 'All Categories',
    
    // Card labels
    price_label: 'Price:',
    category_label: 'Category:',
    cart_label: 'Cart:',
    global_service_label: 'Global',
    
    // Status
    loading: 'Loading...',
    error_loading_data: 'Error loading data',
    error_creating_service: 'Error creating service',
    error_updating_service: 'Error updating service',
    error_deleting_service: 'Error deleting service',
    
    // Stats
    total_services: 'Total Services',
    active_services: 'Active Services',
    staff_services: 'Staff Services',
    avg_hourly_rate: 'Avg. Hourly Rate',
    
    // Empty state
    no_services_yet: 'No Services Yet',
    start_by_adding_services: 'Start by adding staff and services for your food carts.',
    add_your_first_service: 'Add Your First Service',
    
    // Confirmation
    confirm_delete_service: 'Confirm Delete Service',
    delete_service_warning: 'Are you sure you want to delete this service? This action cannot be undone.',
  }
}