async function fetchIPData() {
    try {
        // Show loading state
        document.getElementById('ip-address').textContent = 'Loading...';
        document.getElementById('location').textContent = 'Detecting...';
        document.getElementById('city').textContent = '-';
        document.getElementById('country').textContent = '-';
        document.getElementById('isp').textContent = '-';
        document.getElementById('error-message').textContent = '';
        
        // First get IP address
        let ipData;
        try {
            const ipResponse = await fetch('https://api.ipify.org?format=json');
            if (!ipResponse.ok) throw new Error("IP API failed");
            ipData = await ipResponse.json();
        } catch (ipError) {
            // Fallback IP API
            console.log("Primary IP API failed, trying fallback...");
            const fallbackIpResponse = await fetch('https://api.ipregistry.co/?key=tryout');
            if (!fallbackIpResponse.ok) throw new Error("All IP APIs failed");
            const fallbackData = await fallbackIpResponse.json();
            ipData = { ip: fallbackData.ip };
        }
        
        document.getElementById('ip-address').textContent = ipData.ip;
        
        // Then get location details
        let geoData;
        try {
            const geoResponse = await fetch(`https://ipapi.co/${ipData.ip}/json/`);
            if (!geoResponse.ok) throw new Error("Primary Geo API failed");
            geoData = await geoResponse.json();
        } catch (geoError) {
            console.log("Primary Geo API failed, trying fallback...");
            // Fallback geolocation API
            const fallbackGeoResponse = await fetch(`https://ipinfo.io/${ipData.ip}/json`);
            if (!fallbackGeoResponse.ok) throw new Error("All Geo APIs failed");
            const fallbackGeoData = await fallbackGeoResponse.json();
            
            // Convert ipinfo format to match ipapi format
            const [city, region, country] = fallbackGeoData.loc ? 
                fallbackGeoData.loc.split(',') : ['Unknown', 'Unknown', 'Unknown'];
            geoData = {
                city: fallbackGeoData.city || 'Unknown',
                country_name: fallbackGeoData.country || 'Unknown',
                org: fallbackGeoData.org || 'Unknown',
                region: fallbackGeoData.region || 'Unknown'
            };
        }
        
        // Update all fields
        document.getElementById('location').textContent = 
            `${geoData.city || 'Unknown'}, ${geoData.region || geoData.country_name || 'Unknown'}`;
        document.getElementById('city').textContent = geoData.city || 'Unknown';
        document.getElementById('country').textContent = geoData.country_name || geoData.country || 'Unknown';
        document.getElementById('isp').textContent = geoData.org || geoData.isp || 'Unknown';
        
    } catch (error) {
        console.error("Error:", error);
        document.getElementById('error-message').textContent = 
            "Failed to load data. Please check your internet connection and try again.";
        document.getElementById('ip-address').textContent = "Error";
        document.getElementById('location').textContent = "Error";
        document.getElementById('city').textContent = "Error";
        document.getElementById('country').textContent = "Error";
        document.getElementById('isp').textContent = "Error";
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', fetchIPData);
document.getElementById('refresh-btn').addEventListener('click', fetchIPData);

// Add manual IP lookup functionality
function addManualLookup() {
    const container = document.querySelector('.container');
    const manualSection = document.createElement('div');
    manualSection.className = 'manual-lookup';
    manualSection.innerHTML = `
        <h3>Manual IP Lookup</h3>
        <input type="text" id="manual-ip" placeholder="Enter IP address (e.g., 8.8.8.8)" />
        <button id="lookup-btn">Lookup</button>
    `;
    container.appendChild(manualSection);

    document.getElementById('lookup-btn').addEventListener('click', async () => {
        const ipInput = document.getElementById('manual-ip').value.trim();
        if (!ipInput) {
            alert('Please enter an IP address');
            return;
        }

        // Validate IP format
        const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        if (!ipRegex.test(ipInput)) {
            alert('Please enter a valid IP address');
            return;
        }

        try {
            document.getElementById('ip-address').textContent = ipInput;
            document.getElementById('location').textContent = 'Loading...';
            
            const geoResponse = await fetch(`https://ipapi.co/${ipInput}/json/`);
            if (!geoResponse.ok) throw new Error("Geo API failed");
            const geoData = await geoResponse.json();
            
            document.getElementById('location').textContent = 
                `${geoData.city || 'Unknown'}, ${geoData.region || geoData.country_name || 'Unknown'}`;
            document.getElementById('city').textContent = geoData.city || 'Unknown';
            document.getElementById('country').textContent = geoData.country_name || geoData.country || 'Unknown';
            document.getElementById('isp').textContent = geoData.org || 'Unknown';
            
        } catch (error) {
            console.error("Manual lookup error:", error);
            document.getElementById('error-message').textContent = 
                "Failed to lookup IP. Please try again.";
        }
    });
}

// Add manual lookup after DOM loads
document.addEventListener('DOMContentLoaded', addManualLookup);
