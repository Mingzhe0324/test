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
let healthHistory = {
    daily: [],
    weekly: [],
    monthly: []
};
let currentReportTab = 'daily';

// User Schedule Management
let userSchedule = {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: []
};

// Available programmes with their schedules
const availableProgrammes = {
    'Morning Yoga': {
        days: ['monday', 'wednesday', 'friday'],
        time: '8:00 AM - 9:00 AM',
        duration: 60,
        type: 'free'
    },
    'Therapeutic Gardening': {
        days: ['saturday'],
        time: '9:00 AM - 10:30 AM',
        duration: 90,
        type: 'free'
    },
    'Art Therapy Workshop': {
        days: ['tuesday'],
        time: '2:00 PM - 4:00 PM',
        duration: 120,
        type: 'free'
    },
    'Music & Memory': {
        days: ['thursday'],
        time: '3:00 PM - 4:30 PM',
        duration: 90,
        type: 'free'
    },
    'Memory Enhancement Games': {
        days: ['monday', 'friday'],
        time: '4:00 PM - 5:00 PM',
        duration: 60,
        type: 'free'
    },
    // Extra Paid Programmes
    'Singapore Cultural Tour': {
        days: [], // Special event - scheduled separately
        time: 'Special Event - 3 Days 2 Nights',
        duration: 2880, // 48 hours in minutes
        type: 'paid',
        price: 1500,
        description: 'Monthly cultural tour to Singapore'
    },
    'Thailand Wellness Retreat': {
        days: [], // Special event - scheduled separately
        time: 'Special Event - 5 Days 4 Nights',
        duration: 7200, // 120 hours in minutes
        type: 'paid',
        price: 2800,
        description: 'Quarterly wellness retreat to Thailand'
    },
    'Bali Spiritual Journey': {
        days: [], // Special event - scheduled separately
        time: 'Special Event - 4 Days 3 Nights',
        duration: 5760, // 96 hours in minutes
        type: 'paid',
        price: 2200,
        description: 'Bi-annual spiritual journey to Bali'
    }
};

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    initializeMobileMenu();
    initializeTouchInteractions();
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
    
    // Initialize health reports
    initializeHealthReports();
    
    // Load historical data
    loadHealthHistory();
    
    // Load user schedule
    loadUserSchedule();
    
    // Initialize touch interactions for mobile
    initializeTouchInteractions();
}

// Touch Interactions for Mobile
function initializeTouchInteractions() {
    // Add touch feedback to buttons
    const buttons = document.querySelectorAll('.btn, .emergency-btn, .control-btn, .nav-link');
    buttons.forEach(button => {
        button.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        }, { passive: true });
        
        button.addEventListener('touchend', function() {
            this.style.transform = '';
        }, { passive: true });
    });
    
    // Improve scrolling on mobile
    if ('ontouchstart' in window) {
        document.body.style.touchAction = 'manipulation';
        
        // Add smooth scrolling for mobile
        const scrollableElements = document.querySelectorAll('.modal-body, .activity-log');
        scrollableElements.forEach(element => {
            element.style.webkitOverflowScrolling = 'touch';
        });
    }
    
    // Handle orientation changes
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            // Adjust modal positions after orientation change
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                if (modal.style.display === 'block') {
                    // Recenter modal
                    const modalContent = modal.querySelector('.modal-content');
                    if (modalContent) {
                        modalContent.style.marginTop = '5vh';
                    }
                }
            });
        }, 100);
    });
}

