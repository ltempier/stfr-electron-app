import React, {Component} from 'react';
import Ionicon from 'react-ionicons'

class Checkbox extends Component {

    render() {
        return (
            <div className="checkbox">
                <Ionicon icon={this.props.value ? this.props.icons.on : this.props.icons.off}
                         onClick={() => this.props.onChange(!this.props.value)}
                         color={this.props.color}/>
            </div>
        )
    }
}

Checkbox.defaultProps = {


    color: 'black',
    icons: {
        on: 'ios-checkbox-outline',
        off: 'ios-square-outline',
        // on: 'md-radio-button-on',
        // off: 'md-radio-button-off',
        // on: 'ios-radio-button-on',
        // off: 'ios-radio-button-off'
    },
    value: true,
    onChange: function (value) {
        console.log('Checkbox new value', value)
    }
};

export default Checkbox

