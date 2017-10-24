using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Weather_Webapp_Demo.Services.Interfaces
{
    public interface IOwmApiService
    {
        Task<string> QueryApi(string path, string query);
    }
}