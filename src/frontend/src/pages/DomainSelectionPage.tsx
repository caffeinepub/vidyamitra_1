import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCareerFlow } from '../state/careerFlowStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Code, Database, Palette, TrendingUp, Users, Wrench } from 'lucide-react';

const domains = [
  { id: 'software', name: 'Software Development', icon: Code, color: 'from-blue-600 to-blue-500' },
  { id: 'data', name: 'Data Science', icon: Database, color: 'from-green-600 to-green-500' },
  { id: 'design', name: 'UI/UX Design', icon: Palette, color: 'from-pink-600 to-pink-500' },
  { id: 'marketing', name: 'Digital Marketing', icon: TrendingUp, color: 'from-orange-600 to-orange-500' },
  { id: 'hr', name: 'Human Resources', icon: Users, color: 'from-purple-600 to-purple-500' },
  { id: 'devops', name: 'DevOps Engineering', icon: Wrench, color: 'from-indigo-600 to-indigo-500' },
];

export default function DomainSelectionPage() {
  const navigate = useNavigate();
  const { setDomain } = useCareerFlow();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDomains = domains.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (domainId: string) => {
    setDomain(domainId);
    navigate({ to: '/job-role' });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Select Your Domain</h1>
        <p className="text-muted-foreground mt-2">Choose your career domain to get personalized guidance</p>
      </div>

      <Input
        placeholder="Search domains..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-md"
      />

      {filteredDomains.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">No domains found matching your search</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDomains.map((domain) => {
            const Icon = domain.icon;
            return (
              <Card
                key={domain.id}
                className="border-2 hover:border-purple-500 transition-all hover:shadow-lg cursor-pointer"
                onClick={() => handleSelect(domain.id)}
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${domain.color} flex items-center justify-center mb-3`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle>{domain.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full">
                    Select →
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
