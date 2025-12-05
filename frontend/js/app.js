/**
 * HumanLiker Application Bootstrap
 * Main entry point for the frontend application
 */

(function() {
    'use strict';
    
    // Global app object
    window.HumanLiker = {
        version: '1.0.0',
        initialized: false,
        
        // Initialize the application
        init: function() {
            console.log('HumanLiker v' + this.version + ' initializing...');
            this.initialized = true;
            
            // Initialize String Humanizer UI
            this.initStringHumanizer();
            
            // Initialize Inflector UI
            this.initInflector();
            
            console.log('HumanLiker ready.');
        },
        
        // Initialize String Humanizer module
        initStringHumanizer: function() {
            const operationSelect = document.getElementById('string-operation');
            const processBtn = document.getElementById('process-string-btn');
            
            if (!operationSelect || !processBtn) {
                console.log('String Humanizer UI not found, skipping initialization');
                return;
            }
            
            // Show/hide relevant form fields based on operation
            operationSelect.addEventListener('change', function() {
                const operation = this.value;
                const casingGroup = document.getElementById('casing-group');
                const truncateGroup = document.getElementById('truncate-group');
                const truncatorGroup = document.getElementById('truncator-group');
                const truncateFromGroup = document.getElementById('truncate-from-group');
                
                if (operation === 'humanize') {
                    casingGroup.classList.remove('hidden');
                    truncateGroup.classList.add('hidden');
                    truncatorGroup.classList.add('hidden');
                    truncateFromGroup.classList.add('hidden');
                } else if (operation === 'truncate') {
                    casingGroup.classList.add('hidden');
                    truncateGroup.classList.remove('hidden');
                    truncatorGroup.classList.remove('hidden');
                    truncateFromGroup.classList.remove('hidden');
                } else {
                    casingGroup.classList.add('hidden');
                    truncateGroup.classList.add('hidden');
                    truncatorGroup.classList.add('hidden');
                    truncateFromGroup.classList.add('hidden');
                }
            });
            
            // Process button click handler
            processBtn.addEventListener('click', async function() {
                const input = document.getElementById('string-input').value;
                const operation = document.getElementById('string-operation').value;
                const casing = document.getElementById('string-casing').value;
                const length = document.getElementById('truncate-length').value;
                const truncator = document.getElementById('truncator-type').value;
                const from = document.getElementById('truncate-from').value;
                
                const resultContainer = document.getElementById('string-result');
                const outputDiv = document.getElementById('string-output');
                const errorDiv = document.getElementById('string-error');
                
                // Hide previous results
                resultContainer.classList.add('hidden');
                errorDiv.classList.add('hidden');
                
                // Validate input
                if (!input || input.trim() === '') {
                    errorDiv.textContent = 'Please enter some text to process';
                    errorDiv.classList.remove('hidden');
                    return;
                }
                
                // Disable button during processing
                processBtn.disabled = true;
                processBtn.textContent = 'Processing...';
                
                try {
                    // Call the API
                    const result = await StringModule.processString({
                        input,
                        operation,
                        casing,
                        length: parseInt(length),
                        truncator,
                        from
                    });
                    
                    if (result.success) {
                        outputDiv.textContent = result.output;
                        resultContainer.classList.remove('hidden');
                    } else {
                        errorDiv.textContent = result.error || 'An error occurred';
                        errorDiv.classList.remove('hidden');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    errorDiv.textContent = 'Failed to process string: ' + error.message;
                    errorDiv.classList.remove('hidden');
                } finally {
                    // Re-enable button
                    processBtn.disabled = false;
                    processBtn.textContent = 'Process String';
                }
            });
        },
        
        // Initialize Inflector module
        initInflector: function() {
            const operationSelect = document.getElementById('inflector-operation');
            const processBtn = document.getElementById('process-inflector-btn');
            
            if (!operationSelect || !processBtn) {
                console.log('Inflector UI not found, skipping initialization');
                return;
            }
            
            // Show/hide quantity fields based on operation
            operationSelect.addEventListener('change', function() {
                const operation = this.value;
                const quantityGroup = document.getElementById('quantity-group');
                const quantityFormatGroup = document.getElementById('quantity-format-group');
                
                if (operation === 'toQuantity') {
                    quantityGroup.classList.remove('hidden');
                    quantityFormatGroup.classList.remove('hidden');
                } else {
                    quantityGroup.classList.add('hidden');
                    quantityFormatGroup.classList.add('hidden');
                }
            });
            
            // Process button click handler
            processBtn.addEventListener('click', async function() {
                const input = document.getElementById('inflector-input').value;
                const operation = document.getElementById('inflector-operation').value;
                const quantity = document.getElementById('inflector-quantity').value;
                const showQuantityAs = document.getElementById('quantity-format').value;
                
                const resultContainer = document.getElementById('inflector-result');
                const outputDiv = document.getElementById('inflector-output');
                const errorDiv = document.getElementById('inflector-error');
                
                // Hide previous results
                resultContainer.classList.add('hidden');
                errorDiv.classList.add('hidden');
                
                // Validate input
                if (!input || input.trim() === '') {
                    errorDiv.textContent = 'Please enter some text to process';
                    errorDiv.classList.remove('hidden');
                    return;
                }
                
                // Disable button during processing
                processBtn.disabled = true;
                processBtn.textContent = 'Processing...';
                
                try {
                    // Call the API
                    const result = await InflectorModule.processInflector({
                        input,
                        operation,
                        quantity: parseInt(quantity),
                        showQuantityAs
                    });
                    
                    if (result.success) {
                        outputDiv.textContent = result.output;
                        resultContainer.classList.remove('hidden');
                    } else {
                        errorDiv.textContent = result.error || 'An error occurred';
                        errorDiv.classList.remove('hidden');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    errorDiv.textContent = 'Failed to process: ' + error.message;
                    errorDiv.classList.remove('hidden');
                } finally {
                    // Re-enable button
                    processBtn.disabled = false;
                    processBtn.textContent = 'Process';
                }
            });
        }
    };
    
    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            window.HumanLiker.init();
        });
    } else {
        window.HumanLiker.init();
    }
})();
