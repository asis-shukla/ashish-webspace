import { features } from "app/constants";
import React from "react";
import { ITimeLine, timeLineData } from "./timeline-data";
import CommingSoon from "app/components/comming-soon";

const TimeLine = (timeLineItem: ITimeLine, index) => {
  return (
    <div key={index} className="flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">{timeLineItem.title}</h1>
        <p className="text-gray-500">{timeLineItem.description}</p>
      </div>
    </div>
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
        {timeLineData.map((timeLineItem, index) =>
          TimeLine(timeLineItem, index)
        )}
      </div>
    </section>
  );
}
export default Timeline;
