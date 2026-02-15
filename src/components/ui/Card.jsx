import React from 'react';
import './Card.css';

const Card = ({ className = '', ...props }) => (
    <div className={`card ${className}`} {...props} />
);

const CardHeader = ({ className = '', ...props }) => (
    <div className={`card-header ${className}`} {...props} />
);

const CardTitle = ({ className = '', ...props }) => (
    <h3 className={`card-title ${className}`} {...props} />
);

const CardDescription = ({ className = '', ...props }) => (
    <p className={`card-description ${className}`} {...props} />
);

const CardContent = ({ className = '', ...props }) => (
    <div className={`card-content ${className}`} {...props} />
);

const CardFooter = ({ className = '', ...props }) => (
    <div className={`card-footer ${className}`} {...props} />
);

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
