using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Weather_Webapp_Demo.Business.Interfaces
{
    public interface IWeatherBusiness
    {
        Task<string> GetCurrentWeatherForCityName(string cityName);
        Task<string> GetFutureWeatherForCityName(string cityName);
    }
}