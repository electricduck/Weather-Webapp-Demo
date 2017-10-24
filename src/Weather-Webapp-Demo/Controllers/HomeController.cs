using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Weather_Webapp_Demo.Business.Interfaces;

namespace Weather_Webapp_Demo.Controllers
{
    public class HomeController : Controller
    {
        public HomeController()
        {

        }

        // /
        // /{location}

        [Route("/")]
        [Route("/{location}")]
        public ActionResult Index()
        {
            return View();
        }
    }
}