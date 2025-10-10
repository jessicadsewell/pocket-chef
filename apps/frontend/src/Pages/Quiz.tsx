import React, { useState } from "react";
import Layout from "../components/Layout";
import Icon from "../components/Icon";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

// Mock data - replace with actual API calls
interface QuizResponse {
  id: number;
  createdAt: string;
  responses: Record<string, string>;
  mealPlanId?: number;
  mealPlanName?: string;
}

const quizQuestions = [
  {
    id: "dietary_preference",
    question: "What's your dietary preference?",
    type: "select",
    options: [
      "Vegetarian",
      "Vegan",
      "Pescatarian",
      "Omnivore",
      "Keto",
      "Paleo",
    ],
  },
  {
    id: "allergies",
    question: "Any food allergies or restrictions?",
    type: "multiselect",
    options: ["Dairy", "Nuts", "Shellfish", "Gluten", "Soy", "Eggs", "None"],
  },
  {
    id: "cooking_time",
    question: "How much time do you have for cooking?",
    type: "select",
    options: ["15-30 minutes", "30-45 minutes", "45-60 minutes", "60+ minutes"],
  },
  {
    id: "servings",
    question: "How many people are you cooking for?",
    type: "select",
    options: ["1", "2", "3-4", "5+"],
  },
  {
    id: "skill_level",
    question: "What's your cooking skill level?",
    type: "select",
    options: ["Beginner", "Intermediate", "Advanced", "Expert"],
  },
  {
    id: "cuisine",
    question: "Favorite cuisine types?",
    type: "multiselect",
    options: [
      "Italian",
      "Mexican",
      "Asian",
      "Mediterranean",
      "American",
      "Indian",
      "Middle Eastern",
    ],
  },
  {
    id: "additional_constraints",
    question: "Any other preferences or constraints?",
    type: "textarea",
    placeholder:
      "Tell us more about your needs... (e.g., 'I don't like mushrooms', 'Need high-protein meals', 'Training for a marathon', 'Prefer one-pot meals', 'No spicy food')",
    description:
      "Our AI will use this information to personalize your meal plan even further.",
  },
];

