using System.Linq;
using System.Net.Http;
using System.Web.Http;

namespace Boogle.Mvc.Controllers
{
    public class ConversionController : ApiController
    {
        // GET api/conversion
        public HttpResponseMessage Get()
        {
            // inspect for httpcookie
            var cookies = Request.Headers.GetCookies().ToList();
            var boogleCookie = cookies.FirstOrDefault(c => c["BoogleAdClickCookie"] != null);

            return new HttpResponseMessage();
        }
    }
}
