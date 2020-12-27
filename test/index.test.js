const packageIndex = require('../index')
const RoutePath = require('../lib/RoutePath')
const helper = require('./helper')()
const { assert } = helper

describe('index', () => {
	it('should be RoutePath', () => {
		assert.equal(packageIndex, RoutePath)
	})
})
