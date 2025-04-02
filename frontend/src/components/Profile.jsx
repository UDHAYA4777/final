import React, { useState } from "react";
import Navbar from "./shared/Navbar";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Contact, Mail, Pen, FileText } from "lucide-react";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import AppliedJobTable from "./AppliedJobTable";
import UpdateProfileDialog from "./UpdateProfileDialog";
import { useSelector } from "react-redux";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";

const Profile = () => {
  useGetAppliedJobs();
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);

  return (
    <div>
      <Navbar />
      <div className="max-w-5xl mx-auto bg-white border border-gray-500 rounded-2xl my-5 p-8">
        {/* Profile Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={user?.profile?.profilePhoto || "/default-avatar.png"} // Fallback image
                alt="Avatar"
              />
            </Avatar>
            <div>
              <h1 className="font-medium text-xl">{user?.fullName || "NA"}</h1>
              <p>{user?.profile?.bio || "No bio available"}</p>
            </div>
          </div>
          <Button onClick={() => setOpen(true)} variant="outline">
            <Pen />
          </Button>
        </div>

        {/* Contact Details */}
        <div className="my-5">
          <div className="flex items-center gap-3 my-2">
            <Mail />
            <span>{user?.email || "NA"}</span>
          </div>
          <div className="flex items-center gap-3 my-2">
            <Contact />
            <span>{user?.phoneNumber || "NA"}</span>
          </div>
          {/* Display Application Number for all users */}
          <div className="flex items-center gap-3 my-2">
            <FileText className="w-6 h-6 text-black-500" />
            <span>{user?.applicationNumber || "NA"}</span>
          </div>
        </div>

        {/* Skills Section */}
        <div className="my-5">
          <h1>Skills:</h1>
          <div className="flex items-center gap-2">
            {user?.profile?.skills && user.profile.skills.length > 0 ? (
              user.profile.skills.map((item, index) => (
                <Badge key={index}>{item}</Badge>
              ))
            ) : (
              <span>NA</span>
            )}
          </div>

          {/* Resume Section */}
          <div className="grid w-full max-w-sm items-center gap-1.5 mt-3">
            <Label className="text-md font-bold">Resume</Label>
            {user?.profile?.resume ? (
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={user.profile.resume}
                className="text-blue-500 hover:underline cursor-pointer"
              >
                {user.profile.resumeOriginalName || "View Resume"}
              </a>
            ) : (
              <span>NA</span>
            )}
          </div>
        </div>
      </div>

      {/* Applied Jobs Table */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl my-5 p-8">
        <h1 className="font-bold text-lg my-5">Applied Jobs</h1>
        <AppliedJobTable />
      </div>

      {/* Profile Update Dialog */}
      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default Profile;
