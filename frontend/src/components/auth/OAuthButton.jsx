import React from "react";

export default function OAuthButton() {
  const backendUrl = import.meta.env.VITE_API_URL;

  const handleLogin = () => {
    window.location.href = `${backendUrl}/auth/github/login`;
  };

  return (
    <button
      onClick={handleLogin}
      className="px-6 py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition"
    >
      Connect with GitHub
    </button>
  );
}
