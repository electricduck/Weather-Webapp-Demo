using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Weather_Webapp_Demo.Business.Interfaces;
using Weather_Webapp_Demo.Services.Interfaces;

namespace Weather_Webapp_Demo.Business
{
    public class WeatherBusiness : IWeatherBusiness
    {
        private IOwmApiService _owmApiService { get; }

        public WeatherBusiness(IOwmApiService owmApiService)
        {
            _owmApiService = owmApiService;
        }

        public async Task<string> GetCurrentWeatherForCityName(string cityName)
        {
            var result = await _owmApiService.QueryApi("weather", "q=" + cityName);
            return result;
        }

        public async Task<string> GetFutureWeatherForCityName(string cityName)
        {
            var result = await _owmApiService.QueryApi("forecast", "q=" + cityName);
            return result;
        }
    }
}