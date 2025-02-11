"use client";
import React, { useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

const FormSchema = z.object({
  email: z.string().email("❌ Invalid email address"),
  password: z
    .string()
    .min(6, "⚠ Password must be at least 6 characters")
    .max(20, "⚠ Password must not exceed 20 characters"),
});

type FormValue = z.infer<typeof FormSchema>;

const LoginForm = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValue>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = async (data: FormValue) => {
    if (loading) return; // Prevent double clicks
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        console.log("✅ Login successful, redirecting...");
        router.push("/Dashboard");
      } else {
        const response = await res.json();
        setError(response.error || "❌ Invalid Credentials");
      }
    } catch (err) {
      console.error("❌ API Error:", err);
      setError("⚠ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-full">
      <Card className="w-[90%] md:w-1/2">
        <CardHeader>
          <CardTitle className="text-center text-4xl font-semibold py-4">
            Admin Panel
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <CardContent>
            <div className="space-y-3">
              {/* ✅ Email Input */}
              <div className="space-y-1">
                <Label htmlFor="email" className="text-lg">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  required
                  {...register("email")}
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="text-red-500 text-sm">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* ✅ Password Input */}
              <div className="space-y-1">
                <Label htmlFor="password" className="text-lg">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  {...register("password")}
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby={errors.password ? "password-error" : undefined}
                />
                {errors.password && (
                  <p id="password-error" className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* ✅ API Error Message */}
              {error && (
                <p className="text-red-600 font-medium text-sm text-center mt-2">
                  {error}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex justify-center">
            <Button
              type="submit"
              className="w-full"
              disabled={loading || isSubmitting}
            >
              {loading || isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginForm;
