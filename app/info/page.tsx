import { getVersion, getAppInfo } from "../lib/version";
import { metaData } from "../config";

export const metadata = {
  title: "Info",
  description: "Application information and version details",
};

export default function InfoPage() {
  const version = getVersion();
  const appInfo = getAppInfo();
  const nodeEnv = process.env.NODE_ENV || "development";
  const buildTime = new Date().toISOString();

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-8 bg-white dark:bg-black">
          <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
            Application Info
          </h1>

          <div className="space-y-6">
            {/* Version */}
            <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">
                Version
              </h2>
              <p className="text-lg font-mono text-gray-900 dark:text-white">
                {version}
              </p>
            </div>

            {/* App Name */}
            <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">
                Application
              </h2>
              <p className="text-lg text-gray-900 dark:text-white">
                {metaData.title}
              </p>
            </div>

            {/* Description */}
            <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">
                Description
              </h2>
              <p className="text-base text-gray-700 dark:text-gray-300">
                {metaData.description}
              </p>
            </div>

            {/* Environment */}
            <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">
                Environment
              </h2>
              <p className="text-lg font-mono text-gray-900 dark:text-white capitalize">
                {nodeEnv}
              </p>
            </div>

            {/* License */}
            <div className="pb-4">
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">
                License
              </h2>
              <p className="text-lg text-gray-900 dark:text-white">
                {appInfo.license}
              </p>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Last updated: {buildTime}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
