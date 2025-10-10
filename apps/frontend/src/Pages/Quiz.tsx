import React from "react";
import Layout from "../components/Layout";

const Quiz: React.FC = () => {
  return (
    <Layout title="Quiz">
      <div className="bg-green-100 p-6 rounded-lg">
        <h1 className="text-2xl font-bold text-green-800">
          Meal Planning Quiz
        </h1>
        <p className="mt-2 text-gray-600">
          Take our quiz to get personalized meal recommendations!
        </p>
        {/* Quiz form will go here */}
      </div>
    </Layout>
  );
};

export default Quiz;
