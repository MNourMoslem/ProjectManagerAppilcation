import { useState } from 'react';
import { Counter, StatCounter } from '../components/counters';

function CountersShowcase() {
  const [count, setCount] = useState(1000);

  return (
    <div className="py-8">
      <div className="mb-12">
        <h1 className="text-3xl font-semibold mb-4">Counter Components</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
          A collection of components for displaying numerical data, statistics, and animated counters for an enhanced user experience.
        </p>
      </div>

      <div className="space-y-16">
        {/* Basic Counters */}
        <section>
          <h2 className="text-xl font-medium mb-6 pb-2 border-b border-gray-200 dark:border-gray-800">
            Basic Counters
          </h2>
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Simple Animated Counter
              </h3>
              <div className="space-y-4 max-w-md">
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                  <Counter 
                    end={count} 
                    className="text-2xl font-bold text-indigo-600 dark:text-indigo-400" 
                  />
                  <div className="flex space-x-2 mt-4">
                    <button 
                      onClick={() => setCount(prev => prev - 250)}
                      className="px-3 py-1 text-xs rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                      -250
                    </button>
                    <button
                      onClick={() => setCount(prev => prev + 250)}
                      className="px-3 py-1 text-xs rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                      +250
                    </button>
                    <button
                      onClick={() => setCount(1000)}
                      className="px-3 py-1 text-xs rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Counter with Formatting
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                  <h4 className="text-sm text-gray-500 dark:text-gray-400 mb-2">Currency</h4>
                  <Counter 
                    end={9875.50} 
                    prefix="$" 
                    decimals={2}
                    className="text-lg font-bold text-green-600 dark:text-green-400" 
                  />
                </div>
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                  <h4 className="text-sm text-gray-500 dark:text-gray-400 mb-2">Percentage</h4>
                  <Counter 
                    end={87.5} 
                    suffix="%" 
                    decimals={1}
                    className="text-lg font-bold text-blue-600 dark:text-blue-400" 
                  />
                </div>
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                  <h4 className="text-sm text-gray-500 dark:text-gray-400 mb-2">Large Number</h4>
                  <Counter 
                    end={1250000} 
                    separator="," 
                    className="text-lg font-bold text-purple-600 dark:text-purple-400" 
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stat Counters */}
        <section>
          <h2 className="text-xl font-medium mb-6 pb-2 border-b border-gray-200 dark:border-gray-800">
            Statistic Counters
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <StatCounter 
              end={1000}
              title="Total Projects" 
              value={24} 
              icon="📊"
              trend="neutral"
              trendLabel="vs last month"
              variant="primary"
            />
            <StatCounter 
              end={1000}
              title="Tasks Completed" 
              value={187} 
              icon="✓"
              trend="neutral"
              trendLabel="vs last month"
              variant="success"
            />
            <StatCounter 
              end={1000}
              title="Active Issues" 
              value={14} 
              icon="⚠️"
              trend="neutral"
              trendLabel="vs last month"
              variant="warning"
            />
            <StatCounter 
              end={1000}
              title="Team Members" 
              value={8} 
              icon="👥"
              trend="neutral"
              trendLabel="no change"
              variant="info"
            />
          </div>
        </section>

        {/* Usage Examples */}
        <section>
          <h2 className="text-xl font-medium mb-6 pb-2 border-b border-gray-200 dark:border-gray-800">
            Real-World Examples
          </h2>
          <div className="space-y-6">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-4">Project Dashboard Stats</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Total Tasks</div>
                  <Counter 
                    end={342} 
                    className="text-xl font-bold text-gray-800 dark:text-white" 
                  />
                  <div className="mt-2 text-xs text-green-600 dark:text-green-400">
                    ↑ 24 new this week
                  </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Completion Rate</div>
                  <Counter 
                    end={78.6} 
                    suffix="%" 
                    decimals={1}
                    className="text-xl font-bold text-gray-800 dark:text-white" 
                  />
                  <div className="mt-2 text-xs text-green-600 dark:text-green-400">
                    ↑ 5.2% from last month
                  </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Budget Spent</div>
                  <Counter 
                    end={12450} 
                    prefix="$" 
                    separator=","
                    className="text-xl font-bold text-gray-800 dark:text-white" 
                  />
                  <div className="mt-2 text-xs text-red-600 dark:text-red-400">
                    ↑ 8.3% over budget
                  </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Team Efficiency</div>
                  <Counter 
                    end={94.2} 
                    suffix="%" 
                    decimals={1}
                    className="text-xl font-bold text-gray-800 dark:text-white" 
                  />
                  <div className="mt-2 text-xs text-green-600 dark:text-green-400">
                    ↑ 2.1% improvement
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default CountersShowcase;
