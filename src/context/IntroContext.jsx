import { createContext, useContext } from 'react';

const IntroContext = createContext(true);

export function IntroProvider({ ready, children }) {
  return <IntroContext.Provider value={ready}>{children}</IntroContext.Provider>;
}

export function useIntro() {
  return useContext(IntroContext);
}
