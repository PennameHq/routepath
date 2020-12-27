const stringUtils = require('../../../lib/utils/strings')
const helper = require('../../helper')()
const { assert } = helper

describe('stringUtils', () => {
	const _ = stringUtils
	describe('#setUrlQueryParam()', () => {
		it('should add the provided key as query param with the provided value', () => {
			assert.equal(_.setUrlQueryParam('example.com', 'x', 1), 'example.com?x=1')
			assert.equal(_.setUrlQueryParam('example.com/?x=1', 'y', 2), 'example.com/?x=1&y=2')
			assert.equal(
				_.setUrlQueryParam('www.example.com/path/to/res.png?x=1', 'y', 2),
				'www.example.com/path/to/res.png?x=1&y=2',
			)
			// with a param that has a url that contains a query string as its value
			assert.equal(
				_.setUrlQueryParam('www.example.com/path/to/res.png?x=1&url=example2.com?z=3', 'y', 2),
				'www.example.com/path/to/res.png?url=example2.com%3Fz%3D3&x=1&y=2',
			)
		})

		it('should add the provided key as query param with the provided value and overwrite existing value for the same key', () => {
			// overwrite
			assert.equal(
				_.setUrlQueryParam('www.example.com/path/to/res.png?x=1', 'x', 2),
				'www.example.com/path/to/res.png?x=2',
			)
		})
	})

	describe('#removeTrailingSlashFromUrl()', () => {
		it('should remove the trailing slash from the url', () => {
			assert.equal(
				_.removeTrailingSlashFromUrl('https://www.example.com/'),
				'https://www.example.com',
			)
			assert.equal(
				_.removeTrailingSlashFromUrl('http://www.example.com/'),
				'http://www.example.com',
			)
			assert.equal(_.removeTrailingSlashFromUrl('http://www.example.com'), 'http://www.example.com')
			assert.equal(_.removeTrailingSlashFromUrl('www.example.com/'), 'www.example.com')
			assert.equal(
				_.removeTrailingSlashFromUrl('www.example.com/?x=1&y=2'),
				'www.example.com?x=1&y=2',
			)
		})

		it('should remove the trailing ? from the url when appropriate', () => {
			assert.equal(
				_.removeTrailingSlashFromUrl('https://www.example.com?'),
				'https://www.example.com',
			)
			assert.equal(
				_.removeTrailingSlashFromUrl('http://www.example.com/?'),
				'http://www.example.com',
			)
			assert.equal(_.removeTrailingSlashFromUrl('http://www.example.com'), 'http://www.example.com')
			assert.equal(_.removeTrailingSlashFromUrl('www.example.com?'), 'www.example.com')
			assert.equal(
				_.removeTrailingSlashFromUrl('www.example.com/?x=1&y=2'),
				'www.example.com?x=1&y=2',
			)
		})
	})

	describe('#replaceAll()', () => {
		it('should replace all ocurrences of the needle in the haystack', () => {
			assert.equal(
				_.replaceAll('hey my name is lincy and I am a linc from the twon of lincs', 'linc', 'worm'),
				'hey my name is wormy and I am a worm from the twon of worms',
			)
		})
	})
})
