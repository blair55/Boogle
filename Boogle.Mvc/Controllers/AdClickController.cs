using System;
using System.Web;
using System.Web.Mvc;

namespace Boogle.Mvc.Controllers
{
    public class AdClickController : Controller
    {
        public ActionResult Index(string url)
        {
            var boogleCookie = new HttpCookie("BoogleAdClickCookie")
            {
                Value = Guid.NewGuid().ToString(),
                Expires = DateTime.MinValue,
                Path = "/"
            };

            Response.AppendCookie(boogleCookie);

            return new RedirectResult(url);
        }
    }
}