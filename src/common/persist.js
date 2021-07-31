import { recoilPersist } from 'recoil-persist'

export const { persistAtom } = recoilPersist({
    key: "sentiment-storage",
    storage: sessionStorage
})