import React from 'react';
import TopBar from './components/layout/TopBar';
import ContextHeader from './components/layout/ContextHeader';
import SecondaryPanel from './components/layout/SecondaryPanel';
import ProofFooter from './components/layout/ProofFooter';
import './App.css';

function App() {
    return (
        <div className="app-container">
            <TopBar />

            <main className="main-layout">
                <div className="primary-workspace">
                    <div className="container-720">
                        <ContextHeader />

                        <div className="workspace-content">
                            <div className="card">
                                <h3>Primary Interaction Area</h3>
                                <p>
                                    This workspace is dedicated to the core product experience.
                                    It follows a 70% width constraint for optimal readability
                                    and focuses on clean, predictable interactions.
                                </p>

                                <div className="example-actions" style={{ marginTop: '24px' }}>
                                    <button className="btn btn-primary">Primary Action</button>
                                    <button className="btn btn-secondary" style={{ marginLeft: '12px' }}>Secondary Action</button>
                                </div>
                            </div>

                            <div className="card" style={{ marginTop: '24px' }}>
                                <h3>Component Rules</h3>
                                <ul className="rules-list">
                                    <li>Solid Deep Red for primary actions</li>
                                    <li>Calm off-white background (#F7F6F3)</li>
                                    <li>Serif headings with generous spacing</li>
                                    <li>No gradients, no glassmorphism</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="secondary-panel-wrapper">
                    <SecondaryPanel />
                </div>
            </main>

            <ProofFooter />
        </div>
    );
}

export default App;
