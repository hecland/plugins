/**
 * 常用 js 工具
 */
;(function(root, factory){

  factory(root.jQuery);

})(window, function($) {

  // 筛选被折叠的行
  function filterRows($rows, filter) {
    if (!$rows.length || !filter.length) return $rows;

    var len = $rows.length;
    function getIndex(index) {
      index = parseInt(index);
      if (index > 0) return Math.min(index-1, len);
      if (index < 0) return Math.max(index+len, 0);
      return 0;
    }

    var $_rows = $();
    filter.split(',').forEach(function(type) {

      type = type.trim();
      var matches = null;
      var index = 0, index2 = 0;

      if (/^\-?\d+$/.test(type)) {
        index = getIndex(type);
        $_rows = $_rows.add($rows.eq(index));
      } else if (matches = type.match(/^(\-?\d+)\-$/)) {
        $_rows = $_rows.add($rows.slice(getIndex(matches[1])));
      } else if (matches = type.match(/^(\-?\d+)\-(\-?\d+)$/)) {
        index = getIndex(matches[1]);
        index2 = getIndex(matches[2]);
        if (index2 >= index) {
          $_rows = $_rows.add($rows.slice(index, index2 + 1));
        }
      } else {
        $_rows = $_rows.add($rows.filter(type));
      }
    });

    return $.uniqueSort($_rows);
  }

  // 表格折叠
  $.fn.tableCollapse = function(opt) {
    opt = $.extend({
      rows: '4-',
      cls: 'is-collapsed',
      btn: '.table-collapse-toggle',
    }, opt || {});

    var $rows = this.find('tr');
    if (typeof opt.rows === 'function') {
      $rows = $rows.filter(opt.rows);
    } else if (typeof opt.rows === 'string') {
      $rows = filterRows($rows, opt.rows);
    }

    var $table = this;
    $rows.hide();
    $table.addClass(opt.cls);

    $table.find(opt.btn).off('click.toggle_collapse').on('click.toggle_collapse', function(e) {
      $rows.toggle();
      $table.toggleClass(opt.cls);
    });
  };
});
