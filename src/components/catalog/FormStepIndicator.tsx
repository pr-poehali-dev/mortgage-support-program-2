import Icon from '@/components/ui/icon';

interface FormStepIndicatorProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

export default function FormStepIndicator({ currentStep, setCurrentStep }: FormStepIndicatorProps) {
  return (
    <div className="flex items-center justify-center mb-6 gap-2">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <button
            type="button"
            onClick={() => setCurrentStep(step)}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
              currentStep === step
                ? 'bg-primary text-white'
                : currentStep > step
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {currentStep > step ? <Icon name="Check" size={16} /> : step}
          </button>
          {step < 3 && (
            <div className={`w-12 h-0.5 ${currentStep > step ? 'bg-green-500' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
}
