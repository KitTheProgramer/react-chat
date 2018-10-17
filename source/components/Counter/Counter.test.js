import dom from 'react-test-renderer';
import { Counter } from './index';

const renderTree = dom.create(<Counter count = { 4 }/>).toJSON();

test('counter component should correspond to its snapshot', () => {
    expect(renderTree).toMatchSnapshot();
});
