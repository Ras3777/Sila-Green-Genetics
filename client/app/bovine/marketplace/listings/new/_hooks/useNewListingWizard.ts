import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMarketplace } from '@/lib/bovine-marketplace-store';
import { useBovine } from '@/lib/bovine-store';
import {
  MarketplaceAssetType,
  MarketplaceListingType,
  DocumentVisibility,
} from '@/lib/bovine-marketplace-types';

export function useNewListingWizard() {
  const router = useRouter();
  const { animals, herds, farms } = useBovine();
  const { createListing } = useMarketplace();

  const [step, setStep] = useState(1);

  // Form State
  const [assetType, setAssetType] = useState<MarketplaceAssetType>('LIVE_ANIMAL');
  const [selectedAnimalId, setSelectedAnimalId] = useState<string>('');

  // Commercial Pricing
  const [listingType, setListingType] = useState<MarketplaceListingType>('NEGOTIABLE');
  const [askingPrice, setAskingPrice] = useState<number>(4500);
  const [minimumPrice, setMinimumPrice] = useState<number>(4000);
  const [priceNegotiable, setPriceNegotiable] = useState(true);

  // Semen specific
  const [semenBatch, setSemenBatch] = useState('SM-2025-X');
  const [semenMotility, setSemenMotility] = useState(65);
  const [semenConcentration, setSemenConcentration] = useState(30);
  const [semenDoses, setSemenDoses] = useState(50);
  const [semenVault, setSemenVault] = useState('Hawkeye Cryo Banking');
  const [semenSexedType, setSemenSexedType] = useState<'CONVENTIONAL' | 'FEMALE_SEXED' | 'MALE_SEXED'>('CONVENTIONAL');

  // Embryo specific
  const [embryoCode, setEmbryoCode] = useState('EMB-2025-LOT');
  const [embryoDonor, setEmbryoDonor] = useState('');
  const [embryoSire, setEmbryoSire] = useState('');
  const [embryoStage, setEmbryoStage] = useState('Stage 6');
  const [embryoGrade, setEmbryoGrade] = useState('Grade 1');
  const [embryoQty, setEmbryoQty] = useState(4);
  const [embryoMethod, setEmbryoMethod] = useState<'IVF' | 'IN_VIVO'>('IVF');

  // Presentation & Marketing
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [highlightInput, setHighlightInput] = useState('');
  const [highlights, setHighlights] = useState<string[]>(['DNA Parentage Verified', 'Top 5% Selection Index']);
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaList, setMediaList] = useState<Array<{ id: string; url: string; title: string; type: 'IMAGE' }>>([]);

  // Documents
  const [docName, setDocName] = useState('Registry Certificate');
  const [docType, setDocType] = useState<'REGISTRY_CERT' | 'VET_HEALTH_CERT' | 'GENOMIC_REPORT'>('REGISTRY_CERT');
  const [docVisibility, setDocVisibility] = useState<DocumentVisibility>('PUBLIC');
  const [documents, setDocuments] = useState<Array<{ id: string; name: string; type: any; visibility: DocumentVisibility; url: string; verified: boolean }>>([
    { id: 'doc-auto-1', name: 'Official Breed Registry Certificate', type: 'REGISTRY_CERT', visibility: 'PUBLIC', url: '#', verified: true },
    { id: 'doc-auto-2', name: 'Breeding Soundness Evaluation (BSE)', type: 'VET_HEALTH_CERT', visibility: 'AFTER_INQUIRY', url: '#', verified: true },
  ]);

  // Logistics
  const [transportArrangedBy, setTransportArrangedBy] = useState<'SELLER' | 'BUYER' | 'BOTH'>('BOTH');
  const [deliveryRadius, setDeliveryRadius] = useState(350);
  const [logisticsNotes, setLogisticsNotes] = useState('Hauling available via climate-controlled livestock trailer. Buyer pickup welcome.');

  // Privacy
  const [showLocation, setShowLocation] = useState(true);
  const [showPhone, setShowPhone] = useState(true);

  // Auto-fill from selected animal
  const handleSelectAnimal = (animalId: string) => {
    setSelectedAnimalId(animalId);
    const chosen = animals.find((a) => a.id === animalId);
    if (chosen) {
      setTitle(`${chosen.name || chosen.identifiers?.[0]?.value || 'Registered Animal'} - ${chosen.breed || 'Angus'}`);
      setDescription(`Exceptional registered ${chosen.breed} ${chosen.sex === 'MALE' ? 'breeding bull' : 'donor female'}. Sound feet, excellent maternal lines, and high economic selection index.`);
    }
  };

  const handleAddHighlight = () => {
    if (highlightInput.trim() && !highlights.includes(highlightInput.trim())) {
      setHighlights([...highlights, highlightInput.trim()]);
      setHighlightInput('');
    }
  };

  const handleRemoveHighlight = (idx: number) => {
    setHighlights(highlights.filter((_, i) => i !== idx));
  };

  const handleAddMedia = () => {
    if (mediaUrl.trim()) {
      setMediaList([
        ...mediaList,
        { id: `med-${Date.now()}`, url: mediaUrl.trim(), title: 'Uploaded Photo', type: 'IMAGE' },
      ]);
      setMediaUrl('');
    }
  };

  const handlePublish = () => {
    const listingId = createListing({
      assetType,
      animalId: selectedAnimalId || undefined,
      semenDetails:
        assetType === 'SEMEN'
          ? {
              batchNumber: semenBatch,
              collectionDate: new Date().toISOString().split('T')[0],
              collectionCenter: semenVault,
              cryoMethod: 'Liquid Nitrogen Vapor',
              qualityGrade: 'CSS Approved',
              motilityPercent: semenMotility,
              concentrationMml: semenConcentration,
              availableDoses: semenDoses,
              storageVault: semenVault,
              sexedType: semenSexedType,
            }
          : undefined,
      embryoDetails:
        assetType === 'EMBRYO'
          ? {
              embryoCode,
              donorCowAnimalId: selectedAnimalId || 'anim-2',
              donorName: embryoDonor || 'Highland Blackcap 8912',
              sireAnimalId: 'anim-1',
              sireName: embryoSire || 'GAR Sure Fire 6432',
              collectionDate: new Date().toISOString().split('T')[0],
              stage: embryoStage,
              grade: embryoGrade,
              preservation: 'FROZEN',
              quantity: embryoQty,
              storageCenter: 'Boviteq Cryo Vault',
              ivfOrInVivo: embryoMethod,
            }
          : undefined,
      sellerId: 'usr-current',
      sellerName: 'Highland Cattle Co.',
      sellerOrgId: 'org-1',
      sellerOrgName: 'Highland Cattle Co.',
      sellerVerified: true,
      farmId: 'farm-1',
      farmName: 'North Pastures Farm',
      region: 'Montana, USA',
      listingType,
      status: 'ACTIVE',
      currency: 'USD',
      askingPrice: Number(askingPrice),
      minimumPrice: Number(minimumPrice),
      priceNegotiable,
      availableFrom: new Date().toISOString().split('T')[0],
      title: title || 'Registered Breeding Stock Listing',
      description,
      highlights,
      media:
        mediaList.length > 0
          ? mediaList
          : [
              {
                id: 'med-default',
                type: 'IMAGE',
                url: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=800&q=80',
                title: 'Primary Photo',
                isPrimary: true,
              },
            ],
      documents,
      logistics: {
        pickupAvailable: true,
        transportArrangedBy,
        deliveryRadiusKm: deliveryRadius,
        notes: logisticsNotes,
      },
      privacy: {
        showExactLocation: showLocation,
        showContactPhone: showPhone,
        showContactEmail: true,
      },
      trustBadges: {
        identityVerified: true,
        ownershipVerified: true,
        parentageDnaVerified: true,
        genotyped: true,
        carrierFreeStatus: true,
        healthClearanceCurrent: true,
        registryCertified: true,
      },
    });

    alert('Commercial listing published successfully!');
    if (assetType === 'LIVE_ANIMAL') {
      router.push(`/bovine/marketplace/animals/${listingId}`);
    } else if (assetType === 'SEMEN') {
      router.push(`/bovine/marketplace/semen/${listingId}`);
    } else if (assetType === 'EMBRYO') {
      router.push(`/bovine/marketplace/embryos/${listingId}`);
    } else {
      router.push(`/bovine/marketplace/listings/${listingId}`);
    }
  };

  return {
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
    logisticsNotes,
    setLogisticsNotes,
    // Publish
    handlePublish,
  };
}
