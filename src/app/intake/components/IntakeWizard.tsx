'use client';

import React, { useState } from 'react';
import UploadStep from './UploadStep';
import MappingStep from './MappingStep';
import ValidationStep from './ValidationStep';
import SealStep from './SealStep';

export type UploadedFile = {
  name: string;
  size: number;
  type: string;
  rowCount: number;
};

export type MappingRow = {
  id: string;
  sourceCol: string;
  canonicalField: string;
  confidence: number;
  sampleValues: string[];
  status: 'mapped' | 'unmapped' | 'ignored';
};

const STEPS = [
  { id: 'step-upload', label: 'Upload', number: 1 },
  { id: 'step-mapping', label: 'Map Columns', number: 2 },
  { id: 'step-validation', label: 'Validate', number: 3 },
  { id: 'step-seal', label: 'Seal', number: 4 },
];

export default function IntakeWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [mappings, setMappings] = useState<MappingRow[]>([]);

  const goNext = () => setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 0));

  return (
    <div className="space-y-5">
      {/* Step progress */}
      <div className="surface-card px-6 py-4">
        <div className="flex items-center gap-0">
          {STEPS.map((step, idx) => (
            <React.Fragment key={step.id}>
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-12 font-600 border transition-all duration-120 ${
                    idx < currentStep
                      ? 'bg-success border-success text-bg'
                      : idx === currentStep
                        ? 'bg-accent-bg border-accent text-accent'
                        : 'bg-surface-2 border-border text-text-dimmer'
                  }`}
                >
                  {idx < currentStep ? '✓' : step.number}
                </div>
                <span
                  className={`text-13 font-500 ${
                    idx === currentStep
                      ? 'text-text'
                      : idx < currentStep
                        ? 'text-success'
                        : 'text-text-dimmer'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-px mx-3 transition-all duration-300 ${
                    idx < currentStep ? 'bg-success' : 'bg-border'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step content */}
      {currentStep === 0 && (
        <UploadStep
          onNext={(file) => {
            setUploadedFile(file);
            goNext();
          }}
        />
      )}
      {currentStep === 1 && uploadedFile && (
        <MappingStep
          file={uploadedFile}
          onNext={(m) => {
            setMappings(m);
            goNext();
          }}
          onBack={goBack}
        />
      )}
      {currentStep === 2 && uploadedFile && (
        <ValidationStep file={uploadedFile} mappings={mappings} onNext={goNext} onBack={goBack} />
      )}
      {currentStep === 3 && uploadedFile && (
        <SealStep file={uploadedFile} mappings={mappings} onBack={goBack} />
      )}
    </div>
  );
}
