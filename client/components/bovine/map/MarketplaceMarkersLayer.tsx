'use client';

import React from 'react';
import { Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { useBovineMap } from '@/lib/bovine-map-store';
import { MarketplaceListingMap } from '@/lib/bovine-map-types';
import { ShoppingBag, Sparkles, TestTubes, CheckCircle2, ArrowRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export function MarketplaceMarkersLayer() {
  const {
    filteredMarketplaceListings,
    layers,
    selectedEntity,
    setSelectedEntity,
    flyTo,
  } = useBovineMap();

  if (!layers.marketplaceListings) return null;

  const createMarketplaceIcon = (item: MarketplaceListingMap, isSelected: boolean) => {
    let iconLetter = '$';
    let bgColor = '#059669';

    if (item.listingType === 'SEMEN') {
      iconLetter = '⚡';
      bgColor = '#0284c7';
    } else if (item.listingType === 'EMBRYO') {
      iconLetter = '✦';
      bgColor = '#7c3aed';
    } else if (item.listingType === 'LIVE_ANIMAL') {
      iconLetter = item.sex === 'MALE' ? '♂' : '♀';
      bgColor = '#d97706';
    }

    const html = `
      <div class="relative cursor-pointer group" style="transform: translate(-50%, -50%);">
        <div class="w-8 h-8 rounded-full shadow-lg flex items-center justify-center text-white font-bold text-xs border-2 border-white ${
          isSelected ? 'ring-4 ring-amber-400 scale-125 z-50' : 'hover:scale-110'
        }" style="background-color: ${bgColor};">
          <span>${iconLetter}</span>
        </div>
      </div>
    `;

    return L.divIcon({
      html,
      className: 'custom-bovine-marketplace-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -18],
    });
  };

  return (
    <>
      {filteredMarketplaceListings.map((item) => {
        const isSelected = selectedEntity?.id === item.id;
        const icon = createMarketplaceIcon(item, isSelected);

        return (
          <React.Fragment key={item.id}>
            {/* If approximate privacy precision, render approximate radius circle */}
            {item.privacyPrecision === 'APPROXIMATE' && (
              <Circle
                center={item.coordinates}
                radius={item.approximateRadiusMeters}
                pathOptions={{
                  color: isSelected ? '#d97706' : '#10b981',
                  weight: 1,
                  dashArray: '4, 4',
                  fillColor: '#10b981',
                  fillOpacity: 0.08,
                }}
              />
            )}

            <Marker
              position={item.coordinates}
              icon={icon}
              eventHandlers={{
                click: () => {
                  setSelectedEntity({ type: 'MARKETPLACE', id: item.id, data: item });
                  flyTo(item.coordinates, 13);
                },
              }}
            >
              <Popup className="custom-leaflet-popup">
                <div className="p-3 font-sans text-xs max-w-xs space-y-2.5">
                  <div className="flex items-start justify-between gap-1 border-b border-stone-100 pb-2">
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-50 text-amber-900 font-bold border border-amber-200">
                          {item.listingType.replace('_', ' ')}
                        </span>
                        {item.dnaVerified && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 font-semibold flex items-center gap-0.5">
                            <CheckCircle2 className="w-2.5 h-2.5" /> DNA Verified
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-stone-900 text-sm leading-snug">{item.title}</h4>
                      <div className="text-[11px] text-stone-500 mt-0.5">
                        {item.breed} • {item.region}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-stone-50 p-2 rounded-lg border border-stone-200/60">
                    <div>
                      <span className="text-[10px] text-stone-400 font-mono uppercase block">Asking Price</span>
                      <span className="font-bold text-emerald-800 text-sm font-mono">
                        {item.price.toLocaleString()} {item.currency}
                      </span>
                    </div>
                    {item.geneticIndex && (
                      <div className="text-right">
                        <span className="text-[10px] text-stone-400 font-mono uppercase block">Genomic Index</span>
                        <span className="font-bold text-stone-900 font-mono text-sm">{item.geneticIndex}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-2 border-t border-stone-100">
                    <button
                      onClick={() => {
                        setSelectedEntity({ type: 'MARKETPLACE', id: item.id, data: item });
                      }}
                      className="w-full py-1.5 rounded-lg bg-emerald-800 text-white font-semibold text-[11px] hover:bg-emerald-700 transition-colors shadow-2xs cursor-pointer flex items-center justify-center gap-1"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>Commercial Dossier</span>
                    </button>
                    <Link
                      href="/bovine/marketplace"
                      className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-700 transition-colors"
                      title="Marketplace Listing"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          </React.Fragment>
        );
      })}
    </>
  );
}
