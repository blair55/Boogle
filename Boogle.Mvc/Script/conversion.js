(function () {

	alert('hello from hacked conversion.js');

    var nullValue = null;

    // googles custom parameters as array
    var adwordsParameters = "google_conversion_id google_conversion_format google_conversion_type google_conversion_order_id google_conversion_language google_conversion_value google_conversion_domain google_conversion_label google_conversion_color google_disable_viewthrough google_remarketing_only google_remarketing_for_search google_conversion_items google_custom_params google_conversion_date google_conversion_time google_conversion_js_version onload_callback opt_image_generator google_is_call google_conversion_page_url".split(" ");

    // encode the string supplied
    function encodeString(stringToEncode) {
        return stringToEncode != nullValue ? escape(stringToEncode.toString()) : ""
    }

    // create key value pair with preceeding ampersand
    function createQueryStringParameter(key, value) {
        var encodedValue = encodeString(value);
        if ("" != encodedValue) {
            var encodedKey = encodeString(key);
            if ("" != encodedKey)
                return "&".concat(encodedKey, "=", encodedValue)
        }
        return ""
    }

    // escape commas, semi-colons and equals
    function escapeCharacters(strValue) {
        var strValueType = typeof strValue;
        return strValue == nullValue || "object" == strValueType || "function" == strValueType ? nullValue : String(strValue).replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/=/g, "\\=")
    }

    // create data url param from google custom parameters object
    function createDataParameter(customParametersObject) {        
        var parameter;
        customParametersObject = customParametersObject.google_custom_params;

        if (!customParametersObject || "object" != typeof customParametersObject || "function" == typeof customParametersObject.join)
        	parameter = "";
        else {
            var dataValues = [];
            
            // enumerate over customParametersObject properties
            for (parameter in customParametersObject) {
            	if (Object.prototype.hasOwnProperty.call(customParametersObject, parameter)) {
                    var urlParameter = customParametersObject[parameter];
	                
                    // if urlParameter is an array
                    if (urlParameter && "function" == typeof urlParameter.join) {
                        
                        //iterate over the array, and add escaped values to new array 
                        for (var tempVariable = [], e = 0; e < urlParameter.length; ++e) {
                            var safeParameter = escapeCharacters(urlParameter[e]);
	                        safeParameter != nullValue && tempVariable.push(safeParameter)
	                    }

	                    // join values in tempVariable into urlParameter
                        urlParameter = 0 == tempVariable.length ? nullValue : tempVariable.join(",")
                    }
                    // if urlParameter is not an array
                    else {
                        urlParameter = escapeCharacters(urlParameter);
                    }
                    // reuse tempVariable and push values into array
                    (tempVariable = escapeCharacters(parameter)) && urlParameter != nullValue && dataValues.push(tempVariable + "=" + urlParameter)
                }
            }
            parameter = dataValues.join(";")
        }

        alert('data parameter: ' + parameter);
        return "" == parameter ? "" : "&".concat("data=", encodeURIComponent(parameter))
    }

    // for non alphanumeric parameters, encode string representation
    function toStringAndEncode(item) {
        return "number" != typeof item && "string" != typeof item ? "" : encodeString(item.toString())
    }

    // create item url parameter from google conversion items object
    function createConversionItemParameter(conversionDetails) {
        if (!conversionDetails)
            return "";
        
        conversionDetails = conversionDetails.google_conversion_items;
        
        if (!conversionDetails)
            return "";

        for (var itemDetailsArray = [], g = 0, a = conversionDetails.length; g < a; g++) {
            var item = conversionDetails[g],
                tempArray = [];

            item && (tempArray.push(toStringAndEncode(item.value)), tempArray.push(toStringAndEncode(item.quantity)), tempArray.push(toStringAndEncode(item.item_id)), tempArray.push(toStringAndEncode(item.adwords_grouping)), tempArray.push(toStringAndEncode(item.sku)), itemDetailsArray.push("(" + tempArray.join("*") + ")"))
        }

        alert('conversion details: ' + itemDetailsArray.join(""));
        return 0 < itemDetailsArray.length ? "&item=" + itemDetailsArray.join("") : ""
    }

    function createWindowDetailsParameter(globalWindowObj, navigatorObj, gConversionDateObj) {
        var parameterArray = [];
        
        if (globalWindowObj) {
            var windowScreen = globalWindowObj.screen;
            
            windowScreen && (parameterArray.push(createQueryStringParameter("u_h", windowScreen.height)), parameterArray.push(createQueryStringParameter("u_w", windowScreen.width)), parameterArray.push(createQueryStringParameter("u_ah", windowScreen.availHeight)), parameterArray.push(createQueryStringParameter("u_aw", windowScreen.availWidth)), parameterArray.push(createQueryStringParameter("u_cd", windowScreen.colorDepth)));
            
            globalWindowObj.history && parameterArray.push(createQueryStringParameter("u_his", globalWindowObj.history.length))
        }
        
        gConversionDateObj && "function" == typeof gConversionDateObj.getTimezoneOffset && parameterArray.push(createQueryStringParameter("u_tz", - gConversionDateObj.getTimezoneOffset()));
        
        navigatorObj && ("function" == typeof navigatorObj.javaEnabled && parameterArray.push(createQueryStringParameter("u_java", navigatorObj.javaEnabled())), navigatorObj.plugins && parameterArray.push(createQueryStringParameter("u_nplug", navigatorObj.plugins.length)), navigatorObj.mimeTypes && parameterArray.push(createQueryStringParameter("u_nmime", navigatorObj.mimeTypes.length)));
        
        alert('window details: ' + parameterArray.join(""));
        return parameterArray.join("")
    }

    function createConversionPageDetailParameters(globalWindowObj, documentObj, googleConversionPageUrl) {
        var parameters = "";
        
        if (documentObj) {    
            var parameters = parameters + createQueryStringParameter("ref", documentObj.referrer != nullValue ? documentObj.referrer.toString().substring(0, 256) : "");
            
            var d, documentObj = 2;
            
            try {
                if (globalWindowObj.top.document == globalWindowObj.document)
                    documentObj = 0;
                else {
                    var urlPlaceholder = globalWindowObj.top;
                    try {
                        d = !! urlPlaceholder.location.href || "" === urlPlaceholder.location.href
                    } catch (r) {
                        d = !1
                    }
                    d && (documentObj = 1)
                }
            } catch (K) {}
            
            d = documentObj;
            urlPlaceholder = "";
            urlPlaceholder = googleConversionPageUrl ? googleConversionPageUrl : 1 == d ? globalWindowObj.top.location.href : globalWindowObj.location.href;
            parameters += createQueryStringParameter("url", urlPlaceholder != nullValue ? urlPlaceholder.toString().substring(0, 256) : "");
            parameters += createQueryStringParameter("frm", d)
        }

        alert('conversio page details: ' + parameters);
        return parameters
    }

    function setProtocol(url) {
        return url && url.location && url.location.protocol && "https:" == url.location.protocol.toString().toLowerCase() ? "https:" : "http:"
    }

    function buildUrlPath(url, c, googleDataObj) {
        return setProtocol(url) + "//" + (googleDataObj.google_remarketing_only ? "boogle.doubleclick.com" : googleDataObj.google_conversion_domain || "boogle.doubleclick.com") + "/api/" + c
    }

    function buildPixelTag() {
        var b = globalWindow,
            c = navigator,
            g = document,
            a = globalWindow,
            d = "?";
        
        "landing" == a.google_conversion_type && (d = "/extclk?");
        var d = buildUrlPath(b, [a.google_remarketing_only ? "retargeting/" : "conversion/", d, "random=", encodeString(a.google_conversion_time)].join(""), a),
            e;
        
        a: {
            e = a.google_conversion_language;
            if (e != nullValue) {
                e = e.toString();
                if (2 == e.length) {
                    e = createQueryStringParameter("hl", e);
                    break a
                }
                if (5 == e.length) {
                    e = createQueryStringParameter("hl", e.substring(0, 2)) + createQueryStringParameter("gl", e.substring(3, 5));
                    break a
                }
            }
            e = ""
        }
        
        c = [
            createQueryStringParameter("cv", a.google_conversion_js_version),
            createQueryStringParameter("fst", a.google_conversion_first_time),
            createQueryStringParameter("num", a.google_conversion_snippets),
            createQueryStringParameter("fmt", a.google_conversion_format),
            createQueryStringParameter("value", a.google_conversion_value),
            createQueryStringParameter("label", a.google_conversion_label),
            createQueryStringParameter("oid", a.google_conversion_order_id),
            createQueryStringParameter("bg", a.google_conversion_color),
            e,
            createQueryStringParameter("guid", "ON"),
            createQueryStringParameter("disvt", a.google_disable_viewthrough),
            createQueryStringParameter("is_call", a.google_is_call),
            createConversionItemParameter(a),
            createWindowDetailsParameter(b, c, a.google_conversion_date),
            createConversionPageDetailParameters(b, g, a.google_conversion_page_url),
            createDataParameter(a),
            a.google_remarketing_for_search && !a.google_conversion_domain ? "&srr=n" : ""
        ].join("");
        
        c = d + c;
        g = function (a, b, c) {
            return '<img height="' + c + '" width="' + b + '" border="0" src="' + a + '" />'
        };

        alert('built the output: ' + c);

        var languagearray = {
            ar: 1,
            bg: 1,
            cs: 1,
            da: 1,
            de: 1,
            el: 1,
            en_AU: 1,
            en_US: 1,
            en_GB: 1,
            es: 1,
            et: 1,
            fi: 1,
            fr: 1,
            hi: 1,
            hr: 1,
            hu: 1,
            id: 1,
            is: 1,
            it: 1,
            iw: 1,
            ja: 1,
            ko: 1,
            lt: 1,
            nl: 1,
            no: 1,
            pl: 1,
            pt_BR: 1,
            pt_PT: 1,
            ro: 1,
            ru: 1,
            sk: 1,
            sl: 1,
            sr: 1,
            sv: 1,
            th: 1,
            tl: 1,
            tr: 1,
            vi: 1,
            zh_CN: 1,
            zh_TW: 1
        };

        return 0 == a.google_conversion_format && a.google_conversion_domain == nullValue
        ? '<a href="' + (setProtocol(b) + "//services.google.com/sitestats/" + (languagearray[a.google_conversion_language]
            ? a.google_conversion_language + ".html" : "en_US.html") + "?cid=" + encodeString(a.google_conversion_id)) + '" target="_blank">' + g(c, 135, 27) + "</a>": 1 < a.google_conversion_snippets || 3 == a.google_conversion_format
                    ? g(c, 300, 150) : '<iframe name="google_conversion_frame" width="' + (2 == a.google_conversion_format ? '100%' : 150) + '" height="' + (2 == a.google_conversion_format ? 150 : 100) + '" src="' + c + '" frameborder="0" marginwidth="0" marginheight="0" vspace="0" hspace="0" allowtransparency="true" scrolling="no">' + g(c.replace(/\?random=/, "?frame=0&random="), 1, 1) + "</iframe>"
    }

    function createNewImage() {
        return new Image
    };

    var globalWindow = window;
    
    alert('am i hit? ' + window);
    
    if (globalWindow) 
    	if (/[\?&;]google_debug/.exec(document.URL) != nullValue) {
	        var x = globalWindow,
	            y = document.getElementsByTagName("head")[0];
	        y || (y = document.createElement("head"), document.getElementsByTagName("html")[0].insertBefore(y, document.getElementsByTagName("body")[0]));
	        var z = document.createElement("script");
	        z.src = buildUrlPath(window, "conversion_debug_overlay.js", x);
	        y.appendChild(z)
	    } else {
	        try {
	            var A;
	            var B = globalWindow;
	            "landing" == B.google_conversion_type || !B.google_conversion_id || B.google_remarketing_only && B.google_disable_viewthrough ? A = !1 : (B.google_conversion_date = new Date, B.google_conversion_time = B.google_conversion_date.getTime(), B.google_conversion_snippets = "number" == typeof B.google_conversion_snippets && 0 < B.google_conversion_snippets ? B.google_conversion_snippets + 1 : 1, "number" != typeof B.google_conversion_first_time && (B.google_conversion_first_time = B.google_conversion_time), B.google_conversion_js_version = "7", 0 != B.google_conversion_format && (1 != B.google_conversion_format && 2 != B.google_conversion_format && 3 != B.google_conversion_format) && (B.google_conversion_format = 1), A = !0);
	            if (A && (document.write(buildPixelTag()), globalWindow.google_remarketing_for_search && !globalWindow.google_conversion_domain)) {
	                
	                var C = globalWindow;
	                var userListUrlWithQueryString;
	                var E = globalWindow;
                    var userListUrl;

	                userListUrl = setProtocol(E) + "//www.google.com/ads/user-lists/" + [encodeString(C.google_conversion_id), "/?random=", Math.floor(1E9 * Math.random())].join("");
	                userListUrlWithQueryString = userListUrl += [createQueryStringParameter("label", C.google_conversion_label), createQueryStringParameter("fmt", "3"), createConversionPageDetailParameters(E, document, C.google_conversion_page_url)].join("");
	                
	                var newImageFunction = createNewImage;
	                "function" === typeof C.opt_image_generator && (newImageFunction = C.opt_image_generator);
	                
	                var H = newImageFunction();
	                userListUrlWithQueryString += createQueryStringParameter("async", "1");
	                H.src = userListUrlWithQueryString;
	                H.onload = function () {}
	            }
	        } catch (I) {}
	        for (var J = globalWindow, L = 0; L < adwordsParameters.length; L++) {
	        	J[adwordsParameters[L]] = nullValue;
	        }
	    }
})();