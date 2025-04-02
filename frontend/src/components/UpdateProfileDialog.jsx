import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { USER_API_END_POINT } from "../../utils/constant.js";
import { setUser } from "../../redux/authSlice.js";
import { toast } from "sonner";
import axios from "axios";

const UpdateProfileDialog = ({ open, setOpen }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(false);

  // Load applicationNumber from localStorage if available
  useEffect(() => {
    setInput((prev) => ({
      ...prev,
      applicationNumber:
        user?.applicationNumber ||
        localStorage.getItem("applicationNumber") ||
        "",
    }));
  }, [user]);

  const [input, setInput] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    bio: user?.bio || "",
    skills: user?.profile?.skills?.join(", ") || "",
    file: user?.profile?.resume || "",
    applicationNumber:
      user?.applicationNumber ||
      localStorage.getItem("applicationNumber") ||
      "",
  });

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!input.fullName || !input.email || !input.phoneNumber) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Validate file type
    if (input.file) {
      const allowedExtensions = ["pdf", "docx", "png", "jpg"];
      const fileExtension = input.file.name.split(".").pop().toLowerCase();
      if (!allowedExtensions.includes(fileExtension)) {
        toast.error(
          "Invalid file type. Please upload a PDF, DOCX, PNG, or JPG file."
        );
        return;
      }
    }

    const formData = new FormData();
    formData.append("fullName", input.fullName);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("bio", input.bio);
    formData.append("applicationNumber", input.applicationNumber);
    formData.append("skills", input.skills);
    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        localStorage.setItem(
          "applicationNumber",
          res.data.user.applicationNumber
        ); // Save applicationNumber
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }

    setOpen(false);
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-[425px]"
        onInteractOutside={() => setOpen(false)}
      >
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={submitHandler}>
          <div className="grid gap-4 py-4">
            {/* Name Input */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="fullName"
                value={input.fullName}
                onChange={changeEventHandler}
                className="col-span-3"
                required
              />
            </div>

            {/* Email Input */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                className="col-span-3"
                value={input.email}
                onChange={changeEventHandler}
                required
                type="email"
              />
            </div>

            {/* Phone Number Input */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="number" className="text-right">
                Number
              </Label>
              <Input
                id="number"
                name="phoneNumber"
                className="col-span-3"
                value={input.phoneNumber}
                onChange={changeEventHandler}
                required
                type="tel"
              />
            </div>

            {/* Bio Input */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bio" className="text-right">
                Bio
              </Label>
              <Input
                id="bio"
                name="bio"
                className="col-span-3"
                value={input.bio}
                onChange={changeEventHandler}
              />
            </div>

            {/* Application Number */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="applicationNumber" className="text-right">
                Application No.
              </Label>
              <Input
                id="applicationNumber"
                name="applicationNumber"
                className="col-span-3"
                value={input.applicationNumber}
                onChange={changeEventHandler}
              />
            </div>

            {/* Skills Input */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="skills" className="text-right">
                Skills
              </Label>
              <Input
                id="skills"
                name="skills"
                className="col-span-3"
                value={input.skills}
                onChange={changeEventHandler}
                placeholder="Comma separated skills"
              />
            </div>

            {/* File Upload */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="file" className="text-right">
                Resume
              </Label>
              <Input
                id="file"
                name="file"
                type="file"
                className="col-span-3"
                onChange={fileChangeHandler}
              />
            </div>
          </div>

          <DialogFooter>
            {loading ? (
              <Button className="w-full my-4" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please Wait
              </Button>
            ) : (
              <Button type="submit">Update</Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileDialog;
