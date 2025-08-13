# IP Address Detector Web Application

## 📌 Overview
A simple web application that detects and displays your public IP address along with network information like your internet service provider (ISP), approximate location, and other details. Built using HTML, CSS, and JavaScript.

## ✨ Features
- Displays your public IP address
- Shows your approximate location (city, country)
- Identifies your internet service provider (ISP)
- Clean and responsive user interface
- Fast loading with minimal dependencies

## 🛠️ How It Works
The application works by:
1. Making an API call to a free IP geolocation service
2. Receiving a JSON response with your network information
3. Displaying this information in an easy-to-read format

Example of the data we receive (JSON format):
```json
{
  "ip": "Your_IP",
  "city": "Mumbai",
  "region": "Maharashtra",
  "country": "IN",
  "isp": "Your_Internet_Provider"
}
