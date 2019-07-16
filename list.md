# 插件列表

### 1. jQuery

**主页**: https://jquery.com/

```js
/*!
 * jQuery JavaScript Library v3.4.1
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2019-05-01T21:04Z
 */

/**
 * jQuery 就不作说明了
 * 示例
 */
LazyScript.load('jquery', function(global){
  // code...
});

```



### 2. Glide

**主页:** https://glidejs.com/

**Options**: https://glidejs.com/docs/options/

```js
/*!
 * Glide.js v3.3.0
 * (c) 2013-2019 Jędrzej Chałubek <jedrzej.chalubek@gmail.com>
 * Released under the MIT License.
 * 轮播图插件
 */

/**
 * 完整模式 (官方默认使用方式)
 */
LazyScript.load('glide', function(global){
  new Glide('.glide', {
    /**
     * 轮播类型
     *   carousel: 头尾无缝滚动
     *   slider: 滚动到头尾后回退至另一端
     * 
     * 类型: 字符串枚举 ('carousel', 'slider')
     * 默认值: 'slider'
     */
    type: 'carousel',
    
    /**
     * 自动播放间隔
     * 
     * 类型: bool/number
     * 默认值: false
     */
    autoplay: 5000,
    
    /**
     * 是否循环播放
     * 
     * 类型: bool
     * 默认值: true
     */
    rewind: true,
    
    /**
     * 鼠标悬停时暂停
     * 
     * 类型: bool
     * 默认值: false
     */
    hoverpause: true,
    
    /**
     * 切换动画
     * 
     * 类型: string
     * 默认值: 'cubic-bezier(0.165, 0.840, 0.440, 1.000)'
     * 可选值: 'linear','ease','ease-in','ease-out','ease-in-out'
     */
    animationTimingFunc: 'ease-in-out',
    
    /**
     * 切换动画的动画时间
     * 
     * 类型: number
     */
    animationDuration: 800,
    
    /**
     * 更多设置查看主页
     */
  }).mount();
});

/**
 * 精简模式
 */
LazyScript.load('glide.package', function(global) {
  $('.glide').glide({
    // 是否有左右切换按钮
    arrows: true,
    
    // 是否有点状导航
    bullets: true,
    
    // 是否循环播放 (rewind 属性的别名, 只有精简模式下有效)
    // 在精简模式下, 如果不指定 rewind 和 loop, 循环与否会根据轮播类型自动决定
    // 轮播类型为 carousel 则循环, 轮播类型为 slider 则不循环
    loop: true,
  });
})

```

**HTML**

```html
<!-- 精简模式 -->
<div class="glide">
  <!-- 精简模式下可省略 .glide__track 这一层 -->
  <div class="glide__slides" data-glide-el="track">
    <div class="glide__slide"><img src="img1.jpg" alt=""></div>
    <div class="glide__slide"><img src="img1.jpg" alt=""></div>
    <div class="glide__slide"><img src="img1.jpg" alt=""></div>
  </div>
  <!-- 精简模式下无需添加左右切换按钮和点状导航, 在 js 中使用 arrows 和 bullets 属性指定即可 -->
</div>

<!-- 完整模式 -->
<div class="glide">
  <div class="glide__track" data-glide-el="track">
    <ul class="glide__slides">
      <li class="glide__slide"><img src="img1.jpg" alt=""></li>
      <li class="glide__slide"><img src="img2.jpg" alt=""></li>
      <li class="glide__slide"><img src="img3.jpg" alt=""></li>
    </ul>
  </div>
  <div class="glide__arrows" data-glide-el="controls">
    <button class="glide__arrow glide__arrow--left" data-glide-dir="<">prev</button>
    <button class="glide__arrow glide__arrow--right" data-glide-dir=">">next</button>
  </div>
  <div class="glide__bullets" data-glide-el="controls[nav]">
    <button class="glide__bullet" data-glide-dir="=0"></button>
    <button class="glide__bullet" data-glide-dir="=1"></button>
    <button class="glide__bullet" data-glide-dir="=2"></button>
  </div>
</div>
```



### 3. Lightbox

**主页**: https://lokeshdhakar.com/projects/lightbox2/

