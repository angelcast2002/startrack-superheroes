import './App.css';
import HeroCard from './components/HeroCard';

function App() {
  const dataDummy = {
    id: 1,
    name: 'A-Bomb',
  };
  return (
    <>
      <div className="flex bg-white w-screen h-screen flex-row gap-4 p-4">
        <HeroCard hero={dataDummy} isFav={false} onToggle={() => {}} />
        <HeroCard hero={dataDummy} isFav={false} onToggle={() => {}} />
        <HeroCard hero={dataDummy} isFav={false} onToggle={() => {}} />
      </div>
    </>
  );
}

export default App;
