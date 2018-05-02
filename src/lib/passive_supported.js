var passiveSupported = false

try {
  var options = Object.defineProperty({}, 'passive', {
    get: function () {
      passiveSupported = true
    }
  })
} catch (err) {}

module.exports = passiveSupported
