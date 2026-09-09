'use client';

import React, { use } from 'react';
import AnimalMediaGallery from '@/components/bovine/media/AnimalMediaGallery';
import { useBreedingStockProfile } from './_hooks/useBreedingStockProfile';
import {
  BreedingNotFoundState,
  BreedingHeroHeader,
  BreedingTabsHeader,
  BreedingOverviewTab,
  BreedingIdentityTab,
  BreedingPedigreeTab,
  BreedingCompositionTab,
  BreedingPerformanceTab,
  BreedingPhenotypesTab,
  BreedingGeneticsTab,
  BreedingEvaluationsTab,
  BreedingReproductionTab,
  BreedingProgenyTab,
  BreedingHealthTab,
  BreedingAuditTab,
} from './_components';

export default function BreedingStockProfilePage({
  params,
}: {
  params: Promise<{ animalId: string }>;
}) {
  const resolvedParams = use(params);
  const profile = useBreedingStockProfile(resolvedParams.animalId);

  if (!profile.animal) {
    return <BreedingNotFoundState />;
  }

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Hero Header Card */}
      <BreedingHeroHeader
        animal={profile.animal}
        farm={profile.farm}
        herd={profile.herd}
      />

      {/* Tabs Header */}
      <BreedingTabsHeader
        tabs={profile.tabs}
        activeTab={profile.activeTab}
        setActiveTab={profile.setActiveTab}
      />

      {/* Tab Panels */}
      {profile.activeTab === 'overview' && (
        <BreedingOverviewTab
          animal={profile.animal}
          sire={profile.sire}
          dam={profile.dam}
          parentRel={profile.parentRel}
          maternalList={profile.maternalList}
          weaningList={profile.weaningList}
          yearlingList={profile.yearlingList}
          setActiveTab={profile.setActiveTab}
        />
      )}

      {profile.activeTab === 'identity' && (
        <BreedingIdentityTab animal={profile.animal} />
      )}

      {profile.activeTab === 'pedigree' && (
        <BreedingPedigreeTab
          animal={profile.animal}
          sire={profile.sire}
          dam={profile.dam}
        />
      )}

      {profile.activeTab === 'breed' && (
        <BreedingCompositionTab animal={profile.animal} />
      )}

      {profile.activeTab === 'performance' && (
        <BreedingPerformanceTab
          animal={profile.animal}
          maternalList={profile.maternalList}
          weaningList={profile.weaningList}
          yearlingList={profile.yearlingList}
        />
      )}

      {profile.activeTab === 'phenotypes' && (
        <BreedingPhenotypesTab />
      )}

      {profile.activeTab === 'genetics' && (
        <BreedingGeneticsTab />
      )}

      {profile.activeTab === 'evaluations' && (
        <BreedingEvaluationsTab />
      )}

      {profile.activeTab === 'reproduction' && (
        <BreedingReproductionTab reproList={profile.reproList} />
      )}

      {profile.activeTab === 'progeny' && (
        <BreedingProgenyTab progenyList={profile.progenyList} />
      )}

      {profile.activeTab === 'health' && (
        <BreedingHealthTab />
      )}

      {profile.activeTab === 'media' && (
        <AnimalMediaGallery
          animalId={profile.animal.id}
          variant="BREEDING_STOCK"
          backHref={`/bovine/animals/breeding-stock/${profile.animal.id}`}
          hideHeroBanner={true}
        />
      )}

      {profile.activeTab === 'audit' && (
        <BreedingAuditTab animal={profile.animal} />
      )}
    </div>
  );
}
