import React from 'react';
import './SecondaryPanel.css';
import Button from '../ui/Button';
import { Copy, Rocket, Check, ExternalLink } from 'lucide-react';

const SecondaryPanel = () => {
    return (
        <aside className="secondary-panel">
            <div className="step-explanation">
                <h3>Step Analysis</h3>
                <p>This is where the logic and requirements for the current step are outlined with professional clarity.</p>
            </div>

            <div className="prompt-box">
                <div className="prompt-header">
                    <span>AI Prompt</span>
                    <Button variant="secondary" style={{ padding: '4px' }}>
                        <Copy size={14} />
                    </Button>
                </div>
                <div className="prompt-content">
                    Create a premium dashboard layout with off-white background and deep red accents...
                </div>
            </div>

            <div className="panel-actions">
                <Button variant="primary" style={{ width: '100%' }}>
                    <Rocket size={16} /> Build in Lovable
                </Button>
                <div className="action-grid">
                    <Button variant="secondary">It Worked</Button>
                    <Button variant="secondary">Error</Button>
                </div>
                <Button variant="secondary" style={{ width: '100%' }}>
                    Add Screenshot
                </Button>
            </div>
        </aside>
    );
};

export default SecondaryPanel;
