'use client';

import React from 'react';
import { useNewListingWizard } from './_hooks/useNewListingWizard';
import {
  NewListingHeader,
  StepAssetType,
  StepCommercialTerms,
  StepTechnicalSpecs,
  StepPresentationMedia,
  StepDocumentVault,
  StepLogisticsReview,
  NewListingControls,
} from './_components';

export default function NewMarketplaceListingPage() {
  const {
    animals,
    step,
    setStep,
    assetType,
    setAssetType,
    selectedAnimalId,
    handleSelectAnimal,
    // Step 2
    listingType,
    setListingType,
    askingPrice,
    setAskingPrice,
    minimumPrice,
    setMinimumPrice,
    priceNegotiable,
    setPriceNegotiable,
    // Step 3
    semenBatch,
    setSemenBatch,
    semenMotility,
    setSemenMotility,
    semenConcentration,
    setSemenConcentration,
    semenDoses,
    setSemenDoses,
    semenVault,
    setSemenVault,
    semenSexedType,
    setSemenSexedType,
    embryoCode,
    setEmbryoCode,
    embryoDonor,
    setEmbryoDonor,
    embryoSire,
    setEmbryoSire,
    embryoStage,
    setEmbryoStage,
    embryoGrade,
    setEmbryoGrade,
    embryoQty,
    setEmbryoQty,
    embryoMethod,
    setEmbryoMethod,
    // Step 4
    title,
    setTitle,
    description,
    setDescription,
    highlightInput,
    setHighlightInput,
    highlights,
    handleAddHighlight,
    handleRemoveHighlight,
    mediaUrl,
    setMediaUrl,
    mediaList,
    handleAddMedia,
    // Step 5
    documents,
    setDocuments,
    // Step 6
    transportArrangedBy,
    setTransportArrangedBy,
    deliveryRadius,
    setDeliveryRadius,
    // Publish
    handlePublish,
  } = useNewListingWizard();

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-stone-900 pb-24">
      {/* Header with Breadcrumbs & Stepper */}
      <NewListingHeader step={step} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
          {/* Step 1: Asset Type & Animal Selection */}
          {step === 1 && (
            <StepAssetType
              assetType={assetType}
              setAssetType={setAssetType}
              selectedAnimalId={selectedAnimalId}
              onSelectAnimal={handleSelectAnimal}
              animals={animals}
            />
          )}

          {/* Step 2: Commercial Pricing & Terms */}
          {step === 2 && (
            <StepCommercialTerms
              listingType={listingType}
              setListingType={setListingType}
              askingPrice={askingPrice}
              setAskingPrice={setAskingPrice}
              minimumPrice={minimumPrice}
              setMinimumPrice={setMinimumPrice}
              priceNegotiable={priceNegotiable}
              setPriceNegotiable={setPriceNegotiable}
            />
          )}

          {/* Step 3: Technical Specifications */}
          {step === 3 && (
            <StepTechnicalSpecs
              assetType={assetType}
              semenBatch={semenBatch}
              setSemenBatch={setSemenBatch}
              semenVault={semenVault}
              setSemenVault={setSemenVault}
              semenMotility={semenMotility}
              setSemenMotility={setSemenMotility}
              semenDoses={semenDoses}
              setSemenDoses={setSemenDoses}
              embryoCode={embryoCode}
              setEmbryoCode={setEmbryoCode}
              embryoQty={embryoQty}
              setEmbryoQty={setEmbryoQty}
              embryoDonor={embryoDonor}
              setEmbryoDonor={setEmbryoDonor}
              embryoSire={embryoSire}
              setEmbryoSire={setEmbryoSire}
            />
          )}

          {/* Step 4: Presentation & Media */}
          {step === 4 && (
            <StepPresentationMedia
              title={title}
              setTitle={setTitle}
              description={description}
              setDescription={setDescription}
              highlightInput={highlightInput}
              setHighlightInput={setHighlightInput}
              highlights={highlights}
              onAddHighlight={handleAddHighlight}
              onRemoveHighlight={handleRemoveHighlight}
              mediaUrl={mediaUrl}
              setMediaUrl={setMediaUrl}
              mediaList={mediaList}
              onAddMedia={handleAddMedia}
            />
          )}

          {/* Step 5: Document Vault & Visibility */}
          {step === 5 && (
            <StepDocumentVault
              documents={documents}
              setDocuments={setDocuments}
            />
          )}

          {/* Step 6: Logistics & Review */}
          {step === 6 && (
            <StepLogisticsReview
              transportArrangedBy={transportArrangedBy}
              setTransportArrangedBy={setTransportArrangedBy}
              deliveryRadius={deliveryRadius}
              setDeliveryRadius={setDeliveryRadius}
              title={title}
              assetType={assetType}
              askingPrice={askingPrice}
            />
          )}

          {/* Navigation Stepper Controls */}
          <NewListingControls
            step={step}
            setStep={setStep}
            onPublish={handlePublish}
          />
        </div>
      </div>
    </div>
  );
}
