import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Clock, AlertCircle } from "lucide-react";

interface VerificationStepsProps {
  currentStep?: number;
}

const VerificationSteps = ({ currentStep = 1 }: VerificationStepsProps) => {
  const steps = [
    {
      id: 1,
      title: "Complete Registration",
      description: "Fill out your provider registration form with all required details",
      status: currentStep >= 1 ? "completed" : "pending"
    },
    {
      id: 2,
      title: "Document Verification",
      description: "Upload required documents (ID proof, address proof, certificates)",
      status: currentStep >= 2 ? "completed" : currentStep === 1 ? "in-progress" : "pending"
    },
    {
      id: 3,
      title: "Background Check",
      description: "Our team will verify your credentials and background",
      status: currentStep >= 3 ? "completed" : currentStep === 2 ? "in-progress" : "pending"
    },
    {
      id: 4,
      title: "Account Approval",
      description: "Final approval and activation of your provider account",
      status: currentStep >= 4 ? "completed" : currentStep === 3 ? "in-progress" : "pending"
    }
  ];

  const getStepIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case "in-progress":
        return <Clock className="w-6 h-6 text-yellow-500" />;
      default:
        return <Circle className="w-6 h-6 text-gray-300" />;
    }
  };

  const getStepBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "in-progress":
        return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-blue-500" />
          <span>Verification Process</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600 mb-4">
          Complete these steps to become a verified provider and start receiving bookings.
        </div>
        
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-start space-x-4 p-4 border rounded-lg">
            <div className="flex-shrink-0">
              {getStepIcon(step.status)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-900">{step.title}</h4>
                {getStepBadge(step.status)}
              </div>
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>
            {index < steps.length - 1 && (
              <div className="absolute left-8 mt-8 w-px h-6 bg-gray-200"></div>
            )}
          </div>
        ))}
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-900">Need Help?</h4>
              <p className="text-sm text-blue-700 mt-1">
                Contact our support team at support@simplifixr.com for assistance with the verification process.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VerificationSteps;