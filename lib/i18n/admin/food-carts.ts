// Food carts-specific translations - ONLY what appears in the actual food carts page
export const foodCartsTranslations = {
  el: {
    // Main header
    food_carts_management: 'Διαχείριση Κάρτ Φαγητού',
    manage_food_cart_fleet: 'Διαχείριση του στόλου κάρτ φαγητού και των επιλογών ενοικίασης',
    failed_to_load_food_carts: 'Αποτυχία φόρτωσης κάρτ φαγητού',
    refresh: '🔄 Ανανέωση',
    add_new_cart: 'Προσθήκη Νέου Κάρτ',
    
    // Loading state
    loading_food_carts: 'Φόρτωση κάρτ φαγητού...',
    
    // Create form
    add_new_food_cart: 'Προσθήκη Νέου Κάρτ Φαγητού',
    cart_name: 'Όνομα Κάρτ',
    cart_name_placeholder: 'π.χ., Havana Street Tacos',
    description: 'Περιγραφή',
    description_placeholder: 'Περιγράψτε το κάρτ φαγητού σας...',
    location: 'Τοποθεσία',
    location_placeholder: 'π.χ., Αθήνα, Θεσσαλονίκη, Κινητή Υπηρεσία',
    
    // Pricing fields
    base_price_label: 'Βασική Τιμή (έως 4 ώρες) (€)',
    base_price_placeholder: '600',
    base_price_helper: 'Σταθερή τιμή για κρατήσεις έως 4 ώρες',
    extra_hour_price_label: 'Τιμή Επιπλέον Ώρας (€)',
    extra_hour_price_placeholder: '50',
    extra_hour_price_helper: 'Τιμή ανά ώρα πέρα από 4 ώρες',
    shipping_price_label: 'Τιμή Αποστολής (€)',
    shipping_price_placeholder: '100',
    shipping_price_helper: 'Κόστος παράδοσης στην τοποθεσία του πελάτη',
    food_serving_capacity: 'Ικανότητα Εξυπηρέτησης Φαγητού',
    capacity_placeholder: '50',
    capacity_helper: 'Σε πόσα άτομα μπορεί να σερβίρει φαγητό αυτό το κάρτ',
    
    // Image and delivery options
    image_url_optional: 'URL Εικόνας (προαιρετικό)',
    image_placeholder: 'https://...',
    delivery_options: 'Επιλογές Παράδοσης',
    pickup_available: 'Διαθέσιμη Παραλαβή',
    shipping_available: 'Διαθέσιμη Αποστολή',
    
    // Form buttons
    cancel: 'Ακύρωση',
    create_cart: 'Δημιουργία Κάρτ',
    creating: 'Δημιουργία...',
    update_cart: 'Ενημέρωση Κάρτ',
    updating: 'Ενημέρωση...',
    
    // Empty state
    no_food_carts_yet: 'Δεν Υπάρχουν Κάρτ Φαγητού Ακόμα',
    start_by_adding_first_cart: 'Ξεκινήστε προσθέτοντας το πρώτο σας κάρτ φαγητού για να αρχίσετε να δέχεστε κρατήσεις.',
    add_your_first_cart: 'Προσθέστε το Πρώτο σας Κάρτ',
    
    // Cart card details
    active: 'Ενεργό',
    inactive: 'Ανενεργό',
    base_price_display: 'Βασική Τιμή (≤4ώρες):',
    extra_hour_price_display: 'Τιμή Επιπλέον Ώρας:',
    shipping_price_display: 'Τιμή Αποστολής:',
    delivery_options_display: 'Επιλογές Παράδοσης:',
    pickup_and_shipping: 'Παραλαβή & Αποστολή',
    pickup_only: 'Μόνο Παραλαβή',
    shipping_only: 'Μόνο Αποστολή',
    none: 'Καμία',
    serves: 'Σερβίρει:',
    up_to_people: 'Έως {count} άτομα',
    
    // Action buttons
    edit: '✏️ Επεξεργασία',
    deactivate: '🔴 Απενεργοποίηση',
    activate: '🟢 Ενεργοποίηση',
    delete_confirm: 'Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το κάρτ φαγητού;',
  },
  
  en: {
    // Main header
    food_carts_management: 'Food Carts Management',
    manage_food_cart_fleet: 'Manage your food cart fleet and rental options',
    failed_to_load_food_carts: 'Failed to load food carts',
    refresh: '🔄 Refresh',
    add_new_cart: 'Add New Cart',
    
    // Loading state
    loading_food_carts: 'Loading food carts...',
    
    // Create form
    add_new_food_cart: 'Add New Food Cart',
    cart_name: 'Cart Name',
    cart_name_placeholder: 'e.g., Havana Street Tacos',
    description: 'Description',
    description_placeholder: 'Describe your food cart...',
    location: 'Location',
    location_placeholder: 'e.g., Athens, Thessaloniki, Mobile Service',
    
    // Pricing fields
    base_price_label: 'Base Price (up to 4hrs) (€)',
    base_price_placeholder: '600',
    base_price_helper: 'Fixed price for bookings up to 4 hours',
    extra_hour_price_label: 'Extra Hour Price (€)',
    extra_hour_price_placeholder: '50',
    extra_hour_price_helper: 'Price per hour beyond 4 hours',
    shipping_price_label: 'Shipping Price (€)',
    shipping_price_placeholder: '100',
    shipping_price_helper: 'Delivery cost to customer location',
    food_serving_capacity: 'Food Serving Capacity',
    capacity_placeholder: '50',
    capacity_helper: 'How many people can this cart serve food to',
    
    // Image and delivery options
    image_url_optional: 'Image URL (optional)',
    image_placeholder: 'https://...',
    delivery_options: 'Delivery Options',
    pickup_available: 'Pickup Available',
    shipping_available: 'Shipping Available',
    
    // Form buttons
    cancel: 'Cancel',
    create_cart: 'Create Cart',
    creating: 'Creating...',
    update_cart: 'Update Cart',
    updating: 'Updating...',
    
    // Empty state
    no_food_carts_yet: 'No Food Carts Yet',
    start_by_adding_first_cart: 'Start by adding your first food cart to begin accepting bookings.',
    add_your_first_cart: 'Add Your First Cart',
    
    // Cart card details
    active: 'Active',
    inactive: 'Inactive',
    base_price_display: 'Base Price (≤4hrs):',
    extra_hour_price_display: 'Extra Hour Price:',
    shipping_price_display: 'Shipping Price:',
    delivery_options_display: 'Delivery Options:',
    pickup_and_shipping: 'Pickup & Shipping',
    pickup_only: 'Pickup Only',
    shipping_only: 'Shipping Only',
    none: 'None',
    serves: 'Serves:',
    up_to_people: 'Up to {count} people',
    
    // Action buttons
    edit: '✏️ Edit',
    deactivate: '🔴 Deactivate',
    activate: '🟢 Activate',
    delete_confirm: 'Are you sure you want to delete this food cart?',
  }
}