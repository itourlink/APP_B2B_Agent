// import { create } from "zustand";

// interface CountState {
//   counts: Record<string, number>;
//   setCount: (key: string, value: number) => void;
// }

// export const useCountStore = create<CountState>((set) => ({
//   counts: {},
//   setCount: (key, value) =>
//     set((state) => ({
//       counts: {
//         ...state.counts,
//         [key]: value,
//       },
//     })),
// }));
