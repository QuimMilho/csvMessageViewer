import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from './componentes/Home';
import NotFound from './componentes/NotFound';
import SideBar from './componentes/SideBar';
import './styles/global.scss';

function App() {
	return (
		<Router>
			<div className="home">
				<SideBar />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
			</div>
		</Router>
	);
}

export default App;
