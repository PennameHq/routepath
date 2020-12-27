const queryString = require('query-string')

const replaceAll = function (s, search, replacement) {
	if (!s) return s
	if (!s.replace) return s
	return s.replace(new RegExp(escapeRegExp(search), 'g'), replacement)
}

function escapeRegExp(str) {
	return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1')
}

const removeTrailingSlashFromUrl = (url) => {
	if (!url) return url
	let query
	if (url.indexOf('?') > -1) {
		query = url.split('?')[1]
	}
	let newUrl = url.split('?')[0].replace(/\/$/, '')
	if (query) {
		newUrl = `${newUrl}?${query}`
	}
	return newUrl
}

const setUrlQueryParam = (url, key, value) => {
	let existingQuery = queryString.parseUrl(url).query
	existingQuery[key] = value

	let urlPath = url.split('?')[0]
	let newQueryString = queryString.stringify(existingQuery)
	return `${urlPath}?${newQueryString}`
}

module.exports = {
	replaceAll,
	removeTrailingSlashFromUrl,
	setUrlQueryParam,
}
