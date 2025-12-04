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
