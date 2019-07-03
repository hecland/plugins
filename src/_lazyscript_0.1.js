/**
 * LazyScript.js 0.1.0
 * 参考 Sea.js 3.0.3
 */
(function(global, undefined) {

  // Avoid conflicting when `sea.js` is loaded multiple times
  if (global.LazyScript) return;
  
  var LazyScript = global.LazyScript = {version: "0.1.0"};

  function isType(type) {
    return function(obj) {
      return {}.toString.call(obj) == "[object " + type + "]";
    };
  }
  
  var isObject = isType("Object");
  var isString = isType("String");
  var isFunction = isType("Function");
  var isArray = Array.isArray || isType("Array");

  function hasOwn(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }

  function flatten(arr1) {
    return arr1.reduce(function(acc, val) {
      return isArray(val) ? acc.concat(flatten(val)) : acc.concat(val);
    }, []);
  }

  function _extend(obj) {
    if (!isObject(obj)) obj = Object.create(null);
    for (var i = 1, len = arguments.length; i < len; i++) {
      var src = arguments[i];
      for(var key in src) {
        if (hasOwn(src, key)) obj[key] = src[key];
      }
    }
    return obj;
  }


  var doc = document;
  
  // 识别 (而非获取) currentScript
  var findCurrentScript = (function() {
    var supportsCurrentScript = "currentScript" in doc;
    var supportsScriptReadyState = "readyState" in document.createElement("script");
    var isNotOpera = !window.opera || window.opera.toString() !== "[object Opera]";

    // 支持 document.currentScript
    if (supportsCurrentScript) {
      return function(scripts) {
        var cur = doc.currentScript;
        for (var i = scripts.length-1; i >= 0; i--) {
          if (scripts[i] === cur) return scripts[i];
        }
        return null;
      }
    }

    // IE10
    if (supportsScriptReadyState && isNotOpera) {
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
            if (scripts[i].src && e.stack.indexOf(scripts[i].src) >= 0) return scripts[i];
          }
        }
      }
      return scripts[scripts.length - 1];
    }
  })();

  
  var DIRNAME_RE = /[^?#]*\//

  // Extract the directory portion of a path
  // dirname("a/b/c.js?t=123#xx/zz") ==> "a/b/"
  // ref: http://jsperf.com/regex-vs-split/2
  function dirname(path) {
    return path.match(DIRNAME_RE)[0];
  }
  
  // Ignore about:xxx and blob:xxx
  var IGNORE_LOCATION_RE = /^(about|blob):/;
  // Location is read-only from web worker, should be ok though
  var cwd = (!location.href || IGNORE_LOCATION_RE.test(location.href)) ? '' : dirname(location.href);
  
  // 建议给当前 script 标签添加 id: `lazyscript`
  var loaderScript = doc.getElementById("lazyscript") || findCurrentScript(doc.scripts);


  var data = LazyScript.data = {};

  // 当前文件完整路径
  data.path = loaderScript.src;
 
  // 如果是内嵌使用, 将 loaderDir 设置为当前工作目录( cwd , 通常是所在页面的 url )
  data.base = dirname(loaderScript.src || cwd);

  // The current working directory
  data.cwd = cwd;


  // 路径解析
  var DOT_RE = /\/\.\//g;
  var DOUBLE_DOT_RE = /\/[^/]+\/\.\.\//;
  var MULTI_SLASH_RE = /([^:/])\/+\//g;

  // Canonicalize a path
  // realpath("http://test.com/a//./b/../c") ==> "http://test.com/a/c"
  function realpath(path) {
    // /a/b/./c/./d ==> /a/b/c/d
    path = path.replace(DOT_RE, "/")
  
    /*
      @author wh1100717
      a//b/c ==> a/b/c
      a///b/////c ==> a/b/c
      DOUBLE_DOT_RE matches a/b/c//../d path correctly only if replace // with / first
    */
    path = path.replace(MULTI_SLASH_RE, "$1/")
  
    // a/b/c/../../d  ==>  a/b/../d  ==>  a/d
    while (path.match(DOUBLE_DOT_RE)) {
      path = path.replace(DOUBLE_DOT_RE, "/")
    }
  
    return path;
  }
  
  // Normalize an id
  // normalize("path/to/a") ==> "path/to/a.js"
  // NOTICE: substring is faster than negative slice and RegExp
  function normalize(path) {
    var last = path.length - 1;
    var lastC = path.charCodeAt(last);
  
    // If the url ends with `#`, just return it without '#'
    if (lastC === 35 /* "#" */ || lastC === 36 /* "$" */) {
      return path.substring(0, last);
    }
  
    return (path.substring(last - 2) === ".js" ||
        path.indexOf("?") > 0 ||
        lastC === 47 /* "/" */) ? path : path + ".js";
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

  LazyScript.resolve = id2Url;
  
  // config
  LazyScript.config = function(configData) {
  
    for (var key in configData) {
      var curr = configData[key]
      var prev = data[key]
  
      // Merge object config such as alias, vars
      if (prev && isObject(prev)) {
        for (var k in curr) {
          prev[k] = curr[k]
        }
      }
      else {
        // Concat array config such as map
        if (isArray(prev)) {
          curr = prev.concat(curr)
        }
        // Make sure that `data.base` is an absolute path
        else if (key === "base") {
          // Make sure end with "/"
          if (curr.slice(-1) !== "/") {
            curr += "/"
          }
          curr = addBase(curr)
        }
  
        // Set config
        data[key] = curr
      }
    }
    return LazyScript
  }
  

  // 类构造函数
  var Class = function Class(){};
  Class.create = function (prototype) {
    // 原型构造函数
    prototype.constructor = typeof prototype.ctor == 'function' ? prototype.ctor : function(){};
    delete prototype.ctor;
  
    // 父类构造函数
    var _ctors = [];
  
    // 生成一个类
    var cls = function(){};
    cls.prototype = _extend(Object.create(Class.prototype), prototype);
  
    Object.defineProperties(cls, {
      '_ctors': {
        get: function() {
          return _ctors.concat(this.prototype.constructor);
        },
      },
      'new': {
        value: function create() {
          var self = Object.create(this.prototype);
          var ctors = this._ctors;
          for (var i = 0, len = ctors.length; i < len; i++) {
            ctors[i].apply(self, arguments);
          }
          return self;
        },
      },
      'inherit': {
        value: function inherit(supper) {
          var p = Object.create(supper.prototype);
          if (p instanceof Class) {
            _ctors = _ctors.concat(supper._ctors);
            this.prototype = _extend(p, this.prototype);
          }
          return this;
        },
      },
    });
  
    return cls;
  }

  // 事件类
  var Events = Class.create({
    ctor: function Events() {
      this.events = Object.create(null);
      this.emitted = Object.create(null);
    },
    
    // 向事件添加回调
    on: function(event, callback) {
      if (!this.events[event]) this.events[event] = [];
      this.events[event].push(callback);
      return this;
    },
    
    // 添加一次性回调, 且当事件已触发时, 直接执行回调
    once: function(event, callback) {
      // console.log('once ' + event + ' happend')
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
    }
  });

  
  var currentScript = null;
  var cachedScripts = new Object(null);
  
  var STATUS = {
    // Script Status
    // 1 - 正在获取绑定标签
    SCRIPT_LOADING: 1,
    // 2 - script 加载完成
    SCRIPT_LOADED: 2,
    // 100 - 已就绪
    SCRIPT_READY: 100,
    // 404
    SCRIPT_ERROR: 404,

    // Task Status
    // 1 - 等待依赖加载完成
    TASK_WAITING: 1,
    // 2 - 依赖加载完成, 开始执行
    TASK_EXECUTING: 2,
    // 100 - 成功
    TASK_DONE: 100,
    // 失败
    TASK_FAILED: 404,
  }

  /**
   * Scripts Manager
   */
  var manager = (function() {
    var _cache = Object.create(null);
    var _nodes = [];

    function _load(script) {
      script.emit('start');

      // Load script
      var node = doc.createElement("script");
    
      node.charset = 'utf-8';
      node.async = true;
      node.src = script.url;
    
      node.onload = function() { cb(false) };
      node.onerror = function() { cb(true) };

      // 开始加载 <script>
      _nodes.push(node);
      doc.head.appendChild(node);
      
      function cb(error) {
        node.onload = node.onerror = null;
        // doc.head.removeChild(node);
        var index = _nodes.indexOf(node);
        if (index >= 0) _nodes.splice(index, 1);
        node = null;
        script.emit(error ? 'error' : 'load');
      }
    }

    return {
      getHost: function() {
        var cur = findCurrentScript(_nodes);
        if (cur) {
          return _cache[cur.src];
        }
        return null;
      },
      getScript: function(url) {
        var script = _cache[url];
        if (!script) {
          script = Script.new(url);
          _cache[url] = script;
          _load(script);
        }
        return script;
      },
    }
  })();

  /**
   * Task 与 Script
   * 
   * 流程描述:
   * 每次调用 LazyScript.load 生成一个加载任务 Task, 通常包含若干待加载 Script 和一个回调;
   * Script 依据 url 自动加载 <script> 标签;
   * <script> 异步加载并执行, 执行中 LazyScript.load (如果有的话) 再次生成 Task (称为 Script 的 "子任务", 而 Script 称为这些 "子任务" 的 "宿主");
   * 
   * 每一个 Task 都是匿名的, 唯一的; 而 Script 可被重复使用
   * 
   * Task 在依赖 Script 全部 ready 后执行
   * Script 在自身加载完成且内部 Task 全部执行后触发 ready
   */

  var Task = Class.create({
    ctor: function Task(ids, callback) {
      // 宿主
      this.host = manager.getHost();
      if (this.host) this.host.addTask(this);

      // 任务回调, 依赖加载完成后执行
      this.callback = callback;

      // Task 状态
      this.status = 0;

      // 依赖 Script
      this.dependence = [];

      this.once('done', function() {
        this.status = STATUS.TASK_DONE;
      }).once('failed', function() {
        this.status = STATUS.TASK_FAILED;
      }).once('ready', function() {
        this.status = STATUS.TASK_EXECUTING;
        try {
          this.callback.call(global, global);
          this.emit('done');
        } catch (e) {
          this.emit('failed');
        }
      });

      this.status = STATUS.TASK_WAITING;

      for (var i = 0, len = ids.length; i < len; i++) {
        this.addDependence(manager.getScript(id2Url(ids[i])));
      }
      
      this.checkReady();
    },

    addDependence: function(script) {
      this.dependence.push(script);
      var task = this;
      script.once('ready', function(){
        task.removeDependence(this);
      }).once('error', function() {
        task.emit('failed');
      });
    },
  
    // 移除依赖
    removeDependence: function(script) {
      var index = this.dependence.indexOf(script);
      if (index >= 0) this.dependence.splice(index, 1);
      this.checkReady();
      return this;
    },
  
    // 检查任务状态, 如果可执行, 则标记 status 为 TASK_READY, 并执行
    checkReady: function() {
      if (this.status === STATUS.TASK_WAITING && this.dependence.length === 0) {
        this.emit('ready');
      }
      return this;
    },
  }).inherit(Events);

  var Script = Class.create({
    ctor: function Script(url) {
      // 请求地址
      this.url = url;

      // 内部 Task
      this.tasks = [];

      // Script 状态
      this.status = 0;

      this.once('start', function() {
        this.status = STATUS.SCRIPT_LOADING;
      }).once('load', function() {
        this.status = STATUS.SCRIPT_LOADED;
        this.checkReady();
      }).once('ready', function() {
        this.status = STATUS.SCRIPT_READY;
      }).once('error', function() {
        this.status = STATUS.SCRIPT_ERROR;
      });
      // console.log(this)
    },

    addTask: function(task) {
      this.tasks.push(task);
      var script = this;
      task.once('done', function(){
        script.removeTask(this);
      }).once('failed', function() {
        script.emit('error');
      });
      return this;
    },

    removeTask: function(task) {
      var index = this.tasks.indexOf(task);
      if (index >= 0) {
        this.tasks.splice(index, 1);
        this.checkReady();
      }
      return this;
    },

    checkReady: function() {
      if (this.status === STATUS.SCRIPT_LOADED && this.tasks.length === 0) {
        this.emit('ready');
      }
      return this;
    },
  }).inherit(Events);

  // function getScript(url) {
  //   return cachedScripts[url] || (cachedScripts[url] = Script.new(url));
  // }
  
  LazyScript.load = function() {
    var args = [].slice.call(arguments);
    var callback = isFunction(args[args.length - 1]) ? args.pop() : function(){};
    var deps = flatten(args).filter(function(dep){ return isString(dep) });

    var task = Task.new(deps, callback);
    // console.log(task);

    return task;
  }

})(this);
