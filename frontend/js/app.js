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
            
            // Initialize Numbers UI
            this.initNumbers();
            
            // Initialize DateTime UI
            this.initDateTime();
            
            // Initialize TimeSpan UI
            this.initTimeSpan();
            
            // Initialize ByteSize UI
            this.initByteSize();
            
            // Initialize Collection UI
            this.initCollection();
            
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
        },
        
        // Initialize Numbers module
        initNumbers: function() {
            const processBtn = document.getElementById('process-numbers-btn');
            
            if (!processBtn) {
                console.log('Numbers UI not found, skipping initialization');
                return;
            }
            
            processBtn.addEventListener('click', async function() {
                const input = document.getElementById('numbers-input').value;
                const operation = document.getElementById('numbers-operation').value;
                
                const resultContainer = document.getElementById('numbers-result');
                const outputDiv = document.getElementById('numbers-output');
                const errorDiv = document.getElementById('numbers-error');
                
                resultContainer.classList.add('hidden');
                errorDiv.classList.add('hidden');
                
                if (!input || input.trim() === '') {
                    errorDiv.textContent = 'Please enter a number or Roman numeral';
                    errorDiv.classList.remove('hidden');
                    return;
                }
                
                processBtn.disabled = true;
                processBtn.textContent = 'Processing...';
                
                try {
                    const result = await NumbersModule.processNumber({
                        input,
                        operation
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
                    processBtn.disabled = false;
                    processBtn.textContent = 'Process';
                }
            });
        },
        
        // Initialize DateTime module
        initDateTime: function() {
            const processBtn = document.getElementById('process-datetime-btn');
            const operationSelect = document.getElementById('datetime-operation');
            
            if (!processBtn || !operationSelect) {
                console.log('DateTime UI not found, skipping initialization');
                return;
            }
            
            // Show/hide format type based on operation
            operationSelect.addEventListener('change', function() {
                const operation = this.value;
                const formatTypeGroup = document.getElementById('format-type-group');
                
                if (operation === 'format') {
                    formatTypeGroup.classList.remove('hidden');
                } else {
                    formatTypeGroup.classList.add('hidden');
                }
            });
            
            processBtn.addEventListener('click', async function() {
                const input = document.getElementById('datetime-input').value;
                const operation = document.getElementById('datetime-operation').value;
                const formatType = document.getElementById('format-type').value;
                
                const resultContainer = document.getElementById('datetime-result');
                const outputDiv = document.getElementById('datetime-output');
                const errorDiv = document.getElementById('datetime-error');
                
                resultContainer.classList.add('hidden');
                errorDiv.classList.add('hidden');
                
                if (!input) {
                    errorDiv.textContent = 'Please enter a date/time';
                    errorDiv.classList.remove('hidden');
                    return;
                }
                
                processBtn.disabled = true;
                processBtn.textContent = 'Processing...';
                
                try {
                    const result = await DateTimeModule.processDateTime({
                        input,
                        operation,
                        formatType
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
                    processBtn.disabled = false;
                    processBtn.textContent = 'Process';
                }
            });
        },
        
        // Initialize TimeSpan module
        initTimeSpan: function() {
            const processBtn = document.getElementById('process-timespan-btn');
            const operationSelect = document.getElementById('timespan-operation');
            
            if (!processBtn || !operationSelect) {
                console.log('TimeSpan UI not found, skipping initialization');
                return;
            }
            
            // Show/hide unit selector based on operation
            operationSelect.addEventListener('change', function() {
                const operation = this.value;
                const unitGroup = document.getElementById('unit-group');
                const verboseGroup = document.getElementById('verbose-group');
                
                if (operation === 'toUnit') {
                    unitGroup.classList.remove('hidden');
                    verboseGroup.classList.add('hidden');
                } else {
                    unitGroup.classList.add('hidden');
                    verboseGroup.classList.remove('hidden');
                }
            });
            
            processBtn.addEventListener('click', async function() {
                const input = document.getElementById('timespan-input').value;
                const operation = document.getElementById('timespan-operation').value;
                const unit = document.getElementById('timespan-unit').value;
                const verbose = document.getElementById('timespan-verbose').checked;
                
                const resultContainer = document.getElementById('timespan-result');
                const outputDiv = document.getElementById('timespan-output');
                const errorDiv = document.getElementById('timespan-error');
                
                resultContainer.classList.add('hidden');
                errorDiv.classList.add('hidden');
                
                if (!input) {
                    errorDiv.textContent = 'Please enter a duration';
                    errorDiv.classList.remove('hidden');
                    return;
                }
                
                processBtn.disabled = true;
                processBtn.textContent = 'Processing...';
                
                try {
                    const result = await TimeSpanModule.processTimeSpan({
                        input,
                        operation,
                        unit,
                        verbose
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
                    processBtn.disabled = false;
                    processBtn.textContent = 'Process';
                }
            });
        },
        
        // Initialize ByteSize module
        initByteSize: function() {
            const processBtn = document.getElementById('process-bytesize-btn');
            
            if (!processBtn) {
                console.log('ByteSize UI not found, skipping initialization');
                return;
            }
            
            processBtn.addEventListener('click', async function() {
                const input = document.getElementById('bytesize-input').value;
                const operation = document.getElementById('bytesize-operation').value;
                
                const resultContainer = document.getElementById('bytesize-result');
                const outputDiv = document.getElementById('bytesize-output');
                const errorDiv = document.getElementById('bytesize-error');
                
                resultContainer.classList.add('hidden');
                errorDiv.classList.add('hidden');
                
                if (!input || input.trim() === '') {
                    errorDiv.textContent = 'Please enter a value';
                    errorDiv.classList.remove('hidden');
                    return;
                }
                
                processBtn.disabled = true;
                processBtn.textContent = 'Processing...';
                
                try {
                    const result = await ByteSizeModule.processByteSize({
                        input,
                        operation
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
                    processBtn.disabled = false;
                    processBtn.textContent = 'Process';
                }
            });
        },
        
        // Initialize Collection module
        initCollection: function() {
            const processBtn = document.getElementById('process-collection-btn');
            
            if (!processBtn) {
                console.log('Collection UI not found, skipping initialization');
                return;
            }
            
            processBtn.addEventListener('click', async function() {
                const inputStr = document.getElementById('collection-input').value;
                const operation = document.getElementById('collection-operation').value;
                
                const resultContainer = document.getElementById('collection-result');
                const outputDiv = document.getElementById('collection-output');
                const errorDiv = document.getElementById('collection-error');
                
                resultContainer.classList.add('hidden');
                errorDiv.classList.add('hidden');
                
                if (!inputStr || inputStr.trim() === '') {
                    errorDiv.textContent = 'Please enter some items';
                    errorDiv.classList.remove('hidden');
                    return;
                }
                
                // Parse comma-separated input into array
                const input = inputStr.split(',').map(item => item.trim()).filter(item => item);
                
                processBtn.disabled = true;
                processBtn.textContent = 'Processing...';
                
                try {
                    const result = await CollectionModule.processCollection({
                        input,
                        operation
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
