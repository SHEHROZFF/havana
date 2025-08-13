export type FoodItemsTranslationKey = 
  // Page header
  | 'food_items_management'
  | 'manage_menu_items'
  
  // Buttons and actions
  | 'add_food_item'
  | 'create_item'
  | 'creating'
  | 'edit'
  | 'update_item'
  | 'updating'
  | 'cancel'
  | 'activate'
  | 'deactivate'
  | 'delete'
  | 'deleting'
  
  // Form fields
  | 'item_name'
  | 'item_name_placeholder'
  | 'category'
  | 'category_placeholder'
  | 'description'
  | 'description_placeholder'
  | 'price'
  | 'price_placeholder'
  | 'price_helper'
  | 'image_url_optional'
  | 'image_placeholder'
  | 'food_cart'
  | 'select_cart'
  | 'availability'
  | 'available'
  | 'unavailable'
  
  // Card labels
  | 'price_label'
  | 'category_label'
  | 'cart_label'
  
  // Filters
  | 'filter_by_category'
  | 'all_categories'
  | 'filter_by_cart'
  | 'all_carts'
  
  // Status
  | 'loading'
  | 'error_loading_data'
  | 'error_creating_item'
  | 'error_updating_item'
  | 'error_deleting_item'
  
  // Empty state
  | 'no_food_items_yet'
  | 'start_by_adding_items'
  | 'add_your_first_item'
  
  // Confirmation
  | 'confirm_delete_item'
  | 'delete_item_warning'

export const foodItemsTranslations = {
  el: {
    // Page header
    food_items_management: 'Διαχείριση Αντικειμένων Φαγητού',
    manage_menu_items: 'Διαχειριστείτε τα στοιχεία του μενού για κάθε κάρτ φαγητού',
    
    // Buttons and actions
    add_food_item: 'Προσθήκη Αντικειμένου Φαγητού',
    create_item: 'Δημιουργία Αντικειμένου',
    creating: 'Δημιουργία...',
    edit: 'Επεξεργασία',
    update_item: 'Ενημέρωση Αντικειμένου',
    updating: 'Ενημέρωση...',
    cancel: 'Ακύρωση',
    activate: 'Ενεργοποίηση',
    deactivate: 'Απενεργοποίηση',
    delete: 'Διαγραφή',
    deleting: 'Διαγραφή...',
    
    // Form fields
    item_name: 'Όνομα Αντικειμένου',
    item_name_placeholder: 'π.χ., Κουβανέζικο Σάντουιτς',
    category: 'Κατηγορία',
    category_placeholder: 'π.χ., Κύρια Πιάτα, Ορεκτικά',
    description: 'Περιγραφή',
    description_placeholder: 'Περιγράψτε το αντικείμενο φαγητού...',
    price: 'Τιμή',
    price_placeholder: '0.00',
    price_helper: 'Τιμή σε ευρώ (€)',
    image_url_optional: 'URL Εικόνας (Προαιρετικό)',
    image_placeholder: 'https://...',
    food_cart: 'Κάρτ Φαγητού',
    select_cart: 'Επιλέξτε κάρτ',
    availability: 'Διαθεσιμότητα',
    available: 'Διαθέσιμο',
    unavailable: 'Μη Διαθέσιμο',
    
    // Card labels
    price_label: 'Τιμή:',
    category_label: 'Κατηγορία:',
    cart_label: 'Κάρτ:',
    
    // Filters
    filter_by_category: 'Φιλτράρισμα κατά κατηγορία',
    all_categories: 'Όλες οι Κατηγορίες',
    filter_by_cart: 'Φιλτράρισμα κατά κάρτ',
    all_carts: 'Όλα τα Κάρτ',
    
    // Status
    loading: 'Φόρτωση...',
    error_loading_data: 'Σφάλμα φόρτωσης δεδομένων',
    error_creating_item: 'Σφάλμα δημιουργίας αντικειμένου',
    error_updating_item: 'Σφάλμα ενημέρωσης αντικειμένου',
    error_deleting_item: 'Σφάλμα διαγραφής αντικειμένου',
    
    // Empty state
    no_food_items_yet: 'Δεν Υπάρχουν Αντικείμενα Φαγητού Ακόμα',
    start_by_adding_items: 'Ξεκινήστε προσθέτοντας στοιχεία μενού στα κάρτ φαγητού σας.',
    add_your_first_item: 'Προσθέστε το Πρώτο σας Αντικείμενο',
    
    // Confirmation
    confirm_delete_item: 'Επιβεβαίωση Διαγραφής Αντικειμένου',
    delete_item_warning: 'Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το αντικείμενο φαγητού; Αυτή η ενέργεια δεν μπορεί να αναιρεθεί.',
  },
  en: {
    // Page header
    food_items_management: 'Food Items Management',
    manage_menu_items: 'Manage menu items for each food cart',
    
    // Buttons and actions
    add_food_item: 'Add Food Item',
    create_item: 'Create Item',
    creating: 'Creating...',
    edit: 'Edit',
    update_item: 'Update Item',
    updating: 'Updating...',
    cancel: 'Cancel',
    activate: 'Activate',
    deactivate: 'Deactivate',
    delete: 'Delete',
    deleting: 'Deleting...',
    
    // Form fields
    item_name: 'Item Name',
    item_name_placeholder: 'e.g., Cuban Sandwich',
    category: 'Category',
    category_placeholder: 'e.g., Main Dishes, Appetizers',
    description: 'Description',
    description_placeholder: 'Describe the food item...',
    price: 'Price',
    price_placeholder: '0.00',
    price_helper: 'Price in euros (€)',
    image_url_optional: 'Image URL (Optional)',
    image_placeholder: 'https://...',
    food_cart: 'Food Cart',
    select_cart: 'Select a cart',
    availability: 'Availability',
    available: 'Available',
    unavailable: 'Unavailable',
    
    // Card labels
    price_label: 'Price:',
    category_label: 'Category:',
    cart_label: 'Cart:',
    
    // Filters
    filter_by_category: 'Filter by category',
    all_categories: 'All Categories',
    filter_by_cart: 'Filter by cart',
    all_carts: 'All Carts',
    
    // Status
    loading: 'Loading...',
    error_loading_data: 'Error loading data',
    error_creating_item: 'Error creating item',
    error_updating_item: 'Error updating item',
    error_deleting_item: 'Error deleting item',
    
    // Empty state
    no_food_items_yet: 'No Food Items Yet',
    start_by_adding_items: 'Start by adding menu items to your food carts.',
    add_your_first_item: 'Add Your First Item',
    
    // Confirmation
    confirm_delete_item: 'Confirm Delete Item',
    delete_item_warning: 'Are you sure you want to delete this food item? This action cannot be undone.',
  }
}