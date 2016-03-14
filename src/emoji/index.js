'use strict'

var Selector = require('nd-selector')

var Emoji = Selector.extend({

  attrs: {
    className: 'ui-selector-emoji',
    options: require('./options.json')
  }

})

module.exports = {
  name: 'emoji',
  starter: function() {
    var plugin = this,
      host = plugin.host

    host.get('groups').push({
      id: 'emoji',
      name: '符号表情',
      ctor: Emoji,
      filter: function(option) {
        return option.id
      }
    })

    // 通知就绪
    this.ready()
  }
}
