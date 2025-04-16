
import React from 'react';

interface StepIndicatorProps {
  steps: { title: string; disabled?: boolean }[];
  currentStep: number;
  onStepClick?: (index: number) => void;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep, onStepClick }) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 w-full overflow-x-auto pb-2">
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isPast = index < currentStep;
        const isClickable = onStepClick && !step.disabled;
        
        return (
          <div
            key={index}
            className={`
              flex items-center gap-2 min-w-fit
              ${index !== 0 ? "flex-1" : ""}
              ${isClickable ? "cursor-pointer group" : step.disabled ? "opacity-50" : ""}
            `}
            onClick={() => isClickable && onStepClick(index)}
          >
            <div 
              className={`
                flex items-center justify-center rounded-full w-8 h-8 shrink-0
                transition-colors duration-200
                ${isActive ? "bg-primary text-primary-foreground" : isPast ? "bg-muted-foreground text-primary-foreground" : "bg-muted text-muted-foreground"}
                ${isClickable && !isActive ? "group-hover:bg-muted-foreground/70 group-hover:text-primary-foreground" : ""}
              `}
            >
              {isPast ? "✓" : index + 1}
            </div>
            
            <div className="flex flex-col gap-0.5">
              <span 
                className={`
                  text-sm font-medium
                  ${isActive ? "text-foreground" : "text-muted-foreground"}
                  ${isClickable && !isActive ? "group-hover:text-foreground" : ""}
                `}
              >
                {step.title}
              </span>
              
              {index < steps.length - 1 && (
                <div className="hidden sm:block h-[2px] w-full bg-muted mt-1">
                  <div 
                    className={`h-full bg-muted-foreground transition-all duration-300 
                      ${isPast ? "w-full" : isActive ? "w-0" : "w-0"}`
                    }
                  />
                </div>
              )}
            </div>
            
            {index < steps.length - 1 && (
              <div className="hidden sm:block flex-1 h-[2px] bg-muted">
                <div 
                  className={`h-full bg-muted-foreground transition-all duration-300 
                    ${isPast ? "w-full" : "w-0"}`
                  }
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepIndicator;
