import { useEffect, useState } from 'react';
import './App.css'
import Cookies from "universal-cookie";
import { ToastContainer, toast } from 'react-toastify';
import linkimg from './icons/link.gif';
import magicimg from './icons/magic.gif';
import visitimg from './icons/visit.gif';
import copyimg from './icons/copy.gif';
import qrimg from './icons/qr.gif';
import copy from 'copy-to-clipboard';
const cookies = new Cookies();

function App() {
  const backendURL = import.meta.env.VITE_PRODUCTION_BACKEND_URL || 'http://localhost:3000/';
  const frontendURL = import.meta.env.VITE_PRODUCTION_FRONTEND_URL || 'http://localhost:5173';
  const [formData, setFormData] = useState({ url: '', text: '' });
  const [result, setResult] = useState({ originalUrl: '', shortenLink: '' });
  const [showResult, setshowResult] = useState<boolean>(false);
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState('');
  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!formData.url || !formData.text) {
      toast.warning('Fill all the details!!', {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
    else {
      try {
        const token = cookies.get("ENLACEE_TOKEN");
        const response = await fetch(`${backendURL}shorten`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();
        if (data.message == 'Alias already exists') {
          toast.error(data.message, {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }
        console.log(data);
        setResult({ originalUrl: data.url.longUrl, shortenLink: data.url.shortUrl });
        setFormData({ url: '', text: '' });
        setshowResult(true);
      } catch (e) {
        console.log(e)
      }
    }
  }
  const handleShortAnother = () => {
    setResult({ originalUrl: '', shortenLink: '' });
    setshowResult(false);
  }

  const handleDownload = (format: string) => {
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(result.shortenLink)}&size=150x150`;

    // For PNG and JPEG, fetch the image as a Blob
    fetch(qrCodeUrl)
      .then(res => res.blob())
      .then(blob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `qr-code.${format}`;
        link.click();
      })
      .catch(err => {
        console.error('Error fetching QR code image', err);
      });
  }
  // Set a random background
  useEffect(() => {
    // initial background
    const initialBackgroundUrl = `https://random-image-pepebigotes.vercel.app/api/random-image?timestamp=${new Date().getTime()}`;
    setBackgroundImage(initialBackgroundUrl);

    const interval = setInterval(() => {
      const newBackgroundUrl = `https://random-image-pepebigotes.vercel.app/api/random-image?timestamp=${new Date().getTime()}`;
      setBackgroundImage(newBackgroundUrl);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className='bg-slate-700 w-screen h-screen flex flex-col justify-center items-center'
        style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover' }}>

        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <ToastContainer />
        <span
          className="uppercase text-3xl font-extrabold absolute top-10 left-10 text-white"
          style={{
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7), -2px -2px 4px rgba(0, 0, 0, 0.7), 2px -2px 4px rgba(0, 0, 0, 0.7), -2px 2px 4px rgba(0, 0, 0, 0.7)',
          }}
        >
          Enlacee
        </span>
        {!showResult &&
          <div className='border rounded-lg bg-white text-black lg:w-1/3 m-3 h-fit flex flex-col justify-center p-3'>
            <div className=''>
              <div className="mb-6">
                <label htmlFor="longurl" className="flex gap-1 items-center mb-2 text-lg font-normal"><img src={linkimg} className='w-7' /> Shorten Enlacee</label>
                <input type="url" id="longurl" name='url' className=" border border-slate-400 text-lg rounded-lg block w-full p-2.5 placeholder-black-400 text-[#08a88a] h-12 placeholder:font-normal" placeholder='Enter long URL here' onChange={handleChange} value={formData.url} />
              </div>
              <div className="mb-6">
                <label htmlFor="alias" className="flex gap-1 items-center mb-2 text-lg font-normal"><img src={magicimg} className='w-7' /> Customize Enlacee</label>
                <div className='flex gap-2'>
                  <input type="text" id="disabled-input" aria-label="disabled input" className="mb-6 bg-gray-200 border border-slate-400 text-slate-500 text-sm rounded-lg  block w-full p-2.5 cursor-not-allowed h-12" value={frontendURL} disabled />

                  <input type="url" id="alias" name='text' className=" border border-slate-400 text-lg rounded-lg block w-full p-2.5 placeholder-black-400 text-[#08a88a] h-12 placeholder:font-normal" placeholder='Enter alias' onChange={handleChange} value={formData.text} />
                </div>
              </div>
              <div className='mb-6'>
                <button onClick={handleSubmit} type="button" className="text-white bg-[#08a88a] hover:bg-[#187161] focus:ring-[#187161] focus:ring-4 font-medium rounded-lg text-xl w-full h-12 focus:outline-none ">Shorten Enlacee</button>
              </div>
            </div>
          </div>
        }
        {showResult &&
          <div className='border rounded-lg bg-white text-black lg:w-1/3 m-4 h-fit flex flex-col justify-center p-3'>
            <div className=''>
              <div className="mb-6">
                <label htmlFor="longurl" className="flex gap-1 items-center mb-2 text-lg font-normal uppercase"><img src={linkimg} className='w-7' /> Your long url</label>
                <input type="url" id="longurl" name='url' className=" border border-slate-400 text-lg rounded-lg block w-full p-2.5 placeholder-black-400 text-[#08a88a] h-12 placeholder:font-normal" placeholder='Enter long URL here' value={result.originalUrl} disabled />
              </div>
              <div className="mb-6">
                <label htmlFor="alias" className="flex gap-1 items-center mb-2 text-lg font-normal"><img src={magicimg} className='w-7' /> Your Enlacee</label>
                <div className='flex gap-2'>
                  <input type="url" id="alias" name='text' className=" border border-slate-400 text-lg rounded-lg block w-full p-2.5 placeholder-black-400 text-[#08a88a] h-12 placeholder:font-normal" placeholder='Enter alias' value={result.shortenLink} disabled />
                </div>
              </div>
              <div className='mb-6 flex flex-wrap items-center justify-center gap-3'>
                <div className='flex items-center'>

                  {/* visit shorten enlacee */}
                  <button onClick={() => window.location.href = result.shortenLink} type="button" title='Visit Enlacee' className="text-white border border-[#08a88a] font-medium rounded-lg text-sm p-1 text-center inline-flex items-center me-2">
                    <img src={visitimg} alt="" className='w-10' />
                  </button>

                  {/* qr code */}
                  <button onClick={() => setShowQRDialog(true)} type="button" title='QR Code' className="text-black border border-[#08a88a] font-medium rounded-lg text-sm px-2 py-2 text-center inline-flex items-center me-2 gap-1">
                    <img src={qrimg} alt="" className='w-8' />
                    QR
                  </button>

                  {/* copy shorten enlacee */}
                  <button onClick={() => {
                    copy(result.shortenLink),
                      toast.success('Copied to clipboard!!', {
                        position: "bottom-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                      })

                  }} type="button" title='Copy Enlacee' className="text-black border border-[#08a88a] font-medium rounded-lg text-sm px-2 py-2 text-center inline-flex items-center me-2 gap-1">
                    <img src={copyimg} alt="" className='w-8' />
                    Copy
                  </button>
                </div>

                <div className='flex items-center '>
                  {/* shorten another */}
                  <button onClick={handleShortAnother} type="button" className="text-white bg-[#08a88a] hover:bg-[#187161] focus:ring-[#187161] focus:ring-4 font-medium rounded-lg text-xl w-full px-3 h-12 focus:outline-none ">Shorten Another</button>
                </div>

              </div>
            </div>
          </div>
        }
        {showQRDialog && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-2/3 lg:w-1/3">
              <h2 className="text-lg font-bold mb-4">QR Code</h2>
              <p>Scan this QR Code to visit the shortened URL:</p>
              <div className='flex flex-col gap-5'>
                <div id="qr-code" className="mt-4 flex justify-evenly flex-wrap gap-9">
                  <div className=''>
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(result.shortenLink)}&size=150x150`} alt="QR Code" id="qr-img" />
                  </div>
                  <div className='w-1/3'>
                    <div className="flex flex-col justify-center gap-4">
                      <button onClick={() => handleDownload('png')} className="bg-[#08a88a] hover:bg-[#187161] text-white px-4 py-2 rounded-md">
                        PNG
                      </button>
                      <button onClick={() => handleDownload('jpeg')} className="bg-[#08a88a] hover:bg-[#187161] text-white px-4 py-2 rounded-md">
                        JPEG
                      </button>
                      <button onClick={() => handleDownload('svg')} className="bg-[#08a88a] hover:bg-[#187161] text-white px-4 py-2 rounded-md">
                        SVG
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <button onClick={() => setShowQRDialog(false)} className="text-white bg-[#08a88a] hover:bg-[#187161] rounded-lg px-4 py-2 mb-2">Close</button>

                </div>
              </div>
            </div>
          </div>
        )}
        <span className='font-medium uppercase text-white' style={{
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7), -2px -2px 4px rgba(0, 0, 0, 0.7), 2px -2px 4px rgba(0, 0, 0, 0.7), -2px 2px 4px rgba(0, 0, 0, 0.7)',
        }}>
          Made with ❤️ by <a href="https://shiv-chauhan.netlify.app" target="_blank" rel="noopener noreferrer">
            Shiv Chauhan
          </a>.
        </span>
      </div>
    </>
  )
}

export default App
