import React, { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { Application_API_END_POINT } from "../../../utils/constant.js";

const shortListingStatus = ["Accepted", "Rejected"];

function ApplicantsTable() {
  const { applicants } = useSelector((store) => store.application);
  const [filterText, setFilterText] = useState("");

  const statusHandler = async (status, id) => {
    try {
      axios.defaults.withCredentials = true;
      const res = await axios.post(
        `${Application_API_END_POINT}/status/${id}/update`,
        { status }
      );
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const filteredApplicants = applicants?.applications?.filter((item) =>
    String(item?.applicant?.applicationNumber || "").includes(filterText)
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Filter by Application Number..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        className="p-2 border rounded-md w-1/4 mb-4"
      />
      <Table className="text-sm">
        <TableCaption>A list of your recent applied users</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="p-2">Full Name</TableHead>
            <TableHead className="p-2">Email</TableHead>
            <TableHead className="p-2">Application Number</TableHead>
            <TableHead className="p-2">Contact</TableHead>
            <TableHead className="p-2">Skills</TableHead>
            <TableHead className="p-2">Resume</TableHead>
            <TableHead className="p-2">Date</TableHead>
            <TableHead className="p-2 text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredApplicants?.length > 0 ? (
            filteredApplicants.map((item) => (
              <TableRow key={item._id}>
                <TableCell className="p-2">
                  {item?.applicant?.fullName || "NA"}
                </TableCell>
                <TableCell className="p-2">
                  {item?.applicant?.email || "NA"}
                </TableCell>
                <TableCell className="p-2">
                  {item?.applicant?.applicationNumber || "NA"}
                </TableCell>
                <TableCell className="p-2">
                  {item?.applicant?.phoneNumber || "NA"}
                </TableCell>
                <TableCell className="p-2">
                  {item?.applicant?.profile?.skills?.length > 0
                    ? item?.applicant?.profile?.skills.join(", ")
                    : "NA"}
                </TableCell>
                <TableCell className="p-2 text-blue-600">
                  {item?.applicant?.profile?.resume ? (
                    <a
                      className="text-blue-600 cursor-pointer"
                      href={item?.applicant?.profile?.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item?.applicant?.profile?.resumeOriginalName}
                    </a>
                  ) : (
                    "NA"
                  )}
                </TableCell>
                <TableCell className="p-2">
                  {item?.applicant?.createdAt.split("T")[0]}
                </TableCell>
                <TableCell className="p-2 text-right">
                  <Popover>
                    <PopoverTrigger>
                      <MoreHorizontal />
                    </PopoverTrigger>
                    <PopoverContent className="w-32">
                      {shortListingStatus.map((status, index) => (
                        <div
                          key={index}
                          onClick={() => statusHandler(status, item._id)}
                          className="flex items-center my-1 cursor-pointer p-1 rounded hover:bg-gray-200 transition duration-200 ease-in-out "
                        >
                          <span>{status}</span>
                        </div>
                      ))}
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan="7" className="text-center p-2">
                No applicants found for the given contact number.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default ApplicantsTable;
