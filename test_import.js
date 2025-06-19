// Test JSON import capability
try {
  console.log('Testing JSON import...');
  
  // Try to import the JSON files
  import('../src/i18n/locales/ja.json', { assert: { type: 'json' } })
    .then(module => {
      console.log('✅ Japanese translation import successful');
      console.log('Keys available:', Object.keys(module.default));
      console.log('Email keys:', Object.keys(module.default.email || {}));
    })
    .catch(error => {
      console.error('❌ Japanese translation import failed:', error.message);
    });
    
  import('../src/i18n/locales/en.json', { assert: { type: 'json' } })
    .then(module => {
      console.log('✅ English translation import successful');
      console.log('Keys available:', Object.keys(module.default));
    })
    .catch(error => {
      console.error('❌ English translation import failed:', error.message);
    });
    
} catch (error) {
  console.error('❌ Import test error:', error.message);
}