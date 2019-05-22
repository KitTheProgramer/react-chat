// Instruments
import { getFullApiUrl } from '../instruments';

const GROUP_ID = 'crknbffchzv2';
const TOKEN = 'ml2qvu2aqj';

const SOCKET_URL = 'https://lab.lectrum.io';
const ROOT_URL = 'https://lab.lectrum.io/react/api';
const MAIN_URL = getFullApiUrl(ROOT_URL, GROUP_ID);

export { GROUP_ID, TOKEN, MAIN_URL, SOCKET_URL };
