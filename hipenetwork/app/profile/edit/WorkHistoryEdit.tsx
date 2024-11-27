import React, { useState } from "react";
import Image from "next/image";
import { User } from "@/types/user";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/utils/supabase/supabaseClient";

interface WorkHistoryItem {
  title: string;
  company: string;
  company_img: string;
  description: string;
  start_date: string;
  end_date: string;
}

interface WorkHistoryEditProps {
  user: User;
}

export default function WorkHistoryEdit({ user }: WorkHistoryEditProps) {
  const [workHistory, setWorkHistory] = useState<WorkHistoryItem[]>(() => {
    if (Array.isArray(user.work_history)) {
      return user.work_history;
    } else if (user.work_history && typeof user.work_history === "object") {
      return Object.values(user.work_history);
    }
    return [];
  });
  const [newEntry, setNewEntry] = useState<WorkHistoryItem>({
    title: "",
    company: "",
    company_img: "",
    description: "",
    start_date: "",
    end_date: "",
  });
  const [companyImage, setCompanyImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (index: number) => {
    const updatedHistory = workHistory.filter((_, i) => i !== index);
    setWorkHistory(updatedHistory);
    await handleWorkHistoryUpdate(updatedHistory);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setNewEntry((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setCompanyImage(file);
  };

  const handleWorkHistoryUpdate = async (updatedHistory: WorkHistoryItem[]) => {
    setLoading(true);
    const { error } = await supabase
      .from("users")
      .update({ work_history: updatedHistory })
      .eq("id", user.id);

    if (error) {
      setError(error.message);
      console.error("Error updating work history:", error);
    } else {
      console.log("Work history updated successfully");
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let companyImageUrl = newEntry.company_img;

    if (companyImage) {
      const { data, error } = await supabase.storage
        .from("work_history")
        .upload(`${user.id}/${companyImage.name}`, companyImage);

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      if (data) {
        companyImageUrl = supabase.storage
          .from("work_history")
          .getPublicUrl(data.path).data.publicUrl;
      }
    }

    const updatedEntry = { ...newEntry, company_img: companyImageUrl };
    const updatedHistory = [...workHistory, updatedEntry];
    setWorkHistory(updatedHistory);
    await handleWorkHistoryUpdate(updatedHistory);

    setNewEntry({
      title: "",
      company: "",
      company_img: "",
      description: "",
      start_date: "",
      end_date: "",
    });
    setCompanyImage(null);
    setLoading(false);
  };

  return (
    <div className="mt-8">
      <h2 className="mb-4 text-xl font-semibold">Work History</h2>

      {/* Existing Work History */}
      {workHistory.length === 0 ? (
        <p>No work history available.</p>
      ) : (
        <ul className="space-y-6">
          {workHistory.map((job, index) => (
            <li key={index} className="pb-4 border-b last:border-b-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
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
                <Button
                  onClick={() => handleDelete(index)}
                  variant="destructive"
                  size="sm"
                  className="text-white bg-red-500 rounded-md"
                >
                  Delete
                </Button>
              </div>
              <p className="mb-2 text-sm text-gray-600">
                {job.start_date} - {job.end_date || "Present"}
              </p>
              <p className="text-sm">{job.description}</p>
            </li>
          ))}
        </ul>
      )}

      {/* Add New Work History Entry Form */}
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <h3 className="text-lg font-semibold">Add New Work History Entry</h3>
        <Input
          name="title"
          value={newEntry.title}
          onChange={handleInputChange}
          placeholder="Job Title"
          required
        />
        <Input
          name="company"
          value={newEntry.company}
          onChange={handleInputChange}
          placeholder="Company"
          required
        />
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Upload Company Logo
          </label>
          <Input
            type="file"
            name="company_image"
            onChange={handleFileChange}
            className="block w-full mt-1"
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
          value={newEntry.description}
          onChange={handleInputChange}
          placeholder="Job Description"
          className="w-full p-2 border rounded-md"
          rows={4}
          required
        />
        <Button type="submit" disabled={loading} className="text-white">
          {loading ? "Adding..." : "Add Work History Entry"}
        </Button>
      </form>
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
}
