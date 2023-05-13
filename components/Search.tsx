import { useState } from "react";
import { useRouter } from 'next/router';
import styled from 'styled-components'


const Input = styled.input`
  font-size: 2rem;
  color: white;
  width: 500px;
  border: none;
  border-radius: 40px;
  text-align: center;
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  background-color: #323050;

   @media (max-width: 768px) {
    font-size: 1.2rem;
    width: 300px;
  }

  :focus {
    outline: none;
}
`

export default function Search() {
    const [search, setSearch] = useState('');
    const router = useRouter();

    const { query } = router;


    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();

        if (query.date) {
            router.push(`/search?date=${query.date}&query=${search}`)
        }

        router.push(`/search?query=${search}`);
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex flex-row items-center">
                <Input type="text" id="query" name="query" value={search} onChange={e => setSearch(e.target.value)} placeholder="e.g. Macaroni and cheese" autoComplete="off" />
                <button onClick={handleSubmit} disabled={!search}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="white" className="w-4 h-4 xl:w-6 xl:h-6 relative right-8 xl:right-12 cursor-pointer">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                </button>
            </div>
        </form>
    )

}