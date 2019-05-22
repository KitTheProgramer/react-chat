//Core
import { EventEmitter } from 'events';

//Instruments
import dispatcher from './dispatcher';
import { FETCH_POSTS, CREATE_POST } from './types';

export default new class PostsStore extends EventEmitter {
    constructor() {
        super();
        this.store = {
            posts:            [],
            isSpinning:       false,
            //isTime:           this._postmanNeedRender(),
            isPostmanEntered: true,
        };

        dispatcher.register((action) => {
            console.log('%c Store get action object', 'background: #222; color: #bada55');
            switch (action.type) {
                case FETCH_POSTS:
                    this.fetchPosts(action.payload);
                    break;
                case CREATE_POST:
                    this.createPost(action.payload);
                    break;
                default:
                    return false;
            }
        });
    }

    subscribe(callback) {
        console.log('%c subscribe component', 'background: #222; color: #bada55');
        this.on('change', callback);
    }

    unsubscribe(callback) {
        console.log('%c unsubscribe component', 'background: #222; color: #bada55');
        this.removeListener('change', callback);
    }

    update() {
        console.log('%c Notify component', 'background: #222; color: #bada55');
        this.emit('change');
    }

    getStore() {
        console.log('%c Return store', 'background: #222; color: #bada55');

        return this.store;
    }

    fetchPosts(posts) {
        console.log('%c Handle FETCH_POSTS event', 'background: #222; color: #bada55');
        this.store.posts = posts;
        this.update();
    }

    createPost(post) {
        console.log('%c Handle CREATE_POSTS event', 'background: #222; color: #bada55');
        const { posts } = this.store;

        this.store.posts = [ post, ...posts ];
        this.update();
    }
}();
