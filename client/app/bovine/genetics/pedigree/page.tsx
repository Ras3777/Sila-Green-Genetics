'use client';

import React from 'react';
import { usePedigreeExplorer } from './_hooks/usePedigreeExplorer';
import {
  PedigreeHeaderCard,
  PedigreeTreeChart,
  PedigreeMatingSimulator,
  VerifyParentageModal,
} from './_components';

export default function PedigreeExplorerPage() {
  const {
    animals,
    selectedAnimal,
    setSelectedAnimalId,
    generationsDepth,
    setGenerationsDepth,
    parentage,
    pedigreeF,
    genomicFroh,
    sireAnimal,
    damAnimal,
    matingSireId,
    setMatingSireId,
    matingDamId,
    setMatingDamId,
    simulatedInbreeding,
    verifyModalOpen,
    setVerifyModalOpen,
    handleVerifyParentage,
  } = usePedigreeExplorer();

  return (
    <div className="space-y-6">
      {/* Top Header & Animal Switcher */}
      <PedigreeHeaderCard
        selectedAnimal={selectedAnimal}
        generationsDepth={generationsDepth}
        onSelectGenerationsDepth={setGenerationsDepth}
        animals={animals}
        onSelectAnimal={setSelectedAnimalId}
        onOpenVerifyModal={() => setVerifyModalOpen(true)}
        pedigreeF={pedigreeF}
        genomicFroh={genomicFroh}
        parentage={parentage}
      />

      {/* Pedigree Visual Tree Component */}
      <PedigreeTreeChart
        selectedAnimal={selectedAnimal}
        pedigreeF={pedigreeF}
        parentage={parentage}
        sireAnimal={sireAnimal}
        damAnimal={damAnimal}
        generationsDepth={generationsDepth}
      />

      {/* Mating Co-Ancestry & Consanguinity Simulator */}
      <PedigreeMatingSimulator
        animals={animals}
        matingSireId={matingSireId}
        onSelectSire={setMatingSireId}
        matingDamId={matingDamId}
        onSelectDam={setMatingDamId}
        simulatedInbreeding={simulatedInbreeding}
      />

      {/* Verify Parentage Modal */}
      <VerifyParentageModal
        isOpen={verifyModalOpen}
        onClose={() => setVerifyModalOpen(false)}
        animalName={selectedAnimal?.name}
        onVerify={handleVerifyParentage}
      />
    </div>
  );
}
