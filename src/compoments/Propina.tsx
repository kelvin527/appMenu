import type { Dispatch,SetStateAction } from "react"
const tipOptions = [
  {
    id: 'tip-10',
    value: .10,
    label: '10%'
  },
  {
    id: 'tip-20',
    value: .20,
    label: '20%'
  },
  {
    id: 'tip-50',
    value: .50,
    label: '50%'
  },
]
interface PropinaProps {
    setTip: Dispatch<SetStateAction<number>>
}

export default function Propina({setTip}: PropinaProps) {
    
  return (
    <div className="flex flex-col">
        <h2 className="text-2xl font-bold mb-4">Propina</h2>
        <div className="flex flex-col space-y-3">
            {tipOptions.map((tip) => (
              <label key={tip.id} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="tip"
                  value={tip.value}
                  className="border border-gray-300 rounded"
                    onChange={e => setTip(+e.target.value)}
                />
                <span className="font-semibold">{tip.label}</span>
              </label>
            ))}
        </div>
    </div>
  )
}
