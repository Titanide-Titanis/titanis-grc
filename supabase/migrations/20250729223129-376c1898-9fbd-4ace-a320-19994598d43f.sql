-- Fix security warnings from the linter

-- Fix Warning 1: OTP expiry exceeds recommended threshold
-- Update auth_settings table to reduce OTP expiry from 300 seconds (5 minutes) to 120 seconds (2 minutes)
UPDATE auth_settings 
SET otp_expiry_seconds = 120 
WHERE otp_expiry_seconds = 300;

-- Fix Warning 2: Enable leaked password protection
-- Update auth_settings table to enable leaked password protection
UPDATE auth_settings 
SET enable_leaked_password_check = true 
WHERE enable_leaked_password_check = false;