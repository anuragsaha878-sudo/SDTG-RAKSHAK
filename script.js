/* ============================================
   SDTG | RAKSHAK - JAVASCRIPT FUNCTIONALITY
   ============================================ */

/* Test Coordinates */
const TEST_LATITUDE = 22.479952;
const TEST_LONGITUDE = 88.369472;

/* Custom Map URL */
const CUSTOM_MAP_URL = 'https://maps.app.goo.gl/uPXcNG68W1B5ii8R8?g_st=aw';

/* Tracking Variables */
let isTracking = false;
let trackingInterval = null;

/* Initialize on page load */
window.addEventListener('DOMContentLoaded', () => {
    showTestLocation();
    logEvent('System initialized', 'success');
});

/* ============================================
   UPDATE DISPLAY FUNCTION
   ============================================ */

function updateDisplay(lat, lon, locationName = 'Test Location') {
    document.getElementById('latitude').textContent = lat.toFixed(6);
    document.getElementById('longitude').textContent = lon.toFixed(6);
    document.getElementById('locationName').textContent = locationName;
    updateMap(lat, lon);
    updateStatus();
    logEvent(`Location updated: ${locationName}`, 'success');
}

/* ============================================
   SHOW TEST LOCATION
   ============================================ */

function showTestLocation() {
    updateDisplay(TEST_LATITUDE, TEST_LONGITUDE, 'Test Location - RAKSHAK HQ');
    document.getElementById('gpsStatus').textContent = 'TEST MODE';
    logEvent('Test location displayed', 'warning');
}

/* ============================================
   USE GPS FUNCTION
   ============================================ */

function useGPS() {
    document.getElementById('gpsStatus').textContent = 'REQUESTING...';
    logEvent('GPS request initiated', 'warning');

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const accuracy = position.coords.accuracy;
                const altitude = position.coords.altitude;

                updateDisplay(lat, lon, 'Current Location (GPS)');
                document.getElementById('gpsStatus').textContent = 'ACTIVE';
                document.getElementById('accuracyStatus').textContent = accuracy ? accuracy.toFixed(2) + ' m' : '--';
                document.getElementById('altitudeStatus').textContent = altitude ? altitude.toFixed(2) + ' m' : '--';
                logEvent(`GPS acquired - Accuracy: ${accuracy.toFixed(2)}m`, 'success');
            },
            (error) => {
                document.getElementById('gpsStatus').textContent = 'ERROR';
                logEvent(`GPS Error: ${error.message}`, 'error');
                alert('GPS Error: ' + error.message);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    } else {
        alert('Geolocation is not supported by your browser');
        document.getElementById('gpsStatus').textContent = 'NOT SUPPORTED';
        logEvent('Geolocation not supported', 'error');
    }
}

/* ============================================
   UPDATE MAP - USES CUSTOM MAP URL
   ============================================ */

