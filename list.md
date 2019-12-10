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



### 2. Glide（弃用）

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
 * version: 0.2.0
 * 内部开发, 滚动监听功能
 */

/**
 * 监测滚动容器中哪个元素为『当前元素』，并反馈给对应的锚点链接
 */
LazyScript.load('scrollspy', function(global){
  var spy = Scrollspy({
    /**
     * 指定滚动容器，可省略;
     * 类型: window 对象/合法的 CSS 选择器/HTML 元素/jQuery 对象;
     */
    container: window,
    
    /**
     * 指定检测线位置，可省略;
     * 类型: 数字或字符串;
     * 说明：将『检测线』想象成一条虚拟的线，位于容器内，位置固定。当容器滚动时，
     *   - 距离检测线最近的元素会被判定为『当前元素』。
     * 指定方式：offset 允许两种指定方式：
     *   - 1.百分比，如 '20%'（检测线距容器顶部 20% 容器高）
     *   - 2.像素，如 '60px' 或 '60'（检测线距容器顶部 60px）
     */
    offset: '20%',
    
    /**
     * 指定判定方式，可省略；
     * 类型: 'near', 'strike', 'both' 三选一;
     * 说明：指定 'near' 时，元素中心线距离检测线最近的元素被判定为『当前元素』，
     *   - 指定 'strike' 时，只有当检测线穿过该元素时才会被判定为『当前元素』，
     *   - 指定 'both' 时，先按 strike 方式检测，检测不到再按 near 方式
     */
    method: 'both',
  }).feedback(
    /**
     * 指定锚点链接，不可省略；
     * 类型: 合法的 CSS 选择器/HTML 元素/jQuery 对象;
     * 说明：可以直接指定锚点链接元素集，也可以指定一个上级元素，
     *   - Scrollspy 会自动筛选出其中的锚点链接
     */
    targets = '.sidebar',
    
    /**
     * 指定锚点链接激活方式，可省略；
     * 类型: 合法的 CSS 类名/函数;
     * 说明：如果指定的是 CSS 类名，则在链接激活时添加该类，非激活时取消该类；
     *   - 而通过指定一个函数，你可以有更多的控制，
     *   - 比如链接激活时给链接的上级元素（而不是链接本身）添加类；
     *   - 函数接收两个参数，第一个是当前要激活的链接元素，第二个是默认的类名
     */
    active = 'is-active',
    
    /**
     * 指定锚点链接取消激活的方式，可省略；
     * 类型：同 「active」
     */
    deactive = function(target, cls) {
      $(target).removeClass(cls)
    }
  );
  
  /**
   * jQuery 调用方式
   * 各参数类型同上。
   * 其中，options 的 'container' 项不必指定，因为会被 $() 中的 container 覆盖
   */
  var spy = $(container)
  						.scrollspy(options)
  						.feedback(targets, active, deactive)
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
LazyScript.load('inchingTo', function(global){
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



### 10. Tiny Slider 2

**主页 / API**：https://github.com/ganlanyuan/tiny-slider#tiny-slider-2

**示例页**： http://ganlanyuan.github.io/tiny-slider/demo/

```javascript
/*!
 * Version 2.9.2
 * 轮播图插件，Owl Carousel 的后续版本，改进了缩略图导航等功能
 */

// 示例
LazyScript.load('tiny-slider', function(global) {
  var slider = tns({
    /**
     * 轮播图片的容器
     *
     * 类型：DOM 元素 | 选择器字符串
     * 默认值：'.slider'
     */
    container: '.my-slider',
    
    /**
     * 每页显示的图片数
     *
     * 类型：正整数
     * 默认值：1
     */
    items: 1,
    
    /**
     * 每次切换多少张图片
     *
     * 类型：正数 | "page"
     * 默认值：1
     */
    slideBy: 1,
    
    /**
     * 是否自动播放
     *
     * 类型：Boolean (true/false)
     * 默认值：false
     */
    autoplay: true,
    
    /**
     * 自动播放的时间间隔
     *
     * 类型：Boolean (true/false)
     * 默认值：false
     */
    autoplayTimeout: 5000,
    
    /**
     * 鼠标移入时是否暂停自动播放
     *
     * 类型：Boolean (true/false)
     * 默认值：false
     */
    autoplayHoverPause: true,
    
    /**
     * 是否循环播放
     *
     * 类型：Boolean (true/false)
     * 默认值：true
     */
    loop: true,
    
    /**
     * 允许鼠标拖动
     *
     * 类型：Boolean (true/false)
     * 默认值：false
     */
    mouseDrag: true,
    
    /**
     * 图片间距，单位为 px
     *
     * 类型：正整数 | 0
     * 默认值：0
     */
    gutter: 10,
    
    /**
     * 两侧留白，单位为 px
     *
     * 类型：正整数 | 0
     * 默认值：0
     */
    edgePadding: 20,
    
    /**
     * 响应式设计
     *
     * 类型：Object
     * 默认值：
     */
    responsive: {
      640: {
        edgePadding: 20,
        gutter: 20,
        items: 2
      },
      700: {
        gutter: 30
      },
      900: {
        items: 3
      }
    },
 
    /**
     * 启用懒加载
     * 使用自定义属性 data-src 存放图片网址，必须设置
     *
     * 类型：Boolean (true/false)
     * 默认值：false
     */
    lazyload: true,
    
    /**
     * 用于标记需要懒加载的图片
     *
     * 类型：选择器字符串
     * 默认值：'.tns-lazy-img'
     */
    lazyloadSelector: '.lazyload',
    
    /* 更多设置见主页和示例页 */
  });
})
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

