$(document).ready(function() {
    var app = new Vue({
        el: '#app',
        data: {
            errorMessage: null,
            initialView: true,
            isReady: false,
            requestedLocation: null,
            resultsView: false,
            forecast: {
                day0: [],
                day1: [],
                day2: [],
                day3: [],
                day4: []
            },
            unit: "C",
            weather: {
                cloudCover: 0,
                desc: null,
                humidity: null,
                icon: null,
                location: null,
                pressure: null,
                sun: {
                    rise: 0,
                    set: 0
                },
                temp: {
                    actual: {
                        celcius: 0,
                        fahrenheit: 0,
                        kelvin: 0
                    },
                    high: {
                        celcius: 0,
                        fahrenheit: 0,
                        kelvin: 0
                    },
                    low: {
                        celcius: 0,
                        fahrenheit: 0,
                        kelvin: 0
                    }
                },
                type: null,
                visibility: null,
                wind: {
                    direction: null,
                    speed: 0
                }
            }
        },
        methods: {
            convertDegreeToDirection: function(degreeValue) {
                return ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW","N"][Math.round((degreeValue/22.5)+.5 % 16)];
            },
            convertKelvinToCelcius: function(kelvinValue) {
                return (kelvinValue-273.15).toFixed(1);
            },
            convertKelvinToFahrenheit: function(kelvinValue) {
                return ((kelvinValue*1.8)-459.67).toFixed(1)
            },
            convertUnixTimestampToShorthandDate: function(unixTimestamp) {
                var date = new Date(unixTimestamp*1000);
                
                var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        
                var day = date.getDate();
                var month = months[date.getMonth()+1];
        
                var formattedDate = day + " " + month;
        
                return formattedDate;
            },
            convertUnixTimestampToTime: function(unixTimestamp, hideSeconds) {
                var date = new Date(unixTimestamp*1000);
        
                var hours = date.getHours();
                var minutes = "0" + date.getMinutes();
                var seconds = "0" + date.getSeconds();
        
                var formattedTime = null;
        
                if(hideSeconds) {
                    var formattedTime = hours + ':' + minutes.substr(-2);
                } else {
                    var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
                }
        
                return formattedTime;
            },
            getFutureWeather: function() {
                var self = this;

                $.get("/api/future/city/" + this.requestedLocation, function(data){
                    self.forecast.day0 = data.list.slice(0,8);
                    self.forecast.day1 = data.list.slice(9,16);
                    self.forecast.day2 = data.list.slice(17,24);
                    self.forecast.day3 = data.list.slice(25,32);
                    self.forecast.day4 = data.list.slice(33,40);
                });
            },
            getWeather: function() {
                var self = this;

                $.get("/api/current/city/" + this.requestedLocation, function(data) {
                    if(data.cod === 200) {
                        self.weather.cloudCover = data.clouds.all;
                        self.weather.desc = data.weather[0].description;
                        self.weather.humidity = data.main.humidity;
                        self.weather.icon = self.getWeatherIcon(data.weather[0]);
                        self.weather.pressure = data.main.pressure;
                        self.weather.type = data.weather[0].main;
                        self.weather.update = self.convertUnixTimestampToTime(data.dt);
                        self.weather.visibility = data.visibility;

                        self.weather.sun.rise = self.convertUnixTimestampToTime(data.sys.sunrise);
                        self.weather.sun.set = self.convertUnixTimestampToTime(data.sys.sunset);

                        self.weather.temp.actual.celcius = self.convertKelvinToCelcius(data.main.temp);
                        self.weather.temp.actual.fahrenheit = self.convertKelvinToFahrenheit(data.main.temp);
                        self.weather.temp.actual.kelvin = data.main.temp.toFixed(1);

                        self.weather.temp.high.celcius = self.convertKelvinToCelcius(data.main.temp_max);
                        self.weather.temp.high.fahrenheit = self.convertKelvinToFahrenheit(data.main.temp_min);
                        self.weather.temp.high.kelvin = data.main.temp_max.toFixed(1);

                        self.weather.temp.low.celcius = self.convertKelvinToCelcius(data.main.temp_min);
                        self.weather.temp.low.fahrenheit = self.convertKelvinToFahrenheit(data.main.temp_min);
                        self.weather.temp.low.kelvin = data.main.temp_min.toFixed(1);

                        self.weather.wind.direction = self.convertDegreeToDirection(data.wind.deg);
                        self.weather.wind.speed = data.wind.speed;

                        if(data.sys.country) {
                            self.weather.location = data.name + ", " + data.sys.country;
                        } else {
                            self.weather.location = data.name;
                        }

                        self.getFutureWeather();

                        self.initialView = false;
                        self.resultsView = true;
                    } else {
                        self.errorMessage = "Error: " + data.message + ".";
                    }
                }).fail(function(data) {
                    self.errorMessage = "An unknown error has occured. Please try again later.";
                });
            },
            getWeatherIcon: function(data) {
                if(data.id < 900) {
                    return weatherIconDictionary[data.icon];
                } else {
                    return extremeWeatherIconDictionary[data.id];
                }
            },
            resetUi: function() {
                this.requestedLocation = "";

                this.initialView = true;
                this.resultsView = false;

                history.pushState(null, "Weather", "/");
            },
            setUnit: function(unit) {
                this.unit = unit;
            }
        },
        mounted: function() {
            this.isReady = true;
        }
    });

    var extremeWeatherIconDictionary = {
        "900": "wi-tornado",
        "901": "wi-storm-showers",
        "902": "wi-hurricane",
        "903": "wi-snowflake-cold",
        "904": "wi-hot",
        "905": "wi-windy",
        "906": "wi-hail"
    }

    var weatherIconDictionary = {
        "01d": "wi-day-sunny",
        "01n": "wi-night-clear",
        "02d": "wi-day-cloudy",
        "02n": "wi-night-alt-cloudy",
        "03d": "wi-cloud",
        "03n": "wi-cloud",
        "04d": "wi-cloudy",
        "04n": "wi-cloudy",
        "09d": "wi-showers",
        "09n": "wi-night-alt-showers",
        "10d": "wi-day-rain",
        "10n": "wi-night-alt-rain",
        "13d": "wi-day-thunderstorm",
        "13n": "wi-night-thunderstorm",
        "50d": "wi-day-fog",
        "50n": "wi-night-fog"
    }
});
