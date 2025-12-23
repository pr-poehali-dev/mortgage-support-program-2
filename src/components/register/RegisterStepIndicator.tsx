import Icon from '@/components/ui/icon';

interface Step {
  number: number;
  title: string;
  icon: string;
}

interface RegisterStepIndicatorProps {
  currentStep: number;
  steps: Step[];
}

export default function RegisterStepIndicator({ currentStep, steps }: RegisterStepIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((s, index) => (
          <div key={s.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  currentStep >= s.number
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                <Icon name={s.icon as any} size={20} />
              </div>
              <div className="text-xs mt-2 text-center font-medium text-gray-600">
                {s.title}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-1 flex-1 mx-2 transition-all ${
                  currentStep > s.number ? 'bg-primary' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
