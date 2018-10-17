//Core
import React, { Component } from 'react';
import { string, func, arrayOf, shape } from 'prop-types';
import cx from 'classnames';

//Instruments
import Styles from './styles.m.css';
import { withProfile } from '../../HOC';

@withProfile
export default class Like extends Component {
    static propTypes = {
        likePost:             func.isRequired,
        id:                   string.isRequired,
        currentUserFirstName: string.isRequired,
        currentUserLastName:  string.isRequired,
        likes:                arrayOf(
            shape({
                firstName: string.isRequired,
                lastName:  string.isRequired
            })
        ).isRequired,
    }

    static defaultProps ={
        likes: [],
    };

    state = {
        showLikers: false,
    };

    _showLikers = () => {
        this.setState({
            showLikers: true,
        })
    };

    _hideLikers = () => {
        this.setState({
            showLikers: false,
        })
    };

    _getLikedByMe = () => {
        const { currentUserFirstName, currentUserLastName, likes } = this.props;

        return likes.some(({ firstName, lastName }) =>
            firstName === currentUserFirstName && lastName === currentUserLastName);
    }

    _getLikedStyles = () => {
        const likedByMe = this._getLikedByMe();

        return cx(Styles.icon, {
            [Styles.liked]: likedByMe,
        });
    };

    _getLikersList = () => {
        const { showLikers } = this.state;
        const { likes } = this.props;

        const likesJSX = likes.map(({ firstName, lastName, id }) => (
            <li key={id}>
                {firstName} {lastName}
            </li>
        ));

        return likes.length && showLikers ? <ul>{likesJSX}</ul> : null;
    }

    _getLikersDescription = () => {
        const { likes, currentUserFirstName, currentUserLastName } = this.props;
        const likedByMe = this._getLikedByMe();

        if (likes.length === 1 && likedByMe) {
            return `${currentUserFirstName} ${currentUserLastName}`
        } else if (likes.length === 2 && likedByMe) {
            return `You and 1 other`
        } else if (likedByMe) {
            return `You and ${likes.length - 1} others`;
        };

        return likes.length;
    }

    _likePost = () => {
        const { id, likePost } = this.props;

        likePost(id);
    }

    render() {
        const likers = this._getLikersList();
        const likeStyles = this._getLikedStyles();
        const likersDescription = this._getLikersDescription();
        return (
            <section className={Styles.like}>
                <span className = { likeStyles } onClick={this._likePost}>
                    Like
                </span>
                <div>
                    {likers}
                    <span
                        onMouseEnter={this._showLikers}
                        onMouseLeave={this._hideLikers} >
                        {likersDescription}
                    </span>
                </div>
            </section>
        );
    }
}
