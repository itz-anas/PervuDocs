import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Lock } from 'lucide-react'; 

interface AccessCodeFormProps {
  onAccessGranted: (code: string) => void;
}

export const AccessCodeForm = ({ onAccessGranted }: AccessCodeFormProps) => {
  const [code, setCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!code.trim()) {
      setError('Please enter your access code');
      return;
    }

    if (code.length < 4) {
      setError('Access code must be at least 4 characters');
      return;
    }

    onAccessGranted(code);
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-24 h-24 rounded-full overflow-hidden">
            <img src="/logo_no_bg.png" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <CardTitle className="text-2xl font-heading">Digital Library</CardTitle>
            <CardDescription className="text-muted-foreground">
              {isCreating ? 'Create your personal access code' : 'Enter your access code to continue'}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Access Code
              </Label>
              <Input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={isCreating ? "Create your unique code (mix of letters & numbers)" : "Enter your access code"}
                className="text-center text-lg tracking-wider"
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>

            <Button type="submit" className="w-full">
              {isCreating ? 'Create & Access Library' : 'Access Library'}
            </Button>

            {!isCreating && (
              <div className="text-center">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleCreateNew}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Create new access code
                </Button>
              </div>
            )}
          </form>

          <div className="mt-6 text-xs text-muted-foreground space-y-1">
            <p>• Your access code can contain letters and numbers</p>
            <p>• Keep it secure - it's your key to your documents</p>
            <p>• Use the same code across all your devices</p>
            <p>• Temporary file storage</p>
            <p>• For managing & arranging notes</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
