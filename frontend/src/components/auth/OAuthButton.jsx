export default function OAuthButton() {
  const handleLogin = () => {
    window.location.href = import.meta.env.VITE_BACKEND_URL + "/auth/github/login";
  };

  return (
    <button
      onClick={handleLogin}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      Connect GitHub
    </button>
  );
}
