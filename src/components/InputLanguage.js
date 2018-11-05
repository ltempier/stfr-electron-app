import React, {Component} from 'react';
import Select from 'react-select';
import Langs from '../class/Langs';

import 'react-select/dist/react-select.css';
import './InputLanguage.css';


class InputLanguage extends Component {

    render() {

        return (

            <div>
                <label className="input-file-label">{this.props.label}</label>

                <Select
                    multi
                    simpleValue
                    noResultsText="No language found"
                    placeholder="Select languages"
                    matchPos="start"
                    arrowRenderer={null}
                    deleteRemoves={false}
                    clearable={false}

                    value={this.props.value}
                    onChange={this.props.onChange}
                    options={this.props.options}
                />
            </div>
        )
    }

    static toLanguagesOptions(languages) {
        return languages.map((language) => {
            return {label: language.name, local: language.local, value: language['2B'], 1: language['1']}
        })
    }
}


InputLanguage.defaultProps = {
    label: 'Languages',
    value: [],
    options: InputLanguage.toLanguagesOptions(Langs.all()),
    onChange: function (values) {
        console.log('new Languages values', values)
    }
};


export default InputLanguage;
