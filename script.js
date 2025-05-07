
// Location Detection
function showLocation(latitude, longitude, city, region, country) {
    document.getElementById('location').textContent =
        `${city}, ${region}, ${country} (Latitude: ${latitude.toFixed(4)}, Longitude: ${longitude.toFixed(4)})`;
    loadISSFlyovers(latitude, longitude);
}

function lookupByIP() {
    fetch('https://ipapi.co/json/')
        .then(res => {
            if (!res.ok) throw new Error(res.status);
            return res.json();
        })
        .then(data => {
            // ipapi.co returns: city, region, country_name, latitude, longitude
            showLocation(
                data.latitude,
                data.longitude,
                data.city || 'Unknown city',
                data.region || 'Unknown region',
                data.country_name || 'Unknown country'
            );
        })
        .catch(err => {
            console.error('IP lookup error:', err);
            document.getElementById('location').textContent =
                'IP lookup failed; please try again later.';
        });
}

// On page load, try browser geolocation first, then fallback to IP
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            pos => {
                showLocation(
                    pos.coords.latitude,
                    pos.coords.longitude,
                    'Browser coordinates',
                    '',
                    ''
                );
            },
            err => {
                console.warn('Browser geolocation failed, falling back to IP:', err);
                lookupByIP();
            },
            { timeout: 10000 }
        );
    } else {
        lookupByIP();
    }
}

document.addEventListener('DOMContentLoaded', getLocation);


// Load ISS Flyovers
// function loadISSFlyovers(latitude, longitude) {
//     fetch(`https://api.open-notify.org/iss-pass.json?lat=${latitude}&lon=${longitude}`)
//         .then(res => res.json())
//         .then(data => {
//             const passes = data.response;
//             let html = '<ul>';
//             passes.forEach(pass => {
//                 const date = new Date(pass.risetime * 1000);
//                 html += `<li>${date.toLocaleString()} for ${pass.duration} seconds</li>`;
//             });
//             html += '</ul>';
//             document.getElementById('issData').innerHTML = html;
//         })
//         .catch(error => {
//             console.error("ISS data fetch error:", error);
//             document.getElementById('issData').textContent = "Failed to load ISS data.";
//         });
// }
// Load Astronomy Picture of the Day
function loadAPOD() {
    fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY')
        .then(res => res.json())
        .then(data => {
            const html = `
            <h3>${data.title}</h3>
            <img src="${data.url}" alt="${data.title}" style="max-width:100%; border-radius: 8px;" />
            <p>${data.explanation}</p>
          `;
            document.getElementById('apodData').innerHTML = html;
        });
}

// Initialize
getLocation();
loadAPOD();