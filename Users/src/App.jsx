import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import TriageWizard from './pages/TriageWizard'
import ResultPage from './pages/ResultPage'
import ResourceMap from './pages/ResourceMap'

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/triage" element={<TriageWizard />} />
                    <Route path="/result" element={<ResultPage />} />
                    <Route path="/map" element={<ResourceMap />} />
                </Routes>
            </Layout>
        </Router>
    )
}

export default App
