// Core
import React, { Component } from 'react';
import { string } from 'prop-types';

// Instruments
import Styles from './styles.m.css';
import { withProfile } from '../../HOC';

export class Composer extends Component {
    static propTypes = {
        avatar:               string.isRequired,
        currentUserFirstName: string.isRequired,
    };

    state = {
        comment: '',
    };

    _handleFormSubmit = (event) => {
        event.preventDefault();
        this._submitComment();
    };

    _updateComment = (event) => {
        const { value: comment } = event.target;

        this.setState({ comment });
    };

    _submitComment = () => {
        const { comment } = this.state;
        const { createPost } = this.props;

        if (!comment) {
            return null;
        }

        createPost(comment);
        this.setState({
            comment: '',
        });
    };

    _preventCopy = (event) => {
        event.preventDefault();
    };

    _submitCommentOnEnter = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            this._submitComment();
        }
    };

    render() {
        const { avatar, currentUserFirstName } = this.props;
        const { comment } = this.state;

        return (
            <section className = { Styles.composer }>
                <img src = { avatar } />
                <form onSubmit = { this._handleFormSubmit }>
                    <textarea
                        placeholder = { `What's on your mind, ${currentUserFirstName}?` }
                        value = { comment }
                        onChange = { this._updateComment }
                        onCopy = { this._preventCopy }
                        onKeyPress = { this._submitCommentOnEnter }
                    />
                    <input
                        type = 'submit'
                        value = 'Post'
                    />
                </form>
            </section>
        );
    }
}

export default withProfile(Composer);