// Health Monitoring Functions
function initializeHealthMonitoring() {
    // Update health values with realistic data
    updateHealthValues();
    
    
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
    
    
    // Update health score and feedback
    updateHealthScore();
    
    // Save to history
    saveToHealthHistory();
    
    // Update reports
    updateReports();
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
    const copyAddressBtn = document.getElementById('copyAddressBtn');
    
    if (emergencyBtn) {
        emergencyBtn.addEventListener('click', showEmergencyModal);
    }
    
    if (confirmBtn) {
        confirmBtn.addEventListener('click', confirmEmergency);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', cancelEmergency);
    }
    
    if (copyAddressBtn) {
        copyAddressBtn.addEventListener('click', copyEmergencyAddress);
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
    showSuccessMessage('Emergency alert has been cancelled.');
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

// Copy Emergency Address Function
function copyEmergencyAddress() {
    const emergencyAddress = `🚨 EMERGENCY LOCATION 🚨\n\nSerene Retirement Village\n123, Jalan Serene\n50250 Kuala Lumpur\nMalaysia\n\n📞 Emergency: +603-1234-9999\n📞 Main Line: +603-1234-5678\n\n📍 GPS Coordinates: 3.1390° N, 101.6891° E\n\n⏰ Time: ${new Date().toLocaleString()}`;
    
    // Use modern Clipboard API if available
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(emergencyAddress).then(() => {
            showSuccessMessage('Emergency address and contact information copied to clipboard! You can share it with emergency services.');
        }).catch(() => {
            // Fallback method
            fallbackCopyTextToClipboard(emergencyAddress);
        });
    } else {
        // Fallback for older browsers
        fallbackCopyTextToClipboard(emergencyAddress);
    }
}

// Call Emergency Services Function
function callEmergencyServices() {
    // Show confirmation modal
    const modal = document.getElementById('successModal');
    const messageElement = document.getElementById('successMessage');
    
    const callMessage = `
        <div style="text-align: center; padding: 1rem;">
            <div style="font-size: 3rem; color: #e74c3c; margin-bottom: 1rem;">
                <i class="fas fa-phone-alt"></i>
            </div>
            <h3 style="color: #e74c3c; margin-bottom: 1rem;">Call Emergency Services</h3>
            <p style="font-size: 1.1rem; margin-bottom: 1.5rem;">You are about to call the emergency services (999).</p>
            
            <div style="background: #fdf2f2; padding: 1.5rem; border-radius: 10px; margin-bottom: 1.5rem;">
                <p style="margin: 0; color: #2c3e50; font-weight: bold;">Emergency Information Ready:</p>
                <p style="margin: 0.5rem 0; color: #7f8c8d;">Serene Retirement Village</p>
                <p style="margin: 0; color: #7f8c8d;">123, Jalan Serene, 50250 Kuala Lumpur</p>
            </div>
            
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button onclick="makeEmergencyCall()" class="btn btn-danger" style="padding: 0.8rem 1.5rem;">
                    <i class="fas fa-phone"></i> Call 999
                </button>
                <button onclick="closeModal('successModal')" class="btn btn-secondary" style="padding: 0.8rem 1.5rem;">
                    Cancel
                </button>
            </div>
        </div>
    `;
    
    messageElement.innerHTML = callMessage;
    modal.style.display = 'block';
}

function makeEmergencyCall() {
    // Close the modal
    closeModal('successModal');
    
    // Attempt to make the call
    window.location.href = 'tel:999';
    
    // Show confirmation
    setTimeout(() => {
        showSuccessMessage('Connecting to emergency services (999)... Please stay on the line.');
    }, 500);
}

function notifyFamily() {
    const modal = document.getElementById('successModal');
    const messageElement = document.getElementById('successMessage');
    
    // 1. Force the modal to appear instantly by adding the .instant class
    modal.classList.add('instant');
    
    const familyMessage = `
        <div style="text-align: center;">
            <div style="font-size: 2.5rem; color: #3498db; margin-bottom: 15px;">
                <i class="fas fa-users"></i>
            </div>
            <h3 style="margin-bottom: 10px;">Notify Family Members</h3>
            <p style="margin-bottom: 20px; color: #666;">Select contacts to alert immediately:</p>
            
            <div style="text-align: left; margin-bottom: 20px;">
                <div class="contact-check-item">
                    <input type="checkbox" id="fam1" checked style="width: 20px; height: 20px;">
                    <label for="fam1">👨‍⚕️ Dr. Ahmad (Son) - +6012-345-6789</label>
                </div>
                <div class="contact-check-item">
                    <input type="checkbox" id="fam2" checked style="width: 20px; height: 20px;">
                    <label for="fam2">👩‍⚕️ Sarah (Daughter) - +6012-987-6543</label>
                </div>
                <div class="contact-check-item">
                    <input type="checkbox" id="fam3" style="width: 20px; height: 20px;">
                    <label for="fam3">👨‍⚕️ Mr. Tan (Guardian) - +6017-555-1234</label>
                </div>
            </div>
            
            <div style="display: flex; gap: 10px;">
                <button onclick="sendFamilyNotifications()" class="btn btn-primary btn-full">
                    <i class="fas fa-paper-plane"></i> Send Now
                </button>
                <button onclick="closeInstantModal()" class="btn btn-secondary">Cancel</button>
            </div>
        </div>
    `;
    
    messageElement.innerHTML = familyMessage;
    modal.style.display = 'flex';
}

function closeInstantModal() {
    const modal = document.getElementById('successModal');
    modal.style.display = 'none';
    modal.classList.remove('instant'); // Clean up for next time
}

function sendFamilyNotifications() {
    // Immediate feedback without delay
    const messageElement = document.getElementById('successMessage');
    messageElement.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <i class="fas fa-check-circle" style="font-size: 3rem; color: #27ae60;"></i>
            <h3 style="margin-top: 15px; color: #27ae60;">Alerts Dispatched!</h3>
            <p>Confirmation SMS sent to selected family members.</p>
            <button onclick="closeInstantModal()" class="btn btn-primary" style="margin-top: 20px;">Back to Home</button>
        </div>
    `;
}
 

function sendFamilyNotifications() {
    // Close the modal
    closeModal('successModal');
    
    // Simulate sending notifications
    showSuccessMessage('Emergency notifications have been sent to your family members. They will be updated on the situation.');
    
    // In a real application, this would send actual notifications via SMS, email, or app notifications
    console.log('Family emergency notifications sent');
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

// Modal Functions for About, Contact, and Careers
function openAboutModal() {
    const modal = document.getElementById('aboutModal');
    if (!modal) {
        createAboutModal();
    }
    document.getElementById('aboutModal').style.display = 'block';
}

function openContactModal() {
    const modal = document.getElementById('contactModal');
    if (!modal) {
        createContactModal();
    }
    document.getElementById('contactModal').style.display = 'block';
}

function openCareersModal() {
    const modal = document.getElementById('careersModal');
    if (!modal) {
        createCareersModal();
    }
    document.getElementById('careersModal').style.display = 'block';
}

function createAboutModal() {
    const modalHTML = `
        <div id="aboutModal" class="modal">
            <div class="modal-content about-modal-content scrollable">
                <div class="modal-header">
                    <h2><i class="fas fa-building"></i> About Serene Retirement Village</h2>
                    <button class="close-btn" onclick="closeModal('aboutModal')">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="about-modal-content-inner">
                        <h3>Welcome to Serene Retirement Village</h3>
                        <p>Established in 2010, Serene Retirement Village is a premier retirement community dedicated to providing exceptional care, comfort, and companionship for seniors in Malaysia.</p>
                        
                        <h4>Our Vision</h4>
                        <p>To be the leading retirement village in Malaysia, setting the standard for senior living through innovative care, holistic wellness programs, and a vibrant community spirit.</p>
                        
                        <h4>Our Mission</h4>
                        <p>We are committed to enhancing the quality of life for our residents by providing personalized care, engaging activities, and a safe, supportive environment that promotes independence and well-being.</p>
                        
                        <h4>Our Values</h4>
                        <ul>
                            <li><strong>Compassion:</strong> We treat every resident with empathy, respect, and kindness.</li>
                            <li><strong>Excellence:</strong> We strive for the highest standards in care and service.</li>
                            <li><strong>Integrity:</strong> We operate with transparency and honesty in all we do.</li>
                            <li><strong>Community:</strong> We foster a sense of belonging and mutual support.</li>
                        </ul>
                        
                        <h4>Our Leadership Team</h4>
                        <div class="team-grid-modal">
                            <div class="team-member-modal">
                                <img src="https://picsum.photos/seed/ceo/150/150.jpg" alt="CEO">
                                <h4>Dr. Ahmad Hassan</h4>
                                <p>Chief Executive Officer</p>
                                <p>With over 20 years in healthcare management.</p>
                            </div>
                            <div class="team-member-modal">
                                <img src="https://picsum.photos/seed/medical/150/150.jpg" alt="Medical Director">
                                <h4>Dr. Sarah Lim</h4>
                                <p>Medical Director</p>
                                <p>Board-certified geriatrician.</p>
                            </div>
                            <div class="team-member-modal">
                                <img src="https://picsum.photos/seed/operations/150/150.jpg" alt="Operations Director">
                                <h4>Mr. Raj Kumar</h4>
                                <p>Operations Director</p>
                                <p>Ensuring smooth daily operations.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="closeModal('aboutModal')">Close</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function createContactModal() {
    const modalHTML = `
        <div id="contactModal" class="modal">
            <div class="modal-content contact-modal-content scrollable">
                <div class="modal-header">
                    <h2><i class="fas fa-envelope"></i> Contact Us</h2>
                    <button class="close-btn" onclick="closeModal('contactModal')">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="contact-modal-content-inner">
                        <div class="contact-info-modal">
                            <div class="contact-card-modal">
                                <i class="fas fa-map-marker-alt"></i>
                                <h3>Visit Us</h3>
                                <p>Serene Retirement Village<br>
                                123, Jalan Serene<br>
                                50250 Kuala Lumpur<br>
                                Malaysia</p>
                                <p><strong>Hours:</strong><br>
                                Mon-Fri: 9:00 AM - 6:00 PM<br>
                                Sat: 9:00 AM - 1:00 PM</p>
                            </div>
                            
                            <div class="contact-card-modal">
                                <i class="fas fa-phone"></i>
                                <h3>Call Us</h3>
                                <p><strong>Main:</strong> +603-1234-5678</p>
                                <p><strong>Emergency:</strong> +603-1234-9999</p>
                                <p><strong>Admissions:</strong> +603-1234-5679</p>
                            </div>
                            
                            <div class="contact-card-modal">
                                <i class="fas fa-envelope"></i>
                                <h3>Email Us</h3>
                                <p><strong>General:</strong><br>
                                info@sereneretirement.com</p>
                                <p><strong>Admissions:</strong><br>
                                admissions@sereneretirement.com</p>
                            </div>
                        </div>
                        
                        <form id="contactModalForm" onsubmit="handleModalContactSubmit(event)">
                            <div class="form-group">
                                <label for="modalName">Name *</label>
                                <input type="text" id="modalName" required>
                            </div>
                            <div class="form-group">
                                <label for="modalEmail">Email *</label>
                                <input type="email" id="modalEmail" required>
                            </div>
                            <div class="form-group">
                                <label for="modalMessage">Message *</label>
                                <textarea id="modalMessage" rows="4" required></textarea>
                            </div>
                            <button type="submit" class="btn btn-primary btn-full">Send Message</button>
                        </form>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="closeModal('contactModal')">Close</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function createCareersModal() {
    const modalHTML = `
        <div id="careersModal" class="modal">
            <div class="modal-content careers-modal-content scrollable">
                <div class="modal-header">
                    <h2><i class="fas fa-briefcase"></i> Careers at Serene Retirement Village</h2>
                    <button class="close-btn" onclick="closeModal('careersModal')">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="careers-modal-content-inner">
                        <h3>Why Join Our Team?</h3>
                        <div class="benefits-grid-modal">
                            <div class="benefit-item-modal">
                                <i class="fas fa-heart"></i>
                                <h4>Meaningful Work</h4>
                                <p>Make a real difference in the lives of our residents every day.</p>
                            </div>
                            <div class="benefit-item-modal">
                                <i class="fas fa-graduation-cap"></i>
                                <h4>Professional Development</h4>
                                <p>Continuous training and career advancement opportunities.</p>
                            </div>
                            <div class="benefit-item-modal">
                                <i class="fas fa-users"></i>
                                <h4>Supportive Environment</h4>
                                <p>Work with a compassionate, collaborative team.</p>
                            </div>
                        </div>
                        
                        <h3>Current Openings</h3>
                        <div class="job-listings-modal">
                            <div class="job-card-modal">
                                <h4>Registered Nurse</h4>
                                <span class="job-type full-time">Full-Time</span>
                                <p><strong>Department:</strong> Medical Services</p>
                                <p><strong>Experience:</strong> 2+ years in geriatric care</p>
                                <button class="btn btn-primary btn-small" onclick="applyForJob('Registered Nurse')">Apply Now</button>
                            </div>
                            
                            <div class="job-card-modal">
                                <h4>Caregiver</h4>
                                <span class="job-type full-time">Full-Time</span>
                                <p><strong>Department:</strong> Resident Services</p>
                                <p><strong>Experience:</strong> 1+ years in caregiving</p>
                                <button class="btn btn-primary btn-small" onclick="applyForJob('Caregiver')">Apply Now</button>
                            </div>
                            
                            <div class="job-card-modal">
                                <h4>Activities Coordinator</h4>
                                <span class="job-type full-time">Full-Time</span>
                                <p><strong>Department:</strong> Recreation</p>
                                <p><strong>Experience:</strong> 1+ years in activities planning</p>
                                <button class="btn btn-primary btn-small" onclick="applyForJob('Activities Coordinator')">Apply Now</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="closeModal('careersModal')">Close</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function handleModalContactSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('modalName').value;
    const email = document.getElementById('modalEmail').value;
    const message = document.getElementById('modalMessage').value;
    
    showSuccessMessage(`Thank you ${name}! Your message has been sent successfully.`);
    closeModal('contactModal');
    event.target.reset();
}

// Programme Registration Functions
function joinProgramme(programmeName) {
    const programme = availableProgrammes[programmeName];
    
    if (!programme) {
        showSuccessMessage('Programme not found. Please try again.');
        return;
    }
    
    // Handle paid programmes differently
    if (programme.type === 'paid') {
        // For paid programmes, show booking confirmation with price
        showPaidProgrammeBooking(programmeName, programme);
        return;
    }
    
    // Add programme to user's schedule for each day it occurs
    let addedToDays = [];
    programme.days.forEach(day => {
        // Check if programme is already scheduled for this day
        const alreadyScheduled = userSchedule[day].some(p => p.name === programmeName);
        if (!alreadyScheduled) {
            userSchedule[day].push({
                name: programmeName,
                time: programme.time,
                duration: programme.duration,
                type: programme.type
            });
            addedToDays.push(day.charAt(0).toUpperCase() + day.slice(1));
        }
    });
    
    // Save to localStorage
    localStorage.setItem('userSchedule', JSON.stringify(userSchedule));
    
    // Show success message
    if (addedToDays.length > 0) {
        showSuccessMessage(`You have successfully registered for ${programmeName}! Added to your schedule on: ${addedToDays.join(', ')}.`);
    } else {
        showSuccessMessage(`You are already registered for ${programmeName}!`);
    }
    
    // In a real application, this would send data to the server
    console.log('Programme registration:', programmeName, 'Schedule updated:', userSchedule);
}

// Function to handle paid programme booking
function showPaidProgrammeBooking(programmeName, programme) {
    const modal = document.getElementById('successModal');
    const messageElement = document.getElementById('successMessage');
    
    const bookingMessage = `
        <div style="text-align: left; padding: 1rem;">
            <h3 style="color: #f39c12; margin-bottom: 1rem;">🌟 Special Programme Booking</h3>
            <p><strong>Programme:</strong> ${programmeName}</p>
            <p><strong>Description:</strong> ${programme.description}</p>
            <p><strong>Duration:</strong> ${programme.time}</p>
            <p><strong>Price:</strong> <span style="color: #e74c3c; font-size: 1.2rem; font-weight: bold;">RM ${programme.price}</span></p>
            <hr style="margin: 1rem 0; border: none; border-top: 1px solid #ecf0f1;">
            <p style="color: #27ae60; font-weight: bold;">✓ Your booking request has been received!</p>
            <p>Our staff will contact you within 24 hours to confirm your booking and arrange payment.</p>
            <p style="font-size: 0.9rem; color: #7f8c8d; margin-top: 1rem;">For immediate assistance, please call our reception at +603-1234-5678.</p>
        </div>
    `;
    
    messageElement.innerHTML = bookingMessage;
    modal.style.display = 'block';
    
    // Don't auto-close for paid programmes - user needs to read the details
    // Remove the auto-close timeout by not setting it
    
    // Log the booking request
    console.log('Paid programme booking request:', programmeName, programme);
    
    // In a real application, this would send a booking request to the server
    // and potentially redirect to payment processing
}

// Load user schedule from localStorage
function loadUserSchedule() {
    const saved = localStorage.getItem('userSchedule');
    if (saved) {
        userSchedule = JSON.parse(saved);
    }
}

// Remove programme from user schedule
function removeProgrammeFromSchedule(programmeName, day) {
    userSchedule[day] = userSchedule[day].filter(p => p.name !== programmeName);
    localStorage.setItem('userSchedule', JSON.stringify(userSchedule));
    updateWeeklyScheduleDisplay();
    showSuccessMessage(`${programmeName} has been removed from your ${day} schedule.`);
}

// Calculate free time slots for a specific day
function calculateFreeTimeSlots(day) {
    const dayProgrammes = userSchedule[day];
    if (dayProgrammes.length === 0) {
        return ['Full day free'];
    }
    
    // Convert time to minutes for easier calculation
    const timeToMinutes = (timeStr) => {
        const [time, period] = timeStr.split(' ');
        const [hours, minutes] = time.split(':').map(Number);
        const totalMinutes = hours * 60 + minutes;
        return period === 'PM' && hours !== 12 ? totalMinutes + 12 * 60 : totalMinutes;
    };
    
    const minutesToTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
        return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`;
    };
    
    // Sort programmes by start time
    const sortedProgrammes = [...dayProgrammes].sort((a, b) => {
        const aStart = timeToMinutes(a.time.split(' - ')[0]);
        const bStart = timeToMinutes(b.time.split(' - ')[0]);
        return aStart - bStart;
    });
    
    const freeSlots = [];
    const dayStart = 8 * 60; // 8:00 AM
    const dayEnd = 18 * 60; // 6:00 PM
    
    // Check free time before first programme
    const firstStart = timeToMinutes(sortedProgrammes[0].time.split(' - ')[0]);
    if (firstStart > dayStart) {
        freeSlots.push(`${minutesToTime(dayStart)} - ${minutesToTime(firstStart)}`);
    }
    
    // Check free time between programmes
    for (let i = 0; i < sortedProgrammes.length - 1; i++) {
        const currentEnd = timeToMinutes(sortedProgrammes[i].time.split(' - ')[1]);
        const nextStart = timeToMinutes(sortedProgrammes[i + 1].time.split(' - ')[0]);
        if (nextStart > currentEnd) {
            freeSlots.push(`${minutesToTime(currentEnd)} - ${minutesToTime(nextStart)}`);
        }
    }
    
    // Check free time after last programme
    const lastEnd = timeToMinutes(sortedProgrammes[sortedProgrammes.length - 1].time.split(' - ')[1]);
    if (lastEnd < dayEnd) {
        freeSlots.push(`${minutesToTime(lastEnd)} - ${minutesToTime(dayEnd)}`);
    }
    
    return freeSlots.length > 0 ? freeSlots : ['No free time slots available'];
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
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mainNav = document.getElementById('mainNav');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const navLinks = document.querySelectorAll('.nav-link');
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    // Toggle mobile menu
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            toggleMobileMenu();
        });
    }
    
    // Close mobile menu when clicking overlay
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', closeMobileMenu);
    }
    
    // Close mobile menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeMobileMenu();
        });
    });
    
    // Handle dropdown toggles in mobile
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const dropdown = this.parentElement;
                dropdown.classList.toggle('active');
            }
        });
    });
    
    // Close mobile menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mainNav.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    const mainNav = document.getElementById('mainNav');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    
    mainNav.classList.toggle('active');
    mobileMenuOverlay.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (mainNav.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

function closeMobileMenu() {
    const mainNav = document.getElementById('mainNav');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const dropdowns = document.querySelectorAll('.dropdown');
    
    mainNav.classList.remove('active');
    mobileMenuOverlay.classList.remove('active');
    mobileMenuToggle.classList.remove('active');
    document.body.style.overflow = '';
    
    // Close all dropdowns
    dropdowns.forEach(dropdown => {
        dropdown.classList.remove('active');
    });
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
        // Remove scrollable class when closing
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.classList.remove('scrollable');
        }
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
window.switchReportTab = switchReportTab;
window.exportReport = exportReport;
window.printReport = printReport;
window.showWeeklySchedule = showWeeklySchedule;
window.printSchedule = printSchedule;

// Health Reports System
function initializeHealthReports() {
    // Set initial tab
    switchReportTab('daily');
    
    // Update reports every 30 seconds
    setInterval(updateReports, 30000);
}


function calculateHealthScore() {
    if (healthData.heartRate.length === 0) return 85; // Default score
    
    let score = 100;
    let deductions = 0;
    
    // Heart Rate scoring (40% weight)
    const latestHR = healthData.heartRate[healthData.heartRate.length - 1].value;
    if (latestHR < 60 || latestHR > 100) {
        deductions += 15;
    } else if (latestHR < 65 || latestHR > 85) {
        deductions += 5;
    }
    
    // Blood Pressure scoring (30% weight)
    const latestBP = healthData.bloodPressure[healthData.bloodPressure.length - 1].value;
    if (latestBP < 90 || latestBP > 140) {
        deductions += 12;
    } else if (latestBP < 110 || latestBP > 130) {
        deductions += 4;
    }
    
    // Temperature scoring (15% weight)
    const latestTemp = healthData.temperature[healthData.temperature.length - 1].value;
    if (latestTemp < 36.0 || latestTemp > 37.5) {
        deductions += 6;
    } else if (latestTemp < 36.3 || latestTemp > 37.2) {
        deductions += 2;
    }
    
    // Oxygen Level scoring (15% weight)
    const latestO2 = healthData.oxygen[healthData.oxygen.length - 1].value;
    if (latestO2 < 95) {
        deductions += 7;
    } else if (latestO2 < 97) {
        deductions += 2;
    }
    
    score = Math.max(0, Math.min(100, score - deductions));
    return Math.round(score);
}

function updateHealthScore() {
    const score = calculateHealthScore();
    const scoreElement = document.getElementById('healthScore');
    const statusElement = document.querySelector('.score-status');
    const feedbackElement = document.getElementById('healthFeedback');
    const recommendationsList = document.getElementById('recommendationsList');
    
    if (scoreElement) {
        scoreElement.textContent = score;
    }
    
    // Update status
    let status, statusClass, feedback, recommendations;
    
    if (score >= 90) {
        status = 'Excellent';
        statusClass = 'excellent';
        feedback = 'Your vital signs are in excellent condition! Keep up the great work with your healthy lifestyle.';
        recommendations = [
            'Continue your current exercise routine',
            'Maintain balanced nutrition',
            'Regular health check-ups',
            'Stay socially active'
        ];
    } else if (score >= 75) {
        status = 'Good';
        statusClass = 'good';
        feedback = 'Your health indicators are good. Minor adjustments could help improve your overall wellness.';
        recommendations = [
            'Increase daily physical activity',
            'Monitor salt intake',
            'Ensure adequate sleep',
            'Practice stress management'
        ];
    } else if (score >= 60) {
        status = 'Fair';
        statusClass = 'fair';
        feedback = 'Some health indicators need attention. Consider consulting with healthcare providers.';
        recommendations = [
            'Schedule a medical check-up',
            'Follow prescribed medications',
            'Improve diet quality',
            'Increase physical activity gradually'
        ];
    } else {
        status = 'Poor';
        statusClass = 'poor';
        feedback = 'Immediate medical attention is recommended. Several vital signs are outside normal ranges.';
        recommendations = [
            'Contact healthcare provider immediately',
            'Follow medical advice strictly',
            'Monitor vital signs frequently',
            'Consider emergency care if symptoms worsen'
        ];
    }
    
    if (statusElement) {
        statusElement.textContent = status;
        statusElement.className = `score-status ${statusClass}`;
    }
    
    if (feedbackElement) {
        feedbackElement.textContent = feedback;
    }
    
    if (recommendationsList) {
        recommendationsList.innerHTML = recommendations.map(rec => `<li>${rec}</li>`).join('');
    }
}

function saveToHealthHistory() {
    const now = new Date();
    const today = now.toDateString();
    
    // Get current readings
    const currentHR = healthData.heartRate[healthData.heartRate.length - 1]?.value || 0;
    const currentBP = healthData.bloodPressure[healthData.bloodPressure.length - 1]?.value || 0;
    const currentTemp = healthData.temperature[healthData.temperature.length - 1]?.value || 0;
    const currentO2 = healthData.oxygen[healthData.oxygen.length - 1]?.value || 0;
    const score = calculateHealthScore();
    
    const entry = {
        timestamp: now,
        date: today,
        heartRate: currentHR,
        bloodPressure: currentBP,
        temperature: currentTemp,
        oxygen: currentO2,
        score: score
    };
    
    // Save to daily history
    const todayIndex = healthHistory.daily.findIndex(d => d.date === today);
    if (todayIndex >= 0) {
        healthHistory.daily[todayIndex] = entry;
    } else {
        healthHistory.daily.push(entry);
        if (healthHistory.daily.length > 30) {
            healthHistory.daily.shift();
        }
    }
    
    // Save to localStorage
    localStorage.setItem('healthHistory', JSON.stringify(healthHistory));
}

function loadHealthHistory() {
    const saved = localStorage.getItem('healthHistory');
    if (saved) {
        healthHistory = JSON.parse(saved);
    } else {
        // Generate sample historical data for demonstration
        generateSampleHistory();
    }
}

function generateSampleHistory() {
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        const entry = {
            timestamp: date,
            date: date.toDateString(),
            heartRate: Math.floor(Math.random() * 20) + 65,
            bloodPressure: Math.floor(Math.random() * 30) + 110,
            temperature: (Math.random() * 1.5 + 35.5).toFixed(1),
            oxygen: Math.floor(Math.random() * 5) + 95,
            score: Math.floor(Math.random() * 20) + 75
        };
        
        healthHistory.daily.push(entry);
    }
}

function switchReportTab(tab) {
    currentReportTab = tab;
    
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Update report panels
    document.querySelectorAll('.report-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    document.getElementById(`${tab}Report`).classList.add('active');
    
    // Update the specific report
    updateSpecificReport(tab);
}

function updateReports() {
    updateSpecificReport('daily');
    updateSpecificReport('weekly');
    updateSpecificReport('monthly');
}

function updateSpecificReport(period) {
    if (period === 'daily') {
        updateDailyReport();
    } else if (period === 'weekly') {
        updateWeeklyReport();
    } else if (period === 'monthly') {
        updateMonthlyReport();
    }
}

function updateDailyReport() {
    if (healthHistory.daily.length === 0) return;
    
    const today = new Date().toDateString();
    const todayData = healthHistory.daily.filter(d => d.date === today);
    
    if (todayData.length > 0) {
        const avgHR = Math.round(todayData.reduce((sum, d) => sum + d.heartRate, 0) / todayData.length);
        const avgBP = Math.round(todayData.reduce((sum, d) => sum + d.bloodPressure, 0) / todayData.length);
        const avgTemp = (todayData.reduce((sum, d) => sum + parseFloat(d.temperature), 0) / todayData.length).toFixed(1);
        const avgO2 = Math.round(todayData.reduce((sum, d) => sum + d.oxygen, 0) / todayData.length);
        
        document.getElementById('dailyAvgHR').textContent = `${avgHR} bpm`;
        document.getElementById('dailyBPRange').textContent = `${avgBP}/${Math.round(avgBP * 0.6)} mmHg`;
        document.getElementById('dailyAvgTemp').textContent = `${avgTemp}°C`;
        document.getElementById('dailyAvgO2').textContent = `${avgO2}%`;
    }
    
}

function updateWeeklyReport() {
    const weekData = healthHistory.daily.slice(-7);
    
    if (weekData.length > 0) {
        const avgHR = Math.round(weekData.reduce((sum, d) => sum + d.heartRate, 0) / weekData.length);
        const avgScore = Math.round(weekData.reduce((sum, d) => sum + d.score, 0) / weekData.length);
        const alerts = weekData.filter(d => d.score < 60).length;
        
        document.getElementById('weeklyAvgHR').textContent = `${avgHR} bpm`;
        document.getElementById('weeklyBPTrend').textContent = 'Stable';
        document.getElementById('weeklyScoreTrend').textContent = avgScore >= 75 ? 'Improving ↗' : 'Stable →';
        document.getElementById('weeklyAlerts').textContent = alerts;
    }
    
}

function updateMonthlyReport() {
    const monthData = healthHistory.daily;
    
    if (monthData.length > 0) {
        const avgHR = Math.round(monthData.reduce((sum, d) => sum + d.heartRate, 0) / monthData.length);
        const normalDays = monthData.filter(d => d.score >= 60).length;
        const firstWeekScore = monthData.length > 0 ? monthData[0].score : 0;
        const lastWeekScore = monthData.length > 0 ? monthData[monthData.length - 1].score : 0;
        const scoreChange = lastWeekScore - firstWeekScore;
        
        document.getElementById('monthlyAvgHR').textContent = `${avgHR} bpm`;
        document.getElementById('monthlyScoreChange').textContent = `${scoreChange >= 0 ? '+' : ''}${scoreChange} points`;
        document.getElementById('monthlyNormalDays').textContent = `${normalDays}/${monthData.length} days`;
        document.getElementById('monthlyStatus').textContent = normalDays >= monthData.length * 0.8 ? 'Good' : 'Needs Attention';
    }
    
}


function exportReport(period) {
    const reportData = generateReportData(period);
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `health_report_${period}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showSuccessMessage(`${period.charAt(0).toUpperCase() + period.slice(1)} report exported successfully!`);
}

function generateReportData(period) {
    const now = new Date();
    let data;
    
    if (period === 'daily') {
        const today = now.toDateString();
        data = healthHistory.daily.filter(d => d.date === today);
    } else if (period === 'weekly') {
        data = healthHistory.daily.slice(-7);
    } else if (period === 'monthly') {
        data = healthHistory.daily;
    }
    
    return {
        period: period,
        generatedAt: now.toISOString(),
        data: data,
        summary: {
            averageHeartRate: data.length > 0 ? Math.round(data.reduce((sum, d) => sum + d.heartRate, 0) / data.length) : 0,
            averageScore: data.length > 0 ? Math.round(data.reduce((sum, d) => sum + d.score, 0) / data.length) : 0,
            totalReadings: data.length,
            normalDays: data.filter(d => d.score >= 60).length
        }
    };
}

function printReport(period) {
    const reportContent = document.getElementById(`${period}Report`).innerHTML;
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Health Report - ${period.charAt(0).toUpperCase() + period.slice(1)}</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h4 { color: #2c3e50; }
                .stat-item { margin: 10px 0; padding: 10px; background: #f8f9fa; border-radius: 5px; }
                .stat-label { font-weight: bold; }
                .stat-value { color: #3498db; font-size: 1.2em; }
            </style>
        </head>
        <body>
            <h2>Serene Retirement Village - Health Report</h2>
            <h3>${period.charAt(0).toUpperCase() + period.slice(1)} Report</h3>
            <p>Generated on: ${new Date().toLocaleString()}</p>
            ${reportContent}
        </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
    
    showSuccessMessage(`${period.charAt(0).toUpperCase() + period.slice(1)} report sent to printer!`);
}
// Weekly Schedule Functions
function showWeeklySchedule() {
    const modal = document.getElementById('weeklyScheduleModal');
    modal.style.display = 'block';
    updateWeeklyScheduleDisplay();
}

function updateWeeklyScheduleDisplay() {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    let scheduleHTML = '';
    
    days.forEach((day, index) => {
        const dayProgrammes = userSchedule[day];
        const freeSlots = calculateFreeTimeSlots(day);
        
        scheduleHTML += `
            <div class="schedule-day">
                <h4><i class="fas fa-calendar-day"></i> ${dayNames[index]}</h4>
        `;
        
        // Display user's scheduled programmes
        if (dayProgrammes.length > 0) {
            dayProgrammes.forEach(programme => {
                scheduleHTML += `
                    <div class="schedule-item user-programme">
                        <span class="time">${programme.time}</span>
                        <span class="programme-name ${programme.type}">${programme.name}</span>
                        <button class="remove-btn" onclick="removeProgrammeFromSchedule('${programme.name}', '${day}')" title="Remove from schedule">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;
            });
        } else {
            scheduleHTML += `
                <div class="schedule-item no-programme">
                    <span class="programme-name rest">No programmes scheduled</span>
                </div>
            `;
        }
        
        // Display free time slots
        scheduleHTML += `
            <div class="free-time-section">
                <h5><i class="fas fa-clock"></i> Free Time</h5>
        `;
        
        freeSlots.forEach(slot => {
            if (slot === 'Full day free') {
                scheduleHTML += `
                    <div class="schedule-item free-time">
                        <span class="programme-name free">${slot}</span>
                    </div>
                `;
            } else {
                scheduleHTML += `
                    <div class="schedule-item free-time">
                        <span class="time">${slot}</span>
                        <span class="programme-name free">Free Time</span>
                    </div>
                `;
            }
        });
        
        scheduleHTML += `
            </div>
            </div>
        `;
    });
    
    // Update the schedule container
    const scheduleContainer = document.querySelector('.schedule-container');
    if (scheduleContainer) {
        scheduleContainer.innerHTML = scheduleHTML;
    }
}

function printSchedule() {
    const scheduleContent = document.querySelector('.schedule-container').outerHTML;
    const legendContent = document.querySelector('.schedule-legend').outerHTML;
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Weekly Programme Schedule</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h2 { color: #2c3e50; text-align: center; }
                .schedule-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
                .schedule-day { background: #f8f9fa; border-radius: 10px; padding: 1.5rem; border-left: 4px solid #3498db; page-break-inside: avoid; }
                .schedule-day h4 { color: #2c3e50; margin-bottom: 1rem; font-size: 1.2rem; }
                .schedule-item { background: white; border-radius: 8px; padding: 0.8rem; margin-bottom: 1rem; border-left: 3px solid #ecf0f1; }
                .time { font-size: 0.9rem; color: #7f8c8d; font-weight: bold; }
                .programme-name { font-size: 1rem; color: #2c3e50; font-weight: 600; }
                .programme-name.free { color: #27ae60; }
                .programme-name.paid { color: #f39c12; }
                .programme-name.rest { color: #95a5a6; font-style: italic; }
                .schedule-legend { background: #f8f9fa; border-radius: 10px; padding: 1.5rem; }
                .schedule-legend h5 { color: #2c3e50; margin-bottom: 1rem; }
                .legend-item { display: flex; align-items: center; gap: 0.8rem; margin-bottom: 0.5rem; }
                .legend-color { width: 20px; height: 20px; border-radius: 4px; }
                .legend-color.free { background: #27ae60; }
                .legend-color.paid { background: #f39c12; }
                @media print { body { padding: 10px; } }
            </style>
        </head>
        <body>
            <h2>Serene Retirement Village - Weekly Programme Schedule</h2>
            <p style="text-align: center; color: #7f8c8d; margin-bottom: 2rem;">Generated on: ${new Date().toLocaleString()}</p>
            ${scheduleContent}
            ${legendContent}
        </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
    
    showSuccessMessage('Weekly schedule sent to printer!');
}

window.switchReportTab = switchReportTab;
window.exportReport = exportReport;
window.printReport = printReport;
window.showWeeklySchedule = showWeeklySchedule;
window.printSchedule = printSchedule;
window.removeProgrammeFromSchedule = removeProgrammeFromSchedule;
window.updateWeeklyScheduleDisplay = updateWeeklyScheduleDisplay;
window.addCalendarReminder = addCalendarReminder;
window.showReminderSuccessPopup = showReminderSuccessPopup;

// Calendar Reminder Function
function addCalendarReminder(programmeName, schedule) {
    // Parse the schedule to get next occurrence
    const nextOccurrence = getNextProgrammeDate(schedule);
    
    if (!nextOccurrence) {
        showSuccessMessage('Unable to determine next programme date. Please check the schedule.');
        return;
    }
    
    // Create calendar event details
    const eventTitle = `${programmeName} - Serene Retirement Village`;
    const eventDescription = `Join us for ${programmeName} at Serene Retirement Village. ${schedule}`;
    const eventLocation = 'Serene Retirement Village, 123, Jalan Serene, 50250 Kuala Lumpur';
    
    // Show success popup immediately
    showReminderSuccessPopup(programmeName, nextOccurrence);
    
    // Try to use Web Calendar API (if available)
    if ('share' in navigator && 'canShare' in navigator) {
        const calendarData = {
            title: eventTitle,
            text: eventDescription,
            url: 'https://sereneretirement.com',
            files: [createCalendarFile(nextOccurrence, eventTitle, eventDescription, eventLocation)]
        };
        
        if (navigator.canShare(calendarData)) {
            navigator.share(calendarData)
                .then(() => console.log('Calendar shared successfully'))
                .catch(() => fallbackToGoogleCalendar(nextOccurrence, eventTitle, eventDescription, eventLocation));
            return;
        }
    }
    
    // Fallback to Google Calendar
    fallbackToGoogleCalendar(nextOccurrence, eventTitle, eventDescription, eventLocation);
}

// Function to show reminder success popup
function showReminderSuccessPopup(programmeName, date) {
    const modal = document.getElementById('successModal');
    const messageElement = document.getElementById('successMessage');
    
    const formattedDate = date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const reminderMessage = `
        <div style="text-align: center; padding: 1rem;">
            <div style="font-size: 3rem; color: #27ae60; margin-bottom: 1rem;">
                <i class="fas fa-bell"></i>
            </div>
            <h3 style="color: #27ae60; margin-bottom: 1rem;">Reminder Set Successfully!</h3>
            <p style="font-size: 1.1rem; margin-bottom: 0.5rem;"><strong>${programmeName}</strong></p>
            <p style="color: #7f8c8d; margin-bottom: 1rem;">${formattedDate}</p>
            <p style="color: #3498db; font-size: 0.9rem;">You will receive a notification before the event starts.</p>
        </div>
    `;
    
    messageElement.innerHTML = reminderMessage;
    modal.style.display = 'block';
    
    // Auto-close after 4 seconds
    setTimeout(() => {
        closeModal('successModal');
    }, 4000);
}

function getNextProgrammeDate(schedule) {
    const now = new Date();
    const today = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Parse schedule to determine days
    let days = [];
    if (schedule.includes('Monday')) days.push(1);
    if (schedule.includes('Tuesday')) days.push(2);
    if (schedule.includes('Wednesday')) days.push(3);
    if (schedule.includes('Thursday')) days.push(4);
    if (schedule.includes('Friday')) days.push(5);
    if (schedule.includes('Saturday')) days.push(6);
    if (schedule.includes('Sunday')) days.push(0);
    
    // Parse time
    const timeMatch = schedule.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!timeMatch) return null;
    
    let [_, hours, minutes, period] = timeMatch;
    hours = parseInt(hours);
    minutes = parseInt(minutes);
    
    if (period.toUpperCase() === 'PM' && hours !== 12) hours += 12;
    if (period.toUpperCase() === 'AM' && hours === 12) hours = 0;
    
    // Find next occurrence
    let nextDate = new Date(now);
    let daysUntilNext = 7;
    
    for (let day of days) {
        let daysUntil = (day - today + 7) % 7;
        if (daysUntil === 0 && now.getHours() >= hours) {
            daysUntil = 7; // If today's time has passed, schedule for next week
        }
        if (daysUntil < daysUntilNext) {
            daysUntilNext = daysUntil;
        }
    }
    
    nextDate.setDate(now.getDate() + daysUntilNext);
    nextDate.setHours(hours, minutes, 0, 0);
    
    return nextDate;
}

function fallbackToGoogleCalendar(date, title, description, location) {
    const startDate = date.toISOString().replace(/-|:|\.\d\d\d/g, '');
    const endDate = new Date(date.getTime() + 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, ''); // +1 hour
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;
    
    // Open in new window
    window.open(googleCalendarUrl, '_blank');
    
    showSuccessMessage('Opening Google Calendar to add reminder...');
}

function createCalendarFile(date, title, description, location) {
    const startDate = date.toISOString().replace(/-|:|\.\d\d\d/g, '');
    const endDate = new Date(date.getTime() + 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, '');
    
    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Serene Retirement Village//Programme Reminder//EN',
        'BEGIN:VEVENT',
        `DTSTART:${startDate}`,
        `DTEND:${endDate}`,
        `SUMMARY:${title}`,
        `DESCRIPTION:${description}`,
        `LOCATION:${location}`,
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n');
    
    return new Blob([icsContent], { type: 'text/calendar' });
}

// Contact Form Function
function handleContactSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const contactData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        subject: formData.get('subject'),
        message: formData.get('message'),
        newsletter: formData.get('newsletter') === 'on'
    };
    
    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate sending message
    setTimeout(() => {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Show success message
        showContactSuccessMessage(contactData);
        
        // Reset form
        event.target.reset();
        
        // Log contact data (in real app, this would be sent to server)
        console.log('Contact form submitted:', contactData);
    }, 2000);
}

function showContactSuccessMessage(contactData) {
    const modal = document.getElementById('successModal');
    const messageElement = document.getElementById('successMessage');
    
    const successMessage = `
        <div style="text-align: center; padding: 1rem;">
            <div style="font-size: 3rem; color: #27ae60; margin-bottom: 1rem;">
                <i class="fas fa-check-circle"></i>
            </div>
            <h3 style="color: #27ae60; margin-bottom: 1rem;">Message Sent Successfully!</h3>
            <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">Thank you, ${contactData.firstName} ${contactData.lastName}!</p>
            <p style="color: #7f8c8d; margin-bottom: 1rem;">We have received your message regarding "${contactData.subject}" and will get back to you within 24 hours.</p>
            <p style="color: #3498db; font-size: 0.9rem;">We've sent a confirmation email to ${contactData.email}.</p>
        </div>
    `;
    
    messageElement.innerHTML = successMessage;
    modal.style.display = 'block';
    
    // Auto-close after 5 seconds
    setTimeout(() => {
        closeModal('successModal');
    }, 5000);
}

// Job Application Function
function applyForJob(jobTitle) {
    const modal = document.getElementById('successModal');
    const messageElement = document.getElementById('successMessage');
    
    const applicationMessage = `
        <div style="text-align: center; padding: 1rem;">
            <div style="font-size: 3rem; color: #3498db; margin-bottom: 1rem;">
                <i class="fas fa-briefcase"></i>
            </div>
            <h3 style="color: #3498db; margin-bottom: 1rem;">Apply for ${jobTitle}</h3>
            <p style="font-size: 1.1rem; margin-bottom: 1.5rem;">Thank you for your interest in the ${jobTitle} position!</p>
            
            <div style="text-align: left; background: #f8f9fa; padding: 1.5rem; border-radius: 10px; margin-bottom: 1.5rem;">
                <h4 style="color: #2c3e50; margin-bottom: 1rem;">How to Apply:</h4>
                <ol style="color: #7f8c8d; line-height: 1.8; padding-left: 1.5rem;">
                    <li>Send your updated resume to <strong>careers@sereneretirement.com</strong></li>
                    <li>Include a cover letter explaining why you're interested in this position</li>
                    <li>Use subject line: <strong>"Application for ${jobTitle}"</strong></li>
                    <li>Our HR team will review your application and contact you within 5-7 business days</li>
                </ol>
            </div>
            
            <div style="text-align: left; background: #e8f4fd; padding: 1.5rem; border-radius: 10px; margin-bottom: 1.5rem;">
                <h4 style="color: #2c3e50; margin-bottom: 1rem;">Position Requirements:</h4>
                <ul style="color: #7f8c8d; line-height: 1.6; padding-left: 1.5rem;">
                    <li>Relevant qualifications and experience in the field</li>
                    <li>Passion for working with seniors</li>
                    <li>Excellent communication and interpersonal skills</li>
                    <li>Ability to work in a team environment</li>
                    <li>Relevant certifications (if applicable)</li>
                </ul>
            </div>
            
            <div style="text-align: left; background: #f0f9ff; padding: 1.5rem; border-radius: 10px; margin-bottom: 1.5rem;">
                <h4 style="color: #2c3e50; margin-bottom: 1rem;">What We Offer:</h4>
                <ul style="color: #7f8c8d; line-height: 1.6; padding-left: 1.5rem;">
                    <li>Competitive salary and benefits package</li>
                    <li>Professional development opportunities</li>
                    <li>Supportive and collaborative work environment</li>
                    <li>Opportunity to make a meaningful difference</li>
                    <li>Career advancement prospects</li>
                </ul>
            </div>
            
            <p style="color: #27ae60; font-weight: bold;">We look forward to hearing from you!</p>
        </div>
    `;
    
    messageElement.innerHTML = applicationMessage;
    
    // Add scrollable class for longer content
    modal.querySelector('.modal-content').classList.add('scrollable');
    
    modal.style.display = 'block';
    
    // Don't auto-close for job applications - user needs to read the instructions
}

// Add new functions to global scope
window.handleContactSubmit = handleContactSubmit;
window.applyForJob = applyForJob;
window.getDirections = getDirections;
window.copyAddress = copyAddress;

// Map Functions
function getDirections() {
    const destination = "Serene Retirement Village, 123, Jalan Serene, 50250 Kuala Lumpur, Malaysia";
    const encodedDestination = encodeURIComponent(destination);
    
    // Check if user is on mobile device
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        // Open in Google Maps app for mobile
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedDestination}`, '_blank');
    } else {
        // Open in Google Maps web version for desktop
        window.open(`https://www.google.com/maps/search/?api=1&query=${encodedDestination}`, '_blank');
    }
    
    showSuccessMessage('Opening Google Maps for directions...');
}

function copyAddress() {
    const address = "Serene Retirement Village\n123, Jalan Serene\n50250 Kuala Lumpur\nMalaysia";
    
    // Use modern Clipboard API if available
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(address).then(() => {
            showSuccessMessage('Address copied to clipboard!');
        }).catch(() => {
            // Fallback method
            fallbackCopyTextToClipboard(address);
        });
    } else {
        // Fallback for older browsers
        fallbackCopyTextToClipboard(address);
    }
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showSuccessMessage('Address copied to clipboard!');
    } catch (err) {
        showSuccessMessage('Failed to copy address. Please copy manually.');
    }
    
    document.body.removeChild(textArea);
}

// Guardian Room Access Function
function handleGuardianAccess(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const accessData = {
        roomNumber: formData.get('roomNumber'),
        accessCode: formData.get('accessCode'),
        guardianName: formData.get('guardianName'),
        relationship: formData.get('relationship')
    };
    
    // Validate access code (6 digits)
    if (accessData.accessCode.length !== 6 || !/^\d{6}$/.test(accessData.accessCode)) {
        showGuardianAccessError('Please enter a valid 6-digit access code.');
        return;
    }
    
    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Accessing...';
    submitBtn.disabled = true;
    
    // Simulate authentication process
    setTimeout(() => {
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Simulate successful access (in real app, this would verify with backend)
        if (accessData.accessCode === '123456') {
            showGuardianAccessSuccess(accessData);
        } else {
            showGuardianAccessError('Invalid access code. Please check and try again.');
        }
        
        // Log access attempt (in real app, this would be sent to server)
        console.log('Guardian access attempt:', accessData);
    }, 2000);
}

function showGuardianAccessSuccess(accessData) {
    // Close the success modal and open the dedicated guardian room monitoring modal
    closeModal('successModal');
    openGuardianRoomMonitoring(accessData);
}

function openGuardianRoomMonitoring(accessData) {
    const modal = document.getElementById('guardianRoomModal');
    
    // Update modal with guardian information
    document.getElementById('monitoringRoomNumber').textContent = accessData.roomNumber;
    document.getElementById('guardianNameDisplay').textContent = accessData.guardianName;
    document.getElementById('relationshipDisplay').textContent = accessData.relationship.charAt(0).toUpperCase() + accessData.relationship.slice(1);
    document.getElementById('sessionStartTime').textContent = new Date().toLocaleString();
    
    // Start live timestamp
    startLiveTimestamp();
    
    // Add initial activity log entries
    addActivityLogEntry('Session started - Guardian connected');
    addActivityLogEntry(`Room ${accessData.roomNumber} camera activated`);
    addActivityLogEntry('Recording started');
    
    // Show the modal
    modal.style.display = 'block';
    
    // Log successful access
    console.log('Guardian room monitoring started:', accessData);
}

function startLiveTimestamp() {
    const timestampElement = document.getElementById('liveTimestamp');
    if (!timestampElement) return;
    
    let seconds = 0;
    
    // Update timestamp every second
    const interval = setInterval(() => {
        seconds++;
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        const formattedTime =
            String(hours).padStart(2, '0') + ':' +
            String(minutes).padStart(2, '0') + ':' +
            String(secs).padStart(2, '0');
        
        timestampElement.textContent = formattedTime;
        
        // Clear interval when modal is closed
        if (document.getElementById('guardianRoomModal').style.display === 'none') {
            clearInterval(interval);
        }
    }, 1000);
}

function addActivityLogEntry(message) {
    const logEntries = document.getElementById('activityLogEntries');
    if (!logEntries) return;
    
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour12: false });
    
    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry';
    logEntry.innerHTML = `
        <span class="log-time">${timeString}</span>
        <span class="log-text">${message}</span>
    `;
    
    // Add to the top of the log
    logEntries.insertBefore(logEntry, logEntries.firstChild);
    
    // Keep only the last 10 entries
    while (logEntries.children.length > 10) {
        logEntries.removeChild(logEntries.lastChild);
    }
}

function toggleAudio() {
    const audioToggle = document.getElementById('audioToggle');
    const icon = audioToggle.querySelector('i');
    const text = audioToggle.querySelector('span');
    
    if (icon.classList.contains('fa-microphone')) {
        icon.className = 'fas fa-microphone-slash';
        text.textContent = 'Unmute';
        addActivityLogEntry('Audio muted');
    } else {
        icon.className = 'fas fa-microphone';
        text.textContent = 'Mute';
        addActivityLogEntry('Audio unmuted');
    }
}

function toggleRecording() {
    const recordingToggle = document.getElementById('recordingToggle');
    const icon = recordingToggle.querySelector('i');
    const text = recordingToggle.querySelector('span');
    
    if (icon.classList.contains('fa-record-vinyl')) {
        icon.className = 'fas fa-stop';
        text.textContent = 'Start Recording';
        addActivityLogEntry('Recording stopped');
    } else {
        icon.className = 'fas fa-record-vinyl';
        text.textContent = 'Stop Recording';
        addActivityLogEntry('Recording started');
    }
}

function takeSnapshot() {
    addActivityLogEntry('Snapshot captured');
    showSuccessMessage('Snapshot captured successfully!');
}

function endMonitoringSession() {
    addActivityLogEntry('Session ended by guardian');
    closeModal('guardianRoomModal');
    showSuccessMessage('Monitoring session ended successfully. Thank you for using our guardian monitoring system.');
}

function showGuardianAccessError(errorMessage) {
    const modal = document.getElementById('successModal');
    const messageElement = document.getElementById('successMessage');
    
    const errorContent = `
        <div style="text-align: center; padding: 1rem;">
            <div style="font-size: 3rem; color: #e74c3c; margin-bottom: 1rem;">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <h3 style="color: #e74c3c; margin-bottom: 1rem;">Access Denied</h3>
            <p style="color: #7f8c8d; margin-bottom: 1.5rem;">${errorMessage}</p>
            
            <div style="background: #fdf2f2; padding: 1.5rem; border-radius: 10px; margin-bottom: 1.5rem; text-align: left;">
                <h4 style="color: #2c3e50; margin-bottom: 1rem;">Troubleshooting:</h4>
                <ul style="color: #7f8c8d; line-height: 1.6; padding-left: 1.5rem;">
                    <li>Ensure you have the correct 6-digit access code</li>
                    <li>Check that the room number is correct</li>
                    <li>Contact the reception if you continue to have issues</li>
                    <li>Access codes are case-sensitive and expire after 24 hours</li>
                </ul>
            </div>
            
            <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                <p style="margin: 0; color: #7f8c8d; font-size: 0.9rem;">
                    <strong>Need help?</strong> Call our reception: <a href="tel:+603-1234-5678" style="color: #3498db;">+603-1234-5678</a>
                </p>
            </div>
            
            <button onclick="closeModal('successModal')" class="btn btn-primary" style="padding: 0.8rem 1.5rem;">
                <i class="fas fa-redo"></i> Try Again
            </button>
        </div>
    `;
    
    messageElement.innerHTML = errorContent;
    modal.style.display = 'block';
}

function toggleFullscreen() {
    // In a real application, this would toggle fullscreen mode for the video feed
    showSuccessMessage('Fullscreen mode activated. Press ESC to exit.');
}

// Add guardian access function to global scope
window.handleGuardianAccess = handleGuardianAccess;
window.toggleFullscreen = toggleFullscreen;

// Add emergency functions to global scope
window.callEmergencyServices = callEmergencyServices;
window.makeEmergencyCall = makeEmergencyCall;
window.notifyFamily = notifyFamily;
window.sendFamilyNotifications = sendFamilyNotifications;
window.copyEmergencyAddress = copyEmergencyAddress;