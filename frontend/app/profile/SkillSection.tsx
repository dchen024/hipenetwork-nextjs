import React from "react";
import { Badge } from "@/components/ui/badge";

interface SkillSectionProps {
  skills: string[] | Record<string, string> | null | undefined;
}

export function SkillSection({ skills }: SkillSectionProps) {
  const skillsArray = React.useMemo(() => {
    if (Array.isArray(skills)) {
      return skills;
    } else if (skills && typeof skills === "object") {
      return Object.values(skills);
    }
    return [];
  }, [skills]);

  return (
    <div className="mt-8">
      <h2 className="mb-4 text-xl font-semibold">Skills</h2>
      {skillsArray.length === 0 ? (
        <p>No skills listed.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {skillsArray.map((skill, index) => (
            <Badge key={index} variant="outline" className="text-sm">
              {skill}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
