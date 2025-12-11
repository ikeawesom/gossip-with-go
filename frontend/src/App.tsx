import NavBar from "./components/nav/NavBar";

function App() {
  return (
    <section>
      <NavBar />
      <section className="pt-18 w-full flex items-start justify-center">
        <div className="w-full max-w-[1200px] p-6 border border-red-500 min-h-screen">
          {/* website body goes here */}
        </div>
      </section>
    </section>
  );
}

export default App;
