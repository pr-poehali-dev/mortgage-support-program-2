import PropertyFormDialog from '@/components/catalog/PropertyFormDialog';
import AdminPropertiesHeader from '@/components/admin/AdminPropertiesHeader';
import AdminPropertiesList from '@/components/admin/AdminPropertiesList';
import { usePropertyManagement } from '@/hooks/usePropertyManagement';

export default function AdminProperties() {
  const {
    properties,
    loading,
    propertyDialogOpen,
    setPropertyDialogOpen,
    uploadingPhoto,
    editProperty,
    formData,
    setFormData,
    openCreateDialog,
    openEditDialog,
    handlePhotoSelect,
    handleDocumentSelect,
    handleRemoveDocument,
    handlePropertySubmit,
    handleDeleteProperty,
  } = usePropertyManagement();

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminPropertiesHeader onCreateClick={openCreateDialog} />

      <div className="container mx-auto px-4 py-6">
        <AdminPropertiesList
          properties={properties}
          loading={loading}
          onEdit={openEditDialog}
          onDelete={handleDeleteProperty}
        />
      </div>

      <PropertyFormDialog
        dialogOpen={propertyDialogOpen}
        setDialogOpen={setPropertyDialogOpen}
        editProperty={editProperty}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handlePropertySubmit}
        handlePhotoSelect={handlePhotoSelect}
        uploadingPhoto={uploadingPhoto}
        photoPreview={formData.photos[0] || ''}
        handleDocumentSelect={handleDocumentSelect}
        handleRemoveDocument={handleRemoveDocument}
      />
    </div>
  );
}
