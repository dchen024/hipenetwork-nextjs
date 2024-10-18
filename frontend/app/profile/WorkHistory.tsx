import React from "react";
import Image from "next/image";

interface WorkHistoryItem {
  title: string;
  company: string;
  company_img: string;
  description: string;
  start_date: string;
  end_date: string;
}

interface WorkHistoryProps {
  workHistory: WorkHistoryItem[] | Record<string, WorkHistoryItem> | null;
}

export function WorkHistory({ workHistory }: WorkHistoryProps) {
  const workHistoryArray = React.useMemo(() => {
    if (Array.isArray(workHistory)) {
      return workHistory;
    } else if (workHistory && typeof workHistory === "object") {
      return Object.values(workHistory);
    }
    return [];
  }, [workHistory]);

  return (
    <div className="mt-8">
      <h2 className="mb-4 text-xl font-semibold">Work History</h2>
      {workHistoryArray.length === 0 ? (
        <p>No work history available.</p>
      ) : (
        <ul className="space-y-6">
          {workHistoryArray.map((job, index) => (
            <li key={index} className="border-b pb-4 last:border-b-0">
              <div className="mb-2 flex items-center">
                {job.company_img && (
                  <Image
                    src={job.company_img}
                    alt={`${job.company} logo`}
                    width={40}
                    height={40}
                    className="mr-4 rounded-full"
                  />
                )}
                <div>
                  <h3 className="font-semibold">{job.title}</h3>
                  <p className="text-sm text-gray-600">{job.company}</p>
                </div>
              </div>
              <p className="mb-2 text-sm text-gray-600">
                {job.start_date} - {job.end_date || "Present"}
              </p>
              <p className="text-sm">{job.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
