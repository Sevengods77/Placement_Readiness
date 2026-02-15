import React from 'react';
import './TopBar.css';

const TopBar = ({ projectName = "KodNest Premium Build System", step = 1, totalSteps = 8, status = "In Progress" }) => {
    return (
        <div className="top-bar">
            <div className="top-bar-left">{projectName}</div>
            <div className="top-bar-center">Step {step} / {totalSteps}</div>
            <div className="top-bar-right">
                <span className={`status-badge status-${status.toLowerCase().replace(/\s+/g, '-')}`}>
                    {status}
                </span>
            </div>
        </div>
    );
};

export default TopBar;
