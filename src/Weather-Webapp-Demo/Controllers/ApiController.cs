using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Weather_Webapp_Demo.Business.Interfaces;

namespace Weather_Webapp_Demo.Controllers
{
    public class ApiController : Controller
    {
        private IWeatherBusiness _weatherBusiness { get; set; }

        public ApiController(IWeatherBusiness weatherBusiness)
        {
            _weatherBusiness = weatherBusiness;
        }

        // /api/current/city/{cityName}

        [Route("/api/current/city/{cityName}")]
        public async Task<JsonStringResult> GetCurrentWeatherForCityName(string cityName)
        {
            var result = await _weatherBusiness.GetCurrentWeatherForCityName(cityName);
            return new JsonStringResult(result);
        }

        // /api/future/city/{cityName}

        [Route("/api/future/city/{cityName}")]
        public async Task<JsonStringResult> GetFutureWeatherForCityName(string cityName)
        {
            var result = await _weatherBusiness.GetFutureWeatherForCityName(cityName);
            return new JsonStringResult(result);
        }
    }
}