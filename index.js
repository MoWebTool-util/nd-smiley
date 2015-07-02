/**
 * @module Smiley
 * @author crossjs <liwenfu@crossjs.com>
 */

'use strict';

var Tip = require('nd-tip');
var Tabs = require('nd-switchable').Tabs;
var selection = require('nd-selection');
var inputor = require('nd-inputor');

var Smiley = module.exports = Tip.extend({

  Plugins: [require('./src/nmoji'), require('./src/emoji')],

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
      var groups = this.get('groups');
      var that = this;

      var tabs = new Tabs({
        template: require('./src/groups.handlebars'),
        model: {
          groups: groups
        },
        parentNode: this.$('[data-role="content"]')
      });

      groups.forEach(function(group) {
        var instance = new group.ctor({
          filter: group.filter,
          parentNode: tabs.$('[data-role="panel-' + group.id + '"]')
        }).render().on('select', function(text, elem, isMultiSelect) {
          that._insertText(text, isMultiSelect);
        });

        that.before('destroy', function() {
          instance.destroy();
        });
      });
    }
  },

  initAttrs: function(config) {
    Smiley.superclass.initAttrs.call(this, config);

    this.set('align', {
      baseElement: this.get('trigger')
    });
  },

  setup: function() {
    this.get('trigger').addClass(this.get('className') + '-trigger');

    Smiley.superclass.setup.call(this);
  },

  _insertText: function(text, isMultiSelect) {
    this.get('selection').insertText(text, this.get('cursor') || [0, 0], true);
    !isMultiSelect && this.hide();
    this._setCursor();
  },

  _setCursor: function() {
    var cursor = this.get('selection').cursor();
    if (cursor[0] !== undefined) {
      this.set('cursor', cursor);
    }
  },

  _onRenderTarget: function(target) {
    this.set('selection', selection(target));
    this._setCursor();
    inputor(target, this._setCursor, {
      keep: true,
      silentBlur: true,
      context: this
    });
  },

  _onChangeVisible: function(visible) {
    this.get('trigger').toggleClass(this.get('className') + '-trigger-active', visible);
  }

});
