import React from "react";
import Image from "next/image";

interface EducationHistoryItem {
  school_name: string;
  degree: string;
  start_date: string;
  end_date: string;
  description?: string;
  school_img: string;
}

interface EducationHistoryProps {
  educationHistory:
    | EducationHistoryItem[]
    | Record<string, EducationHistoryItem>
    | null;
}

export function EducationHistory({ educationHistory }: EducationHistoryProps) {
  const educationHistoryArray = React.useMemo(() => {
    if (Array.isArray(educationHistory)) {
      return educationHistory;
    } else if (educationHistory && typeof educationHistory === "object") {
      return Object.values(educationHistory);
    }
    return [];
  }, [educationHistory]);

  return (
    <div className="mt-8">
      <h2 className="mb-4 text-xl font-semibold">Education History</h2>
      {educationHistoryArray.length === 0 ? (
        <p>No education history available.</p>
      ) : (
        <ul className="space-y-6">
          {educationHistoryArray.map((education, index) => (
            <li key={index} className="border-b pb-4 last:border-b-0">
              <div className="mb-2 flex items-center">
                {education.school_img && (
                  <Image
                    src={education.school_img}
                    alt={`${education.school_name} logo`}
                    width={40}
                    height={40}
                    className="mr-4 rounded-full"
                  />
                )}
                <div>
                  <h3 className="font-semibold">{education.school_name}</h3>
                  <p className="text-sm text-gray-600">{education.degree}</p>
                </div>
              </div>
              <p className="mb-2 text-sm text-gray-600">
                {education.start_date} - {education.end_date || "Present"}
              </p>
              <p className="text-sm">{education.description || ""}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
