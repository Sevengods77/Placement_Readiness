import React from 'react';
import './ProofFooter.css';

const ProofFooter = () => {
    const checkpoints = [
        { id: 'ui', label: 'UI Built' },
        { id: 'logic', label: 'Logic Working' },
        { id: 'test', label: 'Test Passed' },
        { id: 'deploy', label: 'Deployed' }
    ];

    return (
        <footer className="proof-footer">
            <div className="footer-content">
                <div className="checklist-group">
                    {checkpoints.map(cp => (
                        <label key={cp.id} className="checklist-item">
                            <input type="checkbox" />
                            <span className="checkbox-custom"></span>
                            <span className="checkbox-label">{cp.label}</span>
                        </label>
                    ))}
                </div>
                <div className="proof-action">
                    <button className="btn-link">Requires user proof input</button>
                </div>
            </div>
        </footer>
    );
};

export default ProofFooter;
