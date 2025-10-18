import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Loader2 } from "lucide-react";

export default function SuccessMessage({ message }: { message: string }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center z-50">
      <Card className="w-full max-w-md m-4">
        <CardHeader>
          <CardTitle className="flex items-center justify-center text-2xl">
            <CheckCircle className="h-8 w-8 text-green-500 mr-2" />
            Success!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p>{message}</p>
        </CardContent>
      </Card>
      <div className="flex items-center text-white mt-4">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        Redirecting to homepage...
      </div>
    </div>
  );
}
