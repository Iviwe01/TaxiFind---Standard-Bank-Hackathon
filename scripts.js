// Weather update function
function updateWeather() {
    const temp = Math.floor(Math.random() * 15) + 15;
    const humidity = Math.floor(Math.random() * 40) + 40;
    const windSpeed = Math.floor(Math.random() * 20) + 5;

    document.getElementById('temp').textContent = temp;
    document.getElementById('humidity').textContent = humidity;
    document.getElementById('wind').textContent = windSpeed;

    const weatherIcon = document.querySelector('#weather-icon i');
    weatherIcon.className = '';

    if (temp < 20) {
        weatherIcon.className = Math.random() < 0.5 ? 'fas fa-cloud' : 'fas fa-cloud-sun';
    } else if (temp < 25) {
        weatherIcon.className = Math.random() < 0.7 ? 'fas fa-sun' : 'fas fa-cloud-sun';
    } else {
        weatherIcon.className = Math.random() < 0.8 ? 'fas fa-sun' : 'fas fa-temperature-high';
    }

    if (Math.random() < 0.2) {
        weatherIcon.className = 'fas fa-cloud-rain';
    } else if (Math.random() < 0.1) {
        weatherIcon.className = 'fas fa-wind';
    }
}

// ETA update function
function updateETA() {
    const now = new Date();
    const minutes = Math.floor(Math.random() * 30) + 1;
    now.setMinutes(now.getMinutes() + minutes);
    const eta = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    document.getElementById('eta-time').textContent = eta;
}

// Driver data
const driverNames = ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Williams", "David Brown", "Iviwe Mtambeka", "Sive Bulobane"];
const carDescriptions = ["White Toyota Quantam (CAA 45763)", "Blue Toyota Minivan (CA 65663)", "Red GL-18 (CF 54356)", "Silver Toyota Avanza (LS 35 TG FP)", "Black Toyota Quantam (CAA 708547)"];

function generatePhoneNumber() {
    return `+27 ${Math.floor(Math.random() * 100)} ${Math.floor(Math.random() * 1000)} ${Math.floor(Math.random() * 10000)}`;
}

// Display available drivers
function displayDrivers() {
    const driverList = document.getElementById('driver-list');
    driverList.innerHTML = '';

    const numDrivers = Math.floor(Math.random() * 3) + 2; // 2 to 4 drivers
    const isEcoFriendly = document.getElementById('eco-friendly-checkbox').checked;
    const preferredLanguage = document.getElementById('language-select').value;

    for (let i = 0; i < numDrivers; i++) {
        const availableSeats = Math.floor(Math.random() * 15) + 1; // 1 to 15 seats
        const isDisabilityFriendly = Math.random() < 0.3; // 30% chance of being disability-friendly
        const isEcoFriendlyVehicle = Math.random() < 0.4; // 40% chance of being eco-friendly
        const driverLanguage = ['any', 'english', 'afrikaans', 'xhosa', 'zulu'][Math.floor(Math.random() * 5)];
        
        if ((isEcoFriendly && !isEcoFriendlyVehicle) || (preferredLanguage !== 'any' && preferredLanguage !== driverLanguage)) {
            continue; // Skip this driver if they don't meet the eco-friendly or language requirements
        }
        
        const driverInfo = document.createElement('div');
        driverInfo.className = 'driver-info';
        
        driverInfo.innerHTML = `
            <p><strong>Driver:</strong> ${driverNames[Math.floor(Math.random() * driverNames.length)]}</p>
            <p><strong>Car:</strong> ${carDescriptions[Math.floor(Math.random() * carDescriptions.length)]}</p>
            <p><strong>Phone:</strong> ${generatePhoneNumber()}</p>
            <p><strong>Available Seats:</strong> ${availableSeats}</p>
            <p><strong>Language:</strong> ${driverLanguage.charAt(0).toUpperCase() + driverLanguage.slice(1)}</p>
            ${isDisabilityFriendly ? '<p><strong>Accessibility-Friendly Vehicle</strong></p>' : ''}
            ${isEcoFriendlyVehicle ? '<p><strong>Eco-Friendly Vehicle</strong></p>' : ''}
            <button class="select-driver">Select Driver</button>
        `;
        driverList.appendChild(driverInfo);

        const selectButton = driverInfo.querySelector('.select-driver');
        selectButton.addEventListener('click', () => selectDriver(driverInfo));
    }
}

