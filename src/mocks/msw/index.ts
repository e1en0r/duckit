import { handlers as signInHandlers } from './signin';
import { handlers as signUpHandlers } from './signup';
import { handlers as postsHandlers } from './posts';

export const handlers = [...signInHandlers, ...signUpHandlers, ...postsHandlers];
