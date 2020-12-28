const assert = require('assert');
const {extractPrNumber} = require('../index')

describe('index.js', function() {
  describe('#extractPrNumber()', function() {
    describe('squash commit', function() {
      describe('without line feed', function() {
        it('should return commit number', function() {
          const message = "Squash commit (#123)"
          assert.equal(extractPrNumber(message), "123");
        });
      });
      describe('with line feed', function() {
        it('should return commit number', function() {
          const message = "Squash commit (#456)\n\nCo-authored-by: Test user <bot@example.com>"
          assert.equal(extractPrNumber(message), "456");
        });
      });
    });
  });
});
