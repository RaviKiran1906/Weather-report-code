const axios = require('axios');
const readline = require('readline');

const apiUrl = 'https://samples.openweathermap.org/data/2.5/forecast/hourly?q=London,us&appid=b6907d289e10d714a6e88b30761fae22';

// Function to fetch weather data from the API and extract data for a specific date
async function fetchWeatherDataByDate(targetDate) {
    try {
        const response = await axios.get(apiUrl);
        const filteredData = response.data.list.filter(item => {
            // Assuming the API response includes timestamps in UTC format
            const itemDate = new Date(item.dt * 1000);
            return itemDate.toISOString().split('T')[0] === targetDate;
        });

        if (filteredData.length > 0) {
            return filteredData;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function getWeatherInfo(infoType) {
    rl.question(`Enter the date (YYYY-MM-DD) to get ${infoType} information (or 0 to exit): `, async (inputDate) => {
        if (inputDate === '0') {
            rl.close();
            console.log('Exiting the program.');
            return;
        }

        const weatherData = await fetchWeatherDataByDate(inputDate);
        if (weatherData) {
            const infoList = weatherData.map(item => {
                switch (infoType) {
                    case 'Temperature':
                        return item.main.temp;
                    case 'Wind Speed':
                        return item.wind.speed;
                    case 'Pressure':
                        return item.main.pressure;
                }
            });
            console.log(`${infoType} on ${inputDate}:`);
            console.log(infoList);
        } else {
            console.log(`No weather data found for ${inputDate}.`);
        }

        // Ask for more input
        promptUser();
    });
}

function promptUser() {
    rl.question(
        '\nChoose an option:\n1. Get Temperature\n2. Get Wind Speed\n3. Get Pressure\n0. Exit\n',
        (choice) => {
            switch (choice) {
                case '1':
                    getWeatherInfo('Temperature');
                    break;
                case '2':
                    getWeatherInfo('Wind Speed');
                    break;
                case '3':
                    getWeatherInfo('Pressure');
                    break;
                case '0':
                    rl.close();
                    console.log('Exiting the program.');
                    break;
                default:
                    console.log('Invalid choice. Please try again.');
                    promptUser();
            }
        }
    );
}

promptUser();
