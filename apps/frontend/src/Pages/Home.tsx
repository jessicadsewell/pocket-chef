import { useState } from "react";
import Layout from "../components/Layout";
import Icon from "../components/Icon";
import { useAuth } from "../contexts/AuthContext";

interface PageProps {
  auth: {
    user: {
      raw_user_meta_data: {
        name: string;
      };
    };
  };
}

interface Meal {
  id: number;
  name: string;
  description: string;
  prepTime: string;
  calories: number;
}

interface DailyMeals {
  date: string;
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
}

const Home = ({ auth }: PageProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const { user, getUserDisplayName, getUserAvatar, isGoogleUser } = useAuth();

  // Mock data for daily meals - TODO: Replace with actual data from the database
  const weeklyMeals: DailyMeals[] = [
    {
      date: new Date().toISOString().split("T")[0],
      breakfast: {
        id: 1,
        name: "Avocado Toast",
        description:
          "Whole grain toast with smashed avocado and cherry tomatoes",
        prepTime: "10 min",
        calories: 320,
      },
      lunch: {
        id: 2,
        name: "Quinoa Bowl",
        description: "Quinoa with roasted vegetables and tahini dressing",
        prepTime: "25 min",
        calories: 450,
      },
      dinner: {
        id: 3,
        name: "Salmon & Sweet Potato",
        description:
          "Baked salmon with roasted sweet potato and steamed broccoli",
        prepTime: "35 min",
        calories: 520,
      },
    },
    {
      date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
      breakfast: {
        id: 4,
        name: "Greek Yogurt Parfait",
        description: "Greek yogurt with berries, granola, and honey",
        prepTime: "5 min",
        calories: 280,
      },
      lunch: {
        id: 5,
        name: "Chicken Caesar Wrap",
        description:
          "Grilled chicken with romaine, parmesan, and caesar dressing",
        prepTime: "15 min",
        calories: 380,
      },
      dinner: {
        id: 6,
        name: "Vegetable Stir Fry",
        description: "Mixed vegetables with tofu in ginger-soy sauce",
        prepTime: "20 min",
        calories: 340,
      },
    },
  ];

  const currentMeals = weeklyMeals[currentDayIndex] || weeklyMeals[0];
  const formattedDate = new Date(currentMeals.date).toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const nextDay = () => {
    if (currentDayIndex < weeklyMeals.length - 1) {
      setCurrentDayIndex(currentDayIndex + 1);
    }
  };

  const prevDay = () => {
    if (currentDayIndex > 0) {
      setCurrentDayIndex(currentDayIndex - 1);
    }
  };

  const MealCard = ({ meal, mealType }: { meal: Meal; mealType: string }) => (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800 capitalize">
          {mealType}
        </h3>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {meal.prepTime}
        </span>
      </div>
      <h4 className="text-xl font-bold text-gray-900 mb-2">{meal.name}</h4>
      <p className="text-gray-600 mb-4 leading-relaxed">{meal.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">{meal.calories} calories</span>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
          View Recipe
        </button>
      </div>
    </div>
  );

  return (
    <Layout title="Home">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          {user && (
            <img
              src={getUserAvatar()}
              alt={getUserDisplayName()}
              className="h-16 w-16 rounded-full object-cover border-4 border-white shadow-lg"
            />
          )}
          <div className="text-left">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {user ? `Hey, ${getUserDisplayName()}!` : "Hey, Friend!"}
            </h1>
          </div>
        </div>
        <p className="flex justify-center text-gray-600 text-lg">
          Here's what's on the menu today
        </p>
      </div>

      {/* Date Navigation */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <button
            onClick={prevDay}
            disabled={currentDayIndex === 0}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <Icon name="arrow-left-line" className="w-5 h-5" />
            <span>Previous</span>
          </button>

          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900">
              {formattedDate}
            </h2>
            <p className="text-sm text-gray-500">
              Day {currentDayIndex + 1} of {weeklyMeals.length}
            </p>
          </div>

          <button
            onClick={nextDay}
            disabled={currentDayIndex === weeklyMeals.length - 1}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <span>Next</span>
            <Icon name="arrow-right-line" className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Meal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MealCard meal={currentMeals.breakfast} mealType="breakfast" />
        <MealCard meal={currentMeals.lunch} mealType="lunch" />
        <MealCard meal={currentMeals.dinner} mealType="dinner" />
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-gray-500 to-blue-600 rounded-2xl p-6 text-white">
        <h3 className="text-xl font-semibold mb-4">
          Need something different?
        </h3>
        <div className="flex flex-wrap gap-4">
          <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 rounded-lg font-medium transition-all duration-200 backdrop-blur-sm">
            Generate New Meal Plan
          </button>
          <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 rounded-lg font-medium transition-all duration-200 backdrop-blur-sm">
            Take Quiz Again
          </button>
          <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 rounded-lg font-medium transition-all duration-200 backdrop-blur-sm">
            View Grocery List
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
