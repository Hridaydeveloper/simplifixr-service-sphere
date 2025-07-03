
import { Settings } from "lucide-react";
import { useState, useEffect } from "react";

const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00B896]/5 to-[#00C9A7]/5 flex items-center justify-center">
      <div className="text-center space-y-8">
        {/* Logo with animation */}
        <div className="flex items-center justify-center space-x-3">
          <div className="w-16 h-16 bg-gradient-to-br from-[#00B896] to-[#00C9A7] rounded-2xl flex items-center justify-center">
            <Settings className="w-8 h-8 text-white animate-spin" style={{ animationDuration: '0.6s' }} />
          </div>
          <span className="text-3xl font-bold bg-gradient-to-r from-[#00B896] to-[#00C9A7] bg-clip-text text-transparent">
            Simplifixr
          </span>
        </div>

        {/* Loading message */}
        <div className="space-y-4">
          <p className="text-gray-600 text-lg">Loading your trusted service partner...</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
