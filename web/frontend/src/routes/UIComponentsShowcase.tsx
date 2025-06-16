import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tooltip } from '../components/tooltips';
import { Notification, ToastProvider, useToast } from '../components/notifications';
import { PrimaryButton, SecondaryButton, DangerButton } from '../components/buttons';

// Toast demo component that needs to be inside the ToastProvider
const ToastDemo = () => {
  const { addToast } = useToast();
  
  const showToast = (type: 'info' | 'success' | 'warning' | 'error') => {
    addToast({
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Toast`,
      message: `This is a ${type} toast notification that will auto-dismiss.`,
      type,
      autoDismiss: true,
      duration: 5000
    });
  };
  
  const showActionToast = () => {
    addToast({
      title: 'Action Required',
      message: 'This toast has an action button that you can click.',
      type: 'warning',
      autoDismiss: false,
      actionText: 'Dismiss',
      onAction: () => console.log('Action clicked')
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <PrimaryButton onClick={() => showToast('info')}>Show Info Toast</PrimaryButton>
        <SecondaryButton onClick={() => showToast('success')}>Show Success Toast</SecondaryButton>
        <SecondaryButton onClick={() => showToast('warning')}>Show Warning Toast</SecondaryButton>
        <DangerButton onClick={() => showToast('error')}>Show Error Toast</DangerButton>
      </div>
      <div>
        <PrimaryButton onClick={showActionToast}>Show Action Toast</PrimaryButton>
      </div>
    </div>
  );
};

function UIComponentsShowcase() {
  const [notificationVisible, setNotificationVisible] = useState(false);
  
  return (
    <div className="py-8">
      <ToastProvider position="top-right">
        <div className="mb-12">
          <h1 className="text-3xl font-semibold mb-4">UI Components</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
            A collection of essential UI components like notifications, tooltips, and more to enhance the user experience.
          </p>
        </div>

        <div className="space-y-16">
          {/* Tooltips */}
          <section>
            <h2 className="text-xl font-medium mb-6 pb-2 border-b border-gray-200 dark:border-gray-800">
              Tooltips
            </h2>
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Basic Tooltips</h3>
                <div className="flex flex-wrap gap-6">
                  <div>
                    <Tooltip content="This is a tooltip on top" position="top">
                      <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                        Hover Me (Top)
                      </button>
                    </Tooltip>
                  </div>
                  <div>
                    <Tooltip content="This is a tooltip on bottom" position="bottom">
                      <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                        Hover Me (Bottom)
                      </button>
                    </Tooltip>
                  </div>
                  <div>
                    <Tooltip content="This is a tooltip on left" position="left">
                      <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                        Hover Me (Left)
                      </button>
                    </Tooltip>
                  </div>
                  <div>
                    <Tooltip content="This is a tooltip on right" position="right">
                      <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                        Hover Me (Right)
                      </button>
                    </Tooltip>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Tooltip Variants</h3>
                <div className="flex flex-wrap gap-6">
                  <div>
                    <Tooltip 
                      content="Dark themed tooltip with arrow" 
                      theme="dark"
                      arrow={true}
                    >
                      <button className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white rounded">
                        Dark Theme
                      </button>
                    </Tooltip>
                  </div>
                  <div>
                    <Tooltip 
                      content="Light themed tooltip with arrow" 
                      theme="light"
                      arrow={true}
                    >
                      <button className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white rounded">
                        Light Theme
                      </button>
                    </Tooltip>
                  </div>
                  <div>
                    <Tooltip 
                      content="Tooltip without arrow" 
                      arrow={false}
                    >
                      <button className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white rounded">
                        No Arrow
                      </button>
                    </Tooltip>
                  </div>
                  <div>
                    <Tooltip 
                      content={
                        <div>
                          <div className="font-bold mb-1">Rich Content Tooltip</div>
                          <div>You can add multiple lines</div>
                          <div>And even <span className="text-yellow-400">styled</span> content</div>
                        </div>
                      }
                      maxWidth={300}
                    >
                      <button className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white rounded">
                        Rich Content
                      </button>
                    </Tooltip>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Interactive Tooltips</h3>
                <div className="flex flex-wrap gap-6">
                  <Tooltip 
                    content="Click-triggered tooltip" 
                    clickable={true}
                  >
                    <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                      Click Me
                    </button>
                  </Tooltip>
                </div>
              </div>
            </div>
          </section>

          {/* Notifications */}
          <section>
            <h2 className="text-xl font-medium mb-6 pb-2 border-b border-gray-200 dark:border-gray-800">
              Notifications
            </h2>
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Inline Notifications</h3>
                <div className="space-y-4">
                  <div className="flex gap-4 flex-wrap">
                    <SecondaryButton onClick={() => setNotificationVisible(!notificationVisible)}>
                      {notificationVisible ? 'Hide' : 'Show'} Notification
                    </SecondaryButton>
                  </div>
                  <div className="max-w-lg">
                    <Notification
                      title="Information Notice"
                      message="This is an inline notification that doesn't auto-dismiss. You can manually close it using the X button."
                      type="info"
                      show={notificationVisible}
                      onDismiss={() => setNotificationVisible(false)}
                      autoDismiss={false}
                      position="top-center"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <Notification
                        title="Success Message"
                        message="Your changes have been saved successfully."
                        type="success"
                        show={true}
                        autoDismiss={false}
                        className="static"
                      />
                    </div>
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <Notification
                        title="Warning Alert"
                        message="You're approaching your storage limit."
                        type="warning"
                        show={true}
                        autoDismiss={false}
                        className="static"
                      />
                    </div>
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <Notification
                        title="Error Alert"
                        message="An error occurred while saving your changes."
                        type="error"
                        show={true}
                        autoDismiss={false}
                        className="static"
                      />
                    </div>
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <Notification
                        title="With Action"
                        message="You have new comments on your tasks."
                        type="info"
                        show={true}
                        autoDismiss={false}
                        actionText="View Comments"
                        onAction={() => console.log('Action clicked')}
                        className="static"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Toast Notifications</h3>
                <div>
                  <p className="mb-4 text-gray-600 dark:text-gray-300">
                    Toast notifications appear temporarily and can be set to auto-dismiss after a certain period.
                  </p>
                  <ToastDemo />
                </div>              </div>
            </div>
          </section>

          {/* Component Directory */}
          <section>
            <h2 className="text-xl font-medium mb-6 pb-2 border-b border-gray-200 dark:border-gray-800">
              Component Directory
            </h2>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
                Explore more components available in the application.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link to="/searchbar-showcase" className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <h3 className="font-medium mb-2">Searchbar Components</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Highly customizable searchbar with various features like autocomplete, debounce, and more.
                  </p>
                </Link>
                <Link to="/button-showcase" className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <h3 className="font-medium mb-2">Button Components</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Various button styles, sizes and types for different actions.
                  </p>
                </Link>
                <Link to="/dropdown-showcase" className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <h3 className="font-medium mb-2">Dropdown Components</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Dropdown menus and selectors for navigation and data selection.
                  </p>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </ToastProvider>
    </div>
  );
}

export default UIComponentsShowcase;
