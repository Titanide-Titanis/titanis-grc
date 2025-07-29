-- Fix security warnings: Reduce OTP expiry time to 5 minutes (300 seconds)
UPDATE auth_settings 
SET otp_expiry_seconds = 300 
WHERE otp_expiry_seconds > 300;

-- Ensure leaked password protection is enabled for all organizations
UPDATE auth_settings 
SET enable_leaked_password_check = true 
WHERE enable_leaked_password_check = false;