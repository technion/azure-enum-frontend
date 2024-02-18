import { useState } from 'react'
import { useForm, SubmitHandler } from "react-hook-form"
import {
  useQuery
} from '@tanstack/react-query';
import hackingInProgress from './assets/hacking in progress.gif';

type FormValues = {
  domainname: string
}


function App() {
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
    <div className="flex flex-col items-center">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <label htmlFor="domain" className="block text-sm font-medium text-gray-700">Domain to Lookup</label>
      <input type="text" id="domain"  {...register("domainname", { pattern: /^[0-9a-z-.]{5,64}$/, required: true })} placeholder='lolware.net'
                        className="w-full rounded-md py-2.5 px-4 border text-sm outline-[#007bff]" />
      <input type="submit" value="Post" className="text-white bg-[#007bff] hover:bg-blue-600 font-semibold rounded-md text-sm px-4 py-2.5 w-full" />
      </form>
      {errors.domainname && <InputInvalid /> }
      {domainName && <EnumerateOutput lookup={JSON.stringify(domainName)}></EnumerateOutput>}
      </div>
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
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return await response.json();
    }
  });

  if(error) {
    return (
      <div className="my-10 relative block rounded-lg bg-pink-500 p-4 text-base leading-5 text-white">
      Backend lookup failed. This may mean the domain is not registered with Microsoft, or that the query was considered invalid.
    </div>
    )
  }

  if(isFetching) {
    return (<div className="my-10 relative block rounded-lg bg-green-200 p-4 text-base leading-5 text-white">
      Querying Backend...
      </div>)
  }

  return (
    <DomainList data={data.output} />
  )
}

const InputInvalid = () => {
  return (
    <>
    <div className="my-10 relative block rounded-lg bg-pink-500 p-4 text-base leading-5 text-white">
      Invalid Input - Query Rejected
    </div>
    <img src={hackingInProgress} alt="Hacking in progress" />
    </>
  )
}

const DomainList = ({data}: {data: string}) => {

  const d = new DOMParser();
  const r = d.parseFromString(data, 'application/xml');
  const domainlist = r.documentElement.querySelectorAll("Domain")
  const listmap: string = [...domainlist].map(e => e.innerHTML).join(' ');

  return (
    <>{listmap}</>
  )


}