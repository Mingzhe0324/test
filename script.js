// Global Variables
let emergencyTimer;
let countdownValue = 30;
let selectedPackage = null;
let healthData = {
    heartRate: [],
    bloodPressure: [],
    temperature: [],
    oxygen: []
};

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize health monitoring
    initializeHealthMonitoring();
    
    // Initialize emergency button
    initializeEmergencyButton();
    
    // Initialize payment form
    initializePaymentForm();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
    
    // Initialize mobile menu (if needed)
    initializeMobileMenu();
    
    // Start simulating health data
    startHealthSimulation();
}

// Health Monitoring Functions
function initializeHealthMonitoring() {
    // Update health values with realistic data
    updateHealthValues();
    
    // Create health chart
    createHealthChart();
    
    // Set up interval for real-time updates
    setInterval(updateHealthValues, 5000); // Update every 5 seconds
}

function updateHealthValues() {
    // Simulate realistic health data for elderly
    const heartRate = Math.floor(Math.random() * 20) + 65; // 65-85 bpm
    const systolic = Math.floor(Math.random() * 30) + 110; // 110-140 mmHg
    const diastolic = Math.floor(Math.random() * 20) + 70; // 70-90 mmHg
    const temperature = (Math.random() * 1.5 + 35.5).toFixed(1); // 35.5-37.0°C
    const oxygen = Math.floor(Math.random() * 5) + 95; // 95-100%
    
    // Update DOM elements
    document.getElementById('heartRate').textContent = heartRate;
    document.getElementById('bloodPressure').textContent = `${systolic}/${diastolic}`;
    document.getElementById('temperature').textContent = temperature;
    document.getElementById('oxygen').textContent = oxygen;
    
    // Update status indicators
    updateHealthStatus('heartRate', heartRate, 60, 100);
    updateHealthStatus('bloodPressure', systolic, 90, 140);
    updateHealthStatus('temperature', parseFloat(temperature), 36.0, 37.5);
    updateHealthStatus('oxygen', oxygen, 95, 100);
    
    // Store data for chart
    const now = new Date();
    healthData.heartRate.push({time: now, value: heartRate});
    healthData.bloodPressure.push({time: now, value: systolic});
    healthData.temperature.push({time: now, value: parseFloat(temperature)});
    healthData.oxygen.push({time: now, value: oxygen});
    
    // Keep only last 10 data points
    Object.keys(healthData).forEach(key => {
        if (healthData[key].length > 10) {
            healthData[key].shift();
        }
    });
    
    // Update chart
    updateHealthChart();
}

function updateHealthStatus(elementId, value, minNormal, maxNormal) {
    const element = document.getElementById(elementId);
    const statusElement = element.parentElement.querySelector('.health-status');
    
    if (value < minNormal || value > maxNormal) {
        statusElement.className = 'health-status warning';
        statusElement.textContent = value < minNormal ? 'Low' : 'High';
    } else {
        statusElement.className = 'health-status normal';
        statusElement.textContent = 'Normal';
    }
}

