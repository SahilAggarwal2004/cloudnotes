import { useToggleContext } from '../context/ToggleState'

export default function Loadbar() {
    const { loadbar } = useToggleContext()
    const [w, visibility] = loadbar

    return (
        <div className={`${visibility ? '' : 'opacity-0'}`}>
            <div className={`${w === 0 ? 'w-0' : w === 1 / 3 ? 'w-1/3' : 'w-full'} bg-red-600 transition-all duration-300 ease-in h-[0.15rem]`} />
        </div>
    )
}
