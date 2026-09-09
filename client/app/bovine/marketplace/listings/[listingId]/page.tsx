'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useUniversalListingDetail } from './_hooks/useUniversalListingDetail';
import {
  ListingNotFoundState,
  ListingBreadcrumb,
  ListingGallery,
  ListingHeaderCard,
  ListingTabsHeader,
  ListingOverviewTab,
  ListingGeneticsTab,
  ListingPedigreeTab,
  ListingDocumentsTab,
  ListingLogisticsTab,
  ListingCommercialSidebar,
  ListingOfferModal,
  ListingReserveModal,
  ListingInquiryModal,
  ListingInspectionModal,
} from './_components';

export default function UniversalListingDetailPage() {
  const params = useParams();
  const listingId = params?.listingId as string;

  const {
    listing,
    animal,
    isSaved,
    isCompared,
    activeMediaIdx,
    setActiveMediaIdx,
    activeTab,
    setActiveTab,
    herdFit,
    toggleSaveListing,
    toggleCompareListing,
    // Offer modal
    showOfferModal,
    setShowOfferModal,
    offerAmount,
    setOfferAmount,
    offerMessage,
    setOfferMessage,
    handleMakeOffer,
    // Inquiry modal
    showInquiryModal,
    setShowInquiryModal,
    inquirySubject,
    setInquirySubject,
    inquiryMessage,
    setInquiryMessage,
    handleSendInquiry,
    // Reserve modal
    showReserveModal,
    setShowReserveModal,
    reserveDeposit,
    setReserveDeposit,
    handleReserve,
    // Inspection modal
    showInspectionModal,
    setShowInspectionModal,
    inspectionType,
    setInspectionType,
    inspectionDate,
    setInspectionDate,
    inspectorName,
    setInspectorName,
    handleRequestInspection,
  } = useUniversalListingDetail(listingId);

  if (!listing) {
    return <ListingNotFoundState />;
  }

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-stone-900 pb-24">
      {/* Breadcrumb */}
      <ListingBreadcrumb title={listing.title} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main 2 Cols */}
          <div className="lg:col-span-2 space-y-8">
            {/* Media Gallery */}
            <ListingGallery
              media={listing.media}
              title={listing.title}
              assetType={listing.assetType}
              activeMediaIdx={activeMediaIdx}
              setActiveMediaIdx={setActiveMediaIdx}
            />

            {/* Header info */}
            <ListingHeaderCard
              listing={listing}
              animal={animal}
              isSaved={isSaved}
              isCompared={isCompared}
              onToggleCompare={() => toggleCompareListing(listing.id)}
              onToggleSave={() => toggleSaveListing(listing.id)}
            />

            {/* Deep Tabs */}
            <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
              <ListingTabsHeader
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                documentCount={listing.documents.length}
              />

              <div className="p-6 sm:p-8">
                {activeTab === 'overview' && <ListingOverviewTab listing={listing} />}
                {activeTab === 'genetics' && <ListingGeneticsTab />}
                {activeTab === 'pedigree' && <ListingPedigreeTab />}
                {activeTab === 'documents' && <ListingDocumentsTab documents={listing.documents} />}
                {activeTab === 'logistics' && <ListingLogisticsTab logistics={listing.logistics} />}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <ListingCommercialSidebar
            listing={listing}
            herdFit={herdFit}
            onOpenReserve={() => setShowReserveModal(true)}
            onOpenOffer={() => setShowOfferModal(true)}
            onOpenInspection={() => setShowInspectionModal(true)}
            onOpenInquiry={() => setShowInquiryModal(true)}
          />
        </div>
      </div>

      {/* Offer Modal */}
      <ListingOfferModal
        isOpen={showOfferModal}
        onClose={() => setShowOfferModal(false)}
        offerAmount={offerAmount}
        setOfferAmount={setOfferAmount}
        offerMessage={offerMessage}
        setOfferMessage={setOfferMessage}
        onSubmit={handleMakeOffer}
      />

      {/* Reserve Modal */}
      <ListingReserveModal
        isOpen={showReserveModal}
        onClose={() => setShowReserveModal(false)}
        reserveDeposit={reserveDeposit}
        setReserveDeposit={setReserveDeposit}
        onSubmit={handleReserve}
      />

      {/* Inquiry Modal */}
      <ListingInquiryModal
        isOpen={showInquiryModal}
        onClose={() => setShowInquiryModal(false)}
        inquirySubject={inquirySubject}
        setInquirySubject={setInquirySubject}
        inquiryMessage={inquiryMessage}
        setInquiryMessage={setInquiryMessage}
        onSubmit={handleSendInquiry}
      />

      {/* Inspection Modal */}
      <ListingInspectionModal
        isOpen={showInspectionModal}
        onClose={() => setShowInspectionModal(false)}
        inspectionType={inspectionType}
        setInspectionType={setInspectionType}
        inspectionDate={inspectionDate}
        setInspectionDate={setInspectionDate}
        inspectorName={inspectorName}
        setInspectorName={setInspectorName}
        onSubmit={handleRequestInspection}
      />
    </div>
  );
}
