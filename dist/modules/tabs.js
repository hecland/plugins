// 标签页
LazyScript.load('jquery', 'underscore', function(global) {
  "use strict";

  var $ = global.$;
  var _ = global._;
  var tabs_count = 1;

  function isInt(val) {
    return /^(?:[1-9]\d*|0)$/.test(val);
  }

  // 生成一个 tabs 寄存器
  function genTabsRegister() {
    var _map = new Object(null);
    var _first = null;
    var _next = 1;
    return {
      set: function(key, el) {
        if (!_map[key]) _map[key] = $();
        _map[key].push(el);
        if (_first == null) _first = key;
        return this;
      },
      get: function(key) {
        return _map[key] || $();
      },
      next: function() {
        while(_map[_next++]){}
        return _next - 1;
      },
      getmap: function() {
        return _map;
      },
      first: function() {
        return _first;
      },
    };
  }

  // 生成一个序列生成器
  function genSequence(start) {
    var _ban = new Object(null);
    var _next = isInt(start) ? start : 1;
    return {
      ban: function(key){
        _ban[key] = true;
      },
      next: function(){
        while(_ban[_next++]){}
        return _next - 1;
      },
    };
  }

  // 生成 Tabs 对象
  // 对象用于存储默认选项, 所有相关元素, 以及当前激活项信息
  function Tabs(options) {
    // 默认选项
    var defaultOptions = $.extend({
      // 用于指定 tabs 坐标的属性名
      attr: 'data-tabs',

      // 用于触发激活动作的事件
      event: 'click',

      // 触发激活时回调函数
      activate: function() { $(this).addClass('is-active'); },

      // 取消激活时回调函数
      deactivate: function() { $(this).removeClass('is-active'); },
    }, options || {});

    // 区分不同 tabs 实例
    var tabs_key = '__tabs_' + tabs_count++;
    var tabs_key_coords = tabs_key+'_coords';

    // 核心数据
    var tabs_map = {
      row: genTabsRegister(),
      col: genTabsRegister(),
    };

    function getkey(key) {
      if (key === true || key === 'AUTO') return 'AUTO';
      if (typeof key === 'number' || (typeof key === 'string' && key.length)) {
        return key;
      }
      return null;
    }

    // 获取节点坐标
    function getCoords(nodes) {
      var row_next = tabs_map.row.next();
      var col_next = tabs_map.col.next();
      var sequence = new Object(null);

      // 获取默认的行坐标
      nodes.row = getkey(nodes.row);
      if (nodes.row === 'AUTO') nodes.row = row_next

      // 获取默认的列坐标
      nodes.col = getkey(nodes.col);
      if (nodes.col === 'AUTO') nodes.col = col_next;

      // 获取元素属性中指定的坐标
      var coords_computed = [];
      nodes.el.each(function(index, elem) {
        var row = null, col = null;
        var attr;
        if (nodes.attr && (attr = elem.getAttribute(nodes.attr))) {
          attr = (attr.replace(/^[\[\]\s\uFEFF\xA0]*/, '').replace(/[\[\]\s\uFEFF\xA0]*$/, '') + ',').split(',');
          row = attr[0].trim() || null;
          col = attr[1].trim() || null;
        }
        coords_computed.push([row, col]);
      });

      // 使用 nodes.row, nodes.col 和 row_next 对坐标进行初步补全
      var coords_default = [];
      var i, crds, len = coords_computed.length;
      for (i = 0; i < len; i++) {
        crds = [coords_computed[i][0] || nodes.row, coords_computed[i][1] || nodes.col];
        if (crds[0] == null && crds[1] == null) {
          crds[0] = row_next;
        }
        coords_default.push(crds);
      }

      var getSequence = function(rc, val) {
        var s = genSequence();
        var cr = (rc+1)%2;
        for (var i = 0; i < len; i++) {
          if (coords_default[i][rc] == val && coords_computed[i][cr] != null) {
            s.ban(coords_computed[i][cr]);
          }
        }
        return s;
      }

      // 对坐标进行终极补全
      var coords = [];
      var row, col, key;
      for (i = 0; i < len; i++) {
        row = coords_default[i][0];
        col = coords_default[i][1];
        if (row == null) {
          key = 'c_'+col;
          if (!sequence[key]) sequence[key] = getSequence(1, col);
          row = sequence[key].next();
        } else if (col == null) {
          key = 'r_'+row;
          if (!sequence[key]) sequence[key] = getSequence(0, row);
          col = sequence[key].next();
        }
        coords.push([row, col]);
      }
      
      return coords;
    }

    // 激活组
    function activate(col) {
      tabs_map.col.get(col).each(function(){
        tabs_map.row.get(this[tabs_key_coords].row).trigger(tabs_key+'_deactivate');
      }).trigger(tabs_key+'_activate');
    }

    // 添加节点并绑定事件
    function add(nodes) {
      nodes.el = $(nodes.el).filter(function(){
        return this instanceof HTMLElement;
      });
      if (!nodes.el.length) return;
      nodes = _.extend({}, defaultOptions, nodes);

      // 获取节点坐标, 然后根据坐标将节点添加至 tabs_map
      var coords = getCoords(nodes);
      nodes.el.each(function(index, el) {
        var row = coords[index][0];
        var col = coords[index][1];
        // 保存坐标
        el[tabs_key_coords] = {row:row, col:col};

        // 将元素添加至 tabs_map
        tabs_map.row.set(row, el);
        tabs_map.col.set(col, el);
      });

      // 将 activate 绑定到 nodes.event 事件
      if (nodes.event) {
        nodes.el.on(nodes.event+'.'+tabs_key, function(){
          activate(this[tabs_key_coords].col);
        });
      }

      // 如果 nodes.deactivate 是一个函数, 将其绑定到元素的 deactivate 事件
      if (typeof nodes.deactivate == 'function') {
        nodes.el.on(tabs_key+'_deactivate', nodes.deactivate);
      }

      // 如果 nodes.activate 是一个函数, 将其绑定到元素的 activate 事件
      if (typeof nodes.activate == 'function') {
        nodes.el.on(tabs_key+'_activate', nodes.activate);
      }
    }

    return {
      connect: function() {
        _.each([].slice.call(arguments), function(nodes){
          if (typeof nodes !== 'object' || !nodes['el']) {
            nodes = {el: nodes};
          }
          add(nodes);
        });
        return this;
      },
      activate: function(col) {
        activate(col || tabs_map.col.first());
        return this;
      },
    };
  }

  global.Tabs = Tabs;
});
  