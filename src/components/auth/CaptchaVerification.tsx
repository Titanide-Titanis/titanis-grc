// TITANIS™ CAPTCHA Verification Component
import { useState, useEffect } from 'react';
import { RefreshCw, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CaptchaVerificationProps {
  onVerify: (isVerified: boolean) => void;
  className?: string;
}

export function CaptchaVerification({ onVerify, className }: CaptchaVerificationProps) {
  const [captchaValue, setCaptchaValue] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const generateCaptcha = () => {
    // Generate a simple math-based CAPTCHA
    const operations = ['+', '-', '*'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let num1, num2, result;
    
    switch (operation) {
      case '+':
        num1 = Math.floor(Math.random() * 20) + 1;
        num2 = Math.floor(Math.random() * 20) + 1;
        result = num1 + num2;
        break;
      case '-':
        num1 = Math.floor(Math.random() * 30) + 10;
        num2 = Math.floor(Math.random() * 10) + 1;
        result = num1 - num2;
        break;
      case '*':
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        result = num1 * num2;
        break;
      default:
        num1 = 1;
        num2 = 1;
        result = 2;
    }

    return {
      question: `${num1} ${operation} ${num2} = ?`,
      answer: result.toString(),
    };
  };

  const [captcha, setCaptcha] = useState(generateCaptcha());

  useEffect(() => {
    // Reset verification when captcha changes
    setIsVerified(false);
    setUserInput('');
    onVerify(false);
  }, [captcha, onVerify]);

  const handleVerify = () => {
    const isCorrect = userInput.trim() === captcha.answer;
    setIsVerified(isCorrect);
    
    if (isCorrect) {
      onVerify(true);
    } else {
      setAttempts(prev => prev + 1);
      if (attempts >= 2) {
        // Generate new captcha after 3 failed attempts
        const newCaptcha = generateCaptcha();
        setCaptcha(newCaptcha);
        setAttempts(0);
      }
      onVerify(false);
    }
  };

  const handleRefresh = () => {
    const newCaptcha = generateCaptcha();
    setCaptcha(newCaptcha);
    setAttempts(0);
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-sm">
          <Shield className="h-4 w-4" />
          <span>Security Verification</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* CAPTCHA Display */}
        <div className="flex items-center space-x-3">
          <div className="flex-1 p-3 bg-gradient-to-r from-primary/10 to-primary/5 border-2 border-dashed border-primary/20 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-mono text-lg font-bold text-primary">
                {captcha.question}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                className="h-8 w-8 p-0"
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Input and Verification */}
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Enter answer"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
            className={isVerified ? "border-success" : ""}
            disabled={isVerified}
          />
          <Button
            type="button"
            onClick={handleVerify}
            disabled={!userInput.trim() || isVerified}
            className={isVerified ? "bg-success hover:bg-success" : ""}
          >
            {isVerified ? 'Verified' : 'Verify'}
          </Button>
        </div>

        {/* Status Messages */}
        {attempts > 0 && !isVerified && (
          <p className="text-sm text-danger">
            Incorrect answer. Please try again. ({3 - attempts} attempts remaining)
          </p>
        )}
        
        {isVerified && (
          <p className="text-sm text-success flex items-center space-x-1">
            <Shield className="h-3 w-3" />
            <span>Verification successful</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}