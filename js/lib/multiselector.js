define( function(require, exports) {
    var $ = require("js/lib/zepto");
    var mask = require("js/lib/mask");
    /**
 	 * 模仿ios的年月的选择器
	 * {@linkplain http://h5.lietou-static.com/m/test/js/multiselector/ }
	 * @module lib/multiselector/multiselector
	 * @author 崔久代
	 */
    /**
	 * @constructor multiselector
	 * @param opt {object} 配置选项
	 * @param opt.complete {function}  点击完成后的回调
	 * @param opt.cancel {function} 点击取消的回调
	 * @param opt.tonow {function} 至今的回调
	 * @param opt.notonow {boolean} 没有至今按钮
	 * @param opt.val {string} 年月的时间,使用 - 分割
	 *
	 */
    function multiSelector(opt) {
        var option = {
            complete: function() {},
            //完成 按钮回调
            cancel: function() {},
            //cancel 按钮回调
            tonow: function() {},
            //至今 按钮回调
            notonow: false,
            //不显示至今 按钮
            val: "-"
        };
        $.extend(option, opt);
        // option.val = option.val.split("-");
         option.val = [option.val.slice(0,4),option.val.slice(4)];

        var initTime = option.val;

        var scrollTop = document.body.scrollTop;
        var date = new Date();
        var yearnum = date.getFullYear();
        var yearstr = "";
        var monthstr = "";
        var $modBody = $(".container");
        for (var i = yearnum; i >= 1949; i--) {
            yearstr += "<li val=" + i + (i == initTime[0] ? ' class="selected" ' : "") + "  >" + i + "年</li>";
        }
        for (var j = 1; j <= 12; j++) {
            if (j < 10) {
                j = "0" + j;
            }
            monthstr += "<li val=" + j + (j == initTime[1] ? ' class="selected" ' : "") + "  >" + j + "月</li>";
        }
        var basestr = '<div class="js-date-select">' + '	<div class="btn-group">' + '		<a class="btn lf cancel-btn"  href="javascript:;">取消</a>' + '		<a class="btn tonow-btn" href="javascript:;">至今</a>' + '		<a class="btn rt complete-btn" href="javascript:;">完成</a>' + "	</div>" + '	<div class="select-con-all">' + '	<div class="select-con">' + '		<ul class="con-year"></ul>' + '		<ul class="con-month"></ul>' + '		<div class="select-line"></div>' + "	</div>" + "	</div>" + "</div>";
        $(document.body).append(basestr);
        var jsDateSelectMask;
        $("html").css({
            overflow: "hidden",
            height: "100%"
        });
        $(document.body).css({
            overflow: "hidden",
            height: "100%"
        });
        jsDateSelectMask = new mask({
            el: $modBody,
            click: function() {}
        });
        jsDateSelectMask.show();
        var all = $(".js-date-select");
        var con = $(".select-con");
        var inputs = $("input", con[0]);
        var year = $(".con-year", con[0]);
        var month = $(".con-month", con[0]);
        var line = $(".select-line");
        year.html(yearstr);
        month.html(monthstr);
        var li = $("li", year[0]);
        var lih = li[0].offsetHeight;
        var topNum = 4;
        line.css({
            top: lih * topNum + "px"
        });
        con.css({
            height: lih * topNum * 2 + "px"
        });
        function initSelect(year, li) {
            if (!li.filter(".selected").length) {
                li.eq(topNum - 1).addClass("selected");
            }
            var maxTop = lih * (li.length - 4);
            var minTop = lih * (topNum - 1);
            y1 = 0;
            y2 = 0;
            $(year).on("touchstart", function(e) {
                //电脑上触发了两个时间 Touchevent 和Event ,Event没有e.touches
                if (!e.touches) {
                    return;
                }
                var touch = e.touches[0];
                y1 = touch.pageY;
                return false;
            }).on("touchmove", function(e) {
                //console.log('touchmove')
                if (!e.touches) {
                    return;
                }
                var touch = e.touches[0];
                y2 = touch.pageY;
                var top = (y2 - y1) / 16 + parseInt($(this).css("top"), 10);
                if (top > minTop) {
                    top = minTop;
                }
                if (top < -maxTop) {
                    top = -maxTop;
                }
                $(this).css({
                    top: top + "px"
                });
                e.stopPropagation();
                return false;
            }).on("touchend", function(e) {
                var nowTop = parseInt($(this).css("top"), 10);
                var num = Math.round(nowTop / lih);
                $(this).css({
                    top: num * lih + "px"
                });
                li.removeClass("selected");
                li.eq(Math.abs(num - (topNum - 1))).addClass("selected");
                return false;
            });
        }
        initSelect(year, li);
        initSelect(month, $("li", month[0]));
        //至今
        if (initTime[0] != 9999) {
            //初始化初始值高度
            year.css({
                top: lih * (topNum - 1) - (yearnum - parseInt(initTime[0], 10)) * lih + "px"
            });
            month.css({
                top: (topNum - parseInt(initTime[1], 10)) * lih + "px"
            });
        }
        var cancelBtn = $(".cancel-btn", all[0]);
        var toNowBtn = $(".tonow-btn", all[0]);
        var completeBtn = $(".complete-btn", all[0]);
        if (option.notonow) {
            toNowBtn.hide();
        }
        function resetScroll() {
            $("html").css({
                overflow: "visible",
                height: "auto"
            });
            $(document.body).css({
                overflow: "visible",
                height: "auto"
            });
            document.body.scrollTop = scrollTop;
        }
        function reset() {
            all.hide().remove();
            jsDateSelectMask.hide().remove();
        }
        all.find(".select-con-all").on("touchstart", function(e) {
            e.stopPropagation();
            e.preventDefault();
            return false;
        }).on("touchmove", function(e) {
            e.stopPropagation();
            e.preventDefault();
            return false;
        }).on("touchend", function(e) {
            e.stopPropagation();
            e.preventDefault();
            return false;
        });
        cancelBtn.click(function() {
            option.cancel();
            reset();
            resetScroll();
        });
        toNowBtn.click(function() {
            option.tonow({
                year: 9999,
                month: 99
            });
            reset();
            resetScroll();
        });
        completeBtn.click(function() {
            var selected = $(".selected", con[0]);
            option.complete({
                year: +selected[0].getAttribute("val"),
                month: +selected[1].getAttribute("val")
            });
            reset();
            resetScroll();
        });
    }
    return multiSelector;
});
