"use client";
import { createContext, ReactNode, useContext, useState } from "react";

interface ILoadingContext {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

interface ILoadingProviderProps {
  children: ReactNode;
}

export const LoadingContext = createContext({} as ILoadingContext);

export const LoadingProvider = ({ children }: ILoadingProviderProps) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
