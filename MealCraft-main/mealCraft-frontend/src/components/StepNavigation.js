// components/StepNavigation.js
import React from 'react';

const StepNavigation = ({ currentStep, setCurrentStep }) => {
  const steps = ['Base', 'Protein', 'Veggies', 'Extras'];

  return (
    <div style={tabWrapperStyle}>
      {steps.map((label, index) => (
        <div
          key={index}
          onClick={() => setCurrentStep(index)}
          style={{
            ...tabStyle,
            backgroundColor: currentStep === index ? '#ff6b6b' : '#f9f9f9',
            color: currentStep === index ? '#fff' : '#333',
            fontWeight: currentStep === index ? 'bold' : 'normal',
            borderTopLeftRadius: index === 0 ? '10px' : '0',
            borderTopRightRadius: index === steps.length - 1 ? '10px' : '0',
          }}
        >
          {index + 1}. {label}
        </div>
      ))}
    </div>
  );
};

const tabWrapperStyle = {
  display: 'flex',
  marginBottom: '20px',
  borderBottom: '2px solid #ccc',
  overflow: 'hidden',
  borderTopLeftRadius: '10px',
};

const tabStyle = {
  flex: 1,
  textAlign: 'center',
  padding: '12px 0',
  cursor: 'pointer',
  transition: '0.3s all',
  userSelect: 'none'
};

export default StepNavigation;