const Quiz: React.FC = () => {
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<
    Record<string, string | string[]>
  >({});
  const [pastResponses, setPastResponses] = useState<QuizResponse[]>([
    // Mock data - replace with actual data from API
    {
      id: 1,
      createdAt: "2025-10-05T10:30:00Z",
      responses: {
        dietary_preference: "Vegetarian",
        allergies: "Nuts, Dairy",
        cooking_time: "30-45 minutes",
        servings: "2",
        skill_level: "Intermediate",
        cuisine: "Italian, Mediterranean",
        additional_constraints:
          "I'm training for a marathon so need high-protein options. Also prefer one-pot meals for easy cleanup.",
      },
      mealPlanId: 1,
      mealPlanName: "Healthy Vegetarian Week 1",
    },
  ]);

  const handleStartQuiz = () => {
    setQuizAnswers({});
    setCurrentStep(0);
    setIsQuizOpen(true);
  };

  const handleAnswerChange = (
    questionId: string,
    answer: string | string[]
  ) => {
    setQuizAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (currentStep < quizQuestions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    // TODO: Submit quiz to backend API
    console.log("Quiz submitted:", quizAnswers);

    // Mock response
    const newResponse: QuizResponse = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      responses: Object.fromEntries(
        Object.entries(quizAnswers).map(([key, value]) => [
          key,
          Array.isArray(value) ? value.join(", ") : value,
        ])
      ),
    };

    setPastResponses((prev) => [newResponse, ...prev]);
    setIsQuizOpen(false);
  };

  const handleGenerateMealPlan = (responseId: number) => {
    // TODO: Generate meal plan from quiz response
    console.log("Generating meal plan for response:", responseId);
  };

  const handleDeleteResponse = (responseId: number) => {
    setPastResponses((prev) => prev.filter((r) => r.id !== responseId));
  };

  const currentQuestion = quizQuestions[currentStep];
  const isLastStep = currentStep === quizQuestions.length - 1;
  // Allow proceeding if answered, or if it's the optional textarea
  const canProceed =
    quizAnswers[currentQuestion?.id] || currentQuestion?.type === "textarea";

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Layout title="Quiz">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Meal Planning Quiz
              </h1>
              <p className="mt-2 text-gray-400">
                Answer a few questions to get personalized meal recommendations
              </p>
            </div>
            <button
              onClick={handleStartQuiz}
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
            >
              <Icon name="add-circle-line" size="lg" />
              {pastResponses.length > 0 ? "Take New Quiz" : "Start Quiz"}
            </button>
          </div>
        </div>

        {/* Empty State */}
        {pastResponses.length === 0 && (
          <div className="bg-gray-800 rounded-xl p-12 text-center">
            <div className="mx-auto w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
              <Icon
                name="questionnaire-line"
                className="text-green-500"
                size="3xl"
              />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No Quiz Responses Yet
            </h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Take your first quiz to receive personalized meal plan
              recommendations based on your preferences and dietary needs.
            </p>
            <button
              onClick={handleStartQuiz}
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
            >
              <Icon name="play-circle-line" size="lg" />
              Get Started
            </button>
          </div>
        )}

        {/* Quiz Responses List */}
        {pastResponses.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white mb-4">
              Your Quiz History
            </h2>
            {pastResponses.map((response) => (
              <div
                key={response.id}
                className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Icon
                        name="checkbox-circle-fill"
                        className="text-green-500"
                        size="lg"
                      />
                      <h3 className="text-lg font-semibold text-white">
                        Quiz Response
                      </h3>
                      <span className="text-sm text-gray-400">
                        {formatDate(response.createdAt)}
                      </span>
                    </div>

                    {/* Response Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
                      {Object.entries(response.responses)
                        .filter(([key]) => key !== "additional_constraints")
                        .map(([key, value]) => (
                          <div
                            key={key}
                            className="bg-gray-900/50 rounded-lg p-3"
                          >
                            <dt className="text-xs font-medium text-gray-400 mb-1">
                              {quizQuestions.find((q) => q.id === key)
                                ?.question || key}
                            </dt>
                            <dd className="text-sm text-white">{value}</dd>
                          </div>
                        ))}
                    </div>

                    {/* Additional Constraints (if provided) */}
                    {response.responses.additional_constraints && (
                      <div className="mt-4 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Icon
                            name="ai-generate"
                            className="text-blue-400 mt-0.5"
                            size="lg"
                          />
                          <div className="flex-1">
                            <dt className="text-xs font-medium text-blue-300 mb-1">
                              Additional AI Constraints
                            </dt>
                            <dd className="text-sm text-white italic">
                              "{response.responses.additional_constraints}"
                            </dd>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Related Meal Plan */}
                    {response.mealPlanId && (
                      <div className="mt-4 flex items-center gap-2 text-sm text-green-400">
                        <Icon name="restaurant-2-line" />
                        <span>Meal Plan: {response.mealPlanName}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-700">
                  {!response.mealPlanId ? (
                    <button
                      onClick={() => handleGenerateMealPlan(response.id)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white text-sm font-medium rounded-lg transition-all shadow-lg shadow-green-500/20"
                    >
                      <Icon name="magic-line" />
                      Generate AI Meal Plan
                    </button>
                  ) : (
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors">
                      <Icon name="eye-line" />
                      View Meal Plan
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteResponse(response.id)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 text-sm font-medium rounded-lg transition-colors"
                  >
                    <Icon name="delete-bin-line" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quiz Modal */}
        <Dialog
          open={isQuizOpen}
          onClose={() => setIsQuizOpen(false)}
          className="relative z-50"
        >
          <DialogBackdrop className="fixed inset-0 bg-black/70 transition-opacity" />

          <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <DialogPanel className="relative transform overflow-hidden rounded-xl bg-gray-800 text-left shadow-xl transition-all w-full max-w-2xl">
                {/* Progress Bar */}
                <div className="h-2 bg-gray-700">
                  <div
                    className="h-full bg-green-600 transition-all duration-300"
                    style={{
                      width: `${
                        ((currentStep + 1) / quizQuestions.length) * 100
                      }%`,
                    }}
                  />
                </div>

                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <DialogTitle className="text-xl font-semibold text-white">
                      Question {currentStep + 1} of {quizQuestions.length}
                    </DialogTitle>
                    <button
                      onClick={() => setIsQuizOpen(false)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <Icon name="close-line" size="xl" />
                    </button>
                  </div>

                  {/* Question */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-semibold text-white mb-6">
                      {currentQuestion.question}
                    </h3>

                    {/* Answer Options */}
                    {currentQuestion.type === "select" &&
                      currentQuestion.options && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {currentQuestion.options.map((option) => (
                            <button
                              key={option}
                              onClick={() =>
                                handleAnswerChange(currentQuestion.id, option)
                              }
                              className={`p-4 rounded-lg border-2 text-left transition-all ${
                                quizAnswers[currentQuestion.id] === option
                                  ? "border-green-500 bg-green-500/10 text-white"
                                  : "border-gray-700 bg-gray-900/50 text-gray-300 hover:border-gray-600"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                    quizAnswers[currentQuestion.id] === option
                                      ? "border-green-500"
                                      : "border-gray-600"
                                  }`}
                                >
                                  {quizAnswers[currentQuestion.id] ===
                                    option && (
                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                  )}
                                </div>
                                <span className="font-medium">{option}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}

                    {currentQuestion.type === "multiselect" &&
                      currentQuestion.options && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {currentQuestion.options.map((option) => {
                            const currentAnswers =
                              (quizAnswers[currentQuestion.id] as string[]) ||
                              [];
                            const isSelected = currentAnswers.includes(option);

                            return (
                              <button
                                key={option}
                                onClick={() => {
                                  const newAnswers = isSelected
                                    ? currentAnswers.filter((a) => a !== option)
                                    : [...currentAnswers, option];
                                  handleAnswerChange(
                                    currentQuestion.id,
                                    newAnswers
                                  );
                                }}
                                className={`p-4 rounded-lg border-2 text-left transition-all ${
                                  isSelected
                                    ? "border-green-500 bg-green-500/10 text-white"
                                    : "border-gray-700 bg-gray-900/50 text-gray-300 hover:border-gray-600"
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                      isSelected
                                        ? "border-green-500 bg-green-500"
                                        : "border-gray-600"
                                    }`}
                                  >
                                    {isSelected && (
                                      <Icon
                                        name="check-line"
                                        className="text-white text-sm"
                                      />
                                    )}
                                  </div>
                                  <span className="font-medium">{option}</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}

                    {currentQuestion.type === "textarea" && (
                      <div>
                        {currentQuestion.description && (
                          <div className="mb-4 flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                            <Icon
                              name="ai-generate"
                              className="text-blue-400 mt-0.5"
                              size="lg"
                            />
                            <p className="text-sm text-blue-200">
                              {currentQuestion.description}
                            </p>
                          </div>
                        )}
                        <textarea
                          value={
                            (quizAnswers[currentQuestion.id] as string) || ""
                          }
                          onChange={(e) =>
                            handleAnswerChange(
                              currentQuestion.id,
                              e.target.value
                            )
                          }
                          placeholder={currentQuestion.placeholder}
                          rows={6}
                          className="w-full px-4 py-3 bg-gray-900/50 border-2 border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all resize-none"
                        />
                        <p className="mt-2 text-xs text-gray-400">
                          Optional: Skip this if you don't have any additional
                          requirements
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center justify-between pt-6 border-t border-gray-700">
                    <button
                      onClick={handlePrevious}
                      disabled={currentStep === 0}
                      className="inline-flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Icon name="arrow-left-line" />
                      Previous
                    </button>

                    {isLastStep ? (
                      <button
                        onClick={handleSubmitQuiz}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all shadow-lg"
                      >
                        Complete & Save
                        <Icon name="check-line" />
                      </button>
                    ) : (
                      <button
                        onClick={handleNext}
                        disabled={!canProceed}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Next
                        <Icon name="arrow-right-line" />
                      </button>
                    )}
                  </div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Quiz;
