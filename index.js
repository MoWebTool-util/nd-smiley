/**
 * @module Smiley
 * @author crossjs <liwenfu@crossjs.com>
 */

'use strict'

var $ = require('nd-jquery')
var Tip = require('nd-tip')
var Tabs = require('nd-switchable/lib/tabs')
var selection = require('nd-selection')

function debounce(fn, delay) {
  var timeout

  return function() {
    var args = arguments

    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(function() {
      timeout = null

      fn.apply(null, args)
    }, delay)
  }
}

function inputor(node, fn, params) {
  node = $(node)
  params = params || {}

  var context = params.context || window // 方法的上下文
  var cache = node.val()
  var flag = false

  var run = debounce(function(force) {
    if (flag) {
      var val = node.val()
      if (params.keep === true || force === true || val !== cache) {
        fn.call(context, val, node)
        cache = val
      }

      run()
    }
  }, params.timer || 128)

  node.on('focus.timer', function() {
    flag = true
    run(true)
  })

  node.on('blur.timer', function() {
    if (!params.silentBlur) {
      fn.call(context, node.val(), node)
    }
    flag = false
  })
}

var Smiley = module.exports = Tip.extend({

  Plugins: [require('./src/nmoji/index'), require('./src/emoji/index')],

  attrs: {
    // classPrefix 留给 tabs 用
    className: 'ui-smiley',
    target: null,
    triggerType: 'click',

    align: {
      selfXY: [0, 0],
      baseXY: ['100%', 0]
    },
    arrowPosition: 10,
    content: '',

    groups: [],

    afterRender: function() {
      var groups = this.get('groups')
      var that = this

      var tabs = new Tabs({
        template: require('./src/groups.handlebars'),
        model: {
          groups: groups
        },
        parentNode: this.$('[data-role="content"]')
      })

      groups.forEach(function(group) {
        var instance = new group.ctor({
          filter: group.filter,
          parentNode: tabs.$('[data-role="panel-' + group.id + '"]')
        }).render().on('select', function(text, elem, isMultiSelect) {
          that._insertText(text, isMultiSelect)
        })

        that.before('destroy', function() {
          instance.destroy()
        })
      })
    }
  },

  initAttrs: function(config) {
    Smiley.superclass.initAttrs.call(this, config)

    this.set('align', {
      baseElement: this.get('trigger')
    })
  },

  setup: function() {
    this.get('trigger').addClass(this.get('className') + '-trigger')

    Smiley.superclass.setup.call(this)
  },

  _insertText: function(text, isMultiSelect) {
    this.get('selection').insertText(text, this.get('cursor') || [0, 0], true)
    if (!isMultiSelect) {
      this.hide()
    }
    this._setCursor()
  },

  _setCursor: function() {
    var cursor = this.get('selection').cursor()
    if (cursor[0] !== undefined) {
      this.set('cursor', cursor)
    }
  },

  _onRenderTarget: function(target) {
    this.set('selection', selection($(target).get(0)))
    this._setCursor()
    inputor(target, this._setCursor, {
      keep: true,
      silentBlur: true,
      context: this
    })
  },

  _onChangeVisible: function(visible) {
    this.get('trigger').toggleClass(this.get('className') + '-trigger-active', visible)
  }

})