```js
/*!
 * Lightbox v2.11.0
 * by Lokesh Dhakar
 *
 * More info:
 * http://lokeshdhakar.com/projects/lightbox2/
 *
 * Copyright Lokesh Dhakar
 * Released under the MIT license
 * https://github.com/lokesh/lightbox2/blob/master/LICENSE
 *
 * 图片点击放大
 */

/**
 * 示例
 */
LazyScript.load('lightbox', function(global){
  // lightbox 全局设置
  lightbox.option({
    fadeDuration: 300,
    imageFadeDuration: 300,
    resizeDuration: 400,
  });
  
  /**
   * lightbox 不需要主动调用, 只需要添加 data-lightbox 属性即可
   * 详细 html 结构见下方
   */
});
	
```

**HTML**

```html
<!-- Lightbox 结构示例-->
<!-- 属性 data-lightbox: 必需; 指定分组; -->
<!-- 属性 data-title: 非必需; 放大显示时, 出现在图片下方的描述文字; -->
<a data-lightbox="lb_1" href="example.jpg" data-title="example"><img src="example.jpg"  alt=""></a>
```



### 4. Lazyload

```js
/*!
 * version: 0.1.0
 * 由 lazyload v2.x 修改而来;
 */

/**
 * 示例
 */
LazyScript.load('lazyload', function(global){
  /**
   * 选择器选中的可以是 img, 也可以是其他元素, 如 div (图片将被添加为背景图片)
   */
  $('.lazyload').lazyload({
    /**
     * 指定存放图片链接的属性名
     *
     * 类型: 字符串(合法的属性名, 建议使用默认值)
     * 默认值: 'data-src'
     */
    src: 'data-src',

    /**
     * 指定存放图片 srcset 值的属性名
     * 由于 srcset 属性兼容性不是很好, 建议忽略该设置
     *
     * 类型: 字符串(合法的属性名)
     * 默认值: 'data-srcset'
     */
    srcset: 'data-srcset',

    /**
     * 基本没用.
     * 当不通过 jQuery 使用 lazyload 时, 用于 lazyload 程序内部选择元素
     * 如: Lazyload({selector: '.lazyload'});
     *
     * 类型: 字符串(有效的选择器)
     * 默认值: '.lazyload'
     */
    selector: '.lazyload',

    /**
     * 占位图片
     *
     * 类型: 字符串(base64 格式的图片码, 可使用工具转换现有图片得到)
     * 默认值: (没有)
     */
    placeholder: '',

    /**
     * 加载延迟
     * 用于测试, 实际应用中不设置或设置为 0
     *
     * 类型: 数值(毫秒数, 1000 = 1秒)
     * 默认值: 0
     */
    delay: 0,

    /**
     * 加载失败时的回调函数
     * 无参数, this 指向加载失败的元素
     *
     * 类型: 函数/null
     * 默认值: (无)
     */
    onerror: null,

    /**
     * 加载成功(完成)时的回调函数
     * 无参数, this 指向加载成功(完成)的元素
     *
     * 类型: 函数/null
     * 默认值: (无)
     */
    onload: null,  
  });
});

```



### 5. Scollspy

