const RoutePath = require('../../lib/RoutePath')
const helper = require('../helper')()
const { assert } = helper

describe('RoutePath', () => {
	const _ = RoutePath

	describe('#instance()', () => {
		it('should create an instance of RoutePath', () => {
			assert.instanceOf(_.instance({ path: '/p/:id', baseUrl: 'example.com' }), RoutePath)
		})
	})

	describe('#buildUrl()', () => {
		it('should return the url with the baseUrl', () => {
			const routePath = _.instance({ path: '/foo/bar', baseUrl: 'example.com' })
			assert.equal(routePath.buildUrl(), 'example.com/foo/bar')
		})

		it('should return the url with the baseUrl including its https protocol', () => {
			const routePath = _.instance({ path: '/foo/bar', baseUrl: 'https://example.com' })
			assert.equal(routePath.buildUrl(), 'https://example.com/foo/bar')
		})

		it('should return the url with the baseUrl including its http protocol', () => {
			const routePath = _.instance({ path: '/foo/bar', baseUrl: 'http://example.com' })
			assert.equal(routePath.buildUrl(), 'http://example.com/foo/bar')
		})

		it('should return the url with the baseUrl and the path with the provided path params', () => {
			const routePath = _.instance({ path: '/p/:id', baseUrl: 'example.com' })
			assert.equal(routePath.buildUrl({ params: { id: 'pubA' } }), 'example.com/p/pubA')
		})

		it('should return the url with the baseUrl and the path with the provided query params', () => {
			const routePath = _.instance({ path: '/p/:id', baseUrl: 'example.com' })
			assert.equal(
				routePath.buildUrl({
					params: { id: 'pubA' },
					query: { foo: 'abc123', from: 'thisSpot', to: 11 },
				}),
				'example.com/p/pubA?foo=abc123&from=thisSpot&to=11',
			)
		})

		it('should return the url with the baseUrl and the path with the provided queryString params', () => {
			const routePath = _.instance({ path: '/p/:id', baseUrl: 'example.com' })
			assert.equal(
				routePath.buildUrl({
					params: { id: 'pubA' },
					query: { foo: 'abc123', from: 'thisSpot', to: 11 },
				}),
				'example.com/p/pubA?foo=abc123&from=thisSpot&to=11',
			)
		})
	})

	describe('#buildPath()', () => {
		it('should return the url without the baseUrl', () => {
			const routePath = _.instance({ path: '/foo/bar', baseUrl: 'example.com' })
			assert.equal(routePath.buildPath(), '/foo/bar')
		})

		it('should return the url without the baseUrl and the path with the provided path params', () => {
			const routePath = _.instance({ path: '/p/:id', baseUrl: 'example.com' })
			assert.equal(routePath.buildPath({ params: { id: 'pubA' } }), '/p/pubA')
		})

		it('should return the url without the baseUrl and the path with the provided query params', () => {
			const routePath = _.instance({ path: '/p/:id', baseUrl: 'example.com' })
			assert.equal(
				routePath.buildPath({
					params: { id: 'pubA' },
					query: { foo: 'abc123', from: 'thisSpot', to: 11 },
				}),
				'/p/pubA?foo=abc123&from=thisSpot&to=11',
			)
		})

		it('should return the url without the baseUrl and the path with the provided query params', () => {
			const routePath = _.instance({ path: '/p/:id', baseUrl: 'example.com' })
			assert.equal(
				routePath.buildPath({
					params: { id: 'pubA' },
					query: { foo: 'abc123', from: 'thisSpot', to: 11 },
				}),
				'/p/pubA?foo=abc123&from=thisSpot&to=11',
			)
		})
	})

	describe('#fromSerialized()', () => {
		it('should create a route path from the provided JSON string', () => {
			const route = RoutePath.fromSerialized(
				`{"path": "/user/:id/articles", "baseUrl": "example.com/api/" }`,
			)

			assert.instanceOf(route, RoutePath)
			assert.equal(
				route.buildUrl({
					params: { id: 'u1cba' },
					query: { from: 'abc456', limit: 15 },
				}),
				'example.com/api/user/u1cba/articles?from=abc456&limit=15',
			)
		})

		it('should create a route path from the provided object', () => {
			const route = RoutePath.fromSerialized({
				path: '/user/:id/articles',
				baseUrl: 'example.com/api/',
			})

			assert.instanceOf(route, RoutePath)
			assert.equal(
				route.buildUrl({
					params: { id: 'u1cba' },
					query: { from: 'abc456', limit: 15 },
				}),
				'example.com/api/user/u1cba/articles?from=abc456&limit=15',
			)
		})
	})
})
