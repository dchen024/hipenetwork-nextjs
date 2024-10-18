import React, { useState } from "react";
import Image from "next/image";
import { User } from "@/types/user";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/utils/supabase/supabaseClient";

interface EducationHistoryItem {
  school_name: string;
  degree: string;
  start_date: string;
  end_date: string;
  description?: string;
  school_img: string;
}

interface EducationHistoryEditProps {
  user: User;
}

export default function EducationHistoryEdit({
  user,
}: EducationHistoryEditProps) {
  const [educationHistory, setEducationHistory] = useState<
    EducationHistoryItem[]
  >(() => {
    if (Array.isArray(user.education_history)) {
      return user.education_history;
    } else if (
      user.education_history &&
      typeof user.education_history === "object"
    ) {
      return Object.values(user.education_history);
    }
    return [];
  });

  const [newEntry, setNewEntry] = useState<EducationHistoryItem>({
    school_name: "",
    degree: "",
    start_date: "",
    end_date: "",
    description: "",
    school_img: "",
  });

  const [schoolImage, setSchoolImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (index: number) => {
    const updatedHistory = educationHistory.filter((_, i) => i !== index);
    setEducationHistory(updatedHistory);
    await handleEducationHistoryUpdate(updatedHistory);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setNewEntry((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSchoolImage(file);
  };

  const handleEducationHistoryUpdate = async (
    updatedHistory: EducationHistoryItem[],
  ) => {
    setLoading(true);
    const { error } = await supabase
      .from("users")
      .update({ education_history: updatedHistory })
      .eq("id", user.id);

    if (error) {
      setError(error.message);
      console.error("Error updating education history:", error);
    } else {
      console.log("Education history updated successfully");
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let schoolImageUrl = newEntry.school_img;

    if (schoolImage) {
      const { data, error } = await supabase.storage
        .from("education_history")
        .upload(
          `${user.id}/${newEntry.school_name}/${schoolImage.name}`,
          schoolImage,
        );

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      if (data) {
        schoolImageUrl = supabase.storage
          .from("education_history")
          .getPublicUrl(data.path).data.publicUrl;
      }
    }

    const updatedEntry = { ...newEntry, school_img: schoolImageUrl };
    const updatedHistory = [...educationHistory, updatedEntry];
    setEducationHistory(updatedHistory);
    await handleEducationHistoryUpdate(updatedHistory);

    setNewEntry({
      school_name: "",
      degree: "",
      start_date: "",
      end_date: "",
      description: "",
      school_img: "",
    });
    setSchoolImage(null);
    setLoading(false);
  };

  return (
    <div className="mt-8">
      <h2 className="mb-4 text-xl font-semibold">Education History</h2>

      {/* Existing Education History */}
      {educationHistory.length === 0 ? (
        <p>No education history available.</p>
      ) : (
        <ul className="space-y-6">
          {educationHistory.map((education, index) => (
            <li key={index} className="border-b pb-4 last:border-b-0">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center">
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
                <Button
                  onClick={() => handleDelete(index)}
                  variant="destructive"
                  size="sm"
                  className="rounded-md bg-red-500 text-white"
                >
                  Delete
                </Button>
              </div>
              <p className="mb-2 text-sm text-gray-600">
                {education.start_date} - {education.end_date || "Present"}
              </p>
              <p className="text-sm">{education.description}</p>
            </li>
          ))}
        </ul>
      )}

      {/* Add New Education History Entry Form */}
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <h3 className="text-lg font-semibold">
          Add New Education History Entry
        </h3>
        <Input
          name="school_name"
          value={newEntry.school_name}
          onChange={handleInputChange}
          placeholder="School Name"
          required
        />
        <Input
          name="degree"
          value={newEntry.degree}
          onChange={handleInputChange}
          placeholder="Degree"
          required
        />
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Upload School Logo
          </label>
          <Input
            type="file"
            name="school_image"
            onChange={handleFileChange}
            className="mt-1 block w-full"
          />
        </div>
        <Input
          name="start_date"
          value={newEntry.start_date}
          onChange={handleInputChange}
          placeholder="Start Date"
          required
        />
        <Input
          name="end_date"
          value={newEntry.end_date}
          onChange={handleInputChange}
          placeholder="End Date (leave blank if current)"
        />
        <textarea
          name="description"
          value={newEntry.description || ""} // Add fallback for undefined
          onChange={handleInputChange}
          placeholder="Education Description (Optional)"
          className="w-full rounded-md border p-2"
          rows={4}
          // required attribute removed
        />
        <Button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white"
        >
          {loading ? "Adding..." : "Add Education History Entry"}
        </Button>
      </form>
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
}
