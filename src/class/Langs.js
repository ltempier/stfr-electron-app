import langs from 'langs';
import _ from 'lodash';


const filterName = [
    'Arabic',
    'Chinese',
    'Czech',
    'Danish',
    'Dutch',
    'English',
    'French',
    'German',
    'Greek',
    'Italian',
    'Japanese',
    'Korean',
    'Portuguese',
    'Russian',
    'Spanish'
];

export default class Langs {
    static all() {
        const all = langs.all();
        return _.filter(all, (lang) => {
            return filterName.indexOf(lang.name) >= 0
        })
    }
}
