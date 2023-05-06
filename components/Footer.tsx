import Image from 'next/image'

export default function Footer() {
    return (
        <div className="flex flex-row absolute mx-auto left-0 right-0 w-[250px] bottom-0 gap-x-8">
            <Image src="/images/cc.logo.svg" alt="creative-commons" width={100} height={5} />
            <div>
                Loggit {new Date().getFullYear()}
            </div>
        </div>
    )
}