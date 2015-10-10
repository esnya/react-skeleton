'use strict';

jest.dontMock('../js/app.js');
describe('App', function() {
    it('contains a test message', function () {
        var React= require('react'); // Important!!! This is used by compiled codes from JSX.
        var ReactDOM = require('react-dom');
        var TestUtils = require('react-addons-test-utils');

        var App = require('../js/app.js');

        var app = TestUtils.renderIntoDocument(<App />);
        var div = TestUtils.findRenderedDOMComponentWithTag(app, 'div');
        expect(ReactDOM.findDOMNode(div).textContent).toEqual('React Skelton');
    });
});
