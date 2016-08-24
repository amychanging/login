define(function(require, exports) {
    /**
 	 * cookie 操作函数  例子：{@linkplain http://h5.lietou-static.com/m/test/js/cookie/}
	 * @author 崔久代
	 * @exports lib/cookie/cookie
	 *
	 */
    var cookie = {
        /**
		 * 获得name的值
		 * @param name {string} cookie 名字 
		*/
        get: function(name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(";");
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == " ") c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) == 0) {
                    var ret;
                    try {
                        ret = decodeURIComponent(c.substring(nameEQ.length, c.length));
                    } catch (e) {
                        ret = unescape(c.substring(nameEQ.length, c.length));
                    }
                    return ret;
                }
            }
            return null;
        },
        /**
		 * 设置cookie
		 * @param name {string} cookie 名字 
		 * @param vale {string} cookie 值
		 * @param day {number}   有效时长，天数
		 * @param path {string}  cookie path
		 * @param domain {string}  
		 * @param secure {string}  
		*/
        set: function(name, value, days, path, domain, secure) {
            var expires;
            if (typeof days == "number") {
                var date = new Date();
                date.setTime(date.getTime() + days * 24 * 60 * 60 * 1e3);
                expires = date.toGMTString();
            } else if (typeof days == "string") {
                expires = days;
            } else {
                expires = false;
            }
            document.cookie = name + "=" + encodeURIComponent(value) + (expires ? ";expires=" + expires : "") + (path ? ";path=" + path : "") + (domain ? ";domain=" + domain : "") + (secure ? ";secure" : "");
        },
        /**
		 * 删除 name
		 * @param name {string} cookie 名字 
		 * @param path {string}  
		 * @param domain {string}  
		 * @param secure {string}  
		*/
        del: function(name, path, domain, secure) {
            this.set(name, "", -1, path, domain, secure);
        },
        /**
		 * 是否登录了 
		 * @return {boolean}
		*/
        isLogin: function() {
            return this.get("user_id") != null;
        }
    };
    return cookie;
});