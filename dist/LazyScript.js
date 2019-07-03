/**
 * LazyScript.js v0.2.0
 * 部分参考 Sea.js 3.0.3
 * LazyScript.js **不是**模块解决方案!
 * 
 * 功能: 按需加载 JavaScript (正经的 js, 不能是模块定义文件)
 * 
 * 流程描述:
 * 使用 LazyScript.load 开始加载;
 * LazyScript.load 的参数 (字符串或函数) 被转换为 ScriptTask 对象, 称为"脚本任务", 其对应的 js 代码称为"任务脚本";
 * 如果 LazyScript.load 的宿主 (LazyScript.load 所在的 js) 是一个任务脚本, 且存在对应的 script 节点, 
 * 则将脚本任务传给宿主 (称为宿主的"二级脚本任务"), 宿主会在自身代码执行完毕时, 统一执行所有二级脚本任务;
 * 否则, 立即执行这些脚本任务;
 */
(function(global, undefined) {

  // 防止重复加载
  if (global.LazyScript) return;
  
  var LazyScript = {version: "0.2.0"};
  var data = LazyScript.data = {};

  // 类型检测
  function isType(type) {
    return function(obj) {
      return {}.toString.call(obj) == "[object " + type + "]";
    };
  }
  
  var isObject = isType("Object");
  var isString = isType("String");
  var isFunction = isType("Function");
  var isArray = Array.isArray || isType("Array");

  // 数组降维
  function flatten(arr1) {
    return arr1.reduce(function(acc, val) {
      return isArray(val) ? acc.concat(flatten(val)) : acc.concat(val);
    }, []);
  }

  var doc = document;
  
  // 从给定的一组 script 中找出 currentScript
  var findCurrentScript = (function() {
    // 支持 document.currentScript
    if ("currentScript" in doc) {
      return function(scripts) {
        var cur = doc.currentScript;
        for (var i = scripts.length-1; i >= 0; i--) {
          if (scripts[i] === cur) return scripts[i];
        }
        return null;
      }
    }

    // IE10
    if ("readyState" in doc.createElement("script") && 
        (!window.opera || window.opera.toString() !== "[object Opera]")) {
      return function(scripts) {
        for (var i = scripts.length-1; i >= 0; i--) {
          if (scripts[i].readyState === "interactive") return scripts[i];
        }
        return null;
      }
    }

    // IE11 及其他
    return function(scripts) {
      try {
        throw new Error('');
      } catch (e) {
        if (e.stack) {
          for (var i = scripts.length-1; i >= 0; i--) {
            if (scripts[i].src && e.stack.indexOf(scripts[i].src) > -1) return scripts[i];
          }
        }
      }
      return scripts[scripts.length - 1];
    }
  })();

  
  // 截取完整路径中的目录部分
  // dirname("a/b/c.js?t=123#xx/zz") ==> "a/b/"
  // ref: http://jsperf.com/regex-vs-split/15
  var DIRNAME_RE = /[^?#]*\//;
  function dirname(path) {
    return path.match(DIRNAME_RE)[0];
  }
  
  // 忽略 about:xxx 和 blob:xxx
  var IGNORE_LOCATION_RE = /^(about|blob):/;
  // 获取当前工作目录
  data.cwd = (!location.href || IGNORE_LOCATION_RE.test(location.href)) ? '' : dirname(location.href);
  
  // 建议给当前 script 添加 id: `lazyscript`
  var thisScript = doc.getElementById("lazyscript") || findCurrentScript(doc.scripts);
  data.path = thisScript.src;

  // 如果是内嵌使用, 将 base 设为当前工作目录 (cwd, 通常是所在页面的 url)
  data.base = dirname(thisScript.src || data.cwd);


  // 路径解析
  var DOT_RE = /\/\.\//g;
  var DOUBLE_DOT_RE = /\/[^/]+\/\.\.\//;
  var MULTI_SLASH_RE = /([^:/])\/+\//g;

  // Canonicalize a path
  // realpath("http://test.com/a//./b/../c") ==> "http://test.com/a/c"
  function realpath(path) {
    // /a/b/./c/./d ==> /a/b/c/d
    path = path.replace(DOT_RE, "/");
  
    /*
      @author wh1100717
      a//b/c ==> a/b/c
      a///b/////c ==> a/b/c
      DOUBLE_DOT_RE matches a/b/c//../d path correctly only if replace // with / first
    */
    path = path.replace(MULTI_SLASH_RE, "$1/");
  
    // a/b/c/../../d  ==>  a/b/../d  ==>  a/d
    while (path.match(DOUBLE_DOT_RE)) {
      path = path.replace(DOUBLE_DOT_RE, "/");
    }
  
    return path;
  }
  
  // Normalize an id
  // normalize("path/to/a") ==> "path/to/a.js"
  // NOTICE: substring is faster than negative slice and RegExp
  function normalize(path) {
    var last = path.length - 1;
    var lastC = path.charCodeAt(last);
    var suffix = data.suffix || '';
  
    // If the url ends with `#`, just return it without '#'
    if (lastC === 35 /* "#" */ || lastC === 36 /* "$" */) {
      return path.substring(0, last);
    }
  
    return (path.substring(last - 2) === ".js" ||
        path.indexOf("?") > 0 ||
        lastC === 47 /* "/" */) ? path : path + suffix + ".js";
  }
  
  var VARS_RE = /{([^{]+)}/g;
  
  function parseVars(id) {
    var vars = data.vars;
    if (vars && id.indexOf("{") > -1) {
      id = id.replace(VARS_RE, function(m, key){
        return isString(vars[key]) ? vars[key] : m;
      });
    }
    return id;
  }
  
  var ABSOLUTE_RE = /^\/\/.|:\//;
  var ROOT_DIR_RE = /^.*?\/\/.*?\//;
  
  function addBase(id) {
    var ret;
    var first = id.charCodeAt(0);
    
    if (first === 94 /* "^" */) {
      ret = id.substring(1);
    }
    // Absolute
    else if (ABSOLUTE_RE.test(id)) {
      ret = id;
    }
    // Relative
    else if (first === 46 /* "." */) {
      ret = data.cwd + id;
    }
    // Root
    else if (first === 47 /* "/" */) {
      var m = data.cwd.match(ROOT_DIR_RE);
      ret = m ? m[0] + id.substring(1) : id;
    }
    // Top-level
    else {
      ret = data.base + id;
    }
  
    // Add default protocol when url begins with "//"
    if (ret.indexOf("//") === 0) {
      ret = location.protocol + ret;
    }
  
    return ret;
  }
  
  function id2Url(id) {
    if (!id) return "";
  
    id = parseVars(id);
    id = normalize(id);
    id = addBase(id);
  
    return realpath(id);
  }

  // 缓存已生成的 ScriptTask
  var _cachedTasks = Object.create(null);

  // 记录当前正在加载的 scriptNode
  var _loadingScriptNodes = [];
  
  var STATUS = {
    // 1 - 加载任务开始, 正在加载 script 标签
    LOADING: 1,
    // 2 - script 标签加载完成, 等待二级任务完成 (二级任务是指 script 标签执行时生成的 ScriptTask)
    LOADED: 2,
    // 100 - 二级任务全部完成
    READY: 100,
    // 404
    ERROR: 404,
  };

  /**
   * ScriptTask 对象构造函数
   * @param {string/function} src 
   * @param {string} type 
   */
  function ScriptTask(src, type) {
    // 事件
    this.events = Object.create(null);

    // 已触发的事件
    this.emitted = Object.create(null);

    // 任务脚本, 或指向任务脚本的 url
    this.src = src;

    // ScriptTask 类型, 'FILE', 'POLYFILL', 'FUNCTION' 之一
    this.type = type;

    // 二级任务
    this.tasks = [];

    // 未完成的二级任务数
    this.tasksRemain = 0;

    // 未完成依赖任务数
    this.depsRemain = 0;

    // 状态
    this.status = 0;

    this.once('ready', function() {
      this.status = STATUS.READY;
    }).once('error', function() {
      this.status = STATUS.ERROR;
    }).once('load', function() {
      this.status = STATUS.LOADED;
      this.exec();
    });
  }

  ScriptTask.prototype = {
    constructor: ScriptTask,

    // 添加一次性回调, 且当事件已触发时, 直接执行回调
    once: function(event, callback) {
      if (this.emitted[event]) {
        callback.call(this);
      } else {
        if (!this.events[event]) this.events[event] = [];
        var fn = function() {
          callback.apply(this, arguments);
          var list = this.events[event];
          list.splice(list.indexOf(fn), 1);
        };
        this.events[event].push(fn);
      }
      return this;
    },

    // 触发事件
    emit: function(event) {
      // console.log(event + ' happend')
      var list = this.events[event];
      if (list) {
        this.emitted[event] = true;
        var callbacks = list.slice();
    
        // 执行回调
        for(var i = 0; i < callbacks.length; i++) {
          callbacks[i].apply(this, [].slice.call(arguments, 1));
        }
      }
      return this;
    },

    // 添加一个或多个依赖
    // 只有 FUNCTION 类型的 ScriptTask 才可能有依赖
    addDependence: function() {
      var deps = flatten([].slice.call(arguments));
      this.depsRemain += deps.length;
      var _self = this;
      for (var i = 0, len = deps.length; i < len; i++) {
        deps[i].once('ready', function() {
          _self.depsRemain--;
          _self.checkLoad();
        });
      }
      return this;
    },

    // 添加二级任务
    // 只有 FILE 类型的 ScriptTask 才可能有二级任务
    addTasks: function(tasks) {
      this.tasks = this.tasks.concat(tasks);
      this.tasksRemain += tasks.length;
      var _self = this;
      for(var i = 0, len = tasks.length; i < len; i++) {
        tasks[i].once('ready', function(){
          _self.tasksRemain--;
          _self.checkReady();
        }).once('error', function() {
          _self.emit('error');
        });
      }
      return this;
    },

    // 添加代理
    // 只有 POLYFILL 类型的 ScriptTask 才有代理
    addProxy: function(task) {
      var _self = this;
      _self.status = task.status;
      task.once('ready', function() {
        _self.emit('ready');
      }).once('error', function() {
        _self.emit('error');
      }).once('load', function() {
        _self.emit('load');
      });
      return this;
    },

    // 检查是否加载完毕
    // 仅用于 FUNCTION 类型的 ScriptTask
    checkLoad: function() {
      if (this.status === STATUS.LOADING && !this.depsRemain) {
        this.emit('load');
      }
      return this;
    },

    // 检查二级任务是否全部完成
    // 仅用于 FILE 类型的 ScriptTask
    checkReady: function() {
      if (this.status === STATUS.LOADED && !this.tasksRemain) {
        this.emit('ready');
      }
      return this;
    },

    // 加载任务脚本
    load: function() {
      var task = this;
      task.status = STATUS.LOADING;
      
      if (task.type === 'FUNCTION') {
        task.checkLoad();
        return this;
      }

      // Load script
      var node = doc.createElement("script");
        
      node.charset = 'utf-8';
      node.async = true;
      node.src = task.src;

      node.onload = function() { cb(false) };
      node.onerror = function() { cb(true) };

      _loadingScriptNodes.push(node);
      // 开始加载 <script>
      doc.head.appendChild(node);

      function cb(error) {
        node.onload = node.onerror = null;
        // doc.head.removeChild(node);
        var index = _loadingScriptNodes.indexOf(node);
        if (index >= 0) _loadingScriptNodes.splice(index, 1);
        node = null;
        task.emit(error ? 'error' : 'load');
      }

      return this;
    },

    exec: function() {
      switch(this.type) {
        case 'FUNCTION':
          try {
            this.src.call(global, global);
            this.emit('ready');
          } catch (e) {
            this.emit('error');
            console.error(e);
          }
          break;
        case 'FILE':
          if (this.tasks.length) batch(this.tasks);
          this.checkReady();
          break;
      }
      return this;
    },
  };

  // 新建或获取缓存的 ScriptTask
  function getScriptTask(src) {
    var task = null;
    if (isFunction(src)) {
      task = new ScriptTask(src, 'FUNCTION');
    } else if (/^polyfill:/i.test(src)) {
      src = 'POLYFILL:' + src.substring(9).trim();
      task = _cachedTasks[src] || (_cachedTasks[src] = new ScriptTask(src.substring(9), 'POLYFILL'));
    } else {
      src = id2Url(src);
      task = _cachedTasks[src] || (_cachedTasks[src] = new ScriptTask(src, 'FILE'));
    }
    return task;
  }

  data.polyfill = function(features) {
    return 'https://polyfill.io/v3/polyfill.min.js?features=' + features.join('%2C');
  };

  // 批量处理 ScriptTask 对象
  // 集中处理的主要目的是合并 polyfill
  function batch(tasks) {
    var features = [];
    var polyfill = new ScriptTask('', 'FILE');
    var task, i, len;
    for (i = 0, len = tasks.length; i < len; i++) {
      task = tasks[i];
      if (task.status >= STATUS.LOADING) continue;
      if (task.type === 'POLYFILL') {
        task.addProxy(polyfill);
        features.push(task.src);
      } else {
        task.load();
      }
    }
    if (features.length && isFunction(data.polyfill)) {
      polyfill.src = data.polyfill(features);
      polyfill.load();
    }
  }

  /**
   * 配置参数
   * 仅保留 sea.js 的 vars 配置方式, 取消其他
   * 如:
   * LazyScript.config({
   *   vars: {
   *     'src': 'src',
   *     'min':'src.min',
   *   }
   * }) ==> LazyScript.load('{min}/jquery', '{src}/custom')
   * 
   * 新加 suffix 选项, 用于添加统一的后缀, 后缀位于文件名和 .js 之间;
   * 新加 polyfill 回调, 用于自定义 polyfill 加载方式, 参数为 Features 数组
   */
  LazyScript.config = function(configData) {
    for (var key in configData) {
      var curr = configData[key];
      var prev = data[key];
  
      // Merge object config such as alias, vars
      if (prev && isObject(prev)) {
        for (var k in curr) {
          prev[k] = curr[k];
        }
      }
      else {
        // Concat array config such as map
        if (isArray(prev)) {
          curr = prev.concat(curr);
        }
        // Make sure that `data.base` is an absolute path
        else if (key === "base") {
          // Make sure end with "/"
          if (curr.slice(-1) !== "/") {
            curr += "/";
          }
          curr = addBase(curr);
        }
  
        // Set config
        data[key] = curr;
      }
    }
    return this;
  };

  // 解析路径, 用于测试
  LazyScript.resolve = id2Url;
  
  // 预加载, 告诉 LazyScript 哪些已手动加载完成
  LazyScript.preload = function() {
    for (var i = 0, len = arguments.length; i < len; i++) {
      getScriptTask(arguments[i]).emit('load');
    }
    return this;
  };

  /**
   * 主函数, 开启 ScriptTask;
   * 
   * 参数可以是字符串或函数, 也允许将它们组合成数组, 但这样做并不会带来额外的好处;
   * 字符串除了可以使用 sea.js 或 require.js 同款字符串之外, 还可以使用形如 'polyfill:FeatureName' 
   * 的字符串, 用来请求 polyfill, 其中 FeatureName 对大小写敏感
   * 
   * 字符串或函数都会被转换成 ScriptTask 对象, 其中函数转换成的 ScriptTask 会对在它之前生成的 ScriptTask 形成依赖
   */
  LazyScript.load = function() {
    var host = null;
    var node = findCurrentScript(_loadingScriptNodes);
    if (node) host = _cachedTasks[node.src];

    var args = flatten([].slice.call(arguments));
    var tasks = [], task;
    for (var i = 0, len = args.length; i < len; i++) {
      task = getScriptTask(args[i]);

      // 函数转换成的 ScriptTask 对象会对在它之前生成的 ScriptTask 形成依赖
      if (task.type === 'FUNCTION') {
        task.addDependence(tasks);
      }
      tasks.push(task);
    }
    if (host) host.addTasks(tasks);
    else batch(tasks);

    return this;
  };

  var _LazyScript = global.LazyScript;
  LazyScript.noConflict = function() {
    global.LazyScript = _LazyScript;
    return this;
  };

  global.LazyScript = LazyScript;

})(this || window);