function createHealthChart() {
    const canvas = document.getElementById('healthChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = 300;
}

function updateHealthChart() {
    const canvas = document.getElementById('healthChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw grid
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 5; i++) {
        const y = (height / 5) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
    
    // Draw heart rate line
    if (healthData.heartRate.length > 1) {
        drawLine(ctx, healthData.heartRate, '#e74c3c', 40, 120, width, height);
    }
}

function drawLine(ctx, data, color, minValue, maxValue, width, height) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    data.forEach((point, index) => {
        const x = (width / (data.length - 1)) * index;
        const y = height - ((point.value - minValue) / (maxValue - minValue)) * height;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
}

function startHealthSimulation() {
    // Initial update
    updateHealthValues();
    
    // Continue updating every 5 seconds
    setInterval(updateHealthValues, 5000);
}

// Emergency Button Functions
function initializeEmergencyButton() {
    const emergencyBtn = document.getElementById('emergencyBtn');
    const confirmBtn = document.getElementById('confirmEmergency');
    const cancelBtn = document.getElementById('cancelEmergency');
    
    if (emergencyBtn) {
        emergencyBtn.addEventListener('click', showEmergencyModal);
    }
    
    if (confirmBtn) {
        confirmBtn.addEventListener('click', confirmEmergency);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', cancelEmergency);
    }
}

function showEmergencyModal() {
    const modal = document.getElementById('emergencyModal');
    modal.style.display = 'block';
    
    // Start countdown
    countdownValue = 30;
    updateCountdown();
    emergencyTimer = setInterval(updateCountdown, 1000);
}

function updateCountdown() {
    countdownValue--;
    document.getElementById('countdown').textContent = countdownValue;
    document.getElementById('timerText').textContent = countdownValue;
    
    if (countdownValue <= 0) {
        confirmEmergency();
    }
}

function confirmEmergency() {
    clearInterval(emergencyTimer);
    
    // Here you would typically send an alert to medical staff
    console.log('EMERGENCY CONFIRMED - Medical staff notified!');
    
    // Show success message
    showSuccessMessage('Emergency alert has been sent to our medical team. They are on their way!');
    
    // Close modal
    closeModal('emergencyModal');
    
    // You could also add sound alerts or other notifications
    playEmergencySound();
}

function cancelEmergency() {
    clearInterval(emergencyTimer);
    closeModal('emergencyModal');
}

function playEmergencySound() {
    // Create a simple beep sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}

// Payment System Functions
function initializePaymentForm() {
    const form = document.getElementById('paymentForm');
    if (form) {
        form.addEventListener('submit', handlePaymentSubmit);
    }
    
    // Add event listeners for payment type changes
    const paymentTypeSelect = document.getElementById('paymentType');
    if (paymentTypeSelect) {
        paymentTypeSelect.addEventListener('change', updatePaymentAmount);
    }
}

function handlePaymentSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const paymentData = {
        residentName: formData.get('residentName'),
        paymentType: formData.get('paymentType'),
        amount: formData.get('amount'),
        paymentMethod: formData.get('paymentMethod')
    };
    
    // Simulate payment processing
    processPayment(paymentData);
}

function processPayment(paymentData) {
    // Show loading state
    const submitBtn = document.querySelector('#paymentForm button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Processing...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Show success message
        showSuccessMessage(`Payment of RM ${paymentData.amount} for ${paymentData.residentName} has been processed successfully!`);
        
        // Reset form
        document.getElementById('paymentForm').reset();
        
        // Log payment (in real app, this would be sent to server)
        console.log('Payment processed:', paymentData);
    }, 2000);
}

function updatePaymentAmount() {
    const paymentType = document.getElementById('paymentType').value;
    const amountInput = document.getElementById('amount');
    
    // Pre-fill amounts based on payment type
    const predefinedAmounts = {
        'monthly': selectedPackage || 2500,
        'deposit': 5000,
        'additional': 100
    };
    
    if (predefinedAmounts[paymentType]) {
        amountInput.value = predefinedAmounts[paymentType];
    }
}

// Package Selection Functions
function selectPackage(packageName, price) {
    selectedPackage = price;
    
    // Update payment form
    document.getElementById('paymentType').value = 'monthly';
    document.getElementById('amount').value = price;
    
    // Show success message
    showSuccessMessage(`${packageName} package selected! Please proceed to payment.`);
    
    // Scroll to payment section
    scrollToSection('payment');
}

// Programme Registration Functions
function joinProgramme(programmeName) {
    // Show success message
    showSuccessMessage(`You have successfully registered for ${programmeName}! We will send you the schedule details.`);
    
    // In a real application, this would send data to the server
    console.log('Programme registration:', programmeName);
}

// Utility Functions
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function initializeMobileMenu() {
    // This would be implemented if a mobile menu is needed
    // For now, the navigation is responsive through CSS
}

function showSuccessMessage(message) {
    const modal = document.getElementById('successModal');
    const messageElement = document.getElementById('successMessage');
    
    messageElement.textContent = message;
    modal.style.display = 'block';
    
    // Auto-close after 3 seconds
    setTimeout(() => {
        closeModal('successModal');
    }, 3000);
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
        if (event.target.id === 'emergencyModal') {
            clearInterval(emergencyTimer);
        }
    }
});

// Keyboard accessibility
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        // Close any open modal
        document.querySelectorAll('.modal').forEach(modal => {
            if (modal.style.display === 'block') {
                modal.style.display = 'none';
                if (modal.id === 'emergencyModal') {
                    clearInterval(emergencyTimer);
                }
            }
        });
    }
});

// CCTV Camera Simulation (Optional enhancement)
function initializeCCTVSimulation() {
    // Simulate camera feed updates
    setInterval(() => {
        const cameraImages = document.querySelectorAll('.camera-feed img');
        cameraImages.forEach((img, index) => {
            // In a real application, this would update with actual camera feeds
            // For demo purposes, we could add a timestamp or status indicator
            const overlay = img.nextElementSibling;
            if (overlay) {
                const statusElement = overlay.querySelector('.camera-status');
                if (statusElement) {
                    // Simulate occasional connection issues
                    if (Math.random() > 0.95) {
                        statusElement.textContent = 'CONNECTING...';
                        statusElement.style.background = '#f39c12';
                        
                        setTimeout(() => {
                            statusElement.textContent = 'LIVE';
                            statusElement.style.background = '#e74c3c';
                        }, 2000);
                    }
                }
            }
        });
    }, 10000);
}

// Initialize CCTV simulation when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeCCTVSimulation();
});

// Print functionality for medical records
function printHealthReport() {
    window.print();
}

// Export health data (for medical staff)
function exportHealthData() {
    const dataStr = JSON.stringify(healthData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `health_data_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
}

// Add these functions to the global scope for button onclick handlers
window.selectPackage = selectPackage;
window.joinProgramme = joinProgramme;
window.scrollToSection = scrollToSection;
window.printHealthReport = printHealthReport;
window.exportHealthData = exportHealthData;