import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBovine } from '@/lib/bovine-store';

export function useReproProcessWizard() {
  const router = useRouter();
  const { animals, addReproductiveProcess } = useBovine();

  const femaleAnimals = animals.filter((a) => a.sex === 'FEMALE');
  const maleAnimals = animals.filter((a) => a.sex === 'MALE');

  const [step, setStep] = useState<number>(1);

  // Form State
  // Step 1: Cow / Recipient
  const [cowAnimalId, setCowAnimalId] = useState(femaleAnimals[0]?.id || '');
  const [recipientDgr, setRecipientDgr] = useState('DGR-REC-001');
  const [branding, setBranding] = useState('Right Hip #104');
  const [managementGroup, setManagementGroup] = useState('Recipient Herd Alpha');

  // Step 2: Donor (if ET)
  const [donorCowAnimalId, setDonorCowAnimalId] = useState('');
  const [donorCowPlaceholder, setDonorCowPlaceholder] = useState('');
  const [donorWeightKg, setDonorWeightKg] = useState('610');
  const [donorBcs, setDonorBcs] = useState('6.5');
  const [donorBreed, setDonorBreed] = useState('Angus Elite Purebred');

  // Step 3: Bull / Semen
  const [bullAnimalId, setBullAnimalId] = useState('');
  const [bullPlaceholder, setBullPlaceholder] = useState('SAV Raindance 6848');
  const [bullDgr, setBullDgr] = useState('DGR-BULL-998');
  const [bullBreed, setBullBreed] = useState('Angus');
  const [semenBatch, setSemenBatch] = useState('BATCH-2026-US-48');

  // Step 4: Embryo (if ET)
  const [embryoCode, setEmbryoCode] = useState('EMB-2026-081');
  const [embryoBreed, setEmbryoBreed] = useState('100% Angus');
  const [embryoStage, setEmbryoStage] = useState('Stage 4 - Morula / Stage 5 - Blastocyst');
  const [embryoGrade, setEmbryoGrade] = useState('Grade 1 (Excellent)');
  const [embryoPreservation, setEmbryoPreservation] = useState<'FRESH' | 'FROZEN'>('FROZEN');

  // Step 5: Synchronization
  const [syncProtocol, setSyncProtocol] = useState('7-Day Co-Synch + CIDR');
  const [syncStartDate, setSyncStartDate] = useState(
    new Date(Date.now() - 9 * 86400000).toISOString().split('T')[0]
  );
  const [syncDeviceRemovalDate, setSyncDeviceRemovalDate] = useState(
    new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0]
  );
  const [syncTreatments, setSyncTreatments] = useState('GnRH (2ml) + PGF2a (5ml) at pull');

  // Step 6: Procedure Type & Date
  const [procedureType, setProcedureType] = useState<'ARTIFICIAL_INSEMINATION' | 'EMBRYO_TRANSFER'>('ARTIFICIAL_INSEMINATION');
  const [procedureDate, setProcedureDate] = useState(new Date().toISOString().split('T')[0]);
  const [technician, setTechnician] = useState('Dr. Helena Rocha (DVM / Embryologist)');

  // Step 7: Expected Pregnancy Checks & Calving
  const [expectedCalvingDate, setExpectedCalvingDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 283); // 283 days gestation
    return d.toISOString().split('T')[0];
  });

  const selectedCow = animals.find((a) => a.id === cowAnimalId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addReproductiveProcess({
      cowAnimalId,
      recipientDgr: recipientDgr || undefined,
      donorCowAnimalId: donorCowAnimalId || undefined,
      donorCowPlaceholder: donorCowPlaceholder || undefined,
      donorWeightKg: parseFloat(donorWeightKg) || undefined,
      donorBcs: parseFloat(donorBcs) || undefined,
      bullAnimalId: bullAnimalId || undefined,
      bullPlaceholder: bullPlaceholder || undefined,
      bullDgr: bullDgr || undefined,
      semenBatch: semenBatch || undefined,
      embryoCode: procedureType === 'EMBRYO_TRANSFER' ? embryoCode : undefined,
      embryoStageGrade: procedureType === 'EMBRYO_TRANSFER' ? `${embryoStage} • ${embryoGrade} • ${embryoPreservation}` : undefined,
      syncProtocol,
      syncStartDate,
      syncDeviceRemovalDate,
      syncTreatments,
      procedureType,
      procedureDate,
      technician,
      currentStage: 'INSEMINATED',
      expectedCalvingDate,
      checks: [
        {
          checkType: 'CHECK_30',
          date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
          result: 'PENDING',
          notes: 'Scheduled 30-day ultrasound pregnancy scan',
        },
      ],
      notes: `Procedure initiated on ${procedureDate}. Synchronization protocol: ${syncProtocol}.`,
    });

    router.push('/bovine/reproduction/processes');
  };

  const handlePrevStep = () => {
    if (step === 3 && procedureType === 'ARTIFICIAL_INSEMINATION') setStep(1);
    else if (step === 5 && procedureType === 'ARTIFICIAL_INSEMINATION') setStep(3);
    else setStep(step - 1);
  };

  const handleNextStep = () => {
    if (step === 1 && procedureType === 'ARTIFICIAL_INSEMINATION') setStep(3);
    else if (step === 3 && procedureType === 'ARTIFICIAL_INSEMINATION') setStep(5);
    else setStep(step + 1);
  };

  return {
    femaleAnimals,
    maleAnimals,
    selectedCow,
    step,
    setStep,
    // Step 1
    cowAnimalId,
    setCowAnimalId,
    recipientDgr,
    setRecipientDgr,
    branding,
    setBranding,
    managementGroup,
    setManagementGroup,
    // Step 2
    donorCowAnimalId,
    setDonorCowAnimalId,
    donorCowPlaceholder,
    setDonorCowPlaceholder,
    donorWeightKg,
    setDonorWeightKg,
    donorBcs,
    setDonorBcs,
    donorBreed,
    setDonorBreed,
    // Step 3
    bullAnimalId,
    setBullAnimalId,
    bullPlaceholder,
    setBullPlaceholder,
    bullDgr,
    setBullDgr,
    bullBreed,
    setBullBreed,
    semenBatch,
    setSemenBatch,
    // Step 4
    embryoCode,
    setEmbryoCode,
    embryoBreed,
    setEmbryoBreed,
    embryoStage,
    setEmbryoStage,
    embryoGrade,
    setEmbryoGrade,
    embryoPreservation,
    setEmbryoPreservation,
    // Step 5
    syncProtocol,
    setSyncProtocol,
    syncStartDate,
    setSyncStartDate,
    syncDeviceRemovalDate,
    setSyncDeviceRemovalDate,
    syncTreatments,
    setSyncTreatments,
    // Step 6
    procedureType,
    setProcedureType,
    procedureDate,
    setProcedureDate,
    technician,
    setTechnician,
    // Step 7
    expectedCalvingDate,
    setExpectedCalvingDate,
    // Actions
    handleSubmit,
    handlePrevStep,
    handleNextStep,
  };
}
