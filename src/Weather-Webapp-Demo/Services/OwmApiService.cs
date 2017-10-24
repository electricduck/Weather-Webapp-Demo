using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Weather_Webapp_Demo.Data.Constants;
using Weather_Webapp_Demo.Services.Interfaces;

namespace Weather_Webapp_Demo.Services
{
    public class OwmApiService : IOwmApiService
    {
        public OwmApiService()
        {

        }

        public async Task<string> QueryApi(string path, string query)
        {
            var appKey = AppSettingsConstant.ApiKeys_OpenWeatherMap;

            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri("http://api.openweathermap.org/data/2.5/" + path);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                HttpResponseMessage response = await client.GetAsync("?appid=" + appKey + "&" + query);
                if(response.IsSuccessStatusCode) {
                    var result = await response.Content.ReadAsStringAsync();
                    return result;
                } else {
                    return null;
                }
            }
        }
    }
}