import { features } from "app/constants";
import React from "react";
import { ITimeLine, timeLineData } from "./timeline-data";
import CommingSoon from "app/components/comming-soon";
import Link from "next/link";

const TimeLine = (timeLineItem: ITimeLine, index) => {
  return (
    <li className="mb-10 ms-4">
      <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
      <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
        {timeLineItem.date}
      </time>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {timeLineItem.title}
      </h3>
      <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
        {timeLineItem.description}
      </p>
      <Link href={timeLineItem.link}>Learn More</Link>
      <button className="ml-4">Show Images</button>
    </li>
  );
};

function Timeline() {
  if (!features.TIMELINE || timeLineData.length === 0) {
    return <CommingSoon />;
  }

  return (
    <section>
      <h1 className="mb-8 text-2xl font-medium tracking-tight"> Timeline</h1>
      <div className="flex flex-col items-center justify-center">
        <ol className="relative border-s border-gray-200 dark:border-gray-700">
          {timeLineData.map((timeLineItem, index) =>
            TimeLine(timeLineItem, index)
          )}
        </ol>
      </div>
    </section>
  );
}
export default Timeline;
