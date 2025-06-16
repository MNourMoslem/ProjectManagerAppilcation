import {
  MainButton,
  PrimaryButton,
  SecondaryButton,
  IconButton,
  DangerButton,
  SuccessButton,
  OutlineButton
} from './buttons';

function ButtonsShowcase() {
  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-lg font-medium mb-4 border-b pb-2">Main & Primary Buttons</h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="space-y-2">
            <p className="text-xs text-gray-500">Main (XS)</p>
            <MainButton text="Main Button" size="xs" />
          </div>
          <div className="space-y-2">
            <p className="text-xs text-gray-500">Main (SM)</p>
            <MainButton text="Main Button" size="sm" />
          </div>
          <div className="space-y-2">
            <p className="text-xs text-gray-500">Main (MD)</p>
            <MainButton text="Main Button" />
          </div>
          <div className="space-y-2">
            <p className="text-xs text-gray-500">Main (LG)</p>
            <MainButton text="Main Button" size="lg" />
          </div>
          
          <div className="space-y-2">
            <p className="text-xs text-gray-500">Primary (XS)</p>
            <PrimaryButton text="Primary Button" size="xs" />
          </div>
          <div className="space-y-2">
            <p className="text-xs text-gray-500">Primary (SM)</p>
            <PrimaryButton text="Primary Button" size="sm" />
          </div>
          <div className="space-y-2">
            <p className="text-xs text-gray-500">Primary (MD)</p>
            <PrimaryButton text="Primary Button" />
          </div>
          <div className="space-y-2">
            <p className="text-xs text-gray-500">Primary (LG)</p>
            <PrimaryButton text="Primary Button" size="lg" />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-medium mb-4 border-b pb-2">Secondary Buttons</h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="space-y-2">
            <p className="text-xs text-gray-500">Secondary (XS)</p>
            <SecondaryButton text="Secondary" size="xs" />
          </div>
          <div className="space-y-2">
            <p className="text-xs text-gray-500">Secondary (SM)</p>
            <SecondaryButton text="Secondary" size="sm" />
          </div>
          <div className="space-y-2">
            <p className="text-xs text-gray-500">Secondary (MD)</p>
            <SecondaryButton text="Secondary" />
          </div>
          <div className="space-y-2">
            <p className="text-xs text-gray-500">Secondary (LG)</p>
            <SecondaryButton text="Secondary" size="lg" />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-medium mb-4 border-b pb-2">Icon Buttons</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <p className="text-xs text-gray-500">Ghost</p>
            <div className="flex space-x-2">
              <IconButton icon="+" size="xs" />
              <IconButton icon="+" size="sm" />
              <IconButton icon="+" size="md" />
              <IconButton icon="+" size="lg" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs text-gray-500">Primary</p>
            <div className="flex space-x-2">
              <IconButton icon="+" variant="primary" size="xs" />
              <IconButton icon="+" variant="primary" size="sm" />
              <IconButton icon="+" variant="primary" size="md" />
              <IconButton icon="+" variant="primary" size="lg" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs text-gray-500">Secondary</p>
            <div className="flex space-x-2">
              <IconButton icon="+" variant="secondary" size="xs" />
              <IconButton icon="+" variant="secondary" size="sm" />
              <IconButton icon="+" variant="secondary" size="md" />
              <IconButton icon="+" variant="secondary" size="lg" />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-medium mb-4 border-b pb-2">Status Buttons</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-xs text-gray-500">Danger</p>
            <div className="flex space-x-2">
              <DangerButton text="Delete" size="xs" />
              <DangerButton text="Delete" size="sm" />
              <DangerButton text="Delete" size="md" />
              <DangerButton text="Delete" size="lg" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs text-gray-500">Success</p>
            <div className="flex space-x-2">
              <SuccessButton text="Complete" size="xs" />
              <SuccessButton text="Complete" size="sm" />
              <SuccessButton text="Complete" size="md" />
              <SuccessButton text="Complete" size="lg" />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-medium mb-4 border-b pb-2">Outline Buttons</h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="space-y-2">
            <p className="text-xs text-gray-500">Default</p>
            <OutlineButton text="Default" />
          </div>
          <div className="space-y-2">
            <p className="text-xs text-gray-500">Primary</p>
            <OutlineButton text="Primary" variant="primary" />
          </div>
          <div className="space-y-2">
            <p className="text-xs text-gray-500">Danger</p>
            <OutlineButton text="Danger" variant="danger" />
          </div>
          <div className="space-y-2">
            <p className="text-xs text-gray-500">Success</p>
            <OutlineButton text="Success" variant="success" />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-medium mb-4 border-b pb-2">Disabled State</h2>
        <div className="grid grid-cols-3 gap-4">
          <PrimaryButton text="Disabled" disabled />
          <SecondaryButton text="Disabled" disabled />
          <OutlineButton text="Disabled" disabled />
        </div>
      </div>
    </div>
  );
}

export default ButtonsShowcase;
