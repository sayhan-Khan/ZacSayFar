import logo from './assets/collegeEatsLogo1.png';

function App() {
  return (
    <div className="h-screen w-screen grid grid-cols-5">
      {/* Left Side with Full Background Pattern */}
      <div className="col-span-3 relative bg-white overflow-hidden">
        <div
          className="absolute -inset-[100%] z-0 opacity-40"
          style={{
            transform: 'rotate(15deg)',
            backgroundImage: `url(${logo})`,
            backgroundRepeat: 'repeat',
            backgroundSize: '110px 110px',
          }}
        />
      </div>

      {/* Right Side with Content */}
      <div className="col-span-2 bg-zinc-900 flex justify-center items-center">
        <div className="text-center text-white z-10">
          <h1 className="text-5xl font-bold mb-4">College Eats</h1>
          <p className="text-gray-400 mb-8 text-lg">
            Tracking What You Eat, Made Simple
          </p>
          <div className="flex justify-center gap-4">
            <button className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500">
              Get Started
            </button>
            <button className="px-6 py-3 border border-emerald-500 text-emerald-400 rounded-xl hover:bg-emerald-100">
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
