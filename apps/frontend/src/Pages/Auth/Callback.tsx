import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { router } from "@inertiajs/react";
import Layout from "../../components/Layout";

const AuthCallback: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle OAuth callback
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          setError(error.message);
        } else if (data.session) {
          // Successfully authenticated, redirect to home
          router.visit("/");
        } else {
          // Try to get session from URL hash (for OAuth)
          const hashParams = new URLSearchParams(
            window.location.hash.substring(1)
          );
          const accessToken = hashParams.get("access_token");

          if (accessToken) {
            // OAuth callback with token, redirect to home
            router.visit("/");
          } else {
            setError("No session found");
          }
        }
      } catch (err) {
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, []);

  if (loading) {
    return (
      <Layout title="Authenticating">
        <div className="max-w-md mx-auto mt-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Authenticating...
            </h2>
            <p className="text-gray-600">Please wait while we sign you in.</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Authentication Error">
        <div className="max-w-md mx-auto mt-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">❌</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Authentication Failed
              </h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={() => router.visit("/login")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return null;
};

export default AuthCallback;
