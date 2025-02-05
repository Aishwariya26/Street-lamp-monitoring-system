document.addEventListener("DOMContentLoaded", () => {
    const wsUrl = "ws://192.168.15.163:8080/"; // Replace with your WebSocket server URL
    let websocket;

    // Function to initialize WebSocket connection
    function initWebSocket() {
        websocket = new WebSocket(wsUrl);

        // WebSocket open event
        websocket.onopen = () => {
            console.log("WebSocket connection established");
        };

        // WebSocket message event
        websocket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log("Data received from WebSocket:", data);
                console.log("Received timeStatus:", data.timeStatus);

                // Update day/night status
                updateDayNightStatus(data.timeStatus);

                // Update light statuses
                updateLightStatus("light1", data.light1);
                updateLightStatus("light2", data.light2);
                updateLightStatus("light3", data.light3);
                updateLightStatus("light4", data.light4);
                updateLightStatus("light5", data.light5);
                updateLightStatus("light6", data.light6);
                updateLightStatus("light7", data.light7);
                updateLightStatus("light8", data.light8);

                // Update the light chart data
                updateLightChart(data.lightIntensities);
            } catch (error) {
                console.error("Error parsing WebSocket message:", error);
            }
        };

        // WebSocket error event
        websocket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        // WebSocket close event
        websocket.onclose = (event) => {
            console.warn("WebSocket connection closed. Reconnecting...");
            setTimeout(initWebSocket, 5000); // Reconnect after 5 seconds
        };
    }

    // Function to update the day or night status based on data
    function updateDayNightStatus(timeStatus) {
        const dayNightStatus = document.getElementById("day-night-status");
        if (timeStatus.includes("day")) {
            dayNightStatus.textContent = "Day time: It's bright and sunny!";
        } else {
            dayNightStatus.textContent = "Night time: Lights are shining!";
        }
    }
    

    // Function to update individual light status
    function updateLightStatus(lightId, status) {
        const lightCard = document.getElementById(lightId);
        const statusText = lightCard.querySelector(".status-text");
        if (status === "fault") {
            lightCard.classList.add("faulted");
            statusText.textContent = "Faulted";
        } else {
            lightCard.classList.remove("faulted");
            statusText.textContent = "Working";
        }
    }

    // Chart.js configuration for light analytics
    const ctx = document.getElementById("lightChart").getContext("2d");
    const lightChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: ["Light 1", "Light 2", "Light 3", "Light 4", "Light 5", "Light 6", "Light 7", "Light 8"],
            datasets: [{
                label: "Light Intensity",
                data: [80, 75, 90, 60, 85, 80, 75, 90],  // Initial data, to be updated from Arduino data
                borderColor: "#00ffdd",
                backgroundColor: "rgba(0, 255, 221, 0.1)",
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });

    // Function to update light intensity chart
    //function updateLightChart(intensityData) {
        //lightChart.data.datasets[0].data = intensityData;
        //lightChart.update();
    //}

    // Initialize WebSocket connection
    initWebSocket();
});
