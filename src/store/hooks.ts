import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";

import { AppDispatch, RootState } from "./store.ts";

type DispatchFunction = () => AppDispatch;

export const useDispatchFunction: DispatchFunction = useDispatch;
export const useSelectorFunction: TypedUseSelectorHook<RootState> = useSelector;
