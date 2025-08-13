export type PaymentsTranslationKey = 
  // Page header
  | 'payment_settings'
  | 'configure_paypal_description'
  
  // Form labels
  | 'paypal_server'
  | 'environment'
  | 'live_environment'
  | 'sandbox_environment'
  | 'client_id'
  | 'client_secret'
  | 'client_id_placeholder'
  | 'client_secret_placeholder'
  
  // Status and actions
  | 'last_updated'
  | 'no_settings_saved_yet'
  | 'save_settings'
  | 'saving'
  | 'loading'
  
  // Messages
  | 'payment_settings_saved'
  | 'failed_to_save_settings'

export const paymentsTranslations = {
  el: {
    // Page header
    payment_settings: 'Ρυθμίσεις Πληρωμών',
    configure_paypal_description: 'Διαμορφώστε τα στοιχεία PayPal που χρησιμοποιούνται για την ολοκλήρωση αγοράς.',
    
    // Form labels
    paypal_server: 'PayPal (Διακομιστής)',
    environment: 'Περιβάλλον',
    live_environment: 'Ζωντανό',
    sandbox_environment: 'Δοκιμαστικό',
    client_id: 'ID Πελάτη',
    client_secret: 'Μυστικό Πελάτη',
    client_id_placeholder: 'Επικολλήστε νέο ID Πελάτη για ενημέρωση',
    client_secret_placeholder: 'Επικολλήστε νέο Μυστικό Πελάτη για ενημέρωση',
    
    // Status and actions
    last_updated: 'Τελευταία ενημέρωση',
    no_settings_saved_yet: 'Δεν έχουν αποθηκευτεί ρυθμίσεις ακόμα',
    save_settings: 'Αποθήκευση Ρυθμίσεων',
    saving: 'Αποθήκευση...',
    loading: 'Φόρτωση...',
    
    // Messages
    payment_settings_saved: 'Οι ρυθμίσεις πληρωμών αποθηκεύτηκαν.',
    failed_to_save_settings: 'Αποτυχία αποθήκευσης ρυθμίσεων',
  },
  en: {
    // Page header
    payment_settings: 'Payment Settings',
    configure_paypal_description: 'Configure PayPal credentials used for checkout.',
    
    // Form labels
    paypal_server: 'PayPal (Server)',
    environment: 'Environment',
    live_environment: 'Live',
    sandbox_environment: 'Sandbox',
    client_id: 'Client ID',
    client_secret: 'Client Secret',
    client_id_placeholder: 'Paste new Client ID to update',
    client_secret_placeholder: 'Paste new Client Secret to update',
    
    // Status and actions
    last_updated: 'Last updated',
    no_settings_saved_yet: 'No settings saved yet',
    save_settings: 'Save Settings',
    saving: 'Saving...',
    loading: 'Loading...',
    
    // Messages
    payment_settings_saved: 'Payment settings saved.',
    failed_to_save_settings: 'Failed to save settings',
  }
}