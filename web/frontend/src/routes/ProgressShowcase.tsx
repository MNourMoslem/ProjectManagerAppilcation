import { useState } from 'react';
import { ProgressBar, CircularProgress, LoadingIndicator } from '../components/progress';
import { Counter, StatCounter } from '../components/counters';

function ProgressShowcase() {
  const [progressValue, setProgressValue] = useState(65);

  // Update progress value for demo
  const updateProgress = (value: number) => {
    setProgressValue(value < 0 ? 0 : value > 100 ? 100 : value);
  };

  return (
    <div className="py-8">
      <div className="mb-12">
        <h1 className="text-3xl font-semibold mb-4">Progress & Counter Components</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
          A collection of components for displaying progress, loading states, and numerical data in a visually appealing way.
        </p>
      </div>

      <div className="space-y-16">
        {/* Progress Bars */}
        <section>
          <h2 className="text-xl font-medium mb-6 pb-2 border-b border-gray-200 dark:border-gray-800">
            Progress Bars
          </h2>
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Basic Progress Bars</h3>
              <div className="space-y-4 max-w-md">
                <ProgressBar value={progressValue} />
                <div className="flex space-x-2">
                  <button 
                    onClick={() => updateProgress(progressValue - 10)}
                    className="px-3 py-1 text-xs rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    -10%
                  </button>
                  <button
                    onClick={() => updateProgress(progressValue + 10)}
                    className="px-3 py-1 text-xs rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    +10%
                  </button>
                  <button
                    onClick={() => setProgressValue(65)}
                    className="px-3 py-1 text-xs rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Color Variants</h3>
              <div className="space-y-3 max-w-md">
                <ProgressBar value={progressValue} variant="primary" />
                <ProgressBar value={progressValue} variant="success" />
                <ProgressBar value={progressValue} variant="warning" />
                <ProgressBar value={progressValue} variant="danger" />
                <ProgressBar value={progressValue} variant="info" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Sizes</h3>
              <div className="space-y-4 max-w-md">
                <ProgressBar value={progressValue} size="xs" />
                <ProgressBar value={progressValue} size="sm" />
                <ProgressBar value={progressValue} size="md" />
                <ProgressBar value={progressValue} size="lg" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Special Styles</h3>
              <div className="space-y-4 max-w-md">
                <ProgressBar value={progressValue} showPercentage />
                <ProgressBar value={progressValue} striped />
                <ProgressBar value={progressValue} striped animated />
              </div>
            </div>
          </div>
        </section>

        {/* Circular Progress */}
        <section>
          <h2 className="text-xl font-medium mb-6 pb-2 border-b border-gray-200 dark:border-gray-800">
            Circular Progress
          </h2>
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Basic Circular Progress</h3>
              <div className="flex flex-wrap gap-6">
                <CircularProgress value={progressValue} showPercentage />
                <CircularProgress 
                  value={progressValue} 
                  size={60} 
                  thickness={6}
                >
                  <span className="text-sm font-medium">{progressValue}%</span>
                </CircularProgress>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Color Variants</h3>
              <div className="flex flex-wrap gap-6">
                <CircularProgress value={progressValue} variant="primary" showPercentage />
                <CircularProgress value={progressValue} variant="success" showPercentage />
                <CircularProgress value={progressValue} variant="warning" showPercentage />
                <CircularProgress value={progressValue} variant="danger" showPercentage />
                <CircularProgress value={progressValue} variant="info" showPercentage />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Sizes</h3>
              <div className="flex flex-wrap gap-6 items-center">
                <CircularProgress value={progressValue} size={36} thickness={3} />
                <CircularProgress value={progressValue} size={48} thickness={4} />
                <CircularProgress value={progressValue} size={64} thickness={5} />
                <CircularProgress value={progressValue} size={80} thickness={6} />
              </div>
            </div>
          </div>
        </section>

        {/* Loading Indicators */}
        <section>
          <h2 className="text-xl font-medium mb-6 pb-2 border-b border-gray-200 dark:border-gray-800">
            Loading Indicators
          </h2>
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Types</h3>
              <div className="flex flex-wrap gap-6 items-center">
                <LoadingIndicator type="spinner" />
                <LoadingIndicator type="dots" />
                <LoadingIndicator type="pulse" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Colors</h3>
              <div className="flex flex-wrap gap-6 items-center">
                <LoadingIndicator variant="primary" />
                <LoadingIndicator variant="success" />
                <LoadingIndicator variant="warning" />
                <LoadingIndicator variant="danger" />
                <LoadingIndicator variant="info" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Sizes</h3>
              <div className="flex flex-wrap gap-6 items-center">
                <LoadingIndicator size="xs" />
                <LoadingIndicator size="sm" />
                <LoadingIndicator size="md" />
                <LoadingIndicator size="lg" />
              </div>
            </div>
          </div>
        </section>

        {/* Counters */}
        <section>
          <h2 className="text-xl font-medium mb-6 pb-2 border-b border-gray-200 dark:border-gray-800">
            Counters
          </h2>
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Basic Counters</h3>
              <div className="flex flex-wrap gap-6 items-center">
                <div>
                  <Counter end={1250} className="text-2xl font-bold" />
                </div>
                <div>
                  <Counter start={0} end={95} suffix="%" className="text-2xl font-bold" />
                </div>
                <div>
                  <Counter prefix="$" end={5432} decimals={2} className="text-2xl font-bold" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Stat Counters</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCounter
                  title="Total Users"
                  end={1250}
                  icon={
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 00-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 010 7.75"></path>
                    </svg>
                  }
                  trend="up"
                  trendValue="12%"
                  variant="primary"
                />
                <StatCounter
                  title="Revenue"
                  prefix="$"
                  end={42589}
                  icon={
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"></path>
                    </svg>
                  }
                  trend="up"
                  trendValue="8.3%"
                  variant="success"
                />
                <StatCounter
                  title="Active Projects"
                  end={24}
                  icon={
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
                    </svg>
                  }
                  trend="down"
                  trendValue="3%"
                  variant="warning"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ProgressShowcase;