```js
/*!
 * version: 0.1.0
 * 内部开发, 滚动监听功能
 */

/**
 * 示例
 * 简要说明:
 * "滚动监听"功能可分解为三个部分:
 *   1. 监听指定容器的滚动事件
 *   2. 监听(容器滚动时)指定元素的位置变化
 *   3. 将监听结果反馈给指定的接收元素
 * 基于以上划分, scrollspy 相应的将滚动监听分解为了三个函数
 * 三个函数可连写
 */
LazyScript.load('scrollspy', function(global){
  /**
   * 连写示例
   * 如下, 一个最常用的应用场景:
   * 当 window 滚动时, 监听所有带有 id 的元素, 并反馈至 .nav 下的锚点链接
   */
  var spyer = $(window).scrollspy()
      .spy('[id]', 60)
      .feedback('.nav a');
  
  /**
   * 1. 监听容器滚动
   * 
   * @param selector 容器选择器; 必需; 
   *   类型: 字符串/HTML元素/jQuery对象/window;
   *   默认值: 无;
   *   说明: 指定被监听容器;
   *
   * @param callback 滚动回调函数; 非必需;
   *   类型: 函数/null;
   *   默认值: 无;
   *   说明: 用于指定滚动事件回调函数, this 指向滚动容器, 无参数;
   *
   * @return 
   *   类型: Scrollspy 对象, 一个 Scrollspy 对象包含六个方法:
   *   - init 初始化, 初始化后会失去所有监视的元素和绑定的反馈接收元素; 
   *      init 还可以用于设置 callback
   *   - spy (详细说明见下方)
   *   - feedback (详细说明见下方)
   *   - update 刷新
   *   - stop 停止监听
   *   - start 开始监听
   */
  var spyer = $(selector).scrollspy(callback);

  /**
   * 2. 监听指定元素的位置
   * 
   * @param selector 监听元素选择器; 必需;
   *   类型: 字符串/HTML元素/jQuery对象;
   *   默认值: 无;
   *   说明: 指定被监听元素;
   *
   * @param threshold 阈值(偏移值); 非必需;
   *   类型: 数字;
   *   默认值: 0;
   *   说明: 辅助判断元素是否已进入窗口;
   *
   * @param callback 监听回调函数; 非必需;
   *   类型: 字符串/HTML元素/jQuery对象/window;
   *   默认值: 无;
   *   说明: 当一个被监听元素被判断已进入窗口时调用该函数;
   *     接受两个参数, 第一个是当前进入的元素, 第二个是之前进入的元素(可能是 null)
   *
   * @return
   *   类型: Scrollspy 对象;
   */
  spyer.spy(selector, threshold, callback);

  /**
   * 3. 反馈监听结果到指定元素
   * 
   * @param selector 反馈接收元素选择器; 必需;
   *   类型:字符串/HTML元素/jQuery对象; 
   *   默认值:无;
   *
   * @param isRelated 元素关联方法; 非必需;
   *   - 用于判断一个被监听元素与一个反馈接收元素是否相关;
   *   - 接受两个参数, 第一个是被监听元素, 第二个是反馈接收元素;
   *   类型:函数/null; 
   *   默认值:(见源码); 
   *
   * @param callback 反馈回调函数; 非必需;
   *   类型: 函数/null;
   *   默认值: (见源码);
   *   说明: 当一个被监听元素被判断进入窗口时自动调用该函数; 函数接受两个参数,
   *     第一个是当前接收反馈的元素, 第二个是之前已接收反馈的元素(可能是 null)
   *
   * @return 
   *   类型: Scrollspy 对象;
   */
  spyer.feedback(selector, isRelated, callback);
});

```



### 6. Tabs

```js
/*!
 * version: 0.1.0
 * 内部开发, 标签页组件
 */

/**
 * 示例
 */
LazyScript.load('tabs', function(global){
  // T 大写
  var tabs = Tabs().connect(
    // 指定标签头
    { 
      el:$('.tabs__tab'),
    },
    // 指定标签体
    {
      el:$('.tabs__panel'),
      event:null,
    }).activate(); // 激活第一组标签页
});

```

**HTML**

```html
<!-- tabs 结构示例 -->
<div class="js-tabs">
  <ul class="tabs__header">
    <li class="tabs__tab">Tab1</li>
    <li class="tabs__tab">Tab2</li>
    <li class="tabs__tab">Tab3</li>
  </ul>
  <div class="tabs__body">
    <div class="tabs__panel is-active">
      <p>Tab Content 1</p>
    </div>
    <div class="tabs__panel">
      <p>Tab Content 2</p>
    </div>
    <div class="tabs__panel">
      <p>Tab Content 3</p>
    </div>
  </div>
</div>
```



### 7. matchMedia

**文档**: [matchMedia](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/matchMedia)

```js
/*!
 * 浏览器自带功能, 无需启用
 * 兼容性: https://caniuse.com/#search=matchMedia
 * pollyfill: https://polyfill.io/v3/polyfill.min.js?features=matchMedia
 */

/**
 * 示例
 * 
 * 说明: 
 *   1. 函数 matchMedia('(min-width:992px)') 返回一个 MediaQueryList 对象;
 *   2. MediaQueryList 对象的 addListener 方法为对象添加监听函数;
 *   3. 当屏幕变化进入或超出指定的媒体查询范围时, 触发一次监听函数; 
 *   4. 因为进入或超出范围都会被触发, 所以监听函数内部使用 this.matches 进一步判断
 *      是否在查询范围内
 */
matchMedia('(min-width:992px)').addListener(function(){
  if(this.matches) {
    // do something
  } else {
    // do something
  }
});

```



### 8. InchingTo

