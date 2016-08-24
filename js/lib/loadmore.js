//滚动加载更多
define(function(require,exports){
    
    function loadMore(option){
      this.end = false;
      this.loading = false;
      this.curpage = 1;
      this.bodyH = document.documentElement.clientHeight;

      this.opt = {
        pageSize:20
      };
      if(option){
        $.extend(true,opt,option);
      }
    }

    loadMore.prototype = {
      //不需要重写
      init:function(){
        var self = this;
        $(document.body).on("touchmove", function() {
          if (document.body.offsetHeight - bodyH - $(document.body).scrollTop() < 300) {
            if (self.end || self.loading) {
                return;
            }
            if (self.getItems().length < self.opt.pageSize) {
                self.end = true;
                self.nomore();
                return;
            }
            
            self.loading = true;
            self.loadmoreFuc(loadmoreFunCallback(res));
          }
        });
      },

      //覆盖
      //返回当前的所有的
      getItems:function(){
        return $("li", $(".multi-list .item-list-inner")[0]);
      },
      //覆盖
      getCon : function(){
        return $(".multi-list .item-list-inner");
      },

      //覆盖
      packHtml :function(data) {
        var html = "";
        data.forEach(function(v, i) {
            html += '<li><a class="item" href="' + v.job_url + '"><span class="item-text">' + v.title + (v.top_activity == 1 ? '<span class="jipiao"></span>' : "") + '</span><div class="item-des"><span>' + v.dq + '</span><em class="sep">|</em>               <span>' + v.detail_workyears + '</span><em class="sep">|</em>               <span>' + v.detail_edulevel + '</span>              </div>              <div class="item-right">                <span class="item-em">' + v.salary + '</span>               <span class="icon go">@</span>              </div>            </a>          </li>';
        });
        return html;
      },
      //覆盖
      nomore:function(tip) {
        tip = tip || "没有更多内容了";
        html = '<div class="nomore-page"><div class="pictip"></div><div class="tip">' + tip + "</div></div>";

        $(html).insertAfter($(".item-list"));
      },

      //重写
      loadmoreFuc : function(func) {
        func = func || function() {};
        $.ajax({
            url: "/usere/getejobs4json/",
            data: {
                page: self.curpage,
                user_id: user_id
            },
            success: function(data) {
              var data = JSON.parse(data);
              func(data);
            }
        });
      },

      //不需要重写
      loadmoreFunCallback:function(res){
        var self = this;
        self.loading = false;
        if (self.end) {return;}

        if (res.flag === 1) {
            ++self.curpage;
            var div = document.createElement("div");
            div.innerHTML = self.packHtml(res.list);
            while (div.firstChild) {
                self.getCon[0].appendChild(div.firstChild);
            }
            if (res.list.length < self.opt.pageSize) {
                end = true;
                self.nomore();
            }
        } else {
            alert("获取数据失败");
        }
      }

    };

  return loadMore;

});