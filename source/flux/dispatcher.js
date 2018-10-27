export default new class Dispatcher {
    constructor() {
        this.__listeners = [];
    }

    dispatch(action) {
        console.log('%c end Actions to the store', 'background: #222; color: #bada55');
        this.__listeners.forEach((listener) => listener(action));
    }

    register(listener) {
        console.log('%c Register store', 'background: #222; color: #bada55');
        this.__listeners.push(listener);
    }
}();
