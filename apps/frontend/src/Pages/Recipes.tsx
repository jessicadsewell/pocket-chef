import React from "react";
import Layout from "../components/Layout";

interface Recipe {
  id: number;
  name: string;
  description: string;
}

interface Props {
  recipes?: Recipe[];
}

const Recipes: React.FC<Props> = ({ recipes = [] }) => {
  return (
    <Layout title="Recipes">
      <div className="bg-purple-100 p-6 rounded-lg">
        <h1 className="text-2xl font-bold text-purple-800">Recipes</h1>
        <p className="mt-2 text-gray-600">
          Browse our collection of delicious recipes
        </p>
        {recipes.length > 0 ? (
          <div className="mt-4 grid gap-4">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="bg-white p-4 rounded shadow">
                <h2 className="text-xl font-semibold">{recipe.name}</h2>
                <p className="text-gray-600">{recipe.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-gray-500">No recipes available yet.</p>
        )}
      </div>
    </Layout>
  );
};

export default Recipes;
