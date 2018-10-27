import { FETCH_POSTS, CREATE_POST } from './types';

export const fetchPost = (posts) => {
    console.log('%c fetchPost', 'background: #222; color: #bada55');

    return {
        type:    FETCH_POSTS,
        payload: posts,
    };
};

export const createPost = (post) => {
    console.log('%c createPost', 'background: #222; color: #bada55');

    return {
        type:    CREATE_POST,
        payload: post,
    };
};
