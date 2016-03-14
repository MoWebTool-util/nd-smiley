'use strict'

var Selector = require('nd-selector')

var Nmoji = Selector.extend({

  attrs: {
    className: 'ui-selector-nmoji',
    options: require('./options.json')
  }

})

module.exports = {
  name: 'nmoji',
  starter: function() {
    var plugin = this,
      host = plugin.host

    host.get('groups').push({
      id: 'nmoji',
      name: '默认表情',
      ctor: Nmoji,
      filter: function(option) {
        return '[sys:' + option.id + ']'
      }
    })

    // 通知就绪
    this.ready()
  }
}
