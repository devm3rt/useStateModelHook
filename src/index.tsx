import {Dispatch, SetStateAction, useRef, useState} from 'react';

type StateUpdateListener<T> = (value: T) => any;
export interface useStateModelResult<T> {
  value: T;
  setValue: Dispatch<SetStateAction<T>>;
  updateValue: Dispatch<SetStateAction<Partial<T>>>; //(value: Partial<T>) => any;
}

export function useStateModel<T>(
  initialState: T,
  listeners: Array<StateUpdateListener<T>> = [],
): useStateModelResult<T> {
  const [_value, setValue] = useState<T>(initialState);

  const updateValue = (value: SetStateAction<Partial<T>>) => {
    if (typeof value == 'function') {
      (value as Function)(_value);
      listeners.forEach(v => v(_value));
    } else {
      if (value) {
        const newState = {...(_value as any), ...(value as any)};
        setValue(newState);
        listeners.forEach(v => v(newState));
      }
    }
  };

  const result = {
    value: _value,
    setValue,
    updateValue,
  };
  const ref = useRef<useStateModelResult<T>>(result);

  Object.assign(ref.current, result);
  return ref.current;
}
