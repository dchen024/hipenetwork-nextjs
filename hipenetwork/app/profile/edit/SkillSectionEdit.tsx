import React, { useState, useEffect } from "react";
import { User } from "@/types/user";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/utils/supabase/supabaseClient";

interface SkillSectionEditProps {
  user: User;
}

export default function SkillSectionEdit({ user }: SkillSectionEditProps) {
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Ensure skills is always an array
    const initialSkills = Array.isArray(user.skills)
      ? user.skills
      : typeof user.skills === "object" && user.skills !== null
        ? Object.values(user.skills).map((skill: string) => skill.toString())
        : [];
    setSkills(initialSkills);
  }, [user.skills]);

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      const updatedSkills = [...skills, newSkill.trim()];
      setSkills(updatedSkills);
      setNewSkill("");
      await updateSkills(updatedSkills);
    }
  };

  const handleRemoveSkill = async (skillToRemove: string) => {
    const updatedSkills = skills.filter((skill) => skill !== skillToRemove);
    setSkills(updatedSkills);
    await updateSkills(updatedSkills);
  };

  const updateSkills = async (updatedSkills: string[]) => {
    setLoading(true);
    const { error } = await supabase
      .from("users")
      .update({ skills: updatedSkills })
      .eq("id", user.id);

    if (error) {
      setError(error.message);
      console.error("Error updating skills:", error);
    } else {
      console.log("Skills updated successfully");
    }
    setLoading(false);
  };

  return (
    <div className="mt-8">
      <h2 className="mb-4 text-xl font-semibold">Skills</h2>
      <div className="mb-4 flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <Badge key={index} variant="outline" className="text-sm">
            {skill}
            <button
              onClick={() => handleRemoveSkill(skill)}
              className="ml-2 text-xs font-bold"
            >
              ×
            </button>
          </Badge>
        ))}
      </div>
      <form onSubmit={handleAddSkill} className="mt-4 space-y-4">
        <Input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder="Add a new skill"
          className="flex-grow"
        />
        <Button type="submit" disabled={loading} className="text-white">
          Add Skill
        </Button>
      </form>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