```js
/*!
 * version: 0.3.0
 * 内部开发的容器缓动效果 (缓动效果, 即页面或容器缓慢滚动至指定位置的动画效果)
 */

// 示例
LazyScript.load('inching', function(global){
  /**
   * 直接使用
   *
   * 参数 options
   */
  inchingTo({
    /**
     * 缓动的容器
     * 
     * 类型: window/document/HTMLElement/选择器(字符串)/jQuery对象
     * 默认值: window
     */
    scroll: window,
    
    /**
     * 目标位置, 可通过元素指定, 也可通过数值直接指定
     *
     * 类型: 选择器(字符串)/HTMLElement/jQuery对象/数值
     * 默认值: (无)
     */
    target: null,
    
    /**
     * 偏移量, 通常指导航条高度
     *
     * 类型: 数值; 
     * 默认值: 0;
     */
    offset: 0,
    
    /**
     * 动画时间
     *
     * 类型: 数值或函数, 如果是函数, 第一个参数是滚动距离
     * 默认值: (函数, 见下方)
     */
    duration: function(distance) {
      if (distance < 1) return 0;
      return Math.round(Math.max(Math.log(distance) - 2, 1) * 3) * 17;
    },
  });

  /**
   * 在 jQuery 中使用, 指定容器缓动至目标位置
   *
   * 参数 options 结构同上
   * options.scroll 可省略, 省略时默认使用第一个 _scroll 参数
   */
  $(_scroll).inchingTo(options);

  /**
   * 在 jQuery 中使用, 为锚点链接添加点击缓动效果;
   * 上面两个都是页面直接缓动至目标, 
   * 下面这个则是将缓动效果添加到锚点链接的 click 事件上
   *
   * 参数 options 结构同上
   * options.target 可省略, 省略时默认使用第一个 _target 参数
   */
  $(_target).clickInching(options);
  
  /**
   * 在 jQuery 中使用, 
   * 页面的 URL 含有锚点时, 自动添加缓动效果
   *
   * 参数 options 结构同上
   * options.scroll 和 options.target 可省略
   * 省略时, options.scroll 取 _scroll, options.target 取 location.hash
   */
  $(_scroll).loadInching(options);
});

```



### 9. Highlight

```js
/*!
 * version: 0.2.0
 * 内部开发, 菜单高亮
 */

// 示例
LazyScript.load('highlight', function(global){
  $('.js-w-navmenu').highlight({
    /**
     * 指定为匹配项添加的类
     *
     * 类型: 字符串(前面不带点)
     * 默认值: 'is-active'
     */
    class: 'is-active',

    /**
     * 选择器, 用于筛选菜单内的链接
     *
     * 类型: 字符串(合法的选择器, 建议使用默认值)
     * 默认值: 'a[href]'
     */
    links: 'a[href]',

    /**
     * 指定以何种方式匹配链接和获取上级页链接
     * 1. 'url': 解析当前页的 url, 生成一组可能的地址, 并使用该组地址匹配; 
     * 		适用于每一级页面都严格对应 url 中的一级地址, 且默认页面是 index.html;
     * 2. 'dom': 根据当前页 url 直接匹配查找链接, 找到后再根据 dom 结构查找上级页链接;
     * 		对 dom 结构有一定要求, 建议始终采用三级标准结构:
     * 		[菜单 ul] > [菜单项 li] > [菜单链接 a]
     * 3. 'both': 综合使用上面两种匹配方式;
     *
     * 类型: 字符串('url', 'dom', 'both' 三选其一, 传递其他值将不做任何匹配)
     * 默认值: 'both'
     */
    test: 'both',

    /**
     * 可自定义的回调函数, 用于决定如何高亮匹配项;
     * this 指向匹配的链接(a 标签, dom 元素), 
     * 默认仅传入一个参数: 上面指定的高亮类 (class 属性)
     *
     * 类型: 函数(如果传递的不是函数将使用下面所示的默认函数)
     * 默认值: (如下, 将高亮匹配链接的父级 li 标签)
     */
    light: function(cls) {
      $(this).parent('li').addClass(cls);
    },   
  });
});
```



### __. Sticky ( 弃用 )

**主页:**  https://github.com/wilddeer/stickyfill

```js
/*!
 * version: 2.1.0
 */

/**
 * position: sticky 的 pollyfill
 * 示例
 */
LazyScript.load('sticky', function(global){
  Stickyfill.add($('.sticky'));
});

```

