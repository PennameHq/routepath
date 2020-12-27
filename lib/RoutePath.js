'use strict'

const queryString = require('query-string')
const { is } = require('ramda')
const urls = require('./utils/urls')
const strings = require('./utils/strings')

const objects = {
	forEachOwnProp(obj, callback) {
		var index = 0
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				callback(key, obj[key], index++)
			}
		}
	},
}

class RoutePath {
	constructor({
		prefix,
		path,
		ctrl,
		redirectTo,
		key,
		description,
		body,
		query,
		responseModel,
		// should be true for api routes
		// to distinguish between different apps
		includePrefixInPattern = false,
		onBuildUrl,
		onBuildPath,
		baseUrl,
		getBaseUrl,
	}) {
		prefix = prefix || this.prefix

		if (!baseUrl && !getBaseUrl) {
			throw new Error('baseUrl or getBaseUrl is required')
		}

		this._prefix = prefix

		/**
		 * Ensure path starts with the prefix if provided.
		 */
		if (prefix && !path.startsWith(prefix)) {
			path = `${prefix}${path}`
		}

		while (path.includes('//')) {
			path = strings.replaceAll(path.trim(), '//', '/')
		}

		this._path = path
		if (includePrefixInPattern || this.includePrefixInPattern) {
			this._pattern = urls.newPattern(this.path)
		} else {
			this._pattern = urls.newPattern(this.pathWithoutPrefix)
		}

		this._ctrl = ctrl
		this._redirectTo = redirectTo
		this._description = description
		this._responseModel = responseModel
		this._key = key
		this._body = body
		this._query = query

		this._baseUrl = baseUrl
		this._getBaseUrl = getBaseUrl
		this._onBuildUrl = onBuildUrl
		this._onBuildPath = onBuildPath
		if (!is(Function, this._onBuildUrl)) {
			this._onBuildUrl = ({ url }) => url
		}

		if (!is(Function, this._onBuildPath)) {
			this._onBuildPath = ({ path }) => path
		}
	}

	get responseModel() {
		return this._responseModel
	}

	get baseUrl() {
		let baseUrl = this._baseUrl

		if (!baseUrl && this._getBaseUrl) {
			baseUrl = this._getBaseUrl()
		}

		return baseUrl
	}

	get prefix() {
		return this._prefix
	}

	get path() {
		return strings.removeTrailingSlashFromUrl(this._path)
	}

	get pathWithoutPrefix() {
		return strings
			.replaceAll(
				`/${this.path
					.replace(this._prefix, '')
					.replace(strings.removeTrailingSlashFromUrl(this._prefix), '')}`,
				'//',
				'/',
			)
			.trim()
	}

	get ctrl() {
		return this._ctrl
	}

	get redirectTo() {
		return this._redirectTo
	}

	get params() {
		if (!this._params) {
			const pathParts = this._path.split('/')
			if (pathParts.length > 1) {
				this._params = pathParts.reduce((params, part) => {
					if (part.startsWith(':')) {
						params.push(part.replace(':', ''))
					}
					return params
				}, [])
			} else {
				this._params = []
			}
		}
		return this._params
	}

	match(url) {
		return this._pattern.match(url)
	}

	/**
	 * Build url
	 *
	 * @param {{
        params: ?Object,
		query: ?Object
		pagingParams: ?Object
	 * }} data
	 *
	 * @returns String
	 */
	buildUrl(data) {
		data = this._normalizePathData(data)

		// construct the url with the baseUrl and pattern path
		const baseUrl = strings.removeTrailingSlashFromUrl(
			data.customHost ? data.customHost : this.baseUrl,
		)
		const path = this._pattern.stringify(data.params)
		const url = strings.removeTrailingSlashFromUrl(
			this._addQueryStringToPath({ path: `${baseUrl}${path}`, data }),
		)

		return this._onBuildUrl({
			url: url,
			data: data,
		})
	}

	/**
	 * Build path
	 *
	 * @param {{
        params: ?Object,
		query: ?Object
		pagingParams: ?Object
	 * }} data
	 *
	 * @returns String
	 */
	buildPath(data) {
		data = this._normalizePathData(data)

		// construct the path
		const path = this._addQueryStringToPath({
			path: `${this._pattern.stringify(data.params).replace('//', '/')}`,
			data,
		})

		return this._onBuildPath({
			path: path,
			data: data,
		})
	}

	_normalizePathData(data) {
		if (!data) data = {}
		data.params = data.params || {}
		data.query = data.query || {}

		// for wildcards *
		if (data.params._ == undefined) {
			data.params._ = ''
		}

		return data
	}

	/**
	 *
	 * @param {{
		path: String,
		data: {query: Object, pagingParams: ?Object},
	 * }} data
	 */
	_addQueryStringToPath({ path, data }) {
		if (data.pagingParams) {
			const pagingParams = data.pagingParams
			let from = pagingParams.from || (pagingParams.getFrom && pagingParams.getFrom())

			let limit = pagingParams.limit || (pagingParams.getLimit && pagingParams.getLimit())
			let sortOrder =
				pagingParams.sortOrder || (pagingParams.getSortOrder && pagingParams.getSortOrder())
			let page = pagingParams.page || (pagingParams.getNextPage && pagingParams.getNextPage())

			data.query.from = from
			data.query.limit = limit
			data.query.page = page
			data.query.sortOrder = sortOrder
		}

		if (data.query.from && is(Object, data.query.from)) {
			data.query.from = JSON.stringify(data.query.from)
		}

		objects.forEachOwnProp(data.query, (key, value) => {
			path = strings.setUrlQueryParam(path, key, value)
		})

		return path
	}

	static instance(config) {
		return new this(config)
	}

	static fromSerialized(config) {
		return new this(is(Object, config) ? config : JSON.parse(config))
	}
}

module.exports = RoutePath