function updateMap(lat, lon) {
    // Use embedded Google Maps with coordinates
    const mapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.555!2d${lon}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM0MwMCcwMC4wIk4gODhjMjInMDcuNyJF!5e0!3m2!1sen!2sin!4v`;
    document.getElementById('mapFrame').src = mapUrl;
}

/* ============================================
   OPEN GOOGLE MAPS - USES CUSTOM MAP
   ============================================ */

function openGoogleMaps() {
    const lat = document.getElementById('latitude').textContent;
    const lon = document.getElementById('longitude').textContent;

    if (lat === '--' || lon === '--') {
        alert('No coordinates available');
        logEvent('Google Maps - No coordinates', 'error');
        return;
    }

    // Open the custom map URL
    window.open(CUSTOM_MAP_URL, '_blank');
    logEvent('Custom Google Maps opened', 'success');
}

/* ============================================
   COPY COORDINATES
   ============================================ */

function copyCoordinates() {
    const lat = document.getElementById('latitude').textContent;
    const lon = document.getElementById('longitude').textContent;

    if (lat === '--' || lon === '--') {
        alert('No coordinates to copy');
        logEvent('Copy - No coordinates available', 'error');
        return;
    }

    const text = `${lat}, ${lon}`;
    navigator.clipboard.writeText(text).then(() => {
        alert('Coordinates copied: ' + text);
        logEvent('Coordinates copied to clipboard', 'success');
    }).catch(() => {
        alert('Failed to copy coordinates');
        logEvent('Failed to copy coordinates', 'error');
    });
}

/* ============================================
   SHARE LOCATION
   ============================================ */

function shareLocation() {
    const lat = document.getElementById('latitude').textContent;
    const lon = document.getElementById('longitude').textContent;
    const locationName = document.getElementById('locationName').textContent;

    if (lat === '--' || lon === '--') {
        alert('No coordinates to share');
        logEvent('Share - No coordinates', 'error');
        return;
    }

    const shareText = `SDTG Location: ${locationName}\nCoordinates: ${lat}, ${lon}\nGoogle Maps: ${CUSTOM_MAP_URL}`;

    if (navigator.share) {
        navigator.share({
            title: 'SDTG Location - RAKSHAK',
            text: shareText,
            url: CUSTOM_MAP_URL
        }).then(() => {
            logEvent('Location shared successfully', 'success');
        }).catch(err => {
            logEvent('Share cancelled', 'warning');
        });
    } else {
        alert('Sharing not supported on this device. Map link copied instead.');
        navigator.clipboard.writeText(CUSTOM_MAP_URL);
        logEvent('Share not supported - Map link copied', 'warning');
    }
}

/* ============================================
   UPDATE STATUS
   ============================================ */

function updateStatus() {
    document.getElementById('locationStatus').textContent = 'ACTIVE';
}

/* ============================================
   LOGGING FUNCTION
   ============================================ */

function logEvent(message, type = 'info') {
    const logDiv = document.getElementById('log');
    const timestamp = new Date().toLocaleTimeString();
    const newLog = document.createElement('div');
    newLog.className = `log-entry ${type} new-entry`;
    newLog.textContent = `[${timestamp}] ${message}`;
    logDiv.appendChild(newLog);

    // Auto scroll to bottom
    logDiv.scrollTop = logDiv.scrollHeight;

    // Remove animation class after animation completes
    setTimeout(() => {
        newLog.classList.remove('new-entry');
    }, 300);
}

/* ============================================
   CLEAR LOG
   ============================================ */

function clearLog() {
    const logDiv = document.getElementById('log');
    logDiv.innerHTML = '';
    logEvent('Log cleared', 'info');
}

/* ============================================
   TRACK LOCATION (CONTINUOUS)
   ============================================ */

function trackLocation() {
    if (isTracking) {
        alert('Tracking already active');
        return;
    }

    isTracking = true;
    document.getElementById('gpsStatus').textContent = 'TRACKING...';
    logEvent('Location tracking started', 'success');

    if (navigator.geolocation) {
        trackingInterval = navigator.geolocation.watchPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const accuracy = position.coords.accuracy;

                document.getElementById('latitude').textContent = lat.toFixed(6);
                document.getElementById('longitude').textContent = lon.toFixed(6);
                document.getElementById('accuracyStatus').textContent = accuracy ? accuracy.toFixed(2) + ' m' : '--';
                updateMap(lat, lon);
                updateStatus();
                logEvent(`Tracking update - Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`, 'info');
            },
            (error) => {
                document.getElementById('gpsStatus').textContent = 'TRACKING ERROR';
                logEvent(`Tracking Error: ${error.message}`, 'error');
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    } else {
        alert('Geolocation is not supported');
        isTracking = false;
        logEvent('Geolocation not supported', 'error');
    }
}

/* ============================================
   STOP TRACKING
   ============================================ */

function stopTracking() {
    if (!isTracking) {
        alert('Tracking not active');
        return;
    }

    isTracking = false;
    if (trackingInterval !== null) {
        navigator.geolocation.clearWatch(trackingInterval);
        trackingInterval = null;
    }

    document.getElementById('gpsStatus').textContent = 'STOPPED';
    logEvent('Location tracking stopped', 'success');
}

/* ============================================
   RESET DASHBOARD
   ============================================ */

function resetDashboard() {
    if (confirm('Reset dashboard? All data will be cleared.')) {
        stopTracking();
        document.getElementById('latitude').textContent = '--';
        document.getElementById('longitude').textContent = '--';
        document.getElementById('locationName').textContent = 'Test Location';
        document.getElementById('locationStatus').textContent = 'LOADING';
        document.getElementById('gpsStatus').textContent = 'TEST MODE';
        document.getElementById('altitudeStatus').textContent = '--';
        document.getElementById('accuracyStatus').textContent = '--';
        document.getElementById('mapFrame').src = '';
        logEvent('Dashboard reset', 'warning');
    }
}

/* ============================================
   KEYBOARD SHORTCUTS
   ============================================ */

document.addEventListener('keydown', (event) => {
    // Alt + G = Get GPS
    if (event.altKey && event.key === 'g') {
        useGPS();
    }
    // Alt + T = Show Test Location
    if (event.altKey && event.key === 't') {
        showTestLocation();
    }
    // Alt + C = Copy Coordinates
    if (event.altKey && event.key === 'c') {
        copyCoordinates();
    }
});

/* ============================================
   DEVICE ORIENTATION CHANGES
   ============================================ */

window.addEventListener('orientationchange', () => {
    logEvent('Device orientation changed', 'info');
});

/* ============================================
   INTERNET CONNECTION CHECK
   ============================================ */

window.addEventListener('online', () => {
    logEvent('Internet connection restored', 'success');
});

window.addEventListener('offline', () => {
    logEvent('Internet connection lost', 'error');
});

/* ============================================
   BATTERY STATUS (if available)
   ============================================ */

if (navigator.getBattery) {
    navigator.getBattery().then((battery) => {
        battery.addEventListener('levelchange', () => {
            logEvent(`Battery level: ${(battery.level * 100).toFixed(0)}%`, 'info');
        });
    });
}
