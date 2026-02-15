import React from 'react';
import './ContextHeader.css';

const ContextHeader = ({ title = "Create Premium SaaS Design System", subtitle = "Establish foundational styles and layout for KodNest Build System." }) => {
    return (
        <header className="context-header">
            <h1>{title}</h1>
            <p>{subtitle}</p>
        </header>
    );
};

export default ContextHeader;
