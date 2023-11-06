// 定义全局变量，便于将结果暴露出去
window.pageTools = window.pageTools || {};

(function () {
  // 1.登录注册
  // Login是一个构造函数，相当于一个类
  function Login(isLogin, selector, eventListener) {
    this.isLogin = isLogin; // 用来判断是登录还是注册
    this.selector = $(selector); // 获取DOM节点
    this.eventListener = eventListener; //回调函数
    this.init(); //调用初始化函数
  }

  // 将核心代码挂在原型链上
  Login.prototype.init = function () {
    // 核心代码
    // 登录或注册对话框确认密码要不要显示
    var isShow = this.isLogin ? "none" : "block";
    // 设置提交按钮上的文字内容
    var buttonText = this.isLogin ? "登录" : "注册";
    // 添加对话框DOM
    this.dialog = $(
      '<div class="dialog">\
          <button class="close-btn">&times;</button>\
          <span class="welcome">Welcome</span>\
          <div class="input-box">\
              <input type="text" placeholder="用户名">\
              <input type="password" placeholder="密码">\
              <input type="password" placeholder="确认密码" class="again-pwd">\
              <button class="btn"></button>\
          </div>\
      </div>'
    );

    // 添加DOM到文档中
    this.selector.append(this.dialog);

    // 如果是登录则不显示确认密码框，如果是注册则显示
    $(".again-pwd").css("display", isShow);

    // 单击“登录”或“注册”按钮
    $(".btn")
      .html(buttonText)
      .click(
        function () {
          this.dialog.remove(); // 清除dialog这个div中所有内容，且包括自身。
          this.dialog = null; // 垃圾回收处理（null表示指针没有指向，意味着不占用内存了）
          this.eventListener();
        }.bind(this)
      ); // 改变this的指向

    // 当单击“关闭”按钮时，清除上面创建的对话框DOM
    $(".close-btn").click(
      function () {
        this.dialog.remove();
        this.dialog = null;
        this.eventListener();
      }.bind(this)
    );
  };

  // 2.导航
  function Nav(selector, data, callback) {
    this.width = 1200;
    // selector:将处理的结果渲染到指定的DOM上
    this.superView = $(selector || "");
    // data：动态获取导航栏菜单项内容
    this.data = data || []; //避免传参时没传参数的处理
    // callback:菜单要执行的一些附带操作
    this.callback = callback;
    // 调用创建导航栏界面
    this.createView();
  }

  // 创建导航栏界面
  Nav.prototype.createView = function () {
    // console.log(this.data);
    var nav = $("<ul class = 'nav-list'></ul>"); //创建导航栏DOM
    this.data.forEach(
      function (info) {
        // console.log(info);
        var item = $(
          '<li class="nav-item" style="width:' +
            this.width / this.data.length +
            'px"><a href = "' +
            info.url +
            '">' +
            info.title +
            '<img src="' +
            info.imageurl +
            '"><span></span></a></li>'
        );
        nav.append(item); //将所有菜单项添加到前面的ul标签中
        //  style="width:' +this.width / this.data.length +'px"
        // \续行符
        // style="width:' +this.width / this.data.length 动态设置宽度
      }.bind(this)
    );
    this.superView.append(nav); //将结果渲染到前端
  };

  // 3.分类
  function Category(el, data, callback) {
    this.el = $(el || "");
    this.data = data || [];
    this.callback = callback;
    this.createView();
  }
  // 对Category进行原型扩展
  Category.prototype.createView = function () {
    var _this = this;
    // 创建分类一级菜单
    var category_menu = $('<ul class="category-menu"></ul>');
    this.el.append(category_menu);
    this.data.forEach(
      function (item) {
        // console.log(item);
        // 实现数据动态添加
        var category_menu_item = $(
          "<li style='height:" +
            500 / this.data.length +
            "px'><a href='javascript:void(0)'>" +
            item.title +
            "</a></li>"
        );
        category_menu.append(category_menu_item);

        category_menu_item
          .mouseenter(
            (function (item) {
              return function (e) {
                // 阻止a标签默认行为
                e.preventDefault();
                // 回调函数模拟处理
                _this.callback($(this).text());

                // 如果二级菜单有内容先清空二级菜单再添加内容
                if ($(".category-sub-menu")) {
                  $(".category-sub-menu").remove();
                }

                // 创建分类二级菜单
                var category_sub_menu = $(
                  "<ul class='category-sub-menu'></ul>"
                );
                $(this).append(category_sub_menu);
                // this 指向事件对象 category_menu_item
                category_sub_menu.css(
                  "width",
                  category_sub_menu.css("width") !== "15rem" ? "15rem" : "0"
                );
                item.des.forEach(function (info) {
                  // 设置height实现数据动态添加
                  sub_menu_item = $(
                    "<li style='height:" +
                      $(".category-sub-menu").height() / item.des.length +
                      "px'><a href='#'>" +
                      info.title +
                      "</a></li>"
                  );
                  category_sub_menu.append(sub_menu_item);
                });
              };
            })(item)
          )
          .mouseleave(function () {
            // 鼠标移出时清空内容，避免内容覆盖
            $(".category-sub-menu").remove();
          });
      }.bind(this)
    );
  };

  // 4.商品列表
  function Goods(el, data, callback) {
    this.el = $(el || "");
    this.data = data || {};
    this.callback = callback;
    // 调用挂在原型上的createView()函数
    this.createView();
  }
  // 通过原型进行扩展
  Goods.prototype.createView = function () {
    // 创建一个商品列表
    var goods_container = $("<ul class='goods'></ul>");
    // 将商品列表添加到目标节点上
    this.el.append(goods_container);
    // 商品一级分类处理
    // 对传过来的商品数据进行遍历添加
    this.data.forEach(function (item) {
      // console.log(item);
      var goods_item = $(
        '<li id="'+item.id+'" class="item">\
          <div class="addr" style="background-image:url(' +
          item.addr +
          ')"></div>\
          <h3 class="title">' +
          item.title +
          "</h3>\
      </li>"
      );
      goods_container.append(goods_item);
      // 商品二级分类
      var goods = $("<ul class='goods-list'></ul>");
      goods_item.append(goods);
      // $(".item").append(goods); 与上一行代码效果相同
      item.des.forEach(function (info) {
        var goods_item = $(
          '<li class="goods-item">\
        <a href="./view/goods_details.html?type=' +
            item.type +
            "&id=" +
            info.id +
            '">\
        <img class="image" src="' +
            info.image +
            '" title="' +
            info.name +
            '"></img>\
        <p class="name">' +
            info.name +
            '</p>\
        <p class="price">￥' +
            info.price +
            '</p>\
        <button class="btnBuy">抢购</button>\
        </a>\
        </li>'
        );
        goods.append(goods_item);
      });
    });
  };

  // 5.放大镜
  function Zoom(el) {
    this.el = $(el || "");
    this.createView(); //调用挂在原型上的函数
  }
  Zoom.prototype.createView = function () {
    //创建用于存放另一张大图的DOM(容器)
    // 将大图放在一个盒子中，盒子设置显示尺寸，里面的img可设置大图尺寸
    // 再通过定位，将大图移动到显示的位置
    var scaleView = $(
      "<div class='zoom-box'>\
        <img class='zoom' src=" +
        this.el.css("background-image").replace("url(", "").replace(")", "") +
        // 获取商品的背景图地址url("地址")，通过替换地址外面的url()拿到图片路径
        // 再对图片进行放大处理即可得到一张大图 (或通过请求数据获取大图)
        "alt='picture'>\
        </img>\
      </div>"
    );
    // 添加放大镜DOM
    this.el.append(scaleView);

    // 设置放大镜所显示的大图
    this.el
      .mouseenter(function () {
        scaleView.css("display", "block");
      })
      .mousemove(function (e) {
        console.log(e.offsetX, e.offsetY);
        // 获取鼠标相对于外层盒子的坐标值 * 图片尺寸/显示区域尺寸(放大比)
        // 通过定位让其在对应的位置显示
        $(".zoom").css({
          left: -e.offsetX * 2 + "px",
          top: -e.offsetY * 2 + "px",
        });
      })
      .mouseleave(function () {
        scaleView.css("display", "none");
      });
  };

  // 将构造函数函数暴露在全局变量下
  // window.pageTools.Nav = Nav;
  // window.pageTools.Login = Login;
  // window.pageTools.Category = Category;
  // window.pageTools.Goods = Goods;
  window.pageTools = {
    // Nav:Nav,  键，值同名可以直接写值
    Nav, //导航栏
    Login, //登录
    Category, //分类
    Goods, //商品
    Zoom, //放大镜
  };
})();
