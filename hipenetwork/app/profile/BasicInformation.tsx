import React from "react";
import { User } from "@/types/user";
import Image from "next/image";

interface BasicInformationProps {
  user: User;
}

export function BasicInformation({ user }: BasicInformationProps) {
  return (
    <div className="space-y-4">
      {user.profile_picture && (
        <div className="mb-4 flex">
          <Image
            src={user.profile_picture}
            alt="Profile Picture"
            width={128}
            height={128}
            className="rounded-full"
          />
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          First Name
        </label>
        <p className="mt-1 block w-full">{user.first_name}</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Last Name
        </label>
        <p className="mt-1 block w-full">{user.last_name}</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <p className="mt-1 block w-full">{user.email}</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Username
        </label>
        <p className="mt-1 block w-full">{user.username}</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <p className="mt-1 block w-full">{user.description}</p>
      </div>
    </div>
  );
}
