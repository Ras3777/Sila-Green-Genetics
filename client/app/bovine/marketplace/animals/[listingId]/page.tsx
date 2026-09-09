'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useAnimalListingDetail } from './_hooks/useAnimalListingDetail';
import {
  AnimalListingNotFound,
  AnimalListingBreadcrumb,
  AnimalListingGallery,
  AnimalListingBioHeader,
  AnimalListingTabs,
  AnimalListingGeneticsTab,
  AnimalListingPedigreeTab,
  AnimalListingDocumentsTab,
  AnimalListingLogisticsTab,
  AnimalListingProgenyTab,
  AnimalListingCommercialSidebar,
  MakeOfferModal,
  ReserveAnimalModal,
  SendInquiryModal,
} from './_components';

export default function LiveAnimalListingDetailPage() {
  const params = useParams();
  const listingId = params?.listingId as string;
  const detail = useAnimalListingDetail(listingId);

  if (!detail.listing) {
    return <AnimalListingNotFound />;
  }

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-stone-900 pb-24">
      {/* Top Breadcrumb */}
      <AnimalListingBreadcrumb title={detail.listing.title} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Main Grid: Left Gallery & Info, Right Commercial Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Media & Core Bio */}
          <div className="lg:col-span-2 space-y-8">
            {/* Media Gallery */}
            <AnimalListingGallery
              media={detail.listing.media}
              title={detail.listing.title}
              activeMediaIdx={detail.activeMediaIdx}
              setActiveMediaIdx={detail.setActiveMediaIdx}
            />

            {/* Animal Title & Biological Highlights */}
            <AnimalListingBioHeader
              listing={detail.listing}
              animal={detail.animal}
              isSaved={detail.isSaved}
              isCompared={detail.isCompared}
              toggleSaveListing={detail.toggleSaveListing}
              toggleCompareListing={detail.toggleCompareListing}
            />

            {/* Deep Domain Biological Tabs */}
            <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
              <AnimalListingTabs
                activeTab={detail.activeTab}
                setActiveTab={detail.setActiveTab}
                documentCount={detail.listing.documents.length}
              />

              <div className="p-6 sm:p-8">
                {detail.activeTab === 'genetics' && (
                  <AnimalListingGeneticsTab animal={detail.animal} />
                )}

                {detail.activeTab === 'pedigree' && (
                  <AnimalListingPedigreeTab
                    listing={detail.listing}
                    animal={detail.animal}
                  />
                )}

                {detail.activeTab === 'health_docs' && (
                  <AnimalListingDocumentsTab listing={detail.listing} />
                )}

                {detail.activeTab === 'logistics' && (
                  <AnimalListingLogisticsTab listing={detail.listing} />
                )}

                {detail.activeTab === 'progeny' && (
                  <AnimalListingProgenyTab
                    potentialMates={detail.potentialMates}
                    selectedMateId={detail.selectedMateId}
                    setSelectedMateId={detail.setSelectedMateId}
                    progenyPreview={detail.progenyPreview}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Right 1 Col: Pricing, Commercial Action Card & Seller Profile */}
          <div>
            <AnimalListingCommercialSidebar
              listing={detail.listing}
              herdFit={detail.herdFit}
              onOpenReserveModal={() => detail.setShowReserveModal(true)}
              onOpenOfferModal={() => detail.setShowOfferModal(true)}
              onOpenInquiryModal={() => detail.setShowInquiryModal(true)}
            />
          </div>
        </div>
      </div>

      {/* Offer Modal */}
      <MakeOfferModal
        isOpen={detail.showOfferModal}
        onClose={() => detail.setShowOfferModal(false)}
        onSubmit={detail.handleMakeOffer}
        listing={detail.listing}
        offerAmount={detail.offerAmount}
        setOfferAmount={detail.setOfferAmount}
        offerMessage={detail.offerMessage}
        setOfferMessage={detail.setOfferMessage}
      />

      {/* Reserve Modal */}
      <ReserveAnimalModal
        isOpen={detail.showReserveModal}
        onClose={() => detail.setShowReserveModal(false)}
        onSubmit={detail.handleReserve}
        reserveDeposit={detail.reserveDeposit}
        setReserveDeposit={detail.setReserveDeposit}
      />

      {/* Inquiry Modal */}
      <SendInquiryModal
        isOpen={detail.showInquiryModal}
        onClose={() => detail.setShowInquiryModal(false)}
        onSubmit={detail.handleSendInquiry}
        inquirySubject={detail.inquirySubject}
        setInquirySubject={detail.setInquirySubject}
        inquiryMessage={detail.inquiryMessage}
        setInquiryMessage={detail.setInquiryMessage}
      />
    </div>
  );
}
