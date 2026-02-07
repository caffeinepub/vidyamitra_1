import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCareerFlow } from '../state/careerFlowStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Briefcase, AlertCircle } from 'lucide-react';

const jobRoles = [
  'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Data Scientist',
  'Machine Learning Engineer', 'UI/UX Designer', 'Product Manager', 'DevOps Engineer',
  'Cloud Architect', 'Security Engineer', 'Mobile Developer', 'QA Engineer'
];

export default function JobRoleSelectionPage() {
  const navigate = useNavigate();
  const { domain, setJobRole, setCustomJobRole } = useCareerFlow();
  const [searchTerm, setSearchTerm] = useState('');
  const [customRole, setCustomRole] = useState('');

  const filteredRoles = jobRoles.filter(role =>
    role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (role: string) => {
    setJobRole(role);
    navigate({ to: '/eligibility' });
  };

  const handleCustomRole = () => {
    if (customRole.trim()) {
      setCustomJobRole(customRole.trim());
      setJobRole(customRole.trim());
      navigate({ to: '/eligibility' });
    }
  };

  if (!domain) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Select Job Role</h1>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please select a domain first before choosing a job role.
          </AlertDescription>
        </Alert>
        <Button onClick={() => navigate({ to: '/domain' })} className="bg-gradient-to-r from-purple-600 to-purple-500">
          Select Domain
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Select Job Role</h1>
        <p className="text-muted-foreground mt-2">Choose your target job role</p>
      </div>

      <Input
        placeholder="Search job roles..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {filteredRoles.length === 0 && searchTerm ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">No roles found. Try a custom role below.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRoles.map((role) => (
            <Card
              key={role}
              className="border-2 hover:border-purple-500 transition-all cursor-pointer"
              onClick={() => handleSelect(role)}
            >
              <CardContent className="flex items-center gap-3 p-4">
                <Briefcase className="w-5 h-5 text-purple-600" />
                <span className="font-medium">{role}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Custom Job Role</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="custom">Enter your custom job role</Label>
            <Input
              id="custom"
              value={customRole}
              onChange={(e) => setCustomRole(e.target.value)}
              placeholder="e.g., Blockchain Developer"
            />
          </div>
          <Button onClick={handleCustomRole} disabled={!customRole.trim()}>
            Continue with Custom Role →
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
