import { useNavigate } from "react-router-dom";

export default function PrimaryErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="w-full max-w-md mx-auto">
          <h1 className="text-9xl font-bold text-orange-500 mb-4">404</h1>
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-orange-500">
            Oops! Page Not Found
          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            The page you're looking for seems to have wandered off. Let's get
            you back on track!
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-lg bg-white text-orange-500 font-semibold border-2 border-orange-500 hover:bg-orange-50 transition-colors duration-200 w-full sm:w-auto"
          >
            Go Back
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors duration-200 w-full sm:w-auto"
          >
            Return Home
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/2 w-96 h-96 rounded-full bg-orange-100 opacity-20" />
          <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 rounded-full bg-orange-100 opacity-20" />
        </div>
      </div>
    </div>
  );
}
