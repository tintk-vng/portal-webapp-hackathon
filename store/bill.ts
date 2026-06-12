import { Supplier } from '@/types/bill'
import { EducationBillInfo } from '@/types/bill/education'
import { create } from 'zustand'

type ElectricStore = {
  billInfo: any
  updateBillInfo: (billInfo: any) => void
}

export const useElectricStore = create<ElectricStore>((set) => ({
  billInfo: {},
  updateBillInfo: (billInfo) => set(() => ({ billInfo })),
}))

type ApartmentStore = {
  supplier: Supplier
  billInfo: any
  updateBillInfo: (billInfo: any) => void
  updateSupplier: (supplier: Supplier) => void
}

export const useApartmentStore = create<ApartmentStore>((set) => ({
  supplier: {} as Supplier,
  billInfo: {},
  updateBillInfo: (billInfo) => set(() => ({ billInfo })),
  updateSupplier: (supplier) => set(() => ({ supplier })),
}))

type WaterStore = {
  supplier: Supplier
  billInfo: any
  updateBillInfo: (billInfo: any) => void
  updateSupplier: (supplier: Supplier) => void
}

export const useWaterStore = create<WaterStore>((set) => ({
  supplier: {} as Supplier,
  billInfo: {},
  updateBillInfo: (billInfo) => set(() => ({ billInfo })),
  updateSupplier: (supplier) => set(() => ({ supplier })),
}))

type EducationStore = {
  supplier: Supplier
  billInfo: EducationBillInfo
  updateBillInfo: (billInfo: any) => void
  updateSupplier: (supplier: Supplier) => void
}

export const useEducationStore = create<EducationStore>((set) => ({
  supplier: {} as Supplier,
  billInfo: {} as EducationBillInfo,
  updateBillInfo: (billInfo) => set(() => ({ billInfo })),
  updateSupplier: (supplier) => set(() => ({ supplier })),
}))

type ConsumerFinanceStore = {
  supplier: Supplier
  billInfo: any
  contracts: any
  updateBillInfo: (billInfo: any) => void
  updateSupplier: (supplier: Supplier) => void
  updateContracts: (contracts: any) => void
}

export const useConsumerFinanceStore = create<ConsumerFinanceStore>((set) => ({
  supplier: {} as Supplier,
  billInfo: {},
  contracts: [],
  updateBillInfo: (billInfo) => set(() => ({ billInfo })),
  updateSupplier: (supplier) => set(() => ({ supplier })),
  updateContracts: (contracts) => set(() => ({ contracts })),
}))

type TelevisionStore = {
  supplier: Supplier
  billInfo: any
  updateBillInfo: (billInfo: any) => void
  updateSupplier: (supplier: Supplier) => void
}

export const useTelevisionStore = create<TelevisionStore>((set) => ({
  supplier: {} as Supplier,
  billInfo: {},
  updateBillInfo: (billInfo) => set(() => ({ billInfo })),
  updateSupplier: (supplier) => set(() => ({ supplier })),
}))

type InternetStore = {
  supplier: Supplier
  billInfo: any
  updateBillInfo: (billInfo: any) => void
  updateSupplier: (supplier: Supplier) => void
}

export const useInternetStore = create<InternetStore>((set) => ({
  supplier: {} as Supplier,
  billInfo: {},
  updateBillInfo: (billInfo) => set(() => ({ billInfo })),
  updateSupplier: (supplier) => set(() => ({ supplier })),
}))
