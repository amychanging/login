define(function(require, exports) {
    var $ = require("js/lib/zepto");
    var tip = require('js/lib/tip');

    function errTip(text){
      tip({
        text:text
      });
    }

    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function(fun, thisp) {
            if (typeof fun != "function") throw new TypeError();
            var len = this.length >>> 0, res = new Array(len);
            for (var i = 0; i < len; i++) {
                if (i in this) res[i] = fun.call(thisp, this[i], i, this);
            }
            return res;
        };
    }
    var emailReg = /^([a-zA-Z0-9]+[_|\_|\.|-]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/, cnReg = /^[\u4e00-\u9fa5]*$/, numberReg = /^\d*$/, phoneReg = /^((\(\d{2,3}\))|(\d{3}\-))?(1[34578]\d{9})$/, notzeroReg = /^[^0]/, passwordReg = /^[\w+]{6,16}$/, $validObject = {};
    var errorText = {
        number: "只能输入数字",
        required: "不能为空",
        email: "格式不正确",
        phone: "格式不正确",
        password: "必须由6~16位字母或数字组成",
        cn: "只允许输入中文",
        min: "至少输入",
        max: "最多输入",
        notzero: "不能以0开头"
    };
    $validObject.checkFn = function(type, len) {
        var errorMsg = $(this).data("errorMsg"), 
      errorKey = $(this).data("errorKey");
        var isCheck = $validObject[type + "Fn"].call($(this), len);
        if (isCheck) {
            if (errorKey.indexOf(type) > -1) {
                var newArr = [];
                errorKey.forEach(function(val, ind) {
                    if (val != type) {
                        newArr.push(val);
                    }
                });
                errorKey = newArr;
            }
            delete errorMsg[type];
        } else {
            if (errorKey.indexOf(type) < 0) {
                errorKey.push(type);
            }
            if ($(this)[0].nodeName.toUpperCase() == "SELECT" && type == "required" || $(this).attr("type") == "hidden") {
                errorMsg[type] = "请选择";
            } else {
                errorMsg[type] = errorText[type] + (len ? len + "个字" : "");
            }
        }
        $(this).data("errorKey", errorKey);
        $(this).data("errorMsg", errorMsg);
        return isCheck;
    };

    $validObject.numberFn = function() {
        if (!numberReg.test($.trim($(this).val()))) {
            return false;
        } else {
            return true;
        }
    };
    $validObject.requiredFn = function() {
        if (!$.trim($(this).val()).length) {
            return false;
        } else {
            return true;
        }
    };

    $validObject.emailFn = function() {
        if (!emailReg.test($.trim($(this).val()))) {
            return false;
        } else {
            return true;
        }
    };
    $validObject.phoneFn = function() {
        if (!phoneReg.test($.trim($(this).val()))) {
            return false;
        } else {
            return true;
        }
    };
    $validObject.cnFn = function() {
        if (!cnReg.test($.trim($(this).val()))) {
            return false;
        } else {
            return true;
        }
    };
    $validObject.minFn = function(len) {
        if ($.trim($(this).val()).length == 0) {
            return true;
        }
        if ($.trim($(this).val()).length < len) {
            return false;
        } else {
            return true;
        }
    };
    $validObject.maxFn = function(len) {
        if ($.trim($(this).val()).length > len) {
            return false;
        } else {
            return true;
        }
    };
    $validObject.notzeroFn = function() {
        if (!notzeroReg.test($.trim($(this).val())) && $.trim($(this).val()).length) {
            return false;
        } else {
            return true;
        }
    };

    $validObject.passwordFn = function() {
        if (!passwordReg.test($.trim($(this).val())) && $.trim($(this).val()).length) {
            return false;
        } else {
            return true;
        }
    };

    function doValid(opts) {
        var $form = $(this), 
        //需要验证的
        $rules = $form.find("[validate-rules]"), 
        //提交按钮
        $submit = $form.find('[data-selector="submit"]'), 
        //验证没通过，置状态
        isLock = true;

        //调用了这个插件的标示
        $form.attr("hasValid", "on");
    
        //没有验证规则的 按钮可用
        if (!$rules.length) {
            isLock = false;
            $submit.removeClass("disabled");
        }
        //验证每个的规则
        $rules.unbind(opts.eventName).bind(opts.eventName, function(e) {
            var $this = $(this);
            validateRules = $this.attr("validate-rules").split("|");
            var opt = {};
            if (!$(this).data("errorMsg")) {
                $(this).data("errorMsg", {});
            }
            if (!$(this).data("errorKey")) {
                $(this).data("errorKey", []);
            }
            validateRules.forEach(function(val, index) {
                if (val.indexOf(":") > -1) {
                    var valArr = val.split(":");
                    // opt[valArr[0]] = $validObject[valArr[0]+'Fn'].call($this,valArr[1]);
                    opt[valArr[0]] = $validObject.checkFn.call($this, valArr[0], valArr[1]);
                } else {
                    // opt[val] = $validObject[val+'Fn'].call($this);
                    opt[val] = $validObject.checkFn.call($this, val);
                }
            });
            var len = 0;
            for (var i in opt) {
                if (opt[i]) {
                    len++;
                }
            }
            if (len < validateRules.length) {
                $this.attr("lock", "true");
                if (e.type != "input" && !$this.hasClass(opts.errorClass)) {
                    $this.addClass(opts.errorClass);
                }
            } else {
                $this.attr("lock", "false");
                $this.removeClass(opts.errorClass);
            }
            if ($form.find('[lock="false"]').length < $rules.length) {
                isLock = true;
            } else {
                isLock = false;
            }

            $form.attr("islock", isLock);
            if (e.type == "focus") {
                $this.removeClass(opts.errorClass);
            }
        }).triggerHandler("blur");

        $form.unbind("submit.valid").bind("submit.valid", function() {

          return formValid($('this'))
        });

        function formValid($form){
          var isLock = $form.attr('isLock') == "true"

          if (isLock) {
              var nowElm = $('[lock="true"]:eq(0)', $form);
              var type = nowElm.data("errorKey")[0],
              title = nowElm.attr("validate-title") || "";
              title = title.replace(/\s/g, "");
              if (type) {
                  if (nowElm[0].nodeName.toUpperCase() == "SELECT" && type == "required" || nowElm.attr("type") == "hidden") {
                      errTip(nowElm.data("errorMsg")[type] + title);
                  } else {
                      errTip(title + nowElm.data("errorMsg")[type]);
                  }
              }
              return false;
          }

          var startDate = $form.find('.util-date-begin').val(), 
          endDate = $form.find('.util-date-end').val(), 
          sArr = startDate ? startDate.split("-") : [], 
          eArr = endDate ? endDate.split("-") : [];

          if (sArr.length && eArr.length) {
              var sDate = new Date(sArr[0],sArr[1]).getTime(),
              eDate = new Date(eArr[0],eArr[1]).getTime();
              if (eDate <= sDate) {
                  errTip("结束时间不能小于开始时间");
                  return false;
              }
          }

          if (opts.success) {
              opts.success();
          }

          return true;
    }

        $.checkValid = formValid;
  }

    $.fn.valid = function(option) {
        $(this).each(function() {
            var opts = $.extend({
                errorClass: "error-on",
                eventName: "focus.valid input.valid blur.valid change.valid"
            }, option);

            doValid.call(this, opts);

        });
    };

    $.validRefresh = function() {
      $('[hasValid="on"]').valid();
    };


});
