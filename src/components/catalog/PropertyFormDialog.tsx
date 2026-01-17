import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';
import FormStepIndicator from './FormStepIndicator';
import FormStep1BasicInfo from './FormStep1BasicInfo';
import FormStep2Details from './FormStep2Details';
import FormStep3Description from './FormStep3Description';

interface PropertyFormDialogProps {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  editProperty: any | null;
  formData: any;
  setFormData: (data: any) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handlePhotoSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadingPhoto: boolean;
  photoPreview: string;
  handleDocumentSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveDocument: (url: string) => void;
  agreedToTerms?: boolean;
  setAgreedToTerms?: (agreed: boolean) => void;
  agreedToPrivacy?: boolean;
  setAgreedToPrivacy?: (agreed: boolean) => void;
}

export default function PropertyFormDialog({
  dialogOpen,
  setDialogOpen,
  editProperty,
  formData,
  setFormData,
  handleSubmit,
  handlePhotoSelect,
  uploadingPhoto,
  handleDocumentSelect,
  handleRemoveDocument,
  agreedToTerms,
  setAgreedToTerms,
  agreedToPrivacy,
  setAgreedToPrivacy,
}: PropertyFormDialogProps) {
  const [currentStep, setCurrentStep] = useState(1);

  const handleRemovePhoto = (photoUrl: string) => {
    const newPhotos = formData.photos.filter((p: string) => p !== photoUrl);
    setFormData({ ...formData, photos: newPhotos, photo_url: newPhotos[0] || '' });
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {editProperty ? 'Редактировать объявление' : 'Разместить объявление'}
          </DialogTitle>
        </DialogHeader>

        <FormStepIndicator currentStep={currentStep} setCurrentStep={setCurrentStep} />

        <form onSubmit={handleSubmit} className="space-y-6">
          {currentStep === 1 && (
            <FormStep1BasicInfo
              formData={formData}
              setFormData={setFormData}
              setCurrentStep={setCurrentStep}
            />
          )}

          {currentStep === 2 && (
            <FormStep2Details
              formData={formData}
              setFormData={setFormData}
              setCurrentStep={setCurrentStep}
            />
          )}

          {currentStep === 3 && (
            <FormStep3Description
              formData={formData}
              setFormData={setFormData}
              setCurrentStep={setCurrentStep}
              handlePhotoSelect={handlePhotoSelect}
              uploadingPhoto={uploadingPhoto}
              handleRemovePhoto={handleRemovePhoto}
              editProperty={editProperty}
              handleDocumentSelect={handleDocumentSelect}
              handleRemoveDocument={handleRemoveDocument}
              agreedToTerms={agreedToTerms}
              setAgreedToTerms={setAgreedToTerms}
              agreedToPrivacy={agreedToPrivacy}
              setAgreedToPrivacy={setAgreedToPrivacy}
            />
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}