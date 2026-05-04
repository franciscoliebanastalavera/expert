// Dynamic import of bootstrap: required by Module Federation so the shared
// dependencies are available before the React app initialises.
import tokensScss from '../../shared-ui/src/styles/tokens.scss';

const tokenStyle = document.createElement('style');
tokenStyle.dataset['capitalflowTokens'] = 'shared-ui';
tokenStyle.textContent = tokensScss;
document.head.appendChild(tokenStyle);

import('./bootstrap');
