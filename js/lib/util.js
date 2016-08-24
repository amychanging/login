define(function(require,exports){
    
    var util = {
        domain: "m.zhaozuor.com",
        baseUrl: "http://m.zhaozuor.com",
        //默认会跳转回原来的页面
        goLogin: function(url) {
            url = url || location.href;
            location.href = this.baseUrl + "/login.jsp?url=" + encodeURIComponent(url);
        }
    };

    return util;

});


