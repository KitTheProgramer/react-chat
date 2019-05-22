// Core
import { Composer } from './index';

// Mocks
const mocks = {
    createPostMock:     jest.fn(() => Promise.resolve()),
    preventDefaultMock: jest.fn(),
};

const avatar = 'https://www.avatar.com';
const currentUserFirstName = 'Bard';
const props = {
    createPost: mocks.createPostMock,
    currentUserFirstName,
    avatar,
};

const testComment = 'Hello Lectrum!';
const initialState = {
    comment: '',
};
const updateState = {
    comment: testComment,
};

const result = mount(<Composer { ...props } />);
const markup = render(<Composer { ...props } />);

const spies = {
    _updateCommentSpy:        jest.spyOn(result.instance(), '_updateComment'),
    _submitCommentSpy:        jest.spyOn(result.instance(), '_submitComment'),
    _handleFormSubmitSpy:     jest.spyOn(result.instance(), '_handleFormSubmit'),
    _submitCommentOnEnterSpy: jest.spyOn(result.instance(), '_submitCommentOnEnter'),
};

describe('composer component:', () => {
    describe('should have valid marcup elements', () => {
        test('core JSX', () => {
            expect(result.find('section.composer')).toHaveLength(1);
            expect(result.find('form')).toHaveLength(1);
            expect(result.find('textarea')).toHaveLength(1);
            expect(result.find('input')).toHaveLength(1);
            expect(result.find('img')).toHaveLength(1);
        });
    });

    describe('should have valid props', () => {
        test('currentUserFirstName should be a string', () => {
            expect(typeof result.prop('currentUserFirstName')).toBe('string');
        });
        test('avatar should be a string', () => {
            expect(typeof result.prop('avatar')).toBe('string');
        });
    });

    describe('should have valid initial state properties', () => {
        test('comment should be an empty string', () => {
            expect(result.state('comment')).toBe('');
        });
    });

    describe('should have core class methods', () => {
        test('should call preventDefault', () => {
            result.instance()._handleFormSubmit({
                preventDefault: mocks.preventDefaultMock,
            });

            expect(mocks.preventDefaultMock).toHaveBeenCalledTimes(1);
        });

        test('should call this._submitContent class method', () => {
            expect(spies._submitCommentSpy).toHaveBeenCalledTimes(1);

            jest.clearAllMocks();
        });

        describe('_submitComment', () => {
            afterEach(() => {
                jest.clearAllMocks();
                result.setState(initialState);
            });

            test('should do nothing if state.comment is an empty string', () => {
                result.instance()._submitComment();

                expect(spies._submitCommentSpy).toHaveBeenCalledWith();
                expect(mocks.createPostMock).not.toHaveBeenCalled();
                expect(result.state()).toEqual(initialState);
            });

            test('should call props.createPost with a comment as an argument', () => {
                result.setState({
                    comment: testComment,
                });
                result.instance()._submitComment();

                expect(mocks.createPostMock).toHaveBeenNthCalledWith(1, testComment);
                expect(result.state()).toEqual(initialState);
            });
        });
        describe('_updateComent', () => {
            test('should update state.comment', () => {
                result.instance()._updateComment({
                    target: {
                        value: testComment,
                    },
                });

                expect(result.state()).toEqual(updateState);

                jest.clearAllMocks();
                result.setState(initialState);
            });
        });

        describe('_sumbitCommentOnEnter', () => {
            afterEach(() => {
                jest.clearAllMocks();
            });

            test('should call event.preventDefault and this._submitContent', () => {
                result.instance()._submitCommentOnEnter({
                    key:            'Enter',
                    preventDefault: mocks.preventDefaultMock,
                });

                expect(mocks.preventDefaultMock).toHaveBeenCalledTimes(1);
                expect(spies._submitCommentSpy).toHaveBeenCalledTimes(1);
            });

            test('should not call event.preventDefault and this._submitContent on other key', () => {
                result.instance()._submitCommentOnEnter({
                    preventDefault: mocks.preventDefaultMock,
                });

                expect(mocks.preventDefaultMock).not.toHaveBeenCalled();
                expect(spies._submitCommentSpy).not.toHaveBeenCalled();
            });
        });
    });

    describe('should implement core business logic', () => {
        test('textarea value should be empty initially', () => {
            expect(result.find('textarea').text()).toBe('');
        });

        test('textarea value should be controlled by state', () => {
            result.setState({
                comment: testComment,
            });

            expect(result.find('textarea').text()).toBe(testComment);

            result.setState(initialState);
        });

        test('textarea onChange event should trigger this._submitComment', () => {
            result.find('textarea').simulate('change', {
                target: {
                    value: testComment,
                },
            });

            expect(spies._updateCommentSpy).toHaveBeenCalledTimes(1);
            expect(result.find('textarea').text()).toBe(testComment);
            expect(result.state()).toEqual(updateState);
            result.setState(initialState);
        });
    });

    describe('should render valid markup', () => {
        test('should contain valid CSS class', () => {
            expect(markup.attr('class')).toBe('composer');
        });

        test('should contain valid placeholder', () => {
            expect(markup.find('textarea').attr('placeholder')).toBe(
                `What\'s on your mind, ${currentUserFirstName}?`,
            );
        });

        test('img should have a valid src', () => {
            expect(markup.find('img').attr('src')).toBe(avatar);
        });

        test('snapshot should match', () => {
            expect(markup.html()).toMatchSnapshot();
        });
    });
});
