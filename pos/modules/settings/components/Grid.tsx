"use client"

import { configAtom } from "@/store/config.store"
import { useAtomValue } from "jotai"

import DeleteOrders from "../DeleteOrders"
import SendData from "../SendData"
import SyncConfig from "../SyncConfig"
import SyncOrders from "../SyncOrders"
import ErxesLink from "./ErxesLink"

const Grid = () => {
  const { branchId, departmentId, ebarimtConfig } =
    useAtomValue(configAtom) || {}

  return (
    <>
      <div className="my-5 grid w-full grid-cols-3 gap-x-2 gap-y-3">
        <SyncConfig configType="config">Resync Config</SyncConfig>
        <SyncConfig configType="products">Resync Products</SyncConfig>
        <SyncConfig configType="slots">Resync slots</SyncConfig>
        <SyncOrders />
        <DeleteOrders />

        {!!ebarimtConfig && <SendData />}
        {!!branchId && !!departmentId && (
          <>
            <ErxesLink
              href={`/inventories/safe-remainders?branchId=${branchId}&departmentId=${departmentId}`}
            >
              Safe Remainder
            </ErxesLink>
            <ErxesLink
              href={`/inventories/remainders?branchId=${branchId}&departmentId=${departmentId}`}
            >
              Live Remainder
            </ErxesLink>
            <ErxesLink
              href={`/processes/performanceList?inBranchId=${branchId}&inDepartmentId=${departmentId}&outBranchId=${branchId}&outDepartmentId=${departmentId}`}
            >
              Performances
            </ErxesLink>
          </>
        )}
      </div>
    </>
  )
}

export default Grid
