import Layout from "../components/Layout";

const Home = () => {
  return (
    <Layout title="Home">
      <div className="bg-blue-100 p-6 rounded-lg">
        <p className="mt-2 text-gray-600">
          Plan your meals, take the quiz, and enjoy delicious recipes!
        </p>
      </div>
    </Layout>
  );
};

export default Home;
