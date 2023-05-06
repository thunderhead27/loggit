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

  :focus {
    outline: none;
}
`

export default function Search() {
    const [query, setQuery] = useState('');
    const router = useRouter();

    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();

        router.push(`/search?query=${query}`);
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex flex-row items-center"><Input type="text" id="query" name="query" value={query} onChange={e => setQuery(e.target.value)} placeholder="e.g. Macaroni and cheese" autoComplete="off" />
                <button onClick={handleSubmit} disabled={!query}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="white" className="w-6 h-6 relative right-12 cursor-pointer">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                </button>
            </div>
        </form>
    )

}