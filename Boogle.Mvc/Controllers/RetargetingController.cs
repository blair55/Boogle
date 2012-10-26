using System.Linq;
using System.Net.Http;
using System.Web.Http;

namespace Boogle.Mvc.Controllers
{
    public class RetargetingController : ApiController
    {
        // GET api/retargeting
        public HttpResponseMessage Get()
        {
            // inspect for httpcookie
            var cookies = Request.Headers.GetCookies().ToList();
            var boogleCookie = cookies.FirstOrDefault(c => c["BoogleAdClickCookie"] != null);

            return new HttpResponseMessage();
        }
    }
}