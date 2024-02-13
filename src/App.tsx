import { useState } from 'react'
import { useForm, SubmitHandler } from "react-hook-form"
import {
  useQuery
} from '@tanstack/react-query';

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

type FormValues = {
  domainname: string
}


function App() {
  const [count, setCount] = useState(0);
  const [domainName, setDomainName] = useState<undefined | FormValues>(undefined);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();


  const onSubmit: SubmitHandler<FormValues> = (data) => {
    setDomainName(data);
  }

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
      <input type="text"  {...register("domainname", { pattern: /^[0-9a-z-.]{5,64}$/ })} />
      <input type="submit" value="Post" />
      </form>
      {errors.domainname && <p role="alert"> BIG ERROR</p>}
      {domainName && <EnumerateOutput lookup={JSON.stringify(domainName)}></EnumerateOutput>}
    </>
  )
}

export default App

const EnumerateOutput = ({lookup}: {lookup: string}) => {

  const { data, error, isFetching } = useQuery({
    queryKey: ['domainName', lookup],
    queryFn: async () => {
      const response = await fetch('https://azure-enum-api.lolware.net/', {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: lookup
      });
      return await response.json();
    }
  });

  if(error) {
    return (<>BIG SWEATY FETCH ERROR {error}</>)
  }

  if(isFetching) {
    return (<>CURRENTLY FETCHING</>)
  }

  return (
    <>{JSON.stringify(data)}</>
  )
}
 