import AppLayout from '@/components/AppLayout';
import IntakeWizard from './components/IntakeWizard';

export default function IntakePage() {
  return (
    <AppLayout title="Intake" subtitle="Submit CSE SOC Data">
      <div className="px-6 py-5 max-w-screen-2xl mx-auto">
        <IntakeWizard />
      </div>
    </AppLayout>
  );
}
