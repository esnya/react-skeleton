'use strict';

jest.dontMock('../js/app.js');
describe('App', function() {
    it('contains a test message', function () {
        var React = require('react/addons');
        var TestUtils = React.addons.TestUtils;

        var App = require('../js/app.js');

        var app = TestUtils.renderIntoDocument(<App />);
        var div = TestUtils.findRenderedDOMComponentWithTag(app, 'div');
        expect(React.findDOMNode(div).textContent).toEqual('React Skelton');
    });
});
