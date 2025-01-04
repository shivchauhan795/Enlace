import './App.css'

function App() {
  const text = import.meta.env.VITE_TEXT;
  return (
    <>
      <div className='flex flex-col justify-center items-center'>
        <h1>{text}</h1>
        hi
      </div>
    </>
  )
}

export default App
