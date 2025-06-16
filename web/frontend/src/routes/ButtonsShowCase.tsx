import {
  MainButton,
  PrimaryButton,
  SecondaryButton,
  IconButton,
  DangerButton,
  SuccessButton,
  OutlineButton
} from '../components/buttons';
import { useState } from 'react';

function ButtonsShowCase() {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLoadingClick = () => {
    setIsLoading(true);
    // Simulate an API call or async operation
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };
  return (
    <div className="py-8">
      <div className="mb-12">
        <h1 className="text-3xl font-semibold mb-4">Linear-Inspired Buttons</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
          A collection of minimal, elegant buttons designed with Linear's black and white aesthetic.
          Featuring tiny, fancy typography and clean design principles.
        </p>
      </div>

      <div className="space-y-16">
        {/* Primary Actions Section */}
        <section>
          <h2 className="text-xl font-medium mb-6 pb-2 border-b border-gray-200 dark:border-gray-800">
            Primary Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Main Buttons</h3>              <div className="flex flex-wrap gap-4 items-center">
                <MainButton text="Default" />
                <MainButton text="With Icon" icon="→" />
                <MainButton text="Disabled" disabled />
                <MainButton text="Loading" loading />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Primary Buttons</h3>              <div className="flex flex-wrap gap-4 items-center">
                <PrimaryButton text="Primary" />
                <PrimaryButton text="With Icon" icon="→" />
                <PrimaryButton text="Disabled" disabled />
                <PrimaryButton text="Loading" loading />
              </div>
            </div>
          </div>
        </section>

        {/* Size Variations Section */}
        <section>
          <h2 className="text-xl font-medium mb-6 pb-2 border-b border-gray-200 dark:border-gray-800">
            Size Variations
          </h2>
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Button Sizes</h3>
              <div className="flex flex-wrap gap-4 items-end">
                <PrimaryButton text="XS" size="xs" />
                <PrimaryButton text="Small" size="sm" />
                <PrimaryButton text="Medium" size="md" />
                <PrimaryButton text="Large" size="lg" />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Icon Button Sizes</h3>
              <div className="flex flex-wrap gap-4 items-end">
                <IconButton icon="+" size="xs" variant="primary" />
                <IconButton icon="+" size="sm" variant="primary" />
                <IconButton icon="+" size="md" variant="primary" />
                <IconButton icon="+" size="lg" variant="primary" />
              </div>
            </div>
          </div>
        </section>

        {/* Secondary Actions Section */}
        <section>
          <h2 className="text-xl font-medium mb-6 pb-2 border-b border-gray-200 dark:border-gray-800">
            Secondary Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Secondary Buttons</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <SecondaryButton text="Secondary" />
                <SecondaryButton text="With Icon" icon="⚙️" />
                <SecondaryButton text="Disabled" disabled />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Outline Buttons</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <OutlineButton text="Default" />
                <OutlineButton text="Primary" variant="primary" />
                <OutlineButton text="Disabled" disabled />
              </div>
            </div>
          </div>
        </section>

        {/* Status Indicators Section */}
        <section>
          <h2 className="text-xl font-medium mb-6 pb-2 border-b border-gray-200 dark:border-gray-800">
            Status Indicators
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Success Buttons</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <SuccessButton text="Complete" />
                <SuccessButton text="With Icon" icon="✓" />
                <OutlineButton text="Success" variant="success" />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Danger Buttons</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <DangerButton text="Delete" />
                <DangerButton text="With Icon" icon="×" />
                <OutlineButton text="Danger" variant="danger" />
              </div>
            </div>          </div>
        </section>

        {/* Loading States Section */}
        <section>
          <h2 className="text-xl font-medium mb-6 pb-2 border-b border-gray-200 dark:border-gray-800">
            Loading States
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Loading Buttons</h3>              <div className="flex flex-wrap gap-4 items-center">
                <PrimaryButton text="Loading..." loading={true} />
                <SecondaryButton text="Loading..." loading={true} />
                <DangerButton text="Loading..." loading={true} />
                <SuccessButton text="Loading..." loading={true} />
                <MainButton text="Loading..." loading={true} />
                <OutlineButton text="Loading..." loading={true} />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Interactive Loading</h3>
              <div className="flex flex-wrap gap-4 items-center">                <PrimaryButton 
                  text={isLoading ? "Loading..." : "Click to Load"} 
                  loading={isLoading} 
                  onClick={handleLoadingClick} 
                />
                <MainButton
                  text={isLoading ? "Processing..." : "Main Action"}
                  loading={isLoading}
                  onClick={handleLoadingClick}
                />
                <IconButton 
                  icon="↻" 
                  loading={isLoading} 
                  onClick={handleLoadingClick} 
                  variant="primary"
                />
                <OutlineButton 
                  text={isLoading ? "Processing..." : "Submit"} 
                  loading={isLoading} 
                  variant="primary" 
                  onClick={handleLoadingClick}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ButtonsShowCase