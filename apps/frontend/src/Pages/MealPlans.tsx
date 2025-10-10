import Layout from '../components/Layout';

type Meal = {
  name: string;
  ingredients: string[];
  instructions: string;
};

type Props = {
  meals: Meal[];
};

export default function MealPlan({ meals }: Props) {
  return (
    <Layout title="Meal Plans">
      <h1>Weekly Meal Plan</h1>
      {meals.map((meal, i) => (
        <div key={i} style={{ marginBottom: '1rem', border: '1px solid #ccc', padding: '1rem' }}>
          <h2>{meal.name}</h2>
          <strong>Ingredients:</strong>
          <ul>
            {meal.ingredients.map((ing, idx) => (
              <li key={idx}>{ing}</li>
            ))}
          </ul>
          <strong>Instructions:</strong>
          <p>{meal.instructions}</p>
        </div>
      ))}
    </Layout>
  );
}