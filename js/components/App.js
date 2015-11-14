'use strict';

import React, { PropTypes } from 'react';

let App = React.createClass({
    propTypes: {
    },

    render: function() {
        let {
            ...otherProps,
        } = this.props;
        return (
                <div {...otherProps}>React Skeleton</div>
               );
    },
});

module.exports = App;
