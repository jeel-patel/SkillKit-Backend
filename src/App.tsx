import './App.css';
import { useAuth0 } from '@auth0/auth0-react';
import Header from './base/components/header/Header';
import FullScreenLoader from './base/components/loaders/FullScreenLoader';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './base/pages/homepage/MainPage';
import { ThemeProvider, createTheme } from '@mui/material';
import EditProfile from './base/pages/editProfile/EditProfile';
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import ProjectPage from './base/pages/project/ProjectPage';
import { createContext, useContext } from 'react';

const THEME = createTheme({
  typography: {
   "fontFamily": `"Poppins",sans-serif`,
   "fontSize": 14,
   "fontWeightLight": 300,
   "fontWeightRegular": 400,
   "fontWeightMedium": 500
  }
});


/*
  Fetch the metadata from the mongo and set the state.
  The prop drill to all the components.

  Make the context that will fetch the user metadata.
*/

export let MetaDataContext = createContext({});
// export let FetchMetaDataContext = createContext((email:any) => {

//   return new Promise(async(resolve, reject)=>{
//     try{
//       let a = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users/metadata/${email}`,{method : "GET"});
//       let b = await a.json();
//       console.log(b);
//       resolve(b.data.data);
//     }
//     catch(e){
//       reject(e);
//     }
//   })
// });

function App() {
  const { user,isLoading } = useAuth0();
  const [picture,setPicture] = useState<string>();
  const [metaData, setMetaData] = useState<any>();
  // const metaDataFun = useContext(FetchMetaDataContext);
  const fetchUserProfilePicture = () => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/metadata/${user?.email}`)
    .then((res) => {
      setPicture(res.data?.data?.picture);
    })
    .catch((err) => {
      console.log(err);
    });
  }

  async function updateMetaData(){

    console.log("12332", user?.email);
    if(!!user?.email&&!!!localStorage.getItem('user_metadata'))
    {
      try{
        let a = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users/metadata/${user?.email}`,{method : "GET"});
        let b = await a.json();
        // resolve(b.data.data);
        console.warn("Hello world", b.data);
        localStorage.setItem('user_metadata',JSON.stringify(b.data));
        setMetaData(b.data);
        // if(JSON.stringify(metaData)!==JSON.stringify(b.data))
        // {
        //   setMetaData(b.data);
        //   setPicture(b?.picture);
        // }
  
      }
      catch(e){
        // reject(e);
      }
    }
    else if(!!localStorage.getItem('user_metadata'))
    {
      console.log(JSON.stringify(metaData)===localStorage.getItem('user_metadata'));
      if(JSON.stringify(metaData)!==JSON.stringify(JSON.parse(localStorage.getItem('user_metadata')||'')))
      {
        setMetaData(JSON.parse(localStorage.getItem('user_metadata')||''));
        console.warn("Hello world 1");
      }
    }
  }

  // setInterval(,5000);

  useEffect(() => {
    console.warn(user?.email);
    updateMetaData();
    fetchUserProfilePicture();
  },[user])
  if (isLoading) return <FullScreenLoader text='Please wait a moment...' />
  return (
    // <FetchMetaDataContext.Provider value={metaDataFun}>
      <MetaDataContext.Provider value={metaData}>
        <ThemeProvider theme={THEME}>
          <Router>
            <div className="App">
              <Header picture={picture}/>
              <Routes>
                <Route path="/" element={<MainPage picture={picture} updateMetaData={updateMetaData}/>} />
                <Route path="/edit" element={<EditProfile picture={picture} updateMetaData={updateMetaData}/>}/>
                <Route path="/projects" element={<ProjectPage/>}/>
              </Routes>
            </div>
          </Router>
        </ThemeProvider>
      </MetaDataContext.Provider>
    // {/* </FetchMetaDataContext.Provider> */}
  );
}

export default App;
