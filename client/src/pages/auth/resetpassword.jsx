import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useDispatch } from "react-redux";
import { updatePassword } from "@/store/auth-slice";
import { Link } from "react-router-dom"; 

const ResetPassword = () => {
  const [otp, setOtp] = useState(""); // OTP state
  const [newPassword, setNewPassword] = useState(""); // New password state
  const [confirmPassword, setConfirmPassword] = useState(""); // Confirm password state
  const [isPasswordMismatch, setIsPasswordMismatch] = useState(false); // Password mismatch state
  const [loading, setLoading] = useState(false); // Loading state
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Get email from the passed state
  const location = useLocation();
  const { email } = location.state || {}; // Default to empty if state is not available

  const handlePasswordSubmit = (event) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setIsPasswordMismatch(true);
      return;
    }
    // console.log(email, otp, newPassword, confirmPassword);
    setLoading(true);
    dispatch(updatePassword({ email, otp, newPassword, confirmPassword }))
      .then((data) => {
        if (data?.payload?.success) {
          toast({ title: data?.payload?.message });
          navigate("/auth/login"); // Redirect to login page after success
        } else {
          toast({ title: data?.payload?.message, variant: "destructive" });
        }
      })
      .catch((error) => {
        toast({ title: "An error occurred", variant: "destructive" });
      })
      .finally(() => setLoading(false)); // Always stop loading after API call
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Reset Password
        </h1>
        <p className="mt-2">
          <Link
            className="font-medium text-primary hover:underline"
            to="/auth/forgot-password"
          >
            Back to Forgot Password
          </Link>
        </p>
      </div>
      <form onSubmit={handlePasswordSubmit} className="space-y-4">
        <div>
          <label className="block">Email</label>
          <input
            type="email"
            value={email || ""}
            className="w-full border p-2"
            disabled
          />
        </div>
        <div>
          <label className="block">OTP</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="w-full border p-2"
          />
        </div>
        <div>
          <label className="block">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            className="w-full border p-2"
          />
        </div>
        <div>
          <label className="block">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            className="w-full border p-2"
          />
          {isPasswordMismatch && (
            <p className="text-red-500">Passwords do not match</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-white p-2"
          disabled={loading}
        >
          Save New Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
