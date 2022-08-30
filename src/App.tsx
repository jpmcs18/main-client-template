import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { AuthorizeProvider } from './custom-hooks/authorize-provider';
import Dashboard from './pages/home-page';
import { getTheme } from './processors/session-manager';
import store from './state/store';
import './styles/style.css';
function App() {
  useEffect(
    () => {
      if (getTheme()) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    },
    //eslint-disable-next-line
    []
  );

  return (
    <Provider store={store}>
      <AuthorizeProvider>
        <Dashboard />
      </AuthorizeProvider>
    </Provider>
  );
}

export default App;
