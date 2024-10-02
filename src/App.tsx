import { ConfigProvider } from 'antd';
import './App.css';
import Routers from './routers/Routers';
import { Provider } from 'react-redux';
import store from './reduxs/store';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return <ConfigProvider theme={{
    token:{
      colorTextHeading: '#1570EF'
    },
    components: {}
  }}>
    <Provider store={store}>
      <Routers />
    </Provider>
  </ConfigProvider>
}

export default App;
