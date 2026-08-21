import { ORDER_STATUS_STEPS } from '../utils/constants'

const OrderTimeline = ({ currentStatus }) => {
  const getCurrentStepIndex = () => {
    return ORDER_STATUS_STEPS.findIndex(step => step.key === currentStatus)
  }

  const currentIndex = getCurrentStepIndex()

  return (
    <div className="flex justify-between items-center">
      {ORDER_STATUS_STEPS.map((step, index) => (
        <div key={step.key} className="flex flex-col items-center flex-1">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-xl mb-2 transition-all ${
              index <= currentIndex
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            {step.icon}
          </div>
          <p className="text-xs md:text-sm font-semibold text-center">{step.label}</p>
          {index < ORDER_STATUS_STEPS.length - 1 && (
            <div
              className={`absolute w-24 h-1 top-6 ml-16 transition-all ${
                index < currentIndex ? 'bg-primary' : 'bg-gray-200'
              }`}
            ></div>
          )}
        </div>
      ))}
    </div>
  )
}

export default OrderTimeline
