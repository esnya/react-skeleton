'use strict';

jest.dontMock('../AppDispatcher.js');
describe('AppDispatcher', function() {
    let React = require('react');
    let ReactDOM = require('react-dom');
    let TestUtils = require('react-addons-test-utils');

    let AppDispatcher;

    beforeEach(function() {
        AppDispatcher = require('../AppDispatcher.js');
    });

    it('sends actions to subscribers', function() {
        let listener = jest.genMockFunction();
        AppDispatcher.register(listener);

        let payload = {};
        AppDispatcher.dispatch(payload);
        expect(listener.mock.calls.length).toBe(1);
        expect(listener.mock.calls[0][0]).toBe(payload);
    });
});
