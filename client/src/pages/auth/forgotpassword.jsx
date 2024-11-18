import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useDispatch } from "react-redux";
import { forgotPassword } from "@/store/auth-slice";
import { Link } from "react-router-dom"; 

const ForgotPassword = () => {
  const [email, setEmail] = useState(""); // Email state
  const [loading, setLoading] = useState(false); // Loading state
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleEmailSubmit = (event) => {
    event.preventDefault();
    setLoading(true);

    dispatch(forgotPassword({ email }))
      .then((data) => {
        if (data?.payload?.success) {
          toast({ title: data?.payload?.message });
          // Redirect to ResetPassword component after success
          navigate("/auth/reset-password", { state: { email } }); // Pass email to the next component
        } else {
          toast({ title: data?.payload?.message, variant: "destructive" });
        }
      })
      .catch((error) => {
        toast({ title: "An error occurred", variant: "destructive" });
      })
      .finally(() => setLoading(false)); // Stop loading after API call
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Forgot Password
        </h1>
        <p className="mt-2">
          <Link
            className="font-medium text-primary hover:underline"
            to="/auth/login"
          >
            Back to Login
          </Link>
        </p>
      </div>
      <form onSubmit={handleEmailSubmit} className="space-y-4">
        <div>
          <label className="block">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full border p-2"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-white p-2"
          disabled={loading}
        >
          Verify Email
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
