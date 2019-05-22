// Instruments
import { MAIN_URL, TOKEN } from '../config';

export default new class Api {
    async fethPosts () {
        const response = await fetch(`${MAIN_URL}?size=60&page=1`, {
            method: 'GET',
        });

        if (response.status !== 200) {
            throw new Error('Post were not loaded.');
        }

        const { data: posts } = await response.json();

        return posts;
    }

    async createPost(comment) {
        const response = await fetch(MAIN_URL, {
            method:  'POST',
            headers: {
                authorization:  TOKEN,
                'content-type': 'application/json',
            },
            body: JSON.stringify({ comment }),
        });

        if (response.status !== 200) {
            throw new Error('Post were not loaded.');
        }

        const { data: post } = await response.json();

        return post;
    }

    async removePost(postId) {
        const response = await fetch(`${MAIN_URL}/${postId}`, {
            method:  'DELETE',
            headers: {
                authorization: TOKEN,
            },
        });

        if (response.status !== 204) {
            throw new Error('Post were not deleted.');
        }

        return true;
    }

    async likePost(postId) {
        const response = await fetch(`${MAIN_URL}/${postId}`, {
            method:  'PUT',
            headers: {
                authorization: TOKEN,
            },
        });

        if (response.status !== 200) {
            throw new Error('Put were not loaded.');
        }

        const { data: post } = await response.json();

        return post;
    }
}();
