// Core
import React, { Component } from 'react';
import { string } from 'prop-types';
import { Transition } from 'react-transition-group';
import gsap from 'gsap';

// Instruments
import { withProfile } from '../../HOC';
import Styles from './styles.m.css'
import moment from 'moment';

@withProfile
export default class Postman extends Component {
    static propTypes = {
        avatar:               string.isRequired,
        currentUserFirstName: string.isRequired,
    }

    render() {

        const { avatar, currentUserFirstName } = this.props;

        return(
            <section className={Styles.postman} >
                <img src={avatar}/>
                <span>Hello <b>{currentUserFirstName}</b>!</span>
            </section>
        )
    }
}
