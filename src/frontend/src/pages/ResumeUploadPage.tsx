import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetCallerResumes, useUploadResume } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Progress } from '../components/ui/progress';
import { Alert, AlertDescription } from '../components/ui/alert';
import { FileText, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { AsyncState } from '../components/AsyncState';
import { ExternalBlob } from '../backend';

export default function ResumeUploadPage() {
  const navigate = useNavigate();
  const { data: resumes, isLoading } = useGetCallerResumes();
  const uploadMutation = useUploadResume();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (validTypes.includes(file.type)) {
        setSelectedFile(file);
      } else {
        alert('Please select a PDF or DOCX file');
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      await uploadMutation.mutateAsync({
        name: selectedFile.name,
        file: blob,
      });

      setSelectedFile(null);
      setUploadProgress(0);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Resume Upload</h1>
        <p className="text-muted-foreground mt-2">Upload your resume for AI-powered analysis</p>
      </div>

      {/* Upload Card */}
      <Card>
        <CardHeader>
          <CardTitle>Upload New Resume</CardTitle>
          <CardDescription>Supported formats: PDF, DOCX (Max 10MB)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="resume">Select File</Label>
            <Input
              id="resume"
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileSelect}
              disabled={uploadMutation.isPending}
            />
          </div>

          {selectedFile && (
            <div className="p-4 border rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-purple-600" />
                <div className="flex-1">
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            </div>
          )}

          {uploadMutation.isPending && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}

          {uploadMutation.isSuccess && (
            <Alert className="border-green-500 bg-green-50 dark:bg-green-900/20">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                Resume uploaded successfully!
              </AlertDescription>
            </Alert>
          )}

          {uploadMutation.isError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{uploadMutation.error?.message || 'Upload failed'}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3">
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || uploadMutation.isPending}
              className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 gap-2"
            >
              <Upload className="w-4 h-4" />
              {uploadMutation.isPending ? 'Uploading...' : 'Upload Resume'}
            </Button>
            {uploadMutation.isSuccess && (
              <Button onClick={() => navigate({ to: '/analysis' })} variant="outline">
                View Analysis →
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Existing Resumes */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Your Resumes</h2>
        <AsyncState isLoading={isLoading} isEmpty={!resumes || resumes.length === 0} emptyMessage="No resumes uploaded yet">
          <div className="grid gap-4">
            {resumes?.map((resume) => (
              <Card key={resume.id}>
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">{resume.name}</p>
                      <p className="text-sm text-muted-foreground">Uploaded resume</p>
                    </div>
                  </div>
                  <Button onClick={() => navigate({ to: '/analysis' })} variant="outline">
                    View Analysis
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </AsyncState>
      </div>
    </div>
  );
}
