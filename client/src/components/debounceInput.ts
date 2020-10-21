import { useState, useCallback } from 'react'
import debounce from 'lodash.debounce'

interface DebouncedInputProps {
  value: string
  onChange: (value: string) => void
  delay: number
  renderProps: (props: object) => JSX.Element
}

const useDebounce = (callback: any, delay: number) => {
  const debouncedFn = useCallback(
    debounce((...args) => callback(...args), delay),
    [delay] // will recreate if delay changes
  )
  return debouncedFn
}

function DebouncedInput(props: DebouncedInputProps) {
  const [value, setValue] = useState(props.value)
  const debouncedSave = useDebounce(
    (nextValue: string) => props.onChange(nextValue),
    props.delay
  )

  const handleChange = (event: any) => {
    const { value: nextValue } = event.target
    setValue(nextValue)
    debouncedSave(nextValue)
  }

  return props.renderProps({ onChange: handleChange, value })
}

export default DebouncedInput
