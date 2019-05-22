// Core
import React, { Component } from 'react';
import cx from 'classnames';

// Instruments
import Styles from './styles.m.css';
import { withProfile } from '../../HOC';
import { socket } from '../../socket/init';

@withProfile
export default class StatusBar extends Component {
    state = {
        online: false,
    };

    componentDidMount() {
        socket.on('connect', () => {
            this.setState ({
                online: true,
            });
        });

        socket.on('disconnect', () => {
            this.setState ({
                online: false,
            });
        });
    }

    componentWillUnmount() {
        socket.removeListener('connect');
        socket.removeListener('disconnect');

    }

    render() {
        const {online} = this.state;
        const {avatar, currentUserFirstName, currentUserLastName } = this.props;

        const statusStyles = cx(Styles.status, {
            [Styles.online]: online,
            [Styles.offline]: !online
        });

        const statusMessage = online ? 'Online' : 'Offline';

        return(
            <section className={Styles.statusBar}>
                <div className={statusStyles}>
                    <div> {statusMessage} </div>
                    <span />
                </div>
                <button>
                    <img src={avatar} />
                    <span>{currentUserFirstName}</span>
                    &nbsp;
                    <span>{currentUserLastName}</span>
                </button>
            </section>

        )
    }

}
