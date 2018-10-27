// Core
import React, { Component } from 'react';
import { Transition, CSSTransition, TransitionGroup } from 'react-transition-group';
import gsap from 'gsap';

// Components
import Composer from '../Composer';
import Post from '../Post';
import { Counter } from '../Counter';
import Spinner from '../Spinner';
import Catcher from '../Catcher';
import StatusBar from '../StatusBar';
import Postman from '../Postman'

// Instruments
import Styles from './styles.m.css';
import { getUniqueID } from '../../instruments';
import { GROUP_ID, api } from '../../API';
import { socket } from '../../socket/init';
import { withProfile } from '../../HOC';
import moment from 'moment';

//Flux
import dispatcher from '../../flux/dispatcher';
import { fetchPost, createPost } from '../../flux/actions';
import PostStore from '../../flux/store';

@withProfile
export default class Feed extends Component {

    _postmanNeedRender = () => {
        const time = localStorage.getItem('key');

        if (time) {
            console.log(moment()
                .diff(time, 'm') >= 2);

            return moment()
                .diff(time, 'minutes') >= 2;
        }

        return true;
    }

    //1
    state = PostStore.getStore();

    componentDidMount() {
        const { currentUserFirstName, currentUserLastName } = this.props;
        this._fetchPostAsync();

        //3
        PostStore.subscribe(this._onChange);

        socket.emit('join', GROUP_ID);

        socket.on('create', (postJSON) => {
            const { data: createdPost } = JSON.parse(postJSON);

            if (currentUserFirstName !== createdPost.firstName
                && currentUserLastName !== createdPost.lastName) {
                /*this.setState((prevState) => ({
                    posts: [ createdPost, ...prevState.posts ],
                }));*/
                const action = createPost(createdPost);
                dispatcher.dispatch(action);
            }
        });

        socket.on('remove', (postJSON) => {

            const { data: deletedPost, meta } = JSON.parse(postJSON);

            if (currentUserFirstName !== meta.authorFirstName
                && currentUserLastName !== meta.authorLastName) {
                this.setState((prevState) => ({
                    posts: prevState.posts.filter((post) => post.id !== deletedPost.id),
                }));
            }
        });

        socket.on('like', (postJSON) => {
            const { data: likedPost } = JSON.parse(postJSON);

            if (currentUserFirstName !== likedPost.firstName
                && currentUserLastName !== likedPost.lastName) {
                this.setState((prevState) => ({
                    posts: prevState.posts.map((post) => post.id === likedPost.id ? likedPost : post),
                }));
            }
        });
    }

    componentWillUnmount() {
        PostStore.unsubscribe(this._onChange());
    }

    //2
    _onChange = () => {
        this.setState(PostStore.getStore());
    };

    _createPostAsync = async (comment) => {
        try {
            this._setPostsFetchingState(true);

            const post = await api.createPost(comment);
            /*this.setState((prevState) => ({
                posts:      [ post, ...prevState.posts ],
                isSpinning: false,
                firstLoad:  true,
            }));*/
            const action = createPost(post);
            dispatcher.dispatch(action);
        } catch (error) {
            console.log(error.message);
            this._setPostsFetchingState(false);
        }
    };

    _setPostsFetchingState = (state) => {
        this.setState({
            isSpinning: state,
        });
    };

    _fetchPostAsync = async () => {
        try {
            this._setPostsFetchingState(true);
            const posts = await api.fethPosts();

            /*this.setState({
                posts,
                isSpinning: false,
            });*/

            //4
            const action = fetchPost(posts);
            dispatcher.dispatch(action);

        } catch (error) {
            console.log(error.message);
            this._setPostsFetchingState(false);
        }
    };

    _removePostAsync = async (postId) => {
        try {
            this._setPostsFetchingState(true);

            await api.removePost(postId);

            this.setState ((prevState) => ({
                posts: prevState.posts.filter(({ id }) => id !== postId),
                isSpinning: false,
            }));


        } catch (error) {
            console.log(error.message);
            this._setPostsFetchingState(false);
        }
    }

    _likePostAsync = async (postId) => {
        try {
            this._setPostsFetchingState(true);

            const likedPost = await api.likePost(postId);

            this.setState ((prevState) => ({
                posts: prevState.posts.map((post) => (post.id === postId ? likedPost : post)),
                isSpinning: false,
            }));


        } catch (error) {
            console.log(error.message);
            this._setPostsFetchingState(false);
        }
    }

    _animateComposerEnter = (composer) => {
        gsap.fromTo(composer, 3, { x: -1000, opacity: 0 }, { x: 0, opacity: 1});
    }

    _animateCounterEnter = (composer) => {
        gsap.fromTo(composer, 3, { x: -1000, y: -500, opacity: 0 }, { x: 0, y: 0, opacity: 1});
    }

    _animatePostmanEnter = (postman) => {
        gsap.fromTo(postman, 2, {x: 1000}, {x: 0});

        setTimeout(() => {
            this.setState({
                isPostmanEntered: false
            })
        }, 3000);
    }

    _animatePostmanExit = (postman) => {
        gsap.fromTo(postman, 3, { x: 0, opacity: 1 }, { x: 100, opacity: 0 });

        var time = moment();

        console.log(time);

        localStorage.setItem('key', time);
    }

    render() {
        const { posts, isSpinning, isTime } = this.state;
        const postsJSX = posts.map((post) => (
            <CSSTransition
                classNames={{
                    enter: Styles.postInStart,
                    enterActive: Styles.postInEnd,
                    exit: Styles.postOutStart,
                    exitActive: Styles.postOutEnd,
                }}
                timeout={{ enter: 500, exit: 400 }}
                key = { post.id }>
                <Catcher >
                    <Post
                        { ...post }
                        removePost = { this._removePostAsync }
                        likePost = { this._likePostAsync }
                    />
                </Catcher>
            </CSSTransition>
        ));

        return (
            <section className = { Styles.feed }>
                <Spinner isSpinning = { isSpinning } />
                <StatusBar/>
                <Transition
                    appear
                    in
                    timeout = {3000}
                    onEnter={ this._animateComposerEnter }>
                    <Composer createPost = { this._createPostAsync } />
                </Transition>
                <Transition
                    appear
                    in
                    timeout = {2000}
                    onEnter={this._animateCounterEnter}>
                    <Counter count = { posts.length } />
                </Transition>
                <TransitionGroup>{postsJSX}</TransitionGroup>
                {isTime
                    ? <Transition
                            appear
                            in={this.state.isPostmanEntered}
                            timeout={{onEnter: 3000, onExit: 3000}}
                            onEnter={this._animatePostmanEnter}
                            onExit={this._animatePostmanExit}>
                            <Postman/>
                      </Transition>
                    : null}
            </section>
        );
    }
}
