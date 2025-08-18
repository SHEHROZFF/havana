// Bank Settings specific translations
export const bankSettingsTranslations = {
  el: {
    // Main header
    bank_transfer_settings: 'Ρυθμίσεις Τραπεζικού Εμβάσματος',
    configure_bank_details: 'Ρύθμιση στοιχείων τράπεζας για μεταφορές πελατών',
    
    // Navigation
    bank_settings: 'Ρυθμίσεις Τράπεζας',
    configure_bank_transfer_details: 'Ρύθμιση στοιχείων τραπεζικού εμβάσματος',
    
    // Loading states
    loading_bank_settings: 'Φόρτωση ρυθμίσεων τράπεζας...',
    
    // Buttons and actions
    show_values: 'Εμφάνιση Τιμών',
    hide_values: 'Απόκρυψη Τιμών',
    save_configuration: 'Αποθήκευση Ρυθμίσεων',
    saving: 'Αποθήκευση...',
    add_new_bank: 'Προσθήκη Νέας Τράπεζας',
    edit_bank: 'Επεξεργασία Τράπεζας',
    delete_bank: 'Διαγραφή Τράπεζας',
    activate_bank: 'Ενεργοποίηση Τράπεζας',
    deactivate_bank: 'Απενεργοποίηση Τράπεζας',
    
    // Form sections
    bank_account_information: 'Στοιχεία Τραπεζικού Λογαριασμού',
    customer_preview: 'Προεπισκόπηση Πελάτη',
    
    // Multiple banks management
    bank_accounts: 'Τραπεζικοί Λογαριασμοί',
    manage_bank_accounts: 'Διαχείριση Τραπεζικών Λογαριασμών',
    active_banks: 'Ενεργές Τράπεζες',
    inactive_banks: 'Ανενεργές Τράπεζες',
    bank_status: 'Κατάσταση',
    active: 'Ενεργή',
    inactive: 'Ανενεργή',
    actions: 'Ενέργειες',
    no_banks_configured: 'Δεν έχουν ρυθμιστεί τραπεζικοί λογαριασμοί',
    add_first_bank: 'Προσθέστε τον πρώτο σας τραπεζικό λογαριασμό',
    bank_name_display: 'Όνομα Τράπεζας',
    confirm_delete_bank: 'Είστε σίγουροι ότι θέλετε να απενεργοποιήσετε αυτή την τράπεζα;',
    confirm_activate_bank: 'Είστε σίγουροι ότι θέλετε να ενεργοποιήσετε αυτή την τράπεζα;',
    confirm_deactivate_bank: 'Είστε σίγουροι ότι θέλετε να απενεργοποιήσετε αυτή την τράπεζα;',
    bank_activated_successfully: 'Η τράπεζα ενεργοποιήθηκε επιτυχώς',
    bank_deactivated_successfully: 'Η τράπεζα απενεργοποιήθηκε επιτυχώς',
    bank_deleted_successfully: 'Η τράπεζα απενεργοποιήθηκε επιτυχώς',
    failed_to_activate_bank: 'Αποτυχία ενεργοποίησης τράπεζας',
    failed_to_deactivate_bank: 'Αποτυχία απενεργοποίησης τράπεζας',
    failed_to_delete_bank: 'Αποτυχία απενεργοποίησης τράπεζας',
    
    // Information notice
    sensitivity_tip: '💡 <strong>Συμβουλή:</strong> Μπορείτε πάντα να πληκτρολογείτε σε όλα τα πεδία. Χρησιμοποιήστε το κουμπί "Εμφάνιση/Απόκρυψη Τιμών" για να ελέγξετε αν τα ευαίσθητα δεδομένα είναι ορατά ή κρυμμένα με κουκκίδες.',
    
    // Form labels
    bank_name_required: 'Όνομα Τράπεζας *',
    account_holder_required: 'Κάτοχος Λογαριασμού *',
    iban_required: 'IBAN *',
    swift_code_optional: 'Κωδικός SWIFT (Προαιρετικό)',
    account_number_optional: 'Αριθμός Λογαριασμού (Προαιρετικό)',
    bank_address_optional: 'Διεύθυνση Τράπεζας (Προαιρετικό)',
    payment_instructions_optional: 'Οδηγίες Πληρωμής (Προαιρετικό)',
    
    // Placeholders
    bank_name_placeholder: 'π.χ., Εθνική Τράπεζα της Ελλάδος',
    account_holder_placeholder: 'π.χ., Havana Food Carts Ltd',
    iban_placeholder: 'GR16 0110 1250 0000 0001 2300 695',
    swift_code_placeholder: 'π.χ., ETHNGRAA',
    account_number_placeholder: 'π.χ., 125-002300695-12',
    bank_address_placeholder: 'π.χ., Αθήνα, Ελλάδα',
    payment_instructions_placeholder: 'Πρόσθετες οδηγίες για πελάτες που κάνουν τραπεζικές μεταφορές...',
    
    // Validation messages
    bank_name_is_required: 'Το όνομα της τράπεζας είναι υποχρεωτικό',
    account_holder_is_required: 'Ο κάτοχος του λογαριασμού είναι υποχρεωτικός',
    iban_is_required: 'Το IBAN είναι υποχρεωτικό',
    please_enter_valid_iban: 'Παρακαλώ εισάγετε έγκυρο IBAN',
    
    // Help text
    instructions_help_text: 'Αυτές οι οδηγίες θα εμφανίζονται στους πελάτες όταν επιλέγουν τη μέθοδο πληρωμής τραπεζικού εμβάσματος.',
    
    // Success/Error messages
    bank_configuration_saved_successfully: 'Οι ρυθμίσεις τράπεζας αποθηκεύτηκαν επιτυχώς!',
    failed_to_save_bank_configuration: 'Αποτυχία αποθήκευσης ρυθμίσεων τράπεζας',
    unknown_error: 'Άγνωστο σφάλμα',
    
    // Preview section
    bank_transfer_details: 'Στοιχεία Τραπεζικού Εμβάσματος',
    bank_name: 'Όνομα Τράπεζας',
    account_holder: 'Κάτοχος Λογαριασμού',
    iban: 'IBAN',
    swift_code: 'Κωδικός SWIFT',
    instructions: 'Οδηγίες',
  },
  
  en: {
    // Main header
    bank_transfer_settings: 'Bank Transfer Settings',
    configure_bank_details: 'Configure bank details for customer transfers',
    
    // Navigation
    bank_settings: 'Bank Settings',
    configure_bank_transfer_details: 'Configure bank transfer details',
    
    // Loading states
    loading_bank_settings: 'Loading bank settings...',
    
    // Buttons and actions
    show_values: 'Show Values',
    hide_values: 'Hide Values',
    save_configuration: 'Save Configuration',
    saving: 'Saving...',
    add_new_bank: 'Add New Bank',
    edit_bank: 'Edit Bank',
    delete_bank: 'Delete Bank',
    activate_bank: 'Activate Bank',
    deactivate_bank: 'Deactivate Bank',
    
    // Form sections
    bank_account_information: 'Bank Account Information',
    customer_preview: 'Customer Preview',
    
    // Multiple banks management
    bank_accounts: 'Bank Accounts',
    manage_bank_accounts: 'Manage Bank Accounts',
    active_banks: 'Active Banks',
    inactive_banks: 'Inactive Banks',
    bank_status: 'Status',
    active: 'Active',
    inactive: 'Inactive',
    actions: 'Actions',
    no_banks_configured: 'No bank accounts configured',
    add_first_bank: 'Add your first bank account',
    bank_name_display: 'Bank Name',
    confirm_delete_bank: 'Are you sure you want to deactivate this bank?',
    confirm_activate_bank: 'Are you sure you want to activate this bank?',
    confirm_deactivate_bank: 'Are you sure you want to deactivate this bank?',
    bank_activated_successfully: 'Bank activated successfully',
    bank_deactivated_successfully: 'Bank deactivated successfully',
    bank_deleted_successfully: 'Bank deactivated successfully',
    failed_to_activate_bank: 'Failed to activate bank',
    failed_to_deactivate_bank: 'Failed to deactivate bank',
    failed_to_delete_bank: 'Failed to deactivate bank',
    
    // Information notice
    sensitivity_tip: '💡 <strong>Tip:</strong> You can always type in all fields. Use the "Show/Hide Values" button to control whether sensitive data is visible or masked with dots.',
    
    // Form labels
    bank_name_required: 'Bank Name *',
    account_holder_required: 'Account Holder *',
    iban_required: 'IBAN *',
    swift_code_optional: 'SWIFT Code (Optional)',
    account_number_optional: 'Account Number (Optional)',
    bank_address_optional: 'Bank Address (Optional)',
    payment_instructions_optional: 'Payment Instructions (Optional)',
    
    // Placeholders
    bank_name_placeholder: 'e.g., National Bank of Greece',
    account_holder_placeholder: 'e.g., Havana Food Carts Ltd',
    iban_placeholder: 'GR16 0110 1250 0000 0001 2300 695',
    swift_code_placeholder: 'e.g., ETHNGRAA',
    account_number_placeholder: 'e.g., 125-002300695-12',
    bank_address_placeholder: 'e.g., Athens, Greece',
    payment_instructions_placeholder: 'Additional instructions for customers making bank transfers...',
    
    // Validation messages
    bank_name_is_required: 'Bank name is required',
    account_holder_is_required: 'Account holder is required',
    iban_is_required: 'IBAN is required',
    please_enter_valid_iban: 'Please enter a valid IBAN',
    
    // Help text
    instructions_help_text: 'These instructions will be shown to customers when they select bank transfer payment method.',
    
    // Success/Error messages
    bank_configuration_saved_successfully: 'Bank configuration saved successfully!',
    failed_to_save_bank_configuration: 'Failed to save bank configuration',
    unknown_error: 'Unknown error',
    
    // Preview section
    bank_transfer_details: 'Bank Transfer Details',
    bank_name: 'Bank Name',
    account_holder: 'Account Holder',
    iban: 'IBAN',
    swift_code: 'SWIFT Code',
    instructions: 'Instructions',
  }
}