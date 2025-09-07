import toast from 'react-hot-toast'

export function notifySuccess(message, options) {
  return toast.success(message, options)
}

export function notifyError(message, options) {
  return toast.error(message, options)
}

export function notify(message, options) {
  return toast(message, options)
}

