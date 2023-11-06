(function () {
  // 解决再商品详情页和首页对应的JSON文件路径不同的问题
  var dataUrl = "./res/data/data.json"; //默认JSON文件为首页的路径
  console.log(location.search); //location.search:获取传来的值
  // 通过判断location.search是否有值，判断在首页还是在商品详情页
  // 再通过改变dataUrl的值来实现不同的页面，对应不同的JSON文件的路径
  if (location.search) {
    dataUrl = "../res/data/data.json";
    // 页面传值时，将JSON文件改为商品详情页的路径
  }

  function Page(url) {
    // url JSON文件路径
    // 在商品详情页面获取首页传来的数据
    if (location.search) {
      var urlString = location.search.replace("?", "");
      var temp = urlString.split("&");
      var type = temp[0].replace("type=", "");
      var id = temp[1].replace("id=", "");
      // console.log(urlString,temp,type,id);

      // 商品详情页，获取指定的JSON文件
      this.loadDate(url).then(
        function (res) {
          // console.log(res);
          var goodsDetail = res.goods[type].des[id];
          // console.log(goodsDetail);
          this.goodsInfo(goodsDetail); //商品信息
          this.zoom(); //放大镜函数
          this.login(); //创建登录注册
          this.nav(res.nav); //创建导航栏
          this.addRightBar(); //创建右侧栏
        }.bind(this)
      );
    } else {
      // 在首页获取全部JSON数据
      this.loadDate(url).then(
        //数据请求成功
        function (res) {
          console.log(res);
          // 获取到数据  res 调用初始化函数
          this.init(res);
        }.bind(this)
        // .bind(this) 改变this的指向 指向实例化对象
      );
    }
  }

  // 异步获取data.json文件中的数据
  Page.prototype.loadDate = function (url) {
    return new Promise(function (success, fail) {
      // 发get请求 .then 请求成功
      $.get(url).then(function (res) {
        success(res);
      });
      // Ajax 写法
      // $.ajax({
      //   type: "get",
      //   url: url,
      // }).then(function (res) {
      //   success(res);
      // });
    });
  };

  // 初始化项目
  Page.prototype.init = function (data) {
    this.login(); //创建登录注册
    this.banner(); //创建轮播图
    this.nav(data.nav); //创建导航栏
    this.categoryNav(data.category); //创建分类导航栏
    this.goodsList(data.goods); //创建商品
    this.addLeftBar(data.goods); //创建左侧栏
    this.addRightBar(); //创建右侧栏
  };

  // 注册登录
  Page.prototype.login = function () {
    var loginView = null; // 设置变量用于存放对话框DOM,判断对话框是否已将存在
    function loginRegisterAction(event) {
      //event事件对象
      event.preventDefault(); // 阻止a标签的默认形为
      // loginView = null
      if (!loginView) {
        // 如果对话框没有显示出来
        var type = event.target.dataset.type; //event.target:获取目标对象
        // console.log(type, event);
        loginView = new pageTools.Login(type == "login", "body", function () {
          loginView = null;
        });
      }
    }
    function loginRegister() {
      $(".login").click(loginRegisterAction);
      $(".register").click(loginRegisterAction);
    }
    loginRegister();
  };

  // 轮播图
  Page.prototype.banner = function () {
    new Swiper(".swiper", {
      // direction: 'vertical', // 垂直切换选项
      loop: true, // 循环模式选项
      // 自动播放
      // autoplay:true,
      autoplay: {
        delay: 3000,
        stopOnLastSlide: false,
        disableOnInteraction: false,
      },

      // 如果需要分页器
      pagination: {
        el: ".swiper-pagination",
        // 单击分页器可以跳转
        clickable: true,
      },

      // 如果需要前进后退按钮
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },

      // 如果需要滚动条
      // scrollbar: {
      //   el: '.swiper-scrollbar',
      // },
    });
  };

  // 导航栏实例化处理
  Page.prototype.nav = function (data_nav) {
    new pageTools.Nav(".nav_container", data_nav, function () {
      console.log(text);
    });
    navShow = null;
  };

  // 分类导航实例化
  Page.prototype.categoryNav = function (category_data) {
    new pageTools.Category(".category-nav", category_data, function (res) {
      // console.log(res);
    });
  };

  // 实例化商品列表
  Page.prototype.goodsList = function (goods_data) {
    // 实例化Good构造函数
    new pageTools.Goods(".main-container", goods_data, function () {});
  };

  // 商品详情
  Page.prototype.goodsInfo = function (data) {
    $(".goods-img").css("background-image", "url(" + data.image + ")");
    $(".goods-info .title").text(data.title);
    $(".goods-info .price").text(data.price);
  };

  // 放大镜
  Page.prototype.zoom = function () {
    new pageTools.Zoom(".goods-img");
  };

  // 左侧栏快速定位
  Page.prototype.addLeftBar = function (data) {
    var leftBar = $("<ul class='left-bar'></ul>");
    $(document.body).append(leftBar);
    // 创建DOM用于存放分类
    data.forEach(function (info) {
      // console.log($(".left-bar").height());
      var clsLi = $(
        "<li style='height:" +
          $(".left-bar").height() / data.length +
          // 动态设置高度
          "px'><a href='#" +
          info.id +
          "'>" +
          info.title +
          "</a></li>"
      );
      //页内跳转(需要设置锚点#，锚点关联的是id值) 写法 #id值
      leftBar.append(clsLi);
    });
    // 当页面向下滚动一定距离时在显示左侧边栏
    $(window).scroll(function () {
      console.log($(document).scrollTop());
      if ($(document).scrollTop() >= 700) {
        $(".left-bar").fadeIn(600);
      } else {
        $(".left-bar").fadeOut(300);
      }
    });
  };

  // 右侧栏QQ客服和快速回到顶部
  Page.prototype.addRightBar = function () {
    var rightBar = $("<ul class='right-bar'></ul>");
    var data = ["客服", "回到顶端"];
    data.forEach(function (item) {
      if (item == "客服") {
        rightBar.append(
          $(
            '<li><a target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin=1414725230&site=qq&menu=yes">\
            <img border="0" src="http://wpa.qq.com/pa?p=2:1414725230:52" alt="请问您需要什么帮助？" title="请问您需要什么帮助？"/>\
            </a></li>'
          )
        );
      } else {
        var toTop = $(
          "<li class='top'><i class='iconfont icon-fanhuidingbu'></i></li>"
        );
        // 回到顶部
        toTop.click(function (e) {
          e.preventDefault(); //阻止a标签默认行为
          $("html,body").animate(
            {
              //JQ动画
              scrollTop: 0,
            },
            400
          );
        });
        rightBar.append(toTop);
        // 当页面向下滚动一定距离时在显示回到顶部
        $(window).scroll(function () {
          if ($(document).scrollTop() > 700) {
            $(".top").css("display", "block");
          } else {
            $(".top").css("display", "none");
          }
        });
      }
    });
    $(document.body).append(rightBar);
  };

  // 主函数
  function main() {
    new Page(dataUrl);
  }

  main();
})();
