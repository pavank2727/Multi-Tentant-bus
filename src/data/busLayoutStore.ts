export type LayoutSeatType = "seater" | "lower" | "upper"
export type BusSide = "left" | "right"
export type DoorPos = "none" | "front-left" | "front-right" | "mid-left" | "mid-right" | "rear-left" | "rear-right"

export interface DesignedSeat {
  id: string
  label: string
  type: LayoutSeatType
  row: number
  col: number
  side: BusSide
}

export interface BusLayout {
  busMode: "seater" | "sleeper"
  rows: number
  leftCols: number
  rightCols: number
  driverSide: BusSide
  entryPos: DoorPos
  exitPos: DoorPos
  seats: DesignedSeat[]
}

let _layout: BusLayout | null = null

export const saveLayout = (l: BusLayout) => {
  _layout = l
}
export const getLayout = (): BusLayout | null => _layout