// Driver selection function
function selectDriver(driverInfo) {
    showNotification('Driver selected. They are now en route.');

    // Disable all select buttons
    const selectButtons = document.querySelectorAll('.select-driver');
    selectButtons.forEach(button => button.disabled = true);

    // Update the selected driver's info
    const seatsInfo = driverInfo.querySelector('p:nth-of-type(4)');
    const currentSeats = parseInt(seatsInfo.textContent.match(/\d+/)[0]);
    seatsInfo.textContent = `Available Seats: ${currentSeats - 1}`;
}

// Notification function
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
        document.body.removeChild(notification);
    }, 5000);
}

// Event Listeners
document.getElementById('confirm-route').addEventListener('click', function() {
    const pickup = document.getElementById('pickup-location').value;
    const destination = document.getElementById('destination').value;
    
    if (pickup && destination) {
        updateETA();
        displayDrivers();
    } else {
        showNotification('Please enter both pickup location and destination.');
    }
});

document.getElementById('location-icon').addEventListener('click', function() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            
            // Use a reverse geocoding service to get the location name
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
                .then(response => response.json())
                .then(data => {
                    const locationName = data.address.city || data.address.town || data.address.village || 'Current Location';
                    document.getElementById('pickup-location').value = locationName;
                })
                .catch(error => {
                    console.error('Error fetching location name:', error);
                    document.getElementById('pickup-location').value = 'Current Location';
                });
        }, function(error) {
            console.error('Error getting location:', error);
            showNotification("Unable to get your current location. Please enter it manually.");
        });
    } else {
        showNotification("Geolocation is not available in your browser.");
    }
});

document.getElementById('emergency-btn').addEventListener('click', function() {
    showNotification('Emergency services have been notified. Help is on the way.');
});

document.getElementById('share-trip').addEventListener('click', function() {
    const tripDetails = `Pickup: ${document.getElementById('pickup-location').value}\nDestination: ${document.getElementById('destination').value}\nETA: ${document.getElementById('eta-time').textContent}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'My TaxiTrack Pro Trip',
            text: tripDetails,
        })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else {
        showNotification('Share feature is not supported on this browser. Trip details:\n\n' + tripDetails);
    }
});

document.getElementById('disability-checkbox').addEventListener('change', function() {
    document.getElementById('disability-details').style.display = this.checked ? 'block' : 'none';
});

document.getElementById('submit-disability').addEventListener('click', function() {
    const disabilityType = document.getElementById('disability-type').value;
    if (disabilityType) {
        showNotification('Accessibility information sent. A suitable driver will be assigned.');
    } else {
        showNotification('Please enter the type of assistance needed.');
    }
});

// Eco-friendly option
document.getElementById('eco-friendly-checkbox').addEventListener('change', function() {
    if (this.checked) {
        showNotification('Eco-friendly vehicle requested. This may affect availability and wait times.');
    }
});

// Language preference
document.getElementById('language-select').addEventListener('change', function() {
    showNotification(`Driver with ${this.value} language preference will be prioritized.`);
});

// Safety tips
const safetyTips = [
    "Share your trip details with a trusted contact.",
    "Verify your driver's identity before entering the vehicle.",
    "Always wear your seatbelt.",
    "Trust your instincts. If something feels off, don't get in the car.",
    "Keep valuables out of sight.",
    "Sit in the back seat, especially if you're riding alone.",
    "Be aware of your surroundings when entering and exiting the vehicle.",
    "Avoid sharing personal information with your driver.",
    "If possible, travel with a friend, especially at night.",
    "Use the in-app emergency button if you feel unsafe during your ride."
];

function displayRandomSafetyTips() {
    const tipsToShow = 3;
    const shuffled = safetyTips.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, tipsToShow);
    
    const tipsList = document.getElementById('safety-tips-list');
    tipsList.innerHTML = '';
    selected.forEach(tip => {
        const li = document.createElement('li');
        li.textContent = tip;
        tipsList.appendChild(li);
    });
}

// Star rating system
const stars = document.querySelectorAll('.star');
let currentRating = 0;

stars.forEach(star => {
    star.addEventListener('click', () => {
        currentRating = parseInt(star.getAttribute('data-value'));
        updateStars();
    });

    star.addEventListener('mouseover', () => {
        highlightStars(parseInt(star.getAttribute('data-value')));
    });

    star.addEventListener('mouseout', () => {
        highlightStars(currentRating);
    });
});

function updateStars() {
    stars.forEach((star, index) => {
        star.classList.toggle('active', index < currentRating);
    });
}

function highlightStars(count) {
    stars.forEach((star, index) => {
        star.classList.toggle('active', index < count);
    });
}

// Initial calls
updateWeather();
setInterval(updateWeather, 300000); // Update weather every 5 minutes
displayRandomSafetyTips();
setInterval(displayRandomSafetyTips, 300000); // Refresh safety tips every 5 minutes