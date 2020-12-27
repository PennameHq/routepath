const UrlPattern = require('url-pattern')

module.exports = {
	newPattern(pattern) {
		return new UrlPattern(pattern)
	},
}
