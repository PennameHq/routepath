const urlUtils = require('../../../lib/utils/urls')
const helper = require('../../helper')()
const { assert } = helper

describe('urlUtils', () => {
	const _ = urlUtils

	describe('#newPattern()', () => {
		it('should have stringify function that stringifies path correctly', () => {
			assert.equal(_.newPattern('/p/:id').stringify({ id: 'pubA' }), '/p/pubA')
		})

		it('should have stringify function that stringifies url correctly', () => {
			assert.equal(
				_.newPattern('smedian.com/p/:id/').stringify({ id: 'pubA' }),
				'smedian.com/p/pubA/',
			)
		})

		it('should have stringify function that stringifies url with one wildcard correctly', () => {
			assert.equal(
				_.newPattern('smedian.com/p/:id/*').stringify({ id: 'pubA', _: 'hi' }),
				'smedian.com/p/pubA/hi',
			)
		})

		it('should have stringify function that stringifies url with multiple wildcards correctly', () => {
			assert.equal(
				_.newPattern('smedian.com/p/:id/*/*').stringify({ id: 'pubA', _: ['hi', 'bye/tomorrow'] }),
				'smedian.com/p/pubA/hi/bye/tomorrow',
			)
		})

		it('should have stringify function that fails to stringify url correctly when missing data', () => {
			try {
				_.newPattern('smedian.com/p/:id/:tab/:user').stringify({ id: 'pubA' })
				assert.fail('Should have failed')
			} catch (err) {
				assert.equal(err.message, 'no values provided for key `tab`')
			}
		})
	})
})
