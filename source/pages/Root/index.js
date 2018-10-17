// Core
import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import moment from 'moment';

// Components
import Feed from '../../components/Feed';
import { Provider } from '../../HOC';
import Catcher from '../../components/Catcher';

// localStorage.setItem('momentIn', moment.format('mm'));

const options = {
    avatar: 'https://lab.lectrum.io/react/api/image/crknbffchzv2/anton.jpg',
    currentUserFirstName: 'Антон',
    currentUserLastName: 'Фань',
    // whenCame: localStorage.getItem('momentIn'),
};

@hot(module)
export default class Root extends Component {
    render() {
        return (
            <>
                <Catcher>
                    <Provider value={options}>
                        <Feed />
                    </Provider>
                </Catcher>
            </>
        );
    }
}
